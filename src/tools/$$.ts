import 'zx/globals';
import { $, fs as fsO } from 'zx';
import { tryOr } from './errorHandling';

const fs = fsO.promises;

export const ls = async (dir = '.', flags = []) =>
  (await $`ls ${flags.map((flag) => `-${flag}`)} ${dir}`)
    .toString()
    .split('\n')
    .filter((row) => row);

export const findDirs = async (parent) =>
  (await $`find ${parent} -maxdepth 1 -type d -execdir echo {} ';'`)
    .toString()
    .split('\n')
    .filter((row) => row)
    .map((row) => row.replace(/\/$/, ''));

export const findFiles = async (parent) =>
  (await $`find ${parent} -maxdepth 1 -type f -execdir echo {} ';'`)
    .toString()
    .split('\n')
    .filter((row) => row);

export const rm = (item: string) => $`rm -rf ${item}`;
export const mkdir = (item: string) => $`mkdir -p ${item}`;
export const cp = (a: string, b: string) => $`cp -r ${a} ${b}`;
export const mv = (a: string, b: string) => $`mv ${a} ${b}`;
export const touch = (item: string) => $`touch ${item}`;
export const cat = (item: string) => $`cat ${item}`;
export const grep = (item: string, pattern: string) => $`grep ${pattern} ${item}`;
export const find = (item: string, pattern: string) => $`find ${item} -name ${pattern}`;

export const checkFileExists = async (file: string) => (await $`[[ -f ${file} ]]`.exitCode) === 0;
export const checkDirectoryExists = async (dir: string) => (await $`[[ -d ${dir} ]]`.exitCode) === 0;

export const readJSON = async (filepath: string) => {
  const raw = await tryOr('{}', () => fs.readFile(filepath, { encoding: 'utf8' }));
  return JSON.parse(raw || '{}');
};
export const writeJSON = async <T extends Object>(filepath, obj: T) => {
  const raw = (obj ? JSON.stringify(obj, null, 2) : '') || '{}';
  return await tryOr(null, () => fs.writeFile(filepath, raw, { encoding: 'utf8' }));
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
  checkFileExists,
  checkDirectoryExists,
  readJSON,
  writeJSON
};
