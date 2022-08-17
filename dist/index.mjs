var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/tools/$$.ts
import "zx/globals";
import { $ as $2, fs as fsO } from "zx";
import { fn, retryOr } from "swiss-ak";
$2.verbose = false;
var fs = fsO.promises;
var intoLines = (out) => out.toString().split("\n").filter(fn.isTruthy);
var removeTrailSlash = (path) => path.replace(/\/$/, "");
var trailSlash = (path) => removeTrailSlash(path) + "/";
var removeDoubleSlashes = (path) => path.replace(/\/\//g, "/");
var ls = async (dir = ".", flags = []) => intoLines(await $2`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);
var rm = (item) => $2`rm -rf ${item}`;
var mkdir = (item) => $2`mkdir -p ${item}`;
var cp = (a, b) => $2`cp -r ${a} ${b}`;
var mv = (a, b) => $2`mv ${a} ${b}`;
var touch = (item) => $2`touch ${item}`;
var cat = (item) => $2`cat ${item}`;
var grep = async (pattern, file) => intoLines(await $2`grep ${pattern} ${file}`);
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
    result = await $2`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\)`;
  } else {
    result = await $2`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\)`;
  }
  return intoLines(result).map(removeDoubleSlashes).filter(fn.isNotEqual(".")).filter((str) => !str.includes(".Trash")).map(options.removeTrailingSlashes ? removeTrailSlash : fn.noact);
};
var findDirs = (dir = ".", options = {}) => find(dir, { type: "d", maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });
var findFiles = (dir = ".", options = {}) => find(dir, { type: "f", maxdepth: 1, removePath: true, contentsOnly: true, ...options });
var rsync = (a, b, flags = []) => $2`rsync -crut ${a} ${b} ${flags}`;
var sync = (a, b) => rsync(trailSlash(a), trailSlash(b), ["--delete"]);
var isFileExist = async (file) => await $2`[[ -f ${file} ]]`.exitCode === 0;
var isDirExist = async (dir) => await $2`[[ -d ${dir} ]]`.exitCode === 0;
var readFile = (filepath) => retryOr("", 2, 100, true, () => fs.readFile(filepath, { encoding: "utf8" }));
var writeFile = (filepath, contents) => retryOr(void 0, 2, 100, true, () => fs.writeFile(filepath, contents, { encoding: "utf8" }));
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
import { chalk as chalk4 } from "zx";
import { seconds, wait as wait2, fn as fn6 } from "swiss-ak";
import prompts from "prompts";
import Fuse from "fuse.js";

// src/tools/out.ts
var out_exports = {};
__export(out_exports, {
  align: () => align,
  center: () => center,
  left: () => left,
  loading: () => loading,
  moveUp: () => moveUp,
  pad: () => pad,
  right: () => right,
  utils: () => utils,
  wrap: () => wrap
});
import { wait, fn as fn5 } from "swiss-ak";
import stringWidth from "string-width";

// src/tools/LogUtils.ts
var LogUtils_exports = {};
__export(LogUtils_exports, {
  getLog: () => getLog,
  getLogStr: () => getLogStr,
  processLogContents: () => processLogContents
});
import { inspect } from "util";
import { chalk as chalk2 } from "zx";
import { fn as fn2 } from "swiss-ak";
var getLogStr = (item) => {
  const inspectList = ["object", "boolean", "number"];
  if (inspectList.includes(typeof item) && !(item instanceof Date)) {
    return inspect(item, { colors: false, depth: null });
  } else {
    return item + "";
  }
};
var processLogContents = (prefix, wrapper = fn2.noact, ...args) => args.map(getLogStr).join(" ").split("\n").map((line, index) => chalk2.bold(index ? " ".repeat(prefix.length) : prefix) + " " + wrapper(line)).join("\n");
var getLog = (prefix, wrapper = fn2.noact) => (...args) => {
  console.log(processLogContents(prefix, wrapper, ...args));
};

// src/tools/printTable.ts
import { fn as fn4, ArrayUtils as ArrayUtils3 } from "swiss-ak";

// src/tools/lineCounter.ts
var getLineCounter = () => {
  let lineCount = 0;
  return {
    log(...args) {
      const added = utils.getNumLines(args.map(getLogStr).join(" "));
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

// src/utils/processTableInput.ts
import { zip, fn as fn3, ArrayUtils } from "swiss-ak";
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
  header: processFn(cells.header, ...args),
  body: processFn(cells.body, ...args)
});
var fixMixingHeader = (cells) => {
  return {
    header: cells.header || [],
    body: cells.body || []
  };
};
var transposeTable = (cells) => {
  const body = zip(...[...cells.header || [], ...cells.body]);
  return {
    header: [],
    body
  };
};
var ensureStringForEveryCell = (rows, numCols) => rows.map((row) => [...row, ...empty(numCols)].slice(0, numCols).map((cell) => itemToString(cell)));
var splitCellsIntoLines = (rows) => rows.map((row) => row.map((cell) => utils.getLines(cell)));
var getDesiredColumnWidths = (cells, numCols, preferredWidths) => {
  const transposed = zip(...[...cells.header, ...cells.body]);
  const actualColWidths = transposed.map((col) => Math.max(...col.map((cell) => utils.getLinesWidth(cell))));
  const currColWidths = preferredWidths.length ? ArrayUtils.repeat(numCols, ...preferredWidths) : actualColWidths;
  const currTotalWidth = currColWidths.reduce(fn3.reduces.combine) + (numCols + 1) * 3;
  const diff = currTotalWidth - getTerminalWidth();
  const colWidths = [...currColWidths];
  for (let i = 0; i < diff; i++) {
    colWidths[colWidths.indexOf(Math.max(...colWidths))]--;
  }
  return colWidths;
};
var wrapCells = (rows, colWidths) => rows.map((row) => {
  const wrapped = row.map((cell, colIndex) => utils.getLines(wrap(utils.joinLines(cell), colWidths[colIndex])));
  const maxHeight = Math.max(...wrapped.map((cell) => cell.length));
  return wrapped.map((cell) => [...cell, ...empty(maxHeight)].slice(0, maxHeight));
});
var seperateLinesIntoRows = (rows) => rows.map((row) => zip(...row));
var processInput = (cells, opts) => {
  const fixed = fixMixingHeader(cells);
  const transposed = opts.transpose ? transposeTable(fixed) : fixed;
  const numCols = Math.max(...[...transposed.header || [], ...transposed.body].map((row) => row.length));
  const everyCell = processCells(transposed, ensureStringForEveryCell, numCols);
  const linedCells = processCells(everyCell, splitCellsIntoLines);
  const colWidths = getDesiredColumnWidths(linedCells, numCols, opts.colWidths);
  const wrappedCells = processCells(linedCells, wrapCells, colWidths);
  const seperatedRows = processCells(wrappedCells, seperateLinesIntoRows);
  return { cells: seperatedRows, numCols, colWidths };
};

// src/utils/tableCharacters.ts
import { ArrayUtils as ArrayUtils2 } from "swiss-ak";
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
var ovAllCharact = (orig, char) => ArrayUtils2.repeat(4, char);
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
    const copyVertsFrom = ["hNor", "hNor", "hNor", "hNor", "hNor", "bNor", "bNor", "bNor", "bNor"];
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

// src/tools/printTable.ts
var getTerminalWidth = () => {
  var _a;
  return ((_a = process == null ? void 0 : process.stdout) == null ? void 0 : _a.columns) ? process.stdout.columns : 100;
};
var getFullOptions = (opts) => ({
  overrideChar: "",
  overrideHorChar: opts.overrideChar || "",
  overrideVerChar: opts.overrideChar || "",
  align: "left",
  alignCols: ["left"],
  colWidths: [],
  ...opts,
  wrapperFn: typeof opts.wrapperFn !== "function" ? fn4.noact : opts.wrapperFn,
  drawOuter: typeof opts.drawOuter !== "boolean" ? true : opts.drawOuter,
  drawRowLines: typeof opts.drawRowLines !== "boolean" ? true : opts.drawRowLines,
  drawColLines: typeof opts.drawColLines !== "boolean" ? true : opts.drawColLines,
  transpose: typeof opts.transpose !== "boolean" ? false : opts.transpose
});
var empty2 = (numCols, char = "") => new Array(numCols).fill(char);
var printTable = (body, header, options = {}) => {
  const lc = getLineCounter();
  const opts = getFullOptions(options);
  const { wrapperFn, drawOuter, alignCols, align: align2 } = opts;
  const {
    cells: { header: pHeader, body: pBody },
    numCols,
    colWidths
  } = processInput({ header, body }, opts);
  const alignColumns = ArrayUtils3.repeat(numCols, ...alignCols);
  const tableChars = getTableCharacters(opts);
  const printLine = (row = empty2(numCols), chars = tableChars.bNor, textWrapperFn) => {
    const [norm, strt, sepr, endc] = chars;
    let padded = row.map((cell, col) => align(cell || "", alignColumns[col], colWidths[col], norm, true));
    if (textWrapperFn)
      padded = padded.map((x) => textWrapperFn(x));
    const inner = padded.join(`${norm}${sepr}${norm}`);
    const str = `${strt}${norm}${inner}${norm}${endc}`;
    lc.log(align(wrapperFn(str), align2, 0, " ", false));
  };
  if (pHeader.length) {
    if (drawOuter)
      printLine(empty2(numCols, ""), tableChars.hTop);
    for (let index in pHeader) {
      const row = pHeader[index];
      if (Number(index) !== 0)
        printLine(empty2(numCols, ""), tableChars.hSep);
      for (let line of row) {
        printLine(line, tableChars.hNor, chalk.bold);
      }
    }
    printLine(empty2(numCols, ""), tableChars.mSep);
  } else {
    if (drawOuter)
      printLine(empty2(numCols, ""), tableChars.bTop);
  }
  for (let index in pBody) {
    const row = pBody[index];
    if (Number(index) !== 0)
      printLine(empty2(numCols, ""), tableChars.bSep);
    for (let line of row) {
      printLine(line, tableChars.bNor);
    }
  }
  if (drawOuter)
    printLine(empty2(numCols, ""), tableChars.bBot);
  return lc.get();
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
var printObjectsTable = (objects, headers = {}, options = {}) => {
  const allKeys = getAllKeys(objects);
  const header = [allKeys.map((key) => headers[key] || key)];
  const body = objects.map((obj) => allKeys.map((key) => obj[key]));
  return printTable(body, header, options);
};

// src/tools/out.ts
var NEW_LINE = "\n";
var textToString = (text2) => text2 instanceof Array ? joinLines(text2) : text2;
var getLines = (text2) => textToString(text2).split(NEW_LINE);
var getNumLines = (text2) => getLines(text2).length;
var getLinesWidth = (text2) => Math.max(...getLines(text2).map((line) => stringWidth(line)));
var getLogLines = (item) => getLines(getLogStr(item));
var getNumLogLines = (item) => getNumLines(getLogStr(item));
var getLogLinesWidth = (item) => getLinesWidth(getLogStr(item));
var joinLines = (lines) => lines.map(fn5.maps.toString).join(NEW_LINE);
var utils = {
  getLines,
  getNumLines,
  getLinesWidth,
  getLogLines,
  getNumLogLines,
  getLogLinesWidth,
  joinLines
};
var pad = (line, start, end, replaceChar = " ") => `${replaceChar.repeat(Math.max(0, start))}${line}${replaceChar.repeat(Math.max(0, end))}`;
var correctWidth = (width) => width <= 0 || width === Infinity ? getTerminalWidth() : Math.min(width, getTerminalWidth());
var center = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map(
  (line) => pad(
    line,
    Math.floor((correctWidth(width) - stringWidth(line)) / 2),
    forceWidth ? Math.ceil((correctWidth(width) - stringWidth(line)) / 2) : 0,
    replaceChar
  )
).join(NEW_LINE);
var left = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map((line) => pad(line, 0, forceWidth ? correctWidth(width) - stringWidth(line) : 0, replaceChar)).join(NEW_LINE);
var right = (item, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => getLogLines(item).map((line) => pad(line, correctWidth(width) - stringWidth(line), 0, replaceChar)).join(NEW_LINE);
var alignFunc = {
  left,
  center,
  right
};
var align = (item, direction, width = getTerminalWidth(), replaceChar = " ", forceWidth = true) => {
  const func = alignFunc[direction] || alignFunc.left;
  return func(item, width, replaceChar, forceWidth);
};
var wrap = (item, width = getTerminalWidth(), forceWidth = true) => getLogLines(item).map((line) => {
  if (stringWidth(line) > width) {
    const words = line.split(/(?<=#?[ -]+)/g);
    const rows = [];
    let rowStartIndex = 0;
    for (let wIndex in words) {
      const word = words[wIndex];
      const candidateRow = words.slice(rowStartIndex, Math.max(0, Number(wIndex) - 1));
      const candText = candidateRow.join("");
      if (stringWidth(candText) + stringWidth(word) > width) {
        rows.push(candidateRow);
        rowStartIndex = Number(wIndex) - 1;
      }
    }
    const remaining = words.slice(rowStartIndex);
    rows.push(remaining);
    return rows.map((row) => row.join("")).map((row) => left(row, width, " ", forceWidth));
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
    await wait(500);
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
import { chalk as chalk3 } from "zx";
var gray0 = chalk3.black;
var gray1 = chalk3.gray.dim;
var gray2 = chalk3.white.dim;
var gray3 = chalk3.whiteBright.dim;
var gray4 = chalk3.white;
var gray5 = chalk3.whiteBright;
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
  const response = await prompts(
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
    const fuzzy = new Fuse(choiceObjs, {
      includeScore: false,
      keys: ["title", "value"]
    });
    response = await prompts(
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
  const response = await prompts(
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
  const response = await prompts(
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
  const response = await prompts(
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
  const response = await prompts(
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
      console.log(chalk4.red(message));
      return runLoop(input, message.split("\n").length);
    }
  };
  return runLoop();
};
var imitate = (done, questionText, resultText) => {
  const prefix = done ? chalk4.green("\u2714") : chalk4.cyan("?");
  const question = chalk4.whiteBright.bold(questionText);
  const joiner = chalk4.gray(done ? "\u2026" : "\u203A");
  const resultWrapper = done ? chalk4.white : chalk4.gray;
  const result = resultText ? `${joiner} ${resultWrapper(resultText)}` : "";
  console.log(`${prefix} ${question} ${result}`);
  return 1;
};
var loading2 = (questionText) => loading((s) => imitate(false, questionText, `[Loading${s}]`));
var pause = async (text2 = "Press enter to continue...") => {
  console.log(chalk4.gray(text2));
  await $`read -n 1`;
};
var countdown = async (totalSeconds, template = (s) => `Starting in ${s}s...`, complete) => {
  console.log();
  let lines = 1;
  for (let s = totalSeconds; s > 0; s--) {
    const text2 = template(s);
    moveUp(lines);
    lines = text2.split("\n").length;
    console.log(chalk4.blackBright(text2));
    await wait2(seconds(1));
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
  console.log(chalk4.green("Renaming:"));
  console.log(chalk4.greenBright.bold(`	${before.name} ${chalk4.dim("\u2192")} ${after.name}`));
  console.log("");
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await $$.mv(before.path, after.path);
  }
  return isConfirmed;
};
var fileExplorer = async (startDir, filter = fn6.result(true), questionText = "Choose a file:") => {
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
import { getProgressBar } from "swiss-ak";
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
  const bar = getProgressBar(totalFrames, {
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
      await ffmpegProcess.kill();
      await $`rm -rf ${progressFileName}`;
    }
  }
  await ffmpegProcess;
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
import { fn as fn7 } from "swiss-ak";
var supportedFlags = {
  "black-threshold": {
    name: "black-threshold",
    type: "number",
    description: "pixels below the threshold become black",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  compose: {
    name: "compose",
    type: "string",
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
  displace: {
    name: "displace",
    type: "string",
    description: "shift image pixels as defined by a displacement map",
    hint: "<horizontal scale>x<vertical scale>"
  },
  dissolve: {
    name: "dissolve",
    type: "number",
    description: "dissolve an image into another by the given percent",
    hint: "%"
  },
  flip: {
    name: "flip",
    type: "boolean",
    description: 'create a "mirror image" - vertical'
  },
  flop: {
    name: "flop",
    type: "boolean",
    description: 'create a "mirror image" - horizontal'
  },
  geometry: {
    name: "geometry",
    type: "string",
    description: "Specify dimension, offset, and resize options.",
    hint: "<width>x<height>{+-}<x>{+-}<y>{%}{@}{!}{^}{<}{>} e.g. 100x100+10+10, +10+10"
  },
  gravity: {
    name: "gravity",
    type: "string",
    options: ["Center", "North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"],
    canOverrideOpts: false,
    description: "direction primitive gravitates to when annotating the image."
  },
  monochrome: {
    name: "monochrome",
    type: "boolean",
    description: "transform the image to black and white"
  },
  negate: {
    name: "negate",
    type: "boolean",
    description: "replace every pixel with its complementary color"
  },
  quality: {
    name: "quality",
    type: "number",
    description: "JPEG/MIFF/PNG/TIFF compression level",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  resize: {
    name: "resize",
    type: "string",
    description: "resize an image",
    hint: "<width>x<height>{%}{@}{!}{<}{>} e.g. 100x200"
  },
  rotate: {
    name: "rotate",
    type: "number",
    description: "rotate the image - clockwise",
    hint: "degrees (0-360)"
  },
  size: {
    name: "size",
    type: "string",
    description: "width and height of the image",
    hint: "<width>x<height>"
  },
  threshold: {
    name: "threshold",
    type: "number",
    description: "pixels above the threshold become white, pixels below the threshold become black",
    hint: "%",
    processOutput: (value) => `${value}%`
  },
  "white-threshold": {
    name: "white-threshold",
    type: "number",
    description: "pixels above the threshold become white",
    hint: "%",
    processOutput: (value) => `${value}%`
  }
};
var printFlagsTable = (flagsObjArray, overrideHeader, extraRow) => {
  const lc = getLineCounter();
  const allFlagNames = flagsObjArray.map((flagsObj) => Object.keys(flagsObj)).flat();
  const header = overrideHeader || [["Flag", ...flagsObjArray.map((v, i) => `#${i + 1}`)]];
  const body = allFlagNames.length === 0 ? [["none"]] : allFlagNames.map((flagName) => {
    return [
      [
        flagName,
        ...flagsObjArray.map(
          (obj) => {
            var _a;
            return obj[flagName] === void 0 ? "" : getLogStr((((_a = supportedFlags[flagName]) == null ? void 0 : _a.processOutput) || fn7.noact)(obj[flagName]));
          }
        )
      ],
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
      const { description, hint, processOutput } = flagConfig;
      const previousValue = selectedFlags[flagName] || previousFlagsObj[flagName];
      lc.log(gray3(`${flagName}: ${description}`));
      if (hint)
        lc.log(gray2(`		Hint: ${hint}`));
      const valueQuestion = `${name}: What value would you like for -${flagName} flag?`;
      let flagValue = void 0;
      if (flagConfig.options instanceof Array) {
        flagValue = await lc.wrap(1, () => ask.select(valueQuestion, flagConfig.options, previousValue));
      } else {
        if (flagConfig.type === "string") {
          flagValue = await lc.wrap(1, () => ask.text(valueQuestion, previousValue || "")) || void 0;
        }
        if (flagConfig.type === "number") {
          flagValue = await lc.wrap(1, () => ask.number(valueQuestion, previousValue || 0));
        }
        if (flagConfig.type === "boolean") {
          flagValue = true;
        }
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
  return Object.entries(obj).map(([name, value]) => {
    var _a;
    return ["-" + name, (((_a = supportedFlags[name]) == null ? void 0 : _a.processOutput) || fn7.noact)(value)];
  }).flat().filter((x) => x !== void 0 && x !== true);
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
export {
  $$,
  LogUtils_exports as LogUtils,
  PathUtils_exports as PathUtils,
  align,
  ask,
  center,
  chlk_exports as chlk,
  closeFinder,
  explodePath,
  ffmpeg,
  getLineCounter,
  getLog,
  getLogStr,
  getProbe,
  getProbeValue,
  getTerminalWidth,
  getTotalFrames,
  gm,
  left,
  loading,
  moveUp,
  out_exports as out,
  pad,
  printObjectsTable,
  printTable,
  processLogContents,
  right,
  utils,
  wrap
};
