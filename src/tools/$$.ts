import 'zx/globals';
import { $, fs as fsO, cd as cdO, ProcessPromise, ProcessOutput } from 'zx';
import { fn, ms, retryOr, seconds } from 'swiss-ak';
import { PathTools, explodePath, ExplodedPath, getProgressBar, progressBar } from 'swiss-node';

import * as exif from './dd/exiftool';

$.verbose = false;

const fs = fsO.promises;

//<!-- DOCS: 100 -->

/**<!-- DOCS: $$ ##! -->
 * $$ (double dollar)
 */
export namespace $$ {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  /**<!-- DOCS: $$.cd ### -->
   * cd
   *
   * - `$$.cd`
   *
   * Change the current working directory
   *
   * ```typescript
   * await $$.pwd(); // '/Users/username'
   * await $$.cd('./some/folder');
   * await $$.pwd(); // '/Users/username/some/folder'
   * ```
   * @param {string} [dir='.']
   * @returns {ProcessPromise}
   */
  export const cd = (dir: string = '.'): ProcessPromise => {
    cdO(dir);
    return $`cd ${dir}`;
  };

  /**<!-- DOCS: $$.pwd ### @ -->
   * pwd
   *
   * - `$$.pwd`
   *
   * Get the current working directory
   *
   * ```typescript
   * await $$.pwd(); // '/Users/username'
   * await $$.cd('./some/folder');
   * await $$.pwd(); // '/Users/username/some/folder'
   * ```
   * @returns {Promise<string>}
   */
  export const pwd = async (): Promise<string> => utils.intoLines(await $`pwd`)[0];

  /**<!-- DOCS: $$.ls ### @ -->
   * ls
   *
   * - `$$.ls`
   *
   * Wrapper for ls (list) command
   *
   * ```typescript
   * await $$.ls('example') // ['a', 'b']
   * ```
   * @param {string} [dir='.']
   * @param {string[]} [flags=[]]
   * @returns {Promise<string[]>}
   */
  export const ls = async (dir: string = '.', flags: string[] = []): Promise<string[]> =>
    utils.intoLines(await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);

  /**<!-- DOCS: $$.rm ### -->
   * rm
   *
   * - `$$.rm`
   *
   * Wrapper for rm (remove) command
   *
   * ```typescript
   * await $$.rm('example') // same as $`rm -rf 'example'`
   * ```
   * @param {string} item
   * @returns {ProcessPromise}
   */
  export const rm = (item: string): ProcessPromise => $`rm -rf ${item}`;

  /**<!-- DOCS: $$.mkdir ### -->
   * mkdir
   *
   * - `$$.mkdir`
   *
   * Wrapper for mkdir (make directory) command
   *
   * ```typescript
   * await $$.mkdir('example') // same as $`mkdir -p 'example'`
   * ```
   * @param {string} item
   * @returns {ProcessPromise}
   */
  export const mkdir = (item: string): ProcessPromise => $`mkdir -p ${item}`;

  /**<!-- DOCS: $$.cp ### -->
   * cp
   *
   * - `$$.cp`
   *
   * Wrapper for cp (copy) command
   *
   * ```typescript
   * await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
   * ```
   * @param {string} a
   * @param {string} b
   * @returns {ProcessPromise}
   */
  export const cp = (a: string, b: string): ProcessPromise => $`cp -r ${a} ${b}`;

  /**<!-- DOCS: $$.mv ### -->
   * mv
   *
   * - `$$.mv`
   *
   * Wrapper for mv (move) command
   *
   * ```typescript
   * await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
   * ```
   * @param {string} a
   * @param {string} b
   * @returns {ProcessPromise}
   */
  export const mv = (a: string, b: string): ProcessPromise => $`mv ${a} ${b}`;

  /**<!-- DOCS: $$.touch ### -->
   * touch
   *
   * - `$$.touch`
   *
   * Wrapper for touch (create blank file) command
   *
   * ```typescript
   * await $$.touch('example') // same as $`touch 'example'`
   * ```
   * @param {string} item
   * @returns {ProcessPromise}
   */
  export const touch = (item: string): ProcessPromise => $`touch ${item}`;

