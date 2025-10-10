import { AgentConfig, AgentContext, AgentResponse } from "./agent-engine";

/**
 * Base Agent class that all specialized agents can extend
 * Provides common functionality and structure
 */
export abstract class BaseAgent {
  protected config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }
  
  /**
   * Main execution method that all agents must implement
   */
  abstract execute(context: AgentContext, options: any): Promise<AgentResponse>;
  
  /**
   * Helper method to format responses consistently
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
}
