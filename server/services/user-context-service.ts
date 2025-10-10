/**
 * User Context Service
 * 
 * Aggregates comprehensive user context for intelligent agent interactions.
 * Includes business profile, documents, activity, goals, metrics, and relationships.
 * 
 * Features:
 * - 5-minute TTL caching for performance
 * - Event-driven cache invalidation
 * - Parallel data fetching
 * - Comprehensive error handling
 */

import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { NotFoundError } from '../utils/errors';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UserContext {
  userId: number;
  userType: UserType;
  businessProfile: BusinessProfile | null;
  documents: DocumentContext;
  recentActivity: Activity[];
  goals: Goal[];
  metrics: UserMetrics;
  relationships: RelationshipMap;
  preferences: UserPreferences;
  assessmentProfile?: AssessmentProfile;
  cachedAt: Date;
}

export interface BusinessProfile {
  stage: 'idea' | 'validation' | 'early_traction' | 'growth' | 'scaling' | 'mature';
  industry?: string;
  description?: string;
  revenue: number;
  team: TeamMember[];
  targetMarket?: string;
  competitiveAdvantage?: string;
  milestones: Milestone[];
  fundingStatus?: {
    totalRaised: number;
    lastRound?: string;
    seeking?: boolean;
  };
}

export interface DocumentContext {
  businessPlan: BusinessPlanContext | null;
  financials: FinancialContext | null;
  pitchDeck: PitchDeckContext | null;
  documents: Document[];
}

export interface BusinessPlanContext {
  id: number;
  completeness: number; // 0-100
  lastUpdated: Date;
  sections: SectionStatus[];
}

export interface SectionStatus {
  name: string;
  complete: boolean;
  wordCount: number;
  lastUpdated: Date;
}

export interface FinancialContext {
  projections: {
    revenue: number[];
    expenses: number[];
    runway: number; // months
  };
  currentMetrics: {
    mrr?: number;
    arr?: number;
    burnRate?: number;
    cac?: number;
    ltv?: number;
  };
}

export interface PitchDeckContext {
  id: number;
  slideCount: number;
  lastUpdated: Date;
}

export interface Activity {
  id: number;
  type: string;
  timestamp: Date;
  metadata?: any;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  progress: number; // 0-100
  targetDate?: Date;
  createdAt: Date;
  category: 'revenue' | 'product' | 'team' | 'funding' | 'other';
}

export interface UserMetrics {
  currentRevenue?: number;
  growth?: {
    mom: number; // month-over-month %
    qoq: number; // quarter-over-quarter %
  };
  engagement: {
    loginStreak: number;
    lastLogin: Date;
    totalSessions: number;
  };
  recentFundingActivity?: boolean;
}

