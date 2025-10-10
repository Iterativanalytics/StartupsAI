/**
 * Advisory Service Routes
 * Handles all advisory service-related endpoints
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
 * GET /api/advisory
 * Get all advisory services for authenticated user
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching advisory services', { userId });
  
  const services = await storage.getAdvisoryServicesByPartner(userId);
  res.json(services);
}));

/**
 * GET /api/advisory/:id
 * Get a specific advisory service
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching advisory service', { serviceId: id, userId });
  
  const service = await storage.getAdvisoryServiceById(id);
  assertExists(service, 'Advisory service');
  
  if (service.partnerId !== userId && service.clientId !== userId) {
    throw new ForbiddenError('Access denied to this advisory service');
  }
  
  res.json(service);
}));

/**
 * POST /api/advisory
 * Create a new advisory service
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertAdvisoryServiceSchema.parse({
    ...req.body,
    partnerId: userId
  });
  
  logger.info('Creating advisory service', { userId, businessPlanId: validatedData.businessPlanId });
  
  const service = await storage.createAdvisoryService(validatedData as any);
  
  logger.info('Advisory service created', { serviceId: service.id, userId });
  res.status(201).json(service);
}));

/**
 * PATCH /api/advisory/:id
 * Update an advisory service
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating advisory service', { serviceId: id, userId });
  
  const existingService = await storage.getAdvisoryServiceById(id);
  assertExists(existingService, 'Advisory service');
  
  if (existingService.partnerId !== userId) {
    throw new ForbiddenError('Access denied to this advisory service');
  }
  
  const service = await storage.updateAdvisoryService(id, req.body);
  assertExists(service, 'Advisory service');
  
  logger.info('Advisory service updated', { serviceId: id, userId });
  res.json(service);
}));

/**
 * DELETE /api/advisory/:id
 * Delete an advisory service
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting advisory service', { serviceId: id, userId });
  
  const existingService = await storage.getAdvisoryServiceById(id);
  assertExists(existingService, 'Advisory service');
  
  if (existingService.partnerId !== userId) {
    throw new ForbiddenError('Access denied to this advisory service');
  }
  
  const success = await storage.deleteAdvisoryService(id);
  if (!success) {
    throw new NotFoundError('Advisory service');
  }
  
  logger.info('Advisory service deleted', { serviceId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/advisory/business-plan/:planId
 * Get advisory services for a specific business plan
 */
router.get('/business-plan/:planId', isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  
  // Verify user has access to the business plan
  const plan = await storage.getBusinessPlan(planId);
  assertExists(plan, 'Business plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied to this business plan');
  }
  
  const services = await storage.getAdvisoryServices(planId);
  res.json(services);
}));

/**
 * GET /api/advisory/partner/:partnerId
 * Get advisory services for a specific partner
 */
router.get('/partner/:partnerId', isAuthenticated, asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const userId = getUserId(req);
  
  // Only allow if user is the partner
  if (partnerId !== userId) {
    throw new ForbiddenError('Access denied to this partner\'s advisory services');
  }
  
  const services = await storage.getAdvisoryServicesByPartner(partnerId);
  res.json(services);
}));

/**
 * GET /api/advisory/client/:clientId
 * Get advisory services for a specific client
 */
router.get('/client/:clientId', isAuthenticated, asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const userId = getUserId(req);
  
  // Only allow if user is the client
  if (clientId !== userId) {
    throw new ForbiddenError('Access denied to this client\'s advisory services');
  }
  
  const services = await storage.getAdvisoryServicesByClient(clientId);
  res.json(services);
}));

export default router;
