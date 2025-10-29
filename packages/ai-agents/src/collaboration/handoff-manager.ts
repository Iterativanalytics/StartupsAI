import { AgentType, AgentContext } from '../types';

/**
 * Handoff Manager - Manages smooth transitions between agents
 * 
 * This system ensures seamless handoffs between agents, maintaining context
 * and providing smooth user experiences during agent transitions.
 */
export class HandoffManager {
  private activeHandoffs: Map<string, any> = new Map();
  private handoffHistory: Map<string, any[]> = new Map();
  private handoffTemplates: Map<string, any> = new Map();

  constructor() {
    this.initializeHandoffTemplates();
  }

  /**
   * Initiate a handoff between agents
   */
  async initiateHandoff(
    fromAgent: AgentType,
    toAgent: AgentType,
    userId: string,
    sessionId: string,
    handoffReason: string,
    context: AgentContext,
    handoffData?: any
  ): Promise<string> {
    
    const handoffId = this.generateHandoffId();
    const handoff = {
      id: handoffId,
      fromAgent,
      toAgent,
      userId,
      sessionId,
      reason: handoffReason,
      context: this.prepareContext(context),
      handoffData: handoffData || {},
      status: 'initiated',
      startTime: new Date(),
      handoffMessage: this.generateHandoffMessage(fromAgent, toAgent, handoffReason),
      transitionPlan: this.createTransitionPlan(fromAgent, toAgent, handoffReason),
      expectedDuration: this.estimateHandoffDuration(fromAgent, toAgent),
      userNotification: this.generateUserNotification(fromAgent, toAgent, handoffReason)
    };

    this.activeHandoffs.set(handoffId, handoff);
    
    // Log handoff initiation
    await this.logHandoff(handoff);
    
    return handoffId;
  }

  /**
   * Execute the handoff process
   */
  async executeHandoff(
    handoffId: string,
    fromAgent: AgentType,
    toAgent: AgentType,
    additionalContext?: any
  ): Promise<any> {
    
    const handoff = this.activeHandoffs.get(handoffId);
    if (!handoff) {
      throw new Error(`Handoff ${handoffId} not found`);
    }

    // Validate handoff
    if (handoff.fromAgent !== fromAgent || handoff.toAgent !== toAgent) {
      throw new Error('Handoff agent mismatch');
    }

    // Prepare handoff package
    const handoffPackage = await this.prepareHandoffPackage(handoff, additionalContext);
    
    // Update handoff status
    handoff.status = 'executing';
    handoff.executionTime = new Date();
    
    // Execute transition
    await this.executeTransition(handoff, handoffPackage);
    
    // Update status
    handoff.status = 'completed';
    handoff.completionTime = new Date();
    
    // Archive handoff
    await this.archiveHandoff(handoff);
    
    return handoffPackage;
  }

  /**
   * Get handoff status
   */
  async getHandoffStatus(handoffId: string): Promise<any> {
    const handoff = this.activeHandoffs.get(handoffId);
    if (!handoff) {
      return null;
    }

    return {
      id: handoff.id,
      fromAgent: handoff.fromAgent,
      toAgent: handoff.toAgent,
      status: handoff.status,
      reason: handoff.reason,
      startTime: handoff.startTime,
      executionTime: handoff.executionTime,
      completionTime: handoff.completionTime,
      expectedDuration: handoff.expectedDuration,
      handoffMessage: handoff.handoffMessage,
      userNotification: handoff.userNotification
    };
  }

  /**
   * Get handoff history for a user
   */
  async getHandoffHistory(userId: string): Promise<any[]> {
    return this.handoffHistory.get(userId) || [];
  }

  /**
   * Analyze handoff patterns
   */
  async analyzeHandoffPatterns(userId: string): Promise<any> {
    const history = this.handoffHistory.get(userId) || [];
    
    return {
      totalHandoffs: history.length,
      successRate: this.calculateSuccessRate(history),
      averageDuration: this.calculateAverageDuration(history),
      commonTransitions: this.identifyCommonTransitions(history),
      handoffReasons: this.analyzeHandoffReasons(history),
      recommendations: this.generateHandoffRecommendations(history)
    };
  }

  /**
   * Create a handoff template for common transitions
   */
  async createHandoffTemplate(
    fromAgent: AgentType,
    toAgent: AgentType,
    templateName: string,
    template: any
  ): Promise<void> {
    
    const templateKey = `${fromAgent}_to_${toAgent}_${templateName}`;
    this.handoffTemplates.set(templateKey, {
      fromAgent,
      toAgent,
      templateName,
      template,
      createdAt: new Date()
    });
  }

  /**
   * Use a handoff template
   */
  async useHandoffTemplate(
    templateKey: string,
    userId: string,
    sessionId: string,
    context: AgentContext
  ): Promise<string> {
    
    const template = this.handoffTemplates.get(templateKey);
    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }

