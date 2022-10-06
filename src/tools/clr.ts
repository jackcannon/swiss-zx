import { fn, ObjOfType } from 'swiss-ak';
import { chalk } from 'zx';

/**
 * gray0
 *
 * Gray 0 (0-5). Equivalent to chalk.black
 */
const gray0 = chalk.black;

/**
 * gray1
 *
 * Gray 1 (0-5). Equivalent to chalk.gray.dim
 */
const gray1 = chalk.gray.dim;

/**
 * gray2
 *
 * Gray 2 (0-5). Equivalent to chalk.white.dim
 */
const gray2 = chalk.white.dim;

/**
 * gray3
 *
 * Gray 3 (0-5). Equivalent to chalk.whiteBright.dim
 */
const gray3 = chalk.whiteBright.dim;

/**
 * gray4
 *
 * Gray 4 (0-5). Equivalent to chalk.white
 */
const gray4 = chalk.white;

/**
 * gray5
 *
 * Gray 5 (0-5). Equivalent to chalk.whiteBright
 */
const gray5 = chalk.whiteBright;

/**
 * grays
 *
 * Grays between 0 and 5.
 *
 * ```typescript
 * grays[2]; // gray2
 * ```
 */
const grays = [
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
const gray = (num: number) => grays[Math.max(0, Math.min(num, grays.length - 1))];

// Removes ANSI colours. Not same as chalk.reset
const clear = (str: string) => str.replace(new RegExp(`\\u001b\[[0-9]+m`, 'g'), '');

// Be careful how you use this
const not = (style: Function) => {
  const styled = style('**xxx**');
  const [after, before] = styled.split('**xxx**');
  return (item: string) => `${before}${item}${after}`;
};

const notUnderlined = not(chalk.underline);

export const chlk = {
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5,
  grays,
  gray,
  clear,
  not,
  notUnderlined
};

/**
 * clr
 *
 * A collection of shortcuts and aliases for chalk functions
 */
export const clr = {
  hl1: chalk.yellowBright.bold,
  hl2: chalk.yellow,
  approve: chalk.green.bold,
  create: chalk.greenBright.bold,
  update: chalk.yellow.bold,
  delete: chalk.redBright.bold,
  deleteAll: chalk.redBright.bold,

  blue: chalk.blueBright,
  cyan: chalk.cyanBright,
  green: chalk.greenBright,
  magenta: chalk.magentaBright,
  red: chalk.redBright,
  yellow: chalk.yellowBright,

  t1: chalk.yellowBright,
  t2: chalk.magentaBright,
  t3: chalk.blueBright,
  t4: chalk.redBright,
  t5: chalk.greenBright,
  t6: chalk.cyanBright,

  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5
};

export type Colour = keyof typeof clr;

// Note: inventing own syntax is a bad idea. Keeping this as a warning to future me.
// const getChalkFromColour = (origCol: string) => {
//   const colours = origCol.split('.').map((funcName) => funcName.replace(/B$/g, 'Bright'));
//   const funcs = colours.map((funcName) => chalk[funcName] || fn.noact);
//   return (text: string) => funcs.reduce((txt, func) => func(txt), text);
// };
// export const clr = (...str: any[]) =>
//   str
//     .map(fn.maps.toString)
//     .join(' ')
//     .replace(/\$([A-Za-z.]+?)\{(.+?)\}/g, (_subs: string, colour: string, text: string) => getChalkFromColour(colour)(text));
