# Security Policy

## Reporting Security Issues

As a security professional's website, I take security seriously. If you discover a security vulnerability, please follow responsible disclosure practices.

### Contact
- Email: [your-email@example.com]
- PGP Key: [Link to public key]

### What to Include
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)

## Security Considerations

### Dependencies
- All dependencies are development-only (no runtime deps)
- Regular `npm audit` checks
- Automated dependency updates via Dependabot

### Build Process
- Static site generation (no server-side code)
- No user input processing
- No database or dynamic content

### Content Security
- All content is version-controlled
- Markdown sanitization during build
- No JavaScript in generated pages (by design)

### Deployment
- Static files only
- CDN with HTTPS enforcement
- Security headers configured at server level

## Acknowledgments
Security researchers who responsibly disclose vulnerabilities will be acknowledged here (with permission). 