  /**<!-- DOCS: $$.cat ### -->
   * cat
   *
   * - `$$.cat`
   *
   * Wrapper for cat (concatenate) command
   *
   * ```typescript
   * await $$.cat('example') // same as $`cat 'example'`
   * ```
   * @param {string} item
   * @returns {ProcessPromise}
   */
  export const cat = (item: string): ProcessPromise => $`cat ${item}`;

  /**<!-- DOCS: $$.grep ### @ -->
   * grep
   *
   * - `$$.grep`
   *
   * Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command
   *
   * ```typescript
   * await $$.grep('example', '.') // same as $`grep 'example' '.'`
   * ```
   * @param {string} pattern
   * @param {string} file
   * @returns {Promise<string[]>}
   */
  export const grep = async (pattern: string, file: string): Promise<string[]> => utils.intoLines(await $`grep ${pattern} ${file}`);

  const convertFindOptionsToFlags = (options: FindOptions) => {
    const { type, ext, mindepth, maxdepth, name, regex, removePath } = options;
    const flags = [];

    // TODO simplify this
    if (type) flags.push('-type', type);
    if (mindepth) flags.push('-mindepth', mindepth + '');
    if (maxdepth) flags.push('-maxdepth', maxdepth + '');
    if (name) flags.push('-name', name);
    if (!regex && ext) flags.push('-regex', String.raw`^.*\.${ext}$`);
    if (regex) flags.push('-regex', regex);
    return flags;
  };

  /**<!-- DOCS: $$.find ### @ -->
   * find
   *
   * - `$$.find`
   *
   * Helper function for finding files
   *
   * ```typescript
   * await $$.find('.', { type: 'f' }) // ['a', 'b']
   * ```
   * @param {string} [dir='.']
   * @param {FindOptions} [options={}]
   * @returns {Promise<string[]>}
   */
  export const find = async (dir: string = '.', options: FindOptions = {}): Promise<string[]> => {
    // google zx doesn't allow for unquoted arguments, so we need work around to conditionally add -execdir
    let result;

    if (dir === '.') {
      dir = await pwd();
    }

    const newDir = options.contentsOnly ? PathTools.trailSlash(dir) : dir;
    const flags = convertFindOptionsToFlags(options);

    const pruneRegex = options.showHidden ? '.*(\\.Trash|\\.DS_Store).*' : '.*(/\\.|\\.Trash|\\.DS_Store).*';

    // E - advanced regex
    // s - sort lexicographically
    // L - follow symbolic links
    if (options.removePath) {
      result = await $`[[ -d ${newDir} ]] && find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\) || echo ''`;
    } else {
      result = await $`[[ -d ${newDir} ]] && find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\) || echo ''`;
    }

    return utils
      .intoLines(result)
      .map(PathTools.removeDoubleSlashes)
      .filter(fn.isNotEqual('.'))
      .filter((str) => !str.includes('.Trash'))
      .map(options.removeTrailingSlashes ? PathTools.removeTrailSlash : fn.noact);
  };

  /**<!-- DOCS: $$.FindOptions #### -->
   * FindOptions
   *
   * - `$$.FindOptions`
   *
   * Options for $$.find (and related other tools)
   *
   * | Property                | Required | Type     | Description                               |
   * | ----------------------- | -------- | -------- | ----------------------------------------- |
   * | `type`                  | *No*     | FindType | Type of item to find                      |
   * | `mindepth`              | *No*     | number   | Minimum depth to search                   |
   * | `maxdepth`              | *No*     | number   | Maximum depth to search                   |
   * | `name`                  | *No*     | string   | Name of file/directory to find            |
   * | `ext`                   | *No*     | string   | Shortcut for regex-ing the file extension |
   * | `regex`                 | *No*     | string   | Regular expression to match               |
   * | `removePath`            | *No*     | boolean  | Removes the path from the result          |
   * | `contentsOnly`          | *No*     | boolean  | Ensures input path has a trailing slash   |
   * | `removeTrailingSlashes` | *No*     | boolean  | Removes trailing slashes from the results |
   * | `showHidden`            | *No*     | boolean  | Includes files that start with a dot      |
   */
  export interface FindOptions {
    /**
     * Type of item to find
     *
     * |     | Description       |
     * |-----|-------------------|
     * | `d` | directory         |
     * | `f` | regular file      |
     * | `b` | block special     |
     * | `c` | character special |
     * | `l` | symbolic link     |
     * | `p` | FIFO              |
     * | `s` | socket            |
     */
    type?: FindType;

