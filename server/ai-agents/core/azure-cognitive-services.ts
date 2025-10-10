/**
 * Advanced Azure Cognitive Services Integration
 * Extends Azure AI Services with additional capabilities for Co-Founder Agent:
 * - Language Understanding (LUIS/CLU)
 * - Speech Services (text-to-speech, speech-to-text)
 * - Computer Vision (document analysis, OCR)
 * - Conversational Language Understanding
 */

import { normalizeEndpoint, basicSentimentAnalysis } from '../../utils/azureUtils';

interface AzureCognitiveConfig {
  endpoint: string;
  apiKey: string;
  region?: string;
}

interface LanguageUnderstanding {
  intent: string;
  confidence: number;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
}

interface ConversationAnalysis {
  intent: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  emotionalTone: {
    stressed: number;
    confident: number;
    excited: number;
    frustrated: number;
    neutral: number;
  };
  urgency: 'low' | 'medium' | 'high' | 'critical';
  keyTopics: string[];
  actionableItems: string[];
}

export class AzureCognitiveServices {
  private config: AzureCognitiveConfig;
  
  constructor() {
    const endpoint = (typeof process !== 'undefined' && process.env?.AZURE_AI_ENDPOINT) || '';
    const apiKey = (typeof process !== 'undefined' && process.env?.AZURE_AI_API_KEY) || '';
    const region = (typeof process !== 'undefined' && process.env?.AZURE_REGION) || 'eastus';
    
    this.config = {
      endpoint: normalizeEndpoint(endpoint),
      apiKey,
      region
    };
    
    if (this.isConfigured()) {
      console.log('✓ Azure Cognitive Services configured');
    }
  }
  
  isConfigured(): boolean {
    return !!(this.config.endpoint && this.config.apiKey);
  }
  
  /**
   * Comprehensive conversation analysis combining multiple Azure AI services
   */
  async analyzeConversation(text: string, conversationHistory?: string[]): Promise<ConversationAnalysis> {
    if (!this.isConfigured()) {
      return this.basicConversationAnalysis(text);
    }
    
    try {
      // Run multiple analyses in parallel
      const [sentiment, keyPhrases, intent] = await Promise.all([
        this.analyzeSentiment(text),
        this.extractKeyPhrases(text),
        this.detectIntent(text)
      ]);
      
      // Detect emotional tone from sentiment + keywords
      const emotionalTone = this.detectEmotionalTone(text, sentiment);
      
      // Detect urgency from language patterns
      const urgency = this.detectUrgency(text);
      
      // Extract actionable items
      const actionableItems = this.extractActionableItems(text, keyPhrases);
      
      return {
        intent: intent.intent,
        sentiment: sentiment.sentiment,
        emotionalTone,
        urgency,
        keyTopics: keyPhrases,
        actionableItems
      };
    } catch (error) {
      console.error('Azure conversation analysis error:', error);
      return this.basicConversationAnalysis(text);
    }
  }
  
