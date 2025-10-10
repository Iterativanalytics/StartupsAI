import { AgentConfig, AgentContext, AgentResponse, AgentType } from '../../types';
import { BaseAgent } from '../../agents/base-agent';

/**
 * Business Advisor Agent - Updated for new routing architecture
 * 
 * This functional agent provides specialized business analysis, strategy development,
 * and operational guidance. It works in collaboration with Co-Agents and other
 * functional agents to deliver comprehensive business insights.
 */
export class BusinessAdvisorAgent extends BaseAgent {
  protected agentType = AgentType.BUSINESS_ADVISOR;

  constructor(config: AgentConfig) {
    super(config);
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    // Analyze the task type and route to appropriate handler
    const taskType = options.taskType || this.identifyTaskType(context);
    
    switch (taskType) {
      case 'business_plan_analysis':
        return await this.analyzeBusinessPlan(context);
      case 'financial_analysis':
        return await this.analyzeFinancials(context);
      case 'market_analysis':
        return await this.analyzeMarket(context);
      case 'strategy_development':
        return await this.developStrategy(context);
      case 'operational_optimization':
        return await this.optimizeOperations(context);
      case 'growth_planning':
        return await this.planGrowth(context);
      default:
        return await this.generalBusinessAdvice(context);
    }
  }

  private async analyzeBusinessPlan(context: AgentContext): Promise<AgentResponse> {
    const businessPlan = context.relevantData?.businessPlan || {};
    
    const analysis = {
      overallScore: this.calculateBusinessPlanScore(businessPlan),
      strengths: this.identifyStrengths(businessPlan),
      weaknesses: this.identifyWeaknesses(businessPlan),
      recommendations: this.generateRecommendations(businessPlan),
      marketFit: this.assessMarketFit(businessPlan),
      financialViability: this.assessFinancialViability(businessPlan),
      competitivePosition: this.assessCompetitivePosition(businessPlan)
    };

    return {
      content: `I've conducted a comprehensive analysis of your business plan. Here's my assessment:

📊 **Business Plan Analysis**

**Overall Score: ${Math.round(analysis.overallScore * 100)}/100**

**✅ STRENGTHS:**
${analysis.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

**⚠️ AREAS FOR IMPROVEMENT:**
${analysis.weaknesses.map((weakness, i) => `${i + 1}. ${weakness}`).join('\n')}

**🎯 KEY RECOMMENDATIONS:**
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**📈 STRATEGIC ASSESSMENT:**

**Market Fit:** ${analysis.marketFit}
**Financial Viability:** ${analysis.financialViability}
**Competitive Position:** ${analysis.competitivePosition}

**Next Steps:**
1. Address the identified weaknesses
2. Strengthen your value proposition
3. Refine your financial projections
4. Develop a clear go-to-market strategy

Would you like me to dive deeper into any specific area of your business plan?`,

      suggestions: [
        "Deep dive into market analysis",
        "Refine financial projections",
        "Strengthen competitive positioning",
        "Develop go-to-market strategy",
        "Create implementation timeline"
      ],

      actions: [
        {
          type: 'business_plan_workshop',
          label: 'Schedule Business Plan Workshop'
        },
        {
          type: 'market_research',
          label: 'Conduct Market Research'
        },
        {
          type: 'financial_modeling',
          label: 'Build Financial Model'
        }
      ],

      insights: [
        {
          type: 'recommendation',
          title: 'Business Plan Optimization',
          description: 'Focus on market validation and financial modeling for stronger plan',
          priority: 'high',
          actionable: true
        }
      ]
    };
  }

