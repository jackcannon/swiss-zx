import { chalk } from 'zx';
import { second, seconds, wait, fn } from 'swiss-ak';
import prompts from 'prompts';
import Fuse from 'fuse.js'; // fuzzy-search

import { $$ } from './$$';
import { moveUp, loading as loadingOut } from './out';
import * as chlk from './chlk';
import { ExplodedPath, explodePath } from './PathUtils';

const PROMPT_VALUE_PROPERTY = 'SWISS_ZX_PROMPT_VALUE';

const promptsOptions = {
  onCancel() {
    process.exit(0);
  }
};

interface PromptChoiceObject<T = string> {
  title?: string;
  value?: T;
}

type PromptChoice<T = string> = string | PromptChoiceObject<T>;

/**
 * ask.text
 *
 * Get a text input from the user.
 *
 * ```typescript
 * const name = await ask.text('What is your name?'); // 'Jack'
 * ```
 */
const text = async (message: string, initial?: string): Promise<string> => {
  const response = await prompts(
    {
      type: 'text',
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
    },
    promptsOptions
  );

  return '' + response[PROMPT_VALUE_PROPERTY];
};

/**
 * ask.autotext
 *
 * Get a text input from the user, with auto-completion.
 *
 * ```typescript
 * const name = await ask.autotext('What is your name?', ['Jack', 'Jane', 'Joe']); // 'Jack'
 * ```
 */
const autotext = async <T extends unknown>(message: string, choices: PromptChoice<T>[], choiceLimit: number = 5): Promise<T> => {
  let response = {} as { [key: string]: T };

  if (choices) {
    const choiceObjs = choices.map((choice) => (typeof choice === 'object' ? choice : { title: choice, value: choice }));
    const fuzzy = new Fuse(choiceObjs, {
      includeScore: false,
      keys: ['title', 'value']
    });
    response = await prompts(
      {
        type: 'autocomplete',
        name: PROMPT_VALUE_PROPERTY,
        choices: choiceObjs,
        message,
        limit: choiceLimit,
        suggest: async (text, ch) => {
          const filtered = fuzzy.search(text);
          const list = text ? filtered.map(({ item }) => item) : choiceObjs;
          return list;
        }
      },
      promptsOptions
    );
  }

  return response[PROMPT_VALUE_PROPERTY];
};

/**
 * ask.number
 *
 * Get a number input from the user.
 *
 * ```typescript
 * const age = await ask.number('How old are you?'); // 30
 * ```
 */
const number = async (message: string, initial: number = 1): Promise<number> => {
  const response = await prompts(
    {
      type: 'number',
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
    },
    promptsOptions
  );
  return Number(response[PROMPT_VALUE_PROPERTY]);
};

/**
 * ask.boolean
 *
 * Get a boolean input from the user (yes or no)
 *
 * ```typescript
 * const isCool = await ask.boolean('Is this cool?'); // true
 * ```
 */
const boolean = async (message: string): Promise<boolean> => {
  const response = await prompts(
    {
      type: 'confirm',
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial: true
    },
    promptsOptions
  );
  return Boolean(response[PROMPT_VALUE_PROPERTY]);
};

/**
 * ask.select
 *
 * Get the user to select an option from a list.
 *
 * ```typescript
 * const colour = await ask.select('Whats your favourite colour?', ['red', 'green', 'blue']); // 'red'
 * ```
 */
const select = async <T extends unknown>(message: string, choices: PromptChoice<T>[], initial?: T): Promise<T> => {
  const choiceObjs = choices.map((choice) => (typeof choice === 'object' ? choice : { title: choice, value: choice }));
  let initialId = 0;
  if (initial) {
    initialId = (choiceObjs || []).map((x) => (x && x.value ? x.value : x)).indexOf(initial);
    if (initialId < 0) initialId = 0;
  }

  const response = await prompts(
    {
      type: 'select',
      name: PROMPT_VALUE_PROPERTY,
      message,
      choices: choiceObjs,
      initial: initialId,
      hint: '- Arrow keys to select. Enter/Return to submit'
    },
    promptsOptions
  );
  const value = response[PROMPT_VALUE_PROPERTY];
  return typeof value === 'number' ? choiceObjs[value] : value;
};

/**
 * ask.multiselect
 *
 * Get the user to select multiple options from a list.
 *
 * ```typescript
 * const colours = await ask.multiselect('Whats your favourite colours?', ['red', 'green', 'blue']); // ['red', 'green']
 * ```
 */
const multiselect = async <T extends unknown>(message: string, choices: PromptChoice<T>[], initial?: T): Promise<T[]> => {
  const choiceObjs = choices.map((choice) => (typeof choice === 'object' ? choice : { title: choice, value: choice }));
  let initialId = 0;
  if (initial) {
    initialId = (choiceObjs || []).map((x) => (x && x.value ? x.value : x)).indexOf(initial);
    if (initialId < 0) initialId = 0;
  }

  const response = await prompts(
    {
      type: 'multiselect',
      name: PROMPT_VALUE_PROPERTY,
      instructions: false,
      message,
      choices: choiceObjs,
      initial: initialId,
      hint: '- Space to select. Enter/Return to submit'
    },
    promptsOptions
  );
  const result = response[PROMPT_VALUE_PROPERTY] ? response[PROMPT_VALUE_PROPERTY] : [0];
  return result.map((value) => (typeof value === 'number' ? choiceObjs[value] : value));
};

