import { chalk } from 'zx';
import { second, seconds, wait } from 'swiss-ak';
import prompts from 'prompts';
import Fuse from 'fuse.js'; // fuzzy-search

import { mv } from './$_';
import { moveUp } from './out';
import { ExplodedPath, explodePath } from './PathUtils';
import { lines } from './lineCounter';

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

const validate = async <T extends unknown, I extends unknown>(
  askFunc: (initialValue?: T) => I,
  validateFn: (input: I) => boolean | string
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

const imitate = (done: boolean, questionText: string, resultText?: string): lines => {
  const prefix = done ? chalk.green('✔') : chalk.cyan('?');
  const question = chalk.whiteBright.bold(questionText);
  const joiner = chalk.gray(done ? '…' : '›');
  const resultWrapper = done ? chalk.white : chalk.gray;
  const result = resultText ? `${joiner} ${resultWrapper(resultText)}` : '';

  console.log(`${prefix} ${question} ${result}`);
  return 1;
};

const pause = async (text: string = 'Press enter to continue...'): Promise<void> => {
  console.log(chalk.gray(text));
  await $`read -n 1`;
};

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

const rename = async (bef: string, aft: (before: ExplodedPath) => string): Promise<boolean> => {
  const { before, after } = getRenameObj(bef, aft);

  console.log(chalk.green('Renaming:'));
  console.log(chalk.greenBright.bold(`	${before.name} ${chalk.dim('→')} ${after.name}`));
  console.log('');
  const isConfirmed = await boolean(`Would you like to rename ${before.name} to ${after.name}?`);
  if (isConfirmed) {
    await mv(before.path, after.path);
  }
  return isConfirmed;
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
  pause,
  countdown,
  rename
};
