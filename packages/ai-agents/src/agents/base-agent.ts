import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig, AgentContext, AgentResponse, AgentType, Tool } from '../types';
import { PromptBuilder } from '../core/prompt-builder';
import { ResponseHandler } from '../core/response-handler';

export abstract class BaseAgent {
  protected client: Anthropic;
  protected config: AgentConfig;
  protected promptBuilder: PromptBuilder;
  protected responseHandler: ResponseHandler;
  protected abstract agentType: AgentType;

  constructor(client: Anthropic, config: AgentConfig) {
    this.client = client;
    this.config = config;
    this.promptBuilder = new PromptBuilder();
    this.responseHandler = new ResponseHandler();
  }

  async execute(
    context: AgentContext,
    options: {
      tools?: Tool[];
      streaming?: boolean;
      taskType?: string;
    }
  ): Promise<AgentResponse> {
    const systemPrompt = this.promptBuilder.buildSystemPrompt(this.agentType, context);
    const userMessage = context.conversationHistory.length > 0
      ? context.conversationHistory[context.conversationHistory.length - 1].content
      : context.currentTask;

    try {
      const messages: Anthropic.MessageParam[] = this.buildMessages(context);

      const response = await this.client.messages.create({
        model: this.config.modelName || 'claude-3-5-sonnet-20241022',
        max_tokens: this.config.maxTokens || 4096,
        temperature: this.config.temperature || 0.7,
        system: systemPrompt,
        messages
      });

      const content = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      return this.responseHandler.processResponse(
        content,
        this.agentType,
        {
          model: response.model,
          usage: response.usage,
          stopReason: response.stop_reason
        }
      );
    } catch (error) {
      console.error(`Error in ${this.agentType} agent:`, error);
      throw error;
    }
  }

  async executeStreaming(
    context: AgentContext,
    tools: Tool[],
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    const systemPrompt = this.promptBuilder.buildSystemPrompt(this.agentType, context);
    const messages = this.buildMessages(context);

    let fullContent = '';

    try {
      const stream = await this.client.messages.create({
        model: this.config.modelName || 'claude-3-5-sonnet-20241022',
        max_tokens: this.config.maxTokens || 4096,
        temperature: this.config.temperature || 0.7,
        system: systemPrompt,
        messages,
        stream: true
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const chunk = event.delta.text;
          fullContent += chunk;
          onChunk(chunk);
        }
      }

      return this.responseHandler.processResponse(
        fullContent,
        this.agentType
      );
    } catch (error) {
      console.error(`Error in streaming ${this.agentType} agent:`, error);
      throw error;
    }
  }

  protected buildMessages(context: AgentContext): Anthropic.MessageParam[] {
    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      context.conversationHistory.forEach(msg => {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    return messages;
  }

  protected async analyzeData(data: any): Promise<any> {
    // Base implementation for data analysis
    // Override in specific agents for specialized analysis
    return data;
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    // Base implementation for insight generation
    // Override in specific agents for specialized insights
    return [];
  }
}