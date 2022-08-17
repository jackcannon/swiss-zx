import { Partial, zip, fn, ArrayUtils } from 'swiss-ak';
import stringWidth from 'string-width';
import { getLineCounter } from './lineCounter';
import * as out from './out';
import { processInput } from '../utils/processTableInput';
import { getTableCharacters } from '../utils/tableCharacters';

/**
 * getTerminalWidth
 *
 * Get maximum terminal width (columns)
 *
 * TODO - add to README
 */
export const getTerminalWidth = () => (process?.stdout?.columns ? process.stdout.columns : 100);

export interface TableOptions {
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

  /**
   * Whether to draw lines between rows (other than separating header and body);
   * TODO - update docs
   */
  drawRowLines: boolean;

  /**
   * Whether to draw lines between columns
   * TODO - update docs
   */
  drawColLines: boolean;

  /**
   * Preferred width (in number of characters) of each column
   * TODO - update docs
   */
  colWidths: number[];

  /**
   * How the table should be aligned on the screen
   *
   * left, right or center
   * TODO - update docs
   */
  align: 'left' | 'right' | 'center';

  /**
   * How each column should be aligned
   *
   * Array with alignment for each column: left, right or center
   * TODO - update docs
   */
  alignCols: ('left' | 'right' | 'center')[];
}

const getFullOptions = (opts: Partial<TableOptions>): TableOptions => ({
  overrideChar: '',
  overrideHorChar: opts.overrideChar || '',
  overrideVerChar: opts.overrideChar || '',
  align: 'left',
  alignCols: ['left'],
  colWidths: [],
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== 'function' ? fn.noact : opts.wrapperFn,
  drawOuter: opts.drawOuter === undefined ? true : opts.drawOuter,
  drawRowLines: opts.drawRowLines === undefined ? true : opts.drawRowLines,
  drawColLines: opts.drawColLines === undefined ? true : opts.drawColLines
});

const empty = (numCols: number, char: string = '') => new Array(numCols).fill(char);

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
export const printTable = (body: string[][], header: string[][], options: Partial<TableOptions> = {}): number => {
  const lc = getLineCounter();
  const opts = getFullOptions(options);
  const { wrapperFn, drawOuter, drawRowLines, alignCols, align } = opts;

  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body }, opts);

  const alignColumns = ArrayUtils.repeat(numCols, ...alignCols);
  const tableChars = getTableCharacters(opts);

  const printLine = (row = empty(numCols), chars = tableChars.bNor, textWrapperFn?: Function) => {
    const { norm, strt, sepr, endc } = chars;

    let padded = row.map((cell, col) => out.align(cell || '', alignColumns[col], colWidths[col], norm, true));
    if (textWrapperFn) padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${norm}${sepr}${norm}`);
    const str = `${strt}${norm}${inner}${norm}${endc}`;
    lc.log(out.align(wrapperFn(str), align, 0, ' ', false));
  };

  if (pHeader) {
    if (drawOuter) printLine(empty(numCols, ''), tableChars.hTop);
    for (let index in pHeader) {
      const row = pHeader[index];
      if (Number(index) !== 0) printLine(empty(numCols, ''), tableChars.hSep);
      for (let line of row) {
        printLine(line as string[], tableChars.hNor, chalk.bold);
      }
    }
    printLine(empty(numCols, ''), tableChars.mSep);
  } else {
    if (drawOuter) printLine(empty(numCols, ''), tableChars.bTop);
  }
  for (let index in pBody) {
    const row = pBody[index];
    if (Number(index) !== 0) printLine(empty(numCols, ''), tableChars.bSep);
    for (let line of row) {
      printLine(line as string[], tableChars.bNor);
    }
  }
  if (drawOuter) printLine(empty(numCols, ''), tableChars.bBot);
  return lc.get();
};
