/**
 * Shared Azure Service Utilities
 * Common functions used across Azure service integrations
 */

/**
 * Normalize Azure endpoint URL to ensure proper trailing slash
 */
export function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return '';
  return endpoint.endsWith('/') ? endpoint : endpoint + '/';
}

/**
 * Basic sentiment analysis fallback when Azure services are unavailable
 */
export function basicSentimentAnalysis(text: string): {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
} {
  const lowerText = text.toLowerCase();
  
  // Comprehensive keyword lists
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'fantastic', 'love', 'best', 
    'excited', 'happy', 'success', 'won', 'achieved', 'wonderful', 'outstanding'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'hate', 'worst', 'disappointed', 'frustrated', 
    'angry', 'failed', 'lost', 'problem', 'issue', 'difficult'
  ];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) {
    return {
      sentiment: 'positive',
      scores: { positive: 0.7, negative: 0.1, neutral: 0.2 }
    };
  } else if (negativeCount > positiveCount) {
    return {
      sentiment: 'negative',
      scores: { positive: 0.1, negative: 0.7, neutral: 0.2 }
    };
  } else if (positiveCount > 0 && negativeCount > 0) {
    return {
      sentiment: 'mixed',
      scores: { positive: 0.4, negative: 0.4, neutral: 0.2 }
    };
  } else {
    return {
      sentiment: 'neutral',
      scores: { positive: 0.2, negative: 0.2, neutral: 0.6 }
    };
  }
}

/**
 * Validate Azure endpoint format
 */
export function isValidAzureEndpoint(endpoint: string, requiredDomain?: string): boolean {
  if (!endpoint) return false;
  
  try {
    const url = new URL(endpoint);
    if (requiredDomain) {
      return url.hostname.includes(requiredDomain);
    }
    return url.hostname.includes('azure.com');
  } catch {
    return false;
  }
}

/**
 * Create Azure API headers
 */
export function createAzureHeaders(apiKey: string, contentType: string = 'application/json'): Record<string, string> {
  return {
    'Ocp-Apim-Subscription-Key': apiKey,
    'Content-Type': contentType
  };
}

/**
 * Handle Azure API errors consistently
 */
export function handleAzureError(error: any, serviceName: string, fallbackMessage: string): never {
  console.error(`${serviceName} error:`, error);
  throw new Error(`${serviceName} failed: ${error.message || fallbackMessage}`);
}
