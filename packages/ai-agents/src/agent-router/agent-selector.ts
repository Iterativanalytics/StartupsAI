import { AgentType, QueryType, UserType, RoutingDecision, AgentInteraction, AgentTier } from '../types';
import { QueryClassifier } from './query-classifier';

/**
 * Agent Selector - Intelligent routing system for the two-tier agent architecture
 * 
 * Tier 1: Co-Agents (Partnership Layer)
 * - Deep relationship, personality, memory
 * - Strategic guidance, accountability, emotional support
 * - Always available, proactive, relationship-focused
 * 
 * Tier 2: Functional Agents (Task Layer)
 * - Specialized expertise in specific domains
 * - On-demand, task-focused, efficient
 * - Called by Co-Agent or directly by user
 */
export class AgentSelector {
  private queryClassifier: QueryClassifier;

  constructor() {
    this.queryClassifier = new QueryClassifier();
  }

  async selectAgent(interaction: AgentInteraction): Promise<RoutingDecision> {
    // Step 1: Classify the query type
    const queryMetadata = this.queryClassifier.getQueryMetadata(interaction.userQuery);
    
    // Step 2: Determine if Co-Agent or Functional Agent should handle
    const routingDecision = this.decideRouting(queryMetadata.type, interaction, queryMetadata);
    
    return routingDecision;
  }

  private decideRouting(
    queryType: QueryType,
    interaction: AgentInteraction,
    metadata: any
  ): RoutingDecision {
    const coAgentQueries = [
      QueryType.STRATEGIC, 
      QueryType.ACCOUNTABILITY, 
      QueryType.EMOTIONAL, 
      QueryType.RELATIONSHIP, 
      QueryType.BRAINSTORM
    ];
    
    const functionalAgentQueries = [
      QueryType.ANALYSIS, 
      QueryType.RESEARCH, 
      QueryType.DOCUMENT, 
      QueryType.TECHNICAL, 
      QueryType.REPORTING
    ];
    
    // Route to Co-Agent for partnership-focused queries
    if (coAgentQueries.includes(queryType)) {
      return {
        primaryAgent: this.getCoAgentForUser(interaction.userType),
        supportAgents: this.identifySupportAgents(queryType, interaction),
        approach: 'conversational',
        mayDelegate: true // Co-Agent can delegate to functional agents if needed
      };
    }
    
    // Route to Functional Agent for task-focused queries
    if (functionalAgentQueries.includes(queryType)) {
      return {
        primaryAgent: this.selectFunctionalAgent(queryType, interaction.userType),
        supportAgents: [],
        approach: 'task_focused',
        notifyCoAgent: true // Keep Co-Agent aware of the interaction
      };
    }
    
    // Default: Start with Co-Agent for general queries
    return {
      primaryAgent: this.getCoAgentForUser(interaction.userType),
      supportAgents: [],
      approach: 'conversational',
      mayDelegate: true
    };
  }

  private getCoAgentForUser(userType: UserType): AgentType {
    const coAgentMap: Record<UserType, AgentType> = {
      [UserType.ENTREPRENEUR]: AgentType.CO_FOUNDER,
      [UserType.INVESTOR]: AgentType.CO_INVESTOR,
      [UserType.PARTNER]: AgentType.CO_BUILDER,
      [UserType.LENDER]: AgentType.CREDIT_ANALYST, // Lenders don't have Co-Agent, direct to functional
      [UserType.GRANTOR]: AgentType.IMPACT_ANALYST, // Grantors don't have Co-Agent, direct to functional
      [UserType.ADMIN]: AgentType.PLATFORM_ORCHESTRATOR
    };
    
    return coAgentMap[userType] || AgentType.CO_FOUNDER;
  }