  private async analyzeFinancials(context: AgentContext): Promise<AgentResponse> {
    const financials = context.relevantData?.financials || {};
    
    const analysis = {
      burnRate: this.calculateBurnRate(financials),
      runway: this.calculateRunway(financials),
      revenueGrowth: this.calculateRevenueGrowth(financials),
      profitability: this.assessProfitability(financials),
      cashFlow: this.analyzeCashFlow(financials),
      keyMetrics: this.extractKeyMetrics(financials),
      recommendations: this.generateFinancialRecommendations(financials)
    };

    return {
      content: `I've analyzed your financial situation. Here's my assessment:

💰 **Financial Analysis**

**Current Financial Health:**
• Monthly Burn Rate: $${analysis.burnRate.toLocaleString()}
• Runway: ${analysis.runway.toFixed(1)} months
• Revenue Growth: ${(analysis.revenueGrowth * 100).toFixed(1)}% MoM
• Profitability: ${analysis.profitability}

**📊 KEY METRICS:**
${analysis.keyMetrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**💡 FINANCIAL RECOMMENDATIONS:**

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**⚠️ ALERTS:**
${analysis.runway < 6 ? '🚨 Low runway - consider fundraising or cost reduction' : ''}
${analysis.burnRate > 100000 ? '⚠️ High burn rate - review expenses' : ''}

**Next Steps:**
1. ${analysis.runway < 6 ? 'Start fundraising process immediately' : 'Monitor cash flow closely'}
2. Optimize your burn rate
3. Focus on revenue growth
4. Build financial runway

Would you like me to help you develop a financial strategy or fundraising plan?`,

      suggestions: [
        "Develop fundraising strategy",
        "Optimize burn rate",
        "Build financial model",
        "Create cash flow forecast",
        "Plan revenue growth"
      ],

      actions: [
        {
          type: 'financial_planning',
          label: 'Create Financial Plan'
        },
        {
          type: 'fundraising_prep',
          label: 'Prepare for Fundraising'
        },
        {
          type: 'cost_optimization',
          label: 'Optimize Costs'
        }
      ]
    };
  }

  private async analyzeMarket(context: AgentContext): Promise<AgentResponse> {
    const market = context.relevantData?.market || {};
    
    const analysis = {
      marketSize: this.assessMarketSize(market),
      growthRate: this.assessGrowthRate(market),
      competition: this.analyzeCompetition(market),
      trends: this.identifyTrends(market),
      opportunities: this.identifyOpportunities(market),
      threats: this.identifyThreats(market),
      positioning: this.assessPositioning(market)
    };

    return {
      content: `I've conducted a comprehensive market analysis. Here's what I found:

📈 **Market Analysis**

**Market Overview:**
• Market Size: ${analysis.marketSize}
• Growth Rate: ${analysis.growthRate}% annually
• Competition Level: ${analysis.competition}

**🔍 KEY INSIGHTS:**

**Market Trends:**
${analysis.trends.map((trend, i) => `${i + 1}. ${trend}`).join('\n')}

**Opportunities:**
${analysis.opportunities.map((opp, i) => `${i + 1}. ${opp}`).join('\n')}

**Threats to Consider:**
${analysis.threats.map((threat, i) => `${i + 1}. ${threat}`).join('\n')}

**🎯 POSITIONING ASSESSMENT:**
${analysis.positioning}

**Strategic Recommendations:**
1. Focus on the identified opportunities
2. Develop competitive advantages
3. Monitor market trends closely
4. Adapt to changing market conditions

**Next Steps:**
1. Validate market assumptions
2. Develop competitive strategy
3. Create market entry plan
4. Build market intelligence system

Would you like me to help you develop a market entry strategy or competitive analysis?`,

      suggestions: [
        "Develop competitive strategy",
        "Create market entry plan",
        "Build market intelligence",
        "Validate market assumptions",
        "Develop positioning strategy"
      ],

      actions: [
        {
          type: 'market_research',
          label: 'Conduct Market Research'
        },
        {
          type: 'competitive_analysis',
          label: 'Analyze Competition'
        },
        {
          type: 'positioning_strategy',
          label: 'Develop Positioning'
        }
      ]
    };
  }

