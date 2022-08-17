import * as zx from 'zx';
import { second, ProgressBarOptions, Partial } from 'swiss-ak';
import * as chalk from 'chalk';

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
     * Maximum depth to search
     */
    maxdepth?: number;
    /**
     * Name of file/directory to find
     */
    name?: string;
    /**
     * Regular expression to match
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
declare const $$: {
    ls: (dir?: string, flags?: string[]) => Promise<string[]>;
    find: (dir?: string, options?: FindOptions) => Promise<string[]>;
    findDirs: (dir?: string, options?: FindOptions) => Promise<string[]>;
    findFiles: (dir?: string, options?: FindOptions) => Promise<string[]>;
    rm: (item: string) => zx.ProcessPromise;
    mkdir: (item: string) => zx.ProcessPromise;
    cp: (a: string, b: string) => zx.ProcessPromise;
    mv: (a: string, b: string) => zx.ProcessPromise;
    touch: (item: string) => zx.ProcessPromise;
    cat: (item: string) => zx.ProcessPromise;
    grep: (pattern: string, file: string) => Promise<string[]>;
    isFileExist: (file: string) => Promise<boolean>;
    isDirExist: (dir: string) => Promise<boolean>;
    readJSON: <T extends unknown>(filepath: string) => Promise<T>;
    writeJSON: <T_1 extends Object>(filepath: any, obj: T_1) => Promise<T_1>;
    rsync: (a: string, b: string, flags?: string[]) => zx.ProcessPromise;
    sync: (a: string, b: string) => zx.ProcessPromise;
    utils: {
        intoLines: (out: ProcessOutput) => string[];
        removeTrailSlash: (path: string) => string;
        trailSlash: (path: string) => string;
        removeDoubleSlashes: (path: string) => string;
    };
};

interface ExplodedPath {
    /**
     * The directory path of the given path
     *
     * Note: no trailing slash
     */
    dir: string;
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
declare const explodePath: (filepath: string) => ExplodedPath;

type PathUtils_ExplodedPath = ExplodedPath;
declare const PathUtils_explodePath: typeof explodePath;
declare namespace PathUtils {
  export {
    PathUtils_ExplodedPath as ExplodedPath,
    PathUtils_explodePath as explodePath,
  };
}

interface PromptChoiceObject<T = string> {
    title?: string;
    value?: T;
}
declare type PromptChoice<T = string> = string | PromptChoiceObject<T>;
declare const ask: {
    text: (message: string, initial?: string) => Promise<string>;
    autotext: <T extends unknown>(message: string, choices: PromptChoice<T>[], choiceLimit?: number) => Promise<T>;
    number: (message: string, initial?: number) => Promise<number>;
    boolean: (message: string) => Promise<boolean>;
    select: <T_1 extends unknown>(message: string, choices: PromptChoice<T_1>[], initial?: T_1) => Promise<T_1>;
    multiselect: <T_2 extends unknown>(message: string, choices: PromptChoice<T_2>[], initial?: T_2) => Promise<T_2[]>;
    validate: <T_3 extends unknown, I extends unknown>(askFunc: (initialValue?: T_3) => I | Promise<I>, validateFn: (input: Awaited<I>) => boolean | string) => Promise<I>;
    imitate: (done: boolean, questionText: string, resultText?: string) => number;
    loading: (questionText: string) => {
        stop: () => void;
    };
    pause: (text?: string) => Promise<void>;
    countdown: (totalSeconds: number, template?: (s: second) => string, complete?: string) => Promise<void>;
    rename: (bef: string, aft: (before: ExplodedPath) => string) => Promise<boolean>;
    fileExplorer: (startDir: string | string[], filter?: (item: any, index: number, arr: any[]) => boolean, questionText?: string) => Promise<any>;
};

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
 * getProbe
 *
 * Get the probe of a file as an object
 *
 * ```typescript
 * const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
 * ```
 */
declare const getProbe: (file: string, props?: string[]) => Promise<{
    [key: string]: string | number;
}>;
/**
 * getTotalFrames
 *
 * Get the total number of frames in a video file.
 *
 * ```typescript
 * const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
 * ```
 */
declare const getTotalFrames: (list?: string[]) => Promise<number>;
/**
 * ffmpeg
 *
 * Wrapper for ffmpeg command
 *
 * ```typescript
 * const progBarOpts = {}; // Same options as getProgressBar
 * await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
 * ```
 */
declare const ffmpeg: (command?: () => ProcessPromise, progressFileName?: string, totalFrames?: number, progressBarOpts?: ProgressBarOptions) => Promise<void>;

