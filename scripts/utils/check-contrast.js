#!/usr/bin/env node
/**
 * WCAG AA colour contrast checker for design tokens.
 * Uses get-contrast package to compute ratios.
 */

const fs = require('fs');
const path = require('path');
const getContrast = require('get-contrast');

const TOKENS_FILE = path.join(__dirname, '../../styles/design-tokens.css');

// Helper to extract hex values from css variables
function parseTokens() {
  const css = fs.readFileSync(TOKENS_FILE, 'utf8');
  const tokenRegex = /--(?<name>[\w-]+):\s*#(?<hex>[0-9a-fA-F]{6})/g;
  const tokens = {};
  let match;
  while ((match = tokenRegex.exec(css)) !== null) {
    tokens[match.groups.name] = `#${match.groups.hex}`;
  }
  return tokens;
}

function checkRatio(fg, bg, name) {
  const ratio = getContrast.ratio(fg, bg);
  const passes = ratio >= 4.5;
  const status = passes ? '✅' : '❌';
  console.log(`${status} ${name}: ${ratio.toFixed(2)}:1`);
  return passes;
}

function main() {
  const t = parseTokens();
  let fail = false;
  if (!t['color-text'] || !t['color-background']) {
    console.error('Token extraction failed. Ensure design-tokens.css has color-text & color-background');
    process.exit(1);
  }
  // Primary checks
  fail |= !checkRatio(t['color-text'], t['color-background'], 'Text vs Background');
  fail |= !checkRatio(t['color-accent'], t['color-background'], 'Accent vs Background');
  fail |= !checkRatio(t['color-accent'], t['color-text'], 'Accent vs Text');
  if (fail) {
    console.error('\nColour contrast requirements not met.');
    process.exit(1);
  } else {
    console.log('\nAll checked colour pairs meet WCAG AA contrast.');
  }
}

main();