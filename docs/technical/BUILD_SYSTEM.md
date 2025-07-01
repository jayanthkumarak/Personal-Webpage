# Build System Documentation

## Overview

The build system transforms Markdown content into a static website with optimized multimedia support.

## Build Scripts

### `build.js` (Legacy)
- Basic Markdown to HTML conversion
- No image processing
- Simple and fast for text-only content

### `build-multimedia.js` (Current)
- Full multimedia support
- Image optimization pipeline
- YouTube embed processing
- Backwards compatible with simple posts

## Build Pipeline

### 1. Post Discovery
```javascript
// Supports both formats:
posts/simple-post.md          // Text-only post
posts/rich-post/             // Post with assets
  ├── index.md
  └── images/
```

### 2. Markdown Processing
- **Parser**: markdown-it with plugins
- **Front-matter**: Extracted using front-matter package
- **Custom Renderers**:
  - Images → Responsive picture elements
  - YouTube → Privacy-enhanced embeds

### 3. Image Processing
For each image in a post:
1. Generate multiple sizes (400w, 800w, 1200w)
2. Create WebP versions with JPEG fallbacks
3. Copy original as fallback
4. Update HTML with responsive markup

### 4. Template Rendering
Simple variable replacement in templates:
```javascript
{{title}}       → Post title
{{date}}        → Formatted date
{{content}}     → Rendered HTML
{{description}} → Meta description
```

### 5. Static Asset Generation
- Homepage with featured posts
- Archive page with all posts
- RSS feed
- Individual post pages

## Configuration

Edit in `build-multimedia.js`:
```javascript
const config = {
  postsDir: 'posts',
  outputDir: 'dist',
  templatesDir: 'templates',
  siteUrl: 'https://jayanthkumar.com',
  siteName: 'Jayanth Kumar',
  siteDescription: '...',
  imageSizes: [400, 800, 1200],
  imageFormats: ['webp', 'jpeg']
};
```

## Extending the Build

### Adding a Markdown Plugin
```javascript
const myPlugin = require('markdown-it-myplugin');
md.use(myPlugin, { /* options */ });
```

### Adding a New Template Variable
In `renderTemplate()`:
```javascript
template = template.replace(/{{myVar}}/g, data.myVar || 'default');
```

### Processing Other Assets
Add to `processPostImages()` or create similar function:
```javascript
// Example: Process videos
async function processPostVideos(postDir, slug) {
  // Similar pattern to image processing
}
``` 