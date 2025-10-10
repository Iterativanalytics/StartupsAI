import { AgentCommunication } from './agent-communication';
import { SharedContext } from './shared-context';
import { ConsensusBuilder } from './consensus-builder';
import { HandoffManager } from './handoff-manager';
import { AgentType, UserContext, AgentContext } from '../types';

/**
 * Multi-Agent Collaboration System
 * 
 * This system orchestrates sophisticated multi-agent workflows, enabling
 * agents to communicate, share context, build consensus, and hand off tasks
 * seamlessly while maintaining a cohesive user experience.
 */
export class MultiAgentCollaboration {
  private agentCommunication: AgentCommunication;
  private sharedContext: SharedContext;
  private consensusBuilder: ConsensusBuilder;
  private handoffManager: HandoffManager;

  constructor() {
    this.agentCommunication = new AgentCommunication();
    this.sharedContext = new SharedContext();
    this.consensusBuilder = new ConsensusBuilder();
    this.handoffManager = new HandoffManager();
  }

  /**
   * Orchestrate a complex multi-agent task
   */
  async orchestrateTask(
    task: string,
    participatingAgents: AgentType[],
    context: UserContext,
    options: {
      requireConsensus?: boolean;
      enableHandoffs?: boolean;
      shareContext?: boolean;
      timeout?: number;
    } = {}
  ): Promise<any> {
    
    const sessionId = this.generateSessionId();
    const orchestration = {
      sessionId,
      task,
      participatingAgents,
      context,
      options,
      status: 'active',
      startTime: new Date(),
      results: {},
      consensus: null
    };

    try {
      // Start collaboration session
      await this.agentCommunication.startCollaboration(
        sessionId,
        participatingAgents,
        task,
        context
      );

      // Share initial context if enabled
      if (options.shareContext) {
        await this.shareInitialContext(sessionId, context, participatingAgents);
      }

      // Start consensus building if required
      if (options.requireConsensus) {
        const consensusId = await this.consensusBuilder.startConsensus(
          sessionId,
          participatingAgents,
          task,
          context
        );
        orchestration.consensus = consensusId;
      }

      // Execute task with participating agents
      const results = await this.executeTaskWithAgents(
        sessionId,
        task,
        participatingAgents,
        context,
        options
      );

      orchestration.results = results;
      orchestration.status = 'completed';
      orchestration.endTime = new Date();

      return orchestration;

    } catch (error) {
      orchestration.status = 'failed';
      orchestration.error = error.message;
      throw error;
    }
  }

  /**
   * Handle agent delegation with context sharing
   */
  async handleDelegation(
    fromAgent: AgentType,
    toAgent: AgentType,
    task: string,
    context: AgentContext,
    delegationOptions: {
      shareContext?: boolean;
      requireHandoff?: boolean;
      timeout?: number;
    } = {}
  ): Promise<any> {
    
    // Share context if enabled
    if (delegationOptions.shareContext) {
      const contextId = await this.sharedContext.storeContext(
        context.userId,
        context.sessionId || 'default',
        context.relevantData,
        fromAgent,
        'high'
      );
      
      await this.sharedContext.shareContext(
        fromAgent,
        toAgent,
        contextId,
        context.userId,
        `Delegating task: ${task}`
      );
    }

    // Handle handoff if required
    if (delegationOptions.requireHandoff) {
      const handoffId = await this.handoffManager.initiateHandoff(
        fromAgent,
        toAgent,
        context.userId,
        context.sessionId || 'default',
        `Task delegation: ${task}`,
        context
      );
      
      return await this.handoffManager.executeHandoff(
        handoffId,
        fromAgent,
        toAgent
      );
    }

    // Standard delegation
    return await this.agentCommunication.handleDelegation(
      fromAgent,
      toAgent,
      task,
      context,
      context.userId
    );
  }

  /**
   * Build consensus on a decision
   */
  async buildConsensus(
    decision: string,
    participatingAgents: AgentType[],
    context: UserContext,
    consensusOptions: {
      timeout?: number;
      requireUnanimous?: boolean;
      enableConflictResolution?: boolean;
    } = {}
  ): Promise<any> {
    
    const sessionId = this.generateSessionId();
    const consensusId = await this.consensusBuilder.startConsensus(
      sessionId,
      participatingAgents,
      decision,
      context
    );

    // Collect perspectives from all agents
    const perspectives = await this.collectPerspectives(
      consensusId,
      participatingAgents,
      decision,
      context
    );

    // Build synthesis
    const synthesis = await this.consensusBuilder.buildSynthesis(consensusId);

    // Reach final consensus
    const finalConsensus = await this.consensusBuilder.reachConsensus(
      consensusId,
      synthesis,
      synthesis.confidence,
      synthesis.consensus
    );

    return {
      consensusId,
      synthesis,
      finalConsensus,
      perspectives,
      status: 'completed'
    };
  }

