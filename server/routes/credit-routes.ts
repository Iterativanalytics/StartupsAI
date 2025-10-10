/**
 * Credit Routes
 * Handles all credit scoring and financial milestone endpoints
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
 * GET /api/credit/scores
 * Get user's credit scores
 */
router.get('/scores', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching credit scores', { userId });
  
  const scores = await storage.getCreditScores(userId);
  res.json(scores);
}));

/**
 * GET /api/credit/scores/:id
 * Get a specific credit score
 */
router.get('/scores/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching credit score', { scoreId: id, userId });
  
  const score = await storage.getCreditScore(id);
  assertExists(score, 'Credit score');
  
  if (score.userId !== userId) {
    throw new ForbiddenError('Access denied to this credit score');
  }
  
  res.json(score);
}));

/**
 * POST /api/credit/scores
 * Create a new credit score
 */
router.post('/scores', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertCreditScoreSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating credit score', { userId });
  
  const score = await storage.createCreditScore(validatedData as any);
  
  logger.info('Credit score created', { scoreId: score.id, userId });
  res.status(201).json(score);
}));

/**
 * PATCH /api/credit/scores/:id
 * Update a credit score
 */
router.patch('/scores/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating credit score', { scoreId: id, userId });
  
  const existingScore = await storage.getCreditScore(id);
  assertExists(existingScore, 'Credit score');
  
  if (existingScore.userId !== userId) {
    throw new ForbiddenError('Access denied to this credit score');
  }
  
  const score = await storage.updateCreditScore(id, req.body);
  assertExists(score, 'Credit score');
  
  logger.info('Credit score updated', { scoreId: id, userId });
  res.json(score);
}));

/**
 * GET /api/credit/milestones
 * Get user's financial milestones
 */
router.get('/milestones', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching financial milestones', { userId });
  
  const milestones = await storage.getFinancialMilestones(userId);
  res.json(milestones);
}));

/**
 * GET /api/credit/milestones/:id
 * Get a specific financial milestone
 */
router.get('/milestones/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Fetching financial milestone', { milestoneId: id, userId });
  
  const milestone = await storage.getFinancialMilestone(id);
  assertExists(milestone, 'Financial milestone');
  
  if (milestone.userId !== userId) {
    throw new ForbiddenError('Access denied to this financial milestone');
  }
  
  res.json(milestone);
}));

/**
 * POST /api/credit/milestones
 * Create a new financial milestone
 */
router.post('/milestones', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertFinancialMilestoneSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating financial milestone', { userId });
  
  const milestone = await storage.createFinancialMilestone(validatedData as any);
  
  logger.info('Financial milestone created', { milestoneId: milestone.id, userId });
  res.status(201).json(milestone);
}));

/**
 * PATCH /api/credit/milestones/:id
 * Update a financial milestone
 */
router.patch('/milestones/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating financial milestone', { milestoneId: id, userId });
  
  const existingMilestone = await storage.getFinancialMilestone(id);
  assertExists(existingMilestone, 'Financial milestone');
  
  if (existingMilestone.userId !== userId) {
    throw new ForbiddenError('Access denied to this financial milestone');
  }
  
  const milestone = await storage.updateFinancialMilestone(id, req.body);
  assertExists(milestone, 'Financial milestone');
  
  logger.info('Financial milestone updated', { milestoneId: id, userId });
  res.json(milestone);
}));

/**
 * GET /api/credit/coaching
 * Get AI coaching messages for user
 */
router.get('/coaching', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching AI coaching messages', { userId });
  
  const messages = await storage.getAiCoachingMessages(userId);
  res.json(messages);
}));

/**
 * POST /api/credit/coaching
 * Create a new AI coaching message
 */
router.post('/coaching', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertAiCoachingMessageSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating AI coaching message', { userId });
  
  const message = await storage.createAiCoachingMessage(validatedData as any);
  
  logger.info('AI coaching message created', { messageId: message.id, userId });
  res.status(201).json(message);
}));

/**
 * GET /api/credit/tips
 * Get credit tips
 */
router.get('/tips', isAuthenticated, asyncHandler(async (req, res) => {
  const { category } = req.query;
  logger.info('Fetching credit tips', { category });
  
  const tips = category 
    ? await storage.getCreditTipsByCategory(category as string)
    : await storage.getCreditTips();
  
  res.json(tips);
}));

/**
 * GET /api/credit/tips/:id
 * Get a specific credit tip
 */
router.get('/tips/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info('Fetching credit tip', { tipId: id });
  
  const tip = await storage.getCreditTip(id);
  assertExists(tip, 'Credit tip');
  
  res.json(tip);
}));

/**
 * GET /api/credit/user-tips
 * Get user's personalized credit tips
 */
router.get('/user-tips', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user credit tips', { userId });
  
  const userTips = await storage.getUserCreditTips(userId);
  res.json(userTips);
}));

/**
 * POST /api/credit/user-tips
 * Create a user credit tip
 */
router.post('/user-tips', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertUserCreditTipSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating user credit tip', { userId });
  
  const userTip = await storage.createUserCreditTip(validatedData as any);
  
  logger.info('User credit tip created', { userTipId: userTip.id, userId });
  res.status(201).json(userTip);
}));

