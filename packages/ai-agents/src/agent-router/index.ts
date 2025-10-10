import { 
  AgentType, 
  AgentInteraction, 
  AgentResponse, 
  MultiAgentResponse, 
  RoutingDecision,
  UserContext,
  QueryType
} from '../types';
import { QueryClassifier } from './query-classifier';
import { AgentSelector } from './agent-selector';
import { TaskDelegator } from './task-delegator';
import { ResponseSynthesizer } from './response-synthesizer';

/**
 * IntelligentAgentRouter - Central orchestrator for the two-tier agent architecture
 * 
 * This is the main entry point for all agent interactions. It handles:
 * - Query classification and routing
 * - Agent selection and delegation
 * - Multi-agent collaboration
 * - Response synthesis
 */
export class IntelligentAgentRouter {
  private queryClassifier: QueryClassifier;
  private agentSelector: AgentSelector;
  private taskDelegator: TaskDelegator;
  private responseSynthesizer: ResponseSynthesizer;

  constructor() {
    this.queryClassifier = new QueryClassifier();
    this.agentSelector = new AgentSelector();
    this.taskDelegator = new TaskDelegator();
    this.responseSynthesizer = new ResponseSynthesizer();
  }

  /**
   * Main routing method - handles all user interactions
   */
  async route(interaction: AgentInteraction): Promise<MultiAgentResponse> {
    try {
      // Step 1: Classify the query
      const queryMetadata = this.queryClassifier.getQueryMetadata(interaction.userQuery);
      
      // Step 2: Select the appropriate agent(s)
      const routingDecision = await this.agentSelector.selectAgent(interaction);
      
      // Step 3: Execute the interaction
      const result = await this.executeInteraction(
        interaction, 
        routingDecision, 
        queryMetadata
      );
      
      // Step 4: Return synthesized response
      return result;
      
    } catch (error) {
      console.error('Agent routing error:', error);
      return this.handleRoutingError(interaction, error);
    }
  }

