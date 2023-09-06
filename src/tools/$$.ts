import 'zx/globals';
import { $, fs as fsO, cd as cdO } from 'zx';
import { fn, getProgressBar, ms, ProgressBarOptions, retryOr, seconds } from 'swiss-ak';
import { PathTools, explodePath, ExplodedPath } from 'swiss-node';

import * as findTypes from '../utils/findTypes';
import * as exif from './dd/exiftool';

$.verbose = false;

const fs = fsO.promises;

//<!-- DOCS: 100 -->

/**<!-- DOCS: $$ ##! -->
 * $$ (double dollar)
 */
export namespace $$ {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  /**<!-- DOCS: $$.cd ### @ -->
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
   */
  export const cd = async (dir: string = '.'): Promise<void> => {
    cdO(dir);
    await $`cd ${dir}`;
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
   */
  export const ls = async (dir: string = '.', flags: string[] = []): Promise<string[]> =>
    utils.intoLines(await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);

  /**<!-- DOCS: $$.rm ### @ -->
   * rm
   *
   * - `$$.rm`
   *
   * Wrapper for rm (remove) command
   *
   * ```typescript
   * await $$.rm('example') // same as $`rm -rf 'example'`
   * ```
   */
  export const rm = (item: string) => $`rm -rf ${item}`;

  /**<!-- DOCS: $$.mkdir ### @ -->
   * mkdir
   *
   * - `$$.mkdir`
   *
   * Wrapper for mkdir (make directory) command
   *
   * ```typescript
   * await $$.mkdir('example') // same as $`mkdir -p 'example'`
   * ```
   */
  export const mkdir = (item: string) => $`mkdir -p ${item}`;

  /**<!-- DOCS: $$.cp ### @ -->
   * cp
   *
   * - `$$.cp`
   *
   * Wrapper for cp (copy) command
   *
   * ```typescript
   * await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
   * ```
   */
  export const cp = (a: string, b: string) => $`cp -r ${a} ${b}`;

  /**<!-- DOCS: $$.mv ### @ -->
   * mv
   *
   * - `$$.mv`
   *
   * Wrapper for mv (move) command
   *
   * ```typescript
   * await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
   * ```
   */
  export const mv = (a: string, b: string) => $`mv ${a} ${b}`;

  /**<!-- DOCS: $$.touch ### @ -->
   * touch
   *
   * - `$$.touch`
   *
   * Wrapper for touch (create blank file) command
   *
   * ```typescript
   * await $$.touch('example') // same as $`touch 'example'`
   * ```
   */
  export const touch = (item: string) => $`touch ${item}`;

  /**<!-- DOCS: $$.cat ### @ -->
   * cat
   *
   * - `$$.cat`
   *
   * Wrapper for cat (concatenate) command
   *
   * ```typescript
   * await $$.cat('example') // same as $`cat 'example'`
   * ```
   */
  export const cat = (item: string) => $`cat ${item}`;

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
   */
  export const grep = async (pattern: string, file: string) => utils.intoLines(await $`grep ${pattern} ${file}`);

  const convertFindOptionsToFlags = (options: findTypes.FindOptions) => {
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
   */
  export const find = async (dir: string = '.', options: findTypes.FindOptions = {}): Promise<string[]> => {
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
   */
  export type FindOptions = findTypes.FindOptions;

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
  export type FindType = findTypes.FindType;

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
   */
  export const findDirs = (dir: string = '.', options: findTypes.FindOptions = {}): Promise<string[]> =>
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
   */
  export const findFiles = (dir: string = '.', options: findTypes.FindOptions = {}): Promise<string[]> =>
    find(dir, { type: 'f', maxdepth: 1, removePath: true, contentsOnly: true, ...options });

  /**<!-- DOCS: $$.findModified ### @ -->
   * findModified
   *
   * - `$$.findModified`
   *
   * TODO docs
   */
  export const findModified = async (dir: string = '.', options: findTypes.FindOptions = {}): Promise<ModifiedFile[]> => {
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
   * TODO docs
   */
  export interface ModifiedFile extends ExplodedPath {
    lastModified: ms;
  }

  /**<!-- DOCS: $$.lastModified ### @ -->
   * lastModified
   *
   * - `$$.lastModified`
   *
   * TODO docs
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
   */
  export const rsync = async (a: string, b: string, flags: string[] = [], progressBarOpts?: Partial<ProgressBarOptions>) => {
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
      return await out;
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
   */
  export const sync = (a: string, b: string, progressBarOpts?: Partial<ProgressBarOptions>) =>
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
   */
  export const readFile = (filepath: string): Promise<string> => retryOr<any>('', 2, 100, true, () => fs.readFile(filepath, { encoding: 'utf8' }));

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
   */
  export const writeFile = (filepath: string, contents: string): Promise<void> =>
    retryOr<any>(undefined, 2, 100, true, () => fs.writeFile(filepath, contents, { encoding: 'utf8' }));

  /**<!-- DOCS: $$.readJSON ### @ -->
   * readJSON
   *
   * - `$$.readJSON`
   *
   * Read a JSON file
   *
   * ```typescript
   * await $$.readJSON('example.json') // { hello: 'world' }
   * ```
   */
  export const readJSON = async <T extends unknown>(filepath: string): Promise<T> => {
    const raw = await readFile(filepath);
    return JSON.parse(raw || '{}');
  };

  /**<!-- DOCS: $$.writeJSON ### @ -->
   * writeJSON
   *
   * - `$$.writeJSON`
   *
   * Write to a JSON file
   *
   * ```typescript
   * await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
   * ```
   */
  export const writeJSON = async <T extends Object>(filepath, obj: T): Promise<T> => {
    const raw = (obj ? JSON.stringify(obj, null, 2) : '{}') || '{}';
    await writeFile(filepath, raw);
    return obj;
  };

  /**<!-- DOCS: $$.pipe ### @ -->
   * pipe
   *
   * - `$$.pipe`
   *
   * TODO docs
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

    /**<!-- DOCS: $$.utils.intoLines #### @ -->
     * intoLines
     *
     * - `$$.utils.intoLines`
     *
     * Turns ProcessOutput into string array, split into lines
     *
     * ```typescript
     * utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
     * ```
     */
    export const intoLines = (out: ProcessOutput) => out.toString().split('\n').filter(fn.isTruthy);
  } // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