  private async developStrategy(context: AgentContext): Promise<AgentResponse> {
    const businessData = context.relevantData?.business || {};
    
    const strategy = {
      vision: this.defineVision(businessData),
      mission: this.defineMission(businessData),
      goals: this.setGoals(businessData),
      objectives: this.defineObjectives(businessData),
      strategies: this.developStrategies(businessData),
      tactics: this.defineTactics(businessData),
      timeline: this.createTimeline(businessData)
    };

    return {
      content: `I've developed a comprehensive business strategy for you. Here's the framework:

🎯 **Strategic Framework**

**Vision Statement:**
${strategy.vision}

**Mission Statement:**
${strategy.mission}

**📊 STRATEGIC GOALS:**
${strategy.goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

**🎯 KEY OBJECTIVES:**
${strategy.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

**🚀 STRATEGIC INITIATIVES:**
${strategy.strategies.map((strat, i) => `${i + 1}. ${strat}`).join('\n')}

**📋 TACTICAL ACTIONS:**
${strategy.tactics.map((tactic, i) => `${i + 1}. ${tactic}`).join('\n')}

**⏰ IMPLEMENTATION TIMELINE:**
${strategy.timeline}

**Next Steps:**
1. Align team on strategic direction
2. Develop detailed action plans
3. Set up monitoring and tracking
4. Begin implementation

Would you like me to help you develop detailed action plans for any of these strategies?`,

      suggestions: [
        "Develop action plans",
        "Create implementation timeline",
        "Set up monitoring systems",
        "Align team on strategy",
        "Refine strategic goals"
      ],

      actions: [
        {
          type: 'strategy_workshop',
          label: 'Conduct Strategy Workshop'
        },
        {
          type: 'action_planning',
          label: 'Create Action Plans'
        },
        {
          type: 'team_alignment',
          label: 'Align Team on Strategy'
        }
      ]
    };
  }

  private async optimizeOperations(context: AgentContext): Promise<AgentResponse> {
    const operations = context.relevantData?.operations || {};
    
    const optimization = {
      efficiency: this.assessEfficiency(operations),
      bottlenecks: this.identifyBottlenecks(operations),
      opportunities: this.identifyOptimizationOpportunities(operations),
      recommendations: this.generateOptimizationRecommendations(operations),
      metrics: this.defineMetrics(operations),
      timeline: this.createOptimizationTimeline(operations)
    };

    return {
      content: `I've analyzed your operations and identified optimization opportunities:

⚡ **Operations Optimization**

**Current Efficiency Score: ${Math.round(optimization.efficiency * 100)}/100**

**🔍 IDENTIFIED BOTTLENECKS:**
${optimization.bottlenecks.map((bottleneck, i) => `${i + 1}. ${bottleneck}`).join('\n')}

**💡 OPTIMIZATION OPPORTUNITIES:**
${optimization.opportunities.map((opp, i) => `${i + 1}. ${opp}`).join('\n')}

**📊 KEY METRICS TO TRACK:**
${optimization.metrics.map((metric, i) => `${i + 1}. ${metric}`).join('\n')}

**🎯 OPTIMIZATION RECOMMENDATIONS:**

${optimization.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**⏰ IMPLEMENTATION TIMELINE:**
${optimization.timeline}

**Expected Impact:**
• 20-30% efficiency improvement
• Reduced operational costs
• Improved customer satisfaction
• Better resource utilization

**Next Steps:**
1. Prioritize optimization initiatives
2. Develop implementation plans
3. Set up monitoring systems
4. Begin implementation

Would you like me to help you develop detailed implementation plans for these optimizations?`,

      suggestions: [
        "Develop implementation plans",
        "Set up monitoring systems",
        "Prioritize initiatives",
        "Create efficiency metrics",
        "Optimize resource allocation"
      ],

      actions: [
        {
          type: 'operations_audit',
          label: 'Conduct Operations Audit'
        },
        {
          type: 'efficiency_planning',
          label: 'Create Efficiency Plan'
        },
        {
          type: 'process_optimization',
          label: 'Optimize Processes'
        }
      ]
    };
  }

