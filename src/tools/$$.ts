import 'zx/globals';
import { $, fs as fsO } from 'zx';
import { retry, retryOr, tryOr } from './errorHandling';
import { exists, noact } from 'swiss-ak';

$.verbose = false;

const fs = fsO.promises;

const intoLines = (out: ProcessOutput) => out.toString().split('\n').filter(exists);

export const ls = async (dir: string = '.', flags: string[] = []): Promise<string[]> =>
  intoLines(await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`);

export const findDirs = async (parent: string, name: string, depth: number = 1): Promise<string[]> =>
  intoLines(await $`find ${parent} -maxdepth ${depth} -type d -execdir echo {} ';' ${name ? ['-name', name] : ''}`).map((row) =>
    row.replace(/\/$/, '')
  );

export const findFiles = async (parent: string, name: string, depth: number = 1): Promise<string[]> =>
  intoLines(await $`find ${parent} -maxdepth ${depth} -type f -execdir echo {} ';' ${name ? ['-name', name] : ''}`);

export const rm = (item: string) => $`rm -rf ${item}`;
export const mkdir = (item: string) => $`mkdir -p ${item}`;
export const cp = (a: string, b: string) => $`cp -r ${a} ${b}`;
export const mv = (a: string, b: string) => $`mv ${a} ${b}`;
export const touch = (item: string) => $`touch ${item}`;
export const cat = (item: string) => $`cat ${item}`;
export const grep = async (item: string, pattern: string) => intoLines(await $`grep ${pattern} ${item}`);
export const find = async (item: string, pattern: string) => intoLines(await $`find ${item} -name ${pattern}`);

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
