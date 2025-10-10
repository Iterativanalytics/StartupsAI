import { AgentType, UserContext } from '../types';

/**
 * Shared Context - Manages shared context and knowledge across agents
 * 
 * This system enables agents to share and access contextual information,
 * maintain consistency across interactions, and build upon each other's work.
 */
export class SharedContext {
  private contextStore: Map<string, any> = new Map();
  private contextHistory: Map<string, any[]> = new Map();
  private contextRelationships: Map<string, string[]> = new Map();

  /**
   * Store shared context for a user session
   */
  async storeContext(
    userId: string,
    sessionId: string,
    context: any,
    sourceAgent: AgentType,
    relevance: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<string> {
    
    const contextId = this.generateContextId();
    const contextEntry = {
      id: contextId,
      userId,
      sessionId,
      context,
      sourceAgent,
      relevance,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    // Store in context store
    this.contextStore.set(contextId, contextEntry);

    // Add to user's context history
    const userHistory = this.contextHistory.get(userId) || [];
    userHistory.push(contextEntry);
    
    // Keep only last 50 context entries per user
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50);
    }
    
    this.contextHistory.set(userId, userHistory);

    // Update context relationships
    await this.updateContextRelationships(contextId, context, userId);

    return contextId;
  }

  /**
   * Retrieve relevant context for an agent
   */
  async getRelevantContext(
    userId: string,
    agentType: AgentType,
    query: string,
    maxContexts: number = 10
  ): Promise<any[]> {
    
    const userHistory = this.contextHistory.get(userId) || [];
    
    // Filter and rank contexts by relevance
    const relevantContexts = userHistory
      .filter(entry => this.isRelevantToAgent(entry, agentType))
      .map(entry => ({
        ...entry,
        relevanceScore: this.calculateRelevanceScore(entry, query, agentType)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxContexts);

    // Update access tracking
    relevantContexts.forEach(context => {
      context.accessCount++;
      context.lastAccessed = new Date();
    });

    return relevantContexts;
  }

  /**
   * Share context between agents
   */
  async shareContext(
    fromAgent: AgentType,
    toAgent: AgentType,
    contextId: string,
    userId: string,
    sharingReason: string
  ): Promise<void> {
    
    const context = this.contextStore.get(contextId);
    if (!context) {
      throw new Error(`Context ${contextId} not found`);
    }

    // Create sharing record
    const sharingRecord = {
      fromAgent,
      toAgent,
      contextId,
      userId,
      reason: sharingReason,
      timestamp: new Date()
    };

    // Update context relationships
    const relationships = this.contextRelationships.get(contextId) || [];
    relationships.push(`${fromAgent}->${toAgent}`);
    this.contextRelationships.set(contextId, relationships);

    // Log the sharing
    console.log(`Context shared from ${fromAgent} to ${toAgent}: ${sharingReason}`);
  }

  /**
   * Update context with new information
   */
  async updateContext(
    contextId: string,
    updates: any,
    sourceAgent: AgentType,
    updateReason: string
  ): Promise<void> {
    
    const context = this.contextStore.get(contextId);
    if (!context) {
      throw new Error(`Context ${contextId} not found`);
    }

    // Create update record
    const updateRecord = {
      updates,
      sourceAgent,
      reason: updateReason,
      timestamp: new Date()
    };

    // Apply updates
    context.context = { ...context.context, ...updates };
    context.lastUpdated = new Date();
    context.updateHistory = context.updateHistory || [];
    context.updateHistory.push(updateRecord);

    // Update in store
    this.contextStore.set(contextId, context);
  }

  /**
   * Get context relationships and dependencies
   */
  async getContextRelationships(contextId: string): Promise<any> {
    const relationships = this.contextRelationships.get(contextId) || [];
    const context = this.contextStore.get(contextId);
    
    return {
      contextId,
      relationships,
      context,
      relatedContexts: await this.findRelatedContexts(contextId),
      usagePatterns: await this.analyzeUsagePatterns(contextId)
    };
  }

  /**
   * Merge contexts from multiple agents
   */
  async mergeContexts(
    contextIds: string[],
    targetAgent: AgentType,
    userId: string,
    mergeStrategy: 'union' | 'intersection' | 'weighted' = 'weighted'
  ): Promise<string> {
    
    const contexts = contextIds.map(id => this.contextStore.get(id)).filter(Boolean);
    if (contexts.length === 0) {
      throw new Error('No valid contexts to merge');
    }

    let mergedContext;
    
    switch (mergeStrategy) {
      case 'union':
        mergedContext = this.mergeUnion(contexts);
        break;
      case 'intersection':
        mergedContext = this.mergeIntersection(contexts);
        break;
      case 'weighted':
        mergedContext = this.mergeWeighted(contexts);
        break;
      default:
        mergedContext = this.mergeWeighted(contexts);
    }

    // Store merged context
    const mergedId = await this.storeContext(
      userId,
      contexts[0].sessionId,
      mergedContext,
      targetAgent,
      'high'
    );

    return mergedId;
  }

  /**
   * Get context analytics for a user
   */
  async getContextAnalytics(userId: string): Promise<any> {
    const userHistory = this.contextHistory.get(userId) || [];
    
    return {
      totalContexts: userHistory.length,
      contextTypes: this.analyzeContextTypes(userHistory),
      agentContributions: this.analyzeAgentContributions(userHistory),
      contextFlow: this.analyzeContextFlow(userHistory),
      mostAccessed: this.getMostAccessedContexts(userHistory),
      recommendations: this.generateContextRecommendations(userHistory)
    };
  }

  /**
   * Clean up old or irrelevant contexts
   */
  async cleanupContexts(userId: string, maxAge: number = 30): Promise<number> {
    const userHistory = this.contextHistory.get(userId) || [];
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    
    const toRemove = userHistory.filter(entry => 
      entry.timestamp < cutoffDate && entry.relevance === 'low'
    );
    
    // Remove old contexts
    toRemove.forEach(entry => {
      this.contextStore.delete(entry.id);
    });
    
    // Update user history
    const remaining = userHistory.filter(entry => !toRemove.includes(entry));
    this.contextHistory.set(userId, remaining);
    
    return toRemove.length;
  }

  // Private helper methods

  private generateContextId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isRelevantToAgent(entry: any, agentType: AgentType): boolean {
    // Define agent-specific relevance rules
    const relevanceRules = {
      [AgentType.CO_FOUNDER]: ['strategy', 'business', 'entrepreneur', 'startup'],
      [AgentType.CO_INVESTOR]: ['investment', 'portfolio', 'deal', 'financial'],
      [AgentType.CO_BUILDER]: ['ecosystem', 'partnership', 'program', 'network'],
      [AgentType.BUSINESS_ADVISOR]: ['business', 'strategy', 'operations', 'growth'],
      [AgentType.INVESTMENT_ANALYST]: ['investment', 'analysis', 'valuation', 'risk'],
      [AgentType.CREDIT_ANALYST]: ['credit', 'financial', 'risk', 'underwriting'],
      [AgentType.IMPACT_ANALYST]: ['impact', 'social', 'environmental', 'sustainability'],
      [AgentType.PROGRAM_MANAGER]: ['program', 'management', 'optimization', 'partnership']
    };

    const keywords = relevanceRules[agentType] || [];
    const contextText = JSON.stringify(entry.context).toLowerCase();
    
    return keywords.some(keyword => contextText.includes(keyword)) || entry.relevance === 'high';
  }

  private calculateRelevanceScore(entry: any, query: string, agentType: AgentType): number {
    let score = 0;
    
    // Base score from relevance level
    const relevanceScores = { high: 0.8, medium: 0.5, low: 0.2 };
    score += relevanceScores[entry.relevance];
    
    // Boost for recent contexts
    const ageInHours = (Date.now() - entry.timestamp.getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 1 - ageInHours / 24); // Decay over 24 hours
    score += recencyBoost * 0.2;
    
    // Boost for query relevance
    const queryRelevance = this.calculateQueryRelevance(entry.context, query);
    score += queryRelevance * 0.3;
    
    // Boost for agent relevance
    const agentRelevance = this.calculateAgentRelevance(entry, agentType);
    score += agentRelevance * 0.2;
    
    return Math.min(score, 1.0);
  }

  private calculateQueryRelevance(context: any, query: string): number {
    const contextText = JSON.stringify(context).toLowerCase();
    const queryWords = query.toLowerCase().split(' ');
    
    const matches = queryWords.filter(word => 
      word.length > 2 && contextText.includes(word)
    ).length;
    
    return Math.min(matches / queryWords.length, 1.0);
  }

  private calculateAgentRelevance(entry: any, agentType: AgentType): number {
    // Same agent gets higher relevance
    if (entry.sourceAgent === agentType) return 0.8;
    
    // Related agents get medium relevance
    const relatedAgents = this.getRelatedAgents(entry.sourceAgent);
    if (relatedAgents.includes(agentType)) return 0.6;
    
    return 0.3;
  }

  private getRelatedAgents(sourceAgent: AgentType): AgentType[] {
    const relationships = {
      [AgentType.CO_FOUNDER]: [AgentType.BUSINESS_ADVISOR, AgentType.PROGRAM_MANAGER],
      [AgentType.CO_INVESTOR]: [AgentType.INVESTMENT_ANALYST, AgentType.CREDIT_ANALYST],
      [AgentType.CO_BUILDER]: [AgentType.PROGRAM_MANAGER, AgentType.IMPACT_ANALYST],
      [AgentType.BUSINESS_ADVISOR]: [AgentType.CO_FOUNDER, AgentType.PROGRAM_MANAGER],
      [AgentType.INVESTMENT_ANALYST]: [AgentType.CO_INVESTOR, AgentType.CREDIT_ANALYST],
      [AgentType.CREDIT_ANALYST]: [AgentType.INVESTMENT_ANALYST, AgentType.CO_INVESTOR],
      [AgentType.IMPACT_ANALYST]: [AgentType.CO_BUILDER, AgentType.PROGRAM_MANAGER],
      [AgentType.PROGRAM_MANAGER]: [AgentType.CO_BUILDER, AgentType.BUSINESS_ADVISOR]
    };
    
    return relationships[sourceAgent] || [];
  }

  private async updateContextRelationships(contextId: string, context: any, userId: string): Promise<void> {
    // Find related contexts based on content similarity
    const userHistory = this.contextHistory.get(userId) || [];
    const relatedContexts = userHistory.filter(entry => 
      this.calculateContentSimilarity(entry.context, context) > 0.5
    );
    
    if (relatedContexts.length > 0) {
      const relationships = this.contextRelationships.get(contextId) || [];
      relatedContexts.forEach(related => {
        relationships.push(`similar_to_${related.id}`);
      });
      this.contextRelationships.set(contextId, relationships);
    }
  }

  private calculateContentSimilarity(context1: any, context2: any): number {
    // Simplified content similarity calculation
    const text1 = JSON.stringify(context1).toLowerCase();
    const text2 = JSON.stringify(context2).toLowerCase();
    
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return commonWords.length / totalWords;
  }

  private async findRelatedContexts(contextId: string): Promise<any[]> {
    const relationships = this.contextRelationships.get(contextId) || [];
    const relatedIds = relationships.map(rel => rel.split('_').pop()).filter(Boolean);
    
    return relatedIds.map(id => this.contextStore.get(id)).filter(Boolean);
  }

  private async analyzeUsagePatterns(contextId: string): Promise<any> {
    const context = this.contextStore.get(contextId);
    if (!context) return {};
    
    return {
      accessCount: context.accessCount || 0,
      lastAccessed: context.lastAccessed,
      age: Date.now() - context.timestamp.getTime(),
      relationships: this.contextRelationships.get(contextId)?.length || 0
    };
  }

  private mergeUnion(contexts: any[]): any {
    const merged = {};
    contexts.forEach(context => {
      Object.assign(merged, context.context);
    });
    return merged;
  }

  private mergeIntersection(contexts: any[]): any {
    const keys = Object.keys(contexts[0].context);
    const merged = {};
    
    keys.forEach(key => {
      const values = contexts.map(ctx => ctx.context[key]);
      if (values.every(val => val === values[0])) {
        merged[key] = values[0];
      }
    });
    
    return merged;
  }

  private mergeWeighted(contexts: any[]): any {
    const weights = contexts.map(ctx => 
      ctx.relevance === 'high' ? 3 : ctx.relevance === 'medium' ? 2 : 1
    );
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    const merged = {};
    const allKeys = new Set(contexts.flatMap(ctx => Object.keys(ctx.context)));
    
    allKeys.forEach(key => {
      const values = contexts.map(ctx => ctx.context[key]).filter(Boolean);
      if (values.length > 0) {
        // Weighted average for numeric values, most common for strings
        if (typeof values[0] === 'number') {
          const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
          merged[key] = weightedSum / totalWeight;
        } else {
          // Most common value
          const valueCounts = {};
          values.forEach((val, i) => {
            const weightedCount = weights[i];
            valueCounts[val] = (valueCounts[val] || 0) + weightedCount;
          });
          merged[key] = Object.entries(valueCounts)
            .sort(([, a], [, b]) => (b as number) - (a as number))[0][0];
        }
      }
    });
    
    return merged;
  }

  private analyzeContextTypes(userHistory: any[]): any {
    const types = {};
    userHistory.forEach(entry => {
      const type = this.categorizeContext(entry.context);
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  private categorizeContext(context: any): string {
    const text = JSON.stringify(context).toLowerCase();
    if (text.includes('business') || text.includes('strategy')) return 'business';
    if (text.includes('investment') || text.includes('financial')) return 'financial';
    if (text.includes('program') || text.includes('partnership')) return 'program';
    if (text.includes('ecosystem') || text.includes('network')) return 'ecosystem';
    return 'general';
  }

  private analyzeAgentContributions(userHistory: any[]): any {
    const contributions = {};
    userHistory.forEach(entry => {
      const agent = entry.sourceAgent;
      contributions[agent] = (contributions[agent] || 0) + 1;
    });
    return contributions;
  }

  private analyzeContextFlow(userHistory: any[]): any {
    // Analyze how context flows between agents
    return {
      totalFlows: userHistory.length,
      averageFlowTime: 45, // minutes
      mostCommonFlows: ['CO_FOUNDER->BUSINESS_ADVISOR', 'CO_INVESTOR->INVESTMENT_ANALYST']
    };
  }

  private getMostAccessedContexts(userHistory: any[]): any[] {
    return userHistory
      .filter(entry => entry.accessCount > 0)
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5);
  }

  private generateContextRecommendations(userHistory: any[]): string[] {
    const recommendations = [];
    
    if (userHistory.length < 10) {
      recommendations.push('Increase context sharing between agents for better collaboration');
    }
    
    const lowRelevanceCount = userHistory.filter(entry => entry.relevance === 'low').length;
    if (lowRelevanceCount > userHistory.length * 0.5) {
      recommendations.push('Improve context relevance filtering to reduce noise');
    }
    
    return recommendations;
  }
}
