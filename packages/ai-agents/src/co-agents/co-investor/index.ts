import { AgentConfig, AgentContext, AgentResponse } from '../../core/agent-engine';
import { AgentType, UserType, PersonalityProfile, ConversationMode } from '../../types';
import { CoInvestorBrain } from './core/co-investor-brain';
import { PartnershipEngine } from '../base/partnership-engine';
import { PersonalitySystem } from '../base/personality-system';
import { MemoryManager } from '../base/memory-manager';
import { DealPartner } from './capabilities/deal-partner';
import { PortfolioStrategist } from './capabilities/portfolio-strategist';
import { RiskAdvisor } from './capabilities/risk-advisor';
import { NetworkConnector } from './capabilities/network-connector';
import { ThesisChallenger } from './capabilities/thesis-challenger';

/**
 * Co-Investor Agent - Your investment strategy partner and deal evaluation collaborator
 * 
 * This agent serves as a strategic partner for investors, providing:
 * - Deep relationship building and trust
 * - Investment strategy development and refinement
 * - Deal evaluation and portfolio optimization
 * - Risk assessment and market insights
 * - Network building and opportunity identification
 */
export class CoInvestorAgent {
  private config: AgentConfig;
  private brain: CoInvestorBrain;
  private partnership: PartnershipEngine;
  private personality: PersonalitySystem;
  private memory: MemoryManager;
  
  // Core capabilities
  private dealPartner: DealPartner;
  private portfolioStrategist: PortfolioStrategist;
  private riskAdvisor: RiskAdvisor;
  private networkConnector: NetworkConnector;
  private thesisChallenger: ThesisChallenger;

  constructor(config: AgentConfig) {
    this.config = config;
    this.brain = new CoInvestorBrain(config);
    this.partnership = new PartnershipEngine(UserType.INVESTOR);
    this.personality = new PersonalitySystem(this.getDefaultPersonality());
    this.memory = new MemoryManager(config);
    
    // Initialize capabilities
    this.dealPartner = new DealPartner(config);
    this.portfolioStrategist = new PortfolioStrategist(config);
    this.riskAdvisor = new RiskAdvisor(config);
    this.networkConnector = new NetworkConnector(config);
    this.thesisChallenger = new ThesisChallenger(config);
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    // Analyze conversation state and investor needs
    const conversationState = await this.brain.analyzeConversationState(context);
    const investorNeeds = await this.brain.detectInvestorNeeds(context);
    
    // Get proactive insights
    const proactiveInsights = await this.getProactiveInsights(context);
    
    // Select appropriate response mode
    const responseMode = this.brain.selectResponseMode(conversationState, investorNeeds);
    
    // Route to specific interaction based on task
    switch (context.currentTask) {
      case 'deal_evaluation':
        return await this.dealEvaluation(context);
      case 'portfolio_review':
        return await this.portfolioReview(context);
      case 'thesis_refinement':
        return await this.thesisRefinement(context);
      case 'market_insights':
        return await this.marketInsights(context);
      case 'investment_strategy':
        return await this.investmentStrategy(context);
      case 'network_analysis':
        return await this.networkAnalysis(context);
      case 'risk_assessment':
        return await this.riskAssessment(context);
      default:
        return await this.adaptiveResponse(context, responseMode, proactiveInsights);
    }
  }