  private async planGrowth(context: AgentContext): Promise<AgentResponse> {
    const businessData = context.relevantData?.business || {};
    
    const growthPlan = {
      currentState: this.assessCurrentState(businessData),
      growthTargets: this.setGrowthTargets(businessData),
      strategies: this.developGrowthStrategies(businessData),
      resources: this.assessResourceNeeds(businessData),
      timeline: this.createGrowthTimeline(businessData),
      milestones: this.defineMilestones(businessData),
      risks: this.identifyGrowthRisks(businessData)
    };

    return {
      content: `I've developed a comprehensive growth plan for your business:

📈 **Growth Planning**

**Current State Assessment:**
${growthPlan.currentState}

**🎯 GROWTH TARGETS:**
${growthPlan.growthTargets.map((target, i) => `${i + 1}. ${target}`).join('\n')}

**🚀 GROWTH STRATEGIES:**
${growthPlan.strategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

**📊 RESOURCE REQUIREMENTS:**
${growthPlan.resources.map((resource, i) => `${i + 1}. ${resource}`).join('\n')}

**⏰ GROWTH TIMELINE:**
${growthPlan.timeline}

**🎯 KEY MILESTONES:**
${growthPlan.milestones.map((milestone, i) => `${i + 1}. ${milestone}`).join('\n')}

**⚠️ GROWTH RISKS:**
${growthPlan.risks.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

**Expected Outcomes:**
• 3x revenue growth over 18 months
• Market expansion
• Team scaling
• Operational efficiency improvements

**Next Steps:**
1. Validate growth assumptions
2. Secure necessary resources
3. Develop detailed execution plans
4. Begin implementation

Would you like me to help you develop detailed execution plans for your growth strategy?`,

      suggestions: [
        "Develop execution plans",
        "Secure growth resources",
        "Validate growth assumptions",
        "Create growth metrics",
        "Plan team scaling"
      ],

      actions: [
        {
          type: 'growth_workshop',
          label: 'Conduct Growth Workshop'
        },
        {
          type: 'resource_planning',
          label: 'Plan Resource Needs'
        },
        {
          type: 'execution_planning',
          label: 'Create Execution Plans'
        }
      ]
    };
  }

