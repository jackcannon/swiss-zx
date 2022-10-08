var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  $$: () => $$,
  LogUtils: () => LogUtils_exports,
  PathUtils: () => PathUtils_exports,
  align: () => align,
  ask: () => ask,
  center: () => center,
  chlk: () => chlk,
  closeFinder: () => closeFinder,
  clr: () => clr,
  explodePath: () => explodePath,
  ffmpeg: () => ffmpeg,
  getBreadcrumb: () => getBreadcrumb,
  getKeyListener: () => getKeyListener,
  getLineCounter: () => getLineCounter,
  getLog: () => getLog,
  getLogStr: () => getLogStr,
  getProbe: () => getProbe,
  getProbeValue: () => getProbeValue,
  getTotalFrames: () => getTotalFrames,
  gm: () => gm,
  hasColor: () => hasColor,
  justify: () => justify,
  left: () => left,
  limitToLength: () => limitToLength,
  limitToLengthEnd: () => limitToLengthEnd,
  loading: () => loading,
  moveUp: () => moveUp,
  out: () => out,
  pad: () => pad,
  processLogContents: () => processLogContents,
  progressBarUtils: () => progressBarUtils,
  right: () => right,
  table: () => table,
  toFFmpegTimeFormat: () => toFFmpegTimeFormat,
  truncate: () => truncate,
  wrap: () => wrap
});
module.exports = __toCommonJS(src_exports);

// src/tools/$$.ts
var import_globals = require("zx/globals");
var import_zx = require("zx");
var import_swiss_ak = require("swiss-ak");

// src/tools/PathUtils.ts
var PathUtils_exports = {};
__export(PathUtils_exports, {
  explodePath: () => explodePath
});
var explodePath = (path2) => {
  const dir = (path2.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, "");
  const filename = (path2.match(/[^\\\/]*$/) || [])[0];
  const ext = ((filename.match(/\.[^\.]*$/) || [])[0] || "").replace(/^\./, "");
  const name = filename.replace(ext, "").replace(/[\.]$/, "");
  const folders = dir.split(/[\\\/]/).filter((x) => x);
  return { path: path2, dir, folders, name, ext, filename };
};

// src/tools/$$.ts
import_zx.$.verbose = false;
var fs = import_zx.fs.promises;
var intoLines = (out2) => out2.toString().split("\n").filter(import_swiss_ak.fn.isTruthy);
var removeTrailSlash = (path2) => path2.replace(/\/$/, "");
var trailSlash = (path2) => removeTrailSlash(path2) + "/";
var removeDoubleSlashes = (path2) => path2.replace(/\/\//g, "/");
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
  const { type, mindepth, maxdepth, name, regex, removePath } = options;
  const flags = [];
  if (type)
    flags.push("-type", type);
  if (mindepth)
    flags.push("-mindepth", mindepth + "");
  if (maxdepth)
    flags.push("-maxdepth", maxdepth + "");
  if (name)
    flags.push("-name", name);
  if (regex)
    flags.push("-regex", regex);
  return flags;
};
var find = async (dir = ".", options = {}) => {
  let result;
  if (dir === ".") {
    dir = await $$.pwd();
  }
  const newDir = options.contentsOnly ? trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);
  const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
  if (options.removePath) {
    result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\)`;
  } else {
    result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\)`;
  }
  return intoLines(result).map(removeDoubleSlashes).filter(import_swiss_ak.fn.isNotEqual(".")).filter((str) => !str.includes(".Trash")).map(options.removeTrailingSlashes ? removeTrailSlash : import_swiss_ak.fn.noact);
};
var findDirs = (dir = ".", options = {}) => find(dir, { type: "d", maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });
var findFiles = (dir = ".", options = {}) => find(dir, { type: "f", maxdepth: 1, removePath: true, contentsOnly: true, ...options });
var findModified = async (dir = ".", options = {}) => {
  const newDir = options.contentsOnly ? trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);
  const pruneRegex = options.showHidden ? ".*(\\.Trash|\\.DS_Store).*" : ".*(/\\.|\\.Trash|\\.DS_Store).*";
  const result = await import_zx.$`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print0 \\) | xargs -0 stat -f "%m %N"`;
  return intoLines(result).map(removeDoubleSlashes).filter((str) => !str.includes(".Trash")).map((line) => {
    const [_blank, lastModified2, file] = line.split(/^([0-9]+)\s/);
    return { lastModified: (0, import_swiss_ak.seconds)(Number(lastModified2)), file };
  }).filter(({ file }) => ![".", ".DS_Store"].includes(file)).map(options.removeTrailingSlashes ? ({ file, ...rest }) => ({ file: removeDoubleSlashes(file), ...rest }) : import_swiss_ak.fn.noact).map(({ lastModified: lastModified2, file }) => ({
    lastModified: lastModified2,
    ...explodePath(file.replace(/^\./, removeTrailSlash(dir)))
  }));
};
var lastModified = async (path2) => {
  let list = await findModified(path2, { type: "f" });
  if (list.length === 0)
    list = await findModified(path2);
  const max = Math.max(...list.map(({ lastModified: lastModified2 }) => lastModified2));
  return max;
};
var rsync = async (a, b, flags = [], progressBarOpts) => {
  if (progressBarOpts) {
    const out2 = import_zx.$`rsync -rut ${a} ${b} ${flags} --progress`;
    let progressBar = (0, import_swiss_ak.getProgressBar)(void 0, progressBarOpts);
    progressBar.start();
    for await (const chunk of out2.stdout) {
      const match = chunk.toString().match(/to\-check=([0-9]+)\/([0-9]+)/);
      if (!match)
        continue;
      const [_m, num, max] = match.map(Number);
      const prog = max - num;
      if ((progressBar == null ? void 0 : progressBar.max) === void 0)
        progressBar = (0, import_swiss_ak.getProgressBar)(max, progressBarOpts);
      progressBar.set(prog);
    }
    return await out2;
  } else {
    return import_zx.$`rsync -rut ${a} ${b} ${flags}`;
  }
};
var sync = (a, b, progressBarOpts) => rsync(trailSlash(a), trailSlash(b), ["--delete"], progressBarOpts);
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
  readJSON,
  writeJSON,
  rsync,
  sync,
  utils: {
    intoLines,
    removeTrailSlash,
    trailSlash,
    removeDoubleSlashes
  }
};

// src/tools/ask.ts
var import_zx5 = require("zx");
var import_swiss_ak12 = require("swiss-ak");
var import_string_width3 = __toESM(require("string-width"));
var import_prompts = __toESM(require("prompts"));
var import_fuse = __toESM(require("fuse.js"));

// src/tools/out.ts
var import_swiss_ak4 = require("swiss-ak");
var import_string_width = __toESM(require("string-width"));

// src/tools/LogUtils.ts
var LogUtils_exports = {};
__export(LogUtils_exports, {
  getLog: () => getLog,
  getLogStr: () => getLogStr,
  processLogContents: () => processLogContents
});
var import_util = require("util");
var import_zx2 = require("zx");
var import_swiss_ak2 = require("swiss-ak");
var getLogStr = (item) => {
  const inspectList = ["object", "boolean", "number"];
  if (inspectList.includes(typeof item) && !(item instanceof Date)) {
    return (0, import_util.inspect)(item, { colors: false, depth: null });
  } else {
    return item + "";
  }
};
var processLogContents = (prefix, wrapper = import_swiss_ak2.fn.noact, ...args) => args.map(getLogStr).join(" ").split("\n").map((line, index) => import_zx2.chalk.bold(index ? " ".repeat(prefix.length) : prefix) + " " + wrapper(line)).join("\n");
var getLog = (prefix, wrapper = import_swiss_ak2.fn.noact) => (...args) => {
  console.log(processLogContents(prefix, wrapper, ...args));
};

// src/tools/out/lineCounter.ts
var randomID = () => Math.random().toString(36).substring(2);
var getLineCounter = () => {
  let lineCount = 0;
  const checkpoints = {};
  const log = (...args) => {
    const added = out.utils.getNumLines(args.map(getLogStr).join(" "));
    lineCount += added;
    console.log(...args);
    return added;
  };
  const move = (lines) => {
    if (lines > 0) {
      log("\n".repeat(lines - 1));
    }
    if (lines < 0) {
      clearBack(-lines);
    }
  };
  const wrap2 = (newLines = 1, func, ...args) => {
    const result = func(...args);
    lineCount += newLines;
    return result;
  };
  const add = (newLines) => {
    lineCount += newLines;
  };
  const get = () => {
    return lineCount;
  };
  const getSince = (checkpointID) => {
    const checkpointValue = checkpoints[checkpointID];
    if (checkpointValue === void 0)
      return 0;
    const diff = lineCount - checkpointValue;
    return diff > 0 ? diff : 0;
  };
  const checkpoint = (checkpointID = randomID()) => {
    checkpoints[checkpointID] = lineCount;
    return checkpointID;
  };
  const clearToCheckpoint = (checkpointID) => {
    const checkpointValue = checkpoints[checkpointID];
    if (checkpointValue === void 0)
      return;
    const diff = lineCount - checkpointValue;
    if (diff > 0) {
      clearBack(diff);
    }
  };
  const clearBack = (linesToMoveBack, limitToRecordedLines = true) => {
    if (limitToRecordedLines)
      linesToMoveBack = Math.min(lineCount, linesToMoveBack);
    out.moveUp(linesToMoveBack);
    lineCount -= linesToMoveBack;
  };
  const clear2 = () => {
    out.moveUp(lineCount);
    lineCount = 0;
  };
  const lc = {
    log,
    move,
    wrap: wrap2,
    add,
    get,
    getSince,
    checkpoint,
    clearToCheckpoint,
    clear: clear2,
    clearBack
  };
  return lc;
};