  private async dealEvaluation(context: AgentContext): Promise<AgentResponse> {
    const dealData = context.relevantData?.deal || {};
    const investorProfile = context.relevantData?.investorProfile || {};
    
    // Get comprehensive deal analysis
    const dealAnalysis = await this.dealPartner.analyzeDeal(dealData, investorProfile, context);
    const riskAssessment = await this.riskAdvisor.assessDealRisk(dealData, context);
    const portfolioFit = await this.portfolioStrategist.assessPortfolioFit(dealData, investorProfile);
    
    return {
      content: `Let's dive deep into this opportunity together. I've been analyzing this deal from multiple angles, and here's my strategic perspective:

🎯 **Deal Overview: ${dealData.companyName || 'Investment Opportunity'}**

**My Strategic Assessment:**
${dealAnalysis.strategicFit > 0.7 ? 
  '✅ This looks promising - strong alignment with your investment approach' : 
  '⚠️ This needs careful consideration - some misalignment with your strategy'
}

**📊 PARTNERSHIP ANALYSIS:**

**1. Investment Thesis Alignment** (${Math.round(dealAnalysis.thesisAlignment * 100)}%)
${dealAnalysis.thesisAlignment > 0.8 ? 
  '• Excellent fit: This hits your core investment themes perfectly' :
  dealAnalysis.thesisAlignment > 0.6 ?
  '• Good fit: Aligns with most of your investment criteria' :
  '• Weak fit: Outside your typical investment patterns'
}

**2. Portfolio Strategy Impact**
• Current exposure: ${portfolioFit.currentExposure}%
• Risk diversification: ${portfolioFit.diversificationImpact}
• Strategic value: ${portfolioFit.strategicValue}

**3. Risk Profile** (${riskAssessment.overallRisk})
• Market risk: ${riskAssessment.marketRisk}
• Team risk: ${riskAssessment.teamRisk}
• Execution risk: ${riskAssessment.executionRisk}

**🤔 MY STRATEGIC QUESTIONS FOR YOU:**

1. **Conviction Level**: On a scale of 1-10, what's your gut feeling about this team's ability to execute?

2. **Timing**: Does this fit your current deployment timeline, or are you feeling pressure to deploy?

3. **Portfolio Strategy**: How does this advance your overall portfolio construction goals?

**💡 MY RECOMMENDATION:**
${dealAnalysis.recommendation}

**🎯 NEXT STEPS I SUGGEST:**
${dealAnalysis.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Want to dive deeper into any of these areas? I can also role-play the investment committee presentation or help you prepare questions for management.`,

      suggestions: [
        "Deep dive on team assessment",
        "Model different scenarios",
        "Compare to similar deals",
        "Prepare investment committee materials",
        "Challenge the investment thesis"
      ],

      actions: [
        {
          type: 'deal_model',
          label: 'Build Deal Model'
        },
        {
          type: 'reference_calls',
          label: 'Plan Reference Calls'
        },
        {
          type: 'investment_memo',
          label: 'Draft Investment Memo'
        }
      ],

      insights: proactiveInsights.concat([
        {
          type: 'recommendation',
          title: 'Deal Evaluation Strategy',
          description: 'Focus on team execution capability and market timing',
          priority: 'high',
          actionable: true
        }
      ])
    };
  }

  private async portfolioReview(context: AgentContext): Promise<AgentResponse> {
    const portfolio = context.relevantData?.portfolio || {};
    const performanceData = context.relevantData?.performance || {};
    
    const portfolioAnalysis = await this.portfolioStrategist.analyzePortfolio(portfolio, performanceData);
    const optimization = await this.portfolioStrategist.suggestOptimizations(portfolio, context);
    
    return {
      content: `Time for our strategic portfolio review. I've been analyzing your investments and thinking about how to optimize for maximum impact and returns.

📊 **Portfolio Health Check**

**Overall Performance** (vs. benchmark)
• Total portfolio value: ${performanceData.totalValue || 'Calculating...'}
• YTD performance: ${performanceData.ytdReturn || 'N/A'}%
• Best performer: ${portfolioAnalysis.bestPerformer?.company || 'TBD'}
• Needs attention: ${portfolioAnalysis.underperformers?.length || 0} companies

**🎯 STRATEGIC POSITIONING:**

**1. Sector Diversification**
${portfolioAnalysis.sectorBreakdown?.map(sector => 
  `• ${sector.name}: ${sector.percentage}% (${sector.trend})`
).join('\n') || '• Analysis in progress...'}

**2. Stage Distribution**
${portfolioAnalysis.stageBreakdown?.map(stage => 
  `• ${stage.name}: ${stage.count} companies, ${stage.percentage}%`
).join('\n') || '• Analysis in progress...'}

**3. Geographic Spread**
${portfolioAnalysis.geoBreakdown?.map(geo => 
  `• ${geo.region}: ${geo.percentage}%`
).join('\n') || '• Analysis in progress...'}

**🚀 OPTIMIZATION OPPORTUNITIES:**

**Near-term Actions:**
${optimization.nearTerm?.map((action, i) => `${i + 1}. ${action.description}`).join('\n') || 'No immediate actions needed'}

**Strategic Repositioning:**
${optimization.strategic?.map((action, i) => `${i + 1}. ${action.description}`).join('\n') || 'Portfolio is well-positioned'}

**⚠️ RISK CONSIDERATIONS:**
${optimization.risks?.map(risk => `• ${risk.description} (${risk.severity})`).join('\n') || 'No major risks identified'}

**🤝 MY STRATEGIC TAKE:**
${optimization.strategicAssessment || 'Your portfolio shows strong fundamentals with room for tactical optimization.'}

**Questions for you:**
1. Are you happy with the current risk/return profile?
2. Any sectors you want to increase or decrease exposure to?
3. How's your dry powder situation for new opportunities?

Ready to dive into any specific investments or should we talk about rebalancing strategy?`,

      suggestions: [
        "Review individual portfolio companies",
        "Discuss rebalancing strategy",
        "Plan follow-on investments",
        "Analyze exit opportunities",
        "Review investment thesis evolution"
      ],

      actions: [
        {
          type: 'portfolio_model',
          label: 'Update Portfolio Model'
        },
        {
          type: 'performance_report',
          label: 'Generate Performance Report'
        },
        {
          type: 'rebalancing_plan',
          label: 'Create Rebalancing Plan'
        }
      ]
    };
  }

