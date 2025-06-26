# AI-Readable Project Documentation

This document is specifically formatted for AI assistants to understand and work with this codebase effectively. It provides structured information about the project architecture, dependencies, and implementation patterns.

## Project Classification

**Type**: Static Site Generator for Personal Website  
**Architecture**: Node.js-based build system generating static HTML/CSS  
**Purpose**: DHH-inspired minimalist personal website for security consultant  
**Target Audience**: Technical professionals, potential clients, blog readers  
**Deployment**: Static hosting (Netlify, Vercel, GitHub Pages)

## Core Technologies

```json
{
  "runtime": "Node.js 16+",
  "dependencies": {
    "markdown-it": "^14.0.0",
    "markdown-it-anchor": "^8.6.7", 
    "front-matter": "^4.0.2",
    "date-fns": "^3.0.6"
  },
  "languages": ["JavaScript", "HTML5", "CSS3", "Markdown"],
  "frameworks": "None (Vanilla implementation)",
  "build_tools": ["Custom Node.js scripts"],
  "deployment": "Static files only"
}
```

## File System Structure

```
ProjectChimera/                    # Root directory
├── README.md                      # Human-readable overview
├── PROJECT_DOCUMENTATION.md       # Detailed project docs
├── TECHNICAL_DOCUMENTATION.md     # Technical deep dive
├── DEPLOYMENT.md                  # Deployment instructions
├── AI_READABLE_DOCUMENTATION.md   # This file
├── package.json                   # Node.js project config
├── build.js                       # Main build script (entry point)
├── optimize.js                    # Performance optimization script
├── accessibility-audit.js         # Accessibility testing script
├── styles.css                     # Main stylesheet (mobile-first)
├── archive-styles.css             # Additional styles for archive pages
├── index.html                     # Static homepage (pre-build reference)
├── posts/                         # Markdown content directory
│   ├── *.md                      # Individual blog posts with frontmatter
├── templates/                     # HTML template files
│   ├── index.html                # Homepage template
│   ├── post.html                 # Individual post template
│   ├── archive.html              # Archive page template
│   └── analytics.html            # Analytics code snippets
├── articles/                     # Static files (pre-build reference)
└── dist/                         # Generated output (build target)
    ├── index.html                # Generated homepage
    ├── *.css                     # Minified stylesheets
    ├── articles/                 # Generated blog structure
    ├── sitemap.xml              # SEO sitemap
    ├── robots.txt               # Search engine directives
    ├── rss.xml                  # RSS feed
    └── *-report.{json,md}       # Generated reports
```

## Build System Architecture

### Entry Points

1. **Primary Build**: `node build.js`
2. **Production Build**: `npm run build:prod` (chains build → optimize → audit)
3. **Development**: `npm run dev` (build + local server)

### Data Flow

```
Input Sources → Processing → Output
├── posts/*.md → parseMarkdownFile() → dist/articles/*/index.html
├── templates/*.html → renderTemplate() → dist/*.html
├── styles.css → minifyCSS() → dist/styles.css
└── Static assets → copyStaticAssets() → dist/*
```

### Core Functions (build.js)

```javascript
// Main pipeline functions - AI can call these conceptually
getAllPosts()                    // Returns: Array<PostObject>
parseMarkdownFile(filePath)      // Returns: PostObject with content, metadata
renderTemplate(name, data)       // Returns: String (HTML with variables replaced)
generatePostPage(post)           // Side effect: Creates individual post HTML
generateArchivePage(posts)       // Side effect: Creates blog archive
generateHomepage(posts)          // Side effect: Creates homepage with integrated content
generateRSSFeed(posts)          // Side effect: Creates XML RSS feed
copyStaticAssets()              // Side effect: Copies CSS and static files
```

## Data Structures

### Post Object Schema

```javascript
{
  title: String,           // Required: Post title for display
  date: String,           // Required: ISO date string (YYYY-MM-DD)
  description: String,    // Required: SEO meta description
  excerpt: String,        // Optional: Custom excerpt for homepage
  content: String,        // Generated: Processed HTML from markdown
  slug: String,          // Generated: URL slug from filename
  filename: String       // Generated: Original file path
}
```

### Frontmatter Format

```yaml
---
title: "Post Title Here"
date: "2024-01-15"
description: "SEO-friendly description for search engines and social sharing"
excerpt: "Optional brief excerpt for homepage display"
---

# Markdown content starts here
```

### Template Variables

Templates use `{{variable}}` syntax for replacement:

```html
<!-- Homepage template variables -->
{{title}}           # Page title
{{description}}     # Meta description  
{{featuredPosts}}   # HTML string of featured post cards
{{recentArticles}}  # HTML string of recent article listings

<!-- Post template variables -->
{{title}}           # Post title
{{date}}            # Formatted date string
{{content}}         # Processed markdown HTML
{{description}}     # Post description
{{url}}             # Canonical post URL
```