  private selectFunctionalAgent(queryType: QueryType, userType: UserType): AgentType {
    // Primary functional agent mapping by user type
    const primaryAgentMap: Record<UserType, Record<QueryType, AgentType>> = {
      [UserType.ENTREPRENEUR]: {
        [QueryType.ANALYSIS]: AgentType.BUSINESS_ADVISOR,
        [QueryType.RESEARCH]: AgentType.BUSINESS_ADVISOR,
        [QueryType.DOCUMENT]: AgentType.BUSINESS_ADVISOR,
        [QueryType.TECHNICAL]: AgentType.BUSINESS_ADVISOR,
        [QueryType.REPORTING]: AgentType.BUSINESS_ADVISOR,
        [QueryType.GENERAL]: AgentType.BUSINESS_ADVISOR
      },
      [UserType.INVESTOR]: {
        [QueryType.ANALYSIS]: AgentType.INVESTMENT_ANALYST,
        [QueryType.RESEARCH]: AgentType.INVESTMENT_ANALYST,
        [QueryType.DOCUMENT]: AgentType.INVESTMENT_ANALYST,
        [QueryType.TECHNICAL]: AgentType.INVESTMENT_ANALYST,
        [QueryType.REPORTING]: AgentType.INVESTMENT_ANALYST,
        [QueryType.GENERAL]: AgentType.INVESTMENT_ANALYST
      },
      [UserType.LENDER]: {
        [QueryType.ANALYSIS]: AgentType.CREDIT_ANALYST,
        [QueryType.RESEARCH]: AgentType.CREDIT_ANALYST,
        [QueryType.DOCUMENT]: AgentType.CREDIT_ANALYST,
        [QueryType.TECHNICAL]: AgentType.CREDIT_ANALYST,
        [QueryType.REPORTING]: AgentType.CREDIT_ANALYST,
        [QueryType.GENERAL]: AgentType.CREDIT_ANALYST
      },
      [UserType.GRANTOR]: {
        [QueryType.ANALYSIS]: AgentType.IMPACT_ANALYST,
        [QueryType.RESEARCH]: AgentType.IMPACT_ANALYST,
        [QueryType.DOCUMENT]: AgentType.IMPACT_ANALYST,
        [QueryType.TECHNICAL]: AgentType.IMPACT_ANALYST,
        [QueryType.REPORTING]: AgentType.IMPACT_ANALYST,
        [QueryType.GENERAL]: AgentType.IMPACT_ANALYST
      },
      [UserType.PARTNER]: {
        [QueryType.ANALYSIS]: AgentType.PROGRAM_MANAGER,
        [QueryType.RESEARCH]: AgentType.PROGRAM_MANAGER,
        [QueryType.DOCUMENT]: AgentType.PROGRAM_MANAGER,
        [QueryType.TECHNICAL]: AgentType.PROGRAM_MANAGER,
        [QueryType.REPORTING]: AgentType.PROGRAM_MANAGER,
        [QueryType.GENERAL]: AgentType.PROGRAM_MANAGER
      },
      [UserType.ADMIN]: {
        [QueryType.ANALYSIS]: AgentType.PLATFORM_ORCHESTRATOR,
        [QueryType.RESEARCH]: AgentType.PLATFORM_ORCHESTRATOR,
        [QueryType.DOCUMENT]: AgentType.PLATFORM_ORCHESTRATOR,
        [QueryType.TECHNICAL]: AgentType.PLATFORM_ORCHESTRATOR,
        [QueryType.REPORTING]: AgentType.PLATFORM_ORCHESTRATOR,
        [QueryType.GENERAL]: AgentType.PLATFORM_ORCHESTRATOR
      }
    };
    
    return primaryAgentMap[userType]?.[queryType] || AgentType.BUSINESS_ADVISOR;
  }

  private identifySupportAgents(queryType: QueryType, interaction: AgentInteraction): AgentType[] {
    const supportAgents: AgentType[] = [];
    
    // For strategic queries, might need analysis support
    if (queryType === QueryType.STRATEGIC) {
      const functionalAgent = this.selectFunctionalAgent(QueryType.ANALYSIS, interaction.userType);
      supportAgents.push(functionalAgent);
    }
    
    // For brainstorming, might need research support
    if (queryType === QueryType.BRAINSTORM) {
      const functionalAgent = this.selectFunctionalAgent(QueryType.RESEARCH, interaction.userType);
      supportAgents.push(functionalAgent);
    }
    
    // For accountability, might need reporting support
    if (queryType === QueryType.ACCOUNTABILITY) {
      const functionalAgent = this.selectFunctionalAgent(QueryType.REPORTING, interaction.userType);
      supportAgents.push(functionalAgent);
    }
    
    return supportAgents;
  }

