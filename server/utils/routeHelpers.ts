/**
 * Route Helper Utilities
 * Centralized error handling and response utilities for Express routes
 */

import { Request, Response } from 'express';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  message: string;
  error?: string;
}

/**
 * Handle route errors with consistent logging and response format
 */
export function handleRouteError(
  error: unknown,
  res: Response,
  errorMessage: string,
  logContext: string,
  statusCode: number = 500
): void {
  console.error(`Error ${logContext}:`, error);
  
  const response: ErrorResponse = {
    message: errorMessage
  };
  
  if (error instanceof Error) {
    response.error = error.message;
  } else if (typeof error === 'string') {
    response.error = error;
  } else {
    response.error = 'Unknown error';
  }
  
  res.status(statusCode).json(response);
}

/**
 * Check user authentication and return 401 if not authenticated
 * Returns true if authenticated, false otherwise
 */
export function requireAuth(req: Request, res: Response): boolean {
  const userId = (req.user as any)?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

/**
 * Check if resource exists and return 404 if not found
 * Returns true if resource exists, false otherwise
 */
export function requireResource<T>(
  resource: T | null | undefined,
  res: Response,
  resourceName: string = 'Resource'
): resource is T {
  if (!resource) {
    res.status(404).json({ error: `${resourceName} not found` });
    return false;
  }
  return true;
}

/**
 * Validate required fields in request body
 * Returns true if all fields are present, false otherwise
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[],
  res: Response
): boolean {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    res.status(400).json({
      message: 'Missing required fields',
      error: `Required fields: ${missingFields.join(', ')}`
    });
    return false;
  }
  
  return true;
}

/**
 * Async route handler wrapper to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response) => Promise<any>
) {
  return (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}
