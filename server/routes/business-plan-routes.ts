/**
 * Business Plan Routes
 * Handles all business plan related endpoints
 */

import { Router } from 'express';
import { isAuthenticated } from '../auth-middleware';
import { businessPlanRepository } from '../repositories';
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
 * GET /api/business-plans
 * Get all business plans for authenticated user
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching business plans', { userId });
  
  const plans = await businessPlanRepository.getByUserId(userId);
  res.json(plans);
}));

/**
 * GET /api/business-plans/:id
 * Get a specific business plan
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching business plan', { planId: id, userId });
  
  const plan = await businessPlanRepository.getById(id);
  assertExists(plan, 'Business plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied to this business plan');
  }
  
  res.json(plan);
}));

/**
 * POST /api/business-plans
 * Create a new business plan
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertBusinessPlanSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating business plan', { userId, title: validatedData.title });
  
  const plan = await businessPlanRepository.create(validatedData as any);
  
  logger.info('Business plan created', { planId: plan.id, userId });
  res.status(201).json(plan);
}));

/**
 * PATCH /api/business-plans/:id
 * Update a business plan
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating business plan', { planId: id, userId });
  
  const existingPlan = await businessPlanRepository.getById(id);
  assertExists(existingPlan, 'Business plan');
  
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError('Access denied to this business plan');
  }
  
  const plan = await businessPlanRepository.update(id, req.body);
  assertExists(plan, 'Business plan');
  
  logger.info('Business plan updated', { planId: id, userId });
  res.json(plan);
}));

/**
 * DELETE /api/business-plans/:id
 * Delete a business plan
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting business plan', { planId: id, userId });
  
  const existingPlan = await storage.getBusinessPlan(id);
  assertExists(existingPlan, 'Business plan');
  
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError('Access denied to this business plan');
  }
  
  const success = await storage.deleteBusinessPlan(id);
  if (!success) {
    throw new NotFoundError('Business plan');
  }
  
  logger.info('Business plan deleted', { planId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/business-plans/:planId/sections
 * Get all sections for a business plan
 */
router.get('/:planId/sections', isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  
  const plan = await storage.getBusinessPlan(planId);
  assertExists(plan, 'Business plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }
  
  const sections = storage.getPlanSections(planId);
  res.json(sections);
}));

/**
 * POST /api/business-plans/:planId/sections
 * Create a new section for a business plan
 */
router.post('/:planId/sections', isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  
  const plan = await storage.getBusinessPlan(planId);
  assertExists(plan, 'Business plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }
  
  const validatedData = ValidationSchemas.InsertPlanSectionSchema.parse({
    ...req.body,
    businessPlanId: planId
  });
  
  const section = storage.createPlanSection(validatedData);
  logger.info('Plan section created', { planId, sectionId: section.id });
  
  res.status(201).json(section);
}));

export default router;
