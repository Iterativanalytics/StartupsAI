/**
 * Azure-Enhanced Co-Founder Capabilities
 * Leverages Azure OpenAI Advanced and Azure Cognitive Services
 * for sophisticated Co-Founder interactions
 */

import { AgentContext } from "../../../core/agent-engine";
import { AzureOpenAIAdvanced } from "../../../core/azure-openai-advanced";
import { azureCognitiveServices } from "../../../core/azure-cognitive-services";
import { AgentConfig } from "../../../core/agent-engine";

export class AzureEnhancedCapabilities {
  private advancedClient: AzureOpenAIAdvanced;
  
  constructor(config: AgentConfig) {
    this.advancedClient = new AzureOpenAIAdvanced(config);
  }
  
  /**
   * Comprehensive decision analysis using multiple AI perspectives
   */
  async analyzeDecisionMultiPerspective(
    decision: string,
    context: AgentContext
  ): Promise<{
    perspectives: Array<{
      name: string;
      analysis: string;
      recommendation: string;
      confidence: number;
    }>;
    synthesis: string;
    recommendation: string;
  }> {
    const businessContext = this.buildBusinessContext(context);
    
    // Get multiple perspectives using Azure OpenAI
    const perspectives = await this.advancedClient.generateMultiplePerspectives(
      decision,
      businessContext,
      ['optimistic', 'pessimistic', 'realistic', 'data-driven', 'strategic']
    );
    
    // Synthesize perspectives into final recommendation
    const synthesis = await this.synthesizePerspectives(perspectives, decision);
    
    return {
      perspectives: perspectives.map(p => ({
        name: p.perspective,
        analysis: p.analysis,
        recommendation: this.extractRecommendation(p.analysis),
        confidence: this.estimateConfidence(p.analysis)
      })),
      synthesis: synthesis.content,
      recommendation: synthesis.recommendation
    };
  }
  
  /**
   * Strategic thinking with chain-of-thought reasoning
   */
  async strategicThinking(
    question: string,
    context: AgentContext
  ): Promise<{
    content: string;
    reasoning: string;
    insights: string[];
    actionItems: string[];
  }> {
    const businessContext = this.buildBusinessContext(context);
    const systemPrompt = this.buildStrategicSystemPrompt();
    
    const response = await this.advancedClient.generateWithChainOfThought(
      systemPrompt,
      `${question}\n\nBusiness Context: ${businessContext}`,
      context.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { temperature: 0.7, maxTokens: 2000 }
    );
    
    // Extract insights and action items from response
    const insights = this.extractInsights(response.content);
    const actionItems = this.extractActionItems(response.content);
    
    return {
      content: response.content,
      reasoning: response.reasoning,
      insights,
      actionItems
    };
  }
  