export interface RelationshipMap {
  agents: {
    [agentType: string]: {
      stage: string;
      trustScore: number;
      lastInteraction: Date;
    };
  };
  team?: TeamMember[];
  mentors?: Mentor[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  joinedAt: Date;
}

export interface Mentor {
  id: number;
  name: string;
  expertise: string[];
}

export interface UserPreferences {
  communicationStyle?: string;
  notificationSettings?: any;
  aiAssistanceLevel?: 'minimal' | 'balanced' | 'proactive';
}

export interface AssessmentProfile {
  personalityTraits: {
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    neuroticism: number;
    openness: number;
    analyticalThinking: number;
  };
  workStyle?: string;
  strengths?: string[];
  developmentAreas?: string[];
  completedAt: Date;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Milestone {
  id: number;
  title: string;
  completedAt?: Date;
  targetDate?: Date;
}

export type UserType = 'entrepreneur' | 'investor' | 'lender' | 'grantor' | 'partner';

// ============================================================================
// USER CONTEXT SERVICE
// ============================================================================

export class UserContextService {
  private cache = new Map<number, { context: UserContext; timestamp: number }>();
  private cacheTTL = 300000; // 5 minutes
  private eventEmitter = new EventEmitter();

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Build comprehensive user context
   * Uses caching to avoid redundant database queries
   */
  async buildContext(userId: number): Promise<UserContext> {
    try {
      // Check cache first
      const cached = this.cache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        logger.debug('Context cache hit', { userId });
        return cached.context;
      }

      logger.debug('Building fresh context', { userId });

      // Fetch all data in parallel for performance
      const [
        user,
        businessPlan,
        portfolio,
        recentActivity,
        goals,
        metrics,
        relationships,
        assessment
      ] = await Promise.all([
        this.getUserProfile(userId),
        this.getLatestBusinessPlan(userId).catch(() => null),
        this.getUserPortfolio(userId).catch(() => null),
        this.getRecentActivity(userId, 30).catch(() => []),
        this.getUserGoals(userId).catch(() => []),
        this.getUserMetrics(userId).catch(() => this.getDefaultMetrics()),
        this.getRelationships(userId).catch(() => ({ agents: {} })),
        this.getLatestAssessment(userId).catch(() => null)
      ]);

      if (!user) {
        throw new NotFoundError('User');
      }

      const context: UserContext = {
        userId,
        userType: user.type as UserType,
        businessProfile: this.buildBusinessProfile(businessPlan, metrics),
        documents: this.buildDocumentContext(businessPlan, portfolio),
        recentActivity,
        goals,
        metrics,
        relationships,
        preferences: user.preferences || {},
        assessmentProfile: assessment,
        cachedAt: new Date()
      };

      // Cache the context
      this.cache.set(userId, { context, timestamp: Date.now() });

      logger.info('Context built successfully', { userId, userType: context.userType });

      return context;
    } catch (error) {
      logger.error('Failed to build context', { userId, error });
      throw error;
    }
  }

  /**
   * Build business profile from plan and metrics
   */
  private buildBusinessProfile(
    businessPlan: any,
    metrics: UserMetrics
  ): BusinessProfile | null {
    if (!businessPlan) {
      return null;
    }

    return {
      stage: businessPlan.stage || 'idea',
      industry: businessPlan.industry,
      description: businessPlan.executiveSummary || businessPlan.summary,
      revenue: metrics.currentRevenue || 0,
      team: businessPlan.team || [],
      targetMarket: businessPlan.targetMarket,
      competitiveAdvantage: businessPlan.competitiveAdvantage,
      milestones: businessPlan.milestones || [],
      fundingStatus: businessPlan.fundingStatus
    };
  }

  /**
   * Build document context
   */
  private buildDocumentContext(
    businessPlan: any,
    portfolio: any
  ): DocumentContext {
    return {
      businessPlan: businessPlan ? {
        id: businessPlan.id,
        completeness: this.calculateCompleteness(businessPlan),
        lastUpdated: businessPlan.updatedAt,
        sections: this.extractSections(businessPlan)
      } : null,
      financials: portfolio?.financials ? {
        projections: portfolio.financials.projections || { revenue: [], expenses: [], runway: 0 },
        currentMetrics: portfolio.financials.current || {}
      } : null,
      pitchDeck: portfolio?.pitchDeck ? {
        id: portfolio.pitchDeck.id,
        slideCount: portfolio.pitchDeck.slideCount || 0,
        lastUpdated: portfolio.pitchDeck.updatedAt
      } : null,
      documents: portfolio?.documents || []
    };
  }

  /**
   * Calculate business plan completeness
   */
  private calculateCompleteness(businessPlan: any): number {
    if (!businessPlan) return 0;

    const requiredSections = [
      'executiveSummary',
      'problemStatement',
      'solution',
      'marketAnalysis',
      'businessModel',
      'financialProjections',
      'team'
    ];

    const completedSections = requiredSections.filter(
      section => businessPlan[section] && businessPlan[section].length > 100
    );

    return Math.round((completedSections.length / requiredSections.length) * 100);
  }

  /**
   * Extract section statuses
   */
  private extractSections(businessPlan: any): SectionStatus[] {
    const sections = [
      'executiveSummary',
      'problemStatement',
      'solution',
      'marketAnalysis',
      'businessModel',
      'financialProjections',
      'team'
    ];

    return sections.map(name => ({
      name,
      complete: businessPlan[name]?.length > 100,
      wordCount: businessPlan[name]?.split(' ').length || 0,
      lastUpdated: businessPlan.updatedAt || new Date()
    }));
  }

