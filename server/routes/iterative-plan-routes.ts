/**
 * Iterative Plan Routes
 * Handles all iterative plan related endpoints
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
 * GET /api/iterative-plans
 * Get all iterative plans for authenticated user
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching iterative plans', { userId });
  
  const plans = await businessPlanRepository.getByUserId(userId);
  res.json(plans);
}));

/**
 * GET /api/iterative-plans/:id
 * Get a specific iterative plan
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching iterative plan', { planId: id, userId });
  
  const plan = await businessPlanRepository.getById(id);
  assertExists(plan, 'Iterative plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied to this iterative plan');
  }
  
  res.json(plan);
}));

/**
 * POST /api/iterative-plans
 * Create a new iterative plan
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertBusinessPlanSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating iterative plan', { userId, title: validatedData.title });
  
  const plan = await businessPlanRepository.create(validatedData as any);
  
  logger.info('Iterative plan created', { planId: plan.id, userId });
  res.status(201).json(plan);
}));

/**
 * PATCH /api/iterative-plans/:id
 * Update an iterative plan
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating iterative plan', { planId: id, userId });
  
  const existingPlan = await businessPlanRepository.getById(id);
  assertExists(existingPlan, 'Business plan');
  
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError('Access denied to this iterative plan');
  }
  
  const plan = await businessPlanRepository.update(id, req.body);
  assertExists(plan, 'Iterative plan');
  
  logger.info('Iterative plan updated', { planId: id, userId });
  res.json(plan);
}));

/**
 * DELETE /api/iterative-plans/:id
 * Delete an iterative plan
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting iterative plan', { planId: id, userId });
  
  const existingPlan = await storage.getBusinessPlan(id);
  assertExists(existingPlan, 'Business plan');
  
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError('Access denied to this iterative plan');
  }
  
  const success = await storage.deleteBusinessPlan(id);
  if (!success) {
    throw new NotFoundError('Iterative plan');
  }
  
  logger.info('Iterative plan deleted', { planId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/iterative-plans/:planId/sections
 * Get all sections for an iterative plan
 */
router.get('/:planId/sections', isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  
  const plan = await storage.getIterativePlan(planId);
  assertExists(plan, 'Iterative plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }
  
  const sections = storage.getPlanSections(planId);
  res.json(sections);
}));

/**
 * POST /api/iterative-plans/:planId/sections
 * Create a new section for an iterative plan
 */
router.post('/:planId/sections', isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  
  const plan = await storage.getIterativePlan(planId);
  assertExists(plan, 'Iterative plan');
  
  if (plan.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }
  
  const validatedData = ValidationSchemas.InsertPlanSectionSchema.parse({
    ...req.body,
    iterativePlanId: planId
  });
  
  const section = storage.createPlanSection(validatedData);
  logger.info('Plan section created', { planId, sectionId: section.id });
  
  res.status(201).json(section);
}));

export default router;