## Content Processing Pipeline

### Markdown Processing

```javascript
// Configuration for markdown-it processor
const markdownConfig = {
  html: true,        // Allow HTML tags in markdown
  linkify: true,     // Auto-convert URLs to links
  typographer: true  // Smart quotes and typography
};

// Plugins
markdownItAnchor   // Adds anchor links to headings
```

### Content Validation Rules

- **Required frontmatter**: title, date, description
- **Date format**: ISO string (YYYY-MM-DD)
- **File naming**: Kebab-case recommended for URLs
- **Image references**: Must exist in project structure
- **Internal links**: Validated during build

## Styling System

### CSS Architecture

```css
/* CSS Custom Properties (Design System) */
:root {
  /* Typography Scale */
  --font-size-base: 1.125rem;    /* 18px mobile, 20px desktop */
  --font-size-large: 1.25rem;    /* 20px mobile, 24px desktop */
  --font-size-xl: 1.5rem;        /* 24px mobile, 32px desktop */
  
  /* Color Palette (Minimal) */
  --color-text: #000000;          /* Pure black text */
  --color-background: #ffffff;    /* Pure white background */
  --color-accent: #0066cc;        /* Blue for links only */
  --color-muted: #666666;         /* Gray for metadata */
  
  /* Spacing Scale (8px base unit) */
  --space-sm: 1rem;               /* 16px */
  --space-md: 1.5rem;             /* 24px */
  --space-lg: 2rem;               /* 32px */
  --space-xl: 3rem;               /* 48px */
  --space-xxl: 4rem;              /* 64px */
}
```

### Responsive Strategy

- **Mobile-first**: Base styles for 320px+
- **Breakpoints**: 768px (tablet), 1024px (desktop)
- **Typography scaling**: Font sizes increase at breakpoints
- **Container**: Max-width 800px, centered with padding

### Performance Optimizations

- **System fonts only**: No web font loading
- **Single CSS file**: Minimizes HTTP requests
- **CSS minification**: Removes comments, whitespace, redundancy
- **Critical CSS**: Above-fold styles prioritized

## Build Scripts Reference

### NPM Scripts

```json
{
  "build": "node build.js",                                           // Development build
  "build:prod": "node build.js && node optimize.js && node accessibility-audit.js", // Production
  "optimize": "node optimize.js",                                     // Minify and optimize
  "audit": "node accessibility-audit.js",                            // Accessibility check
  "dev": "node build.js && python3 -m http.server 8000",            // Development server
  "serve": "python3 -m http.server 8000",                           // Serve current directory
  "serve:dist": "cd dist && python3 -m http.server 8001",           // Serve built site
  "clean": "rm -rf dist/*"                                           // Clean output directory
}
```

### Build Configuration

```javascript
// build.js configuration object
const config = {
  postsDir: 'posts',                           // Markdown files location
  outputDir: 'dist',                          // Build output directory
  templatesDir: 'templates',                  // HTML templates location
  siteUrl: 'https://jayanthkumar.com',       // Base URL for absolute links
  siteName: 'Jayanth Kumar',                 // Site name for metadata
  siteDescription: 'Security consultant...'  // Default description
};
```

## Accessibility Implementation

### Automated Checks

The accessibility audit system (`accessibility-audit.js`) validates:

```javascript
// Accessibility rules implemented
const accessibilityRules = [
  'img-alt',           // Images must have alt attributes
  'heading-hierarchy', // Proper h1→h2→h3 progression
  'link-context',      // Links must have meaningful text
  'skip-links',        // Pages should include skip navigation
  'color-contrast'     // Basic contrast validation
];

// Severity levels
const severityLevels = ['error', 'warning'];

// Report format
{
  file: String,                    // Relative file path
  issues: Array<IssueObject>,     // Found accessibility issues
  summary: {
    errors: Number,               // Count of error-level issues
    warnings: Number,             // Count of warning-level issues
    total: Number                 // Total issue count
  }
}
```

### WCAG 2.1 AA Compliance Features

- **Semantic HTML**: Proper landmarks, headings, lists
- **Keyboard navigation**: Skip links, logical tab order
- **Screen reader support**: ARIA labels, semantic structure
- **Color contrast**: High contrast ratios (>4.5:1)
- **Responsive text**: Readable at 200% zoom

## SEO Implementation

### Structured Data

```javascript
// JSON-LD schema for homepage
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jayanth Kumar",
  "jobTitle": "Security Consultant",
  "knowsAbout": ["Cybersecurity", "Cloud Security", "Azure", "M365"]
};
```

### Meta Tags Template

