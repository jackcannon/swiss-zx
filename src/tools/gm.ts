import { fn } from 'swiss-ak';
import { $$ } from './$$';
import * as gmUtils from './gm/utils';

const IS_DEBUG = false;

//<!-- DOCS: 400 -->
/**<!-- DOCS: gm ##! -->
 * gm
 */
export namespace gm {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

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

  /**<!-- DOCS: gm.convert ### -->
   * convert
   *
   * - `gm.convert`
   *
   * Wrapper function for gm (GraphicsMagick) convert command
   *
   * ```typescript
   * const converted = await gm.convert(input, output, {});
   * ```
   * @param {string} [inPath=PIPE]
   * @param {string} [outPath=PIPE]
   * @param {ConvertFlagsObj} [flags={}]
   * @returns {ProcessPromise}
   */
  export const convert = (inPath: string = PIPE, outPath: string = PIPE, flags: ConvertFlagsObj = {}): ProcessPromise => {
    const flagsArray = gmUtils.flagsObjToArray(flags);

    if (IS_DEBUG) console.log('CONVERT:', `gm convert ${flagsArray.join(' ')} ${inPath ? `"${inPath}"` : ''} ${outPath ? `"${outPath}"` : ''}`);

    return $`gm convert ${flagsArray} ${inPath} ${outPath}`;
  };

  /**<!-- DOCS: gm.ConvertFlagsObj #### -->
   * ConvertFlagsObj
   *
   * - `gm.ConvertFlagsObj`
   *
   * Options configuration for the `gm.convert` function
   *
   * Extends CommonFlagsObj
   */
  export interface ConvertFlagsObj extends CommonFlagsObj {
    'black-threshold'?: number;
    blur?: string;
    colorize?: string;
    crop?: string;
    fill?: string;
    flip?: boolean;
    flop?: boolean;
    stroke?: string;
    strokewidth?: number;
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

