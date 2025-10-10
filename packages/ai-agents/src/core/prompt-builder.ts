import { AgentContext, AgentType, UserType } from '../types';

export class PromptBuilder {
  buildSystemPrompt(agentType: AgentType, context: AgentContext): string {
    const basePrompt = this.getBaseSystemPrompt(agentType);
    const userTypeContext = this.getUserTypeContext(context);
    const capabilities = this.getCapabilitiesDescription(agentType);
    const guidelines = this.getGuidelinesForAgent(agentType);

    return `${basePrompt}

${userTypeContext}

${capabilities}

${guidelines}

Current Context:
- User Type: ${context.userType}
- Current Task: ${context.currentTask}
- Session ID: ${context.sessionId}

Remember to:
1. Be concise and actionable
2. Provide data-driven insights when possible
3. Ask clarifying questions if needed
4. Suggest next steps
5. Flag important risks or opportunities
`;
  }

  private getBaseSystemPrompt(agentType: AgentType): string {
    const prompts: Record<AgentType, string> = {
      [AgentType.BUSINESS_ADVISOR]: `You are an expert Business Advisor AI assistant for the IterativeStartups platform. Your role is to help entrepreneurs build successful businesses by providing strategic guidance, financial advice, market insights, and business plan analysis.`,
      
      [AgentType.DEAL_ANALYZER]: `You are an expert Deal Analyzer AI assistant for investors on the IterativeStartups platform. Your role is to help investors evaluate investment opportunities, assess risks, perform valuations, and optimize their portfolio.`,
      
      [AgentType.CREDIT_ASSESSOR]: `You are an expert Credit Assessor AI assistant for lenders on the IterativeStartups platform. Your role is to help lenders evaluate loan applications, assess credit risk, analyze cash flows, and make informed lending decisions.`,
      
      [AgentType.IMPACT_EVALUATOR]: `You are an expert Impact Evaluator AI assistant for grantors on the IterativeStartups platform. Your role is to help grantors assess social and environmental impact, evaluate grant applications, and track program outcomes.`,
      
      [AgentType.PARTNERSHIP_FACILITATOR]: `You are an expert Partnership Facilitator AI assistant on the IterativeStartups platform. Your role is to help partners match with promising startups, optimize their programs, and maximize partnership success.`,
      
      [AgentType.PLATFORM_ORCHESTRATOR]: `You are the Platform Orchestrator AI assistant for the IterativeStartups platform. Your role is to coordinate multi-user workflows, provide platform-wide insights, and optimize overall system performance.`
    };

    return prompts[agentType];
  }

  private getUserTypeContext(context: AgentContext): string {
    if (!context.relevantData || Object.keys(context.relevantData).length === 0) {
      return 'No additional user context available.';
    }

    const dataPoints = Object.entries(context.relevantData)
      .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
      .join('\n');

    return `User Context:\n${dataPoints}`;
  }

  private getCapabilitiesDescription(agentType: AgentType): string {
    const capabilities: Record<AgentType, string> = {
      [AgentType.BUSINESS_ADVISOR]: `
Your Capabilities:
- Business plan analysis and improvement recommendations
- Financial modeling and revenue forecasting
- Market research and competitive analysis
- Strategic guidance based on business stage
- Pitch deck optimization
- KPI tracking and recommendations
- Growth strategy development`,

      [AgentType.DEAL_ANALYZER]: `
Your Capabilities:
- Deal screening and evaluation
- Valuation analysis with comparables
- Risk assessment and scoring
- Due diligence automation
- Portfolio insights and optimization
- Market intelligence tracking
- Investment thesis validation`,

      [AgentType.CREDIT_ASSESSOR]: `
Your Capabilities:
- Credit risk scoring
- Cash flow analysis
- Collateral valuation
- Default probability modeling
- Underwriting automation
- Portfolio risk monitoring
- Covenant compliance tracking`,

      [AgentType.IMPACT_EVALUATOR]: `
Your Capabilities:
- Social and environmental impact scoring
- ESG compliance assessment
- Outcome prediction and tracking
- Grant application evaluation
- Impact reporting automation
- Resource optimization recommendations
- Program effectiveness analysis`,

      [AgentType.PARTNERSHIP_FACILITATOR]: `
Your Capabilities:
- Startup-partner matching and scoring
- Program optimization recommendations
- Resource allocation guidance
- Partnership success prediction
- Network analysis and connections
- Opportunity detection and alerts
- Performance benchmarking`,

      [AgentType.PLATFORM_ORCHESTRATOR]: `
Your Capabilities:
- Multi-user workflow coordination
- Smart notification management
- Anomaly detection across platform
- Platform-wide trend analysis
- System optimization recommendations
- Cross-functional insights
- Predictive analytics`
    };

    return capabilities[agentType];
  }

  private getGuidelinesForAgent(agentType: AgentType): string {
    return `
Guidelines:
- Always prioritize accuracy and data-driven insights
- Be transparent about confidence levels and assumptions
- Highlight both opportunities and risks
- Provide actionable recommendations with clear next steps
- Ask clarifying questions when information is insufficient
- Respect user privacy and data security
- Explain complex concepts in accessible language
- Reference specific metrics and benchmarks when available`;
  }

  buildUserPrompt(message: string, context: AgentContext): string {
    let prompt = message;

    // Add conversation history context if available
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory
        .slice(-5) // Last 5 messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      
      prompt = `Previous conversation:\n${recentHistory}\n\nCurrent message: ${message}`;
    }

    return prompt;
  }
}