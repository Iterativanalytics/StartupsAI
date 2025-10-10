/**
 * Team Collaboration Routes
 * Handles all team collaboration and invitation endpoints
 */

import { Router } from 'express';
import { isAuthenticated } from '../auth-middleware';
import { storage } from '../storage';
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
 * GET /api/team/members
 * Get user's team members
 */
router.get('/members', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching team members', { userId });
  
  const members = await storage.getTeamMembers(userId);
  res.json(members);
}));

/**
 * POST /api/team/invitations
 * Create a team invitation
 */
router.post('/invitations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertTeamInvitationSchema.parse({
    ...req.body,
    invitedBy: userId
  });
  
  logger.info('Creating team invitation', { userId });
  
  const invitation = await storage.createTeamInvitation(validatedData as any);
  
  logger.info('Team invitation created', { invitationId: invitation.id, userId });
  res.status(201).json(invitation);
}));

/**
 * GET /api/team/invitations
 * Get user's team invitations
 */
router.get('/invitations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching team invitations', { userId });
  
  const invitations = await storage.getTeamInvitations(userId);
  res.json(invitations);
}));

/**
 * GET /api/team/invitations/:id
 * Get a specific team invitation
 */
router.get('/invitations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching team invitation', { invitationId: id, userId });
  
  const invitation = await storage.getTeamInvitation(id);
  assertExists(invitation, 'Team invitation');
  
  if (invitation.invitedBy !== userId && invitation.invitedUserId !== userId) {
    throw new ForbiddenError('Access denied to this team invitation');
  }
  
  res.json(invitation);
}));

/**
 * PATCH /api/team/invitations/:id
 * Update a team invitation (accept/decline)
 */
router.patch('/invitations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating team invitation', { invitationId: id, userId });
  
  const invitation = await storage.updateTeamInvitation(id, req.body);
  assertExists(invitation, 'Team invitation');
  
  logger.info('Team invitation updated', { invitationId: id, userId });
  res.json(invitation);
}));

/**
 * DELETE /api/team/invitations/:id
 * Cancel a team invitation
 */
router.delete('/invitations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Cancelling team invitation', { invitationId: id, userId });
  
  const success = await storage.cancelTeamInvitation(id);
  if (!success) {
    throw new NotFoundError('Team invitation');
  }
  
  logger.info('Team invitation cancelled', { invitationId: id, userId });
  res.status(204).end();
}));

/**
 * POST /api/team/invitations/:id/resend
 * Resend a team invitation
 */
router.post('/invitations/:id/resend', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Resending team invitation', { invitationId: id, userId });
  
  const success = await storage.resendTeamInvitation(id);
  if (!success) {
    throw new NotFoundError('Team invitation');
  }
  
  logger.info('Team invitation resent', { invitationId: id, userId });
  res.json({ message: 'Invitation resent successfully' });
}));

/**
 * PATCH /api/team/members/:id
 * Update team member role/permissions
 */
router.patch('/members/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating team member', { memberId: id, userId });
  
  const member = await storage.updateTeamMember(id, req.body);
  assertExists(member, 'Team member');
  
  logger.info('Team member updated', { memberId: id, userId });
  res.json(member);
}));

/**
 * DELETE /api/team/members/:id
 * Remove team member
 */
router.delete('/members/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Removing team member', { memberId: id, userId });
  
  const success = await storage.removeTeamMember(id);
  if (!success) {
    throw new NotFoundError('Team member');
  }
  
  logger.info('Team member removed', { memberId: id, userId });
  res.status(204).end();
}));

/**
 * POST /api/team/collaborations
 * Create a collaboration
 */
router.post('/collaborations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertCollaborationSchema.parse({
    ...req.body,
    createdBy: userId
  });
  
  logger.info('Creating collaboration', { userId });
  
  const collaboration = await storage.createCollaboration(validatedData as any);
  
  logger.info('Collaboration created', { collaborationId: collaboration.id, userId });
  res.status(201).json(collaboration);
}));

/**
 * GET /api/team/collaborations
 * Get user's collaborations
 */
router.get('/collaborations', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching collaborations', { userId });
  
  const collaborations = await storage.getUserCollaborations(userId);
  res.json(collaborations);
}));

/**
 * GET /api/team/collaborations/:id
 * Get a specific collaboration
 */
router.get('/collaborations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching collaboration', { collaborationId: id, userId });
  
  const collaboration = await storage.getCollaboration(id);
  assertExists(collaboration, 'Collaboration');
  
  if (collaboration.createdBy !== userId && !collaboration.participants.includes(userId)) {
    throw new ForbiddenError('Access denied to this collaboration');
  }
  
  res.json(collaboration);
}));

/**
 * PATCH /api/team/collaborations/:id
 * Update a collaboration
 */
router.patch('/collaborations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating collaboration', { collaborationId: id, userId });
  
  const existingCollaboration = await storage.getCollaboration(id);
  assertExists(existingCollaboration, 'Collaboration');
  
  if (existingCollaboration.createdBy !== userId) {
    throw new ForbiddenError('Access denied to this collaboration');
  }
  
  const collaboration = await storage.updateCollaboration(id, req.body);
  assertExists(collaboration, 'Collaboration');
  
  logger.info('Collaboration updated', { collaborationId: id, userId });
  res.json(collaboration);
}));

/**
 * DELETE /api/team/collaborations/:id
 * Delete a collaboration
 */
router.delete('/collaborations/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting collaboration', { collaborationId: id, userId });
  
  const existingCollaboration = await storage.getCollaboration(id);
  assertExists(existingCollaboration, 'Collaboration');
  
  if (existingCollaboration.createdBy !== userId) {
    throw new ForbiddenError('Access denied to this collaboration');
  }
  
  const success = await storage.deleteCollaboration(id);
  if (!success) {
    throw new NotFoundError('Collaboration');
  }
  
  logger.info('Collaboration deleted', { collaborationId: id, userId });
  res.status(204).end();
}));

export default router;
