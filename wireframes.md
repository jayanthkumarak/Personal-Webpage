# Wireframes & Layout Design

## Mobile Layout (320px - 767px)

### Homepage Structure
```
┌─────────────────────┐
│ JAYANTH KUMAR       │ ← H1, large, bold
│                     │
│ I'm a security      │ ← Introduction paragraph
│ consultant who      │   18px font, 1.6 line height
│ helps organizations │   32px bottom margin
│ secure their Azure  │
│ and M365 envs...    │
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ ← Visual separator (optional)
│                     │
│ RIGHT NOW           │ ← H2, section header
│                     │   24px font, 24px bottom margin
│ I'm working with    │ ← Current work content
│ clients to harden   │   Regular paragraph style
│ their cloud...      │   48px section spacing
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ RECENT INSIGHTS     │ ← H2, section header
│                     │
│ • Is your team      │ ← Featured post excerpt
│   'log ready'?      │   Title: 20px, bold
│   Aug 11, 2023      │   Date: 14px, gray
│   Brief excerpt...  │   Excerpt: 18px, normal
│   [Read more]       │   Link: blue, underlined
│                     │   24px between posts
│ • Threat hunting    │
│   overview          │
│   Jan 23, 2022      │
│   Brief excerpt...  │
│   [Read more]       │
│                     │
│ • Log4j explainer   │
│   Dec 14, 2021      │
│   Brief excerpt...  │
│   [Read more]       │
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ BACKGROUND          │ ← H2, section header
│                     │
│ I've been working   │ ← Professional background
│ in cybersecurity    │   Multiple paragraphs
│ for X years...      │   Standard paragraph spacing
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ HOW WE WORK         │ ← H2, section header
│ TOGETHER            │
│                     │
│ I help organizations│ ← Services description
│ with:               │   Bullet points or paragraphs
│ • Cloud hardening   │   Clear, specific offerings
│ • Threat hunting    │
│ • Security audits   │
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ ALL ARTICLES        │ ← H2, section header
│                     │
│ Is your team 'log   │ ← Recent articles list
│ ready'?             │   Title: 18px, bold
│ Aug 11, 2023        │   Date: 14px, gray
│                     │   Brief excerpt
│ Threat hunting      │   16px between articles
│ overview            │
│ Jan 23, 2022        │
│                     │
│ [View all articles] │ ← Link to archive
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ GET IN TOUCH        │ ← H2, section header
│                     │
│ Email:              │ ← Simple contact info
│ jayanth@example.com │   Email as mailto link
│                     │   
│ LinkedIn: /in/...   │ ← Professional profiles
│                     │   Blue links, underlined
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ © 2024 Jayanth K.   │ ← Minimal footer
│                     │   Small, gray text
└─────────────────────┘
```

### Mobile Layout Specifications
- **Container**: Full width with 24px side padding
- **Vertical spacing**: 48px between major sections
- **Typography**: 18px base, 40px h1, 24px h2
- **Touch targets**: 44px minimum for links
- **Reading width**: Full container width

## Desktop Layout (1024px+)

### Homepage Structure
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│           JAYANTH KUMAR                                                 │ ← Centered, larger
│                                                                         │
│           I'm a security consultant who helps organizations             │ ← Centered intro
│           secure their Azure and Microsoft 365 environments.           │   Max width: 600px
│           I work with clients to harden their cloud environments       │   Centered on page
│           and perform proactive security operations and threat hunts.   │
│                                                                         │
│                           ─ ─ ─ ─ ─ ─ ─ ─ ─                           │
│                                                                         │
│           RIGHT NOW                                                     │ ← Section headers
│                                                                         │   Larger spacing
│           I'm working with clients to understand emerging threats       │ ← Content blocks
│           in cloud environments, particularly around identity and       │   Same max-width
│           access management. Recent focus areas include...              │   More generous
│                                                                         │   line spacing
│                           ─ ─ ─ ─ ─ ─ ─ ─ ─                           │
│                                                                         │
│           RECENT INSIGHTS                                               │ ← Section header
│                                                                         │
│           Is your team 'log ready'?                    Aug 11, 2023     │ ← Featured posts
│           Cybersecurity spotlight on audit and event logging within     │   Title and date
│           Microsoft's Azure and M365 environments. This post covers... │   on same line
│           [Read more]                                                   │   (desktop only)
│                                                                         │
│           An overview of Threat hunting                Jan 23, 2022     │ ← More space
│           Explores threat hunting as an emerging discipline in          │   between posts
│           information security, covering methodologies and tools...     │   on desktop
│           [Read more]                                                   │
│                                                                         │
│           The quick log4j vulnerability explainer     Dec 14, 2021      │
│           Explanation of the zero-day vulnerability in log4j, its       │
│           impact on enterprise environments, and mitigation steps...    │
│           [Read more]                                                   │
│                                                                         │
│                           ─ ─ ─ ─ ─ ─ ─ ─ ─                           │
│                                                                         │
│           [Rest of content follows same pattern]                        │
│                                                                         │
│                           ─ ─ ─ ─ ─ ─ ─ ─ ─                           │
│                                                                         │
│                     © 2024 Jayanth Kumar                               │ ← Centered footer
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Desktop Layout Specifications
- **Container**: 800px max width, centered
- **Side padding**: 48px from container edges
- **Vertical spacing**: 64px between major sections
- **Typography**: 20px base, 48px h1, 32px h2
- **Line length**: 65-75 characters optimal
- **Featured posts**: Title and date on same line

