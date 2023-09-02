import * as swisszx from '../src/index';

describe('gm', () => {
  describe('PIPE', () => {
    it(`exists as 'gm.PIPE'`, () => {
      expect(swisszx.gm.PIPE).toBeDefined();
    });
  });

  describe('convert', () => {
    it(`exists as 'gm.convert'`, () => {
      expect(swisszx.gm.convert).toBeDefined();
    });
  });

  describe('composite', () => {
    it(`exists as 'gm.composite'`, () => {
      expect(swisszx.gm.composite).toBeDefined();
    });
  });

  describe('pipe', () => {
    it(`exists as 'gm.pipe'`, () => {
      expect(swisszx.gm.pipe).toBeDefined();
    });
  });

  describe('utils', () => {
    it(`exists as 'gm.utils'`, () => {
      expect(swisszx.gm.utils).toBeDefined();
    });

    describe('supportedFlags', () => {
      it(`exists as 'gm.utils.supportedFlags'`, () => {
        expect(swisszx.gm.utils.supportedFlags).toBeDefined();
      });
    });

    describe('flagsObjToArray', () => {
      it(`exists as 'gm.utils.flagsObjToArray'`, () => {
        expect(swisszx.gm.utils.flagsObjToArray).toBeDefined();
      });
    });
  });
});