// src/tools/out/breadcrumb.ts
var import_swiss_ak3 = require("swiss-ak");

// src/tools/clr.ts
var import_zx3 = require("zx");
var gray0 = import_zx3.chalk.black;
var gray1 = import_zx3.chalk.gray.dim;
var gray2 = import_zx3.chalk.white.dim;
var gray3 = import_zx3.chalk.whiteBright.dim;
var gray4 = import_zx3.chalk.white;
var gray5 = import_zx3.chalk.whiteBright;
var grays = [
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5
];
var gray = (num) => grays[Math.max(0, Math.min(num, grays.length - 1))];
var clear = (str) => str.replace(new RegExp(`\\u001b[[0-9]+m`, "g"), "");
var not = (style) => {
  const styled = style("**xxx**");
  const [after, before] = styled.split("**xxx**");
  return (item) => `${before}${item}${after}`;
};
var notUnderlined = not(import_zx3.chalk.underline);
var chlk = {
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5,
  grays,
  gray,
  clear,
  not,
  notUnderlined
};
var clr = {
  hl1: import_zx3.chalk.yellowBright.bold,
  hl2: import_zx3.chalk.yellow,
  approve: import_zx3.chalk.green.bold,
  create: import_zx3.chalk.greenBright.bold,
  update: import_zx3.chalk.yellow.bold,
  delete: import_zx3.chalk.redBright.bold,
  deleteAll: import_zx3.chalk.redBright.bold,
  blue: import_zx3.chalk.blueBright,
  cyan: import_zx3.chalk.cyanBright,
  green: import_zx3.chalk.greenBright,
  magenta: import_zx3.chalk.magentaBright,
  red: import_zx3.chalk.redBright,
  yellow: import_zx3.chalk.yellowBright,
  t1: import_zx3.chalk.yellowBright,
  t2: import_zx3.chalk.magentaBright,
  t3: import_zx3.chalk.blueBright,
  t4: import_zx3.chalk.redBright,
  t5: import_zx3.chalk.greenBright,
  t6: import_zx3.chalk.cyanBright,
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  gray5
};

// src/tools/out/breadcrumb.ts
var seperatorChar = ` ${chlk.gray2(import_swiss_ak3.symbols.CHEV_RGT)} `;
var getBreadcrumb = (...baseNames) => {
  let current = [];
  let colours = ["t1", "t2", "t3", "t4", "t5", "t6"];
  const setColours = (newColours) => {
    colours = newColours;
  };
  const add = (...names) => current.push(...names);
  const getColouredName = (name, index, arr) => hasColor(name) || index === arr.length - 1 ? name : clr[colours[index % colours.length]](name);
  const getColouredNames = (...tempNames) => getNames(...tempNames).map(getColouredName);
  const getNames = (...tempNames) => [...baseNames, ...current, ...tempNames];
  const sub = (...tempNames) => getBreadcrumb(...getNames(...tempNames));
  const otherChars = "?  > ";
  const spaceForInput = 25;
  const get = (...tempNames) => chalk.bold(
    truncate(
      getColouredNames(...tempNames).join(seperatorChar).trim(),
      out.utils.getTerminalWidth() - (otherChars.length - spaceForInput)
    )
  );
  const result = (...tempNames) => sub(...tempNames);
  result.setColours = setColours;
  result.add = add;
  result.getNames = getNames;
  result.sub = sub;
  result.get = get;
  result.toString = get;
  return result;
};

// src/tools/out.ts
var NEW_LINE = "\n";
var textToString = (text2) => text2 instanceof Array ? joinLines(text2) : text2;
var getTerminalWidth = () => {
  var _a;
  return ((_a = process == null ? void 0 : process.stdout) == null ? void 0 : _a.columns) ? process.stdout.columns : 100;
};
var getLines = (text2) => textToString(text2).split(NEW_LINE);
var getNumLines = (text2) => getLines(text2).length;
var getLinesWidth = (text2) => Math.max(...getLines(text2).map((line) => (0, import_string_width.default)(line)));
var getLogLines = (item) => getLines(getLogStr(item));
var getNumLogLines = (item) => getNumLines(getLogStr(item));
var getLogLinesWidth = (item) => getLinesWidth(getLogStr(item));
var joinLines = (lines) => lines.map(import_swiss_ak4.fn.maps.toString).join(NEW_LINE);
var pad = (line, start, end, replaceChar = " ") => `${replaceChar.repeat(Math.max(0, start))}${line}${replaceChar.repeat(Math.max(0, end))}`;
var correctWidth = (width) => width < 0 || width === Infinity ? getTerminalWidth() : Math.min(width, getTerminalWidth());
var center = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map(
  (line) => pad(
    line,
    Math.floor((correctWidth(width) - (0, import_string_width.default)(line)) / 2),
    forceWidth ? Math.ceil((correctWidth(width) - (0, import_string_width.default)(line)) / 2) : 0,
    replaceChar
  )
).join(NEW_LINE);
var left = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map((line) => pad(line, 0, forceWidth ? correctWidth(width) - (0, import_string_width.default)(line) : 0, replaceChar)).join(NEW_LINE);
var right = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map((line) => pad(line, correctWidth(width) - (0, import_string_width.default)(line), 0, replaceChar)).join(NEW_LINE);
var justify = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map((line) => {
  const words = line.split(" ");
  if (words.length === 1)
    return left(words[0], width, replaceChar, forceWidth);
  const currW = words.map((w) => w.length).reduce(import_swiss_ak4.fn.reduces.combine);
  const perSpace = Math.floor((width - currW) / (words.length - 1));
  const remain = (width - currW) % (words.length - 1);
  const spaces = import_swiss_ak4.ArrayUtils.range(words.length - 1).map((i) => perSpace + Number(words.length - 2 - i < remain)).map((num) => replaceChar.repeat(num));
  let result = "";
  for (let index in words) {
    result += words[index] + (spaces[index] || "");
  }
  return result;
}).join(NEW_LINE);
var alignFunc = {
  left,
  center,
  right,
  justify
};
var align = (item, direction, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => {
  const func = alignFunc[direction] || alignFunc.left;
  return func(item, width, replaceChar, forceWidth);
};
var wrap = (item, width = getTerminalWidth(), alignment, forceWidth = false) => getLogLines(item).map((line) => {
  if ((0, import_string_width.default)(line) > width) {
    let words = line.split(/(?<=#?[ -]+)/g);
    const rows = [];
    words = words.map((orig) => {
      if ((0, import_string_width.default)(orig.replace(/\s$/, "")) > width) {
        let remaining2 = orig;
        let result = [];
        while ((0, import_string_width.default)(remaining2) > width - 1) {
          result.push(remaining2.slice(0, width - 1) + "-");
          remaining2 = remaining2.slice(width - 1);
        }
        result.push(remaining2);
        return result;
      }
      return orig;
    }).flat();
    let rowStartIndex = 0;
    for (let wIndex in words) {
      let word = words[wIndex].replace(/\s$/, "");
      const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex)));
      const candText = candidateRow.join("");
      if ((0, import_string_width.default)(candText) + (0, import_string_width.default)(word) > width) {
        rows.push(candidateRow);
        rowStartIndex = Number(wIndex);
      }
    }
    const remaining = words.slice(rowStartIndex);
    rows.push(remaining);
    return rows.map((row) => row.join("")).map((row) => row.replace(/\s$/, "")).map((row) => alignment ? align(row, alignment, width, void 0, forceWidth) : row);
  }
  return line;
}).flat().join(NEW_LINE);
var moveUp = (lines = 1) => {
  var _a;
  if ((_a = process == null ? void 0 : process.stdout) == null ? void 0 : _a.clearLine) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0);
    for (let i = 0; i < lines; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
    }
  }
};
var loadingDefault = (s) => console.log(chalk.dim(`${s}`));
var loadingWords = [
  "\u2113-o-\u{1D51E}-\u{1D4ED}-\u026A-\u057C-\u{1D5F4}",
  "\u{1D695}-\u03C3-a-\u{1D521}-\u{1D4F2}-\u0274-\u0262",
  "\u{1D5DF}-\u{1D698}-\u03B1-d-\u{1D526}-\u{1D4F7}-\u0262",
  "\u029F-\u{1D5FC}-\u{1D68A}-\u2202-i-\u{1D52B}-\u{1D4F0}",
  "\u029F-\u0585-\u{1D5EE}-\u{1D68D}-\u03B9-n-\u{1D524}",
  "\u{1D4F5}-\u1D0F-\u01DF-\u{1D5F1}-\u{1D692}-\u03B7-g",
  "\u{1D529}-\u{1D4F8}-\u1D00-\u0256-\u{1D5F6}-\u{1D697}-g",
  "l-\u{1D52C}-\u{1D4EA}-\u1D05-\u0268-\u{1D5FB}-\u{1D690}"
].map((word) => word.split("-"));
var loadingChars = import_swiss_ak4.ArrayUtils.repeat((loadingWords.length + 1) * loadingWords[0].length, ...loadingWords).map(
  (word, index) => chalk.bold("loading".slice(0, Math.floor(Math.floor(index) / loadingWords.length))) + word.slice(Math.floor(Math.floor(index) / loadingWords.length)).join("") + ["   ", ".  ", ".. ", "..."][Math.floor(index / 3) % 4]
);
var loading = (action = loadingDefault, lines = 1, symbols7 = loadingChars) => {
  let stopped = false;
  let count = 0;
  const runLoop = async () => {
    if (stopped)
      return;
    if (count)
      moveUp(lines);
    action(symbols7[count++ % symbols7.length]);
    await (0, import_swiss_ak4.wait)(150);
    return runLoop();
  };
  runLoop();
  return {
    stop: () => {
      moveUp(lines);
      stopped = true;
    }
  };
};
var hasColor = (str) => Boolean(str.match(new RegExp(`\\u001b[[0-9]+m`, "g")));
var limitToLength = (text2, maxLength) => joinLines(
  getLines(text2).map((line) => {
    let specials = "";
    let result = line;
    while ((0, import_string_width.default)(result) > maxLength) {
      const match = result.match(new RegExp(`(\\u001b[[0-9]+m|.)$`));
      const { 0: removed, index } = match || { 0: result.slice(-1), index: result.length - 1 };
      if (removed.match(new RegExp(`\\u001b[[0-9]+m`))) {
        specials = removed + specials;
      }
      result = result.slice(0, index);
    }
    return result + specials;
  })
);
var limitToLengthEnd = (text2, maxLength) => joinLines(
  getLines(text2).map((line) => {
    let specials = "";
    let result = line;
    while ((0, import_string_width.default)(result) > maxLength) {
      const match = result.match(new RegExp(`^(\\u001b[[0-9]+m|.)`));
      const { 0: removed, index } = match || { 0: result.slice(0, 1), index: 1 };
      if (removed.match(new RegExp(`\\u001b[[0-9]+m`))) {
        specials = specials + removed;
      }
      result = result.slice(index + removed.length);
    }
    return specials + result;
  })
);
var truncate = (text2, maxLength = getTerminalWidth(), suffix = "\u2026") => joinLines(
  getLines(text2).map((line) => (0, import_string_width.default)(line) > maxLength ? limitToLength(line, maxLength - (0, import_string_width.default)(suffix)) + chalk.dim(suffix) : line)
);
var out = {
  pad,
  center,
  left,
  right,
  justify,
  align,
  wrap,
  moveUp,
  loading,
  limitToLength,
  limitToLengthEnd,
  truncate,
  getLineCounter,
  getBreadcrumb,
  utils: {
    getLines,
    getNumLines,
    getLinesWidth,
    getLogLines,
    getNumLogLines,
    getLogLinesWidth,
    joinLines,
    getTerminalWidth,
    hasColor
  }
};

