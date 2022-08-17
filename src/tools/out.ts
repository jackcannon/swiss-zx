import { wait, fn } from 'swiss-ak';
import stringWidth from 'string-width';
import { getLogStr } from './LogUtils';
import { getTerminalWidth } from './printTable';
import { tableText } from '../utils/processTableInput';

const NEW_LINE = '\n';

const anyTextToString = (text: tableText): string => (text instanceof Array ? joinLines(text) : text);
const trim = (text: string) => text.trim();

const getLines = (text: tableText): string[] =>
  anyTextToString(text)
    .split(NEW_LINE)
    .map((line) => line.trim());
const getNumLines = (text: tableText): number => getLines(text).length;
const getLinesWidth = (text: tableText): number => Math.max(...getLines(text).map((line) => stringWidth(line)));

const getLogLines = (item: any): string[] => getLines(getLogStr(item));
const getNumLogLines = (item: tableText): number => getNumLines(getLogStr(item));
const getLogLinesWidth = (item: tableText): number => getLinesWidth(getLogStr(item));

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

/**
 * out.center
 *
 * Align the given text to the center within the given width of characters/columns
 *
 * ```typescript
 * center('foo', 10); // '   foo    '
 * center('something long', 10); // 'something long'
 * center('lines\n1\n3', 5);
 * // 'lines' +
 * // '  1  ' +
 * // '  2  '
 * ```
 */
export const center = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' '): string =>
  getLogLines(item)
    .map(trim)
    .map((line) => pad(line, Math.floor((width - stringWidth(line)) / 2), Math.ceil((width - stringWidth(line)) / 2), replaceChar))
    .join(NEW_LINE);

/**
 * out.left
 *
 * Align the given text to the left within the given width of characters/columns
 *
 * ```typescript
 * left('foo', 10); // 'foo       '
 * left('something long', 10); // 'something long'
 * left('lines\n1\n3', 5);
 * // 'lines' +
 * // '1    ' +
 * // '2    '
 * ```
 */
export const left = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' '): string =>
  getLogLines(item)
    .map(trim)
    .map((line) => pad(line, 0, width - stringWidth(line), replaceChar))
    .join(NEW_LINE);

/**
 * out.right
 *
 * Align the given text to the right within the given width of characters/columns
 *
 * ```typescript
 * right('foo', 10); // '       foo'
 * right('something long', 10); // 'something long'
 * right('lines\n1\n3', 5);
 * // 'lines' +
 * // '    1' +
 * // '    2'
 * ```
 */
export const right = (item: any, width: number = getTerminalWidth(), replaceChar: string = ' '): string =>
  getLogLines(item)
    .map(trim)
    .map((line) => pad(line, width - stringWidth(line), 0, replaceChar))
    .join(NEW_LINE);

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
export const wrap = (item: any, width: number = getTerminalWidth()): string =>
  getLogLines(item)
    .map(trim)
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

        return rows.map((row) => row.join('').trim()).filter((x) => x);
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
