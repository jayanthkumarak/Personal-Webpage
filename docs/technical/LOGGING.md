# Logging System Documentation

## Overview

The static site generator uses **Pino**, one of the fastest Node.js logging libraries available. Pino provides high-performance structured logging with minimal overhead, making it ideal for build tools where performance matters.

## Why Pino?

- **Performance**: One of the fastest loggers in the Node.js ecosystem
- **Low Overhead**: Minimal impact on build performance (~5x faster than alternatives)
- **Production-Ready**: Battle-tested in production environments
- **Structured Logging**: JSON output for easy parsing and analysis
- **Pretty Printing**: Beautiful, readable output during development
- **Child Loggers**: Contextual logging with inherited properties
- **Ecosystem**: Rich plugin ecosystem for transports and processors

## Features

- **Multiple Log Levels**: trace, debug, info, warn, error, silent
- **Structured Logging**: JSON format for production, pretty-print for development
- **Contextual Information**: Automatic error serialization and context propagation
- **Performance Tracking**: Built-in timers and custom progress indicators
- **File Output**: Optional log file generation with async writes
- **Environment-Aware**: Different settings for dev/CI/production
- **Security**: Automatic redaction of sensitive fields

## Usage

### Basic Logging

```javascript
const { logger } = require('./scripts/utils/logger');

logger.info('Starting build process');
logger.debug('Processing file', { file: 'post.md', size: 1024 });
logger.error('Build failed', { error: err, suggestion: 'Check file permissions' });
```

### Creating Contextual Loggers

```javascript
const { createLogger } = require('./scripts/utils/logger');

// Create logger with specific context
const buildLogger = createLogger({
  context: { module: 'build-multimedia' }
});

// All logs will include the module context
buildLogger.info('Processing images'); // Includes module: 'build-multimedia'
```

### Using Logger Configuration

```javascript
const loggerConfig = require('./logger.config');

// Create logger with environment-specific settings
const logger = loggerConfig.createLogger({
  context: { operation: 'build' }
});
```

## Log Levels

| Level | Use Case | Production Default |
|-------|----------|-------------------|
| trace | Very detailed debugging info | ❌ |
| debug | Detailed debugging info | ❌ |
| info | General information | ✅ (CI) |
| warn | Warnings and recoverable errors | ✅ |
| error | Critical errors | ✅ |
| silent | No output | - |

## Configuration

### Environment Variables

- `LOG_LEVEL` - Set the logging level (trace, debug, info, warn, error)
- `LOG_FILE` - Path to log file (optional, async writes)
- `NODE_ENV` - Environment (development, ci, production, test)

### Examples

```bash
# Development with debug logging
LOG_LEVEL=debug npm run build:multimedia

# Production build with minimal logging
NODE_ENV=production npm run build:prod

# CI with file output
NODE_ENV=ci LOG_FILE=./build.log npm run build:multimedia

# Trace level for maximum detail
LOG_LEVEL=trace npm run build:multimedia
```

## Output Formats

### Development (Pretty Print)
```
[2025-01-08 10:30:45.123] INFO  🚀 Building site with multimedia support...
[2025-01-08 10:30:45.456] DEBUG Processing file
    file: "posts/my-post.md"
    size: 1024
[2025-01-08 10:30:45.789] ERROR Image processing failed
    file: "photo.jpg"
    error: {
      "message": "Invalid image format",
      "code": "EINVALID"
    }
    suggestion: "Ensure the file is a valid JPEG or PNG"
```

### Production (JSON)
```json
{"level":"info","time":"2025-01-08T10:30:45.123Z","msg":"Building site with multimedia support"}
{"level":"error","time":"2025-01-08T10:30:45.789Z","file":"photo.jpg","error":{"message":"Invalid image format","code":"EINVALID"},"suggestion":"Ensure the file is a valid JPEG or PNG","msg":"Image processing failed"}
```

## Advanced Features

### Performance Tracking

```javascript
logger.time('imageProcessing');
// ... do work ...
const duration = logger.timeEnd('imageProcessing');
// Logs: Timer ended: imageProcessing duration="123ms" durationMs=123
```

