import { Partial, fn, ArrayUtils } from 'swiss-ak';
import { getLineCounter } from './lineCounter';
import * as out from './out';
import { processInput } from '../utils/processTableInput';
import { getTableCharacters } from '../utils/tableCharacters';

/**
 * print.utils.getTerminalWidth
 *
 * Get maximum terminal width (columns)
 *
 * ```typescript
 * print.utils.getTerminalWidth(); // 127
 * ```
 */
const getTerminalWidth = () => (process?.stdout?.columns ? process.stdout.columns : 100);

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
   * Whether to draw lines between rows (other than separating header and body)
   */
  drawRowLines: boolean;

  /**
   * Whether to draw lines between columns
   */
  drawColLines: boolean;

  /**
   * Preferred width (in number of characters) of each column
   */
  colWidths: number[];

  /**
   * How the table should be aligned on the screen
   *
   * left, right or center
   */
  align: 'left' | 'right' | 'center';

  /**
   * How each column should be aligned
   *
   * Array with alignment for each column: left, right or center
   */
  alignCols: ('left' | 'right' | 'center')[];

  /**
   * Change rows into columns and vice versa
   */
  transpose: boolean;

  /**
   * Change rows into columns and vice versa (body only)
   */
  transposeBody: boolean;
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
  drawOuter: typeof opts.drawOuter !== 'boolean' ? true : opts.drawOuter,
  drawRowLines: typeof opts.drawRowLines !== 'boolean' ? true : opts.drawRowLines,
  drawColLines: typeof opts.drawColLines !== 'boolean' ? true : opts.drawColLines,
  transpose: typeof opts.transpose !== 'boolean' ? false : opts.transpose,
  transposeBody: typeof opts.transposeBody !== 'boolean' ? false : opts.transposeBody
});

const empty = (numCols: number, char: string = '') => new Array(numCols).fill(char);

/**
 * table.print
 *
 * Print a table
 *
 * ```typescript
 * const header = [['Name', 'Age']];
 * const body = [['John', '25'], ['Jane', '26']];
 * table.print(body, header);
 *
 * // ┏━━━━━━┳━━━━━┓
 * // ┃ Name ┃ Age ┃
 * // ┡━━━━━━╇━━━━━┩
 * // │ John │ 25  │
 * // │ Jane │ 26  │
 * // └──────┴─────┘
 * ```
 */
const print = (body: any[][], header?: any[][], options: Partial<TableOptions> = {}): number => {
  const lc = getLineCounter();
  const opts = getFullOptions(options);
  const { wrapperFn, drawOuter, alignCols, align } = opts;

  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body }, opts);

  const alignColumns = ArrayUtils.repeat(numCols, ...alignCols);
  const tableChars = getTableCharacters(opts);

  const printLine = (row = empty(numCols), chars = tableChars.bNor, textWrapperFn?: Function) => {
    const [norm, strt, sepr, endc] = chars;

    let padded = row.map((cell, col) => out.align(cell || '', alignColumns[col], colWidths[col], norm, true));
    if (textWrapperFn) padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${norm}${sepr}${norm}`);
    const str = `${strt}${norm}${inner}${norm}${endc}`;
    lc.log(out.align(wrapperFn(str), align, 0, ' ', false));
  };

  if (pHeader.length) {
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

const getAllKeys = (objects) => {
  const allKeys = {};
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      allKeys[key] = true;
    });
  });
  return Object.keys(allKeys);
};

/**
 * table.utils.objectsToTable
 *
 * Process an array of objects into a table format (string[][])
 */
const objectsToTable = (objects: Object[], headers: Object = {}): { header: any[][]; body: any[][] } => {
  const allKeys = getAllKeys(objects);

  const header = [allKeys.map((key) => headers[key] || key)];
  const body = objects.map((obj) => allKeys.map((key) => obj[key]));

  return {
    header,
    body
  };
};

/**
 * table.utils.transpose
 *
 * Change rows into columns and vice versa
 */
const transpose = (rows: any[][]): any[][] => {
  return ArrayUtils.zip(...rows);
};

/**
 * table.utils.concatRows
 *
 * Concatenate header and body rows into one list of rows
 */
const concatRows = (cells: { header: any[][]; body: any[][] }): any[][] => {
  return [...(cells.header || []), ...cells.body] as any[][];
};

/**
 * table.printObjects
 *
 * Print a table of given objects
 *
 * ```typescript
 * const objs = [
 *   // objs
 *   { a: '1', b: '2', c: '3' },
 *   { a: '0', c: '2' },
 *   { b: '4' },
 *   { a: '6' }
 * ];
 * const header = {
 *   a: 'Col A',
 *   b: 'Col B',
 *   c: 'Col C'
 * };
 * table.printObjects(objs, header);
 *
 * // ┏━━━━━━━┳━━━━━━━┳━━━━━━━┓
 * // ┃ Col A ┃ Col B ┃ Col C ┃
 * // ┡━━━━━━━╇━━━━━━━╇━━━━━━━┩
 * // │ 1     │ 2     │ 3     │
 * // ├───────┼───────┼───────┤
 * // │ 0     │       │ 2     │
 * // ├───────┼───────┼───────┤
 * // │       │ 4     │       │
 * // ├───────┼───────┼───────┤
 * // │ 6     │       │       │
 * // └───────┴───────┴───────┘
 * ```
 */
const printObjects = (objects: Object[], headers: Object = {}, options: Partial<TableOptions> = {}) => {
  const { body, header } = objectsToTable(objects, headers);
  return print(body, header, options);
};

export const table = {
  print,
  printObjects,
  utils: {
    objectsToTable,
    transpose,
    concatRows,
    getTerminalWidth
  }
};