// src/tools/ask/trim.ts
var import_zx4 = require("zx");
var import_swiss_ak8 = require("swiss-ak");
var import_string_width2 = __toESM(require("string-width"));

// src/tools/table.ts
var import_swiss_ak7 = require("swiss-ak");

// src/utils/processTableInput.ts
var import_swiss_ak5 = require("swiss-ak");
var empty = (numCols, char = "") => new Array(numCols).fill(char);
var showBlank = ["undefined", "null"];
var showRaw = ["string", "number", "boolean"];
var itemToString = (item) => {
  if (showBlank.includes(typeof item))
    return "";
  if (showRaw.includes(typeof item))
    return item.toString();
  return getLogStr(item);
};
var processCells = (cells, processFn, ...args) => ({
  header: processFn(cells.header, "header", ...args),
  body: processFn(cells.body, "body", ...args)
});
var fixMixingHeader = (cells) => {
  return {
    header: cells.header || [],
    body: cells.body || []
  };
};
var transposeTable = (cells, opts) => {
  if (opts.transpose) {
    const body = table.utils.transpose(table.utils.concatRows(cells));
    return { header: [], body };
  }
  if (opts.transposeBody) {
    const body = table.utils.transpose(cells.body);
    return { header: cells.header, body };
  }
  return cells;
};
var ensureStringForEveryCell = (rows, type, numCols) => rows.map((row) => [...row, ...empty(numCols)].slice(0, numCols).map((cell) => itemToString(cell)));
var formatCells = (rows, type, format) => {
  const applicable = format.filter((f) => f.isHeader && type === "header" || f.isBody && type === "body");
  for (let frmt of applicable) {
    for (let y in rows) {
      for (let x in rows[y]) {
        if ((frmt.row === void 0 || frmt.row === Number(y)) && (frmt.col === void 0 || frmt.col === Number(x))) {
          for (let l in rows[y][x]) {
            rows[y][x][l] = frmt.formatFn(rows[y][x][l]);
          }
        }
      }
    }
  }
  return rows;
};
var splitCellsIntoLines = (rows, type) => rows.map((row) => row.map((cell) => out.utils.getLines(cell)));
var getDesiredColumnWidths = (cells, numCols, preferredWidths, [_mT, marginRight, _mB, marginLeft], maxTotalWidth) => {
  const transposed = (0, import_swiss_ak5.zip)(...[...cells.header, ...cells.body]);
  const actualColWidths = transposed.map((col) => Math.max(...col.map((cell) => out.utils.getLinesWidth(cell))));
  const currColWidths = preferredWidths.length ? import_swiss_ak5.ArrayUtils.repeat(numCols, ...preferredWidths) : actualColWidths;
  const currTotalWidth = currColWidths.reduce(import_swiss_ak5.fn.reduces.combine) + (numCols + 1) * 3;
  const diff = currTotalWidth - (maxTotalWidth - (marginRight + marginLeft));
  const colWidths = [...currColWidths];
  for (let i = 0; i < diff; i++) {
    colWidths[colWidths.indexOf(Math.max(...colWidths))]--;
  }
  return colWidths;
};
var wrapCells = (rows, type, colWidths, truncate2) => rows.map((row) => {
  const wrapped = row.map((cell) => out.utils.joinLines(cell)).map((text2, colIndex) => {
    if (truncate2 !== false) {
      return out.truncate(text2, colWidths[colIndex], truncate2);
    } else {
      return out.wrap(text2, colWidths[colIndex]);
    }
  }).map((text2) => out.utils.getLines(text2));
  const maxHeight = Math.max(...wrapped.map((cell) => cell.length));
  return wrapped.map((cell) => [...cell, ...empty(maxHeight)].slice(0, maxHeight));
});
var seperateLinesIntoRows = (rows, type) => rows.map((row) => (0, import_swiss_ak5.zip)(...row));
var processInput = (cells, opts) => {
  const fixed = fixMixingHeader(cells);
  const transposed = transposeTable(fixed, opts);
  const numCols = Math.max(...[...transposed.header || [], ...transposed.body].map((row) => row.length));
  const everyCell = processCells(transposed, ensureStringForEveryCell, numCols);
  const linedCells = processCells(everyCell, splitCellsIntoLines);
  const colWidths = getDesiredColumnWidths(linedCells, numCols, opts.colWidths, opts.margin, opts.maxWidth);
  const wrappedCells = processCells(linedCells, wrapCells, colWidths, opts.truncate);
  const formatted = processCells(wrappedCells, formatCells, opts.format);
  const seperatedRows = processCells(formatted, seperateLinesIntoRows);
  return { cells: seperatedRows, numCols, colWidths };
};

