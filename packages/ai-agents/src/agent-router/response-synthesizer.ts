import { AgentType, AgentResponse, MultiAgentResponse, Insight, AgentTier } from '../types';

/**
 * Response Synthesizer - Combines responses from multiple agents into a coherent experience
 */
export class ResponseSynthesizer {

  /**
   * Synthesize responses from multiple agents into a unified response
   */
  async synthesizeMultiAgentResponse(
    primaryResponse: AgentResponse,
    contributingResponses: AgentResponse[] = [],
    collaborationContext?: any
  ): Promise<MultiAgentResponse> {
    
    const synthesizedInsights = this.mergeInsights([
      ...(primaryResponse.insights || []),
      ...contributingResponses.flatMap(r => r.insights || [])
    ]);

    const collaborationMetadata = {
      primaryAgent: primaryResponse.agentType,
      contributingAgents: contributingResponses.map(r => r.agentType),
      synthesisMethod: this.determineSynthesisMethod(primaryResponse, contributingResponses),
      confidenceScore: this.calculateOverallConfidence(primaryResponse, contributingResponses),
      timestamp: new Date()
    };

    // If we have contributing responses, create a synthesized content
    let synthesizedContent = primaryResponse.content;
    
    if (contributingResponses.length > 0) {
      synthesizedContent = await this.createSynthesizedContent(
        primaryResponse,
        contributingResponses,
        collaborationContext
      );
    }

    return {
      primaryResponse: {
        ...primaryResponse,
        content: synthesizedContent,
        insights: synthesizedInsights
      },
      contributingAgents: contributingResponses.map(r => r.agentType),
      synthesizedInsights,
      collaborationMetadata
    };
  }

  /**
   * Handle handoff from functional agent back to co-agent
   */
  async synthesizeHandoffResponse(
    functionalAgentResponse: AgentResponse,
    coAgentType: AgentType,
    originalQuery: string,
    userContext: any
  ): Promise<AgentResponse> {
    
    const coAgentPersonality = this.getCoAgentPersonality(coAgentType);
    const synthesizedContent = await this.translateToCoAgentVoice(
      functionalAgentResponse,
      coAgentPersonality,
      originalQuery,
      userContext
    );

    return {
      id: this.generateResponseId(),
      content: synthesizedContent,
      agentType: coAgentType,
      timestamp: new Date(),
      suggestions: this.generateCoAgentSuggestions(functionalAgentResponse, coAgentType),
      actions: this.adaptActionsForCoAgent(functionalAgentResponse.actions || [], coAgentType),
      insights: this.transformInsightsForCoAgent(functionalAgentResponse.insights || []),
      metadata: {
        synthesizedFrom: functionalAgentResponse.agentType,
        originalResponse: functionalAgentResponse.id,
        synthesisType: 'functional_to_coagent'
      }
    };
  }

  /**
   * Create a collaborative brainstorming response
   */
  async synthesizeBrainstormingResponse(
    coAgentResponse: AgentResponse,
    functionalAgentInputs: AgentResponse[],
    brainstormTopic: string
  ): Promise<AgentResponse> {
    
    const ideas = this.extractIdeas(coAgentResponse, functionalAgentInputs);
    const analysis = this.extractAnalysis(functionalAgentInputs);
    
    const synthesizedContent = `🚀 **Collaborative Brainstorm: ${brainstormTopic}**

I've been thinking about this with our team of specialists, and here's what we've come up with together:

${coAgentResponse.content}

**💡 Additional Perspectives from Our Specialists:**

${functionalAgentInputs.map((response, index) => {
  const agentName = this.getAgentDisplayName(response.agentType);
  return `**${agentName} Perspective:**
${this.extractKeyPoints(response.content).join('\n• ')}`;
}).join('\n\n')}

**🎯 Synthesized Recommendations:**

${this.createSynthesizedRecommendations(ideas, analysis)}

Want to dive deeper into any of these directions? Or should we explore something completely different?`;

    return {
      ...coAgentResponse,
      content: synthesizedContent,
      insights: this.mergeInsights([
        ...(coAgentResponse.insights || []),
        ...functionalAgentInputs.flatMap(r => r.insights || [])
      ]),
      metadata: {
        ...coAgentResponse.metadata,
        collaborationType: 'brainstorming',
        contributingAgents: functionalAgentInputs.map(r => r.agentType)
      }
    };
  }

