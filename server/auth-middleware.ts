import type { RequestHandler } from "express";
import { handleDevelopmentAuth, sendUnauthorizedResponse } from "./utils/authUtils";

/**
 * Authentication middleware for development and production
 * In development mode, creates a mock user for testing
 * In production, validates user session from OAuth providers
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return handleDevelopmentAuth(req, res, next);
  }

  if (!req.user) {
    return sendUnauthorizedResponse(res);
  }

  next();
};

// Export authMiddleware as an alias for compatibility
export const authMiddleware = isAuthenticated;