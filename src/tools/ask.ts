import { chalk } from 'zx';
import { second, seconds, wait, fn, symbols } from 'swiss-ak';
import stringWidth from 'string-width';
import prompts from 'prompts';
import Fuse from 'fuse.js'; // fuzzy-search

import { $$ } from './$$';
import { moveUp, loading as loadingOut, truncate, hasColor } from './out';
import { chlk, clr } from './clr';
import { ExplodedPath, explodePath } from './PathUtils';
import { out } from './out';
import { Breadcrumb } from './out/breadcrumb';

import { askTrim } from './ask/trim';
import { displayPath, fileExplorer, multiFileExplorer } from './ask/fileExplorer';
import { section, separator } from './ask/section';
import { askTableSelect, askTableMultiselect } from './ask/table';

const PROMPT_VALUE_PROPERTY = 'SWISS_ZX_PROMPT_VALUE';

const promptsOptions = {
  onCancel() {
    process.exit(0);
  }
};

interface PromptChoiceObject<T = string> {
  title?: string;
  value?: T;
  selected?: boolean;
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
const text = async (question: string | Breadcrumb, initial?: string): Promise<string> => {
  const message = typeof question === 'string' ? question : question.get();
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
const autotext = async <T = string>(question: string | Breadcrumb, choices: PromptChoice<T>[], choiceLimit: number = 5): Promise<T> => {
  const message = typeof question === 'string' ? question : question.get();
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
const number = async (question: string | Breadcrumb, initial: number = 1): Promise<number> => {
  const message = typeof question === 'string' ? question : question.get();
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
const boolean = async (question: string | Breadcrumb, initial: boolean = true, yesTxt: string = 'yes', noTxt: string = 'no'): Promise<boolean> => {
  const message = typeof question === 'string' ? question : question.get();
  const response = await prompts(
    {
      type: 'toggle',
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial: !initial,
      active: noTxt,
      inactive: yesTxt
    },
    promptsOptions
  );
  return !Boolean(response[PROMPT_VALUE_PROPERTY]);
};

/**
 * ask.booleanAlt
 *
 * Get a boolean input from the user (yes or no)
 *
 * Alternative interface to ask.boolean
 *
 * ```typescript
 * const isCool = await ask.boolean('Is this cool?'); // true
 * ```
 */
const booleanAlt = async (question: string | Breadcrumb, initial: boolean = true): Promise<boolean> => {
  const message = typeof question === 'string' ? question : question.get();
  const response = await prompts(
    {
      type: 'confirm',
      name: PROMPT_VALUE_PROPERTY,
      message,
      initial
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
const select = async <T = string>(question: string | Breadcrumb, choices: PromptChoice<T>[], initial?: T): Promise<T> => {
  const message = typeof question === 'string' ? question : question.get();
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
      initial: initialId
    },
    promptsOptions
  );
  const value = response[PROMPT_VALUE_PROPERTY];
  return typeof value === 'number' ? choiceObjs[value] : value;
};

/**
 * ask.multiselect
 *
 * Get the user to select multiple opts from a list.
 *
 * ```typescript
 * const colours = await ask.multiselect('Whats your favourite colours?', ['red', 'green', 'blue']); // ['red', 'green']
 * ```
 */
const multiselect = async <T = string>(
  question: string | Breadcrumb,
  choices: PromptChoice<T>[],
  initial?: PromptChoice<T> | PromptChoice<T>[],
  canSelectAll: boolean = false
): Promise<T[]> => {
  const message = typeof question === 'string' ? question : question.get();
  if (!choices || choices.length === 0) {
    return [];
  }

  let choiceObjs = choices.map((choice) => (typeof choice === 'object' ? choice : { title: choice, value: choice }));
  if (initial) {
    const initialSelected = [initial].flat();
    choiceObjs = choiceObjs.map((choice) => ({
      selected: Boolean(initialSelected.find((x) => x === choice || x === choice.value)),
      ...choice
    }));
  }
  if (canSelectAll) {
    choiceObjs = [{ title: chlk.gray4('[Select all]'), value: '***SELECT_ALL***' }, ...choiceObjs];
  }

  const response = await prompts(
    {
      type: 'multiselect',
      name: PROMPT_VALUE_PROPERTY,
      instructions: false,
      message,
      choices: choiceObjs
    },
    promptsOptions
  );
  const result = response[PROMPT_VALUE_PROPERTY] ? response[PROMPT_VALUE_PROPERTY] : [];

  let selected = result.map((value) => (typeof value === 'number' ? choiceObjs[value] : value));
  if (selected.includes('***SELECT_ALL***')) {
    selected = choiceObjs.map((choice) => choice.value).filter((value) => !(value + '').startsWith('***') && !(value + '').endsWith('***'));
  }

  return selected;
};

export interface CRUDOptions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canDeleteAll: boolean;
}
export type CRUD = 'none' | 'create' | 'update' | 'delete' | 'delete-all';
/**
 * ask.crud
 *
 * Get the user to select a CRUD (**C**reate, **R**ead, **U**pdate and **D**elete) action
 *
 * Values returned are: 'none' | 'create' | 'update' | 'delete' | 'delete-all'
 *
 * ```typescript
 * const action = await ask.crud('What do you want to do next?'); // 'none'
 * ```
 */
const crud = async (question: string | Breadcrumb, itemName: string = 'item', items?: any[], options: Partial<CRUDOptions> = {}): Promise<CRUD> => {
  const fullOptions: CRUDOptions = {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canDeleteAll: true,
    ...options
  };

  const opts = [{ title: chalk.dim(`${clr.approve(symbols.TICK)} [ Finished ]`), value: 'none' as CRUD }];
  if (fullOptions.canCreate) {
    opts.push({ title: `${clr.create(symbols.PLUS)} Add another ${itemName}`, value: 'create' as CRUD });
  }
  if (items.length > 0) {
    if (fullOptions.canUpdate) {
      opts.push({ title: `${clr.update(symbols.ARROW_ROTATE_CLOCK)} Change a ${itemName} value`, value: 'update' as CRUD });
    }
    if (fullOptions.canDelete) {
      opts.push({ title: `${clr.delete(symbols.CROSS)} Remove ${itemName}`, value: 'delete' as CRUD });
    }
    if (fullOptions.canDeleteAll) {
      opts.push({ title: `${clr.deleteAll(symbols.TIMES)} Remove all`, value: 'delete-all' as CRUD });
    }
  }

  return await ask.select(question, opts, 'none');
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
const validate = async <T = string, I = string>(
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

const imitateHighlight = chalk.cyanBright.bold.underline;
const getImitateResultText = (result: any, isChild: boolean = false): string => {
  if (result instanceof Array) {
    if (result.length > 3) return `${result.length} selected`;
    return result.map((item) => getImitateResultText(item, true)).join(', ');
  }

  if (typeof result === 'object') {
    const usableProps = ['name', 'title', 'display', 'value'];
    for (let prop in usableProps) {
      if (result[prop]) return result[prop];
    }
  }

  if (typeof result === 'boolean') {
    if (isChild) return result + '';
    return result ? `${imitateHighlight('yes')} / no` : `yes / ${imitateHighlight('no')}`;
  }

  if (typeof result === 'number') {
    return result + '';
  }

  if (typeof result === 'string') {
    return result;
  }

  return 'done';
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
const imitate = (done: boolean, question: string | Breadcrumb, result?: any): number => {
  const message = typeof question === 'string' ? question : question.get();
  const resultText = getImitateResultText(result);
  const prefix = done ? chalk.green('✔') : chalk.cyan('?');
  const questionText = chalk.whiteBright.bold(message);
  const joiner = resultText ? chalk.gray(done ? '… ' : '› ') : '';

  const mainLength = stringWidth(`${prefix} ${questionText} ${joiner}`);
  const maxLength = out.utils.getTerminalWidth() - mainLength - 1;

  let resultWrapper = hasColor(resultText) ? fn.noact : done ? chalk.white : chalk.gray;

  const resultOut = resultText ? truncate(`${resultWrapper(resultText)}`, maxLength) : '';

  console.log(`${prefix} ${questionText} ${joiner}${resultOut}`);
  return 1;
};

/**
 * ask.prefill
 *
 * Auto-fills an ask prompt with the provided value, if defined.
 *
 * Continues to display the 'prompt', but already 'submitted'
 *
 * Good for keeping skipping parts of forms, but providing context and keeping display consistent
 *
 * ```typescript
 * let data = {};
 * const name1 = ask.prefill(data.name, 'What is your name?', ask.text); // User input
 *
 * data = {name: 'Jack'}
 * const name2 = ask.prefill(data.name, 'What is your name?', ask.text); // Jack
 * ```
 */
const prefill = async <T extends unknown = string>(
  value: T | undefined,
  question: string | Breadcrumb,
  askFn: (question: string | Breadcrumb) => Promise<T> | T
): Promise<T> => {
  if (value !== undefined) {
    ask.imitate(true, question, value);
    return value;
  }
  return askFn(question);
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
const loading = (question: string | Breadcrumb) => loadingOut((s) => imitate(false, question, `[${s}]`));

/**
 * ask.pause
 *
 * Pause the program until the user presses enter
 *
 * ```typescript
 * await ask.pause();
 * ```
 */
const pause = async (text: string | Breadcrumb = 'Press enter to continue...'): Promise<void> => {
  const message = typeof text === 'string' ? text : text.get();
  console.log(chalk.gray(message));
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

// TODO docs
const wizard = <T extends unknown>(startObj: Partial<T> = {}) => {
  let obj: Partial<T> = { ...startObj };
  const history: Partial<T>[] = [];
  history.push(obj);

  return {
    add(partial: Partial<T>) {
      obj = {
        ...obj,
        ...partial
      };
      history.push(obj);
    },
    getPartial(): Partial<T> {
      return obj;
    },
    get(): T {
      return obj as T;
    }
  };
};

type TitleFn<T> = (item: T, index: number, arr: T[]) => string;
/**
 * ask.utils.itemsToPromptObjects
 *
 * Take an array of items and convert them to an array of prompt objects
 */
const itemsToPromptObjects = <T = string>(items: T[], titles: string[] = [], titleFn?: TitleFn<T>): { title: string; value: T }[] => {
  return items.map((item, index, arr) => ({ title: (titleFn && titleFn(item, index, arr)) || titles[index] || item + '', value: item as T }));
};

export const ask = {
  text,
  autotext,
  number,
  boolean,
  booleanAlt,
  select,
  multiselect,
  crud,
  validate,
  imitate,
  prefill,
  loading,
  pause,
  countdown,
  rename,
  fileExplorer,
  multiFileExplorer,
  wizard,
  section,
  separator,
  trim: askTrim,
  table: {
    select: askTableSelect,
    multiselect: askTableMultiselect
  },
  utils: {
    itemsToPromptObjects,
    displayPath
  }
};
