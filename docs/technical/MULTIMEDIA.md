# Multimedia Technical Documentation

## Image Processing Pipeline

### Overview
The build system automatically optimizes images for web delivery using Sharp.

### Processing Steps
1. **Discovery** - Find all images in `posts/*/images/`
2. **Resizing** - Generate 3 sizes: 400w, 800w, 1200w
3. **Format Conversion** - Create WebP + JPEG versions
4. **Optimization** - Apply quality settings (WebP: 85, JPEG: 90)
5. **Output** - Save to `dist/articles/*/images/`

### Generated HTML
```html
<picture>
  <source type="image/webp" 
          srcset="./images/photo-400w.webp 400w,
                  ./images/photo-800w.webp 800w,
                  ./images/photo-1200w.webp 1200w">
  <source type="image/jpeg" 
          srcset="./images/photo-400w.jpeg 400w,
                  ./images/photo-800w.jpeg 800w,
                  ./images/photo-1200w.jpeg 1200w">
  <img src="./images/photo.jpg" 
       alt="Description" 
       loading="lazy" 
       decoding="async">
</picture>
```

### Configuration
In `build-multimedia.js`:
```javascript
imageSizes: [400, 800, 1200],    // Widths to generate
imageFormats: ['webp', 'jpeg']   // Output formats
```

## YouTube Embed Implementation

### Markdown Syntax
```markdown
::: youtube
VIDEO_ID_HERE
:::
```

### Generated HTML
```html
<div class="video-wrapper">
  <iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; 
           encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>
```

### Features
- **Privacy Mode** - Uses youtube-nocookie.com
- **Responsive** - 16:9 aspect ratio maintained
- **Lazy Loading** - Improves initial page load
- **Accessible** - Proper iframe attributes

## Performance Optimizations

### Image Optimization
- **WebP Format** - ~30% smaller than JPEG
- **Responsive Sizes** - Browser selects appropriate size
- **Lazy Loading** - Images load as needed
- **Quality Settings** - Balanced size/quality

### Video Optimization
- **On-Demand Loading** - No preload
- **No Cookies** - Until user interacts
- **Minimal Markup** - Clean, semantic HTML

## CSS Support

### Responsive Images
```css
picture img {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Video Embeds
```css
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

## Browser Support

### Images
- **WebP** - Chrome, Firefox, Edge (with JPEG fallback)
- **Responsive Images** - All modern browsers
- **Lazy Loading** - Chrome, Firefox (graceful degradation)

### Videos
- **YouTube Embeds** - All browsers
- **Aspect Ratio** - CSS-based, universal support

## Future Enhancements

### Phase 3 Plans
- **Image Galleries** - Grid layout with lightbox
- **Video Facades** - Click-to-load with thumbnails
- **Social Embeds** - Twitter, GitHub Gists
- **Audio Support** - Podcast player

### Optimization Ideas
- AVIF format support
- Blurhash placeholders
- Client-side lazy loading enhancement
- CDN integration 