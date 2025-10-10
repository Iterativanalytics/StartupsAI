
import { AgentConfig, AgentContext } from "../../../core/agent-engine";
import { AzureOpenAIClient } from "../../../core/azure-openai-client";
import { AzureOpenAIAdvanced } from "../../../core/azure-openai-advanced";
import { azureAIServices } from "../../../core/azure-ai-services";
import { azureCognitiveServices } from "../../../core/azure-cognitive-services";

export interface ConversationState {
  mode: 'listening' | 'challenging' | 'supporting' | 'teaching' | 'strategizing';
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  emotionalState: 'confident' | 'stressed' | 'excited' | 'overwhelmed' | 'neutral';
  engagement: 'high' | 'medium' | 'low';
  intent: string;
  keyTopics: string[];
}

export interface EntrepreneurNeeds {
  needsSupport: boolean;
  needsChallenging: boolean;
  needsGuidance: boolean;
  needsAccountability: boolean;
  needsCelebration: boolean;
  needsCrisisHelp: boolean;
}

export interface DecisionType {
  impact: 'low' | 'medium' | 'high' | 'critical';
  reversibility: 'reversible' | 'semi-reversible' | 'irreversible';
  urgency: 'immediate' | 'near-term' | 'long-term';
  category: 'strategic' | 'financial' | 'hiring' | 'product' | 'operational';
}

