import { inspect } from 'util';
import { chalk } from 'zx';
import { noact } from 'swiss-ak';

export const getLogStr = (item: any): string => {
  const inspectList = ['object', 'boolean', 'number'];
  if (inspectList.includes(typeof item) && !(item instanceof Date)) {
    return inspect(item, { colors: false, depth: null });
  } else {
    return item + '';
  }
};

export const processLogContents = (prefix: string, wrapper: Function = noact, ...args: any[]): string =>
  args
    .map(getLogStr)
    .join(' ')
    .split('\n')
    .map((line, index) => chalk.bold(index ? ' '.repeat(prefix.length) : prefix) + ' ' + wrapper(line))
    .join('\n');

export const getLog =
  (prefix: string, wrapper: Function = noact) =>
  (...args: any[]) => {
    console.log(processLogContents(prefix, wrapper, ...args));
  };
