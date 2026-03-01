# Vibe Stealer

Extract design aesthetics (colors, fonts, spacing, shadows) from any website and convert them into reusable design tokens.

![Architecture](architecture.svg)

## Features

- Scrapes websites using Puppeteer (bypasses JS requirements)
- Analyzes computed styles from DOM
- Extracts color palettes (separates neutral vs accent colors)
- Identifies typography systems (fonts, sizes, weights)
- Captures spacing scales (padding, margin, gap)
- Detects visual effects (shadows, borders, border-radius)
- Outputs in multiple formats: CSS variables, Tailwind config, JSON

## Installation

```bash
npm install
```

## Usage

### Basic usage (CSS output)
```bash
node index.js https://stripe.com
```

### Output formats
```bash
# CSS variables (default)
node index.js https://stripe.com --format css

# Tailwind config
node index.js https://stripe.com --format tailwind

# JSON (programmatic use)
node index.js https://stripe.com --format json
```

### Save to file
```bash
node index.js https://stripe.com -o stripe-vibe.css
node index.js https://linear.app -o linear-vibe.js --format tailwind
```

### Run browser in visible mode (for debugging)
```bash
node index.js https://vercel.com --headless false
```

### Auto-integrate into all Code projects (NEW)
```bash
node index.js https://tryalcove.com --integrate
```
This will:
1. Extract the design tokens
2. Save to `~/Documents/Code/nulljosh.github.io/design-tokens.css`
3. Copy to all web projects (bread, wikiscroll, checkcheck, etc.)
4. You just need to link it in each project's HTML and replace hardcoded styles

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

1. **Scraper** (`lib/scraper.js`): Launches Puppeteer, loads the page, extracts computed styles from all visible DOM elements
2. **Analyzer** (`lib/analyzer.js`): Processes raw styles, finds patterns, separates neutral/accent colors, creates design scales
3. **Formatter** (`lib/formatter.js`): Converts analyzed data into CSS variables, Tailwind config, or JSON

## Test Sites

Works great on:
- Stripe (clean, minimal)
- Linear (modern SaaS)
- Vercel (dark mode, gradients)
- Apple (premium, refined)
- Tailwind CSS (utility-first)

## Architecture

```
vibe-stealer/
├── index.js              # CLI entry point
├── lib/
│   ├── scraper.js        # Puppeteer page loader + style extraction
│   ├── analyzer.js       # Style analysis algorithms
│   └── formatter.js      # CSS/Tailwind/JSON output generation
├── examples/             # Example outputs
└── package.json
```

## Roadmap

- [ ] Screenshot mode (analyze uploaded images instead of URLs)
- [ ] AI vision integration (GPT-4V for aesthetic analysis)
- [ ] Figma tokens export
- [ ] SCSS/SASS output
- [ ] Component detection (buttons, cards, forms)
- [ ] Dark mode detection
- [ ] Animation extraction

## Related Tools

See also: `fetch-tweet.js` in finn/scripts for Twitter content scraping

## Project Map