```html
<!-- SEO meta tags pattern -->
<meta name="description" content="{{description}}">
<meta property="og:title" content="{{title}}">
<meta property="og:description" content="{{description}}">
<meta property="og:type" content="website|article">
<meta name="twitter:card" content="summary">
```

### Sitemap Generation

```xml
<!-- Auto-generated sitemap.xml structure -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jayanthkumar.com</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <!-- Individual posts with priority 0.6 -->
</urlset>
```

## Performance Metrics

### Size Budget

```json
{
  "total_budget": "100KB",
  "current_size": "62KB", 
  "breakdown": {
    "html": "50KB",
    "css": "9KB", 
    "javascript": "0KB",
    "images": "3KB"
  }
}
```

### Optimization Results

```json
{
  "css_minification": "41.2% reduction",
  "html_minification": "5-28% reduction per file",
  "lighthouse_score": "95+ expected",
  "loading_time": "<1 second first contentful paint"
}
```

## Common AI Assistant Tasks

### Adding New Content

```javascript
// To help user add new post:
// 1. Create file: posts/new-post-slug.md
// 2. Add frontmatter with required fields
// 3. Write markdown content
// 4. Run: npm run build
```

### Modifying Styles

```css
/* To help user modify design: */
/* 1. Edit CSS custom properties in styles.css */
/* 2. Maintain mobile-first responsive approach */  
/* 3. Keep accessibility contrast ratios */
/* 4. Test with npm run build:prod */
```

### Troubleshooting Build Issues

```javascript
// Common build problems and solutions:
// 1. Missing frontmatter → Check YAML syntax
// 2. Date format errors → Use YYYY-MM-DD format
// 3. Template variables → Verify {{variable}} spelling
// 4. File permissions → Check file read/write access
```

### Customizing Content Structure

```javascript
// To modify homepage content:
// 1. Edit templates/index.html
// 2. Update static content sections
// 3. Modify build.js if changing data structure
// 4. Rebuild with npm run build
```

## Security Considerations

### Input Sanitization

- **Markdown processing**: XSS protection via markdown-it
- **No user input**: Static generation prevents injection
- **Template safety**: Simple string replacement, no eval()

### Security Headers

```html
<!-- Auto-injected security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

## Deployment Targets

### Static Hosting Requirements

```json
{
  "requirements": {
    "static_files": true,
    "custom_domain": true,
    "https": true,
    "build_automation": "optional"
  },
  "recommended_providers": [
    "Netlify",
    "Vercel", 
    "GitHub Pages",
    "Traditional hosting"
  ]
}
```

### Build Output

```
dist/                           # Deployment artifact
├── index.html                  # Homepage (entry point)
├── styles.css                  # Minified styles
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Search engine directives
├── rss.xml                    # RSS feed
└── articles/                  # Blog structure
    ├── index.html             # Archive page
    └── {slug}/index.html      # Individual posts
```

## Error Handling Patterns

### Build Process Errors

```javascript
// Error types the build system handles:
try {
  const posts = getAllPosts();
} catch (error) {
  if (error.code === 'ENOENT') {
    // Missing posts directory
    console.log('Creating posts directory...');
    ensureDir(config.postsDir);
  }
}
```

### Content Validation Errors

```javascript
// Frontmatter validation
if (!attributes.title || !attributes.date || !attributes.description) {
  throw new Error(`Missing required frontmatter in ${filename}`);
}

// Date format validation
if (!isValidDate(attributes.date)) {
  throw new Error(`Invalid date format in ${filename}. Use YYYY-MM-DD`);
}
```

## AI Assistant Interaction Guidelines

### Understanding User Intent

1. **Content Creation**: User wants to add/edit blog posts
2. **Design Changes**: User wants to modify visual appearance
3. **Build Issues**: User encounters errors during build process
4. **Deployment**: User wants to publish the site
5. **Performance**: User wants to optimize loading speed
6. **Accessibility**: User wants to improve accessibility compliance

### Providing Helpful Responses

1. **Be Specific**: Reference exact file names and line numbers
2. **Show Code**: Provide exact code snippets for changes
3. **Explain Impact**: Describe how changes affect the site
4. **Test Instructions**: Always include build/test commands
5. **Backup Recommendations**: Suggest git commits before major changes

### Common User Questions Patterns

- "How do I add a new blog post?" → Point to posts/ directory and frontmatter
- "How do I change colors?" → Point to CSS custom properties
- "The build is failing" → Check frontmatter syntax and file permissions
- "How do I deploy this?" → Reference DEPLOYMENT.md and hosting options
- "Is this accessible?" → Run npm run audit and explain results

This documentation provides AI assistants with the structured information needed to effectively help users work with this codebase while maintaining the project's design philosophy and technical standards.