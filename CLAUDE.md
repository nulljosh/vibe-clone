# vibe-clone v2.0 — Codebase Documentation

**Extract design aesthetics from any website. TypeScript + Jest + advanced color clustering.**

## Quick Start

```bash
cd ~/Documents/Code/vibe-clone

# Install & build
npm install
npm run build

# Run CLI (development)
npm run dev -- https://stripe.com

# Run tests
npm test

# Coverage
npm test:coverage
```

## Project Structure

```
vibe-clone/
├── src/
│   ├── index.ts                      # CLI entry point (Commander)
│   ├── lib/
│   │   ├── scraper.ts               # Puppeteer page loader + style extractor
│   │   ├── analyzer.ts              # Advanced analysis: clustering, dark mode detection
│   │   ├── formatter.ts             # Output generation: CSS / Tailwind / JSON
│   │   └── screenshot.ts            # Roadmap features (v2.1): image analysis
│   └── __tests__/
│       ├── analyzer.test.ts         # 15 tests: color clustering, dark mode
│       ├── formatter.test.ts        # 10 tests: all output formats
│       ├── scraper.test.ts          # 3 tests: mocked puppeteer
│       └── screenshot.test.ts       # 3 tests: roadmap feature structure
├── dist/                             # Compiled JavaScript + .d.ts
├── index.html                        # Web preview UI
├── apply-vibe.sh                     # Integration script
├── architecture.svg                  # System diagram
├── package.json                      # Dependencies + scripts
├── tsconfig.json                     # TypeScript strict mode
├── jest.config.js                    # Jest test configuration
├── README.md                         # User documentation
├── UPGRADE.md                        # v2.0 upgrade summary
├── CLAUDE.md                         # This file
└── .gitignore                        # Ignore rules
```

## File-by-File Breakdown

### `src/index.ts` — CLI Entry Point
**Purpose:** Parse CLI arguments, orchestrate the pipeline, output results.

**Key Exports:** None (executable)

**Dependencies:**
- `commander` - CLI argument parsing
- `chalk` - colored console output
- `fs/promises` - file I/O
- `./lib/scraper` - page loading
- `./lib/analyzer` - style analysis
- `./lib/formatter` - output generation

**CLI Options:**
```
-f, --format <type>      # css | tailwind | json (default: css)
-o, --output <file>      # Save to file path
--headless <bool>        # true | false (default: true)
--integrate              # Auto-integrate to projects
```

**Flow:**
1. Parse URL and options
2. Load page with Puppeteer (`scraper.loadPage()`)
3. Extract raw styles (`scraper.extractStyles()`)
4. Analyze styles (`analyzer.analyzeStyles()`)
5. Generate output (`formatter.generate*()`)
6. Save or print result
7. Display summary

---

### `src/lib/scraper.ts` — Page Scraping
**Purpose:** Puppeteer integration. Load a webpage and extract computed styles from all DOM elements.

**Key Exports:**
```typescript
interface RawStyles {
  colors: string[];
  backgroundColors: string[];
  fonts: string[];
  fontSizes: string[];
  fontWeights: string[];
  spacing: { padding, margin, gap };
  shadows: string[];
  borderRadius: string[];
  borders: string[];
}

async function loadPage(url: string, options?: ScraperOptions): Promise<PageLoadResult>
async function extractStyles(page: Page): Promise<RawStyles>
```

**What It Does:**
1. Launches Chrome via Puppeteer
2. Sets viewport to 1920x1080
3. Navigates to URL (waits for networkidle2)
4. Extracts computed styles from all visible elements
5. Filters out invisible elements (display: none, visibility: hidden)
6. Collects colors, fonts, sizes, spacing, shadows, effects

**Important Notes:**
- Uses headless Chrome executable path
- Includes `--disable-web-security` flag for CORS handling
- Waits 2 seconds extra for page rendering
- Returns arrays of raw CSS values

