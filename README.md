# Personal Website - Jayanth Kumar

A fast, minimalist personal website and blog built with a custom static site generator. Features responsive image processing, YouTube embeds, and automated accessibility auditing.

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build:master

# Preview locally
npm run serve:dist
# Visit http://localhost:8001
```

## Key Features

- 🚀 **Performance** - <100KB total size, sub-second loads
- 📸 **Multimedia** - Responsive images with WebP, YouTube embeds
- ♿ **Accessible** - WCAG 2.1 AA compliant with automated auditing
- 🔒 **Secure** - No tracking, privacy-focused, security headers
- 📝 **Simple** - Write in Markdown, push to deploy

## Documentation

All documentation is organized in the `docs/` directory:

- 📖 [Documentation Index](./docs/README.md)
- 🚀 [Setup Guide](./docs/guides/SETUP.md)
- ✍️ [Usage Guide](./docs/guides/USAGE.md)
- 🌐 [Deployment Guide](./docs/guides/DEPLOYMENT.md)
- 🏗️ [Architecture Overview](./docs/technical/ARCHITECTURE.md)

## Creating Content

1. Create a post directory with images:
   ```bash
   mkdir posts/my-new-post
   mkdir posts/my-new-post/images
   ```

2. Write your content in `posts/my-new-post/index.md`:
   ```markdown
   ---
   title: "My New Post"
   date: "2025-01-07"
   description: "Post description"
   ---
   
   # My New Post
   
   Content with images and videos...
   
   ![Alt text](./images/photo.jpg "Caption")
   
   ::: youtube
   VIDEO_ID
   :::
   ```

3. Build and preview:
   ```bash
   npm run build:multimedia
   npm run serve:dist
   ```

## Project Status

✅ **Completed**: Image processing, YouTube embeds, accessibility auditing, CI/CD  
🚧 **In Progress**: Documentation consolidation  
📋 **Planned**: Visual enhancements, additional embed types

## License

MIT License - See [LICENSE](./LICENSE) file for details.

---

Built with ❤️ for performance, accessibility, and simplicity.
