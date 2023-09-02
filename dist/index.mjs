// src/tools/$$.ts
import "zx/globals";
import { $ as $2, fs as fsO, cd as cdO } from "zx";
import { fn, getProgressBar, retryOr, seconds } from "swiss-ak";
import { PathTools, explodePath } from "swiss-node";

// src/tools/dd/exiftool.ts
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
$2.verbose = false;
var fs = fsO.promises;
var $$;
(($$2) => {
  $$2.cd = async (dir = ".") => {
    cdO(dir);
    await $2`cd ${dir}`;
  };
  $$2.pwd = async () => utils.intoLines(await $2`pwd`)[0];
  $$2.ls = async (dir = ".", flags = []) => utils.intoLines(await $2`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);
  $$2.rm = (item) => $2`rm -rf ${item}`;
  $$2.mkdir = (item) => $2`mkdir -p ${item}`;
  $$2.cp = (a, b) => $2`cp -r ${a} ${b}`;
  $$2.mv = (a, b) => $2`mv ${a} ${b}`;
  $$2.touch = (item) => $2`touch ${item}`;
  $$2.cat = (item) => $2`cat ${item}`;
  $$2.grep = async (pattern, file) => utils.intoLines(await $2`grep ${pattern} ${file}`);
  const convertFindOptionsToFlags = (options) => {
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
  $$2.find = async (dir = ".", options = {}) => {
    let result;
    if (dir === ".") {
      dir = await $$2.pwd();
    }
    const newDir = options.contentsOnly ? PathTools.trailSlash(dir) : dir;
    const flags = convertFindOptionsToFlags(options);
    const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
    if (options.removePath) {
      result = await $2`[[ -d ${newDir} ]] && find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\) || echo ''`;
    } else {
      result = await $2`[[ -d ${newDir} ]] && find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\) || echo ''`;
    }
    return utils.intoLines(result).map(PathTools.removeDoubleSlashes).filter(fn.isNotEqual(".")).filter((str) => !str.includes(".Trash")).map(options.removeTrailingSlashes ? PathTools.removeTrailSlash : fn.noact);
  };
  $$2.findDirs = (dir = ".", options = {}) => $$2.find(dir, { type: "d", maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });
  $$2.findFiles = (dir = ".", options = {}) => $$2.find(dir, { type: "f", maxdepth: 1, removePath: true, contentsOnly: true, ...options });
  $$2.findModified = async (dir = ".", options = {}) => {
    const newDir = options.contentsOnly ? PathTools.trailSlash(dir) : dir;
    const flags = convertFindOptionsToFlags(options);
    const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
    const result = await $2`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print0 \\) | xargs -0 stat -f "%m %N"`;
    return utils.intoLines(result).map(PathTools.removeDoubleSlashes).filter((str) => !str.includes(".Trash")).map((line) => {
      const [_blank, lastModified2, file] = line.split(/^([0-9]+)\s/);
      return { lastModified: seconds(Number(lastModified2)), file };
    }).filter(({ file }) => ![".", ".DS_Store"].includes(file)).map(options.removeTrailingSlashes ? ({ file, ...rest }) => ({ file: PathTools.removeDoubleSlashes(file), ...rest }) : fn.noact).map(({ lastModified: lastModified2, file }) => ({
      lastModified: lastModified2,
      ...explodePath(file.replace(/^\./, PathTools.removeTrailSlash(dir)))
    }));
  };
  $$2.lastModified = async (path) => {
    let list = await $$2.findModified(path, { type: "f" });
    if (list.length === 0)
      list = await $$2.findModified(path);
    const max = Math.max(...list.map(({ lastModified: lastModified2 }) => lastModified2));
    return max;
  };
  $$2.rsync = async (a, b, flags = [], progressBarOpts) => {
    if (progressBarOpts) {
      const out = $2`rsync -rut ${a} ${b} ${flags} --progress`;
      let progressBar = getProgressBar(void 0, progressBarOpts);
      progressBar.start();
      for await (const chunk of out.stdout) {
        const match = chunk.toString().match(/to\-check=([0-9]+)\/([0-9]+)/);
        if (!match)
          continue;
        const [_m, num, max] = match.map(Number);
        const prog = max - num;
        if ((progressBar == null ? void 0 : progressBar.max) === void 0)
          progressBar = getProgressBar(max, progressBarOpts);
        progressBar.set(prog);
      }
      return await out;
    } else {
      return $2`rsync -rut ${a} ${b} ${flags}`;
    }
  };
  $$2.sync = (a, b, progressBarOpts) => $$2.rsync(PathTools.trailSlash(a), PathTools.trailSlash(b), ["--delete"], progressBarOpts);
  $$2.isFileExist = async (file) => await $2`[[ -f ${file} ]]`.exitCode === 0;
  $$2.isDirExist = async (dir) => await $2`[[ -d ${dir} ]]`.exitCode === 0;
  $$2.readFile = (filepath) => retryOr("", 2, 100, true, () => fs.readFile(filepath, { encoding: "utf8" }));
  $$2.writeFile = (filepath, contents) => retryOr(void 0, 2, 100, true, () => fs.writeFile(filepath, contents, { encoding: "utf8" }));
  $$2.readJSON = async (filepath) => {
    const raw = await $$2.readFile(filepath);
    return JSON.parse(raw || "{}");
  };
  $$2.writeJSON = async (filepath, obj) => {
    const raw = (obj ? JSON.stringify(obj, null, 2) : "{}") || "{}";
    await $$2.writeFile(filepath, raw);
    return obj;
  };
  $$2.pipe = (processes, arg) => {
    if (processes.length === 0)
      return $2``;
    let result = void 0;
    for (const index in processes) {
      const processFn = processes[index];
      result = result ? result.pipe(processFn(Number(index), arg)) : processFn(Number(index), arg);
    }
    return result;
  };
  $$2.exiftool = exiftool;
  let utils;
  ((utils2) => {
    utils2.intoLines = (out) => out.toString().split("\n").filter(fn.isTruthy);
  })(utils = $$2.utils || ($$2.utils = {}));
})($$ || ($$ = {}));

// src/tools/os.ts
var os;
((os2) => {
  os2.closeFinder = async () => {
    await $`osascript -e 'tell application "Finder" to close every window'`;
  };
})(os || (os = {}));
var closeFinder = os.closeFinder;

// src/tools/ffmpegTools.ts
import { $ as $3 } from "zx";
import { getProgressBar as getProgressBar2 } from "swiss-ak";
$3.verbose = false;
var ffmpegTools;
((ffmpegTools2) => {
  ffmpegTools2.ffmpeg = async (command = () => $3`ffmpeg -progress pr.txt`, progressFileName = "pr.txt", totalFrames = 1, progressBarOpts = {}) => {
    await $3`echo "" > ${progressFileName}`;
    const ffmpegProcess = command();
    const tail = $3`tail -f ${progressFileName}`.nothrow();
    const bar = getProgressBar2(totalFrames, {
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
        await $3`rm -rf ${progressFileName}`;
      }
    }
    await ffmpegProcess;
  };
  ffmpegTools2.toFFmpegTimeFormat = (time) => new Date(time).toISOString().slice(14, 23);
  ffmpegTools2.getProbe = async (file) => {
    const full = await $3`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;
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
  ffmpegTools2.getProbeValue = async (file, propertyName) => (await $3`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();
  ffmpegTools2.getTotalFrames = async (list) => {
    if (!list) {
      list = (await $$.ls()).filter((file) => file.endsWith(".MOV"));
    }
    if (!(list instanceof Array))
      list = [list];
    const counts = await Promise.all(list.map(async (file) => ffmpegTools2.getProbeValue(file, "nb_frames")));
    const totalFrames = counts.map((count) => Number(count.trim())).reduce((acc, cur) => acc + cur, 0);
    return totalFrames;
  };
  const readChunk = (chunk) => Object.fromEntries(
    chunk.toString().split("\n").filter((row) => row && row.includes("=")).map(
      (row) => row.split("=").map((str) => str.trim()).slice(0, 2)
    )
  );
})(ffmpegTools || (ffmpegTools = {}));
var ffmpeg = ffmpegTools.ffmpeg;

// src/tools/gm.ts
import { fn as fn3 } from "swiss-ak";

// src/tools/gm/utils.ts
import { fn as fn2 } from "swiss-ak";
var flagsObjToArray = (obj) => {
  const { brightness, saturation, hue, ...rest } = obj;
  if (rest.modulate === void 0 && (brightness !== void 0 || saturation !== void 0 || hue !== void 0)) {
    rest.modulate = `${brightness ?? 100},${saturation ?? 100},${hue ?? 100}`;
  }
  return Object.entries(obj).filter(([name, value]) => value !== void 0 && value !== null && value !== false).map(([name, value]) => {
    var _a;
    return ["-" + name, (((_a = supportedFlags[name]) == null ? void 0 : _a.processOutput) || fn2.noact)(value)];
  }).flat().filter((x) => x !== void 0 && x !== true);
};
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

// src/tools/gm.ts
var gm;
((gm2) => {
  const formaliseCompositeFlags = (flags) => {
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
  gm2.convert = (inPath = gm2.PIPE, outPath = gm2.PIPE, flags = {}) => {
    const flagsArray = flagsObjToArray(flags);
    return $`gm convert ${flagsArray} ${inPath} ${outPath}`;
  };
  gm2.composite = (changePath = gm2.PIPE, basePath = gm2.PIPE, outPath = gm2.PIPE, maskPath = "", flags = {}) => {
    const { change, mask } = formaliseCompositeFlags(flags);
    if (change.compose === "Screen") {
      return gm2.convert(basePath, gm2.PIPE, { negate: !change.negate }).pipe(
        gm2.composite(changePath, gm2.PIPE, gm2.PIPE, maskPath, {
          change: {
            ...change,
            compose: "Multiply",
            negate: !change.negate
          },
          mask
        })
      ).pipe(gm2.convert(gm2.PIPE, outPath, { negate: !change.negate }));
    }
    if (change.prism) {
      const { prism, ...rest } = change;
      const prismStrs = prism instanceof Array ? prism.map(fn3.toString) : prism.split(",").map((str) => str.trim());
      const [channel, amount] = [...["red", ...prismStrs].slice(-2), "1x0"].slice(0, 2);
      const values = [...typeof amount === "string" ? amount.split("x").map(Number) : [amount], 0].slice(0, 2);
      const dForw = values.map((x) => x * 2).join("x");
      const dBack = values.map((x) => x * -1).join("x");
      return gm2.pipe(basePath, outPath, [
        (pI, p1) => gm2.convert(pI, p1, { channel }),
        (p1, p2) => gm2.composite(changePath, p1, p2, maskPath || changePath, { change: { displace: dForw, ...rest }, mask }),
        (p2, p3) => gm2.composite(p2, basePath, p3, void 0, { change: { compose: channelComposeCopyMap[channel] } }),
        (p3, pO) => gm2.composite(changePath, p3, pO, maskPath || changePath, { change: { displace: dBack, ...rest }, mask })
      ]);
    }
    const changeFlags = flagsObjToArray(change);
    const maskFlags = flagsObjToArray(mask);
    return $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
  };
  gm2.pipe = (inPath, outPath, processes = []) => {
    const withIO = [...processes];
    if (inPath)
      withIO.unshift((p) => gm2.convert(inPath, p, {}));
    if (outPath)
      withIO.push((p) => gm2.convert(p, outPath, {}));
    const mapped = withIO.map((fn4) => (index, arg) => fn4(gm2.PIPE, gm2.PIPE, index));
    return $$.pipe(mapped);
  };
  gm2.PIPE = "MIFF:-";
  let utils;
  ((utils2) => {
    utils2.flagsObjToArray = flagsObjToArray;
    utils2.supportedFlags = supportedFlags;
    utils2.channelComposeCopyMap = channelComposeCopyMap;
  })(utils = gm2.utils || (gm2.utils = {}));
})(gm || (gm = {}));
export {
  $$,
  closeFinder,
  ffmpeg,
  ffmpegTools,
  gm,
  os
};
