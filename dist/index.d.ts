import * as zx from 'zx';
import * as swiss_ak from 'swiss-ak';
import { ms, ProgressBarOptions, Partial as Partial$1, second } from 'swiss-ak';
import * as chalk from 'chalk';

interface ExifToolAttributesObj {
    ExifToolVersion?: string;
    FileName?: string;
    Directory?: string;
    FileSize?: string;
    FileModifyDate?: string;
    FileAccessDate?: string;
    FileInodeChangeDate?: string;
    FilePermissions?: string;
    FileType?: string;
    FileTypeExtension?: string;
    MIMEType?: string;
    JFIFVersion?: string;
    ExifByteOrder?: string;
    ImageDescription?: string;
    Make?: string;
    Model?: string;
    XResolution?: string;
    YResolution?: string;
    ResolutionUnit?: string;
    Software?: string;
    ModifyDate?: string;
    Artist?: string;
    Copyright?: string;
    ExposureTime?: string;
    FNumber?: string;
    ExposureProgram?: string;
    ISO?: string;
    SensitivityType?: string;
    RecommendedExposureIndex?: string;
    ExifVersion?: string;
    DateTimeOriginal?: string;
    CreateDate?: string;
    OffsetTime?: string;
    OffsetTimeOriginal?: string;
    OffsetTimeDigitized?: string;
    ShutterSpeedValue?: string;
    ApertureValue?: string;
    ExposureCompensation?: string;
    MeteringMode?: string;
    LightSource?: string;
    Flash?: string;
    FocalLength?: string;
    SubSecTimeOriginal?: string;
    SubSecTimeDigitized?: string;
    ColorSpace?: string;
    FocalPlaneXResolution?: string;
    FocalPlaneYResolution?: string;
    FocalPlaneResolutionUnit?: string;
    SensingMethod?: string;
    FileSource?: string;
    SceneType?: string;
    CFAPattern?: string;
    CustomRendered?: string;
    ExposureMode?: string;
    WhiteBalance?: string;
    FocalLengthIn35mmFormat?: string;
    SceneCaptureType?: string;
    GainControl?: string;
    Contrast?: string;
    Saturation?: string;
    Sharpness?: string;
    SubjectDistanceRange?: string;
    SerialNumber?: string;
    LensInfo?: string;
    LensMake?: string;
    LensModel?: string;
    LensSerialNumber?: string;
    Compression?: string;
    ThumbnailOffset?: string;
    ThumbnailLength?: string;
    DisplayedUnitsX?: string;
    DisplayedUnitsY?: string;
    CurrentIPTCDigest?: string;
    CodedCharacterSet?: string;
    EnvelopeRecordVersion?: string;
    ApplicationRecordVersion?: string;
    ObjectName?: string;
    TimeCreated?: string;
    DigitalCreationDate?: string;
    DigitalCreationTime?: string;
    'By-line'?: string;
    CopyrightNotice?: string;
    'Caption-Abstract'?: string;
    CopyrightFlag?: string;
    PhotoshopThumbnail?: string;
    IPTCDigest?: string;
    Warning?: string;
    ProfileCMMType?: string;
    ProfileVersion?: string;
    ProfileClass?: string;
    ColorSpaceData?: string;
    ProfileConnectionSpace?: string;
    ProfileDateTime?: string;
    ProfileFileSignature?: string;
    PrimaryPlatform?: string;
    CMMFlags?: string;
    DeviceManufacturer?: string;
    DeviceModel?: string;
    DeviceAttributes?: string;
    RenderingIntent?: string;
    ConnectionSpaceIlluminant?: string;
    ProfileCreator?: string;
    ProfileID?: string;
    ProfileCopyright?: string;
    ProfileDescription?: string;
    MediaWhitePoint?: string;
    MediaBlackPoint?: string;
    RedMatrixColumn?: string;
    GreenMatrixColumn?: string;
    BlueMatrixColumn?: string;
    DeviceMfgDesc?: string;
    DeviceModelDesc?: string;
    ViewingCondDesc?: string;
    ViewingCondIlluminant?: string;
    ViewingCondSurround?: string;
    ViewingCondIlluminantType?: string;
    Luminance?: string;
    MeasurementObserver?: string;
    MeasurementBacking?: string;
    MeasurementGeometry?: string;
    MeasurementFlare?: string;
    MeasurementIlluminant?: string;
    Technology?: string;
    RedTRC?: string;
    GreenTRC?: string;
    BlueTRC?: string;
    XMPToolkit?: string;
    CreatorWorkURL?: string;
    ImageNumber?: string;
    LateralChromaticAberrationCorrectionAlreadyApplie?: string;
    Lens?: string;
    Creator?: string;
    Description?: string;
    Format?: string;
    Rights?: string;
    Title?: string;
    ColorClass?: string;
    PMVersion?: string;
    Prefs?: string;
    Tagged?: string;
    DateCreated?: string;
    DocumentAncestors?: string;
    CreatorTool?: string;
    Label?: string;
    MetadataDate?: string;
    DerivedFromDocumentID?: string;
    DerivedFromInstanceID?: string;
    DerivedFromOriginalDocumentID?: string;
    DocumentID?: string;
    HistoryAction?: string;
    HistoryParameters?: string;
    HistoryChanged?: string;
    HistoryInstanceID?: string;
    HistorySoftwareAgent?: string;
    HistoryWhen?: string;
    InstanceID?: string;
    OriginalDocumentID?: string;
    PreservedFileName?: string;
    Marked?: string;
    AlreadyApplied?: string;
    AutoLateralCA?: string;
    Blacks2012?: string;
    BlueHue?: string;
    BlueSaturation?: string;
    CameraProfile?: string;
    CameraProfileDigest?: string;
    Clarity2012?: string;
    ColorGradeBlending?: string;
    ColorGradeGlobalHue?: string;
    ColorGradeGlobalLum?: string;
    ColorGradeGlobalSat?: string;
    ColorGradeHighlightLum?: string;
    ColorGradeMidtoneHue?: string;
    ColorGradeMidtoneLum?: string;
    ColorGradeMidtoneSat?: string;
    ColorGradeShadowLum?: string;
    ColorNoiseReduction?: string;
    Contrast2012?: string;
    ConvertToGrayscale?: string;
    CropAngle?: string;
    CropBottom?: string;
    CropConstrainToWarp?: string;
    CropLeft?: string;
    CropRight?: string;
    CropTop?: string;
    DefringeGreenAmount?: string;
    DefringeGreenHueHi?: string;
    DefringeGreenHueLo?: string;
    DefringePurpleAmount?: string;
    DefringePurpleHueHi?: string;
    DefringePurpleHueLo?: string;
    Dehaze?: string;
    Exposure2012?: string;
    GrainAmount?: string;
    GreenHue?: string;
    GreenSaturation?: string;
    HasCrop?: string;
    HasSettings?: string;
    Highlights2012?: string;
    HueAdjustmentAqua?: string;
    HueAdjustmentBlue?: string;
    HueAdjustmentGreen?: string;
    HueAdjustmentMagenta?: string;
    HueAdjustmentOrange?: string;
    HueAdjustmentPurple?: string;
    HueAdjustmentRed?: string;
    HueAdjustmentYellow?: string;
    IncrementalTemperature?: string;
    IncrementalTint?: string;
    LensManualDistortionAmount?: string;
    LensProfileEnable?: string;
    LuminanceAdjustmentAqua?: string;
    LuminanceAdjustmentBlue?: string;
    LuminanceAdjustmentGreen?: string;
    LuminanceAdjustmentMagenta?: string;
    LuminanceAdjustmentOrange?: string;
    LuminanceAdjustmentPurple?: string;
    LuminanceAdjustmentRed?: string;
    LuminanceAdjustmentYellow?: string;
    LuminanceSmoothing?: string;
    OverrideLookVignette?: string;
    ParametricDarks?: string;
    ParametricHighlightSplit?: string;
    ParametricHighlights?: string;
    ParametricLights?: string;
    ParametricMidtoneSplit?: string;
    ParametricShadowSplit?: string;
    ParametricShadows?: string;
    PerspectiveAspect?: string;
    PerspectiveHorizontal?: string;
    PerspectiveRotate?: string;
    PerspectiveScale?: string;
    PerspectiveUpright?: string;
    PerspectiveVertical?: string;
    PerspectiveX?: string;
    PerspectiveY?: string;
    PostCropVignetteAmount?: string;
    ProcessVersion?: string;
    RawFileName?: string;
    RedHue?: string;
    RedSaturation?: string;
    SaturationAdjustmentAqua?: string;
    SaturationAdjustmentBlue?: string;
    SaturationAdjustmentGreen?: string;
    SaturationAdjustmentMagenta?: string;
    SaturationAdjustmentOrange?: string;
    SaturationAdjustmentPurple?: string;
    SaturationAdjustmentRed?: string;
    SaturationAdjustmentYellow?: string;
    ShadowTint?: string;
    Shadows2012?: string;
    SplitToningBalance?: string;
    SplitToningHighlightHue?: string;
    SplitToningHighlightSaturation?: string;
    SplitToningShadowHue?: string;
    SplitToningShadowSaturation?: string;
    Texture?: string;
    ToneCurveName2012?: string;
    ToneCurvePV2012?: string;
    ToneCurvePV2012Blue?: string;
    ToneCurvePV2012Green?: string;
    ToneCurvePV2012Red?: string;
    Version?: string;
    Vibrance?: string;
    VignetteAmount?: string;
    Whites2012?: string;
    ImageWidth?: string;
    ImageHeight?: string;
    EncodingProcess?: string;
    BitsPerSample?: string;
    ColorComponents?: string;
    YCbCrSubSampling?: string;
    Aperture?: string;
    ImageSize?: string;
    Megapixels?: string;
    ScaleFactor35efl?: string;
    ShutterSpeed?: string;
    SubSecCreateDate?: string;
    SubSecDateTimeOriginal?: string;
    SubSecModifyDate?: string;
    ThumbnailImage?: string;
    DateTimeCreated?: string;
    DigitalCreationDateTime?: string;
    CircleOfConfusion?: string;
    FOV?: string;
    FocalLength35efl?: string;
    HyperfocalDistance?: string;
    LightValue?: string;
    LensID?: string;
    [anykey: string]: string;
}