  /**
   * Determines if a query should be escalated to a different tier
   */
  shouldEscalate(
    currentAgent: AgentType, 
    queryType: QueryType, 
    userType: UserType,
    context: any
  ): { shouldEscalate: boolean; targetAgent?: AgentType; reason?: string } {
    // Functional agent should escalate to Co-Agent for emotional/strategic content
    if (this.isFunctionalAgent(currentAgent)) {
      const emotionalQueries = [QueryType.EMOTIONAL, QueryType.STRATEGIC, QueryType.RELATIONSHIP];
      if (emotionalQueries.includes(queryType)) {
        return {
          shouldEscalate: true,
          targetAgent: this.getCoAgentForUser(userType),
          reason: 'Query requires partnership-level guidance'
        };
      }
    }
    
    // Co-Agent should delegate complex analysis to Functional Agent
    if (this.isCoAgent(currentAgent)) {
      const complexQueries = [QueryType.TECHNICAL, QueryType.REPORTING];
      if (complexQueries.includes(queryType) && context?.complexity === 'high') {
        return {
          shouldEscalate: true,
          targetAgent: this.selectFunctionalAgent(queryType, userType),
          reason: 'Query requires specialized technical expertise'
        };
      }
    }
    
    return { shouldEscalate: false };
  }

  private isFunctionalAgent(agent: AgentType): boolean {
    const functionalAgents = [
      AgentType.BUSINESS_ADVISOR,
      AgentType.INVESTMENT_ANALYST,
      AgentType.CREDIT_ANALYST,
      AgentType.IMPACT_ANALYST,
      AgentType.PROGRAM_MANAGER
    ];
    return functionalAgents.includes(agent);
  }

  private isCoAgent(agent: AgentType): boolean {
    const coAgents = [
      AgentType.CO_FOUNDER,
      AgentType.CO_INVESTOR,
      AgentType.CO_BUILDER
    ];
    return coAgents.includes(agent);
  }

  /**
   * Get agent metadata for UI display
   */
  getAgentMetadata(agent: AgentType) {
    const metadata = {
      [AgentType.CO_FOUNDER]: {
        name: 'Co-Founder™',
        tier: AgentTier.CO_AGENT,
        description: 'Your strategic partner and accountability coach',
        emoji: '🤝',
        color: '#6366f1'
      },
      [AgentType.CO_INVESTOR]: {
        name: 'Co-Investor™',
        tier: AgentTier.CO_AGENT,
        description: 'Your investment strategy partner',
        emoji: '💰',
        color: '#10b981'
      },
      [AgentType.CO_BUILDER]: {
        name: 'Co-Builder™',
        tier: AgentTier.CO_AGENT,
        description: 'Your ecosystem partnership strategist',
        emoji: '🏗️',
        color: '#f59e0b'
      },
      [AgentType.BUSINESS_ADVISOR]: {
        name: 'Business Advisor',
        tier: AgentTier.FUNCTIONAL,
        description: 'Expert in business strategy and operations',
        emoji: '📊',
        color: '#8b5cf6'
      },
      [AgentType.INVESTMENT_ANALYST]: {
        name: 'Investment Analyst',
        tier: AgentTier.FUNCTIONAL,
        description: 'Specialized in deal analysis and due diligence',
        emoji: '📈',
        color: '#06b6d4'
      },
      [AgentType.CREDIT_ANALYST]: {
        name: 'Credit Analyst',
        tier: AgentTier.FUNCTIONAL,
        description: 'Expert in credit assessment and risk analysis',
        emoji: '🏦',
        color: '#ef4444'
      },
      [AgentType.IMPACT_ANALYST]: {
        name: 'Impact Analyst',
        tier: AgentTier.FUNCTIONAL,
        description: 'Specialized in social and environmental impact',
        emoji: '🌱',
        color: '#22c55e'
      },
      [AgentType.PROGRAM_MANAGER]: {
        name: 'Program Manager',
        tier: AgentTier.FUNCTIONAL,
        description: 'Expert in program optimization and partnerships',
        emoji: '🎯',
        color: '#f97316'
      },
      [AgentType.PLATFORM_ORCHESTRATOR]: {
        name: 'Platform Orchestrator',
        tier: AgentTier.FUNCTIONAL,
        description: 'Cross-platform coordination and insights',
        emoji: '🎼',
        color: '#64748b'
      }
    };
    
    return metadata[agent] || {
      name: 'Unknown Agent',
      tier: AgentTier.FUNCTIONAL,
      description: 'Agent description not available',
      emoji: '🤖',
      color: '#6b7280'
    };
  }
}
