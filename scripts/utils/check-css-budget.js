#!/usr/bin/env node
/**
 * Check CSS bundle sizes against performance budgets.
 * Exits with non-zero code if any CSS file exceeds the limit.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CSS_DIR = path.join(__dirname, '../../styles');
const BUDGET_BYTES = 15 * 1024; // 15 KB

function gzipSize(buffer) {
  return zlib.gzipSync(buffer).length;
}

function checkCssFiles() {
  const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));
  let hasFailure = false;

  cssFiles.forEach(file => {
    const fullPath = path.join(CSS_DIR, file);
    const raw = fs.readFileSync(fullPath);
    const size = gzipSize(raw);

    const status = size <= BUDGET_BYTES ? '✅' : '❌';
    console.log(`${status} ${file} → ${(size / 1024).toFixed(2)}KB gzip`);

    if (size > BUDGET_BYTES) {
      hasFailure = true;
    }
  });

  if (hasFailure) {
    console.error(`\nSome CSS files exceed the ${BUDGET_BYTES / 1024}KB budget.`);
    process.exit(1);
  } else {
    console.log('\nAll CSS bundles are within the performance budget.');
  }
}

checkCssFiles();