import { extractStyles } from '../lib/scraper';

describe('Scraper', () => {
  describe('extractStyles', () => {
    it('should extract styles from a mocked page', async () => {
      // Mock page object
      const mockPage = {
        evaluate: jest.fn().mockResolvedValue({
          colors: ['rgb(0, 0, 0)'],
          backgroundColors: ['rgb(255, 255, 255)'],
          fonts: ['-apple-system'],
          fontSizes: ['16px'],
          fontWeights: ['400'],
          spacing: {
            padding: ['8px'],
            margin: ['0px'],
            gap: ['8px']
          },
          shadows: ['0 1px 2px rgba(0, 0, 0, 0.05)'],
          borderRadius: ['4px'],
          borders: ['1px solid rgba(0, 0, 0, 0.1)']
        })
      };

      const result = await extractStyles(mockPage as any);

      expect(result.colors).toBeDefined();
      expect(Array.isArray(result.colors)).toBe(true);
      expect(result.backgroundColors).toBeDefined();
      expect(result.fonts).toBeDefined();
      expect(result.spacing).toBeDefined();
      expect(result.colors[0]).toBe('rgb(0, 0, 0)');
    });

    it('should handle extraction of colors', async () => {
      const mockPage = {
        evaluate: jest.fn().mockResolvedValue({
          colors: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)'],
          backgroundColors: [],
          fonts: [],
          fontSizes: [],
          fontWeights: [],
          spacing: { padding: [], margin: [], gap: [] },
          shadows: [],
          borderRadius: [],
          borders: []
        })
      };

      const result = await extractStyles(mockPage as any);
      expect(result.colors.length).toBe(2);
    });

    it('should handle empty extraction', async () => {
      const mockPage = {
        evaluate: jest.fn().mockResolvedValue({
          colors: [],
          backgroundColors: [],
          fonts: [],
          fontSizes: [],
          fontWeights: [],
          spacing: { padding: [], margin: [], gap: [] },
          shadows: [],
          borderRadius: [],
          borders: []
        })
      };

      const result = await extractStyles(mockPage as any);
      expect(result.colors).toEqual([]);
      expect(result.fonts).toEqual([]);
    });
  });
});
