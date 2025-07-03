# Design Tokens

_Phase-2 Visual Foundation_

This document explains the **design token** system introduced in Phase 2. All colours, spacing, and typography are defined in `styles/design-tokens.css` and exposed as CSS custom properties (variables). Components and pages should **only reference these variables**—never hard-code hex values or magic numbers.

## File Locations

| Purpose | File |
|---------|------|
| Token definitions | `styles/design-tokens.css` |
| Global styles that consume tokens | `styles/styles.css` |
| Component-specific styles | `styles/components/*` |
| Theme toggle JS | `scripts/theme-toggle.js` |

## Token Categories

1. **Typography**  
   ```css
   --font-family-serif   /* Source Serif 4 */
   --font-family-sans    /* System UI */
   --font-family-base    /* Body text (serif) */
   --font-size-*         /* Modular scale */
   ```

2. **Colour (Light)**  
   ```css
   --color-text          /* #08040A */
   --color-background    /* #FFFFFF */
   --color-surface       /* #F9F7F4 */
   --color-accent        /* #A98BFF */
   --color-accent-hover  /* #6B46FF */
   --color-muted         /* #675C7A */
   ```

3. **Colour (Dark)** – Automatically applied via `@media (prefers-color-scheme: dark)` and can be overridden by `[data-theme]` attribute.

4. **Spacing**  (`--space-xs` .. `--space-xxxl`) – based on an 8 px grid.

## Usage Guidelines

```css
.my-card {
  background: var(--color-surface);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  font-family: var(--font-family-base);
}

.my-card__title {
  color: var(--color-accent);
  font-size: var(--font-size-xl);
}
```

• Never reference raw hex codes—always use a token.  
• Components may define **local** variables (e.g. `--carousel-height`) but should derive their values from global tokens.

## Theming API

The theme toggle works by setting `data-theme="light" | "dark"` on the `<html>` element. Components inherit the correct values automatically—no extra work required.

```js
// Example: force dark mode
document.documentElement.dataset.theme = 'dark';
```

## Performance Budget

Total CSS (all files) must remain under **15 KB gzip**. Run:

```bash
npm run check:css-budget
```

CI will fail if the budget is exceeded.

## Adding New Tokens

1. Edit `styles/design-tokens.css`.  
2. Update both light & dark sections.  
3. Document the new token in this file.  
4. Ensure contrast ratios meet WCAG AA.

---

For questions, contact the visual-foundation owners.