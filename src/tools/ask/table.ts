import { fn, getDeferred, RemapOf, symbols } from 'swiss-ak';

import { getKeyListener } from '../../utils/keyListener';
import { getLineCounter } from '../out/lineCounter';

import { table, TableOptions } from '../table';
import { ask } from '../ask';
import { Breadcrumb } from '../out/breadcrumb';

type ItemToRowMapFunction<T extends unknown> = (item?: T, index?: number, items?: T[]) => any[];

const highlightFn = chalk.cyan.underline;

const askTableHandler = <T extends unknown>(
  isMulti: boolean,
  question: string | Breadcrumb,
  items: T[],
  initial: T[] | number[] = [],
  rows?: any[][] | ItemToRowMapFunction<T>,
  headers: any[][] | RemapOf<T, string> = [],
  tableOptions: TableOptions = {}
): Promise<T[]> => {
  const questionText = typeof question === 'string' ? question : question.get();

  const lc = getLineCounter();

  const deferred = getDeferred<T[]>();

  let activeIndex: number = initial[0] !== undefined ? (typeof initial[0] === 'number' ? initial[0] : items.indexOf(initial[0] as T)) : 0;

  let selectedIndexes: number[] = initial.map((i) => (typeof i === 'number' ? i : items.indexOf(i as T))).filter((i) => i !== -1);

  lc.add(ask.imitate(false, questionText, `- Use arrow-keys. ${isMulti ? 'Space to select. ' : ''}Enter to ${isMulti ? 'confirm' : 'select'}.`));
  lc.checkpoint('AFTER_Q');

  let lastDrawnRows = [];
  const drawTable = () => {
    const tableOpts: TableOptions = {
      margin: [1, 0, 0, 0],
      ...tableOptions,
      format: [
        { formatFn: highlightFn, isBody: true, isHeader: false, row: activeIndex },
        // ...(isMulti ? selectedIndexes.map((i) => ({ formatFn: highlightFn, isBody: true, isHeader: false, row: i })) : []),
        ...(tableOptions.format || [])
      ]
    };

    let body;
    let header;
    if (rows) {
      body = typeof rows === 'function' ? items.map(rows as ItemToRowMapFunction<T>) : (rows as any[][]);
      header = headers;
    } else {
      const isHeaderObj = headers && !(headers instanceof Array);
      const objTable = table.utils.objectsToTable(items, isHeaderObj ? (headers as RemapOf<T, string>) : undefined);
      body = objTable.body;
      header = isHeaderObj ? objTable.header : headers;
    }

    const finalBody = body.map((row, index) => {
      let firstCell;
      if (isMulti) {
        const selectedSym = symbols.RADIO_FULL;
        const unselectedSym = symbols.RADIO_EMPTY;

        firstCell = selectedIndexes.includes(index) ? chalk.reset(chalk.green(selectedSym)) : chalk.reset(unselectedSym);
      } else {
        firstCell = body.indexOf(row) === activeIndex ? chalk.reset(chalk.cyan(symbols.CURSOR)) : ' ';
      }

      return [firstCell, ...row];
    });
    const finalHeaders = header.length ? header.map((row) => ['', ...row]) : [];

    lastDrawnRows = finalBody;

    lc.clearToCheckpoint('AFTER_Q');
    lc.add(table.print(finalBody, finalHeaders, tableOpts));
    lc.checkpoint('AFTER_TABLE');
  };
  drawTable();

  const move = (dir: number) => {
    activeIndex = (items.length + activeIndex + dir) % items.length;
    drawTable();
  };
  const toggle = () => {
    if (isMulti) {
      if (selectedIndexes.includes(activeIndex)) {
        selectedIndexes = selectedIndexes.filter((i) => i !== activeIndex);
      } else {
        selectedIndexes.push(activeIndex);
      }
    }
    drawTable();
  };
  const submit = () => {
    kl.stop();
    const results = (isMulti ? selectedIndexes.map((i) => items[i]) : [items[activeIndex]]).filter(fn.isTruthy);
    lc.clear();
    ask.imitate(true, questionText, isMulti ? `${results.length} selected` : results[0]);
    deferred.resolve(results);
  };

  const listenCallback = (key: string) => {
    switch (key) {
      case 'up':
        return move(-1);
      case 'down':
        return move(1);
      case 'space':
        return toggle();
      case 'return':
        return submit();
    }
  };
  const kl = getKeyListener(listenCallback, true);

  return deferred.promise;
};

// TODO docs

export const askTableSelect = async <T extends unknown>(
  question: string | Breadcrumb,
  items: T[],
  initial?: T | number,
  rows?: any[][] | ItemToRowMapFunction<T>,
  headers?: any[][] | RemapOf<T, string>,
  tableOptions?: TableOptions
): Promise<T> => {
  const results = await askTableHandler(false, question, items, [initial] as number[] | T[], rows, headers, tableOptions);
  return results[0];
};
export const askTableMultiselect = <T extends unknown>(
  question: string | Breadcrumb,
  items: T[],
  initial?: T[] | number[],
  rows?: any[][] | ItemToRowMapFunction<T>,
  headers?: any[][] | RemapOf<T, string>,
  tableOptions?: TableOptions
): Promise<T[]> => askTableHandler(true, question, items, initial, rows, headers, tableOptions);
