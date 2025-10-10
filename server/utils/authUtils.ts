import type { RequestHandler } from "express";

export interface UserClaims {
  sub: string;
  email: string;
  first_name?: string;
  last_name?: string;
  given_name?: string;
  family_name?: string;
  profile_image_url?: string | null;
  picture?: string;
  user_type?: string;
  userType?: string;
}

export interface AuthenticatedUser {
  id: string;
  claims: UserClaims;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Creates a mock user for development mode testing
 * Centralizes the mock user creation logic to avoid duplication
 */
export function createMockUser(): AuthenticatedUser {
  return {
    id: 'dev-user-123',
    claims: {
      sub: 'dev-user-123',
      email: 'dev@example.com',
      first_name: 'Dev',
      last_name: 'User',
      given_name: 'Dev',
      family_name: 'User',
      profile_image_url: null,
      user_type: 'entrepreneur',
      userType: 'ENTREPRENEUR'
    }
  };
}

/**
 * Common authentication middleware logic for development mode
 * Reduces duplication between different auth providers
 */
export function handleDevelopmentAuth(req: any, res: any, next: any): void {
  console.log('Development mode: Using mock authentication');
  req.user = createMockUser();
  next();
}

/**
 * Common unauthorized response handler
 * Standardizes 401 responses across auth middlewares
 */
export function sendUnauthorizedResponse(res: any, message: string = "Unauthorized"): void {
  res.status(401).json({ message });
}
