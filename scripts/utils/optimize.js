const fs = require('fs');
const path = require('path');
const csso = require('csso');

// Configuration
const config = {
  distDir: path.join(__dirname, '../../dist'),
  minifyCSS: true,
  optimizeHTML: true,
  generateSitemap: true,
  siteUrl: 'https://jayanthkumar.com'
};

// Simple CSS minification
function minifyCSS(css) {
  return csso.minify(css).css;
}

// Simple HTML minification
function minifyHTML(html) {
  return html
    // Remove comments (but keep conditional comments)
    .replace(/<!--(?!\[if\s)[\s\S]*?-->/g, '')
    // Remove extra whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove whitespace at start/end of lines
    .replace(/^\s+|\s+$/gm, '')
    // Collapse multiple spaces to single space
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Generate sitemap.xml
function generateSitemap() {
  const pages = [];
  
  // Add homepage
  pages.push({
    url: config.siteUrl,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  });
  
  // Add articles page
  pages.push({
    url: `${config.siteUrl}/articles/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  });
  
  // Find all article pages
  const articlesDir = path.join(config.distDir, 'articles');
  if (fs.existsSync(articlesDir)) {
    const articles = fs.readdirSync(articlesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    articles.forEach(article => {
      if (article !== 'index.html') {
        pages.push({
          url: `${config.siteUrl}/articles/${article}/`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
  }
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(config.distDir, 'sitemap.xml'), sitemap);
  console.log('Generated sitemap.xml');
}

// Generate robots.txt
function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml`;
  
  fs.writeFileSync(path.join(config.distDir, 'robots.txt'), robots);
  console.log('Generated robots.txt');
}

// Add structured data to pages
function addStructuredData() {
  const indexPath = path.join(config.distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Jayanth Kumar",
      "jobTitle": "Security Consultant", 
      "description": "Security consultant specializing in Azure and Microsoft 365 environments",
      "url": config.siteUrl,
      "sameAs": [
        "https://linkedin.com/in/jayanthkumar"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Independent Consultant"
      },
      "knowsAbout": [
        "Cybersecurity",
        "Cloud Security", 
        "Microsoft Azure",
        "Microsoft 365",
        "Threat Hunting",
        "Security Operations"
      ]
    };
    
    const scriptTag = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
    html = html.replace('</head>', `  ${scriptTag}\n</head>`);
    
    fs.writeFileSync(indexPath, html);
    console.log('Added structured data to homepage');
  }
}

// Optimize all CSS files
function optimizeCSS() {
  if (!config.minifyCSS) return;
  
  const cssFiles = ['styles.css', 'archive-styles.css'];
  
  cssFiles.forEach(file => {
    const filePath = path.join(config.distDir, file);
    if (fs.existsSync(filePath)) {
      const css = fs.readFileSync(filePath, 'utf8');
      const minified = minifyCSS(css);
      fs.writeFileSync(filePath, minified);
      
      const originalSize = css.length;
      const minifiedSize = minified.length;
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      console.log(`Minified ${file}: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
    }
  });
}

// Optimize all HTML files
function optimizeHTML() {
  if (!config.optimizeHTML) return;
  
  function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.name.endsWith('.html')) {
        const html = fs.readFileSync(fullPath, 'utf8');
        const minified = minifyHTML(html);
        fs.writeFileSync(fullPath, minified);
        
        const originalSize = html.length;
        const minifiedSize = minified.length;
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`Minified ${path.relative(config.distDir, fullPath)}: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
      }
    });
  }
  
  processDirectory(config.distDir);
}

// Add security headers meta tags
function addSecurityHeaders() {
  function processHTMLFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    const securityMetas = [
      '<meta http-equiv="X-Content-Type-Options" content="nosniff">',
      '<meta http-equiv="X-Frame-Options" content="DENY">',
      '<meta http-equiv="X-XSS-Protection" content="1; mode=block">',
      '<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">'
    ];
    
    // Add security headers before closing head tag
    const securityBlock = securityMetas.join('\n    ');
    html = html.replace('</head>', `    ${securityBlock}\n</head>`);
    
    fs.writeFileSync(filePath, html);
  }
  
  function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.name.endsWith('.html')) {
        processHTMLFile(fullPath);
      }
    });
  }
  
  processDirectory(config.distDir);
  console.log('Added security headers to all HTML files');
}

// Generate performance budget report
function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    files: {},
    totals: {
      html: 0,
      css: 0,
      total: 0
    }
  };
  
  function analyzeDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      const relPath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        analyzeDirectory(fullPath, relPath);
      } else {
        const stats = fs.statSync(fullPath);
        const size = stats.size;
        
        report.files[relPath] = {
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        };
        
        if (item.name.endsWith('.html')) {
          report.totals.html += size;
        } else if (item.name.endsWith('.css')) {
          report.totals.css += size;
        }
        
        report.totals.total += size;
      }
    });
  }
  
  analyzeDirectory(config.distDir);
  
  // Convert totals to KB
  Object.keys(report.totals).forEach(key => {
    report.totals[`${key}KB`] = (report.totals[key] / 1024).toFixed(2);
  });
  
  fs.writeFileSync(path.join(config.distDir, 'performance-report.json'), JSON.stringify(report, null, 2));
  
  console.log('\n📊 Performance Report:');
  console.log(`HTML: ${report.totals.htmlKB} KB`);
  console.log(`CSS: ${report.totals.cssKB} KB`);
  console.log(`Total: ${report.totals.totalKB} KB`);
  
  // Performance budget warnings
  if (report.totals.total > 100 * 1024) { // 100KB
    console.log('⚠️  Warning: Total size exceeds 100KB budget');
  } else {
    console.log('✅ Total size within 100KB budget');
  }
}

// Main optimization function
function optimize() {
  console.log('🚀 Optimizing site...');
  
  if (!fs.existsSync(config.distDir)) {
    console.error(`❌ Distribution directory ${config.distDir} not found. Run build first.`);
    process.exit(1);
  }
  
  // Run optimizations
  optimizeCSS();
  optimizeHTML();
  addSecurityHeaders();
  addStructuredData();
  
  if (config.generateSitemap) {
    generateSitemap();
    generateRobotsTxt();
  }
  
  generatePerformanceReport();
  
  console.log('✅ Optimization complete!');
}

// Run optimization
if (require.main === module) {
  optimize();
}

module.exports = { optimize };