const path = require('path');

// Gallery plugin for markdown-it
function galleryPlugin(md, options = {}) {
  const { imageSizes = [400, 800, 1200] } = options;

  md.use(require('markdown-it-container'), 'gallery', {
    validate: function(params) {
      return params.trim().match(/^gallery(\s+.*)?$/);
    },
    
    render: function(tokens, idx, _options, env, renderer) {
      if (tokens[idx].nesting === 1) {
        // Opening tag
        const params = tokens[idx].info.trim().match(/^gallery\s+(.*)$/);
        const galleryType = params ? params[1] : 'carousel';
        
        // Collect all image tokens within this gallery
        const images = [];
        let i = idx + 1;
        
        while (i < tokens.length && tokens[i].type !== 'container_gallery_close') {
          if (tokens[i].type === 'inline' && tokens[i].children) {
            tokens[i].children.forEach(child => {
              if (child.type === 'image') {
                images.push({
                  src: child.attrGet('src'),
                  alt: child.content,
                  title: child.attrGet('title')
                });
              }
            });
          }
          i++;
        }
        
        // Generate gallery HTML
        let html = `<div class="image-carousel" data-gallery-type="${galleryType}">
  <div class="carousel-container">
    <div class="carousel-track">\n`;
        
        // Generate slides
        images.forEach(img => {
          if (!img.src || img.src.startsWith('http')) {
            // External image, use as-is
            html += `      <div class="carousel-slide">
        <img src="${img.src}" alt="${img.alt || ''}"${img.title ? ` title="${img.title}"` : ''} loading="lazy">
        ${img.title ? `<figcaption class="carousel-caption">${img.title}</figcaption>` : ''}
      </div>\n`;
          } else {
            // Local image, generate responsive markup
            const imageName = path.basename(img.src);
            const baseName = path.basename(imageName, path.extname(imageName));
            
            const webpSrcset = imageSizes
              .map(size => `./images/${baseName}-${size}w.webp ${size}w`)
              .join(', ');
            
            const jpegSrcset = imageSizes
              .map(size => `./images/${baseName}-${size}w.jpeg ${size}w`)
              .join(', ');
            
            html += `      <div class="carousel-slide">
        <picture>
          <source type="image/webp" srcset="${webpSrcset}" sizes="(max-width: 768px) 100vw, 80vw">
          <source type="image/jpeg" srcset="${jpegSrcset}" sizes="(max-width: 768px) 100vw, 80vw">
          <img src="${img.src}" alt="${img.alt || ''}" loading="lazy" decoding="async">
        </picture>
        ${img.title ? `<figcaption class="carousel-caption">${img.title}</figcaption>` : ''}
      </div>\n`;
          }
        });
        
        return html;
      } else {
        // Closing tag
        return `    </div>
    <button class="carousel-button carousel-button--prev" aria-label="Previous image">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="carousel-button carousel-button--next" aria-label="Next image">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="carousel-indicators"></div>
  </div>
</div>`;
      }
    }
  });
  
  // Override rendering for content inside gallery blocks
  const originalRender = md.renderer.render;
  md.renderer.render = function(tokens, options, env) {
    // Mark gallery content to skip normal rendering
    let inGallery = false;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'container_gallery_open') {
        inGallery = true;
        // Skip content tokens until close
        let j = i + 1;
        while (j < tokens.length && tokens[j].type !== 'container_gallery_close') {
          if (tokens[j].type === 'paragraph_open' || 
              tokens[j].type === 'paragraph_close' ||
              tokens[j].type === 'inline') {
            tokens[j].hidden = true;
          }
          j++;
        }
        inGallery = false;
      }
    }
    
    return originalRender.call(this, tokens, options, env);
  };
}

module.exports = galleryPlugin;