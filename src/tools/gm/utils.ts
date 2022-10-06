import { fn } from 'swiss-ak';
import { FlagsObj } from '../gm';

type GMCommand = 'convert' | 'composite';

export interface SupportedFlag {
  name: string;
  type: 'string' | 'number' | 'boolean';
  commands: GMCommand[];
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
    commands: ['convert'],
    description: 'pixels below the threshold become black',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  blur: {
    name: 'blur',
    type: 'string',
    commands: ['convert'],
    description: 'blur the image',
    hint: 'radiusxsigma'
  },
  colorize: {
    name: 'colorize',
    type: 'string',
    commands: ['convert'],
    description: 'colorize the image with the fill color',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  compose: {
    name: 'compose',
    type: 'string',
    commands: ['convert', 'composite'],
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
  crop: {
    name: 'crop',
    type: 'string',
    commands: ['convert'],
    description: 'crop the image',
    hint: 'WxH+X+Y (e.g. 100x100+10+10)'
  },
  displace: {
    name: 'displace',
    type: 'string',
    commands: ['composite'],
    description: 'shift image pixels as defined by a displacement map',
    hint: '<horizontal scale>x<vertical scale>'
  },
  dissolve: {
    name: 'dissolve',
    type: 'number',
    commands: ['composite'],
    description: 'dissolve an image into another by the given percent',
    hint: '%'
  },
  fill: {
    name: 'fill',
    type: 'string',
    commands: ['convert'],
    description: 'fill color to use',
    hint: 'colour'
  },
  flip: {
    name: 'flip',
    type: 'boolean',
    commands: ['convert'],
    description: 'create a "mirror image" - vertical'
  },
  flop: {
    name: 'flop',
    type: 'boolean',
    commands: ['convert'],
    description: 'create a "mirror image" - horizontal'
  },
  geometry: {
    name: 'geometry',
    type: 'string',
    commands: ['convert', 'composite'],
    description: 'Specify dimension, offset, and resize options.',
    hint: '<width>x<height>{+-}<x>{+-}<y>{%}{@}{!}{^}{<}{>} e.g. 100x100+10+10, +10+10'
  },
  gravity: {
    name: 'gravity',
    type: 'string',
    commands: ['convert', 'composite'],
    options: ['Center', 'North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'],
    canOverrideOpts: false,
    description: 'direction primitive gravitates to when annotating the image.'
  },
  monochrome: {
    name: 'monochrome',
    type: 'boolean',
    commands: ['convert', 'composite'],
    description: 'transform the image to black and white'
  },
  negate: {
    name: 'negate',
    type: 'boolean',
    commands: ['convert', 'composite'],
    description: 'replace every pixel with its complementary color'
  },
  quality: {
    name: 'quality',
    type: 'number',
    commands: ['convert', 'composite'],
    description: 'JPEG/MIFF/PNG/TIFF compression level',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  resize: {
    name: 'resize',
    type: 'string',
    commands: ['convert', 'composite'],
    description: 'resize an image',
    hint: '<width>x<height>{%}{@}{!}{<}{>} e.g. 100x200'
  },
  rotate: {
    name: 'rotate',
    type: 'number',
    commands: ['convert', 'composite'],
    // options: ['90', '180', '270'],
    description: 'rotate the image - clockwise',
    hint: 'degrees (0-360)'
  },
  size: {
    name: 'size',
    type: 'string',
    commands: ['convert', 'composite'],
    description: 'width and height of the image',
    hint: '<width>x<height>'
  },
  threshold: {
    name: 'threshold',
    type: 'number',
    commands: ['convert'],
    description: 'pixels above the threshold become white, pixels below the threshold become black',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  'white-threshold': {
    name: 'white-threshold',
    type: 'number',
    commands: ['convert'],
    description: 'pixels above the threshold become white',
    hint: '%',
    processOutput: (value) => `${value}%`
  },
  modulate: {
    name: 'modulate',
    type: 'string',
    commands: ['convert'],
    description: 'modulate the brightness, saturation, and hue of an image',
    hint: 'brightness[,saturation[,hue]]'
  },
  brightness: {
    name: 'brightness',
    type: 'number',
    commands: ['convert'],
    description: 'brightness of the image (uses and is overriden by modulate)',
    hint: '%'
  },
  saturation: {
    name: 'saturation',
    type: 'number',
    commands: ['convert'],
    description: 'saturation of the image (uses and is overriden by modulate)',
    hint: '%'
  },
  hue: {
    name: 'hue',
    type: 'number',
    commands: ['convert'],
    description: 'hue of the image (uses and is overriden by modulate)',
    hint: '%'
  }
};

/**
 * gm.utils.flagsObjToArray
 *
 * Converts a FlagsObj to an array of flags and values (for zx).
 */
const flagsObjToArray = (obj: FlagsObj) => {
  const { brightness, saturation, hue, ...rest } = obj;

  if (rest.modulate === undefined && (brightness !== undefined || saturation !== undefined || hue !== undefined)) {
    rest.modulate = `${brightness ?? 100},${saturation ?? 100},${hue ?? 100}`;
  }

  return Object.entries(obj)
    .filter(([name, value]) => value !== undefined && value !== null && value !== false)
    .map(([name, value]) => ['-' + name, (supportedFlags[name]?.processOutput || fn.noact)(value)])
    .flat()
    .filter((x) => x !== undefined && x !== true);
};

export const gmUtils = {
  supportedFlags,
  flagsObjToArray
};
