import { ms, wait } from 'swiss-ak';

export const tryOr = async <T extends unknown, A extends unknown[]>(orValue: T, func: (...args: A) => Promise<T>, ...args: A): Promise<T> => {
  try {
    return await func(...args);
  } catch (err) {
    return orValue;
  }
};

export const retry = async (maxTries: number = 10, delay: ms = 0, suppress: boolean = true, run: Function = () => {}) => {
  const loop = async (attempt: number, lastErr?: Error) => {
    if (attempt >= maxTries) {
      if (!suppress) throw lastErr;
      return;
    }
    try {
      const result = await run(attempt);
      return result;
    } catch (err) {
      if (delay) await wait(delay);
      return await loop(attempt + 1, err);
    }
  };
  return await loop(0);
};
