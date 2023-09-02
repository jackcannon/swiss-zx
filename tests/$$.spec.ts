import * as swisszx from '../src/index';

describe('$$', () => {
  describe('cd', () => {
    it(`exists as '$$.cd'`, () => {
      expect(swisszx.$$.cd).toBeDefined();
    });
  });

  describe('pwd', () => {
    it(`exists as '$$.pwd'`, () => {
      expect(swisszx.$$.pwd).toBeDefined();
    });
  });

  describe('ls', () => {
    it(`exists as '$$.ls'`, () => {
      expect(swisszx.$$.ls).toBeDefined();
    });
  });

  describe('find', () => {
    it(`exists as '$$.find'`, () => {
      expect(swisszx.$$.find).toBeDefined();
    });
  });

  describe('findDirs', () => {
    it(`exists as '$$.findDirs'`, () => {
      expect(swisszx.$$.findDirs).toBeDefined();
    });
  });

  describe('findFiles', () => {
    it(`exists as '$$.findFiles'`, () => {
      expect(swisszx.$$.findFiles).toBeDefined();
    });
  });

  describe('findModified', () => {
    it(`exists as '$$.findModified'`, () => {
      expect(swisszx.$$.findModified).toBeDefined();
    });
  });

  describe('lastModified', () => {
    it(`exists as '$$.lastModified'`, () => {
      expect(swisszx.$$.lastModified).toBeDefined();
    });
  });

  describe('rm', () => {
    it(`exists as '$$.rm'`, () => {
      expect(swisszx.$$.rm).toBeDefined();
    });
  });

  describe('mkdir', () => {
    it(`exists as '$$.mkdir'`, () => {
      expect(swisszx.$$.mkdir).toBeDefined();
    });
  });

  describe('cp', () => {
    it(`exists as '$$.cp'`, () => {
      expect(swisszx.$$.cp).toBeDefined();
    });
  });

  describe('mv', () => {
    it(`exists as '$$.mv'`, () => {
      expect(swisszx.$$.mv).toBeDefined();
    });
  });

  describe('touch', () => {
    it(`exists as '$$.touch'`, () => {
      expect(swisszx.$$.touch).toBeDefined();
    });
  });

  describe('cat', () => {
    it(`exists as '$$.cat'`, () => {
      expect(swisszx.$$.cat).toBeDefined();
    });
  });

  describe('grep', () => {
    it(`exists as '$$.grep'`, () => {
      expect(swisszx.$$.grep).toBeDefined();
    });
  });

  describe('isFileExist', () => {
    it(`exists as '$$.isFileExist'`, () => {
      expect(swisszx.$$.isFileExist).toBeDefined();
    });
  });

  describe('isDirExist', () => {
    it(`exists as '$$.isDirExist'`, () => {
      expect(swisszx.$$.isDirExist).toBeDefined();
    });
  });

  describe('readFile', () => {
    it(`exists as '$$.readFile'`, () => {
      expect(swisszx.$$.readFile).toBeDefined();
    });
  });

  describe('writeFile', () => {
    it(`exists as '$$.writeFile'`, () => {
      expect(swisszx.$$.writeFile).toBeDefined();
    });
  });

  describe('readJSON', () => {
    it(`exists as '$$.readJSON'`, () => {
      expect(swisszx.$$.readJSON).toBeDefined();
    });
  });

  describe('writeJSON', () => {
    it(`exists as '$$.writeJSON'`, () => {
      expect(swisszx.$$.writeJSON).toBeDefined();
    });
  });

  describe('pipe', () => {
    it(`exists as '$$.pipe'`, () => {
      expect(swisszx.$$.pipe).toBeDefined();
    });
  });

  describe('rsync', () => {
    it(`exists as '$$.rsync'`, () => {
      expect(swisszx.$$.rsync).toBeDefined();
    });
  });

  describe('sync', () => {
    it(`exists as '$$.sync'`, () => {
      expect(swisszx.$$.sync).toBeDefined();
    });
  });

  describe('exiftool', () => {
    it(`exists as '$$.exiftool'`, () => {
      expect(swisszx.$$.exiftool).toBeDefined();
    });
  });

  describe('utils', () => {
    it(`exists as '$$.utils'`, () => {
      expect(swisszx.$$.utils).toBeDefined();
    });

    describe('intoLines', () => {
      it(`exists as '$$.utils.intoLines'`, () => {
        expect(swisszx.$$.utils.intoLines).toBeDefined();
      });
    });
  });
});