// src/utils/tableCharacters.ts
var import_swiss_ak6 = require("swiss-ak");
var tableCharactersBasic = () => ({
  hTop: ["\u2501", "\u250F", "\u2533", "\u2513"],
  hNor: [" ", "\u2503", "\u2503", "\u2503"],
  hSep: ["\u2501", "\u2523", "\u254B", "\u252B"],
  hBot: ["\u2501", "\u2517", "\u253B", "\u251B"],
  mSep: ["\u2501", "\u2521", "\u2547", "\u2529"],
  bTop: ["\u2500", "\u250C", "\u252C", "\u2510"],
  bNor: [" ", "\u2502", "\u2502", "\u2502"],
  bSep: ["\u2500", "\u251C", "\u253C", "\u2524"],
  bBot: ["\u2500", "\u2514", "\u2534", "\u2518"]
});
var ovAllCharact = (orig, char) => import_swiss_ak6.ArrayUtils.repeat(4, char);
var ovSeperators = (orig, char) => [orig[0], char, char, char];
var ovOuterChars = (orig, char) => [orig[0], char, orig[2], char];
var getTableCharacters = (opts) => {
  let mapped = tableCharactersBasic();
  const normalRows = ["hNor", "bNor"];
  const outerRows = ["hTop", "hBot", "bTop", "bBot"];
  const rowTypes = Object.keys(mapped);
  if (opts.overrideChar) {
    for (const rowType of rowTypes) {
      if (normalRows.includes(rowType)) {
        mapped[rowType] = ovSeperators(mapped[rowType], opts.overrideChar);
      } else {
        mapped[rowType] = ovAllCharact(mapped[rowType], opts.overrideChar);
      }
    }
  }
  if (opts.overrideVerChar || !opts.drawColLines) {
    const ovrd = opts.overrideVerChar || " ";
    for (const rowType of rowTypes) {
      if (normalRows.includes(rowType)) {
        mapped[rowType] = ovSeperators(mapped[rowType], ovrd);
      } else {
        mapped[rowType] = ovAllCharact(mapped[rowType], mapped[rowType][0]);
      }
    }
  }
  if (opts.overrideHorChar || !opts.drawRowLines) {
    const ovrd = opts.overrideHorChar;
    const copyVertsFrom = ["hNor", "hNor", "hNor", "hNor", "mSep", "bNor", "bNor", "bNor", "bNor"];
    for (const rowIndex in rowTypes) {
      const rowType = rowTypes[rowIndex];
      if (normalRows.includes(rowType)) {
      } else {
        if (opts.overrideHorChar) {
          mapped[rowType] = ovAllCharact(mapped[rowType], ovrd);
        } else {
          mapped[rowType] = [...mapped[copyVertsFrom[rowIndex]]];
        }
      }
    }
  }
  if (!opts.drawOuter) {
    for (const rowType of rowTypes) {
      if (outerRows.includes(rowType)) {
        mapped[rowType] = ovAllCharact(mapped[rowType], " ");
      } else {
        mapped[rowType] = ovOuterChars(mapped[rowType], " ");
      }
    }
  }
  return mapped;
};

// src/tools/table.ts
var toFullFormatConfig = (config) => ({
  isHeader: false,
  isBody: true,
  ...config
});
var getFullOptions = (opts) => ({
  overrideChar: "",
  overrideHorChar: opts.overrideChar || "",
  overrideVerChar: opts.overrideChar || "",
  align: "left",
  alignCols: ["left"],
  colWidths: [],
  cellPadding: 1,
  truncate: false,
  maxWidth: out.utils.getTerminalWidth(),
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== "function" ? import_swiss_ak7.fn.noact : opts.wrapperFn,
  wrapLinesFn: typeof opts.wrapLinesFn !== "function" ? import_swiss_ak7.fn.noact : opts.wrapLinesFn,
  drawOuter: typeof opts.drawOuter !== "boolean" ? true : opts.drawOuter,
  drawRowLines: typeof opts.drawRowLines !== "boolean" ? true : opts.drawRowLines,
  drawColLines: typeof opts.drawColLines !== "boolean" ? true : opts.drawColLines,
  transpose: typeof opts.transpose !== "boolean" ? false : opts.transpose,
  transposeBody: typeof opts.transposeBody !== "boolean" ? false : opts.transposeBody,
  format: (opts.format || []).map(toFullFormatConfig),
  margin: ((input = 0) => {
    const arr = [input].flat();
    const top = arr[0] ?? 0;
    const right2 = arr[1] ?? top;
    const bottom = arr[2] ?? top;
    const left2 = arr[3] ?? right2 ?? top;
    return [top, right2, bottom, left2];
  })(opts.margin)
});
var empty2 = (numCols, char = "") => new Array(numCols).fill(char);
var getLines2 = (body, header, options = {}) => {
  const opts = getFullOptions(options);
  const { wrapperFn, wrapLinesFn, drawOuter, alignCols, align: align2, drawRowLines, cellPadding } = opts;
  const [marginTop, marginRight, marginBottom, marginLeft] = opts.margin;
  const result = [];
  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body }, opts);
  const alignColumns = import_swiss_ak7.ArrayUtils.repeat(numCols, ...alignCols);
  const tableChars = getTableCharacters(opts);
  const printLine = (row = empty2(numCols), chars = tableChars.bNor, textWrapperFn) => {
    const [norm, strt, sepr, endc] = chars;
    const pad2 = norm.repeat(Math.max(0, cellPadding));
    let aligned = row.map((cell, col) => out.align(cell || "", alignColumns[col], colWidths[col], norm, true));
    if (textWrapperFn)
      aligned = aligned.map((x) => textWrapperFn(x));
    const inner = aligned.join(wrapLinesFn(`${pad2}${sepr}${pad2}`));
    const str = wrapLinesFn(`${" ".repeat(marginLeft)}${strt}${pad2}`) + inner + wrapLinesFn(`${pad2}${endc}${" ".repeat(marginRight)}`);
    result.push(out.align(wrapperFn(str), align2, -1, " ", false));
  };
  if (marginTop)
    result.push("\n".repeat(marginTop - 1));
  if (pHeader.length) {
    if (drawOuter && drawRowLines)
      printLine(empty2(numCols, ""), tableChars.hTop, wrapLinesFn);
    for (let index in pHeader) {
      const row = pHeader[index];
      if (Number(index) !== 0 && drawRowLines)
        printLine(empty2(numCols, ""), tableChars.hSep, wrapLinesFn);
      for (let line of row) {
        printLine(line, tableChars.hNor, chalk.bold);
      }
    }
    printLine(empty2(numCols, ""), tableChars.mSep, wrapLinesFn);
  } else {
    if (drawOuter)
      printLine(empty2(numCols, ""), tableChars.bTop, wrapLinesFn);
  }
  for (let index in pBody) {
    const row = pBody[index];
    if (Number(index) !== 0 && drawRowLines)
      printLine(empty2(numCols, ""), tableChars.bSep, wrapLinesFn);
    for (let line of row) {
      printLine(line, tableChars.bNor);
    }
  }
  if (drawOuter && drawRowLines)
    printLine(empty2(numCols, ""), tableChars.bBot, wrapLinesFn);
  if (marginBottom)
    result.push("\n".repeat(marginBottom - 1));
  return result;
};
var print = (body, header, options = {}) => {
  const lines = getLines2(body, header, options);
  if (lines.length) {
    console.log(lines.join("\n"));
  }
  return lines.length;
};
var getAllKeys = (objects) => {
  const allKeys = {};
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      allKeys[key] = true;
    });
  });
  return Object.keys(allKeys);
};
var objectsToTable = (objects, headers = {}) => {
  const allKeys = getAllKeys(objects);
  const header = [allKeys.map((key) => headers[key] || key)];
  const body = objects.map((obj) => allKeys.map((key) => obj[key]));
  return {
    header,
    body
  };
};
var transpose = (rows) => {
  return import_swiss_ak7.ArrayUtils.zip(...rows);
};
var concatRows = (cells) => {
  return [...cells.header || [], ...cells.body];
};
var getFormat = (format, row, col, isHeader, isBody) => {
  const result = {
    formatFn: typeof format === "function" ? format : clr[format],
    row,
    col
  };
  if (isHeader !== void 0)
    result.isHeader = isHeader;
  if (isBody !== void 0)
    result.isBody = isBody;
  return result;
};
var printObjects = (objects, headers = {}, options = {}) => {
  const { body, header } = objectsToTable(objects, headers);
  return print(body, header, options);
};
var table = {
  getLines: getLines2,
  print,
  printObjects,
  utils: {
    objectsToTable,
    transpose,
    concatRows,
    getFormat
  }
};

// src/utils/keyListener.ts
var getKeyListener = (callback, isStart = true, isDebugLog = false) => {
  const listenFn = (key) => {
    if (isDebugLog) {
      console.log(JSON.stringify(key));
    }
    if (key == "\r") {
      return callback("return");
    }
    if (key == "	") {
      return callback("tab");
    }
    if (key == "\x1B[A") {
      return callback("up");
    }
    if (key == "\x1B[C") {
      return callback("right");
    }
    if (key == "\x1B[B") {
      return callback("down");
    }
    if (key == "\x1B[D") {
      return callback("left");
    }
    if (key == " ") {
      return callback("space");
    }
    if (key === "\x1B") {
      return callback("esc");
    }
    if (key == "") {
      return process.exit();
    }
    if (key.length === 1) {
      return callback(key);
    }
  };
  const start = () => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", listenFn);
    process.stdout.write("\x1B[?25l");
  };
  const stop = () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdin.off("data", listenFn);
    process.stdout.write("\x1B[?25h");
  };
  if (isStart)
    start();
  return {
    start,
    stop
  };
};