/**
 * ask.validate
 *
 * Validate the result of an `ask` prompt
 *
 * ```typescript
 * const name = await ask.validate(
 *   () => ask.text('What is your name?'),
 *   (name) => name.length > 0
 * ); // 'Jack'
 * ```
 */
const validate = async <T extends unknown, I extends unknown>(
  askFunc: (initialValue?: T) => Promise<I> | I,
  validateFn: (input: Awaited<I>) => boolean | string
): Promise<I> => {
  const runLoop = async (initial?: any, extraLines: number = 0) => {
    const input = await askFunc(initial);
    const validateResponse = await validateFn(input);
    if (validateResponse === true) {
      return input;
    } else {
      const message = validateResponse || '';
      moveUp(1 + extraLines);
      console.log(chalk.red(message));
      return runLoop(input, message.split('\n').length);
    }
  };
  return runLoop();
};

/**
 * ask.imitate
 *
 * Imitate the display of a prompt
 *
 * ```typescript
 * ask.imitate(true, 'What is your name?', 'Jack');
 * ```
 */
const imitate = (done: boolean, questionText: string, resultText?: string): number => {
  const prefix = done ? chalk.green('✔') : chalk.cyan('?');
  const question = chalk.whiteBright.bold(questionText);
  const joiner = chalk.gray(done ? '…' : '›');
  const resultWrapper = done ? chalk.white : chalk.gray;
  const result = resultText ? `${joiner} ${resultWrapper(resultText)}` : '';

  console.log(`${prefix} ${question} ${result}`);
  return 1;
};

/**
 * ask.loading
 *
 * Display an animated loading indicator that imitates the display of a prompt
 *
 * ```typescript
 * const loader = ask.loading('What is your name?');
 * // ...
 * loader.stop();
 * ```
 */
const loading = (questionText: string) => loadingOut((s) => imitate(false, questionText, `[Loading${s}]`));

/**
 * ask.pause
 *
 * Pause the program until the user presses enter
 *
 * ```typescript
 * await ask.pause();
 * ```
 */
const pause = async (text: string = 'Press enter to continue...'): Promise<void> => {
  console.log(chalk.gray(text));
  await $`read -n 1`;
};

/**
 * ask.countdown
 *
 * Animated countdown for a given number of seconds
 *
 * ```typescript
 * await ask.countdown(5);
 * ```
 */
const countdown = async (totalSeconds: number, template: (s: second) => string = (s) => `Starting in ${s}s...`, complete?: string): Promise<void> => {
  console.log();

  let lines = 1;
  for (let s = totalSeconds; s > 0; s--) {
    const text = template(s);
    moveUp(lines);
    lines = text.split('\n').length;
    console.log(chalk.blackBright(text));
    await wait(seconds(1));
  }
  moveUp(lines);
  if (complete) {
    console.log(complete);
  }
};

const getRenameObj = (bef: string, aft: (before: ExplodedPath) => string) => {
  const befExp = explodePath(bef);
  const aftName = aft(befExp);

  return {
    before: { name: befExp.filename, path: bef },
    after: { name: aftName, path: `${befExp.dir}/${aftName}` }
  };
};

/**
 * ask.rename
 *
 * Ask the user to rename a file or directory
 *
 * ```typescript
 * await ask.rename('/path/to/file.txt', '/path/to/new-file.txt');
 * ```
 */
const rename = async (bef: string, aft: (before: ExplodedPath) => string): Promise<boolean> => {
  const { before, after } = getRenameObj(bef, aft);

  console.log(chalk.green('Renaming:'));
  console.log(chalk.greenBright.bold(`	${before.name} ${chalk.dim('→')} ${after.name}`));
  console.log('');
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await $$.mv(before.path, after.path);
  }
  return isConfirmed;
};

/**
 * ask.fileExplorer
 *
 * Get a file from the user
 *
 * ```typescript
 * const file = await ask.fileExplorer('Select a file');
 * ```
 */
const fileExplorer = async (
  startDir: string | string[],
  filter: (item: any, index: number, arr: any[]) => boolean = fn.result(true),
  questionText: string = 'Choose a file:'
) => {
  const fnDir = chlk.gray5;
  const fnFiles = chlk.gray3;
  const runExplorer = async (dir) => {
    const loader = loading(questionText);

    const dirs = await $$.findDirs(dir);
    const files = (await $$.findFiles(dir)).filter(filter);

    loader.stop();

    const options = [
      { title: chlk.gray1('▲ [back]'), value: '..' },
      ...dirs.map((dir) => ({ title: fnDir(`› ${dir}`), value: dir })),
      ...files.map((file) => ({ title: fnFiles(`${file}`), value: file }))
    ];
    const result = await ask.select(questionText, options, dirs[0] || files[0]);
    if (result === '..') {
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
    const options = startDirs.map((dir) => ({ title: fnDir(`› ${explodePath(dir).name}`), value: dir }));
    const result = await ask.select(questionText, options);
    moveUp(1);
    return await runExplorer($$.utils.removeTrailSlash(result));
  }
};

export const ask = {
  text,
  autotext,
  number,
  boolean,
  select,
  multiselect,
  validate,
  imitate,
  loading,
  pause,
  countdown,
  rename,
  fileExplorer
};
