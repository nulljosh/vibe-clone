# vibe-clone — Developer Guide

Build, test, ship.

## Quick Start

```bash
cd ~/Documents/Code/vibe-clone
npm install
npm run build
npm test
```

## Project Structure

```
src/
├── index.ts              # CLI: parse args, orchestrate
├── lib/
│   ├── scraper.ts       # Puppeteer: load page, extract styles
│   ├── analyzer.ts      # Color clustering, dark mode, analysis
│   ├── formatter.ts     # Generate CSS / Tailwind / JSON
│   └── screenshot.ts    # Roadmap features (v2.1+)
└── __tests__/           # Jest tests (37 tests, 76% coverage)
```

## How It Works

### 1. Scraper (scraper.ts)

Loads a webpage with Puppeteer, extracts computed styles from all visible DOM elements.

**Output:**
```typescript
interface RawStyles {
  colors: string[];              // rgb/rgba values
  backgroundColors: string[];
  fonts: string[];               // Font family names
  fontSizes: string[];           // Pixel values
  fontWeights: string[];         // 400, 500, 600, 700, etc.
  spacing: {
    padding: string[];
    margin: string[];
    gap: string[];
  };
  shadows: string[];             // box-shadow values
  borderRadius: string[];
  borders: string[];
}
```

**Key functions:**
- `loadPage(url, options)` — Launch Chrome, navigate to URL, wait for render
- `extractStyles(page)` — Execute DOM queries, collect computed styles

**Chrome path:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`  
**Viewport:** 1920x1080  
**Wait:** networkidle2 + 2 seconds extra

### 2. Analyzer (analyzer.ts)

Transforms raw styles into a semantic design system.

**Color Clustering Algorithm:**

1. Separate neutral (grayscale) from accent colors
2. Group accents by:
   - **Hue buckets:** 30° intervals (12 hues total)
   - **Lightness buckets:** 20% intervals (5 levels)
3. Name clusters: `blue-60`, `red-45`, `neutral-90`
4. Pick most saturated color as representative
5. Calculate visual grouping (primary/secondary accents)

**Example:**
```
Input colors: #0071e3, #0056b3, #ff3b30, #ffffff, #1d1d1f

