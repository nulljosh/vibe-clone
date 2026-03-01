/**
 * Output formatters
 * Generate CSS variables, Tailwind config, or JSON
 */

function generateCSS(analyzed) {
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

  css += '}\n';

  return css;
}

function generateTailwind(analyzed) {
  const { palette, typography, spacing, effects } = analyzed;

  const config = {
    theme: {
      extend: {
        colors: {
          primary: palette.primary,
          secondary: palette.secondary,
          accent: palette.accent.reduce((acc, color, i) => {
            acc[i + 1] = color;
            return acc;
          }, {}),
          neutral: palette.neutral.reduce((acc, color, i) => {
            acc[i + 1] = color;
            return acc;
          }, {})
        },
        fontFamily: {
          sans: [typography.primary, 'sans-serif'],
          secondary: typography.secondary ? [typography.secondary, 'sans-serif'] : undefined
        },
        fontSize: Object.fromEntries(
          Object.entries(typography.scale).map(([key, value]) => [key, `${value}px`])
        ),
        fontWeight: typography.weights.reduce((acc, weight, i) => {
          acc[weight] = weight;
          return acc;
        }, {}),
        spacing: spacing.scale.reduce((acc, value, i) => {
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

function generateJSON(analyzed) {
  return JSON.stringify(analyzed, null, 2);
}

module.exports = {
  generateCSS,
  generateTailwind,
  generateJSON
};