```svg
<svg viewBox="0 0 680 420" width="680" height="420" xmlns="http://www.w3.org/2000/svg" style="font-family:monospace;background:#f8fafc;border-radius:12px">
  <text x="340" y="28" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">vibe-stealer — Design Token Extractor</text>

  <!-- Root node -->
  <rect x="255" y="48" width="170" height="36" rx="8" fill="#0071e3"/>
  <text x="340" y="70" text-anchor="middle" font-size="11" fill="white" font-weight="bold">vibe-stealer/</text>

  <!-- Dashed lines from root -->
  <line x1="295" y1="84" x2="110" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="320" y1="84" x2="240" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="340" y1="84" x2="340" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="365" y1="84" x2="465" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="390" y1="84" x2="590" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>

  <!-- lib/ -->
  <rect x="30" y="150" width="160" height="36" rx="8" fill="#6366f1"/>
  <text x="110" y="168" text-anchor="middle" font-size="11" fill="white" font-weight="bold">lib/</text>
  <text x="110" y="180" text-anchor="middle" font-size="9" fill="#e0e7ff">core extraction modules</text>

  <!-- index.js -->
  <rect x="195" y="150" width="110" height="36" rx="8" fill="#818cf8"/>
  <text x="250" y="168" text-anchor="middle" font-size="11" fill="white">index.js</text>
  <text x="250" y="180" text-anchor="middle" font-size="9" fill="#e0e7ff">CLI entry point</text>

  <!-- index.html -->
  <rect x="295" y="150" width="110" height="36" rx="8" fill="#fbbf24"/>
  <text x="350" y="168" text-anchor="middle" font-size="11" fill="#1e293b">index.html</text>
  <text x="350" y="180" text-anchor="middle" font-size="9" fill="#64748b">web preview UI</text>

  <!-- examples/ -->
  <rect x="410" y="150" width="110" height="36" rx="8" fill="#86efac"/>
  <text x="465" y="168" text-anchor="middle" font-size="11" fill="#14532d">examples/</text>
  <text x="465" y="180" text-anchor="middle" font-size="9" fill="#64748b">sample outputs</text>

  <!-- apply-vibe.sh / package.json -->
  <rect x="530" y="150" width="130" height="36" rx="8" fill="#7dd3fc"/>
  <text x="595" y="165" text-anchor="middle" font-size="10" fill="#0c4a6e">apply-vibe.sh</text>
  <text x="595" y="180" text-anchor="middle" font-size="9" fill="#64748b">package.json</text>

  <!-- lib children -->
  <line x1="60" y1="186" x2="60" y2="250" stroke="#6366f1" stroke-width="1.5"/>
  <line x1="110" y1="186" x2="110" y2="250" stroke="#6366f1" stroke-width="1.5"/>
  <line x1="160" y1="186" x2="160" y2="250" stroke="#6366f1" stroke-width="1.5"/>

  <rect x="5" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="60" y="267" text-anchor="middle" font-size="10" fill="#3730a3">scraper.js</text>
  <text x="60" y="281" text-anchor="middle" font-size="9" fill="#64748b">Puppeteer scraper</text>

  <rect x="55" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="110" y="267" text-anchor="middle" font-size="10" fill="#3730a3">analyzer.js</text>
  <text x="110" y="281" text-anchor="middle" font-size="9" fill="#64748b">style analysis</text>

  <rect x="105" y="250" width="110" height="38" rx="6" fill="#e0e7ff"/>
  <text x="160" y="267" text-anchor="middle" font-size="10" fill="#3730a3">formatter.js</text>
  <text x="160" y="281" text-anchor="middle" font-size="9" fill="#64748b">token output</text>

  <!-- Output formats -->
  <rect x="290" y="250" width="370" height="155" rx="8" fill="#f1f5f9"/>
  <text x="475" y="272" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Output Formats</text>
  <text x="475" y="295" text-anchor="middle" font-size="10" fill="#475569">CSS custom properties (variables)</text>
  <text x="475" y="315" text-anchor="middle" font-size="10" fill="#475569">Tailwind config (theme extension)</text>
  <text x="475" y="335" text-anchor="middle" font-size="10" fill="#475569">Raw JSON token dump</text>
  <text x="475" y="360" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Extracts</text>
  <text x="475" y="380" text-anchor="middle" font-size="10" fill="#475569">Colors / typography / spacing</text>
  <text x="475" y="398" text-anchor="middle" font-size="10" fill="#475569">Shadows / borders / border-radius</text>

  <!-- stripe.css -->
  <rect x="110" y="310" width="140" height="30" rx="6" fill="#7dd3fc"/>
  <text x="180" y="329" text-anchor="middle" font-size="10" fill="#0c4a6e">stripe.css (example)</text>
</svg>
```
