/**
 * Organization Routes
 * Handles all organization-related endpoints
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
 * GET /api/organizations
 * Get all organizations
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching organizations', { userId });
  
  const organizations = await storage.getAllOrganizations();
  res.json(organizations);
}));

/**
 * GET /api/organizations/:id
 * Get a specific organization
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization', { organizationId: id, userId });
  
  const organization = await storage.getOrganization(id);
  assertExists(organization, 'Organization');
  
  res.json(organization);
}));

/**
 * POST /api/organizations
 * Create a new organization
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertOrganizationSchema.parse({
    ...req.body,
    ownerId: userId
  });
  
  logger.info('Creating organization', { userId, name: validatedData.name });
  
  const organization = await storage.createOrganization(validatedData as any);
  
  logger.info('Organization created', { organizationId: organization.id, userId });
  res.status(201).json(organization);
}));

/**
 * PATCH /api/organizations/:id
 * Update an organization
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating organization', { organizationId: id, userId });
  
  const existingOrganization = await storage.getOrganization(id);
  assertExists(existingOrganization, 'Organization');
  
  if (existingOrganization.ownerId !== userId) {
    throw new ForbiddenError('Access denied to this organization');
  }
  
  const organization = await storage.updateOrganization(id, req.body);
  assertExists(organization, 'Organization');
  
  logger.info('Organization updated', { organizationId: id, userId });
  res.json(organization);
}));

/**
 * DELETE /api/organizations/:id
 * Delete an organization
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting organization', { organizationId: id, userId });
  
  const existingOrganization = await storage.getOrganization(id);
  assertExists(existingOrganization, 'Organization');
  
  if (existingOrganization.ownerId !== userId) {
    throw new ForbiddenError('Access denied to this organization');
  }
  
  const success = await storage.deleteOrganization(id);
  if (!success) {
    throw new NotFoundError('Organization');
  }
  
  logger.info('Organization deleted', { organizationId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/organizations/:id/members
 * Get organization members
 */
router.get('/:id/members', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization members', { organizationId: id, userId });
  
  const members = await storage.getOrganizationMembers(id);
  res.json(members);
}));

/**
 * POST /api/organizations/:id/members
 * Add user to organization
 */
router.post('/:id/members', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId: memberId, role } = req.body;
  const currentUserId = getUserId(req);
  
  logger.info('Adding user to organization', { 
    organizationId: id, 
    memberId, 
    role, 
    currentUserId 
  });
  
  const membership = await storage.addUserToOrganization(memberId, id, role);
  
  logger.info('User added to organization', { organizationId: id, memberId });
  res.status(201).json(membership);
}));

/**
 * GET /api/organizations/:id/invitations
 * Get organization invitations
 */
router.get('/:id/invitations', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization invitations', { organizationId: id, userId });
  
  const invitations = await storage.getOrganizationInvitations(id);
  res.json(invitations);
}));

/**
 * POST /api/organizations/:id/invitations
 * Create organization invitation
 */
router.post('/:id/invitations', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertOrganizationInvitationSchema.parse({
    ...req.body,
    organizationId: id,
    invitedBy: userId
  });
  
  logger.info('Creating organization invitation', { organizationId: id, userId });
  
  const invitation = await storage.createOrganizationInvitation(validatedData as any);
  
  logger.info('Organization invitation created', { invitationId: invitation.id, organizationId: id });
  res.status(201).json(invitation);
}));

/**
 * GET /api/organizations/:id/analytics
 * Get organization analytics
 */
router.get('/:id/analytics', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization analytics', { organizationId: id, userId });
  
  const analytics = await storage.getOrganizationAnalytics(id);
  res.json(analytics);
}));

/**
 * GET /api/organizations/:id/programs
 * Get organization programs
 */
router.get('/:id/programs', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization programs', { organizationId: id, userId });
  
  const programs = await storage.getPrograms(id);
  res.json(programs);
}));

/**
 * GET /api/organizations/:id/portfolios
 * Get organization portfolios
 */
router.get('/:id/portfolios', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization portfolios', { organizationId: id, userId });
  
  const portfolios = await storage.getPortfolios(id);
  res.json(portfolios);
}));

/**
 * GET /api/organizations/:id/venture-projects
 * Get organization venture projects
 */
router.get('/:id/venture-projects', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching organization venture projects', { organizationId: id, userId });
  
  const projects = await storage.getVentureProjects(id);
  res.json(projects);
}));

export default router;
