import { Partial, fn, ArrayUtils } from 'swiss-ak';
import { getLineCounter } from './out/lineCounter';
import { out, AlignType } from './out';
import { processInput } from '../utils/processTableInput';
import { getTableCharacters } from '../utils/tableCharacters';
import { clr, Colour } from './clr';

const toFullFormatConfig = (config: Partial<TableFormatConfig>) =>
  ({
    isHeader: false,
    isBody: true,
    ...config
  } as TableFormatConfigFull);

// TODO docs
export interface TableFormatConfig {
  formatFn: Function;
  isHeader?: boolean;
  isBody?: boolean;
  row?: number;
  col?: number;
}
interface TableFormatConfigFull extends TableFormatConfig {
  isHeader: boolean;
  isBody: boolean;
}

export interface FullTableOptions {
  /**
   * Function to wrap each line of the table in (e.g. chalk.blue)
   */
  wrapperFn: Function;

  // todo docs
  wrapLinesFn: Function;

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
   * left, right, center or justify
   */
  align: AlignType;

  /**
   * How each column should be aligned
   *
   * Array with alignment for each column: left, right, center or justify
   */
  alignCols: AlignType[];

  /**
   * Change rows into columns and vice versa
   */
  transpose: boolean;

  /**
   * Change rows into columns and vice versa (body only)
   */
  transposeBody: boolean;

  /**
   * How much spacing to leave around the outside of the table
   * todo update docs for multiple margins
   */
  margin: number | number[];

  // todo docs
  cellPadding: number;

  // TODO docs
  format: TableFormatConfig[];

  // TODO docs
  // truncates line instead of wrapping
  truncate: false | string;

  // TODO docs
  maxWidth: number;
}

export type TableOptions = Partial<FullTableOptions>;

const getFullOptions = (opts: TableOptions): FullTableOptions => ({
  overrideChar: '',
  overrideHorChar: opts.overrideChar || '',
  overrideVerChar: opts.overrideChar || '',
  align: 'left',
  alignCols: ['left'],
  colWidths: [],
  cellPadding: 1,
  truncate: false,
  maxWidth: out.utils.getTerminalWidth(),
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== 'function' ? fn.noact : opts.wrapperFn,
  wrapLinesFn: typeof opts.wrapLinesFn !== 'function' ? fn.noact : opts.wrapLinesFn,
  drawOuter: typeof opts.drawOuter !== 'boolean' ? true : opts.drawOuter,
  drawRowLines: typeof opts.drawRowLines !== 'boolean' ? true : opts.drawRowLines,
  drawColLines: typeof opts.drawColLines !== 'boolean' ? true : opts.drawColLines,
  transpose: typeof opts.transpose !== 'boolean' ? false : opts.transpose,
  transposeBody: typeof opts.transposeBody !== 'boolean' ? false : opts.transposeBody,
  format: (opts.format || []).map(toFullFormatConfig),
  margin: ((input: number | number[] = 0) => {
    const arr = [input].flat();

    const top = arr[0] ?? 0;
    const right = arr[1] ?? top;
    const bottom = arr[2] ?? top;
    const left = arr[3] ?? right ?? top;

    return [top, right, bottom, left];
  })(opts.margin) as number[]
});

const empty = (numCols: number, char: string = '') => new Array(numCols).fill(char);

const getLines = (body: any[][], header?: any[][], options: TableOptions = {}): string[] => {
  // const lc = getLineCounter();
  const opts = getFullOptions(options);
  const { wrapperFn, wrapLinesFn, drawOuter, alignCols, align, drawRowLines, cellPadding } = opts;

  const [marginTop, marginRight, marginBottom, marginLeft] = opts.margin as number[];

  const result = [];

  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body }, opts);

  const alignColumns = ArrayUtils.repeat(numCols, ...alignCols);
  const tableChars = getTableCharacters(opts);

  const printLine = (row = empty(numCols), chars = tableChars.bNor, textWrapperFn?: Function) => {
    const [norm, strt, sepr, endc] = chars;

    const pad = norm.repeat(Math.max(0, cellPadding));

    let aligned = row.map((cell, col) => out.align(cell || '', alignColumns[col], colWidths[col], norm, true));
    if (textWrapperFn) aligned = aligned.map((x) => textWrapperFn(x));
    const inner = aligned.join(wrapLinesFn(`${pad}${sepr}${pad}`));
    const str = wrapLinesFn(`${' '.repeat(marginLeft)}${strt}${pad}`) + inner + wrapLinesFn(`${pad}${endc}${' '.repeat(marginRight)}`);

    result.push(out.align(wrapperFn(str), align, -1, ' ', false));
  };

  if (marginTop) result.push('\n'.repeat(marginTop - 1));

  if (pHeader.length) {
    if (drawOuter && drawRowLines) printLine(empty(numCols, ''), tableChars.hTop, wrapLinesFn);
    for (let index in pHeader) {
      const row = pHeader[index];
      if (Number(index) !== 0 && drawRowLines) printLine(empty(numCols, ''), tableChars.hSep, wrapLinesFn);
      for (let line of row) {
        printLine(line as string[], tableChars.hNor, chalk.bold);
      }
    }
    printLine(empty(numCols, ''), tableChars.mSep, wrapLinesFn);
  } else {
    if (drawOuter) printLine(empty(numCols, ''), tableChars.bTop, wrapLinesFn);
  }
  for (let index in pBody) {
    const row = pBody[index];
    if (Number(index) !== 0 && drawRowLines) printLine(empty(numCols, ''), tableChars.bSep, wrapLinesFn);
    for (let line of row) {
      printLine(line as string[], tableChars.bNor);
    }
  }
  if (drawOuter && drawRowLines) printLine(empty(numCols, ''), tableChars.bBot, wrapLinesFn);
  if (marginBottom) result.push('\n'.repeat(marginBottom - 1));
  return result;
};

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
const print = (body: any[][], header?: any[][], options: TableOptions = {}): number => {
  const lines = getLines(body, header, options);
  if (lines.length) {
    console.log(lines.join('\n'));
  }
  return lines.length;
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

// TODO docs

const getFormat = (format: Function | Colour, row?: number, col?: number, isHeader?: boolean, isBody?: boolean): TableFormatConfig => {
  const result: TableFormatConfig = {
    formatFn: typeof format === 'function' ? format : clr[format],
    row,
    col
  };
  if (isHeader !== undefined) result.isHeader = isHeader;
  if (isBody !== undefined) result.isBody = isBody;
  return result;
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
const printObjects = (objects: Object[], headers: Object = {}, options: TableOptions = {}) => {
  const { body, header } = objectsToTable(objects, headers);
  return print(body, header, options);
};

export const table = {
  getLines,
  print,
  printObjects,
  utils: {
    objectsToTable,
    transpose,
    concatRows,
    getFormat
  }
};
