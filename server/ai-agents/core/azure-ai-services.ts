/**
 * Azure AI Services Integration
 * Provides additional AI capabilities beyond Azure OpenAI:
 * - Content Safety (toxicity detection, content moderation)
 * - Text Analytics (sentiment analysis, key phrase extraction)
 * - Language Understanding
 */

import { normalizeEndpoint, basicSentimentAnalysis } from '../../utils/azureUtils';

interface AzureAIConfig {
  endpoint: string;
  apiKey: string;
}

export class AzureAIServices {
  private config: AzureAIConfig;
  
  constructor() {
    const endpoint = process.env.AZURE_AI_ENDPOINT || '';
    const apiKey = process.env.AZURE_AI_API_KEY || '';
    
    // Validate endpoint format - must be a cognitive services endpoint
    const isValidEndpoint = endpoint && endpoint.includes('cognitiveservices.azure.com');
    
    this.config = {
      endpoint: isValidEndpoint ? normalizeEndpoint(endpoint) : '',
      apiKey: isValidEndpoint ? apiKey : ''
    };
    
    if (this.config.endpoint && this.config.apiKey) {
      console.log('✓ Azure AI Services configured:', this.config.endpoint);
    } else if (endpoint && !isValidEndpoint) {
      console.warn('⚠ Azure AI Services endpoint invalid (must be *.cognitiveservices.azure.com). Azure AI features disabled.');
    }
  }
  
  isConfigured(): boolean {
    return !!(this.config.endpoint && this.config.apiKey);
  }
  
  /**
   * Analyze sentiment of text using Azure AI
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    scores: {
      positive: number;
      negative: number;
      neutral: number;
    };
  }> {
    if (!this.isConfigured()) {
      // Fallback to basic sentiment analysis
      return basicSentimentAnalysis(text);
    }
    
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/sentiment`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documents: [
            {
              id: '1',
              text: text,
              language: 'en'
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Azure AI Services error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const doc = data.documents[0];
      
      return {
        sentiment: doc.sentiment,
        scores: doc.confidenceScores
      };
    } catch (error) {
      console.error('Azure AI sentiment analysis error:', error);
      return basicSentimentAnalysis(text);
    }
  }
  
  /**
   * Check content safety using Azure Content Safety
   */
  async checkContentSafety(text: string): Promise<{
    safe: boolean;
    categories: {
      hate: number;
      selfHarm: number;
      sexual: number;
      violence: number;
    };
  }> {
    if (!this.isConfigured()) {
      // When not configured, assume safe (don't block conversations)
      return {
        safe: true,
        categories: {
          hate: 0,
          selfHarm: 0,
          sexual: 0,
          violence: 0
        }
      };
    }
    
    try {
      const response = await fetch(`${this.config.endpoint}/contentsafety/text:analyze?api-version=2023-10-01`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text
        })
      });
      
      if (!response.ok) {
        throw new Error(`Azure Content Safety error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if any category is above threshold (2 = medium severity)
      const safe = !data.categoriesAnalysis.some((cat: any) => cat.severity > 2);
      
      return {
        safe,
        categories: {
          hate: data.categoriesAnalysis.find((c: any) => c.category === 'Hate')?.severity || 0,
          selfHarm: data.categoriesAnalysis.find((c: any) => c.category === 'SelfHarm')?.severity || 0,
          sexual: data.categoriesAnalysis.find((c: any) => c.category === 'Sexual')?.severity || 0,
          violence: data.categoriesAnalysis.find((c: any) => c.category === 'Violence')?.severity || 0
        }
      };
    } catch (error) {
      console.error('Azure Content Safety error:', error);
      // When service fails, assume safe but log warning (don't block legitimate conversations)
      console.warn('Content safety check failed - allowing message through');
      return {
        safe: true,
        categories: {
          hate: 0,
          selfHarm: 0,
          sexual: 0,
          violence: 0
        }
      };
    }
  }
  
  /**
   * Extract key phrases from text
   */
  async extractKeyPhrases(text: string): Promise<string[]> {
    if (!this.isConfigured()) {
      // Fallback - return empty array
      return [];
    }
    
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/keyPhrases`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documents: [
            {
              id: '1',
              text: text,
              language: 'en'
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Azure AI Services error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.documents[0]?.keyPhrases || [];
    } catch (error) {
      console.error('Azure AI key phrase extraction error:', error);
      return [];
    }
  }
  
  // basicSentimentAnalysis is now imported from shared utils
  
  // normalizeEndpoint is now imported from shared utils
}

// Export singleton instance
export const azureAIServices = new AzureAIServices();
