const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const fm = require('front-matter');
const { format } = require('date-fns');

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    renderAttrs: () => ({ 'aria-hidden': 'true' })
  })
});

// Configuration
const config = {
  postsDir: 'posts',
  outputDir: 'dist',
  templatesDir: 'templates',
  siteUrl: 'https://jayanthkumar.com',
  siteName: 'Jayanth Kumar',
  siteDescription: 'Security consultant specializing in Azure and Microsoft 365 environments'
};

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read and parse markdown file
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { attributes, body } = fm(content);
  
  return {
    ...attributes,
    content: md.render(body),
    slug: path.basename(filePath, '.md'),
    filename: filePath
  };
}

/**
 * Scan the `posts/` directory, parse front-matter & markdown, and
 * return an array of post objects ordered by publication date
 * (newest first).
 *
 * Each returned object has at minimum the following shape:
 * ```ts
 * {
 *   title: string;
 *   date: string;   // ISO-8601 string
 *   content: string; // rendered HTML
 *   slug: string;
 *   filename: string; // absolute path on disk
 * }
 * ```
 *
 * Example:
 * ```js
 * const { getAllPosts } = require('./build');
 * const posts = getAllPosts();
 * console.log(`Total posts: ${posts.length}`);
 * ```
 *
 * @function getAllPosts
 * @returns {Array<Object>} Parsed post metadata and rendered HTML.
 */
function getAllPosts() {
  if (!fs.existsSync(config.postsDir)) {
    console.log(`Posts directory ${config.postsDir} not found. Creating it...`);
    ensureDir(config.postsDir);
    return [];
  }

  const files = fs.readdirSync(config.postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(config.postsDir, file));

  const posts = files.map(parseMarkdownFile)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

// Template functions
function renderTemplate(templateName, data) {
  const templatePath = path.join(config.templatesDir, `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Simple template replacement
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key] || '');
  });
  
  return template;
}

// Generate individual post page
function generatePostPage(post) {
  const outputPath = path.join(config.outputDir, 'articles', post.slug, 'index.html');
  ensureDir(path.dirname(outputPath));
  
  const html = renderTemplate('post', {
    title: post.title,
    date: format(new Date(post.date), 'MMM d, yyyy'),
    content: post.content,
    description: post.description || post.title,
    url: `${config.siteUrl}/articles/${post.slug}/`
  });
  
  fs.writeFileSync(outputPath, html);
  console.log(`Generated: ${outputPath}`);
}

// Generate articles archive page
function generateArchivePage(posts) {
  const outputPath = path.join(config.outputDir, 'articles', 'index.html');
  ensureDir(path.dirname(outputPath));
  
  const articlesHtml = posts.map(post => `
    <article class="archive-article">
      <h2 class="archive-title">
        <a href="/articles/${post.slug}/">${post.title}</a>
      </h2>
      <time class="archive-date" datetime="${post.date}">${format(new Date(post.date), 'MMM d, yyyy')}</time>
      <p class="archive-excerpt">
        ${post.description || post.excerpt || ''}
      </p>
    </article>
  `).join('');
  
  const html = renderTemplate('archive', {
    articles: articlesHtml,
    title: 'All Articles',
    description: 'Articles about cybersecurity, Azure, Microsoft 365, threat hunting, and cloud security'
  });
  
  fs.writeFileSync(outputPath, html);
  console.log(`Generated: ${outputPath}`);
}

// Generate homepage with integrated blog content
function generateHomepage(posts) {
  const outputPath = path.join(config.outputDir, 'index.html');
  ensureDir(path.dirname(outputPath));
  
  // Featured posts (first 3)
  const featuredPosts = posts.slice(0, 3);
  const featuredHtml = featuredPosts.map(post => `
    <article class="featured-post">
      <h3 class="post-title">
        <a href="/articles/${post.slug}/">${post.title}</a>
      </h3>
      <time class="post-date" datetime="${post.date}">${format(new Date(post.date), 'MMM d, yyyy')}</time>
      <p class="post-excerpt">
        ${post.description || post.excerpt || ''}
      </p>
      <a href="/articles/${post.slug}/" class="read-more-link">Read more →</a>
    </article>
  `).join('');
  
  // Recent articles (first 5)
  const recentPosts = posts.slice(0, 5);
  const recentHtml = recentPosts.map(post => `
    <article class="article-preview">
      <h3 class="article-title">
        <a href="/articles/${post.slug}/">${post.title}</a>
      </h3>
      <time class="article-date" datetime="${post.date}">${format(new Date(post.date), 'MMM d, yyyy')}</time>
      <p class="article-excerpt">
        ${post.description || post.excerpt || ''}
      </p>
    </article>
  `).join('');
  
  const html = renderTemplate('index', {
    featuredPosts: featuredHtml,
    recentArticles: recentHtml,
    title: 'Jayanth Kumar - Security Consultant',
    description: config.siteDescription
  });
  
  fs.writeFileSync(outputPath, html);
  console.log(`Generated: ${outputPath}`);
}

// Generate RSS feed
function generateRSSFeed(posts) {
  const outputPath = path.join(config.outputDir, 'rss.xml');
  
  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${config.siteUrl}/articles/${post.slug}/</link>
      <guid>${config.siteUrl}/articles/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || post.excerpt || ''}]]></description>
    </item>
  `).join('');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.siteName}</title>
    <link>${config.siteUrl}</link>
    <description>${config.siteDescription}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${config.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
  
  fs.writeFileSync(outputPath, rss);
  console.log(`Generated: ${outputPath}`);
}

// Copy static assets
function copyStaticAssets() {
  const staticFiles = ['styles.css', 'archive-styles.css'];
  
  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(config.outputDir, file));
      console.log(`Copied: ${file}`);
    }
  });
}

/**
 * Primary entry-point for the static-site generator. Executes the full
 * build pipeline:
 * 1. Retrieves & processes markdown posts.
 * 2. Generates individual post pages, archive, homepage and RSS feed.
 * 3. Copies static assets into the `dist/` directory.
 *
 * Typical CLI usage:
 * ```bash
 * node build.js            # Development build
 * node build.js && node optimize.js && node accessibility-audit.js  # Production build
 * ```
 *
 * Programmatic usage:
 * ```js
 * const { build } = require('./build');
 * build();
 * ```
 *
 * @function build
 * @returns {void}
 */
function build() {
  console.log('🚀 Building site...');
  
  // Ensure output directory exists
  ensureDir(config.outputDir);
  ensureDir(config.templatesDir);
  
  // Get all posts
  const posts = getAllPosts();
  console.log(`Found ${posts.length} posts`);
  
  // Generate pages
  posts.forEach(generatePostPage);
  generateArchivePage(posts);
  generateHomepage(posts);
  generateRSSFeed(posts);
  
  // Copy static assets
  copyStaticAssets();
  
  console.log('✅ Build complete!');
  console.log(`📁 Output: ${config.outputDir}`);
  console.log(`🔗 Preview: http://localhost:8000`);
}

// Run build
if (require.main === module) {
  build();
}

module.exports = { build, getAllPosts };