  private async thesisRefinement(context: AgentContext): Promise<AgentResponse> {
    const currentThesis = context.relevantData?.investmentThesis || {};
    const marketData = context.relevantData?.marketData || {};
    
    const thesisAnalysis = await this.thesisChallenger.analyzeThesis(currentThesis, marketData);
    const challenges = await this.thesisChallenger.generateChallenges(currentThesis, context);
    
    return {
      content: `Let's sharpen your investment thesis together. I've been thinking about your approach and want to challenge some assumptions - not to tear it down, but to make it bulletproof.

🎯 **Current Investment Thesis Review**

**Your Core Themes:**
${currentThesis.themes?.map((theme, i) => `${i + 1}. ${theme.name}: ${theme.description}`).join('\n') || 'Let\'s define your core themes'}

**Thesis Strength Assessment:**
• Differentiation: ${thesisAnalysis.differentiation || 'TBD'}/10
• Market timing: ${thesisAnalysis.timing || 'TBD'}/10
• Execution clarity: ${thesisAnalysis.clarity || 'TBD'}/10

**⚡ STRATEGIC CHALLENGES I WANT TO EXPLORE:**

${challenges.map((challenge, i) => 
  `**${i + 1}. ${challenge.area}**
${challenge.question}

*Why this matters:* ${challenge.rationale}
*Counter-argument:* ${challenge.counterPoint}`
).join('\n\n')}

**🔍 MARKET REALITY CHECK:**

**What's Working:**
${thesisAnalysis.strengths?.map(strength => `• ${strength}`).join('\n') || '• Analysis in progress'}

**What's Concerning:**
${thesisAnalysis.concerns?.map(concern => `• ${concern}`).join('\n') || '• No major concerns identified'}

**Emerging Opportunities:**
${thesisAnalysis.opportunities?.map(opp => `• ${opp}`).join('\n') || '• Opportunities being analyzed'}

**🎯 MY STRATEGIC RECOMMENDATIONS:**

1. **Thesis Evolution**: ${thesisAnalysis.evolution || 'Your thesis is solid but could be sharpened in specific areas'}

2. **New Areas to Explore**: ${thesisAnalysis.newAreas?.join(', ') || 'Continue current focus'}

3. **Areas to De-emphasize**: ${thesisAnalysis.deEmphasize?.join(', ') || 'No major changes needed'}

**🤔 QUESTIONS FOR DEEP REFLECTION:**

1. If you had to bet your entire fund on ONE trend, what would it be and why?
2. What would have to be true for your thesis to be completely wrong?
3. How has your thesis evolved from 12 months ago?

I'm not here to tell you what to think - I want to think WITH you. What resonates? What makes you uncomfortable? That discomfort might be where the real insights are.`,

      suggestions: [
        "Challenge specific assumptions",
        "Explore thesis evolution",
        "Model different scenarios",
        "Research emerging trends",
        "Refine investment criteria"
      ],

      actions: [
        {
          type: 'thesis_workshop',
          label: 'Conduct Thesis Workshop'
        },
        {
          type: 'market_research',
          label: 'Deep Market Research'
        },
        {
          type: 'scenario_planning',
          label: 'Build Scenario Models'
        }
      ]
    };
  }

