/**
 * Puppeteer-based page scraper
 * Loads website and extracts computed styles from DOM
 */

const puppeteer = require('puppeteer-core');

async function loadPage(url, options = {}) {
  const { headless = true, timeout = 30000 } = options;

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout
  });

  // Wait for page to fully render
  await page.waitForTimeout(2000);

  return { browser, page };
}

async function extractStyles(page) {
  return await page.evaluate(() => {
    const styles = {
      colors: new Set(),
      backgroundColors: new Set(),
      fonts: new Set(),
      fontSizes: new Set(),
      fontWeights: new Set(),
      spacing: {
        padding: new Set(),
        margin: new Set(),
        gap: new Set()
      },
      shadows: new Set(),
      borderRadius: new Set(),
      borders: new Set()
    };

    // Get all visible elements
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
      const computed = window.getComputedStyle(el);

      // Skip invisible elements
      if (computed.display === 'none' || computed.visibility === 'hidden') {
        return;
      }

      // Colors
      const color = computed.color;
      const bgColor = computed.backgroundColor;
      if (color && color !== 'rgba(0, 0, 0, 0)') styles.colors.add(color);
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') styles.backgroundColors.add(bgColor);

      // Typography
      const fontFamily = computed.fontFamily;
      const fontSize = computed.fontSize;
      const fontWeight = computed.fontWeight;
      if (fontFamily) styles.fonts.add(fontFamily);
      if (fontSize && fontSize !== '0px') styles.fontSizes.add(fontSize);
      if (fontWeight) styles.fontWeights.add(fontWeight);

      // Spacing
      const padding = computed.padding;
      const margin = computed.margin;
      const gap = computed.gap;
      if (padding && padding !== '0px') styles.spacing.padding.add(padding);
      if (margin && margin !== '0px') styles.spacing.margin.add(margin);
      if (gap && gap !== 'normal') styles.spacing.gap.add(gap);

      // Effects
      const boxShadow = computed.boxShadow;
      const borderRadius = computed.borderRadius;
      const border = computed.border;
      if (boxShadow && boxShadow !== 'none') styles.shadows.add(boxShadow);
      if (borderRadius && borderRadius !== '0px') styles.borderRadius.add(borderRadius);
      if (border && border !== 'none' && border !== '0px none rgb(0, 0, 0)') styles.borders.add(border);
    });

    // Convert Sets to Arrays
    return {
      colors: Array.from(styles.colors),
      backgroundColors: Array.from(styles.backgroundColors),
      fonts: Array.from(styles.fonts),
      fontSizes: Array.from(styles.fontSizes),
      fontWeights: Array.from(styles.fontWeights),
      spacing: {
        padding: Array.from(styles.spacing.padding),
        margin: Array.from(styles.spacing.margin),
        gap: Array.from(styles.spacing.gap)
      },
      shadows: Array.from(styles.shadows),
      borderRadius: Array.from(styles.borderRadius),
      borders: Array.from(styles.borders)
    };
  });
}

module.exports = {
  loadPage,
  extractStyles
};
