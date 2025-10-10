import { AgentResponse, AgentType, Insight, AgentAction } from '../types';

export class ResponseHandler {
  processResponse(
    content: string,
    agentType: AgentType,
    metadata?: Record<string, any>
  ): AgentResponse {
    const response: AgentResponse = {
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      agentType,
      timestamp: new Date(),
      metadata: metadata || {}
    };

    // Extract insights from response
    response.insights = this.extractInsights(content);

    // Extract suggested actions
    response.actions = this.extractActions(content);

    // Extract suggestions for next steps
    response.suggestions = this.extractSuggestions(content);

    return response;
  }

  private extractInsights(content: string): Insight[] {
    const insights: Insight[] = [];

    // Pattern matching for common insight indicators
    const warningPatterns = [
      /⚠️.*?(?:\n|$)/g,
      /warning:.*?(?:\n|$)/gi,
      /risk:.*?(?:\n|$)/gi,
      /concern:.*?(?:\n|$)/gi
    ];

    const opportunityPatterns = [
      /💡.*?(?:\n|$)/g,
      /opportunity:.*?(?:\n|$)/gi,
      /potential:.*?(?:\n|$)/gi
    ];

    const recommendationPatterns = [
      /recommendation:.*?(?:\n|$)/gi,
      /suggest:.*?(?:\n|$)/gi,
      /consider:.*?(?:\n|$)/gi
    ];

    // Extract warnings/risks
    warningPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          insights.push({
            type: 'warning',
            title: 'Warning',
            description: match.trim(),
            priority: 'high',
            actionable: true
          });
        });
      }
    });

    // Extract opportunities
    opportunityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          insights.push({
            type: 'opportunity',
            title: 'Opportunity',
            description: match.trim(),
            priority: 'medium',
            actionable: true
          });
        });
      }
    });

    // Extract recommendations
    recommendationPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          insights.push({
            type: 'recommendation',
            title: 'Recommendation',
            description: match.trim(),
            priority: 'medium',
            actionable: true
          });
        });
      }
    });

    return insights.slice(0, 5); // Limit to top 5 insights
  }

  private extractActions(content: string): AgentAction[] {
    const actions: AgentAction[] = [];

    // Pattern matching for action items
    const actionPatterns = [
      /action:.*?(?:\n|$)/gi,
      /next step:.*?(?:\n|$)/gi,
      /you should:.*?(?:\n|$)/gi
    ];

    actionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          actions.push({
            type: 'task',
            description: match.trim(),
            parameters: {},
            automated: false,
            requiresApproval: true
          });
        });
      }
    });

    return actions.slice(0, 3); // Limit to top 3 actions
  }

  private extractSuggestions(content: string): string[] {
    const suggestions: string[] = [];

    // Look for bullet points or numbered lists
    const listPattern = /^[\-\*\d+\.]\s+(.+)$/gm;
    const matches = content.match(listPattern);

    if (matches) {
      suggestions.push(...matches.slice(0, 5).map(m => m.trim()));
    }

    return suggestions;
  }

  formatStreamingChunk(chunk: string): string {
    // Clean up any artifacts from streaming
    return chunk.replace(/\[DONE\]/g, '').trim();
  }
}