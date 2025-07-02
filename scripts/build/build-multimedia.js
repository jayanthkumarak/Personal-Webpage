const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItContainer = require('markdown-it-container');
const fm = require('front-matter');
const { format } = require('date-fns');
const sharp = require('sharp');
const { logger, createLogger } = require('../utils/logger');

// Create build-specific logger with context
const buildLogger = createLogger({
  context: { module: 'build-multimedia' }
});

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
    buildLogger.debug('No images directory found', { postDir, slug });
    return;
  }
  
  ensureDir(outputImagesDir);
  
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  
  buildLogger.info(`Processing ${imageFiles.length} images`, { slug, images: imageFiles });
  
  for (const imageFile of imageFiles) {
    const inputPath = path.join(imagesDir, imageFile);
    const baseName = path.basename(imageFile, path.extname(imageFile));
    
    // Get original image metadata for better error reporting
    let metadata;
    try {
      metadata = await sharp(inputPath).metadata();
      buildLogger.trace('Image metadata', { file: imageFile, metadata });
    } catch (err) {
      buildLogger.error('Failed to read image metadata', { 
        file: imageFile, 
        error: err,
        suggestion: 'Ensure the file is a valid image format'
      });
      continue;
    }
    
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
          
          const stats = fs.statSync(outputPath);
          buildLogger.debug('Generated image variant', {
            input: imageFile,
            output: outputName,
            width,
            format,
            size: stats.size,
            originalSize: metadata.size,
            reduction: `${Math.round((1 - stats.size / metadata.size) * 100)}%`
          });
        } catch (err) {
          buildLogger.error('Image processing failed', {
            file: imageFile,
            targetWidth: width,
            targetFormat: format,
            error: err,
            originalDimensions: `${metadata.width}x${metadata.height}`,
            suggestion: getImageProcessingSuggestion(err, metadata, width, format)
          });
        }
      }
    }
    
    // Copy original as fallback
    try {
      fs.copyFileSync(inputPath, path.join(outputImagesDir, imageFile));
      buildLogger.trace('Copied original image as fallback', { file: imageFile });
    } catch (err) {
      buildLogger.error('Failed to copy original image', { file: imageFile, error: err });
    }
  }
}

// Helper function to provide better error suggestions
function getImageProcessingSuggestion(err, metadata, targetWidth, targetFormat) {
  if (err.message.includes('unsupported image format')) {
    return `Image format ${metadata.format} may not be supported. Try converting to JPEG or PNG first.`;
  }
  if (err.message.includes('memory')) {
    return `Image too large (${metadata.width}x${metadata.height}). Consider reducing the original image size.`;
  }
  if (targetWidth > metadata.width) {
    return `Target width ${targetWidth} exceeds original width ${metadata.width}. Image will not be enlarged.`;
  }
  return 'Check Sharp documentation for this specific error.';
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
  const fileLogger = buildLogger.withContext({ operation: 'parseMarkdown', file: filePath });
  
  let content, markdownPath;
  
  // Check if it's a directory with index.md or a standalone .md file
  if (fs.statSync(filePath).isDirectory()) {
    markdownPath = path.join(filePath, 'index.md');
    if (!fs.existsSync(markdownPath)) {
      fileLogger.warn('Directory missing index.md', { directory: filePath });
      return null;
    }
  } else {
    markdownPath = filePath;
  }
  
  content = fileLogger.tryReadFile(markdownPath);
  if (!content) {
    return null;
  }
  
  try {
    const { attributes, body } = fm(content);
    
    const slug = fs.statSync(filePath).isDirectory() 
      ? path.basename(filePath)
      : path.basename(filePath, '.md');
    
    fileLogger.debug('Parsed markdown file', { 
      slug, 
      title: attributes.title,
      date: attributes.date,
      hasContent: body.length > 0
    });
    
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
  } catch (err) {
    fileLogger.error('Failed to parse markdown', { 
      error: err,
      suggestion: 'Check front-matter syntax and ensure valid YAML'
    });
    return null;
  }
}

