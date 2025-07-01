const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItContainer = require('markdown-it-container');
const fm = require('front-matter');
const { format } = require('date-fns');
const sharp = require('sharp');

// Initialize markdown parser with multimedia support
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
.use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    renderAttrs: () => ({ 'aria-hidden': 'true' })
  })
})
.use(markdownItContainer, 'youtube', {
  validate: function(params) {
    return params.trim().match(/^youtube$/);
  },
  render: function(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      // Get the YouTube video ID from the next line
      const videoId = tokens[idx + 2].content.trim();
      return `
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>`;
    } else {
      return '';
    }
  }
});

// Configuration
const config = {
  postsDir: 'posts',
  outputDir: 'dist',
  templatesDir: 'templates',
  siteUrl: 'https://jayanthkumar.com',
  siteName: 'Jayanth Kumar',
  siteDescription: 'Security consultant specializing in Azure and Microsoft 365 environments',
  imageSizes: [400, 800, 1200],
  imageFormats: ['webp', 'jpeg']
};

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Process images in a post
async function processPostImages(postDir, slug) {
  const imagesDir = path.join(postDir, 'images');
  const outputImagesDir = path.join(config.outputDir, 'articles', slug, 'images');
  
  if (!fs.existsSync(imagesDir)) {
    return;
  }
  
  ensureDir(outputImagesDir);
  
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  
  for (const imageFile of imageFiles) {
    const inputPath = path.join(imagesDir, imageFile);
    const baseName = path.basename(imageFile, path.extname(imageFile));
    
    // Generate multiple sizes and formats
    for (const width of config.imageSizes) {
      for (const format of config.imageFormats) {
        const outputName = `${baseName}-${width}w.${format}`;
        const outputPath = path.join(outputImagesDir, outputName);
        
        try {
          await sharp(inputPath)
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .toFormat(format, {
              quality: format === 'webp' ? 85 : 90
            })
            .toFile(outputPath);
          
          console.log(`  Generated: ${outputName}`);
        } catch (err) {
          console.error(`  Error processing ${imageFile}: ${err.message}`);
        }
      }
    }
    
    // Copy original as fallback
    fs.copyFileSync(inputPath, path.join(outputImagesDir, imageFile));
  }
}

// Custom image renderer for responsive images
const defaultImageRenderer = md.renderer.rules.image;
md.renderer.rules.image = function(tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;
  const title = token.attrGet('title');
  
  // Only process local images
  if (!src || src.startsWith('http')) {
    return defaultImageRenderer(tokens, idx, options, env, renderer);
  }
  
  // Extract filename and generate srcset
  const imageName = path.basename(src);
  const baseName = path.basename(imageName, path.extname(imageName));
  const ext = path.extname(imageName).slice(1);
  
  // Build srcset for WebP
  const webpSrcset = config.imageSizes
    .map(size => `./images/${baseName}-${size}w.webp ${size}w`)
    .join(', ');
  
  // Build srcset for JPEG fallback
  const jpegSrcset = config.imageSizes
    .map(size => `./images/${baseName}-${size}w.jpeg ${size}w`)
    .join(', ');
  
  // Generate picture element with responsive images
  let html = '<picture>';
  html += `<source type="image/webp" srcset="${webpSrcset}">`;
  html += `<source type="image/jpeg" srcset="${jpegSrcset}">`;
  html += `<img src="${src}" alt="${alt}"`;
  if (title) {
    html += ` title="${title}"`;
  }
  html += ' loading="lazy" decoding="async">';
  html += '</picture>';
  
  if (title) {
    html = `<figure>${html}<figcaption>${title}</figcaption></figure>`;
  }
  
  return html;
};

// Read and parse markdown file (updated for new structure)
async function parseMarkdownFile(filePath) {
  let content, markdownPath;
  
  // Check if it's a directory with index.md or a standalone .md file
  if (fs.statSync(filePath).isDirectory()) {
    markdownPath = path.join(filePath, 'index.md');
    if (!fs.existsSync(markdownPath)) {
      return null;
    }
  } else {
    markdownPath = filePath;
  }
  
  content = fs.readFileSync(markdownPath, 'utf8');
  const { attributes, body } = fm(content);
  
  const slug = fs.statSync(filePath).isDirectory() 
    ? path.basename(filePath)
    : path.basename(filePath, '.md');
  
  // Process images if post is in a directory
  if (fs.statSync(filePath).isDirectory()) {
    await processPostImages(filePath, slug);
  }
  
  return {
    ...attributes,
    content: md.render(body),
    slug: slug,
    filename: filePath
  };
}

// Get all posts (updated for new structure)
async function getAllPosts() {
  if (!fs.existsSync(config.postsDir)) {
    console.log(`Posts directory ${config.postsDir} not found. Creating it...`);
    ensureDir(config.postsDir);
    return [];
  }

  const items = fs.readdirSync(config.postsDir);
  const posts = [];
  
  for (const item of items) {
    const itemPath = path.join(config.postsDir, item);
    const stat = fs.statSync(itemPath);
    
    // Handle both directories with index.md and standalone .md files
    if (stat.isDirectory() || (stat.isFile() && item.endsWith('.md'))) {
      const post = await parseMarkdownFile(itemPath);
      if (post) {
        posts.push(post);
      }
    }
  }
  
  // Sort by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
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
  const staticFiles = [
    path.join(__dirname, '../../styles/styles.css'),
    path.join(__dirname, '../../styles/archive-styles.css'), 
    path.join(__dirname, '../../styles/multimedia-styles.css')
  ];
  
  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const basename = path.basename(file);
      fs.copyFileSync(file, path.join(config.outputDir, basename));
      console.log(`Copied: ${basename}`);
    }
  });
}

// Main build function
async function build() {
  console.log('🚀 Building site with multimedia support...');
  
  // Ensure output directory exists
  ensureDir(config.outputDir);
  ensureDir(config.templatesDir);
  
  // Get all posts
  const posts = await getAllPosts();
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
  build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}

module.exports = { build, getAllPosts }; 