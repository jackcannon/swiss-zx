import { fn } from 'swiss-ak';
import { $$ } from './$$';
import { gmUtils } from './gm/utils';

//<!-- DOCS: 400 -->
/**<!-- DOCS: gm ##! -->
 * gm
 */

const PIPE = 'MIFF:-';

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

  // TODO add to utils
  font?: string;
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
  pointsize?: number;
  draw?: string;
  channel?: string; // TODO set strict options (e.g. 'red')

  modulate?: string;
  /** brightness - shortcut/alias for `-modulate x,100,100` */
  brightness?: number;
  /** saturation - shortcut/alias for `-modulate 100,x,100` */
  saturation?: number;
  /** hue - shortcut/alias for `-modulate 100,100,x` */
  hue?: number;
}

type channel = 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte';

const channelComposeCopyMap: { [key in channel]: string } = {
  red: 'CopyRed',
  green: 'CopyGreen',
  blue: 'CopyBlue',
  cyan: 'CopyCyan',
  magenta: 'CopyMagenta',
  yellow: 'CopyYellow',
  black: 'CopyBlack',
  opacity: 'CopyOpacity',
  gray: 'Copy',
  matte: 'Copy'
};

export interface CompositeFlagsObj extends CommonFlagsObj {
  displace?: string;
  dissolve?: number;

  // TODO add to utils
  prism?: [channel, number | `${number}` | `${number}x${number}`] | string;
}

export type FlagsObj = ConvertFlagsObj & CompositeFlagsObj;

interface ChangeAndMaskFlags {
  change?: CompositeFlagsObj;
  mask?: CompositeFlagsObj;
}

const formaliseCompositeFlags = (flags: ChangeAndMaskFlags | CompositeFlagsObj): ChangeAndMaskFlags => {
  const hasObjs = Object.values(flags).some((val) => typeof val === 'object' && !(val instanceof Array));

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

/**<!-- DOCS: gm.convert ### @ -->
 * convert
 *
 * Wrapper function for gm (GraphicsMagick) convert command
 *
 * ```typescript
 * const converted = await gm.convert(input, output, {});
 * ```
 */
const convert = (inPath: string = PIPE, outPath: string = PIPE, flags: ConvertFlagsObj = {}): ProcessPromise => {
  const flagsArray = gmUtils.flagsObjToArray(flags);
  return $`gm convert ${flagsArray} ${inPath} ${outPath}`;
};

/**<!-- DOCS: gm.composite ### @ -->
 * composite
 *
 * Wrapper function for gm (GraphicsMagick) composite command
 *
 * Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)
 *
 * ```typescript
 * const composited = await gm.composite(change, base, out, undefined, {});
 * ```
 */
const composite = (
  changePath: string = PIPE,
  basePath: string = PIPE,
  outPath: string = PIPE,
  maskPath: string = '',
  flags: ChangeAndMaskFlags | CompositeFlagsObj = {}
): ProcessPromise => {
  const { change, mask } = formaliseCompositeFlags(flags);

  // Screen is not supported by gm, but is the inverse of Multiply
  // Multiply = A*B
  // Screen = 1 - ((1 - A) * (1 - B))
  // Therefore, we can negate (invert) both the change and base images, multiply them, and then invert the result
  if (change.compose === 'Screen') {
    return convert(basePath, PIPE, { negate: !change.negate })
      .pipe(
        composite(changePath, PIPE, PIPE, maskPath, {
          change: {
            ...change,
            compose: 'Multiply',
            negate: !change.negate
          },
          mask
        })
      )
      .pipe(convert(PIPE, outPath, { negate: !change.negate }));
  }

  if (change.prism) {
    const { prism, ...rest } = change;

    const prismStrs = prism instanceof Array ? prism.map(fn.toString) : prism.split(',').map((str) => str.trim());
    const [channel, amount] = [...['red', ...prismStrs].slice(-2), '1x0'].slice(0, 2) as [string, string];

    const values = [...(typeof amount === 'string' ? amount.split('x').map(Number) : [amount]), 0].slice(0, 2);

    const dForw = values.map((x) => x * 2).join('x');
    const dBack = values.map((x) => x * -1).join('x');

    return pipe(basePath, outPath, [
      (pI, p1) => convert(pI, p1, { channel }),
      (p1, p2) => composite(changePath, p1, p2, maskPath || changePath, { change: { displace: dForw, ...rest }, mask }),
      (p2, p3) => composite(p2, basePath, p3, undefined, { change: { compose: channelComposeCopyMap[channel] } }),
      (p3, pO) => composite(changePath, p3, pO, maskPath || changePath, { change: { displace: dBack, ...rest }, mask })
    ]);
  }

  const changeFlags = gmUtils.flagsObjToArray(change);
  const maskFlags = gmUtils.flagsObjToArray(mask);

  return $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};

// TODO docs
const pipe = (
  inPath?: string,
  outPath?: string,
  processes: ((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[] = []
): ProcessPromise => {
  const withIO = [...processes];

  if (inPath) withIO.unshift((p) => gm.convert(inPath, p, {}));
  if (outPath) withIO.push((p) => gm.convert(p, outPath, {}));

  const mapped = withIO.map((fn) => (index: number, arg?: any) => fn(PIPE, PIPE, index));

  return $$.pipe(mapped);
};

// TODO docs
// const pipe = (
//   changePath: string,
//   basePath: string,
//   outPath: string = basePath,
//   maskPath: string = '',
//   convertFlags: ConvertFlagsObj = {},
//   compositeFlags: ChangeAndMaskFlags | CompositeFlagsObj = {}
// ): ProcessPromise => {
//   const { change, mask } = formaliseCompositeFlags(compositeFlags);

//   const chngFlags = gmUtils.flagsObjToArray(change);
//   const maskFlags = gmUtils.flagsObjToArray(mask);
//   const convFlags = gmUtils.flagsObjToArray(convertFlags);

//   return $`gm convert ${convFlags} ${changePath} MIFF:- | gm composite ${chngFlags} MIFF:- ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
// };

export const gm = {
  PIPE,
  convert,
  composite,
  pipe,
  utils: gmUtils
};
