/**
 * Enhanced Collaboration Manager
 * 
 * Advanced multi-agent coordination for the Two-Tier Agentic System
 * - Seamless handoffs between Co-Agents and Functional Agents
 * - Context preservation across agent transitions
 * - Parallel and sequential agent coordination
 * - Response synthesis from multiple agents
 * - Collaboration quality tracking
 */

import { AgentType, AgentContext, AgentResponse } from '../types';
import { getAgentDatabase, AgentDatabaseService } from '../../../server/services/agent-database';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CollaborationRequest {
  userId: number;
  primaryAgent: AgentType;
  task: string;
  context: AgentContext;
  collaborationType: 'delegation' | 'consultation' | 'consensus' | 'handoff' | 'parallel';
  participatingAgents?: AgentType[];
  coordinationStrategy?: 'sequential' | 'parallel' | 'adaptive';
}

export interface CollaborationResult {
  sessionId: string;
  primaryResponse: AgentResponse;
  supportingResponses?: Record<AgentType, AgentResponse>;
  synthesizedResponse?: AgentResponse;
  handoffOccurred: boolean;
  collaborationQuality: number; // 0-1
  executionTimeMs: number;
}

export interface HandoffContext {
  fromAgent: AgentType;
  toAgent: AgentType;
  reason: string;
  conversationHistory: any[];
  relevantMemories: any[];
  userContext: Record<string, any>;
  taskContext: Record<string, any>;
  handoffQuality?: 'seamless' | 'smooth' | 'rough' | 'failed';
}

export interface AgentTask {
  taskId: string;
  agentType: AgentType;
  taskType: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  inputData: Record<string, any>;
  dependencies?: string[]; // Task IDs this task depends on
}

// ============================================================================
// ENHANCED COLLABORATION MANAGER
// ============================================================================

export class EnhancedCollaborationManager {
  private agentDb: AgentDatabaseService;
  private activeCollaborations: Map<string, any> = new Map();

  constructor() {
    this.agentDb = getAgentDatabase();
  }

  // ============================================================================
  // COLLABORATION INITIATION
  // ============================================================================

