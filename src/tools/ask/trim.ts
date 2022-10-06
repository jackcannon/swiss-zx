import { chalk } from 'zx';
import { getDeferred, hours, ms, ObjectUtils, seconds, symbols } from 'swiss-ak';
import stringWidth from 'string-width';

import { table } from '../table';
import { out } from '../out';
import { getKeyListener } from '../../utils/keyListener';
import { getLineCounter } from '../out/lineCounter';

const toTimeCode = (frame: number, frameRate: number = 60, includeHours: boolean = false, includeMinutes: boolean = true) => {
  const frLength = stringWidth(frameRate + '');
  const toSecs: ms = seconds(Math.floor(frame / frameRate));
  const remaining = frame % frameRate;

  let cut = includeHours ? 11 : 14;
  if (!includeMinutes) cut = 17;
  const time = new Date(toSecs).toISOString().slice(cut, 19);

  return `${time}.${(remaining + '').padStart(frLength, '0')}`;
};

export interface Handles<T = any> {
  start: T;
  end: T;
}
const getNextHandle = (tool: string): string => {
  const all: string[] = ['start', 'end'];
  return all[(all.indexOf(tool) + 1) % all.length];
};

export interface AskTrimOptions {
  speed: number;
  fastSpeed: number;
  showInstructions: boolean;

  charTrack: string;
  charHandle: string;
  charActiveHandle: string;
  charBar: string;
  charHandleBase: string;
  charActiveHandleBase: string;

  clrTrack: Function;
  clrHandle: Function;
  clrActiveHandle: Function;
  clrBar: Function;
  clrHandleBase: Function;
  clrActiveHandleBase: Function;
}

const getFullOptions = (opts: Partial<AskTrimOptions>): AskTrimOptions => ({
  speed: 1,
  fastSpeed: 5,
  showInstructions: true,

  charTrack: ' ',
  charHandle: '┃',
  charBar: '█',

  clrTrack: chalk.bgGray,
  clrHandle: chalk.whiteBright,
  clrBar: chalk.white,

  ...opts,

  charActiveHandle: opts.charActiveHandle ?? opts.charHandle ?? '┃',
  charHandleBase: opts.charHandleBase ?? opts.charHandle ?? '█',
  charActiveHandleBase: opts.charActiveHandleBase ?? opts.charHandleBase ?? opts.charActiveHandle ?? opts.charHandle ?? '█',

  clrActiveHandle: opts.clrActiveHandle ?? opts.clrHandle ?? chalk.yellowBright.bold,
  clrHandleBase: opts.clrHandleBase ?? opts.clrHandle ?? chalk.whiteBright,
  clrActiveHandleBase: opts.clrActiveHandleBase ?? opts.clrHandleBase ?? opts.clrActiveHandle ?? opts.clrHandle ?? chalk.yellowBright.bold
});

const getChars = (opts: AskTrimOptions) => ({
  track: opts.charTrack,
  handle: opts.charHandle,
  bar: opts.charBar,
  activeHandle: opts.charActiveHandle,
  handleBase: opts.charHandleBase,
  activeHandleBase: opts.charActiveHandleBase
});
const getColors = (opts: AskTrimOptions) => ({
  track: opts.clrTrack,
  handle: opts.clrHandle,
  bar: opts.clrBar,
  activeHandle: opts.clrActiveHandle,
  handleBase: opts.clrHandleBase,
  activeHandleBase: opts.clrActiveHandleBase
});

