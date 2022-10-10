import * as fs from 'fs';
import * as fsP from 'fs/promises';

import stringWidth from 'string-width';

import {
  ArrayUtils,
  fn,
  getDeferred,
  milliseconds,
  ms,
  ObjOfType,
  PromiseUtils,
  seconds,
  sortNumberedText,
  symbols,
  TimeUtils,
  tryOr,
  wait
} from 'swiss-ak';

import { $$ } from '../$$';
import { ask } from '../ask';
import { out } from '../out';
import { Breadcrumb } from '../out/breadcrumb';
import { chlk } from '../clr';
import { explodePath } from '../PathUtils';
import { getKeyListener } from '../../utils/keyListener';
import { getLineCounter } from '../out/lineCounter';
import { table, TableFormatConfig } from '../table';
import { getProbe, ProbeResult } from '../ffmpeg';

interface PathContents {
  dirs: string[];
  files: string[];
  info?: {
    stat: fs.Stats;
    probe: ProbeResult;
  };
}

const fsCache = new Map<string, PathContents>();

const getPathContents = (path: string): PathContents => fsCache.get(path);
const loadPathContents = async (path: string): Promise<PathContents> => {
  if (fsCache.has(path)) {
    return fsCache.get(path);
  }
  return forceLoadPathContents(path);
};

const forceLoadPathContents = async (path: string): Promise<PathContents> => {
  let contents: PathContents = { dirs: [], files: [] };
  try {
    const pathType = await getPathType(path);

    if (pathType === 'd') {
      const lists = await Promise.all([$$.findDirs(path), $$.findFiles(path)]);

      const [dirs, files] = lists.map((list) => sortNumberedText(list)).map((list) => list.map((item) => item.replace(/\r|\n/g, ' ')));

      contents = { ...contents, dirs, files };
    }
    if (pathType === 'f') {
      const [stat, probe] = await Promise.all([tryOr(undefined, () => fsP.stat(path)), tryOr(undefined, () => getProbe(path))]);
      contents = { ...contents, info: { stat, probe } };
    }
  } catch (err) {
    // ignore
  }

  fsCache.set(path, contents);

  return contents;
};

const getPathType = async (path: string): Promise<'d' | 'f'> => {
  const [isDir, isFile] = await Promise.all([$$.isDirExist(path), $$.isFileExist(path)]);
  return isDir ? 'd' : isFile ? 'f' : undefined;
};

const join = (...items: string[]) => {
  const result = items.join('/');
  return $$.utils.removeDoubleSlashes(result || '/');
};

const keyActionDict: ObjOfType<{ keys: string; label: string }> = {
  move: {
    keys: '↑ ↓ ← →',
    label: 'Navigate'
  },
  r: {
    keys: 'R',
    label: `Refresh`
  },
  f: {
    keys: 'F',
    label: `New Folder`
  },
  space: {
    keys: 'space',
    label: 'Toggle selection'
  },
  return: {
    keys: '⮐ ',
    label: 'Submit'
  }
};

const getActionBar = (multi: boolean, pressed?: string, disabled: string[] = []) => {
  const keyList = {
    single: ['move', 'r', 'f', 'return'],
    multi: ['move', 'r', 'f', 'space', 'return']
  }[multi ? 'multi' : 'single'];

  const row = keyList.map((key) => {
    const { keys, label } = keyActionDict[key];
    return ` [ ${keys} ] ${label} `;
  });

  const format: TableFormatConfig[] = pressed ? [{ formatFn: chalk.bgWhite.black, col: keyList.indexOf(pressed) }] : [];
  disabled.forEach((key) => format.push({ formatFn: chalk.dim.strikethrough, col: keyList.indexOf(key) }));

  return table
    .getLines([row], undefined, { drawOuter: false, drawColLines: false, drawRowLines: false, alignCols: ['center'], colWidths: [200], format })
    .join('\n');
};

