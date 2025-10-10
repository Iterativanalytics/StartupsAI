/**
 * Enhanced Base Agent
 * 
 * Complete agent framework with:
 * - Memory integration
 * - Context awareness
 * - Personality adaptation
 * - Conversation tracking
 * - Proactive insights
 * - Multi-agent coordination
 * 
 * All specialized agents should extend this class.
 */

import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig, AgentContext, AgentResponse } from './agent-engine';
import { userContextService, UserContext } from '../../services/user-context-service';
import { agentMemoryService, AgentMemory, MemoryType } from '../../services/agent-memory-service';
import { getAgentDatabase, AgentType } from '../../services/agent-database';
import { logger } from '../../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface EnhancedAgentConfig extends AgentConfig {
  agentType: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  personality?: PersonalityConfig;
}

export interface PersonalityConfig {
  communicationStyle?: string;
  tone?: string;
  formality?: 'casual' | 'professional' | 'formal';
  proactiveness?: 'reactive' | 'balanced' | 'proactive';
}

export interface ExecuteOptions {
  task: string;
  userMessage: string;
  conversationHistory?: Message[];
  includeMemory?: boolean;
  includeContext?: boolean;
  saveMemory?: boolean;
  trackConversation?: boolean;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ExecuteResult {
  response: string;
  confidence?: number;
  suggestedActions?: string[];
  insights?: any[];
  memoriesUsed?: number;
  contextUsed?: boolean;
}

// ============================================================================
// ENHANCED BASE AGENT
// ============================================================================

export abstract class EnhancedBaseAgent {
  protected config: EnhancedAgentConfig;
  protected anthropic: Anthropic;
  protected agentDb = getAgentDatabase();
  protected sessionId: string;

  constructor(config: EnhancedAgentConfig) {
    this.config = config;
    this.anthropic = new Anthropic({
      apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY
    });
    this.sessionId = this.generateSessionId();

    logger.info('Enhanced agent initialized', {
      agentType: config.agentType,
      name: config.name
    });
  }

  /**
   * Main execution method that all agents must implement
   */
  abstract execute(context: AgentContext, options: any): Promise<AgentResponse>;

  /**
   * Execute with full memory and context integration
   */
  protected async executeWithMemory(options: ExecuteOptions): Promise<ExecuteResult> {
    const {
      task,
      userMessage,
      conversationHistory = [],
      includeMemory = true,
      includeContext = true,
      saveMemory = true,
      trackConversation = true
    } = options;

    try {
      const userId = this.getUserIdFromContext();
      
      // Build comprehensive context
      const userContext = includeContext 
        ? await userContextService.buildContext(userId)
        : null;

      // Retrieve relevant memories
      const memories = includeMemory
        ? await agentMemoryService.getRelevantMemories(userId, this.config.agentType, {
            limit: 15,
            context: userMessage
          })
        : [];

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(task, userContext, memories);

      // Build message history
      const messages = this.buildMessageHistory(conversationHistory, userMessage);

      // Execute with Claude
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages
      });

      const responseText = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      // Track conversation
      if (trackConversation) {
        await this.saveConversation(userId, userMessage, responseText);
      }

      // Extract and save key insights as memories
      if (saveMemory) {
        await this.extractAndSaveMemories(userId, userMessage, responseText);
      }

      // Update agent relationship metrics
      await this.updateRelationship(userId);

      logger.info('Agent execution successful', {
        agentType: this.config.agentType,
        userId,
        memoriesUsed: memories.length,
        contextUsed: !!userContext
      });

