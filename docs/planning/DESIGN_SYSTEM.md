# Design System

## Design Philosophy

Inspired by David Heinemeier Hansson's minimalist approach, this site prioritizes:
- **Content over decoration**
- **Performance over features**
- **Substance over style**
- **Accessibility for all**

## Typography

### Font Stack
```css
/* Serif for body text (readability) */
--font-serif: 'Iowan Old Style', 'Palatino Linotype', 
              'URW Palladio L', P052, serif;

/* Sans-serif for UI elements */
--font-sans: -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, sans-serif;

/* Monospace for code */
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 
             'Roboto Mono', monospace;
```

### Type Scale
Using a 1.25 ratio for harmonious sizing:
```css
--font-size-xs: 0.8rem;
--font-size-sm: 0.9rem;
--font-size-base: 1.125rem;  /* ~18px */
--font-size-lg: 1.4rem;
--font-size-xl: 1.75rem;
--font-size-2xl: 2.2rem;
--font-size-3xl: 2.75rem;
```

## Color Palette

### Light Mode (Default)
```css
--color-ink: #1a1a1a;        /* Rich black for text */
--color-paper: #fafaf9;      /* Warm white background */
--color-accent: #0066cc;     /* Professional blue */
--color-muted: #666;         /* Metadata/secondary */
--color-border: #e5e5e5;     /* Subtle borders */
```

### Dark Mode (Planned)
```css
--color-ink: #e8e8e8;        /* Off-white text */
--color-paper: #1a1a1a;      /* Dark background */
--color-accent: #4da3ff;     /* Brighter blue */
--color-muted: #999;         /* Lighter secondary */
--color-border: #333;        /* Subtle borders */
```

## Spacing System

Based on 8px grid for consistency:
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
```

## Layout Principles

### Content Width
- Optimal reading: 65ch (~650px)
- Wide content: 85ch (~850px)
- Full-bleed images extend beyond

### Responsive Breakpoints
```css
/* Mobile-first approach */
@media (min-width: 640px)  { /* Tablet */ }
@media (min-width: 768px)  { /* Small laptop */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## Component Patterns

### Links
- Underlined by default
- Thicker underline on hover
- Sufficient tap target (44px minimum)

### Buttons (Future)
```css
.button {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-accent);
  color: white;
  border-radius: 0.25rem;
  font-weight: 600;
}
```

### Cards
- Subtle shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Lift on hover
- Rounded corners: `0.25rem`

## Accessibility Requirements

1. **Color Contrast**
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Check all color combinations

2. **Focus States**
   - Visible outline
   - High contrast
   - No outline removal

3. **Motion**
   - Respect `prefers-reduced-motion`
   - Provide pause controls
   - Avoid autoplay

4. **Screen Readers**
   - Semantic HTML
   - Proper ARIA labels
   - Logical heading hierarchy

## Performance Budget

### CSS Limits
- Base styles: 6KB
- Typography: 2KB
- Colors & themes: 2KB
- Components: 3KB
- **Total target: <15KB**

### Image Guidelines
- Optimize all images
- Use WebP with fallbacks
- Lazy load below fold
- Appropriate sizes

## Future Enhancements

### Phase 1 (Current)
- Basic typography
- Minimal color palette
- Responsive images
- Accessibility compliance

### Phase 2 (Planned)
- Dark mode toggle
- Smooth transitions
- Enhanced focus states
- Print styles

### Phase 3 (Future)
- CSS Grid layouts
- Advanced animations
- Component library
- Theme customization 