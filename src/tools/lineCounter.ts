import { getLogStr } from './LogUtils';
import { moveUp } from './out';

export type lines = number;

export const getLineCounter = () => {
  let lineCount: lines = 0;

  return {
    log(...args: any[]): lines {
      const added = args.map(getLogStr).join(' ').split('\n').length;
      lineCount += added;
      console.log(...args);
      return added;
    },

    wrap: <A extends unknown[], T extends unknown>(newLines: lines = 1, func: (...args: A) => T, ...args: A): T => {
      lineCount += newLines;
      return func(...args);
    },

    add(newLines: lines): lines {
      lineCount += newLines;
      return lineCount;
    },

    get(): lines {
      return lineCount;
    },

    clear(): lines {
      moveUp(lineCount);
      lineCount = 0;
      return lineCount;
    }
  };
};
