import * as zx from 'zx';
import { second, ms, ProgressBarOptions, Partial } from 'swiss-ak';

declare const ls: (dir?: string, flags?: any[]) => Promise<string[]>;
declare const findDirs: (parent: any) => Promise<string[]>;
declare const findFiles: (parent: any) => Promise<string[]>;
declare const rm: (item: string) => zx.ProcessPromise;
declare const mkdir: (item: string) => zx.ProcessPromise;
declare const cp: (a: string, b: string) => zx.ProcessPromise;
declare const mv: (a: string, b: string) => zx.ProcessPromise;
declare const touch: (item: string) => zx.ProcessPromise;
declare const cat: (item: string) => zx.ProcessPromise;
declare const grep: (item: string, pattern: string) => zx.ProcessPromise;
declare const find: (item: string, pattern: string) => zx.ProcessPromise;
declare const checkFileExists: (file: string) => Promise<boolean>;
declare const checkDirectoryExists: (dir: string) => Promise<boolean>;
declare const readJSON: (filepath: string) => Promise<any>;
declare const writeJSON: <T extends Object>(filepath: any, obj: T) => Promise<any>;
declare const $$: {
    ls: (dir?: string, flags?: any[]) => Promise<string[]>;
    findDirs: (parent: any) => Promise<string[]>;
    findFiles: (parent: any) => Promise<string[]>;
    rm: (item: string) => zx.ProcessPromise;
    mkdir: (item: string) => zx.ProcessPromise;
    cp: (a: string, b: string) => zx.ProcessPromise;
    mv: (a: string, b: string) => zx.ProcessPromise;
    touch: (item: string) => zx.ProcessPromise;
    cat: (item: string) => zx.ProcessPromise;
    grep: (item: string, pattern: string) => zx.ProcessPromise;
    find: (item: string, pattern: string) => zx.ProcessPromise;
    checkFileExists: (file: string) => Promise<boolean>;
    checkDirectoryExists: (dir: string) => Promise<boolean>;
    readJSON: (filepath: string) => Promise<any>;
    writeJSON: <T extends Object>(filepath: any, obj: T) => Promise<any>;
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
 * 'Explodes' a path into its components
 *
 * - dir: the directory path of the given path
 * - name: the name of the file, not including the extension
 * - ext: the extension of the file, not including the dot
 * - filename: the full name of the file, including the extension (and dot)
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

declare type lines = number;
declare const getLineCounter: () => {
    log(...args: any[]): lines;
    wrap: <A extends unknown[], T extends unknown>(newLines: lines, func: (...args: A) => T, ...args: A) => T;
    add(newLines: lines): lines;
    get(): lines;
    clear(): lines;
};

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
    imitate: (done: boolean, questionText: string, resultText?: string) => lines;
    pause: (text?: string) => Promise<void>;
    countdown: (totalSeconds: number, template?: (s: second) => string, complete?: string) => Promise<void>;
    rename: (bef: string, aft: (before: ExplodedPath) => string) => Promise<boolean>;
};

declare const tryOr: <T extends unknown, A extends unknown[]>(orValue: T, func: (...args: A) => Promise<T>, ...args: A) => Promise<T>;
declare const retry: (maxTries?: number, delay?: ms, suppress?: boolean, run?: Function) => Promise<any>;

declare const getProbeValue: (file: string, propertyName: string) => Promise<string>;
declare const getProbe: (file: string, props?: string[]) => Promise<{
    [key: string]: string | number;
}>;
declare const getTotalFrames: (list?: string[]) => Promise<number>;
declare const ffmpeg: (command?: () => ProcessPromise, progressFileName?: string, totalFrames?: number, progressBarOpts?: ProgressBarOptions) => Promise<void>;

/**
 * Pad before and after the given text with the given character.
 *
 * ```typescript
 * pad('foo', 3, 1, '-'); // '---foo-'
 * pad('bar', 10, 5, '_'); // '__________bar_____'
 * ```
 */
declare const pad: (line: string, start: number, end: number, replaceChar?: string) => string;
/**
 * Align the given text to the center within the given width of characters/columns
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
declare const center: (item: any, width?: number, replaceChar?: string) => string;
/**
 * Align the given text to the left within the given width of characters/columns
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
declare const left: (item: any, width?: number, replaceChar?: string) => string;
/**
 * Align the given text to the right within the given width of characters/columns
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
declare const right: (item: any, width?: number, replaceChar?: string) => string;
/**
 * Wrap the given text to the given width of characters/columns
 *
 * ```typescript
 * wrap('This is a sentence', 15);
 * // 'This is' +
 * // 'a sentence'
 * ```
 */
declare const wrap: (item: any, width?: number) => string;
/**
 * Move the terminal cursor up X lines, clearing each row.
 *
 * Useful for replacing previous lines of output
 */
declare const moveUp: (lines?: number) => void;

declare const out_pad: typeof pad;
declare const out_center: typeof center;
declare const out_left: typeof left;
declare const out_right: typeof right;
declare const out_wrap: typeof wrap;
declare const out_moveUp: typeof moveUp;
declare namespace out {
  export {
    out_pad as pad,
    out_center as center,
    out_left as left,
    out_right as right,
    out_wrap as wrap,
    out_moveUp as moveUp,
  };
}

declare const closeFinder: () => Promise<void>;

interface TableOptions {
    wrapperFn: Function;
    overrideChar: string;
    overrideHorChar: string;
    overrideVerChar: string;
    drawOuter: boolean;
}
declare const printTable: (body: string[][], header: string[][], opts?: Partial<TableOptions>) => number;

declare const getLogStr: (item: any) => string;
declare const processLogContents: (prefix: string, wrapper?: Function, ...args: any[]) => string;
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

export { $$, ExplodedPath, LogUtils, PathUtils, ask, cat, center, checkDirectoryExists, checkFileExists, closeFinder, cp, explodePath, ffmpeg, find, findDirs, findFiles, getLineCounter, getLog, getLogStr, getProbe, getProbeValue, getTotalFrames, grep, left, lines, ls, mkdir, moveUp, mv, out, pad, printTable, processLogContents, readJSON, retry, right, rm, touch, tryOr, wrap, writeJSON };