**Browser Compatibility:**
- Requires Chrome/Chromium installed
- Tested on macOS with `/Applications/Google Chrome.app`

---

### `src/lib/analyzer.ts` — Advanced Analysis Engine
**Purpose:** Transform raw styles into a structured design system with intelligent color clustering.

**Key Exports:**
```typescript
interface ColorCluster {
  name: string;              // 'blue-60', 'red-45'
  representative: string;    // '#0071e3'
  colors: string[];          // all colors in cluster
  lightness: number;         // 0-100
  saturation: number;        // 0-100
  hue: number;              // 0-360
}

interface AnalyzedStyles {
  palette: {
    primary: string;
    secondary?: string;
    accent: string[];
    neutral: string[];
    clusters: ColorCluster[];
    all: string[];
  };
  typography: {
    primary: string;
    secondary?: string;
    scale: TypographyScale;
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
  darkModeDetected?: boolean;
  visualGrouping?: {
    primaryAccent: string;
    secondaryAccent: string;
    neutralBase: string;
  };
}

function analyzeStyles(rawStyles: RawStyles): AnalyzedStyles
```

**Color Clustering Algorithm:**
1. Separate neutral (grayscale, RGB diff < 10) from accent colors
2. For accent colors:
   - Group by hue: 30° buckets (0, 30, 60, 90, ... 330)
   - Group by lightness: 20% buckets (0, 20, 40, 60, 80, 100)
   - Example clusters: `blue-60` (240°±15, 60% lightness), `red-45` (0°±15, 45% lightness)
3. For each cluster:
   - Calculate average hue, saturation, lightness
   - Pick most saturated color as representative
   - Sort by saturation (vibrant first)
4. Generate semantic names: color + lightness percentage

**Dark Mode Detection:**
- Calculates average lightness of all background colors
- If avg < 50%, marks as dark mode detected
- Used for output documentation

**Visual Grouping:**
- If 2+ color clusters exist, provides recommended primary/secondary accents
- Helps designers understand color hierarchy

**Helper Functions:**
- `rgbToHex()` - Convert rgb/rgba to #hex
- `isNeutralColor()` - Check if color is grayscale
- `sortByFrequency()` - Count occurrences, return sorted
- `clusterColors()` - Intelligent hue+lightness grouping
- `extractColorPalette()` - Separate and cluster colors
- `extractTypography()` - Build type scale from sizes
- `extractSpacingScale()` - Base-8 or base-4 spacing
- `extractEffects()` - Collect shadows, borders, radius
- `detectDarkMode()` - Luminosity analysis

---

### `src/lib/formatter.ts` — Output Generation
**Purpose:** Convert analyzed design system into CSS, Tailwind, or JSON format.

**Key Exports:**
```typescript
function generateCSS(analyzed: AnalyzedStyles): string
function generateTailwind(analyzed: AnalyzedStyles): string
function generateJSON(analyzed: AnalyzedStyles): string
```

**CSS Variables Output:**
```css
:root {
  /* Colors */
  --color-primary: #0071e3;
  --color-secondary: #5e5ce6;
  --color-accent-1: #ff3b30;
  
  /* Color Clusters */
  --color-blue-60: #0071e3;
  --color-purple-55: #5e5ce6;
  
  /* Typography */
  --font-primary: -apple-system;
  --text-base: 16px;
  --font-weight-1: 400;
  
  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-4: 16px;
  
  /* Effects */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --radius: 4px;
  --border: 1px solid rgba(0, 0, 0, 0.1);
}
```

