export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class RateLimitError extends AgentError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AgentError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AgentError {
  constructor(message: string = 'Not authorized') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class LLMError extends AgentError {
  constructor(message: string, details?: any) {
    super(message, 'LLM_ERROR', 500, details);
    this.name = 'LLMError';
  }
}

export function handleError(error: any): AgentError {
  if (error instanceof AgentError) {
    return error;
  }

  // Anthropic API errors
  if (error.type === 'invalid_request_error') {
    return new ValidationError(error.message, error);
  }

  if (error.type === 'authentication_error') {
    return new AuthenticationError(error.message);
  }

  if (error.type === 'rate_limit_error') {
    return new RateLimitError(error.message);
  }

  // Generic errors
  return new AgentError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500,
    error
  );
}

export function formatErrorResponse(error: AgentError) {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    }
  };
}