declare type FindType = 'd' | 'f' | 'b' | 'c' | 'l' | 'p' | 's';
interface FindOptions {
    /**
     * Type of item to find
     *
     * * d = directory
     * * f = regular file
     * * b = block special
     * * c = character special
     * * l = symbolic link
     * * p = FIFO
     * * s = socket
     */
    type?: FindType;
    /**
     * TODO docs
     * Minimum depth to search
     */
    mindepth?: number;
    /**
     * Maximum depth to search
     */
    maxdepth?: number;
    /**
     * Name of file/directory to find
     */
    name?: string;
    /**
     * Regular expression to match
     *
     * IMPORTANT: use String.raw to make sure the backslashes are escaped
     *
     * ```typescript
     * const regex = String.raw`^.*\.js$` // '^.*\.js$'
     * ```
     */
    regex?: string;
    /**
     * If true, removes the path from the result (so you just get the file/directory name)
     */
    removePath?: boolean;
    /**
     * TODO docs
     */
    absolutePath?: boolean;
    /**
     * If true, ensures the provided path has a trailing slash.
     */
    contentsOnly?: boolean;
    /**
     * If true, removes trailing slashes from the results.
     */
    removeTrailingSlashes?: boolean;
    /**
     * If true, includes files that start with a dot.
     */
    showHidden?: boolean;
}

