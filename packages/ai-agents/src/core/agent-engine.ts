import Anthropic from '@anthropic-ai/sdk';
import {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentContext,
  UserType,
  AgentType,
  Message
} from '../types';

// Re-export types for external use
export {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentContext,
  UserType,
  AgentType,
  Message
} from '../types';
import { ContextManager } from './context-manager';
import { MemoryStore } from '../memory/memory-store';
import { BaseAgent } from '../agents/base-agent';
import { BusinessAdvisorAgent } from '../agents/business-advisor';
import { InvestmentAnalystAgent } from '../agents/deal-analyzer';
import { CreditAnalystAgent } from '../agents/credit-assessor';
import { ImpactAnalystAgent } from '../agents/impact-evaluator';
import { ProgramAnalystAgent } from '../agents/partnership-facilitator';
import { BusinessAnalystAgent } from '../agents/platform-orchestrator';
import { ToolRegistry } from '../tools/tool-registry';

export class AgentEngine {
  private client: Anthropic;
  private contextManager: ContextManager;
  private memoryStore: MemoryStore;
  private toolRegistry: ToolRegistry;
  private config: AgentConfig;
  private agents: Map<UserType, BaseAgent>;

  constructor(config: AgentConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey
    });
    this.contextManager = new ContextManager();
    this.memoryStore = new MemoryStore(config);
    this.toolRegistry = new ToolRegistry();
    this.agents = new Map();
    
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents.set(UserType.ENTREPRENEUR, new BusinessAdvisorAgent(this.client, this.config));
    this.agents.set(UserType.INVESTOR, new InvestmentAnalystAgent(this.client, this.config));
    this.agents.set(UserType.LENDER, new CreditAnalystAgent(this.client, this.config));
    this.agents.set(UserType.GRANTOR, new ImpactAnalystAgent(this.client, this.config));
    this.agents.set(UserType.PARTNER, new ProgramAnalystAgent(this.client, this.config));
  }

  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    try {
      // Build context from user data, conversation history, and knowledge base
      const context = await this.contextManager.buildContext(request);

      // Get conversation history
      const conversationHistory = await this.memoryStore.getConversationHistory(
        request.userId,
        request.sessionId
      );

      // Add to context
      context.conversationHistory = conversationHistory;

      // Select appropriate agent based on user type
      const agent = this.selectAgent(request.userType);

      // Get available tools for this user type
      const tools = this.toolRegistry.getToolsForUserType(request.userType);

      // Execute agent with tools and memory
      const response = await agent.execute(context, {
        tools,
        streaming: request.streaming || false,
        taskType: request.taskType
      });

      // Store interaction for learning
      await this.memoryStore.storeConversation(
        request.userId,
        request.sessionId,
        {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content: request.message,
          timestamp: new Date()
        }
      );

      await this.memoryStore.storeConversation(
        request.userId,
        request.sessionId,
        {
          id: response.id,
          role: 'assistant',
          content: response.content,
          timestamp: response.timestamp,
          metadata: response.metadata
        }
      );

      return response;
    } catch (error) {
      console.error('Error processing agent request:', error);
      throw new Error(`Agent processing failed: ${error.message}`);
    }
  }

  async processStreamingRequest(
    request: AgentRequest,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    const context = await this.contextManager.buildContext(request);
    const conversationHistory = await this.memoryStore.getConversationHistory(
      request.userId,
      request.sessionId
    );
    context.conversationHistory = conversationHistory;

    const agent = this.selectAgent(request.userType);
    const tools = this.toolRegistry.getToolsForUserType(request.userType);

    const response = await agent.executeStreaming(context, tools, onChunk);

    // Store conversation
    await this.memoryStore.storeConversation(
      request.userId,
      request.sessionId,
      {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: request.message,
        timestamp: new Date()
      }
    );

    await this.memoryStore.storeConversation(
      request.userId,
      request.sessionId,
      {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        metadata: response.metadata
      }
    );

    return response;
  }

  private selectAgent(userType: UserType): BaseAgent {
    const agent = this.agents.get(userType);
    
    if (!agent) {
      // Fallback to platform orchestrator for unknown user types
      return new PlatformOrchestratorAgent(this.client, this.config);
    }

    return agent;
  }

  async clearSession(userId: string, sessionId: string): Promise<void> {
    await this.memoryStore.clearSession(userId, sessionId);
  }

  async getSessionHistory(userId: string, sessionId: string): Promise<Message[]> {
    return this.memoryStore.getConversationHistory(userId, sessionId);
  }
}