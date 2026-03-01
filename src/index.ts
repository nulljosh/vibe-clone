#!/usr/bin/env node

/**
 * Vibe Stealer - Extract design aesthetics from any website
 * TypeScript rewrite with advanced analysis and testing
 *
 * Usage:
 *   vibe-stealer <url>                    # Output CSS
 *   vibe-stealer <url> --format tailwind  # Output Tailwind config
 *   vibe-stealer <url> --format json      # Output JSON
 *   vibe-stealer <url> -o output.css      # Save to file
 */

import { program } from 'commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { loadPage, extractStyles } from './lib/scraper';
import { analyzeStyles } from './lib/analyzer';
import { generateCSS, generateTailwind, generateJSON } from './lib/formatter';

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

async function main(): Promise<void> {
  console.log(chalk.blue(`\nAnalyzing ${url}...\n`));

  let browser;

  try {
    // Load page with Puppeteer
    console.log(chalk.gray('Loading page...'));
    const headless = options.headless === 'true' || options.headless === true;
    const { browser: b, page } = await loadPage(url, { headless });
    browser = b;

    // Extract raw styles
    console.log(chalk.gray('Extracting styles...'));
    const rawStyles = await extractStyles(page);

    await browser.close();

    // Analyze styles
    console.log(chalk.gray('Analyzing design system...'));
    const analyzed = analyzeStyles(rawStyles);

    // Generate output
    let output: string;
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
      const tokensPath = path.join(
        process.env.HOME || '/root',
        'Documents/Code/nulljosh.github.io/design-tokens.css'
      );
      await fs.writeFile(tokensPath, output, 'utf8');
      console.log(chalk.green(`\n✓ Saved to ${tokensPath}\n`));

      // Run apply-vibe script
      console.log(chalk.blue('Applying vibe to all projects...'));
      const scriptPath = path.join(__dirname, '..', 'apply-vibe.sh');
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
    if (analyzed.darkModeDetected !== undefined) {
      console.log(chalk.gray(`Dark Mode: ${analyzed.darkModeDetected ? 'detected' : 'not detected'}`));
    }
    if (analyzed.palette.clusters.length > 0) {
      console.log(chalk.gray(`Color Clusters: ${analyzed.palette.clusters.length}`));
    }
    console.log();
  } catch (error) {
    if (browser) await browser.close();
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red('\n✗ Error:'), message);
    process.exit(1);
  }
}

if (!url) {
  console.error(chalk.red('Error: URL is required'));
  program.help();
}

main();