interface ExplodedPath {
    /**
     * The full original path as it was passed in.
     */
    path: string;
    /**
     * The directory path of the given path
     *
     * Note: no trailing slash
     */
    dir: string;
    /**
     * the ancestral folders of the given dir as an array
     */
    folders: string[];
    /**
     * the name of the file, not including the extension
     */
    name: string;
    /**
     * the extension of the file, not including the dot
     */
    ext: string;
    /**
     * the full name of the file, including the extension (and dot)
     */
    filename: string;
}
/**
 * explodePath
 *
 * TODO update docs for folders and path
 *
 * 'Explodes' a path into its components
 *
 * - dir: the directory path of the given path
 * - name: the name of the file, not including the extension
 * - ext: the extension of the file, not including the dot
 * - filename: the full name of the file, including the extension (and dot)
 *
 * ```typescript
 * const { dir, name, ext, filename } = explodePath('/path/to/file.txt');
 *
 * console.log(dir); // '/path/to'
 * console.log(name); // 'file'
 * console.log(ext); // 'txt'
 * console.log(filename); // 'file.txt'
 * ```
 */
declare const explodePath: (path: string) => ExplodedPath;

type PathUtils_ExplodedPath = ExplodedPath;
declare const PathUtils_explodePath: typeof explodePath;
declare namespace PathUtils {
  export {
    PathUtils_ExplodedPath as ExplodedPath,
    PathUtils_explodePath as explodePath,
  };
}

