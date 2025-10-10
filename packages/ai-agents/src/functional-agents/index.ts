import { BusinessAdvisorAgent } from './business-advisor';
import { InvestmentAnalystAgent } from './investment-analyst';
import { CreditAnalystAgent } from './credit-analyst';
import { ImpactAnalystAgent } from './impact-analyst';
import { ProgramManagerAgent } from './program-manager';
import { PlatformOrchestratorAgent } from './platform-orchestrator';
import { AgentConfig, AgentContext, AgentResponse, AgentType } from '../types';

/**
 * Functional Agents Factory
 * 
 * This factory creates and manages functional agents based on the new routing architecture.
 * Each functional agent provides specialized expertise and works in collaboration with
 * Co-Agents and other functional agents.
 */
export class FunctionalAgentsFactory {
  private agents: Map<AgentType, any> = new Map();

  constructor(config: AgentConfig) {
    this.initializeAgents(config);
  }

  private initializeAgents(config: AgentConfig): void {
    this.agents.set(AgentType.BUSINESS_ADVISOR, new BusinessAdvisorAgent(config));
    this.agents.set(AgentType.INVESTMENT_ANALYST, new InvestmentAnalystAgent(config));
    this.agents.set(AgentType.CREDIT_ANALYST, new CreditAnalystAgent(config));
    this.agents.set(AgentType.IMPACT_ANALYST, new ImpactAnalystAgent(config));
    this.agents.set(AgentType.PROGRAM_MANAGER, new ProgramManagerAgent(config));
    this.agents.set(AgentType.PLATFORM_ORCHESTRATOR, new PlatformOrchestratorAgent(config));
  }

  /**
   * Execute a functional agent
   */
  async executeAgent(
    agentType: AgentType,
    context: AgentContext,
    options: any = {}
  ): Promise<AgentResponse> {
    const agent = this.agents.get(agentType);
    
    if (!agent) {
      throw new Error(`Functional agent ${agentType} not found`);
    }

    return await agent.execute(context, options);
  }

  /**
   * Get available functional agents
   */
  getAvailableAgents(): AgentType[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Check if an agent is available
   */
  isAgentAvailable(agentType: AgentType): boolean {
    return this.agents.has(agentType);
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentType: AgentType): string[] {
    const capabilities = {
      [AgentType.BUSINESS_ADVISOR]: [
        'Business plan analysis',
        'Financial analysis',
        'Market analysis',
        'Strategy development',
        'Operational optimization',
        'Growth planning'
      ],
      [AgentType.INVESTMENT_ANALYST]: [
        'Deal analysis',
        'Portfolio analysis',
        'Risk assessment',
        'Market analysis',
        'Valuation analysis',
        'Due diligence'
      ],
      [AgentType.CREDIT_ANALYST]: [
        'Credit assessment',
        'Risk analysis',
        'Loan underwriting',
        'Financial analysis',
        'Collateral analysis',
        'Compliance review'
      ],
      [AgentType.IMPACT_ANALYST]: [
        'Impact assessment',
        'Social impact analysis',
        'Environmental impact analysis',
        'Sustainability analysis',
        'Impact measurement',
        'Impact reporting'
      ],
      [AgentType.PROGRAM_MANAGER]: [
        'Program analysis',
        'Program optimization',
        'Resource management',
        'Stakeholder coordination',
        'Performance monitoring',
        'Program planning'
      ],
      [AgentType.PLATFORM_ORCHESTRATOR]: [
        'Platform analysis',
        'Ecosystem coordination',
        'System integration',
        'Platform optimization',
        'Stakeholder management',
        'Platform governance'
      ]
    };

    return capabilities[agentType] || [];
  }

  /**
   * Get agent description
   */
  getAgentDescription(agentType: AgentType): string {
    const descriptions = {
      [AgentType.BUSINESS_ADVISOR]: 'Specialized business analysis, strategy development, and operational guidance',
      [AgentType.INVESTMENT_ANALYST]: 'Investment analysis, deal evaluation, portfolio management, and risk assessment',
      [AgentType.CREDIT_ANALYST]: 'Credit analysis, risk assessment, loan underwriting, and financial evaluation',
      [AgentType.IMPACT_ANALYST]: 'Impact analysis, social impact assessment, and sustainability evaluation',
      [AgentType.PROGRAM_MANAGER]: 'Program management, optimization, and coordination support',
      [AgentType.PLATFORM_ORCHESTRATOR]: 'Platform orchestration, system coordination, and ecosystem management'
    };

    return descriptions[agentType] || 'Specialized functional agent';
  }

  /**
   * Get agent expertise areas
   */
  getAgentExpertise(agentType: AgentType): string[] {
    const expertise = {
      [AgentType.BUSINESS_ADVISOR]: [
        'Business Strategy',
        'Financial Analysis',
        'Market Research',
        'Operations Management',
        'Growth Planning'
      ],
      [AgentType.INVESTMENT_ANALYST]: [
        'Investment Analysis',
        'Portfolio Management',
        'Risk Assessment',
        'Market Analysis',
        'Valuation'
      ],
      [AgentType.CREDIT_ANALYST]: [
        'Credit Analysis',
        'Risk Assessment',
        'Loan Underwriting',
        'Financial Analysis',
        'Compliance'
      ],
      [AgentType.IMPACT_ANALYST]: [
        'Impact Assessment',
        'Social Impact',
        'Environmental Impact',
        'Sustainability',
        'Impact Measurement'
      ],
      [AgentType.PROGRAM_MANAGER]: [
        'Program Management',
        'Resource Management',
        'Stakeholder Coordination',
        'Performance Monitoring',
        'Program Planning'
      ],
      [AgentType.PLATFORM_ORCHESTRATOR]: [
        'Platform Management',
        'Ecosystem Coordination',
        'System Integration',
        'Platform Optimization',
        'Governance'
      ]
    };

    return expertise[agentType] || [];
  }
}

// Export individual agents for direct use
export {
  BusinessAdvisorAgent,
  InvestmentAnalystAgent,
  CreditAnalystAgent,
  ImpactAnalystAgent,
  ProgramManagerAgent,
  PlatformOrchestratorAgent
};