interface SupportedFlag {
    name: string;
    type: 'string' | 'number' | 'boolean';
    options?: string[];
    canOverrideOpts?: boolean;
    processOutput?: (value: any) => any;
    description: string;
    hint?: string;
}
interface FlagsObj {
    'black-threshold'?: number;
    compose?: string;
    displace?: string;
    dissolve?: number;
    flip?: boolean;
    flop?: boolean;
    geometry?: string;
    gravity?: string;
    monochrome?: boolean;
    negate?: boolean;
    quality?: number;
    resize?: string;
    rotate?: number;
    size?: string;
    threshold?: number;
    'white-threshold'?: number;
}
interface CompositeFlags {
    change?: FlagsObj;
    mask?: FlagsObj;
}
declare const gm: {
    convert: (inPath: string, outPath: string, flags?: FlagsObj) => Promise<ProcessOutput>;
    composite: (changePath: string, basePath: string, outPath?: string, maskPath?: string, flags?: CompositeFlags | FlagsObj) => Promise<ProcessOutput>;
    ask: {
        flags: (name: string, previousFlagsObj?: FlagsObj) => Promise<{
            'black-threshold'?: number;
            compose?: string;
            displace?: string;
            dissolve?: number;
            flip?: boolean;
            flop?: boolean;
            geometry?: string;
            gravity?: string;
            monochrome?: boolean;
            negate?: boolean;
            quality?: number;
            resize?: string;
            rotate?: number;
            size?: string;
            threshold?: number;
            'white-threshold'?: number;
        }>;
    };
    utils: {
        supportedFlags: {
            [key: string]: SupportedFlag;
        };
        printFlagsTable: (flagsObjArray: FlagsObj[], overrideHeader: string[][], extraRow?: any) => number;
        flagsObjToArray: (obj: FlagsObj) => any[];
    };
};

/**
 * getLineCounter
 *
 * Get line counter for counter output lines
 *
 * ```typescript
 * const lc = getLineCounter();
 * lc.log('hello'); // 1
 * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
 * lc.add(1); // 3
 * lc.get(); // 3
 * lc.clear(); // 0
 * ```
 */
declare const getLineCounter: () => {
    /**
     * lc.log
     *
     * Same as console.log, but adds to the lc counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    log(...args: any[]): number;
    /**
     * lc.wrap
     *
     * Wraps a function, and adds a given number (of the result of the function) to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    wrap: <A extends unknown[], T extends unknown>(newLines: number | undefined, func: (...args: A) => number | T, ...args: A) => T;
    /**
     * lc.add
     *
     * Adds a given number to the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    add(newLines: number): number;
    /**
     * lc.get
     *
     * returns the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    get(): number;
    /**
     * lc.clear
     *
     * clears the line counter, and moves the cursor up by the value of the line counter
     *
     * ```typescript
     * const lc = getLineCounter();
     * lc.log('hello'); // 1
     * lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
     * lc.add(1); // 3
     * lc.get(); // 3
     * lc.clear(); // 0
     * ```
     */
    clear(): number;
};

/**
 * getTerminalWidth
 *
 * Get maximum terminal width (columns)
 *
 * TODO - add to README
 */
declare const getTerminalWidth: () => number;
interface TableOptions {
    /**
     * Function to wrap each line of the table in (e.g. chalk.blue)
     */
    wrapperFn: Function;
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
     * Whether to draw lines between rows (other than separating header and body);
     * TODO - update docs
     */
    drawRowLines: boolean;
    /**
     * Whether to draw lines between columns
     * TODO - update docs
     */
    drawColLines: boolean;
    /**
     * Preferred width (in number of characters) of each column
     * TODO - update docs
     */
    colWidths: number[];
    /**
     * How the table should be aligned on the screen
     *
     * left, right or center
     * TODO - update docs
     */
    align: 'left' | 'right' | 'center';
    /**
     * How each column should be aligned
     *
     * Array with alignment for each column: left, right or center
     * TODO - update docs
     */
    alignCols: ('left' | 'right' | 'center')[];
}
/**
 * printTable
 *
 * Print a table
 *
 * ```typescript
 * const header = [['Name', 'Age']];
 * const body = [['John', '25'], ['Jane', '26']];
 * printTable(body, header);
 *
 * // ┏━━━━━━┳━━━━━┓
 * // ┃ Name ┃ Age ┃
 * // ┡━━━━━━╇━━━━━┩
 * // │ John │ 25  │
 * // │ Jane │ 26  │
 * // └──────┴─────┘
 * ```
 */
declare const printTable: (body: string[][], header: string[][], options?: Partial<TableOptions>) => number;

declare type tableText = string | string[];

