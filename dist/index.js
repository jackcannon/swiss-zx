var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  $$: () => $$,
  closeFinder: () => closeFinder,
  ffmpeg: () => ffmpeg,
  getProbe: () => getProbe,
  getProbeValue: () => getProbeValue,
  getTotalFrames: () => getTotalFrames,
  gm: () => gm,
  toFFmpegTimeFormat: () => toFFmpegTimeFormat
});
module.exports = __toCommonJS(src_exports);

// src/tools/$$.ts
var import_globals = require("zx/globals");
var import_zx = require("zx");
var import_swiss_ak = require("swiss-ak");
var import_swiss_node = require("swiss-node");

// src/tools/exiftool.ts
var exiftool = async (file, setAttr, getAttr, outFile) => {
  const getFlags = (getAttr == null ? void 0 : getAttr.map((attr) => `-${(attr + "").replace(/[^a-zA-Z0-9-]/g, "")}`)) ?? [];
  const setFlags = Object.entries(setAttr || {}).map(([k, v]) => {
    const attr = (k + "").replace(/[^a-zA-Z0-9-]/g, "");
    return `-${attr}=${v}`;
  });
  let output;
  if (outFile) {
    await $$.rm(outFile);
    output = await $`exiftool -s ${getFlags} ${setFlags} -ignoreMinorErrors -o ${outFile} ${file}`;
  } else {
    output = await $`exiftool -s ${getFlags} ${setFlags} -ignoreMinorErrors -overwrite_original ${file}`;
  }
  const lines = output.stdout.split("\n").filter((line) => line && line.match(/\s:\s(.*)/) !== null);
  const entries = lines.map((line) => line.trim().split(/\s+:\s+(.*)/s)).map(([key, value]) => [(key || "").trim(), (value || "").trim()]).filter(([key]) => key);
  return Object.fromEntries(entries);
};

