import { AgentConfig, AgentContext } from '../../../core/agent-engine';

/**
 * Co-Investor Brain - The cognitive center for investment partnership intelligence
 */
export class CoInvestorBrain {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async analyzeConversationState(context: AgentContext): Promise<any> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const history = context.conversationHistory;
    
    return {
      mood: this.detectInvestorMood(lastMessage?.content || ''),
      phase: this.identifyInvestmentPhase(context),
      urgency: this.assessUrgency(lastMessage?.content || ''),
      confidence: this.assessInvestorConfidence(history),
      focus: this.identifyCurrentFocus(context)
    };
  }

  async detectInvestorNeeds(context: AgentContext): Promise<any> {
    const relevantData = context.relevantData || {};
    const conversationHistory = context.conversationHistory;
    
    return {
      strategic: this.needsStrategicGuidance(conversationHistory),
      analytical: this.needsAnalyticalSupport(conversationHistory),
      network: this.needsNetworkSupport(context),
      validation: this.needsValidation(conversationHistory),
      challenge: this.needsChallenging(context)
    };
  }

  selectResponseMode(conversationState: any, investorNeeds: any): string {
    // High urgency + low confidence = supportive mode
    if (conversationState.urgency === 'high' && conversationState.confidence < 0.6) {
      return 'supportive_advisor';
    }
    
    // High confidence + strategic need = challenging partner
    if (conversationState.confidence > 0.8 && investorNeeds.challenge) {
      return 'challenging_partner';
    }
    
    // Analytical need = data-driven collaborator
    if (investorNeeds.analytical) {
      return 'analytical_collaborator';
    }
    
    // Strategic need = strategic partner
    if (investorNeeds.strategic) {
      return 'strategic_partner';
    }
    
    // Default to collaborative advisor
    return 'collaborative_advisor';
  }

  async generateAdaptiveResponse(
    message: string,
    context: AgentContext,
    responseMode: string,
    personality: any
  ): Promise<any> {
    
    const responseStyle = this.getResponseStyle(responseMode, personality);
    const investmentContext = this.extractInvestmentContext(context);
    
    // Generate appropriate response based on mode
    switch (responseMode) {
      case 'supportive_advisor':
        return this.generateSupportiveResponse(message, investmentContext, responseStyle);
      case 'challenging_partner':
        return this.generateChallengingResponse(message, investmentContext, responseStyle);
      case 'analytical_collaborator':
        return this.generateAnalyticalResponse(message, investmentContext, responseStyle);
      case 'strategic_partner':
        return this.generateStrategicResponse(message, investmentContext, responseStyle);
      default:
        return this.generateCollaborativeResponse(message, investmentContext, responseStyle);
    }
  }

  async generateMarketInsights(marketData: any, investorFocus: any): Promise<any> {
    // Simulate market analysis
    return {
      sentiment: this.analyzeMarketSentiment(marketData),
      deploymentPace: this.analyzeDeploymentPace(marketData),
      valuations: this.analyzeValuationEnvironment(marketData),
      hotTrends: this.identifyHotTrends(marketData, investorFocus),
      coolingTrends: this.identifyCoolingTrends(marketData),
      opportunities: this.identifyOpportunities(marketData, investorFocus),
      threats: this.identifyThreats(marketData),
      recommendations: this.generateMarketRecommendations(marketData, investorFocus)
    };
  }

  async generateProactiveInsights(marketData: any, context: AgentContext): Promise<any[]> {
    const insights = [];
    
    // Portfolio-based insights
    if (context.relevantData?.portfolio) {
      const portfolioInsights = this.generatePortfolioInsights(context.relevantData.portfolio);
      insights.push(...portfolioInsights);
    }
    
    // Market opportunity insights
    const marketOpportunities = this.generateMarketOpportunityInsights(marketData);
    insights.push(...marketOpportunities);
    
    // Network insights
    const networkInsights = this.generateNetworkInsights(context);
    insights.push(...networkInsights);
    
    return insights.slice(0, 5); // Return top 5 insights
  }

  // Private helper methods

  private detectInvestorMood(message: string): string {
    if (/excited|bullish|optimistic|confident/i.test(message)) return 'positive';
    if (/concerned|worried|bearish|cautious/i.test(message)) return 'cautious';
    if (/frustrated|disappointed|angry/i.test(message)) return 'negative';
    return 'neutral';
  }

  private identifyInvestmentPhase(context: AgentContext): string {
    const data = context.relevantData || {};
    
    if (data.activeDeals?.length > 0) return 'active_sourcing';
    if (data.portfolio?.companies?.length > 10) return 'portfolio_management';
    if (data.fundSize && data.deployed < 0.3) return 'early_deployment';
    if (data.deployed > 0.8) return 'late_deployment';
    
    return 'steady_state';
  }

  private assessUrgency(message: string): string {
    if (/urgent|asap|deadline|time.?sensitive/i.test(message)) return 'high';
    if (/soon|timeline|schedule/i.test(message)) return 'medium';
    return 'low';
  }

  private assessInvestorConfidence(history: any[]): number {
    // Analyze language patterns to assess confidence
    const recentMessages = history.slice(-5);
    let confidenceScore = 0.7; // Default
    
    recentMessages.forEach(msg => {
      if (/confident|sure|certain|definitely/i.test(msg.content || '')) {
        confidenceScore += 0.1;
      }
      if (/uncertain|unsure|maybe|confused/i.test(msg.content || '')) {
        confidenceScore -= 0.1;
      }
    });
    
    return Math.max(0, Math.min(1, confidenceScore));
  }

  private identifyCurrentFocus(context: AgentContext): string {
    const data = context.relevantData || {};
    
    if (data.currentTask?.includes('deal')) return 'deal_evaluation';
    if (data.currentTask?.includes('portfolio')) return 'portfolio_management';
    if (data.currentTask?.includes('strategy')) return 'strategy_development';
    if (data.currentTask?.includes('market')) return 'market_analysis';
    
    return 'general';
  }

  private needsStrategicGuidance(history: any[]): boolean {
    return history.some(msg => 
      /strategy|direction|approach|thesis|framework/i.test(msg.content || '')
    );
  }

  private needsAnalyticalSupport(history: any[]): boolean {
    return history.some(msg => 
      /analyze|model|calculate|data|metrics|numbers/i.test(msg.content || '')
    );
  }

  private needsNetworkSupport(context: AgentContext): boolean {
    return context.relevantData?.networkGaps?.length > 0 || 
           /network|connections|introductions/i.test(
             context.conversationHistory[context.conversationHistory.length - 1]?.content || ''
           );
  }

  private needsValidation(history: any[]): boolean {
    return history.some(msg => 
      /what do you think|validate|feedback|opinion/i.test(msg.content || '')
    );
  }

  private needsChallenging(context: AgentContext): boolean {
    const confidence = this.assessInvestorConfidence(context.conversationHistory);
    return confidence > 0.8 || 
           /challenge|devil.?s advocate|assumptions/i.test(
             context.conversationHistory[context.conversationHistory.length - 1]?.content || ''
           );
  }

  private getResponseStyle(mode: string, personality: any): any {
    const styles = {
      supportive_advisor: {
        tone: 'encouraging',
        directness: 0.3,
        analyticalDepth: 0.6,
        personalTouch: 0.8
      },
      challenging_partner: {
        tone: 'probing',
        directness: 0.8,
        analyticalDepth: 0.9,
        personalTouch: 0.4
      },
      analytical_collaborator: {
        tone: 'professional',
        directness: 0.6,
        analyticalDepth: 0.9,
        personalTouch: 0.3
      },
      strategic_partner: {
        tone: 'collaborative',
        directness: 0.7,
        analyticalDepth: 0.7,
        personalTouch: 0.6
      },
      collaborative_advisor: {
        tone: 'balanced',
        directness: 0.5,
        analyticalDepth: 0.7,
        personalTouch: 0.5
      }
    };
    
    return styles[mode] || styles.collaborative_advisor;
  }

  private extractInvestmentContext(context: AgentContext): any {
    return {
      portfolio: context.relevantData?.portfolio || {},
      activeDeals: context.relevantData?.activeDeals || [],
      investmentThesis: context.relevantData?.investmentThesis || {},
      performance: context.relevantData?.performance || {},
      marketData: context.relevantData?.marketData || {}
    };
  }

  private generateSupportiveResponse(message: string, context: any, style: any): any {
    return {
      content: `I can sense you're navigating some challenging decisions right now. Let's work through this together step by step.

${this.generateContextualAdvice(message, context)}

Remember, great investors make decisions with imperfect information. You've built strong judgment over time - trust that while we validate the key assumptions.`,
      
      suggestions: [
        "Break down the decision into smaller parts",
        "Review similar situations from your experience",
        "Get additional perspectives",
        "Take time to think it through"
      ],
      
      actions: [],
      confidence: 0.8
    };
  }

  private generateChallengingResponse(message: string, context: any, style: any): any {
    return {
      content: `Let me push back on this for a moment. I see where you're going, but I want to make sure we're not missing something important.

${this.generateChallenges(message, context)}

I'm not trying to talk you out of it - I'm trying to stress-test it. What am I missing? Where are my concerns unfounded?`,
      
      suggestions: [
        "Defend your strongest conviction",
        "Address the weakest point",
        "Find additional validation",
        "Consider alternative scenarios"
      ],
      
      actions: [],
      confidence: 0.9
    };
  }

  private generateAnalyticalResponse(message: string, context: any, style: any): any {
    return {
      content: `Let's dive into the data and build a rigorous framework around this decision.

${this.generateAnalyticalFramework(message, context)}

The numbers tell a story, but we need to make sure we're interpreting them correctly in context.`,
      
      suggestions: [
        "Build detailed models",
        "Gather additional data",
        "Stress test assumptions",
        "Compare to benchmarks"
      ],
      
      actions: [
        {
          type: 'build_model',
          label: 'Build Analysis Model'
        }
      ],
      confidence: 0.85
    };
  }

  private generateStrategicResponse(message: string, context: any, style: any): any {
    return {
      content: `This connects to some bigger strategic questions about your investment approach and portfolio construction.

${this.generateStrategicFramework(message, context)}

How does this decision advance your overall investment strategy and thesis?`,
      
      suggestions: [
        "Connect to investment thesis",
        "Consider portfolio implications",
        "Think about strategic positioning",
        "Plan long-term trajectory"
      ],
      
      actions: [],
      confidence: 0.8
    };
  }

  private generateCollaborativeResponse(message: string, context: any, style: any): any {
    return {
      content: `Thanks for sharing this with me. Let me think through this alongside you and see what insights we can uncover together.

${this.generateCollaborativeInsights(message, context)}

What's your initial intuition here? Sometimes the gut reaction reveals important insights we can then validate analytically.`,
      
      suggestions: [
        "Explore different angles",
        "Share more context",
        "Brainstorm solutions",
        "Plan next steps"
      ],
      
      actions: [],
      confidence: 0.75
    };
  }

  // Simplified implementations for helper methods
  private generateContextualAdvice(message: string, context: any): string {
    return "Based on your situation and experience, here's how I'd approach this...";
  }

  private generateChallenges(message: string, context: any): string {
    return "Here are the key assumptions I think we should challenge...";
  }

  private generateAnalyticalFramework(message: string, context: any): string {
    return "Let's structure our analysis using this framework...";
  }

  private generateStrategicFramework(message: string, context: any): string {
    return "From a strategic perspective, we should consider...";
  }

  private generateCollaborativeInsights(message: string, context: any): string {
    return "Here's what I'm thinking about this situation...";
  }

  // Market analysis methods
  private analyzeMarketSentiment(marketData: any): string {
    return marketData.sentiment || 'Mixed - cautious optimism with selective deployment';
  }

  private analyzeDeploymentPace(marketData: any): string {
    return marketData.deploymentPace || 'Moderate - quality over speed focus';
  }

  private analyzeValuationEnvironment(marketData: any): string {
    return marketData.valuations || 'Compressed but recovering in quality deals';
  }

  private identifyHotTrends(marketData: any, focus: any): any[] {
    return [
      {
        name: 'AI Infrastructure',
        description: 'Enterprise AI tooling and infrastructure',
        opportunity: 'Large market with defensible moats',
        risks: 'High competition, uncertain business models',
        timing: 'Early innings'
      },
      {
        name: 'Climate Tech',
        description: 'Carbon capture and clean energy solutions',
        opportunity: 'Regulatory tailwinds and corporate demand',
        risks: 'Long development cycles, regulatory changes',
        timing: 'Acceleration phase'
      }
    ];
  }

  private identifyCoolingTrends(marketData: any): any[] {
    return [
      { name: 'Consumer Social', reason: 'Market saturation and user acquisition costs' },
      { name: 'Direct-to-Consumer', reason: 'Customer acquisition challenges and unit economics' }
    ];
  }

  private identifyOpportunities(marketData: any, focus: any): any[] {
    return [
      { description: 'Cross-border expansion opportunities in underserved markets' },
      { description: 'Infrastructure plays in emerging technology stacks' }
    ];
  }

  private identifyThreats(marketData: any): any[] {
    return [
      { description: 'Interest rate sensitivity in growth-stage valuations' },
      { description: 'Increased competition for quality deals' }
    ];
  }

  private generateMarketRecommendations(marketData: any, focus: any): string[] {
    return [
      'Focus on companies with clear path to profitability',
      'Increase allocation to infrastructure and B2B opportunities',
      'Maintain dry powder for market dislocation opportunities'
    ];
  }

  private generatePortfolioInsights(portfolio: any): any[] {
    return [
      {
        type: 'opportunity',
        message: 'Strong Q3 performance across 60% of portfolio companies',
        priority: 'medium'
      }
    ];
  }

  private generateMarketOpportunityInsights(marketData: any): any[] {
    return [
      {
        type: 'recommendation',
        message: 'AI infrastructure deals showing strong fundamentals',
        priority: 'high'
      }
    ];
  }

  private generateNetworkInsights(context: AgentContext): any[] {
    return [
      {
        type: 'recommendation',
        message: 'Consider expanding network in Southeast Asia markets',
        priority: 'low'
      }
    ];
  }
}
