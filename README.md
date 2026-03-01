# vibe-clone

Extracts design tokens (colors, typography, spacing, effects) from any website and converts them to CSS variables, Tailwind config, or JSON.

## Installation

```bash
git clone https://github.com/nulljosh/vibe-clone.git
cd vibe-clone
npm install
npm run build
```

## Usage

```bash
# Extract from Stripe, output CSS variables to console
npm run dev -- https://stripe.com

# Save to file
npm run dev -- https://stripe.com -o stripe-design.css

# Tailwind config output
npm run dev -- https://linear.app --format tailwind -o linear.config.js

# JSON for programmatic access
npm run dev -- https://vercel.com --format json
```

## Features

- Web scraping with Puppeteer for JavaScript-heavy sites
- Computed style extraction directly from DOM
- Intelligent color clustering by hue and lightness
- Dark mode detection via background analysis
- Typography extraction (font families, sizes, weights)
- Spacing scale detection (base-8 or base-4)
- Effects capture (shadows, borders, border-radius)
- Multiple output formats (CSS, Tailwind, JSON)
- Visual grouping recommendations for accent colors

## Architecture

```
CLI Entry Point (src/index.ts)
├── Scraper (src/lib/scraper.ts)
│   └── Puppeteer → DOM → RawStyles
├── Analyzer (src/lib/analyzer.ts)
│   ├── Color clustering by hue/lightness
│   ├── Dark mode detection
│   └── Visual grouping → AnalyzedStyles
└── Formatter (src/lib/formatter.ts)
    └── CSS | Tailwind | JSON → Output
```

### Color Clustering Algorithm

1. Separate neutral colors (grayscale, RGB difference < 10)
2. Group accent colors by hue buckets (30° intervals) and lightness buckets (20% intervals)
3. Name clusters semantically (e.g., `blue-60`, `red-45`)
4. Pick representative color (most saturated in cluster)
5. Sort by vibrancy

## Tests and Coverage

Run tests with `npm test`. Coverage: 76% statements, 92% functions. All 37 tests passing.

```bash
npm test                  # Run all tests
npm test:watch           # Watch mode
npm test:coverage        # Coverage report
```

## Commands

```bash
npm run dev -- <url> [options]

Options:
  -f, --format <type>    Output format: css | tailwind | json (default: css)
  -o, --output <file>    Save to file (optional)
  --headless <bool>      Show Chrome window (default: true)
```

## Development

```bash
npm run build    # TypeScript → JavaScript
npm run format   # Prettier
npm run lint     # ESLint
npm run clean    # Remove artifacts
```

## License

MIT
