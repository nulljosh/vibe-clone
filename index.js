#!/usr/bin/env node

/**
 * vibe-clone: Extract design tokens from any website
 *
 * Prefer: npm run dev -- <url> [options]
 * Fallback CJS entry: node index.js <url> [options]
 */

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const { loadPage, extractStyles } = require('./lib/scraper');
const { analyzeStyles } = require('./lib/analyzer');
const { generateCSS, generateTailwind, generateJSON } = require('./lib/formatter');

program
  .version('2.0.0')
  .argument('<url>', 'Website URL to analyze')
  .option('-f, --format <type>', 'Output format (css, tailwind, json)', 'css')
  .option('-o, --output <file>', 'Output file path')
  .option('--headless <bool>', 'Run browser in headless mode', 'true')
  .option('--integrate', 'Auto-integrate vibe into all Code projects')
  .parse();

const options = program.opts();
const url = program.args[0];

async function main() {
  console.log(`\nAnalyzing ${url}...\n`);

  let browser;

  try {
    const headless = options.headless === 'true' || options.headless === true;
    console.log('Loading page...');
    const result = await loadPage(url, { headless });
    browser = result.browser;

    console.log('Extracting styles...');
    const rawStyles = await extractStyles(result.page);
    await browser.close();

    console.log('Analyzing design system...');
    const analyzed = analyzeStyles(rawStyles);

    let output;
    switch (options.format) {
      case 'tailwind':
        output = generateTailwind(analyzed);
        break;
      case 'json':
        output = generateJSON(analyzed);
        break;
      case 'css':
      default:
        output = generateCSS(analyzed);
        break;
    }

    if (options.integrate) {
      const tokensPath = path.join(process.env.HOME || '/root', 'Documents/Code/nulljosh.github.io/design-tokens.css');
      await fs.writeFile(tokensPath, output, 'utf8');
      console.log(`\nSaved to ${tokensPath}\n`);

      console.log('Applying vibe to all projects...');
      const scriptPath = path.join(__dirname, 'apply-vibe.sh');
      try {
        const r = execSync(scriptPath, { encoding: 'utf8' });
        console.log(r);
        console.log('Vibe integrated into all projects');
      } catch (err) {
        console.log('Warning: Could not auto-apply to all projects');
      }
    } else if (options.output) {
      await fs.writeFile(options.output, output, 'utf8');
      console.log(`\nSaved to ${options.output}\n`);
    } else {
      console.log('='.repeat(80));
      console.log(output);
      console.log('='.repeat(80));
    }

    console.log('\nDesign System Summary:');
    console.log(`Primary: ${analyzed.palette.primary}`);
    console.log(`Font: ${analyzed.typography.primary}`);
    console.log(`Spacing base: ${analyzed.spacing.base}px`);
    console.log(`Colors: ${analyzed.palette.all.length}`);
    console.log();

  } catch (error) {
    if (browser) await browser.close();
    console.error('\nError:', error.message || error);
    process.exit(1);
  }
}

if (!url) {
  console.error('Error: URL is required');
  program.help();
}

main();
