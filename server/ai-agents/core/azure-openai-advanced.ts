/**
 * Advanced Azure OpenAI Integration for Co-Founder Agent
 * Extends base Azure OpenAI client with advanced features:
 * - Function calling for structured outputs
 * - Streaming with function calls
 * - Advanced prompt engineering
 * - Token optimization
 * - Response caching
 * - Embeddings for semantic search
 */

import { AgentConfig } from "./agent-engine";
import { normalizeEndpoint } from "../../utils/azureUtils";
import { createOpenAIClient, createEmbeddingClient, getDeploymentName, getEmbeddingDeploymentName } from "../../utils/openaiClient";

// Dynamic import for OpenAI to avoid type errors
// In actual runtime, this is imported from the base client
type OpenAIClient = any;

export interface FunctionCall {
  name: string;
  arguments: any;
}

export interface StreamChunk {
  content?: string;
  functionCall?: FunctionCall;
  done: boolean;
}

export interface EmbeddingResult {
  embedding: number[];
  text: string;
}

export class AzureOpenAIAdvanced {
  private client: OpenAIClient;
  private deployment: string;
  private embeddingDeployment: string;
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
    
    // Use centralized client creation
    this.client = createOpenAIClient(config);
    this.deployment = getDeploymentName(config);
    this.embeddingDeployment = getEmbeddingDeploymentName(config);
  }
  
  /**
   * Generate response with function calling support
   */
  async generateWithFunctions(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    functions: Array<{
      name: string;
      description: string;
      parameters: any;
    }> = [],
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<{
    content: string;
    functionCall?: FunctionCall;
  }> {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const tools = functions.map(fn => ({
        type: 'function' as const,
        function: {
          name: fn.name,
          description: fn.description,
          parameters: fn.parameters
        }
      }));
      
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1500,
      });
      
      const choice = response.choices[0];
      const message = choice?.message;
      
      // Check if function was called
      if (message?.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        return {
          content: message.content || '',
          functionCall: {
            name: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments)
          }
        };
      }
      
      return {
        content: message?.content || "I'm having trouble generating a response right now."
      };
    } catch (error) {
      console.error('Azure OpenAI function calling error:', error);
      throw new Error('Failed to generate AI response with functions');
    }
  }
  
  /**
   * Stream response with real-time chunks
   */
  async streamWithFunctions(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    functions: Array<{
      name: string;
      description: string;
      parameters: any;
    }> = [],
    onChunk: (chunk: StreamChunk) => void,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<void> {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const tools = functions.map(fn => ({
        type: 'function' as const,
        function: {
          name: fn.name,
          description: fn.description,
          parameters: fn.parameters
        }
      }));
      
      const stream = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1500,
        stream: true,
      });
      
      let functionCallBuffer = { name: '', arguments: '' };
      
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        
        if (delta?.content) {
          onChunk({ content: delta.content, done: false });
        }
        
        // Handle function calls
        if (delta?.tool_calls) {
          const toolCall = delta.tool_calls[0];
          if (toolCall?.function?.name) {
            functionCallBuffer.name = toolCall.function.name;
          }
          if (toolCall?.function?.arguments) {
            functionCallBuffer.arguments += toolCall.function.arguments;
          }
        }
        
        // Check if stream is done
        if (chunk.choices[0]?.finish_reason) {
          if (functionCallBuffer.name) {
            onChunk({
              functionCall: {
                name: functionCallBuffer.name,
                arguments: JSON.parse(functionCallBuffer.arguments)
              },
              done: true
            });
          } else {
            onChunk({ done: true });
          }
        }
      }
    } catch (error) {
      console.error('Azure OpenAI streaming error:', error);
      throw new Error('Failed to stream AI response');
    }
  }
  
  /**
   * Generate embeddings for semantic search
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use centralized embedding client creation
      const embeddingClient = createEmbeddingClient(this.config, this.embeddingDeployment);
      
      const response = await embeddingClient.embeddings.create({
        model: this.embeddingDeployment,
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Azure OpenAI embedding error:', error);
      throw new Error('Failed to generate embedding');
    }
  }
  
  /**
   * Batch generate embeddings for multiple texts
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      // Use centralized embedding client creation
      const embeddingClient = createEmbeddingClient(this.config, this.embeddingDeployment);
      
      const response = await embeddingClient.embeddings.create({
        model: this.embeddingDeployment,
        input: texts,
      });
      
      return response.data.map((item: any, index: number) => ({
        embedding: item.embedding,
        text: texts[index]
      }));
    } catch (error) {
      console.error('Azure OpenAI batch embedding error:', error);
      throw new Error('Failed to generate embeddings');
    }
  }
  
  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  /**
   * Find most similar texts to a query using embeddings
   */
  async findSimilar(
    query: string,
    candidates: string[],
    topK: number = 5
  ): Promise<Array<{ text: string; similarity: number; index: number }>> {
    const queryEmbedding = await this.generateEmbedding(query);
    const candidateEmbeddings = await this.generateEmbeddings(candidates);
    
    const similarities = candidateEmbeddings.map((result, index) => ({
      text: result.text,
      similarity: this.cosineSimilarity(queryEmbedding, result.embedding),
      index
    }));
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
  
  /**
   * Advanced prompt engineering with chain-of-thought
   */
  async generateWithChainOfThought(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<{
    content: string;
    reasoning: string;
  }> {
    try {
      const enhancedPrompt = `${systemPrompt}

When responding, think through your answer step by step:
1. First, understand what the entrepreneur is really asking
2. Consider the context and implications
3. Think about potential approaches
4. Choose the best approach and explain why

Then provide your response.`;
      
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: enhancedPrompt },
        ...conversationHistory,
        { role: 'user', content: `${userMessage}\n\nPlease think through this step by step before responding.` }
      ];
      
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      });
      
      const fullResponse = response.choices[0]?.message?.content || '';
      
      // Try to extract reasoning and final answer
      const reasoningMatch = fullResponse.match(/(?:reasoning|thinking|analysis):?(.*?)(?:answer|response|conclusion):/i);
      const reasoning = reasoningMatch ? reasoningMatch[1].trim() : '';
      const content = reasoning ? fullResponse.substring(fullResponse.lastIndexOf(reasoning) + reasoning.length).trim() : fullResponse;
      
      return {
        content,
        reasoning
      };
    } catch (error) {
      console.error('Azure OpenAI chain-of-thought error:', error);
      throw new Error('Failed to generate chain-of-thought response');
    }
  }
  
  /**
   * Generate multiple perspectives on a decision
   */
  async generateMultiplePerspectives(
    decision: string,
    context: string,
    perspectives: string[] = ['optimistic', 'pessimistic', 'realistic', 'data-driven']
  ): Promise<Array<{
    perspective: string;
    analysis: string;
  }>> {
    const results = await Promise.all(
      perspectives.map(async (perspective) => {
        const systemPrompt = `You are a ${perspective} business advisor analyzing a decision.
        Provide your perspective based on this lens: ${this.getPerspectiveDescription(perspective)}`;
        
        const response = await this.client.chat.completions.create({
          model: this.deployment,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Decision: ${decision}\n\nContext: ${context}\n\nWhat's your ${perspective} perspective?` }
          ],
          temperature: 0.8,
          max_tokens: 500,
        });
        
        return {
          perspective,
          analysis: response.choices[0]?.message?.content || ''
        };
      })
    );
    
    return results;
  }
  
  private getPerspectiveDescription(perspective: string): string {
    const descriptions: Record<string, string> = {
      'optimistic': 'Focus on best-case scenarios and opportunities. Be encouraging and highlight potential wins.',
      'pessimistic': 'Focus on risks and what could go wrong. Be cautious and identify potential pitfalls.',
      'realistic': 'Balance optimism and pessimism. Consider likely outcomes based on typical patterns.',
      'data-driven': 'Focus on facts, metrics, and data. Base analysis on numbers and evidence.',
      'strategic': 'Focus on long-term implications and strategic alignment.',
      'tactical': 'Focus on immediate execution and practical steps.'
    };
    return descriptions[perspective] || 'Provide a balanced perspective.';
  }
  
  /**
   * Optimize token usage by summarizing long conversations
   */
  async summarizeConversation(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    try {
      const conversationText = messages
        .map(msg => `${msg.role === 'user' ? 'Entrepreneur' : 'Co-Founder'}: ${msg.content}`)
        .join('\n\n');
      
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages: [
          {
            role: 'system',
            content: 'Summarize this conversation between an entrepreneur and their AI co-founder, preserving key decisions, insights, and action items.'
          },
          {
            role: 'user',
            content: conversationText
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });
      
      return response.choices[0]?.message?.content || 'Unable to summarize conversation.';
    } catch (error) {
      console.error('Azure OpenAI summarization error:', error);
      throw new Error('Failed to summarize conversation');
    }
  }
  
  /**
   * Estimate token count for text
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Check if conversation history is too long and needs summarization
   */
  shouldSummarize(messages: Array<{ role: string; content: string }>, maxTokens: number = 8000): boolean {
    const totalTokens = messages.reduce((sum, msg) => sum + this.estimateTokens(msg.content), 0);
    return totalTokens > maxTokens;
  }
}