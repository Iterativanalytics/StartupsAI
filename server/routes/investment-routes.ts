/**
 * Investment Routes
 * Handles all investment-related endpoints
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
 * GET /api/investments
 * Get all investments for authenticated user
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching investments', { userId });
  
  const investments = await storage.getInvestmentsByInvestor(userId);
  res.json(investments);
}));

/**
 * GET /api/investments/:id
 * Get a specific investment
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching investment', { investmentId: id, userId });
  
  const investment = await storage.getInvestmentById(id);
  assertExists(investment, 'Investment');
  
  if (investment.investorId !== userId) {
    throw new ForbiddenError('Access denied to this investment');
  }
  
  res.json(investment);
}));

/**
 * POST /api/investments
 * Create a new investment
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertInvestmentSchema.parse({
    ...req.body,
    investorId: userId
  });
  
  logger.info('Creating investment', { userId, businessPlanId: validatedData.businessPlanId });
  
  const investment = await storage.createInvestment(validatedData as any);
  
  logger.info('Investment created', { investmentId: investment.id, userId });
  res.status(201).json(investment);
}));

/**
 * PATCH /api/investments/:id
 * Update an investment
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating investment', { investmentId: id, userId });
  
  const existingInvestment = await storage.getInvestmentById(id);
  assertExists(existingInvestment, 'Investment');
  
  if (existingInvestment.investorId !== userId) {
    throw new ForbiddenError('Access denied to this investment');
  }
  
  const investment = await storage.updateInvestment(id, req.body);
  assertExists(investment, 'Investment');
  
  logger.info('Investment updated', { investmentId: id, userId });
  res.json(investment);
}));

/**
 * DELETE /api/investments/:id
 * Delete an investment
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting investment', { investmentId: id, userId });
  
  const existingInvestment = await storage.getInvestmentById(id);
  assertExists(existingInvestment, 'Investment');
  
  if (existingInvestment.investorId !== userId) {
    throw new ForbiddenError('Access denied to this investment');
  }
  
  const success = await storage.deleteInvestment(id);
  if (!success) {
    throw new NotFoundError('Investment');
  }
  
  logger.info('Investment deleted', { investmentId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/investments/business-plan/:planId
 * Get investments for a specific business plan
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
  
  const investments = await storage.getInvestments(planId);
  res.json(investments);
}));

export default router;