    /**
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

    /**
     * Shortcut for regex-ing the file extension
     */
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
     * Removes the path from the result
     */
    removePath?: boolean;

    /**
     * Ensures input path has a trailing slash
     */
    contentsOnly?: boolean;

    /**
     * Removes trailing slashes from the results
     */
    removeTrailingSlashes?: boolean;

    /**
     * Includes files that start with a dot
     */
    showHidden?: boolean;
  }

  /**<!-- DOCS: $$.FindType #### -->
   * FindType
   *
   * - `$$.FindType`
   *
   * Type of item to find
   *
   * |   | Description       |
   * |---|-------------------|
   * | d | directory         |
   * | f | regular file      |
   * | b | block special     |
   * | c | character special |
   * | l | symbolic link     |
   * | p | FIFO              |
   * | s | socket            |
   */
  export type FindType = 'd' | 'f' | 'b' | 'c' | 'l' | 'p' | 's';

  /**<!-- DOCS: $$.findDirs ### @ -->
   * findDirs
   *
   * - `$$.findDirs`
   *
   * Find all directories in a given directory (shallow)
   *
   * ```typescript
   * await $$.findDirs('.') // ['a', 'b']
   * ```
   * @param {string} [dir='.']
   * @param {FindOptions} [options={}]
   * @returns {Promise<string[]>}
   */
  export const findDirs = (dir: string = '.', options: FindOptions = {}): Promise<string[]> =>
    find(dir, { type: 'd', maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });

  /**<!-- DOCS: $$.findFiles ### @ -->
   * findFiles
   *
   * - `$$.findFiles`
   *
   * Find all files in a given directory (shallow)
   *
   * ```typescript
   * await $$.findFiles('.') // ['a', 'b']
   * ```
   * @param {string} [dir='.']
   * @param {FindOptions} [options={}]
   * @returns {Promise<string[]>}
   */
  export const findFiles = (dir: string = '.', options: FindOptions = {}): Promise<string[]> =>
    find(dir, { type: 'f', maxdepth: 1, removePath: true, contentsOnly: true, ...options });

  /**<!-- DOCS: $$.findModified ### @ -->
   * findModified
   *
   * - `$$.findModified`
   *
   * Similar to $$.find, but returns a list of ModifiedFile objects, which includes information on what each item was last modified.
   *
   * ```typescript
   * await $$.findModified('.')
   * // [
   * //   {
   * //     lastModified: 1689206400000,
   * //     path: './a.mp4',
   * //     dir: '.',
   * //     folders: ['.'],
   * //     name: 'a',
   * //     ext: 'mp4',
   * //     filename: 'a.mp4'
   * //   }
   * // ]
   * ```
   * @param {string} [dir='.']
   * @param {FindOptions} [options={}]
   * @returns {Promise<ModifiedFile[]>}
   */
  export const findModified = async (dir: string = '.', options: FindOptions = {}): Promise<ModifiedFile[]> => {
    const newDir = options.contentsOnly ? PathTools.trailSlash(dir) : dir;
    const flags = convertFindOptionsToFlags(options);

    const pruneRegex = options.showHidden ? '.*(\\.Trash|\\.DS_Store).*' : '.*(/\\.|\\.Trash|\\.DS_Store).*';

    const result = await $`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print0 \\) | xargs -0 stat -f "%m %N"`;

    return utils
      .intoLines(result)
      .map(PathTools.removeDoubleSlashes)
      .filter((str) => !str.includes('.Trash'))
      .map((line) => {
        const [_blank, lastModified, file] = line.split(/^([0-9]+)\s/);
        return { lastModified: seconds(Number(lastModified)), file };
      })
      .filter(({ file }) => !['.', '.DS_Store'].includes(file))
      .map(options.removeTrailingSlashes ? ({ file, ...rest }) => ({ file: PathTools.removeDoubleSlashes(file), ...rest }) : fn.noact)
      .map(({ lastModified, file }) => ({
        lastModified,
        ...explodePath(file.replace(/^\./, PathTools.removeTrailSlash(dir)))
      }));
  };