interface ModifiedFile extends ExplodedPath {
    lastModified: ms;
}
declare const $$: {
    cd: (dir?: string) => Promise<void>;
    pwd: () => Promise<string>;
    ls: (dir?: string, flags?: string[]) => Promise<string[]>;
    find: (dir?: string, options?: FindOptions) => Promise<string[]>;
    findDirs: (dir?: string, options?: FindOptions) => Promise<string[]>;
    findFiles: (dir?: string, options?: FindOptions) => Promise<string[]>;
    findModified: (dir?: string, options?: FindOptions) => Promise<ModifiedFile[]>;
    lastModified: (path: string) => Promise<number>;
    rm: (item: string) => zx.ProcessPromise;
    mkdir: (item: string) => zx.ProcessPromise;
    cp: (a: string, b: string) => zx.ProcessPromise;
    mv: (a: string, b: string) => zx.ProcessPromise;
    touch: (item: string) => zx.ProcessPromise;
    cat: (item: string) => zx.ProcessPromise;
    grep: (pattern: string, file: string) => Promise<string[]>;
    isFileExist: (file: string) => Promise<boolean>;
    isDirExist: (dir: string) => Promise<boolean>;
    readFile: (filepath: string) => Promise<string>;
    writeFile: (filepath: string, contents: string) => Promise<void>;
    readJSON: <T extends unknown>(filepath: string) => Promise<T>;
    writeJSON: <T_1 extends Object>(filepath: any, obj: T_1) => Promise<T_1>;
    rsync: (a: string, b: string, flags?: string[], progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    sync: (a: string, b: string, progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    exiftool: (file: string, setAttr?: ExifToolAttributesObj, getAttr?: (keyof ExifToolAttributesObj)[], outFile?: string) => Promise<ExifToolAttributesObj>;
    utils: {
        intoLines: (out: ProcessOutput) => string[];
        removeTrailSlash: (path: string) => string;
        trailSlash: (path: string) => string;
        removeDoubleSlashes: (path: string) => string;
    };
};

declare const chlk: {
    gray0: chalk.ChalkInstance;
    gray1: chalk.ChalkInstance;
    gray2: chalk.ChalkInstance;
    gray3: chalk.ChalkInstance;
    gray4: chalk.ChalkInstance;
    gray5: chalk.ChalkInstance;
    grays: chalk.ChalkInstance[];
    gray: (num: number) => chalk.ChalkInstance;
    clear: (str: string) => string;
    not: (style: Function) => (item: string) => string;
    notUnderlined: (item: string) => string;
};
/**
 * clr
 *
 * A collection of shortcuts and aliases for chalk functions
 */
declare const clr: {
    hl1: chalk.ChalkInstance;
    hl2: chalk.ChalkInstance;
    approve: chalk.ChalkInstance;
    create: chalk.ChalkInstance;
    update: chalk.ChalkInstance;
    delete: chalk.ChalkInstance;
    deleteAll: chalk.ChalkInstance;
    blue: chalk.ChalkInstance;
    cyan: chalk.ChalkInstance;
    green: chalk.ChalkInstance;
    magenta: chalk.ChalkInstance;
    red: chalk.ChalkInstance;
    yellow: chalk.ChalkInstance;
    t1: chalk.ChalkInstance;
    t2: chalk.ChalkInstance;
    t3: chalk.ChalkInstance;
    t4: chalk.ChalkInstance;
    t5: chalk.ChalkInstance;
    t6: chalk.ChalkInstance;
    gray0: chalk.ChalkInstance;
    gray1: chalk.ChalkInstance;
    gray2: chalk.ChalkInstance;
    gray3: chalk.ChalkInstance;
    gray4: chalk.ChalkInstance;
    gray5: chalk.ChalkInstance;
};
declare type Colour = keyof typeof clr;

/**
 * Breadcrumb
 *
 * Provides a consistent format and style for questions/prompts
 *
 * ```typescript
 * const bread = getBreadcrumb();
 * bread() // ''
 * bread('a') // 'a'
 * bread('a', 'b') // 'a › b'
 * bread('a', 'b', 'c') // 'a › b › c'
 *
 * const sub = bread.sub('a', 'b');
 * sub(); // 'a › b'
 * sub('c') // 'a › b › c'
 * sub('c', 'd') // 'a › b › c › d'
 *
 * const subsub = sub.sub('c', 'd');
 * subsub(); // 'a › b › c › d'
 * subsub('e'); // 'a › b › c › d › e'
 * ```
 */
declare type Breadcrumb = {
    (...tempNames: string[]): Breadcrumb;
    setColours: (colours: Colour[]) => void;
    add: (...names: string[]) => number;
    getNames: (...tempNames: string[]) => any[];
    sub: (...tempNames: string[]) => Breadcrumb;
    get(...tempNames: string[]): string;
    toString(): string;
};
/**
 * getBreadcrumb
 *
 * Returns an empty breadcrumb object
 */
declare const getBreadcrumb: (...baseNames: string[]) => Breadcrumb;

interface LineCounter {
    /**
     * lc.log
     *
     * Same as console.log, but adds to the lc counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
     * lc.add(1);
     * lc.get(); // 3
     * lc.clear();
     * ```
     */
    log(...args: any[]): number;
    move(lines: number): void;
    /**
     * lc.wrap
     *
     * Wraps a function, and adds a given number to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
     * lc.add(1);
     * lc.get(); // 3
     * lc.clear();
     * ```
     */
    wrap: <T = any, A = any>(newLines: number, func: (...args: A[]) => number | T, ...args: A[]) => T;
    /**
     * lc.add
     *
     * Adds a given number to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
     * lc.add(1);
     * lc.get(); // 3
     * lc.clear();
     * ```
     */
    add(newLines: number): void;
    /**
     * lc.get
     *
     * returns the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
     * lc.add(1);
     * lc.get(); // 3
     * lc.clear();
     * ```
     */
    get(): number;
    getSince(checkpointID: string): number;
    /**
     * lc.clear
     *
     * clears the line counter, and moves the cursor up by the value of the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
     * lc.add(1);
     * lc.get(); // 3
     * lc.clear();
     * ```
     */
    clear(): void;
    /**
     * lc.clearBack
     *
     * Clears a given number of lines, and updates the line counter
     */
    clearBack(linesToMoveBack: number, limitToRecordedLines?: boolean): void;
    /**
     * lc.checkpoint
     *
     * Records a 'checkpoint' that can be returned to later
     */
    checkpoint(checkpointID?: string): string;
    /**
     * lc.clearToCheckpoint
     *
     * Clear lines up to a previously recorded checkpoint
     */
    clearToCheckpoint(checkpointID: string): void;
}
/**
 * getLineCounter
 *
 * Get line counter for counter output lines
 *
 * ```typescript
 * const lc = getLineCounter();
 * lc.log('hello'); // 1
 * lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
 * lc.add(1);
 * lc.get(); // 3
 * lc.clear();
 * ```
 */
declare const getLineCounter: () => LineCounter;

declare type Text = string | string[];

/**
 * out.pad
 *
 * Pad before and after the given text with the given character.
 *
 * ```typescript
 * pad('foo', 3, 1, '-'); // '---foo-'
 * pad('bar', 10, 5, '_'); // '__________bar_____'
 * ```
 */
declare const pad: (line: string, start: number, end: number, replaceChar?: string) => string;
declare type AlignType = 'left' | 'right' | 'center' | 'justify';
declare type AlignFunction = (item: any, width?: number, replaceChar?: string, forceWidth?: boolean) => string;
/**
 * out.center
 *
 * Align the given text to the center within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.center('foo', 10); // '   foo    '
 * out.center('something long', 10); // 'something long'
 * out.center('lines\n1\n2', 5);
 * // 'lines' + '\n' +
 * // '  1  ' + '\n' +
 * // '  2  '
 * ```
 */
declare const center: AlignFunction;
/**
 * out.left
 *
 * Align the given text to the left within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.left('foo', 10); // 'foo       '
 * out.left('something long', 10); // 'something long'
 * out.left('lines\n1\n2', 5);
 * // 'lines' + '\n' +
 * // '1    ' + '\n' +
 * // '2    '
 * ```
 */
declare const left: AlignFunction;
/**
 * out.right
 *
 * Align the given text to the right within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.right('foo', 10); // '       foo'
 * out.right('something long', 10); // 'something long'
 * out.right('lines\n1\n2', 5);
 * // 'lines' + '\n' +
 * // '    1' + '\n' +
 * // '    2'
 * ```
 */
declare const right: AlignFunction;
/**
 * out.justify
 *
 * Evenly space the text horizontally across the given width.
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
 * out.justify(out.wrap(lorem, 20), 20);
 * // 'Lorem  ipsum   dolor' + '\n' +
 * // 'sit            amet,' + '\n' +
 * // 'consectetur         ' + '\n' +
 * // 'adipiscing      elit'
 * ```
 */
declare const justify: AlignFunction;
/**
 * out.align
 *
 * Align the given text to the given alignment within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * out.align('foo', 'left', 10); // 'foo       '
 * out.align('something long', 'center', 10); // 'something long'
 * out.align('lines\n1\n2', 'right', 5);
 * // 'lines' + '\n' +
 * // '    1' + '\n' +
 * // '    2'
 * ```
 */
declare const align: (item: any, direction: AlignType, width?: number, replaceChar?: string, forceWidth?: boolean) => string;
declare const split: (leftItem: any, rightItem: any, width?: number, replaceChar?: string) => string;
/**
 * out.wrap
 *
 * Wrap the given text to the given width of characters/columns
 *
 * ```typescript
 * wrap('This is a sentence', 15);
 * // 'This is' + '\n' +
 * // 'a sentence'
 * ```
 */
declare const wrap: (item: any, width?: number, alignment?: AlignType, forceWidth?: boolean) => string;
/**
 * out.moveUp
 *
 * Move the terminal cursor up X lines, clearing each row.
 *
 * Useful for replacing previous lines of output
 *
 * ```typescript
 * moveUp(1);
 * ```
 */
declare const moveUp: (lines?: number) => void;
/**
 * out.loading
 *
 * Display an animated loading indicator
 *
 * ```typescript
 * const loader = out.loading();
 * // ...
 * loader.stop();
 * ```
 */
declare const loading: (action?: (s: string) => any, lines?: number, symbols?: string[]) => {
    stop: () => void;
};
/**
 * out.utils.hasColor
 *
 * Determine whether a given string contains any chalk-ed colours
 */
declare const hasColor: (str: string) => boolean;
/**
 * out.limitToLength
 *
 * Limit the length of a string to the given length
 *
 * ```typescript
 * out.limitToLength('This is a very long sentence', 12); // 'This is a ve'
 * ```
 */
declare const limitToLength: (text: string, maxLength: number) => string;
declare const limitToLengthStart: (text: string, maxLength: number) => string;
/**
 * out.truncate
 *
 * Limit the length of a string to the given length, and add an ellipsis if necessary
 *
 * ```typescript
 * out.truncate('This is a very long sentence', 15); // 'This is a ve...'
 * ```
 */
declare const truncate: (text: string, maxLength?: number, suffix?: string) => string;
declare const truncateStart: (text: string, maxLength?: number, suffix?: string) => string;
declare const out: {
    pad: (line: string, start: number, end: number, replaceChar?: string) => string;
    center: AlignFunction;
    left: AlignFunction;
    right: AlignFunction;
    justify: AlignFunction;
    align: (item: any, direction: AlignType, width?: number, replaceChar?: string, forceWidth?: boolean) => string;
    split: (leftItem: any, rightItem: any, width?: number, replaceChar?: string) => string;
    wrap: (item: any, width?: number, alignment?: AlignType, forceWidth?: boolean) => string;
    moveUp: (lines?: number) => void;
    loading: (action?: (s: string) => any, lines?: number, symbols?: string[]) => {
        stop: () => void;
    };
    limitToLength: (text: string, maxLength: number) => string;
    limitToLengthStart: (text: string, maxLength: number) => string;
    truncate: (text: string, maxLength?: number, suffix?: string) => string;
    truncateStart: (text: string, maxLength?: number, suffix?: string) => string;
    getLineCounter: () => LineCounter;
    getBreadcrumb: (...baseNames: string[]) => Breadcrumb;
    utils: {
        getLines: (text: Text) => string[];
        getNumLines: (text: Text) => number;
        getLinesWidth: (text: Text) => number;
        getLogLines: (item: any) => string[];
        getNumLogLines: (item: Text) => number;
        getLogLinesWidth: (item: Text) => number;
        joinLines: (lines: string[]) => string;
        getTerminalWidth: () => number;
        hasColor: (str: string) => boolean;
    };
};

interface TableFormatConfig {
    formatFn: Function;
    isHeader?: boolean;
    isBody?: boolean;
    row?: number;
    col?: number;
}
interface FullTableOptions {
    /**
     * Function to wrap each line of the table in (e.g. chalk.blue)
     */
    wrapperFn: Function;
    wrapLinesFn: Function;
    /**
     * Character to use instead of lines
     */
    overrideChar: string;
    /**
     * Character to use instead of horizontal lines
     */
    overrideHorChar: string;
    /**
     * Character to use instead of vertical lines
     */
    overrideVerChar: string;
    /**
     * Whether to draw the outer border of the table
     */
    drawOuter: boolean;
    /**
     * Whether to draw lines between rows (other than separating header and body)
     */
    drawRowLines: boolean;
    /**
     * Whether to draw lines between columns
     */
    drawColLines: boolean;
    /**
     * Preferred width (in number of characters) of each column
     */
    colWidths: number[];
    /**
     * How the table should be aligned on the screen
     *
     * left, right, center or justify
     */
    align: AlignType;
    /**
     * How each column should be aligned
     *
     * Array with alignment for each column: left, right, center or justify
     */
    alignCols: AlignType[];
    /**
     * Change rows into columns and vice versa
     */
    transpose: boolean;
    /**
     * Change rows into columns and vice versa (body only)
     */
    transposeBody: boolean;
    /**
     * How much spacing to leave around the outside of the table
     * todo update docs for multiple margins
     */
    margin: number | number[];
    cellPadding: number;
    format: TableFormatConfig[];
    truncate: false | string;
    maxWidth: number;
}
declare type TableOptions = Partial$1<FullTableOptions>;
declare const table: {
    getLines: (body: any[][], header?: any[][], options?: TableOptions) => string[];
    print: (body: any[][], header?: any[][], options?: TableOptions) => number;
    printObjects: (objects: Object[], headers?: Object, options?: TableOptions) => number;
    utils: {
        objectsToTable: (objects: Object[], headers?: Object) => {
            header: any[][];
            body: any[][];
        };
        transpose: (rows: any[][]) => any[][];
        concatRows: (cells: {
            header: any[][];
            body: any[][];
        }) => any[][];
        getFormat: (format: Function | Colour, row?: number, col?: number, isHeader?: boolean, isBody?: boolean) => TableFormatConfig;
    };
};

interface Handles<T = any> {
    start: T;
    end: T;
}
interface AskTrimOptions {
    speed: number;
    fastSpeed: number;
    showInstructions: boolean;
    charTrack: string;
    charHandle: string;
    charActiveHandle: string;
    charBar: string;
    charHandleBase: string;
    charActiveHandleBase: string;
    clrTrack: Function;
    clrHandle: Function;
    clrActiveHandle: Function;
    clrBar: Function;
    clrHandleBase: Function;
    clrActiveHandleBase: Function;
}

interface PromptChoiceObject<T = string> {
    title?: string;
    value?: T;
    selected?: boolean;
}
declare type PromptChoice<T = string> = string | PromptChoiceObject<T>;
interface CRUDOptions {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canDeleteAll: boolean;
}
declare type CRUD = 'none' | 'create' | 'update' | 'delete' | 'delete-all';
declare type TitleFn<T> = (item: T, index: number, arr: T[]) => string;
declare const ask: {
    text: (question: string | Breadcrumb, initial?: string) => Promise<string>;
    autotext: <T = string>(question: string | Breadcrumb, choices: PromptChoice<T>[], choiceLimit?: number) => Promise<T>;
    number: (question: string | Breadcrumb, initial?: number) => Promise<number>;
    boolean: (question: string | Breadcrumb, initial?: boolean, yesTxt?: string, noTxt?: string) => Promise<boolean>;
    booleanAlt: (question: string | Breadcrumb, initial?: boolean) => Promise<boolean>;
    select: <T_1 = string>(question: string | Breadcrumb, choices: PromptChoice<T_1>[], initial?: T_1) => Promise<T_1>;
    multiselect: <T_2 = string>(question: string | Breadcrumb, choices: PromptChoice<T_2>[], initial?: PromptChoice<T_2> | PromptChoice<T_2>[], canSelectAll?: boolean) => Promise<T_2[]>;
    crud: (question: string | Breadcrumb, itemName?: string, items?: any[], options?: Partial<CRUDOptions>) => Promise<CRUD>;
    validate: <T_3 = string, I = string>(askFunc: (initialValue?: T_3) => I | Promise<I>, validateFn: (input: Awaited<I>) => boolean | string) => Promise<I>;
    imitate: (done: boolean, question: string | Breadcrumb, result?: any) => number;
    prefill: <T_4 extends unknown = string>(value: T_4, question: string | Breadcrumb, askFn: (question: string | Breadcrumb) => T_4 | Promise<T_4>) => Promise<T_4>;
    loading: (question: string | Breadcrumb) => {
        stop: () => void;
    };
    pause: (text?: string | Breadcrumb) => Promise<void>;
    countdown: (totalSeconds: number, template?: (s: second) => string, complete?: string) => Promise<void>;
    rename: (bef: string, aft: (before: ExplodedPath) => string) => Promise<boolean>;
    fileExplorer: (questionText: string | Breadcrumb, selectType?: "d" | "f", startPath?: string) => Promise<string>;
    multiFileExplorer: (questionText: string | Breadcrumb, selectType?: "d" | "f", startPath?: string) => Promise<string[]>;
    saveFileExplorer: (questionText: string | Breadcrumb, startPath?: string, suggestedFileName?: string) => Promise<string>;
    wizard: <T_5 extends unknown>(startObj?: Partial<T_5>) => {
        add(partial: Partial<T_5>): void;
        getPartial(): Partial<T_5>;
        get(): T_5;
    };
    section: <QuesT extends ((qst?: string | Breadcrumb, results?: any[], lc?: LineCounter, separator?: () => void) => Promise<any>)[]>(question: string | Breadcrumb, sectionFn?: (lc: LineCounter, separator: () => void) => void | Promise<any>, ...questionFns: QuesT) => Promise<QuesT extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...Tail extends [infer Head, ...infer Tail] ? [Head extends (...args: any[]) => Promise<infer U> ? U : Head, ...any] : []] : []] : []] : []] : []] : []] : []] : []] : []] : []] : []>;
    separator: (version?: "up" | "down" | "none", spacing?: number, offset?: number, width?: number) => number;
    trim: (totalFrames: number, frameRate: number, options?: Partial<AskTrimOptions>) => Promise<Handles<number>>;
    table: {
        select: <T_6 extends unknown>(question: string | Breadcrumb, items: T_6[], initial?: number | T_6, rows?: any[][] | ((item?: T_6, index?: number, items?: T_6[]) => any[]), headers?: any[][] | swiss_ak.RemapOf<T_6, string>, tableOptions?: swiss_ak.Partial<FullTableOptions>) => Promise<T_6>;
        multiselect: <T_7 extends unknown>(question: string | Breadcrumb, items: T_7[], initial?: number[] | T_7[], rows?: any[][] | ((item?: T_7, index?: number, items?: T_7[]) => any[]), headers?: any[][] | swiss_ak.RemapOf<T_7, string>, tableOptions?: swiss_ak.Partial<FullTableOptions>) => Promise<T_7[]>;
    };
    utils: {
        itemsToPromptObjects: <T_8 = string>(items: T_8[], titles?: string[], titleFn?: TitleFn<T_8>) => {
            title: string;
            value: T_8;
        }[];
    };
};

