/**
 * Logger Configuration for Pino-based Logger
 * 
 * This file centralizes logging configuration for the static site generator.
 * Set environment variables or modify this file to control logging behavior.
 */

module.exports = {
  // Default log level for development
  development: {
    level: 'debug',
    prettyPrint: true,
    // Optional: write logs to file in development
    // logFile: './logs/development.log'
  },
  
  // CI/CD environment settings
  ci: {
    level: 'info',
    prettyPrint: false,
    // Structured JSON logs for CI parsing
    logFile: process.env.CI_LOG_FILE || './logs/ci-build.log'
  },
  
  // Production build settings
  production: {
    level: 'warn',
    prettyPrint: false,
    logFile: './logs/production.log'
  },
  
  // Test environment settings
  test: {
    level: 'error',
    prettyPrint: false
  },
  
  // Get configuration based on environment
  getConfig: function() {
    const env = process.env.NODE_ENV || 'development';
    const config = this[env] || this.development;
    
    // Allow environment variable overrides
    return {
      level: process.env.LOG_LEVEL?.toLowerCase() || config.level,
      logFile: process.env.LOG_FILE || config.logFile,
      // Pino handles pretty printing through transport
      prettyPrint: config.prettyPrint
    };
  },
  
  // Convenience method to create logger with environment config
  createLogger: function(additionalOptions = {}) {
    const { createLogger } = require('./scripts/utils/logger');
    const envConfig = this.getConfig();
    
    // Remove prettyPrint from options as it's handled in logger.js
    const { prettyPrint, ...options } = envConfig;
    
    return createLogger({
      ...options,
      ...additionalOptions
    });
  },
  
  // Helper to set log level for current process
  setLogLevel: function(level) {
    process.env.LOG_LEVEL = level;
  },
  
  // Helper to enable file logging
  enableFileLogging: function(filePath) {
    process.env.LOG_FILE = filePath;
  }
}; 