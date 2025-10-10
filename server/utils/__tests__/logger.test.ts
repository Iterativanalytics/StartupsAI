/**
 * Logger Tests
 * Unit tests for the logging utility
 */

import { logger, createLogger, LogLevel } from '../logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    logger.clearContext();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('Basic Logging', () => {
    it('should log info messages', () => {
      logger.info('Test message');
      expect(consoleLogSpy).toHaveBeenCalled();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('INFO');
      expect(logOutput).toContain('Test message');
    });

    it('should log error messages', () => {
      logger.error('Error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toContain('ERROR');
      expect(logOutput).toContain('Error message');
    });

    it('should log warn messages', () => {
      logger.warn('Warning message');
      expect(consoleWarnSpy).toHaveBeenCalled();
      const logOutput = consoleWarnSpy.mock.calls[0][0];
      expect(logOutput).toContain('WARN');
      expect(logOutput).toContain('Warning message');
    });

    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      logger.debug('Debug message');
      expect(consoleLogSpy).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Context Management', () => {
    it('should add context to logs', () => {
      logger.setContext({ userId: '123', requestId: 'abc' });
      logger.info('Test with context');
      
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('userId');
      expect(logOutput).toContain('123');
    });

    it('should clear context', () => {
      logger.setContext({ userId: '123' });
      logger.clearContext();
      logger.info('Test without context');
      
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).not.toContain('userId');
    });

    it('should create child logger with additional context', () => {
      logger.setContext({ userId: '123' });
      const childLogger = logger.child({ requestId: 'abc' });
      
      childLogger.info('Child logger message');
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('userId');
      expect(logOutput).toContain('requestId');
    });
  });

  describe('Error Logging', () => {
    it('should log error objects with stack traces', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toContain('Test error');
      expect(logOutput).toContain('Error occurred');
    });

    it('should handle non-Error objects', () => {
      logger.error('Error occurred', 'string error');
      
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toContain('string error');
    });
  });

  describe('Metadata', () => {
    it('should include metadata in logs', () => {
      logger.info('Test message', { key: 'value', count: 42 });
      
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('key');
      expect(logOutput).toContain('value');
      expect(logOutput).toContain('42');
    });
  });

  describe('Performance Timing', () => {
    it('should time synchronous operations', async () => {
      const result = await logger.time('test-operation', () => {
        return 'result';
      });
      
      expect(result).toBe('result');
      expect(consoleLogSpy).toHaveBeenCalledTimes(2); // Start and complete
    });

    it('should time async operations', async () => {
      const result = await logger.time('async-operation', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async-result';
      });
      
      expect(result).toBe('async-result');
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    it('should log errors in timed operations', async () => {
      await expect(
        logger.time('failing-operation', () => {
          throw new Error('Operation failed');
        })
      ).rejects.toThrow('Operation failed');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Factory Function', () => {
    it('should create logger with context', () => {
      const customLogger = createLogger({ module: 'test-module' });
      customLogger.info('Test message');
      
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('test-module');
    });
  });
});
