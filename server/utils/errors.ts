/**
 * Custom Error Classes
 * Standardized error handling across the application
 */

import { Response, Request, NextFunction } from 'express';
import { logger } from './logger';
import { ZodError } from 'zod';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly isOperational: boolean = true;
  public override readonly message: string;
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    statusCode: number,
    message: string,
    code: string,
    details?: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(401, message, 'UNAUTHORIZED');
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(409, message, 'CONFLICT', details);
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * Internal server error (500)
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}

/**
 * Service unavailable error (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(503, message, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(500, message, 'DATABASE_ERROR', details);
  }
}

/**
 * External API error
 */
export class ExternalAPIError extends AppError {
  constructor(service: string, message: string, details?: any) {
    super(502, `${service} API error: ${message}`, 'EXTERNAL_API_ERROR', details);
  }
}

/**
 * Convert Zod validation errors to ValidationError
 */
export function handleZodError(error: ZodError): ValidationError {
  const details = error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return new ValidationError('Validation failed', details);
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationError = handleZodError(err);
    logger.warn('Validation error', {
      path: req.path,
      method: req.method,
      errors: validationError.details,
    });

    res.status(validationError.statusCode).json({
      error: validationError.toJSON(),
    });
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    logger.warn('Application error', {
      path: req.path,
      method: req.method,
      code: err.code,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    });

    res.status(err.statusCode).json({
      error: err.toJSON(),
    });
    return;
  }

  // Handle unexpected errors
  logger.error('Unexpected error', err, {
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Assert condition or throw error
 */
export function assert(
  condition: boolean,
  error: AppError | string
): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new InternalServerError(error);
    }
    throw error;
  }
}

/**
 * Assert value is not null/undefined or throw NotFoundError
 */
export function assertExists<T>(
  value: T | null | undefined,
  resource: string = 'Resource'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NotFoundError(resource);
  }
}
