const pino = require('pino');
const fs = require('fs');
const path = require('path');

/**
 * Professional logger implementation using Pino
 * Provides high-performance, structured logging with minimal overhead
 */

// Get configuration from environment or defaults
const isDevelopment = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'ci';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');
const logFile = process.env.LOG_FILE;

// Create base logger configuration
const baseConfig = {
  level: logLevel.toLowerCase(),
  // Redact sensitive information
  redact: {
    paths: ['password', 'token', 'secret', 'authorization'],
    remove: true
  },
  // Add base context
  base: {
    pid: process.pid,
    hostname: null // Remove hostname for privacy
  },
  // Custom serializers for better error output
  serializers: {
    error: pino.stdSerializers.err,
    err: pino.stdSerializers.err
  }
};

// Function to create the logger based on configuration
function createPinoLogger() {
  // If we need file output, use multistream
  if (logFile) {
    // Ensure log directory exists
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Create streams array
    const streams = [];
    
    // Console stream with pretty printing in development
    if (isDevelopment) {
      streams.push({
        level: logLevel.toLowerCase(),
        stream: pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss.l',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
            errorLikeObjectKeys: ['err', 'error'],
            singleLine: false
          }
        })
      });
    } else {
      streams.push({
        level: logLevel.toLowerCase(),
        stream: process.stdout
      });
    }
    
    // File stream (always JSON format)
    streams.push({
      level: logLevel.toLowerCase(),
      stream: pino.destination({
        dest: logFile,
        sync: false,
        mkdir: true
      })
    });
    
    return pino({
      ...baseConfig,
      timestamp: pino.stdTimeFunctions.isoTime
    }, pino.multistream(streams));
  }
  
  // Single stream configuration
  if (isDevelopment) {
    return pino({
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
          messageFormat: '{msg}',
          errorLikeObjectKeys: ['err', 'error'],
          singleLine: false
        }
      }
    });
  }
  
  // Production configuration - fast JSON output
  return pino({
    ...baseConfig,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label })
    }
  });
}

// Create the base logger instance
const baseLogger = createPinoLogger();

/**
 * Logger wrapper class that provides our custom API on top of Pino
 */
class Logger {
  constructor(pinoInstance, context = {}) {
    this.logger = pinoInstance;
    this.context = context;
    this.timers = new Map();
  }

  // Main logging methods matching our API
  error(message, data = {}) {
    const mergedData = this.mergeContext(data);
    // Special handling for error objects
    if (mergedData.error && mergedData.error instanceof Error) {
      this.logger.error(mergedData, message);
    } else {
      this.logger.error(mergedData, message);
    }
  }

  warn(message, data = {}) {
    this.logger.warn(this.mergeContext(data), message);
  }

  info(message, data = {}) {
    this.logger.info(this.mergeContext(data), message);
  }

  debug(message, data = {}) {
    this.logger.debug(this.mergeContext(data), message);
  }

  trace(message, data = {}) {
    this.logger.trace(this.mergeContext(data), message);
  }

  // Merge context with provided data
  mergeContext(data) {
    return { ...this.context, ...data };
  }

  // Create child logger with additional context
  withContext(additionalContext) {
    const newContext = { ...this.context, ...additionalContext };
    const childLogger = this.logger.child(newContext);
    return new Logger(childLogger, newContext);
  }

  // Timer functionality
  time(label) {
    this.timers.set(label, Date.now());
    this.debug(`Timer started: ${label}`);
  }

  timeEnd(label) {
    const start = this.timers.get(label);
    if (!start) {
      this.warn(`Timer '${label}' does not exist`);
      return;
    }
    
    const duration = Date.now() - start;
    this.timers.delete(label);
    this.debug(`Timer ended: ${label}`, { duration: `${duration}ms`, durationMs: duration });
    return duration;
  }

  // Error handling helpers
  trySync(fn, errorMessage, data = {}) {
    try {
      return fn();
    } catch (error) {
      this.error(errorMessage, { ...data, error });
      return null;
    }
  }

  async tryAsync(fn, errorMessage, data = {}) {
    try {
      return await fn();
    } catch (error) {
      this.error(errorMessage, { ...data, error });
      return null;
    }
  }

  // File operation helpers
  tryReadFile(filePath, encoding = 'utf8') {
    return this.trySync(
      () => fs.readFileSync(filePath, encoding),
      'Failed to read file',
      { file: filePath }
    );
  }

  tryWriteFile(filePath, content) {
    return this.trySync(
      () => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
        return true;
      },
      'Failed to write file',
      { file: filePath, size: content.length }
    );
  }

  // Group logging - simplified for Pino
  group(label) {
    this.info(`▼ ${label}`);
    return {
      end: () => this.debug(`▲ End ${label}`)
    };
  }

  // Progress indicator
  progress(current, total, label = 'Progress') {
    if (!isDevelopment || this.logger.level > pino.levels.values.info) return; // Only in dev and info+ level
    
    const percentage = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5)).padEnd(20, '░');
    
    // Use carriage return for updating same line
    process.stdout.write(`\r${label}: [${bar}] ${percentage}% (${current}/${total})`);
    
    if (current === total) {
      process.stdout.write('\n');
    }
  }
}

// Create the default logger instance
const defaultLogger = new Logger(baseLogger);

// Export both for compatibility
module.exports = {
  Logger,
  logger: defaultLogger,
  
  // Create logger factory
  createLogger: (options = {}) => {
    const context = options.context || {};
    const level = options.level || logLevel;
    
    // Create child logger with context
    const childPino = baseLogger.child(context, {
      level: level.toLowerCase()
    });
    
    return new Logger(childPino, context);
  },
  
  // Direct methods on default logger for convenience
  error: (msg, data) => defaultLogger.error(msg, data),
  warn: (msg, data) => defaultLogger.warn(msg, data),
  info: (msg, data) => defaultLogger.info(msg, data),
  debug: (msg, data) => defaultLogger.debug(msg, data),
  trace: (msg, data) => defaultLogger.trace(msg, data),
  
  // Re-export Pino's actual levels for backward compatibility
  LEVELS: pino.levels.values
}; 