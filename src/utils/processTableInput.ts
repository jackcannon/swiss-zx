import { table, TableFormatConfig, FullTableOptions } from '../tools/table';
import { out } from '../tools/out';
import { zip, fn, ArrayUtils } from 'swiss-ak';
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

type SectionType = 'header' | 'body';

const processCells = (cells: Cells, processFn: Function, ...args: any[]): Cells => ({
  header: processFn(cells.header as any, 'header', ...args),
  body: processFn(cells.body as any, 'body', ...args)
});

const fixMixingHeader = (cells: Cells) => {
  return {
    header: cells.header || [],
    body: cells.body || []
  };
};

const transposeTable = (cells: Cells, opts: FullTableOptions): Cells => {
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

const ensureStringForEveryCell = (rows: string[][], type: SectionType, numCols: number) =>
  rows.map((row) => [...row, ...empty(numCols)].slice(0, numCols).map((cell) => itemToString(cell)));

const formatCells = (rows: string[][][], type: SectionType, format: TableFormatConfig[]) => {
  const applicable = format.filter((f) => (f.isHeader && type === 'header') || (f.isBody && type === 'body'));

  for (let frmt of applicable) {
    for (let y in rows) {
      for (let x in rows[y]) {
        if ((frmt.row === undefined || frmt.row === Number(y)) && (frmt.col === undefined || frmt.col === Number(x))) {
          for (let l in rows[y][x]) {
            rows[y][x][l] = frmt.formatFn(rows[y][x][l]);
          }
        }
      }
    }
  }

  return rows;
};

const splitCellsIntoLines = (rows: string[][], type: SectionType) => rows.map((row) => row.map((cell) => out.utils.getLines(cell)));

const getDesiredColumnWidths = (
  cells: Cells,
  numCols: number,
  preferredWidths: number[],
  [_mT, marginRight, _mB, marginLeft]: number[],
  maxTotalWidth: number
) => {
  const transposed = zip(...[...cells.header, ...cells.body]);

  const actualColWidths = transposed.map((col) => Math.max(...col.map((cell) => out.utils.getLinesWidth(cell))));
  const currColWidths = preferredWidths.length ? ArrayUtils.repeat(numCols, ...preferredWidths) : actualColWidths;
  const currTotalWidth = currColWidths.reduce(fn.reduces.combine) + (numCols + 1) * 3;

  const diff = currTotalWidth - (maxTotalWidth - (marginRight + marginLeft));
  const colWidths = [...currColWidths];
  for (let i = 0; i < diff; i++) {
    colWidths[colWidths.indexOf(Math.max(...colWidths))]--;
  }
  return colWidths;
};

const wrapCells = (rows: string[][][], type: SectionType, colWidths: number[], truncate: false | string) =>
  rows.map((row) => {
    const wrapped = row
      .map((cell) => out.utils.joinLines(cell))
      .map((text, colIndex) => {
        if (truncate !== false) {
          return out.truncate(text, colWidths[colIndex], truncate as string);
        } else {
          return out.wrap(text, colWidths[colIndex]);
        }
      })
      .map((text) => out.utils.getLines(text));

    const maxHeight = Math.max(...wrapped.map((cell) => cell.length));
    return wrapped.map((cell) => [...cell, ...empty(maxHeight)].slice(0, maxHeight));
  });

const seperateLinesIntoRows = (rows: string[][][], type: SectionType) => rows.map((row) => zip(...row));

export const processInput = (cells: Cells, opts: FullTableOptions) => {
  const fixed = fixMixingHeader(cells);

  const transposed = transposeTable(fixed, opts);

  const numCols = Math.max(...[...(transposed.header || []), ...transposed.body].map((row) => row.length));
  const everyCell = processCells(transposed, ensureStringForEveryCell, numCols);
  const linedCells = processCells(everyCell, splitCellsIntoLines);
  const colWidths = getDesiredColumnWidths(linedCells, numCols, opts.colWidths, opts.margin as number[], opts.maxWidth);
  const wrappedCells = processCells(linedCells, wrapCells, colWidths, opts.truncate);
  const formatted = processCells(wrappedCells, formatCells, opts.format);
  const seperatedRows = processCells(formatted, seperateLinesIntoRows);

  return { cells: seperatedRows, numCols, colWidths };
};
