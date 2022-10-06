import { ArrayUtils } from 'swiss-ak';
import { FullTableOptions } from '../tools/table';

interface CharLookup<T> {
  hTop: T;
  hNor: T;
  hSep: T;
  hBot: T;
  mSep: T;
  bTop: T;
  bNor: T;
  bSep: T;
  bBot: T;
}

const tableCharactersBasic = (): CharLookup<string[]> => ({
  hTop: ['━', '┏', '┳', '┓'],
  hNor: [' ', '┃', '┃', '┃'],
  hSep: ['━', '┣', '╋', '┫'],
  hBot: ['━', '┗', '┻', '┛'],

  mSep: ['━', '┡', '╇', '┩'],

  bTop: ['─', '┌', '┬', '┐'],
  bNor: [' ', '│', '│', '│'],
  bSep: ['─', '├', '┼', '┤'],
  bBot: ['─', '└', '┴', '┘']
});

const ovAllCharact = (orig: string[], char: string) => ArrayUtils.repeat(4, char);
const ovSeperators = (orig: string[], char: string) => [orig[0], char, char, char];
const ovOuterChars = (orig: string[], char: string) => [orig[0], char, orig[2], char];

export const getTableCharacters = (opts: FullTableOptions): CharLookup<string[]> => {
  let mapped = tableCharactersBasic();

  const normalRows = ['hNor', 'bNor'];
  const outerRows = ['hTop', 'hBot', 'bTop', 'bBot'];

  const rowTypes = Object.keys(mapped);

  if (opts.overrideChar) {
    for (const rowType of rowTypes) {
      if (normalRows.includes(rowType)) {
        mapped[rowType] = ovSeperators(mapped[rowType], opts.overrideChar);
      } else {
        mapped[rowType] = ovAllCharact(mapped[rowType], opts.overrideChar);
      }
    }
  }
  if (opts.overrideVerChar || !opts.drawColLines) {
    const ovrd = opts.overrideVerChar || ' ';
    for (const rowType of rowTypes) {
      if (normalRows.includes(rowType)) {
        mapped[rowType] = ovSeperators(mapped[rowType], ovrd);
      } else {
        mapped[rowType] = ovAllCharact(mapped[rowType], mapped[rowType][0]);
      }
    }
  }
  if (opts.overrideHorChar || !opts.drawRowLines) {
    const ovrd = opts.overrideHorChar;

    const copyVertsFrom = ['hNor', 'hNor', 'hNor', 'hNor', 'mSep', 'bNor', 'bNor', 'bNor', 'bNor'];

    for (const rowIndex in rowTypes) {
      const rowType = rowTypes[rowIndex];
      if (normalRows.includes(rowType)) {
      } else {
        if (opts.overrideHorChar) {
          mapped[rowType] = ovAllCharact(mapped[rowType], ovrd);
        } else {
          mapped[rowType] = [...mapped[copyVertsFrom[rowIndex]]];
        }
      }
    }
  }
  if (!opts.drawOuter) {
    for (const rowType of rowTypes) {
      if (outerRows.includes(rowType)) {
        mapped[rowType] = ovAllCharact(mapped[rowType], ' ');
      } else {
        mapped[rowType] = ovOuterChars(mapped[rowType], ' ');
      }
    }
  }

  return mapped;
};
