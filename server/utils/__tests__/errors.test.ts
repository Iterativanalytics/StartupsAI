/**
 * Error Handling Tests
 * Unit tests for custom error classes and utilities
 */

import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  DatabaseError,
  ExternalAPIError,
  handleZodError,
  errorHandler,
  asyncHandler,
  assert,
  assertExists
} from '../errors';
import { z } from 'zod';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create error with correct properties', () => {
      const error = new AppError(400, 'Test error', 'TEST_ERROR', { detail: 'test' });
      
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ detail: 'test' });
      expect(error.isOperational).toBe(true);
    });

    it('should have correct JSON representation', () => {
      const error = new AppError(400, 'Test error', 'TEST_ERROR');
      const json = error.toJSON();
      
      expect(json).toEqual({
        code: 'TEST_ERROR',
        message: 'Test error',
        details: undefined
      });
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Invalid input');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create unauthorized error with 401 status', () => {
      const error = new UnauthorizedError();
      
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should accept custom message', () => {
      const error = new UnauthorizedError('Token expired');
      expect(error.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('should create forbidden error with 403 status', () => {
      const error = new ForbiddenError();
      
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError('User');
      
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('User not found');
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error with 409 status', () => {
      const error = new ConflictError('Resource already exists');
      
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with 429 status', () => {
      const error = new RateLimitError();
      
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('InternalServerError', () => {
    it('should create internal server error with 500 status', () => {
      const error = new InternalServerError();
      
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('ServiceUnavailableError', () => {
    it('should create service unavailable error with 503 status', () => {
      const error = new ServiceUnavailableError();
      
      expect(error.statusCode).toBe(503);
      expect(error.code).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('DatabaseError', () => {
    it('should create database error with 500 status', () => {
      const error = new DatabaseError('Connection failed');
      
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.message).toBe('Connection failed');
    });
  });

  describe('ExternalAPIError', () => {
    it('should create external API error with 502 status', () => {
      const error = new ExternalAPIError('PaymentService', 'Payment failed');
      
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_API_ERROR');
      expect(error.message).toContain('PaymentService');
      expect(error.message).toContain('Payment failed');
    });
  });
});

describe('Zod Error Handling', () => {
  it('should convert Zod errors to ValidationError', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18)
    });

    try {
      schema.parse({ email: 'invalid', age: 10 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = handleZodError(error);
        
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.statusCode).toBe(400);
        expect(validationError.details).toHaveLength(2);
      }
    }
  });
});

describe('Error Handler Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      path: '/test',
      method: 'GET',
      body: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should handle AppError correctly', () => {
    const error = new NotFoundError('User');
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        details: undefined
      }
    });
  });

  it('should handle Zod errors', () => {
    const schema = z.object({ email: z.string().email() });
    try {
      schema.parse({ email: 'invalid' });
    } catch (error) {
      errorHandler(error as Error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalled();
    }
  });

  it('should handle unexpected errors', () => {
    const error = new Error('Unexpected error');
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should not leak error details in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const error = new Error('Sensitive error');
    errorHandler(error, mockReq, mockRes, mockNext);
    
    const jsonCall = mockRes.json.mock.calls[0][0];
    expect(jsonCall.error.message).toBe('An unexpected error occurred');
    
    process.env.NODE_ENV = originalEnv;
  });
});

describe('Async Handler', () => {
  it('should handle successful async operations', async () => {
    const mockReq = {} as any;
    const mockRes = { json: jest.fn() } as any;
    const mockNext = jest.fn();

    const handler = asyncHandler(async (req, res) => {
      res.json({ success: true });
    });

    await handler(mockReq, mockRes, mockNext);
    
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should catch and forward errors', async () => {
    const mockReq = {} as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();
    const error = new Error('Test error');

    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('Assert Utilities', () => {
  describe('assert', () => {
    it('should not throw when condition is true', () => {
      expect(() => assert(true, 'Should not throw')).not.toThrow();
    });

    it('should throw when condition is false', () => {
      expect(() => assert(false, 'Should throw')).toThrow('Should throw');
    });

    it('should throw custom error', () => {
      const customError = new ValidationError('Custom error');
      expect(() => assert(false, customError)).toThrow(ValidationError);
    });
  });

  describe('assertExists', () => {
    it('should not throw when value exists', () => {
      expect(() => assertExists('value', 'Resource')).not.toThrow();
      expect(() => assertExists(0, 'Resource')).not.toThrow();
      expect(() => assertExists(false, 'Resource')).not.toThrow();
    });

    it('should throw NotFoundError when value is null', () => {
      expect(() => assertExists(null, 'User')).toThrow(NotFoundError);
      expect(() => assertExists(null, 'User')).toThrow('User not found');
    });

    it('should throw NotFoundError when value is undefined', () => {
      expect(() => assertExists(undefined, 'User')).toThrow(NotFoundError);
    });

    it('should use default resource name', () => {
      expect(() => assertExists(null)).toThrow('Resource not found');
    });
  });
});
