import { Partial, zip, fn } from 'swiss-ak';
import stringWidth from 'string-width';
import { getLineCounter } from './lineCounter';
import { left } from './out';

interface TableOptions {
  /**
   * Function to wrap each line of the table in (e.g. chalk.blue)
   */
  wrapperFn: Function;

  /**
   * Character to use instead of lines
   */
  overrideChar: string;

  /**
   * Character to use instead of horizontal lines
   */
  overrideHorChar: string;

  /**
   * Character to use instead of vertical lines
   */
  overrideVerChar: string;

  /**
   * Whether to draw the outer border of the table
   */
  drawOuter: boolean;
}

const getFullOptions = (opts: Partial<TableOptions>): TableOptions => ({
  overrideChar: '',
  overrideHorChar: opts.overrideChar || '',
  overrideVerChar: opts.overrideChar || '',
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== 'function' ? fn.noact : opts.wrapperFn,
  drawOuter: opts.drawOuter === undefined ? true : opts.drawOuter
});

/**
 * printTable
 *
 * Print a table
 *
 * ```typescript
 * const header = [['Name', 'Age']];
 * const body = [['John', '25'], ['Jane', '26']];
 * printTable(body, header);
 *
 * // ┏━━━━━━┳━━━━━┓
 * // ┃ Name ┃ Age ┃
 * // ┡━━━━━━╇━━━━━┩
 * // │ John │ 25  │
 * // │ Jane │ 26  │
 * // └──────┴─────┘
 * ```
 */
export const printTable = (body: string[][], header: string[][], opts: Partial<TableOptions> = {}): number => {
  const { wrapperFn, overrideChar, overrideHorChar, overrideVerChar, drawOuter } = getFullOptions(opts);

  const lc = getLineCounter();

  const allRows = () => [...(header || []), ...body];
  const numCols = Math.max(...allRows().map((row) => row.length));

  const empty = (char = '') => new Array(numCols).fill(char);
  const correctRow = (row) => [...row, ...empty()].slice(0, numCols).map((cell) => '' + cell);

  header = header && header.map(correctRow);
  body = body.map(correctRow);

  const colWidths = zip(...allRows()).map((col) => Math.max(...col.map((s) => stringWidth(s || ''))));

  const printRow = (row = empty(), padChar = ' ', joinChar = '│', startChar = joinChar, endChar = joinChar, isHor = false, textWrapperFn?) => {
    const orientOverride = isHor ? overrideHorChar : overrideVerChar;
    const padC = (isHor ? overrideHorChar : undefined) || overrideChar || padChar;
    const joinC = orientOverride || overrideChar || joinChar;
    const startC = drawOuter ? orientOverride || overrideChar || startChar : '';
    const endC = drawOuter ? orientOverride || overrideChar || endChar : '';

    let padded = row.map((cell, col) => left(cell || '', colWidths[col], padC));
    if (textWrapperFn) padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${padC}${joinC}${padC}`);
    const str = `${startC}${padC}${inner}${padC}${endC}`;
    lc.log(wrapperFn(str));
  };

  if (header) {
    if (drawOuter) printRow(empty(''), '━', '┳', '┏', '┓', true);
    for (let row of header) {
      printRow(row, ' ', '┃', undefined, undefined, false, chalk.bold);
    }
    printRow(empty(''), '━', '╇', '┡', '┩', true);
  } else {
    if (drawOuter) printRow(empty(''), '─', '┬', '┌', '┐', true);
  }
  for (let row of body) {
    printRow(row);
  }
  if (drawOuter) printRow(empty(''), '─', '┴', '└', '┘', true);
  return lc.get();
};