// Get all posts (updated for new structure)
async function getAllPosts() {
  const postsLogger = buildLogger.withContext({ operation: 'getAllPosts' });
  
  if (!fs.existsSync(config.postsDir)) {
    postsLogger.info('Posts directory not found, creating it', { dir: config.postsDir });
    ensureDir(config.postsDir);
    return [];
  }

  const items = fs.readdirSync(config.postsDir);
  const posts = [];
  
  postsLogger.debug('Found items in posts directory', { count: items.length, items });
  
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
  
  postsLogger.info('Loaded and sorted posts', { 
    total: posts.length,
    titles: posts.map(p => p.title)
  });
  
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
  const pageLogger = buildLogger.withContext({ 
    operation: 'generatePostPage', 
    slug: post.slug 
  });
  
  const outputPath = path.join(config.outputDir, 'articles', post.slug, 'index.html');
  ensureDir(path.dirname(outputPath));
  
  try {
    const html = renderTemplate('post', {
      title: post.title,
      date: format(new Date(post.date), 'MMM d, yyyy'),
      content: post.content,
      description: post.description || post.title,
      url: `${config.siteUrl}/articles/${post.slug}/`
    });
    
    fs.writeFileSync(outputPath, html);
    const stats = fs.statSync(outputPath);
    
    pageLogger.debug('Generated post page', { 
      title: post.title,
      size: stats.size,
      path: outputPath
    });
  } catch (err) {
    pageLogger.error('Failed to generate post page', { 
      title: post.title,
      error: err 
    });
  }
}

// Generate articles archive page
function generateArchivePage(posts) {
  const archiveLogger = buildLogger.withContext({ operation: 'generateArchivePage' });
  
  const outputPath = path.join(config.outputDir, 'articles', 'index.html');
  ensureDir(path.dirname(outputPath));
  
  try {
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
    archiveLogger.info('Generated archive page', { postCount: posts.length });
  } catch (err) {
    archiveLogger.error('Failed to generate archive page', { error: err });
  }
}

// Generate homepage with integrated blog content
function generateHomepage(posts) {
  const homepageLogger = buildLogger.withContext({ operation: 'generateHomepage' });
  
  const outputPath = path.join(config.outputDir, 'index.html');
  ensureDir(path.dirname(outputPath));
  
  try {
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
    homepageLogger.info('Generated homepage', { 
      featuredCount: featuredPosts.length,
      recentCount: recentPosts.length 
    });
  } catch (err) {
    homepageLogger.error('Failed to generate homepage', { error: err });
  }
}

// Generate RSS feed
function generateRSSFeed(posts) {
  const rssLogger = buildLogger.withContext({ operation: 'generateRSSFeed' });
  
  const outputPath = path.join(config.outputDir, 'rss.xml');
  
  try {
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
    rssLogger.info('Generated RSS feed', { postCount: posts.length });
  } catch (err) {
    rssLogger.error('Failed to generate RSS feed', { error: err });
  }
}

// Copy static assets
function copyStaticAssets() {
  const assetsLogger = buildLogger.withContext({ operation: 'copyStaticAssets' });
  
  const staticFiles = [
    path.join(__dirname, '../../styles/styles.css'),
    path.join(__dirname, '../../styles/archive-styles.css'), 
    path.join(__dirname, '../../styles/multimedia-styles.css')
  ];
  
  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        const basename = path.basename(file);
        fs.copyFileSync(file, path.join(config.outputDir, basename));
        const stats = fs.statSync(file);
        assetsLogger.debug('Copied static asset', { 
          file: basename, 
          size: stats.size 
        });
      } catch (err) {
        assetsLogger.error('Failed to copy static asset', { 
          file: path.basename(file), 
          error: err 
        });
      }
    } else {
      assetsLogger.warn('Static asset not found', { file: path.basename(file) });
    }
  });
}

// Main build function
async function build() {
  const mainLogger = buildLogger.withContext({ operation: 'build' });
  
  mainLogger.info('🚀 Building site with multimedia support...');
  mainLogger.time('totalBuildTime');
  
  // Ensure output directory exists
  ensureDir(config.outputDir);
  ensureDir(config.templatesDir);
  
  // Get all posts
  mainLogger.time('loadPosts');
  const posts = await getAllPosts();
  mainLogger.timeEnd('loadPosts');
  mainLogger.info(`Found ${posts.length} posts`);
  
  // Generate pages
  const pageGroup = mainLogger.group('Generating pages');
  posts.forEach((post, index) => {
    mainLogger.progress(index + 1, posts.length, 'Generating posts');
    generatePostPage(post);
  });
  generateArchivePage(posts);
  generateHomepage(posts);
  generateRSSFeed(posts);
  pageGroup.end();
  
  // Copy static assets
  copyStaticAssets();
  
  const totalTime = mainLogger.timeEnd('totalBuildTime');
  
  mainLogger.info('✅ Build complete!', {
    duration: `${totalTime}ms`,
    outputDir: config.outputDir,
    posts: posts.length,
    preview: 'http://localhost:8000'
  });
}

// Run build
if (require.main === module) {
  build().catch(err => {
    buildLogger.error('Build failed', { 
      error: err,
      suggestion: 'Check the error details above and ensure all dependencies are installed'
    });
    process.exit(1);
  });
}

module.exports = { build, getAllPosts }; 