**Tailwind Config Output:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0071e3",
        secondary: "#5e5ce6",
        accent: { "1": "#ff3b30" },
        neutral: { "1": "#1d1d1f" }
      },
      fontFamily: {
        sans: ["-apple-system", "sans-serif"]
      },
      fontSize: { xs: "12px", base: "16px", ... },
      spacing: { "0": "0px", "1": "4px", ... }
    }
  }
}
```

**JSON Output:**
Raw `AnalyzedStyles` object serialized to JSON for programmatic use.

---

### `src/lib/screenshot.ts` — Roadmap Features (v2.1+)
**Purpose:** Placeholder implementations for future image-based analysis.

**Key Exports:**
```typescript
async function extractFromScreenshot(options: ScreenshotOptions): Promise<RawStyles>
async function detectComponents(imagePath: string): Promise<string[]>
async function detectImageDarkMode(imagePath: string): Promise<boolean>
```

**Status:** All throw "not yet implemented" errors pointing to v2.1.0

**Roadmap Details:**
- **extractFromScreenshot** - Use `sharp` library to analyze image, extract dominant colors via k-means clustering
- **detectComponents** - Use GPT-4V vision to identify UI components (buttons, forms, cards, etc.)
- **detectImageDarkMode** - Calculate average HSL lightness of image pixels

**Integration Plan:**
- Add `sharp` dependency in v2.1
- Add OpenAI vision API integration
- Update tests to cover image scenarios

---

## Test Suite Overview

### Test Organization
```
src/__tests__/
├── analyzer.test.ts    # 15 tests
├── formatter.test.ts   # 10 tests
├── scraper.test.ts     # 3 tests
└── screenshot.test.ts  # 3 tests
```

### Running Tests
```bash
npm test                    # Run all tests
npm test:watch             # Watch mode
npm test:coverage          # Coverage report
npm test -- --testNamePattern="color" # Run specific tests
```

### Coverage Thresholds (jest.config.js)
```javascript
{
  statements: 75,    // ✅ 76% achieved
  branches: 45,      // ✅ 46% achieved
  functions: 75,     // ✅ 92% achieved
  lines: 75          // ✅ 80% achieved
}
```

### Test Examples

**analyzer.test.ts** — Color clustering logic
```typescript
it('should cluster colors by hue and lightness', () => {
  const result = analyzeStyles(mockRawStyles);
  expect(result.palette.clusters).toBeDefined();
  expect(result.palette.clusters[0].name).toMatch(/\w+-\d+/); // 'blue-60'
});
```

**formatter.test.ts** — Output consistency
```typescript
it('should generate valid CSS', () => {
  const css = generateCSS(mockAnalyzed);
  expect(css).toContain(':root {');
  expect(css).toContain('--color-primary:');
});
```

**scraper.test.ts** — Mocked Puppeteer
```typescript
it('should extract styles from a mocked page', async () => {
  const mockPage = { evaluate: jest.fn().mockResolvedValue(...) };
  const result = await extractStyles(mockPage);
  expect(result.colors).toBeDefined();
});
```

---

## Build & Deployment

### Development Workflow
```bash
# Make changes to src/
npm run lint              # Check for errors
npm run format            # Auto-format code
npm test                  # Run tests
npm run build             # Compile TypeScript
```

### Production Build
```bash
npm run clean             # Remove old artifacts
npm install               # Fresh dependencies
npm run build             # Compile
npm test                  # Verify all tests pass
```

### CLI Usage
```bash
# Development (with ts-node)
npm run dev -- https://stripe.com

# Production (compiled JavaScript)
npm run build
node dist/index.js https://stripe.com

