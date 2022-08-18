import { table, TableOptions } from '../tools/table';
import * as out from '../tools/out';
import { Partial, zip, fn, ArrayUtils } from 'swiss-ak';
import { getLogStr } from '../tools/LogUtils';

export type Text = string | string[];

export type Cells = { header: Text[][]; body: Text[][] };

const empty = (numCols: number, char: string = '') => new Array(numCols).fill(char);

const showBlank = ['undefined', 'null'];
const showRaw = ['string', 'number', 'boolean'];
const itemToString = (item) => {
  if (showBlank.includes(typeof item)) return '';
  if (showRaw.includes(typeof item)) return item.toString();
  return getLogStr(item);
};

const processCells = (cells: Cells, processFn: Function, ...args: any[]): Cells => ({
  header: processFn(cells.header as any, ...args),
  body: processFn(cells.body as any, ...args)
});

const fixMixingHeader = (cells: Cells) => {
  return {
    header: cells.header || [],
    body: cells.body || []
  };
};

const transposeTable = (cells: Cells, opts: TableOptions): Cells => {
  if (opts.transpose) {
    const body = table.utils.transpose(table.utils.concatRows(cells));
    return { header: [], body };
  }
  if (opts.transposeBody) {
    const body = table.utils.transpose(cells.body as string[][]);
    return { header: cells.header, body };
  }

  return cells;
};

const ensureStringForEveryCell = (rows: string[][], numCols: number) =>
  rows.map((row) => [...row, ...empty(numCols)].slice(0, numCols).map((cell) => itemToString(cell)));

const splitCellsIntoLines = (rows: string[][]) => rows.map((row) => row.map((cell) => out.utils.getLines(cell)));

const getDesiredColumnWidths = (cells: Cells, numCols: number, preferredWidths: number[]) => {
  const transposed = zip(...[...cells.header, ...cells.body]);

  const actualColWidths = transposed.map((col) => Math.max(...col.map((cell) => out.utils.getLinesWidth(cell))));
  const currColWidths = preferredWidths.length ? ArrayUtils.repeat(numCols, ...preferredWidths) : actualColWidths;
  const currTotalWidth = currColWidths.reduce(fn.reduces.combine) + (numCols + 1) * 3;

  const diff = currTotalWidth - table.utils.getTerminalWidth();
  const colWidths = [...currColWidths];
  for (let i = 0; i < diff; i++) {
    colWidths[colWidths.indexOf(Math.max(...colWidths))]--;
  }
  return colWidths;
};

const wrapCells = (rows: string[][][], colWidths: number[]) =>
  rows.map((row) => {
    const wrapped = row.map((cell, colIndex) => out.utils.getLines(out.wrap(out.utils.joinLines(cell), colWidths[colIndex])));
    const maxHeight = Math.max(...wrapped.map((cell) => cell.length));
    return wrapped.map((cell) => [...cell, ...empty(maxHeight)].slice(0, maxHeight));
  });

const seperateLinesIntoRows = (rows: string[][][]) => rows.map((row) => zip(...row));

export const processInput = (cells: Cells, opts: TableOptions) => {
  const fixed = fixMixingHeader(cells);

  const transposed = transposeTable(fixed, opts);

  const numCols = Math.max(...[...(transposed.header || []), ...transposed.body].map((row) => row.length));

  const everyCell = processCells(transposed, ensureStringForEveryCell, numCols);
  const linedCells = processCells(everyCell, splitCellsIntoLines);
  const colWidths = getDesiredColumnWidths(linedCells, numCols, opts.colWidths);
  const wrappedCells = processCells(linedCells, wrapCells, colWidths);
  const seperatedRows = processCells(wrappedCells, seperateLinesIntoRows);

  return { cells: seperatedRows, numCols, colWidths };
};