  /**<!-- DOCS: $$.ModifiedFile #### -->
   * ModifiedFile
   *
   * - `$$.ModifiedFile`
   *
   * Returned by $$.findModified.
   *
   * Extends `swiss-node`'s `ExplodedPath`, adding a new `lastModified` number property.
   *
   * ```typescript
   * {
   *   lastModified: 1689206400000,
   *   path: './a.mp4',
   *   dir: '.',
   *   folders: ['.'],
   *   name: 'a',
   *   ext: 'mp4',
   *   filename: 'a.mp4'
   * }
   * ```
   */
  export interface ModifiedFile extends ExplodedPath {
    lastModified: ms;
  }

  /**<!-- DOCS: $$.lastModified ### @ -->
   * lastModified
   *
   * - `$$.lastModified`
   *
   * Returns the last modified time of a file or files within a directory.
   *
   * ```typescript
   * await $$.lastModified('a.mp4') // 1689206400000
   * ```
   * @param {string} path
   * @returns {Promise<number>}
   */
  export const lastModified = async (path: string): Promise<number> => {
    let list = await findModified(path, { type: 'f' });
    if (list.length === 0) list = await findModified(path);
    const max = Math.max(...list.map(({ lastModified }) => lastModified));
    return max;
  };

  /**<!-- DOCS: $$.rsync ### @ -->
   * rsync
   *
   * - `$$.rsync`
   *
   * Wrapper for rsync command
   *
   * ```typescript
   * await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
   * ```
   * @param {string} a
   * @param {string} b
   * @param {string[]} [flags=[]]
   * @param {Partial<progressBar.ProgressBarOptions>} [progressBarOpts]
   * @returns {Promise<ProcessOutput>}
   */
  export const rsync = async (
    a: string,
    b: string,
    flags: string[] = [],
    progressBarOpts?: Partial<progressBar.ProgressBarOptions>
  ): Promise<ProcessOutput> => {
    if (progressBarOpts) {
      const out = $`rsync -rut ${a} ${b} ${flags} --progress`;
      let progressBar = getProgressBar(undefined, progressBarOpts);
      progressBar.start();

      for await (const chunk of out.stdout) {
        const match = chunk.toString().match(/to\-check=([0-9]+)\/([0-9]+)/);

        if (!match) continue;
        const [_m, num, max] = match.map(Number);
        const prog = max - num;

        if (progressBar?.max === undefined) progressBar = getProgressBar(max, progressBarOpts);

        progressBar.set(prog);
      }
      return out;
    } else {
      return $`rsync -rut ${a} ${b} ${flags}`;
    }
  };

  /**<!-- DOCS: $$.sync ### @ -->
   * sync
   *
   * - `$$.sync`
   *
   * Helper function for syncing files
   *
   * ```typescript
   * await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
   * ```
   * @param {string} a
   * @param {string} b
   * @param {Partial<progressBar.ProgressBarOptions>} [progressBarOpts]
   * @returns {Promise<ProcessOutput>}
   */
  export const sync = (a: string, b: string, progressBarOpts?: Partial<progressBar.ProgressBarOptions>): Promise<ProcessOutput> =>
    rsync(PathTools.trailSlash(a), PathTools.trailSlash(b), ['--delete'], progressBarOpts);

  /**<!-- DOCS: $$.isFileExist ### @ -->
   * isFileExist
   *
   * - `$$.isFileExist`
   *
   * Check if a file exists
   *
   * ```typescript
   * await $$.isFileExist('example') // true
   * ```
   * @param {string} file
   * @returns {Promise<boolean>}
   */
  export const isFileExist = async (file: string) => (await $`[[ -f ${file} ]]`.exitCode) === 0;

  /**<!-- DOCS: $$.isDirExist ### @ -->
   * isDirExist
   *
   * - `$$.isDirExist`
   *
   * Check if a directory exists
   *
   * ```typescript
   * await $$.isDirExist('example') // true
   * ```
   * @param {string} dir
   * @returns {Promise<boolean>}
   */
  export const isDirExist = async (dir: string) => (await $`[[ -d ${dir} ]]`.exitCode) === 0;

