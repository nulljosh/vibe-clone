# Vibe Stealer v2.0

Extract design aesthetics (colors, fonts, spacing, shadows) from any website and convert them into reusable design tokens.

**Now with TypeScript, comprehensive Jest test suite, advanced color clustering, and dark mode detection!**

## ✨ Features

### Core Capabilities
- Scrapes websites using Puppeteer (bypasses JS requirements)
- Analyzes computed styles from DOM
- Extracts color palettes with **intelligent clustering** by hue and lightness
- Identifies typography systems (fonts, sizes, weights)
- Captures spacing scales (padding, margin, gap)
- Detects visual effects (shadows, borders, border-radius)
- **NEW:** Dark mode detection
- **NEW:** Visual grouping with primary/secondary accents
- Outputs in multiple formats: CSS variables, Tailwind config, JSON

### Code Quality
- **TypeScript** with strict type checking
- **Jest test suite** with 37+ tests and 76%+ statement coverage
- Comprehensive type definitions and interfaces
- ESLint + Prettier for code consistency

### Roadmap Features (v2.1+)
- [ ] Screenshot mode: analyze uploaded images instead of URLs (sharp integration)
- [ ] Component detection: identify buttons, cards, forms, etc.
- [ ] Enhanced dark mode detection from images
- [ ] SCSS/SASS output
- [ ] Figma tokens export
- [ ] Animation extraction

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic usage (CSS output)
```bash
node dist/index.js https://stripe.com
```

### Output formats
```bash
# CSS variables (default)
npm run dev -- https://stripe.com --format css

# Tailwind config
npm run dev -- https://stripe.com --format tailwind

# JSON (programmatic use)
npm run dev -- https://stripe.com --format json
```

### Save to file
```bash
npm run dev -- https://stripe.com -o stripe-vibe.css
npm run dev -- https://linear.app -o linear-vibe.js --format tailwind
```

### Run browser in visible mode (for debugging)
```bash
npm run dev -- https://vercel.com --headless false
```

### Auto-integrate into all Code projects
```bash
npm run dev -- https://tryalcove.com --integrate
```
This will:
1. Extract the design tokens
2. Save to `~/Documents/Code/nulljosh.github.io/design-tokens.css`
3. Copy to all web projects (bread, wikiscroll, checkcheck, etc.)
4. You just need to link it in each project's HTML and replace hardcoded styles

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage

# Lint
npm run lint

# Format
npm run format
```

## Output Examples

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #0071e3;
  --color-secondary: #5e5ce6;
  --color-accent-1: #ff3b30;
  --color-neutral-1: #1d1d1f;
  --color-neutral-2: #86868b;

  /* Color Clusters */
  --color-blue-60: #0071e3;
  --color-purple-55: #5e5ce6;

  /* Typography */
  --font-primary: -apple-system;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;

  /* Effects */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius: 4px;

  /* Dark Mode Detection: false */
}
```

### Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0071e3",
        secondary: "#5e5ce6",
        accent: { "1": "#ff3b30", "2": "#ff9500" }
      },
      fontFamily: {
        sans: ["-apple-system", "sans-serif"]
      },
      spacing: {
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "4": "16px"
      }
    }
  }
}
```

## How It Works

1. **Scraper** (`src/lib/scraper.ts`): Launches Puppeteer, loads the page, extracts computed styles from all visible DOM elements
2. **Analyzer** (`src/lib/analyzer.ts`): 
   - Processes raw styles, finds patterns
   - **NEW:** Clusters colors by hue and lightness for intelligent grouping
   - Separates neutral/accent colors
   - Creates design scales
   - Detects dark mode
   - Generates visual grouping recommendations
3. **Formatter** (`src/lib/formatter.ts`): Converts analyzed data into CSS variables, Tailwind config, or JSON

## Architecture

```
vibe-stealer/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── lib/
│   │   ├── scraper.ts        # Puppeteer page loader + style extraction
│   │   ├── analyzer.ts       # Advanced analysis with color clustering
│   │   ├── formatter.ts      # CSS/Tailwind/JSON output generation
│   │   └── screenshot.ts     # Screenshot utilities (roadmap)
│   └── __tests__/            # Jest test suite (37 tests)
├── dist/                     # Compiled JavaScript
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest testing configuration
├── package.json              # Dependencies and scripts
└── README.md
```

## Test Sites

Works great on:
- Stripe (clean, minimal)
- Linear (modern SaaS)
- Vercel (dark mode, gradients)
- Apple (premium, refined)
- Tailwind CSS (utility-first)

## Development

```bash
# Build TypeScript
npm run build

# Run dev mode
npm run dev -- <url> [options]

# Lint and format
npm run lint
npm run format

