const fs = require('fs');
const path = require('path');
const getContrast = require('get-contrast');

// Accessibility audit configuration
const config = {
  distDir: 'dist',
  generateReport: true
};

// Helper functions
function getLineNumber(text, searchString) {
  const index = text.indexOf(searchString);
  if (index === -1) return 1;
  return text.substring(0, index).split('\n').length;
}

function getAttributeValue(element, attribute) {
  const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
  const match = element.match(regex);
  return match ? match[1] : '';
}

// Accessibility checks
const checks = {
  // Check for missing alt attributes on images
  checkImageAlt: (html, filePath) => {
    const imgRegex = /<img[^>]*>/gi;
    const images = html.match(imgRegex) || [];
    const issues = [];
    
    images.forEach((img, index) => {
      if (!img.includes('alt=')) {
        issues.push({
          severity: 'error',
          rule: 'img-alt',
          message: 'Image missing alt attribute',
          element: img,
          line: getLineNumber(html, img)
        });
      } else if (img.includes('alt=""') && !img.includes('role="presentation"') && !img.includes('aria-hidden="true"')) {
        issues.push({
          severity: 'warning',
          rule: 'img-alt-empty',
          message: 'Image has empty alt attribute - consider if decorative',
          element: img,
          line: getLineNumber(html, img)
        });
      }
    });
    
    return issues;
  },
  
  // Check heading hierarchy
  checkHeadingHierarchy: (html, filePath) => {
    const headingRegex = /<h([1-6])[^>]*>/gi;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        element: match[0],
        position: match.index
      });
    }
    
    const issues = [];
    
    // Check if first heading is h1
    if (headings.length > 0 && headings[0].level !== 1) {
      issues.push({
        severity: 'error',
        rule: 'heading-h1-first',
        message: 'First heading should be h1',
        element: headings[0].element,
        line: getLineNumber(html, headings[0].element)
      });
    }
    
    // Check for skipped heading levels
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1].level;
      const current = headings[i].level;
      
      if (current > prev + 1) {
        issues.push({
          severity: 'error',
          rule: 'heading-hierarchy',
          message: `Heading level skipped from h${prev} to h${current}`,
          element: headings[i].element,
          line: getLineNumber(html, headings[i].element)
        });
      }
    }
    
    return issues;
  },
  
  // Check for proper link context
  checkLinkContext: (html, filePath) => {
    const linkRegex = /<a[^>]*href="[^"]*"[^>]*>([^<]*)<\/a>/gi;
    const issues = [];
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const linkText = match[1].trim();
      const fullLink = match[0];
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'here', 'more', 'link'];
      if (genericTexts.some(text => linkText.toLowerCase().includes(text)) && 
          !fullLink.includes('aria-label=') && 
          !fullLink.includes('title=')) {
        issues.push({
          severity: 'warning',
          rule: 'link-context',
          message: 'Link text may not provide sufficient context',
          element: fullLink,
          line: getLineNumber(html, fullLink)
        });
      }
      
      // Check for empty link text
      if (!linkText && !fullLink.includes('aria-label=')) {
        issues.push({
          severity: 'error',
          rule: 'link-empty',
          message: 'Link has no accessible text',
          element: fullLink,
          line: getLineNumber(html, fullLink)
        });
      }
    }
    
    return issues;
  },
  
  // Check for skip links
  checkSkipLinks: (html, filePath) => {
    const issues = [];
    const hasSkipLink = html.includes('skip-link') || html.includes('skip to main') || html.includes('#main-content');
    
    if (!hasSkipLink && filePath.includes('index.html')) {
      issues.push({
        severity: 'warning',
        rule: 'skip-links',
        message: 'Page should include skip link for keyboard navigation',
        element: '<body>',
        line: 1
      });
    }
    
    return issues;
  },
  
  // Check colour contrast for inline styled text against white background
  checkColorContrast: (html) => {
    const issues = [];
    // matches elements with inline color style and inner text longer than 3 chars
    const regex = /<([a-z]+)([^>]*?)style="[^"]*color:\s*([^;\"]+)[^"]*"[^>]*>([^<]{3,})<\/\1>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const [, tag, , colour, text] = match;
      const ratio = getContrast.ratio(colour.trim(), '#ffffff'); // assumes white bg
      if (ratio < 4.5) {
        issues.push({
          severity: 'warning',
          rule: 'color-contrast',
          message: `Low contrast (${ratio.toFixed(2)}:1) for ${tag} text`,
          element: match[0],
          line: getLineNumber(html, match[0])
        });
      }
    }
    return issues;
  }
};