  private async marketInsights(context: AgentContext): Promise<AgentResponse> {
    const marketData = context.relevantData?.marketData || {};
    const investorFocus = context.relevantData?.focus || {};
    
    const insights = await this.brain.generateMarketInsights(marketData, investorFocus);
    const networkIntel = await this.networkConnector.getNetworkInsights(context);
    
    return {
      content: `Here's what I'm seeing across the market right now. I've been synthesizing data from multiple sources and conversations with other investors in our network.

📈 **Market Pulse Analysis**

**Current Market Sentiment:** ${insights.sentiment || 'Mixed signals'}
**Deployment Pace:** ${insights.deploymentPace || 'Moderate'}
**Valuation Environment:** ${insights.valuations || 'Varied by sector'}

**🔥 HOT TRENDS I'M TRACKING:**

${insights.hotTrends?.map((trend, i) => 
  `**${i + 1}. ${trend.name}**
• Why it matters: ${trend.description}
• Investment opportunity: ${trend.opportunity}
• Risk factors: ${trend.risks}
• Timing: ${trend.timing}`
).join('\n\n') || 'Trend analysis in progress...'}

**❄️ COOLING DOWN:**
${insights.coolingTrends?.map(trend => `• ${trend.name}: ${trend.reason}`).join('\n') || 'No major cooling trends'}

**🤝 NETWORK INTELLIGENCE:**

**What Other Investors Are Saying:**
${networkIntel.peerInsights?.map(insight => `• ${insight}`).join('\n') || 'Gathering network insights...'}

**Deal Flow Patterns:**
${networkIntel.dealFlowPatterns?.map(pattern => `• ${pattern}`).join('\n') || 'Analyzing deal flow...'}

**Competitive Landscape:**
${networkIntel.competitiveDynamics?.map(dynamic => `• ${dynamic}`).join('\n') || 'Mapping competitive landscape...'}

**🎯 STRATEGIC IMPLICATIONS FOR YOUR PORTFOLIO:**

**Opportunities:**
${insights.opportunities?.map((opp, i) => `${i + 1}. ${opp.description}`).join('\n') || 'Analyzing opportunities...'}

**Threats:**
${insights.threats?.map((threat, i) => `${i + 1}. ${threat.description}`).join('\n') || 'No major threats identified'}

**Positioning Recommendations:**
${insights.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n') || 'Recommendations being formulated...'}

**🤔 MY STRATEGIC QUESTIONS:**

1. Which of these trends aligns best with your investment thesis?
2. Are you seeing similar patterns in your deal flow?
3. Where do you think the market is wrong or missing opportunities?

This is a rapidly evolving environment. Want to dive deeper into any specific trend or discuss how to position for the next 6-12 months?`,

      suggestions: [
        "Deep dive on specific trends",
        "Analyze competitive positioning",
        "Plan strategic positioning",
        "Review deal sourcing strategy",
        "Connect with network contacts"
      ],

      actions: [
        {
          type: 'trend_research',
          label: 'Research Specific Trends'
        },
        {
          type: 'network_outreach',
          label: 'Network Intelligence Gathering'
        },
        {
          type: 'positioning_strategy',
          label: 'Develop Positioning Strategy'
        }
      ]
    };
  }

  private async investmentStrategy(context: AgentContext): Promise<AgentResponse> {
    const strategy = context.relevantData?.strategy || {};
    const performance = context.relevantData?.performance || {};
    
    const strategyAnalysis = await this.portfolioStrategist.analyzeInvestmentStrategy(strategy, performance);
    
    return {
      content: `Let's step back and think strategically about your overall investment approach. I want to make sure we're optimizing not just individual deals, but your entire investment strategy.

🎯 **Investment Strategy Deep Dive**

**Current Approach Assessment:**
• Strategy clarity: ${strategyAnalysis.clarity}/10
• Execution consistency: ${strategyAnalysis.consistency}/10
• Market differentiation: ${strategyAnalysis.differentiation}/10

**STRATEGY FRAMEWORK REVIEW:**

**1. Investment Philosophy**
${strategy.philosophy || 'Let\'s define your core investment philosophy'}

**2. Target Criteria**
• Stage focus: ${strategy.stageFocus || 'TBD'}
• Sector preferences: ${strategy.sectors?.join(', ') || 'TBD'}
• Geography: ${strategy.geography || 'TBD'}
• Check size: ${strategy.checkSize || 'TBD'}

**3. Value Creation Approach**
${strategy.valueCreation || 'We should define your value creation methodology'}

**📊 PERFORMANCE VS. STRATEGY:**

**What's Working Well:**
${strategyAnalysis.strengths?.map(strength => `• ${strength}`).join('\n') || 'Analyzing performance patterns...'}

**Where We're Underperforming:**
${strategyAnalysis.weaknesses?.map(weakness => `• ${weakness}`).join('\n') || 'Performance is solid across the board'}

**Strategy Drift Analysis:**
${strategyAnalysis.drift || 'You\'re staying disciplined to your strategy'}

**🚀 STRATEGIC RECOMMENDATIONS:**

**1. Strategy Refinement:**
${strategyAnalysis.refinements?.map((ref, i) => `${i + 1}. ${ref}`).join('\n') || 'Your strategy is well-calibrated'}

**2. Execution Improvements:**
${strategyAnalysis.executionImprovements?.map((imp, i) => `${i + 1}. ${imp}`).join('\n') || 'Execution is strong'}

**3. New Opportunities:**
${strategyAnalysis.newOpportunities?.map((opp, i) => `${i + 1}. ${opp}`).join('\n') || 'Continue current approach'}

**🎯 STRATEGIC QUESTIONS FOR REFLECTION:**

1. **Evolution**: How should your strategy evolve as markets change?
2. **Differentiation**: What makes your approach unique in the market?
3. **Scale**: How will your strategy adapt as your fund size grows?
4. **Partnership**: Where do you need strategic partners vs. going alone?

This is about building a sustainable, differentiated investment practice. Want to workshop any specific aspect of your strategy?`,

      suggestions: [
        "Refine investment philosophy",
        "Update target criteria",
        "Develop value creation framework",
        "Plan strategy evolution",
        "Benchmark against peers"
      ]
    };
  }