  /**
   * Get default metrics for new users
   */
  private getDefaultMetrics(): UserMetrics {
    return {
      engagement: {
        loginStreak: 1,
        lastLogin: new Date(),
        totalSessions: 1
      }
    };
  }

  /**
   * Invalidate context cache
   */
  async invalidateContext(userId: number): Promise<void> {
    this.cache.delete(userId);
    logger.debug('Context invalidated', { userId });
  }

  /**
   * Setup event listeners for automatic cache invalidation
   */
  private setupEventListeners(): void {
    const events = [
      'business_plan:updated',
      'business_plan:created',
      'portfolio:updated',
      'goals:updated',
      'goals:created',
      'metrics:updated',
      'user:profile_updated',
      'assessment:completed'
    ];

    events.forEach(event => {
      this.eventEmitter.on(event, (userId: number) => {
        this.invalidateContext(userId);
      });
    });

    logger.info('Context event listeners configured', { eventCount: events.length });
  }

  /**
   * Emit event to trigger cache invalidation
   */
  emitContextChange(event: string, userId: number): void {
    this.eventEmitter.emit(event, userId);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; ttl: number } {
    return {
      size: this.cache.size,
      ttl: this.cacheTTL
    };
  }

  /**
   * Clear entire cache (for testing/admin)
   */
  clearCache(): void {
    this.cache.clear();
    logger.info('Context cache cleared');
  }

  // ============================================================================
  // DATABASE QUERY METHODS (To be implemented with actual DB calls)
  // ============================================================================

  private async getUserProfile(userId: number): Promise<any> {
    // TODO: Replace with actual database query
    const { db } = await import('../db');
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId)
    });
    return user;
  }

  private async getLatestBusinessPlan(userId: number): Promise<any> {
    // TODO: Replace with actual database query
    const { db } = await import('../db');
    const plan = await db.query.businessPlans.findFirst({
      where: (plans, { eq }) => eq(plans.userId, userId),
      orderBy: (plans, { desc }) => [desc(plans.updatedAt)]
    });
    return plan;
  }

  private async getUserPortfolio(userId: number): Promise<any> {
    // TODO: Replace with actual database query
    return null;
  }

  private async getRecentActivity(userId: number, days: number): Promise<Activity[]> {
    // TODO: Replace with actual database query
    return [];
  }

  private async getUserGoals(userId: number): Promise<Goal[]> {
    // TODO: Replace with actual database query
    return [];
  }

  private async getUserMetrics(userId: number): Promise<UserMetrics> {
    // TODO: Replace with actual database query
    return this.getDefaultMetrics();
  }

  private async getRelationships(userId: number): Promise<RelationshipMap> {
    // TODO: Replace with actual database query and agent relationship service
    const { getAgentDatabase } = await import('./agent-database');
    
    try {
      const agentDb = getAgentDatabase();
      const relationships = await agentDb.getAllUserRelationships(userId);
      
      const agents: RelationshipMap['agents'] = {};
      
      relationships.forEach(rel => {
        agents[rel.agentType] = {
          stage: rel.relationshipStage,
          trustScore: rel.trustScore,
          lastInteraction: rel.lastInteractionAt || new Date()
        };
      });
      
      return { agents };
    } catch (error) {
      logger.warn('Failed to get agent relationships', { userId, error });
      return { agents: {} };
    }
  }

  private async getLatestAssessment(userId: number): Promise<AssessmentProfile | null> {
    // TODO: Replace with actual database query to assessment results
    return null;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let userContextServiceInstance: UserContextService | null = null;

export function getUserContextService(): UserContextService {
  if (!userContextServiceInstance) {
    userContextServiceInstance = new UserContextService();
  }
  return userContextServiceInstance;
}

// Export singleton for convenience
export const userContextService = getUserContextService();