      return {
        response: responseText,
        confidence: this.extractConfidence(responseText),
        suggestedActions: this.extractActions(responseText),
        insights: this.extractInsights(responseText),
        memoriesUsed: memories.length,
        contextUsed: !!userContext
      };
    } catch (error) {
      logger.error('Agent execution failed', {
        agentType: this.config.agentType,
        task,
        error
      });
      throw error;
    }
  }

  /**
   * Execute with context but no memory (for simpler queries)
   */
  protected async executeWithContext(
    systemPrompt: string,
    userMessage: string,
    userContext?: UserContext
  ): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      });

      return response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
    } catch (error) {
      logger.error('Context execution failed', { error });
      throw error;
    }
  }

  /**
   * Build comprehensive system prompt
   */
  protected buildSystemPrompt(
    task: string,
    userContext: UserContext | null,
    memories: AgentMemory[]
  ): string {
    let prompt = `You are ${this.config.name}, ${this.config.description}.

CURRENT TASK: ${task}

YOUR CAPABILITIES:
${this.config.capabilities.map((cap, i) => `${i + 1}. ${cap}`).join('\n')}
`;

    // Add personality configuration
    if (this.config.personality) {
      prompt += `\n\nPERSONALITY:
Communication Style: ${this.config.personality.communicationStyle || 'professional and helpful'}
Tone: ${this.config.personality.tone || 'warm and supportive'}
Formality: ${this.config.personality.formality || 'professional'}
Proactiveness: ${this.config.personality.proactiveness || 'balanced'}
`;
    }

    // Add user context
    if (userContext) {
      prompt += `\n\nUSER CONTEXT:
Type: ${userContext.userType}
${userContext.businessProfile ? `
Business Stage: ${userContext.businessProfile.stage}
Industry: ${userContext.businessProfile.industry || 'Not specified'}
Revenue: $${userContext.businessProfile.revenue.toLocaleString()}
Team Size: ${userContext.businessProfile.team.length}
` : ''}
Recent Activity: ${userContext.recentActivity.slice(0, 3).map(a => a.type).join(', ') || 'None'}
Active Goals: ${userContext.goals.slice(0, 2).map(g => g.title).join(', ') || 'None'}
`;
    }

    // Add relevant memories
    if (memories.length > 0) {
      prompt += `\n\nRELEVANT MEMORIES (from past interactions):
${memories.map((m, i) => `${i + 1}. [${m.memoryType}] ${JSON.stringify(m.memoryValue)}`).join('\n')}
`;
    }

    prompt += `\n\nINSTRUCTIONS:
- Use the context and memories to provide personalized, relevant advice
- Be specific and actionable in your recommendations
- Reference past conversations when relevant
- Proactively identify opportunities or risks
- Maintain consistency with previous interactions
- Be conversational but professional
`;

    return prompt;
  }

  /**
   * Build message history for API call
   */
  protected buildMessageHistory(
    conversationHistory: Message[],
    currentMessage: string
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    const messages = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  /**
   * Save conversation to database
   */
  protected async saveConversation(
    userId: number,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      // Save user message
      await this.agentDb.saveConversation({
        userId,
        agentType: this.config.agentType,
        sessionId: this.sessionId,
        messageRole: 'user',
        messageContent: userMessage,
        contextData: {}
      });

      // Save assistant response
      await this.agentDb.saveConversation({
        userId,
        agentType: this.config.agentType,
        sessionId: this.sessionId,
        messageRole: 'assistant',
        messageContent: assistantResponse,
        contextData: {}
      });

      logger.debug('Conversation saved', {
        userId,
        agentType: this.config.agentType,
        sessionId: this.sessionId
      });
    } catch (error) {
      logger.error('Failed to save conversation', { error });
    }
  }

  /**
   * Extract and save important information as memories
   */
  protected async extractAndSaveMemories(
    userId: number,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      // Extract goals mentioned
      const goalPattern = /goal[s]?\s+(?:is|are|to)\s+([^.!?]+)/gi;
      const goalMatches = userMessage.match(goalPattern);
      
      if (goalMatches) {
        for (const match of goalMatches) {
          await agentMemoryService.saveMemory({
            userId,
            agentType: this.config.agentType,
            memoryKey: `goal_${Date.now()}`,
            memoryValue: match,
            memoryType: 'goal',
            importance: 90,
            confidence: 80
          });
        }
      }

      // Extract preferences
      const preferencePattern = /(?:I prefer|I like|I want to)\s+([^.!?]+)/gi;
      const preferenceMatches = userMessage.match(preferencePattern);
      
      if (preferenceMatches) {
        for (const match of preferenceMatches) {
          await agentMemoryService.saveMemory({
            userId,
            agentType: this.config.agentType,
            memoryKey: `preference_${Date.now()}`,
            memoryValue: match,
            memoryType: 'preference',
            importance: 70,
            confidence: 85
          });
        }
      }

      logger.debug('Memories extracted and saved', {
        userId,
        agentType: this.config.agentType,
        goalsFound: goalMatches?.length || 0,
        preferencesFound: preferenceMatches?.length || 0
      });
    } catch (error) {
      logger.error('Failed to extract memories', { error });
    }
  }

  /**
   * Update agent-user relationship metrics
   */
  protected async updateRelationship(userId: number): Promise<void> {
    try {
      await this.agentDb.incrementInteraction(userId, this.config.agentType, 0.1);
      
      logger.debug('Relationship updated', {
        userId,
        agentType: this.config.agentType
      });
    } catch (error) {
      logger.error('Failed to update relationship', { error });
    }
  }

  /**
   * Extract confidence score from response
   */
  protected extractConfidence(response: string): number | undefined {
    const confidencePattern = /confidence[:\s]+(\d+)%/i;
    const match = response.match(confidencePattern);
    return match ? parseInt(match[1]) : undefined;
  }

  /**
   * Extract suggested actions from response
   */
  protected extractActions(response: string): string[] {
    const actions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[-*•]\s+/)) {
        actions.push(line.replace(/^[-*•]\s+/, '').trim());
      }
    }
    
    return actions.slice(0, 5); // Max 5 actions
  }

  /**
   * Extract insights from response
   */
  protected extractInsights(response: string): any[] {
    // This can be enhanced to parse structured insights
    return [];
  }

  /**
   * Format standard response
   */
  protected formatResponse(
    content: string,
    actions?: any[],
    suggestions?: string[],
    insights?: any[],
    confidence?: number
  ): AgentResponse {
    return {
      content,
      actions,
      suggestions,
      insights,
      confidence
    };
  }

  /**
   * Get user ID from context (to be overridden by implementing classes)
   */
  protected getUserIdFromContext(): number {
    // This should be overridden by implementing classes to get userId from their context
    return 1; // Default fallback
  }

  /**
   * Generate unique session ID
   */
  protected generateSessionId(): string {
    return `${this.config.agentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper to create memory
   */
  protected async createMemory(
    userId: number,
    key: string,
    value: any,
    type: MemoryType,
    importance: number = 70
  ): Promise<void> {
    await agentMemoryService.saveMemory({
      userId,
      agentType: this.config.agentType,
      memoryKey: key,
      memoryValue: value,
      memoryType: type,
      importance,
      confidence: 80
    });
  }

  /**
   * Helper to get memories by type
   */
  protected async getMemoriesByType(
    userId: number,
    type: MemoryType,
    limit: number = 10
  ): Promise<AgentMemory[]> {
    return agentMemoryService.getRelevantMemories(userId, this.config.agentType, {
      types: [type],
      limit
    });
  }
}