# Clean built files
npm run clean
```

## Scripts

- `build`: Compile TypeScript to JavaScript
- `dev`: Run the CLI in development mode with ts-node
- `test`: Run Jest test suite
- `test:watch`: Run tests in watch mode
- `test:coverage`: Generate coverage report
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `clean`: Remove dist/ and coverage/ directories

## Project Map

```svg
<svg viewBox="0 0 680 420" width="680" height="420" xmlns="http://www.w3.org/2000/svg" style="font-family:monospace;background:#f8fafc;border-radius:12px">
  <text x="340" y="28" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">vibe-stealer v2.0 — Design Token Extractor (TypeScript Edition)</text>

  <!-- Root node -->
  <rect x="240" y="48" width="200" height="36" rx="8" fill="#0071e3"/>
  <text x="340" y="70" text-anchor="middle" font-size="11" fill="white" font-weight="bold">vibe-stealer v2.0/</text>

  <!-- Dashed lines from root -->
  <line x1="295" y1="84" x2="110" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="320" y1="84" x2="260" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="340" y1="84" x2="350" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="360" y1="84" x2="470" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="385" y1="84" x2="590" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>

  <!-- src/lib -->
  <rect x="30" y="150" width="160" height="36" rx="8" fill="#6366f1"/>
  <text x="110" y="168" text-anchor="middle" font-size="11" fill="white" font-weight="bold">src/lib/</text>
  <text x="110" y="180" text-anchor="middle" font-size="9" fill="#e0e7ff">core extraction modules</text>

  <!-- src/index.ts -->
  <rect x="200" y="150" width="120" height="36" rx="8" fill="#818cf8"/>
  <text x="260" y="168" text-anchor="middle" font-size="11" fill="white">src/index.ts</text>
  <text x="260" y="180" text-anchor="middle" font-size="9" fill="#e0e7ff">CLI entry point</text>

  <!-- src/__tests__ -->
  <rect x="320" y="150" width="130" height="36" rx="8" fill="#a78bfa"/>
  <text x="385" y="168" text-anchor="middle" font-size="11" fill="white">src/__tests__/</text>
  <text x="385" y="180" text-anchor="middle" font-size="9" fill="#f3e8ff">37 Jest tests</text>

  <!-- tsconfig + jest -->
  <rect x="450" y="150" width="140" height="36" rx="8" fill="#7dd3fc"/>
  <text x="520" y="165" text-anchor="middle" font-size="10" fill="#0c4a6e">tsconfig.json</text>
  <text x="520" y="180" text-anchor="middle" font-size="9" fill="#64748b">jest.config.js</text>

  <!-- lib children -->
  <line x1="60" y1="186" x2="60" y2="250" stroke="#6366f1" stroke-width="1.5"/>
  <line x1="110" y1="186" x2="110" y2="250" stroke="#6366f1" stroke-width="1.5"/>
  <line x1="160" y1="186" x2="160" y2="250" stroke="#6366f1" stroke-width="1.5"/>

  <rect x="5" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="60" y="267" text-anchor="middle" font-size="10" fill="#3730a3">scraper.ts</text>
  <text x="60" y="281" text-anchor="middle" font-size="9" fill="#64748b">Puppeteer scraper</text>

  <rect x="55" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="110" y="267" text-anchor="middle" font-size="10" fill="#3730a3">analyzer.ts</text>
  <text x="110" y="281" text-anchor="middle" font-size="9" fill="#64748b">w/ color clustering</text>

  <rect x="105" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="160" y="267" text-anchor="middle" font-size="10" fill="#3730a3">formatter.ts</text>
  <text x="160" y="281" text-anchor="middle" font-size="9" fill="#64748b">token output</text>

  <!-- Output formats -->
  <rect x="290" y="250" width="370" height="155" rx="8" fill="#f1f5f9"/>
  <text x="475" y="272" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Output Formats</text>
  <text x="475" y="295" text-anchor="middle" font-size="10" fill="#475569">CSS custom properties (with clusters)</text>
  <text x="475" y="315" text-anchor="middle" font-size="10" fill="#475569">Tailwind config (theme extension)</text>
  <text x="475" y="335" text-anchor="middle" font-size="10" fill="#475569">Raw JSON token dump</text>
  <text x="475" y="360" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Extracts</text>
  <text x="475" y="380" text-anchor="middle" font-size="10" fill="#475569">Colors (clustered) / Typography / Spacing / Dark mode</text>
  <text x="475" y="398" text-anchor="middle" font-size="10" fill="#475569">Shadows / Borders / Border-radius</text>
</svg>
```

## Changelog

### v2.0.0
- **Complete TypeScript rewrite** with strict type checking
- **Jest test suite** with 37+ tests and 76% code coverage
- **Advanced color clustering** algorithm (groups colors by hue + lightness)
- **Dark mode detection** using luminosity analysis
- **Visual grouping** output with primary/secondary accents
- Roadmap features documented (screenshot mode, component detection, etc.)
- ESLint + Prettier integration
- Improved CLI with better error handling

### v1.0.0
- Initial release with basic style extraction
- CSS/Tailwind/JSON output formats
- Puppeteer-based web scraping

## Related Tools

See also: `fetch-tweet.js` in finn/scripts for Twitter content scraping

## License

MIT

---

**Built with ❤️ using TypeScript, Puppeteer, and cutting-edge design token extraction**