const FILE_CATEGORIES = {
  image: ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'gif', 'bmp', 'webp', 'psd', 'ai', 'cr2', 'crw', 'nef', 'pef', 'svg'],
  video: ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv', 'webm'],
  audio: ['mp3', 'aac', 'ogg', 'flac', 'alac', 'wav', 'aiff', 'dsd'],
  text: ['txt', 'rtf']
};

const getFileCategory = (ext: string) => {
  const category = Object.keys(FILE_CATEGORIES).find((key) => FILE_CATEGORIES[key].includes(ext.toLowerCase()));
  return category || '';
};

const getFileIcon = (ext: string) => {
  const category = getFileCategory(ext);
  const dispExt = ext.length % 2 === 0 ? ext : '.' + ext;

  // Images
  if (category === 'image') {
    return out.left(
      `╔══════════════╗
║  ${chalk.whiteBright('☀')}  ┌────┐${chalk.whiteBright('☀')}  ║
║ ${chalk.whiteBright('☀')}┌──┤▫▫▪▫│  ${chalk.whiteBright('☀')}║
╟──┤▫▪│▫▫▫▫├───╢
║▪▫│▫▫│▪▫▫▫│▫▪▫║
╚══╧══╧════╧═══╝`,
      16
    );
  }

  // Videos
  if (category === 'video') {
    return out.left(
      `┏┱──────────┲┓
┣┫╭────────╮┣┫
┣┫│${out.center(out.limitToLength(dispExt.toUpperCase(), 8), 8)}│┣┫
┣┫╰────────╯┣┫
┗┹──────────┺┛`,
      14
    );
  }

  // Audio
  if (category === 'audio') {
    return out.left(
      `┌──────────────┐
│   .∙¯¯¯¯∙.   │
│  /        \\  │
│ |    ()    | │
│  \\        /  │
│   '∙____∙'   │
└──────────────┘`,
      16
    );
  }

  // Other
  return out.left(
    `,╌╌╌╌╌.
╎       ⟍
╎${out.center(out.limitToLengthStart(dispExt, 8), 8)}╎
╎        ╎
╎        ╎
˸╌╌╌╌╌╌╌╌˸`,
    10
  );
};