### Progress Indicators (Development Only)

```javascript
posts.forEach((post, index) => {
  logger.progress(index + 1, posts.length, 'Processing posts');
  // Shows: Processing posts: [████████████░░░░░░░░] 60% (6/10)
});
```

### Grouped Logging

```javascript
const group = logger.group('Build Steps');
logger.info('Step 1: Load posts');
logger.info('Step 2: Generate pages');
group.end(); // Logs: ▲ End Build Steps
```

### Safe File Operations

```javascript
// Automatically logs errors with context
const content = logger.tryReadFile('config.json');
if (!content) {
  // Error already logged with file path
  return;
}

// Safe write with automatic directory creation
logger.tryWriteFile('output/data.json', JSON.stringify(data));
```

### Child Loggers for Context

```javascript
const pageLogger = logger.withContext({ 
  operation: 'generatePage',
  template: 'post.html' 
});

// All subsequent logs include the context
pageLogger.info('Rendering template');
pageLogger.debug('Applied variables', { count: 5 });
```

## Error Handling

Pino automatically serializes errors with stack traces:

```javascript
try {
  await processImage(file);
} catch (err) {
  logger.error('Image processing failed', {
    file: imageFile,
    error: err, // Pino serializes this properly
    attempted: { width: 800, format: 'webp' },
    suggestion: 'Check if the image file is corrupted'
  });
}
```

## Performance Benefits

Pino's performance advantages:
- **5x faster** than Winston or Bunyan
- **Async logging** prevents I/O blocking
- **Binary serialization** for optimal performance
- **Minimal overhead** even with structured data

Benchmark results show Pino can handle >100k logs/second with minimal CPU impact.

## Best Practices

1. **Use Appropriate Log Levels**
   - `error`: Unrecoverable errors that stop execution
   - `warn`: Issues that don't stop execution but need attention
   - `info`: Important milestones and summary information
   - `debug`: Detailed information for troubleshooting
   - `trace`: Very detailed debugging and performance metrics

2. **Leverage Child Loggers**
   ```javascript
   const operationLogger = logger.withContext({ 
     operation: 'imageResize',
     batchId: Date.now() 
   });
   ```

3. **Let Pino Handle Serialization**
   ```javascript
   // Good - Pino efficiently serializes objects
   logger.info('User action', { user: userObj, action: 'login' });
   
   // Avoid - Pre-stringifying data
   logger.info(`User ${JSON.stringify(userObj)} logged in`);
   ```

4. **Use Structured Data**
   ```javascript
   // Good - Structured data for analysis
   logger.error('Database connection failed', {
     host: 'localhost',
     port: 5432,
     error: err,
     retryCount: 3
   });
   
   // Avoid - Unstructured string concatenation
   logger.error(`DB failed: ${host}:${port} - ${err.message}`);
   ```

## Migration from Console

```javascript
// Before
console.log(`Generated: ${outputPath}`);
console.error(`Error: ${err.message}`);

// After - with rich context
logger.info('Generated page', { 
  path: outputPath, 
  size: stats.size,
  duration: Date.now() - startTime 
});
logger.error('Generation failed', { 
  error: err, 
  path: outputPath,
  template: 'post.html' 
});
```

## Log Processing

Pino's JSON output integrates well with log processing tools:

```bash
# Pretty print JSON logs
cat build.log | npx pino-pretty

# Filter by level
cat build.log | jq 'select(.level >= 40)'

# Extract errors
cat build.log | jq 'select(.level == 50)'

# Analyze performance
cat build.log | jq 'select(.durationMs != null) | {msg, durationMs}'
```

## Troubleshooting

### No Log Output
- Check `LOG_LEVEL` environment variable
- Ensure not in silent mode
- Verify logger is imported correctly

### Performance Issues
- Use `logger.level` to check current level
- Avoid logging in tight loops at debug/trace level
- Use child loggers instead of adding context to every call

### Large Log Files
- Pino writes asynchronously for performance
- Consider log rotation in production
- Use appropriate log levels to reduce volume 