  /**
   * Handle decision support with multiple perspectives
   */
  async synthesizeDecisionSupport(
    coAgentAnalysis: AgentResponse,
    analyticalInputs: AgentResponse[],
    decisionContext: any
  ): Promise<AgentResponse> {
    
    const perspectives = this.extractPerspectives(analyticalInputs);
    const riskAssessment = this.synthesizeRiskAssessment(analyticalInputs);
    const recommendations = this.synthesizeRecommendations(analyticalInputs);
    
    const synthesizedContent = `🎯 **Decision Support: Multi-Perspective Analysis**

${coAgentAnalysis.content}

**📊 Data-Driven Insights:**

${perspectives.map((perspective, index) => 
  `**${perspective.source}:**
${perspective.keyFindings.join('\n• ')}`
).join('\n\n')}

**⚠️ Risk Assessment:**
${riskAssessment.risks.map(risk => `• **${risk.type}**: ${risk.description} (${risk.probability})`).join('\n')}

**💡 Synthesized Recommendation:**

${recommendations.primary}

**Alternative Approaches:**
${recommendations.alternatives.map((alt, i) => `${i + 1}. ${alt}`).join('\n')}

My take: ${this.generateCoAgentTake(coAgentAnalysis.agentType, perspectives, riskAssessment)}

What's your gut telling you about this direction?`;

    return {
      ...coAgentAnalysis,
      content: synthesizedContent,
      insights: this.prioritizeInsights([
        ...(coAgentAnalysis.insights || []),
        ...analyticalInputs.flatMap(r => r.insights || [])
      ])
    };
  }

  // Private helper methods

