import { ms, result, wait } from 'swiss-ak';

export const tryOr = async <T extends unknown, A extends unknown[]>(orValue: T, func: (...args: A) => Promise<T>, ...args: A): Promise<T> => {
  try {
    return await func(...args);
  } catch (err) {
    return orValue;
  }
};

export const retry = async <T extends unknown>(
  maxTries: number = 10,
  delay: ms = 0,
  suppress: boolean = true,
  run: (attemptNumber) => T = result(undefined)
): Promise<T> => {
  const loop = async (attempt: number, lastErr?: Error): Promise<T> => {
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

export const retryOr = async <T extends unknown>(
  orValue: T,
  maxTries: number = 10,
  delay: ms = 0,
  suppress: boolean = true,
  run: () => T = result(orValue)
): Promise<T> => tryOr(orValue, () => retry(maxTries, delay, suppress, run));
