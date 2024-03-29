import { $$ } from '../$$';

//<!-- DOCS: 110 -->

/**<!-- DOCS: $$.exif.exiftool ### @ -->
 * exiftool
 *
 * - `$$.exiftool`
 *
 * Usage:
 * ```typescript
 * $$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'});
 * $$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'}, undefined, '/path/to/new_file.jpg');
 * ```
 * @param {string} file
 * @param {ExifToolAttributesObj} [setAttr]
 * @param {(ExifToolAttributes | string)[]} [getAttr]
 * @param {string} [outFile]
 * @returns {Promise<ExifToolAttributesObj>}
 */
export const exiftool = async (
  file: string,
  setAttr?: ExifToolAttributesObj,
  getAttr?: (ExifToolAttributes | string)[],
  outFile?: string
): Promise<ExifToolAttributesObj> => {
  const getFlags = getAttr?.map((attr) => `-${(attr + '').replace(/[^a-zA-Z0-9-]/g, '')}`) ?? [];

  const setFlags = Object.entries(setAttr || {}).map(([k, v]) => {
    const attr = (k + '').replace(/[^a-zA-Z0-9-]/g, '');
    return `-${attr}=${v}`;
  });

  let output: ProcessOutput;
  if (outFile) {
    await $$.rm(outFile);
    output = await $`exiftool -s ${getFlags} ${setFlags} -ignoreMinorErrors -o ${outFile} ${file}`;
  } else {
    output = await $`exiftool -s ${getFlags} ${setFlags} -ignoreMinorErrors -overwrite_original ${file}`;
  }

  const lines = output.stdout.split('\n').filter((line) => line && line.match(/\s:\s(.*)/) !== null);
  const entries = lines
    .map((line) => line.trim().split(/\s+:\s+(.*)/s))
    .map(([key, value]) => [(key || '').trim(), (value || '').trim()])
    .filter(([key]) => key);
  return Object.fromEntries(entries);
};

/**<!-- DOCS: $$.exif.ExifToolAttributesObj #### -->
 * ExifToolAttributesObj
 *
 * - `$$.ExifToolAttributesObj`
 *
 * Interface for the attributes returned by exiftool
 */
export interface ExifToolAttributesObj {
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
export type ExifToolAttributes = keyof ExifToolAttributesObj;