export class CoFounderBrain {
  private config: AgentConfig;
  private aiClient: AzureOpenAIClient;
  private advancedClient: AzureOpenAIAdvanced;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.aiClient = new AzureOpenAIClient(config);
    this.advancedClient = new AzureOpenAIAdvanced(config);
  }
  
  async analyzeConversationState(context: AgentContext): Promise<ConversationState> {
    const recentMessages = context.conversationHistory.slice(-10);
    const lastMessage = recentMessages[recentMessages.length - 1];
    const messageContent = lastMessage?.content || '';
    
    // Use Azure Cognitive Services for comprehensive conversation analysis
    let emotionalState = this.detectEmotionalState(messageContent);
    let urgency: ConversationState['urgency'] = 'low';
    let intent = 'general_conversation';
    let keyTopics: string[] = [];
    
    if (azureCognitiveServices.isConfigured()) {
      try {
        const conversationHistory = recentMessages.map(m => m.content);
        const analysis = await azureCognitiveServices.analyzeConversation(messageContent, conversationHistory);
        
        // Map Azure analysis to our conversation state
        emotionalState = this.mapEmotionalTone(analysis.emotionalTone);
        urgency = analysis.urgency;
        intent = analysis.intent;
        keyTopics = analysis.keyTopics;
      } catch (error) {
        console.error('Azure conversation analysis failed, using fallback:', error);
        // Fall back to basic analysis
        urgency = this.detectUrgency(messageContent);
      }
    } else {
      // Fallback to basic analysis when Azure is not configured
      urgency = this.detectUrgency(messageContent);
    }
    
    // Assess engagement level
    const engagement = this.assessEngagement(recentMessages);
    
    // Determine appropriate conversation mode
    const mode = this.determineMode(emotionalState, urgency, context);
    
    return {
      mode,
      urgency,
      emotionalState,
      engagement,
      intent,
      keyTopics
    };
  }
  
  private mapEmotionalTone(tone: {
    stressed: number;
    confident: number;
    excited: number;
    frustrated: number;
    neutral: number;
  }): ConversationState['emotionalState'] {
    // Find the highest emotion score
    const emotions = [
      { state: 'stressed' as const, score: tone.stressed },
      { state: 'confident' as const, score: tone.confident },
      { state: 'excited' as const, score: tone.excited },
      { state: 'overwhelmed' as const, score: tone.frustrated },
      { state: 'neutral' as const, score: tone.neutral }
    ];
    
    const dominant = emotions.reduce((max, curr) => curr.score > max.score ? curr : max);
    return dominant.state;
  }
  
  private mapSentimentToEmotionalState(sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    scores: { positive: number; negative: number; neutral: number };
  }): ConversationState['emotionalState'] {
    if (sentiment.sentiment === 'positive' && sentiment.scores.positive > 0.7) {
      return 'excited';
    } else if (sentiment.sentiment === 'negative' && sentiment.scores.negative > 0.7) {
      return 'stressed';
    } else if (sentiment.sentiment === 'mixed') {
      return 'overwhelmed';
    } else if (sentiment.sentiment === 'positive') {
      return 'confident';
    }
    return 'neutral';
  }
  
  async detectNeeds(context: AgentContext): Promise<EntrepreneurNeeds> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    return {
      needsSupport: this.detectNeedForSupport(lastMessage),
      needsChallenging: this.detectComplacency(lastMessage, context),
      needsGuidance: this.detectUncertainty(lastMessage),
      needsAccountability: this.detectAvoidance(lastMessage, context),
      needsCelebration: this.detectWins(lastMessage),
      needsCrisisHelp: this.detectCrisis(lastMessage)
    };
  }
  
  selectResponseMode(state: ConversationState, needs: EntrepreneurNeeds): string {
    // Crisis always takes priority
    if (needs.needsCrisisHelp || state.urgency === 'crisis') {
      return 'crisis_support';
    }
    
    // Support for stressed/overwhelmed state
    if (state.emotionalState === 'stressed' || state.emotionalState === 'overwhelmed') {
      return 'supportive';
    }
    
    // Challenge when entrepreneur is overconfident or complacent
    if (needs.needsChallenging && state.emotionalState === 'confident') {
      return 'challenging';
    }
    
    // Celebrate wins
    if (needs.needsCelebration) {
      return 'celebratory';
    }
    
    // Guide when uncertain
    if (needs.needsGuidance) {
      return 'teaching';
    }
    
    // Default to collaborative
    return 'collaborative';
  }
  
  async identifyAssumptions(message: string): Promise<string[]> {
    const assumptions: string[] = [];
    
    // Pattern matching for common assumption language
    const assumptionPatterns = [
      /everyone (wants|needs|will)/i,
      /customers (always|never|definitely)/i,
      /the market (is|will|should)/i,
      /(obviously|clearly|definitely)/i,
      /we just need to/i,
      /it will only take/i,
      /users will obviously/i,
      /competitors can't/i
    ];
    
    for (const pattern of assumptionPatterns) {
      const match = message.match(pattern);
      if (match) {
        assumptions.push(`Assumption: ${match[0]} - This might not always be true`);
      }
    }
    
    // Add common business assumptions based on patterns
    if (message.match(/(everyone|all customers|users)/i)) {
      assumptions.push("Assuming universal customer behavior - different segments may act differently");
    }
    
    if (message.match(/(just need to|simply|easy)/i)) {
      assumptions.push("Assuming implementation simplicity - execution often reveals complexity");
    }
    
    if (message.match(/(will definitely|must|always)/i)) {
      assumptions.push("Assuming certainty in uncertain market conditions");
    }
    
    return assumptions;
  }
  
  async generateCounterPoints(assumptions: string[], context: AgentContext): Promise<Array<{challenge: string, evidence: string}>> {
    const counterPoints: Array<{challenge: string, evidence: string}> = [];
    
    for (const assumption of assumptions) {
      // Generate counter-arguments based on common business realities
      if (assumption.includes('customer')) {
        counterPoints.push({
          challenge: `What if customer behavior varies significantly across segments?`,
          evidence: 'Different customer segments often have varying needs, budgets, and decision-making processes'
        });
      } else if (assumption.includes('market')) {
        counterPoints.push({
          challenge: `What if market conditions change rapidly?`,
          evidence: 'Markets are dynamic - economic shifts, new competitors, and changing regulations can impact assumptions'
        });
      } else if (assumption.includes('simple') || assumption.includes('easy')) {
        counterPoints.push({
          challenge: `What if implementation is more complex than expected?`,
          evidence: 'Technical debt, regulatory requirements, and scale challenges often emerge during execution'
        });
      } else {
        counterPoints.push({
          challenge: `What evidence validates this assumption?`,
          evidence: 'Test assumptions with real user data, market research, or small experiments before betting big'
        });
      }
    }
    
    return counterPoints.slice(0, 3); // Limit to top 3
  }
  
  async classifyDecision(message: string, context: AgentContext): Promise<DecisionType> {
    // Simple classification based on keywords and context
    let impact: DecisionType['impact'] = 'low';
    let reversibility: DecisionType['reversibility'] = 'reversible';
    let urgency: DecisionType['urgency'] = 'near-term';
    let category: DecisionType['category'] = 'operational';
    
    // Impact classification
    if (message.match(/(pivot|shut down|sell|acquire|merge|ipo)/i)) {
      impact = 'critical';
    } else if (message.match(/(hire|fire|funding|invest|partner)/i)) {
      impact = 'high';
    } else if (message.match(/(feature|price|marketing|process)/i)) {
      impact = 'medium';
    }
    
    // Reversibility
    if (message.match(/(fire|shut down|sell|legal|contract|equity)/i)) {
      reversibility = 'irreversible';
    } else if (message.match(/(hire|invest|partner|commit)/i)) {
      reversibility = 'semi-reversible';
    }
    
    // Urgency
    if (message.match(/(urgent|asap|immediately|crisis|emergency)/i)) {
      urgency = 'immediate';
    } else if (message.match(/(today|this week|soon)/i)) {
      urgency = 'near-term';
    }
    
    // Category
    if (message.match(/(strategy|pivot|market|vision)/i)) {
      category = 'strategic';
    } else if (message.match(/(funding|revenue|cost|price|budget)/i)) {
      category = 'financial';
    } else if (message.match(/(hire|fire|team|culture)/i)) {
      category = 'hiring';
    } else if (message.match(/(feature|product|development|tech)/i)) {
      category = 'product';
    }
    
    return { impact, reversibility, urgency, category };
  }
  
  async analyzeDecision(message: string, context: AgentContext, decisionType: DecisionType): Promise<any> {
    const businessData = context.relevantData || {};
    
    return {
      clarification: `You're facing a ${decisionType.category} decision with ${decisionType.impact} impact.`,
      optimizationFactors: [
        'Speed vs. Quality',
        'Risk vs. Reward', 
        'Short-term vs. Long-term impact',
        'Cost vs. Benefit'
      ],
      considerations: [
        {
          factor: 'Timing',
          analysis: `This seems ${decisionType.urgency} - do you have enough information to decide now?`
        },
        {
          factor: 'Reversibility',
          analysis: `This decision is ${decisionType.reversibility} - ${decisionType.reversibility === 'irreversible' ? 'take extra time to consider' : 'you can adjust course later'}.`
        },
        {
          factor: 'Resources',
          analysis: 'What resources (time, money, people) does each option require?'
        }
      ],
      scenarios: {
        best: 'Decision works perfectly and accelerates growth',
        likely: 'Decision has mixed results requiring adjustments',
        worst: 'Decision fails and requires significant course correction'
      },
      recommendation: 'Need more context about your specific situation to provide a strong recommendation.'
    };
  }
  
  async generateAdaptiveResponse(
    message: string,
    context: AgentContext,
    responseMode: string,
    personality: any
  ): Promise<{content: string, suggestions: string[], actions: any[], confidence: number}> {
    
    // Use Azure OpenAI if configured, otherwise fall back to rule-based responses
    if (this.config.apiKey && this.config.apiKey.length > 0) {
      try {
        return await this.generateAIResponse(message, context, responseMode, personality);
      } catch (error) {
        console.error('AI response generation failed, falling back to rule-based:', error);
        // Fall through to rule-based responses
      }
    }
    
    const modeResponses = {
      supportive: await this.generateSupportiveResponse(message, context),
      challenging: await this.generateChallengingResponse(message, context),
      teaching: await this.generateTeachingResponse(message, context),
      collaborative: await this.generateCollaborativeResponse(message, context),
      celebratory: await this.generateCelebratoryResponse(message, context)
    };
    
    const response = modeResponses[responseMode as keyof typeof modeResponses] || modeResponses.collaborative;
    
    return {
      content: response.content,
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      confidence: 0.8
    };
  }
  
  private async generateAIResponse(
    message: string,
    context: AgentContext,
    responseMode: string,
    personality: any
  ): Promise<{content: string, suggestions: string[], actions: any[], confidence: number}> {
    // Check content safety first if Azure AI Services is configured
    if (azureAIServices.isConfigured()) {
      const safetyCheck = await azureAIServices.checkContentSafety(message);
      if (!safetyCheck.safe) {
        console.warn('Content safety check failed for user message');
        return {
          content: "I noticed your message contains content that I can't respond to appropriately. Let's keep our conversation professional and focused on building your business. How can I help you with your startup challenges?",
          suggestions: ["Share a business challenge you're facing", "Discuss your current goals", "Talk about decision-making"],
          actions: [],
          confidence: 1.0
        };
      }
    }
    
    const systemPrompt = this.buildSystemPrompt(responseMode, personality);
    const conversationHistory = context.conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const promptWithContext = `${message}\n\nContext: The entrepreneur is ${context.relevantData?.stage || 'early stage'}. ${context.relevantData?.additionalContext || ''}`;
    
    const aiResponse = await this.aiClient.generateStructuredResponse<{
      content: string;
      suggestions: string[];
      actions: any[];
    }>(
      systemPrompt,
      promptWithContext,
      conversationHistory,
      {},
      { temperature: 0.8, maxTokens: 1500 }
    );
    
    return {
      content: aiResponse.content,
      suggestions: aiResponse.suggestions || [],
      actions: aiResponse.actions || [],
      confidence: 0.9
    };
  }
  
  private buildSystemPrompt(responseMode: string, personality: any): string {
    const baseTone = personality?.tone || 'direct, honest, and supportive';
    const expertise = personality?.expertise || 'startup strategy, product development, and business growth';
    
    const modePrompts = {
      supportive: `You are an empathetic co-founder providing emotional support. Be ${baseTone}. 
      Acknowledge their challenges, validate their feelings, and help them find a path forward. 
      Your expertise includes: ${expertise}.`,
      
      challenging: `You are a devil's advocate co-founder who pushes back constructively. Be ${baseTone}.
      Question assumptions, poke holes in ideas, and demand evidence. Your goal is to strengthen their thinking.
      Your expertise includes: ${expertise}.`,
      
      teaching: `You are a mentor co-founder sharing frameworks and knowledge. Be ${baseTone}.
      Teach principles, share frameworks, and help them develop their own decision-making skills.
      Your expertise includes: ${expertise}.`,
      
      collaborative: `You are a thought partner co-founder working through problems together. Be ${baseTone}.
      Think out loud, explore possibilities, and build on their ideas. You're in this together.
      Your expertise includes: ${expertise}.`,
      
      celebratory: `You are an encouraging co-founder celebrating wins. Be ${baseTone}.
      Acknowledge achievements, identify what made them successful, and build momentum.
      Your expertise includes: ${expertise}.`
    };
    
    const modePrompt = modePrompts[responseMode as keyof typeof modePrompts] || modePrompts.collaborative;
    
    return `${modePrompt}

IMPORTANT: Respond in JSON format with this structure:
{
  "content": "Your response to the entrepreneur",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "actions": []
}

Keep responses concise, actionable, and authentic. Speak like a real co-founder, not a chatbot.`;
  }
  
  private detectEmotionalState(message: string): ConversationState['emotionalState'] {
    if (message.match(/(stressed|overwhelmed|exhausted|burnt out|tired)/i)) {
      return 'stressed';
    }
    if (message.match(/(excited|pumped|amazing|fantastic|incredible)/i)) {
      return 'excited';
    }
    if (message.match(/(confident|sure|definitely|absolutely)/i)) {
      return 'confident';
    }
    if (message.match(/(lost|confused|stuck|don't know|uncertain)/i)) {
      return 'overwhelmed';
    }
    return 'neutral';
  }
  
  private detectUrgency(message: string): ConversationState['urgency'] {
    if (message.match(/(crisis|emergency|urgent|asap|immediately)/i)) {
      return 'crisis';
    }
    if (message.match(/(soon|quickly|today|this week)/i)) {
      return 'high';
    }
    if (message.match(/(important|significant|major)/i)) {
      return 'medium';
    }
    return 'low';
  }
  
  private assessEngagement(messages: any[]): ConversationState['engagement'] {
    if (messages.length < 2) return 'low';
    
    const avgLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / messages.length;
    
    if (avgLength > 200) return 'high';
    if (avgLength > 50) return 'medium';
    return 'low';
  }
  
  private determineMode(emotionalState: string, urgency: string, context: AgentContext): ConversationState['mode'] {
    if (urgency === 'crisis') return 'supporting';
    if (emotionalState === 'overwhelmed') return 'supporting';
    if (emotionalState === 'confident') return 'challenging';
    if (emotionalState === 'excited') return 'strategizing';
    return 'listening';
  }
  
  private detectNeedForSupport(message: string): boolean {
    return message.match(/(struggling|difficult|hard|stressed|overwhelmed)/i) !== null;
  }
  
  private detectComplacency(message: string, context: AgentContext): boolean {
    return message.match(/(easy|simple|obvious|no problem|piece of cake)/i) !== null;
  }
  
  private detectUncertainty(message: string): boolean {
    return message.match(/(not sure|don't know|uncertain|confused|what should)/i) !== null;
  }
  
  private detectAvoidance(message: string, context: AgentContext): boolean {
    return message.match(/(should|need to|have to|must|later|eventually)/i) !== null;
  }
  
  private detectWins(message: string): boolean {
    return message.match(/(closed|signed|launched|raised|hired|achieved|success)/i) !== null;
  }
  
  private detectCrisis(message: string): boolean {
    return message.match(/(crisis|emergency|disaster|failed|lost|quit|broke)/i) !== null;
  }
  
  private async generateSupportiveResponse(message: string, context: AgentContext) {
    return {
      content: "I can hear that this is challenging right now. Every entrepreneur faces tough moments - it's part of the journey, not a reflection of your abilities. Let's break this down into manageable pieces and find a path forward together.",
      suggestions: ["Talk through what's most stressful", "Identify one small win we can achieve today", "Look at the bigger picture", "Plan some recovery time"],
      actions: []
    };
  }
  
  private async generateChallengingResponse(message: string, context: AgentContext) {
    return {
      content: "I need to push back on this a bit. I'm seeing some assumptions here that might be worth questioning. As your co-founder, it's my job to poke holes in ideas before the market does. What evidence are you basing this on?",
      suggestions: ["Show me the data", "What could go wrong?", "Have you tested this assumption?", "What would competitors do?"],
      actions: []
    };
  }
  
  private async generateTeachingResponse(message: string, context: AgentContext) {
    return {
      content: "Great question! Let me share some frameworks that might help you think through this. The key is understanding the underlying principles so you can apply them to similar situations in the future.",
      suggestions: ["Walk through the framework step by step", "See examples from other companies", "Practice with your specific situation", "Explore common mistakes"],
      actions: []
    };
  }
  
  private async generateCollaborativeResponse(message: string, context: AgentContext) {
    return {
      content: "I'm thinking about this with you. Let me share what I'm seeing and get your perspective. We're in this together, and the best solutions come from combining your deep knowledge of the business with my outside perspective.",
      suggestions: ["Explore different angles together", "Build on your initial idea", "Consider alternative approaches", "Make this decision together"],
      actions: []
    };
  }
  
  private async generateCelebratoryResponse(message: string, context: AgentContext) {
    return {
      content: "🎉 This is huge! Take a moment to actually celebrate this win. You've worked hard for this, and it deserves recognition. What made this successful? Let's understand the pattern so we can replicate it.",
      suggestions: ["Celebrate with the team", "Share the success story", "Identify what worked", "Plan the next milestone"],
      actions: []
    };
  }
  
  async extractBrainstormTopic(context: AgentContext): Promise<string> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const content = lastMessage?.content || '';
    
    // Extract topic from context or use generic brainstorming
    if (content.toLowerCase().includes('product')) {
      return 'Product Development Ideas';
    } else if (content.toLowerCase().includes('marketing')) {
      return 'Marketing Strategy';
    } else if (content.toLowerCase().includes('revenue') || content.toLowerCase().includes('monetiz')) {
      return 'Revenue Generation';
    } else if (content.toLowerCase().includes('team') || content.toLowerCase().includes('hiring')) {
      return 'Team Building & Hiring';
    } else {
      return 'Business Growth Opportunities';
    }
  }
  
  async generateCreativeIdeas(topic: string, context: AgentContext): Promise<{
    conventional: string[];
    unconventional: string[];
    whatIf: string[];
  }> {
    const businessStage = context.relevantData?.stage || 'early';
    
    const ideaTemplates = {
      conventional: [
        'Focus on core customer segment validation',
        'Optimize existing acquisition channels',
        'Improve product-market fit metrics',
        'Build strategic partnerships'
      ],
      unconventional: [
        'Create a community-driven growth model',
        'Use gamification to increase engagement',
        'Partner with unlikely industry players',
        'Build in public to generate interest'
      ],
      whatIf: [
        'we completely changed our business model',
        'we targeted a different customer segment',
        'we gave our product away for free initially',
        'we focused on one feature and did it perfectly'
      ]
    };
    
    return ideaTemplates;
  }
  
  async identifyCrisisType(context: AgentContext): Promise<string> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const content = lastMessage?.content.toLowerCase() || '';
    
    if (content.includes('cash') || content.includes('money') || content.includes('funding')) {
      return 'financial_crisis';
    } else if (content.includes('team') || content.includes('quit') || content.includes('fired')) {
      return 'team_crisis';
    } else if (content.includes('customer') || content.includes('churn') || content.includes('lost')) {
      return 'customer_crisis';
    } else if (content.includes('product') || content.includes('bug') || content.includes('broken')) {
      return 'product_crisis';
    } else {
      return 'general_crisis';
    }
  }
  
  async generateCrisisResponse(crisisType: string, context: AgentContext): Promise<{
    immediate: string[];
    shortTerm: string[];
    strategic: string[];
  }> {
    const responses = {
      financial_crisis: {
        immediate: [
          'Calculate exact runway remaining',
          'List all possible cost cuts',
          'Contact existing investors for bridge funding',
          'Explore emergency revenue opportunities'
        ],
        shortTerm: [
          'Create detailed cash flow projections',
          'Negotiate payment terms with vendors',
          'Focus sales efforts on fastest-closing deals',
          'Consider strategic partnerships for immediate revenue'
        ],
        strategic: [
          'Reassess business model sustainability',
          'Plan next fundraising round timeline',
          'Evaluate pivot opportunities',
          'Build relationships with potential acquirers'
        ]
      },
      team_crisis: {
        immediate: [
          'Assess critical knowledge transfer needs',
          'Communicate with remaining team members',
          'Document key processes and systems',
          'Prioritize most urgent hiring needs'
        ],
        shortTerm: [
          'Redistribute responsibilities temporarily',
          'Fast-track hiring for critical roles',
          'Consider interim consultants or contractors',
          'Improve team retention strategies'
        ],
        strategic: [
          'Review company culture and management practices',
          'Implement better team communication systems',
          'Design competitive compensation packages',
          'Create clear career development paths'
        ]
      },
      default: {
        immediate: [
          'Assess the immediate impact and scope',
          'Communicate with key stakeholders',
          'Implement damage control measures',
          'Gather all relevant information'
        ],
        shortTerm: [
          'Create action plan for resolution',
          'Allocate resources to fix the issue',
          'Monitor progress and adjust as needed',
          'Keep stakeholders informed of progress'
        ],
        strategic: [
          'Analyze root causes to prevent recurrence',
          'Strengthen systems and processes',
          'Build better crisis response capabilities',
          'Document lessons learned for future'
        ]
      }
    };
    
    return responses[crisisType as keyof typeof responses] || responses.default;
  }
}
