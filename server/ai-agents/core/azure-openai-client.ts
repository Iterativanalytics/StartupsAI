import OpenAI from "openai";
import { AgentConfig } from "./agent-engine";
import { normalizeEndpoint } from "../../utils/azureUtils";

export class AzureOpenAIClient {
  private client: OpenAI;
  private deployment: string;
  
  constructor(config: AgentConfig) {
    if (config.useAzure && config.azureEndpoint) {
      // Use deployment from config or default to gpt-4
      const deployment = config.azureDeployment || 'gpt-4';
      
      const normalizedEndpoint = normalizeEndpoint(config.azureEndpoint);
      
      // Azure OpenAI configuration
      this.client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: { "api-key": config.apiKey },
      });
      this.deployment = deployment;
    } else {
      // Standard OpenAI configuration
      this.client = new OpenAI({
        apiKey: config.apiKey,
      });
      this.deployment = config.model || 'gpt-4';
    }
  }
  
  async generateResponse(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<string> {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      });
      
      return response.choices[0]?.message?.content || "I'm having trouble generating a response right now.";
    } catch (error) {
      console.error('Azure OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
  
  async generateStructuredResponse<T>(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    responseFormat: any,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<T> {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1500,
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content) as T;
    } catch (error) {
      console.error('Azure OpenAI structured response error:', error);
      throw new Error('Failed to generate structured AI response');
    }
  }
  
  async streamResponse(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    onChunk: (chunk: string) => void,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<void> {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const stream = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: true,
      });
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error('Azure OpenAI streaming error:', error);
      throw new Error('Failed to stream AI response');
    }
  }
  
  // normalizeEndpoint is now imported from shared utils
}
