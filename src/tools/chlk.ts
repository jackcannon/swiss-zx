import { chalk } from 'zx';

/**
 * gray0
 *
 * Gray 0 (0-5). Equivalent to chalk.black
 */
export const gray0 = chalk.black;

/**
 * gray1
 *
 * Gray 1 (0-5). Equivalent to chalk.gray.dim
 */
export const gray1 = chalk.gray.dim;

/**
 * gray2
 *
 * Gray 2 (0-5). Equivalent to chalk.white.dim
 */
export const gray2 = chalk.white.dim;

/**
 * gray3
 *
 * Gray 3 (0-5). Equivalent to chalk.whiteBright.dim
 */
export const gray3 = chalk.whiteBright.dim;

/**
 * gray4
 *
 * Gray 4 (0-5). Equivalent to chalk.white
 */
export const gray4 = chalk.white;

/**
 * gray5
 *
 * Gray 5 (0-5). Equivalent to chalk.whiteBright
 */
export const gray5 = chalk.whiteBright;

/**
 * grays
 *
 * Grays between 0 and 5.
 *
 * ```typescript
 * grays[2]; // gray2
 * ```
 */
export const grays = [
  // grays
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5
];

/**
 * gray
 *
 * Grays between 0 and 5.
 *
 * ```typescript
 * gray(2); // gray2
 * ```
 */
export const gray = (num: number) => grays[Math.max(0, Math.min(num, grays.length - 1))];
