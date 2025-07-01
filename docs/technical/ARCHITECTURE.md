# Architecture Overview

## System Design

This is a static site generator built with Node.js that transforms Markdown content into a fast, accessible website.

### Core Components

1. **Build System** (`build-multimedia.js`)
   - Markdown parsing with front-matter
   - Image processing pipeline (Sharp)
   - YouTube embed support
   - Template rendering
   - Static asset generation

2. **Optimization Pipeline** (`optimize.js`)
   - CSS minification (csso)
   - HTML compression
   - Security header injection
   - Sitemap generation
   - Performance reporting

3. **Accessibility Auditor** (`accessibility-audit.js`)
   - Automated WCAG checks
   - Color contrast validation
   - Semantic HTML verification
   - Skip link detection

## Data Flow

```
posts/*.md → Parser → Templates → HTML → Optimization → dist/
     ↓
  images/ → Sharp → Responsive Images → dist/articles/*/images/
```

## Technology Stack

- **Runtime**: Node.js 16+
- **Markdown**: markdown-it with plugins
- **Image Processing**: Sharp
- **CSS Optimization**: csso
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Design Principles

1. **No Client-Side JavaScript** - Everything works without JS
2. **Progressive Enhancement** - Modern features for modern browsers
3. **Performance Budget** - <100KB total, <3s load time
4. **Accessibility First** - WCAG 2.1 AA compliance

## File Structure

### Input Files
- `posts/` - Markdown content
- `templates/` - HTML templates with {{variables}}
- `styles.css` - Main stylesheet
- `multimedia-styles.css` - Media-specific styles

### Output Structure
```
dist/
├── index.html              # Homepage
├── articles/
│   ├── index.html         # Archive page
│   └── [slug]/
│       ├── index.html     # Article page
│       └── images/        # Optimized images
├── styles.css             # Minified CSS
├── sitemap.xml
├── robots.txt
├── rss.xml
└── *.report.json          # Build reports
```

## Build Process

1. **Discovery** - Find all posts (`.md` files or directories)
2. **Parsing** - Extract front-matter and render Markdown
3. **Image Processing** - Generate responsive images
4. **Rendering** - Apply templates to create HTML
5. **Optimization** - Minify and add security headers
6. **Auditing** - Check accessibility and performance

## Extension Points

- Add new markdown-it plugins for custom syntax
- Create new templates in `templates/`
- Add post-processing steps in `optimize.js`
- Extend accessibility checks in `accessibility-audit.js` 