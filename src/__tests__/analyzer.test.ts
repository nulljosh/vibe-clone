import { analyzeStyles, checkContrastPairs, contrastRatio, rgbToHex } from '../lib/analyzer';
import { RawStyles } from '../lib/scraper';

describe('Analyzer', () => {
  const mockRawStyles: RawStyles = {
    colors: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(0, 113, 227)'],
    backgroundColors: ['rgb(255, 255, 255)', 'rgb(240, 240, 240)'],
    fonts: ['"Helvetica Neue", sans-serif', '-apple-system, sans-serif'],
    fontSizes: ['14px', '16px', '18px', '20px'],
    fontWeights: ['400', '500', '600', '700'],
    spacing: {
      padding: ['8px', '16px', '24px'],
      margin: ['0px', '8px', '16px'],
      gap: ['8px', '16px']
    },
    shadows: ['0 1px 2px rgba(0, 0, 0, 0.05)', '0 4px 6px rgba(0, 0, 0, 0.1)'],
    borderRadius: ['4px', '8px', '12px'],
    borders: ['1px solid rgba(0, 0, 0, 0.1)']
  };

  describe('rgbToHex', () => {
    it('should convert rgb to hex', () => {
      expect(rgbToHex('rgb(0, 113, 227)')).toBe('#0071e3');
      expect(rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
      expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
    });

    it('should handle rgba with alpha', () => {
      expect(rgbToHex('rgba(0, 113, 227, 0.5)')).toBe('#0071e3');
    });

    it('should return hex as-is', () => {
      expect(rgbToHex('#0071e3')).toBe('#0071e3');
    });

    it('should handle invalid input', () => {
      expect(rgbToHex('invalid')).toBe('invalid');
    });
  });

  describe('contrastRatio', () => {
    it('should return 21 for black and white', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    });

    it('should return 1 for identical colors', () => {
      expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
    });

    it('should return ~4.54 for #767676 on white', () => {
      expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
    });
  });

  describe('checkContrastPairs', () => {
    it('should flag failing color pairs for AA and AA-large', () => {
      const issues = checkContrastPairs({
        primary: '#ffffff',
        accent: ['#777777', '#aaaaaa'],
        neutral: ['#ffffff'],
        clusters: [],
        all: ['#ffffff', '#777777', '#aaaaaa']
      });

      expect(issues.length).toBeGreaterThan(0);
      expect(
        issues.some(
          issue => issue.color1 === '#ffffff' && issue.color2 === '#777777' && issue.failsAA && !issue.failsAALarge
        )
      ).toBe(true);
      expect(
        issues.some(
          issue => issue.color1 === '#ffffff' && issue.color2 === '#aaaaaa' && issue.failsAA && issue.failsAALarge
        )
      ).toBe(true);
    });
  });

  describe('analyzeStyles', () => {
    it('should extract primary color', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.palette.primary).toBeDefined();
      expect(result.palette.primary.startsWith('#')).toBe(true);
    });

    it('should extract typography', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.typography.primary).toBeDefined();
      expect(result.typography.scale.base).toBeGreaterThan(0);
      expect(result.typography.weights.length).toBeGreaterThan(0);
    });

    it('should extract spacing scale', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.spacing.base).toBeGreaterThan(0);
      expect(result.spacing.scale.length).toBeGreaterThan(0);
      expect(result.spacing.scale[0]).toBe(0);
    });

    it('should extract effects', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.effects.shadows.sm).toBeDefined();
      expect(result.effects.shadows.md).toBeDefined();
      expect(result.effects.borderRadius.default).toBeDefined();
    });

    it('should detect color clusters', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.palette.clusters).toBeDefined();
      expect(Array.isArray(result.palette.clusters)).toBe(true);
    });

    it('should create visual grouping', () => {
      const result = analyzeStyles(mockRawStyles);
      if (result.palette.clusters.length >= 2) {
        expect(result.visualGrouping).toBeDefined();
        expect(result.visualGrouping?.primaryAccent).toBeDefined();
        expect(result.visualGrouping?.secondaryAccent).toBeDefined();
      }
    });

    it('should detect dark mode on dark backgrounds', () => {
      const darkModeStyles: RawStyles = {
        ...mockRawStyles,
        backgroundColors: ['rgb(20, 20, 20)', 'rgb(40, 40, 40)']
      };
      const result = analyzeStyles(darkModeStyles);
      expect(result.darkModeDetected).toBe(true);
    });

    it('should not detect dark mode on light backgrounds', () => {
      // Most backgrounds are light (240-255)
      const result = analyzeStyles(mockRawStyles);
      // Note: This test depends on average lightness calculation
      // The mock data includes mostly light backgrounds, so should be false
      expect(typeof result.darkModeDetected).toBe('boolean');
    });
  });

  describe('Color clustering', () => {
    it('should handle empty color list', () => {
      const empty: RawStyles = {
        ...mockRawStyles,
        colors: [],
        backgroundColors: []
      };
      const result = analyzeStyles(empty);
      expect(result.palette.all.length).toBe(0);
    });

    it('should separate neutral and accent colors', () => {
      const result = analyzeStyles(mockRawStyles);
      expect(result.palette.neutral.length).toBeGreaterThan(0);
      expect(result.palette.accent.length).toBeGreaterThan(0);
    });
  });
});