// src/tools/$$.ts
import_zx.$.verbose = false;
var fs = import_zx.fs.promises;
var intoLines = (out) => out.toString().split("\n").filter(import_swiss_ak.fn.isTruthy);
var cd = async (dir = ".") => {
  (0, import_zx.cd)(dir);
  await import_zx.$`cd ${dir}`;
};
var pwd = async () => intoLines(await import_zx.$`pwd`)[0];
var ls = async (dir = ".", flags = []) => intoLines(await import_zx.$`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);
var rm = (item) => import_zx.$`rm -rf ${item}`;
var mkdir = (item) => import_zx.$`mkdir -p ${item}`;
var cp = (a, b) => import_zx.$`cp -r ${a} ${b}`;
var mv = (a, b) => import_zx.$`mv ${a} ${b}`;
var touch = (item) => import_zx.$`touch ${item}`;
var cat = (item) => import_zx.$`cat ${item}`;
var grep = async (pattern, file) => intoLines(await import_zx.$`grep ${pattern} ${file}`);
var convertFindOptionsToFlags = (options) => {
  const { type, ext, mindepth, maxdepth, name, regex, removePath } = options;
  const flags = [];
  if (type)
    flags.push("-type", type);
  if (mindepth)
    flags.push("-mindepth", mindepth + "");
  if (maxdepth)
    flags.push("-maxdepth", maxdepth + "");
  if (name)
    flags.push("-name", name);
  if (!regex && ext)
    flags.push("-regex", String.raw`^.*\.${ext}$`);
  if (regex)
    flags.push("-regex", regex);
  return flags;
};
var find = async (dir = ".", options = {}) => {
  let result;
  if (dir === ".") {
    dir = await $$.pwd();
  }
  const newDir = options.contentsOnly ? import_swiss_node.PathUtils.trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);
  const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
  if (options.removePath) {
    result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\)`;
  } else {
    result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\)`;
  }
  return intoLines(result).map(import_swiss_node.PathUtils.removeDoubleSlashes).filter(import_swiss_ak.fn.isNotEqual(".")).filter((str) => !str.includes(".Trash")).map(options.removeTrailingSlashes ? import_swiss_node.PathUtils.removeTrailSlash : import_swiss_ak.fn.noact);
};
var findDirs = (dir = ".", options = {}) => find(dir, { type: "d", maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });
var findFiles = (dir = ".", options = {}) => find(dir, { type: "f", maxdepth: 1, removePath: true, contentsOnly: true, ...options });
var findModified = async (dir = ".", options = {}) => {
  const newDir = options.contentsOnly ? import_swiss_node.PathUtils.trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);
  const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
  const result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print0 \\) | xargs -0 stat -f "%m %N"`;
  return intoLines(result).map(import_swiss_node.PathUtils.removeDoubleSlashes).filter((str) => !str.includes(".Trash")).map((line) => {
    const [_blank, lastModified2, file] = line.split(/^([0-9]+)\s/);
    return { lastModified: (0, import_swiss_ak.seconds)(Number(lastModified2)), file };
  }).filter(({ file }) => ![".", ".DS_Store"].includes(file)).map(options.removeTrailingSlashes ? ({ file, ...rest }) => ({ file: import_swiss_node.PathUtils.removeDoubleSlashes(file), ...rest }) : import_swiss_ak.fn.noact).map(({ lastModified: lastModified2, file }) => ({
    lastModified: lastModified2,
    ...(0, import_swiss_node.explodePath)(file.replace(/^\./, import_swiss_node.PathUtils.removeTrailSlash(dir)))
  }));
};
var lastModified = async (path) => {
  let list = await findModified(path, { type: "f" });
  if (list.length === 0)
    list = await findModified(path);
  const max = Math.max(...list.map(({ lastModified: lastModified2 }) => lastModified2));
  return max;
};
var rsync = async (a, b, flags = [], progressBarOpts) => {
  if (progressBarOpts) {
    const out = import_zx.$`rsync -rut ${a} ${b} ${flags} --progress`;
    let progressBar = (0, import_swiss_ak.getProgressBar)(void 0, progressBarOpts);
    progressBar.start();
    for await (const chunk of out.stdout) {
      const match = chunk.toString().match(/to\-check=([0-9]+)\/([0-9]+)/);
      if (!match)
        continue;
      const [_m, num, max] = match.map(Number);
      const prog = max - num;
      if ((progressBar == null ? void 0 : progressBar.max) === void 0)
        progressBar = (0, import_swiss_ak.getProgressBar)(max, progressBarOpts);
      progressBar.set(prog);
    }
    return await out;
  } else {
    return import_zx.$`rsync -rut ${a} ${b} ${flags}`;
  }
};
var sync = (a, b, progressBarOpts) => rsync(import_swiss_node.PathUtils.trailSlash(a), import_swiss_node.PathUtils.trailSlash(b), ["--delete"], progressBarOpts);
var isFileExist = async (file) => await import_zx.$`[[ -f ${file} ]]`.exitCode === 0;
var isDirExist = async (dir) => await import_zx.$`[[ -d ${dir} ]]`.exitCode === 0;
var readFile = (filepath) => (0, import_swiss_ak.retryOr)("", 2, 100, true, () => fs.readFile(filepath, { encoding: "utf8" }));
var writeFile = (filepath, contents) => (0, import_swiss_ak.retryOr)(void 0, 2, 100, true, () => fs.writeFile(filepath, contents, { encoding: "utf8" }));
var readJSON = async (filepath) => {
  const raw = await readFile(filepath);
  return JSON.parse(raw || "{}");
};
var writeJSON = async (filepath, obj) => {
  const raw = (obj ? JSON.stringify(obj, null, 2) : "{}") || "{}";
  await writeFile(filepath, raw);
  return obj;
};
var pipe = (processes, arg) => {
  if (processes.length === 0)
    return import_zx.$``;
  let result = void 0;
  for (const index in processes) {
    const processFn = processes[index];
    result = result ? result.pipe(processFn(Number(index), arg)) : processFn(Number(index), arg);
  }
  return result;
};
var $$ = {
  cd,
  pwd,
  ls,
  find,
  findDirs,
  findFiles,
  findModified,
  lastModified,
  rm,
  mkdir,
  cp,
  mv,
  touch,
  cat,
  grep,
  isFileExist,
  isDirExist,
  readFile,
  writeFile,
  readJSON,
  writeJSON,
  pipe,
  rsync,
  sync,
  exiftool,
  utils: {
    intoLines
  }
};