  /**
   * Route for streaming responses
   */
  async *routeStreaming(interaction: AgentInteraction): AsyncGenerator<Partial<AgentResponse>, void, unknown> {
    try {
      const queryMetadata = this.queryClassifier.getQueryMetadata(interaction.userQuery);
      const routingDecision = await this.agentSelector.selectAgent(interaction);
      
      // Yield routing information first
      yield {
        metadata: {
          routingDecision,
          queryType: queryMetadata.type,
          confidence: queryMetadata.confidence
        }
      };
      
      // Stream the actual response
      yield* this.executeStreamingInteraction(interaction, routingDecision, queryMetadata);
      
    } catch (error) {
      console.error('Streaming routing error:', error);
      yield {
        content: 'I encountered an error processing your request. Please try again.',
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Handle delegation between agents
   */
  async delegateTask(
    fromAgent: AgentType,
    task: string,
    userContext: UserContext,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<AgentResponse> {
    
    // Determine target agent for delegation
    const interaction: AgentInteraction = {
      userQuery: task,
      userType: userContext.userType,
      context: userContext
    };
    
    const routingDecision = await this.agentSelector.selectAgent(interaction);
    const targetAgent = routingDecision.primaryAgent;
    
    // Delegate the task
    const delegationResult = await this.taskDelegator.delegateToFunctionalAgent(
      fromAgent,
      targetAgent,
      task,
      this.convertToAgentContext(userContext),
      urgency
    );
    
    // Execute the delegated task
    const response = await this.executeDelegatedTask(
      targetAgent,
      task,
      userContext,
      delegationResult.delegationId
    );
    
    // Handle the handoff back to the delegating agent
    const handoffResult = await this.taskDelegator.handleResultHandoff(
      delegationResult.delegationId,
      response,
      targetAgent,
      fromAgent
    );
    
    return {
      id: this.generateResponseId(),
      content: handoffResult.synthesizedResponse,
      agentType: fromAgent,
      timestamp: new Date(),
      suggestions: handoffResult.followUpSuggestions,
      actions: response.actions,
      insights: response.insights,
      metadata: {
        delegationId: delegationResult.delegationId,
        delegatedTo: targetAgent,
        handoffCompleted: true
      }
    };
  }

  /**
   * Check if an agent should escalate a query
   */
  async shouldEscalate(
    currentAgent: AgentType,
    query: string,
    userContext: UserContext
  ): Promise<{ shouldEscalate: boolean; targetAgent?: AgentType; reason?: string }> {
    
    const queryType = this.queryClassifier.classify(query);
    
    return this.agentSelector.shouldEscalate(
      currentAgent,
      queryType,
      userContext.userType,
      userContext
    );
  }

  /**
   * Get agent recommendations for a user
   */
  getAgentRecommendations(userContext: UserContext): AgentRecommendation[] {
    const coAgent = this.agentSelector['getCoAgentForUser'](userContext.userType);
    const functionalAgents = this.getFunctionalAgentsForUser(userContext.userType);
    
    const recommendations: AgentRecommendation[] = [];
    
    // Always recommend the co-agent for eligible users
    if ([AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER].includes(coAgent)) {
      const metadata = this.agentSelector.getAgentMetadata(coAgent);
      recommendations.push({
        agent: coAgent,
        reason: 'Your dedicated partnership agent for strategic guidance',
        priority: 'high',
        tier: metadata.tier,
        description: metadata.description
      });
    }
    
    // Add functional agents based on user context
    functionalAgents.forEach(agent => {
      const metadata = this.agentSelector.getAgentMetadata(agent);
      recommendations.push({
        agent,
        reason: this.getFunctionalAgentReason(agent, userContext),
        priority: 'medium',
        tier: metadata.tier,
        description: metadata.description
      });
    });
    
    return recommendations;
  }

  // Private implementation methods

  private async executeInteraction(
    interaction: AgentInteraction,
    routingDecision: RoutingDecision,
    queryMetadata: any
  ): Promise<MultiAgentResponse> {
    
    const primaryAgent = routingDecision.primaryAgent;
    
    // Execute primary agent response
    const primaryResponse = await this.executeSingleAgent(
      primaryAgent,
      interaction,
      queryMetadata
    );
    
    // Handle support agents if any
    const contributingResponses: AgentResponse[] = [];
    
    if (routingDecision.supportAgents.length > 0) {
      const supportPromises = routingDecision.supportAgents.map(agent =>
        this.executeSingleAgent(agent, interaction, queryMetadata)
      );
      
      const supportResponses = await Promise.all(supportPromises);
      contributingResponses.push(...supportResponses);
    }
    
    // Synthesize the final response
    return await this.responseSynthesizer.synthesizeMultiAgentResponse(
      primaryResponse,
      contributingResponses,
      {
        routingDecision,
        queryMetadata,
        interaction
      }
    );
  }

  private async *executeStreamingInteraction(
    interaction: AgentInteraction,
    routingDecision: RoutingDecision,
    queryMetadata: any
  ): AsyncGenerator<Partial<AgentResponse>, void, unknown> {
    
    // For streaming, we focus on the primary agent
    // Support agents will be handled asynchronously
    const primaryAgent = routingDecision.primaryAgent;
    
    yield* this.executeSingleAgentStreaming(primaryAgent, interaction, queryMetadata);
    
    // If there are support agents, handle them in the background
    if (routingDecision.supportAgents.length > 0) {
      // Note: In a full implementation, this would trigger background processing
      // and potentially update the UI with additional insights as they become available
      yield {
        metadata: {
          supportAgentsTriggered: routingDecision.supportAgents,
          message: 'Additional analysis in progress...'
        }
      };
    }
  }

  private async executeSingleAgent(
    agentType: AgentType,
    interaction: AgentInteraction,
    queryMetadata: any
  ): Promise<AgentResponse> {
    
    // Convert interaction to agent context
    const agentContext = this.convertToAgentContext(interaction.context);
    agentContext.currentTask = this.determineTaskFromQuery(queryMetadata.type);
    
    // This would be the actual agent execution
    // For now, return a mock response
    return {
      id: this.generateResponseId(),
      content: await this.generateAgentResponse(agentType, interaction, queryMetadata),
      agentType,
      timestamp: new Date(),
      suggestions: this.generateSuggestions(agentType, queryMetadata.type),
      insights: this.generateInsights(agentType, interaction),
      metadata: {
        queryType: queryMetadata.type,
        confidence: queryMetadata.confidence,
        processingTime: Date.now() // Would be actual processing time
      }
    };
  }

  private async *executeSingleAgentStreaming(
    agentType: AgentType,
    interaction: AgentInteraction,
    queryMetadata: any
  ): AsyncGenerator<Partial<AgentResponse>, void, unknown> {
    
    // Simulate streaming response
    const content = await this.generateAgentResponse(agentType, interaction, queryMetadata);
    const chunks = this.chunkContent(content);
    
    for (const chunk of chunks) {
      yield { content: chunk };
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Final metadata
    yield {
      agentType,
      timestamp: new Date(),
      suggestions: this.generateSuggestions(agentType, queryMetadata.type),
      insights: this.generateInsights(agentType, interaction),
      metadata: { complete: true }
    };
  }

  private async executeDelegatedTask(
    agentType: AgentType,
    task: string,
    userContext: UserContext,
    delegationId: string
  ): Promise<AgentResponse> {
    
    // Mock implementation - would execute actual agent
    return {
      id: this.generateResponseId(),
      content: `Analysis completed for: ${task}`,
      agentType,
      timestamp: new Date(),
      metadata: { delegationId }
    };
  }

  private convertToAgentContext(userContext: UserContext): any {
    return {
      userId: userContext.userId,
      userType: userContext.userType,
      conversationHistory: [],
      relevantData: userContext.businessData || userContext.investmentData,
      permissions: ['read', 'analyze'],
      sessionId: this.generateSessionId()
    };
  }

  private determineTaskFromQuery(queryType: QueryType): string {
    const taskMap = {
      [QueryType.STRATEGIC]: 'strategic_session',
      [QueryType.ACCOUNTABILITY]: 'accountability_check',
      [QueryType.EMOTIONAL]: 'emotional_support',
      [QueryType.BRAINSTORM]: 'brainstorm',
      [QueryType.ANALYSIS]: 'analysis',
      [QueryType.RESEARCH]: 'research',
      [QueryType.DOCUMENT]: 'document_review'
    };
    
    return taskMap[queryType] || 'general_assistance';
  }

  private async generateAgentResponse(
    agentType: AgentType,
    interaction: AgentInteraction,
    queryMetadata: any
  ): Promise<string> {
    
    const agentMetadata = this.agentSelector.getAgentMetadata(agentType);
    
    return `Hello! I'm your ${agentMetadata.name}. I understand you're asking about: "${interaction.userQuery}"
    
Based on my analysis, this appears to be a ${queryMetadata.type} type query. Let me help you with this...

[This would be the actual agent response based on the specific agent implementation]`;
  }

  private generateSuggestions(agentType: AgentType, queryType: QueryType): string[] {
    return [
      'Explore this topic further',
      'Get additional analysis',
      'Plan next steps',
      'Discuss with team'
    ];
  }

  private generateInsights(agentType: AgentType, interaction: AgentInteraction): any[] {
    return [
      {
        type: 'recommendation',
        title: 'Consider next steps',
        description: 'Based on your query, here are some recommended actions',
        priority: 'medium',
        actionable: true
      }
    ];
  }

  private chunkContent(content: string): string[] {
    // Simple chunking for streaming
    const words = content.split(' ');
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += 5) {
      chunks.push(words.slice(i, i + 5).join(' ') + ' ');
    }
    
    return chunks;
  }

  private getFunctionalAgentsForUser(userType: any): AgentType[] {
    const agentMap = {
      entrepreneur: [AgentType.BUSINESS_ADVISOR],
      investor: [AgentType.INVESTMENT_ANALYST],
      lender: [AgentType.CREDIT_ANALYST],
      grantor: [AgentType.IMPACT_ANALYST],
      partner: [AgentType.PROGRAM_MANAGER]
    };
    
    return agentMap[userType] || [AgentType.BUSINESS_ADVISOR];
  }

  private getFunctionalAgentReason(agent: AgentType, userContext: UserContext): string {
    const reasons = {
      [AgentType.BUSINESS_ADVISOR]: 'For business analysis and strategic planning',
      [AgentType.INVESTMENT_ANALYST]: 'For investment analysis and due diligence',
      [AgentType.CREDIT_ANALYST]: 'For credit assessment and risk analysis',
      [AgentType.IMPACT_ANALYST]: 'For impact measurement and ESG analysis',
      [AgentType.PROGRAM_MANAGER]: 'For program optimization and partnerships'
    };
    
    return reasons[agent] || 'For specialized analysis';
  }

  private handleRoutingError(interaction: AgentInteraction, error: any): MultiAgentResponse {
    const errorResponse: AgentResponse = {
      id: this.generateResponseId(),
      content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
      agentType: AgentType.PLATFORM_ORCHESTRATOR,
      timestamp: new Date(),
      metadata: { error: error.message }
    };
    
    return {
      primaryResponse: errorResponse,
      contributingAgents: [],
      synthesizedInsights: [],
      collaborationMetadata: { error: true }
    };
  }

  private generateResponseId(): string {
    return `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export types for this module
export interface AgentRecommendation {
  agent: AgentType;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  tier: any;
  description: string;
}

// Export all router components
export { QueryClassifier } from './query-classifier';
export { AgentSelector } from './agent-selector';
export { TaskDelegator } from './task-delegator';
export { ResponseSynthesizer } from './response-synthesizer';
export * from './task-delegator'; // Export delegation types
