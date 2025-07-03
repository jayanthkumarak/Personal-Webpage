# Changelog

## [2025-01-09] Image Gallery and Carousel Implementation

### Added
- **Image Carousel Component**
  - Responsive carousel with touch/swipe support
  - Keyboard navigation (arrow keys, Home, End)
  - Dot indicators for direct slide access
  - Previous/Next navigation buttons
  - Smooth animations with reduced motion support
  - Full accessibility with ARIA labels
- **Grid Gallery Layout**
  - Responsive grid layout option
  - Hover effects and transitions
  - Always-visible captions
- **Markdown Gallery Syntax**
  - Simple `:::gallery` container syntax
  - Support for both carousel and grid layouts
  - Seamless integration with existing image processing
- **Gallery Documentation**
  - Comprehensive usage guide at `/docs/guides/GALLERY_USAGE.md`
  - Examples and best practices
  - Troubleshooting section

### Technical Implementation
- Custom markdown-it plugin for gallery parsing
- Pure CSS and vanilla JavaScript (no dependencies)
- Progressive enhancement approach
- Maintains performance budget (<15KB CSS)
- Works with existing responsive image pipeline

## [2025-01-08] Professional Logging Implementation

### Added
- **Pino Logger Integration**
  - Replaced custom logger with Pino, one of the fastest Node.js loggers
  - 5x performance improvement over alternatives
  - Structured JSON logging for production
  - Beautiful pretty-printing for development
  - Automatic error serialization with stack traces
  - Child loggers for contextual information
  - Progress indicators for long operations
  - Built-in performance timing
- **Enhanced Error Reporting**
  - Rich error context with file paths, line numbers
  - Actionable suggestions for common errors
  - Automatic sensitive data redaction
  - Structured data for easy parsing
- **Comprehensive Documentation**
  - Added `/docs/technical/LOGGING.md` with examples
  - Migration guide from console.log
  - Best practices and troubleshooting

### Changed
- All `console.log` and `console.error` calls replaced with structured logging
- Test suite updated to use Pino-compatible configuration
- Logger configuration simplified for different environments
- Build output now includes performance metrics and detailed context

### Technical Details
- Zero breaking changes - maintains same API
- File logging with async writes for performance
- Environment-aware configuration (dev/ci/production)
- ~24KB added to devDependencies (pino + pino-pretty)

## [2025-01-07] Repository Cleanup & Professional Organization

### Changed
- **Complete Repository Restructure**
  - Moved all scripts to `/scripts/{build,utils}` directory structure
  - Moved all styles to `/styles` directory
  - Updated all internal paths and imports to use new structure
  - Removed build artifacts from version control
- **Professional Configuration**
  - Added `.eslintrc.json` for code quality
  - Added `.prettierrc` for consistent formatting
  - Added `.editorconfig` for cross-editor consistency
  - Added `jest.config.js` with coverage thresholds
  - Enhanced `.gitignore` with comprehensive patterns
- **Project Documentation**
  - Added `LICENSE` (MIT)
  - Added `CONTRIBUTING.md` with guidelines
  - Added `SECURITY.md` for responsible disclosure
  - Added `PROJECT_STRUCTURE.md` documenting organization

### Removed
- Deleted generated `dist/` directory
- Deleted redundant `articles/` directory
- Deleted static `index.html` from root
- Removed parent directory eslint config

## [2025-01-07] Documentation Consolidation

### Changed
- Reorganized all documentation into `/docs` directory with clear structure:
  - `/docs/guides/` - Setup, usage, and deployment guides
  - `/docs/technical/` - Architecture, build system, and multimedia docs
  - `/docs/planning/` - Roadmap and design system
- Simplified main README.md to focus on quick start and key features
- Consolidated 16 scattered documentation files into 9 organized documents

### Removed
- Deleted redundant documentation files from root:
  - AI_READABLE_DOCUMENTATION.md
  - PROJECT_DOCUMENTATION.md
  - PROJECT_SUMMARY.md
  - TECHNICAL_DOCUMENTATION.md
  - content-*.md files
  - design-analysis.md
  - information-architecture.md
  - visual-design-system.md
  - wireframes.md

### Added
- `/docs/README.md` - Central documentation index
- `/docs/technical/BUILD_SYSTEM.md` - Detailed build documentation
- `/docs/technical/MULTIMEDIA.md` - Multimedia implementation details
- `/docs/planning/DESIGN_SYSTEM.md` - Consolidated design guidelines

## [2025-01-07] Multimedia Support Implementation

### Added
- Phase 1: Image processing with Sharp
  - Responsive image generation (400w, 800w, 1200w)
  - WebP format with JPEG fallbacks
  - Automatic optimization during build
- Phase 2: YouTube embed support
  - Privacy-enhanced mode (youtube-nocookie.com)
  - Responsive 16:9 aspect ratio
  - Lazy loading for performance
- New build script: `build-multimedia.js`
- Multimedia styles: `multimedia-styles.css`
- Usage documentation: `MULTIMEDIA_USAGE_GUIDE.md`

### Changed
- Posts can now be directories with co-located assets
- Build system supports both simple `.md` files and rich post directories

## [2025-01-07] Development Tools Setup

### Added
- Jest testing framework with first test
- ESLint and Prettier configuration
- GitHub Actions CI/CD pipeline
- Automated accessibility auditing with color contrast checks

### Changed
- Replaced manual CSS minification with csso library
- Updated package.json with new scripts (test, lint, format) 