## Blog Archive Page Layout

### Mobile Archive
```
┌─────────────────────┐
│ ← Back to Home      │ ← Simple navigation
│                     │
│ ALL ARTICLES        │ ← Page title
│                     │
│ Is your team 'log   │ ← Chronological list
│ ready'?             │   Full post title
│ Aug 11, 2023        │   Publication date
│ Brief excerpt of    │   Short excerpt
│ the post content... │   Link to full post
│                     │
│ An overview of      │ ← Next post
│ Threat hunting      │   Same format
│ Jan 23, 2022        │   24px spacing
│ Brief excerpt...    │   between posts
│                     │
│ Y22K? Microsoft     │
│ Exchange malware... │
│ Jan 1, 2022         │
│ Brief excerpt...    │
│                     │
│ [Continue for all   │
│  posts...]          │
│                     │
│ ← Back to Home      │ ← Bottom navigation
└─────────────────────┘
```

### Desktop Archive
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│           ← Back to Home                                                │
│                                                                         │
│           ALL ARTICLES                                                  │
│                                                                         │
│           Is your team 'log ready'?                    Aug 11, 2023     │
│           Cybersecurity spotlight on audit and event logging within     │
│           Microsoft's Azure and M365 environments...                    │
│                                                                         │
│           An overview of Threat hunting                Jan 23, 2022     │
│           Explores threat hunting as an emerging discipline in          │
│           information security, covering methodologies...               │
│                                                                         │
│           Y22K? Microsoft Exchange malware scanning    Jan 1, 2022      │
│           Microsoft Exchange server date interpretation issue           │
│           causing email traffic problems...                             │
│                                                                         │
│           [Continue for all posts...]                                   │
│                                                                         │
│           ← Back to Home                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Individual Blog Post Layout

### Mobile Post
```
┌─────────────────────┐
│ ← Back to Articles  │ ← Navigation
│                     │
│ Is your team 'log   │ ← Post title (H1)
│ ready'?             │   Larger font
│                     │
│ Aug 11, 2023        │ ← Publication date
│ By Jayanth Kumar    │   Author (optional)
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ [Post content in    │ ← Article content
│  standard markdown  │   Standard typography
│  formatting with    │   Code blocks styled
│  paragraphs, lists, │   Images responsive
│  code blocks, etc.] │   Links colored
│                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                     │
│ ← Back to Articles  │ ← Bottom navigation
│   Home →            │   Multiple options
└─────────────────────┘
```

### Desktop Post
- Same structure as mobile
- Wider container (800px max)
- Larger typography
- More generous spacing

## Layout Implementation Notes

### CSS Grid/Flexbox Strategy
```css
/* Main container */
.container {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section spacing */
.section {
  margin-bottom: 3rem; /* 48px mobile */
}

@media (min-width: 1024px) {
  .section {
    margin-bottom: 4rem; /* 64px desktop */
  }
}
```

### Responsive Images
```css
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5rem 0;
}
```

### Typography Scaling
```css
/* Mobile-first typography */
h1 { font-size: 2.5rem; }   /* 40px */
h2 { font-size: 1.5rem; }   /* 24px */
p  { font-size: 1.125rem; } /* 18px */

/* Desktop scaling */
@media (min-width: 1024px) {
  h1 { font-size: 3rem; }   /* 48px */
  h2 { font-size: 2rem; }   /* 32px */
  p  { font-size: 1.25rem; } /* 20px */
}
```

## Accessibility Considerations

### Focus Management
- Skip link to main content
- Logical tab order
- Visible focus indicators
- Keyboard navigation for all interactive elements

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text for any images
- Descriptive link text

### Mobile Usability
- Touch targets 44px minimum
- Adequate contrast ratios
- Readable font sizes without zoom
- Horizontal scrolling avoided

This wireframe foundation ensures the site will be highly readable, accessible, and performant across all devices while maintaining the minimalist aesthetic inspired by DHH's approach.