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
  ask: () => ask,
  center: () => center,
  chlk: () => chlk_exports,
  closeFinder: () => closeFinder,
  explodePath: () => explodePath,
  ffmpeg: () => ffmpeg,
  getLineCounter: () => getLineCounter,
  getLog: () => getLog,
  getLogStr: () => getLogStr,
  getProbe: () => getProbe,
  getProbeValue: () => getProbeValue,
  getTotalFrames: () => getTotalFrames,
  gm: () => gm,
  left: () => left,
  loading: () => loading,
  moveUp: () => moveUp,
  out: () => out_exports,
  pad: () => pad,
  printTable: () => printTable,
  processLogContents: () => processLogContents,
  right: () => right,
  wrap: () => wrap
});
module.exports = __toCommonJS(src_exports);

// src/tools/$$.ts
var import_globals = require("zx/globals");
var import_zx = require("zx");
var import_swiss_ak = require("swiss-ak");
import_zx.$.verbose = false;
var fs = import_zx.fs.promises;
var intoLines = (out) => out.toString().split("\n").filter(import_swiss_ak.fn.isTruthy);
var removeTrailSlash = (path) => path.replace(/\/$/, "");
var trailSlash = (path) => removeTrailSlash(path) + "/";
var removeDoubleSlashes = (path) => path.replace(/\/\//g, "/");
var ls = async (dir = ".", flags = []) => intoLines(await import_zx.$`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);
var rm = (item) => import_zx.$`rm -rf ${item}`;
var mkdir = (item) => import_zx.$`mkdir -p ${item}`;
var cp = (a, b) => import_zx.$`cp -r ${a} ${b}`;
var mv = (a, b) => import_zx.$`mv ${a} ${b}`;
var touch = (item) => import_zx.$`touch ${item}`;
var cat = (item) => import_zx.$`cat ${item}`;
var grep = async (pattern, file) => intoLines(await import_zx.$`grep ${pattern} ${file}`);
var convertFindOptionsToFlags = (options) => {
  const { type, maxdepth, name, regex, removePath } = options;
  const flags = [];
  if (type)
    flags.push("-type", type);
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
var rsync = (a, b, flags = []) => import_zx.$`rsync -crut ${a} ${b} ${flags}`;
var sync = (a, b) => rsync(trailSlash(a), trailSlash(b), ["--delete"]);
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
  ls,
  find,
  findDirs,
  findFiles,
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
var import_zx4 = require("zx");
var import_swiss_ak4 = require("swiss-ak");
var import_prompts = __toESM(require("prompts"));
var import_fuse = __toESM(require("fuse.js"));

// src/tools/out.ts
var out_exports = {};
__export(out_exports, {
  center: () => center,
  left: () => left,
  loading: () => loading,
  moveUp: () => moveUp,
  pad: () => pad,
  right: () => right,
  wrap: () => wrap
});

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

// src/tools/out.ts
var import_string_width = __toESM(require("string-width"));
var import_swiss_ak3 = require("swiss-ak");
var getDefaultColumns = () => {
  var _a;
  return ((_a = process == null ? void 0 : process.stdout) == null ? void 0 : _a.columns) || 100;
};
var getLines = (text2) => text2.split("\n").map((line) => line.trim());
var getOutputLines = (item) => getLines(getLogStr(item));
var pad = (line, start, end, replaceChar = " ") => `${replaceChar.repeat(Math.max(0, start))}${line}${replaceChar.repeat(Math.max(0, end))}`;
var center = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, Math.floor((width - (0, import_string_width.default)(line)) / 2), Math.ceil((width - (0, import_string_width.default)(line)) / 2), replaceChar)).join("\n");
var left = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, 0, width - (0, import_string_width.default)(line), replaceChar)).join("\n");
var right = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, width - (0, import_string_width.default)(line), 0, replaceChar)).join("\n");
var wrap = (item, width = getDefaultColumns()) => getOutputLines(item).map((line) => {
  if ((0, import_string_width.default)(line) > width) {
    const words = line.split(/(?<=#?[ -]+)/g);
    const rows = [];
    let rowStartIndex = 0;
    for (let wIndex in words) {
      const word = words[wIndex];
      const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex) - 1));
      const candText = candidateRow.join("");
      if ((0, import_string_width.default)(candText) + (0, import_string_width.default)(word) > width) {
        rows.push(candidateRow);
        rowStartIndex = Number(wIndex) - 1;
      }
    }
    const remaining = words.slice(rowStartIndex);
    rows.push(remaining);
    return rows.map((row) => row.join("").trim()).filter((x) => x);
  }
  return line;
}).flat().join("\n");
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
var loadingDefault = (s) => console.log(`Loading${s}`);
var loading = (action = loadingDefault, lines = 1, symbols = [".  ", ".. ", "..."]) => {
  let stopped = false;
  let count = 0;
  const runLoop = async () => {
    if (stopped)
      return;
    if (count)
      moveUp(lines);
    action(symbols[count++ % symbols.length]);
    await (0, import_swiss_ak3.wait)(500);
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

// src/tools/chlk.ts
var chlk_exports = {};
__export(chlk_exports, {
  gray: () => gray,
  gray0: () => gray0,
  gray1: () => gray1,
  gray2: () => gray2,
  gray3: () => gray3,
  gray4: () => gray4,
  gray5: () => gray5,
  grays: () => grays
});
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

// src/tools/PathUtils.ts
var PathUtils_exports = {};
__export(PathUtils_exports, {
  explodePath: () => explodePath
});
var explodePath = (filepath) => {
  const dir = (filepath.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, "");
  const filename = (filepath.match(/[^\\\/]*$/) || [])[0];
  const ext = ((filename.match(/\.[^\.]*$/) || [])[0] || "").replace(/^\./, "");
  const name = filename.replace(ext, "").replace(/[\.]$/, "");
  return { dir, name, ext, filename };
};

// src/tools/ask.ts
var PROMPT_VALUE_PROPERTY = "SWISS_ZX_PROMPT_VALUE";
var promptsOptions = {
  onCancel() {
    process.exit(0);
  }
};
var text = async (message, initial) => {
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
var autotext = async (message, choices, choiceLimit = 5) => {
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
var number = async (message, initial = 1) => {
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
var boolean = async (message) => {
  const response = await (0, import_prompts.default)(
    {
      type: "confirm",
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial: true
    },
    promptsOptions
  );
  return Boolean(response[PROMPT_VALUE_PROPERTY]);
};
var select = async (message, choices, initial) => {
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
      initial: initialId,
      hint: "- Arrow keys to select. Enter/Return to submit"
    },
    promptsOptions
  );
  const value = response[PROMPT_VALUE_PROPERTY];
  return typeof value === "number" ? choiceObjs[value] : value;
};
var multiselect = async (message, choices, initial) => {
  const choiceObjs = choices.map((choice) => typeof choice === "object" ? choice : { title: choice, value: choice });
  let initialId = 0;
  if (initial) {
    initialId = (choiceObjs || []).map((x) => x && x.value ? x.value : x).indexOf(initial);
    if (initialId < 0)
      initialId = 0;
  }
  const response = await (0, import_prompts.default)(
    {
      type: "multiselect",
      name: PROMPT_VALUE_PROPERTY,
      instructions: false,
      message,
      choices: choiceObjs,
      initial: initialId,
      hint: "- Space to select. Enter/Return to submit"
    },
    promptsOptions
  );
  const result = response[PROMPT_VALUE_PROPERTY] ? response[PROMPT_VALUE_PROPERTY] : [0];
  return result.map((value) => typeof value === "number" ? choiceObjs[value] : value);
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
      console.log(import_zx4.chalk.red(message));
      return runLoop(input, message.split("\n").length);
    }
  };
  return runLoop();
};
var imitate = (done, questionText, resultText) => {
  const prefix = done ? import_zx4.chalk.green("\u2714") : import_zx4.chalk.cyan("?");
  const question = import_zx4.chalk.whiteBright.bold(questionText);
  const joiner = import_zx4.chalk.gray(done ? "\u2026" : "\u203A");
  const resultWrapper = done ? import_zx4.chalk.white : import_zx4.chalk.gray;
  const result = resultText ? `${joiner} ${resultWrapper(resultText)}` : "";
  console.log(`${prefix} ${question} ${result}`);
  return 1;
};
var loading2 = (questionText) => loading((s) => imitate(false, questionText, `[Loading${s}]`));
var pause = async (text2 = "Press enter to continue...") => {
  console.log(import_zx4.chalk.gray(text2));
  await $`read -n 1`;
};
var countdown = async (totalSeconds, template = (s) => `Starting in ${s}s...`, complete) => {
  console.log();
  let lines = 1;
  for (let s = totalSeconds; s > 0; s--) {
    const text2 = template(s);
    moveUp(lines);
    lines = text2.split("\n").length;
    console.log(import_zx4.chalk.blackBright(text2));
    await (0, import_swiss_ak4.wait)((0, import_swiss_ak4.seconds)(1));
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
  console.log(import_zx4.chalk.green("Renaming:"));
  console.log(import_zx4.chalk.greenBright.bold(`	${before.name} ${import_zx4.chalk.dim("\u2192")} ${after.name}`));
  console.log("");
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await $$.mv(before.path, after.path);
  }
  return isConfirmed;
};
var fileExplorer = async (startDir, filter = import_swiss_ak4.fn.result(true), questionText = "Choose a file:") => {
  const fnDir = gray5;
  const fnFiles = gray3;
  const runExplorer = async (dir) => {
    const loader = loading2(questionText);
    const dirs = await $$.findDirs(dir);
    const files = (await $$.findFiles(dir)).filter(filter);
    loader.stop();
    const options = [
      { title: gray1("\u25B2 [back]"), value: ".." },
      ...dirs.map((dir2) => ({ title: fnDir(`\u203A ${dir2}`), value: dir2 })),
      ...files.map((file) => ({ title: fnFiles(`${file}`), value: file }))
    ];
    const result = await ask.select(questionText, options, dirs[0] || files[0]);
    if (result === "..") {
      moveUp(1);
      return runExplorer(explodePath(dir).dir);
    }
    if (dirs.includes(result)) {
      moveUp(1);
      return runExplorer($$.utils.removeTrailSlash(`${dir}/${result}`));
    }
    return `${dir}/${result}`;
  };
  const startDirs = [startDir].flat();
  if (startDirs.length <= 1) {
    return await runExplorer($$.utils.removeTrailSlash(startDirs[0]));
  } else {
    const options = startDirs.map((dir) => ({ title: fnDir(`\u203A ${explodePath(dir).name}`), value: dir }));
    const result = await ask.select(questionText, options);
    moveUp(1);
    return await runExplorer($$.utils.removeTrailSlash(result));
  }
};
var ask = {
  text,
  autotext,
  number,
  boolean,
  select,
  multiselect,
  validate,
  imitate,
  loading: loading2,
  pause,
  countdown,
  rename,
  fileExplorer
};

// src/tools/ffmpeg.ts
var import_swiss_ak5 = require("swiss-ak");
var getProbeValue = async (file, propertyName) => (await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep ${propertyName} | head -n 1 | sed -e 's/.*=//'`).toString();
var getProbe = async (file, props) => {
  const full = await $`ffprobe -select_streams v -show_streams ${file} 2>/dev/null | grep =`;
  return Object.fromEntries(
    full.toString().split("\n").map((line) => line.split("=")).filter(([key]) => !props || props.includes(key)).map(([key, value]) => {
      let newValue = value;
      if (!Number.isNaN(Number(newValue)))
        newValue = Number(newValue);
      return [key, newValue];
    })
  );
};
var getTotalFrames = async (list) => {
  if (!list) {
    list = (await $$.ls()).filter((file) => file.endsWith(".MOV"));
  }
  const counts = await Promise.all(list.map(async (file) => getProbeValue(file, "nb_frames")));
  const totalFrames = counts.map((count) => Number(count.trim())).reduce((acc, cur) => acc + cur, 0);
  return totalFrames;
};
var readChunk = (chunk) => Object.fromEntries(
  chunk.toString().split("\n").filter((row) => row && row.includes("=")).map(
    (row) => row.split("=").map((str) => str.trim()).slice(0, 2)
  )
);
var ffmpeg = async (command = () => $`ffmpeg -progress pr.txt`, progressFileName = "pr.txt", totalFrames = 1, progressBarOpts = {}) => {
  await $`echo "" > ${progressFileName}`;
  const ffmpegProcess = command();
  const tail = $`tail -f ${progressFileName}`.nothrow();
  const bar = (0, import_swiss_ak5.getProgressBar)(totalFrames, {
    showCount: true,
    showPercent: true,
    chalk,
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
      await ffmpegProcess.kill();
      await $`rm -rf ${progressFileName}`;
    }
  }
  await ffmpegProcess;
};

// src/tools/lineCounter.ts
var getLineCounter = () => {
  let lineCount = 0;
  return {
    log(...args) {
      const added = args.map(getLogStr).join(" ").split("\n").length;
      lineCount += added;
      console.log(...args);
      return added;
    },
    wrap: (newLines = 1, func, ...args) => {
      const result = func(...args);
      if (newLines === void 0) {
        const resultNum = Number(result);
        lineCount += Number.isNaN(resultNum) ? 1 : resultNum;
      } else {
        lineCount += newLines;
      }
      return result;
    },
    add(newLines) {
      lineCount += newLines;
      return lineCount;
    },
    get() {
      return lineCount;
    },
    clear() {
      moveUp(lineCount);
      lineCount = 0;
      return lineCount;
    }
  };
};

// src/tools/printTable.ts
var import_swiss_ak6 = require("swiss-ak");
var import_string_width2 = __toESM(require("string-width"));
var getFullOptions = (opts) => ({
  overrideChar: "",
  overrideHorChar: opts.overrideChar || "",
  overrideVerChar: opts.overrideChar || "",
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== "function" ? import_swiss_ak6.fn.noact : opts.wrapperFn,
  drawOuter: opts.drawOuter === void 0 ? true : opts.drawOuter
});
var printTable = (body, header, opts = {}) => {
  const { wrapperFn, overrideChar, overrideHorChar, overrideVerChar, drawOuter } = getFullOptions(opts);
  const lc = getLineCounter();
  const allRows = () => [...header || [], ...body];
  const numCols = Math.max(...allRows().map((row) => row.length));
  const empty = (char = "") => new Array(numCols).fill(char);
  const correctRow = (row) => [...row, ...empty()].slice(0, numCols).map((cell) => "" + cell);
  header = header && header.map(correctRow);
  body = body.map(correctRow);
  const colWidths = (0, import_swiss_ak6.zip)(...allRows()).map((col) => Math.max(...col.map((s) => (0, import_string_width2.default)(s || ""))));
  const printRow = (row = empty(), padChar = " ", joinChar = "\u2502", startChar = joinChar, endChar = joinChar, isHor = false, textWrapperFn) => {
    const orientOverride = isHor ? overrideHorChar : overrideVerChar;
    const padC = (isHor ? overrideHorChar : void 0) || overrideChar || padChar;
    const joinC = orientOverride || overrideChar || joinChar;
    const startC = drawOuter ? orientOverride || overrideChar || startChar : "";
    const endC = drawOuter ? orientOverride || overrideChar || endChar : "";
    let padded = row.map((cell, col) => left(cell || "", colWidths[col], padC));
    if (textWrapperFn)
      padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${padC}${joinC}${padC}`);
    const str = `${startC}${padC}${inner}${padC}${endC}`;
    lc.log(wrapperFn(str));
  };
  if (header) {
    if (drawOuter)
      printRow(empty(""), "\u2501", "\u2533", "\u250F", "\u2513", true);
    for (let row of header) {
      printRow(row, " ", "\u2503", void 0, void 0, false, chalk.bold);
    }
    printRow(empty(""), "\u2501", "\u2547", "\u2521", "\u2529", true);
  } else {
    if (drawOuter)
      printRow(empty(""), "\u2500", "\u252C", "\u250C", "\u2510", true);
  }
  for (let row of body) {
    printRow(row);
  }
  if (drawOuter)
    printRow(empty(""), "\u2500", "\u2534", "\u2514", "\u2518", true);
  return lc.get();
};

// src/utils/arrayToNLList.ts
var arrayToNLList = (arr) => {
  let joinArr = arr;
  if (joinArr.length >= 2) {
    joinArr = [joinArr.slice(0, -1).join(", "), "&", ...joinArr.slice(-1)];
  }
  return joinArr.join(" ");
};

// src/tools/gm.ts
var supportedFlags = {
  compose: [
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
  displace: "string",
  dissolve: "number",
  geometry: "string",
  gravity: ["Center", "North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"],
  negate: "boolean",
  quality: "number",
  resize: "string",
  rotate: "number",
  size: "string"
};
var printFlagsTable = (flagsObjArray, overrideHeader, extraRow) => {
  const lc = getLineCounter();
  const allFlagNames = flagsObjArray.map((flagsObj) => Object.keys(flagsObj)).flat();
  const header = overrideHeader || [["Flag", ...flagsObjArray.map((v, i) => `#${i + 1}`)]];
  const body = allFlagNames.length === 0 ? [["none"]] : allFlagNames.map((flagName) => {
    return [
      [flagName, ...flagsObjArray.map((obj) => obj[flagName] === void 0 ? "" : getLogStr(obj[flagName]))],
      ["", ""]
    ];
  }).flat().slice(0, -1);
  if (extraRow) {
    const extraRowVal = extraRow(header, body);
    body.unshift([]);
    body.unshift(extraRowVal);
  }
  lc.add(
    printTable(body, header, {
      drawOuter: true,
      wrapperFn: chalk.white
    })
  );
  lc.log();
  return lc.get();
};
var askFlags = async (name, previousFlagsObj = {}) => {
  const selectedFlags = {
    ...previousFlagsObj
  };
  const runFlagInput = async () => {
    const lc = getLineCounter();
    lc.log(chalk.gray(`Flags selected for ${name}:`));
    lc.add(printFlagsTable([selectedFlags], [["Flag", "Value"]]));
    const selectedFlagNames = Object.keys(selectedFlags);
    const addableFlags = Object.keys(supportedFlags).filter((flag) => !selectedFlagNames.includes(flag));
    const options = [{ title: `Nothing - All Done for ${name}`, value: "none" }];
    if (addableFlags.length > 0) {
      options.push({ title: "Add another flag", value: "add" });
    }
    if (selectedFlagNames.length > 0) {
      options.push(
        ...[
          { title: "Change a flag value", value: "change" },
          { title: "Remove flag(s)", value: "remove-many" },
          { title: "Remove all flags", value: "remove-all" }
        ]
      );
    }
    const actionType = await lc.wrap(1, () => ask.select(`${name}: What would you like to do next?`, options, "add"));
    if (actionType === "none") {
      moveUp(lc.get());
      return;
    }
    if (actionType === "add" || actionType === "change") {
      const opts = actionType === "add" ? addableFlags : selectedFlagNames;
      const flagName = await lc.wrap(1, () => ask.select(`${name}: What flag would you like to ${actionType}?`, opts)) + "";
      const flagConfig = supportedFlags[flagName];
      const previousValue = selectedFlags[flagName] || previousFlagsObj[flagName];
      const valueQuestion = `${name}: What value would you like for -${flagName} flag?`;
      let flagValue = void 0;
      if (flagConfig instanceof Array) {
        flagValue = await lc.wrap(1, () => ask.select(valueQuestion, flagConfig, previousValue));
      }
      if (flagConfig === "string") {
        flagValue = await lc.wrap(1, () => ask.text(valueQuestion, previousValue || "")) || void 0;
      }
      if (flagConfig === "number") {
        flagValue = await lc.wrap(1, () => ask.number(valueQuestion, previousValue || 0));
      }
      if (flagConfig === "boolean") {
        flagValue = true;
      }
      if (flagValue !== void 0) {
        selectedFlags[flagName] = flagValue;
      }
    }
    if (actionType === "remove-many" || actionType === "remove-all") {
      let flagNames = selectedFlagNames;
      if (actionType === "remove-many") {
        flagNames = await lc.wrap(1, () => ask.multiselect(`${name}: Which flags would you like to remove?`, selectedFlagNames));
      }
      const flagsStr = actionType === "remove-all" ? "all" : arrayToNLList(flagNames);
      const confirmed = await lc.wrap(1, () => ask.boolean(`${name}: Are you sure you want to remove ${flagsStr}`));
      if (confirmed) {
        for (let flagName of flagNames) {
          selectedFlags[flagName] = void 0;
          delete selectedFlags[flagName];
        }
      }
    }
    lc.clear();
    await runFlagInput();
  };
  await runFlagInput();
  return selectedFlags;
};
var flagsObjToArray = (obj) => {
  return Object.entries(obj).map(([name, value]) => ["-" + name, value]).flat().filter((x) => x !== void 0 && x !== true);
};
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
  const flagsArray = flagsObjToArray(flags);
  return await $`gm convert ${flagsArray} ${inPath} ${outPath}`;
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
  const changeFlags = flagsObjToArray(change);
  const maskFlags = flagsObjToArray(mask);
  return await $`gm composite ${changeFlags} ${changePath} ${basePath} ${maskFlags} ${maskPath} ${outPath}`;
};
var gm = {
  convert,
  composite,
  ask: {
    flags: askFlags
  },
  utils: {
    supportedFlags,
    printFlagsTable,
    flagsObjToArray
  }
};

// src/tools/os.ts
var closeFinder = async () => {
  await $`osascript -e 'tell application "Finder" to close every window'`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $$,
  LogUtils,
  PathUtils,
  ask,
  center,
  chlk,
  closeFinder,
  explodePath,
  ffmpeg,
  getLineCounter,
  getLog,
  getLogStr,
  getProbe,
  getProbeValue,
  getTotalFrames,
  gm,
  left,
  loading,
  moveUp,
  out,
  pad,
  printTable,
  processLogContents,
  right,
  wrap
});