export const askTrim = async (totalFrames: number, frameRate: number, options: Partial<AskTrimOptions> = {}): Promise<Handles<number>> => {
  const opts = getFullOptions(options);
  const lc = getLineCounter();

  const deferred = getDeferred<Handles<number>>();

  const totalLength: ms = seconds(Math.floor(totalFrames / frameRate));
  const showHours = totalLength > hours(1);

  let activeHandle: string = 'start';

  const handles: Handles<number> = {
    start: 0,
    end: totalFrames - 1
  };

  let displayCount = -1;
  const display = () => {
    displayCount++;
    lc.clear();
    const width = out.utils.getTerminalWidth();
    const totalSpace = width - 2;
    const handlePositions: Handles<number> = ObjectUtils.mapValues(handles, (_k, value: number) =>
      Math.floor((value / (totalFrames - 1)) * totalSpace)
    );

    const befSpace = Math.max(0, handlePositions.start);
    const barSpace = Math.max(0, handlePositions.end - handlePositions.start);
    const aftSpace = Math.max(0, totalSpace - handlePositions.end);

    const char = getChars(opts);
    const cols = getColors(opts);

    const actvHand = cols.activeHandle(char.activeHandle);
    const inactvHand = cols.handle(char.handle);
    const handStart = activeHandle == 'start' ? actvHand : inactvHand;
    const handEnd = activeHandle == 'end' ? actvHand : inactvHand;

    const drawHandleLabels = () => {
      const handleLabelsRaw: Handles<string[]> = ObjectUtils.mapValues(handles, (_k, value: number) => [
        // ` ${value} `,
        ` ${toTimeCode(value, frameRate, showHours)} `,
        ''
      ]);
      const handleLabelWidths: Handles<number> = ObjectUtils.mapValues(handleLabelsRaw, (_k, value: string[]) =>
        Math.max(...value.map((s) => stringWidth(s)))
      );
      const handleAligns: Handles<string> = {
        start: handleLabelWidths.start > befSpace ? 'left' : 'right',
        end: handleLabelWidths.end > aftSpace ? 'right' : 'left'
      };
      const handleLabels: Handles<string[]> = ObjectUtils.mapValues(handleLabelsRaw, (key, value: string[]) =>
        value.map((l) => out.align(l, handleAligns[key], handleLabelWidths[key], ' ', true))
      );

      const strtBef = handleAligns.start === 'right';
      const endBef = handleAligns.end === 'right';

      const potentialMaxLabelSpace = handlePositions.end - handlePositions.start;
      if (!strtBef && potentialMaxLabelSpace < handleLabelWidths.start) {
        handleLabels.start = handleLabels.start.map((s) => s.slice(0, Math.max(0, potentialMaxLabelSpace - 1)));
        handleLabelWidths.start = Math.max(...handleLabels.start.map((s) => stringWidth(s)));
      }
      if (endBef && potentialMaxLabelSpace < handleLabelWidths.end) {
        handleLabels.end = handleLabels.end.map((s) => s.slice(s.length - Math.max(0, potentialMaxLabelSpace - 1)));
        handleLabelWidths.end = Math.max(...handleLabels.end.map((s) => stringWidth(s)));
      }

      const befLabelSpace = Math.max(0, befSpace - (strtBef ? handleLabelWidths.start : 0));
      const barLabelSpace = Math.max(0, barSpace - (!strtBef ? handleLabelWidths.start : 0) - (endBef ? handleLabelWidths.end : 0));
      const aftLabelSpace = Math.max(0, aftSpace - (!endBef ? handleLabelWidths.end : 0));

      const bef = ' '.repeat(befLabelSpace);
      const bar = ' '.repeat(barLabelSpace);
      const aft = ' '.repeat(aftLabelSpace);

      lc.log(
        `${bef}${strtBef ? handleLabels.start[0] : ''}${handStart}${!strtBef ? handleLabels.start[0] : ''}${bar}${
          endBef ? handleLabels.end[0] : ''
        }${handEnd}${!endBef ? handleLabels.end[0] : ''}${aft}`
      );
      lc.log(
        `${bef}${strtBef ? handleLabels.start[1] : ''}${handStart}${!strtBef ? handleLabels.start[1] : ''}${bar}${
          endBef ? handleLabels.end[1] : ''
        }${handEnd}${!endBef ? handleLabels.end[1] : ''}${aft}`
      );
    };

    const drawBottomLabels = () => {
      const startVideoLabel = `[${toTimeCode(0, frameRate, showHours)}]`;
      const endVideoLabel = `[${toTimeCode(totalFrames - 1, frameRate, showHours)}]`;
      const trimmedVideoLabel = toTimeCode(handles.end - handles.start, frameRate, showHours);

      const availSpace = width - (stringWidth(startVideoLabel) + stringWidth(endVideoLabel) + stringWidth(trimmedVideoLabel));
      const centerPosition = handlePositions.start + Math.floor((handlePositions.end - handlePositions.start) / 2);
      const centerInSpace = centerPosition - stringWidth(startVideoLabel) - Math.floor(stringWidth(trimmedVideoLabel) / 2) + 1;

      const bef = ' '.repeat(Math.max(0, Math.min(availSpace, centerInSpace)));
      const aft = ' '.repeat(Math.max(0, Math.min(availSpace, availSpace - centerInSpace)));

      lc.log(`${startVideoLabel}${bef}${trimmedVideoLabel}${aft}${endVideoLabel}`);
    };

    const drawBar = () => {
      const actvHand = cols.activeHandleBase(char.activeHandleBase);
      const inactvHand = cols.handleBase(char.handleBase);

      const handStart = activeHandle == 'start' ? actvHand : inactvHand;
      const handEnd = activeHandle == 'end' ? actvHand : inactvHand;

      const bef = cols.track(char.track.repeat(befSpace));
      const bar = cols.bar(char.bar.repeat(barSpace));
      const aft = cols.track(char.track.repeat(aftSpace));
      lc.log(`${bef}${handStart}${bar}${handEnd}${aft}`);
    };

    const drawInstructions = () => {
      if (opts.showInstructions && displayCount < 5) {
        // expensive, so only show at the beginning
        const body = [
          [
            chalk.gray.dim(`[${symbols.TRI_LFT}/${symbols.TRI_RGT}] move ${opts.speed} frame${opts.speed > 1 ? 's' : ''}`),
            chalk.gray.dim(`[${symbols.TRI_UPP}/${symbols.TRI_DWN}] move ${opts.fastSpeed} frame${opts.fastSpeed > 1 ? 's' : ''}`),
            chalk.gray.dim(`[TAB] switch handle`),
            chalk.gray.dim(`[ENTER] submit`)
          ]
        ];

        lc.add(table.print(body, undefined, { drawOuter: false, drawRowLines: false, drawColLines: false, colWidths: [100], alignCols: ['center'] }));
      } else {
        lc.log();
      }
    };

    drawHandleLabels();
    drawBar();
    drawBottomLabels();
    drawInstructions();
  };

  const swapHandle = () => (activeHandle = getNextHandle(activeHandle));
  const adjustHandle = (amount: number) => {
    handles[activeHandle] += amount;
    if (handles[activeHandle] < 0) handles[activeHandle] = 0;
    if (handles[activeHandle] > totalFrames - 1) handles[activeHandle] = totalFrames - 1;
    if (handles.end <= handles.start) {
      const oldStart = handles.start;
      const oldEnd = handles.end;
      handles.end = oldStart;
      handles.start = oldEnd;
      swapHandle();
    }
  };

  const submit = () => {
    kl.stop();
    lc.clear();
    const fixedHandles: Handles<number> = { start: handles.start, end: handles.end - 1 };
    deferred.resolve(fixedHandles);
  };

  const updateHandles = (keyName: string) => {
    switch (keyName) {
      case 'return':
        return submit();
      case 'tab':
        swapHandle();
        break;
      case 'left':
        adjustHandle(-opts.speed);
        break;
      case 'right':
        adjustHandle(opts.speed);
        break;
      case 'up':
        adjustHandle(opts.fastSpeed);
        break;
      case 'down':
        adjustHandle(-opts.fastSpeed);
        break;
    }

    display();
  };
  const kl = getKeyListener(updateHandles, true);

  display();

  return deferred.promise;
};