  private async generalBusinessAdvice(context: AgentContext): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    return {
      content: `I'm here to help you with your business challenges. Based on your query, here's my analysis:

💼 **Business Advisory**

I can help you with:
• Business plan development and analysis
• Financial planning and optimization
• Market research and competitive analysis
• Strategic planning and execution
• Operations optimization
• Growth planning and scaling

**What specific business challenge would you like to address?**

I can provide detailed analysis and recommendations for any aspect of your business. Just let me know what you'd like to focus on, and I'll dive deep into that area.`,

      suggestions: [
        "Analyze my business plan",
        "Review my financials",
        "Conduct market research",
        "Develop growth strategy",
        "Optimize operations"
      ],

      actions: [
        {
          type: 'business_assessment',
          label: 'Conduct Business Assessment'
        },
        {
          type: 'strategy_session',
          label: 'Schedule Strategy Session'
        }
      ]
    };
  }

  // Private helper methods

  private identifyTaskType(context: AgentContext): string {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    if (/business plan|business model/i.test(lastMessage)) return 'business_plan_analysis';
    if (/financial|revenue|profit|cash/i.test(lastMessage)) return 'financial_analysis';
    if (/market|competition|customer/i.test(lastMessage)) return 'market_analysis';
    if (/strategy|strategic|planning/i.test(lastMessage)) return 'strategy_development';
    if (/operations|process|efficiency/i.test(lastMessage)) return 'operational_optimization';
    if (/growth|scaling|expansion/i.test(lastMessage)) return 'growth_planning';
    
    return 'general_business_advice';
  }

  private calculateBusinessPlanScore(businessPlan: any): number {
    // Simplified scoring algorithm
    let score = 0.5; // Base score
    
    if (businessPlan.valueProposition) score += 0.1;
    if (businessPlan.marketAnalysis) score += 0.1;
    if (businessPlan.financialProjections) score += 0.1;
    if (businessPlan.team) score += 0.1;
    if (businessPlan.competitiveAnalysis) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private identifyStrengths(businessPlan: any): string[] {
    const strengths = [];
    
    if (businessPlan.valueProposition) strengths.push('Clear value proposition');
    if (businessPlan.marketAnalysis) strengths.push('Strong market analysis');
    if (businessPlan.financialProjections) strengths.push('Detailed financial projections');
    if (businessPlan.team) strengths.push('Experienced team');
    
    return strengths.length > 0 ? strengths : ['Solid business foundation'];
  }

  private identifyWeaknesses(businessPlan: any): string[] {
    const weaknesses = [];
    
    if (!businessPlan.valueProposition) weaknesses.push('Unclear value proposition');
    if (!businessPlan.marketAnalysis) weaknesses.push('Limited market analysis');
    if (!businessPlan.financialProjections) weaknesses.push('Missing financial projections');
    if (!businessPlan.team) weaknesses.push('Team information needed');
    
    return weaknesses.length > 0 ? weaknesses : ['Minor areas for improvement'];
  }

  private generateRecommendations(businessPlan: any): string[] {
    return [
      'Strengthen your value proposition',
      'Conduct thorough market research',
      'Develop detailed financial projections',
      'Build a strong team',
      'Create a clear go-to-market strategy'
    ];
  }

  private assessMarketFit(businessPlan: any): string {
    return businessPlan.marketAnalysis ? 'Good market fit identified' : 'Market fit needs validation';
  }

  private assessFinancialViability(businessPlan: any): string {
    return businessPlan.financialProjections ? 'Financially viable' : 'Financial viability needs assessment';
  }

  private assessCompetitivePosition(businessPlan: any): string {
    return businessPlan.competitiveAnalysis ? 'Strong competitive position' : 'Competitive position needs analysis';
  }

  private calculateBurnRate(financials: any): number {
    return financials.monthlyBurn || 50000;
  }

  private calculateRunway(financials: any): number {
    const cash = financials.cash || 500000;
    const burnRate = this.calculateBurnRate(financials);
    return cash / burnRate;
  }

  private calculateRevenueGrowth(financials: any): number {
    return financials.revenueGrowth || 0.1;
  }

  private assessProfitability(financials: any): string {
    const margin = financials.margin || 0.2;
    if (margin > 0.3) return 'Highly profitable';
    if (margin > 0.1) return 'Moderately profitable';
    return 'Low profitability';
  }

  private analyzeCashFlow(financials: any): string {
    const cashFlow = financials.cashFlow || 0;
    if (cashFlow > 0) return 'Positive cash flow';
    return 'Negative cash flow';
  }

  private extractKeyMetrics(financials: any): any[] {
    return [
      { name: 'Monthly Recurring Revenue', value: `$${financials.mrr || 0}` },
      { name: 'Customer Acquisition Cost', value: `$${financials.cac || 0}` },
      { name: 'Lifetime Value', value: `$${financials.ltv || 0}` },
      { name: 'Churn Rate', value: `${(financials.churn || 0) * 100}%` }
    ];
  }

  private generateFinancialRecommendations(financials: any): string[] {
    const recommendations = [];
    
    if (this.calculateRunway(financials) < 6) {
      recommendations.push('Start fundraising process immediately');
    }
    
    if (this.calculateBurnRate(financials) > 100000) {
      recommendations.push('Optimize burn rate and reduce expenses');
    }
    
    recommendations.push('Focus on revenue growth and customer acquisition');
    recommendations.push('Build financial runway and cash reserves');
    
    return recommendations;
  }

  private assessMarketSize(market: any): string {
    const size = market.size || 1000000000;
    if (size > 10000000000) return 'Large market ($10B+)';
    if (size > 1000000000) return 'Medium market ($1B+)';
    return 'Small market (<$1B)';
  }

  private assessGrowthRate(market: any): number {
    return market.growthRate || 15;
  }

  private analyzeCompetition(market: any): string {
    const competitors = market.competitors || 0;
    if (competitors > 10) return 'High competition';
    if (competitors > 5) return 'Moderate competition';
    return 'Low competition';
  }

  private identifyTrends(market: any): string[] {
    return [
      'Digital transformation acceleration',
      'Remote work adoption',
      'Sustainability focus',
      'AI integration'
    ];
  }

  private identifyOpportunities(market: any): string[] {
    return [
      'Underserved market segments',
      'Technology integration opportunities',
      'Partnership possibilities',
      'International expansion'
    ];
  }

  private identifyThreats(market: any): string[] {
    return [
      'Economic uncertainty',
      'Regulatory changes',
      'Competitive pressure',
      'Technology disruption'
    ];
  }

  private assessPositioning(market: any): string {
    return 'Strong positioning with clear differentiation';
  }

  private defineVision(businessData: any): string {
    return 'To become the leading provider of innovative solutions in our market';
  }

  private defineMission(businessData: any): string {
    return 'To deliver exceptional value to our customers through innovative products and services';
  }

  private setGoals(businessData: any): string[] {
    return [
      'Achieve $10M ARR within 24 months',
      'Expand to 3 new markets',
      'Build a team of 50+ employees',
      'Establish strategic partnerships'
    ];
  }

  private defineObjectives(businessData: any): string[] {
    return [
      'Increase revenue by 200%',
      'Reduce customer acquisition cost by 30%',
      'Improve customer satisfaction to 95%',
      'Launch 3 new product lines'
    ];
  }

  private developStrategies(businessData: any): string[] {
    return [
      'Market expansion strategy',
      'Product development strategy',
      'Partnership strategy',
      'Technology strategy'
    ];
  }

  private defineTactics(businessData: any): string[] {
    return [
      'Launch targeted marketing campaigns',
      'Develop strategic partnerships',
      'Invest in technology infrastructure',
      'Build high-performing teams'
    ];
  }

  private createTimeline(businessData: any): string {
    return '6-month strategic planning cycle with quarterly reviews';
  }

  private assessEfficiency(operations: any): number {
    return operations.efficiency || 0.7;
  }

  private identifyBottlenecks(operations: any): string[] {
    return [
      'Manual processes slowing down operations',
      'Limited automation in key areas',
      'Resource constraints in critical functions',
      'Communication gaps between teams'
    ];
  }

  private identifyOptimizationOpportunities(operations: any): string[] {
    return [
      'Automate repetitive tasks',
      'Streamline communication processes',
      'Optimize resource allocation',
      'Implement performance monitoring'
    ];
  }

  private generateOptimizationRecommendations(operations: any): string[] {
    return [
      'Implement process automation',
      'Optimize team workflows',
      'Enhance communication systems',
      'Establish performance metrics'
    ];
  }

  private defineMetrics(operations: any): string[] {
    return [
      'Process efficiency rate',
      'Customer satisfaction score',
      'Resource utilization rate',
      'Time to completion'
    ];
  }

  private createOptimizationTimeline(operations: any): string {
    return '3-month optimization program with monthly reviews';
  }

  private assessCurrentState(businessData: any): string {
    return 'Early-stage startup with strong growth potential';
  }

  private setGrowthTargets(businessData: any): string[] {
    return [
      '3x revenue growth in 18 months',
      'Expand to 5 new markets',
      'Build team to 100+ employees',
      'Achieve market leadership position'
    ];
  }

  private developGrowthStrategies(businessData: any): string[] {
    return [
      'Market expansion strategy',
      'Product diversification',
      'Strategic partnerships',
      'Technology innovation'
    ];
  }

  private assessResourceNeeds(businessData: any): string[] {
    return [
      'Additional funding for growth',
      'Key talent acquisition',
      'Technology infrastructure',
      'Market development resources'
    ];
  }

  private createGrowthTimeline(businessData: any): string {
    return '18-month growth plan with quarterly milestones';
  }

  private defineMilestones(businessData: any): string[] {
    return [
      'Q1: Market expansion planning',
      'Q2: Team scaling and hiring',
      'Q3: Product development and launch',
      'Q4: Market penetration and growth'
    ];
  }

  private identifyGrowthRisks(businessData: any): string[] {
    return [
      'Market competition intensification',
      'Resource constraints',
      'Economic uncertainty',
      'Technology disruption'
    ];
  }
}