// src/tools/ffmpeg.ts
var import_zx2 = require("zx");
var import_swiss_ak2 = require("swiss-ak");
import_zx2.$.verbose = false;
var toFFmpegTimeFormat = (time) => new Date(time).toISOString().slice(14, 23);
var getProbeValue = async (file, propertyName) => (await import_zx2.$`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();
var getProbe = async (file) => {
  const full = await import_zx2.$`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;
  const props = Object.fromEntries(
    full.toString().split("\n").map((line) => line.split("="))
  );
  const asNumber = (val) => Number.isNaN(Number(val)) ? 0 : Number(val);
  const framerate = asNumber(props.avg_frame_rate.split("/")[0]) / asNumber(props.avg_frame_rate.split("/")[1]);
  return {
    index: asNumber(props.index),
    codec_name: props.codec_name,
    codec_long_name: props.codec_long_name,
    profile: props.profile,
    codec_type: props.codec_type,
    codec_time_base: props.codec_time_base,
    codec_tag_string: props.codec_tag_string,
    codec_tag: asNumber(props.codec_tag),
    width: asNumber(props.width),
    height: asNumber(props.height),
    coded_width: asNumber(props.coded_width),
    coded_height: asNumber(props.coded_height),
    closed_captions: asNumber(props.closed_captions),
    has_b_frames: asNumber(props.has_b_frames),
    sample_aspect_ratio: props.sample_aspect_ratio,
    display_aspect_ratio: props.display_aspect_ratio,
    pix_fmt: props.pix_fmt,
    level: asNumber(props.level),
    color_range: props.color_range,
    color_space: props.color_space,
    color_transfer: props.color_transfer,
    color_primaries: props.color_primaries,
    chroma_location: props.chroma_location,
    field_order: props.field_order,
    timecode: props.timecode,
    refs: asNumber(props.refs),
    is_avc: props.is_avc,
    nal_length_size: asNumber(props.nal_length_size),
    id: props.id,
    r_frame_rate: props.r_frame_rate,
    avg_frame_rate: props.avg_frame_rate,
    time_base: props.time_base,
    start_pts: asNumber(props.start_pts),
    start_time: asNumber(props.start_time),
    duration_ts: asNumber(props.duration_ts),
    duration: asNumber(props.duration),
    bit_rate: asNumber(props.bit_rate),
    max_bit_rate: props.max_bit_rate,
    bits_per_raw_sample: asNumber(props.bits_per_raw_sample),
    nb_frames: asNumber(props.nb_frames),
    nb_read_frames: props.nb_read_frames,
    nb_read_packets: props.nb_read_packets,
    framerate
  };
};
var getTotalFrames = async (list) => {
  if (!list) {
    list = (await $$.ls()).filter((file) => file.endsWith(".MOV"));
  }
  if (!(list instanceof Array))
    list = [list];
  const counts = await Promise.all(list.map(async (file) => getProbeValue(file, "nb_frames")));
  const totalFrames = counts.map((count) => Number(count.trim())).reduce((acc, cur) => acc + cur, 0);
  return totalFrames;
};
var readChunk = (chunk) => Object.fromEntries(
  chunk.toString().split("\n").filter((row) => row && row.includes("=")).map(
    (row) => row.split("=").map((str) => str.trim()).slice(0, 2)
  )
);
var ffmpeg = async (command = () => import_zx2.$`ffmpeg -progress pr.txt`, progressFileName = "pr.txt", totalFrames = 1, progressBarOpts = {}) => {
  await import_zx2.$`echo "" > ${progressFileName}`;
  const ffmpegProcess = command();
  const tail = import_zx2.$`tail -f ${progressFileName}`.nothrow();
  const bar = (0, import_swiss_ak2.getProgressBar)(totalFrames, {
    showCount: true,
    showPercent: true,
    wrapperFn: chalk.magenta,
    ...progressBarOpts
  });
  for await (const chunk of tail.stdout) {
    const progStats = readChunk(chunk);
    if (!progStats || !progStats.frame) {
      continue;
    }
    const frame = Number(progStats.frame);
    bar.set(frame);
    if (progStats.progress === "end") {
      bar.finish();
      await tail.kill();
      await import_zx2.$`rm -rf ${progressFileName}`;
    }
  }
  await ffmpegProcess;
};

// src/tools/gm.ts
var import_swiss_ak4 = require("swiss-ak");