# Global install (optional)
npm install -g ./
vibe-stealer https://stripe.com
```

---

## Dependencies

### Production Dependencies
- **puppeteer-core** ^21.0.0 — Headless Chrome automation
- **commander** ^11.0.0 — CLI argument parsing
- **chalk** ^5.0.0 — Colored terminal output
- **sharp** ^0.33.0 — Image processing (roadmap)
- **tinycolor2** ^1.6.0 — Color manipulation & HSL conversion

### Development Dependencies
- **typescript** ^5.0.0 — Language
- **ts-node** ^10.9.0 — Run TypeScript directly
- **jest** ^29.5.0 — Test runner
- **ts-jest** ^29.1.0 — Jest + TypeScript integration
- **@types/node** ^20.0.0 — Node.js types
- **prettier** ^3.0.0 — Code formatter
- **eslint** ^8.40.0 — Linter
- **@typescript-eslint/** — TypeScript ESLint plugins

---

## Key Design Decisions

### 1. **TypeScript Strict Mode**
- `strict: true` in tsconfig.json
- Catches type errors at compile time
- Better IDE support and documentation
- Self-documenting code via types

### 2. **Color Clustering Algorithm**
- **Why hue + lightness buckets?** Creates semantic groupings that match human perception
- **Why 30° for hue?** 360° / 12 = 30° per major hue (red, orange, yellow, green, cyan, blue, purple, magenta, etc.)
- **Why 20% for lightness?** Creates 5 lightness levels (dark, darker, medium, lighter, light)
- **Why sort by saturation?** Most vibrant colors become primary/secondary accents

### 3. **Puppeteer over Selenium/Playwright**
- Puppeteer: Lower memory footprint, faster startup
- Core over full browser: Reuses system Chrome, not bundled version
- Headless support: Great for CI/CD

### 4. **Jest for Testing**
- Fast parallel test runner
- Great snapshot support (useful for style diffs)
- Built-in coverage thresholds
- ts-jest integration is seamless

### 5. **CSS Variables, Tailwind, JSON**
- CSS variables: Universal, works everywhere
- Tailwind: Popular in modern web dev, easy to extend
- JSON: Programmatic use, integrations with tools

---

## Common Tasks

### Add a New Color Analysis Feature
1. Add test case in `analyzer.test.ts`
2. Implement function in `analyzer.ts`
3. Export from analyzer
4. Update `AnalyzedStyles` interface if needed

### Add a New Output Format
1. Add test case in `formatter.test.ts`
2. Create `generateFormat()` function in `formatter.ts`
3. Add CLI option in `index.ts`
4. Export from formatter

### Debug Style Extraction
```bash
npm run dev -- https://example.com --format json | jq .
# Inspect raw styles before analysis
```

### Test with Real Browser
```bash
npm run dev -- https://example.com --headless false
# Chrome window opens, you can interact with the page
```

### Run Tests with Coverage
```bash
npm run test:coverage
# Opens HTML report in coverage/lcov-report/index.html
```

---

## Troubleshooting

### Chrome Not Found
```
Error: Failed to launch the browser process
```
**Solution:** Ensure Chrome is installed at:
```
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```
Or update `scraper.ts` with your Chrome path:
```typescript
executablePath: '/path/to/chrome'
```

### TypeScript Compilation Errors
```bash
npm run build
# Check for type errors before running
```

### Tests Failing After Changes
```bash
npm test -- --no-cache
# Clear Jest cache and rerun
```

### Memory Issues with Large Pages
- Increase Node heap: `NODE_OPTIONS=--max-old-space-size=4096 npm run dev -- <url>`
- Close other applications
- Try with `--headless true` (uses less memory)

---

## Future Work (v2.1+)

### Short Term
- [ ] Screenshot mode with sharp image processing
- [ ] Component detection via GPT-4V
- [ ] Image dark mode detection
- [ ] SCSS/SASS output format

### Medium Term
- [ ] Figma tokens JSON export
- [ ] Animation extraction
- [ ] Web UI for batch processing
- [ ] API server for headless integration

### Long Term
- [ ] Design system auto-generation
- [ ] Color accessibility analysis
- [ ] Component library generation
- [ ] Design-to-code pipelines

---

## References

- **Commander.js** - https://github.com/tj/commander.js
- **Puppeteer** - https://pptr.dev
- **Jest** - https://jestjs.io
- **TypeScript** - https://www.typescriptlang.org
- **tinycolor2** - https://bgrins.github.io/TinyColor
- **Color Science** - https://en.wikipedia.org/wiki/HSL_and_HSV

---

**Last Updated:** Feb 28, 2026  
**Version:** 2.0.0  
**Maintainer:** Joshua Trommel  
**License:** MIT
