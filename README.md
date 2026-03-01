# vibe-clone

Extract design tokens from any website. Scrapes with Puppeteer, analyzes computed styles, outputs CSS variables, Tailwind config, or JSON.

## Features

- Scrapes live websites via Puppeteer (handles JavaScript-heavy sites)
- Analyzes all computed DOM styles (not just stylesheets)
- Intelligent color clustering by hue + lightness for semantic meaning
- Dark mode detection via luminosity analysis
- Typography extraction (fonts, sizes, weights)
- Spacing scale detection (base-8 or base-4)
- Visual effects collection (shadows, borders, radius)
- Multiple output formats: CSS variables, Tailwind, JSON
- TypeScript strict mode, 37 tests, 76% coverage

## Quick Start

```bash
git clone https://github.com/nulljosh/vibe-clone.git
cd vibe-clone

npm install
npm run build
npm run dev -- https://stripe.com
```

## Usage

```bash
# CSS variables (default)
npm run dev -- https://stripe.com

# Tailwind config
npm run dev -- https://linear.app --format tailwind -o tailwind.config.js

# JSON for scripting
npm run dev -- https://vercel.com --format json | jq .palette

# Save to file
npm run dev -- https://apple.com -o design-tokens.css

# Browser visible (debug)
npm run dev -- https://example.com --headless false
```

## Example Output

**Input:** `https://stripe.com`

**CSS Variables:**
```css
:root {
  --color-primary: #0071e3;
  --color-secondary: #5e5ce6;
  --color-accent-1: #ff3b30;
  --color-blue-60: #0071e3;
  --color-red-45: #ff3b30;
  
  --font-primary: -apple-system;
  --text-base: 16px;
  
  --space-0: 0px;
  --space-2: 8px;
  --space-4: 16px;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --radius: 4px;
  
  /* Dark Mode Detected: false */
}
```

**Tailwind Config:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0071e3",
        secondary: "#5e5ce6"
      },
      fontFamily: { sans: ["-apple-system", "sans-serif"] },
      spacing: { "0": "0px", "2": "8px", "4": "16px" }
    }
  }
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│  CLI (index.ts)                         │
│  • Parse args • Orchestrate pipeline    │
└────────────┬────────────────────────────┘
             │
        ┌────┴─────┬─────────┬──────────┐
        │           │         │          │
   ┌────▼───┐  ┌───▼────┐ ┌─▼──────┐ ┌─▼────────┐
   │Scraper │  │Analyzer │ │Formatter│ │Screenshot│
   │ .ts    │  │  .ts    │ │  .ts   │ │  .ts     │
   │        │  │         │ │        │ │(roadmap) │
   │Puppeteer  │Clustering  │CSS      │          │
   │DOM extract│Dark mode   │Tailwind │          │
   └────┬───┘  │Visual grp  │JSON     │          │
        │      └─────┬──────┴────┬───┘           │
        │            │           │               │
        └────────────┼───────────┴───────────────┘
                     │
                 ┌───▼──────┐
                 │  Output  │
                 │ • Console│
                 │ • File   │
                 │ • JSON   │
                 └──────────┘
```

## Stack

- TypeScript 5.0 (strict mode)
- Puppeteer 21 (headless Chrome)
- Jest 29 (37 tests, 76% coverage)
- Commander.js (CLI parsing)
- tinycolor2 (color manipulation)

## Testing

```bash
npm test                    # Run all tests
npm test:watch             # Watch mode
npm test:coverage          # Coverage report

# All tests passing
# Coverage: 76% statements, 92% functions
```

## Dev

```bash
npm install
npm run build              # TypeScript → JavaScript
npm run dev -- <url>       # Run with ts-node
npm run lint               # ESLint check
npm run format             # Prettier format
npm run clean              # Remove artifacts
```

## Project Structure

```
vibe-clone/
├── src/
│   ├── index.ts                    # CLI entry
│   ├── lib/
│   │   ├── scraper.ts             # Puppeteer
│   │   ├── analyzer.ts            # Color clustering
│   │   ├── formatter.ts           # Output generation
│   │   └── screenshot.ts          # Roadmap
│   └── __tests__/                 # Jest tests
├── dist/                           # Compiled JS
├── tsconfig.json
├── jest.config.js
└── package.json
```

## Color Clustering Algorithm

Colors grouped by hue (30° buckets) + lightness (20% buckets):

```
Input: #0071e3, #0056b3, #ff3b30, #ffffff, #1d1d1f
  ↓
Clusters:
  blue-60    (hue: 240°, lightness: 60%)
  red-45     (hue: 0°,   lightness: 45%)
  neutral-99 (grayscale, lightness: 99%)
  ↓
Visual grouping:
  primaryAccent:   #0071e3 (most saturated)
  secondaryAccent: #ff3b30 (second most)
  neutralBase:     #1d1d1f (darkest)
```

## Roadmap

- [x] TypeScript conversion
- [x] Jest test suite (37 tests)
- [x] Color clustering algorithm
- [x] Dark mode detection
- [x] Production documentation
- [ ] Screenshot mode (v2.1)
- [ ] Component detection (v2.1)
- [ ] SCSS/SASS output (v2.2)
- [ ] Figma tokens export (v2.2)

## Good Test Sites

Works well on:
- Stripe (clean, minimal)
- Linear (modern SaaS)
- Vercel (dark mode)
- Apple (premium)
- Tailwind CSS (utility reference)

## Troubleshooting

**Chrome not found:**
```
Error: Failed to launch the browser process
```
Ensure Chrome is installed at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` or update `src/lib/scraper.ts`.

**Memory issues:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run dev -- <url>
```

**Type errors:**
```bash
npm run build
```

## Documentation

- **README.md** — This file
- **CLAUDE.md** — Developer documentation (design decisions, common tasks)
- **UPGRADE.md** — What changed in v2.0
- **SHIP_CHECKLIST.md** — Production readiness verification

## License

MIT

---

Built with TypeScript, tested with Jest, shipped with confidence. Extract design systems in seconds.
