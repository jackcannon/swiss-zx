import { symbols } from 'swiss-ak';
import { chlk, clr, Colour } from '../clr';
import { hasColor, out, truncate } from '../out';

const seperatorChar = ` ${chlk.gray2(symbols.CHEV_RGT)} `;

/**
 * Breadcrumb
 *
 * Provides a consistent format and style for questions/prompts
 *
 * ```typescript
 * const bread = getBreadcrumb();
 * bread() // ''
 * bread('a') // 'a'
 * bread('a', 'b') // 'a › b'
 * bread('a', 'b', 'c') // 'a › b › c'
 *
 * const sub = bread.sub('a', 'b');
 * sub(); // 'a › b'
 * sub('c') // 'a › b › c'
 * sub('c', 'd') // 'a › b › c › d'
 *
 * const subsub = sub.sub('c', 'd');
 * subsub(); // 'a › b › c › d'
 * subsub('e'); // 'a › b › c › d › e'
 * ```
 */
export type Breadcrumb = {
  (...tempNames: string[]): Breadcrumb;
  setColours: (colours: Colour[]) => void;
  add: (...names: string[]) => number;
  getNames: (...tempNames: string[]) => any[];
  sub: (...tempNames: string[]) => Breadcrumb;
  get(...tempNames: string[]): string;
  toString(): string;
};

/**
 * getBreadcrumb
 *
 * Returns an empty breadcrumb object
 */
export const getBreadcrumb = (...baseNames: string[]): Breadcrumb => {
  let current = [];
  let colours: Colour[] = ['t1', 't2', 't3', 't4', 't5', 't6'];

  const setColours = (newColours: Colour[]) => {
    colours = newColours;
  };

  const add = (...names: string[]) => current.push(...names);

  const getColouredName = (name: string, index: number, arr: string[]) =>
    hasColor(name) || index === arr.length - 1 ? name : clr[colours[index % colours.length]](name);
  const getColouredNames = (...tempNames: string[]) => getNames(...tempNames).map(getColouredName);

  const getNames = (...tempNames: string[]) => [...baseNames, ...current, ...tempNames];

  const sub = (...tempNames: string[]) => getBreadcrumb(...getNames(...tempNames));

  const otherChars = '? ' + ' > ';
  const spaceForInput = 25;

  const get = (...tempNames: string[]) =>
    chalk.bold(
      truncate(
        getColouredNames(...tempNames)
          .join(seperatorChar)
          .trim(),
        out.utils.getTerminalWidth() - (otherChars.length - spaceForInput)
      )
    );

  const result: Breadcrumb = (...tempNames: string[]) => sub(...tempNames);

  result.setColours = setColours;
  result.add = add;
  result.getNames = getNames;
  result.sub = sub;
  result.get = get;
  result.toString = get;

  return result;
};