  /**<!-- DOCS: gm.composite ### -->
   * composite
   *
   * - `gm.composite`
   *
   * Wrapper function for gm (GraphicsMagick) composite command
   *
   * Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)
   *
   * ```typescript
   * const composited = await gm.composite(change, base, out, undefined, {});
   * ```
   * @param {string} [changePath=PIPE]
   * @param {string} [basePath=PIPE]
   * @param {string} [outPath=PIPE]
   * @param {string} [maskPath='']
   * @param {ChangeAndMaskFlags | CompositeFlagsObj} [flags={}]
   * @returns {ProcessPromise}
   */
  export const composite = (
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
        (p2, p3) => composite(p2, basePath, p3, undefined, { change: { compose: gmUtils.channelComposeCopyMap[channel] } }),
        (p3, pO) => composite(changePath, p3, pO, maskPath || changePath, { change: { displace: dBack, ...rest }, mask })
      ]);
    }

    const changeFlags = gmUtils.flagsObjToArray(change);
    const maskFlags = gmUtils.flagsObjToArray(mask);

    if (IS_DEBUG)
      console.log(
        'COMPOSITE:',
        `gm composite ${changeFlags.join(' ')} ${changePath ? `"${changePath}"` : ''} ${basePath ? `"${basePath}"` : ''} ${maskFlags.join(' ')} ${
          maskPath ? `"${maskPath}"` : ''
        } ${outPath ? `"${outPath}"` : ''}`
      );

    return $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
  };

  /**<!-- DOCS: gm.CompositeFlagsObj #### -->
   * CompositeFlagsObj
   *
   * - `gm.CompositeFlagsObj`
   *
   * Options configuration for the `gm.composite` function
   *
   * Extends CommonFlagsObj
   */
  export interface CompositeFlagsObj extends CommonFlagsObj {
    displace?: string;
    dissolve?: number;

    // TODO add to utils
    prism?: [channel, number | `${number}` | `${number}x${number}`] | string;
  }

  /**<!-- DOCS: gm.ChangeAndMaskFlags #### -->
   * ChangeAndMaskFlags
   *
   * - `gm.ChangeAndMaskFlags`
   *
   * If compositing with a mask, you can specify the change and mask flags separately
   *
   * ```typescript
   * {
   *   change?: CompositeFlagsObj;
   *   mask?: CompositeFlagsObj;
   * }
   * ```
   */
  export interface ChangeAndMaskFlags {
    change?: CompositeFlagsObj;
    mask?: CompositeFlagsObj;
  }

  /**<!-- DOCS: gm.pipe ### -->
   * pipe
   *
   * - `gm.pipe`
   *
   * Pipe a series of gm commands together
   *
   * > WARNING: If inPath is provided, it will be piped in to first process
   * > WARNING: If outPath is provided, it will be piped out from last process
   *
   * ```typescript
   * await pipe(basePath, outPath, [
   *   (p) => convert(p, p, opts1),
   *   (p) => composite(changePath, p, p, changePath, opts2)
   * ]);
   * await pipe(undefined, undefined, [
   *   (p) => convert(basePath, p, opts1),
   *   (p) => composite(changePath, p, outPath, changePath, opts2)
   * ]);
   * ```
   * @param {string} [inPath]
   * @param {string} [outPath]
   * @param {((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[]} [processes=[]]
   * @returns {ProcessPromise}
   */
  export const pipe = (
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

  /**<!-- DOCS: gm.PIPE_constant ### -->
   * PIPE
   *
   * - `gm.PIPE`
   *
   * A shortcut constant for the GraphicsMagick pipe path which is `MIFF:-`
   *
   * This can be used in place any path parameter to pipe the result of a gm command to another gm command
   */
  export const PIPE = 'MIFF:-';

  // TODO docs
  export namespace prefixes {
    // TODO docs - Draws text on a canvas image with size specified by -size canvas color as specified by -background' (default white), and text stroke and fill colors as specified by `-stroke and -fill. Capable of supporting multi-line text.
    export const CAPTION = 'CAPTION:';

    // TODO docs
    export const caption = (text: string) => CAPTION + text;

    // TODO docs - Returns a rendered gradient image using the specified image size. Specify the desired shading as part of the filename. For example: gradient:red-blue or gradient:#F00-#00F
    export const GRADIENT = 'GRADIENT:';

    // TODO docs
    export const gradient = (fromColour: string, toColour: string) => `${GRADIENT}${fromColour}-${toColour}`;

    // TODO docs - Generate an RGB histogram of the input image. The output format is always ImageMagick MIFF (regardless of file extension). For example: gm convert file.tiff histogram:file.miff
    export const HISTOGRAM = 'HISTOGRAM:';

    // TODO docs
    export const histogram = (path: string) => `${HISTOGRAM}${path}`;

    // TODO docs  - Specify the desired text as the filename (e.g. "label:This is a label").
    export const LABEL = 'LABEL:';

    // TODO docs
    export const label = (text: string) => `${LABEL}${text}`;

    // TODO docs - Create a tiled version of an image at by tiling a image. Use -size to specify the tiled image size. The image is specified similar to "TILE:image.miff". For example: gm convert -size 800x600 tile:image.jpg out.jpg
    export const TILE = 'TILE:';

    // TODO docs
    export const tile = (path: string) => TILE + path;

    // TODO docs - Useful to create solid color "canvas" images. Use -size and -depth to specify the image width, height, and depth. Example XC color specifications include "XC:red" and "XC:# FF0000". See the color reference for the numeric values used for named colors. For example: gm convert -size 640x480 xc:red red.jpg
    export const XC = 'XC:';

    // TODO docs
    export const xc = (colour: string) => `${XC}${colour}`;

    // TODO docs
    export const COLOUR = XC;

    // TODO docs
    export const colour = xc;
  }

  /**<!-- DOCS: gm.Types ### -->
   * Types
   */
  /**<!-- DOCS: gm.CommonFlagsObj #### -->
   * CommonFlagsObj
   *
   * - `gm.CommonFlagsObj`
   *
   * Option configuration options that are common to both `gm.convert` and `gm.composite`
   */
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

  /**<!-- DOCS: gm.FlagsObj #### -->
   * FlagsObj
   *
   * - `gm.FlagsObj`
   *
   * `ConvertFlagsObj & CompositeFlagsObj`
   */
  export type FlagsObj = ConvertFlagsObj & CompositeFlagsObj;

  /**<!-- DOCS: gm.channel #### -->
   * channel
   *
   * - `gm.channel`
   *
   * `'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte'`
   */
  export type channel = 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte';

  /**<!-- DOCS-ALIAS: gm.utils -->*/
  export namespace utils {
    /**<!-- DOCS-ALIAS: gm.utils.flagsObjToArray -->*/
    export const flagsObjToArray = gmUtils.flagsObjToArray;

    /**<!-- DOCS-ALIAS: gm.utils.supportedFlags -->*/
    export const supportedFlags = gmUtils.supportedFlags;

    /**<!-- DOCS-ALIAS: gm.utils.channelComposeCopyMap -->*/
    export const channelComposeCopyMap = gmUtils.channelComposeCopyMap;

    /**<!-- DOCS-ALIAS: gm.utils.GMCommand -->*/
    export type GMCommand = gmUtils.GMCommand;

    /**<!-- DOCS-ALIAS: gm.utils.SupportedFlag -->*/
    export type SupportedFlag = gmUtils.SupportedFlag;
  }
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