/**
 * toFFmpegTimeFormat
 *
 * Convert a number of milliseconds to a time format usable by FFmpeg.
 */
declare const toFFmpegTimeFormat: (time: ms) => string;
/**
 * getProbeValue
 *
 * Get a value from ffprobe output
 *
 * ```typescript
 * const probe = await getProbe('file.mp4', 'width'); // '1280'
 * ```
 */
declare const getProbeValue: (file: string, propertyName: string) => Promise<string>;
/**
 * Note: this interface is a guide, and other properties may exist, and some may be have different types
 */
interface ProbeResult {
    index: number;
    codec_name: string;
    codec_long_name: string;
    profile: string;
    codec_type: string;
    codec_time_base: string;
    codec_tag_string: string;
    codec_tag: number;
    width: number;
    height: number;
    coded_width: number;
    coded_height: number;
    closed_captions: number;
    has_b_frames: number;
    sample_aspect_ratio: string;
    display_aspect_ratio: string;
    pix_fmt: string;
    level: number;
    color_range: string;
    color_space: string;
    color_transfer: string;
    color_primaries: string;
    chroma_location: string;
    field_order: string;
    timecode: string;
    refs: number;
    is_avc?: string;
    nal_length_size?: number;
    id: string;
    r_frame_rate: string;
    avg_frame_rate: string;
    time_base: string;
    start_pts: number;
    start_time: number;
    duration_ts: number;
    duration: number;
    bit_rate: number;
    max_bit_rate: string;
    bits_per_raw_sample: number;
    nb_frames: number;
    nb_read_frames: string;
    nb_read_packets: string;
    framerate: number;
}
/**
 * getProbe
 *
 * Get the probe of a file as an object
 *
 * ```typescript
 * const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
 * ```
 */