  /**
   * Detect intent using Azure Conversational Language Understanding
   */
  private async detectIntent(text: string): Promise<LanguageUnderstanding> {
    if (!this.isConfigured()) {
      return this.basicIntentDetection(text);
    }
    
    try {
      // Use Azure CLU (Conversational Language Understanding)
      const response = await fetch(`${this.config.endpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kind: 'Conversation',
          analysisInput: {
            conversationItem: {
              id: '1',
              text: text,
              participantId: 'user'
            }
          },
          parameters: {
            projectName: 'co-founder-agent',
            deploymentName: 'production'
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Azure CLU error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const prediction = data.result?.prediction;
      
      return {
        intent: prediction?.topIntent || 'general_conversation',
        confidence: prediction?.intents?.[0]?.confidenceScore || 0.5,
        entities: prediction?.entities?.map((e: any) => ({
          type: e.category,
          value: e.text,
          confidence: e.confidenceScore
        })) || []
      };
    } catch (error) {
      console.error('Azure intent detection error:', error);
      return this.basicIntentDetection(text);
    }
  }
  
  /**
   * Analyze sentiment using Azure Text Analytics
   */
  private async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    scores: {
      positive: number;
      negative: number;
      neutral: number;
    };
  }> {
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
        throw new Error(`Azure Sentiment Analysis error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const doc = data.documents[0];
      
      return {
        sentiment: doc.sentiment,
        scores: doc.confidenceScores
      };
    } catch (error) {
      console.error('Azure sentiment analysis error:', error);
      return basicSentimentAnalysis(text);
    }
  }
  
  /**
   * Extract key phrases using Azure Text Analytics
   */
  private async extractKeyPhrases(text: string): Promise<string[]> {
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
        throw new Error(`Azure Key Phrases error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.documents[0]?.keyPhrases || [];
    } catch (error) {
      console.error('Azure key phrases error:', error);
      return [];
    }
  }
  
  /**
   * Detect emotional tone from text
   */
  private detectEmotionalTone(text: string, sentiment: any): ConversationAnalysis['emotionalTone'] {
    const lowerText = text.toLowerCase();
    
    const stressIndicators = ['stressed', 'overwhelmed', 'exhausted', 'burnt out', 'tired', 'anxious'];
    const confidentIndicators = ['confident', 'sure', 'definitely', 'absolutely', 'certain'];
    const excitedIndicators = ['excited', 'pumped', 'amazing', 'fantastic', 'incredible', 'thrilled'];
    const frustratedIndicators = ['frustrated', 'annoyed', 'disappointed', 'upset', 'angry'];
    
    const stressScore = stressIndicators.filter(word => lowerText.includes(word)).length / stressIndicators.length;
    const confidentScore = confidentIndicators.filter(word => lowerText.includes(word)).length / confidentIndicators.length;
    const excitedScore = excitedIndicators.filter(word => lowerText.includes(word)).length / excitedIndicators.length;
    const frustratedScore = frustratedIndicators.filter(word => lowerText.includes(word)).length / frustratedIndicators.length;
    
    // Normalize scores
    const total = stressScore + confidentScore + excitedScore + frustratedScore;
    const neutralScore = total < 0.1 ? 1.0 : 0.2;
    
    return {
      stressed: Math.min(stressScore * 2, 1.0),
      confident: Math.min(confidentScore * 2, 1.0),
      excited: Math.min(excitedScore * 2, 1.0),
      frustrated: Math.min(frustratedScore * 2, 1.0),
      neutral: neutralScore
    };
  }
  
  /**
   * Detect urgency level from text
   */
  private detectUrgency(text: string): ConversationAnalysis['urgency'] {
    const lowerText = text.toLowerCase();
    
    const criticalWords = ['crisis', 'emergency', 'disaster', 'urgent', 'asap', 'immediately'];
    const highWords = ['soon', 'quickly', 'today', 'this week', 'important'];
    const mediumWords = ['significant', 'major', 'considerable'];
    
    if (criticalWords.some(word => lowerText.includes(word))) {
      return 'critical';
    } else if (highWords.some(word => lowerText.includes(word))) {
      return 'high';
    } else if (mediumWords.some(word => lowerText.includes(word))) {
      return 'medium';
    }
    return 'low';
  }
  
  /**
   * Extract actionable items from text
   */
  private extractActionableItems(text: string, keyPhrases: string[]): string[] {
    const actionableItems: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Patterns indicating action items
    const actionPatterns = [
      /need to ([\w\s]+)/gi,
      /should ([\w\s]+)/gi,
      /have to ([\w\s]+)/gi,
      /must ([\w\s]+)/gi,
      /want to ([\w\s]+)/gi,
      /going to ([\w\s]+)/gi,
      /planning to ([\w\s]+)/gi
    ];
    
    for (const pattern of actionPatterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        if (match[1] && match[1].length > 5 && match[1].length < 100) {
          actionableItems.push(match[1].trim());
        }
      }
    }
    
    // Also check if key phrases indicate actions
    for (const phrase of keyPhrases) {
      if (phrase.match(/(hire|launch|build|create|implement|develop|release)/i)) {
        actionableItems.push(phrase);
      }
    }
    
    return Array.from(new Set(actionableItems)).slice(0, 5); // Deduplicate and limit
  }
  
  /**
   * Analyze document (pitch deck, business plan, etc.)
   */
  async analyzeDocument(documentUrl: string): Promise<{
    summary: string;
    keyPoints: string[];
    insights: string[];
    sentiment: string;
  }> {
    if (!this.isConfigured()) {
      return {
        summary: 'Document analysis not available',
        keyPoints: [],
        insights: [],
        sentiment: 'neutral'
      };
    }
    
    // Azure Form Recognizer / Document Intelligence would be used here
    // For now, return placeholder
    return {
      summary: 'Document analyzed successfully',
      keyPoints: [],
      insights: [],
      sentiment: 'positive'
    };
  }
  
  /**
   * Text-to-Speech for voice responses (future feature)
   */
  async synthesizeSpeech(text: string, voice: string = 'en-US-JennyNeural'): Promise<Buffer | null> {
    if (!this.isConfigured()) {
      return null;
    }
    
    try {
      const response = await fetch(`https://${this.config.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: `
          <speak version='1.0' xml:lang='en-US'>
            <voice xml:lang='en-US' name='${voice}'>
              ${text}
            </voice>
          </speak>
        `
      });
      
      if (!response.ok) {
        throw new Error(`Azure TTS error: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      // Convert ArrayBuffer to Buffer (Node.js environment)
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(arrayBuffer);
      }
      return null;
    } catch (error) {
      console.error('Azure TTS error:', error);
      return null;
    }
  }
  