// src/tools/ask/trim.ts
var toTimeCode = (frame, frameRate = 60, includeHours = false, includeMinutes = true) => {
  const frLength = (0, import_string_width2.default)(frameRate + "");
  const toSecs = (0, import_swiss_ak8.seconds)(Math.floor(frame / frameRate));
  const remaining = frame % frameRate;
  let cut = includeHours ? 11 : 14;
  if (!includeMinutes)
    cut = 17;
  const time = new Date(toSecs).toISOString().slice(cut, 19);
  return `${time}.${(remaining + "").padStart(frLength, "0")}`;
};
var getNextHandle = (tool) => {
  const all = ["start", "end"];
  return all[(all.indexOf(tool) + 1) % all.length];
};
var getFullOptions2 = (opts) => ({
  speed: 1,
  fastSpeed: 5,
  showInstructions: true,
  charTrack: " ",
  charHandle: "\u2503",
  charBar: "\u2588",
  clrTrack: import_zx4.chalk.bgGray,
  clrHandle: import_zx4.chalk.whiteBright,
  clrBar: import_zx4.chalk.white,
  ...opts,
  charActiveHandle: opts.charActiveHandle ?? opts.charHandle ?? "\u2503",
  charHandleBase: opts.charHandleBase ?? opts.charHandle ?? "\u2588",
  charActiveHandleBase: opts.charActiveHandleBase ?? opts.charHandleBase ?? opts.charActiveHandle ?? opts.charHandle ?? "\u2588",
  clrActiveHandle: opts.clrActiveHandle ?? opts.clrHandle ?? import_zx4.chalk.yellowBright.bold,
  clrHandleBase: opts.clrHandleBase ?? opts.clrHandle ?? import_zx4.chalk.whiteBright,
  clrActiveHandleBase: opts.clrActiveHandleBase ?? opts.clrHandleBase ?? opts.clrActiveHandle ?? opts.clrHandle ?? import_zx4.chalk.yellowBright.bold
});
var getChars = (opts) => ({
  track: opts.charTrack,
  handle: opts.charHandle,
  bar: opts.charBar,
  activeHandle: opts.charActiveHandle,
  handleBase: opts.charHandleBase,
  activeHandleBase: opts.charActiveHandleBase
});
var getColors = (opts) => ({
  track: opts.clrTrack,
  handle: opts.clrHandle,
  bar: opts.clrBar,
  activeHandle: opts.clrActiveHandle,
  handleBase: opts.clrHandleBase,
  activeHandleBase: opts.clrActiveHandleBase
});
var askTrim = async (totalFrames, frameRate, options = {}) => {
  const opts = getFullOptions2(options);
  const lc = getLineCounter();
  const deferred = (0, import_swiss_ak8.getDeferred)();
  const totalLength = (0, import_swiss_ak8.seconds)(Math.floor(totalFrames / frameRate));
  const showHours = totalLength > (0, import_swiss_ak8.hours)(1);
  let activeHandle = "start";
  const handles = {
    start: 0,
    end: totalFrames - 1
  };
  let displayCount = -1;
  const display = () => {
    displayCount++;
    lc.clear();
    const width = out.utils.getTerminalWidth();
    const totalSpace = width - 2;
    const handlePositions = import_swiss_ak8.ObjectUtils.mapValues(
      handles,
      (_k, value) => Math.floor(value / (totalFrames - 1) * totalSpace)
    );
    const befSpace = Math.max(0, handlePositions.start);
    const barSpace = Math.max(0, handlePositions.end - handlePositions.start);
    const aftSpace = Math.max(0, totalSpace - handlePositions.end);
    const char = getChars(opts);
    const cols = getColors(opts);
    const actvHand = cols.activeHandle(char.activeHandle);
    const inactvHand = cols.handle(char.handle);
    const handStart = activeHandle == "start" ? actvHand : inactvHand;
    const handEnd = activeHandle == "end" ? actvHand : inactvHand;
    const drawHandleLabels = () => {
      const handleLabelsRaw = import_swiss_ak8.ObjectUtils.mapValues(handles, (_k, value) => [
        ` ${toTimeCode(value, frameRate, showHours)} `,
        ""
      ]);
      const handleLabelWidths = import_swiss_ak8.ObjectUtils.mapValues(
        handleLabelsRaw,
        (_k, value) => Math.max(...value.map((s) => (0, import_string_width2.default)(s)))
      );
      const handleAligns = {
        start: handleLabelWidths.start > befSpace ? "left" : "right",
        end: handleLabelWidths.end > aftSpace ? "right" : "left"
      };
      const handleLabels = import_swiss_ak8.ObjectUtils.mapValues(
        handleLabelsRaw,
        (key, value) => value.map((l) => out.align(l, handleAligns[key], handleLabelWidths[key], " ", true))
      );
      const strtBef = handleAligns.start === "right";
      const endBef = handleAligns.end === "right";
      const potentialMaxLabelSpace = handlePositions.end - handlePositions.start;
      if (!strtBef && potentialMaxLabelSpace < handleLabelWidths.start) {
        handleLabels.start = handleLabels.start.map((s) => s.slice(0, Math.max(0, potentialMaxLabelSpace - 1)));
        handleLabelWidths.start = Math.max(...handleLabels.start.map((s) => (0, import_string_width2.default)(s)));
      }
      if (endBef && potentialMaxLabelSpace < handleLabelWidths.end) {
        handleLabels.end = handleLabels.end.map((s) => s.slice(s.length - Math.max(0, potentialMaxLabelSpace - 1)));
        handleLabelWidths.end = Math.max(...handleLabels.end.map((s) => (0, import_string_width2.default)(s)));
      }
      const befLabelSpace = Math.max(0, befSpace - (strtBef ? handleLabelWidths.start : 0));
      const barLabelSpace = Math.max(0, barSpace - (!strtBef ? handleLabelWidths.start : 0) - (endBef ? handleLabelWidths.end : 0));
      const aftLabelSpace = Math.max(0, aftSpace - (!endBef ? handleLabelWidths.end : 0));
      const bef = " ".repeat(befLabelSpace);
      const bar = " ".repeat(barLabelSpace);
      const aft = " ".repeat(aftLabelSpace);
      lc.log(
        `${bef}${strtBef ? handleLabels.start[0] : ""}${handStart}${!strtBef ? handleLabels.start[0] : ""}${bar}${endBef ? handleLabels.end[0] : ""}${handEnd}${!endBef ? handleLabels.end[0] : ""}${aft}`
      );
      lc.log(
        `${bef}${strtBef ? handleLabels.start[1] : ""}${handStart}${!strtBef ? handleLabels.start[1] : ""}${bar}${endBef ? handleLabels.end[1] : ""}${handEnd}${!endBef ? handleLabels.end[1] : ""}${aft}`
      );
    };
    const drawBottomLabels = () => {
      const startVideoLabel = `[${toTimeCode(0, frameRate, showHours)}]`;
      const endVideoLabel = `[${toTimeCode(totalFrames - 1, frameRate, showHours)}]`;
      const trimmedVideoLabel = toTimeCode(handles.end - handles.start, frameRate, showHours);
      const availSpace = width - ((0, import_string_width2.default)(startVideoLabel) + (0, import_string_width2.default)(endVideoLabel) + (0, import_string_width2.default)(trimmedVideoLabel));
      const centerPosition = handlePositions.start + Math.floor((handlePositions.end - handlePositions.start) / 2);
      const centerInSpace = centerPosition - (0, import_string_width2.default)(startVideoLabel) - Math.floor((0, import_string_width2.default)(trimmedVideoLabel) / 2) + 1;
      const bef = " ".repeat(Math.max(0, Math.min(availSpace, centerInSpace)));
      const aft = " ".repeat(Math.max(0, Math.min(availSpace, availSpace - centerInSpace)));
      lc.log(`${startVideoLabel}${bef}${trimmedVideoLabel}${aft}${endVideoLabel}`);
    };
    const drawBar = () => {
      const actvHand2 = cols.activeHandleBase(char.activeHandleBase);
      const inactvHand2 = cols.handleBase(char.handleBase);
      const handStart2 = activeHandle == "start" ? actvHand2 : inactvHand2;
      const handEnd2 = activeHandle == "end" ? actvHand2 : inactvHand2;
      const bef = cols.track(char.track.repeat(befSpace));
      const bar = cols.bar(char.bar.repeat(barSpace));
      const aft = cols.track(char.track.repeat(aftSpace));
      lc.log(`${bef}${handStart2}${bar}${handEnd2}${aft}`);
    };
    const drawInstructions = () => {
      if (opts.showInstructions && displayCount < 5) {
        const body = [
          [
            import_zx4.chalk.gray.dim(`[${import_swiss_ak8.symbols.TRI_LFT}/${import_swiss_ak8.symbols.TRI_RGT}] move ${opts.speed} frame${opts.speed > 1 ? "s" : ""}`),
            import_zx4.chalk.gray.dim(`[${import_swiss_ak8.symbols.TRI_UPP}/${import_swiss_ak8.symbols.TRI_DWN}] move ${opts.fastSpeed} frame${opts.fastSpeed > 1 ? "s" : ""}`),
            import_zx4.chalk.gray.dim(`[TAB] switch handle`),
            import_zx4.chalk.gray.dim(`[ENTER] submit`)
          ]
        ];
        lc.add(table.print(body, void 0, { drawOuter: false, drawRowLines: false, drawColLines: false, colWidths: [100], alignCols: ["center"] }));
      } else {
        lc.log();
      }
    };
    drawHandleLabels();
    drawBar();
    drawBottomLabels();
    drawInstructions();
  };
  const swapHandle = () => activeHandle = getNextHandle(activeHandle);
  const adjustHandle = (amount) => {
    handles[activeHandle] += amount;
    if (handles[activeHandle] < 0)
      handles[activeHandle] = 0;
    if (handles[activeHandle] > totalFrames - 1)
      handles[activeHandle] = totalFrames - 1;
    if (handles.end <= handles.start) {
      const oldStart = handles.start;
      const oldEnd = handles.end;
      handles.end = oldStart;
      handles.start = oldEnd;
      swapHandle();
    }
  };
  const submit = () => {
    kl.stop();
    lc.clear();
    const fixedHandles = { start: handles.start, end: handles.end - 1 };
    deferred.resolve(fixedHandles);
  };
  const updateHandles = (keyName) => {
    switch (keyName) {
      case "return":
        return submit();
      case "tab":
        swapHandle();
        break;
      case "left":
        adjustHandle(-opts.speed);
        break;
      case "right":
        adjustHandle(opts.speed);
        break;
      case "up":
        adjustHandle(opts.fastSpeed);
        break;
      case "down":
        adjustHandle(-opts.fastSpeed);
        break;
    }
    display();
  };
  const kl = getKeyListener(updateHandles, true);
  display();
  return deferred.promise;
};