declare const getProbe: (file: string) => Promise<ProbeResult>;
/**
 * getTotalFrames
 *
 * Get the total number of frames in a video file.
 *
 * ```typescript
 * const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
 * ```
 */
declare const getTotalFrames: (list?: string | string[]) => Promise<number>;
/**
 * ffmpeg
 *
 * Wrapper for ffmpeg command that provides progress bar to track progress
 *
 * ```typescript
 * const progBarOpts = {}; // Same options as getProgressBar
 * await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
 * ```
 */
declare const ffmpeg: (command?: () => ProcessPromise, progressFileName?: string, totalFrames?: number, progressBarOpts?: ProgressBarOptions) => Promise<void>;

declare type GMCommand = 'convert' | 'composite';
interface SupportedFlag {
    name: string;
    type: 'string' | 'number' | 'boolean';
    commands: GMCommand[];
    options?: string[];
    canOverrideOpts?: boolean;
    processOutput?: (value: any) => any;
    description: string;
    hint?: string;
}

interface CommonFlagsObj {
    compose?: string;
    geometry?: string;
    gravity?: string;
    monochrome?: boolean;
    negate?: boolean;
    quality?: number;
    resize?: string;
    rotate?: number;
    size?: string;
    font?: string;
}
interface ConvertFlagsObj extends CommonFlagsObj {
    'black-threshold'?: number;
    blur?: string;
    colorize?: string;
    crop?: string;
    fill?: string;
    flip?: boolean;
    flop?: boolean;
    threshold?: number;
    'white-threshold'?: number;
    format?: string;
    bordercolor?: string;
    border?: number;
    fuzz?: string;
    transparent?: string;
    pointsize?: number;
    draw?: string;
    channel?: string;
    modulate?: string;
    /** brightness - shortcut/alias for `-modulate x,100,100` */
    brightness?: number;
    /** saturation - shortcut/alias for `-modulate 100,x,100` */
    saturation?: number;
    /** hue - shortcut/alias for `-modulate 100,100,x` */
    hue?: number;
}
declare type channel = 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte';
interface CompositeFlagsObj extends CommonFlagsObj {
    displace?: string;
    dissolve?: number;
    prism?: [channel, number | `${number}` | `${number}x${number}`] | string;
}
declare type FlagsObj = ConvertFlagsObj & CompositeFlagsObj;
interface ChangeAndMaskFlags {
    change?: CompositeFlagsObj;
    mask?: CompositeFlagsObj;
}
declare const gm: {
    convert: (inPath: string, outPath: string, flags?: ConvertFlagsObj) => ProcessPromise;
    composite: (changePath: string, basePath: string, outPath?: string, maskPath?: string, flags?: ChangeAndMaskFlags | CompositeFlagsObj) => ProcessPromise;
    pipe: (changePath: string, basePath: string, outPath?: string, maskPath?: string, convertFlags?: ConvertFlagsObj, compositeFlags?: ChangeAndMaskFlags | CompositeFlagsObj) => ProcessPromise;
    utils: {
        supportedFlags: {
            [key: string]: SupportedFlag;
        };
        flagsObjToArray: (obj: FlagsObj) => any[];
    };
};