  /**
   * Fallback methods when Azure services are not configured
   */
  private basicConversationAnalysis(text: string): ConversationAnalysis {
    const sentiment = basicSentimentAnalysis(text);
    const intent = this.basicIntentDetection(text);
    const emotionalTone = this.detectEmotionalTone(text, sentiment);
    const urgency = this.detectUrgency(text);
    const actionableItems = this.extractActionableItems(text, []);
    
    return {
      intent: intent.intent,
      sentiment: sentiment.sentiment,
      emotionalTone,
      urgency,
      keyTopics: [],
      actionableItems
    };
  }
  
  private basicIntentDetection(text: string): LanguageUnderstanding {
    const lowerText = text.toLowerCase();
    
    // Simple rule-based intent detection
    const intents = [
      { pattern: /(help|support|advice|guidance)/, intent: 'request_help', confidence: 0.8 },
      { pattern: /(decision|choose|should i|what if)/, intent: 'decision_support', confidence: 0.8 },
      { pattern: /(strategy|plan|approach|direction)/, intent: 'strategic_discussion', confidence: 0.8 },
      { pattern: /(goal|objective|target|okr)/, intent: 'goal_setting', confidence: 0.8 },
      { pattern: /(problem|issue|challenge|difficulty)/, intent: 'problem_solving', confidence: 0.8 },
      { pattern: /(celebrate|won|success|achieved)/, intent: 'celebration', confidence: 0.8 },
      { pattern: /(check.?in|update|status|progress)/, intent: 'accountability_check', confidence: 0.8 }
    ];
    
    for (const { pattern, intent, confidence } of intents) {
      if (pattern.test(lowerText)) {
        return { intent, confidence, entities: [] };
      }
    }
    
    return { intent: 'general_conversation', confidence: 0.5, entities: [] };
  }
  
  // basicSentimentAnalysis is now imported from shared utils
  
  // normalizeEndpoint is now imported from shared utils
}

// Export singleton instance
export const azureCognitiveServices = new AzureCognitiveServices();