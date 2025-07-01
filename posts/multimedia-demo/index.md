---
title: 'Multimedia Blog Demo: Images and Videos'
date: '2025-01-07'
description: 'Demonstrating the new multimedia capabilities with responsive images and YouTube embeds'
---

# Multimedia Blog Demo: Images and Videos

This post demonstrates the new multimedia capabilities we've added to the blog, including responsive images and YouTube embeds.

## Image Support

Here's an example of an image with automatic optimization:

![A cybersecurity operations center with multiple monitors displaying security dashboards](./images/security-operations.jpg "Modern Security Operations Center")

The build process automatically:
- Generates multiple sizes (400w, 800w, 1200w)
- Creates WebP versions with JPEG fallbacks
- Adds lazy loading for performance
- Maintains aspect ratios

## YouTube Video Embeds

Let's embed a video about cloud security. Here's a Microsoft Azure security overview:

::: youtube
BYvHmPi9Lt8
:::

The YouTube embed features:
- Privacy-enhanced mode (youtube-nocookie.com)
- Responsive sizing
- Lazy loading with thumbnail preview
- No tracking until user clicks play

## Multiple Images in a Post

You can include multiple images throughout your content:

![Diagram showing cloud security shared responsibility model](./images/shared-responsibility.png "Cloud Security Shared Responsibility Model")

Each image is optimized independently and served in the most efficient format for the user's browser.

## Code and Media Together

When explaining technical concepts, you can mix code and media:

```bash
# Check Azure security recommendations
az security assessment list --query "[?displayName=='Enable MFA']"
```

![Azure Security Center dashboard showing recommendations](./images/azure-security-dashboard.jpg)

## Performance Considerations

Despite adding rich media, the page remains fast:
- Images lazy load below the fold
- YouTube videos load on-demand
- WebP format reduces file sizes by ~30%
- Responsive images serve appropriate sizes

This approach ensures the blog remains performant while supporting rich, engaging content. 