  /**
   * Get collaboration analytics
   */
  async getCollaborationAnalytics(userId: string): Promise<any> {
    const communicationAnalytics = await this.agentCommunication.analyzeCollaborationPatterns(userId);
    const contextAnalytics = await this.sharedContext.getContextAnalytics(userId);
    const consensusAnalytics = await this.consensusBuilder.analyzeConsensusPatterns(userId);
    const handoffAnalytics = await this.handoffManager.analyzeHandoffPatterns(userId);

    return {
      communication: communicationAnalytics,
      context: contextAnalytics,
      consensus: consensusAnalytics,
      handoffs: handoffAnalytics,
      overall: this.calculateOverallAnalytics([
        communicationAnalytics,
        contextAnalytics,
        consensusAnalytics,
        handoffAnalytics
      ])
    };
  }

  /**
   * Get active collaborations for a user
   */
  async getActiveCollaborations(userId: string): Promise<any[]> {
    // This would typically query active sessions from a database
    // For now, return mock data
    return [
      {
        sessionId: 'session_123',
        task: 'Strategic business analysis',
        participatingAgents: [AgentType.CO_FOUNDER, AgentType.BUSINESS_ADVISOR],
        status: 'active',
        startTime: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      }
    ];
  }

  /**
   * End a collaboration session
   */
  async endCollaboration(sessionId: string, finalResults?: any): Promise<void> {
    await this.agentCommunication.endCollaboration(sessionId, finalResults);
  }

  // Private helper methods

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async shareInitialContext(
    sessionId: string,
    context: UserContext,
    agents: AgentType[]
  ): Promise<void> {
    
    const contextId = await this.sharedContext.storeContext(
      context.userId,
      sessionId,
      context,
      AgentType.PLATFORM_ORCHESTRATOR,
      'high'
    );

    // Share context with all participating agents
    for (const agent of agents) {
      await this.sharedContext.shareContext(
        AgentType.PLATFORM_ORCHESTRATOR,
        agent,
        contextId,
        context.userId,
        'Initial collaboration context'
      );
    }
  }

  private async executeTaskWithAgents(
    sessionId: string,
    task: string,
    agents: AgentType[],
    context: UserContext,
    options: any
  ): Promise<any> {
    
    const results = {};
    
    // Execute task with each agent
    for (const agent of agents) {
      try {
        const agentResult = await this.executeAgentTask(
          agent,
          task,
          context,
          options
        );
        
        results[agent] = agentResult;
        
        // Add to collaboration
        await this.agentCommunication.addToCollaboration(
          sessionId,
          agent,
          agentResult,
          'contribution'
        );
        
      } catch (error) {
        console.error(`Error executing task with ${agent}:`, error);
        results[agent] = { error: error.message };
      }
    }
    
    return results;
  }

  private async executeAgentTask(
    agent: AgentType,
    task: string,
    context: UserContext,
    options: any
  ): Promise<any> {
    
    // This would typically call the actual agent implementation
    // For now, return mock results
    return {
      agent,
      task,
      result: `Task executed by ${agent}`,
      confidence: 0.8,
      timestamp: new Date()
    };
  }

  private async collectPerspectives(
    consensusId: string,
    agents: AgentType[],
    decision: string,
    context: UserContext
  ): Promise<any[]> {
    
    const perspectives = [];
    
    for (const agent of agents) {
      try {
        const perspective = await this.getAgentPerspective(
          agent,
          decision,
          context
        );
        
        await this.consensusBuilder.addPerspective(
          consensusId,
          agent,
          perspective,
          perspective.confidence || 0.7,
          perspective.reasoning || 'Agent perspective'
        );
        
        perspectives.push(perspective);
        
      } catch (error) {
        console.error(`Error getting perspective from ${agent}:`, error);
      }
    }
    
    return perspectives;
  }

  private async getAgentPerspective(
    agent: AgentType,
    decision: string,
    context: UserContext
  ): Promise<any> {
    
    // This would typically call the actual agent to get their perspective
    // For now, return mock perspective
    return {
      agent,
      perspective: `Perspective from ${agent} on ${decision}`,
      confidence: 0.7 + Math.random() * 0.3,
      reasoning: `Reasoning from ${agent}`,
      recommendations: [`Recommendation from ${agent}`]
    };
  }

  private calculateOverallAnalytics(analytics: any[]): any {
    return {
      totalInteractions: analytics.reduce((sum, a) => sum + (a.totalInteractions || 0), 0),
      successRate: analytics.reduce((sum, a) => sum + (a.successRate || 0), 0) / analytics.length,
      averageDuration: analytics.reduce((sum, a) => sum + (a.averageDuration || 0), 0) / analytics.length,
      recommendations: analytics.flatMap(a => a.recommendations || [])
    };
  }
}

// Export individual components for direct use
export {
  AgentCommunication,
  SharedContext,
  ConsensusBuilder,
  HandoffManager
};
