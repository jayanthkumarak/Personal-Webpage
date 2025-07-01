# Project Structure

```
Personal-Webpage/
├── __tests__/                 # Test files
│   └── build.test.js         # Build system tests
├── .github/                   # GitHub specific files
│   └── workflows/            
│       └── ci.yml            # CI/CD pipeline
├── docs/                      # Documentation
│   ├── guides/               # How-to guides
│   │   ├── DEPLOYMENT.md
│   │   ├── SETUP.md
│   │   └── USAGE.md
│   ├── planning/             # Project planning
│   │   ├── DESIGN_SYSTEM.md
│   │   └── ROADMAP.md
│   ├── technical/            # Technical docs
│   │   ├── ARCHITECTURE.md
│   │   ├── BUILD_SYSTEM.md
│   │   └── MULTIMEDIA.md
│   ├── CHANGELOG.md          # Project history
│   ├── PROJECT_STRUCTURE.md  # This file
│   └── README.md             # Docs index
├── posts/                     # Content source
│   ├── post-name.md          # Simple posts
│   └── rich-post/            # Posts with media
│       ├── index.md
│       └── images/
├── scripts/                   # Build & utility scripts
│   ├── build/
│   │   ├── build.js          # Legacy build
│   │   └── build-multimedia.js # Enhanced build
│   └── utils/
│       ├── accessibility-audit.js
│       └── optimize.js
├── styles/                    # CSS files
│   ├── archive-styles.css
│   ├── multimedia-styles.css
│   └── styles.css
├── templates/                 # HTML templates
│   ├── archive.html
│   ├── index.html
│   └── post.html
├── .editorconfig             # Editor settings
├── .eslintrc.json            # ESLint config
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier config
├── CONTRIBUTING.md           # Contribution guide
├── jest.config.js            # Jest configuration
├── LICENSE                   # MIT license
├── package.json              # Dependencies & scripts
├── package-lock.json         # Lock file
└── README.md                 # Project overview
```

## Key Directories

### `/posts`
Contains all blog content in Markdown format. Supports two structures:
- Simple: `post-name.md` for text-only posts
- Rich: `post-name/index.md` + `post-name/images/` for multimedia posts

### `/scripts`
Organized build and utility scripts:
- `build/`: Site generation scripts
- `utils/`: Optimization and audit tools

### `/styles`
All CSS files in one location for easy maintenance

### `/templates`
HTML templates with `{{variable}}` placeholders

### `/docs`
Comprehensive documentation organized by type

### `/dist` (generated)
Build output - not tracked in Git

## Design Decisions

1. **Scripts Organization**: Grouped by function (build vs utils)
2. **Styles Separation**: All CSS in dedicated directory
3. **Documentation Structure**: Clear hierarchy by purpose
4. **Test Location**: Standard `__tests__` directory
5. **Config Files**: Root level for tool discovery 