const humanFileSize = (size: number) => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return fn.roundTo(0.01, size / Math.pow(1024, i)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const getFilePanel = (path: string, panelWidth: number, maxLines: number) => {
  const { filename, ext } = explodePath(path);

  const { stat, probe } = getPathContents(path)?.info || {};

  const result = [];

  result.push(out.center(getFileIcon(ext), panelWidth));

  const category = getFileCategory(ext);
  result.push(out.center(out.wrap(filename, panelWidth), panelWidth));
  result.push(out.center(chalk.dim(`${ext.toUpperCase()} ${category ? `${fn.capitalise(category)} ` : ''}File`), panelWidth));

  result.push(out.center(chlk.gray1('─'.repeat(Math.round(panelWidth * 0.75))), panelWidth));

  const now = Date.now();

  const addItem = (title: string, value: string, extra?: string) => {
    result.push(out.split(`${chalk.bold.dim(title)}`, `${value}${extra ? chalk.dim(` (${chalk.dim(extra)})`) : ''}`, panelWidth));
  };
  const addTimeItem = (title: string, time: ms, append?: string) => {
    addItem(title, `${TimeUtils.toReadableDuration(now - time, false, 2)}${append || ''}`);
  };

  if (stat) {
    addItem(`Size`, `${humanFileSize(stat.size)}`);
    addTimeItem(`Modified`, stat.mtimeMs, ' ago');
    addTimeItem(`Created`, stat.ctimeMs, ' ago');
  }
  if (probe) {
    if (['image', 'video'].includes(category)) addItem(`Dimensions`, `${probe.width}×${probe.height}`);
    if (['video', 'audio'].includes(category)) addItem(`Duration`, TimeUtils.toReadableDuration(seconds(probe.duration), false, 2));
    if (['video'].includes(category)) addItem(`FPS`, `${probe.framerate}`);
  }

  const resultStr = out.left(out.wrap(result.join('\n'), panelWidth), panelWidth);
  return chalk.white(out.utils.joinLines(out.utils.getLines(resultStr).slice(0, maxLines)));
};

const fileExplorerHandler = async (
  isMulti: boolean = false,
  isSave: boolean = false,
  question: string | Breadcrumb,
  selectType: 'd' | 'f' = 'f',
  startPath: string = process.cwd(),
  suggestedFileName: string = ''
): Promise<string[]> => {
  // options
  const primaryWrapFn = chalk.yellowBright;
  const cursorWrapFn = chalk.bgYellow.black;
  const ancestralCursorWrapFn = chalk.bgGray.black;

  const selectedIconWrapFn = chalk.greenBright;
  const selectedWrapFn = chalk.greenBright;
  const cursorOnSelectedWrapFn = chalk.bgGreenBright.black;

  const minWidth = 25;
  const maxWidth = 25;
  const maxItems = 15;
  const maxColumns = Math.floor(out.utils.getTerminalWidth() / (maxWidth + 1));

  // pre-calced values
  const accepted: ('d' | 'f')[] = isSave ? ['d', 'f'] : [selectType];

  // objects
  const lc = getLineCounter();
  const deferred = getDeferred<string[]>();

  // set by user actions
  let cursor = startPath.split('/');
  const multiSelected: Set<string> = new Set<string>();

  // set by recalc()
  let paths: string[] = [];
  let currentPath: string = '';
  // let isFile: boolean = false;
  let cursorType: 'd' | 'f' = 'd';

  let pressed: string = undefined;
  let submitted: boolean = false;
  let loading: boolean = false;

  const recalc = () => {
    if (submitted) return;
    paths = cursor.map((f, index, all) => join(...all.slice(0, index + 1)));

    currentPath = paths[paths.length - 1];

    const isDir = getPathContents(paths[paths.length - 2])?.dirs.includes(explodePath(currentPath).filename) || false;
    cursorType = isDir ? 'd' : 'f';
  };

  const loadEssentials = async (executeFn: (path: string) => Promise<PathContents> = loadPathContents) => {
    await Promise.all([
      PromiseUtils.each(paths, executeFn),
      (async () => {
        // current dir
        const { dirs } = await executeFn(currentPath);
        const list = dirs;
        return PromiseUtils.each(
          list.map((dir) => join(currentPath, dir)),
          executeFn
        );
      })(),
      (async () => {
        // parent dir
        const parent = explodePath(currentPath).dir;
        const { dirs } = await executeFn(parent);
        const list = [...dirs];
        return PromiseUtils.each(
          list.map((dir) => join(parent, dir)),
          executeFn
        );
      })()
    ]);
  };

  const loadNewDepth = async () => {
    display();
    await loadEssentials(loadPathContents);
    display();
  };

  const loadNewItem = async () => {
    display();
    if (!getPathContents(currentPath)) {
      await loadPathContents(currentPath);
      display();
    }
  };

  const setPressed = async (key: string) => {
    pressed = key;
    display();
    if (!key) return;
    await wait(milliseconds(100));
    if (!loading) {
      pressed = undefined;
      display();
    }
  };

  const display = async () => {
    if (submitted) return;
    recalc();

    type Formatter = (
      width: number,
      highlighted: string,
      isActiveColumn: boolean,
      columnPath: string
    ) => (name: string, index?: number, all?: string[]) => any;

    const formatter =
      (symbol: string, regularWrapFn: Function, selectedPrefix: string = ' ', unselectedPrefix: string = ' '): Formatter =>
      (width: number, highlighted: string, isActiveColumn: boolean, columnPath: string) =>
      (name: string, index?: number, all?: string[]) => {
        const isHighlighted = name === highlighted;
        const fullPath = join(columnPath, name);
        const isSelected = isMulti && multiSelected.has(fullPath);
        const prefix = isSelected ? selectedPrefix : unselectedPrefix;
        const template = (text) => `${prefix}${text} ${symbol} `;
        const extraChars = stringWidth(template(''));
        const stretched = template(out.left(out.truncate(name, width - extraChars, '…'), width - extraChars));

        let wrapFn: Function = fn.noact;
        if (isHighlighted) {
          if (isActiveColumn) {
            wrapFn = isSelected ? cursorOnSelectedWrapFn : cursorWrapFn;
          } else {
            wrapFn = ancestralCursorWrapFn;
          }
        } else {
          wrapFn = isSelected ? selectedWrapFn : regularWrapFn;
        }

        return wrapFn(chlk.clear(stretched));
      };

    const { dir: formatDir, file: formatFile } = {
      single: {
        d: {
          dir: formatter('›', chlk.gray5),
          file: formatter(' ', chalk.dim)
        },
        f: {
          dir: formatter('›', chlk.gray3),
          file: formatter(' ', chlk.gray5)
        },
        df: {
          dir: formatter('›', chlk.gray5),
          file: formatter(' ', chlk.gray5)
        }
      },
      multi: {
        d: {
          dir: formatter('›', chlk.gray5, ` ${selectedIconWrapFn(symbols.RADIO_FULL)} `, ` ${symbols.RADIO_EMPTY} `),
          file: formatter(' ', chalk.dim, '   ', '   ')
        },
        f: {
          dir: formatter('›', chlk.gray3, '   ', '   '),
          file: formatter(' ', chlk.gray5, ` ${selectedIconWrapFn(symbols.RADIO_FULL)} `, ` ${symbols.RADIO_EMPTY} `)
        },
        df: {
          // shouldn't happen, but here anyway
          dir: formatter('›', chlk.gray5, '   ', '   '),
          file: formatter(' ', chlk.gray5, ` ${selectedIconWrapFn(symbols.RADIO_FULL)} `, ` ${symbols.RADIO_EMPTY} `)
        }
      }
    }[isMulti ? 'multi' : 'single'][accepted.join('')] as { dir: Formatter; file: Formatter };

    const emptyColumn = [' '.repeat(minWidth), ...' '.repeat(maxItems - 1).split('')];

    const allColumns = paths.map(getPathContents).map((contents, index) => {
      const dirs = contents?.dirs || [];
      const files = contents?.files || [];
      const list = [...dirs, ...files];

      const contentWidth = Math.max(...list.map((s) => s.length));
      const width = Math.max(minWidth, Math.min(contentWidth, maxWidth));

      const highlighted = cursor[index + 1];
      const highlightedIndex = list.indexOf(highlighted);
      const isActiveCol = index + 2 === cursor.length;

      const columnPath = paths[index];

      const formattedLines = [
        ...dirs.map(formatDir(width, highlighted, isActiveCol, columnPath)),
        ...files.map(formatFile(width, highlighted, isActiveCol, columnPath))
      ];

      if (formattedLines.length > maxItems) {
        const startIndex = Math.max(0, highlightedIndex - maxItems + 2);

        const isScrollUp = startIndex > 0;
        const isScrollDown = startIndex + maxItems < formattedLines.length;

        const slicedLines = formattedLines.slice(startIndex, startIndex + maxItems);

        const fullWidth = stringWidth(formatDir(width, '', false, '')(''));
        if (isScrollUp) slicedLines[0] = chalk.dim(out.center('↑' + ' '.repeat(Math.floor(width / 2)) + '↑', fullWidth));
        if (isScrollDown) slicedLines[slicedLines.length - 1] = chalk.dim(out.center('↓' + ' '.repeat(Math.floor(width / 2)) + '↓', fullWidth));

        return out.utils.joinLines(slicedLines);
      }

      // pad lines to ensure full height
      return out.utils.joinLines([...formattedLines, ...emptyColumn].slice(0, maxItems));
    });

    if (cursorType === 'f') {
      allColumns[allColumns.length - 1] = getFilePanel(currentPath, minWidth, maxItems);
    }

    // show exactly x columns
    const columns = [...allColumns.slice(-maxColumns), ...ArrayUtils.repeat(maxColumns, out.utils.joinLines(emptyColumn))].slice(0, maxColumns);

    const termWidth = out.utils.getTerminalWidth();

    const tableLines = table.getLines([columns], undefined, {
      wrapLinesFn: chlk.gray1,
      drawOuter: true,
      cellPadding: 0,
      truncate: '',
      maxWidth: Infinity
    });
    const tableOut = out.center(out.limitToLengthStart(tableLines.join('\n'), termWidth - 1), termWidth);
    const tableWidth = stringWidth(tableLines[Math.floor(tableLines.length / 2)]);

    const infoLine = (() => {
      const count = isMulti ? chalk.dim(`${chlk.gray1('[')} ${multiSelected.size} selected ${chlk.gray1(']')} `) : '';
      const curr = out.limitToLengthStart(
        `${currentPath} ${chalk.dim(`(${{ f: 'File', d: 'Directory' }[cursorType]})`)}`,
        tableWidth - (stringWidth(count) + 3)
      );
      const split = out.split(curr, count, tableWidth - 2);
      return out.center(split, termWidth);
    })();

    const actionBar = getActionBar(isMulti, pressed);

    // Actual draw
    lc.clear();
    lc.wrap(1, () => ask.imitate(false, question, ' '));
    lc.log();
    lc.log(infoLine);
    lc.log(tableOut);
    lc.log(actionBar);
  };

  // controls

  const userActions = {
    moveVertical: (direction: -1 | 1) => {
      const folds = cursor.slice(0, -1);
      const current = cursor[cursor.length - 1];

      const currContents = getPathContents(paths[folds.length - 1]);
      if (!currContents) return;
      const list = [...currContents.dirs, ...currContents.files];
      const currIndex = list.indexOf(current);
      const nextIndex = (list.length + currIndex + direction) % list.length;
      const nextValue = list[nextIndex];

      cursor = [...folds, nextValue];
      loadNewItem();
    },

    moveRight: () => {
      const current = cursor[cursor.length - 1];
      const currContents = getPathContents(paths[cursor.length - 2]);
      const nextContents = getPathContents(paths[cursor.length - 1]);
      if (!currContents || !nextContents || currContents.dirs.includes(current) === false) return;
      const nextList = [...nextContents.dirs, ...nextContents.files];
      if (!nextList.length) return;
      cursor = [...cursor, nextList[0]];
      loadNewDepth();
    },
    moveLeft: () => {
      if (cursor.length <= 2) return;
      cursor = cursor.slice(0, -1);
      loadNewDepth();
    },
    refresh: async () => {
      if (loading) return;
      loading = true;
      setPressed('r');
      const allKeys = Array.from(fsCache.keys());

      const restKeys = new Set<string>(allKeys);

      await loadEssentials((path: string) => {
        restKeys.delete(path);
        return forceLoadPathContents(path);
      });
      display();
      loading = false;
      if (pressed === 'r') setPressed(undefined);

      await PromiseUtils.eachLimit(32, Array.from(restKeys), async () => {
        if (submitted) return;
        return forceLoadPathContents;
      });
    },
    select: () => {
      if (isMulti && accepted.includes(cursorType)) {
        // toggle cursor to selection
        if (multiSelected.has(currentPath)) {
          multiSelected.delete(currentPath);
        } else {
          multiSelected.add(currentPath);
        }
        setPressed('space');
      }
    },
    takeInput: async <T extends unknown>(
      preQuestion: () => Promise<void> | void,
      inputFn: () => Promise<T>,
      postQuestion?: (result: T) => Promise<boolean | void> | boolean | void
    ): Promise<T> => {
      display();
      loading = true;
      kl.stop();

      lc.clearBack(1); // removes action bar

      await preQuestion();

      const value = await inputFn();

      const skipDisplay = postQuestion ? (await postQuestion(value)) ?? false : false;

      if (!skipDisplay) display();

      kl.start();
      loading = false;

      return value;
    },
    newFolder: async () => {
      const basePath = cursorType === 'f' ? paths[paths.length - 2] : currentPath;

      await userActions.takeInput(
        () => {
          const info2 = chlk.gray3('Enter nothing to cancel');

          const info1Prefix = chlk.gray3('  Adding folder to ');
          const maxValWidth = out.utils.getTerminalWidth() - (stringWidth(info1Prefix) + stringWidth(info2));
          const info1Value = chlk.gray4(out.truncateStart($$.utils.trailSlash(basePath), maxValWidth));
          const info1 = info1Prefix + info1Value;

          lc.log(out.split(info1, info2, out.utils.getTerminalWidth() - 2));
        },
        () => lc.wrap(1, () => ask.text(`What do you want to ${primaryWrapFn('name')} the new folder?`, '')),
        async (newFolderName) => {
          const newFolderPath = join(basePath, newFolderName);
          if (newFolderName !== '') {
            await $$.mkdir(newFolderPath);
          }
          display();
          await Promise.all([forceLoadPathContents(basePath), forceLoadPathContents(newFolderPath)]);
          return;
        }
      );
    },
    submit: () => {
      return isSave ? userActions.submitSave() : userActions.submitSelect();
    },
    submitSave: async () => {
      const initCursor = cursorType === 'f' ? cursor[cursor.length - 1] : '';
      const initSugg = suggestedFileName;
      const initStart = startPath && (await getPathType(startPath)) === 'f' ? explodePath(startPath).filename : '';
      const initial = initCursor || initSugg || initStart || '';

      const basePath = cursorType === 'f' ? paths[paths.length - 2] : currentPath;

      const newFileName = await userActions.takeInput(
        () => {
          lc.log(chlk.gray3('  Saving file to ') + chlk.gray4(out.truncateStart($$.utils.trailSlash(basePath), out.utils.getTerminalWidth() - 20)));
        },
        () => lc.wrap(1, () => ask.text(`What do you want to ${primaryWrapFn('name')} the file?`, initial)),
        () => true
      );

      submitted = true;
      kl.stop();
      lc.clear();

      const result = join(basePath, newFileName);
      ask.imitate(true, question, result);
      return deferred.resolve([result]);
    },
    submitSelect: () => {
      if (!accepted.includes(cursorType)) return;

      submitted = true;
      setPressed('return');
      kl.stop();
      lc.clear();
      if (isMulti) {
        const result = Array.from(multiSelected);
        ask.imitate(true, question, result);
        return deferred.resolve(result);
      } else {
        const result = currentPath;
        ask.imitate(true, question, result);
        return deferred.resolve([currentPath]);
      }
    }
  };

  const kl = getKeyListener((key) => {
    if (loading) return;
    switch (key) {
      case 'up':
        return userActions.moveVertical(-1);
      case 'down':
        return userActions.moveVertical(1);
      case 'right':
        return userActions.moveRight();
      case 'left':
        return userActions.moveLeft();
      case 'r':
        return userActions.refresh();
      case 'f':
        return userActions.newFolder();
      case 'space':
        return userActions.select();
      case 'return':
        return userActions.submit();
    }
  });

  loadNewDepth();

  return deferred.promise;
};

// todo update docs
export const fileExplorer = async (
  questionText: string | Breadcrumb,
  selectType: 'd' | 'f' = 'f',
  startPath: string = process.cwd()
): Promise<string> => {
  const arr = await fileExplorerHandler(false, false, questionText, selectType, startPath);
  return arr[0];
};

// todo update docs
export const multiFileExplorer = (
  questionText: string | Breadcrumb,
  selectType: 'd' | 'f' = 'f',
  startPath: string = process.cwd()
): Promise<string[]> => fileExplorerHandler(true, false, questionText, selectType, startPath);

// todo add docs
export const saveFileExplorer = async (
  questionText: string | Breadcrumb,
  startPath: string = process.cwd(),
  suggestedFileName: string = ''
): Promise<string> => {
  const arr = await fileExplorerHandler(false, true, questionText, 'f', startPath, suggestedFileName);
  return arr[0];
};
