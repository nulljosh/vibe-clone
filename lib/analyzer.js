/**
 * Style analysis and intelligent extraction
 * Finds most common/important styles and creates a design system
 */

function rgbToHex(rgb) {
  if (rgb.startsWith('#')) return rgb;

  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return rgb;

  const [, r, g, b] = match;
  return '#' + [r, g, b].map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function isNeutralColor(color) {
  const hex = rgbToHex(color);
  if (!hex.startsWith('#')) return false;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Check if grayscale (RGB values are close)
  const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  return diff < 10;
}

function sortByFrequency(arr) {
  const freq = {};
  arr.forEach(item => freq[item] = (freq[item] || 0) + 1);
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item);
}

function extractColorPalette(colors, backgroundColors) {
  const allColors = [...new Set([...colors, ...backgroundColors])];

  // Convert to hex
  const hexColors = allColors.map(rgbToHex).filter(c => c.startsWith('#'));

  // Separate neutral and accent colors
  const neutral = hexColors.filter(isNeutralColor);
  const accent = hexColors.filter(c => !isNeutralColor(c));

  return {
    primary: sortByFrequency(accent)[0] || '#0071e3',
    secondary: sortByFrequency(accent)[1] || '#5e5ce6',
    accent: sortByFrequency(accent).slice(0, 5),
    neutral: sortByFrequency(neutral).slice(0, 5),
    all: sortByFrequency(hexColors).slice(0, 20)
  };
}

function extractTypography(fonts, fontSizes, fontWeights) {
  const cleanFonts = fonts.map(f =>
    f.split(',')[0].replace(/['"]/g, '').trim()
  );

  const primaryFont = sortByFrequency(cleanFonts)[0] || '-apple-system';
  const secondaryFont = sortByFrequency(cleanFonts)[1];

  // Parse font sizes to numbers
  const sizes = fontSizes
    .map(s => parseFloat(s))
    .filter(s => !isNaN(s) && s > 0)
    .sort((a, b) => a - b);

  const uniqueSizes = [...new Set(sizes)];

  // Create type scale
  const baseSize = sizes[Math.floor(sizes.length / 2)] || 16;
  const scale = {
    xs: uniqueSizes.find(s => s < baseSize * 0.75) || baseSize * 0.75,
    sm: uniqueSizes.find(s => s >= baseSize * 0.75 && s < baseSize * 0.875) || baseSize * 0.875,
    base: baseSize,
    lg: uniqueSizes.find(s => s > baseSize && s <= baseSize * 1.125) || baseSize * 1.125,
    xl: uniqueSizes.find(s => s > baseSize * 1.125 && s <= baseSize * 1.25) || baseSize * 1.25,
    '2xl': uniqueSizes.find(s => s > baseSize * 1.25 && s <= baseSize * 1.5) || baseSize * 1.5,
    '3xl': uniqueSizes.find(s => s > baseSize * 1.5) || baseSize * 1.875
  };

  const weights = sortByFrequency(fontWeights).slice(0, 5);

  return {
    primary: primaryFont,
    secondary: secondaryFont,
    scale,
    weights
  };
}

function extractSpacingScale(spacing) {
  const allSpacing = [
    ...spacing.padding,
    ...spacing.margin,
    ...spacing.gap
  ];

  // Parse spacing values to numbers (in px)
  const values = allSpacing
    .flatMap(s => s.split(' '))
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v > 0)
    .sort((a, b) => a - b);

  const uniqueValues = [...new Set(values)];

  // Create spacing scale (base-8 or base-4)
  const base = uniqueValues.find(v => v === 8 || v === 4) || 8;
  const scale = [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]
    .map(multiplier => multiplier * (base / 8));

  return {
    base,
    scale,
    common: uniqueValues.slice(0, 10)
  };
}

function extractEffects(shadows, borderRadius, borders) {
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

function analyzeStyles(rawStyles) {
  const palette = extractColorPalette(rawStyles.colors, rawStyles.backgroundColors);
  const typography = extractTypography(rawStyles.fonts, rawStyles.fontSizes, rawStyles.fontWeights);
  const spacing = extractSpacingScale(rawStyles.spacing);
  const effects = extractEffects(rawStyles.shadows, rawStyles.borderRadius, rawStyles.borders);

  return {
    palette,
    typography,
    spacing,
    effects
  };
}

module.exports = {
  analyzeStyles,
  rgbToHex
};
