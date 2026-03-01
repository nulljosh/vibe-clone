# Vibe Stealer - Claude Notes

## Overview
Design token extractor. Scrapes any website with Puppeteer, analyzes computed styles, outputs CSS variables / Tailwind config / JSON.

## Run
```bash
cd ~/Documents/Code/vibe-stealer
npm install

node index.js https://stripe.com                      # CSS output (default)
node index.js https://stripe.com --format tailwind    # Tailwind config
node index.js https://stripe.com --format json        # JSON
node index.js https://stripe.com -o stripe.css        # save to file
node index.js https://stripe.com --headless false     # visible browser
node index.js https://example.com --integrate         # copy to all Code projects
```

## Architecture
- `lib/scraper.js` — Puppeteer, extracts computed styles from DOM
- `lib/analyzer.js` — finds color palettes, type scales, spacing
- `lib/formatter.js` — CSS vars, Tailwind, or JSON output

## Good Test Sites
Stripe, Linear, Vercel, Apple, Tailwind CSS

## Status
Idea/early stage. Core scraper + formatter working.
