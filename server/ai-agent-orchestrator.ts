import { AgentType, AgentContext, AgentResponse, UserType, QueryType } from '../packages/ai-agents/src/types';
import { IntelligentAgentRouter } from '../packages/ai-agents/src/agent-router';
import { FunctionalAgentsFactory } from '../packages/ai-agents/src/functional-agents';
import { CoInvestorAgent } from '../packages/ai-agents/src/co-agents/co-investor';
import { CoBuilderAgent } from '../packages/ai-agents/src/co-agents/co-builder';
import { AgentCommunication } from '../packages/ai-agents/src/collaboration/agent-communication';
import { SharedContext } from '../packages/ai-agents/src/collaboration/shared-context';
import { ConsensusBuilder } from '../packages/ai-agents/src/collaboration/consensus-builder';
import { HandoffManager } from '../packages/ai-agents/src/collaboration/handoff-manager';
import { InfographicAgent } from './ai-agents/agents/infographic-agent';

/**
 * AI Agent Orchestrator Service
 * 
 * This service orchestrates the entire AI agent ecosystem, managing:
 * - Agent routing and selection
 * - Multi-agent collaboration
 * - Context sharing and memory
 * - Response synthesis
 * - Agent handoffs and delegation
 */
export class AIAgentOrchestrator {
  private router: IntelligentAgentRouter;
  private functionalAgentsFactory: FunctionalAgentsFactory;
  private coInvestorAgent: CoInvestorAgent;
  private coBuilderAgent: CoBuilderAgent;
  private infographicAgent: InfographicAgent;
  private agentCommunication: AgentCommunication;
  private sharedContext: SharedContext;
  private consensusBuilder: ConsensusBuilder;
  private handoffManager: HandoffManager;

