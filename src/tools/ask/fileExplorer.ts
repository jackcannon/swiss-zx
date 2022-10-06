import { fn, Partial, symbols } from 'swiss-ak';
import { $$ } from '../$$';
import { FindType } from '../../utils/types';
import { ask } from '../ask';
import { chlk } from '../clr';
import { Breadcrumb } from '../out/breadcrumb';
import { getLineCounter } from '../out/lineCounter';
import { explodePath } from '../PathUtils';

export const displayPath = (p) => p.replace(process.env.HOME + '/', `${symbols.HOME}/`).replace('/Volumes/', `${symbols.EJECT}/`);

export interface FileExplorerOptions {
  filter: (file: string, index: number, files: string[]) => boolean;
  makeDir: boolean;
  newFile: boolean;

  selectDirText: string;
  makeDirText: string;
  newFileText: string;
  enclosingText: string;
}

const getFullOpts = (opts: Partial<FileExplorerOptions>): FileExplorerOptions => ({
  filter: fn.result(true),
  makeDir: false,
  newFile: false,

  selectDirText: `[select '{{dir}}']`,
  makeDirText: '[create folder]',
  newFileText: '[new file]',
  enclosingText: '[back]',
  ...opts
});

/**
 * ask.fileExplorer
 *
 * Get a file from the user
 *
 * ```typescript
 * const file = await ask.fileExplorer('Select a file');
 * ```
 */
export const fileExplorer = async (
  startDir: string | string[],
  selectType: FindType = 'f',
  question?: string | Breadcrumb,
  initial?: string,
  options: Partial<FileExplorerOptions> = {}
): Promise<string> => {
  const opts = getFullOpts(options);
  const lc = getLineCounter();
  const quest = question ? (typeof question === 'string' ? question : question.get()) : selectType === 'd' ? 'Choose a directory' : 'Choose a file:';

  const fnDir = (dir: string) => (selectType === 'd' ? chlk.gray5 : chlk.gray3)(`${symbols.CHEV_RGT} ${dir}`);
  const fnFiles = (dir: string) => (selectType === 'd' ? chlk.gray2 : chlk.gray5)(`${selectType === 'f' ? symbols.BULLET : ' '} ${dir}`);

  const runExplorer = async (dir: string, runInitial?: string, message?: string): Promise<string> => {
    const dispLine = `${quest}${message ? chalk.red(` - ${message}`) : ''}`;

    const loader = ask.loading(dispLine);

    const dirs = await $$.findDirs(dir);
    const files = (await $$.findFiles(dir)).filter(opts.filter);

    loader.stop();

    const options = [
      { title: chlk.gray1('▲ [back]'), value: '..' },
      selectType === 'd'
        ? { title: `${chalk.greenBright(symbols.TICK)} ${opts.selectDirText.replace('{{dir}}', displayPath(dir))}`, value: '***SELECT***' }
        : undefined,
      opts.makeDir ? { title: `${chalk.cyanBright.bold('+')} ${opts.makeDirText}`, value: '***MAKE_DIR***' } : undefined,
      opts.newFile ? { title: `${chalk.blueBright.bold('+')} ${opts.newFileText}`, value: '***NEW_FILE***' } : undefined,

      ...ask.utils.itemsToPromptObjects(dirs, undefined, fnDir),
      ...ask.utils.itemsToPromptObjects(files, undefined, fnFiles)
    ].filter(fn.filters.exists);
    const result = await lc.wrap(1, () => ask.select(dispLine, options, runInitial || '***SELECT***' || dirs[0] || files[0]));
    if (result === '***SELECT***') {
      lc.clear();
      return dir;
    }
    if (result === '***MAKE_DIR***') {
      lc.clear();
      const name = await ask.text('Enter a name for the new directory:', 'untitled folder');
      await $$.mkdir(path.join(dir, name));
      lc.clear();

      return runExplorer($$.utils.removeTrailSlash(`${dir}/${name}`));
    }
    if (result === '***NEW_FILE***') {
      lc.clear();
      const name = await ask.text('Enter a name for the new file:', 'untitled.txt');
      lc.clear();
      const filePath = `${dir}/${name}`;
      await $$.touch(filePath);

      if (selectType === 'f') {
        return filePath;
      } else {
        return runExplorer(dir, runInitial);
      }
    }
    if (result === '..') {
      lc.clear();
      return runExplorer(explodePath(dir).dir);
    }
    if (dirs.includes(result)) {
      lc.clear();
      return runExplorer($$.utils.removeTrailSlash(`${dir}/${result}`));
    }
    if (selectType === 'd' && files.includes(result)) {
      lc.clear();
      return runExplorer(dir, runInitial, 'Please select a directory');
    }

    return `${dir}/${result}`;
  };

  const startDirs = [startDir].flat();

  const result = await (async () => {
    if (startDirs.length <= 1) {
      return await runExplorer($$.utils.removeTrailSlash(startDirs[0]), initial);
    } else {
      const options = ask.utils.itemsToPromptObjects(startDirs, undefined, fnDir);
      const result = await lc.wrap(1, () => ask.select(quest, options));
      lc.clear();
      return await runExplorer($$.utils.removeTrailSlash(result), initial);
    }
  })();

  lc.clear();

  ask.imitate(true, quest, displayPath(result));

  return result;
};

/**
 * ask.multiFileExplorer
 *
 * Like fileExplorer but allows multiple selections within a single directory
 */
export const multiFileExplorer = async (
  startDir: string | string[],
  selectType: FindType = 'f',
  question: string | Breadcrumb = 'Choose files:',
  initial?: string | string[],
  options: Partial<FileExplorerOptions> = {}
): Promise<string[]> => {
  const questionText = typeof question === 'string' ? question : question.get();
  const opts = getFullOpts(options);
  const lc = getLineCounter();
  const initiallySelected = initial ? [initial].flat() : [];
  const dir = await lc.wrap(1, () =>
    ask.fileExplorer(startDir, 'd', `${questionText} Select a directory`, initiallySelected[0] || '***SELECT***', {
      ...options
    })
  );
  const list = selectType === 'f' ? (await $$.findFiles(dir)).filter(opts.filter) : (await $$.findDirs(dir)).filter(opts.filter);
  lc.clear();
  const choices = await ask.multiselect(questionText, list, initiallySelected, true);

  return choices.map((item) => `${dir}/${item}`);
};
