import * as swisszx from '../src/index';

describe('ffmpeg', () => {
  describe('ffmpeg', () => {
    it(`exists as 'ffmpeg'`, () => {
      expect(swisszx.ffmpeg).toBeDefined();
    });
    it(`exists as 'ffmpegTools.ffmpeg'`, () => {
      expect(swisszx.ffmpegTools.ffmpeg).toBeDefined();
    });
  });

  describe('toFFmpegTimeFormat', () => {
    it(`exists as 'ffmpegTools.toFFmpegTimeFormat'`, () => {
      expect(swisszx.ffmpegTools.toFFmpegTimeFormat).toBeDefined();
    });
  });

  describe('getProbeValue', () => {
    it(`exists as 'ffmpegTools.getProbeValue'`, () => {
      expect(swisszx.ffmpegTools.getProbeValue).toBeDefined();
    });
  });

  describe('getProbe', () => {
    it(`exists as 'ffmpegTools.getProbe'`, () => {
      expect(swisszx.ffmpegTools.getProbe).toBeDefined();
    });
  });

  describe('getTotalFrames', () => {
    it(`exists as 'ffmpegTools.getTotalFrames'`, () => {
      expect(swisszx.ffmpegTools.getTotalFrames).toBeDefined();
    });
  });
});
