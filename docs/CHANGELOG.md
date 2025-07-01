# Changelog

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