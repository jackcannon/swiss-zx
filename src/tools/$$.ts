import 'zx/globals';
import { $, fs as fsO } from 'zx';
import { retry, retryOr, tryOr } from './errorHandling';
import { isTruthy, isNotEqual, noact } from 'swiss-ak';

$.verbose = false;

const fs = fsO.promises;

const intoLines = (out: ProcessOutput) => out.toString().split('\n').filter(isTruthy);
const removeTrailSlash = (path: string) => path.replace(/\/$/, '');
const trailSlash = (path: string) => removeTrailSlash(path) + '/';

export const ls = async (dir: string = '.', flags: string[] = []): Promise<string[]> =>
  intoLines(await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);

export const findDirs = async (parent: string = '.', name?: string, depth: number = 1): Promise<string[]> =>
  intoLines(await $`find ${trailSlash(parent)} -maxdepth ${depth} -type d -execdir echo {} ';' ${name ? ['-name', name] : ''}`)
    .map((row) => row.replace(/\/$/, ''))
    .filter(isNotEqual('.'));

export const findFiles = async (parent: string = '.', name?: string, depth: number = 1): Promise<string[]> =>
  intoLines(await $`find ${trailSlash(parent)} -maxdepth ${depth} -type f -execdir echo {} ';' ${name ? ['-name', name] : ''}`).filter(
    isNotEqual('.')
  );

export const rm = (item: string) => $`rm -rf ${item}`;
export const mkdir = (item: string) => $`mkdir -p ${item}`;
export const cp = (a: string, b: string) => $`cp -r ${a} ${b}`;
export const mv = (a: string, b: string) => $`mv ${a} ${b}`;
export const touch = (item: string) => $`touch ${item}`;
export const cat = (item: string) => $`cat ${item}`;
export const grep = async (pattern: string, file: string) => intoLines(await $`grep ${pattern} ${file}`);

/**
 * * b = block special
 * * c = character special
 * * d = directory
 * * f = regular file
 * * l = symbolic link
 * * p = FIFO
 * * s = socket
 */
type FindType = 'd' | 'f' | 'b' | 'c' | 'l' | 'p' | 's';
export const find = async (dir: string, name: string, type: FindType = 'd') => intoLines(await $`find ${dir} -type ${type} -name ${name}`);
export const findRegex = async (dir: string, regex: RegExp | string, type: FindType = 'd') =>
  intoLines(await $`find -E ${dir} -type ${type} -regex ${regex.toString()}`);

export const rsync = (a: string, b: string) => $`rsync -crut ${a} ${b}`;
export const sync = async (a: string, b: string): Promise<void> => {
  await rsync(a, b);
  await rsync(b, a);
  await rsync(a, b);
};

export const isFileExist = async (file: string) => (await $`[[ -f ${file} ]]`.exitCode) === 0;
export const isDirExist = async (dir: string) => (await $`[[ -d ${dir} ]]`.exitCode) === 0;

export const readFile = (filepath: string): Promise<string> => retryOr<string>('', 3, 100, true, () => fs.readFile(filepath, { encoding: 'utf8' }));
export const writeFile = (filepath: string, contents: string): Promise<void> =>
  retryOr<undefined>(undefined, 3, 100, true, () => fs.writeFile(filepath, contents, { encoding: 'utf8' }));

export const readJSON = async <T extends unknown>(filepath: string): Promise<T> => {
  const raw = await readFile(filepath);
  return JSON.parse(raw || '{}');
};
export const writeJSON = async <T extends Object>(filepath, obj: T): Promise<T> => {
  const raw = (obj ? JSON.stringify(obj, null, 2) : '{}') || '{}';
  await writeFile(filepath, raw);
  return obj;
};

export const $$ = {
  ls,
  findDirs,
  findFiles,
  rm,
  mkdir,
  cp,
  mv,
  touch,
  cat,
  grep,
  find,
  isFileExist,
  isDirExist,
  readJSON,
  writeJSON
};
