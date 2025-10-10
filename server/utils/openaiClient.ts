/**
 * OpenAI Client Factory
 * Centralized OpenAI client creation to eliminate duplication
 */

import { AgentConfig } from '../ai-agents/core/agent-engine';
import { normalizeEndpoint } from './azureUtils';

type OpenAIClient = any;

/**
 * Create OpenAI client for chat completions
 */
export function createOpenAIClient(config: AgentConfig): OpenAIClient {
  const OpenAI = require('openai').default;
  
  if (config.useAzure && config.azureEndpoint) {
    const deployment = config.azureDeployment || 'gpt-4';
    const normalizedEndpoint = normalizeEndpoint(config.azureEndpoint);
    
    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": config.apiKey },
    });
  } else {
    return new OpenAI({
      apiKey: config.apiKey,
    });
  }
}

/**
 * Create OpenAI client for embeddings
 */
export function createEmbeddingClient(
  config: AgentConfig,
  embeddingDeployment: string = 'text-embedding-ada-002'
): OpenAIClient {
  const OpenAI = require('openai').default;
  
  if (config.useAzure && config.azureEndpoint) {
    const normalizedEndpoint = normalizeEndpoint(config.azureEndpoint);
    
    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${normalizedEndpoint}openai/deployments/${embeddingDeployment}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": config.apiKey },
    });
  } else {
    return new OpenAI({
      apiKey: config.apiKey,
    });
  }
}

/**
 * Get deployment name based on configuration
 */
export function getDeploymentName(config: AgentConfig, defaultModel: string = 'gpt-4'): string {
  if (config.useAzure && config.azureDeployment) {
    return config.azureDeployment;
  }
  return config.model || defaultModel;
}

/**
 * Get embedding deployment name
 */
export function getEmbeddingDeploymentName(config: AgentConfig): string {
  return (config as any).azureEmbeddingDeployment || 'text-embedding-ada-002';
}
