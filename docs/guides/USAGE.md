# Multimedia Usage Guide

## Overview

The blog now supports rich multimedia content including responsive images and YouTube video embeds. This guide explains how to use these features in your posts.

## New Post Structure

Posts can now be either:
1. **Simple posts**: Single markdown files (e.g., `my-post.md`)
2. **Rich posts**: Directories with assets (e.g., `my-post/index.md` + `my-post/images/`)

For posts with images, use the directory structure:

```
posts/
  my-awesome-post/
    index.md          # Your post content
    images/
      hero.jpg        # Your images
      diagram.png
      screenshot.webp
```

## Adding Images

### Basic Image Syntax

```markdown
![Alt text describing the image](./images/photo.jpg)
```

### Image with Caption

```markdown
![Security dashboard showing real-time threats](./images/dashboard.jpg "Real-time threat monitoring dashboard")
```

The text in quotes becomes a caption below the image.

### Image Best Practices

1. **Always include alt text** - Describes the image for screen readers
2. **Use descriptive filenames** - `security-dashboard.jpg` not `img1.jpg`
3. **Original size** - Provide high-quality originals; the build process handles optimization
4. **Supported formats** - JPEG, PNG, WebP

The build process automatically:
- Generates 3 sizes: 400w, 800w, 1200w
- Creates WebP versions for modern browsers
- Provides JPEG fallbacks
- Adds lazy loading
- Maintains aspect ratios

## Adding YouTube Videos

### YouTube Embed Syntax

```markdown
::: youtube
VIDEO_ID_HERE
:::
```

### Example

To embed this video: `https://www.youtube.com/watch?v=BYvHmPi9Lt8`

```markdown
::: youtube
BYvHmPi9Lt8
:::
```

### YouTube Features

- Privacy-enhanced mode (no cookies until play)
- Responsive 16:9 aspect ratio
- Lazy loading for performance
- Accessible iframe attributes

## Complete Example Post

```markdown
---
title: 'Cloud Security Best Practices in 2025'
date: '2025-01-07'
description: 'Essential security practices for modern cloud environments'
---

# Cloud Security Best Practices in 2025

Cloud security has evolved significantly. Here's what you need to know.

## The Current Landscape

![Cloud security architecture diagram](./images/cloud-architecture.png "Modern cloud security architecture")

As shown in the diagram above, modern cloud security involves multiple layers...

## Video Tutorial

Here's a comprehensive overview of Azure security features:

::: youtube
dQw4w9WgXcQ
:::

## Implementation Steps

1. Enable MFA across all accounts
2. Implement least-privilege access
3. Use cloud-native security tools

![Azure Security Center dashboard](./images/azure-dashboard.jpg "Security recommendations in Azure")

The dashboard shows critical recommendations...
```

## Building Your Post

1. Create your post directory:
   ```bash
   mkdir posts/your-post-title
   mkdir posts/your-post-title/images
   ```

2. Add your content:
   ```bash
   # Create index.md with your content
   # Add images to the images/ folder
   ```

3. Build the site:
   ```bash
   npm run build:multimedia
   ```

4. Preview locally:
   ```bash
   npm run serve:dist
   ```

## Performance Tips

1. **Image Optimization**
   - The build process handles optimization
   - Avoid images larger than 3MB
   - Use JPEG for photos, PNG for diagrams

2. **Video Best Practices**
   - Use YouTube for video hosting
   - Consider adding a thumbnail image before the video
   - Mention video duration in your text

## Troubleshooting

### Images Not Showing
- Check the path starts with `./images/`
- Ensure image is in the `images/` folder
- Verify supported format (JPEG, PNG, WebP)

### Build Errors
- Check for special characters in filenames
- Ensure markdown syntax is correct
- Look for error messages in build output

### Performance Issues
- Images are automatically optimized
- Use reasonable original sizes (max 3000px wide)
- Videos load on-demand

## Future Enhancements

Coming in Phase 3:
- Image galleries
- Twitter/X embeds
- GitHub Gist embeds
- Audio players

## Need Help?

If you encounter issues:
1. Check the build output for errors
2. Verify your markdown syntax
3. Ensure files are in the correct locations
4. Review this guide for proper usage 