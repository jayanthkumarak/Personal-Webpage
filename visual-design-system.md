# Visual Design System

## Design Philosophy: DHH-Inspired Minimalism

### Core Principles
- **Typography First**: Text is the primary design element
- **Generous Whitespace**: Let content breathe
- **Minimal Color**: Black text, white background, single accent
- **Consistent Rhythm**: Predictable spacing and hierarchy
- **Mobile-First**: Designed for smallest screen first

## Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```
**Rationale**: System fonts for maximum performance and readability

### Font Sizes (Mobile-First)
```css
/* Base: 18px for optimal mobile reading */
--font-size-base: 1.125rem;    /* 18px */
--font-size-small: 0.875rem;   /* 14px */
--font-size-large: 1.25rem;    /* 20px */
--font-size-xl: 1.5rem;        /* 24px */
--font-size-xxl: 2rem;         /* 32px */
--font-size-xxxl: 2.5rem;      /* 40px */

/* Desktop Scaling */
@media (min-width: 768px) {
  --font-size-base: 1.25rem;   /* 20px */
  --font-size-large: 1.5rem;   /* 24px */
  --font-size-xl: 2rem;        /* 32px */
  --font-size-xxl: 2.5rem;     /* 40px */
  --font-size-xxxl: 3rem;      /* 48px */
}
```

### Typography Hierarchy
```css
/* Name/Title */
h1: var(--font-size-xxxl), font-weight: 700, line-height: 1.1

/* Section Headers */
h2: var(--font-size-xxl), font-weight: 600, line-height: 1.2

/* Subsection Headers */
h3: var(--font-size-xl), font-weight: 600, line-height: 1.3

/* Body Text */
p: var(--font-size-base), font-weight: 400, line-height: 1.6

/* Metadata (dates, tags) */
small: var(--font-size-small), font-weight: 400, line-height: 1.4
```

### Line Height & Spacing
- **Body Text**: 1.6 (optimal for readability)
- **Headers**: 1.1-1.3 (tighter for impact)
- **Code**: 1.4 (monospace adjustment)

## Color System

### Primary Palette (Minimal)
```css
/* Base Colors */
--color-text: #000000;          /* Pure black text */
--color-background: #ffffff;    /* Pure white background */
--color-border: #e5e5e5;        /* Light gray borders */

/* Accent Color (Minimal Usage) */
--color-accent: #0066cc;        /* Professional blue for links */
--color-accent-hover: #0052a3;  /* Darker blue for hover states */

/* Semantic Colors */
--color-muted: #666666;         /* Dates, metadata */
--color-light: #f8f8f8;         /* Very light backgrounds if needed */
```

### Color Usage Rules
- **Black text on white**: Primary reading experience
- **Blue accent**: Links and interactive elements only  
- **Gray text**: Dates, metadata, less important information
- **No other colors**: Maintain strict minimalism

## Spacing System

### Consistent Scale (8px base unit)
```css
--space-xs: 0.5rem;     /* 8px */
--space-sm: 1rem;       /* 16px */
--space-md: 1.5rem;     /* 24px */
--space-lg: 2rem;       /* 32px */
--space-xl: 3rem;       /* 48px */
--space-xxl: 4rem;      /* 64px */
--space-xxxl: 6rem;     /* 96px */
```

### Spacing Applications
- **Paragraph spacing**: var(--space-md)
- **Section spacing**: var(--space-xl) mobile, var(--space-xxl) desktop
- **Header margins**: var(--space-lg) top, var(--space-md) bottom
- **Line spacing**: Built into line-height

## Layout System

### Container Widths
```css
/* Mobile First */
.container {
  max-width: 100%;
  padding: 0 var(--space-md);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
    padding: 0 var(--space-xl);
  }
}
```

### Reading Experience Optimization
- **Optimal line length**: 65-75 characters
- **Single column**: No sidebars or complex layouts
- **Generous margins**: Focus attention on content

## Interactive Elements

### Links
```css
a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

a:hover {
  color: var(--color-accent-hover);
  text-decoration-thickness: 2px;
}
```

### Buttons (Minimal Usage)
```css
.button {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-base);
  text-decoration: none;
  display: inline-block;
}

.button:hover {
  background: var(--color-accent-hover);
}
```

## Content-Specific Styling

### Blog Post Excerpts
```css
.post-excerpt {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.post-meta {
  font-size: var(--font-size-small);
  color: var(--color-muted);
  margin-bottom: var(--space-sm);
}
```

### Code Blocks (for technical content)
```css
code {
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", 
               Consolas, "Courier New", monospace;
  background: var(--color-light);
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 0.9em;
}

pre {
  background: var(--color-light);
  padding: var(--space-md);
  border-radius: 4px;
  overflow-x: auto;
  line-height: 1.4;
}
```

## Responsive Design Principles

### Mobile-First Approach
1. **Design for 320px+**: Smallest modern phones
2. **Scale up gracefully**: Add space and size for larger screens
3. **Touch-friendly**: 44px minimum touch targets
4. **Readable without zoom**: 18px+ base font size

### Breakpoints
```css
/* Mobile: 320px - 767px (default) */
/* Tablet: 768px - 1023px */
@media (min-width: 768px) { /* tablet styles */ }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { /* desktop styles */ }
```

## Performance Considerations

### CSS Strategy
- **Single CSS file**: Minimize HTTP requests
- **Critical CSS inline**: Above-fold content styled inline
- **No CSS frameworks**: Custom, minimal CSS only
- **System fonts**: No web font loading

### Image Strategy
- **Minimal images**: Text-focused design
- **Optimized formats**: WebP with JPG fallback
- **Responsive images**: Multiple sizes for different screens
- **Lazy loading**: Below-fold images load on demand

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color contrast**: 4.5:1 minimum (black on white exceeds this)
- **Font size**: 18px+ base size for readability
- **Focus indicators**: Clear keyboard navigation
- **Semantic HTML**: Proper heading hierarchy
- **Alt text**: Descriptive image alternatives

### Screen Reader Optimization
- **Skip links**: Jump to main content
- **Aria labels**: Enhanced semantic meaning
- **Logical flow**: Content order matches visual order
- **No color-only meaning**: Text and icons together

## Brand Integration

### Professional Identity
- **Clean, authoritative**: Reflects cybersecurity expertise
- **Approachable**: Personal voice, not corporate
- **Trustworthy**: Consistent, reliable design
- **Current**: Modern web standards and practices

### Differentiation from DHH
- **Slightly warmer**: Less stark than pure black/white
- **Technical credibility**: Proper code styling for tech content
- **Professional context**: Suitable for client-facing work
- **Cybersecurity appropriate**: Serious but not intimidating

This design system provides the foundation for a clean, professional, highly readable website that prioritizes content while maintaining strong visual identity.