/**
 * PATCH /api/credit/user-tips/:id
 * Update a user credit tip
 */
router.patch('/user-tips/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating user credit tip', { userTipId: id, userId });
  
  const userTip = await storage.updateUserCreditTip(id, req.body);
  assertExists(userTip, 'User credit tip');
  
  logger.info('User credit tip updated', { userTipId: id, userId });
  res.json(userTip);
}));

/**
 * GET /api/credit/achievements
 * Get credit achievements
 */
router.get('/achievements', isAuthenticated, asyncHandler(async (req, res) => {
  const { category } = req.query;
  logger.info('Fetching credit achievements', { category });
  
  const achievements = category 
    ? await storage.getCreditAchievementsByCategory(category as string)
    : await storage.getCreditAchievements();
  
  res.json(achievements);
}));

/**
 * GET /api/credit/achievements/user
 * Get user's credit achievements
 */
router.get('/achievements/user', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user credit achievements', { userId });
  
  const achievements = await storage.getUserCreditAchievements(userId);
  res.json(achievements);
}));

/**
 * GET /api/credit/achievements/unseen
 * Get unseen achievements for user
 */
router.get('/achievements/unseen', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching unseen achievements', { userId });
  
  const unseenAchievements = await storage.getUnseenAchievements(userId);
  res.json(unseenAchievements);
}));

/**
 * POST /api/credit/achievements/user
 * Create a user credit achievement
 */
router.post('/achievements/user', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertUserCreditAchievementSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating user credit achievement', { userId });
  
  const achievement = await storage.createUserCreditAchievement(validatedData as any);
  
  logger.info('User credit achievement created', { achievementId: achievement.id, userId });
  res.status(201).json(achievement);
}));

/**
 * PATCH /api/credit/achievements/user/:id
 * Update a user credit achievement
 */
router.patch('/achievements/user/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating user credit achievement', { achievementId: id, userId });
  
  const achievement = await storage.updateUserCreditAchievement(id, req.body);
  assertExists(achievement, 'User credit achievement');
  
  logger.info('User credit achievement updated', { achievementId: id, userId });
  res.json(achievement);
}));

/**
 * PATCH /api/credit/achievements/user/:id/seen
 * Mark achievement as seen
 */
router.patch('/achievements/user/:id/seen', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Marking achievement as seen', { achievementId: id, userId });
  
  const achievement = await storage.markAchievementAsSeen(id);
  assertExists(achievement, 'User credit achievement');
  
  logger.info('Achievement marked as seen', { achievementId: id, userId });
  res.json(achievement);
}));

/**
 * GET /api/credit/history
 * Get credit score history for user
 */
router.get('/history', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching credit score history', { userId });
  
  const history = await storage.getCreditScoreHistory(userId);
  res.json(history);
}));

/**
 * POST /api/credit/history
 * Create a credit score history entry
 */
router.post('/history', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertCreditScoreHistorySchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating credit score history entry', { userId });
  
  const historyEntry = await storage.createCreditScoreHistory(validatedData as any);
  
  logger.info('Credit score history entry created', { historyId: historyEntry.id, userId });
  res.status(201).json(historyEntry);
}));

/**
 * GET /api/credit/points
 * Get user's reward points
 */
router.get('/points', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user reward points', { userId });
  
  const points = await storage.getUserRewardPoints(userId);
  res.json(points || { userId, points: 0, level: 'Bronze' });
}));

/**
 * POST /api/credit/points
 * Create user reward points
 */
router.post('/points', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertUserRewardPointsSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating user reward points', { userId });
  
  const points = await storage.createUserRewardPoints(validatedData as any);
  
  logger.info('User reward points created', { pointsId: points.id, userId });
  res.status(201).json(points);
}));

/**
 * PATCH /api/credit/points/:id
 * Update user reward points
 */
router.patch('/points/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  
  logger.info('Updating user reward points', { pointsId: id, userId });
  
  const points = await storage.updateUserRewardPoints(id, req.body);
  assertExists(points, 'User reward points');
  
  logger.info('User reward points updated', { pointsId: id, userId });
  res.json(points);
}));

/**
 * POST /api/credit/points/add
 * Add points to user
 */
router.post('/points/add', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { points } = req.body;
  
  logger.info('Adding points to user', { userId, points });
  
  const updatedPoints = await storage.addUserPoints(userId, points);
  
  logger.info('Points added to user', { userId, points });
  res.json(updatedPoints);
}));

/**
 * GET /api/credit/transactions
 * Get user's point transactions
 */
router.get('/transactions', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info('Fetching user point transactions', { userId });
  
  const transactions = await storage.getPointTransactions(userId);
  res.json(transactions);
}));

/**
 * POST /api/credit/transactions
 * Create a point transaction
 */
router.post('/transactions', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  
  const validatedData = ValidationSchemas.InsertPointTransactionSchema.parse({
    ...req.body,
    userId
  });
  
  logger.info('Creating point transaction', { userId });
  
  const transaction = await storage.createPointTransaction(validatedData as any);
  
  logger.info('Point transaction created', { transactionId: transaction.id, userId });
  res.status(201).json(transaction);
}));

export default router;