// Audit a single HTML file
function auditFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(config.distDir, filePath);
  
  let allIssues = [];
  
  // Run all checks
  Object.keys(checks).forEach(checkName => {
    const issues = checks[checkName](html, relativePath);
    allIssues = allIssues.concat(issues);
  });
  
  return {
    file: relativePath,
    issues: allIssues,
    summary: {
      errors: allIssues.filter(issue => issue.severity === 'error').length,
      warnings: allIssues.filter(issue => issue.severity === 'warning').length,
      total: allIssues.length
    }
  };
}

// Audit all HTML files in directory
function auditDirectory(dir) {
  const results = [];
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.name.endsWith('.html')) {
        const result = auditFile(fullPath);
        results.push(result);
      }
    });
  }
  
  processDirectory(dir);
  return results;
}

// Generate accessibility report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesAudited: results.length,
      totalIssues: results.reduce((sum, result) => sum + result.summary.total, 0),
      totalErrors: results.reduce((sum, result) => sum + result.summary.errors, 0),
      totalWarnings: results.reduce((sum, result) => sum + result.summary.warnings, 0)
    },
    files: results,
    recommendations: [
      'Ensure all images have meaningful alt text',
      'Maintain proper heading hierarchy (h1 → h2 → h3)',
      'Provide accessible labels for all form inputs',
      'Use sufficient color contrast (4.5:1 for normal text)',
      'Include skip links for keyboard navigation',
      'Test with screen readers and keyboard-only navigation',
      'Check colour contrast for inline styled text'
    ]
  };
  
  // Write JSON report
  fs.writeFileSync(
    path.join(config.distDir, 'accessibility-report.json'), 
    JSON.stringify(report, null, 2)
  );
  
  // Write human-readable report
  let markdown = `# Accessibility Audit Report\n\n`;
  markdown += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Files Audited:** ${report.summary.filesAudited}\n`;
  markdown += `- **Total Issues:** ${report.summary.totalIssues}\n`;
  markdown += `- **Errors:** ${report.summary.totalErrors}\n`;
  markdown += `- **Warnings:** ${report.summary.totalWarnings}\n\n`;
  
  if (report.summary.totalIssues === 0) {
    markdown += `🎉 **No accessibility issues found!**\n\n`;
  } else {
    markdown += `## Issues by File\n\n`;
    
    results.forEach(result => {
      if (result.issues.length > 0) {
        markdown += `### ${result.file}\n\n`;
        markdown += `**${result.summary.errors} errors, ${result.summary.warnings} warnings**\n\n`;
        
        result.issues.forEach(issue => {
          const icon = issue.severity === 'error' ? '❌' : '⚠️';
          markdown += `${icon} **${issue.rule}** (line ${issue.line}): ${issue.message}\n`;
          markdown += `   \`${issue.element.substring(0, 100)}...\`\n\n`;
        });
      }
    });
  }
  
  markdown += `## Recommendations\n\n`;
  report.recommendations.forEach(rec => {
    markdown += `- ${rec}\n`;
  });
  
  fs.writeFileSync(
    path.join(config.distDir, 'accessibility-report.md'), 
    markdown
  );
  
  return report;
}

/**
 * Run a comprehensive WCAG-inspired audit against every HTML file in
 * the `dist/` directory. A JSON and a human-readable Markdown report
 * are written to disk and a high-level summary is printed to the
 * console.
 *
 * CLI usage:
 * ```bash
 * node accessibility-audit.js
 * ```
 *
 * Programmatic usage:
 * ```js
 * const { audit } = require('./accessibility-audit');
 * audit();
 * ```
 *
 * @function audit
 * @returns {void}
 */
function audit() {
  console.log('🔍 Running accessibility audit...');
  
  if (!fs.existsSync(config.distDir)) {
    console.error(`❌ Distribution directory ${config.distDir} not found. Run build first.`);
    process.exit(1);
  }
  
  const results = auditDirectory(config.distDir);
  const report = generateReport(results);
  
  console.log('\n📊 Accessibility Audit Results:');
  console.log(`Files audited: ${report.summary.filesAudited}`);
  console.log(`Total issues: ${report.summary.totalIssues}`);
  console.log(`Errors: ${report.summary.totalErrors}`);
  console.log(`Warnings: ${report.summary.totalWarnings}`);
  
  if (report.summary.totalIssues === 0) {
    console.log('🎉 No accessibility issues found!');
  } else {
    console.log('\n📝 Detailed report saved to:');
    console.log(`- accessibility-report.json`);
    console.log(`- accessibility-report.md`);
  }
  
  console.log('✅ Accessibility audit complete!');
}

// Run audit
if (require.main === module) {
  audit();
}

module.exports = { audit };