  constructor() {
    this.router = new IntelligentAgentRouter();
    this.functionalAgentsFactory = new FunctionalAgentsFactory({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      azureOpenAIKey: process.env.AZURE_OPENAI_KEY || '',
      azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || '2024-02-15-preview'
    });
    
    // Initialize Co-Agents
    this.coInvestorAgent = new CoInvestorAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      azureOpenAIKey: process.env.AZURE_OPENAI_KEY || '',
      azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || '2024-02-15-preview'
    });
    
    this.coBuilderAgent = new CoBuilderAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      azureOpenAIKey: process.env.AZURE_OPENAI_KEY || '',
      azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || '2024-02-15-preview'
    });

    // Initialize Infographic Agent
    this.infographicAgent = new InfographicAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      azureOpenAIKey: process.env.AZURE_OPENAI_KEY || '',
      azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || '2024-02-15-preview'
    });

    // Initialize collaboration components
    this.agentCommunication = new AgentCommunication();
    this.sharedContext = new SharedContext();
    this.consensusBuilder = new ConsensusBuilder();
    this.handoffManager = new HandoffManager();
  }

  /**
   * Process a user query and route to appropriate agents
   */
  async processQuery(
    query: string,
    userType: UserType,
    userId: string,
    conversationHistory: any[] = [],
    relevantData: any = {}
  ): Promise<{
    response: AgentResponse;
    agents: string[];
    routing: any;
    collaboration: any;
  }> {
    try {
      // Create agent context
      const context: AgentContext = {
        userId,
        userType,
        query,
        conversationHistory,
        relevantData,
        timestamp: new Date(),
        sessionId: this.generateSessionId()
      };

      // Classify the query
      const queryClassification = await this.router.classifyQuery(query);
      
      // Select appropriate agents
      const agentSelection = await this.router.selectAgent(queryClassification, userType);
      
      // Determine if this requires multi-agent collaboration
      const requiresCollaboration = this.shouldUseCollaboration(queryClassification, agentSelection);
      
      if (requiresCollaboration) {
        return await this.handleMultiAgentCollaboration(context, agentSelection);
      } else {
        return await this.handleSingleAgentResponse(context, agentSelection);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        response: {
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          suggestions: ['Try rephrasing your question', 'Contact support if the issue persists'],
          actions: [],
          insights: []
        },
        agents: [],
        routing: { error: error.message },
        collaboration: null
      };
    }
  }

  /**
   * Handle single agent response
   */
  private async handleSingleAgentResponse(
    context: AgentContext,
    agentSelection: any
  ): Promise<{
    response: AgentResponse;
    agents: string[];
    routing: any;
    collaboration: any;
  }> {
    const { primaryAgent, functionalAgents } = agentSelection;
    
    // Check if this is an infographic request
    if (this.isInfographicRequest(context.query)) {
      const response = await this.executeInfographicAgent(context);
      return {
        response,
        agents: ['infographic'],
        routing: agentSelection,
        collaboration: null
      };
    }
    
    // Execute primary agent
    let response: AgentResponse;
    let agents: string[] = [];

    if (primaryAgent) {
      response = await this.executeCoAgent(primaryAgent, context);
      agents.push(primaryAgent);
    } else if (functionalAgents && functionalAgents.length > 0) {
      response = await this.executeFunctionalAgent(functionalAgents[0], context);
      agents.push(functionalAgents[0]);
    } else {
      throw new Error('No suitable agent found');
    }

    return {
      response,
      agents,
      routing: agentSelection,
      collaboration: null
    };
  }

  /**
   * Handle multi-agent collaboration
   */
  private async handleMultiAgentCollaboration(
    context: AgentContext,
    agentSelection: any
  ): Promise<{
    response: AgentResponse;
    agents: string[];
    routing: any;
    collaboration: any;
  }> {
    const { primaryAgent, functionalAgents } = agentSelection;
    const participatingAgents: string[] = [];
    const agentResponses: Array<{ agent: string; response: AgentResponse }> = [];

    // Execute primary agent
    if (primaryAgent) {
      const primaryResponse = await this.executeCoAgent(primaryAgent, context);
      agentResponses.push({ agent: primaryAgent, response: primaryResponse });
      participatingAgents.push(primaryAgent);
    }

    // Execute functional agents
    if (functionalAgents && functionalAgents.length > 0) {
      for (const functionalAgent of functionalAgents) {
        const functionalResponse = await this.executeFunctionalAgent(functionalAgent, context);
        agentResponses.push({ agent: functionalAgent, response: functionalResponse });
        participatingAgents.push(functionalAgent);
      }
    }

    // Build consensus and synthesize response
    const consensus = await this.consensusBuilder.buildConsensus(agentResponses);
    const synthesizedResponse = await this.router.synthesizeResponse(agentResponses, consensus);

    // Update shared context
    await this.sharedContext.updateContext(context.userId, {
      agents: participatingAgents,
      responses: agentResponses,
      consensus,
      timestamp: new Date()
    });

    return {
      response: synthesizedResponse,
      agents: participatingAgents,
      routing: agentSelection,
      collaboration: {
        consensus,
        agentResponses,
        sharedContext: await this.sharedContext.getContext(context.userId)
      }
    };
  }

  /**
   * Execute a Co-Agent
   */
  private async executeCoAgent(agentType: AgentType, context: AgentContext): Promise<AgentResponse> {
    switch (agentType) {
      case AgentType.CO_INVESTOR:
        return await this.coInvestorAgent.execute(context);
      case AgentType.CO_BUILDER:
        return await this.coBuilderAgent.execute(context);
      // Add other Co-Agents as they are implemented
      default:
        throw new Error(`Co-Agent ${agentType} not implemented`);
    }
  }

  /**
   * Execute Infographic Agent for visualization requests
   */
  private async executeInfographicAgent(context: AgentContext): Promise<AgentResponse> {
    return await this.infographicAgent.execute(context, {});
  }

  /**
   * Check if the query is requesting an infographic
   */
  private isInfographicRequest(query: string): boolean {
    const infographicKeywords = [
      'chart', 'graph', 'infographic', 'visualization', 'diagram',
      'bar chart', 'line chart', 'pie chart', 'scatter plot',
      'revenue chart', 'sales graph', 'growth visualization',
      'market share chart', 'customer analysis chart',
      'create a chart', 'make a graph', 'visualize data',
      'show data', 'display metrics', 'kpi dashboard'
    ];

    const lowerQuery = query.toLowerCase();
    return infographicKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Execute a Functional Agent
   */
  private async executeFunctionalAgent(agentType: AgentType, context: AgentContext): Promise<AgentResponse> {
    return await this.functionalAgentsFactory.executeAgent(agentType, context);
  }

  /**
   * Determine if collaboration is needed
   */
  private shouldUseCollaboration(queryClassification: any, agentSelection: any): boolean {
    // Use collaboration for complex queries that benefit from multiple perspectives
    const complexQueryTypes = [
      QueryType.STRATEGIC_PLANNING,
      QueryType.INVESTMENT_ANALYSIS,
      QueryType.PROGRAM_DEVELOPMENT,
      QueryType.ECOSYSTEM_COORDINATION
    ];

    return complexQueryTypes.includes(queryClassification.type) || 
           (agentSelection.functionalAgents && agentSelection.functionalAgents.length > 1);
  }

  /**
   * Get agent ecosystem status
   */
  async getAgentEcosystemStatus(userId: string): Promise<{
    coAgents: any[];
    functionalAgents: any[];
    collaboration: any;
    performance: any;
  }> {
    const coAgents = [
      {
        type: AgentType.CO_INVESTOR,
        name: 'Co-Investor™',
        status: 'active',
        relationshipScore: 0.85,
        lastInteraction: new Date()
      },
      {
        type: AgentType.CO_BUILDER,
        name: 'Co-Builder™',
        status: 'active',
        relationshipScore: 0.78,
        lastInteraction: new Date()
      }
    ];

    const functionalAgents = [
      {
        type: AgentType.BUSINESS_ADVISOR,
        name: 'Business Advisor',
        status: 'active',
        usageCount: 15,
        lastUsed: new Date()
      },
      {
        type: AgentType.INVESTMENT_ANALYST,
        name: 'Investment Analyst',
        status: 'active',
        usageCount: 8,
        lastUsed: new Date()
      },
      {
        type: AgentType.CREDIT_ANALYST,
        name: 'Credit Analyst',
        status: 'inactive',
        usageCount: 3,
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        type: AgentType.IMPACT_ANALYST,
        name: 'Impact Analyst',
        status: 'active',
        usageCount: 5,
        lastUsed: new Date()
      },
      {
        type: AgentType.PROGRAM_MANAGER,
        name: 'Program Manager',
        status: 'active',
        usageCount: 12,
        lastUsed: new Date()
      },
      {
        type: AgentType.PLATFORM_ORCHESTRATOR,
        name: 'Platform Orchestrator',
        status: 'active',
        usageCount: 7,
        lastUsed: new Date()
      }
    ];

    const collaboration = await this.sharedContext.getContext(userId);
    const performance = await this.getPerformanceMetrics(userId);

    return {
      coAgents,
      functionalAgents,
      collaboration,
      performance
    };
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(userId: string): Promise<any> {
    return {
      totalInteractions: 45,
      averageResponseTime: 1.2,
      satisfactionScore: 0.89,
      collaborationRate: 0.34,
      agentUtilization: {
        coAgents: 0.78,
        functionalAgents: 0.65
      }
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get available agents for user type
   */
  getAvailableAgents(userType: UserType): {
    coAgents: AgentType[];
    functionalAgents: AgentType[];
  } {
    const coAgents = [AgentType.CO_INVESTOR, AgentType.CO_BUILDER];
    
    const functionalAgents = [
      AgentType.BUSINESS_ADVISOR,
      AgentType.INVESTMENT_ANALYST,
      AgentType.CREDIT_ANALYST,
      AgentType.IMPACT_ANALYST,
      AgentType.PROGRAM_MANAGER,
      AgentType.PLATFORM_ORCHESTRATOR
    ];

    return { coAgents, functionalAgents };
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentType: AgentType): {
    capabilities: string[];
    expertise: string[];
    description: string;
  } {
    const capabilities = {
      [AgentType.CO_INVESTOR]: {
        capabilities: [
          'Investment Strategy',
          'Portfolio Analysis',
          'Deal Evaluation',
          'Risk Assessment',
          'Market Analysis'
        ],
        expertise: [
          'Investment Analysis',
          'Portfolio Management',
          'Risk Assessment',
          'Market Research',
          'Due Diligence'
        ],
        description: 'Your investment partner for portfolio strategy and deal analysis'
      },
      [AgentType.CO_BUILDER]: {
        capabilities: [
          'Partnership Strategy',
          'Program Development',
          'Ecosystem Coordination',
          'Stakeholder Management',
          'Impact Assessment'
        ],
        expertise: [
          'Partnership Development',
          'Program Management',
          'Ecosystem Building',
          'Stakeholder Engagement',
          'Impact Measurement'
        ],
        description: 'Your ecosystem partner for program and partnership development'
      },
      [AgentType.BUSINESS_ADVISOR]: {
        capabilities: [
          'Business Analysis',
          'Strategy Development',
          'Financial Analysis',
          'Market Research',
          'Operational Optimization'
        ],
        expertise: [
          'Business Strategy',
          'Financial Analysis',
          'Market Research',
          'Operations Management',
          'Growth Planning'
        ],
        description: 'Specialized business analysis and strategy development'
      },
      [AgentType.INVESTMENT_ANALYST]: {
        capabilities: [
          'Deal Analysis',
          'Portfolio Analysis',
          'Risk Assessment',
          'Valuation Analysis',
          'Due Diligence'
        ],
        expertise: [
          'Investment Analysis',
          'Portfolio Management',
          'Risk Assessment',
          'Market Analysis',
          'Valuation'
        ],
        description: 'Investment analysis and portfolio management'
      },
      [AgentType.CREDIT_ANALYST]: {
        capabilities: [
          'Credit Assessment',
          'Risk Analysis',
          'Loan Underwriting',
          'Financial Analysis',
          'Compliance Review'
        ],
        expertise: [
          'Credit Analysis',
          'Risk Assessment',
          'Loan Underwriting',
          'Financial Analysis',
          'Compliance'
        ],
        description: 'Credit analysis and risk assessment'
      },
      [AgentType.IMPACT_ANALYST]: {
        capabilities: [
          'Impact Assessment',
          'Social Impact Analysis',
          'Environmental Impact',
          'Sustainability Analysis',
          'Impact Measurement'
        ],
        expertise: [
          'Impact Assessment',
          'Social Impact',
          'Environmental Impact',
          'Sustainability',
          'Impact Measurement'
        ],
        description: 'Impact analysis and sustainability evaluation'
      },
      [AgentType.PROGRAM_MANAGER]: {
        capabilities: [
          'Program Analysis',
          'Program Optimization',
          'Resource Management',
          'Stakeholder Coordination',
          'Performance Monitoring'
        ],
        expertise: [
          'Program Management',
          'Resource Management',
          'Stakeholder Coordination',
          'Performance Monitoring',
          'Program Planning'
        ],
        description: 'Program management and optimization'
      },
      [AgentType.PLATFORM_ORCHESTRATOR]: {
        capabilities: [
          'Platform Analysis',
          'Ecosystem Coordination',
          'System Integration',
          'Platform Optimization',
          'Stakeholder Management'
        ],
        expertise: [
          'Platform Management',
          'Ecosystem Coordination',
          'System Integration',
          'Platform Optimization',
          'Governance'
        ],
        description: 'Platform orchestration and ecosystem coordination'
      }
    };

    return capabilities[agentType] || {
      capabilities: [],
      expertise: [],
      description: 'AI Agent'
    };
  }
}