// src/tools/ask/fileExplorer.ts
var import_swiss_ak9 = require("swiss-ak");
var displayPath = (p) => p.replace(process.env.HOME + "/", `${import_swiss_ak9.symbols.HOME}/`).replace("/Volumes/", `${import_swiss_ak9.symbols.EJECT}/`);
var getFullOpts = (opts) => ({
  filter: import_swiss_ak9.fn.result(true),
  makeDir: false,
  newFile: false,
  selectDirText: `[select '{{dir}}']`,
  makeDirText: "[create folder]",
  newFileText: "[new file]",
  enclosingText: "[back]",
  ...opts
});
var fileExplorer = async (startDir, selectType = "f", question, initial, options = {}) => {
  const opts = getFullOpts(options);
  const lc = getLineCounter();
  const quest = question ? typeof question === "string" ? question : question.get() : selectType === "d" ? "Choose a directory" : "Choose a file:";
  const fnDir = (dir) => (selectType === "d" ? chlk.gray5 : chlk.gray3)(`${import_swiss_ak9.symbols.CHEV_RGT} ${dir}`);
  const fnFiles = (dir) => (selectType === "d" ? chlk.gray2 : chlk.gray5)(`${selectType === "f" ? import_swiss_ak9.symbols.BULLET : " "} ${dir}`);
  const runExplorer = async (dir, runInitial, message) => {
    const dispLine = `${quest}${message ? chalk.red(` - ${message}`) : ""}`;
    const loader = ask.loading(dispLine);
    const dirs = await $$.findDirs(dir);
    const files = (await $$.findFiles(dir)).filter(opts.filter);
    loader.stop();
    const options2 = [
      { title: chlk.gray1("\u25B2 [back]"), value: ".." },
      selectType === "d" ? { title: `${chalk.greenBright(import_swiss_ak9.symbols.TICK)} ${opts.selectDirText.replace("{{dir}}", displayPath(dir))}`, value: "***SELECT***" } : void 0,
      opts.makeDir ? { title: `${chalk.cyanBright.bold("+")} ${opts.makeDirText}`, value: "***MAKE_DIR***" } : void 0,
      opts.newFile ? { title: `${chalk.blueBright.bold("+")} ${opts.newFileText}`, value: "***NEW_FILE***" } : void 0,
      ...ask.utils.itemsToPromptObjects(dirs, void 0, fnDir),
      ...ask.utils.itemsToPromptObjects(files, void 0, fnFiles)
    ].filter(import_swiss_ak9.fn.filters.exists);
    const result2 = await lc.wrap(1, () => ask.select(dispLine, options2, runInitial || "***SELECT***"));
    if (result2 === "***SELECT***") {
      lc.clear();
      return dir;
    }
    if (result2 === "***MAKE_DIR***") {
      lc.clear();
      const name = await ask.text("Enter a name for the new directory:", "untitled folder");
      await $$.mkdir(path.join(dir, name));
      lc.clear();
      return runExplorer($$.utils.removeTrailSlash(`${dir}/${name}`));
    }
    if (result2 === "***NEW_FILE***") {
      lc.clear();
      const name = await ask.text("Enter a name for the new file:", "untitled.txt");
      lc.clear();
      const filePath = `${dir}/${name}`;
      await $$.touch(filePath);
      if (selectType === "f") {
        return filePath;
      } else {
        return runExplorer(dir, runInitial);
      }
    }
    if (result2 === "..") {
      lc.clear();
      return runExplorer(explodePath(dir).dir);
    }
    if (dirs.includes(result2)) {
      lc.clear();
      return runExplorer($$.utils.removeTrailSlash(`${dir}/${result2}`));
    }
    if (selectType === "d" && files.includes(result2)) {
      lc.clear();
      return runExplorer(dir, runInitial, "Please select a directory");
    }
    return `${dir}/${result2}`;
  };
  const startDirs = [startDir].flat();
  const result = await (async () => {
    if (startDirs.length <= 1) {
      return await runExplorer($$.utils.removeTrailSlash(startDirs[0]), initial);
    } else {
      const options2 = ask.utils.itemsToPromptObjects(startDirs, void 0, fnDir);
      const result2 = await lc.wrap(1, () => ask.select(quest, options2));
      lc.clear();
      return await runExplorer($$.utils.removeTrailSlash(result2), initial);
    }
  })();
  lc.clear();
  ask.imitate(true, quest, displayPath(result));
  return result;
};
var multiFileExplorer = async (startDir, selectType = "f", question = "Choose files:", initial, options = {}) => {
  const questionText = typeof question === "string" ? question : question.get();
  const opts = getFullOpts(options);
  const lc = getLineCounter();
  const initiallySelected = initial ? [initial].flat() : [];
  const dir = await lc.wrap(
    1,
    () => ask.fileExplorer(startDir, "d", `${questionText} Select a directory`, initiallySelected[0] || "***SELECT***", {
      ...options
    })
  );
  const list = selectType === "f" ? (await $$.findFiles(dir)).filter(opts.filter) : (await $$.findDirs(dir)).filter(opts.filter);
  lc.clear();
  const choices = await ask.multiselect(questionText, list, initiallySelected, true);
  return choices.map((item) => `${dir}/${item}`);
};

// src/tools/ask/section.ts
var import_swiss_ak10 = require("swiss-ak");
var separator = (version = "down", spacing = 8, offset = 0, width = out.utils.getTerminalWidth() - 2) => {
  const lineChar = "\u2504";
  const chars = {
    down: "\u25BF",
    none: "\u25E6",
    up: "\u25B5"
  };
  const line = import_swiss_ak10.ArrayUtils.repeat(Math.floor(width / spacing) - offset, chars[version]).join(lineChar.repeat(spacing - 1));
  console.log(chlk.gray1(out.center(line, void 0, lineChar)));
  return 1;
};
var section = async (question, sectionFn, ...questionFns) => {
  const lc = getLineCounter();
  const sep = () => lc.add(separator("none", void 0, 1));
  if (sectionFn) {
    lc.add(separator("down"));
    await sectionFn(lc, sep);
    lc.add(separator("up"));
  }
  const results = [];
  if (questionFns.length) {
    for (let questionFn of questionFns) {
      const checkpoint = lc.checkpoint();
      results.push(await lc.wrap(1, () => questionFn(question, results, lc, sep)));
      lc.clearToCheckpoint(checkpoint);
    }
  }
  lc.clear();
  if (question) {
    let resultOut = "done";
    if (results.length === 1) {
      resultOut = results[0];
    }
    if (results.length > 1) {
      if (typeof results[0] === "boolean") {
        resultOut = results[0];
      }
      resultOut = results;
    }
    ask.imitate(true, question, resultOut);
  }
  return results;
};

