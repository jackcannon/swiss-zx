import * as swisszx from '../src/index';

describe('os', () => {
  describe('closeFinder', () => {
    it(`exists as 'closeFinder'`, () => {
      expect(swisszx.closeFinder).toBeDefined();
    });
    it(`exists as 'os.closeFinder'`, () => {
      expect(swisszx.os.closeFinder).toBeDefined();
    });
  });
});
