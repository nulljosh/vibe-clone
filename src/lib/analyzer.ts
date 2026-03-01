/**
 * Style analysis engine with intelligent color clustering
 * Groups colors by hue + lightness for semantic meaning
 */

import tinycolor from 'tinycolor2';
import { RawStyles } from './scraper';

export interface ColorCluster {
  name: string;           // 'blue-60', 'red-45', etc.
  representative: string; // Most saturated color in cluster
  colors: string[];       // All colors in this cluster
  lightness: number;      // Average lightness 0-100
  saturation: number;     // Average saturation 0-100
  hue: number;            // Average hue 0-360
}

export interface ColorPalette {
  primary: string;
  secondary?: string;
  accent: string[];
  neutral: string[];
  clusters: ColorCluster[];
  all: string[];
}

export interface TypographyScale {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface Typography {
  primary: string;
  secondary?: string;
  scale: TypographyScale;
  weights: string[];
}

export interface SpacingScale {
  base: number;
  scale: number[];
  common: number[];
}

export interface Effects {
  shadows: {
    sm: string;
    md: string;
    lg: string;
    all: string[];
  };
  borderRadius: {
    default: string;
    all: string[];
  };
  borders: {
    default: string;
    all: string[];
  };
}

export interface AnalyzedStyles {
  palette: ColorPalette;
  typography: Typography;
  spacing: SpacingScale;
  effects: Effects;
  darkModeDetected?: boolean;
  visualGrouping?: {
    primaryAccent: string;
    secondaryAccent: string;
    neutralBase: string;
  };
}

// RGB/rgba to hex
function rgbToHex(rgb: string): string {
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return rgb;
  const [, r, g, b] = match;
  return '#' + [r, g, b].map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Check if color is grayscale (neutral)
function isNeutralColor(color: string): boolean {
  const hex = rgbToHex(color);
  if (!hex.startsWith('#')) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  return diff < 10;  // Tolerance for grayscale detection
}

// Sort by frequency (most common first)
function sortByFrequency(arr: string[]): string[] {
  const freq: Record<string, number> = {};
  arr.forEach(item => (freq[item] = (freq[item] || 0) + 1));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item);
}

/**
 * Cluster colors by hue (30° buckets) + lightness (20% buckets)
 * Creates semantic groupings: blue-60, red-45, neutral-90
 */
function clusterColors(colors: string[]): ColorCluster[] {
  const clusters: Map<string, { colors: string[]; metrics: any[] }> = new Map();

  colors.forEach(color => {
    const tc = tinycolor(color);
    if (!tc.isValid()) return;

    const hsl = tc.toHsl();
    const hueGroup = Math.round(hsl.h / 30) * 30;      // 30° buckets
    const lightnessGroup = Math.round(hsl.l / 20) * 20; // 20% buckets
    const key = `${hueGroup}-${lightnessGroup}`;

    if (!clusters.has(key)) {
      clusters.set(key, { colors: [], metrics: [] });
    }

    clusters.get(key)!.colors.push(color);
    clusters.get(key)!.metrics.push({
      hue: hsl.h,
      saturation: hsl.s,
      lightness: hsl.l
    });
  });

  // Convert to sorted array
  return Array.from(clusters.values())
    .map((cluster) => {
      const avgMetrics = cluster.metrics.reduce(
        (acc, m) => ({
          hue: acc.hue + m.hue,
          saturation: acc.saturation + m.saturation,
          lightness: acc.lightness + m.lightness
        }),
        { hue: 0, saturation: 0, lightness: 0 }
      );

      avgMetrics.hue /= cluster.metrics.length;
      avgMetrics.saturation /= cluster.metrics.length;
      avgMetrics.lightness /= cluster.metrics.length;

      // Pick most saturated as representative
      const representative = cluster.colors.reduce((best, color) => {
        const tc = tinycolor(color);
        const bestTc = tinycolor(best);
        return tc.toHsl().s > bestTc.toHsl().s ? color : best;
      });

      const hueNames: Record<number, string> = {
        0: 'red', 30: 'orange', 60: 'yellow', 90: 'lime', 120: 'green',
        150: 'cyan', 180: 'cyan', 210: 'blue', 240: 'blue', 270: 'purple',
        300: 'magenta', 330: 'rose'
      };

      const closestHue = Math.round(avgMetrics.hue / 30) * 30;
      const hueName = hueNames[closestHue] || 'neutral';
      const name = `${hueName}-${Math.round(avgMetrics.lightness)}`;

      return {
        name,
        representative,
        colors: sortByFrequency(cluster.colors),
        lightness: avgMetrics.lightness,
        saturation: avgMetrics.saturation,
        hue: avgMetrics.hue
      };
    })
    .sort((a, b) => b.saturation - a.saturation); // Vibrant first
}

function extractColorPalette(colors: string[], backgroundColors: string[]): ColorPalette {
  const allColors = [...new Set([...colors, ...backgroundColors])];
  const hexColors = allColors.map(rgbToHex).filter(c => c.startsWith('#'));

  const neutral = hexColors.filter(isNeutralColor);
  const accent = hexColors.filter(c => !isNeutralColor(c));
  const clusters = clusterColors(accent);

  return {
    primary: sortByFrequency(accent)[0] || '#0071e3',
    secondary: sortByFrequency(accent)[1],
    accent: sortByFrequency(accent).slice(0, 5),
    neutral: sortByFrequency(neutral).slice(0, 5),
    clusters,
    all: sortByFrequency(hexColors).slice(0, 20)
  };
}

function detectDarkMode(colors: string[], backgroundColors: string[]): boolean {
  // If average background lightness < 50%, it's dark mode
  const bgHex = backgroundColors.map(rgbToHex).filter(c => c.startsWith('#'));
  if (bgHex.length === 0) return false;
  const avgLightness = bgHex
    .map(c => tinycolor(c).toHsl().l)
    .reduce((a, b) => a + b, 0) / bgHex.length;
  return avgLightness < 50;
}

function extractTypography(fonts: string[], fontSizes: string[], fontWeights: string[]): Typography {
  const cleanFonts = fonts.map(f => f.split(',')[0].replace(/['"]/g, '').trim());
  const primaryFont = sortByFrequency(cleanFonts)[0] || '-apple-system';
  const secondaryFont = sortByFrequency(cleanFonts)[1];

  const sizes = fontSizes
    .map(s => parseFloat(s))
    .filter(s => !isNaN(s) && s > 0)
    .sort((a, b) => a - b);

  const uniqueSizes = [...new Set(sizes)];
  const baseSize = sizes[Math.floor(sizes.length / 2)] || 16;

  const scale: TypographyScale = {
    xs: uniqueSizes.find(s => s < baseSize * 0.75) || baseSize * 0.75,
    sm: uniqueSizes.find(s => s >= baseSize * 0.75 && s < baseSize * 0.875) || baseSize * 0.875,
    base: baseSize,
    lg: uniqueSizes.find(s => s > baseSize && s <= baseSize * 1.125) || baseSize * 1.125,
    xl: uniqueSizes.find(s => s > baseSize * 1.125 && s <= baseSize * 1.25) || baseSize * 1.25,
    '2xl': uniqueSizes.find(s => s > baseSize * 1.25 && s <= baseSize * 1.5) || baseSize * 1.5,
    '3xl': uniqueSizes.find(s => s > baseSize * 1.5) || baseSize * 1.875
  };

  return {
    primary: primaryFont,
    secondary: secondaryFont,
    scale,
    weights: sortByFrequency(fontWeights).slice(0, 5)
  };
}

function extractSpacingScale(spacing: RawStyles['spacing']): SpacingScale {
  const allSpacing = [...spacing.padding, ...spacing.margin, ...spacing.gap];
  const values = allSpacing
    .flatMap(s => s.split(' '))
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v > 0)
    .sort((a, b) => a - b);

  const uniqueValues = [...new Set(values)];
  const base = uniqueValues.find(v => v === 8 || v === 4) || 8;
  const scale = [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]
    .map(m => m * (base / 8));

  return {
    base,
    scale,
    common: uniqueValues.slice(0, 10)
  };
}

function extractEffects(shadows: string[], borderRadius: string[], borders: string[]): Effects {
  const shadowsList = sortByFrequency(shadows).slice(0, 5);
  const radiusList = sortByFrequency(borderRadius).slice(0, 5);
  const bordersList = sortByFrequency(borders).slice(0, 5);

  return {
    shadows: {
      sm: shadowsList[0] || '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: shadowsList[1] || '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: shadowsList[2] || '0 10px 15px rgba(0, 0, 0, 0.1)',
      all: shadowsList
    },
    borderRadius: {
      default: radiusList[0] || '4px',
      all: radiusList
    },
    borders: {
      default: bordersList[0] || '1px solid rgba(0, 0, 0, 0.1)',
      all: bordersList
    }
  };
}

/**
 * Main entry point: transform raw styles into design system
 */
export function analyzeStyles(rawStyles: RawStyles): AnalyzedStyles {
  const palette = extractColorPalette(rawStyles.colors, rawStyles.backgroundColors);
  const typography = extractTypography(rawStyles.fonts, rawStyles.fontSizes, rawStyles.fontWeights);
  const spacing = extractSpacingScale(rawStyles.spacing);
  const effects = extractEffects(rawStyles.shadows, rawStyles.borderRadius, rawStyles.borders);
  const darkModeDetected = detectDarkMode(rawStyles.colors, rawStyles.backgroundColors);

  const visualGrouping = palette.clusters.length >= 2
    ? {
        primaryAccent: palette.clusters[0].representative,
        secondaryAccent: palette.clusters[1].representative,
        neutralBase: palette.neutral[0] || '#ffffff'
      }
    : undefined;

  return {
    palette,
    typography,
    spacing,
    effects,
    darkModeDetected,
    visualGrouping
  };
}

export { rgbToHex };