// src/tools/ask/table.ts
var import_swiss_ak11 = require("swiss-ak");
var highlightFn = chalk.cyan.underline;
var askTableHandler = (isMulti, question, items, initial = [], rows, headers = [], tableOptions = {}) => {
  const questionText = typeof question === "string" ? question : question.get();
  const lc = getLineCounter();
  const deferred = (0, import_swiss_ak11.getDeferred)();
  let activeIndex = initial[0] !== void 0 ? typeof initial[0] === "number" ? initial[0] : items.indexOf(initial[0]) : 0;
  let selectedIndexes = initial.map((i) => typeof i === "number" ? i : items.indexOf(i)).filter((i) => i !== -1);
  lc.add(ask.imitate(false, questionText, `- Use arrow-keys. ${isMulti ? "Space to select. " : ""}Enter to ${isMulti ? "confirm" : "select"}.`));
  lc.checkpoint("AFTER_Q");
  let lastDrawnRows = [];
  const drawTable = () => {
    const tableOpts = {
      margin: [1, 0, 0, 0],
      ...tableOptions,
      format: [
        { formatFn: highlightFn, isBody: true, isHeader: false, row: activeIndex },
        ...tableOptions.format || []
      ]
    };
    let body;
    let header;
    if (rows) {
      body = typeof rows === "function" ? items.map(rows) : rows;
      header = headers;
    } else {
      const isHeaderObj = headers && !(headers instanceof Array);
      const objTable = table.utils.objectsToTable(items, isHeaderObj ? headers : void 0);
      body = objTable.body;
      header = isHeaderObj ? objTable.header : headers;
    }
    const finalBody = body.map((row, index) => {
      let firstCell;
      if (isMulti) {
        const selectedSym = import_swiss_ak11.symbols.RADIO_FULL;
        const unselectedSym = import_swiss_ak11.symbols.RADIO_EMPTY;
        firstCell = selectedIndexes.includes(index) ? chalk.reset(chalk.green(selectedSym)) : chalk.reset(unselectedSym);
      } else {
        firstCell = body.indexOf(row) === activeIndex ? chalk.reset(chalk.cyan(import_swiss_ak11.symbols.CURSOR)) : " ";
      }
      return [firstCell, ...row];
    });
    const finalHeaders = header.length ? header.map((row) => ["", ...row]) : [];
    lastDrawnRows = finalBody;
    lc.clearToCheckpoint("AFTER_Q");
    lc.add(table.print(finalBody, finalHeaders, tableOpts));
    lc.checkpoint("AFTER_TABLE");
  };
  drawTable();
  const move = (dir) => {
    activeIndex = (items.length + activeIndex + dir) % items.length;
    drawTable();
  };
  const toggle = () => {
    if (isMulti) {
      if (selectedIndexes.includes(activeIndex)) {
        selectedIndexes = selectedIndexes.filter((i) => i !== activeIndex);
      } else {
        selectedIndexes.push(activeIndex);
      }
    }
    drawTable();
  };
  const submit = () => {
    kl.stop();
    const results = (isMulti ? selectedIndexes.map((i) => items[i]) : [items[activeIndex]]).filter(import_swiss_ak11.fn.isTruthy);
    lc.clear();
    ask.imitate(true, questionText, isMulti ? `${results.length} selected` : results[0]);
    deferred.resolve(results);
  };
  const listenCallback = (key) => {
    switch (key) {
      case "up":
        return move(-1);
      case "down":
        return move(1);
      case "space":
        return toggle();
      case "return":
        return submit();
    }
  };
  const kl = getKeyListener(listenCallback, true);
  return deferred.promise;
};
var askTableSelect = async (question, items, initial, rows, headers, tableOptions) => {
  const results = await askTableHandler(false, question, items, [initial], rows, headers, tableOptions);
  return results[0];
};
var askTableMultiselect = (question, items, initial, rows, headers, tableOptions) => askTableHandler(true, question, items, initial, rows, headers, tableOptions);

// src/tools/ask.ts
var PROMPT_VALUE_PROPERTY = "SWISS_ZX_PROMPT_VALUE";
var promptsOptions = {
  onCancel() {
    process.exit(0);
  }
};
var text = async (question, initial) => {
  const message = typeof question === "string" ? question : question.get();
  const response = await (0, import_prompts.default)(
    {
      type: "text",
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
    },
    promptsOptions
  );
  return "" + response[PROMPT_VALUE_PROPERTY];
};
var autotext = async (question, choices, choiceLimit = 5) => {
  const message = typeof question === "string" ? question : question.get();
  let response = {};
  if (choices) {
    const choiceObjs = choices.map((choice) => typeof choice === "object" ? choice : { title: choice, value: choice });
    const fuzzy = new import_fuse.default(choiceObjs, {
      includeScore: false,
      keys: ["title", "value"]
    });
    response = await (0, import_prompts.default)(
      {
        type: "autocomplete",
        name: PROMPT_VALUE_PROPERTY,
        choices: choiceObjs,
        message,
        limit: choiceLimit,
        suggest: async (text2, ch) => {
          const filtered = fuzzy.search(text2);
          const list = text2 ? filtered.map(({ item }) => item) : choiceObjs;
          return list;
        }
      },
      promptsOptions
    );
  }
  return response[PROMPT_VALUE_PROPERTY];
};
var number = async (question, initial = 1) => {
  const message = typeof question === "string" ? question : question.get();
  const response = await (0, import_prompts.default)(
    {
      type: "number",
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
    },
    promptsOptions
  );
  return Number(response[PROMPT_VALUE_PROPERTY]);
};
var boolean = async (question, initial = true, yesTxt = "yes", noTxt = "no") => {
  const message = typeof question === "string" ? question : question.get();
  const response = await (0, import_prompts.default)(
    {
      type: "toggle",
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial: !initial,
      active: noTxt,
      inactive: yesTxt
    },
    promptsOptions
  );
  return !Boolean(response[PROMPT_VALUE_PROPERTY]);
};
var booleanAlt = async (question, initial = true) => {
  const message = typeof question === "string" ? question : question.get();
  const response = await (0, import_prompts.default)(
    {
      type: "confirm",
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
    },
    promptsOptions
  );
  return Boolean(response[PROMPT_VALUE_PROPERTY]);
};
var select = async (question, choices, initial) => {
  const message = typeof question === "string" ? question : question.get();
  const choiceObjs = choices.map((choice) => typeof choice === "object" ? choice : { title: choice, value: choice });
  let initialId = 0;
  if (initial) {
    initialId = (choiceObjs || []).map((x) => x && x.value ? x.value : x).indexOf(initial);
    if (initialId < 0)
      initialId = 0;
  }
  const response = await (0, import_prompts.default)(
    {
      type: "select",
      name: PROMPT_VALUE_PROPERTY,
      message,
      choices: choiceObjs,
      initial: initialId
    },
    promptsOptions
  );
  const value = response[PROMPT_VALUE_PROPERTY];
  return typeof value === "number" ? choiceObjs[value] : value;
};
var multiselect = async (question, choices, initial, canSelectAll = false) => {
  const message = typeof question === "string" ? question : question.get();
  if (!choices || choices.length === 0) {
    return [];
  }
  let choiceObjs = choices.map((choice) => typeof choice === "object" ? choice : { title: choice, value: choice });
  if (initial) {
    const initialSelected = [initial].flat();
    choiceObjs = choiceObjs.map((choice) => ({
      selected: Boolean(initialSelected.find((x) => x === choice || x === choice.value)),
      ...choice
    }));
  }
  if (canSelectAll) {
    choiceObjs = [{ title: chlk.gray4("[Select all]"), value: "***SELECT_ALL***" }, ...choiceObjs];
  }
  const response = await (0, import_prompts.default)(
    {
      type: "multiselect",
      name: PROMPT_VALUE_PROPERTY,
      instructions: false,
      message,
      choices: choiceObjs
    },
    promptsOptions
  );
  const result = response[PROMPT_VALUE_PROPERTY] ? response[PROMPT_VALUE_PROPERTY] : [];
  let selected = result.map((value) => typeof value === "number" ? choiceObjs[value] : value);
  if (selected.includes("***SELECT_ALL***")) {
    selected = choiceObjs.map((choice) => choice.value).filter((value) => !(value + "").startsWith("***") && !(value + "").endsWith("***"));
  }
  return selected;
};
var crud = async (question, itemName = "item", items, options = {}) => {
  const fullOptions = {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canDeleteAll: true,
    ...options
  };
  const opts = [{ title: import_zx5.chalk.dim(`${clr.approve(import_swiss_ak12.symbols.TICK)} [ Finished ]`), value: "none" }];
  if (fullOptions.canCreate) {
    opts.push({ title: `${clr.create(import_swiss_ak12.symbols.PLUS)} Add another ${itemName}`, value: "create" });
  }
  if (items.length > 0) {
    if (fullOptions.canUpdate) {
      opts.push({ title: `${clr.update(import_swiss_ak12.symbols.ARROW_ROTATE_CLOCK)} Change a ${itemName} value`, value: "update" });
    }
    if (fullOptions.canDelete) {
      opts.push({ title: `${clr.delete(import_swiss_ak12.symbols.CROSS)} Remove ${itemName}`, value: "delete" });
    }
    if (fullOptions.canDeleteAll) {
      opts.push({ title: `${clr.deleteAll(import_swiss_ak12.symbols.TIMES)} Remove all`, value: "delete-all" });
    }
  }
  return await ask.select(question, opts, "none");
};
var validate = async (askFunc, validateFn) => {
  const runLoop = async (initial, extraLines = 0) => {
    const input = await askFunc(initial);
    const validateResponse = await validateFn(input);
    if (validateResponse === true) {
      return input;
    } else {
      const message = validateResponse || "";
      moveUp(1 + extraLines);
      console.log(import_zx5.chalk.red(message));
      return runLoop(input, message.split("\n").length);
    }
  };
  return runLoop();
};
var imitateHighlight = import_zx5.chalk.cyanBright.bold.underline;
var getImitateResultText = (result, isChild = false) => {
  if (result instanceof Array) {
    if (result.length > 3)
      return `${result.length} selected`;
    return result.map((item) => getImitateResultText(item, true)).join(", ");
  }
  if (typeof result === "object") {
    const usableProps = ["name", "title", "display", "value"];
    for (let prop in usableProps) {
      if (result[prop])
        return result[prop];
    }
  }
  if (typeof result === "boolean") {
    if (isChild)
      return result + "";
    return result ? `${imitateHighlight("yes")} / no` : `yes / ${imitateHighlight("no")}`;
  }
  if (typeof result === "number") {
    return result + "";
  }
  if (typeof result === "string") {
    return result;
  }
  return "done";
};
var imitate = (done, question, result) => {
  const message = typeof question === "string" ? question : question.get();
  const resultText = getImitateResultText(result);
  const prefix = done ? import_zx5.chalk.green("\u2714") : import_zx5.chalk.cyan("?");
  const questionText = import_zx5.chalk.whiteBright.bold(message);
  const joiner = resultText ? import_zx5.chalk.gray(done ? "\u2026 " : "\u203A ") : "";
  const mainLength = (0, import_string_width3.default)(`${prefix} ${questionText} ${joiner}`);
  const maxLength = out.utils.getTerminalWidth() - mainLength - 1;
  let resultWrapper = hasColor(resultText) ? import_swiss_ak12.fn.noact : done ? import_zx5.chalk.white : import_zx5.chalk.gray;
  const resultOut = resultText ? truncate(`${resultWrapper(resultText)}`, maxLength) : "";
  console.log(`${prefix} ${questionText} ${joiner}${resultOut}`);
  return 1;
};
var prefill = async (value, question, askFn) => {
  if (value !== void 0) {
    ask.imitate(true, question, value);
    return value;
  }
  return askFn(question);
};
var loading2 = (question) => loading((s) => imitate(false, question, `[${s}]`));
var pause = async (text2 = "Press enter to continue...") => {
  const message = typeof text2 === "string" ? text2 : text2.get();
  console.log(import_zx5.chalk.gray(message));
  await $`read -n 1`;
};
var countdown = async (totalSeconds, template = (s) => `Starting in ${s}s...`, complete) => {
  console.log();
  let lines = 1;
  for (let s = totalSeconds; s > 0; s--) {
    const text2 = template(s);
    moveUp(lines);
    lines = text2.split("\n").length;
    console.log(import_zx5.chalk.blackBright(text2));
    await (0, import_swiss_ak12.wait)((0, import_swiss_ak12.seconds)(1));
  }
  moveUp(lines);
  if (complete) {
    console.log(complete);
  }
};
var getRenameObj = (bef, aft) => {
  const befExp = explodePath(bef);
  const aftName = aft(befExp);
  return {
    before: { name: befExp.filename, path: bef },
    after: { name: aftName, path: `${befExp.dir}/${aftName}` }
  };
};
var rename = async (bef, aft) => {
  const { before, after } = getRenameObj(bef, aft);
  console.log(import_zx5.chalk.green("Renaming:"));
  console.log(import_zx5.chalk.greenBright.bold(`	${before.name} ${import_zx5.chalk.dim("\u2192")} ${after.name}`));
  console.log("");
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await $$.mv(before.path, after.path);
  }
  return isConfirmed;
};
var wizard = (startObj = {}) => {
  let obj = { ...startObj };
  const history = [];
  history.push(obj);
  return {
    add(partial) {
      obj = {
        ...obj,
        ...partial
      };
      history.push(obj);
    },
    getPartial() {
      return obj;
    },
    get() {
      return obj;
    }
  };
};
var itemsToPromptObjects = (items, titles = [], titleFn) => {
  return items.map((item, index, arr) => ({ title: titleFn && titleFn(item, index, arr) || titles[index] || item + "", value: item }));
};
var ask = {
  text,
  autotext,
  number,
  boolean,
  booleanAlt,
  select,
  multiselect,
  crud,
  validate,
  imitate,
  prefill,
  loading: loading2,
  pause,
  countdown,
  rename,
  fileExplorer,
  multiFileExplorer,
  wizard,
  section,
  separator,
  trim: askTrim,
  table: {
    select: askTableSelect,
    multiselect: askTableMultiselect
  },
  utils: {
    itemsToPromptObjects,
    displayPath
  }
};

