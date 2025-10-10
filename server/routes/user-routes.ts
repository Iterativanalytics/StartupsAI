/**
 * User Routes
 * Handles all user-related endpoints
 */

import { Router } from 'express';
import { isAuthenticated } from '../auth-middleware';
import { userRepository } from '../repositories';
import { asyncHandler, NotFoundError, ForbiddenError, assertExists } from '../utils/errors';
import { logger } from '../utils/logger';
import * as ValidationSchemas from '../../shared/types/validation';

const router = Router();

/**
 * Get user ID from authenticated request
 */
function getUserId(req: any): string {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
}

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user profile', { userId });
  
  const authReq = req as any;
  const claims = authReq.user?.claims;
  
  if (!claims) {
    throw new Error('User claims not found');
  }
  
  // Get user from repository or create from claims
  let user = await userRepository.getById(userId);
  if (!user) {
    // Create user from claims if not exists
    user = await userRepository.upsert({
      id: userId,
      email: claims.email || claims.preferred_username || '',
      firstName: claims.first_name || claims.given_name || '',
      lastName: claims.last_name || claims.family_name || '',
      profileImageUrl: claims.profile_image_url || claims.picture || null
    });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    userType: user.userType,
    userSubtype: user.userSubtype,
    role: user.role,
    verified: user.verified,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
}));

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch('/me', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  logger.info('Updating user profile', { userId });
  
  const validatedData = ValidationSchemas.UpdateUserSchema.parse(req.body);
  
  const updatedUser = await userRepository.update(userId, validatedData);
  assertExists(updatedUser, 'User');
  
  logger.info('User profile updated', { userId });
  res.json(updatedUser);
}));

/**
 * GET /api/users/settings
 * Get user settings
 */
router.get('/settings', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user settings', { userId });
  
  const settings = await userRepository.getSettings(userId);
  res.json(settings || {});
}));

/**
 * PATCH /api/users/settings
 * Update user settings
 */
router.patch('/settings', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  logger.info('Updating user settings', { userId });
  
  const updatedSettings = await userRepository.updateSettings(userId, req.body);
  
  logger.info('User settings updated', { userId });
  res.json(updatedSettings);
}));

/**
 * POST /api/users/settings/reset
 * Reset user settings to defaults
 */
router.post('/settings/reset', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  logger.info('Resetting user settings', { userId });
  
  const resetSettings = await userRepository.resetSettings(userId);
  
  logger.info('User settings reset', { userId });
  res.json(resetSettings);
}));

/**
 * GET /api/users/settings/export
 * Export user settings
 */
router.get('/settings/export', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Exporting user settings', { userId });
  
  const exportedSettings = await userRepository.exportSettings(userId);
  
  res.json(exportedSettings);
}));

/**
 * GET /api/users/organizations
 * Get user's organizations
 */
router.get('/organizations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user organizations', { userId });
  
  const organizations = await userRepository.getOrganizations(userId);
  res.json(organizations);
}));

/**
 * GET /api/users/collaborations
 * Get user's collaborations
 */
router.get('/collaborations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user collaborations', { userId });
  
  const collaborations = await userRepository.getCollaborations(userId);
  res.json(collaborations);
}));

/**
 * GET /api/users/invitations
 * Get user's invitations
 */
router.get('/invitations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user invitations', { userId });
  
  const invitations = await userRepository.getInvitations(userId);
  res.json(invitations);
}));

/**
 * GET /api/users/team-members
 * Get user's team members
 */
router.get('/team-members', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user team members', { userId });
  
  const teamMembers = await userRepository.getTeamMembers(userId);
  res.json(teamMembers);
}));

export default router;
