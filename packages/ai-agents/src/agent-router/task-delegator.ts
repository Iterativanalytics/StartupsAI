import { AgentType, AgentContext, AgentResponse, AgentCommunication } from '../types';

/**
 * Task Delegator - Manages delegation of tasks between Co-Agents and Functional Agents
 */
export class TaskDelegator {
  
  /**
   * Delegate a task from a Co-Agent to a Functional Agent
   */
  async delegateToFunctionalAgent(
    fromAgent: AgentType,
    toAgent: AgentType,
    task: string,
    context: AgentContext,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<DelegationResult> {
    
    const delegationId = this.generateDelegationId();
    const delegationContext = this.buildDelegationContext(task, context, fromAgent);
    
    // Create delegation message
    const delegation: AgentCommunication = {
      fromAgent,
      toAgent,
      messageType: 'delegation',
      payload: {
        delegationId,
        task,
        context: delegationContext,
        expectations: this.buildExpectations(task, urgency),
        deadline: this.calculateDeadline(urgency)
      },
      priority: urgency,
      timestamp: new Date()
    };
    
    // Log the delegation
    await this.logDelegation(delegation);
    
    return {
      delegationId,
      status: 'pending',
      estimatedCompletionTime: this.estimateCompletionTime(task, toAgent),
      trackingInfo: {
        fromAgent,
        toAgent,
        task,
        priority: urgency,
        createdAt: new Date()
      }
    };
  }

  /**
   * Handle handoff of results back to the delegating agent
   */
  async handleResultHandoff(
    delegationId: string,
    results: any,
    fromAgent: AgentType,
    toAgent: AgentType
  ): Promise<HandoffResult> {
    
    const handoff: AgentCommunication = {
      fromAgent,
      toAgent,
      messageType: 'result_handoff',
      payload: {
        delegationId,
        results,
        summary: this.generateResultSummary(results),
        recommendations: this.extractRecommendations(results),
        confidence: this.assessResultConfidence(results)
      },
      priority: 'medium',
      timestamp: new Date()
    };
    
    // Log the handoff
    await this.logHandoff(handoff);
    
    return {
      success: true,
      synthesizedResponse: await this.synthesizeForCoAgent(results, toAgent),
      actionItems: this.extractActionItems(results),
      followUpSuggestions: this.generateFollowUpSuggestions(results, toAgent)
    };
  }

  /**
   * Check if a task should be delegated based on complexity and agent capabilities
   */
  shouldDelegate(
    currentAgent: AgentType,
    task: string,
    context: AgentContext
  ): DelegationRecommendation {
    
    const taskComplexity = this.analyzeTaskComplexity(task);
    const agentCapabilities = this.getAgentCapabilities(currentAgent);
    const workload = this.getAgentWorkload(currentAgent);
    
    // Co-Agents should delegate complex technical/analytical tasks
    if (this.isCoAgent(currentAgent)) {
      if (taskComplexity.technical > 0.7 || taskComplexity.analytical > 0.8) {
        return {
          shouldDelegate: true,
          recommendedAgent: this.recommendFunctionalAgent(task, context.userType),
          reason: 'Task requires specialized technical/analytical expertise',
          confidence: 0.8
        };
      }
    }
    
    // Any agent should delegate if overloaded
    if (workload.currentTasks > workload.capacity * 0.9) {
      return {
        shouldDelegate: true,
        recommendedAgent: this.findAvailableAgent(currentAgent, context.userType),
        reason: 'Agent is at capacity, load balancing required',
        confidence: 0.9
      };
    }
    
    return {
      shouldDelegate: false,
      reason: 'Task is within agent capabilities and capacity',
      confidence: 0.7
    };
  }

  /**
   * Monitor delegation status and handle timeouts
   */
  async monitorDelegations(): Promise<DelegationStatus[]> {
    const activeDelegations = await this.getActiveDelegations();
    const statusUpdates: DelegationStatus[] = [];
    
    for (const delegation of activeDelegations) {
      const status = await this.checkDelegationStatus(delegation.id);
      
      // Handle timeouts
      if (this.isOverdue(delegation)) {
        await this.handleTimeout(delegation);
        status.status = 'timeout';
        status.action = 'escalated';
      }
      
      statusUpdates.push(status);
    }
    
    return statusUpdates;
  }

  // Private helper methods
  
  private generateDelegationId(): string {
    return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private buildDelegationContext(task: string, context: AgentContext, fromAgent: AgentType) {
    return {
      originalTask: task,
      userContext: {
        userId: context.userId,
        userType: context.userType,
        currentPhase: context.relevantData?.businessPhase || 'unknown'
      },
      delegatingAgent: fromAgent,
      priority: this.assessTaskPriority(task),
      expectedFormat: this.determineExpectedFormat(task)
    };
  }

  private buildExpectations(task: string, urgency: string) {
    const baseExpectations = {
      accuracy: 'high',
      format: 'structured',
      includeRecommendations: true,
      includeSources: true
    };
    
    if (urgency === 'high') {
      return {
        ...baseExpectations,
        responseTime: 'immediate',
        detail: 'summary'
      };
    } else if (urgency === 'medium') {
      return {
        ...baseExpectations,
        responseTime: 'standard',
        detail: 'comprehensive'
      };
    } else {
      return {
        ...baseExpectations,
        responseTime: 'when_available',
        detail: 'thorough'
      };
    }
  }

  private calculateDeadline(urgency: string): Date {
    const now = new Date();
    switch (urgency) {
      case 'high':
        return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      case 'medium':
        return new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
      default:
        return new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
    }
  }

  private async synthesizeForCoAgent(results: any, toAgent: AgentType): Promise<string> {
    // Convert functional agent results into Co-Agent friendly format
    if (!results) return "No results available from the analysis.";
    
    const synthesis = {
      summary: results.summary || "Analysis completed",
      keyInsights: results.insights?.slice(0, 3) || [],
      recommendations: results.recommendations?.slice(0, 2) || [],
      nextSteps: results.actionItems?.slice(0, 3) || []
    };
    
    return `Here's what our ${this.getAgentName(toAgent)} found:

**Summary:** ${synthesis.summary}

${synthesis.keyInsights.length > 0 ? `**Key Insights:**
${synthesis.keyInsights.map((insight: any, i: number) => `${i + 1}. ${insight.title || insight}`).join('\n')}` : ''}

${synthesis.recommendations.length > 0 ? `**Recommendations:**
${synthesis.recommendations.map((rec: any, i: number) => `${i + 1}. ${rec.description || rec}`).join('\n')}` : ''}

${synthesis.nextSteps.length > 0 ? `**Next Steps:**
${synthesis.nextSteps.map((step: any, i: number) => `${i + 1}. ${step.action || step}`).join('\n')}` : ''}

What would you like to explore further?`;
  }

  private analyzeTaskComplexity(task: string) {
    const technical = /technical|code|api|database|system|infrastructure/i.test(task) ? 0.8 : 0.2;
    const analytical = /analyze|calculate|model|forecast|evaluate|assess/i.test(task) ? 0.7 : 0.3;
    const creative = /brainstorm|ideas|creative|innovative|design/i.test(task) ? 0.6 : 0.2;
    
    return { technical, analytical, creative };
  }

  private isCoAgent(agent: AgentType): boolean {
    return [AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER].includes(agent);
  }

  private getAgentName(agent: AgentType): string {
    const names = {
      [AgentType.BUSINESS_ADVISOR]: 'Business Advisor',
      [AgentType.INVESTMENT_ANALYST]: 'Investment Analyst',
      [AgentType.CREDIT_ANALYST]: 'Credit Analyst',
      [AgentType.IMPACT_ANALYST]: 'Impact Analyst',
      [AgentType.PROGRAM_MANAGER]: 'Program Manager'
    };
    return names[agent] || 'Specialist';
  }

  // Placeholder methods - would be implemented with actual data store
  private async logDelegation(delegation: AgentCommunication): Promise<void> {
    // Log to database/monitoring system
    console.log('Delegation logged:', delegation.payload.delegationId);
  }

  private async logHandoff(handoff: AgentCommunication): Promise<void> {
    // Log to database/monitoring system
    console.log('Handoff logged:', handoff.payload.delegationId);
  }

  private estimateCompletionTime(task: string, agent: AgentType): number {
    // Return estimated minutes based on task complexity and agent type
    const baseTime = 15; // 15 minutes base
    const complexity = this.analyzeTaskComplexity(task);
    const multiplier = Math.max(complexity.technical, complexity.analytical) + 1;
    return Math.round(baseTime * multiplier);
  }

  private generateResultSummary(results: any): string {
    return results.summary || 'Analysis completed successfully';
  }

  private extractRecommendations(results: any): string[] {
    return results.recommendations?.map((r: any) => r.description || r) || [];
  }

  private assessResultConfidence(results: any): number {
    return results.confidence || 0.8;
  }

  private extractActionItems(results: any): string[] {
    return results.actionItems?.map((item: any) => item.action || item) || [];
  }

  private generateFollowUpSuggestions(results: any, agent: AgentType): string[] {
    return [
      'Dive deeper into the top recommendation',
      'Explore alternative approaches',
      'Get a second opinion',
      'Plan implementation steps'
    ];
  }

  // Additional placeholder methods for full implementation
  private getAgentCapabilities(agent: AgentType): any {
    return { technical: 0.5, analytical: 0.7, creative: 0.6 };
  }

  private getAgentWorkload(agent: AgentType): any {
    return { currentTasks: 3, capacity: 10 };
  }

  private recommendFunctionalAgent(task: string, userType: any): AgentType {
    return AgentType.BUSINESS_ADVISOR; // Simplified
  }

  private findAvailableAgent(currentAgent: AgentType, userType: any): AgentType {
    return AgentType.BUSINESS_ADVISOR; // Simplified
  }

  private assessTaskPriority(task: string): string {
    return /urgent|critical|asap/i.test(task) ? 'high' : 'medium';
  }

  private determineExpectedFormat(task: string): string {
    if (/report|document|analysis/i.test(task)) return 'detailed_report';
    if (/chart|graph|visualization/i.test(task)) return 'visual';
    return 'structured_response';
  }

  private async getActiveDelegations(): Promise<any[]> {
    return []; // Would fetch from database
  }

  private async checkDelegationStatus(id: string): Promise<DelegationStatus> {
    return { delegationId: id, status: 'in_progress', estimatedCompletion: new Date() };
  }

  private isOverdue(delegation: any): boolean {
    return delegation.deadline < new Date();
  }

  private async handleTimeout(delegation: any): Promise<void> {
    console.log('Handling timeout for delegation:', delegation.id);
  }
}

// Types for this module
export interface DelegationResult {
  delegationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedCompletionTime: number;
  trackingInfo: any;
}

export interface HandoffResult {
  success: boolean;
  synthesizedResponse: string;
  actionItems: string[];
  followUpSuggestions: string[];
}

export interface DelegationRecommendation {
  shouldDelegate: boolean;
  recommendedAgent?: AgentType;
  reason: string;
  confidence: number;
}

export interface DelegationStatus {
  delegationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'timeout' | 'failed';
  estimatedCompletion: Date;
  action?: string;
}
