import { getLogStr } from './LogUtils';

const getDefaultColumns = (): number => process?.stdout?.columns || 100;
const getLines = (text: string): string[] => text.split('\n').map((line) => line.trim());
const getOutputLines = (item): string[] => getLines(getLogStr(item));

/**
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
export const center = (item: any, width: number = getDefaultColumns(), replaceChar: string = ' '): string =>
  getOutputLines(item)
    .map((line) => pad(line, Math.floor((width - line.length) / 2), Math.ceil((width - line.length) / 2), replaceChar))
    .join('\n');

/**
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
export const left = (item: any, width: number = getDefaultColumns(), replaceChar: string = ' '): string =>
  getOutputLines(item)
    .map((line) => pad(line, 0, width - line.length, replaceChar))
    .join('\n');

/**
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
export const right = (item: any, width: number = getDefaultColumns(), replaceChar: string = ' '): string =>
  getOutputLines(item)
    .map((line) => pad(line, width - line.length, 0, replaceChar))
    .join('\n');

/**
 * Wrap the given text to the given width of characters/columns
 *
 * ```typescript
 * wrap('This is a sentence', 15);
 * // 'This is' +
 * // 'a sentence'
 * ```
 */
export const wrap = (item: any, width: number = getDefaultColumns()): string =>
  getOutputLines(item)
    .map((line) => {
      if (line.length > width) {
        const words: string[] = line.split(/(?<=#?[ -]+)/g);
        const rows: string[][] = [];

        let rowStartIndex = 0;

        for (let wIndex in words) {
          const word = words[wIndex];

          const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex) - 1));
          const candText = candidateRow.join('');

          if (candText.length + word.length > width) {
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
    .join('\n');

/**
 * Move the terminal cursor up X lines, clearing each row.
 *
 * Useful for replacing previous lines of output
 */
export const moveUp = (lines: number = 2) => {
  if (process?.stdout?.clearLine) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0);
    for (let i = 0; i < lines; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
    }
  }
};
