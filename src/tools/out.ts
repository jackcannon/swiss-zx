import { wait, fn } from 'swiss-ak';
import stringWidth from 'string-width';
import { getLogStr } from './LogUtils';
import { getTerminalWidth } from './printTable';
import { Text } from '../utils/processTableInput';

const NEW_LINE = '\n';

const textToString = (text: Text): string => (text instanceof Array ? joinLines(text) : text);

/**
 * out.utils.getLines
 *
 * Split multi-line text into an array of lines
 */
const getLines = (text: Text): string[] => textToString(text).split(NEW_LINE);
/**
 * out.utils.getNumLines
 *
 * Get how many lines a string or array of lines has
 */
const getNumLines = (text: Text): number => getLines(text).length;
/**
 * out.utils.getLinesWidth
 *
 * Get how wide a string or array of lines has
 */
const getLinesWidth = (text: Text): number => Math.max(...getLines(text).map((line) => stringWidth(line)));

/**
 * out.utils.getLogLines
 *
 * Split a log-formatted multi-line text into an array of lines
 */
const getLogLines = (item: any): string[] => getLines(getLogStr(item));
/**
 * out.utils.getNumLogLines
 *
 * Get how many lines a log-formatted string or array of lines has
 */
const getNumLogLines = (item: Text): number => getNumLines(getLogStr(item));
/**
 * out.utils.getLogLinesWidth
 *
 * Get how wide a log-formatted string or array of lines has
 */
const getLogLinesWidth = (item: Text): number => getLinesWidth(getLogStr(item));

/**
 * out.utils.joinLines
 *
 * Join an array of lines into a single multi-line string
 */
const joinLines = (lines: string[]): string => lines.map(fn.maps.toString).join(NEW_LINE);

export const utils = {
  getLines,
  getNumLines,
  getLinesWidth,
  getLogLines,
  getNumLogLines,
  getLogLinesWidth,
  joinLines
};

/**
 * out.pad
 *
 * Pad before and after the given text with the given character.
 *
 * ```typescript
 * pad('foo', 3, 1, '-'); // '---foo-'
 * pad('bar', 10, 5, '_'); // '__________bar_____'
 * ```
 */
export const pad = (line: string, start: number, end: number, replaceChar: string = ' '): string =>
  `${replaceChar.repeat(Math.max(0, start))}${line}${replaceChar.repeat(Math.max(0, end))}`;

export type AlignType = 'left' | 'right' | 'center';
type AlignFunction = (item: any, width?: number, replaceChar?: string, forceWidth?: boolean) => string;

const correctWidth = (width: number): number => (width <= 0 || width === Infinity ? getTerminalWidth() : Math.min(width, getTerminalWidth()));

/**
 * out.center
 *
 * Align the given text to the center within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.center('foo', 10); // '   foo    '
 * out.center('something long', 10); // 'something long'
 * out.center('lines\n1\n3', 5);
 * // 'lines' +
 * // '  1  ' +
 * // '  2  '
 * ```
 */
export const center: AlignFunction = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' ', forceWidth: boolean = true): string =>
  getLogLines(item)
    .map((line) =>
      pad(
        line,
        Math.floor((correctWidth(width) - stringWidth(line)) / 2),
        forceWidth ? Math.ceil((correctWidth(width) - stringWidth(line)) / 2) : 0,
        replaceChar
      )
    )
    .join(NEW_LINE);

/**
 * out.left
 *
 * Align the given text to the left within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.left('foo', 10); // 'foo       '
 * out.left('something long', 10); // 'something long'
 * out.left('lines\n1\n3', 5);
 * // 'lines' +
 * // '1    ' +
 * // '2    '
 * ```
 */
export const left: AlignFunction = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' ', forceWidth: boolean = true): string =>
  getLogLines(item)
    .map((line) => pad(line, 0, forceWidth ? correctWidth(width) - stringWidth(line) : 0, replaceChar))
    .join(NEW_LINE);

/**
 * out.right
 *
 * Align the given text to the right within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.right('foo', 10); // '       foo'
 * out.right('something long', 10); // 'something long'
 * out.right('lines\n1\n3', 5);
 * // 'lines' +
 * // '    1' +
 * // '    2'
 * ```
 */
export const right: AlignFunction = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' ', forceWidth: boolean = true): string =>
  getLogLines(item)
    .map((line) => pad(line, correctWidth(width) - stringWidth(line), 0, replaceChar))
    .join(NEW_LINE);

const alignFunc = {
  left,
  center,
  right
};

/**
 * out.align
 *
 * Align the given text to the given alignment within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.align('foo', 'left', 10); // 'foo       '
 * out.align('something long', 'center', 10); // 'something long'
 * out.align('lines\n1\n3', 'right', 5);
 * // 'lines' +
 * // '    1' +
 * // '    2'
 * ```
 */
export const align = (item: any, direction: AlignType, width: number = getTerminalWidth(), replaceChar: string = ' ', forceWidth: boolean = true) => {
  const func = alignFunc[direction] || alignFunc.left;
  return func(item, width, replaceChar, forceWidth);
};

/**
 * out.wrap
 *
 * Wrap the given text to the given width of characters/columns
 *
 * ```typescript
 * wrap('This is a sentence', 15);
 * // 'This is' +
 * // 'a sentence'
 * ```
 */
export const wrap = (item: any, width: number = getTerminalWidth(), forceWidth: boolean = true): string =>
  getLogLines(item)
    .map((line) => {
      if (stringWidth(line) > width) {
        const words: string[] = line.split(/(?<=#?[ -]+)/g);
        const rows: string[][] = [];

        let rowStartIndex = 0;

        for (let wIndex in words) {
          const word = words[wIndex];

          const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex) - 1));
          const candText = candidateRow.join('');

          if (stringWidth(candText) + stringWidth(word) > width) {
            rows.push(candidateRow);
            rowStartIndex = Number(wIndex) - 1;
          }
        }

        const remaining = words.slice(rowStartIndex);
        rows.push(remaining);

        return rows.map((row) => row.join('')).map((row) => left(row, width, ' ', forceWidth));
      }

      return line;
    })
    .flat()
    .join(NEW_LINE);

/**
 * out.moveUp
 *
 * Move the terminal cursor up X lines, clearing each row.
 *
 * Useful for replacing previous lines of output
 *
 * ```typescript
 * moveUp(1);
 * ```
 */
export const moveUp = (lines: number = 1) => {
  if (process?.stdout?.clearLine) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0);
    for (let i = 0; i < lines; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
    }
  }
};

const loadingDefault = (s) => console.log(`Loading${s}`);

/**
 * out.loading
 *
 * Display an animated loading indicator
 *
 * ```typescript
 * const loader = out.loading();
 * // ...
 * loader.stop();
 * ```
 */
export const loading = (action: (s: string) => any = loadingDefault, lines: number = 1, symbols: string[] = ['.  ', '.. ', '...']) => {
  let stopped = false;

  let count = 0;
  const runLoop = async () => {
    if (stopped) return;
    if (count) moveUp(lines);
    action(symbols[count++ % symbols.length]);
    await wait(500);
    return runLoop();
  };

  runLoop();

  return {
    stop: () => {
      moveUp(lines);
      stopped = true;
    }
  };
};
