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

## Architecture

![vibe-clone architecture](data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20700%20300%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22font-family%3Amonospace%3Bbackground%3A%230f172a%3Bborder-radius%3A12px%22%3E%3Ctext%20x%3D%22350%22%20y%3D%2225%22%20text-anchor%3D%22middle%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23e2e8f0%22%3Evibe-clone%20%E2%80%94%20Design%20Token%20Extraction%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2250%22%20width%3D%22100%22%20height%3D%2250%22%20rx%3D%226%22%20fill%3D%22%233b82f6%22%20stroke%3D%22%231e40af%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%2275%22%20text-anchor%3D%22middle%22%20font-size%3D%2212%22%20fill%3D%22%23f1f5f9%22%20font-weight%3D%22bold%22%3EURL%20Input%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3Ehttps%3A%2F%2Fexample.com%3C%2Ftext%3E%3Cline%20x1%3D%22130%22%20y1%3D%2275%22%20x2%3D%22170%22%20y2%3D%2275%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%22170%22%20y%3D%2250%22%20width%3D%22110%22%20height%3D%2250%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22225%22%20y%3D%2275%22%20text-anchor%3D%22middle%22%20font-size%3D%2212%22%20fill%3D%22%23f1f5f9%22%20font-weight%3D%22bold%22%3EScraper%3C%2Ftext%3E%3Ctext%20x%3D%22225%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EPuppeteer%3C%2Ftext%3E%3Cline%20x1%3D%22280%22%20y1%3D%2275%22%20x2%3D%22320%22%20y2%3D%2275%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%22320%22%20y%3D%2250%22%20width%3D%22130%22%20height%3D%2250%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22385%22%20y%3D%2275%22%20text-anchor%3D%22middle%22%20font-size%3D%2212%22%20fill%3D%22%23f1f5f9%22%20font-weight%3D%22bold%22%3EAnalyzer%3C%2Ftext%3E%3Ctext%20x%3D%22385%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EColor%20Clustering%3C%2Ftext%3E%3Cline%20x1%3D%22450%22%20y1%3D%2275%22%20x2%3D%22490%22%20y2%3D%2275%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%22490%22%20y%3D%2250%22%20width%3D%22110%22%20height%3D%2250%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22545%22%20y%3D%2275%22%20text-anchor%3D%22middle%22%20font-size%3D%2212%22%20fill%3D%22%23f1f5f9%22%20font-weight%3D%22bold%22%3EFormatter%3C%2Ftext%3E%3Ctext%20x%3D%22545%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ECSS%2FTailwind%3C%2Ftext%3E%3Cline%20x1%3D%22600%22%20y1%3D%2275%22%20x2%3D%22640%22%20y2%3D%2275%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%22640%22%20y%3D%2250%22%20width%3D%2260%22%20height%3D%2250%22%20rx%3D%226%22%20fill%3D%22%233b82f6%22%20stroke%3D%22%231e40af%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22670%22%20y%3D%2275%22%20text-anchor%3D%22middle%22%20font-size%3D%2212%22%20fill%3D%22%23f1f5f9%22%20font-weight%3D%22bold%22%3EOutput%3C%2Ftext%3E%3Ctext%20x%3D%22670%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EJSON%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22130%22%20width%3D%22160%22%20height%3D%22140%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221%22%2F%3E%3Ctext%20x%3D%22110%22%20y%3D%22150%22%20text-anchor%3D%22middle%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%23e2e8f0%22%3EScraper%3C%2Ftext%3E%3Ctext%20x%3D%2240%22%20y%3D%22170%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ELoad%20page%20via%20Puppeteer%3C%2Ftext%3E%3Ctext%20x%3D%2240%22%20y%3D%22188%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EExtract%20computed%20styles%3C%2Ftext%3E%3Ctext%20x%3D%2240%22%20y%3D%22206%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EDOM%20traversal%3C%2Ftext%3E%3Ctext%20x%3D%2240%22%20y%3D%22224%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EBypass%20JS%20rendering%3C%2Ftext%3E%3Ctext%20x%3D%2240%22%20y%3D%22242%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3E5000%2B%20samples%3C%2Ftext%3E%3Crect%20x%3D%22205%22%20y%3D%22130%22%20width%3D%22160%22%20height%3D%22140%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221%22%2F%3E%3Ctext%20x%3D%22285%22%20y%3D%22150%22%20text-anchor%3D%22middle%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%23e2e8f0%22%3EAnalyzer%3C%2Ftext%3E%3Ctext%20x%3D%22215%22%20y%3D%22170%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EColor%20clustering%3C%2Ftext%3E%3Ctext%20x%3D%22215%22%20y%3D%22188%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EDark%20mode%20detection%3C%2Ftext%3E%3Ctext%20x%3D%22215%22%20y%3D%22206%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ETypography%20scales%3C%2Ftext%3E%3Ctext%20x%3D%22215%22%20y%3D%22224%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ESpacing%20patterns%3C%2Ftext%3E%3Ctext%20x%3D%22215%22%20y%3D%22242%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EVisual%20grouping%3C%2Ftext%3E%3Crect%20x%3D%22380%22%20y%3D%22130%22%20width%3D%22160%22%20height%3D%22140%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221%22%2F%3E%3Ctext%20x%3D%22460%22%20y%3D%22150%22%20text-anchor%3D%22middle%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%23e2e8f0%22%3EFormatter%3C%2Ftext%3E%3Ctext%20x%3D%22390%22%20y%3D%22170%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ECSS%20variables%3C%2Ftext%3E%3Ctext%20x%3D%22390%22%20y%3D%22188%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ETailwind%20config%3C%2Ftext%3E%3Ctext%20x%3D%22390%22%20y%3D%22206%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ERaw%20JSON%3C%2Ftext%3E%3Ctext%20x%3D%22390%22%20y%3D%22224%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ESave%20to%20file%3C%2Ftext%3E%3Ctext%20x%3D%22390%22%20y%3D%22242%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EPretty%20print%3C%2Ftext%3E%3Crect%20x%3D%22555%22%20y%3D%22130%22%20width%3D%22145%22%20height%3D%22140%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221%22%2F%3E%3Ctext%20x%3D%22627%22%20y%3D%22150%22%20text-anchor%3D%22middle%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%23e2e8f0%22%3EOutput%3C%2Ftext%3E%3Ctext%20x%3D%22565%22%20y%3D%22170%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EDesign%20tokens%3C%2Ftext%3E%3Ctext%20x%3D%22565%22%20y%3D%22188%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EColor%20palette%3C%2Ftext%3E%3Ctext%20x%3D%22565%22%20y%3D%22206%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EType%20system%3C%2Ftext%3E%3Ctext%20x%3D%22565%22%20y%3D%22224%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3ESpacing%20scale%3C%2Ftext%3E%3Ctext%20x%3D%22565%22%20y%3D%22242%22%20font-size%3D%2210%22%20fill%3D%22%23cbd5e1%22%3EEffects%2Fshadows%3C%2Ftext%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrowhead%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20refX%3D%229%22%20refY%3D%223%22%20orient%3D%22auto%22%3E%3Cpolygon%20points%3D%220%200%2C%2010%203%2C%200%206%22%20fill%3D%22%2364748b%22%2F%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3C%2Fsvg%3E)

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
```

All 37 tests passing. Coverage: 76% statements, 92% functions.

## Dev

```bash
npm install
npm run build              # TypeScript → JavaScript
npm run dev -- <url>       # Run with ts-node
npm run lint               # ESLint check
npm run format             # Prettier format
npm run clean              # Remove artifacts
```

## License

MIT
