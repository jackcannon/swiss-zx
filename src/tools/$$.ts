import 'zx/globals';
import { $, fs as fsO, cd as cdO } from 'zx';
import { fn, getProgressBar, ms, ProgressBarOptions, retryOr, seconds } from 'swiss-ak';
import { FindOptions } from '../utils/types';
import { ExplodedPath, explodePath } from './PathUtils';

$.verbose = false;

const fs = fsO.promises;

/**
 * $$.utils.intoLines
 *
 * Turns ProcessOutput into string array, split into lines
 *
 * ```typescript
 * $$.utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
 * ```
 */
const intoLines = (out: ProcessOutput) => out.toString().split('\n').filter(fn.isTruthy);

/**
 * $$.utils.removeTrailSlash
 *
 * Remove trailing slash from path (if one exists)
 *
 * ```typescript
 * '/path/to/file/' -> '/path/to/file'
 * ```
 */
const removeTrailSlash = (path: string) => path.replace(/\/$/, '');

/**
 * $$.utils.trailSlash
 *
 * Ensures there's a trailing slash on path
 *
 * ```typescript
 * '/path/to/file' -> '/path/to/file/'
 * ```
 */
const trailSlash = (path: string) => removeTrailSlash(path) + '/';

/**
 * $$.utils.removeDoubleSlashes
 *
 * Removes double slashes from path (an bug with Unix paths)
 *
 * ```typescript
 * '/path/to//file' -> '/path/to/file'
 * ```
 */
const removeDoubleSlashes = (path: string) => path.replace(/\/\//g, '/');

// todo docs
const cd = async (dir: string = '.'): Promise<void> => {
  cdO(dir);
  await $`cd ${dir}`;
};

// todo docs
const pwd = async (): Promise<string> => intoLines(await $`pwd`)[0];

/**
 * $$.ls
 *
 * Wrapper for ls (list) command
 *
 * ```typescript
 * await $$.ls('example') // ['a', 'b']
 * ```
 */
const ls = async (dir: string = '.', flags: string[] = []): Promise<string[]> => intoLines(await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);

/**
 * $$.rm
 *
 * Wrapper for rm (remove) command
 *
 * ```typescript
 * await $$.rm('example') // same as $`rm -rf 'example'`
 * ```
 */
const rm = (item: string) => $`rm -rf ${item}`;

/**
 * $$.mkdir
 *
 * Wrapper for mkdir (make directory) command
 *
 * ```typescript
 * await $$.mkdir('example') // same as $`mkdir -p 'example'`
 * ```
 */
const mkdir = (item: string) => $`mkdir -p ${item}`;

/**
 * $$.cp
 *
 * Wrapper for cp (copy) command
 *
 * ```typescript
 * await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
 * ```
 */
const cp = (a: string, b: string) => $`cp -r ${a} ${b}`;

/**
 * $$.mv
 *
 * Wrapper for mv (move) command
 *
 * ```typescript
 * await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
 * ```
 */
const mv = (a: string, b: string) => $`mv ${a} ${b}`;

/**
 * $$.touch
 *
 * Wrapper for touch (create blank file) command
 *
 * ```typescript
 * await $$.touch('example') // same as $`touch 'example'`
 * ```
 */
const touch = (item: string) => $`touch ${item}`;

/**
 * $$.cat
 *
 * Wrapper for cat (concatenate) command
 *
 * ```typescript
 * await $$.cat('example') // same as $`cat 'example'`
 * ```
 */
const cat = (item: string) => $`cat ${item}`;

/**
 * $$.grep
 *
 * Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command
 *
 * ```typescript
 * await $$.grep('example', '.') // same as $`grep 'example' '.'`
 * ```
 */
const grep = async (pattern: string, file: string) => intoLines(await $`grep ${pattern} ${file}`);

const convertFindOptionsToFlags = (options: FindOptions) => {
  const { type, mindepth, maxdepth, name, regex, removePath } = options;
  const flags = [];
  // TODO simplify this
  if (type) flags.push('-type', type);
  if (mindepth) flags.push('-mindepth', mindepth + '');
  if (maxdepth) flags.push('-maxdepth', maxdepth + '');
  if (name) flags.push('-name', name);
  if (regex) flags.push('-regex', regex);
  return flags;
};

/**
 * $$.find
 *
 * Helper function for finding files
 *
 * ```typescript
 * await $$.find('.', { type: 'f' }) // ['a', 'b']
 * ```
 */
const find = async (dir: string = '.', options: FindOptions = {}): Promise<string[]> => {
  // google zx doesn't allow for unquoted arguments, so we need work around to conditionally add -execdir
  let result;

  if (dir === '.') {
    dir = await $$.pwd();
  }

  const newDir = options.contentsOnly ? trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);

  const pruneRegex = options.showHidden ? '.*(\\.Trash|\\.DS_Store).*' : '.*(/\\.|\\.Trash|\\.DS_Store).*';

  // E - advanced regex
  // s - sort lexicographically
  // L - follow symbolic links
  if (options.removePath) {
    result = await $`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -execdir echo {} ';' \\)`;
  } else {
    result = await $`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print \\)`;
  }

  return intoLines(result)
    .map(removeDoubleSlashes)
    .filter(fn.isNotEqual('.'))
    .filter((str) => !str.includes('.Trash'))
    .map(options.removeTrailingSlashes ? removeTrailSlash : fn.noact);
};