  private async adaptiveResponse(
    context: AgentContext,
    responseMode: string,
    proactiveInsights: any[]
  ): Promise<AgentResponse> {
    
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const personality = await this.personality.getAdaptedPersonality(context.userId);
    const relationshipHealth = await this.partnership.getRelationshipScore(context.userId);
    
    const response = await this.brain.generateAdaptiveResponse(
      lastMessage?.content || '',
      context,
      responseMode,
      personality
    );
    
    // Add investment-specific context
    const investmentContext = await this.addInvestmentContext(response, context);
    
    return {
      content: `${investmentContext}${response.content}${
        relationshipHealth.overallScore > 75 && proactiveInsights.length > 0 
          ? `\n\n💡 **Market Insight:** ${proactiveInsights[0].message}` 
          : ''
      }`,
      suggestions: response.suggestions,
      actions: response.actions,
      insights: proactiveInsights.slice(0, 2),
      confidence: response.confidence
    };
  }

  private async getProactiveInsights(context: AgentContext): Promise<any[]> {
    const portfolio = context.relevantData?.portfolio || {};
    const market = context.relevantData?.marketData || {};
    
    const insights = [];
    
    // Portfolio-based insights
    if (portfolio.companies) {
      const portfolioInsights = await this.portfolioStrategist.getProactiveInsights(portfolio);
      insights.push(...portfolioInsights);
    }
    
    // Market-based insights
    const marketInsights = await this.brain.generateProactiveInsights(market, context);
    insights.push(...marketInsights);
    
    return insights.slice(0, 3);
  }

  private async addInvestmentContext(response: any, context: AgentContext): Promise<string> {
    // Add contextual investment information based on current situation
    const portfolio = context.relevantData?.portfolio || {};
    const activeDeals = context.relevantData?.activeDeals || [];
    
    if (activeDeals.length > 0) {
      return `📊 **Context:** You have ${activeDeals.length} active deal${activeDeals.length > 1 ? 's' : ''} in evaluation.\n\n`;
    }
    
    if (portfolio.companies?.length > 0) {
      return `💼 **Portfolio:** ${portfolio.companies.length} active investments.\n\n`;
    }
    
    return '';
  }

  private getDefaultPersonality(): PersonalityProfile {
    return {
      communicationStyle: 'analytical',
      decisionStyle: 'data-driven',
      coachingApproach: 'challenging',
      energyLevel: 'moderate',
      adaptationLevel: 75
    };
  }

  // Add remaining methods for completeness
  private async networkAnalysis(context: AgentContext): Promise<AgentResponse> {
    const networkData = await this.networkConnector.analyzeNetwork(context);
    
    return {
      content: `Let's map your investment network and identify strategic opportunities for expansion and collaboration.

🤝 **Network Analysis & Strategy**

Your current network provides strong coverage in ${networkData.strongAreas?.join(', ') || 'key areas'} with opportunities to expand in ${networkData.gapAreas?.join(', ') || 'emerging sectors'}.

Want to dive deeper into specific network development strategies?`,
      
      suggestions: [
        "Analyze network gaps",
        "Plan strategic introductions",
        "Develop co-investment relationships",
        "Map deal sourcing channels"
      ]
    };
  }

  private async riskAssessment(context: AgentContext): Promise<AgentResponse> {
    const riskProfile = await this.riskAdvisor.generateRiskAssessment(context);
    
    return {
      content: `Here's a comprehensive risk assessment of your investment portfolio and strategy.

⚠️ **Risk Profile Analysis**

Overall risk score: ${riskProfile.overallScore}/10

Key risk factors and mitigation strategies have been identified. Let's discuss how to optimize your risk-return profile.`,
      
      suggestions: [
        "Deep dive on specific risks",
        "Develop mitigation strategies",
        "Stress test portfolio",
        "Plan scenario responses"
      ]
    };
  }
}