/**
 * Close all Mac OS X Finder windows.
 */
declare const closeFinder: () => Promise<void>;

declare const progressBarUtils: {
    getColouredProgressBarOpts: (opts: ProgressBarOptions, randomise?: boolean) => (prefix?: string, override?: ProgressBarOptions, resetColours?: boolean) => ProgressBarOptions;
};

/**
 * LogUtils.getLogStr
 *
 * Get a string for a given object as it would be printed by console.log
 */
declare const getLogStr: (item: any) => string;
/**
 * LogUtils.processLogContents
 *
 * Process an item to be logged
 */
declare const processLogContents: (prefix: string, wrapper?: Function, ...args: any[]) => string;
/**
 * LogUtils.getLog
 *
 * Get a log function for a given prefix
 */
declare const getLog: (prefix: string, wrapper?: Function) => (...args: any[]) => void;

declare const LogUtils_getLogStr: typeof getLogStr;
declare const LogUtils_processLogContents: typeof processLogContents;
declare const LogUtils_getLog: typeof getLog;
declare namespace LogUtils {
  export {
    LogUtils_getLogStr as getLogStr,
    LogUtils_processLogContents as processLogContents,
    LogUtils_getLog as getLog,
  };
}

interface KeyListener {
    start(): void;
    stop(): void;
}
declare const getKeyListener: (callback: (keyName?: string, rawValue?: string) => void, isStart?: boolean, isDebugLog?: boolean) => KeyListener;

export { $$, AlignType, Breadcrumb, CRUD, CRUDOptions, Colour, CommonFlagsObj, CompositeFlagsObj, ConvertFlagsObj, ExplodedPath, FlagsObj, FullTableOptions, LineCounter, LogUtils, ModifiedFile, PathUtils, ProbeResult, TableFormatConfig, TableOptions, align, ask, center, chlk, closeFinder, clr, explodePath, ffmpeg, getBreadcrumb, getKeyListener, getLineCounter, getLog, getLogStr, getProbe, getProbeValue, getTotalFrames, gm, hasColor, justify, left, limitToLength, limitToLengthStart, loading, moveUp, out, pad, processLogContents, progressBarUtils, right, split, table, toFFmpegTimeFormat, truncate, truncateStart, wrap };