// src/tools/ffmpeg.ts
var import_zx6 = require("zx");
var import_swiss_ak13 = require("swiss-ak");
import_zx6.$.verbose = false;
var toFFmpegTimeFormat = (time) => new Date(time).toISOString().slice(14, 23);
var getProbeValue = async (file, propertyName) => (await import_zx6.$`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();
var getProbe = async (file) => {
  const full = await import_zx6.$`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;
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
var ffmpeg = async (command = () => import_zx6.$`ffmpeg -progress pr.txt`, progressFileName = "pr.txt", totalFrames = 1, progressBarOpts = {}) => {
  await import_zx6.$`echo "" > ${progressFileName}`;
  const ffmpegProcess = command();
  const tail = import_zx6.$`tail -f ${progressFileName}`.nothrow();
  const bar = (0, import_swiss_ak13.getProgressBar)(totalFrames, {
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
      await import_zx6.$`rm -rf ${progressFileName}`;
    }
  }
  await ffmpegProcess;
};

// src/tools/gm/utils.ts
var import_swiss_ak14 = require("swiss-ak");
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
  }
};
var flagsObjToArray = (obj) => {
  const { brightness, saturation, hue, ...rest } = obj;
  if (rest.modulate === void 0 && (brightness !== void 0 || saturation !== void 0 || hue !== void 0)) {
    rest.modulate = `${brightness ?? 100},${saturation ?? 100},${hue ?? 100}`;
  }
  return Object.entries(obj).filter(([name, value]) => value !== void 0 && value !== null && value !== false).map(([name, value]) => {
    var _a;
    return ["-" + name, (((_a = supportedFlags[name]) == null ? void 0 : _a.processOutput) || import_swiss_ak14.fn.noact)(value)];
  }).flat().filter((x) => x !== void 0 && x !== true);
};
var gmUtils = {
  supportedFlags,
  flagsObjToArray
};

// src/tools/gm.ts
var formaliseCompositeFlags = (flags) => {
  const hasObjs = Object.values(flags).some((val) => typeof val === "object");
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
var convert = async (inPath, outPath, flags = {}) => {
  const flagsArray = gmUtils.flagsObjToArray(flags);
  return await $`gm convert ${flagsArray} ${inPath} ${outPath} | cat`;
};
var composite = async (changePath, basePath, outPath = basePath, maskPath = "", flags = {}) => {
  const { change, mask } = formaliseCompositeFlags(flags);
  if (change.compose === "Screen") {
    await convert(basePath, outPath, { negate: !change.negate });
    const result = await composite(changePath, outPath, outPath, maskPath, {
      change: {
        ...change,
        compose: "Multiply",
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
var pipe = async (changePath, basePath, outPath = basePath, maskPath = "", convertFlags = {}, compositeFlags = {}) => {
  const { change, mask } = formaliseCompositeFlags(compositeFlags);
  const chngFlags = gmUtils.flagsObjToArray(change);
  const maskFlags = gmUtils.flagsObjToArray(mask);
  const convFlags = gmUtils.flagsObjToArray(convertFlags);
  return await $`gm convert ${convFlags} ${changePath} MIFF:- | gm composite ${chngFlags} MIFF:- ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};
var gm = {
  convert,
  composite,
  pipe,
  utils: gmUtils
};

// src/tools/os.ts
var closeFinder = async () => {
  await $`osascript -e 'tell application "Finder" to close every window'`;
};

// src/tools/progressBar.ts
var import_swiss_ak15 = require("swiss-ak");
var getColouredProgressBarOpts = (opts, randomise = false) => {
  let wrapperFns = [chalk.yellowBright, chalk.magenta, chalk.blueBright, chalk.cyanBright, chalk.greenBright, chalk.redBright];
  if (randomise) {
    wrapperFns = import_swiss_ak15.ArrayUtils.randomise(wrapperFns);
  }
  let index = 0;
  return (prefix = "", override = {}, resetColours = false) => {
    if (resetColours) {
      index = 0;
    }
    const result = {
      ...opts,
      prefix,
      ...override
    };
    if (!result.wrapperFn) {
      result.wrapperFn = wrapperFns[index % wrapperFns.length];
      index++;
    }
    if (result.prefix && result.prefixWidth) {
      result.prefix = truncate(result.prefix, result.prefixWidth, "\u2026");
    }
    return result;
  };
};
var progressBarUtils = {
  getColouredProgressBarOpts
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $$,
  LogUtils,
  PathUtils,
  align,
  ask,
  center,
  chlk,
  closeFinder,
  clr,
  explodePath,
  ffmpeg,
  getBreadcrumb,
  getKeyListener,
  getLineCounter,
  getLog,
  getLogStr,
  getProbe,
  getProbeValue,
  getTotalFrames,
  gm,
  hasColor,
  justify,
  left,
  limitToLength,
  limitToLengthEnd,
  loading,
  moveUp,
  out,
  pad,
  processLogContents,
  progressBarUtils,
  right,
  table,
  toFFmpegTimeFormat,
  truncate,
  wrap
});
