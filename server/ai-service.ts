import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { z } from "zod";

// OpenAI integration from blueprint:javascript_openai
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

// Check for Azure OpenAI or standard OpenAI API key
const hasAzureApiKey = !!process.env.AZURE_OPENAI_API_KEY;
const hasOpenAIApiKey = !!process.env.OPENAI_API_KEY;
const useAzure = hasAzureApiKey && !!process.env.AZURE_OPENAI_ENDPOINT;

// Validate and log Azure configuration
if (!hasAzureApiKey && !hasOpenAIApiKey) {
  console.warn('No AI API key configured. AI features will be disabled.');
  console.warn('Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT for Azure OpenAI, or OPENAI_API_KEY for standard OpenAI.');
} else if (useAzure) {
  if (!process.env.AZURE_OPENAI_DEPLOYMENT) {
    console.warn('⚠ AZURE_OPENAI_DEPLOYMENT not set. Defaulting to "gpt-4"');
  }
  console.log('✓ Azure OpenAI configured:', process.env.AZURE_OPENAI_ENDPOINT);
  console.log('  Deployment:', process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4 (default)');
} else {
  console.log('✓ Standard OpenAI configured');
}

// Helper to normalize endpoint URLs
function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return '';
  return endpoint.endsWith('/') ? endpoint : endpoint + '/';
}