    return await this.initiateHandoff(
      template.fromAgent,
      template.toAgent,
      userId,
      sessionId,
      `Using template: ${template.templateName}`,
      context,
      template.template
    );
  }

  // Private helper methods

  private generateHandoffId(): string {
    return `handoff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private prepareContext(context: AgentContext): any {
    return {
      userId: context.userId,
      userType: context.userType,
      conversationHistory: context.conversationHistory.slice(-10), // Last 10 messages
      relevantData: context.relevantData,
      currentTask: context.currentTask,
      preferences: context.preferences,
      timestamp: new Date()
    };
  }

  private generateHandoffMessage(fromAgent: AgentType, toAgent: AgentType, reason: string): string {
    const agentNames = {
      [AgentType.CO_FOUNDER]: 'Co-Founder™',
      [AgentType.CO_INVESTOR]: 'Co-Investor™',
      [AgentType.CO_BUILDER]: 'Co-Builder™',
      [AgentType.BUSINESS_ADVISOR]: 'Business Advisor',
      [AgentType.INVESTMENT_ANALYST]: 'Investment Analyst',
      [AgentType.CREDIT_ANALYST]: 'Credit Analyst',
      [AgentType.IMPACT_ANALYST]: 'Impact Analyst',
      [AgentType.PROGRAM_MANAGER]: 'Program Manager',
      [AgentType.PLATFORM_ORCHESTRATOR]: 'Platform Orchestrator'
    };

    const fromName = agentNames[fromAgent] || fromAgent;
    const toName = agentNames[toAgent] || toAgent;

    return `Transitioning from ${fromName} to ${toName}. Reason: ${reason}`;
  }

  private createTransitionPlan(fromAgent: AgentType, toAgent: AgentType, reason: string): any {
    const plan = {
      steps: [],
      estimatedTime: 0,
      requiredData: [],
      userActions: []
    };

    // Define transition steps based on agent types
    if (this.isCoAgentToFunctional(fromAgent, toAgent)) {
      plan.steps = [
        'Prepare specialized context for functional agent',
        'Transfer user query and requirements',
        'Provide domain-specific background',
        'Set up monitoring for task completion'
      ];
      plan.estimatedTime = 2; // minutes
    } else if (this.isFunctionalToCoAgent(fromAgent, toAgent)) {
      plan.steps = [
        'Synthesize functional agent results',
        'Prepare strategic context for co-agent',
        'Transfer insights and recommendations',
        'Set up for strategic discussion'
      ];
      plan.estimatedTime = 3; // minutes
    } else if (this.isCoAgentToCoAgent(fromAgent, toAgent)) {
      plan.steps = [
        'Transfer relationship context',
        'Share strategic insights',
        'Maintain personality continuity',
        'Ensure smooth user experience'
      ];
      plan.estimatedTime = 1; // minute
    } else {
      plan.steps = [
        'Transfer task context',
        'Share relevant data',
        'Maintain conversation flow',
        'Ensure task continuity'
      ];
      plan.estimatedTime = 2; // minutes
    }

    return plan;
  }

  private isCoAgentToFunctional(fromAgent: AgentType, toAgent: AgentType): boolean {
    const coAgents = [AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER];
    const functionalAgents = [
      AgentType.BUSINESS_ADVISOR, AgentType.INVESTMENT_ANALYST, 
      AgentType.CREDIT_ANALYST, AgentType.IMPACT_ANALYST, 
      AgentType.PROGRAM_MANAGER, AgentType.PLATFORM_ORCHESTRATOR
    ];
    
    return coAgents.includes(fromAgent) && functionalAgents.includes(toAgent);
  }

  private isFunctionalToCoAgent(fromAgent: AgentType, toAgent: AgentType): boolean {
    const coAgents = [AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER];
    const functionalAgents = [
      AgentType.BUSINESS_ADVISOR, AgentType.INVESTMENT_ANALYST, 
      AgentType.CREDIT_ANALYST, AgentType.IMPACT_ANALYST, 
      AgentType.PROGRAM_MANAGER, AgentType.PLATFORM_ORCHESTRATOR
    ];
    
    return functionalAgents.includes(fromAgent) && coAgents.includes(toAgent);
  }

  private isCoAgentToCoAgent(fromAgent: AgentType, toAgent: AgentType): boolean {
    const coAgents = [AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER];
    return coAgents.includes(fromAgent) && coAgents.includes(toAgent);
  }

  private estimateHandoffDuration(fromAgent: AgentType, toAgent: AgentType): number {
    if (this.isCoAgentToFunctional(fromAgent, toAgent)) return 2;
    if (this.isFunctionalToCoAgent(fromAgent, toAgent)) return 3;
    if (this.isCoAgentToCoAgent(fromAgent, toAgent)) return 1;
    return 2; // default
  }

  private generateUserNotification(fromAgent: AgentType, toAgent: AgentType, reason: string): string {
    const agentNames = {
      [AgentType.CO_FOUNDER]: 'your Co-Founder™',
      [AgentType.CO_INVESTOR]: 'your Co-Investor™',
      [AgentType.CO_BUILDER]: 'your Co-Builder™',
      [AgentType.BUSINESS_ADVISOR]: 'the Business Advisor',
      [AgentType.INVESTMENT_ANALYST]: 'the Investment Analyst',
      [AgentType.CREDIT_ANALYST]: 'the Credit Analyst',
      [AgentType.IMPACT_ANALYST]: 'the Impact Analyst',
      [AgentType.PROGRAM_MANAGER]: 'the Program Manager',
      [AgentType.PLATFORM_ORCHESTRATOR]: 'the Platform Orchestrator'
    };

    const toName = agentNames[toAgent] || 'a specialized agent';
    
    return `I'm connecting you with ${toName} to ${reason.toLowerCase()}. This will ensure you get the most relevant expertise for your needs.`;
  }

  private async prepareHandoffPackage(handoff: any, additionalContext?: any): Promise<any> {
    return {
      handoffId: handoff.id,
      fromAgent: handoff.fromAgent,
      toAgent: handoff.toAgent,
      context: handoff.context,
      handoffData: { ...handoff.handoffData, ...additionalContext },
      transitionPlan: handoff.transitionPlan,
      handoffMessage: handoff.handoffMessage,
      userNotification: handoff.userNotification,
      timestamp: new Date()
    };
  }

  private async executeTransition(handoff: any, handoffPackage: any): Promise<void> {
    // Simulate transition execution
    console.log(`Executing handoff from ${handoff.fromAgent} to ${handoff.toAgent}`);
    console.log('Handoff package:', handoffPackage);
    
    // In a real implementation, this would:
    // 1. Notify the receiving agent
    // 2. Transfer context and data
    // 3. Update user interface
    // 4. Monitor handoff completion
  }

  private async logHandoff(handoff: any): Promise<void> {
    const userHistory = this.handoffHistory.get(handoff.userId) || [];
    userHistory.push(handoff);
    
    // Keep only last 50 handoffs per user
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50);
    }
    
    this.handoffHistory.set(handoff.userId, userHistory);
  }

  private async archiveHandoff(handoff: any): Promise<void> {
    // Archive completed handoff
    const archive = {
      ...handoff,
      archivedAt: new Date()
    };
    
    console.log('Archived handoff:', handoff.id);
  }

  private initializeHandoffTemplates(): void {
    // Common handoff templates
    this.handoffTemplates.set('co_founder_to_business_advisor_strategic', {
      fromAgent: AgentType.CO_FOUNDER,
      toAgent: AgentType.BUSINESS_ADVISOR,
      templateName: 'Strategic Analysis',
      template: {
        reason: 'Detailed business analysis required',
        context: ['business_plan', 'market_analysis', 'financial_projections'],
        expectedOutcome: 'Comprehensive business assessment'
      }
    });

    this.handoffTemplates.set('co_investor_to_investment_analyst_deal', {
      fromAgent: AgentType.CO_INVESTOR,
      toAgent: AgentType.INVESTMENT_ANALYST,
      templateName: 'Deal Analysis',
      template: {
        reason: 'Detailed investment analysis required',
        context: ['deal_terms', 'financial_model', 'market_data'],
        expectedOutcome: 'Investment recommendation'
      }
    });

    this.handoffTemplates.set('co_builder_to_program_manager_optimization', {
      fromAgent: AgentType.CO_BUILDER,
      toAgent: AgentType.PROGRAM_MANAGER,
      templateName: 'Program Optimization',
      template: {
        reason: 'Program optimization analysis required',
        context: ['program_metrics', 'participant_data', 'outcome_analysis'],
        expectedOutcome: 'Optimization recommendations'
      }
    });
  }

  private calculateSuccessRate(history: any[]): number {
    const successful = history.filter(handoff => 
      handoff.status === 'completed' && handoff.completionTime
    ).length;
    
    return history.length > 0 ? successful / history.length : 0;
  }

  private calculateAverageDuration(history: any[]): number {
    const durations = history
      .filter(handoff => handoff.completionTime && handoff.startTime)
      .map(handoff => 
        handoff.completionTime.getTime() - handoff.startTime.getTime()
      );
    
    return durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length / (1000 * 60) // minutes
      : 0;
  }

  private identifyCommonTransitions(history: any[]): any[] {
    const transitions = {};
    
    history.forEach(handoff => {
      const transition = `${handoff.fromAgent}->${handoff.toAgent}`;
      transitions[transition] = (transitions[transition] || 0) + 1;
    });
    
    return Object.entries(transitions)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([transition, count]) => ({ transition, count }));
  }

  private analyzeHandoffReasons(history: any[]): any[] {
    const reasons = {};
    
    history.forEach(handoff => {
      const reason = handoff.reason;
      reasons[reason] = (reasons[reason] || 0) + 1;
    });
    
    return Object.entries(reasons)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));
  }

  private generateHandoffRecommendations(history: any[]): string[] {
    const recommendations = [];
    
    const successRate = this.calculateSuccessRate(history);
    if (successRate < 0.9) {
      recommendations.push('Improve handoff success rate by enhancing context transfer');
    }
    
    const avgDuration = this.calculateAverageDuration(history);
    if (avgDuration > 5) {
      recommendations.push('Optimize handoff process to reduce transition time');
    }
    
    return recommendations;
  }
}
