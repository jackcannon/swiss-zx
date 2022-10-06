import { ArrayUtils, ProgressBarOptions } from 'swiss-ak';

import { truncate } from './out';

/**
 * getColouredProgressBarOpts
 *
 * Helper for providing a consistent set of options for a progress bar, and colouring them appropriately
 */
const getColouredProgressBarOpts = (opts: ProgressBarOptions, randomise: boolean = false) => {
  // let wrapperFns = [chalk.blueBright, chalk.cyanBright, chalk.greenBright, chalk.yellowBright, chalk.magentaBright, chalk.redBright];
  // let wrapperFns = [chalk.yellowBright, chalk.magenta];
  let wrapperFns = [chalk.yellowBright, chalk.magenta, chalk.blueBright, chalk.cyanBright, chalk.greenBright, chalk.redBright];
  if (randomise) {
    wrapperFns = ArrayUtils.randomise(wrapperFns);
  }
  let index = 0;
  return (prefix: string = '', override: ProgressBarOptions = {}, resetColours: boolean = false): ProgressBarOptions => {
    if (resetColours) {
      index = 0;
    }
    const result = {
      ...opts,
      prefix,
      ...override
    };
    if (!result.wrapperFn) {
      result.wrapperFn = wrapperFns[index % wrapperFns.length];
      index++;
    }

    if (result.prefix && result.prefixWidth) {
      result.prefix = truncate(result.prefix, result.prefixWidth, '…');
    }

    return result;
  };
};

export const progressBarUtils = {
  getColouredProgressBarOpts
};
