import { getLogStr } from './LogUtils';
import { moveUp } from './out';

export type lines = number;

/**
 * getLineCounter
 *
 * Get line counter for counter output lines
 *
 * ```typescript
 * const lc = getLineCounter();
 * lc.log('hello'); // 1
 * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
 * lc.add(1); // 3
 * lc.get(); // 3
 * lc.clear(); // 0
 * ```
 */
export const getLineCounter = () => {
  let lineCount: lines = 0;

  return {
    /**
     * lc.log
     *
     * Same as console.log, but adds to the lc counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    log(...args: any[]): lines {
      const added = args.map(getLogStr).join(' ').split('\n').length;
      lineCount += added;
      console.log(...args);
      return added;
    },

    /**
     * lc.wrap
     *
     * Wraps a function, and adds a given number (of the result of the function) to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    wrap: <A extends unknown[], T extends unknown>(newLines: lines | undefined = 1, func: (...args: A) => T | number, ...args: A): T => {
      const result = func(...args);

      if (newLines === undefined) {
        const resultNum = Number(result);
        lineCount += Number.isNaN(resultNum) ? 1 : resultNum;
      } else {
        lineCount += newLines;
      }
      return result as T;
    },

    /**
     * lc.add
     *
     * Adds a given number to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    add(newLines: lines): lines {
      lineCount += newLines;
      return lineCount;
    },

    /**
     * lc.get
     *
     * returns the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    get(): lines {
      return lineCount;
    },

    /**
     * lc.clear
     *
     * clears the line counter, and moves the cursor up by the value of the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    clear(): lines {
      moveUp(lineCount);
      lineCount = 0;
      return lineCount;
    }
  };
};
