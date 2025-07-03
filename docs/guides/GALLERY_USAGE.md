# Image Gallery Usage Guide

This guide explains how to use the new image gallery and carousel features in your blog posts.

## Quick Start

To create an image gallery, use the `:::gallery` container syntax in your Markdown:

```markdown
::: gallery
![Alt text](./images/photo1.jpg "Caption 1")
![Alt text](./images/photo2.jpg "Caption 2")
![Alt text](./images/photo3.jpg "Caption 3")
:::
```

## Gallery Types

### Carousel Gallery (Default)

The default gallery displays images in a carousel with navigation:

```markdown
::: gallery
![Mountain view](./images/mountain.jpg "Beautiful mountain landscape")
![Lake scene](./images/lake.jpg "Serene lake at sunset")
![Forest path](./images/forest.jpg "Winding forest trail")
:::
```

Features:
- Previous/Next navigation buttons
- Dot indicators for direct navigation
- Touch/swipe support on mobile
- Keyboard navigation (Arrow keys, Home, End)
- Captions appear on hover

### Grid Gallery

Display images in a responsive grid layout:

```markdown
::: gallery grid
![Photo 1](./images/photo1.jpg "First photo")
![Photo 2](./images/photo2.jpg "Second photo")
![Photo 3](./images/photo3.jpg "Third photo")
![Photo 4](./images/photo4.jpg "Fourth photo")
:::
```

Features:
- Responsive grid that adjusts to screen size
- Hover effects
- Always-visible captions
- Click to view full size (when lightbox is implemented)

## Best Practices

### Image Preparation

1. **Consistent Aspect Ratios**: For carousel galleries, use images with similar aspect ratios for the best appearance.

2. **Optimal Sizes**: Images are automatically processed to create responsive versions. Start with high-quality originals (at least 1200px wide).

3. **File Formats**: Use JPEG for photos, PNG for graphics with transparency. The build process will create WebP versions automatically.

### Accessibility

1. **Alt Text**: Always provide descriptive alt text for screen readers:
   ```markdown
   ![Descriptive alt text](./images/photo.jpg "Optional caption")
   ```

2. **Captions**: Use captions to provide context or additional information. They're optional but recommended.

### Performance

1. **Image Count**: While there's no hard limit, consider user experience. For large collections, consider splitting into multiple galleries.

2. **Loading**: Images in galleries are lazy-loaded for performance. Only visible images are loaded initially.

## Keyboard Navigation

Carousel galleries support full keyboard navigation:

- **Left Arrow**: Previous image
- **Right Arrow**: Next image
- **Home**: First image
- **End**: Last image
- **Tab**: Navigate through controls

## Mobile Support

- **Touch Gestures**: Swipe left/right to navigate
- **Responsive Design**: Galleries adapt to screen size
- **Optimized Loading**: Smaller image variants are served to mobile devices

## Examples

### Travel Photo Gallery
```markdown
::: gallery
![Eiffel Tower](./images/paris-eiffel.jpg "Eiffel Tower at sunset")
![Louvre Museum](./images/paris-louvre.jpg "The Louvre's glass pyramid")
![Notre Dame](./images/paris-notre-dame.jpg "Notre Dame Cathedral")
![Arc de Triomphe](./images/paris-arc.jpg "Arc de Triomphe")
:::
```

### Portfolio Grid
```markdown
::: gallery grid
![Project 1](./images/project1.jpg "E-commerce Website")
![Project 2](./images/project2.jpg "Mobile App Design")
![Project 3](./images/project3.jpg "Brand Identity")
![Project 4](./images/project4.jpg "Dashboard UI")
:::
```

### Mixed Content Post
```markdown
# My Trip to Paris

Last summer, I visited Paris for the first time. The city was amazing!

::: gallery
![Morning coffee](./images/cafe.jpg "Café au lait at a local bistro")
![Street scene](./images/street.jpg "Typical Parisian street")
![Sunset](./images/sunset.jpg "Sunset from Montmartre")
:::

The food was incredible, and the architecture was breathtaking.

![Single photo](./images/single.jpg "This appears as a regular image, not in a gallery")

I can't wait to go back!
```

## Troubleshooting

### Images Not Appearing
- Ensure images are in the `images/` subdirectory of your post
- Check that image filenames match exactly (case-sensitive)
- Verify the build process completed successfully

### Gallery Not Working
- Make sure you're using the correct `:::` syntax (three colons)
- Check that `gallery` is on the same line as the opening `:::`
- Ensure each image is on its own line within the gallery block

### Performance Issues
- Optimize source images before adding them (2-3MB max recommended)
- Consider using fewer images per gallery
- Use grid layout for large collections instead of carousel

## Future Enhancements

Planned features for future updates:
- Lightbox/fullscreen view
- Video support in galleries
- Masonry layout option
- Image zoom on hover
- Social sharing buttons

For more information, see the [Multimedia Documentation](../technical/MULTIMEDIA.md).