  async initiateCollaboration(request: CollaborationRequest): Promise<CollaborationResult> {
    const startTime = Date.now();
    const sessionId = this.generateSessionId();

    try {
      // Start collaboration session in database
      const collaborationId = await this.agentDb.startCollaboration({
        userId: request.userId,
        primaryAgent: request.primaryAgent,
        participatingAgents: request.participatingAgents || [],
        collaborationType: request.collaborationType,
        taskDescription: request.task,
        taskStatus: 'active',
        coordinationStrategy: request.coordinationStrategy || 'sequential'
      });

      // Store in active collaborations
      this.activeCollaborations.set(sessionId, {
        collaborationId,
        request,
        startTime
      });

      // Execute collaboration based on type
      let result: CollaborationResult;

      switch (request.collaborationType) {
        case 'delegation':
          result = await this.handleDelegation(sessionId, request);
          break;
        case 'consultation':
          result = await this.handleConsultation(sessionId, request);
          break;
        case 'consensus':
          result = await this.handleConsensus(sessionId, request);
          break;
        case 'handoff':
          result = await this.handleHandoff(sessionId, request);
          break;
        case 'parallel':
          result = await this.handleParallel(sessionId, request);
          break;
        default:
          throw new Error(`Unknown collaboration type: ${request.collaborationType}`);
      }

      // Update collaboration status
      await this.agentDb.updateCollaborationStatus(
        collaborationId,
        'completed',
        {
          sessionId,
          executionTimeMs: Date.now() - startTime,
          collaborationQuality: result.collaborationQuality
        }
      );

      // Clean up
      this.activeCollaborations.delete(sessionId);

      return {
        ...result,
        sessionId,
        executionTimeMs: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Collaboration failed:', error);
      
      // Update status as failed
      const collaboration = this.activeCollaborations.get(sessionId);
      if (collaboration) {
        await this.agentDb.updateCollaborationStatus(
          collaboration.collaborationId,
          'failed'
        );
      }

      throw error;
    }
  }

  // ============================================================================
  // DELEGATION: Co-Agent delegates to Functional Agent
  // ============================================================================

  private async handleDelegation(
    sessionId: string,
    request: CollaborationRequest
  ): Promise<CollaborationResult> {
    const { userId, primaryAgent, task, context, participatingAgents } = request;

    if (!participatingAgents || participatingAgents.length === 0) {
      throw new Error('Delegation requires at least one participating agent');
    }

    const collaboration = this.activeCollaborations.get(sessionId);
    const tasks: AgentTask[] = [];

    // Create tasks for each functional agent
    for (const agentType of participatingAgents) {
      const taskId = await this.agentDb.createTask({
        collaborationSessionId: collaboration.collaborationId,
        assignedToAgent: agentType,
        assignedByAgent: primaryAgent,
        taskType: 'analysis',
        taskDescription: task,
        taskPriority: 'high',
        taskStatus: 'pending',
        inputData: {
          context: context.relevantData,
          userQuery: task
        }
      });

      tasks.push({
        taskId: taskId.toString(),
        agentType,
        taskType: 'analysis',
        description: task,
        priority: 'high',
        inputData: context.relevantData || {}
      });
    }

    // Execute tasks sequentially
    const supportingResponses: Record<AgentType, AgentResponse> = {};

    for (const task of tasks) {
      try {
        // Update task status
        await this.agentDb.updateTaskStatus(
          task.taskId as any,
          'in_progress'
        );

        // Execute functional agent
        const response = await this.executeFunctionalAgent(
          task.agentType,
          context,
          task.inputData
        );

        supportingResponses[task.agentType] = response;

        // Update task as completed
        await this.agentDb.updateTaskStatus(
          task.taskId as any,
          'completed',
          { response }
        );

      } catch (error) {
        console.error(`❌ Task failed for ${task.agentType}:`, error);
        
        await this.agentDb.updateTaskStatus(
          task.taskId as any,
          'failed',
          undefined,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }

    // Synthesize responses from Co-Agent perspective
    const synthesizedResponse = await this.synthesizeResponses(
      primaryAgent,
      supportingResponses,
      context
    );

    return {
      sessionId,
      primaryResponse: synthesizedResponse,
      supportingResponses,
      synthesizedResponse,
      handoffOccurred: false,
      collaborationQuality: this.calculateCollaborationQuality(supportingResponses),
      executionTimeMs: 0 // Will be set by caller
    };
  }

  // ============================================================================
  // CONSULTATION: Multiple agents provide input
  // ============================================================================

  private async handleConsultation(
    sessionId: string,
    request: CollaborationRequest
  ): Promise<CollaborationResult> {
    const { primaryAgent, participatingAgents, context } = request;

    // Get input from all participating agents in parallel
    const consultationPromises = (participatingAgents || []).map(async (agentType) => {
      try {
        const response = await this.executeFunctionalAgent(agentType, context, {});
        return { agentType, response };
      } catch (error) {
        console.error(`❌ Consultation failed for ${agentType}:`, error);
        return null;
      }
    });

    const consultationResults = await Promise.all(consultationPromises);
    const supportingResponses: Record<AgentType, AgentResponse> = {};

    consultationResults.forEach(result => {
      if (result) {
        supportingResponses[result.agentType] = result.response;
      }
    });

    // Primary agent synthesizes all inputs
    const synthesizedResponse = await this.synthesizeResponses(
      primaryAgent,
      supportingResponses,
      context
    );

    return {
      sessionId,
      primaryResponse: synthesizedResponse,
      supportingResponses,
      synthesizedResponse,
      handoffOccurred: false,
      collaborationQuality: this.calculateCollaborationQuality(supportingResponses),
      executionTimeMs: 0
    };
  }

  // ============================================================================
  // CONSENSUS: Agents work together to reach agreement
  // ============================================================================

  private async handleConsensus(
    sessionId: string,
    request: CollaborationRequest
  ): Promise<CollaborationResult> {
    const { primaryAgent, participatingAgents, context } = request;

    // Round 1: Get initial responses from all agents
    const initialResponses: Record<AgentType, AgentResponse> = {};
    
    for (const agentType of [primaryAgent, ...(participatingAgents || [])]) {
      const response = await this.executeFunctionalAgent(agentType, context, {});
      initialResponses[agentType] = response;
    }

    // Round 2: Share responses and get consensus
    const consensusContext = {
      ...context,
      relevantData: {
        ...context.relevantData,
        initialResponses
      }
    };

    const consensusResponse = await this.executeFunctionalAgent(
      primaryAgent,
      consensusContext,
      { consensusRound: true }
    );

    return {
      sessionId,
      primaryResponse: consensusResponse,
      supportingResponses: initialResponses,
      synthesizedResponse: consensusResponse,
      handoffOccurred: false,
      collaborationQuality: this.calculateCollaborationQuality(initialResponses),
      executionTimeMs: 0
    };
  }

  // ============================================================================
  // HANDOFF: Seamless transition between agents
  // ============================================================================

  private async handleHandoff(
    sessionId: string,
    request: CollaborationRequest
  ): Promise<CollaborationResult> {
    const { userId, primaryAgent, context, participatingAgents } = request;

    if (!participatingAgents || participatingAgents.length === 0) {
      throw new Error('Handoff requires a target agent');
    }

    const targetAgent = participatingAgents[0];
    const collaboration = this.activeCollaborations.get(sessionId);

    // Prepare handoff context
    const handoffContext = await this.prepareHandoffContext(
      userId,
      primaryAgent,
      targetAgent,
      context,
      'User request requires specialized expertise'
    );

    // Record handoff in database
    const handoffId = await this.agentDb.createHandoff({
      collaborationSessionId: collaboration.collaborationId,
      fromAgent: primaryAgent,
      toAgent: targetAgent,
      handoffReason: handoffContext.reason,
      contextTransferred: {
        conversationHistory: handoffContext.conversationHistory,
        relevantMemories: handoffContext.relevantMemories,
        userContext: handoffContext.userContext,
        taskContext: handoffContext.taskContext
      },
      handoffQuality: 'seamless',
      userNotified: true
    });

    // Execute target agent with full context
    const enrichedContext: AgentContext = {
      ...context,
      relevantData: {
        ...context.relevantData,
        handoffContext: handoffContext,
        previousAgent: primaryAgent
      }
    };

    const targetResponse = await this.executeFunctionalAgent(
      targetAgent,
      enrichedContext,
      {}
    );

    // Add handoff notification to response
    const enhancedResponse: AgentResponse = {
      ...targetResponse,
      content: `*[Seamlessly transitioning from ${this.getAgentName(primaryAgent)} to ${this.getAgentName(targetAgent)}]*\n\n${targetResponse.content}`,
      metadata: {
        ...targetResponse.metadata,
        handoff: {
          from: primaryAgent,
          to: targetAgent,
          quality: 'seamless'
        }
      }
    };

    return {
      sessionId,
      primaryResponse: enhancedResponse,
      handoffOccurred: true,
      collaborationQuality: 0.9, // High quality for seamless handoff
      executionTimeMs: 0
    };
  }

  // ============================================================================
  // PARALLEL: Execute multiple agents simultaneously
  // ============================================================================

  private async handleParallel(
    sessionId: string,
    request: CollaborationRequest
  ): Promise<CollaborationResult> {
    const { primaryAgent, participatingAgents, context } = request;

    // Execute all agents in parallel
    const executionPromises = [primaryAgent, ...(participatingAgents || [])].map(
      async (agentType) => {
        try {
          const response = await this.executeFunctionalAgent(agentType, context, {});
          return { agentType, response, success: true };
        } catch (error) {
          console.error(`❌ Parallel execution failed for ${agentType}:`, error);
          return { agentType, response: null, success: false };
        }
      }
    );

    const results = await Promise.all(executionPromises);

    // Separate primary and supporting responses
    const primaryResult = results.find(r => r.agentType === primaryAgent);
    const supportingResponses: Record<AgentType, AgentResponse> = {};

    results.forEach(result => {
      if (result.success && result.response && result.agentType !== primaryAgent) {
        supportingResponses[result.agentType] = result.response;
      }
    });

    // Synthesize all responses
    const synthesizedResponse = await this.synthesizeResponses(
      primaryAgent,
      { ...supportingResponses, [primaryAgent]: primaryResult?.response! },
      context
    );

    return {
      sessionId,
      primaryResponse: primaryResult?.response || synthesizedResponse,
      supportingResponses,
      synthesizedResponse,
      handoffOccurred: false,
      collaborationQuality: this.calculateCollaborationQuality(supportingResponses),
      executionTimeMs: 0
    };
  }

  // ============================================================================
  // CONTEXT PREPARATION
  // ============================================================================

  private async prepareHandoffContext(
    userId: number,
    fromAgent: AgentType,
    toAgent: AgentType,
    context: AgentContext,
    reason: string
  ): Promise<HandoffContext> {
    // Get conversation history
    const conversationHistory = await this.agentDb.getConversationHistory(
      userId,
      fromAgent,
      undefined,
      20
    );

    // Get relevant memories
    const relevantMemories = await this.agentDb.getRelevantMemories(
      userId,
      fromAgent,
      undefined,
      10
    );

    // Extract user context
    const userContext = {
      userId,
      userType: context.userType,
      currentGoals: context.relevantData?.goals || [],
      recentActivity: context.relevantData?.recentActivity || []
    };

    // Extract task context
    const taskContext = {
      currentTask: context.currentTask,
      taskDescription: context.relevantData?.taskDescription,
      priority: context.relevantData?.priority || 'medium',
      deadline: context.relevantData?.deadline
    };

    return {
      fromAgent,
      toAgent,
      reason,
      conversationHistory: conversationHistory.map(c => ({
        role: c.messageRole,
        content: c.messageContent
      })),
      relevantMemories: relevantMemories.map(m => ({
        key: m.memoryKey,
        value: m.memoryValue,
        type: m.memoryType
      })),
      userContext,
      taskContext,
      handoffQuality: 'seamless'
    };
  }

  // ============================================================================
  // RESPONSE SYNTHESIS
  // ============================================================================

  private async synthesizeResponses(
    primaryAgent: AgentType,
    responses: Record<AgentType, AgentResponse>,
    context: AgentContext
  ): Promise<AgentResponse> {
    const responseEntries = Object.entries(responses);

    if (responseEntries.length === 0) {
      return {
        content: 'No responses received from collaborating agents.',
        suggestions: [],
        confidence: 0
      };
    }

    if (responseEntries.length === 1) {
      return responseEntries[0][1];
    }

    // Synthesize multiple responses
    const synthesizedContent = this.buildSynthesizedContent(responses);
    const combinedSuggestions = this.combineSuggestions(responses);
    const combinedInsights = this.combineInsights(responses);
    const avgConfidence = this.calculateAverageConfidence(responses);

    return {
      content: synthesizedContent,
      suggestions: combinedSuggestions,
      insights: combinedInsights,
      confidence: avgConfidence,
      metadata: {
        synthesized: true,
        contributingAgents: Object.keys(responses),
        synthesizedBy: primaryAgent
      }
    };
  }

  private buildSynthesizedContent(responses: Record<AgentType, AgentResponse>): string {
    const sections: string[] = [];

    sections.push('Based on comprehensive analysis from our specialized agents:\n');

    Object.entries(responses).forEach(([agentType, response]) => {
      const agentName = this.getAgentName(agentType as AgentType);
      sections.push(`\n**${agentName} Analysis:**`);
      sections.push(response.content);
    });

    sections.push('\n**Integrated Recommendation:**');
    sections.push('Considering all perspectives, here\'s my synthesized guidance...');

    return sections.join('\n');
  }

  private combineSuggestions(responses: Record<AgentType, AgentResponse>): string[] {
    const allSuggestions = new Set<string>();

    Object.values(responses).forEach(response => {
      if (response.suggestions) {
        response.suggestions.forEach(s => allSuggestions.add(s));
      }
    });

    return Array.from(allSuggestions).slice(0, 5); // Top 5 unique suggestions
  }

  private combineInsights(responses: Record<AgentType, AgentResponse>): any[] {
    const allInsights: any[] = [];

    Object.values(responses).forEach(response => {
      if (response.insights) {
        allInsights.push(...response.insights);
      }
    });

    // Sort by priority and return top insights
    return allInsights
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      })
      .slice(0, 3);
  }

  private calculateAverageConfidence(responses: Record<AgentType, AgentResponse>): number {
    const confidences = Object.values(responses)
      .map(r => r.confidence || 0.5)
      .filter(c => c > 0);

    if (confidences.length === 0) return 0.5;

    return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
  }

  private calculateCollaborationQuality(responses: Record<AgentType, AgentResponse>): number {
    const responseCount = Object.keys(responses).length;
    const avgConfidence = this.calculateAverageConfidence(responses);
    const hasInsights = Object.values(responses).some(r => r.insights && r.insights.length > 0);

    let quality = 0.5; // Base quality

    // Adjust based on response count
    quality += Math.min(responseCount * 0.1, 0.3);

    // Adjust based on confidence
    quality += avgConfidence * 0.2;

    // Bonus for insights
    if (hasInsights) quality += 0.1;

    return Math.min(quality, 1.0);
  }

  // ============================================================================
  // AGENT EXECUTION
  // ============================================================================

  private async executeFunctionalAgent(
    agentType: AgentType,
    context: AgentContext,
    additionalData: Record<string, any>
  ): Promise<AgentResponse> {
    // This would integrate with the actual agent execution system
    // For now, return a mock response
    console.log(`🤖 Executing ${agentType} with context:`, context.currentTask);

    // In production, this would call the actual agent
    return {
      content: `Response from ${this.getAgentName(agentType)}`,
      suggestions: ['Suggestion 1', 'Suggestion 2'],
      confidence: 0.8
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generateSessionId(): string {
    return `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAgentName(agentType: AgentType): string {
    const names: Record<AgentType, string> = {
      co_founder: 'Co-Founder™',
      co_investor: 'Co-Investor™',
      co_builder: 'Co-Builder™',
      business_advisor: 'Business Advisor',
      investment_analyst: 'Investment Analyst',
      credit_analyst: 'Credit Analyst',
      impact_analyst: 'Impact Analyst',
      program_manager: 'Program Manager',
      platform_orchestrator: 'Platform Orchestrator'
    };

    return names[agentType] || agentType;
  }

  // ============================================================================
  // DELEGATION HELPERS
  // ============================================================================

  async delegateTask(
    userId: number,
    fromAgent: AgentType,
    toAgent: AgentType,
    task: string,
    context: AgentContext,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<CollaborationResult> {
    return await this.initiateCollaboration({
      userId,
      primaryAgent: fromAgent,
      task,
      context,
      collaborationType: 'delegation',
      participatingAgents: [toAgent],
      coordinationStrategy: 'sequential'
    });
  }

  async seamlessHandoff(
    userId: number,
    fromAgent: AgentType,
    toAgent: AgentType,
    reason: string,
    context: AgentContext
  ): Promise<CollaborationResult> {
    return await this.initiateCollaboration({
      userId,
      primaryAgent: fromAgent,
      task: `Handoff: ${reason}`,
      context,
      collaborationType: 'handoff',
      participatingAgents: [toAgent]
    });
  }

  async coordinateAgents(
    userId: number,
    primaryAgent: AgentType,
    participatingAgents: AgentType[],
    task: string,
    context: AgentContext,
    parallel: boolean = false
  ): Promise<CollaborationResult> {
    return await this.initiateCollaboration({
      userId,
      primaryAgent,
      task,
      context,
      collaborationType: parallel ? 'parallel' : 'consultation',
      participatingAgents,
      coordinationStrategy: parallel ? 'parallel' : 'sequential'
    });
  }

  // ============================================================================
  // MONITORING
  // ============================================================================

  getActiveCollaborations(): Map<string, any> {
    return this.activeCollaborations;
  }

  getCollaborationCount(): number {
    return this.activeCollaborations.size;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let collaborationManagerInstance: EnhancedCollaborationManager | null = null;

export function getCollaborationManager(): EnhancedCollaborationManager {
  if (!collaborationManagerInstance) {
    collaborationManagerInstance = new EnhancedCollaborationManager();
  }
  return collaborationManagerInstance;
}
