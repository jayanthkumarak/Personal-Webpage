# Setup Guide

## Prerequisites

- Node.js 16+ and npm
- Git
- Text editor (VS Code recommended)

## Installation

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/jayanthkumarak/Personal-Webpage.git
   cd Personal-Webpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the site**
   ```bash
   npm run build:multimedia  # With multimedia support
   # or
   npm run build            # Legacy build without multimedia
   ```

4. **Preview locally**
   ```bash
   npm run serve:dist
   # Visit http://localhost:8001
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Basic build (legacy) |
| `npm run build:multimedia` | Build with image/video support |
| `npm run build:prod` | Full production build with optimization |
| `npm run optimize` | Minify CSS/HTML, add security headers |
| `npm run audit` | Run accessibility audit |
| `npm run test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run dev` | Build and start dev server |
| `npm run serve:dist` | Serve the built site |
| `npm run clean` | Clean dist directory |

## Project Structure

```
Personal-Webpage/
├── posts/              # Your content goes here
│   ├── my-post.md     # Simple post
│   └── rich-post/     # Post with images
│       ├── index.md
│       └── images/
├── templates/         # HTML templates
├── dist/              # Generated site (git-ignored)
├── build.js           # Legacy build script
├── build-multimedia.js # Enhanced build with media support
├── optimize.js        # Performance optimizer
├── accessibility-audit.js # A11y checker
└── docs/              # This documentation
```

## Configuration

Edit the config object in `build-multimedia.js`:

```javascript
const config = {
  siteUrl: 'https://yourdomain.com',
  siteName: 'Your Name',
  siteDescription: 'Your description',
  imageSizes: [400, 800, 1200],  // Generated image widths
  imageFormats: ['webp', 'jpeg']  // Output formats
};
```

## Next Steps

- Read the [Usage Guide](./USAGE.md) to learn how to create content
- Check the [Deployment Guide](./DEPLOYMENT.md) when ready to go live 