declare const utils: {
    getLines: (text: tableText) => string[];
    getNumLines: (text: tableText) => number;
    getLinesWidth: (text: tableText) => number;
    getLogLines: (item: any) => string[];
    getNumLogLines: (item: tableText) => number;
    getLogLinesWidth: (item: tableText) => number;
    joinLines: (lines: string[]) => string;
};
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
declare type AlignType = 'left' | 'right' | 'center';
declare type AlignFunction = (item: any, width?: number, replaceChar?: string, forceWidth?: boolean) => string;
/**
 * out.center
 *
 * Align the given text to the center within the given width of characters/columns
 *
 * Giving a width of 0 will use the terminal width
 *
 * ```typescript
 * center('foo', 10); // '   foo    '
 * center('something long', 10); // 'something long'
 * center('lines\n1\n3', 5);
 * // 'lines' +
 * // '  1  ' +
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
 * left('foo', 10); // 'foo       '
 * left('something long', 10); // 'something long'
 * left('lines\n1\n3', 5);
 * // 'lines' +
 * // '1    ' +
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
 * right('foo', 10); // '       foo'
 * right('something long', 10); // 'something long'
 * right('lines\n1\n3', 5);
 * // 'lines' +
 * // '    1' +
 * // '    2'
 * ```
 */
declare const right: AlignFunction;
/**
 * TODO - add docs
 */
declare const align: (item: any, direction: AlignType, width?: number, replaceChar?: string, forceWidth?: boolean) => string;
/**
 * out.wrap
 *
 * Wrap the given text to the given width of characters/columns
 *
 * ```typescript
 * wrap('This is a sentence', 15);
 * // 'This is' +
 * // 'a sentence'
 * ```
 */
declare const wrap: (item: any, width?: number, forceWidth?: boolean) => string;
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

declare const out_utils: typeof utils;
declare const out_pad: typeof pad;
type out_AlignType = AlignType;
declare const out_center: typeof center;
declare const out_left: typeof left;
declare const out_right: typeof right;
declare const out_align: typeof align;
declare const out_wrap: typeof wrap;
declare const out_moveUp: typeof moveUp;
declare const out_loading: typeof loading;
declare namespace out {
  export {
    out_utils as utils,
    out_pad as pad,
    out_AlignType as AlignType,
    out_center as center,
    out_left as left,
    out_right as right,
    out_align as align,
    out_wrap as wrap,
    out_moveUp as moveUp,
    out_loading as loading,
  };
}

/**
 * Close all Mac OS X Finder windows.
 */
declare const closeFinder: () => Promise<void>;

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

/**
 * gray0
 *
 * Gray 0 (0-5). Equivalent to chalk.black
 */
declare const gray0: chalk.ChalkInstance;
/**
 * gray1
 *
 * Gray 1 (0-5). Equivalent to chalk.gray.dim
 */
declare const gray1: chalk.ChalkInstance;
/**
 * gray2
 *
 * Gray 2 (0-5). Equivalent to chalk.white.dim
 */
declare const gray2: chalk.ChalkInstance;
/**
 * gray3
 *
 * Gray 3 (0-5). Equivalent to chalk.whiteBright.dim
 */
declare const gray3: chalk.ChalkInstance;
/**
 * gray4
 *
 * Gray 4 (0-5). Equivalent to chalk.white
 */
declare const gray4: chalk.ChalkInstance;
/**
 * gray5
 *
 * Gray 5 (0-5). Equivalent to chalk.whiteBright
 */
declare const gray5: chalk.ChalkInstance;
/**
 * grays
 *
 * Grays between 0 and 5.
 *
 * ```typescript
 * grays[2]; // gray2
 * ```
 */
declare const grays: chalk.ChalkInstance[];
/**
 * gray
 *
 * Grays between 0 and 5.
 *
 * ```typescript
 * gray(2); // gray2
 * ```
 */
declare const gray: (num: number) => chalk.ChalkInstance;

declare const chlk_gray0: typeof gray0;
declare const chlk_gray1: typeof gray1;
declare const chlk_gray2: typeof gray2;
declare const chlk_gray3: typeof gray3;
declare const chlk_gray4: typeof gray4;
declare const chlk_gray5: typeof gray5;
declare const chlk_grays: typeof grays;
declare const chlk_gray: typeof gray;
declare namespace chlk {
  export {
    chlk_gray0 as gray0,
    chlk_gray1 as gray1,
    chlk_gray2 as gray2,
    chlk_gray3 as gray3,
    chlk_gray4 as gray4,
    chlk_gray5 as gray5,
    chlk_grays as grays,
    chlk_gray as gray,
  };
}

export { $$, AlignType, ExplodedPath, LogUtils, PathUtils, TableOptions, align, ask, center, chlk, closeFinder, explodePath, ffmpeg, getLineCounter, getLog, getLogStr, getProbe, getProbeValue, getTerminalWidth, getTotalFrames, gm, left, loading, moveUp, out, pad, printTable, processLogContents, right, utils, wrap };