  /**
   * Proactive insights generation based on business context
   */
  async generateProactiveInsights(
    context: AgentContext
  ): Promise<Array<{
    type: 'opportunity' | 'warning' | 'celebration' | 'accountability';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    actionable: boolean;
    suggestedActions: string[];
  }>> {
    const businessData = context.relevantData || {};
    const conversationHistory = context.conversationHistory;
    
    // Use conversation analysis to understand current state
    const recentMessages = conversationHistory.slice(-5).map(m => m.content).join('\n');
    const analysis = await azureCognitiveServices.analyzeConversation(recentMessages);
    
    const insights: Array<any> = [];
    
    // Generate insights based on patterns
    const systemPrompt = `You are a proactive co-founder analyzing business data and conversations.
    Generate actionable insights focusing on:
    - Opportunities the entrepreneur might be missing
    - Risks that need attention
    - Patterns worth celebrating
    - Accountability gaps`;
    
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Business Stage: ${businessData.stage || 'early'}
Revenue: ${businessData.revenue || 'unknown'}
Team Size: ${businessData.teamSize || 'unknown'}
Recent Conversations: ${recentMessages}

Generate 3-5 proactive insights that would be most valuable right now.`,
      [],
      [
        {
          name: 'generate_insights',
          description: 'Generate proactive business insights',
          parameters: {
            type: 'object',
            properties: {
              insights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['opportunity', 'warning', 'celebration', 'accountability'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    title: { type: 'string' },
                    message: { type: 'string' },
                    actionable: { type: 'boolean' },
                    suggestedActions: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      ],
      { temperature: 0.8 }
    );
    
    // Parse function call response
    if (response.functionCall?.name === 'generate_insights') {
      insights.push(...response.functionCall.arguments.insights);
    }
    
    return insights;
  }
  
  /**
   * Devil's Advocate mode - challenge assumptions with data
   */
  async challengeAssumptions(
    proposition: string,
    context: AgentContext
  ): Promise<{
    assumptions: string[];
    challenges: Array<{
      assumption: string;
      challenge: string;
      evidence: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    counterProposal?: string;
  }> {
    const systemPrompt = `You are a devil's advocate co-founder. Your job is to constructively challenge assumptions and ideas.
    Be direct but supportive. Back challenges with evidence and reasoning.`;
    
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Analyze this proposition and challenge its assumptions:\n\n${proposition}`,
      context.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: 'challenge_assumptions',
          description: 'Identify and challenge assumptions in a business proposition',
          parameters: {
            type: 'object',
            properties: {
              assumptions: {
                type: 'array',
                items: { type: 'string' }
              },
              challenges: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    assumption: { type: 'string' },
                    challenge: { type: 'string' },
                    evidence: { type: 'string' },
                    severity: { type: 'string', enum: ['low', 'medium', 'high'] }
                  }
                }
              },
              counterProposal: { type: 'string' }
            }
          }
        }
      ],
      { temperature: 0.7 }
    );
    
    if (response.functionCall?.name === 'challenge_assumptions') {
      return response.functionCall.arguments;
    }
    
    return {
      assumptions: [],
      challenges: []
    };
  }
  
  /**
   * Brainstorming with creative AI generation
   */
  async brainstormIdeas(
    topic: string,
    context: AgentContext,
    approachTypes: string[] = ['conventional', 'unconventional', 'disruptive']
  ): Promise<{
    topic: string;
    ideas: Array<{
      approach: string;
      title: string;
      description: string;
      feasibility: number;
      impact: number;
      pros: string[];
      cons: string[];
    }>;
  }> {
    const systemPrompt = `You are a creative co-founder helping brainstorm business ideas.
    Generate diverse, creative solutions across different approaches.`;
    
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Brainstorm ideas for: ${topic}\n\nBusiness Context: ${this.buildBusinessContext(context)}
      
Generate ideas across these approaches: ${approachTypes.join(', ')}`,
      context.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: 'generate_ideas',
          description: 'Generate brainstorming ideas across different approaches',
          parameters: {
            type: 'object',
            properties: {
              ideas: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    approach: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    feasibility: { type: 'number', minimum: 0, maximum: 10 },
                    impact: { type: 'number', minimum: 0, maximum: 10 },
                    pros: { type: 'array', items: { type: 'string' } },
                    cons: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      ],
      { temperature: 0.9 }
    );
    
    if (response.functionCall?.name === 'generate_ideas') {
      return {
        topic,
        ideas: response.functionCall.arguments.ideas
      };
    }
    
    return { topic, ideas: [] };
  }
  
  /**
   * Accountability tracking with pattern recognition
   */
  async analyzeAccountabilityPatterns(
    commitments: Array<{
      description: string;
      dueDate: string;
      status: 'completed' | 'overdue' | 'in_progress';
    }>,
    context: AgentContext
  ): Promise<{
    patterns: string[];
    insights: string[];
    recommendations: string[];
    excuseDetection?: string;
  }> {
    const completionRate = commitments.filter(c => c.status === 'completed').length / commitments.length;
    const overdueRate = commitments.filter(c => c.status === 'overdue').length / commitments.length;
    
    const systemPrompt = `You are an accountability partner analyzing commitment patterns.
    Be direct but supportive. Identify patterns and offer constructive recommendations.`;
    
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Analyze these commitment patterns:
      
Commitments: ${JSON.stringify(commitments, null, 2)}
Completion Rate: ${(completionRate * 100).toFixed(1)}%
Overdue Rate: ${(overdueRate * 100).toFixed(1)}%

Recent Conversations: ${context.conversationHistory.slice(-3).map(m => m.content).join('\n')}`,
      [],
      [
        {
          name: 'analyze_patterns',
          description: 'Analyze accountability and commitment patterns',
          parameters: {
            type: 'object',
            properties: {
              patterns: { type: 'array', items: { type: 'string' } },
              insights: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
              excuseDetection: { type: 'string' }
            }
          }
        }
      ],
      { temperature: 0.7 }
    );
    
    if (response.functionCall?.name === 'analyze_patterns') {
      return response.functionCall.arguments;
    }
    
    return {
      patterns: [],
      insights: [],
      recommendations: []
    };
  }
  
  /**
   * Crisis response with structured action planning
   */
  async generateCrisisActionPlan(
    crisisDescription: string,
    context: AgentContext
  ): Promise<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    immediateActions: Array<{
      action: string;
      priority: number;
      timeline: string;
      resources: string[];
    }>;
    shortTermActions: Array<{
      action: string;
      timeline: string;
      expectedOutcome: string;
    }>;
    strategicActions: Array<{
      action: string;
      timeline: string;
      prevention: string;
    }>;
    supportMessage: string;
  }> {
    const systemPrompt = `You are a crisis management co-founder. Provide structured, actionable crisis response plans.
    Be calm, practical, and supportive. Break down complex crises into manageable steps.`;
    
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Crisis Situation: ${crisisDescription}
      
Business Context: ${this.buildBusinessContext(context)}

Generate a comprehensive action plan.`,
      context.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: 'generate_crisis_plan',
          description: 'Generate structured crisis action plan',
          parameters: {
            type: 'object',
            properties: {
              severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
              immediateActions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    priority: { type: 'number' },
                    timeline: { type: 'string' },
                    resources: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              shortTermActions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    timeline: { type: 'string' },
                    expectedOutcome: { type: 'string' }
                  }
                }
              },
              strategicActions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    timeline: { type: 'string' },
                    prevention: { type: 'string' }
                  }
                }
              },
              supportMessage: { type: 'string' }
            }
          }
        }
      ],
      { temperature: 0.6 }
    );
    
    if (response.functionCall?.name === 'generate_crisis_plan') {
      return response.functionCall.arguments;
    }
    
    return {
      severity: 'medium',
      immediateActions: [],
      shortTermActions: [],
      strategicActions: [],
      supportMessage: 'Let\'s work through this together step by step.'
    };
  }
  
  /**
   * Helper methods
   */
  
  private buildBusinessContext(context: AgentContext): string {
    const data = context.relevantData || {};
    return `
Stage: ${data.stage || 'early-stage'}
Revenue: ${data.revenue || 'not specified'}
Team Size: ${data.teamSize || 'not specified'}
Industry: ${data.industry || 'not specified'}
Recent Focus: ${context.conversationHistory.slice(-3).map(m => m.content).join('; ').substring(0, 200)}
    `.trim();
  }
  
  private buildStrategicSystemPrompt(): string {
    return `You are a strategic co-founder with deep expertise in startup strategy, market dynamics, and business growth.
    
Your approach:
- Think long-term while addressing immediate needs
- Challenge assumptions constructively
- Provide frameworks and mental models
- Base advice on data and experience
- Be direct and honest
- Support the entrepreneur as a true partner

When analyzing strategic questions:
1. Understand the real question behind the question
2. Consider multiple perspectives
3. Identify key trade-offs
4. Provide actionable insights
5. Suggest next steps`;
  }
  
  private async synthesizePerspectives(
    perspectives: Array<{ perspective: string; analysis: string }>,
    decision: string
  ): Promise<{ content: string; recommendation: string }> {
    const combinedPerspectives = perspectives
      .map(p => `${p.perspective.toUpperCase()} PERSPECTIVE:\n${p.analysis}`)
      .join('\n\n---\n\n');
    
    // Use simple extraction for now
    return {
      content: combinedPerspectives,
      recommendation: 'Consider all perspectives before deciding'
    };
  }
  
  private extractRecommendation(analysis: string): string {
    const match = analysis.match(/recommend(?:ation)?:?\s*(.+?)(?:\n|$)/i);
    return match ? match[1].trim() : 'See analysis for details';
  }
  
  private estimateConfidence(analysis: string): number {
    // Simple confidence estimation based on language
    if (analysis.match(/(definitely|strongly|clearly|obviously)/i)) {
      return 0.9;
    } else if (analysis.match(/(likely|probably|should)/i)) {
      return 0.7;
    } else if (analysis.match(/(might|could|possibly|maybe)/i)) {
      return 0.5;
    }
    return 0.6;
  }
  
  private extractInsights(content: string): string[] {
    const insights: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[•\-*]\s+(.+)/) || line.match(/insight:?\s*(.+)/i)) {
        insights.push(line.trim());
      }
    }
    
    return insights.slice(0, 5);
  }
  
  private extractActionItems(content: string): string[] {
    const actions: string[] = [];
    const patterns = [
      /action:?\s*(.+)/i,
      /next step:?\s*(.+)/i,
      /todo:?\s*(.+)/i,
      /should:?\s*(.+)/i
    ];
    
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern, 'gi');
      while ((match = regex.exec(content)) !== null) {
        if (match[1]) {
          actions.push(match[1].trim());
        }
      }
    }
    
    return Array.from(new Set(actions)).slice(0, 5);
  }
}