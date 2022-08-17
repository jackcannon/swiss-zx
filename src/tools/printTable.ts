import { Partial, zip, fn } from 'swiss-ak';
import stringWidth from 'string-width';
import { getLineCounter } from './lineCounter';
import * as out from './out';
import { processInput } from '../utils/processTableInput';

/**
 * getTerminalWidth
 *
 * Get maximum terminal width (columns)
 *
 * TODO - add to README
 */
export const getTerminalWidth = () => (process?.stdout?.columns ? process.stdout.columns : 100);

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
   * How each column should be aligned
   *
   * left, right or center
   * TODO - update docs
   */
  align: ('left' | 'right' | 'center')[];
}

const getFullOptions = (opts: Partial<TableOptions>): TableOptions => {
  const drawColLines = opts.drawColLines === undefined ? true : opts.drawColLines;
  return {
    overrideChar: '',
    overrideHorChar: opts.overrideChar || '',
    overrideVerChar: drawColLines ? opts.overrideChar || '' : ' ',
    align: ['left'],
    ...opts,
    wrapperFn: typeof opts.wrapperFn !== 'function' ? fn.noact : opts.wrapperFn,
    drawOuter: opts.drawOuter === undefined ? true : opts.drawOuter,
    drawRowLines: opts.drawRowLines === undefined ? true : opts.drawRowLines,
    drawColLines: opts.drawColLines === undefined ? true : opts.drawColLines
  };
};

const empty = (numCols: number, char: string = '') => new Array(numCols).fill(char);

const tableCharIndexes = {
  NORM: 0,
  STRT: 1,
  SEPR: 2,
  ENDC: 3,
  BLNK: 4
};
const tableChars = {
  hTop: ['━', '┏', '┳', '┓'],
  hNor: [' ', '┃', '┃', '┃'],
  hSep: ['━', '┣', '╋', '┫'],
  hBot: ['━', '┗', '┻', '┛'],

  mSep: ['━', '┡', '╇', '┩'],

  bTop: ['─', '┌', '┬', '┐'],
  bNor: [' ', '│', '│', '│'],
  bSep: ['─', '├', '┼', '┤'],
  bBot: ['─', '└', '┴', '┘']
};

const getTableCharacters = (opts: TableOptions) => ({});

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
  const { wrapperFn, drawOuter, drawRowLines, drawColLines } = getFullOptions(opts);
  let { overrideChar, overrideHorChar, overrideVerChar } = getFullOptions(opts);

  console.log('drawColLines', drawColLines, JSON.stringify(overrideVerChar));
  console.log('drawRowLines', drawRowLines);

  const lc = getLineCounter();

  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body });

  const printLine = (
    row = empty(numCols),
    padChar = ' ',
    joinChar = '│',
    startChar = joinChar,
    endChar = joinChar,
    isHor = false,
    textWrapperFn?
  ) => {
    const orientOverride = isHor ? overrideHorChar : overrideVerChar;
    const padC = (isHor ? overrideHorChar : undefined) || overrideChar || padChar;
    const joinC = orientOverride || overrideChar || joinChar;
    const startC = drawOuter ? orientOverride || overrideChar || startChar : '';
    const endC = drawOuter ? orientOverride || overrideChar || endChar : '';

    let padded = row.map((cell, col) => out.left(cell || '', colWidths[col], padC));
    if (textWrapperFn) padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${padC}${joinC}${padC}`);
    const str = `${startC}${padC}${inner}${padC}${endC}`;
    lc.log(wrapperFn(str));
  };

  if (pHeader) {
    if (drawOuter) printLine(empty(numCols, ''), '━', '┳', '┏', '┓', true);
    for (let index in pHeader) {
      const row = pHeader[index];
      if (drawRowLines && Number(index) !== 0) printLine(empty(numCols, ''), '━', '╋', '┣', '┫', true);
      for (let line of row) {
        printLine(line as string[], ' ', '┃', undefined, undefined, false, chalk.bold);
      }
    }
    printLine(empty(numCols, ''), '━', '╇', '┡', '┩', true);
  } else {
    if (drawOuter) printLine(empty(numCols, ''), '─', '┬', '┌', '┐', true);
  }
  for (let index in pBody) {
    const row = pBody[index];
    if (drawRowLines && Number(index) !== 0) printLine(empty(numCols, ''), '─', '┼', '├', '┤', true);
    for (let line of row) {
      printLine(line as string[]);
    }
  }
  if (drawOuter) printLine(empty(numCols, ''), '─', '┴', '└', '┘', true);
  return lc.get();
};
