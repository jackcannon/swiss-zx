import { gmUtils } from './gm/utils';

export interface CommonFlagsObj {
  compose?: string;
  geometry?: string;
  gravity?: string;
  monochrome?: boolean;
  negate?: boolean;
  quality?: number;
  resize?: string;
  rotate?: number;
  size?: string;
}

export interface ConvertFlagsObj extends CommonFlagsObj {
  'black-threshold'?: number;
  blur?: string;
  colorize?: string;
  crop?: string;
  fill?: string;
  flip?: boolean;
  flop?: boolean;
  threshold?: number;
  'white-threshold'?: number;

  // TODO add to utils
  format?: string;
  bordercolor?: string;
  border?: number;
  fuzz?: string;
  transparent?: string;

  modulate?: string;
  /** brightness - shortcut/alias for `-modulate x,100,100` */
  brightness?: number;
  /** saturation - shortcut/alias for `-modulate 100,x,100` */
  saturation?: number;
  /** hue - shortcut/alias for `-modulate 100,100,x` */
  hue?: number;
}

export interface CompositeFlagsObj extends CommonFlagsObj {
  displace?: string;
  dissolve?: number;
}

export type FlagsObj = ConvertFlagsObj & CompositeFlagsObj;

interface ChangeAndMaskFlags {
  change?: CompositeFlagsObj;
  mask?: CompositeFlagsObj;
}

const formaliseCompositeFlags = (flags: ChangeAndMaskFlags | CompositeFlagsObj): ChangeAndMaskFlags => {
  const hasObjs = Object.values(flags).some((val) => typeof val === 'object');

  if (hasObjs) {
    const comp = flags as ChangeAndMaskFlags;
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
const convert = async (inPath: string, outPath: string, flags: ConvertFlagsObj = {}): Promise<ProcessOutput> => {
  const flagsArray = gmUtils.flagsObjToArray(flags);
  return await $`gm convert ${flagsArray} ${inPath} ${outPath} | cat`;
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
  flags: ChangeAndMaskFlags | CompositeFlagsObj = {}
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

  const changeFlags = gmUtils.flagsObjToArray(change);
  const maskFlags = gmUtils.flagsObjToArray(mask);

  return await $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};

// TODO docs
// convert piped to composite (allows for applying convert flags to the change image)
const pipe = async (
  changePath: string,
  basePath: string,
  outPath: string = basePath,
  maskPath: string = '',
  convertFlags: ConvertFlagsObj = {},
  compositeFlags: ChangeAndMaskFlags | CompositeFlagsObj = {}
) => {
  const { change, mask } = formaliseCompositeFlags(compositeFlags);

  const chngFlags = gmUtils.flagsObjToArray(change);
  const maskFlags = gmUtils.flagsObjToArray(mask);
  const convFlags = gmUtils.flagsObjToArray(convertFlags);

  return await $`gm convert ${convFlags} ${changePath} MIFF:- | gm composite ${chngFlags} MIFF:- ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};

export const gm = {
  convert,
  composite,
  pipe,
  utils: gmUtils
};
