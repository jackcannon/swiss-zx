import { getLineCounter } from './lineCounter';
import { getLogStr } from './LogUtils';
import { table } from './table';
import * as out from './out';
import { ask } from './ask';
import { arrayToNLList } from '../utils/arrayToNLList';
import * as chlk from './chlk';
import { fn } from 'swiss-ak';

interface SupportedFlag {
  name: string;
  type: 'string' | 'number' | 'boolean';
  options?: string[];
  canOverrideOpts?: boolean;
  processOutput?: (value: any) => any;
  description: string;
  hint?: string;
}

/**
 * gm.utils.supportedFlags
 *
 * An object containing the supported flags and their types (or options).
 */
const supportedFlags: { [key: string]: SupportedFlag } = {
  'black-threshold': {
    name: 'black-threshold',
    type: 'number',
    description: 'pixels below the threshold become black',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  compose: {
    name: 'compose',
    type: 'string',
    options: [
      'Screen', // special case
      'Over',
      'In',
      'Out',
      'Atop',
      'Xor',
      'Plus',
      'Minus',
      'Add',
      'Subtract',
      'Difference',
      'Divide',
      'Multiply',
      'Bumpmap',
      'Copy',
      'CopyRed',
      'CopyGreen',
      'CopyBlue',
      'CopyOpacity',
      'CopyCyan',
      'CopyMagenta',
      'CopyYellow',
      'CopyBlack'
    ],
    canOverrideOpts: false,
    description: 'the type of image composition'
  },
  displace: {
    name: 'displace',
    type: 'string',
    description: 'shift image pixels as defined by a displacement map',
    hint: '<horizontal scale>x<vertical scale>'
  },
  dissolve: {
    name: 'dissolve',
    type: 'number',
    description: 'dissolve an image into another by the given percent',
    hint: '%'
  },
  flip: {
    name: 'flip',
    type: 'boolean',
    description: 'create a "mirror image" - vertical'
  },
  flop: {
    name: 'flop',
    type: 'boolean',
    description: 'create a "mirror image" - horizontal'
  },
  geometry: {
    name: 'geometry',
    type: 'string',
    description: 'Specify dimension, offset, and resize options.',
    hint: '<width>x<height>{+-}<x>{+-}<y>{%}{@}{!}{^}{<}{>} e.g. 100x100+10+10, +10+10'
  },
  gravity: {
    name: 'gravity',
    type: 'string',
    options: ['Center', 'North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'],
    canOverrideOpts: false,
    description: 'direction primitive gravitates to when annotating the image.'
  },
  monochrome: {
    name: 'monochrome',
    type: 'boolean',
    description: 'transform the image to black and white'
  },
  negate: {
    name: 'negate',
    type: 'boolean',
    description: 'replace every pixel with its complementary color'
  },
  quality: {
    name: 'quality',
    type: 'number',
    description: 'JPEG/MIFF/PNG/TIFF compression level',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  resize: {
    name: 'resize',
    type: 'string',
    description: 'resize an image',
    hint: '<width>x<height>{%}{@}{!}{<}{>} e.g. 100x200'
  },
  rotate: {
    name: 'rotate',
    type: 'number',
    // options: ['90', '180', '270'],
    description: 'rotate the image - clockwise',
    hint: 'degrees (0-360)'
  },
  size: {
    name: 'size',
    type: 'string',
    description: 'width and height of the image',
    hint: '<width>x<height>'
  },
  threshold: {
    name: 'threshold',
    type: 'number',
    description: 'pixels above the threshold become white, pixels below the threshold become black',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  'white-threshold': {
    name: 'white-threshold',
    type: 'number',
    description: 'pixels above the threshold become white',
    hint: '%',
    processOutput: (value) => `${value}%`
  }
};

interface FlagsObj {
  'black-threshold'?: number;
  compose?: string;
  displace?: string;
  dissolve?: number;
  flip?: boolean;
  flop?: boolean;
  geometry?: string;
  gravity?: string;
  monochrome?: boolean;
  negate?: boolean;
  quality?: number;
  resize?: string;
  rotate?: number;
  size?: string;
  threshold?: number;
  'white-threshold'?: number;
}

interface CompositeFlags {
  change?: FlagsObj;
  mask?: FlagsObj;
}

/**
 * gm.utils.printFlagsTable
 *
 * Prints a table of flags and their values.
 */
const printFlagsTable = (flagsObjArray: FlagsObj[], overrideHeader: string[][]): number => {
  const lc = getLineCounter();

  const hasFlags = Math.max(...flagsObjArray.map((flagsObj) => Object.keys(flagsObj).length)) === 0;
  const header = overrideHeader || [['Flag', ...flagsObjArray.map((v, i) => `#${i + 1}`)]];
  const bodyObjs = hasFlags ? [{ '[none]': '[none]' }] : flagsObjArray;
  const body = table.utils.concatRows(table.utils.objectsToTable(bodyObjs, {}));

  lc.add(
    table.print(body, header, {
      drawOuter: true,
      wrapperFn: chalk.white,
      transposeBody: true
    })
  );

  lc.log();
  return lc.get();
};

/**
 * gm.ask.flags
 *
 * Advanced input for choosing which flags to use.
 *
 * ```typescript
 * const flags = await gm.ask.flags('example');
 * ```
 */
const askFlags = async (name: string, previousFlagsObj: FlagsObj = {}) => {
  const selectedFlags = {
    ...previousFlagsObj
  };

  const runFlagInput = async () => {
    const lc = getLineCounter();
    lc.log(chalk.gray(`Flags selected for ${name}:`));
    lc.add(printFlagsTable([selectedFlags], [['Flag', 'Value']]));

    const selectedFlagNames = Object.keys(selectedFlags);
    const addableFlags = Object.keys(supportedFlags).filter((flag) => !selectedFlagNames.includes(flag));

    const options = [{ title: `Nothing - All Done for ${name}`, value: 'none' }];
    if (addableFlags.length > 0) {
      options.push({ title: 'Add another flag', value: 'add' });
    }
    if (selectedFlagNames.length > 0) {
      options.push(
        ...[
          { title: 'Change a flag value', value: 'change' },
          { title: 'Remove flag(s)', value: 'remove-many' },
          { title: 'Remove all flags', value: 'remove-all' }
        ]
      );
    }

    const actionType = await lc.wrap(1, () => ask.select(`${name}: What would you like to do next?`, options, 'add'));

    if (actionType === 'none') {
      out.moveUp(lc.get());
      return;
    }
    if (actionType === 'add' || actionType === 'change') {
      const opts = actionType === 'add' ? addableFlags : selectedFlagNames;
      const flagName = (await lc.wrap(1, () => ask.select(`${name}: What flag would you like to ${actionType}?`, opts))) + '';

      const flagConfig = supportedFlags[flagName];
      const { description, hint, processOutput } = flagConfig;
      const previousValue = selectedFlags[flagName] || previousFlagsObj[flagName];

      lc.log(chlk.gray3(`${flagName}: ${description}`));
      if (hint) lc.log(chlk.gray2(`		Hint: ${hint}`));

      const valueQuestion = `${name}: What value would you like for -${flagName} flag?`;
      let flagValue = undefined;
      if (flagConfig.options instanceof Array) {
        flagValue = await lc.wrap(1, () => ask.select(valueQuestion, flagConfig.options, previousValue));
      } else {
        if (flagConfig.type === 'string') {
          flagValue = (await lc.wrap(1, () => ask.text(valueQuestion, previousValue || ''))) || undefined;
        }
        if (flagConfig.type === 'number') {
          flagValue = await lc.wrap(1, () => ask.number(valueQuestion, previousValue || 0));
        }
        if (flagConfig.type === 'boolean') {
          flagValue = true;
        }
      }
      if (flagValue !== undefined) {
        selectedFlags[flagName] = flagValue;
      }
    }
    if (actionType === 'remove-many' || actionType === 'remove-all') {
      let flagNames = selectedFlagNames;
      if (actionType === 'remove-many') {
        flagNames = await lc.wrap(1, () => ask.multiselect(`${name}: Which flags would you like to remove?`, selectedFlagNames));
      }
      const flagsStr = actionType === 'remove-all' ? 'all' : arrayToNLList(flagNames);
      const confirmed = await lc.wrap(1, () => ask.boolean(`${name}: Are you sure you want to remove ${flagsStr}`));
      if (confirmed) {
        for (let flagName of flagNames) {
          selectedFlags[flagName] = undefined;
          delete selectedFlags[flagName];
        }
      }
    }

    lc.clear();
    await runFlagInput();
  };
  await runFlagInput();
  return selectedFlags;
};

/**
 * gm.utils.flagsObjToArray
 *
 * Converts a FlagsObj to an array of flags and values (for zx).
 */
const flagsObjToArray = (obj: FlagsObj) => {
  return Object.entries(obj)
    .map(([name, value]) => ['-' + name, (supportedFlags[name]?.processOutput || fn.noact)(value)])
    .flat()
    .filter((x) => x !== undefined && x !== true);
};

const formaliseCompositeFlags = (flags: CompositeFlags | FlagsObj): CompositeFlags => {
  const hasObjs = Object.values(flags).some((val) => typeof val === 'object');

  if (hasObjs) {
    const comp = flags as CompositeFlags;
    return {
      change: comp.change || {},
      mask: comp.mask || {}
    };
  }
  return {
    change: flags as FlagsObj,
    mask: {}
  };
};

/**
 * gm.convert
 *
 * Wrapper function for gm (GraphicsMagick) convert command
 *
 * ```typescript
 * const converted = await gm.convert(input, output, {});
 * ```
 */
const convert = async (inPath: string, outPath: string, flags: FlagsObj = {}): Promise<ProcessOutput> => {
  const flagsArray = flagsObjToArray(flags);
  return await $`gm convert ${flagsArray} ${inPath} ${outPath}`;
};

/**
 * gm.composite
 *
 * Wrapper function for gm (GraphicsMagick) composite command
 *
 * Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)
 *
 * ```typescript
 * const composited = await gm.composite(change, base, out, undefined, {});
 * ```
 */
const composite = async (
  changePath: string,
  basePath: string,
  outPath: string = basePath,
  maskPath: string = '',
  flags: CompositeFlags | FlagsObj = {}
): Promise<ProcessOutput> => {
  const { change, mask } = formaliseCompositeFlags(flags);

  // Screen is not supported by gm, but is the inverse of Multiply
  // Multiply = A*B
  // Screen = 1 - ((1 - A) * (1 - B))
  // Therefore, we can negate (invert) both the change and base images, multiply them, and then invert the result
  if (change.compose === 'Screen') {
    await convert(basePath, outPath, { negate: !change.negate });
    const result = await composite(changePath, outPath, outPath, maskPath, {
      change: {
        ...change,
        compose: 'Multiply',
        negate: !change.negate
      },
      mask
    });
    await convert(outPath, outPath, { negate: !change.negate });
    return result;
  }

  const changeFlags = flagsObjToArray(change);
  const maskFlags = flagsObjToArray(mask);

  return await $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};

export const gm = {
  convert,
  composite,
  ask: {
    flags: askFlags
  },
  utils: {
    supportedFlags,
    printFlagsTable,
    flagsObjToArray
  }
};
