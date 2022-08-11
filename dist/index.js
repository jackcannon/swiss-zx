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
  $_: () => __exports,
  LogUtils: () => LogUtils_exports,
  PathUtils: () => PathUtils_exports,
  ask: () => ask,
  cat: () => cat,
  center: () => center,
  checkDirectoryExists: () => checkDirectoryExists,
  checkFileExists: () => checkFileExists,
  closeFinder: () => closeFinder,
  cp: () => cp,
  explodePath: () => explodePath,
  ffmpeg: () => ffmpeg,
  find: () => find,
  findDirs: () => findDirs,
  findFiles: () => findFiles,
  getLineCounter: () => getLineCounter,
  getLog: () => getLog,
  getLogStr: () => getLogStr,
  getProbe: () => getProbe,
  getProbeValue: () => getProbeValue,
  getTotalFrames: () => getTotalFrames,
  grep: () => grep,
  left: () => left,
  ls: () => ls,
  mkdir: () => mkdir,
  moveUp: () => moveUp,
  mv: () => mv,
  out: () => out_exports,
  pad: () => pad,
  printTable: () => printTable,
  processLogContents: () => processLogContents,
  readJSON: () => readJSON,
  retry: () => retry,
  right: () => right,
  rm: () => rm,
  touch: () => touch,
  tryOr: () => tryOr,
  wrap: () => wrap,
  writeJSON: () => writeJSON
});
module.exports = __toCommonJS(src_exports);

// src/tools/$_.ts
var __exports = {};
__export(__exports, {
  cat: () => cat,
  checkDirectoryExists: () => checkDirectoryExists,
  checkFileExists: () => checkFileExists,
  cp: () => cp,
  find: () => find,
  findDirs: () => findDirs,
  findFiles: () => findFiles,
  grep: () => grep,
  ls: () => ls,
  mkdir: () => mkdir,
  mv: () => mv,
  readJSON: () => readJSON,
  rm: () => rm,
  touch: () => touch,
  writeJSON: () => writeJSON
});
var import_globals = require("zx/globals");
var import_zx = require("zx");

// src/tools/errorHandling.ts
var import_swiss_ak = require("swiss-ak");
var tryOr = async (orValue, func, ...args) => {
  try {
    return await func(...args);
  } catch (err) {
    return orValue;
  }
};
var retry = async (maxTries = 10, delay = 0, suppress = true, run = () => {
}) => {
  const loop = async (attempt, lastErr) => {
    if (attempt >= maxTries) {
      if (!suppress)
        throw lastErr;
      return;
    }
    try {
      const result = await run(attempt);
      return result;
    } catch (err) {
      if (delay)
        await (0, import_swiss_ak.wait)(delay);
      return await loop(attempt + 1, err);
    }
  };
  return await loop(0);
};

// src/tools/$_.ts
var fs = import_zx.fs.promises;
var ls = async (dir = ".", flags = []) => (await import_zx.$`ls ${flags.map((flag) => `-${flag}`)} ${dir}`).toString().split("\n").filter((row) => row);
var findDirs = async (parent) => (await import_zx.$`find ${parent} -maxdepth 1 -type d -execdir echo {} ';'`).toString().split("\n").filter((row) => row).map((row) => row.replace(/\/$/, ""));
var findFiles = async (parent) => (await import_zx.$`find ${parent} -maxdepth 1 -type f -execdir echo {} ';'`).toString().split("\n").filter((row) => row);
var rm = (item) => import_zx.$`rm -rf ${item}`;
var mkdir = (item) => import_zx.$`mkdir -p ${item}`;
var cp = (a, b) => import_zx.$`cp -r ${a} ${b}`;
var mv = (a, b) => import_zx.$`mv ${a} ${b}`;
var touch = (item) => import_zx.$`touch ${item}`;
var cat = (item) => import_zx.$`cat ${item}`;
var grep = (item, pattern) => import_zx.$`grep ${pattern} ${item}`;
var find = (item, pattern) => import_zx.$`find ${item} -name ${pattern}`;
var checkFileExists = async (file) => await import_zx.$`[[ -f ${file} ]]`.exitCode === 0;
var checkDirectoryExists = async (dir) => await import_zx.$`[[ -d ${dir} ]]`.exitCode === 0;
var readJSON = async (filepath) => {
  const raw = await tryOr("{}", () => fs.readFile(filepath, { encoding: "utf8" }));
  return JSON.parse(raw || "{}");
};
var writeJSON = async (filepath, obj) => {
  const raw = (obj ? JSON.stringify(obj, null, 2) : "") || "{}";
  return await tryOr(null, () => fs.writeFile(filepath, raw, { encoding: "utf8" }));
};

// src/tools/ask.ts
var import_zx3 = require("zx");
var import_swiss_ak3 = require("swiss-ak");
var import_prompts = __toESM(require("prompts"));
var import_fuse = __toESM(require("fuse.js"));