// src/tools/gm/utils.ts
var import_swiss_ak3 = require("swiss-ak");
var supportedFlags = {
  "black-threshold": {
    name: "black-threshold",
    type: "number",
    commands: ["convert"],
    description: "pixels below the threshold become black",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  blur: {
    name: "blur",
    type: "string",
    commands: ["convert"],
    description: "blur the image",
    hint: "radiusxsigma"
  },
  colorize: {
    name: "colorize",
    type: "string",
    commands: ["convert"],
    description: "colorize the image with the fill color",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  compose: {
    name: "compose",
    type: "string",
    commands: ["convert", "composite"],
    options: [
      "Screen",
      "Over",
      "In",
      "Out",
      "Atop",
      "Xor",
      "Plus",
      "Minus",
      "Add",
      "Subtract",
      "Difference",
      "Divide",
      "Multiply",
      "Bumpmap",
      "Copy",
      "CopyRed",
      "CopyGreen",
      "CopyBlue",
      "CopyOpacity",
      "CopyCyan",
      "CopyMagenta",
      "CopyYellow",
      "CopyBlack"
    ],
    canOverrideOpts: false,
    description: "the type of image composition"
  },
  crop: {
    name: "crop",
    type: "string",
    commands: ["convert"],
    description: "crop the image",
    hint: "WxH+X+Y (e.g. 100x100+10+10)"
  },
  displace: {
    name: "displace",
    type: "string",
    commands: ["composite"],
    description: "shift image pixels as defined by a displacement map",
    hint: "<horizontal scale>x<vertical scale>"
  },
  dissolve: {
    name: "dissolve",
    type: "number",
    commands: ["composite"],
    description: "dissolve an image into another by the given percent",
    hint: "%"
  },
  fill: {
    name: "fill",
    type: "string",
    commands: ["convert"],
    description: "fill color to use",
    hint: "colour"
  },
  flip: {
    name: "flip",
    type: "boolean",
    commands: ["convert"],
    description: 'create a "mirror image" - vertical'
  },
  flop: {
    name: "flop",
    type: "boolean",
    commands: ["convert"],
    description: 'create a "mirror image" - horizontal'
  },
  geometry: {
    name: "geometry",
    type: "string",
    commands: ["convert", "composite"],
    description: "Specify dimension, offset, and resize options.",
    hint: "<width>x<height>{+-}<x>{+-}<y>{%}{@}{!}{^}{<}{>} e.g. 100x100+10+10, +10+10"
  },
  gravity: {
    name: "gravity",
    type: "string",
    commands: ["convert", "composite"],
    options: ["Center", "North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"],
    canOverrideOpts: false,
    description: "direction primitive gravitates to when annotating the image."
  },
  monochrome: {
    name: "monochrome",
    type: "boolean",
    commands: ["convert", "composite"],
    description: "transform the image to black and white"
  },
  negate: {
    name: "negate",
    type: "boolean",
    commands: ["convert", "composite"],
    description: "replace every pixel with its complementary color"
  },
  quality: {
    name: "quality",
    type: "number",
    commands: ["convert", "composite"],
    description: "JPEG/MIFF/PNG/TIFF compression level",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  resize: {
    name: "resize",
    type: "string",
    commands: ["convert", "composite"],
    description: "resize an image",
    hint: "<width>x<height>{%}{@}{!}{<}{>} e.g. 100x200"
  },
  rotate: {
    name: "rotate",
    type: "number",
    commands: ["convert", "composite"],
    description: "rotate the image - clockwise",
    hint: "degrees (0-360)"
  },
  size: {
    name: "size",
    type: "string",
    commands: ["convert", "composite"],
    description: "width and height of the image",
    hint: "<width>x<height>"
  },
  threshold: {
    name: "threshold",
    type: "number",
    commands: ["convert"],
    description: "pixels above the threshold become white, pixels below the threshold become black",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  "white-threshold": {
    name: "white-threshold",
    type: "number",
    commands: ["convert"],
    description: "pixels above the threshold become white",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  modulate: {
    name: "modulate",
    type: "string",
    commands: ["convert"],
    description: "modulate the brightness, saturation, and hue of an image",
    hint: "brightness[,saturation[,hue]]"
  },
  brightness: {
    name: "brightness",
    type: "number",
    commands: ["convert"],
    description: "brightness of the image (uses and is overriden by modulate)",
    hint: "%"
  },
  saturation: {
    name: "saturation",
    type: "number",
    commands: ["convert"],
    description: "saturation of the image (uses and is overriden by modulate)",
    hint: "%"
  },
  hue: {
    name: "hue",
    type: "number",
    commands: ["convert"],
    description: "hue of the image (uses and is overriden by modulate)",
    hint: "%"
  },
  prism: {
    name: "prism",
    type: "string",
    commands: ["composite"],
    description: "create a prism effect by displacing a colour channel of the image",
    hint: "<channel>,<horizontal scale>x<vertical scale> (e.g. red,10x10)"
  }
};
var flagsObjToArray = (obj) => {
  const { brightness, saturation, hue, ...rest } = obj;
  if (rest.modulate === void 0 && (brightness !== void 0 || saturation !== void 0 || hue !== void 0)) {
    rest.modulate = `${brightness ?? 100},${saturation ?? 100},${hue ?? 100}`;
  }
  return Object.entries(obj).filter(([name, value]) => value !== void 0 && value !== null && value !== false).map(([name, value]) => {
    var _a;
    return ["-" + name, (((_a = supportedFlags[name]) == null ? void 0 : _a.processOutput) || import_swiss_ak3.fn.noact)(value)];
  }).flat().filter((x) => x !== void 0 && x !== true);
};
var gmUtils = {
  supportedFlags,
  flagsObjToArray
};

// src/tools/gm.ts
var PIPE = "MIFF:-";
var channelComposeCopyMap = {
  red: "CopyRed",
  green: "CopyGreen",
  blue: "CopyBlue",
  cyan: "CopyCyan",
  magenta: "CopyMagenta",
  yellow: "CopyYellow",
  black: "CopyBlack",
  opacity: "CopyOpacity",
  gray: "Copy",
  matte: "Copy"
};
var formaliseCompositeFlags = (flags) => {
  const hasObjs = Object.values(flags).some((val) => typeof val === "object" && !(val instanceof Array));
  if (hasObjs) {
    const comp = flags;
    return {
      change: comp.change || {},
      mask: comp.mask || {}
    };
  }
  return {
    change: flags,
    mask: {}
  };
};
var convert = (inPath = PIPE, outPath = PIPE, flags = {}) => {
  const flagsArray = gmUtils.flagsObjToArray(flags);
  return $`gm convert ${flagsArray} ${inPath} ${outPath}`;
};
var composite = (changePath = PIPE, basePath = PIPE, outPath = PIPE, maskPath = "", flags = {}) => {
  const { change, mask } = formaliseCompositeFlags(flags);
  if (change.compose === "Screen") {
    return convert(basePath, PIPE, { negate: !change.negate }).pipe(
      composite(changePath, PIPE, PIPE, maskPath, {
        change: {
          ...change,
          compose: "Multiply",
          negate: !change.negate
        },
        mask
      })
    ).pipe(convert(PIPE, outPath, { negate: !change.negate }));
  }
  if (change.prism) {
    const { prism, ...rest } = change;
    const prismStrs = prism instanceof Array ? prism.map(import_swiss_ak4.fn.toString) : prism.split(",").map((str) => str.trim());
    const [channel, amount] = [...["red", ...prismStrs].slice(-2), "1x0"].slice(0, 2);
    const values = [...typeof amount === "string" ? amount.split("x").map(Number) : [amount], 0].slice(0, 2);
    const dForw = values.map((x) => x * 2).join("x");
    const dBack = values.map((x) => x * -1).join("x");
    return pipe2(basePath, outPath, [
      (pI, p1) => convert(pI, p1, { channel }),
      (p1, p2) => composite(changePath, p1, p2, maskPath || changePath, { change: { displace: dForw, ...rest }, mask }),
      (p2, p3) => composite(p2, basePath, p3, void 0, { change: { compose: channelComposeCopyMap[channel] } }),
      (p3, pO) => composite(changePath, p3, pO, maskPath || changePath, { change: { displace: dBack, ...rest }, mask })
    ]);
  }
  const changeFlags = gmUtils.flagsObjToArray(change);
  const maskFlags = gmUtils.flagsObjToArray(mask);
  return $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};
var pipe2 = (inPath, outPath, processes = []) => {
  const withIO = [...processes];
  if (inPath)
    withIO.unshift((p) => gm.convert(inPath, p, {}));
  if (outPath)
    withIO.push((p) => gm.convert(p, outPath, {}));
  const mapped = withIO.map((fn4) => (index, arg) => fn4(PIPE, PIPE, index));
  return $$.pipe(mapped);
};
var gm = {
  PIPE,
  convert,
  composite,
  pipe: pipe2,
  utils: gmUtils
};

// src/tools/os.ts
var closeFinder = async () => {
  await $`osascript -e 'tell application "Finder" to close every window'`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $$,
  closeFinder,
  ffmpeg,
  getProbe,
  getProbeValue,
  getTotalFrames,
  gm,
  toFFmpegTimeFormat
});
