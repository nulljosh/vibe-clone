import { generateCSS, generateTailwind, generateJSON } from '../lib/formatter';
import { AnalyzedStyles } from '../lib/analyzer';

describe('Formatter', () => {
  const mockAnalyzed: AnalyzedStyles = {
    palette: {
      primary: '#0071e3',
      secondary: '#5e5ce6',
      accent: ['#ff3b30', '#ff9500'],
      neutral: ['#1d1d1f', '#86868b'],
      clusters: [
        {
          name: 'blue-60',
          representative: '#0071e3',
          colors: ['#0071e3'],
          lightness: 60,
          saturation: 100,
          hue: 210
        }
      ],
      all: ['#0071e3', '#5e5ce6', '#ff3b30', '#ff9500', '#1d1d1f']
    },
    typography: {
      primary: '-apple-system',
      secondary: 'sans-serif',
      scale: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 32
      },
      weights: ['400', '500', '600', '700']
    },
    spacing: {
      base: 8,
      scale: [0, 4, 8, 16, 24, 32, 48, 64, 96, 128],
      common: [8, 16, 24]
    },
    effects: {
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        all: []
      },
      borderRadius: {
        default: '4px',
        all: ['4px', '8px']
      },
      borders: {
        default: '1px solid rgba(0, 0, 0, 0.1)',
        all: []
      }
    },
    darkModeDetected: false
  };

  describe('generateCSS', () => {
    it('should generate valid CSS', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain(':root {');
      expect(css).toContain('}');
      expect(css.startsWith(':')).toBe(true);
    });

    it('should include color variables', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('--color-primary: #0071e3');
      expect(css).toContain('--color-secondary: #5e5ce6');
    });

    it('should include typography variables', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('--font-primary: -apple-system');
      expect(css).toContain('--text-base: 16px');
    });

    it('should include spacing variables', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('--space-0: 0px');
      expect(css).toContain('--space-1:');
    });

    it('should include effect variables', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('--shadow-sm:');
      expect(css).toContain('--radius: 4px');
    });

    it('should include dark mode detection comment', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('Dark Mode Detected: false');
    });

    it('should include color clusters', () => {
      const css = generateCSS(mockAnalyzed);
      expect(css).toContain('--color-blue-60:');
    });
  });

  describe('generateTailwind', () => {
    it('should generate valid JavaScript module', () => {
      const tw = generateTailwind(mockAnalyzed);
      expect(tw).toContain('module.exports');
      expect(tw).toContain('theme');
      expect(tw).toContain('extend');
    });

    it('should include color configuration', () => {
      const tw = generateTailwind(mockAnalyzed);
      expect(tw).toContain('primary');
      expect(tw).toContain('#0071e3');
    });

    it('should include font configuration', () => {
      const tw = generateTailwind(mockAnalyzed);
      expect(tw).toContain('fontFamily');
      expect(tw).toContain('-apple-system');
    });

    it('should include spacing configuration', () => {
      const tw = generateTailwind(mockAnalyzed);
      expect(tw).toContain('spacing');
      expect(tw).toContain('px');
    });

    it('should be valid JSON syntax', () => {
      const tw = generateTailwind(mockAnalyzed);
      // Extract the object part
      const objStr = tw.replace('module.exports = ', '');
      expect(() => JSON.parse(objStr)).not.toThrow();
    });
  });

  describe('generateJSON', () => {
    it('should generate valid JSON', () => {
      const json = generateJSON(mockAnalyzed);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include all analyzed data', () => {
      const json = generateJSON(mockAnalyzed);
      const parsed = JSON.parse(json);
      expect(parsed.palette).toBeDefined();
      expect(parsed.typography).toBeDefined();
      expect(parsed.spacing).toBeDefined();
      expect(parsed.effects).toBeDefined();
    });

    it('should preserve color values', () => {
      const json = generateJSON(mockAnalyzed);
      const parsed = JSON.parse(json);
      expect(parsed.palette.primary).toBe('#0071e3');
    });
  });

  describe('Output consistency', () => {
    it('should use same primary color across formats', () => {
      const css = generateCSS(mockAnalyzed);
      const tw = generateTailwind(mockAnalyzed);
      const json = generateJSON(mockAnalyzed);

      expect(css).toContain('#0071e3');
      expect(tw).toContain('#0071e3');
      expect(json).toContain('#0071e3');
    });
  });
});
