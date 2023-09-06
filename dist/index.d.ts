import * as zx from 'zx';
import { ms, ProgressBarOptions } from 'swiss-ak';
import { ExplodedPath } from 'swiss-node';

/**<!-- DOCS: $$.exif.ExifToolAttributesObj #### -->
 * ExifToolAttributesObj
 *
 * - `$$.ExifToolAttributesObj`
 *
 * Interface for the attributes returned by exiftool
 */
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
/**<!-- DOCS: $$.exif.ExifToolAttributes #### -->
 * ExifToolAttributes
 *
 * - `$$.ExifToolAttributes`
 *
 * Type for the names of the attributes returned by exiftool
 */
declare type ExifToolAttributes = keyof ExifToolAttributesObj;

/**<!-- DOCS: $$ ##! -->
 * $$ (double dollar)
 */
declare namespace $$ {
    /**<!-- DOCS: $$.cd ### @ -->
     * cd
     *
     * - `$$.cd`
     *
     * Change the current working directory
     *
     * ```typescript
     * await $$.pwd(); // '/Users/username'
     * await $$.cd('./some/folder');
     * await $$.pwd(); // '/Users/username/some/folder'
     * ```
     */
    const cd: (dir?: string) => Promise<void>;
    /**<!-- DOCS: $$.pwd ### @ -->
     * pwd
     *
     * - `$$.pwd`
     *
     * Get the current working directory
     *
     * ```typescript
     * await $$.pwd(); // '/Users/username'
     * await $$.cd('./some/folder');
     * await $$.pwd(); // '/Users/username/some/folder'
     * ```
     */
    const pwd: () => Promise<string>;
    /**<!-- DOCS: $$.ls ### @ -->
     * ls
     *
     * - `$$.ls`
     *
     * Wrapper for ls (list) command
     *
     * ```typescript
     * await $$.ls('example') // ['a', 'b']
     * ```
     */
    const ls: (dir?: string, flags?: string[]) => Promise<string[]>;
    /**<!-- DOCS: $$.rm ### @ -->
     * rm
     *
     * - `$$.rm`
     *
     * Wrapper for rm (remove) command
     *
     * ```typescript
     * await $$.rm('example') // same as $`rm -rf 'example'`
     * ```
     */
    const rm: (item: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.mkdir ### @ -->
     * mkdir
     *
     * - `$$.mkdir`
     *
     * Wrapper for mkdir (make directory) command
     *
     * ```typescript
     * await $$.mkdir('example') // same as $`mkdir -p 'example'`
     * ```
     */
    const mkdir: (item: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.cp ### @ -->
     * cp
     *
     * - `$$.cp`
     *
     * Wrapper for cp (copy) command
     *
     * ```typescript
     * await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
     * ```
     */
    const cp: (a: string, b: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.mv ### @ -->
     * mv
     *
     * - `$$.mv`
     *
     * Wrapper for mv (move) command
     *
     * ```typescript
     * await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
     * ```
     */
    const mv: (a: string, b: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.touch ### @ -->
     * touch
     *
     * - `$$.touch`
     *
     * Wrapper for touch (create blank file) command
     *
     * ```typescript
     * await $$.touch('example') // same as $`touch 'example'`
     * ```
     */
    const touch: (item: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.cat ### @ -->
     * cat
     *
     * - `$$.cat`
     *
     * Wrapper for cat (concatenate) command
     *
     * ```typescript
     * await $$.cat('example') // same as $`cat 'example'`
     * ```
     */
    const cat: (item: string) => zx.ProcessPromise;
    /**<!-- DOCS: $$.grep ### @ -->
     * grep
     *
     * - `$$.grep`
     *
     * Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command
     *
     * ```typescript
     * await $$.grep('example', '.') // same as $`grep 'example' '.'`
     * ```
     */
    const grep: (pattern: string, file: string) => Promise<string[]>;
    /**<!-- DOCS: $$.find ### @ -->
     * find
     *
     * - `$$.find`
     *
     * Helper function for finding files
     *
     * ```typescript
     * await $$.find('.', { type: 'f' }) // ['a', 'b']
     * ```
     */
    const find: (dir?: string, options?: FindOptions) => Promise<string[]>;
    /**<!-- DOCS: $$.FindOptions #### -->
     * FindOptions
     *
     * - `$$.FindOptions`
     *
     * Options for $$.find (and related other tools)
     */
    interface FindOptions {
        /**
         * Type of item to find
         *
         * |   | Description       |
         * |---|-------------------|
         * | d | directory         |
         * | f | regular file      |
         * | b | block special     |
         * | c | character special |
         * | l | symbolic link     |
         * | p | FIFO              |
         * | s | socket            |
         */
        type?: FindType;
        /**
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
        ext?: string;
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
    /**<!-- DOCS: $$.FindType #### -->
     * FindType
     *
     * - `$$.FindType`
     *
     * Type of item to find
     *
     * |   | Description       |
     * |---|-------------------|
     * | d | directory         |
     * | f | regular file      |
     * | b | block special     |
     * | c | character special |
     * | l | symbolic link     |
     * | p | FIFO              |
     * | s | socket            |
     */
    type FindType = 'd' | 'f' | 'b' | 'c' | 'l' | 'p' | 's';
    /**<!-- DOCS: $$.findDirs ### @ -->
     * findDirs
     *
     * - `$$.findDirs`
     *
     * Find all directories in a given directory (shallow)
     *
     * ```typescript
     * await $$.findDirs('.') // ['a', 'b']
     * ```
     */
    const findDirs: (dir?: string, options?: FindOptions) => Promise<string[]>;
    /**<!-- DOCS: $$.findFiles ### @ -->
     * findFiles
     *
     * - `$$.findFiles`
     *
     * Find all files in a given directory (shallow)
     *
     * ```typescript
     * await $$.findFiles('.') // ['a', 'b']
     * ```
     */
    const findFiles: (dir?: string, options?: FindOptions) => Promise<string[]>;
    /**<!-- DOCS: $$.findModified ### @ -->
     * findModified
     *
     * - `$$.findModified`
     *
     * Similar to $$.find, but returns a list of ModifiedFile objects, which includes information on what each item was last modified.
     *
     * ```typescript
     * await $$.findModified('.')
     * // [
     * //   {
     * //     lastModified: 1689206400000,
     * //     path: './a.mp4',
     * //     dir: '.',
     * //     folders: ['.'],
     * //     name: 'a',
     * //     ext: 'mp4',
     * //     filename: 'a.mp4'
     * //   }
     * // ]
     * ```
     */
    const findModified: (dir?: string, options?: FindOptions) => Promise<ModifiedFile[]>;
    /**<!-- DOCS: $$.ModifiedFile #### -->
     * ModifiedFile
     *
     * - `$$.ModifiedFile`
     *
     * Returned by $$.findModified.
     *
     * Extends `swiss-node`'s `ExplodedPath`, adding a new `lastModified` number property.
     *
     * ```typescript
     * {
     *   lastModified: 1689206400000,
     *   path: './a.mp4',
     *   dir: '.',
     *   folders: ['.'],
     *   name: 'a',
     *   ext: 'mp4',
     *   filename: 'a.mp4'
     * }
     * ```
     */
    interface ModifiedFile extends ExplodedPath {
        lastModified: ms;
    }
    /**<!-- DOCS: $$.lastModified ### @ -->
     * lastModified
     *
     * - `$$.lastModified`
     *
     * Returns the last modified time of a file or files within a directory.
     *
     * ```typescript
     * await $$.lastModified('a.mp4') // 1689206400000
     * ```
     */
    const lastModified: (path: string) => Promise<number>;
    /**<!-- DOCS: $$.rsync ### @ -->
     * rsync
     *
     * - `$$.rsync`
     *
     * Wrapper for rsync command
     *
     * ```typescript
     * await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
     * ```
     */
    const rsync: (a: string, b: string, flags?: string[], progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    /**<!-- DOCS: $$.sync ### @ -->
     * sync
     *
     * - `$$.sync`
     *
     * Helper function for syncing files
     *
     * ```typescript
     * await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
     * ```
     */
    const sync: (a: string, b: string, progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    /**<!-- DOCS: $$.isFileExist ### @ -->
     * isFileExist
     *
     * - `$$.isFileExist`
     *
     * Check if a file exists
     *
     * ```typescript
     * await $$.isFileExist('example') // true
     * ```
     */
    const isFileExist: (file: string) => Promise<boolean>;
    /**<!-- DOCS: $$.isDirExist ### @ -->
     * isDirExist
     *
     * - `$$.isDirExist`
     *
     * Check if a directory exists
     *
     * ```typescript
     * await $$.isDirExist('example') // true
     * ```
     */
    const isDirExist: (dir: string) => Promise<boolean>;
    /**<!-- DOCS: $$.readFile ### @ -->
     * readFile
     *
     * - `$$.readFile`
     *
     * Read a file's contents
     *
     * ```typescript
     * await $$.readFile('example') // 'hello world'
     * ```
     */
    const readFile: (filepath: string) => Promise<string>;
    /**<!-- DOCS: $$.writeFile ### @ -->
     * writeFile
     *
     * - `$$.writeFile`
     *
     * Write to a file
     *
     * ```typescript
     * await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
     * ```
     */
    const writeFile: (filepath: string, contents: string) => Promise<void>;
    /**<!-- DOCS: $$.readJSON ### @ -->
     * readJSON
     *
     * - `$$.readJSON`
     *
     * Read a JSON file
     *
     * ```typescript
     * await $$.readJSON('example.json') // { hello: 'world' }
     * ```
     */
    const readJSON: <T extends unknown>(filepath: string) => Promise<T>;
    /**<!-- DOCS: $$.writeJSON ### @ -->
     * writeJSON
     *
     * - `$$.writeJSON`
     *
     * Write to a JSON file
     *
     * ```typescript
     * await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
     * ```
     */
    const writeJSON: <T extends Object>(filepath: any, obj: T) => Promise<T>;
    /**<!-- DOCS: $$.pipe ### @ -->
     * pipe
     *
     * - `$$.pipe`
     *
     * Pipes a series of $ or $$ commands sequentially
     *
     * ```typescript
     * await $$.pipe([
     *   () => gm.convert(basePath, gm.PIPE, opts1),
     *   () => gm.composite(changePath, gm.PIPE, gm.PIPE, changePath, opts2)
     * ]);
     * ```
     */
    const pipe: <T extends unknown>(processes: ((index?: number, arg?: T) => ProcessPromise)[], arg?: T) => ProcessPromise;
    /**<!-- DOCS-ALIAS: $$.exif.exiftool -->
     * exiftool
     * 
     * - `$$.exiftool`
     * 
     * Usage:
     * ```typescript
     * $$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'});
     * $$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'}, undefined, '/path/to/new_file.jpg');
     * ```
     */
    const exiftool: (file: string, setAttr?: ExifToolAttributesObj, getAttr?: (keyof ExifToolAttributesObj)[], outFile?: string) => Promise<ExifToolAttributesObj>;
    /**<!-- DOCS-ALIAS: $$.exif.ExifToolAttributesObj -->
     * ExifToolAttributesObj
     * 
     * - `$$.ExifToolAttributesObj`
     * 
     * Interface for the attributes returned by exiftool
     */
    type ExifToolAttributesObj = ExifToolAttributesObj;
    /**<!-- DOCS-ALIAS: $$.exif.ExifToolAttributes -->
     * ExifToolAttributes
     * 
     * - `$$.ExifToolAttributes`
     * 
     * Type for the names of the attributes returned by exiftool
     */
    type ExifToolAttributes = ExifToolAttributes;
    /**<!-- DOCS: $$.utils ### -->
     * utils
     */
    namespace utils {
        /**<!-- DOCS: $$.utils.intoLines #### @ -->
         * intoLines
         *
         * - `$$.utils.intoLines`
         *
         * Turns ProcessOutput into string array, split into lines
         *
         * ```typescript
         * utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
         * ```
         */
        const intoLines: (out: ProcessOutput) => string[];
    }
}

/**<!-- DOCS: os ##! -->
 * os
 */
declare namespace os {
    /**<!-- DOCS: os.closeFinder ### @ -->
     * closeFinder
     *
     * - `closeFinder`
     * - `os.closeFinder`
     *
     * Close all Mac OS X Finder windows.
     *
     * ```typescript
     * await closeFinder();
     * ```
     */
    const closeFinder: () => Promise<void>;
}
/**<!-- DOCS-ALIAS: os.closeFinder -->
 * closeFinder
 * 
 * - `closeFinder`
 * - `os.closeFinder`
 * 
 * Close all Mac OS X Finder windows.
 * 
 * ```typescript
 * await closeFinder();
 * ```
 */
declare const closeFinder: () => Promise<void>;

/**<!-- DOCS: ffmpegTools ##! -->
 * ffmpegTools
 */
declare namespace ffmpegTools {
    /**<!-- DOCS: ffmpegTools.ffmpeg ### @ -->
     * ffmpeg
     *
     * - `ffmpeg`
     * - `ffmpegTools.ffmpeg`
     *
     * Wrapper for ffmpeg command that provides progress bar to track progress
     *
     * ```typescript
     * const progBarOpts = {}; // Same options as getProgressBar
     * await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
     * ```
     */
    const ffmpeg: (command?: () => ProcessPromise, progressFileName?: string, totalFrames?: number, progressBarOpts?: ProgressBarOptions) => Promise<void>;
    /**<!-- DOCS: ffmpegTools.toFFmpegTimeFormat ### @ -->
     * toFFmpegTimeFormat
     *
     * - `ffmpegTools.toFFmpegTimeFormat`
     *
     * Convert a number of milliseconds to a time format usable by FFmpeg.
     */
    const toFFmpegTimeFormat: (time: ms) => string;
    /**<!-- DOCS: ffmpegTools.getProbe ### @ -->
     * getProbe
     *
     * - `ffmpegTools.getProbe`
     *
     * Get the probe of a file as an object
     *
     * ```typescript
     * const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
     * ```
     */
    const getProbe: (file: string) => Promise<ProbeResult>;
    /**<!-- DOCS: ffmpegTools.ProbeResult #### -->
     * ProbeResult
     *
     * - `ffmpegTools.ProbeResult`
     *
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
    /**<!-- DOCS: ffmpegTools.getProbeValue ### @ -->
     * getProbeValue
     *
     * - `ffmpegTools.getProbeValue`
     *
     * Get a value from ffprobe output
     *
     * ```typescript
     * const probe = await getProbe('file.mp4', 'width'); // '1280'
     * ```
     */
    const getProbeValue: (file: string, propertyName: string) => Promise<string>;
    /**<!-- DOCS: ffmpegTools.getTotalFrames ### @ -->
     * getTotalFrames
     *
     * - `ffmpegTools.getTotalFrames`
     *
     * Get the total number of frames in a video file.
     *
     * ```typescript
     * const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
     * ```
     */
    const getTotalFrames: (list?: string | string[]) => Promise<number>;
}
/**<!-- DOCS-ALIAS: ffmpegTools.ffmpeg -->
 * ffmpeg
 * 
 * - `ffmpeg`
 * - `ffmpegTools.ffmpeg`
 * 
 * Wrapper for ffmpeg command that provides progress bar to track progress
 * 
 * ```typescript
 * const progBarOpts = {}; // Same options as getProgressBar
 * await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
 * ```
 */
declare const ffmpeg: (command?: () => ProcessPromise, progressFileName?: string, totalFrames?: number, progressBarOpts?: ProgressBarOptions) => Promise<void>;

/**<!-- DOCS: gm.utils.GMCommand ##### -->
 * GMCommand
 *
 * - `gm.utils.GMCommand`
 *
 * An internal string indictor for which gm command to use.
 *
 * Only used in configuration for `gm.utils.SupportedFlag`.
 *
 * ```typescript
 * 'convert' | 'composite'
 * ```
 */
declare type GMCommand = 'convert' | 'composite';
/**<!-- DOCS: gm.utils.SupportedFlag ##### -->
 * SupportedFlag
 *
 * - `gm.utils.SupportedFlag`
 *
 * An internal configuration object for a supported flag.
 */
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

/**<!-- DOCS: gm ##! -->
 * gm
 */
declare namespace gm {
    /**<!-- DOCS: gm.convert ### @ -->
     * convert
     *
     * - `gm.convert`
     *
     * Wrapper function for gm (GraphicsMagick) convert command
     *
     * ```typescript
     * const converted = await gm.convert(input, output, {});
     * ```
     */
    const convert: (inPath?: string, outPath?: string, flags?: ConvertFlagsObj) => ProcessPromise;
    /**<!-- DOCS: gm.ConvertFlagsObj #### -->
     * ConvertFlagsObj
     *
     * - `gm.ConvertFlagsObj`
     *
     * Options configuration for the `gm.convert` function
     *
     * Extends CommonFlagsObj
     */
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
    /**<!-- DOCS: gm.composite ### @ -->
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
     */
    const composite: (changePath?: string, basePath?: string, outPath?: string, maskPath?: string, flags?: ChangeAndMaskFlags | CompositeFlagsObj) => ProcessPromise;
    /**<!-- DOCS: gm.CompositeFlagsObj #### -->
     * CompositeFlagsObj
     *
     * - `gm.CompositeFlagsObj`
     *
     * Options configuration for the `gm.composite` function
     *
     * Extends CommonFlagsObj
     */
    interface CompositeFlagsObj extends CommonFlagsObj {
        displace?: string;
        dissolve?: number;
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
    interface ChangeAndMaskFlags {
        change?: CompositeFlagsObj;
        mask?: CompositeFlagsObj;
    }
    /**<!-- DOCS: gm.pipe ### @ -->
     * pipe
     *
     * - `gm.pipe`
     *
     * Pipe a series of gm commands together
     *
     * ```typescript
     * await pipe(basePath, outPath, [
     *   (p) => convert(p, p, opts1),
     *   (p) => composite(changePath, p, p, changePath, opts2)
     * ]);
     * ```
     */
    const pipe: (inPath?: string, outPath?: string, processes?: ((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[]) => ProcessPromise;
    /**<!-- DOCS: gm.PIPE_constant ### -->
     * PIPE
     *
     * - `gm.PIPE`
     *
     * A shortcut constant for the GraphicsMagick pipe path which is `MIFF:-`
     *
     * This can be used in place any path parameter to pipe the result of a gm command to another gm command
     */
    const PIPE = "MIFF:-";
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
    /**<!-- DOCS: gm.FlagsObj #### -->
     * FlagsObj
     *
     * - `gm.FlagsObj`
     *
     * `ConvertFlagsObj & CompositeFlagsObj`
     */
    type FlagsObj = ConvertFlagsObj & CompositeFlagsObj;
    /**<!-- DOCS: gm.channel #### -->
     * channel
     *
     * - `gm.channel`
     *
     * `'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte'`
     */
    type channel = 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte';
    /**<!-- DOCS-ALIAS: gm.utils -->
     * utils
     */
    namespace utils {
        /**<!-- DOCS-ALIAS: gm.utils.flagsObjToArray -->
         * flagsObjToArray
         * 
         * - `gm.utils.flagsObjToArray`
         * 
         * Converts a FlagsObj to an array of flags and values (for zx).
         */
        const flagsObjToArray: (obj: FlagsObj) => any[];
        /**<!-- DOCS-ALIAS: gm.utils.supportedFlags -->
         * supportedFlags
         * 
         * - `gm.utils.supportedFlags`
         * 
         * An object containing the supported flags and their types (or options).
         */
        const supportedFlags: {
            [key: string]: SupportedFlag;
        };
        /**<!-- DOCS-ALIAS: gm.utils.channelComposeCopyMap -->
         * channelComposeCopyMap
         * 
         * - `gm.utils.channelComposeCopyMap`
         * 
         * A dictionary for mapping channel names to their respective compose copy names.
         */
        const channelComposeCopyMap: {
            red: string;
            green: string;
            blue: string;
            cyan: string;
            magenta: string;
            yellow: string;
            black: string;
            opacity: string;
            gray: string;
            matte: string;
        };
        /**<!-- DOCS-ALIAS: gm.utils.GMCommand -->
         * GMCommand
         * 
         * - `gm.utils.GMCommand`
         * 
         * An internal string indictor for which gm command to use.
         * 
         * Only used in configuration for `gm.utils.SupportedFlag`.
         * 
         * ```typescript
         * 'convert' | 'composite'
         * ```
         */
        type GMCommand = GMCommand;
        /**<!-- DOCS-ALIAS: gm.utils.SupportedFlag -->
         * SupportedFlag
         * 
         * - `gm.utils.SupportedFlag`
         * 
         * An internal configuration object for a supported flag.
         */
        type SupportedFlag = SupportedFlag;
    }
}

export { $$, closeFinder, ffmpeg, ffmpegTools, gm, os };