// src/tools/out.ts
var out_exports = {};
__export(out_exports, {
  center: () => center,
  left: () => left,
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
var processLogContents = (prefix, wrapper = import_swiss_ak2.noact, ...args) => args.map(getLogStr).join(" ").split("\n").map((line, index) => import_zx2.chalk.bold(index ? " ".repeat(prefix.length) : prefix) + " " + wrapper(line)).join("\n");
var getLog = (prefix, wrapper = import_swiss_ak2.noact) => (...args) => {
  console.log(processLogContents(prefix, wrapper, ...args));
};

// src/tools/out.ts
var getDefaultColumns = () => {
  var _a;
  return ((_a = process == null ? void 0 : process.stdout) == null ? void 0 : _a.columns) || 100;
};
var getLines = (text2) => text2.split("\n").map((line) => line.trim());
var getOutputLines = (item) => getLines(getLogStr(item));
var pad = (line, start, end, replaceChar = " ") => `${replaceChar.repeat(Math.max(0, start))}${line}${replaceChar.repeat(Math.max(0, end))}`;
var center = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, Math.floor((width - line.length) / 2), Math.ceil((width - line.length) / 2), replaceChar)).join("\n");
var left = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, 0, width - line.length, replaceChar)).join("\n");
var right = (item, width = getDefaultColumns(), replaceChar = " ") => getOutputLines(item).map((line) => pad(line, width - line.length, 0, replaceChar)).join("\n");
var wrap = (item, width = getDefaultColumns()) => getOutputLines(item).map((line) => {
  if (line.length > width) {
    const words = line.split(/(?<=#?[ -]+)/g);
    const rows = [];
    let rowStartIndex = 0;
    for (let wIndex in words) {
      const word = words[wIndex];
      const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex) - 1));
      const candText = candidateRow.join("");
      if (candText.length + word.length > width) {
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
var moveUp = (lines = 2) => {
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
      console.log(import_zx3.chalk.red(message));
      return runLoop(input, message.split("\n").length);
    }
  };
  return runLoop();
};
var imitate = (done, questionText, resultText) => {
  const prefix = done ? import_zx3.chalk.green("\u2714") : import_zx3.chalk.cyan("?");
  const question = import_zx3.chalk.whiteBright.bold(questionText);
  const joiner = import_zx3.chalk.gray(done ? "\u2026" : "\u203A");
  const resultWrapper = done ? import_zx3.chalk.white : import_zx3.chalk.gray;
  const result = resultText ? `${joiner} ${resultWrapper(resultText)}` : "";
  console.log(`${prefix} ${question} ${result}`);
  return 1;
};
var pause = async (text2 = "Press enter to continue...") => {
  console.log(import_zx3.chalk.gray(text2));
  await $`read -n 1`;
};
var countdown = async (totalSeconds, template = (s) => `Starting in ${s}s...`, complete) => {
  console.log();
  let lines = 1;
  for (let s = totalSeconds; s > 0; s--) {
    const text2 = template(s);
    moveUp(lines);
    lines = text2.split("\n").length;
    console.log(import_zx3.chalk.blackBright(text2));
    await (0, import_swiss_ak3.wait)((0, import_swiss_ak3.seconds)(1));
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
  console.log(import_zx3.chalk.green("Renaming:"));
  console.log(import_zx3.chalk.greenBright.bold(`	${before.name} ${import_zx3.chalk.dim("\u2192")} ${after.name}`));
  console.log("");
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await mv(before.path, after.path);
  }
  return isConfirmed;
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
  pause,
  countdown,
  rename
};

// src/tools/ffmpeg.ts
var import_swiss_ak4 = require("swiss-ak");
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
    list = (await ls()).filter((file) => file.endsWith(".MOV"));
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
  const bar = (0, import_swiss_ak4.getProgressBar)(totalFrames, {
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
      lineCount += newLines;
      return func(...args);
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

// src/tools/os.ts
var closeFinder = async () => {
  await $`osascript -e 'tell application "Finder" to close every window'`;
};

// src/tools/printTable.ts
var import_swiss_ak5 = require("swiss-ak");
var getFullOptions = (opts) => ({
  wrapperFn: (x) => x,
  overrideChar: "",
  overrideHorChar: opts.overrideChar || "",
  overrideVerChar: opts.overrideChar || "",
  ...opts,
  drawOuter: opts.drawOuter === void 0 ? true : opts.drawOuter
});
var printTable = (body, header, opts = {}) => {
  const { wrapperFn, overrideChar, overrideHorChar, overrideVerChar, drawOuter } = getFullOptions(opts);
  const lc = getLineCounter();
  const allRows = () => [...header || [], ...body];
  const numCols = Math.max(...allRows().map((row) => row.length));
  const empty = (char = " ") => new Array(numCols).fill(char);
  const correctRow = (row) => [...row, ...empty()].slice(0, numCols).map((cell) => "" + cell);
  header = header && header.map(correctRow);
  body = body.map(correctRow);
  const colWidths = (0, import_swiss_ak5.zip)(...allRows()).map((col) => Math.max(...col.map((s) => (s || "").length)));
  const printRow = (row = empty(), padChar = " ", joinChar = "\u2502", startChar = joinChar, endChar = joinChar, isHor = false, textWrapperFn) => {
    const orientOverride = isHor ? overrideHorChar : overrideVerChar;
    const padC = (isHor ? overrideHorChar : void 0) || overrideChar || padChar;
    const joinC = orientOverride || overrideChar || joinChar;
    const startC = drawOuter ? orientOverride || overrideChar || startChar : "";
    const endC = drawOuter ? orientOverride || overrideChar || endChar : "";
    let padded = row.map((cell, col) => (cell || padC).padEnd(colWidths[col], padC));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $_,
  LogUtils,
  PathUtils,
  ask,
  cat,
  center,
  checkDirectoryExists,
  checkFileExists,
  closeFinder,
  cp,
  explodePath,
  ffmpeg,
  find,
  findDirs,
  findFiles,
  getLineCounter,
  getLog,
  getLogStr,
  getProbe,
  getProbeValue,
  getTotalFrames,
  grep,
  left,
  ls,
  mkdir,
  moveUp,
  mv,
  out,
  pad,
  printTable,
  processLogContents,
  readJSON,
  retry,
  right,
  rm,
  touch,
  tryOr,
  wrap,
  writeJSON
});
