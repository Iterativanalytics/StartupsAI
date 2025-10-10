/**
 * Centralized Error Handling Middleware
 * Provides consistent error handling across all routes
 */

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: any
): { message: string; error?: string; statusCode: number } {
  const response: any = {
    message,
    statusCode
  };
  
  if (error instanceof Error) {
    response.error = error.message;
  } else if (typeof error === 'string') {
    response.error = error;
  }
  
  return response;
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Send error response
  res.status(statusCode).json(createErrorResponse(message, statusCode, err));
}

/**
 * Not found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error: AppError = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Common error creators
 */
export class ErrorFactory {
  static badRequest(message: string): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 400;
    error.isOperational = true;
    return error;
  }
  
  static unauthorized(message: string = 'Unauthorized'): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 401;
    error.isOperational = true;
    return error;
  }
  
  static forbidden(message: string = 'Forbidden'): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 403;
    error.isOperational = true;
    return error;
  }
  
  static notFound(message: string = 'Resource not found'): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 404;
    error.isOperational = true;
    return error;
  }
  
  static serviceUnavailable(message: string): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 503;
    error.isOperational = true;
    return error;
  }
  
  static internal(message: string = 'Internal server error'): AppError {
    const error: AppError = new Error(message);
    error.statusCode = 500;
    error.isOperational = false;
    return error;
  }
}