  private mergeInsights(insights: Insight[]): Insight[] {
    // Remove duplicates and prioritize
    const uniqueInsights = insights.reduce((acc, insight) => {
      const existing = acc.find(i => i.title === insight.title);
      if (!existing) {
        acc.push(insight);
      } else if (insight.priority === 'high' && existing.priority !== 'high') {
        // Replace with higher priority
        const index = acc.indexOf(existing);
        acc[index] = insight;
      }
      return acc;
    }, [] as Insight[]);

    // Sort by priority
    return uniqueInsights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 5); // Limit to top 5
  }

  private determineSynthesisMethod(
    primary: AgentResponse, 
    contributing: AgentResponse[]
  ): string {
    if (contributing.length === 0) return 'single_agent';
    
    const hasCoAgent = this.isCoAgent(primary.agentType);
    const hasFunctionalAgents = contributing.some(r => this.isFunctionalAgent(r.agentType));
    
    if (hasCoAgent && hasFunctionalAgents) return 'coagent_with_functional';
    if (contributing.length > 1) return 'multi_functional';
    return 'collaborative';
  }

  private calculateOverallConfidence(
    primary: AgentResponse,
    contributing: AgentResponse[]
  ): number {
    const primaryConfidence = (primary.metadata as any)?.confidence || 0.8;
    const contributingConfidences = contributing.map(r => (r.metadata as any)?.confidence || 0.7);
    
    if (contributingConfidences.length === 0) return primaryConfidence;
    
    const avgContributing = contributingConfidences.reduce((a, b) => a + b, 0) / contributingConfidences.length;
    return (primaryConfidence * 0.6) + (avgContributing * 0.4); // Weight primary more heavily
  }

  private async createSynthesizedContent(
    primary: AgentResponse,
    contributing: AgentResponse[],
    context?: any
  ): Promise<string> {
    
    const primaryIsCoAgent = this.isCoAgent(primary.agentType);
    
    if (primaryIsCoAgent) {
      // Co-Agent with functional agent support
      return this.synthesizeCoAgentWithSupport(primary, contributing);
    } else {
      // Functional agent collaboration
      return this.synthesizeFunctionalCollaboration(primary, contributing);
    }
  }

  private synthesizeCoAgentWithSupport(
    coAgentResponse: AgentResponse,
    functionalInputs: AgentResponse[]
  ): string {
    const supportingData = functionalInputs.map(input => ({
      agent: this.getAgentDisplayName(input.agentType),
      keyPoints: this.extractKeyPoints(input.content)
    }));

    return `${coAgentResponse.content}

**💡 Additional Analysis from Our Team:**

${supportingData.map(data => 
  `**${data.agent}:**
${data.keyPoints.slice(0, 3).map(point => `• ${point}`).join('\n')}`
).join('\n\n')}

Based on this combined perspective, here's what I'm thinking...`;
  }

  private synthesizeFunctionalCollaboration(
    primary: AgentResponse,
    contributing: AgentResponse[]
  ): string {
    return `**Primary Analysis:**
${primary.content}

**Additional Perspectives:**
${contributing.map(response => 
  `**${this.getAgentDisplayName(response.agentType)}:**
${this.extractKeyPoints(response.content).slice(0, 2).join('\n• ')}`
).join('\n\n')}

**Synthesized Recommendation:**
${this.createCombinedRecommendation(primary, contributing)}`;
  }

  private async translateToCoAgentVoice(
    functionalResponse: AgentResponse,
    personality: any,
    originalQuery: string,
    userContext: any
  ): Promise<string> {
    
    const functionalData = this.extractStructuredData(functionalResponse);
    const coAgentIntro = this.generateCoAgentIntro(personality, originalQuery);
    const personalizedContext = this.addPersonalizedContext(functionalData, userContext);
    
    return `${coAgentIntro}

${personalizedContext}

${functionalResponse.content}

**My Take:**
${this.generateCoAgentPerspective(functionalData, personality)}

What resonates with you? Want to dig deeper into any of this?`;
  }

  private getCoAgentPersonality(agentType: AgentType): any {
    const personalities = {
      [AgentType.CO_FOUNDER]: {
        style: 'supportive_challenger',
        tone: 'collaborative',
        approach: 'strategic_partnership'
      },
      [AgentType.CO_INVESTOR]: {
        style: 'analytical_advisor',
        tone: 'professional_friendly',
        approach: 'data_driven_guidance'
      },
      [AgentType.CO_BUILDER]: {
        style: 'ecosystem_connector',
        tone: 'energetic_optimistic',
        approach: 'partnership_focused'
      }
    };
    
    return personalities[agentType] || personalities[AgentType.CO_FOUNDER];
  }

  private generateCoAgentSuggestions(
    functionalResponse: AgentResponse,
    coAgentType: AgentType
  ): string[] {
    const baseSuggestions = functionalResponse.suggestions || [];
    const coAgentSuggestions = [
      'Dive deeper into this analysis',
      'Challenge these assumptions',
      'Explore alternative approaches',
      'Plan next steps together'
    ];
    
    return [...baseSuggestions.slice(0, 2), ...coAgentSuggestions.slice(0, 2)];
  }

  private extractKeyPoints(content: string): string[] {
    // Simple extraction - would be more sophisticated in production
    const lines = content.split('\n').filter(line => 
      line.trim().length > 10 && 
      (line.includes('•') || line.includes('-') || line.includes('*'))
    );
    
    return lines.map(line => line.replace(/[•\-*]\s*/, '').trim()).slice(0, 5);
  }

  private getAgentDisplayName(agentType: AgentType): string {
    const names = {
      [AgentType.BUSINESS_ADVISOR]: 'Business Advisor',
      [AgentType.INVESTMENT_ANALYST]: 'Investment Analyst',
      [AgentType.CREDIT_ANALYST]: 'Credit Analyst',
      [AgentType.IMPACT_ANALYST]: 'Impact Analyst',
      [AgentType.PROGRAM_MANAGER]: 'Program Manager',
      [AgentType.PLATFORM_ORCHESTRATOR]: 'Platform Orchestrator'
    };
    return names[agentType] || 'Specialist';
  }

  private isCoAgent(agentType: AgentType): boolean {
    return [AgentType.CO_FOUNDER, AgentType.CO_INVESTOR, AgentType.CO_BUILDER].includes(agentType);
  }

  private isFunctionalAgent(agentType: AgentType): boolean {
    return [
      AgentType.BUSINESS_ADVISOR,
      AgentType.INVESTMENT_ANALYST,
      AgentType.CREDIT_ANALYST,
      AgentType.IMPACT_ANALYST,
      AgentType.PROGRAM_MANAGER
    ].includes(agentType);
  }

  private generateResponseId(): string {
    return `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Additional helper methods (simplified implementations)
  private adaptActionsForCoAgent(actions: any[], coAgentType: AgentType): any[] {
    return actions.map(action => ({
      ...action,
      coAgentContext: true,
      personalizedLabel: this.personalizeActionLabel(action, coAgentType)
    }));
  }

  private transformInsightsForCoAgent(insights: Insight[]): Insight[] {
    return insights.map(insight => ({
      ...insight,
      description: `💡 ${insight.description}`
    }));
  }

  private extractIdeas(coAgentResponse: AgentResponse, functionalInputs: AgentResponse[]): any[] {
    return []; // Simplified
  }

  private extractAnalysis(functionalInputs: AgentResponse[]): any {
    return {}; // Simplified
  }

  private createSynthesizedRecommendations(ideas: any[], analysis: any): string {
    return "Based on our collaborative analysis, here are the top recommendations...";
  }

  private extractPerspectives(inputs: AgentResponse[]): any[] {
    return inputs.map(input => ({
      source: this.getAgentDisplayName(input.agentType),
      keyFindings: this.extractKeyPoints(input.content)
    }));
  }

  private synthesizeRiskAssessment(inputs: AgentResponse[]): any {
    return {
      risks: [
        { type: 'Market', description: 'Market conditions may change', probability: 'Medium' }
      ]
    };
  }

  private synthesizeRecommendations(inputs: AgentResponse[]): any {
    return {
      primary: "Proceed with caution based on current analysis",
      alternatives: ["Consider alternative approach", "Gather more data"]
    };
  }

  private generateCoAgentTake(agentType: AgentType, perspectives: any[], risks: any): string {
    return "Based on all this analysis, I think we should move forward strategically...";
  }

  private prioritizeInsights(insights: Insight[]): Insight[] {
    return this.mergeInsights(insights);
  }

  private extractStructuredData(response: AgentResponse): any {
    return { summary: "Data extracted from functional response" };
  }

  private generateCoAgentIntro(personality: any, query: string): string {
    return "Let me share what our analysis revealed about your question...";
  }

  private addPersonalizedContext(data: any, userContext: any): string {
    return "Given your current situation and goals...";
  }

  private generateCoAgentPerspective(data: any, personality: any): string {
    return "Here's how I see it from a strategic perspective...";
  }

  private createCombinedRecommendation(primary: AgentResponse, contributing: AgentResponse[]): string {
    return "Based on all perspectives, the recommended approach is...";
  }

  private personalizeActionLabel(action: any, coAgentType: AgentType): string {
    return action.label || action.description || "Take Action";
  }
}
