/**
 * Business Plan Repository
 * Handles business plan data operations
 */

import { BaseRepository, BaseEntity, InsertEntity, UpdateEntity } from './base-repository';
import { BusinessPlan, InsertBusinessPlan } from '../../shared/schema';
import { storage } from '../storage';

export interface BusinessPlanEntity extends BaseEntity {
  name: string;
  userId: string;
  content?: string;
  description?: string;
  industry?: string;
  stage?: string;
  fundingGoal?: number;
  teamSize?: number;
  targetMarket?: string;
  competitiveAdvantage?: string;
  revenueModel?: string;
  visibility: string;
}

export interface InsertBusinessPlanEntity extends InsertEntity {
  name: string;
  userId: string;
  content?: string;
  description?: string;
  industry?: string;
  stage?: string;
  fundingGoal?: number;
  teamSize?: number;
  targetMarket?: string;
  competitiveAdvantage?: string;
  revenueModel?: string;
  visibility?: string;
}

export interface UpdateBusinessPlanEntity extends UpdateEntity {
  name?: string;
  userId?: string;
  content?: string;
  description?: string;
  industry?: string;
  stage?: string;
  fundingGoal?: number;
  teamSize?: number;
  targetMarket?: string;
  competitiveAdvantage?: string;
  revenueModel?: string;
  visibility?: string;
}

export class BusinessPlanRepository extends BaseRepository<BusinessPlanEntity, InsertBusinessPlanEntity, UpdateBusinessPlanEntity> {
  
  async getById(id: string): Promise<BusinessPlanEntity | undefined> {
    const plan = await this.storage.getBusinessPlan(id);
    return plan as BusinessPlanEntity | undefined;
  }

  async getAll(): Promise<BusinessPlanEntity[]> {
    const plans = await this.storage.getAllBusinessPlans();
    return plans as BusinessPlanEntity[];
  }

  async create(data: InsertBusinessPlanEntity): Promise<BusinessPlanEntity> {
    const plan = await this.storage.createBusinessPlan(data as InsertBusinessPlan);
    return plan as BusinessPlanEntity;
  }

  async update(id: string, data: UpdateBusinessPlanEntity): Promise<BusinessPlanEntity | undefined> {
    const plan = await this.storage.updateBusinessPlan(id, data);
    return plan as BusinessPlanEntity | undefined;
  }

  async delete(id: string): Promise<boolean> {
    return await this.storage.deleteBusinessPlan(id);
  }

  async getCount(): Promise<number> {
    const plans = await this.getAll();
    return plans.length;
  }

  async search(query: string): Promise<BusinessPlanEntity[]> {
    const plans = await this.storage.searchBusinessPlans(query);
    return plans as BusinessPlanEntity[];
  }

  /**
   * Get business plans by user ID
   */
  async getByUserId(userId: string): Promise<BusinessPlanEntity[]> {
    const plans = await this.storage.getBusinessPlansByUserId(userId);
    return plans as BusinessPlanEntity[];
  }

  /**
   * Get plan sections
   */
  async getSections(planId: string): Promise<any[]> {
    return await this.storage.getPlanSections(planId);
  }

  /**
   * Get plan section by ID
   */
  async getSection(id: string): Promise<any | undefined> {
    return await this.storage.getPlanSection(id);
  }

  /**
   * Create plan section
   */
  async createSection(data: any): Promise<any> {
    return await this.storage.createPlanSection(data);
  }

  /**
   * Update plan section
   */
  async updateSection(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updatePlanSection(id, updates);
  }

  /**
   * Get financial data
   */
  async getFinancialData(planId: string): Promise<any | undefined> {
    return await this.storage.getFinancialData(planId);
  }

  /**
   * Create financial data
   */
  async createFinancialData(data: any): Promise<any> {
    return await this.storage.createFinancialData(data);
  }

  /**
   * Update financial data
   */
  async updateFinancialData(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateFinancialData(id, updates);
  }

  /**
   * Get analysis score
   */
  async getAnalysisScore(planId: string): Promise<any | undefined> {
    return await this.storage.getAnalysisScore(planId);
  }

  /**
   * Create analysis score
   */
  async createAnalysisScore(data: any): Promise<any> {
    return await this.storage.createAnalysisScore(data);
  }

  /**
   * Update analysis score
   */
  async updateAnalysisScore(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateAnalysisScore(id, updates);
  }

  /**
   * Get pitch deck
   */
  async getPitchDeck(planId: string): Promise<any | undefined> {
    return await this.storage.getPitchDeck(planId);
  }

  /**
   * Create pitch deck
   */
  async createPitchDeck(data: any): Promise<any> {
    return await this.storage.createPitchDeck(data);
  }

  /**
   * Get investments for business plan
   */
  async getInvestments(planId: string): Promise<any[]> {
    return await this.storage.getInvestments(planId);
  }

  /**
   * Get loans for business plan
   */
  async getLoans(planId: string): Promise<any[]> {
    return await this.storage.getLoans(planId);
  }

  /**
   * Get advisory services for business plan
   */
  async getAdvisoryServices(planId: string): Promise<any[]> {
    return await this.storage.getAdvisoryServices(planId);
  }

  /**
   * Get financial projections
   */
  async getFinancialProjections(planId: string): Promise<any[]> {
    return await this.storage.getFinancialProjections(planId);
  }

  /**
   * Get financial projection by ID
   */
  async getFinancialProjection(id: string): Promise<any | undefined> {
    return await this.storage.getFinancialProjection(id);
  }

  /**
   * Create financial projection
   */
  async createFinancialProjection(data: any): Promise<any> {
    return await this.storage.createFinancialProjection(data);
  }

  /**
   * Update financial projection
   */
  async updateFinancialProjection(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateFinancialProjection(id, updates);
  }

  /**
   * Get AI business analysis
   */
  async getAiBusinessAnalysis(planId: string): Promise<any | undefined> {
    return await this.storage.getAiBusinessAnalysis(planId);
  }

  /**
   * Create AI business analysis
   */
  async createAiBusinessAnalysis(data: any): Promise<any> {
    return await this.storage.createAiBusinessAnalysis(data);
  }

  /**
   * Update AI business analysis
   */
  async updateAiBusinessAnalysis(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateAiBusinessAnalysis(id, updates);
  }
}
