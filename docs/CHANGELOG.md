# Changelog

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