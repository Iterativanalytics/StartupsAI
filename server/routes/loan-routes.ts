/**
 * Loan Routes
 * Handles all loan-related endpoints
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
 * GET /api/loans
 * Get all loans for authenticated user
 */
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching loans', { userId });
  
  const loans = await storage.getLoansByLender(userId);
  res.json(loans);
}));

/**
 * GET /api/loans/:id
 * Get a specific loan
 */
router.get('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching loan', { loanId: id, userId });
  
  const loan = await storage.getLoanById(id);
  assertExists(loan, 'Loan');
  
  if (loan.lenderId !== userId && loan.borrowerId !== userId) {
    throw new ForbiddenError('Access denied to this loan');
  }
  
  res.json(loan);
}));

/**
 * POST /api/loans
 * Create a new loan
 */
router.post('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertLoanSchema.parse({
    ...req.body,
    lenderId: userId
  });
  
  logger.info('Creating loan', { userId, businessPlanId: validatedData.businessPlanId });
  
  const loan = await storage.createLoan(validatedData as any);
  
  logger.info('Loan created', { loanId: loan.id, userId });
  res.status(201).json(loan);
}));

/**
 * PATCH /api/loans/:id
 * Update a loan
 */
router.patch('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating loan', { loanId: id, userId });
  
  const existingLoan = await storage.getLoanById(id);
  assertExists(existingLoan, 'Loan');
  
  if (existingLoan.lenderId !== userId) {
    throw new ForbiddenError('Access denied to this loan');
  }
  
  const loan = await storage.updateLoan(id, req.body);
  assertExists(loan, 'Loan');
  
  logger.info('Loan updated', { loanId: id, userId });
  res.json(loan);
}));

/**
 * DELETE /api/loans/:id
 * Delete a loan
 */
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Deleting loan', { loanId: id, userId });
  
  const existingLoan = await storage.getLoanById(id);
  assertExists(existingLoan, 'Loan');
  
  if (existingLoan.lenderId !== userId) {
    throw new ForbiddenError('Access denied to this loan');
  }
  
  const success = await storage.deleteLoan(id);
  if (!success) {
    throw new NotFoundError('Loan');
  }
  
  logger.info('Loan deleted', { loanId: id, userId });
  res.status(204).end();
}));

/**
 * GET /api/loans/business-plan/:planId
 * Get loans for a specific business plan
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
  
  const loans = await storage.getLoans(planId);
  res.json(loans);
}));

/**
 * GET /api/loans/borrower/:borrowerId
 * Get loans for a specific borrower
 */
router.get('/borrower/:borrowerId', isAuthenticated, asyncHandler(async (req, res) => {
  const { borrowerId } = req.params;
  const userId = getUserId(req);
  
  // Only allow if user is the borrower or lender
  if (borrowerId !== userId) {
    throw new ForbiddenError('Access denied to this borrower\'s loans');
  }
  
  const loans = await storage.getLoansByBorrower(borrowerId);
  res.json(loans);
}));

/**
 * GET /api/loans/lender/:lenderId
 * Get loans for a specific lender
 */
router.get('/lender/:lenderId', isAuthenticated, asyncHandler(async (req, res) => {
  const { lenderId } = req.params;
  const userId = getUserId(req);
  
  // Only allow if user is the lender
  if (lenderId !== userId) {
    throw new ForbiddenError('Access denied to this lender\'s loans');
  }
  
  const loans = await storage.getLoansByLender(lenderId);
  res.json(loans);
}));

export default router;
