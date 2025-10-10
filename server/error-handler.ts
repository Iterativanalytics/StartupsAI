
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class ValidationError extends Error implements AppError {
  statusCode = 400;
  isOperational = true;
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  isOperational = true;
  
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;
  isOperational = true;
  
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const errorLogger = (error: Error, req: any) => {
  console.error(`Error: ${error.message}`, {
    path: req.path,
    method: req.method,
    userId: req.user?.claims?.sub,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

export const sanitizeError = (error: any): { message: string; statusCode: number } => {
  if (error.isOperational) {
    return {
      message: error.message,
      statusCode: error.statusCode
    };
  }
  
  // Don't expose internal errors
  return {
    message: 'Internal server error',
    statusCode: 500
  };
};
