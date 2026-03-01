/**
 * Output formatters
 * Generate CSS variables, Tailwind config, or JSON
 */

import { AnalyzedStyles } from './analyzer';

export function generateCSS(analyzed: AnalyzedStyles): string {
  const { palette, typography, spacing, effects } = analyzed;

  let css = ':root {\n';

  // Colors
  css += '  /* Colors */\n';
  css += `  --color-primary: ${palette.primary};\n`;
  if (palette.secondary) {
    css += `  --color-secondary: ${palette.secondary};\n`;
  }

  palette.accent.forEach((color, i) => {
    css += `  --color-accent-${i + 1}: ${color};\n`;
  });

  css += '\n';
  palette.neutral.forEach((color, i) => {
    css += `  --color-neutral-${i + 1}: ${color};\n`;
  });

  // Color clusters
  if (palette.clusters.length > 0) {
    css += '\n  /* Color Clusters */\n';
    palette.clusters.forEach(cluster => {
      css += `  --color-${cluster.name}: ${cluster.representative};\n`;
    });
  }

  // Typography
  css += '\n  /* Typography */\n';
  css += `  --font-primary: ${typography.primary};\n`;
  if (typography.secondary) {
    css += `  --font-secondary: ${typography.secondary};\n`;
  }

  css += '\n';
  Object.entries(typography.scale).forEach(([key, value]) => {
    css += `  --text-${key}: ${value}px;\n`;
  });

  css += '\n';
  typography.weights.forEach((weight, i) => {
    css += `  --font-weight-${i + 1}: ${weight};\n`;
  });

  // Spacing
  css += '\n  /* Spacing */\n';
  spacing.scale.forEach((value, i) => {
    css += `  --space-${i}: ${value}px;\n`;
  });

  // Effects
  css += '\n  /* Effects */\n';
  css += `  --shadow-sm: ${effects.shadows.sm};\n`;
  css += `  --shadow-md: ${effects.shadows.md};\n`;
  css += `  --shadow-lg: ${effects.shadows.lg};\n`;

  css += `\n  --radius: ${effects.borderRadius.default};\n`;
  css += `  --border: ${effects.borders.default};\n`;

  // Dark mode detection
  if (analyzed.darkModeDetected !== undefined) {
    css += `\n  /* Dark Mode Detected: ${analyzed.darkModeDetected} */\n`;
  }

  css += '}\n';

  return css;
}

export function generateTailwind(analyzed: AnalyzedStyles): string {
  const { palette, typography, spacing, effects } = analyzed;

  const config: any = {
    theme: {
      extend: {
        colors: {
          primary: palette.primary,
          secondary: palette.secondary,
          accent: palette.accent.reduce((acc: any, color: string, i: number) => {
            acc[i + 1] = color;
            return acc;
          }, {}),
          neutral: palette.neutral.reduce((acc: any, color: string, i: number) => {
            acc[i + 1] = color;
            return acc;
          }, {})
        },
        fontFamily: {
          sans: [typography.primary, 'sans-serif'],
          ...(typography.secondary && { secondary: [typography.secondary, 'sans-serif'] })
        },
        fontSize: Object.fromEntries(
          Object.entries(typography.scale).map(([key, value]) => [key, `${value}px`])
        ),
        fontWeight: typography.weights.reduce((acc: any, weight: string) => {
          acc[weight] = weight;
          return acc;
        }, {}),
        spacing: spacing.scale.reduce((acc: any, value: number, i: number) => {
          acc[i] = `${value}px`;
          return acc;
        }, {}),
        boxShadow: {
          sm: effects.shadows.sm,
          DEFAULT: effects.shadows.md,
          lg: effects.shadows.lg
        },
        borderRadius: {
          DEFAULT: effects.borderRadius.default
        }
      }
    }
  };

  return 'module.exports = ' + JSON.stringify(config, null, 2);
}

export function generateJSON(analyzed: AnalyzedStyles): string {
  return JSON.stringify(analyzed, null, 2);
}