  /**<!-- DOCS: $$.readFile ### @ -->
   * readFile
   *
   * - `$$.readFile`
   *
   * Read a file's contents
   *
   * ```typescript
   * await $$.readFile('example') // 'hello world'
   * ```
   * @param {string} filepath
   * @returns {Promise<string>}
   */
  export const readFile = (filepath: string): Promise<string> => retryOr<any>('', 2, 100, () => fs.readFile(filepath, { encoding: 'utf8' }));

  /**<!-- DOCS: $$.writeFile ### @ -->
   * writeFile
   *
   * - `$$.writeFile`
   *
   * Write to a file
   *
   * ```typescript
   * await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
   * ```
   * @param {string} filepath
   * @param {string} contents
   * @returns {Promise<void>}
   */
  export const writeFile = (filepath: string, contents: string): Promise<void> =>
    retryOr<any>(undefined, 2, 100, () => fs.writeFile(filepath, contents, { encoding: 'utf8' }));

  /**<!-- DOCS: $$.readJSON ### @ -->
   * readJSON
   *
   * - `$$.readJSON<T>`
   *
   * Read a JSON file
   *
   * ```typescript
   * await $$.readJSON('example.json') // { hello: 'world' }
   * ```
   * @param {string} filepath
   * @returns {Promise<T>}
   */
  export const readJSON = async <T extends unknown>(filepath: string): Promise<T> => {
    const raw = await readFile(filepath);
    return JSON.parse(raw || '{}');
  };

  /**<!-- DOCS: $$.writeJSON ### @ -->
   * writeJSON
   *
   * - `$$.writeJSON<T>`
   *
   * Write to a JSON file
   *
   * ```typescript
   * await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
   * ```
   * @param {T} obj
   * @returns {Promise<T>}
   */
  export const writeJSON = async <T extends Object>(filepath, obj: T): Promise<T> => {
    const raw = (obj ? JSON.stringify(obj, null, 2) : '{}') || '{}';
    await writeFile(filepath, raw);
    return obj;
  };

  /**<!-- DOCS: $$.pipe ### -->
   * pipe
   *
   * - `$$.pipe`
   *
   * Pipes a series of $ or $$ commands sequentially
   *
   * ```typescript
   * await $$.pipe([
   *   () => gm.convert(basePath, gm.PIPE, opts1),
   *   () => gm.composite(changePath, gm.PIPE, gm.PIPE, changePath, opts2)
   * ]);
   * ```
   * @param {((index?: number, arg?: T) => ProcessPromise)[]} processes
   * @param {T} [arg]
   * @returns {ProcessPromise}
   */
  export const pipe = <T extends unknown>(processes: ((index?: number, arg?: T) => ProcessPromise)[], arg?: T): ProcessPromise => {
    if (processes.length === 0) return $``;

    let result: ProcessPromise = undefined;

    for (const index in processes) {
      const processFn = processes[index];

      result = result ? result.pipe(processFn(Number(index), arg)) : processFn(Number(index), arg);
    }

    return result;
  };

  /**<!-- DOCS-ALIAS: $$.exif.exiftool -->*/
  export const exiftool = exif.exiftool;

  /**<!-- DOCS-ALIAS: $$.exif.ExifToolAttributesObj -->*/
  export type ExifToolAttributesObj = exif.ExifToolAttributesObj;

  /**<!-- DOCS-ALIAS: $$.exif.ExifToolAttributes -->*/
  export type ExifToolAttributes = exif.ExifToolAttributes;

  //<!-- DOCS: 120 -->
  /**<!-- DOCS: $$.utils ### -->
   * utils
   */
  export namespace utils {
    // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

    /**<!-- DOCS: $$.utils.intoLines #### -->
     * intoLines
     *
     * - `$$.utils.intoLines`
     *
     * Turns ProcessOutput into string array, split into lines
     *
     * ```typescript
     * utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
     * ```
     * @param {ProcessOutput} out
     * @returns {string[]}
     */
    export const intoLines = (out: ProcessOutput) => out.toString().split('\n').filter(fn.isTruthy);
  } // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
