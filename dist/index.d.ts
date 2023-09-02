import * as zx from 'zx';
import { ms, ProgressBarOptions } from 'swiss-ak';
import { ExplodedPath } from 'swiss-node';

/**<!-- DOCS: exif.ExifToolAttributesObj #### -->
 * ExifToolAttributesObj
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
    pipe: <T_2 extends unknown>(processes: ((index?: number, arg?: T_2) => ProcessPromise)[], arg?: T_2) => ProcessPromise;
    rsync: (a: string, b: string, flags?: string[], progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    sync: (a: string, b: string, progressBarOpts?: Partial<ProgressBarOptions>) => Promise<zx.ProcessOutput>;
    exiftool: (file: string, setAttr?: ExifToolAttributesObj, getAttr?: (keyof ExifToolAttributesObj)[], outFile?: string) => Promise<ExifToolAttributesObj>;
    utils: {
        intoLines: (out: ProcessOutput) => string[];
    };
};

/**<!-- DOCS: os ##! -->
 * os
 */
/**<!-- DOCS: os.closeFinder ### @ -->
 * closeFinder
 *
 * - `closeFinder`
 *
 * Close all Mac OS X Finder windows.
 *
 * ```typescript
 * await closeFinder();
 * ```
 */
declare const closeFinder: () => Promise<void>;

/**<!-- DOCS: ffmpeg ##! -->
 * ffmpeg
 */
/**<!-- DOCS: ffmpeg.toFFmpegTimeFormat ### @ -->
 * toFFmpegTimeFormat
 *
 * Convert a number of milliseconds to a time format usable by FFmpeg.
 */
declare const toFFmpegTimeFormat: (time: ms) => string;
/**<!-- DOCS: ffmpeg.getProbeValue ### @ -->
 * getProbeValue
 *
 * Get a value from ffprobe output
 *
 * ```typescript
 * const probe = await getProbe('file.mp4', 'width'); // '1280'
 * ```
 */
declare const getProbeValue: (file: string, propertyName: string) => Promise<string>;
/**<!-- DOCS: ffmpeg.ProbeResult ### -->
 * ProbeResult
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
/**<!-- DOCS: ffmpeg.getProbe ### @ -->
 * getProbe
 *
 * Get the probe of a file as an object
 *
 * ```typescript
 * const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
 * ```
 */
declare const getProbe: (file: string) => Promise<ProbeResult>;
/**<!-- DOCS: ffmpeg.getTotalFrames ### @ -->
 * getTotalFrames
 *
 * Get the total number of frames in a video file.
 *
 * ```typescript
 * const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
 * ```
 */
declare const getTotalFrames: (list?: string | string[]) => Promise<number>;
/**<!-- DOCS: ffmpeg.ffmpeg ### @ -->
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

/**<!-- DOCS: gm.utils ### -->
 * utils
 */
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
    PIPE: string;
    convert: (inPath?: string, outPath?: string, flags?: ConvertFlagsObj) => ProcessPromise;
    composite: (changePath?: string, basePath?: string, outPath?: string, maskPath?: string, flags?: ChangeAndMaskFlags | CompositeFlagsObj) => ProcessPromise;
    pipe: (inPath?: string, outPath?: string, processes?: ((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[]) => ProcessPromise;
    utils: {
        supportedFlags: {
            [key: string]: SupportedFlag;
        };
        flagsObjToArray: (obj: FlagsObj) => any[];
    };
};

export { $$, CommonFlagsObj, CompositeFlagsObj, ConvertFlagsObj, FlagsObj, ModifiedFile, ProbeResult, closeFinder, ffmpeg, getProbe, getProbeValue, getTotalFrames, gm, toFFmpegTimeFormat };