/**
 * $$.findDirs
 *
 * Find all directories in a given directory (shallow)
 *
 * ```typescript
 * await $$.findDirs('.') // ['a', 'b']
 * ```
 */
const findDirs = (dir: string = '.', options: FindOptions = {}): Promise<string[]> =>
  find(dir, { type: 'd', maxdepth: 1, removePath: true, contentsOnly: true, removeTrailingSlashes: true, ...options });

/**
 * $$.findFiles
 *
 * Find all files in a given directory (shallow)
 *
 * ```typescript
 * await $$.findFiles('.') // ['a', 'b']
 * ```
 */
const findFiles = (dir: string = '.', options: FindOptions = {}): Promise<string[]> =>
  find(dir, { type: 'f', maxdepth: 1, removePath: true, contentsOnly: true, ...options });

export interface ModifiedFile extends ExplodedPath {
  lastModified: ms;
}
// todo docs
const findModified = async (dir: string = '.', options: FindOptions = {}): Promise<ModifiedFile[]> => {
  const newDir = options.contentsOnly ? trailSlash(dir) : dir;
  const flags = convertFindOptionsToFlags(options);

  const pruneRegex = options.showHidden ? '.*(\\.Trash|\\.DS_Store).*' : '.*(/\\.|\\.Trash|\\.DS_Store).*';

  const result = await $`find -EsL ${newDir} -regex ${pruneRegex} -prune -o \\( ${flags} -print0 \\) | xargs -0 stat -f "%m %N"`;

  return intoLines(result)
    .map(removeDoubleSlashes)
    .filter((str) => !str.includes('.Trash'))
    .map((line) => {
      const [_blank, lastModified, file] = line.split(/^([0-9]+)\s/);
      return { lastModified: seconds(Number(lastModified)), file };
    })
    .filter(({ file }) => !['.', '.DS_Store'].includes(file))
    .map(options.removeTrailingSlashes ? ({ file, ...rest }) => ({ file: removeDoubleSlashes(file), ...rest }) : fn.noact)
    .map(({ lastModified, file }) => ({
      lastModified,
      ...explodePath(file.replace(/^\./, removeTrailSlash(dir)))
    }));
};

// todo docs
const lastModified = async (path: string): Promise<number> => {
  let list = await findModified(path, { type: 'f' });
  if (list.length === 0) list = await findModified(path);
  const max = Math.max(...list.map(({ lastModified }) => lastModified));
  return max;
};

/**
 * $$.rsync
 *
 * Wrapper for rsync command
 *
 * ```typescript
 * await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
 * ```
 */
const rsync = async (a: string, b: string, flags: string[] = [], progressBarOpts?: Partial<ProgressBarOptions>) => {
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

/**
 * $$.sync
 *
 * Helper function for syncing files
 *
 * ```typescript
 * await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
 * ```
 */
const sync = (a: string, b: string, progressBarOpts?: Partial<ProgressBarOptions>) =>
  rsync(trailSlash(a), trailSlash(b), ['--delete'], progressBarOpts);

/**
 * $$.isFileExist
 *
 * Check if a file exists
 *
 * ```typescript
 * await $$.isFileExist('example') // true
 * ```
 */
const isFileExist = async (file: string) => (await $`[[ -f ${file} ]]`.exitCode) === 0;

/**
 * $$.isDirExist
 *
 * Check if a directory exists
 *
 * ```typescript
 * await $$.isDirExist('example') // true
 * ```
 */
const isDirExist = async (dir: string) => (await $`[[ -d ${dir} ]]`.exitCode) === 0;

/**
 * $$.readFile
 *
 * Read a file's contents
 *
 * ```typescript
 * await $$.readFile('example') // 'hello world'
 * ```
 */
const readFile = (filepath: string): Promise<string> => retryOr<string>('', 2, 100, true, () => fs.readFile(filepath, { encoding: 'utf8' }));

/**
 * $$.writeFile
 *
 * Write to a file
 *
 * ```typescript
 * await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
 * ```
 */
const writeFile = (filepath: string, contents: string): Promise<void> =>
  retryOr<undefined>(undefined, 2, 100, true, () => fs.writeFile(filepath, contents, { encoding: 'utf8' }));

/**
 * $$.readJSON
 *
 * Read a JSON file
 *
 * ```typescript
 * await $$.readJSON('example.json') // { hello: 'world' }
 * ```
 */
const readJSON = async <T extends unknown>(filepath: string): Promise<T> => {
  const raw = await readFile(filepath);
  return JSON.parse(raw || '{}');
};

/**
 * $$.writeJSON
 *
 * Write to a JSON file
 *
 * ```typescript
 * await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
 * ```
 */
const writeJSON = async <T extends Object>(filepath, obj: T): Promise<T> => {
  const raw = (obj ? JSON.stringify(obj, null, 2) : '{}') || '{}';
  await writeFile(filepath, raw);
  return obj;
};

export const $$ = {
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
  rsync,
  sync,
  utils: {
    intoLines,
    removeTrailSlash,
    trailSlash,
    removeDoubleSlashes
  }
};
