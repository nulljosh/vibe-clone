#!/usr/bin/env node

/**
 * Vibe Stealer - Extract design aesthetics from any website
 *
 * Usage:
 *   vibe-stealer <url>                    # Output CSS
 *   vibe-stealer <url> --format tailwind  # Output Tailwind config
 *   vibe-stealer <url> --format json      # Output JSON
 *   vibe-stealer <url> -o output.css      # Save to file
 */

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { loadPage, extractStyles } = require('./lib/scraper');
const { analyzeStyles } = require('./lib/analyzer');
const { generateCSS, generateTailwind, generateJSON } = require('./lib/formatter');

program
  .version('1.0.0')
  .argument('<url>', 'Website URL to analyze')
  .option('-f, --format <type>', 'Output format (css, tailwind, json)', 'css')
  .option('-o, --output <file>', 'Output file path')
  .option('--headless <bool>', 'Run browser in headless mode', true)
  .option('--integrate', 'Auto-integrate vibe into all Code projects')
  .parse();

const options = program.opts();
const url = program.args[0];

async function main() {
  console.log(chalk.blue(`\nAnalyzing ${url}...\n`));

  let browser, page;

  try {
    // Load page with Puppeteer
    console.log(chalk.gray('Loading page...'));
    ({ browser, page } = await loadPage(url, { headless: options.headless }));

    // Extract raw styles
    console.log(chalk.gray('Extracting styles...'));
    const rawStyles = await extractStyles(page);

    await browser.close();

    // Analyze styles
    console.log(chalk.gray('Analyzing design system...'));
    const analyzed = analyzeStyles(rawStyles);

    // Generate output
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

    // Save or print
    if (options.integrate) {
      // Auto-integrate: save to design-tokens.css and apply to all projects
      const tokensPath = path.join(process.env.HOME, 'Documents/Code/nulljosh.github.io/design-tokens.css');
      await fs.writeFile(tokensPath, output, 'utf8');
      console.log(chalk.green(`\n✓ Saved to ${tokensPath}\n`));

      // Run apply-vibe script
      console.log(chalk.blue('Applying vibe to all projects...'));
      const scriptPath = path.join(__dirname, 'apply-vibe.sh');
      try {
        const result = execSync(scriptPath, { encoding: 'utf8' });
        console.log(result);
        console.log(chalk.green('✓ Vibe integrated into all projects'));
      } catch (err) {
        console.log(chalk.yellow('⚠ Warning: Could not auto-apply to all projects'));
      }
    } else if (options.output) {
      await fs.writeFile(options.output, output, 'utf8');
      console.log(chalk.green(`\n✓ Saved to ${options.output}\n`));
    } else {
      console.log(chalk.gray('━'.repeat(80)));
      console.log(output);
      console.log(chalk.gray('━'.repeat(80)));
    }

    // Print summary
    console.log(chalk.blue('\nDesign System Summary:'));
    console.log(chalk.gray(`Primary Color: ${analyzed.palette.primary}`));
    console.log(chalk.gray(`Primary Font: ${analyzed.typography.primary}`));
    console.log(chalk.gray(`Spacing Base: ${analyzed.spacing.base}px`));
    console.log(chalk.gray(`Total Colors: ${analyzed.palette.all.length}`));
    console.log();

  } catch (error) {
    if (browser) await browser.close();
    console.error(chalk.red('\n✗ Error:'), error.message);
    process.exit(1);
  }
}

if (!url) {
  console.error(chalk.red('Error: URL is required'));
  program.help();
}

main();
