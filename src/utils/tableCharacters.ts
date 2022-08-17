import { ArrayUtils } from 'swiss-ak';
import { TableOptions } from '../tools/printTable';

interface CharRowLookup {
  norm: string;
  strt: string;
  sepr: string;
  endc: string;
}

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

export const getTableCharacters = (opts: TableOptions): CharLookup<CharRowLookup> => {
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

    const copyVertsFrom = ['hNor', 'hNor', 'hNor', 'hNor', 'hNor', 'bNor', 'bNor', 'bNor', 'bNor'];

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

  console.log(mapped);

  const result = {
    hTop: {} as CharRowLookup,
    hNor: {} as CharRowLookup,
    hSep: {} as CharRowLookup,
    hBot: {} as CharRowLookup,
    mSep: {} as CharRowLookup,
    bTop: {} as CharRowLookup,
    bNor: {} as CharRowLookup,
    bSep: {} as CharRowLookup,
    bBot: {} as CharRowLookup
  };

  for (const colType of Object.keys(mapped)) {
    const [norm, strt, sepr, endc] = mapped[colType];
    result[colType] = { norm, strt, sepr, endc } as CharRowLookup;
  }

  return result;
};