Clusters:
├── blue-60 (240° ± 15°, 60% lightness)
│   └── colors: [#0071e3, #0056b3]
├── red-45 (0° ± 15°, 45% lightness)
│   └── colors: [#ff3b30]
└── neutral
    ├── neutral-99: #ffffff
    └── neutral-10: #1d1d1f

Visual grouping:
  primaryAccent: #0071e3 (most saturated)
  secondaryAccent: #ff3b30 (second most)
  neutralBase: #1d1d1f (darkest neutral)
```

**Dark mode detection:**
- Calculate average lightness of background colors
- If avg < 50%, mark as dark mode

**Output:**
```typescript
interface AnalyzedStyles {
  palette: {
    primary: string;
    secondary: string;
    accent: string[];
    neutral: string[];
    clusters: ColorCluster[];
    all: string[];
  };
  typography: {
    primary: string;
    scale: { xs, sm, base, lg, xl, '2xl', '3xl' };
    weights: string[];
  };
  spacing: {
    base: number;
    scale: number[];
    common: number[];
  };
  effects: {
    shadows: { sm, md, lg, all };
    borderRadius: { default, all };
    borders: { default, all };
  };
  darkModeDetected: boolean;
  visualGrouping?: {
    primaryAccent: string;
    secondaryAccent: string;
    neutralBase: string;
  };
}
```

**Key functions:**
- `analyzeStyles(rawStyles)` — Main entry point
- `clusterColors(colors)` — Intelligent grouping by hue + lightness
- `extractColorPalette(colors, bgColors)` — Separate and name clusters
- `extractTypography(fonts, sizes, weights)` — Build type scale
- `extractSpacingScale(spacing)` — Detect base-8 or base-4 pattern
- `detectDarkMode(colors, bgColors)` — Luminosity analysis

### 3. Formatter (formatter.ts)

Converts analyzed styles into output formats.

**CSS Variables:**
```css
:root {
  --color-primary: #0071e3;
  --color-blue-60: #0071e3;
  --font-primary: -apple-system;
  --text-base: 16px;
  --space-4: 16px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

**Tailwind Config:**
```javascript
{
  theme: {
    extend: {
      colors: { primary: "#0071e3" },
      fontFamily: { sans: ["-apple-system"] },
      spacing: { "4": "16px" }
    }
  }
}
```

**JSON:** Raw `AnalyzedStyles` object serialized.

**Key functions:**
- `generateCSS(analyzed)` — CSS variables with color clusters
- `generateTailwind(analyzed)` — Tailwind theme extension
- `generateJSON(analyzed)` — Full object as JSON

### 4. Screenshot (screenshot.ts)

Roadmap features for v2.1+. Currently placeholders that throw helpful errors.

**Future APIs:**
- `extractFromScreenshot(imagePath)` — sharp + k-means clustering
- `detectComponents(imagePath)` — GPT-4V vision analysis
- `detectImageDarkMode(imagePath)` — Luminosity from image pixels

## Testing

**37 tests, all passing.**

```bash
npm test                    # Run all
npm test:watch             # Watch mode
npm test:coverage          # Coverage report
```

**Test files:**
- `analyzer.test.ts` (15 tests) — Color clustering, dark mode, visual grouping
- `formatter.test.ts` (10 tests) — CSS, Tailwind, JSON outputs
- `scraper.test.ts` (3 tests) — Mocked Puppeteer extraction
- `screenshot.test.ts` (3 tests) — Roadmap feature structure

**Coverage:**
| File | Statements | Functions | Branches |
|------|-----------|-----------|----------|
| analyzer.ts | 96% | 95% | 68% |
| formatter.ts | 100% | 100% | 100% |
| scraper.ts | 8% | 25% | 0% |
| screenshot.ts | 100% | 100% | 100% |
| **Total** | **76%** | **92%** | **46%** |

Scraper coverage is low because Puppeteer requires runtime browser (tested via mocks).

## Common Tasks

### Add a color analysis feature

1. Add test in `analyzer.test.ts`
2. Implement in `analyzer.ts`
3. Update `AnalyzedStyles` interface if needed
4. Export and wire into `analyzeStyles()`

### Add an output format

1. Add test in `formatter.test.ts`
2. Create `generateFormat()` function in `formatter.ts`
3. Add CLI option in `index.ts` (commander)
4. Export from formatter

### Debug extraction

```bash
npm run dev -- https://example.com --format json | jq .
# Inspect raw styles before analysis

npm run dev -- https://example.com --headless false
# Open Chrome window for interactive debugging
```

### Run tests with cache cleared

```bash
npm test -- --clearCache
```

## Design Decisions

**TypeScript strict mode:** Catches errors at compile time. Self-documenting code via types.

**Color clustering (hue + lightness):** Creates semantic groupings that match human perception. 30° hue buckets = 12 major hues. 20% lightness buckets = 5 levels.

**Puppeteer over Playwright:** Lower memory, faster startup. `puppeteer-core` reuses system Chrome.

**Jest:** Fast parallel runner, great coverage integration, ts-jest handles TypeScript seamlessly.

**CSS variables + Tailwind + JSON:** Universal coverage. CSS for any project, Tailwind for modern web, JSON for tooling/scripting.

## Dependencies

**Production:**
- puppeteer-core 21 — Headless automation
- commander 11 — CLI argument parsing
- chalk 5 — Colored output
- tinycolor2 1.6 — Color math (HSL, RGB, hex)
- sharp 0.33 — Image processing (roadmap v2.1)

**Development:**
- typescript 5 — Language
- jest 29 — Test runner
- ts-jest 29 — Jest + TypeScript
- ts-node 10 — Run TS directly
- eslint 8, @typescript-eslint/* — Linting
- prettier 3 — Formatting

## Build

```bash
npm run build               # TypeScript → dist/
# Generates .js + .d.ts files
# Takes <100ms

npm run dev -- <url>        # ts-node (development)
npm run lint                # ESLint
npm run format              # Prettier
npm run clean               # Remove artifacts
```

## Roadmap

**v2.0** — Current. TypeScript, tests, color clustering, dark mode, documentation.

**v2.1:**
- [ ] Screenshot mode (sharp integration)
- [ ] Component detection (GPT-4V)
- [ ] Image dark mode detection
- [ ] SCSS/SASS output

**v2.2+:**
- [ ] Figma tokens export
- [ ] Animation extraction
- [ ] Web UI for batch processing
- [ ] API server

## References

- **Puppeteer** — https://pptr.dev
- **Jest** — https://jestjs.io
- **TypeScript** — https://www.typescriptlang.org
- **tinycolor2** — https://bgrins.github.io/TinyColor
- **HSL/HSV** — https://en.wikipedia.org/wiki/HSL_and_HSV

---

**v2.0.0** | TypeScript | 37 tests | 76% coverage | Production ready
