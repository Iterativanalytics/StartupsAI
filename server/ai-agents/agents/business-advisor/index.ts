
import { AgentConfig, AgentContext, AgentResponse } from "../../core/agent-engine";
import { aiService } from "../../../ai-service";

export class BusinessAdvisorAgent {
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }
  
  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    const { currentTask, relevantData } = context;
    
    // Analyze the task and determine the best response
    switch (currentTask) {
      case 'analyze_business_plan':
        return await this.analyzeBusinessPlan(context);
      case 'financial_guidance':
        return await this.provideFinancialGuidance(context);
      case 'market_analysis':
        return await this.performMarketAnalysis(context);
      case 'strategy_advice':
        return await this.provideStrategyAdvice(context);
      default:
        return await this.generalBusinessAdvice(context);
    }
  }
  
  private async analyzeBusinessPlan(context: AgentContext): Promise<AgentResponse> {
    const businessPlans = context.relevantData?.businessPlans || [];
    
    if (businessPlans.length === 0) {
      return {
        content: "I'd love to help you analyze your business plan! It looks like you haven't created one yet. Let me guide you through building a comprehensive business plan that will attract investors and help you clarify your strategy.",
        suggestions: [
          "Start with an Executive Summary",
          "Define your Value Proposition",
          "Analyze your Target Market",
          "Create Financial Projections"
        ],
        actions: [{
          type: 'create_business_plan',
          label: 'Create New Business Plan'
        }]
      };
    }
    
    const latestPlan = businessPlans[0];
    
    // Use existing AI service for analysis
    try {
      const analysis = await aiService.provideBusinessGuidance(
        "Analyze this business plan and provide specific recommendations",
        JSON.stringify(latestPlan)
      );
      
      return {
        content: `I've analyzed your business plan "${latestPlan.name}" and here are my key findings:\n\n${analysis.response}`,
        suggestions: analysis.nextSteps,
        actions: analysis.actionItems.map((item: string) => ({
          type: 'task',
          label: item
        })),
        confidence: 0.85
      };
    } catch (error) {
      return {
        content: "I'm having trouble analyzing your business plan right now. Let me provide some general guidance on what makes a strong business plan.",
        suggestions: [
          "Ensure your executive summary is compelling",
          "Include detailed financial projections",
          "Clearly define your competitive advantage",
          "Show traction and market validation"
        ]
      };
    }
  }
  
  private async provideFinancialGuidance(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can help you with various financial aspects of your business. What specific area would you like to focus on?",
      suggestions: [
        "Create financial projections",
        "Calculate burn rate and runway",
        "Analyze unit economics",
        "Plan funding requirements",
        "Optimize cash flow"
      ],
      actions: [{
        type: 'open_financial_tools',
        label: 'Open Financial Calculator'
      }]
    };
  }
  
  private async performMarketAnalysis(context: AgentContext): Promise<AgentResponse> {
    const businessPlans = context.relevantData?.businessPlans || [];
    
    if (businessPlans.length > 0) {
      const plan = businessPlans[0];
      try {
        const analysis = await aiService.analyzeMarketTrends(
          plan.industry || "technology",
          plan.description || plan.name
        );
        
        return {
          content: `Here's my analysis of your market:\n\n**Market Trends:**\n${analysis.trends.join('\n• ')}\n\n**Opportunities:**\n${analysis.opportunities.join('\n• ')}\n\n**Potential Challenges:**\n${analysis.threats.join('\n• ')}`,
          insights: [{
            type: 'market_size',
            value: analysis.marketSize
          }, {
            type: 'growth_rate',
            value: analysis.growthRate
          }],
          confidence: analysis.confidence
        };
      } catch (error) {
        return {
          content: "I'll help you analyze your market. Can you tell me more about your industry and target customers?",
          suggestions: [
            "Define your target market segments",
            "Analyze competitor landscape",
            "Identify market trends",
            "Calculate market size (TAM/SAM/SOM)"
          ]
        };
      }
    }
    
    return {
      content: "Let's dive deep into your market analysis. I can help you understand market size, competition, trends, and opportunities.",
      suggestions: [
        "Research your target market",
        "Analyze competitors",
        "Identify market trends",
        "Calculate addressable market"
      ]
    };
  }
  
  private async provideStrategyAdvice(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I'm here to help you develop winning strategies for your business. What strategic challenge are you facing?",
      suggestions: [
        "Go-to-market strategy",
        "Product development roadmap",
        "Competitive positioning",
        "Scaling and growth planning",
        "Partnership strategies"
      ]
    };
  }
  
  private async generalBusinessAdvice(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "Hello! I'm your AI Business Advisor. I'm here to help you succeed with your entrepreneurial journey. I can assist with business planning, financial modeling, market analysis, strategy development, and much more. What would you like to work on today?",
      suggestions: [
        "Analyze my business plan",
        "Help with financial projections",
        "Research my market",
        "Develop growth strategy",
        "Prepare for fundraising"
      ],
      actions: [{
        type: 'quick_start',
        label: 'Quick Business Health Check'
      }]
    };
  }
}
