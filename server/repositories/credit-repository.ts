/**
 * Credit Repository
 * Handles credit scoring and financial milestone data operations
 */

import { BaseRepository, BaseEntity, InsertEntity, UpdateEntity } from './base-repository';
import { storage } from '../storage';

export interface CreditScoreEntity extends BaseEntity {
  userId: string;
  score: number;
  factors: any;
  calculatedAt: Date;
  validUntil?: Date;
}

export interface InsertCreditScoreEntity extends InsertEntity {
  userId: string;
  score: number;
  factors: any;
  calculatedAt: Date;
  validUntil?: Date;
}

export interface UpdateCreditScoreEntity extends UpdateEntity {
  userId?: string;
  score?: number;
  factors?: any;
  calculatedAt?: Date;
  validUntil?: Date;
}

export interface FinancialMilestoneEntity extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface InsertFinancialMilestoneEntity extends InsertEntity {
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  completedDate?: Date;
  status?: 'pending' | 'completed' | 'overdue';
  category: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateFinancialMilestoneEntity extends UpdateEntity {
  userId?: string;
  title?: string;
  description?: string;
  targetDate?: Date;
  completedDate?: Date;
  status?: 'pending' | 'completed' | 'overdue';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export class CreditRepository extends BaseRepository<CreditScoreEntity, InsertCreditScoreEntity, UpdateCreditScoreEntity> {
  
  async getById(id: string): Promise<CreditScoreEntity | undefined> {
    const score = await this.storage.getCreditScore(id);
    return score as CreditScoreEntity | undefined;
  }

  async getAll(): Promise<CreditScoreEntity[]> {
    // Get all credit scores across all users
    const allUsers = await this.storage.getAllUsers();
    const allScores: CreditScoreEntity[] = [];
    
    for (const user of allUsers) {
      const userScores = await this.storage.getCreditScores(user.id.toString());
      allScores.push(...(userScores as CreditScoreEntity[]));
    }
    
    return allScores;
  }

  async create(data: InsertCreditScoreEntity): Promise<CreditScoreEntity> {
    const score = await this.storage.createCreditScore(data);
    return score as CreditScoreEntity;
  }

  async update(id: string, data: UpdateCreditScoreEntity): Promise<CreditScoreEntity | undefined> {
    const score = await this.storage.updateCreditScore(id, data);
    return score as CreditScoreEntity | undefined;
  }

  async delete(id: string): Promise<boolean> {
    // Note: storage doesn't have deleteCreditScore method, so return false for now
    return false;
  }

  async getCount(): Promise<number> {
    const scores = await this.getAll();
    return scores.length;
  }

  async search(query: string): Promise<CreditScoreEntity[]> {
    // Basic search implementation
    const scores = await this.getAll();
    return scores.filter(score => 
      score.userId.includes(query) ||
      score.score.toString().includes(query)
    );
  }

  /**
   * Get credit scores by user ID
   */
  async getByUserId(userId: string): Promise<CreditScoreEntity[]> {
    const scores = await this.storage.getCreditScores(userId);
    return scores as CreditScoreEntity[];
  }

  /**
   * Get latest credit score for user
   */
  async getLatestByUserId(userId: string): Promise<CreditScoreEntity | undefined> {
    const scores = await this.getByUserId(userId);
    if (scores.length === 0) return undefined;
    
    // Sort by calculatedAt date and return the latest
    return scores.sort((a, b) => 
      new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()
    )[0];
  }

  /**
   * Get financial milestones by user ID
   */
  async getFinancialMilestones(userId: string): Promise<FinancialMilestoneEntity[]> {
    const milestones = await this.storage.getFinancialMilestones(userId);
    return milestones as FinancialMilestoneEntity[];
  }

  /**
   * Get financial milestone by ID
   */
  async getFinancialMilestone(id: string): Promise<FinancialMilestoneEntity | undefined> {
    const milestone = await this.storage.getFinancialMilestone(id);
    return milestone as FinancialMilestoneEntity | undefined;
  }

  /**
   * Create financial milestone
   */
  async createFinancialMilestone(data: InsertFinancialMilestoneEntity): Promise<FinancialMilestoneEntity> {
    const milestone = await this.storage.createFinancialMilestone(data);
    return milestone as FinancialMilestoneEntity;
  }

  /**
   * Update financial milestone
   */
  async updateFinancialMilestone(id: string, data: UpdateFinancialMilestoneEntity): Promise<FinancialMilestoneEntity | undefined> {
    const milestone = await this.storage.updateFinancialMilestone(id, data);
    return milestone as FinancialMilestoneEntity | undefined;
  }

  /**
   * Delete financial milestone
   */
  async deleteFinancialMilestone(id: string): Promise<boolean> {
    // Note: storage doesn't have deleteFinancialMilestone method, so return false for now
    return false;
  }

  /**
   * Get AI coaching messages by user ID
   */
  async getAiCoachingMessages(userId: string): Promise<any[]> {
    return await this.storage.getAiCoachingMessages(userId);
  }

  /**
   * Create AI coaching message
   */
  async createAiCoachingMessage(data: any): Promise<any> {
    return await this.storage.createAiCoachingMessage(data);
  }

  /**
   * Get credit tips
   */
  async getCreditTips(): Promise<any[]> {
    return await this.storage.getCreditTips();
  }

  /**
   * Get credit tips by category
   */
  async getCreditTipsByCategory(category: string): Promise<any[]> {
    return await this.storage.getCreditTipsByCategory(category);
  }

  /**
   * Get credit tip by ID
   */
  async getCreditTip(id: string): Promise<any | undefined> {
    return await this.storage.getCreditTip(id);
  }

  /**
   * Create credit tip
   */
  async createCreditTip(data: any): Promise<any> {
    return await this.storage.createCreditTip(data);
  }

  /**
   * Get user credit tips
   */
  async getUserCreditTips(userId: string): Promise<any[]> {
    return await this.storage.getUserCreditTips(userId);
  }

  /**
   * Create user credit tip
   */
  async createUserCreditTip(data: any): Promise<any> {
    return await this.storage.createUserCreditTip(data);
  }

  /**
   * Update user credit tip
   */
  async updateUserCreditTip(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateUserCreditTip(id, updates);
  }

  /**
   * Get credit achievements
   */
  async getCreditAchievements(): Promise<any[]> {
    return await this.storage.getCreditAchievements();
  }

  /**
   * Get credit achievements by category
   */
  async getCreditAchievementsByCategory(category: string): Promise<any[]> {
    return await this.storage.getCreditAchievementsByCategory(category);
  }

  /**
   * Get credit achievement by ID
   */
  async getCreditAchievement(id: string): Promise<any | undefined> {
    return await this.storage.getCreditAchievement(id);
  }

  /**
   * Create credit achievement
   */
  async createCreditAchievement(data: any): Promise<any> {
    return await this.storage.createCreditAchievement(data);
  }

  /**
   * Get user credit achievements
   */
  async getUserCreditAchievements(userId: string): Promise<any[]> {
    return await this.storage.getUserCreditAchievements(userId);
  }

  /**
   * Get unseen achievements for user
   */
  async getUnseenAchievements(userId: string): Promise<any[]> {
    return await this.storage.getUnseenAchievements(userId);
  }

  /**
   * Create user credit achievement
   */
  async createUserCreditAchievement(data: any): Promise<any> {
    return await this.storage.createUserCreditAchievement(data);
  }

  /**
   * Update user credit achievement
   */
  async updateUserCreditAchievement(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateUserCreditAchievement(id, updates);
  }

  /**
   * Mark achievement as seen
   */
  async markAchievementAsSeen(id: string): Promise<any | undefined> {
    return await this.storage.markAchievementAsSeen(id);
  }

  /**
   * Get credit score history by user ID
   */
  async getCreditScoreHistory(userId: string): Promise<any[]> {
    return await this.storage.getCreditScoreHistory(userId);
  }

  /**
   * Create credit score history entry
   */
  async createCreditScoreHistory(data: any): Promise<any> {
    return await this.storage.createCreditScoreHistory(data);
  }

  /**
   * Get user reward points
   */
  async getUserRewardPoints(userId: string): Promise<any | undefined> {
    return await this.storage.getUserRewardPoints(userId);
  }

  /**
   * Create user reward points
   */
  async createUserRewardPoints(data: any): Promise<any> {
    return await this.storage.createUserRewardPoints(data);
  }

  /**
   * Update user reward points
   */
  async updateUserRewardPoints(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateUserRewardPoints(id, updates);
  }

  /**
   * Add points to user
   */
  async addUserPoints(userId: string, points: number): Promise<any | undefined> {
    return await this.storage.addUserPoints(userId, points);
  }

  /**
   * Get point transactions by user ID
   */
  async getPointTransactions(userId: string): Promise<any[]> {
    return await this.storage.getPointTransactions(userId);
  }

  /**
   * Create point transaction
   */
  async createPointTransaction(data: any): Promise<any> {
    return await this.storage.createPointTransaction(data);
  }

  /**
   * Get credit score tiers
   */
  async getCreditScoreTiers(): Promise<any[]> {
    return await this.storage.getCreditScoreTiers();
  }

  /**
   * Get credit score tier by ID
   */
  async getCreditScoreTier(id: string): Promise<any | undefined> {
    return await this.storage.getCreditScoreTier(id);
  }

  /**
   * Get credit score tier by score
   */
  async getCreditScoreTierByScore(score: number): Promise<any | undefined> {
    return await this.storage.getCreditScoreTierByScore(score);
  }

  /**
   * Create credit score tier
   */
  async createCreditScoreTier(data: any): Promise<any> {
    return await this.storage.createCreditScoreTier(data);
  }

  /**
   * Update credit score tier
   */
  async updateCreditScoreTier(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateCreditScoreTier(id, updates);
  }
}