// Use Azure deployment name or standard model
const AI_MODEL = useAzure 
  ? (process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4")
  : (process.env.AI_MODEL || "gpt-4o");

// Configure OpenAI client for Azure or standard OpenAI
const openai = (hasAzureApiKey || hasOpenAIApiKey) ? new OpenAI(
  useAzure ? {
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    baseURL: `${normalizeEndpoint(process.env.AZURE_OPENAI_ENDPOINT || '')}openai/deployments/${AI_MODEL}`,
    defaultQuery: { "api-version": "2024-08-01-preview" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
    timeout: 30000,
    maxRetries: 2
  } : {
    apiKey: process.env.OPENAI_API_KEY!,
    timeout: 30000,
    maxRetries: 2
  }
) : null;

// Validation schemas for AI responses
const MarketAnalysisSchema = z.object({
  trends: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
  marketSize: z.string(),
  growthRate: z.string(),
  keyPlayers: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

const CompetitiveAnalysisSchema = z.object({
  competitors: z.array(z.object({
    name: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    marketShare: z.string(),
    differentiation: z.string()
  })),
  competitiveAdvantages: z.array(z.string()),
  marketPosition: z.string(),
  recommendations: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

const BusinessGuidanceSchema = z.object({
  response: z.string(),
  actionItems: z.array(z.string()),
  resources: z.array(z.string()),
  nextSteps: z.array(z.string())
});

const RiskAssessmentSchema = z.object({
  overallRisk: z.enum(["low", "medium", "high"]),
  riskFactors: z.array(z.object({
    category: z.string(),
    level: z.enum(["low", "medium", "high"]),
    description: z.string(),
    mitigation: z.string()
  })),
  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1)
});

const FinancialProjectionAccuracySchema = z.object({
  accuracy: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  deviations: z.array(z.object({
    metric: z.string(),
    projected: z.number(),
    actual: z.number(),
    variance: z.number()
  })),
  recommendations: z.array(z.string())
});

const SentimentAnalysisSchema = z.object({
  rating: z.number().min(1).max(5),
  confidence: z.number().min(0).max(1)
});

export interface MarketAnalysis {
  trends: string[];
  opportunities: string[];
  threats: string[];
  marketSize: string;
  growthRate: string;
  keyPlayers: string[];
  confidence: number;
}

export interface CompetitiveAnalysis {
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: string;
    differentiation: string;
  }>;
  competitiveAdvantages: string[];
  marketPosition: string;
  recommendations: string[];
  confidence: number;
}

export interface BusinessGuidance {
  response: string;
  actionItems: string[];
  resources: string[];
  nextSteps: string[];
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high";
  riskFactors: Array<{
    category: string;
    level: "low" | "medium" | "high";
    description: string;
    mitigation: string;
  }>;
  score: number;
  confidence: number;
}

export interface FinancialProjectionAccuracy {
  accuracy: number;
  confidence: number;
  deviations: Array<{
    metric: string;
    projected: number;
    actual: number;
    variance: number;
  }>;
  recommendations: string[];
}

// Helper function to check if API key is available
function checkApiKeyAvailable(): void {
  if (!openai) {
    throw new Error('AI features are not available. Configure AZURE_OPENAI_API_KEY or OPENAI_API_KEY.');
  }
}

// Helper function to safely parse and validate AI responses
async function parseAndValidateAIResponse<T>(
  content: string | null | undefined,
  schema: z.ZodSchema<T>,
  errorContext: string
): Promise<T> {
  if (!content) {
    throw new Error(`No content received from AI model for ${errorContext}`);
  }

  try {
    const parsedContent = JSON.parse(content);
    return schema.parse(parsedContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid AI response format for ${errorContext}: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`AI returned invalid JSON format for ${errorContext}`);
    }
    throw error;
  }
}

export class AIService {
  
  async analyzeMarketTrends(industry: string, businessDescription: string): Promise<MarketAnalysis> {
    checkApiKeyAvailable();
    try {
      const prompt = `Analyze current market trends for ${industry} industry. Business context: ${businessDescription}. 
      Provide analysis in JSON format with trends, opportunities, threats, marketSize, growthRate, keyPlayers, and confidence (0-1).`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a market research expert. Provide comprehensive market analysis in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        MarketAnalysisSchema,
        "market trends analysis"
      );
    } catch (error) {
      throw new Error(`Failed to analyze market trends: ${error}`);
    }
  }

  async performCompetitiveAnalysis(industry: string, businessDescription: string, competitors?: string[]): Promise<CompetitiveAnalysis> {
    checkApiKeyAvailable();
    try {
      const competitorContext = competitors ? `Known competitors: ${competitors.join(", ")}` : "";
      const prompt = `Perform competitive analysis for ${industry} industry. Business: ${businessDescription}. ${competitorContext}
      Analyze competitors, identify competitive advantages, market position, and provide strategic recommendations. Return JSON format.`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL, 
        messages: [
          {
            role: "system",
            content: "You are a competitive intelligence expert. Analyze competition and provide strategic insights in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        CompetitiveAnalysisSchema,
        "competitive analysis"
      );
    } catch (error) {
      throw new Error(`Failed to perform competitive analysis: ${error}`);
    }
  }

  async provideBusinessGuidance(question: string, businessContext: string): Promise<BusinessGuidance> {
    checkApiKeyAvailable();
    try {
      const prompt = `Business question: ${question}. Business context: ${businessContext}. 
      Provide expert guidance with response, actionItems, resources, and nextSteps in JSON format.`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system", 
            content: "You are an experienced business advisor. Provide practical, actionable guidance in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        BusinessGuidanceSchema,
        "business guidance"
      );
    } catch (error) {
      throw new Error(`Failed to provide business guidance: ${error}`);
    }
  }

  async assessBusinessRisk(businessPlan: string, financials: any): Promise<RiskAssessment> {
    checkApiKeyAvailable();
    try {
      const prompt = `Assess business risk based on business plan: ${businessPlan.substring(0, 2000)}... 
      Financial data: ${JSON.stringify(financials)}. 
      Analyze risk factors, overall risk level, score (0-100), and provide mitigation strategies in JSON format.`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a risk assessment expert. Evaluate business risks and provide comprehensive analysis in JSON format."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        RiskAssessmentSchema,
        "risk assessment"
      );
    } catch (error) {
      throw new Error(`Failed to assess business risk: ${error}`);
    }
  }

  async validateFinancialProjections(projections: any, actualData?: any): Promise<FinancialProjectionAccuracy> {
    checkApiKeyAvailable();
    try{
      const prompt = `Validate financial projections: ${JSON.stringify(projections)}. 
      ${actualData ? `Actual data for comparison: ${JSON.stringify(actualData)}` : ""}
      Assess accuracy, identify deviations, and provide recommendations in JSON format.`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a financial analyst expert. Validate projections and assess accuracy in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        FinancialProjectionAccuracySchema,
        "financial projection validation"
      );
    } catch (error) {
      throw new Error(`Failed to validate financial projections: ${error}`);
    }
  }

  async generateBusinessContent(section: string, context: string, businessInfo: any): Promise<string> {
    checkApiKeyAvailable();
    try {
      const prompt = `Generate content for business plan section: ${section}. 
      Context: ${context}. Business info: ${JSON.stringify(businessInfo)}. 
      Create professional, comprehensive content for this section.`;

      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert business plan writer. Create compelling, professional content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      throw new Error(`Failed to generate business content: ${error}`);
    }
  }

  async analyzeSentiment(text: string): Promise<{ rating: number; confidence: number }> {
    checkApiKeyAvailable();
    try {
      const response = await openai!.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      return await parseAndValidateAIResponse(
        response.choices[0]?.message?.content,
        SentimentAnalysisSchema,
        "sentiment analysis"
      );
    } catch (error) {
      throw new Error("Failed to analyze sentiment: " + error);
    }
  }
}

export const aiService = new AIService();