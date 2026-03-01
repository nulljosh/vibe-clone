import { extractFromScreenshot, detectComponents, detectImageDarkMode } from '../lib/screenshot';

describe('Screenshot utilities (Roadmap)', () => {
  describe('extractFromScreenshot', () => {
    it('should throw not implemented error', async () => {
      await expect(
        extractFromScreenshot({ imagePath: 'test.png' })
      ).rejects.toThrow('Screenshot mode not yet implemented');
    });

    it('should document roadmap feature', async () => {
      try {
        await extractFromScreenshot({ imagePath: 'test.png' });
      } catch (e) {
        expect(String(e)).toContain('v2.1.0');
      }
    });
  });

  describe('detectComponents', () => {
    it('should throw not implemented error', async () => {
      await expect(detectComponents('test.png')).rejects.toThrow(
        'Component detection not yet implemented'
      );
    });
  });

  describe('detectImageDarkMode', () => {
    it('should throw not implemented error', async () => {
      await expect(detectImageDarkMode('test.png')).rejects.toThrow(
        'Image dark mode detection not yet implemented'
      );
    });
  });
});
