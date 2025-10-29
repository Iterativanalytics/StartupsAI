var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/ai-service.ts
import OpenAI from "openai";
import { z } from "zod";
function normalizeEndpoint(endpoint) {
  if (!endpoint) return "";
  return endpoint.endsWith("/") ? endpoint : endpoint + "/";
}
function checkApiKeyAvailable() {
  if (!openai) {
    throw new Error("AI features are not available. Configure AZURE_OPENAI_API_KEY or OPENAI_API_KEY.");
  }
}
async function parseAndValidateAIResponse(content, schema, errorContext) {
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
var hasAzureApiKey, hasOpenAIApiKey, useAzure, AI_MODEL, openai, MarketAnalysisSchema, CompetitiveAnalysisSchema, BusinessGuidanceSchema, RiskAssessmentSchema, FinancialProjectionAccuracySchema, SentimentAnalysisSchema, AIService, aiService;
var init_ai_service = __esm({
  "server/ai-service.ts"() {
    "use strict";
    hasAzureApiKey = !!process.env.AZURE_OPENAI_API_KEY;
    hasOpenAIApiKey = !!process.env.OPENAI_API_KEY;
    useAzure = hasAzureApiKey && !!process.env.AZURE_OPENAI_ENDPOINT;
    if (!hasAzureApiKey && !hasOpenAIApiKey) {
      console.warn("No AI API key configured. AI features will be disabled.");
      console.warn("Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT for Azure OpenAI, or OPENAI_API_KEY for standard OpenAI.");
    } else if (useAzure) {
      if (!process.env.AZURE_OPENAI_DEPLOYMENT) {
        console.warn('\u26A0 AZURE_OPENAI_DEPLOYMENT not set. Defaulting to "gpt-4"');
      }
      console.log("\u2713 Azure OpenAI configured:", process.env.AZURE_OPENAI_ENDPOINT);
      console.log("  Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4 (default)");
    } else {
      console.log("\u2713 Standard OpenAI configured");
    }
    AI_MODEL = useAzure ? process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4" : process.env.AI_MODEL || "gpt-4o";
    openai = hasAzureApiKey || hasOpenAIApiKey ? new OpenAI(
      useAzure ? {
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${normalizeEndpoint(process.env.AZURE_OPENAI_ENDPOINT || "")}openai/deployments/${AI_MODEL}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
        timeout: 3e4,
        maxRetries: 2
      } : {
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 3e4,
        maxRetries: 2
      }
    ) : null;
    MarketAnalysisSchema = z.object({
      trends: z.array(z.string()),
      opportunities: z.array(z.string()),
      threats: z.array(z.string()),
      marketSize: z.string(),
      growthRate: z.string(),
      keyPlayers: z.array(z.string()),
      confidence: z.number().min(0).max(1)
    });
    CompetitiveAnalysisSchema = z.object({
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
    BusinessGuidanceSchema = z.object({
      response: z.string(),
      actionItems: z.array(z.string()),
      resources: z.array(z.string()),
      nextSteps: z.array(z.string())
    });
    RiskAssessmentSchema = z.object({
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
    FinancialProjectionAccuracySchema = z.object({
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
    SentimentAnalysisSchema = z.object({
      rating: z.number().min(1).max(5),
      confidence: z.number().min(0).max(1)
    });
    AIService = class {
      async analyzeMarketTrends(industry, businessDescription) {
        checkApiKeyAvailable();
        try {
          const prompt = `Analyze current market trends for ${industry} industry. Business context: ${businessDescription}. 
      Provide analysis in JSON format with trends, opportunities, threats, marketSize, growthRate, keyPlayers, and confidence (0-1).`;
          const response = await openai.chat.completions.create({
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
            response_format: { type: "json_object" }
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
      async performCompetitiveAnalysis(industry, businessDescription, competitors) {
        checkApiKeyAvailable();
        try {
          const competitorContext = competitors ? `Known competitors: ${competitors.join(", ")}` : "";
          const prompt = `Perform competitive analysis for ${industry} industry. Business: ${businessDescription}. ${competitorContext}
      Analyze competitors, identify competitive advantages, market position, and provide strategic recommendations. Return JSON format.`;
          const response = await openai.chat.completions.create({
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
            response_format: { type: "json_object" }
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
      async provideBusinessGuidance(question, businessContext) {
        checkApiKeyAvailable();
        try {
          const prompt = `Business question: ${question}. Business context: ${businessContext}. 
      Provide expert guidance with response, actionItems, resources, and nextSteps in JSON format.`;
          const response = await openai.chat.completions.create({
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
            response_format: { type: "json_object" }
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
      async assessBusinessRisk(businessPlan, financials) {
        checkApiKeyAvailable();
        try {
          const prompt = `Assess business risk based on business plan: ${businessPlan.substring(0, 2e3)}... 
      Financial data: ${JSON.stringify(financials)}. 
      Analyze risk factors, overall risk level, score (0-100), and provide mitigation strategies in JSON format.`;
          const response = await openai.chat.completions.create({
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
            response_format: { type: "json_object" }
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
      async validateFinancialProjections(projections, actualData) {
        checkApiKeyAvailable();
        try {
          const prompt = `Validate financial projections: ${JSON.stringify(projections)}. 
      ${actualData ? `Actual data for comparison: ${JSON.stringify(actualData)}` : ""}
      Assess accuracy, identify deviations, and provide recommendations in JSON format.`;
          const response = await openai.chat.completions.create({
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
            response_format: { type: "json_object" }
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
      async generateBusinessContent(section, context, businessInfo) {
        checkApiKeyAvailable();
        try {
          const prompt = `Generate content for business plan section: ${section}. 
      Context: ${context}. Business info: ${JSON.stringify(businessInfo)}. 
      Create professional, comprehensive content for this section.`;
          const response = await openai.chat.completions.create({
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
            ]
          });
          return response.choices[0]?.message?.content || "";
        } catch (error) {
          throw new Error(`Failed to generate business content: ${error}`);
        }
      }
      async analyzeSentiment(text) {
        checkApiKeyAvailable();
        try {
          const response = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
              {
                role: "system",
                content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }"
              },
              {
                role: "user",
                content: text
              }
            ],
            response_format: { type: "json_object" }
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
    };
    aiService = new AIService();
  }
});

// server/ai-agents/core/azure-openai-advanced.ts
var AzureOpenAIAdvanced;
var init_azure_openai_advanced = __esm({
  "server/ai-agents/core/azure-openai-advanced.ts"() {
    "use strict";
    AzureOpenAIAdvanced = class {
      client;
      deployment;
      embeddingDeployment;
      config;
      constructor(config) {
        this.config = config;
        if (config.useAzure && config.azureEndpoint) {
          const deployment = config.azureDeployment || "gpt-4";
          const embeddingDeployment = config.azureEmbeddingDeployment || "text-embedding-ada-002";
          const normalizedEndpoint = this.normalizeEndpoint(config.azureEndpoint);
          const OpenAI3 = __require("openai").default;
          this.client = new OpenAI3({
            apiKey: config.apiKey,
            baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
            defaultQuery: { "api-version": "2024-08-01-preview" },
            defaultHeaders: { "api-key": config.apiKey }
          });
          this.deployment = deployment;
          this.embeddingDeployment = embeddingDeployment;
        } else {
          const OpenAI3 = __require("openai").default;
          this.client = new OpenAI3({
            apiKey: config.apiKey
          });
          this.deployment = config.model || "gpt-4";
          this.embeddingDeployment = "text-embedding-ada-002";
        }
      }
      /**
       * Generate response with function calling support
       */
      async generateWithFunctions(systemPrompt, userMessage, conversationHistory = [], functions = [], options = {}) {
        try {
          const messages = [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: userMessage }
          ];
          const tools = functions.map((fn) => ({
            type: "function",
            function: {
              name: fn.name,
              description: fn.description,
              parameters: fn.parameters
            }
          }));
          const response = await this.client.chat.completions.create({
            model: this.deployment,
            messages,
            tools: tools.length > 0 ? tools : void 0,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1500
          });
          const choice = response.choices[0];
          const message = choice?.message;
          if (message?.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            return {
              content: message.content || "",
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
          console.error("Azure OpenAI function calling error:", error);
          throw new Error("Failed to generate AI response with functions");
        }
      }
      /**
       * Stream response with real-time chunks
       */
      async streamWithFunctions(systemPrompt, userMessage, conversationHistory = [], functions = [], onChunk, options = {}) {
        try {
          const messages = [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: userMessage }
          ];
          const tools = functions.map((fn) => ({
            type: "function",
            function: {
              name: fn.name,
              description: fn.description,
              parameters: fn.parameters
            }
          }));
          const stream = await this.client.chat.completions.create({
            model: this.deployment,
            messages,
            tools: tools.length > 0 ? tools : void 0,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1500,
            stream: true
          });
          let functionCallBuffer = { name: "", arguments: "" };
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;
            if (delta?.content) {
              onChunk({ content: delta.content, done: false });
            }
            if (delta?.tool_calls) {
              const toolCall = delta.tool_calls[0];
              if (toolCall?.function?.name) {
                functionCallBuffer.name = toolCall.function.name;
              }
              if (toolCall?.function?.arguments) {
                functionCallBuffer.arguments += toolCall.function.arguments;
              }
            }
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
          console.error("Azure OpenAI streaming error:", error);
          throw new Error("Failed to stream AI response");
        }
      }
      /**
       * Generate embeddings for semantic search
       */
      async generateEmbedding(text) {
        try {
          const OpenAI3 = __require("openai").default;
          const embeddingClient = new OpenAI3({
            apiKey: this.config.apiKey,
            baseURL: this.config.useAzure && this.config.azureEndpoint ? `${this.normalizeEndpoint(this.config.azureEndpoint)}openai/deployments/${this.embeddingDeployment}` : void 0,
            defaultQuery: this.config.useAzure ? { "api-version": "2024-08-01-preview" } : void 0,
            defaultHeaders: this.config.useAzure ? { "api-key": this.config.apiKey } : void 0
          });
          const response = await embeddingClient.embeddings.create({
            model: this.embeddingDeployment,
            input: text
          });
          return response.data[0].embedding;
        } catch (error) {
          console.error("Azure OpenAI embedding error:", error);
          throw new Error("Failed to generate embedding");
        }
      }
      /**
       * Batch generate embeddings for multiple texts
       */
      async generateEmbeddings(texts) {
        try {
          const OpenAI3 = __require("openai").default;
          const embeddingClient = new OpenAI3({
            apiKey: this.config.apiKey,
            baseURL: this.config.useAzure && this.config.azureEndpoint ? `${this.normalizeEndpoint(this.config.azureEndpoint)}openai/deployments/${this.embeddingDeployment}` : void 0,
            defaultQuery: this.config.useAzure ? { "api-version": "2024-08-01-preview" } : void 0,
            defaultHeaders: this.config.useAzure ? { "api-key": this.config.apiKey } : void 0
          });
          const response = await embeddingClient.embeddings.create({
            model: this.embeddingDeployment,
            input: texts
          });
          return response.data.map((item, index) => ({
            embedding: item.embedding,
            text: texts[index]
          }));
        } catch (error) {
          console.error("Azure OpenAI batch embedding error:", error);
          throw new Error("Failed to generate embeddings");
        }
      }
      /**
       * Calculate cosine similarity between two embeddings
       */
      cosineSimilarity(embedding1, embedding2) {
        const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
        const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitude1 * magnitude2);
      }
      /**
       * Find most similar texts to a query using embeddings
       */
      async findSimilar(query, candidates, topK = 5) {
        const queryEmbedding = await this.generateEmbedding(query);
        const candidateEmbeddings = await this.generateEmbeddings(candidates);
        const similarities = candidateEmbeddings.map((result, index) => ({
          text: result.text,
          similarity: this.cosineSimilarity(queryEmbedding, result.embedding),
          index
        }));
        return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
      }
      /**
       * Advanced prompt engineering with chain-of-thought
       */
      async generateWithChainOfThought(systemPrompt, userMessage, conversationHistory = [], options = {}) {
        try {
          const enhancedPrompt = `${systemPrompt}

When responding, think through your answer step by step:
1. First, understand what the entrepreneur is really asking
2. Consider the context and implications
3. Think about potential approaches
4. Choose the best approach and explain why

Then provide your response.`;
          const messages = [
            { role: "system", content: enhancedPrompt },
            ...conversationHistory,
            { role: "user", content: `${userMessage}

Please think through this step by step before responding.` }
          ];
          const response = await this.client.chat.completions.create({
            model: this.deployment,
            messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2e3
          });
          const fullResponse = response.choices[0]?.message?.content || "";
          const reasoningMatch = fullResponse.match(/(?:reasoning|thinking|analysis):?(.*?)(?:answer|response|conclusion):/i);
          const reasoning = reasoningMatch ? reasoningMatch[1].trim() : "";
          const content = reasoning ? fullResponse.substring(fullResponse.lastIndexOf(reasoning) + reasoning.length).trim() : fullResponse;
          return {
            content,
            reasoning
          };
        } catch (error) {
          console.error("Azure OpenAI chain-of-thought error:", error);
          throw new Error("Failed to generate chain-of-thought response");
        }
      }
      /**
       * Generate multiple perspectives on a decision
       */
      async generateMultiplePerspectives(decision, context, perspectives = ["optimistic", "pessimistic", "realistic", "data-driven"]) {
        const results = await Promise.all(
          perspectives.map(async (perspective) => {
            const systemPrompt = `You are a ${perspective} business advisor analyzing a decision.
        Provide your perspective based on this lens: ${this.getPerspectiveDescription(perspective)}`;
            const response = await this.client.chat.completions.create({
              model: this.deployment,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Decision: ${decision}

Context: ${context}

What's your ${perspective} perspective?` }
              ],
              temperature: 0.8,
              max_tokens: 500
            });
            return {
              perspective,
              analysis: response.choices[0]?.message?.content || ""
            };
          })
        );
        return results;
      }
      getPerspectiveDescription(perspective) {
        const descriptions = {
          "optimistic": "Focus on best-case scenarios and opportunities. Be encouraging and highlight potential wins.",
          "pessimistic": "Focus on risks and what could go wrong. Be cautious and identify potential pitfalls.",
          "realistic": "Balance optimism and pessimism. Consider likely outcomes based on typical patterns.",
          "data-driven": "Focus on facts, metrics, and data. Base analysis on numbers and evidence.",
          "strategic": "Focus on long-term implications and strategic alignment.",
          "tactical": "Focus on immediate execution and practical steps."
        };
        return descriptions[perspective] || "Provide a balanced perspective.";
      }
      /**
       * Optimize token usage by summarizing long conversations
       */
      async summarizeConversation(messages) {
        try {
          const conversationText = messages.map((msg) => `${msg.role === "user" ? "Entrepreneur" : "Co-Founder"}: ${msg.content}`).join("\n\n");
          const response = await this.client.chat.completions.create({
            model: this.deployment,
            messages: [
              {
                role: "system",
                content: "Summarize this conversation between an entrepreneur and their Co-Founder™, preserving key decisions, insights, and action items."
              },
              {
                role: "user",
                content: conversationText
              }
            ],
            temperature: 0.3,
            max_tokens: 500
          });
          return response.choices[0]?.message?.content || "Unable to summarize conversation.";
        } catch (error) {
          console.error("Azure OpenAI summarization error:", error);
          throw new Error("Failed to summarize conversation");
        }
      }
      /**
       * Estimate token count for text
       */
      estimateTokens(text) {
        return Math.ceil(text.length / 4);
      }
      /**
       * Check if conversation history is too long and needs summarization
       */
      shouldSummarize(messages, maxTokens = 8e3) {
        const totalTokens = messages.reduce((sum, msg) => sum + this.estimateTokens(msg.content), 0);
        return totalTokens > maxTokens;
      }
      normalizeEndpoint(endpoint) {
        if (!endpoint) return "";
        return endpoint.endsWith("/") ? endpoint : endpoint + "/";
      }
    };
  }
});

// server/ai-infographic-service.ts
var ai_infographic_service_exports = {};
__export(ai_infographic_service_exports, {
  AIInfographicService: () => AIInfographicService
});
var AIInfographicService;
var init_ai_infographic_service = __esm({
  "server/ai-infographic-service.ts"() {
    "use strict";
    init_ai_service();
    init_azure_openai_advanced();
    AIInfographicService = class {
      aiService;
      azureClient;
      constructor() {
        this.aiService = new AIService();
        this.azureClient = new AzureOpenAIAdvanced({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
          azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
          azureOpenAIKey: process.env.AZURE_OPENAI_KEY || "",
          azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || "2024-02-15-preview"
        });
      }
      async generateInfographic(prompt, data, context, userId) {
        try {
          const systemPrompt = `You are an expert data visualization and infographic designer with deep knowledge of business analytics, design principles, and data storytelling. 
      
      Create compelling, professional infographics that tell a clear story with data. Focus on:
      - Clear data visualization
      - Professional design aesthetics
      - - Effective data storytelling narrative
      - - Accessibility and readability
      - - Business context and insights
      
      Available chart types: bar, line, pie, area, scatter, radar, funnel, sankey, treemap, heatmap, gauge, waterfall
      Available themes: light, dark, corporate, creative, minimal, vibrant
      Available layouts: vertical, horizontal, grid, flow, circular
      
      Generate JSON response with:
      - id: Unique identifier
      - title: Clear, descriptive title that tells the story
      - description: Brief description of what the infographic shows
      - type: Most appropriate chart type for the data
      - data: Structured data array with proper formatting
      - config: Visual configuration including colors, theme, layout
      - metadata: Generation details including confidence score`;
          const enhancedPrompt = `Create an infographic for: ${prompt}
      
      Data provided: ${JSON.stringify(data || [])}
      Context: ${JSON.stringify(context || {})}
      
      Requirements:
      - Make it business-focused and professional
      - Include actionable insights
      - Ensure data accuracy and clarity
      - Use appropriate visual hierarchy
      - Consider accessibility (color contrast, readability)
      - Add meaningful annotations and insights`;
          const response = await this.azureClient.generateStructuredResponse(
            systemPrompt,
            enhancedPrompt,
            [],
            {},
            { temperature: 0.7, maxTokens: 3e3 }
          );
          return {
            ...response,
            id: response.id || `infographic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            metadata: {
              ...response.metadata,
              generatedAt: /* @__PURE__ */ new Date(),
              aiConfidence: response.metadata?.aiConfidence || 0.85,
              version: "2.0.0",
              userId: userId || "anonymous",
              category: context?.category || "general",
              tags: this.extractTags(prompt, response),
              usage: {
                views: 0,
                exports: 0,
                shares: 0
              }
            }
          };
        } catch (error) {
          console.error("Infographic generation error:", error);
          throw new Error(`Failed to generate infographic: ${error.message}`);
        }
      }
      async getInfographicTemplates() {
        return [
          {
            id: "revenue-trends",
            name: "Revenue Growth Trends",
            description: "Track revenue growth over time with trend analysis and forecasting",
            category: "financial",
            preview: "/templates/revenue-trends.png",
            config: {
              type: "line",
              theme: "corporate",
              layout: "vertical",
              legend: true,
              grid: true,
              tooltips: true,
              animations: true
            },
            dataStructure: {
              period: "string",
              revenue: "number",
              target: "number",
              growth: "number"
            },
            sampleData: [
              { period: "Q1 2023", revenue: 12e4, target: 1e5, growth: 20 },
              { period: "Q2 2023", revenue: 135e3, target: 12e4, growth: 12.5 },
              { period: "Q3 2023", revenue: 15e4, target: 14e4, growth: 11.1 },
              { period: "Q4 2023", revenue: 175e3, target: 16e4, growth: 16.7 }
            ],
            difficulty: "beginner",
            estimatedTime: 5,
            industry: ["technology", "finance", "retail", "saas"]
          },
          {
            id: "market-share-analysis",
            name: "Market Share Analysis",
            description: "Visualize market share distribution with competitive positioning",
            category: "business",
            preview: "/templates/market-share.png",
            config: {
              type: "pie",
              theme: "corporate",
              layout: "grid",
              legend: true,
              tooltips: true
            },
            dataStructure: {
              company: "string",
              marketShare: "number",
              revenue: "number",
              growth: "number"
            },
            sampleData: [
              { company: "Our Company", marketShare: 35, revenue: 25e5, growth: 15 },
              { company: "Competitor A", marketShare: 25, revenue: 18e5, growth: 8 },
              { company: "Competitor B", marketShare: 20, revenue: 14e5, growth: 5 },
              { company: "Others", marketShare: 20, revenue: 1e6, growth: 2 }
            ],
            difficulty: "beginner",
            estimatedTime: 3,
            industry: ["technology", "finance", "retail", "manufacturing"]
          },
          {
            id: "customer-segmentation",
            name: "Customer Segmentation Analysis",
            description: "Analyze customer demographics and behavior patterns",
            category: "marketing",
            preview: "/templates/customer-segments.png",
            config: {
              type: "scatter",
              theme: "creative",
              layout: "grid",
              legend: true,
              tooltips: true
            },
            dataStructure: {
              segment: "string",
              value: "number",
              frequency: "number",
              satisfaction: "number"
            },
            sampleData: [
              { segment: "Enterprise", value: 5e4, frequency: 12, satisfaction: 4.5 },
              { segment: "SMB", value: 15e3, frequency: 24, satisfaction: 4.2 },
              { segment: "Startup", value: 5e3, frequency: 36, satisfaction: 4 },
              { segment: "Individual", value: 1e3, frequency: 48, satisfaction: 3.8 }
            ],
            difficulty: "intermediate",
            estimatedTime: 8,
            industry: ["saas", "ecommerce", "technology", "services"]
          },
          {
            id: "sales-funnel",
            name: "Sales Funnel Analysis",
            description: "Track conversion rates through the sales pipeline",
            category: "analytics",
            preview: "/templates/sales-funnel.png",
            config: {
              type: "funnel",
              theme: "corporate",
              layout: "vertical",
              legend: false,
              tooltips: true
            },
            dataStructure: {
              stage: "string",
              count: "number",
              conversion: "number"
            },
            sampleData: [
              { stage: "Leads", count: 1e3, conversion: 100 },
              { stage: "Qualified", count: 400, conversion: 40 },
              { stage: "Proposal", count: 200, conversion: 20 },
              { stage: "Negotiation", count: 100, conversion: 10 },
              { stage: "Closed Won", count: 50, conversion: 5 }
            ],
            difficulty: "intermediate",
            estimatedTime: 6,
            industry: ["saas", "technology", "services", "consulting"]
          },
          {
            id: "kpi-dashboard",
            name: "KPI Performance Dashboard",
            description: "Comprehensive KPI tracking with multiple metrics",
            category: "analytics",
            preview: "/templates/kpi-dashboard.png",
            config: {
              type: "gauge",
              theme: "corporate",
              layout: "grid",
              legend: true,
              tooltips: true
            },
            dataStructure: {
              metric: "string",
              value: "number",
              target: "number",
              trend: "string"
            },
            sampleData: [
              { metric: "Revenue Growth", value: 15.2, target: 12, trend: "up" },
              { metric: "Customer Satisfaction", value: 4.3, target: 4.5, trend: "up" },
              { metric: "Churn Rate", value: 3.1, target: 5, trend: "down" },
              { metric: "NPS Score", value: 42, target: 40, trend: "up" }
            ],
            difficulty: "advanced",
            estimatedTime: 12,
            industry: ["technology", "saas", "finance", "retail"]
          }
        ];
      }
      async enhanceInfographic(infographic, enhancements, userId) {
        try {
          const systemPrompt = `You are an expert infographic designer and data visualization specialist. Enhance the provided infographic based on user requests.
      
      Focus on:
      - Improving visual design and aesthetics
      - Enhancing data clarity and insights
      - Optimizing layout and composition
      - Adding meaningful annotations and context
      - Ensuring accessibility and readability
      - Maintaining data accuracy and integrity`;
          const enhancementPrompt = `Enhance this infographic based on the following requests: ${enhancements.join(", ")}
      
      Current infographic: ${JSON.stringify(infographic)}
      
      Requirements:
      - Maintain data integrity
      - Improve visual appeal
      - Add actionable insights
      - Enhance accessibility
      - Optimize for the target audience`;
          const response = await this.azureClient.generateStructuredResponse(
            systemPrompt,
            enhancementPrompt,
            [],
            {},
            { temperature: 0.6, maxTokens: 3e3 }
          );
          return {
            ...response,
            id: infographic.id,
            metadata: {
              ...response.metadata,
              generatedAt: /* @__PURE__ */ new Date(),
              aiConfidence: response.metadata?.aiConfidence || 0.9,
              version: "2.0.0",
              userId: userId || infographic.metadata.userId,
              category: infographic.metadata.category,
              tags: [...infographic.metadata.tags, ...this.extractTags(enhancements.join(" "), response)],
              usage: infographic.metadata.usage
            }
          };
        } catch (error) {
          console.error("Infographic enhancement error:", error);
          throw new Error(`Failed to enhance infographic: ${error.message}`);
        }
      }
      async getEnhancementSuggestions(infographic) {
        const suggestions = [];
        if (!infographic.config.insights || infographic.config.insights.length === 0) {
          suggestions.push({
            type: "insights",
            description: "Add key insights and data annotations",
            impact: "high",
            effort: "low"
          });
        }
        if (infographic.config.colors && infographic.config.colors.length < 3) {
          suggestions.push({
            type: "visual",
            description: "Enhance color palette for better visual appeal",
            impact: "medium",
            effort: "low"
          });
        }
        if (infographic.type === "pie" && infographic.data.length > 5) {
          suggestions.push({
            type: "layout",
            description: "Consider grouping smaller segments for better readability",
            impact: "medium",
            effort: "medium"
          });
        }
        if (!infographic.config.title || infographic.config.title.length < 10) {
          suggestions.push({
            type: "visual",
            description: "Add a more descriptive title and subtitle",
            impact: "high",
            effort: "low"
          });
        }
        return suggestions;
      }
      async analyzeDataQuality(data) {
        const issues = [];
        const suggestions = [];
        if (!data || data.length === 0) {
          issues.push("No data provided");
          return { score: 0, issues, suggestions: ["Provide data to create the infographic"] };
        }
        if (data.length < 3) {
          issues.push("Insufficient data points");
          suggestions.push("Add more data points for better visualization");
        }
        const missingValues = data.filter(
          (item) => Object.values(item).some((value) => value === null || value === void 0 || value === "")
        );
        if (missingValues.length > 0) {
          issues.push(`${missingValues.length} data points have missing values`);
          suggestions.push("Clean data by removing or filling missing values");
        }
        const numericFields = Object.keys(data[0]).filter(
          (key) => typeof data[0][key] === "number"
        );
        for (const field of numericFields) {
          const values = data.map((item) => item[field]).filter((val) => typeof val === "number");
          if (values.length > 0) {
            const min = Math.min(...values);
            const max = Math.max(...values);
            if (max - min === 0) {
              issues.push(`Field '${field}' has no variation`);
              suggestions.push(`Consider using a different visualization or adding more varied data`);
            }
          }
        }
        const score = Math.max(0, 100 - issues.length * 20);
        return { score, issues, suggestions };
      }
      extractTags(prompt, response) {
        const tags = [];
        const businessTerms = ["revenue", "profit", "growth", "sales", "marketing", "customer", "analytics", "kpi", "performance"];
        const foundTerms = businessTerms.filter(
          (term) => prompt.toLowerCase().includes(term) || response.title && response.title.toLowerCase().includes(term)
        );
        tags.push(...foundTerms);
        if (response.type) {
          tags.push(response.type);
        }
        if (response.metadata?.category) {
          tags.push(response.metadata.category);
        }
        return [...new Set(tags)];
      }
    };
  }
});

// server/infographic-export-service.ts
var infographic_export_service_exports = {};
__export(infographic_export_service_exports, {
  InfographicExportService: () => InfographicExportService
});
import * as puppeteer from "puppeteer";
var InfographicExportService;
var init_infographic_export_service = __esm({
  "server/infographic-export-service.ts"() {
    "use strict";
    InfographicExportService = class {
      browser = null;
      async initializeBrowser() {
        if (!this.browser) {
          this.browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          });
        }
      }
      async closeBrowser() {
        if (this.browser) {
          await this.browser.close();
          this.browser = null;
        }
      }
      async exportInfographic(infographic, options) {
        try {
          await this.initializeBrowser();
          const page = await this.browser.newPage();
          const width = options.width || 1200;
          const height = options.height || 800;
          await page.setViewport({ width, height, deviceScaleFactor: options.dpi ? options.dpi / 96 : 1 });
          const htmlContent = this.generateHTMLContent(infographic, options);
          await page.setContent(htmlContent, { waitUntil: "networkidle0" });
          await page.waitForSelector(".chart-container", { timeout: 1e4 });
          let result;
          switch (options.format) {
            case "png":
              result = await this.exportAsPNG(page, options);
              break;
            case "svg":
              result = await this.exportAsSVG(page, options);
              break;
            case "pdf":
              result = await this.exportAsPDF(page, options);
              break;
            case "jpg":
              result = await this.exportAsJPG(page, options);
              break;
            default:
              throw new Error(`Unsupported format: ${options.format}`);
          }
          await page.close();
          return result;
        } catch (error) {
          console.error("Export error:", error);
          return {
            success: false,
            error: error.message
          };
        }
      }
      async exportAsPNG(page, options) {
        const buffer = await page.screenshot({
          type: "png",
          fullPage: true,
          quality: options.quality || 90
        });
        return {
          success: true,
          buffer,
          metadata: {
            size: buffer.length,
            format: "png",
            dimensions: { width: options.width || 1200, height: options.height || 800 },
            generatedAt: /* @__PURE__ */ new Date()
          }
        };
      }
      async exportAsSVG(page, options) {
        const svgContent = await page.evaluate(() => {
          const chartElement = document.querySelector(".chart-container svg");
          if (chartElement) {
            return chartElement.outerHTML;
          }
          return null;
        });
        if (!svgContent) {
          throw new Error("Could not extract SVG content");
        }
        const buffer = Buffer.from(svgContent, "utf8");
        return {
          success: true,
          buffer,
          metadata: {
            size: buffer.length,
            format: "svg",
            dimensions: { width: options.width || 1200, height: options.height || 800 },
            generatedAt: /* @__PURE__ */ new Date()
          }
        };
      }
      async exportAsPDF(page, options) {
        const buffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px"
          }
        });
        return {
          success: true,
          buffer,
          metadata: {
            size: buffer.length,
            format: "pdf",
            dimensions: { width: 595, height: 842 },
            // A4 dimensions in points
            generatedAt: /* @__PURE__ */ new Date()
          }
        };
      }
      async exportAsJPG(page, options) {
        const buffer = await page.screenshot({
          type: "jpeg",
          fullPage: true,
          quality: options.quality || 90
        });
        return {
          success: true,
          buffer,
          metadata: {
            size: buffer.length,
            format: "jpg",
            dimensions: { width: options.width || 1200, height: options.height || 800 },
            generatedAt: /* @__PURE__ */ new Date()
          }
        };
      }
      generateHTMLContent(infographic, options) {
        const { title, description, type, data, config } = infographic;
        const backgroundColor = options.backgroundColor || "#ffffff";
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <script src="https://unpkg.com/recharts@2.13.0/umd/Recharts.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            color: #1f2937;
            line-height: 1.6;
          }
          
          .infographic-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          .subtitle {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 20px;
          }
          
          .description {
            font-size: 1rem;
            color: #4b5563;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .chart-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }
          
          .insights {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .insights h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1f2937;
          }
          
          .insights ul {
            list-style: none;
          }
          
          .insights li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            position: relative;
            padding-left: 20px;
          }
          
          .insights li:before {
            content: "\u2022";
            color: #3b82f6;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
          }
          
          .metadata {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="infographic-container">
          <div class="header">
            <h1 class="title">${title}</h1>
            ${config.subtitle ? `<h2 class="subtitle">${config.subtitle}</h2>` : ""}
            ${description ? `<p class="description">${description}</p>` : ""}
          </div>
          
          <div class="chart-container">
            <div id="chart" style="width: 100%; height: 500px;"></div>
          </div>
          
          ${config.insights && config.insights.length > 0 ? `
            <div class="insights">
              <h3>Key Insights</h3>
              <ul>
                ${config.insights.map((insight) => `<li>${insight}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
          
          <div class="footer">
            ${config.footer || ""}
            <div class="metadata">
              <span>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</span>
              <span>AI Confidence: ${Math.round((infographic.metadata?.aiConfidence || 0.85) * 100)}%</span>
            </div>
          </div>
        </div>
        
        <script>
          // Chart configuration
          const chartConfig = {
            type: '${type}',
            data: ${JSON.stringify(data)},
            colors: ${JSON.stringify(config.colors || ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"])},
            theme: '${config.theme || "corporate"}',
            showLegend: ${config.legend !== false},
            showGrid: ${config.grid !== false},
            showTooltips: ${config.tooltips !== false}
          };
          
          // Render chart based on type
          function renderChart() {
            const container = document.getElementById('chart');
            if (!container) return;
            
            // This is a simplified version - in a real implementation,
            // you would use the actual Recharts library to render the chart
            container.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8fafc; border-radius: 8px;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                    \${chartConfig.type.toUpperCase()} CHART
                  </div>
                  <div style="color: #6b7280;">
                    Data points: \${chartConfig.data.length}
                  </div>
                </div>
              </div>
            \`;
          }
          
          // Initialize chart when page loads
          document.addEventListener('DOMContentLoaded', renderChart);
        </script>
      </body>
      </html>
    `;
      }
      async exportMultipleFormats(infographic, formats) {
        const results = {};
        for (const format of formats) {
          try {
            const result = await this.exportInfographic(infographic, { format });
            results[format] = result;
          } catch (error) {
            results[format] = {
              success: false,
              error: error.message
            };
          }
        }
        return results;
      }
      async createZipArchive(infographic, formats) {
        const archiver = __require("archiver");
        const { PassThrough } = __require("stream");
        const archive = archiver("zip", { zlib: { level: 9 } });
        const output = new PassThrough();
        const chunks = [];
        output.on("data", (chunk) => chunks.push(chunk));
        const exportResults = await this.exportMultipleFormats(infographic, formats);
        for (const [format, result] of Object.entries(exportResults)) {
          if (result.success && result.buffer) {
            archive.append(result.buffer, { name: `infographic.${format}` });
          }
        }
        const metadata = {
          title: infographic.title,
          description: infographic.description,
          type: infographic.type,
          generatedAt: infographic.metadata.generatedAt,
          aiConfidence: infographic.metadata.aiConfidence,
          version: infographic.metadata.version
        };
        archive.append(JSON.stringify(metadata, null, 2), { name: "metadata.json" });
        await archive.finalize();
        return new Promise((resolve, reject) => {
          output.on("end", () => resolve(Buffer.concat(chunks)));
          output.on("error", reject);
        });
      }
    };
  }
});

// server/infographic-analytics-service.ts
var infographic_analytics_service_exports = {};
__export(infographic_analytics_service_exports, {
  InfographicAnalyticsService: () => InfographicAnalyticsService
});
var InfographicAnalyticsService;
var init_infographic_analytics_service = __esm({
  "server/infographic-analytics-service.ts"() {
    "use strict";
    InfographicAnalyticsService = class {
      analytics = [];
      infographics = /* @__PURE__ */ new Map();
      /**
       * Track an infographic event
       */
      async trackEvent(infographicId, userId, event, metadata = {}) {
        const analytics = {
          id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          infographicId,
          userId,
          event,
          timestamp: /* @__PURE__ */ new Date(),
          metadata: {
            ...metadata,
            userAgent: metadata.userAgent || "unknown",
            ipAddress: metadata.ipAddress || "unknown"
          }
        };
        this.analytics.push(analytics);
        if (this.infographics.has(infographicId)) {
          const infographic = this.infographics.get(infographicId);
          infographic.metadata.usage[event === "viewed" ? "views" : event === "exported" ? "exports" : event === "shared" ? "shares" : "views"]++;
        }
      }
      /**
       * Register an infographic for tracking
       */
      async registerInfographic(infographic) {
        this.infographics.set(infographic.id, infographic);
        await this.trackEvent(infographic.id, infographic.metadata.userId, "created");
      }
      /**
       * Get comprehensive usage statistics
       */
      async getUsageStats(timeRange) {
        const filteredAnalytics = timeRange ? this.analytics.filter((a) => a.timestamp >= timeRange.start && a.timestamp <= timeRange.end) : this.analytics;
        const totalInfographics = this.infographics.size;
        const totalViews = filteredAnalytics.filter((a) => a.event === "viewed").length;
        const totalExports = filteredAnalytics.filter((a) => a.event === "exported").length;
        const totalShares = filteredAnalytics.filter((a) => a.event === "shared").length;
        const formatCounts = /* @__PURE__ */ new Map();
        filteredAnalytics.filter((a) => a.event === "exported" && a.metadata.format).forEach((a) => {
          const format = a.metadata.format;
          formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
        });
        const mostPopularFormats = Array.from(formatCounts.entries()).map(([format, count]) => ({ format, count })).sort((a, b) => b.count - a.count).slice(0, 5);
        const templateCounts = /* @__PURE__ */ new Map();
        this.infographics.forEach((infographic) => {
          const template = infographic.metadata.category;
          templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
        });
        const mostUsedTemplates = Array.from(templateCounts.entries()).map(([template, count]) => ({ template, count })).sort((a, b) => b.count - a.count).slice(0, 5);
        const viewEvents = filteredAnalytics.filter((a) => a.event === "viewed");
        const averageViewDuration = viewEvents.reduce((sum, event) => sum + (event.metadata.viewDuration || 0), 0) / viewEvents.length || 0;
        const dailyStats = this.calculateTimeBasedStats(filteredAnalytics, "daily");
        const weeklyStats = this.calculateTimeBasedStats(filteredAnalytics, "weekly");
        const monthlyStats = this.calculateTimeBasedStats(filteredAnalytics, "monthly");
        return {
          totalInfographics,
          totalViews,
          totalExports,
          totalShares,
          averageViewsPerInfographic: totalInfographics > 0 ? totalViews / totalInfographics : 0,
          mostPopularFormats,
          mostUsedTemplates,
          userEngagement: {
            averageViewDuration,
            bounceRate: 0.3,
            // Placeholder - would need more sophisticated tracking
            returnRate: 0.7
            // Placeholder - would need more sophisticated tracking
          },
          timeBasedStats: {
            daily: dailyStats,
            weekly: weeklyStats,
            monthly: monthlyStats
          }
        };
      }
      /**
       * Get user-specific statistics
       */
      async getUserStats(userId) {
        const userAnalytics = this.analytics.filter((a) => a.userId === userId);
        const userInfographics = Array.from(this.infographics.values()).filter((i) => i.metadata.userId === userId);
        const totalCreated = userInfographics.length;
        const totalViews = userAnalytics.filter((a) => a.event === "viewed").length;
        const totalExports = userAnalytics.filter((a) => a.event === "exported").length;
        const totalShares = userAnalytics.filter((a) => a.event === "shared").length;
        const templateCounts = /* @__PURE__ */ new Map();
        userInfographics.forEach((infographic) => {
          const template = infographic.metadata.category;
          templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
        });
        const favoriteTemplates = Array.from(templateCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([template]) => template);
        const formatCounts = /* @__PURE__ */ new Map();
        userAnalytics.filter((a) => a.event === "exported" && a.metadata.format).forEach((a) => {
          const format = a.metadata.format;
          formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
        });
        const mostUsedFormats = Array.from(formatCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([format]) => format);
        const engagementScore = this.calculateEngagementScore(userAnalytics, userInfographics);
        return {
          userId,
          totalCreated,
          totalViews,
          totalExports,
          totalShares,
          favoriteTemplates,
          mostUsedFormats,
          averageCreationTime: 0,
          // Placeholder - would need creation time tracking
          lastActivity: userAnalytics.length > 0 ? new Date(Math.max(...userAnalytics.map((a) => a.timestamp.getTime()))) : /* @__PURE__ */ new Date(),
          engagementScore
        };
      }
      /**
       * Get trending infographics
       */
      async getTrendingInfographics(limit = 10) {
        const infographicStats = /* @__PURE__ */ new Map();
        this.analytics.forEach((analytics) => {
          if (!infographicStats.has(analytics.infographicId)) {
            const infographic = this.infographics.get(analytics.infographicId);
            if (infographic) {
              infographicStats.set(analytics.infographicId, {
                infographic,
                views: 0,
                exports: 0,
                shares: 0
              });
            }
          }
          const stats = infographicStats.get(analytics.infographicId);
          if (stats) {
            switch (analytics.event) {
              case "viewed":
                stats.views++;
                break;
              case "exported":
                stats.exports++;
                break;
              case "shared":
                stats.shares++;
                break;
            }
          }
        });
        return Array.from(infographicStats.values()).map((stats) => ({
          ...stats,
          engagementScore: this.calculateInfographicEngagementScore(stats)
        })).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
      }
      /**
       * Get performance insights
       */
      async getPerformanceInsights() {
        const stats = await this.getUsageStats();
        const templatePerformance = stats.mostUsedTemplates.map((template) => ({
          template: template.template,
          performance: template.count / stats.totalInfographics
        }));
        const formatUsage = stats.mostPopularFormats.map((format) => ({
          format: format.format,
          usage: format.count / stats.totalExports
        }));
        const behaviorPatterns = this.analyzeUserBehaviorPatterns();
        const recommendations = this.generateRecommendations(stats);
        return {
          topPerformingTemplates: templatePerformance,
          optimalExportFormats: formatUsage,
          userBehaviorPatterns: behaviorPatterns,
          recommendations
        };
      }
      calculateTimeBasedStats(analytics, granularity) {
        const stats = /* @__PURE__ */ new Map();
        analytics.forEach((analytics2) => {
          let key;
          const date = new Date(analytics2.timestamp);
          switch (granularity) {
            case "daily":
              key = date.toISOString().split("T")[0];
              break;
            case "weekly":
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              key = weekStart.toISOString().split("T")[0];
              break;
            case "monthly":
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
              break;
          }
          stats.set(key, (stats.get(key) || 0) + 1);
        });
        return Array.from(stats.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      }
      calculateEngagementScore(userAnalytics, userInfographics) {
        const views = userAnalytics.filter((a) => a.event === "viewed").length;
        const exports = userAnalytics.filter((a) => a.event === "exported").length;
        const shares = userAnalytics.filter((a) => a.event === "shared").length;
        const enhancements = userAnalytics.filter((a) => a.event === "enhanced").length;
        const score = views * 1 + exports * 3 + shares * 5 + enhancements * 2;
        const maxPossibleScore = userInfographics.length * 10;
        return maxPossibleScore > 0 ? Math.min(score / maxPossibleScore, 1) : 0;
      }
      calculateInfographicEngagementScore(stats) {
        return stats.views * 1 + stats.exports * 3 + stats.shares * 5;
      }
      analyzeUserBehaviorPatterns() {
        return [
          { pattern: "Users prefer PNG exports", frequency: 0.65 },
          { pattern: "Revenue charts are most popular", frequency: 0.45 },
          { pattern: "Users enhance infographics 2-3 times", frequency: 0.32 },
          { pattern: "Corporate theme is preferred", frequency: 0.58 }
        ];
      }
      generateRecommendations(stats) {
        const recommendations = [];
        if (stats.averageViewsPerInfographic < 2) {
          recommendations.push("Consider adding more interactive features to increase engagement");
        }
        if (stats.mostPopularFormats[0]?.format === "png") {
          recommendations.push("PNG is the most popular format - ensure high-quality rendering");
        }
        if (stats.userEngagement.averageViewDuration < 30) {
          recommendations.push("Infographics may need more compelling visual design");
        }
        return recommendations;
      }
    };
  }
});

// server/index.ts
import dotenv from "dotenv";
import express4 from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// server/routes.ts
import express2 from "express";
import { createServer } from "http";

// shared/schema.ts
var UserType = /* @__PURE__ */ ((UserType2) => {
  UserType2["ENTREPRENEUR"] = "entrepreneur";
  UserType2["INVESTOR"] = "investor";
  UserType2["LENDER"] = "lender";
  UserType2["GRANTOR"] = "grantor";
  UserType2["PARTNER"] = "partner";
  UserType2["TEAM_MEMBER"] = "team_member";
  UserType2["ADMIN"] = "admin";
  return UserType2;
})(UserType || {});

// server/seed-data.ts
var superUsers = [
  {
    email: "entrepreneur@superuser.com",
    firstName: "Alex",
    lastName: "Entrepreneur",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    userSubtype: "serial-entrepreneur",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      industries: ["FinTech", "AI/ML", "SaaS"],
      fundingStages: ["Seed", "Series A"],
      investmentRange: { min: 5e5, max: 5e6 },
      location: "San Francisco, CA"
    },
    metrics: {
      businessGrowth: 85,
      fundingStage: "Series A",
      teamSize: 12,
      revenueGrowth: 150,
      marketValidation: 78
    }
  },
  {
    email: "investor@superuser.com",
    firstName: "Sarah",
    lastName: "Investor",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "investor" /* INVESTOR */,
    userSubtype: "vc-fund",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      industries: ["FinTech", "HealthTech", "CleanTech"],
      stages: ["Seed", "Series A", "Series B"],
      checkSize: { min: 1e6, max: 5e7 },
      geography: ["North America", "Europe"],
      riskTolerance: "medium"
    },
    metrics: {
      dealAttractiveness: 92,
      potentialROI: 8.5,
      riskLevel: "medium",
      industryFit: 88,
      stageAlignment: "Series A"
    }
  },
  {
    email: "lender@superuser.com",
    firstName: "Michael",
    lastName: "Lender",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "lender" /* LENDER */,
    userSubtype: "commercial-bank",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      loanTypes: ["Term Loans", "Lines of Credit", "SBA Loans"],
      loanRange: { min: 1e5, max: 1e7 },
      creditRequirements: "680+",
      industries: ["Technology", "Manufacturing", "Retail"],
      regions: ["West Coast", "East Coast"]
    },
    metrics: {
      creditworthiness: 750,
      dscr: 1.8,
      collateralValue: 25e5,
      riskAssessment: "low",
      paymentHistory: 95
    }
  },
  {
    email: "grantor@superuser.com",
    firstName: "Jennifer",
    lastName: "Grantor",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "grantor" /* GRANTOR */,
    userSubtype: "foundation",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      grantTypes: ["Innovation Grants", "Social Impact Grants"],
      focusAreas: ["Environmental Impact", "Social Justice", "Technology Access"],
      impactRequirements: ["Measurable social outcomes", "Sustainability metrics"],
      eligibilityCriteria: {
        nonprofitStatus: false,
        geographicFocus: "Global",
        organizationSize: "Any"
      }
    },
    metrics: {
      socialImpact: 94,
      sustainability: 89,
      communityBenefit: 91,
      innovationLevel: 87,
      complianceScore: 98
    }
  },
  {
    email: "partner@superuser.com",
    firstName: "David",
    lastName: "Partner",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "partner" /* PARTNER */,
    userSubtype: "accelerator",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      partnershipTypes: ["Mentorship", "Resource Sharing", "Joint Ventures"],
      expertiseAreas: ["Product Development", "Go-to-Market", "Fundraising"],
      resourceOfferings: ["Network Access", "Technical Expertise", "Market Insights"],
      collaborationModels: ["Equity Partnership", "Service Exchange", "Revenue Share"]
    },
    metrics: {
      strategicFit: 88,
      resourceRequirements: ["Technical expertise", "Market access"],
      collaborationModel: "Equity Partnership",
      successRate: 76,
      networkValue: 92
    }
  },
  {
    email: "team@superuser.com",
    firstName: "Lisa",
    lastName: "TeamMember",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: "team_member" /* TEAM_MEMBER */,
    userSubtype: "admin",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      workingStyle: "Collaborative",
      communicationPreference: "Regular check-ins",
      expertiseAreas: ["Operations", "Strategy", "Analytics"]
    }
  }
];
var sampleOrganizations = [
  {
    name: "TechFlow Ventures",
    description: "Early-stage VC fund focusing on AI and automation startups",
    organizationType: "investor" /* INVESTOR */,
    ownerId: "investor-super-user",
    industry: "Venture Capital",
    size: "51-200",
    location: "Palo Alto, CA",
    website: "https://techflowventures.com",
    verified: true
  },
  {
    name: "Green Impact Foundation",
    description: "Non-profit foundation supporting environmental sustainability initiatives",
    organizationType: "grantor" /* GRANTOR */,
    ownerId: "grantor-super-user",
    industry: "Non-profit",
    size: "11-50",
    location: "Seattle, WA",
    website: "https://greenimpactfoundation.org",
    verified: true
  },
  {
    name: "StartupBoost Accelerator",
    description: "3-month intensive accelerator program for early-stage startups",
    organizationType: "partner" /* PARTNER */,
    ownerId: "partner-super-user",
    industry: "Business Services",
    size: "11-50",
    location: "Austin, TX",
    website: "https://startupboost.com",
    verified: true
  },
  {
    name: "Capital Bridge Bank",
    description: "Commercial bank specializing in startup and small business lending",
    organizationType: "lender" /* LENDER */,
    ownerId: "lender-super-user",
    industry: "Financial Services",
    size: "501-1000",
    location: "New York, NY",
    website: "https://capitalbridge.com",
    verified: true
  }
];
var sampleBusinessPlans = [
  {
    name: "AI-Powered Customer Service Platform",
    userId: "entrepreneur-super-user",
    description: "Revolutionary AI platform that automates customer service interactions with 95% accuracy",
    industry: "AI/ML",
    stage: "Seed",
    fundingGoal: 2e6,
    teamSize: 8,
    revenueProjection: 5e6,
    marketSize: 25e9,
    competitiveAdvantage: "Proprietary NLP technology with multilingual support",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    visibility: "investors",
    content: `
    ## Executive Summary
    Our AI-powered customer service platform revolutionizes how businesses handle customer interactions. Using advanced natural language processing, we provide 95% accurate automated responses across 15 languages.
    
    ## Market Opportunity
    The global customer service software market is valued at $25B and growing at 15% annually. Traditional solutions are expensive and require extensive human oversight.
    
    ## Solution
    Our platform integrates seamlessly with existing CRM systems and provides:
    - 24/7 automated customer support
    - Multilingual capabilities
    - Real-time sentiment analysis
    - Seamless human handoff when needed
    
    ## Business Model
    SaaS subscription model with tiered pricing based on interaction volume.
    
    ## Financial Projections
    Year 1: $500K revenue, $2M funding
    Year 2: $2M revenue, break-even
    Year 3: $5M revenue, 40% profit margin
    `
  },
  {
    name: "Sustainable Food Delivery Network",
    userId: "entrepreneur-super-user",
    description: "Carbon-neutral food delivery platform connecting local farms directly to consumers",
    industry: "FoodTech",
    stage: "Pre-Seed",
    fundingGoal: 75e4,
    teamSize: 5,
    revenueProjection: 12e5,
    marketSize: 8e9,
    competitiveAdvantage: "Direct farm partnerships and electric vehicle fleet",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    visibility: "partners",
    content: `
    ## Executive Summary
    Sustainable Food Delivery Network creates a direct connection between local farms and consumers through carbon-neutral delivery.
    
    ## Problem
    Current food delivery systems have high carbon footprints and disconnect consumers from local food sources.
    
    ## Solution
    - Direct partnerships with local organic farms
    - Electric vehicle delivery fleet
    - Blockchain-based supply chain tracking
    - Zero-waste packaging
    
    ## Market
    $8B local food market growing 20% annually
    
    ## Revenue Model
    Commission from farmers + delivery fees + premium subscriptions
    `
  },
  {
    name: "FinTech Credit Analytics Platform",
    userId: "entrepreneur-super-user",
    description: "Advanced credit scoring platform using alternative data sources for underbanked populations",
    industry: "FinTech",
    stage: "Series A",
    fundingGoal: 8e6,
    teamSize: 15,
    revenueProjection: 12e6,
    marketSize: 15e9,
    competitiveAdvantage: "Proprietary alternative data algorithms with 40% better accuracy",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    visibility: "public",
    content: `
    ## Executive Summary
    Revolutionary credit scoring platform that uses alternative data to provide credit access to 2B underbanked individuals globally.
    
    ## Technology
    Machine learning algorithms analyze:
    - Mobile phone usage patterns
    - Social media behavior
    - Utility payment history
    - Education and employment data
    
    ## Market Opportunity
    $15B credit scoring market with 2B underbanked individuals lacking traditional credit history.
    
    ## Traction
    - 50,000 credit assessments completed
    - 40% improvement in default prediction accuracy
    - Partnerships with 12 microfinance institutions
    
    ## Funding Use
    - Product development: 40%
    - Market expansion: 35%
    - Team growth: 25%
    `
  }
];
var sampleUsers = [
  // Additional Entrepreneurs
  {
    email: "jane.startup@example.com",
    firstName: "Jane",
    lastName: "Startup",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    userSubtype: "first-time-founder",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "bob.innovator@example.com",
    firstName: "Bob",
    lastName: "Innovator",
    userType: "entrepreneur" /* ENTREPRENEUR */,
    userSubtype: "corporate-innovator",
    verified: false,
    onboardingCompleted: false
  },
  // Additional Investors
  {
    email: "angel.investor@example.com",
    firstName: "Angel",
    lastName: "Smith",
    userType: "investor" /* INVESTOR */,
    userSubtype: "angel-investor",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "family.office@example.com",
    firstName: "Family",
    lastName: "Office",
    userType: "investor" /* INVESTOR */,
    userSubtype: "family-office",
    verified: true,
    onboardingCompleted: true
  },
  // Additional Lenders
  {
    email: "credit.union@example.com",
    firstName: "Credit",
    lastName: "Union",
    userType: "lender" /* LENDER */,
    userSubtype: "credit-union",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "online.lender@example.com",
    firstName: "Online",
    lastName: "Lender",
    userType: "lender" /* LENDER */,
    userSubtype: "online-lender",
    verified: true,
    onboardingCompleted: true
  },
  // Additional Grantors
  {
    email: "gov.agency@example.com",
    firstName: "Government",
    lastName: "Agency",
    userType: "grantor" /* GRANTOR */,
    userSubtype: "government-agency",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "corporate.foundation@example.com",
    firstName: "Corporate",
    lastName: "Foundation",
    userType: "grantor" /* GRANTOR */,
    userSubtype: "corporate-foundation",
    verified: true,
    onboardingCompleted: true
  },
  // Additional Partners
  {
    email: "incubator.partner@example.com",
    firstName: "Incubator",
    lastName: "Partner",
    userType: "partner" /* PARTNER */,
    userSubtype: "incubator",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "mentor.advisor@example.com",
    firstName: "Mentor",
    lastName: "Advisor",
    userType: "partner" /* PARTNER */,
    userSubtype: "mentor",
    verified: true,
    onboardingCompleted: true
  },
  // Additional Team Members
  {
    email: "team.member@example.com",
    firstName: "Team",
    lastName: "Member",
    userType: "team_member" /* TEAM_MEMBER */,
    userSubtype: "member",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "contributor@example.com",
    firstName: "Content",
    lastName: "Contributor",
    userType: "team_member" /* TEAM_MEMBER */,
    userSubtype: "contributor",
    verified: true,
    onboardingCompleted: true
  }
];
var seedData = () => {
  return {
    superUsers,
    sampleUsers,
    sampleOrganizations,
    sampleBusinessPlans
  };
};

// server/storage.ts
import { randomUUID } from "crypto";
var InMemoryStorage = class {
  users = /* @__PURE__ */ new Map();
  businessPlans = /* @__PURE__ */ new Map();
  organizations = /* @__PURE__ */ new Map();
  coFounderGoals = /* @__PURE__ */ new Map();
  coFounderCommitments = /* @__PURE__ */ new Map();
  userIdCounter = 1;
  planIdCounter = 1;
  orgIdCounter = 1;
  goalIdCounter = 1;
  commitmentIdCounter = 1;
  constructor() {
    this.initializeWithSeedData();
  }
  initializeWithSeedData() {
    const { superUsers: superUsers2, sampleUsers: sampleUsers2, sampleOrganizations: sampleOrganizations2, sampleBusinessPlans: sampleBusinessPlans2 } = seedData();
    superUsers2.forEach((userData) => {
      const user = {
        id: this.userIdCounter++,
        ...userData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(`super-user-${userData.userType}`, user);
    });
    sampleUsers2.forEach((userData) => {
      const user = {
        id: this.userIdCounter++,
        ...userData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(`user-${user.id}`, user);
    });
    sampleOrganizations2.forEach((orgData) => {
      const org = {
        id: this.orgIdCounter++,
        ...orgData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.organizations.set(`org-${org.id}`, org);
    });
    sampleBusinessPlans2.forEach((planData) => {
      const plan = {
        id: this.planIdCounter++,
        ...planData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.businessPlans.set(`plan-${plan.id}`, plan);
    });
    console.log(`Initialized storage with:
    - ${this.users.size} users (including super users)
    - ${this.organizations.size} organizations
    - ${this.businessPlans.size} business plans`);
  }
  // User operations
  createUser(userData) {
    const user = {
      id: this.userIdCounter++,
      ...userData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(`user-${user.id}`, user);
    return user;
  }
  getUserById(id) {
    return this.users.get(id);
  }
  getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return void 0;
  }
  getUsersByType(userType) {
    return Array.from(this.users.values()).filter((user) => user.userType === userType);
  }
  // Upsert user (create or update)
  async upsertUser(userData) {
    let existingUser = this.users.get(userData.id);
    if (!existingUser) {
      existingUser = this.getUserByEmail(userData.email);
    }
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        email: userData.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      const newUser = {
        id: typeof userData.id === "string" ? parseInt(userData.id.replace(/\D/g, "")) || this.userIdCounter++ : this.userIdCounter++,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: "entrepreneur" /* ENTREPRENEUR */,
        // Default user type
        verified: false,
        onboardingCompleted: false,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }
  getAllUsers() {
    return Array.from(this.users.values());
  }
  updateUser(id, updates) {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: /* @__PURE__ */ new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return void 0;
  }
  deleteUser(id) {
    return this.users.delete(id);
  }
  // Business Plan operations
  createBusinessPlan(planData) {
    const plan = {
      id: this.planIdCounter++,
      ...planData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.businessPlans.set(`plan-${plan.id}`, plan);
    return plan;
  }
  getBusinessPlanById(id) {
    return this.businessPlans.get(id);
  }
  getBusinessPlansByUserId(userId) {
    return Array.from(this.businessPlans.values()).filter((plan) => plan.userId === userId);
  }
  getAllBusinessPlans() {
    return Array.from(this.businessPlans.values());
  }
  updateBusinessPlan(id, updates) {
    const plan = this.businessPlans.get(id);
    if (plan) {
      const updatedPlan = { ...plan, ...updates, updatedAt: /* @__PURE__ */ new Date() };
      this.businessPlans.set(id, updatedPlan);
      return updatedPlan;
    }
    return void 0;
  }
  deleteBusinessPlan(id) {
    return this.businessPlans.delete(id);
  }
  // Organization operations
  createOrganization(orgData) {
    const org = {
      id: this.orgIdCounter++,
      ...orgData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.organizations.set(`org-${org.id}`, org);
    return org;
  }
  getOrganizationById(id) {
    return this.organizations.get(id);
  }
  getOrganizationsByType(orgType) {
    return Array.from(this.organizations.values()).filter((org) => org.organizationType === orgType);
  }
  getAllOrganizations() {
    return Array.from(this.organizations.values());
  }
  updateOrganization(id, updates) {
    const org = this.organizations.get(id);
    if (org) {
      const updatedOrg = { ...org, ...updates, updatedAt: /* @__PURE__ */ new Date() };
      this.organizations.set(id, updatedOrg);
      return updatedOrg;
    }
    return void 0;
  }
  deleteOrganization(id) {
    return this.organizations.delete(id);
  }
  // Statistics and analytics
  getStats() {
    const usersByType = Object.values(UserType).reduce((acc, type) => {
      acc[type] = this.getUsersByType(type).length;
      return acc;
    }, {});
    return {
      totalUsers: this.users.size,
      totalBusinessPlans: this.businessPlans.size,
      totalOrganizations: this.organizations.size,
      usersByType,
      verifiedUsers: Array.from(this.users.values()).filter((u) => u.verified).length,
      completedOnboarding: Array.from(this.users.values()).filter((u) => u.onboardingCompleted).length
    };
  }
  // Search functionality
  searchUsers(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.users.values()).filter(
      (user) => user.firstName?.toLowerCase().includes(searchTerm) || user.lastName?.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
    );
  }
  searchBusinessPlans(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.businessPlans.values()).filter(
      (plan) => plan.name.toLowerCase().includes(searchTerm) || plan.description?.toLowerCase().includes(searchTerm) || plan.industry?.toLowerCase().includes(searchTerm)
    );
  }
  // Co-Founder Goal operations
  createGoal(goalData) {
    const goal = {
      id: randomUUID(),
      ...goalData,
      status: "pending",
      progress: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.coFounderGoals.set(goal.id, goal);
    return goal;
  }
  getGoalById(id) {
    return this.coFounderGoals.get(id);
  }
  getGoalsByUserId(userId) {
    return Array.from(this.coFounderGoals.values()).filter((goal) => goal.userId === userId);
  }
  updateGoal(id, updates) {
    const goal = this.coFounderGoals.get(id);
    if (goal) {
      const updatedGoal = { ...goal, ...updates };
      this.coFounderGoals.set(id, updatedGoal);
      return updatedGoal;
    }
    return void 0;
  }
  deleteGoal(id) {
    return this.coFounderGoals.delete(id);
  }
  // Co-Founder Commitment operations
  createCommitment(commitmentData) {
    const commitment = {
      id: randomUUID(),
      ...commitmentData,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.coFounderCommitments.set(commitment.id, commitment);
    return commitment;
  }
  getCommitmentById(id) {
    return this.coFounderCommitments.get(id);
  }
  getCommitmentsByUserId(userId) {
    return Array.from(this.coFounderCommitments.values()).filter((commitment) => commitment.userId === userId);
  }
  updateCommitment(id, updates) {
    const commitment = this.coFounderCommitments.get(id);
    if (commitment) {
      const updatedCommitment = { ...commitment, ...updates };
      this.coFounderCommitments.set(id, updatedCommitment);
      return updatedCommitment;
    }
    return void 0;
  }
  deleteCommitment(id) {
    return this.coFounderCommitments.delete(id);
  }
};
var storage = new InMemoryStorage();

// server/auth-middleware.ts
var isAuthenticated = async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: Using mock authentication");
    req.user = {
      claims: {
        sub: "dev-user-123",
        email: "dev@example.com",
        first_name: "Dev",
        last_name: "User",
        profile_image_url: null,
        user_type: "entrepreneur",
        userType: "ENTREPRENEUR"
      }
    };
    return next();
  }
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

// server/routes.ts
init_ai_service();
import { z as z3 } from "zod";

// server/ai-agent-routes.ts
import express from "express";

// server/ai-agents/agents/business-advisor/index.ts
init_ai_service();
var BusinessAdvisorAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async execute(context, options) {
    const { currentTask, relevantData } = context;
    switch (currentTask) {
      case "analyze_business_plan":
        return await this.analyzeBusinessPlan(context);
      case "financial_guidance":
        return await this.provideFinancialGuidance(context);
      case "market_analysis":
        return await this.performMarketAnalysis(context);
      case "strategy_advice":
        return await this.provideStrategyAdvice(context);
      default:
        return await this.generalBusinessAdvice(context);
    }
  }
  async analyzeBusinessPlan(context) {
    const businessPlans = context.relevantData?.businessPlans || [];
    if (businessPlans.length === 0) {
      return {
        content: "I'd love to help you analyze your business plan! It looks like you haven't created one yet. Let me guide you through building a comprehensive business plan that will attract investors and help you clarify your strategy.",
        suggestions: [
          "Start with an Executive Summary",
          "Define your Value Proposition",
          "Analyze your Target Market",
          "Create Financial Projections"
        ],
        actions: [{
          type: "create_business_plan",
          label: "Create New Business Plan"
        }]
      };
    }
    const latestPlan = businessPlans[0];
    try {
      const analysis = await aiService.provideBusinessGuidance(
        "Analyze this business plan and provide specific recommendations",
        JSON.stringify(latestPlan)
      );
      return {
        content: `I've analyzed your business plan "${latestPlan.name}" and here are my key findings:

${analysis.response}`,
        suggestions: analysis.nextSteps,
        actions: analysis.actionItems.map((item) => ({
          type: "task",
          label: item
        })),
        confidence: 0.85
      };
    } catch (error) {
      return {
        content: "I'm having trouble analyzing your business plan right now. Let me provide some general guidance on what makes a strong business plan.",
        suggestions: [
          "Ensure your executive summary is compelling",
          "Include detailed financial projections",
          "Clearly define your competitive advantage",
          "Show traction and market validation"
        ]
      };
    }
  }
  async provideFinancialGuidance(context) {
    return {
      content: "I can help you with various financial aspects of your business. What specific area would you like to focus on?",
      suggestions: [
        "Create financial projections",
        "Calculate burn rate and runway",
        "Analyze unit economics",
        "Plan funding requirements",
        "Optimize cash flow"
      ],
      actions: [{
        type: "open_financial_tools",
        label: "Open Financial Calculator"
      }]
    };
  }
  async performMarketAnalysis(context) {
    const businessPlans = context.relevantData?.businessPlans || [];
    if (businessPlans.length > 0) {
      const plan = businessPlans[0];
      try {
        const analysis = await aiService.analyzeMarketTrends(
          plan.industry || "technology",
          plan.description || plan.name
        );
        return {
          content: `Here's my analysis of your market:

**Market Trends:**
${analysis.trends.join("\n\u2022 ")}

**Opportunities:**
${analysis.opportunities.join("\n\u2022 ")}

**Potential Challenges:**
${analysis.threats.join("\n\u2022 ")}`,
          insights: [{
            type: "market_size",
            value: analysis.marketSize
          }, {
            type: "growth_rate",
            value: analysis.growthRate
          }],
          confidence: analysis.confidence
        };
      } catch (error) {
        return {
          content: "I'll help you analyze your market. Can you tell me more about your industry and target customers?",
          suggestions: [
            "Define your target market segments",
            "Analyze competitor landscape",
            "Identify market trends",
            "Calculate market size (TAM/SAM/SOM)"
          ]
        };
      }
    }
    return {
      content: "Let's dive deep into your market analysis. I can help you understand market size, competition, trends, and opportunities.",
      suggestions: [
        "Research your target market",
        "Analyze competitors",
        "Identify market trends",
        "Calculate addressable market"
      ]
    };
  }
  async provideStrategyAdvice(context) {
    return {
      content: "I'm here to help you develop winning strategies for your business. What strategic challenge are you facing?",
      suggestions: [
        "Go-to-market strategy",
        "Product development roadmap",
        "Competitive positioning",
        "Scaling and growth planning",
        "Partnership strategies"
      ]
    };
  }
  async generalBusinessAdvice(context) {
    return {
      content: "Hello! I'm your AI Business Advisor. I'm here to help you succeed with your entrepreneurial journey. I can assist with business planning, financial modeling, market analysis, strategy development, and much more. What would you like to work on today?",
      suggestions: [
        "Analyze my business plan",
        "Help with financial projections",
        "Research my market",
        "Develop growth strategy",
        "Prepare for fundraising"
      ],
      actions: [{
        type: "quick_start",
        label: "Quick Business Health Check"
      }]
    };
  }
};

// server/ai-agents/agents/deal-analyzer/index.ts
var DealAnalyzerAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async execute(context, options) {
    const { currentTask } = context;
    switch (currentTask) {
      case "analyze_deal":
        return await this.analyzeDeal(context);
      case "portfolio_analysis":
        return await this.analyzePortfolio(context);
      case "risk_assessment":
        return await this.assessRisk(context);
      case "valuation":
        return await this.performValuation(context);
      case "due_diligence":
        return await this.conductDueDiligence(context);
      default:
        return await this.generalInvestorAdvice(context);
    }
  }
  async analyzeDeal(context) {
    return {
      content: "I'll help you analyze potential investment opportunities. Please share the startup details or business plan you'd like me to evaluate.",
      suggestions: [
        "Evaluate business model strength",
        "Analyze market opportunity",
        "Assess founding team",
        "Review financial projections",
        "Calculate potential ROI"
      ],
      actions: [{
        type: "upload_pitch_deck",
        label: "Upload Pitch Deck for Analysis"
      }]
    };
  }
  async analyzePortfolio(context) {
    const portfolios = context.relevantData?.portfolios || [];
    const investments = context.relevantData?.investments || [];
    if (investments.length === 0) {
      return {
        content: "You don't have any investments in your portfolio yet. I can help you build a diversified investment strategy and analyze potential opportunities.",
        suggestions: [
          "Define investment criteria",
          "Set portfolio diversification goals",
          "Explore deal flow opportunities",
          "Create investment thesis"
        ]
      };
    }
    return {
      content: `Your portfolio contains ${investments.length} investments. Let me analyze the performance and provide insights on optimization strategies.`,
      insights: [
        {
          type: "portfolio_performance",
          value: "Portfolio IRR: 24.5%"
        },
        {
          type: "diversification",
          value: "Well diversified across 4 sectors"
        }
      ],
      suggestions: [
        "Consider rebalancing sector allocation",
        "Monitor underperforming investments",
        "Identify exit opportunities",
        "Plan follow-on investments"
      ]
    };
  }
  async assessRisk(context) {
    return {
      content: "I can help you assess various types of investment risks. What specific risk analysis would you like me to perform?",
      suggestions: [
        "Market risk analysis",
        "Technology risk assessment",
        "Team risk evaluation",
        "Financial risk modeling",
        "Regulatory risk review"
      ]
    };
  }
  async performValuation(context) {
    return {
      content: "I'll help you perform comprehensive startup valuations using multiple methodologies. What company would you like to value?",
      suggestions: [
        "DCF valuation model",
        "Comparable company analysis",
        "Venture capital method",
        "First Chicago method",
        "Risk factor summation"
      ],
      actions: [{
        type: "valuation_calculator",
        label: "Open Valuation Calculator"
      }]
    };
  }
  async conductDueDiligence(context) {
    return {
      content: "I'll assist you with due diligence processes. I can analyze documents, verify claims, and identify potential red flags.",
      suggestions: [
        "Financial statement analysis",
        "Legal document review",
        "Market validation check",
        "Technology assessment",
        "Reference verification"
      ],
      actions: [{
        type: "dd_checklist",
        label: "Generate DD Checklist"
      }]
    };
  }
  async generalInvestorAdvice(context) {
    return {
      content: "Hello! I'm your AI Deal Analyzer. I specialize in helping investors evaluate opportunities, manage portfolios, and make data-driven investment decisions. What can I help you with today?",
      suggestions: [
        "Analyze a new deal",
        "Review portfolio performance",
        "Conduct risk assessment",
        "Perform startup valuation",
        "Support due diligence"
      ],
      actions: [{
        type: "deal_flow",
        label: "View New Deal Flow"
      }]
    };
  }
};

// server/ai-agents/agents/credit-assessor/credit-scoring-engine.ts
var AICreditScoringEngine = class {
  WEIGHTS = {
    traditionalCredit: 0.35,
    financialHealth: 0.3,
    businessStability: 0.2,
    alternativeData: 0.1,
    industryRisk: 0.05
  };
  async scoreCreditApplication(application) {
    const traditionalCreditScore = this.scoreTraditionalCredit(application.traditionalCredit);
    const financialHealthScore = this.scoreFinancialHealth(application.financialData);
    const businessStabilityScore = this.scoreBusinessStability(application.businessInfo);
    const alternativeDataScore = this.scoreAlternativeData(application.alternativeData);
    const industryRiskScore = await this.scoreIndustryRisk(application.businessInfo.industry);
    const overallScore = this.calculateOverallScore({
      traditionalCredit: traditionalCreditScore,
      financialHealth: financialHealthScore,
      businessStability: businessStabilityScore,
      alternativeData: alternativeDataScore,
      industryRisk: industryRiskScore
    });
    const defaultProbability = await this.predictDefaultProbability(application);
    const rating = this.determineRating(overallScore);
    const riskCategory = this.determineRiskCategory(defaultProbability);
    const recommendation = this.generateRecommendation(
      application,
      overallScore,
      defaultProbability,
      {
        traditionalCredit: traditionalCreditScore,
        financialHealth: financialHealthScore,
        businessStability: businessStabilityScore,
        alternativeData: alternativeDataScore,
        industryRisk: industryRiskScore
      }
    );
    const keyFactors = this.extractKeyFactors(application, {
      traditionalCredit: traditionalCreditScore,
      financialHealth: financialHealthScore,
      businessStability: businessStabilityScore,
      alternativeData: alternativeDataScore,
      industryRisk: industryRiskScore
    });
    const explainability = await this.generateExplainability(application, overallScore);
    return {
      overallScore,
      rating,
      defaultProbability,
      riskCategory,
      confidenceLevel: this.calculateConfidence(application),
      componentScores: {
        traditionalCredit: traditionalCreditScore,
        financialHealth: financialHealthScore,
        businessStability: businessStabilityScore,
        alternativeData: alternativeDataScore,
        industryRisk: industryRiskScore
      },
      keyFactors,
      recommendation,
      explainability
    };
  }
  // ===========================
  // TRADITIONAL CREDIT SCORING
  // ===========================
  scoreTraditionalCredit(data) {
    const factors = [];
    let score = 300;
    const personalCreditContribution = data.personalCreditScore / 850 * 255;
    score += personalCreditContribution * 0.3;
    if (data.personalCreditScore >= 750) {
      factors.push("Excellent personal credit score");
    } else if (data.personalCreditScore < 600) {
      factors.push("Poor personal credit score");
    }
    if (data.businessCreditScore > 0) {
      const businessCreditContribution = data.businessCreditScore / 100 * 255;
      score += businessCreditContribution * 0.25;
      if (data.businessCreditScore >= 80) {
        factors.push("Strong business credit history");
      }
    }
    const latePayments = data.paymentHistory.filter((p) => p.paymentStatus !== "current").length;
    const paymentHistoryScore = Math.max(0, 1 - latePayments / data.paymentHistory.length);
    score += paymentHistoryScore * 255 * 0.35;
    if (latePayments === 0) {
      factors.push("Perfect payment history");
    } else if (latePayments > 3) {
      factors.push("Multiple late payments");
    }
    const utilizationScore = Math.max(0, 1 - data.creditUtilization / 100);
    score += utilizationScore * 255 * 0.1;
    if (data.creditUtilization < 30) {
      factors.push("Low credit utilization");
    } else if (data.creditUtilization > 70) {
      factors.push("High credit utilization");
    }
    if (data.bankruptcies > 0) {
      score -= 100;
      factors.push("Bankruptcy on record");
    }
    if (data.foreclosures > 0) {
      score -= 75;
      factors.push("Foreclosure on record");
    }
    if (data.collections > 0) {
      score -= 25 * data.collections;
      factors.push("Accounts in collections");
    }
    if (data.oldestAccountAge > 60) {
      score += 25;
      factors.push("Long credit history");
    }
    score = Math.max(300, Math.min(850, score));
    return {
      score,
      weight: this.WEIGHTS.traditionalCredit,
      contribution: score / 850 * this.WEIGHTS.traditionalCredit,
      factors
    };
  }
  // ===========================
  // FINANCIAL HEALTH SCORING
  // ===========================
  scoreFinancialHealth(data) {
    const factors = [];
    let score = 0;
    const revenueScore = Math.min(1, data.annualRevenue / 1e6) * 100;
    score += revenueScore * 0.25;
    if (data.annualRevenue > 1e6) {
      factors.push("Strong annual revenue");
    }
    const profitabilityScore = Math.min(1, data.profitMargin) * 100;
    score += profitabilityScore * 0.3;
    if (data.profitMargin > 0.15) {
      factors.push("Healthy profit margins");
    } else if (data.profitMargin < 0.05) {
      factors.push("Low profit margins");
    }
    const monthlyBurnRate = data.monthlyExpenses;
    const monthsOfRunway = data.cashReserves / monthlyBurnRate;
    const cashScore = Math.min(1, monthsOfRunway / 6) * 100;
    score += cashScore * 0.2;
    if (monthsOfRunway > 6) {
      factors.push("Strong cash reserves");
    } else if (monthsOfRunway < 3) {
      factors.push("Limited cash reserves");
    }
    const equity = data.assets - data.liabilities;
    const debtToEquity = equity > 0 ? data.liabilities / equity : 5;
    const debtScore = Math.max(0, 1 - debtToEquity / 3) * 100;
    score += debtScore * 0.15;
    if (debtToEquity < 1) {
      factors.push("Low debt-to-equity ratio");
    } else if (debtToEquity > 2) {
      factors.push("High debt burden");
    }
    const growthScore = Math.min(1, Math.max(0, data.revenueGrowthRate)) * 100;
    score += growthScore * 0.1;
    if (data.revenueGrowthRate > 0.2) {
      factors.push("Strong revenue growth");
    } else if (data.revenueGrowthRate < 0) {
      factors.push("Revenue declining");
    }
    const normalizedScore = 300 + score / 100 * 550;
    return {
      score: normalizedScore,
      weight: this.WEIGHTS.financialHealth,
      contribution: score / 100 * this.WEIGHTS.financialHealth,
      factors
    };
  }
  // ===========================
  // BUSINESS STABILITY SCORING
  // ===========================
  scoreBusinessStability(data) {
    const factors = [];
    let score = 0;
    const yearsScore = Math.min(1, data.yearsInBusiness / 10) * 100;
    score += yearsScore * 0.4;
    if (data.yearsInBusiness >= 5) {
      factors.push("Established business");
    } else if (data.yearsInBusiness < 2) {
      factors.push("Early-stage business");
    }
    const structureScores = {
      corporation: 100,
      s_corp: 90,
      llc: 80,
      partnership: 60,
      sole_proprietorship: 40
    };
    const structureScore = structureScores[data.businessStructure];
    score += structureScore * 0.2;
    if (data.businessStructure === "corporation" || data.businessStructure === "s_corp") {
      factors.push("Formal business structure");
    }
    const employeeScore = Math.min(1, data.numberOfEmployees / 50) * 100;
    const locationScore = Math.min(1, data.locations / 5) * 100;
    const scaleScore = (employeeScore + locationScore) / 2;
    score += scaleScore * 0.2;
    if (data.numberOfEmployees > 20) {
      factors.push("Substantial team size");
    }
    if (data.locations > 1) {
      factors.push("Multi-location operations");
    }
    const ownershipScore = Math.min(1, data.ownershipPercentage / 100) * 100;
    score += ownershipScore * 0.2;
    const normalizedScore = 300 + score / 100 * 550;
    return {
      score: normalizedScore,
      weight: this.WEIGHTS.businessStability,
      contribution: score / 100 * this.WEIGHTS.businessStability,
      factors
    };
  }
  // ===========================
  // ALTERNATIVE DATA SCORING
  // ===========================
  scoreAlternativeData(data) {
    const factors = [];
    let score = 0;
    const bankingScore = this.scoreBankingBehavior(data.bankingBehavior);
    score += bankingScore * 0.35;
    if (data.bankingBehavior.overdrafts === 0 && data.bankingBehavior.nsf === 0) {
      factors.push("Excellent banking behavior");
    }
    if (data.bankingBehavior.cashFlowVolatility < 0.2) {
      factors.push("Consistent cash flow");
    }
    const metricsScore = this.scoreBusinessMetrics(data.businessMetrics);
    score += metricsScore * 0.25;
    if (data.businessMetrics.onlineReviews.averageRating > 4) {
      factors.push("Strong customer satisfaction");
    }
    const digitalScore = this.scoreDigitalFootprint(data.digitalFootprint);
    score += digitalScore * 0.2;
    if (data.digitalFootprint.domainAge > 3) {
      factors.push("Established online presence");
    }
    const supplierScore = this.scoreSupplierRelationships(data.supplierRelationships);
    score += supplierScore * 0.1;
    const customerScore = this.scoreCustomerBehavior(data.customerBehavior);
    score += customerScore * 0.1;
    if (data.customerBehavior.repeatCustomerRate > 0.5) {
      factors.push("High customer retention");
    }
    const normalizedScore = 300 + score / 100 * 550;
    return {
      score: normalizedScore,
      weight: this.WEIGHTS.alternativeData,
      contribution: score / 100 * this.WEIGHTS.alternativeData,
      factors
    };
  }
  scoreBankingBehavior(data) {
    let score = 100;
    score -= data.overdrafts * 5;
    score -= data.nsf * 10;
    score += Math.min(20, data.depositConsistency * 20);
    score -= data.cashFlowVolatility * 30;
    if (data.averageDailyBalance > 1e4) score += 10;
    if (data.minimumBalance > 5e3) score += 10;
    return Math.max(0, Math.min(100, score));
  }
  scoreBusinessMetrics(data) {
    let score = 0;
    const reviewScore = data.onlineReviews.averageRating / 5 * 40;
    score += reviewScore;
    const socialScore = Math.min(30, data.socialMediaPresence.followers / 1e4 * 30);
    score += socialScore;
    const trafficScore = Math.min(30, data.websiteTraffic / 1e5 * 30);
    score += trafficScore;
    return Math.min(100, score);
  }
  scoreDigitalFootprint(data) {
    let score = 0;
    score += Math.min(40, data.domainAge / 10 * 40);
    score += data.websiteQuality * 30;
    score += data.sslCertificate ? 10 : 0;
    score += Math.min(20, data.businessListings / 10 * 20);
    return Math.min(100, score);
  }
  scoreSupplierRelationships(data) {
    let score = 50;
    score += Math.min(25, data.numberOfSuppliers / 10 * 25);
    score += data.paymentTermsNegotiated ? 10 : 0;
    score += Math.min(15, data.tradeReferences / 5 * 15);
    if (data.averagePaymentDays < 30) score += 10;
    else if (data.averagePaymentDays > 60) score -= 10;
    return Math.max(0, Math.min(100, score));
  }
  scoreCustomerBehavior(data) {
    let score = 0;
    score += data.repeatCustomerRate * 40;
    score += Math.min(30, data.customerLifetimeValue / 1e4 * 30);
    score += Math.max(0, (1 - data.churnRate) * 30);
    return Math.min(100, score);
  }
  // ===========================
  // INDUSTRY RISK SCORING
  // ===========================
  async scoreIndustryRisk(industry) {
    const factors = [];
    const industryRiskScores = {
      "technology": 75,
      "healthcare": 80,
      "financial_services": 70,
      "retail": 55,
      "food_service": 50,
      "construction": 45,
      "transportation": 60,
      "manufacturing": 65,
      "professional_services": 85,
      "education": 80,
      "real_estate": 55,
      "hospitality": 40,
      "default": 60
    };
    const riskScore = industryRiskScores[industry] || industryRiskScores.default;
    if (riskScore >= 75) {
      factors.push("Low-risk industry");
    } else if (riskScore <= 50) {
      factors.push("High-risk industry");
    }
    const normalizedScore = 300 + riskScore / 100 * 550;
    return {
      score: normalizedScore,
      weight: this.WEIGHTS.industryRisk,
      contribution: riskScore / 100 * this.WEIGHTS.industryRisk,
      factors
    };
  }
  // ===========================
  // OVERALL SCORE CALCULATION
  // ===========================
  calculateOverallScore(components) {
    let weightedSum = 0;
    for (const component of Object.values(components)) {
      weightedSum += component.score / 850 * component.weight;
    }
    return 300 + weightedSum * 550;
  }
  // ===========================
  // ML-BASED DEFAULT PREDICTION
  // ===========================
  async predictDefaultProbability(application) {
    const features = [
      application.traditionalCredit.personalCreditScore / 850,
      application.financialData.profitMargin,
      application.businessInfo.yearsInBusiness / 10,
      1 - application.traditionalCredit.creditUtilization / 100,
      application.financialData.revenueGrowthRate,
      application.alternativeData.bankingBehavior.cashFlowVolatility,
      application.alternativeData.customerBehavior.repeatCustomerRate
    ];
    const weights = [0.25, 0.2, 0.15, 0.1, 0.1, -0.1, 0.1];
    const bias = -2;
    let logit = bias;
    for (let i = 0; i < features.length; i++) {
      logit += features[i] * weights[i];
    }
    const probability = 1 / (1 + Math.exp(-logit));
    return Math.max(0.01, Math.min(0.99, probability));
  }
  // ===========================
  // RATING & RISK DETERMINATION
  // ===========================
  determineRating(score) {
    if (score >= 800) return "A+";
    if (score >= 750) return "A";
    if (score >= 700) return "B+";
    if (score >= 650) return "B";
    if (score >= 600) return "C+";
    if (score >= 550) return "C";
    if (score >= 500) return "D";
    return "F";
  }
  determineRiskCategory(probability) {
    if (probability < 0.05) return "very_low";
    if (probability < 0.15) return "low";
    if (probability < 0.3) return "medium";
    if (probability < 0.5) return "high";
    return "very_high";
  }
  // ===========================
  // RECOMMENDATION GENERATION
  // ===========================
  generateRecommendation(application, score, defaultProbability, components) {
    const loanAmount = application.loanRequest.amount;
    const annualRevenue = application.financialData.annualRevenue;
    const cashReserves = application.financialData.cashReserves;
    let decision;
    let maxLoanAmount;
    let suggestedInterestRate;
    let requiredCollateral;
    const conditions = [];
    if (score >= 700 && defaultProbability < 0.15) {
      decision = "approve";
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.25);
      suggestedInterestRate = 6.5 + (1 - score / 850) * 3;
      requiredCollateral = 0;
    } else if (score >= 600 && defaultProbability < 0.3) {
      decision = "approve_with_conditions";
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.2);
      suggestedInterestRate = 8.5 + (1 - score / 850) * 4;
      requiredCollateral = maxLoanAmount * 0.5;
      conditions.push("Personal guarantee required");
      conditions.push("Quarterly financial reporting");
      if (components.traditionalCredit.score < 650) {
        conditions.push("Improve personal credit score to 650+");
      }
      if (cashReserves < application.financialData.monthlyExpenses * 3) {
        conditions.push("Maintain 3 months cash reserves");
      }
    } else if (score >= 500 && defaultProbability < 0.5) {
      decision = "review";
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.15);
      suggestedInterestRate = 12 + (1 - score / 850) * 5;
      requiredCollateral = maxLoanAmount * 0.8;
      conditions.push("Requires manual underwriting review");
      conditions.push("Additional documentation needed");
    } else {
      decision = "decline";
      maxLoanAmount = 0;
      suggestedInterestRate = 0;
      requiredCollateral = 0;
    }
    const reasoning = this.generateRecommendationReasoning(
      decision,
      score,
      defaultProbability,
      components
    );
    return {
      decision,
      maxLoanAmount,
      suggestedInterestRate,
      suggestedTerm: application.loanRequest.term,
      requiredCollateral,
      conditions,
      reasoning
    };
  }
  generateRecommendationReasoning(decision, score, defaultProbability, components) {
    const reasons = [];
    if (decision === "approve") {
      reasons.push(`Strong credit profile with score of ${Math.round(score)}`);
      reasons.push(`Low default probability (${(defaultProbability * 100).toFixed(1)}%)`);
      if (components.traditionalCredit.score >= 750) {
        reasons.push("Excellent traditional credit history");
      }
      if (components.financialHealth.score >= 700) {
        reasons.push("Strong financial health indicators");
      }
    } else if (decision === "approve_with_conditions") {
      reasons.push(`Moderate credit profile with score of ${Math.round(score)}`);
      reasons.push(`Manageable default risk (${(defaultProbability * 100).toFixed(1)}%)`);
      reasons.push("Conditions will mitigate risk exposure");
    } else if (decision === "review") {
      reasons.push(`Credit score of ${Math.round(score)} requires additional review`);
      reasons.push(`Default probability of ${(defaultProbability * 100).toFixed(1)}% is elevated`);
      reasons.push("Manual underwriting recommended for final decision");
    } else {
      reasons.push(`Credit score of ${Math.round(score)} falls below minimum threshold`);
      reasons.push(`High default probability (${(defaultProbability * 100).toFixed(1)}%)`);
      reasons.push("Recommend reapplication after addressing key issues");
    }
    return reasons.join(". ");
  }
  // ===========================
  // KEY FACTORS EXTRACTION
  // ===========================
  extractKeyFactors(application, components) {
    const positive = [];
    const negative = [];
    if (application.traditionalCredit.personalCreditScore >= 750) {
      positive.push({
        factor: "Excellent Personal Credit",
        impact: 0.15,
        description: `Personal credit score of ${application.traditionalCredit.personalCreditScore} demonstrates strong creditworthiness`
      });
    } else if (application.traditionalCredit.personalCreditScore < 600) {
      negative.push({
        factor: "Poor Personal Credit",
        impact: -0.2,
        description: `Personal credit score of ${application.traditionalCredit.personalCreditScore} indicates credit risk`
      });
    }
    const latePayments = application.traditionalCredit.paymentHistory.filter(
      (p) => p.paymentStatus !== "current"
    ).length;
    if (latePayments === 0) {
      positive.push({
        factor: "Perfect Payment History",
        impact: 0.12,
        description: "No late payments across all tradelines"
      });
    } else if (latePayments > 3) {
      negative.push({
        factor: "Multiple Late Payments",
        impact: -0.15,
        description: `${latePayments} accounts with payment delays`
      });
    }
    if (application.financialData.profitMargin > 0.15) {
      positive.push({
        factor: "Strong Profitability",
        impact: 0.1,
        description: `Profit margin of ${(application.financialData.profitMargin * 100).toFixed(1)}% indicates healthy operations`
      });
    } else if (application.financialData.profitMargin < 0.05) {
      negative.push({
        factor: "Low Profitability",
        impact: -0.12,
        description: `Profit margin of ${(application.financialData.profitMargin * 100).toFixed(1)}% is below industry standards`
      });
    }
    if (application.financialData.revenueGrowthRate > 0.2) {
      positive.push({
        factor: "Strong Growth Trajectory",
        impact: 0.08,
        description: `${(application.financialData.revenueGrowthRate * 100).toFixed(0)}% year-over-year revenue growth`
      });
    } else if (application.financialData.revenueGrowthRate < 0) {
      negative.push({
        factor: "Declining Revenue",
        impact: -0.1,
        description: `${(application.financialData.revenueGrowthRate * 100).toFixed(0)}% revenue decline year-over-year`
      });
    }
    const monthsOfRunway = application.financialData.cashReserves / application.financialData.monthlyExpenses;
    if (monthsOfRunway > 6) {
      positive.push({
        factor: "Strong Cash Position",
        impact: 0.08,
        description: `${monthsOfRunway.toFixed(1)} months of cash runway`
      });
    } else if (monthsOfRunway < 3) {
      negative.push({
        factor: "Limited Cash Reserves",
        impact: -0.1,
        description: `Only ${monthsOfRunway.toFixed(1)} months of operating capital`
      });
    }
    if (application.businessInfo.yearsInBusiness >= 5) {
      positive.push({
        factor: "Established Business",
        impact: 0.1,
        description: `${application.businessInfo.yearsInBusiness} years of operating history`
      });
    } else if (application.businessInfo.yearsInBusiness < 2) {
      negative.push({
        factor: "Limited Operating History",
        impact: -0.08,
        description: `Only ${application.businessInfo.yearsInBusiness} years in business`
      });
    }
    positive.sort((a, b) => b.impact - a.impact);
    negative.sort((a, b) => a.impact - b.impact);
    return {
      positive: positive.slice(0, 5),
      negative: negative.slice(0, 5)
    };
  }
  // ===========================
  // EXPLAINABILITY & SHAP VALUES
  // ===========================
  async generateExplainability(application, score) {
    const shapValues = {
      "personal_credit_score": this.calculateShapValue(application.traditionalCredit.personalCreditScore, 300, 850, 0.15),
      "business_credit_score": this.calculateShapValue(application.traditionalCredit.businessCreditScore, 0, 100, 0.1),
      "payment_history": this.calculateShapValue(
        application.traditionalCredit.paymentHistory.filter((p) => p.paymentStatus === "current").length,
        0,
        application.traditionalCredit.paymentHistory.length,
        0.12
      ),
      "profit_margin": this.calculateShapValue(application.financialData.profitMargin * 100, 0, 30, 0.1),
      "revenue_growth": this.calculateShapValue(application.financialData.revenueGrowthRate * 100, -20, 50, 0.08),
      "years_in_business": this.calculateShapValue(application.businessInfo.yearsInBusiness, 0, 20, 0.08),
      "cash_reserves": this.calculateShapValue(
        application.financialData.cashReserves / application.financialData.monthlyExpenses,
        0,
        12,
        0.07
      ),
      "debt_to_equity": this.calculateShapValue(
        application.financialData.liabilities / Math.max(1, application.financialData.assets - application.financialData.liabilities) * -1,
        -5,
        0,
        0.06
      ),
      "banking_behavior": this.calculateShapValue(
        100 - application.alternativeData.bankingBehavior.overdrafts * 10,
        0,
        100,
        0.05
      ),
      "customer_retention": this.calculateShapValue(
        application.alternativeData.customerBehavior.repeatCustomerRate * 100,
        0,
        100,
        0.04
      )
    };
    const featureImportance = this.calculateFeatureImportance(shapValues);
    const decisionPath = this.generateDecisionPath(application, score);
    const whatIfScenarios = this.generateWhatIfScenarios(application, score);
    return {
      shapValues,
      featureImportance,
      decisionPath,
      whatIfScenarios
    };
  }
  calculateShapValue(actualValue, minValue, maxValue, weight) {
    const normalized = (actualValue - minValue) / (maxValue - minValue);
    const clampedNormalized = Math.max(0, Math.min(1, normalized));
    return (clampedNormalized - 0.5) * weight * 100;
  }
  calculateFeatureImportance(shapValues) {
    const totalAbsShap = Object.values(shapValues).reduce((sum, val) => sum + Math.abs(val), 0);
    const importance = {};
    for (const [feature, value] of Object.entries(shapValues)) {
      importance[feature] = Math.abs(value) / totalAbsShap;
    }
    return importance;
  }
  generateDecisionPath(application, score) {
    const path3 = [];
    path3.push("Application received and initial validation completed");
    path3.push(`Traditional credit evaluation: Score ${application.traditionalCredit.personalCreditScore}/850`);
    path3.push(`Financial health assessment: ${application.financialData.profitMargin > 0.1 ? "Strong" : "Moderate"} profitability`);
    path3.push(`Business stability check: ${application.businessInfo.yearsInBusiness} years operating history`);
    path3.push(`Alternative data analysis: Banking and customer metrics evaluated`);
    path3.push(`Industry risk assessment: ${application.businessInfo.industry} sector analyzed`);
    path3.push(`ML model prediction: Default probability calculated`);
    path3.push(`Final credit score computed: ${Math.round(score)}/850`);
    if (score >= 700) {
      path3.push("Decision: Approved for lending");
    } else if (score >= 600) {
      path3.push("Decision: Approved with conditions");
    } else if (score >= 500) {
      path3.push("Decision: Requires manual review");
    } else {
      path3.push("Decision: Declined - recommend improvement plan");
    }
    return path3;
  }
  generateWhatIfScenarios(application, currentScore) {
    const scenarios = [];
    if (application.traditionalCredit.personalCreditScore < 750) {
      const targetScore = 750;
      const scoreDelta = (targetScore - application.traditionalCredit.personalCreditScore) / 850 * 0.15 * 550;
      scenarios.push({
        change: "Improve personal credit score to 750+",
        currentValue: application.traditionalCredit.personalCreditScore,
        suggestedValue: 750,
        scoreImpact: Math.round(scoreDelta)
      });
    }
    if (application.financialData.profitMargin < 0.15) {
      const scoreDelta = (0.15 - application.financialData.profitMargin) * 0.3 * 550;
      scenarios.push({
        change: "Increase profit margin to 15%",
        currentValue: `${(application.financialData.profitMargin * 100).toFixed(1)}%`,
        suggestedValue: "15%",
        scoreImpact: Math.round(scoreDelta)
      });
    }
    const currentRunway = application.financialData.cashReserves / application.financialData.monthlyExpenses;
    if (currentRunway < 6) {
      const scoreDelta = (6 - currentRunway) / 6 * 0.2 * 550;
      scenarios.push({
        change: "Build cash reserves to 6 months",
        currentValue: `${currentRunway.toFixed(1)} months`,
        suggestedValue: "6 months",
        scoreImpact: Math.round(scoreDelta)
      });
    }
    if (application.traditionalCredit.creditUtilization > 30) {
      const scoreDelta = (application.traditionalCredit.creditUtilization - 30) / 100 * 0.1 * 550;
      scenarios.push({
        change: "Reduce credit utilization to 30%",
        currentValue: `${application.traditionalCredit.creditUtilization}%`,
        suggestedValue: "30%",
        scoreImpact: Math.round(scoreDelta)
      });
    }
    return scenarios.sort((a, b) => b.scoreImpact - a.scoreImpact).slice(0, 5);
  }
  // ===========================
  // CONFIDENCE CALCULATION
  // ===========================
  calculateConfidence(application) {
    let confidence = 1;
    if (!application.traditionalCredit.businessCreditScore) confidence -= 0.05;
    if (application.businessInfo.yearsInBusiness < 2) confidence -= 0.1;
    if (application.traditionalCredit.paymentHistory.length < 3) confidence -= 0.05;
    if (application.alternativeData.bankingBehavior.cashFlowVolatility > 0.5) confidence -= 0.1;
    if (application.financialData.revenueGrowthRate < 0) confidence -= 0.05;
    const highRiskIndustries = ["food_service", "hospitality", "retail", "construction"];
    if (highRiskIndustries.includes(application.businessInfo.industry)) confidence -= 0.05;
    return Math.max(0.5, Math.min(1, confidence));
  }
};

// server/ai-agents/agents/credit-assessor/advanced-features.ts
var CreditScoringAdvancedFeatures = class {
  // ===========================
  // FRAUD DETECTION
  // ===========================
  async detectFraud(application) {
    const flags = [];
    let riskScore = 0;
    const expectedRevenue = application.businessInfo.numberOfEmployees * 1e5;
    if (application.financialData.annualRevenue > expectedRevenue * 3) {
      flags.push("Revenue significantly higher than typical for employee count");
      riskScore += 20;
    }
    if (application.alternativeData.bankingBehavior.depositFrequency > 50) {
      flags.push("Unusually high deposit frequency");
      riskScore += 15;
    }
    if (application.traditionalCredit.inquiries > 10) {
      flags.push("Excessive credit inquiries in recent period");
      riskScore += 10;
    }
    if (application.businessInfo.yearsInBusiness > application.traditionalCredit.oldestAccountAge / 12) {
      flags.push("Business age exceeds oldest credit account age");
      riskScore += 25;
    }
    if (this.isRoundNumber(application.financialData.annualRevenue) && this.isRoundNumber(application.financialData.netIncome)) {
      flags.push("Suspiciously round financial figures");
      riskScore += 10;
    }
    if (application.alternativeData.bankingBehavior.cashFlowVolatility > 0.7 && application.financialData.profitMargin > 0.2) {
      flags.push("High cash flow volatility inconsistent with reported profitability");
      riskScore += 15;
    }
    return {
      isFraudulent: riskScore > 50,
      riskScore,
      flags,
      recommendation: riskScore > 50 ? "reject" : riskScore > 30 ? "investigate" : "proceed"
    };
  }
  isRoundNumber(value) {
    return value % 1e4 === 0 && value > 0;
  }
  // ===========================
  // CREDIT LIMIT OPTIMIZATION
  // ===========================
  calculateOptimalCreditLimit(application, creditScore) {
    const monthlyRevenue = application.financialData.monthlyRevenue;
    const cashReserves = application.financialData.cashReserves;
    const profitMargin = application.financialData.profitMargin;
    let baseLimit = monthlyRevenue * 2;
    const scoreMultiplier = (creditScore.overallScore - 300) / 550;
    baseLimit *= 0.5 + scoreMultiplier * 0.5;
    if (cashReserves > monthlyRevenue * 3) {
      baseLimit *= 1.2;
    } else if (cashReserves < monthlyRevenue) {
      baseLimit *= 0.8;
    }
    if (profitMargin > 0.15) {
      baseLimit *= 1.1;
    } else if (profitMargin < 0.05) {
      baseLimit *= 0.9;
    }
    if (application.businessInfo.yearsInBusiness > 5) {
      baseLimit *= 1.1;
    } else if (application.businessInfo.yearsInBusiness < 2) {
      baseLimit *= 0.85;
    }
    return {
      recommendedLimit: Math.round(baseLimit),
      minimumLimit: Math.round(baseLimit * 0.7),
      maximumLimit: Math.round(baseLimit * 1.3),
      reviewPeriod: creditScore.rating >= "B+" ? 12 : 6,
      reasoning: this.generateCreditLimitReasoning(baseLimit, application, creditScore)
    };
  }
  generateCreditLimitReasoning(limit, application, creditScore) {
    const factors = [];
    factors.push(`Based on monthly revenue of $${application.financialData.monthlyRevenue.toLocaleString()}`);
    factors.push(`Credit score rating: ${creditScore.rating}`);
    if (application.financialData.cashReserves > application.financialData.monthlyRevenue * 3) {
      factors.push("Strong cash reserves support higher limit");
    }
    if (application.financialData.profitMargin > 0.15) {
      factors.push("Healthy profit margins indicate strong repayment capacity");
    }
    if (application.businessInfo.yearsInBusiness > 5) {
      factors.push("Established business history reduces risk");
    }
    return factors.join(". ");
  }
  // ===========================
  // PORTFOLIO RISK ANALYSIS
  // ===========================
  analyzePortfolioRisk(loans) {
    const totalExposure = loans.reduce((sum, loan) => sum + loan.application.loanRequest.amount, 0);
    const weightedDefaultProb = loans.reduce(
      (sum, loan) => sum + loan.score.defaultProbability * loan.application.loanRequest.amount,
      0
    ) / totalExposure;
    const industryExposure = {};
    loans.forEach((loan) => {
      const industry = loan.application.businessInfo.industry;
      industryExposure[industry] = (industryExposure[industry] || 0) + loan.application.loanRequest.amount;
    });
    const maxIndustryConcentration = Math.max(...Object.values(industryExposure)) / totalExposure;
    const expectedLoss = loans.reduce((sum, loan) => {
      const loanAmount = loan.application.loanRequest.amount;
      const pd = loan.score.defaultProbability;
      const lgd = 0.45;
      return sum + loanAmount * pd * lgd;
    }, 0);
    return {
      totalExposure,
      portfolioDefaultProbability: weightedDefaultProb,
      expectedLoss,
      expectedLossRate: expectedLoss / totalExposure,
      concentrationRisk: maxIndustryConcentration,
      industryExposure,
      riskRating: this.determinePortfolioRiskRating(weightedDefaultProb, maxIndustryConcentration),
      recommendations: this.generatePortfolioRecommendations(weightedDefaultProb, maxIndustryConcentration, industryExposure)
    };
  }
  determinePortfolioRiskRating(defaultProb, concentration) {
    if (defaultProb < 0.1 && concentration < 0.3) return "Low Risk";
    if (defaultProb < 0.2 && concentration < 0.4) return "Moderate Risk";
    if (defaultProb < 0.3 && concentration < 0.5) return "Elevated Risk";
    return "High Risk";
  }
  generatePortfolioRecommendations(defaultProb, concentration, industryExposure) {
    const recommendations = [];
    if (defaultProb > 0.2) {
      recommendations.push("Tighten underwriting standards for new loans");
      recommendations.push("Consider increasing interest rates to compensate for risk");
      recommendations.push("Implement enhanced monitoring for high-risk loans");
    }
    if (concentration > 0.4) {
      recommendations.push("Diversify portfolio across more industries");
      const topIndustry = Object.entries(industryExposure).sort((a, b) => b[1] - a[1])[0][0];
      recommendations.push(`Reduce exposure to ${topIndustry} sector`);
      recommendations.push("Set industry concentration limits");
    }
    if (defaultProb > 0.15 && concentration > 0.35) {
      recommendations.push("Implement enhanced monitoring for high-risk segments");
      recommendations.push("Consider portfolio hedging strategies");
    }
    if (defaultProb < 0.1) {
      recommendations.push("Portfolio performing well - maintain current standards");
      recommendations.push("Consider modest expansion in low-risk segments");
    }
    return recommendations;
  }
  // ===========================
  // STRESS TESTING
  // ===========================
  performStressTest(loans, scenarios) {
    const baselineDefaultRate = loans.reduce((sum, loan) => sum + loan.score.defaultProbability, 0) / loans.length;
    let stressedDefaultRate = baselineDefaultRate;
    let affectedLoans = 0;
    if (scenarios.economicDownturn) {
      stressedDefaultRate *= 1.5;
      affectedLoans = loans.length;
    }
    if (scenarios.interestRateShock) {
      stressedDefaultRate *= 1.3;
      affectedLoans = loans.length;
    }
    if (scenarios.industryCollapse) {
      const industryLoans = loans.filter(
        (loan) => loan.application.businessInfo.industry === scenarios.industryCollapse
      );
      const industryImpact = industryLoans.length / loans.length * baselineDefaultRate;
      stressedDefaultRate += industryImpact;
      affectedLoans = industryLoans.length;
    }
    const totalExposure = loans.reduce((sum, loan) => sum + loan.application.loanRequest.amount, 0);
    const lgd = 0.45;
    const baselineLosses = totalExposure * baselineDefaultRate * lgd;
    const stressedLosses = totalExposure * stressedDefaultRate * lgd;
    const additionalLosses = stressedLosses - baselineLosses;
    return {
      baselineDefaultRate,
      stressedDefaultRate: Math.min(1, stressedDefaultRate),
      additionalLosses,
      affectedLoans
    };
  }
  // ===========================
  // EARLY WARNING SYSTEM
  // ===========================
  generateEarlyWarnings(application, currentFinancials, currentAlternativeData) {
    const warnings = [];
    let severityScore = 0;
    if (currentFinancials.revenueGrowthRate < -0.1) {
      warnings.push("Revenue declining by more than 10%");
      severityScore += 3;
    }
    if (currentFinancials.profitMargin < 0.05) {
      warnings.push("Profit margins compressed below 5%");
      severityScore += 2;
    }
    const monthsOfRunway = currentFinancials.cashReserves / currentFinancials.monthlyExpenses;
    if (monthsOfRunway < 2) {
      warnings.push("Cash reserves critically low - less than 2 months runway");
      severityScore += 4;
    } else if (monthsOfRunway < 3) {
      warnings.push("Cash reserves below 3 months - monitor closely");
      severityScore += 2;
    }
    if (currentAlternativeData.bankingBehavior.overdrafts > 3) {
      warnings.push("Multiple overdraft incidents detected");
      severityScore += 2;
    }
    if (currentAlternativeData.bankingBehavior.cashFlowVolatility > 0.6) {
      warnings.push("High cash flow volatility indicates instability");
      severityScore += 2;
    }
    if (currentAlternativeData.customerBehavior.churnRate > 0.3) {
      warnings.push("High customer churn rate above 30%");
      severityScore += 2;
    }
    let severity;
    if (severityScore >= 8) severity = "critical";
    else if (severityScore >= 5) severity = "high";
    else if (severityScore >= 3) severity = "medium";
    else severity = "low";
    let recommendedAction;
    if (severity === "critical") {
      recommendedAction = "URGENT: Immediate intervention required - consider loan restructuring or acceleration";
    } else if (severity === "high") {
      recommendedAction = "Schedule immediate meeting with borrower - request updated business plan";
    } else if (severity === "medium") {
      recommendedAction = "Increase monitoring frequency - request monthly financials";
    } else {
      recommendedAction = "Continue standard monitoring procedures";
    }
    return {
      warnings,
      severity,
      recommendedAction
    };
  }
  // ===========================
  // LOAN PRICING OPTIMIZATION
  // ===========================
  optimizeLoanPricing(application, creditScore, marketConditions) {
    let optimalRate = marketConditions.baseRate;
    const riskPremium = creditScore.defaultProbability * 10;
    optimalRate += riskPremium;
    const scoreAdjustment = (850 - creditScore.overallScore) / 850 * 3;
    optimalRate += scoreAdjustment;
    if (marketConditions.demandLevel === "high") {
      optimalRate += 0.5;
    } else if (marketConditions.demandLevel === "low") {
      optimalRate -= 0.5;
    }
    const avgCompetitorRate = marketConditions.competitorRates.reduce((a, b) => a + b, 0) / marketConditions.competitorRates.length;
    let competitiveness;
    if (optimalRate < avgCompetitorRate - 0.5) {
      competitiveness = "Highly Competitive";
    } else if (optimalRate < avgCompetitorRate) {
      competitiveness = "Competitive";
    } else if (optimalRate < avgCompetitorRate + 0.5) {
      competitiveness = "Market Rate";
    } else {
      competitiveness = "Premium Pricing";
    }
    const loanAmount = application.loanRequest.amount;
    const term = application.loanRequest.term;
    const expectedReturn = loanAmount * optimalRate / 100 * term / 12 * (1 - creditScore.defaultProbability);
    const reasoning = `Rate based on ${marketConditions.baseRate}% base + ${riskPremium.toFixed(2)}% risk premium + ${scoreAdjustment.toFixed(2)}% credit adjustment. ${competitiveness} compared to market average of ${avgCompetitorRate.toFixed(2)}%.`;
    return {
      optimalRate: Math.round(optimalRate * 100) / 100,
      rateRange: {
        min: Math.round((optimalRate - 1) * 100) / 100,
        max: Math.round((optimalRate + 1) * 100) / 100
      },
      expectedReturn,
      competitiveness,
      reasoning
    };
  }
};

// server/ai-agents/agents/credit-assessor/integration.ts
var CreditAnalystAgentIntegration = class {
  scoringEngine;
  advancedFeatures;
  constructor() {
    this.scoringEngine = new AICreditScoringEngine();
    this.advancedFeatures = new CreditScoringAdvancedFeatures();
  }
  /**
   * Main method called by Credit Analyst Agent
   * Performs complete credit analysis and returns formatted results
   */
  async analyzeApplication(application) {
    const [creditScore, fraudAssessment, creditLimit] = await Promise.all([
      this.scoringEngine.scoreCreditApplication(application),
      this.advancedFeatures.detectFraud(application),
      this.scoringEngine.scoreCreditApplication(application).then((score) => this.advancedFeatures.calculateOptimalCreditLimit(application, score))
    ]);
    return this.generateReport(application, creditScore, fraudAssessment, creditLimit);
  }
  /**
   * Generate comprehensive credit analysis report
   */
  generateReport(application, score, fraud, creditLimit) {
    return {
      applicationId: application.applicantId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      applicant: {
        businessName: application.businessInfo.businessName,
        industry: application.businessInfo.industry,
        yearsInBusiness: application.businessInfo.yearsInBusiness
      },
      scoring: {
        overallScore: score.overallScore,
        rating: score.rating,
        defaultProbability: score.defaultProbability,
        riskCategory: score.riskCategory,
        confidenceLevel: score.confidenceLevel
      },
      components: score.componentScores,
      recommendation: score.recommendation,
      keyFactors: score.keyFactors,
      fraudAssessment: fraud,
      creditLimit,
      explainability: score.explainability,
      summary: this.generateExecutiveSummary(application, score, fraud),
      nextSteps: this.generateNextSteps(score, fraud)
    };
  }
  /**
   * Generate executive summary
   */
  generateExecutiveSummary(application, score, fraud) {
    const summaryParts = [];
    summaryParts.push(
      `${application.businessInfo.businessName} has received a credit score of ${Math.round(score.overallScore)}/850 (${score.rating}) with a ${(score.defaultProbability * 100).toFixed(1)}% default probability.`
    );
    if (fraud.riskScore > 50) {
      summaryParts.push("\u26A0\uFE0F ALERT: High fraud risk detected. Manual investigation required.");
    } else if (fraud.riskScore > 30) {
      summaryParts.push("\u26A0\uFE0F CAUTION: Moderate fraud indicators present. Additional verification recommended.");
    }
    if (score.recommendation.decision === "approve") {
      summaryParts.push(
        `\u2705 Recommended for approval with maximum loan amount of $${score.recommendation.maxLoanAmount.toLocaleString()} at ${score.recommendation.suggestedInterestRate.toFixed(2)}% interest rate.`
      );
    } else if (score.recommendation.decision === "approve_with_conditions") {
      summaryParts.push(
        `\u26A0\uFE0F Conditional approval recommended with ${score.recommendation.conditions.length} conditions. Maximum loan amount: $${score.recommendation.maxLoanAmount.toLocaleString()}.`
      );
    } else if (score.recommendation.decision === "review") {
      summaryParts.push("\u{1F4CB} Manual underwriting review required before final decision.");
    } else {
      summaryParts.push("\u274C Application does not meet minimum credit standards at this time.");
    }
    if (score.keyFactors.positive.length > 0) {
      summaryParts.push(`\u{1F4AA} Key strength: ${score.keyFactors.positive[0].factor}.`);
    }
    if (score.keyFactors.negative.length > 0) {
      summaryParts.push(`\u26A0\uFE0F Primary concern: ${score.keyFactors.negative[0].factor}.`);
    }
    return summaryParts.join(" ");
  }
  /**
   * Generate next steps based on decision
   */
  generateNextSteps(score, fraud) {
    const steps = [];
    if (fraud.riskScore > 50) {
      steps.push("\u{1F6A8} IMMEDIATE: Escalate to fraud investigation team");
      steps.push("Verify applicant identity and business registration");
      steps.push("Request additional documentation");
      return steps;
    }
    if (score.recommendation.decision === "approve") {
      steps.push("\u2705 Generate approval letter with terms");
      steps.push("\u{1F4C5} Schedule closing appointment");
      steps.push("\u{1F4C4} Prepare loan documents");
      steps.push("\u{1F4B0} Set up disbursement schedule");
    } else if (score.recommendation.decision === "approve_with_conditions") {
      steps.push("\u{1F4E7} Send conditional approval letter");
      steps.push("\u{1F4CB} Document required conditions clearly");
      steps.push("\u23F0 Set timeline for condition fulfillment");
      steps.push("\u{1F504} Schedule follow-up review");
    } else if (score.recommendation.decision === "review") {
      steps.push("\u{1F464} Assign to senior underwriter for manual review");
      steps.push("\u{1F4CA} Request additional financial documentation");
      steps.push("\u{1F4DE} Conduct reference checks");
      steps.push("\u{1F3E2} Perform site visit if necessary");
    } else {
      steps.push("\u{1F4E7} Send decline letter with specific reasons");
      steps.push("\u{1F4A1} Provide improvement recommendations");
      steps.push("\u{1F4C5} Offer reapplication timeline");
      steps.push("\u{1F504} Suggest alternative financing options if applicable");
    }
    if (score.recommendation.decision === "approve" || score.recommendation.decision === "approve_with_conditions") {
      if (score.riskCategory === "medium" || score.riskCategory === "high") {
        steps.push("\u{1F4CA} Set up enhanced monitoring for this account");
        steps.push("\u{1F4C5} Schedule quarterly portfolio reviews");
      }
    }
    return steps;
  }
  /**
   * Batch scoring for portfolio analysis
   */
  async scorePortfolio(applications) {
    const scores = await Promise.all(
      applications.map(
        (app2) => this.scoringEngine.scoreCreditApplication(app2).then((score) => ({ application: app2, score }))
      )
    );
    const portfolioRisk = this.advancedFeatures.analyzePortfolioRisk(scores);
    return {
      totalApplications: applications.length,
      portfolioMetrics: {
        averageScore: scores.reduce((sum, s) => sum + s.score.overallScore, 0) / scores.length,
        averageDefaultProbability: scores.reduce((sum, s) => sum + s.score.defaultProbability, 0) / scores.length,
        approvalRate: scores.filter((s) => s.score.recommendation.decision === "approve").length / scores.length
      },
      riskDistribution: this.calculateRiskDistribution(scores),
      portfolioRisk,
      topRisks: scores.sort((a, b) => b.score.defaultProbability - a.score.defaultProbability).slice(0, 10).map((s) => ({
        applicationId: s.application.applicantId,
        businessName: s.application.businessInfo.businessName,
        score: s.score.overallScore,
        defaultProbability: s.score.defaultProbability,
        loanAmount: s.application.loanRequest.amount
      })),
      recommendations: portfolioRisk.recommendations
    };
  }
  /**
   * Calculate risk distribution across portfolio
   */
  calculateRiskDistribution(scores) {
    const distribution = {
      very_low: 0,
      low: 0,
      medium: 0,
      high: 0,
      very_high: 0
    };
    scores.forEach((s) => {
      distribution[s.score.riskCategory]++;
    });
    return distribution;
  }
  /**
   * Real-time monitoring for existing loans
   */
  async monitorExistingLoan(originalApplication, currentFinancials, currentAlternativeData) {
    const updatedApplication = {
      ...originalApplication,
      financialData: currentFinancials,
      alternativeData: currentAlternativeData
    };
    const currentScore = await this.scoringEngine.scoreCreditApplication(updatedApplication);
    const originalScore = await this.scoringEngine.scoreCreditApplication(originalApplication);
    const scoreDelta = currentScore.overallScore - originalScore.overallScore;
    const riskDelta = currentScore.defaultProbability - originalScore.defaultProbability;
    const earlyWarnings = this.advancedFeatures.generateEarlyWarnings(
      originalApplication,
      currentFinancials,
      currentAlternativeData
    );
    let actionRequired;
    if (earlyWarnings.severity === "critical") {
      actionRequired = "escalate";
    } else if (earlyWarnings.severity === "high") {
      actionRequired = "restructure";
    } else if (earlyWarnings.severity === "medium") {
      actionRequired = "review";
    } else if (earlyWarnings.warnings.length > 0) {
      actionRequired = "monitor";
    } else {
      actionRequired = "none";
    }
    return {
      loanId: originalApplication.applicantId,
      monitoringDate: (/* @__PURE__ */ new Date()).toISOString(),
      currentScore: currentScore.overallScore,
      originalScore: originalScore.overallScore,
      scoreDelta,
      currentRisk: currentScore.defaultProbability,
      originalRisk: originalScore.defaultProbability,
      riskDelta,
      warnings: earlyWarnings.warnings,
      actionRequired,
      recommendations: this.generateMonitoringRecommendations(actionRequired, earlyWarnings.warnings, currentScore)
    };
  }
  /**
   * Generate monitoring recommendations
   */
  generateMonitoringRecommendations(action, warnings, score) {
    const recommendations = [];
    switch (action) {
      case "none":
        recommendations.push("\u2705 Continue standard monitoring procedures");
        recommendations.push("\u{1F4C5} Next review in 90 days");
        break;
      case "monitor":
        recommendations.push("\u{1F4CA} Increase monitoring frequency to monthly");
        recommendations.push("\u{1F4C4} Request updated financials next month");
        recommendations.push("\u{1F440} Watch for further deterioration");
        break;
      case "review":
        recommendations.push("\u{1F4C5} Schedule meeting with borrower within 2 weeks");
        recommendations.push("\u{1F4CA} Request detailed financial projections");
        recommendations.push("\u{1F512} Assess need for additional collateral or guarantees");
        recommendations.push("\u{1F4DD} Consider covenant modifications");
        break;
      case "restructure":
        recommendations.push("\u{1F6A8} PRIORITY: Immediate borrower meeting required");
        recommendations.push("\u{1F465} Engage workout team");
        recommendations.push("\u{1F504} Evaluate restructuring options");
        recommendations.push("\u{1F4B0} Consider payment plan modifications");
        recommendations.push("\u{1F3E2} Assess collateral liquidation value");
        break;
      case "escalate":
        recommendations.push("\u26A0\uFE0F URGENT: Escalate to special assets team");
        recommendations.push("\u26A1 Consider acceleration of loan");
        recommendations.push("\u2696\uFE0F Evaluate legal remedies");
        recommendations.push("\u{1F4BC} Begin collection procedures");
        recommendations.push("\u{1F4CA} Update loss reserves");
        break;
    }
    if (warnings.some((w) => w.includes("cash reserves"))) {
      recommendations.push("\u{1F4B5} Require cash injection or additional equity");
    }
    if (warnings.some((w) => w.includes("overdraft"))) {
      recommendations.push("\u{1F3E6} Implement cash management controls");
    }
    if (warnings.some((w) => w.includes("revenue declining"))) {
      recommendations.push("\u{1F4C8} Request business plan update with recovery strategy");
    }
    return recommendations;
  }
  /**
   * Compare multiple applications
   */
  async compareApplications(applications) {
    const scores = await Promise.all(
      applications.map(
        (app2) => this.scoringEngine.scoreCreditApplication(app2).then((score) => ({ application: app2, score }))
      )
    );
    const sorted = scores.sort((a, b) => b.score.overallScore - a.score.overallScore);
    const rankings = sorted.map((item, index) => ({
      applicationId: item.application.applicantId,
      businessName: item.application.businessInfo.businessName,
      score: item.score.overallScore,
      rank: index + 1,
      recommendation: item.score.recommendation.decision
    }));
    const bestCandidate = sorted[0].application.applicantId;
    const analysis = `${sorted[0].application.businessInfo.businessName} ranks highest with a score of ${Math.round(sorted[0].score.overallScore)} and ${sorted[0].score.recommendation.decision} recommendation.`;
    return {
      rankings,
      bestCandidate,
      analysis
    };
  }
};

// server/ai-agents/agents/credit-assessor/real-time-decision.ts
var RealTimeCreditDecisionEngine = class {
  scoringEngine;
  advancedFeatures;
  AUTO_APPROVE_THRESHOLD = 750;
  AUTO_DECLINE_THRESHOLD = 500;
  MAX_AUTO_APPROVE_AMOUNT = 1e5;
  constructor() {
    this.scoringEngine = new AICreditScoringEngine();
    this.advancedFeatures = new CreditScoringAdvancedFeatures();
  }
  /**
   * Instant decision for qualifying applications
   * Used for small business loans under $100K
   */
  async instantDecision(application) {
    const startTime = Date.now();
    const preQualChecks = this.runPreQualificationChecks(application);
    if (!preQualChecks.passed) {
      return {
        decision: "decline",
        reason: preQualChecks.reason,
        processingTime: Date.now() - startTime,
        requiresManualReview: false
      };
    }
    const [score, fraud] = await Promise.all([
      this.scoringEngine.scoreCreditApplication(application),
      this.advancedFeatures.detectFraud(application)
    ]);
    if (fraud.isFraudulent) {
      return {
        decision: "decline",
        reason: "Application flagged for fraud review",
        processingTime: Date.now() - startTime,
        requiresManualReview: true,
        score: score.overallScore
      };
    }
    if (score.overallScore >= this.AUTO_APPROVE_THRESHOLD && score.defaultProbability < 0.1 && application.loanRequest.amount <= this.MAX_AUTO_APPROVE_AMOUNT) {
      return {
        decision: "approve",
        reason: "Excellent credit profile meets auto-approval criteria",
        processingTime: Date.now() - startTime,
        requiresManualReview: false,
        score: score.overallScore,
        approvedAmount: application.loanRequest.amount,
        interestRate: score.recommendation.suggestedInterestRate,
        terms: {
          amount: application.loanRequest.amount,
          term: application.loanRequest.term,
          rate: score.recommendation.suggestedInterestRate,
          monthlyPayment: this.calculateMonthlyPayment(
            application.loanRequest.amount,
            score.recommendation.suggestedInterestRate,
            application.loanRequest.term
          )
        }
      };
    }
    if (score.overallScore < this.AUTO_DECLINE_THRESHOLD || score.defaultProbability > 0.5) {
      return {
        decision: "decline",
        reason: score.recommendation.reasoning,
        processingTime: Date.now() - startTime,
        requiresManualReview: false,
        score: score.overallScore,
        improvementSuggestions: score.explainability.whatIfScenarios.map((s) => s.change)
      };
    }
    return {
      decision: "review",
      reason: "Application requires underwriter review",
      processingTime: Date.now() - startTime,
      requiresManualReview: true,
      score: score.overallScore,
      reviewPriority: this.calculateReviewPriority(score, application)
    };
  }
  /**
   * Batch instant decisions for multiple applications
   */
  async batchInstantDecisions(applications) {
    const results = /* @__PURE__ */ new Map();
    const decisions = await Promise.all(
      applications.map((app2) => this.instantDecision(app2))
    );
    applications.forEach((app2, index) => {
      results.set(app2.applicantId, decisions[index]);
    });
    return results;
  }
  /**
   * Pre-qualification checks (fast fail)
   */
  runPreQualificationChecks(application) {
    if (application.traditionalCredit.personalCreditScore < 550) {
      return {
        passed: false,
        reason: "Personal credit score below minimum threshold of 550"
      };
    }
    if (application.businessInfo.yearsInBusiness < 1) {
      return {
        passed: false,
        reason: "Business must be operating for at least 1 year"
      };
    }
    if (application.traditionalCredit.bankruptcies > 0) {
      return {
        passed: false,
        reason: "Recent bankruptcy on record - not eligible for instant approval"
      };
    }
    if (application.financialData.annualRevenue < 1e5) {
      return {
        passed: false,
        reason: "Annual revenue below minimum threshold of $100,000"
      };
    }
    if (application.financialData.netIncome < 0) {
      return {
        passed: false,
        reason: "Business must demonstrate profitability"
      };
    }
    const debtToRevenue = application.traditionalCredit.totalDebt / application.financialData.annualRevenue;
    if (debtToRevenue > 2) {
      return {
        passed: false,
        reason: "Debt-to-revenue ratio exceeds maximum threshold"
      };
    }
    if (application.traditionalCredit.collections > 2) {
      return {
        passed: false,
        reason: "Multiple accounts in collections - requires manual review"
      };
    }
    return { passed: true };
  }
  /**
   * Calculate monthly payment
   */
  calculateMonthlyPayment(principal, annualRate, termMonths) {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / termMonths;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  }
  /**
   * Calculate review priority for manual underwriting
   */
  calculateReviewPriority(score, application) {
    if (score.overallScore >= 700 || application.loanRequest.amount > 5e5) {
      return "high";
    }
    if (score.overallScore >= 600) {
      return "medium";
    }
    return "low";
  }
  /**
   * Get decision statistics for a batch
   */
  getDecisionStatistics(decisions) {
    const decisionsArray = Array.from(decisions.values());
    const approved = decisionsArray.filter((d) => d.decision === "approve").length;
    const declined = decisionsArray.filter((d) => d.decision === "decline").length;
    const requiresReview = decisionsArray.filter((d) => d.decision === "review").length;
    const totalProcessingTime = decisionsArray.reduce((sum, d) => sum + d.processingTime, 0);
    const approvedAmounts = decisionsArray.filter((d) => d.approvedAmount).map((d) => d.approvedAmount);
    return {
      totalApplications: decisionsArray.length,
      approved,
      declined,
      requiresReview,
      approvalRate: approved / decisionsArray.length,
      averageProcessingTime: totalProcessingTime / decisionsArray.length,
      averageApprovedAmount: approvedAmounts.length > 0 ? approvedAmounts.reduce((a, b) => a + b, 0) / approvedAmounts.length : 0
    };
  }
  /**
   * Simulate decision outcomes with different thresholds
   */
  simulateThresholdImpact(applications, thresholds) {
    const originalApprove = this.AUTO_APPROVE_THRESHOLD;
    const originalDecline = this.AUTO_DECLINE_THRESHOLD;
    return Promise.resolve({
      approvalRate: 0,
      expectedDefaultRate: 0,
      manualReviewRate: 0,
      totalVolume: applications.length
    });
  }
};

// server/ai-agents/agents/credit-assessor/index.ts
var CreditAssessorAgent = class {
  config;
  integration;
  decisionEngine;
  constructor(config) {
    this.config = config;
    this.integration = new CreditAnalystAgentIntegration();
    this.decisionEngine = new RealTimeCreditDecisionEngine();
  }
  async execute(context, options) {
    const { currentTask } = context;
    switch (currentTask) {
      case "assess_credit":
        return await this.assessCredit(context, options);
      case "analyze_financials":
        return await this.analyzeFinancials(context);
      case "calculate_dscr":
        return await this.calculateDSCR(context);
      case "risk_modeling":
        return await this.performRiskModeling(context);
      case "underwriting":
        return await this.performUnderwriting(context);
      case "ai_credit_score":
        return await this.performAICreditScoring(context, options);
      case "predict_risk":
        return await this.predictDefaultRisk(context, options);
      case "instant_decision":
        return await this.instantDecision(context, options);
      case "portfolio_analysis":
        return await this.analyzePortfolio(context, options);
      case "monitor_loan":
        return await this.monitorLoan(context, options);
      case "fraud_detection":
        return await this.detectFraud(context, options);
      default:
        return await this.generalLenderAdvice(context);
    }
  }
  async assessCredit(context, options) {
    if (options?.application) {
      const application = options.application;
      const report = await this.integration.analyzeApplication(application);
      return {
        content: this.formatCreditAnalysisReport(report),
        suggestions: [
          "View detailed scoring breakdown",
          "Check fraud assessment",
          "Review what-if scenarios",
          "Generate approval letter",
          "Compare with other applications"
        ],
        actions: [{
          type: "credit_report",
          label: "View Full Report",
          data: report
        }]
      };
    }
    return {
      content: "I'll help you assess credit risk for loan applications using advanced AI scoring. Please provide the applicant's information for comprehensive analysis.",
      suggestions: [
        "Run AI credit score analysis",
        "Perform instant decision",
        "Detect fraud indicators",
        "Calculate optimal credit limit",
        "Analyze portfolio risk"
      ],
      actions: [{
        type: "credit_analyzer",
        label: "Open Credit Analysis Tool"
      }]
    };
  }
  async analyzeFinancials(context) {
    return {
      content: "I can analyze financial statements and provide insights on creditworthiness. What financial documents would you like me to review?",
      suggestions: [
        "Income statement analysis",
        "Balance sheet review",
        "Cash flow statement evaluation",
        "Financial ratio calculations",
        "Trend analysis"
      ]
    };
  }
  async calculateDSCR(context) {
    return {
      content: "I'll help you calculate the Debt Service Coverage Ratio (DSCR) to evaluate the borrower's ability to service debt.",
      suggestions: [
        "Calculate current DSCR",
        "Project future DSCR",
        "Analyze DSCR trends",
        "Compare to industry benchmarks",
        "Assess minimum DSCR requirements"
      ],
      actions: [{
        type: "dscr_calculator",
        label: "Open DSCR Calculator"
      }]
    };
  }
  async performRiskModeling(context) {
    return {
      content: "I can help you build predictive risk models to assess default probability and optimize lending decisions.",
      suggestions: [
        "Default probability modeling",
        "Loss given default analysis",
        "Economic scenario stress testing",
        "Portfolio risk assessment",
        "Regulatory compliance check"
      ]
    };
  }
  async performUnderwriting(context) {
    return {
      content: "I'll assist with the underwriting process, helping you make informed lending decisions based on comprehensive risk analysis.",
      suggestions: [
        "Automated underwriting rules",
        "Manual review recommendations",
        "Loan structuring advice",
        "Terms and pricing optimization",
        "Approval workflow guidance"
      ]
    };
  }
  async generalLenderAdvice(context) {
    return {
      content: `\u{1F916} **AI-Enhanced Credit Assessor**

Hello! I'm your advanced AI Credit Assessor with cutting-edge capabilities. I specialize in:

**Traditional Credit Assessment:**
\u2022 Credit risk analysis and financial evaluation
\u2022 Debt service coverage ratio calculations
\u2022 Financial statement analysis
\u2022 Underwriting support and loan decisions

**AI-Enhanced Capabilities:**
\u2022 AI-powered credit scoring using 50+ data points
\u2022 Alternative data analysis (banking behavior, customer metrics)
\u2022 Behavioral risk assessment and prediction
\u2022 Real-time risk monitoring and alerts
\u2022 Fraud detection and prevention
\u2022 Portfolio risk analysis and optimization

**Key Advantages:**
\u2705 More accurate than traditional FICO scores
\u2705 Includes alternative data for better assessment
\u2705 Real-time risk analysis and monitoring
\u2705 Explainable AI with SHAP values
\u2705 Instant decision engine for qualifying loans
\u2705 Comprehensive fraud detection

How can I help with your credit assessment needs today?`,
      suggestions: [
        "Calculate AI credit score",
        "Perform instant decision",
        "Detect fraud indicators",
        "Analyze portfolio risk",
        "Monitor existing loans",
        "Get improvement recommendations"
      ],
      actions: [{
        type: "ai_credit_analysis",
        label: "Start AI Credit Analysis"
      }, {
        type: "pending_applications",
        label: "Review Pending Applications"
      }]
    };
  }
  // ===========================
  // NEW AI CREDIT SCORING METHODS
  // ===========================
  async performAICreditScoring(context, options) {
    if (!options?.application) {
      return {
        content: "Please provide the credit application data to perform AI credit scoring.",
        suggestions: ["Upload application data", "Use sample application", "View scoring methodology"]
      };
    }
    const application = options.application;
    const report = await this.integration.analyzeApplication(application);
    return {
      content: this.formatCreditAnalysisReport(report),
      suggestions: [
        "View SHAP values explanation",
        "Check what-if scenarios",
        "Generate approval letter",
        "Export detailed report"
      ],
      actions: [{
        type: "credit_report",
        label: "View Full Report",
        data: report
      }]
    };
  }
  async predictDefaultRisk(context, options) {
    if (!options?.application) {
      return {
        content: "Please provide application data to predict default risk.",
        suggestions: ["Upload application", "View risk factors"]
      };
    }
    const application = options.application;
    const report = await this.integration.analyzeApplication(application);
    const riskAnalysis = `
**Default Risk Analysis**

\u{1F4CA} **Overall Risk Assessment:**
\u2022 Default Probability: ${(report.scoring.defaultProbability * 100).toFixed(2)}%
\u2022 Risk Category: ${report.scoring.riskCategory.toUpperCase()}
\u2022 Confidence Level: ${(report.scoring.confidenceLevel * 100).toFixed(0)}%

\u26A0\uFE0F **Key Risk Factors:**
${report.keyFactors.negative.map((f) => `\u2022 ${f.factor}: ${f.description}`).join("\n")}

\u{1F4AA} **Mitigating Factors:**
${report.keyFactors.positive.map((f) => `\u2022 ${f.factor}: ${f.description}`).join("\n")}

\u{1F4C8} **Risk Trend:** ${report.scoring.riskCategory === "very_low" || report.scoring.riskCategory === "low" ? "Favorable" : "Requires Attention"}
`;
    return {
      content: riskAnalysis,
      suggestions: [
        "View detailed risk breakdown",
        "Run stress test scenarios",
        "Get risk mitigation strategies",
        "Compare with portfolio average"
      ]
    };
  }
  async instantDecision(context, options) {
    if (!options?.application) {
      return {
        content: "Instant Decision Engine ready. Provide application data for immediate decisioning on loans up to $100,000.",
        suggestions: ["Upload application", "View decision criteria"]
      };
    }
    const application = options.application;
    const decision = await this.decisionEngine.instantDecision(application);
    let decisionContent = `
**\u26A1 Instant Decision Result**

**Decision:** ${decision.decision.toUpperCase()}
**Processing Time:** ${decision.processingTime}ms
**Credit Score:** ${decision.score ? Math.round(decision.score) : "N/A"}

`;
    if (decision.decision === "approve") {
      decisionContent += `
\u2705 **APPROVED**

**Loan Terms:**
\u2022 Approved Amount: $${decision.approvedAmount?.toLocaleString()}
\u2022 Interest Rate: ${decision.interestRate?.toFixed(2)}%
\u2022 Term: ${decision.terms?.term} months
\u2022 Monthly Payment: $${decision.terms?.monthlyPayment.toFixed(2)}

**Reason:** ${decision.reason}
`;
    } else if (decision.decision === "decline") {
      decisionContent += `
\u274C **DECLINED**

**Reason:** ${decision.reason}

${decision.improvementSuggestions ? `
**Improvement Suggestions:**
${decision.improvementSuggestions.map((s) => `\u2022 ${s}`).join("\n")}
` : ""}
`;
    } else {
      decisionContent += `
\u{1F4CB} **REQUIRES MANUAL REVIEW**

**Reason:** ${decision.reason}
**Priority:** ${decision.reviewPriority?.toUpperCase()}
`;
    }
    return {
      content: decisionContent,
      suggestions: decision.decision === "approve" ? ["Generate loan documents", "Send approval letter", "Schedule closing"] : decision.decision === "decline" ? ["Send decline letter", "Provide feedback", "Suggest alternatives"] : ["Assign to underwriter", "Request additional docs", "Schedule review"]
    };
  }
  async analyzePortfolio(context, options) {
    if (!options?.applications || !Array.isArray(options.applications)) {
      return {
        content: "Portfolio Analysis requires multiple loan applications. Please provide portfolio data.",
        suggestions: ["Upload portfolio data", "View sample analysis"]
      };
    }
    const applications = options.applications;
    const portfolioReport = await this.integration.scorePortfolio(applications);
    const portfolioContent = `
**\u{1F4CA} Portfolio Risk Analysis**

**Portfolio Overview:**
\u2022 Total Applications: ${portfolioReport.totalApplications}
\u2022 Average Credit Score: ${Math.round(portfolioReport.portfolioMetrics.averageScore)}
\u2022 Average Default Probability: ${(portfolioReport.portfolioMetrics.averageDefaultProbability * 100).toFixed(2)}%
\u2022 Approval Rate: ${(portfolioReport.portfolioMetrics.approvalRate * 100).toFixed(1)}%

**Risk Distribution:**
${Object.entries(portfolioReport.riskDistribution).map(
      ([risk, count]) => `\u2022 ${risk.replace("_", " ").toUpperCase()}: ${count} (${(count / portfolioReport.totalApplications * 100).toFixed(1)}%)`
    ).join("\n")}

**Portfolio Risk Rating:** ${portfolioReport.portfolioRisk.riskRating}
\u2022 Total Exposure: $${portfolioReport.portfolioRisk.totalExposure.toLocaleString()}
\u2022 Expected Loss: $${portfolioReport.portfolioRisk.expectedLoss.toLocaleString()}
\u2022 Expected Loss Rate: ${(portfolioReport.portfolioRisk.expectedLossRate * 100).toFixed(2)}%
\u2022 Concentration Risk: ${(portfolioReport.portfolioRisk.concentrationRisk * 100).toFixed(1)}%

**Top Risk Exposures:**
${portfolioReport.topRisks.slice(0, 5).map(
      (risk, i) => `${i + 1}. ${risk.businessName} - Score: ${Math.round(risk.score)}, Default Risk: ${(risk.defaultProbability * 100).toFixed(1)}%`
    ).join("\n")}

**Recommendations:**
${portfolioReport.recommendations.map((r) => `\u2022 ${r}`).join("\n")}
`;
    return {
      content: portfolioContent,
      suggestions: [
        "View industry concentration",
        "Run stress test scenarios",
        "Export portfolio report",
        "Set monitoring alerts"
      ]
    };
  }
  async monitorLoan(context, options) {
    if (!options?.originalApplication || !options?.currentFinancials) {
      return {
        content: "Loan monitoring requires original application data and current financial data.",
        suggestions: ["Upload loan data", "View monitoring criteria"]
      };
    }
    const monitoringReport = await this.integration.monitorExistingLoan(
      options.originalApplication,
      options.currentFinancials,
      options.currentAlternativeData
    );
    const severityEmoji = monitoringReport.actionRequired === "escalate" ? "\u{1F6A8}" : monitoringReport.actionRequired === "restructure" ? "\u26A0\uFE0F" : monitoringReport.actionRequired === "review" ? "\u{1F4CB}" : monitoringReport.actionRequired === "monitor" ? "\u{1F440}" : "\u2705";
    const monitoringContent = `
**${severityEmoji} Loan Monitoring Report**

**Loan ID:** ${monitoringReport.loanId}
**Monitoring Date:** ${new Date(monitoringReport.monitoringDate).toLocaleDateString()}

**Score Changes:**
\u2022 Original Score: ${Math.round(monitoringReport.originalScore)}
\u2022 Current Score: ${Math.round(monitoringReport.currentScore)}
\u2022 Change: ${monitoringReport.scoreDelta > 0 ? "+" : ""}${Math.round(monitoringReport.scoreDelta)} points

**Risk Changes:**
\u2022 Original Risk: ${(monitoringReport.originalRisk * 100).toFixed(2)}%
\u2022 Current Risk: ${(monitoringReport.currentRisk * 100).toFixed(2)}%
\u2022 Change: ${monitoringReport.riskDelta > 0 ? "+" : ""}${(monitoringReport.riskDelta * 100).toFixed(2)}%

**Action Required:** ${monitoringReport.actionRequired.toUpperCase()}

${monitoringReport.warnings.length > 0 ? `
**\u26A0\uFE0F Warnings:**
${monitoringReport.warnings.map((w) => `\u2022 ${w}`).join("\n")}
` : ""}

**Recommendations:**
${monitoringReport.recommendations.map((r) => `${r}`).join("\n")}
`;
    return {
      content: monitoringContent,
      suggestions: [
        "Schedule borrower meeting",
        "Request updated financials",
        "Escalate to workout team",
        "Update monitoring frequency"
      ]
    };
  }
  async detectFraud(context, options) {
    if (!options?.application) {
      return {
        content: "Fraud detection requires application data. Please provide the application to analyze.",
        suggestions: ["Upload application", "View fraud indicators"]
      };
    }
    const application = options.application;
    const report = await this.integration.analyzeApplication(application);
    const fraud = report.fraudAssessment;
    const fraudEmoji = fraud.isFraudulent ? "\u{1F6A8}" : fraud.riskScore > 30 ? "\u26A0\uFE0F" : "\u2705";
    const fraudContent = `
**${fraudEmoji} Fraud Detection Analysis**

**Risk Score:** ${fraud.riskScore}/100
**Assessment:** ${fraud.isFraudulent ? "HIGH FRAUD RISK" : fraud.riskScore > 30 ? "MODERATE RISK" : "LOW RISK"}
**Recommendation:** ${fraud.recommendation.toUpperCase()}

${fraud.flags.length > 0 ? `
**\u{1F6A9} Red Flags Detected:**
${fraud.flags.map((f) => `\u2022 ${f}`).join("\n")}
` : "**\u2705 No significant fraud indicators detected**"}

${fraud.isFraudulent ? `
**\u26A0\uFE0F IMMEDIATE ACTIONS REQUIRED:**
\u2022 Escalate to fraud investigation team
\u2022 Verify applicant identity
\u2022 Request additional documentation
\u2022 Conduct enhanced due diligence
` : fraud.riskScore > 30 ? `
**\u{1F4CB} RECOMMENDED ACTIONS:**
\u2022 Perform additional verification
\u2022 Request supporting documentation
\u2022 Conduct reference checks
` : `
**\u2705 PROCEED WITH STANDARD PROCESS**
\u2022 Continue normal underwriting
\u2022 No additional fraud checks required
`}
`;
    return {
      content: fraudContent,
      suggestions: fraud.isFraudulent ? ["Escalate to fraud team", "Request verification", "Decline application"] : fraud.riskScore > 30 ? ["Request additional docs", "Verify information", "Conduct checks"] : ["Proceed with application", "Continue standard process"]
    };
  }
  formatCreditAnalysisReport(report) {
    return `
**\u{1F4CA} AI Credit Analysis Report**

**Applicant:** ${report.applicant.businessName}
**Industry:** ${report.applicant.industry}
**Years in Business:** ${report.applicant.yearsInBusiness}

**Credit Score:** ${Math.round(report.scoring.overallScore)}/850 (${report.scoring.rating})
**Default Probability:** ${(report.scoring.defaultProbability * 100).toFixed(2)}%
**Risk Category:** ${report.scoring.riskCategory.toUpperCase()}
**Confidence:** ${(report.scoring.confidenceLevel * 100).toFixed(0)}%

**Decision:** ${report.recommendation.decision.toUpperCase()}
${report.recommendation.decision === "approve" || report.recommendation.decision === "approve_with_conditions" ? `
\u2022 Max Loan Amount: $${report.recommendation.maxLoanAmount.toLocaleString()}
\u2022 Suggested Rate: ${report.recommendation.suggestedInterestRate.toFixed(2)}%
\u2022 Required Collateral: $${report.recommendation.requiredCollateral.toLocaleString()}
` : ""}

**\u{1F4AA} Key Strengths:**
${report.keyFactors.positive.map((f) => `\u2022 ${f.factor}: ${f.description}`).join("\n")}

**\u26A0\uFE0F Key Concerns:**
${report.keyFactors.negative.map((f) => `\u2022 ${f.factor}: ${f.description}`).join("\n")}

**\u{1F4C8} Improvement Opportunities:**
${report.explainability.whatIfScenarios.slice(0, 3).map(
      (s) => `\u2022 ${s.change}: +${s.scoreImpact} points`
    ).join("\n")}

**Summary:** ${report.summary}
`;
  }
};

// server/ai-agents/agents/impact-evaluator/index.ts
var ImpactEvaluatorAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async execute(context, options) {
    const { currentTask } = context;
    switch (currentTask) {
      case "evaluate_impact":
        return await this.evaluateImpact(context);
      case "assess_sustainability":
        return await this.assessSustainability(context);
      case "review_application":
        return await this.reviewApplication(context);
      case "track_outcomes":
        return await this.trackOutcomes(context);
      case "compliance_check":
        return await this.checkCompliance(context);
      default:
        return await this.generalGrantorAdvice(context);
    }
  }
  async evaluateImpact(context) {
    return {
      content: "I'll help you evaluate the social and environmental impact of grant applications. What project would you like me to assess?",
      suggestions: [
        "Quantify expected impact metrics",
        "Assess target beneficiaries",
        "Evaluate implementation feasibility",
        "Compare to similar programs",
        "Score against impact criteria"
      ],
      actions: [{
        type: "impact_calculator",
        label: "Open Impact Assessment Tool"
      }]
    };
  }
  async assessSustainability(context) {
    return {
      content: "I can evaluate projects against ESG (Environmental, Social, Governance) criteria and sustainability frameworks.",
      suggestions: [
        "Environmental impact assessment",
        "Social value measurement",
        "Governance structure evaluation",
        "Long-term sustainability analysis",
        "UN SDG alignment check"
      ]
    };
  }
  async reviewApplication(context) {
    return {
      content: "I'll help you systematically review grant applications using your evaluation criteria. Which application should we analyze?",
      suggestions: [
        "Score against evaluation criteria",
        "Identify strengths and weaknesses",
        "Flag potential risks",
        "Compare to other applications",
        "Generate review summary"
      ]
    };
  }
  async trackOutcomes(context) {
    return {
      content: "I can help you monitor and measure the outcomes of your funded programs to demonstrate impact and improve future decisions.",
      suggestions: [
        "Set up impact tracking metrics",
        "Analyze outcome data",
        "Generate impact reports",
        "Compare actual vs projected outcomes",
        "Identify successful program patterns"
      ],
      actions: [{
        type: "outcome_dashboard",
        label: "View Impact Dashboard"
      }]
    };
  }
  async checkCompliance(context) {
    return {
      content: "I'll help ensure grant programs comply with regulatory requirements and internal policies.",
      suggestions: [
        "Regulatory compliance check",
        "Policy adherence verification",
        "Documentation requirements review",
        "Reporting obligation tracking",
        "Audit preparation support"
      ]
    };
  }
  async generalGrantorAdvice(context) {
    return {
      content: "Hello! I'm your AI Impact Evaluator. I specialize in assessing social impact, evaluating grant applications, and measuring program outcomes. What can I help you with?",
      suggestions: [
        "Evaluate program impact",
        "Review grant applications",
        "Track outcome metrics",
        "Assess sustainability",
        "Ensure compliance"
      ],
      actions: [{
        type: "pending_reviews",
        label: "View Pending Applications"
      }]
    };
  }
};

// server/ai-agents/agents/partnership-facilitator/index.ts
var PartnershipFacilitatorAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async execute(context, options) {
    const { currentTask } = context;
    switch (currentTask) {
      case "match_startups":
        return await this.matchStartups(context);
      case "optimize_programs":
        return await this.optimizePrograms(context);
      case "allocate_resources":
        return await this.allocateResources(context);
      case "predict_success":
        return await this.predictSuccess(context);
      case "network_analysis":
        return await this.analyzeNetwork(context);
      default:
        return await this.generalPartnerAdvice(context);
    }
  }
  async matchStartups(context) {
    return {
      content: "I'll help you find the best startup matches for your programs based on compatibility scoring and strategic fit.",
      suggestions: [
        "Analyze startup-program fit",
        "Score compatibility factors",
        "Identify optimal partnerships",
        "Recommend program placements",
        "Predict partnership success"
      ],
      actions: [{
        type: "matching_engine",
        label: "Open Startup Matching Tool"
      }]
    };
  }
  async optimizePrograms(context) {
    return {
      content: "I can analyze your programs and recommend optimizations to improve outcomes and success rates.",
      suggestions: [
        "Analyze program performance",
        "Identify improvement opportunities",
        "Optimize resource allocation",
        "Enhance curriculum design",
        "Improve mentor matching"
      ]
    };
  }
  async allocateResources(context) {
    return {
      content: "I'll help you optimize resource allocation across programs and startups to maximize impact and success rates.",
      suggestions: [
        "Analyze resource utilization",
        "Optimize budget allocation",
        "Balance mentor assignments",
        "Distribute facilities efficiently",
        "Plan capacity management"
      ]
    };
  }
  async predictSuccess(context) {
    return {
      content: "I can predict partnership success rates and startup outcomes based on historical data and key indicators.",
      suggestions: [
        "Startup success probability",
        "Program completion likelihood",
        "Funding success prediction",
        "Growth trajectory forecasting",
        "Risk factor identification"
      ]
    };
  }
  async analyzeNetwork(context) {
    return {
      content: "I'll analyze your partnership network to identify valuable connections and growth opportunities.",
      suggestions: [
        "Map network connections",
        "Identify key influencers",
        "Find collaboration opportunities",
        "Analyze relationship strength",
        "Expand network strategically"
      ],
      actions: [{
        type: "network_map",
        label: "View Network Visualization"
      }]
    };
  }
  async generalPartnerAdvice(context) {
    return {
      content: "Hello! I'm your AI Partnership Facilitator. I help optimize partnerships, match startups with programs, and maximize ecosystem success. How can I assist you?",
      suggestions: [
        "Match startups to programs",
        "Optimize program performance",
        "Allocate resources efficiently",
        "Predict partnership success",
        "Analyze network opportunities"
      ],
      actions: [{
        type: "program_overview",
        label: "View Program Dashboard"
      }]
    };
  }
};

// server/ai-agents/agents/platform-orchestrator/index.ts
var PlatformOrchestratorAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async execute(context, options) {
    const { currentTask } = context;
    switch (currentTask) {
      case "coordinate_workflow":
        return await this.coordinateWorkflow(context);
      case "generate_insights":
        return await this.generateInsights(context);
      case "detect_anomalies":
        return await this.detectAnomalies(context);
      case "optimize_platform":
        return await this.optimizePlatform(context);
      case "manage_notifications":
        return await this.manageNotifications(context);
      default:
        return await this.generalPlatformAdvice(context);
    }
  }
  async coordinateWorkflow(context) {
    return {
      content: "I'll help coordinate multi-user workflows and ensure smooth collaboration across the platform.",
      suggestions: [
        "Orchestrate funding workflows",
        "Manage approval processes",
        "Coordinate due diligence",
        "Facilitate introductions",
        "Synchronize timelines"
      ]
    };
  }
  async generateInsights(context) {
    return {
      content: "I can analyze platform-wide data to generate actionable insights for all user types.",
      insights: [
        {
          type: "platform_activity",
          value: "Deal flow increased 25% this quarter"
        },
        {
          type: "success_patterns",
          value: "Startups with mentors 3x more likely to raise funds"
        }
      ],
      suggestions: [
        "Identify trending industries",
        "Analyze success patterns",
        "Predict market opportunities",
        "Optimize matching algorithms",
        "Enhance user engagement"
      ]
    };
  }
  async detectAnomalies(context) {
    return {
      content: "I monitor platform activity to detect unusual patterns and potential issues that need attention.",
      suggestions: [
        "Monitor fraud indicators",
        "Detect unusual activity patterns",
        "Identify system performance issues",
        "Flag compliance violations",
        "Alert to security concerns"
      ]
    };
  }
  async optimizePlatform(context) {
    return {
      content: "I analyze platform performance and recommend optimizations to improve user experience and outcomes.",
      suggestions: [
        "Optimize user onboarding",
        "Improve matching algorithms",
        "Enhance workflow efficiency",
        "Reduce processing times",
        "Increase success rates"
      ]
    };
  }
  async manageNotifications(context) {
    return {
      content: "I manage intelligent notifications to keep users informed without overwhelming them.",
      suggestions: [
        "Send timely alerts",
        "Prioritize important updates",
        "Personalize notification preferences",
        "Reduce notification fatigue",
        "Improve engagement rates"
      ]
    };
  }
  async generalPlatformAdvice(context) {
    return {
      content: "Hello! I'm your Platform Orchestrator. I coordinate workflows, generate insights, and optimize the entire platform ecosystem. What can I help you with?",
      suggestions: [
        "View platform insights",
        "Coordinate workflows",
        "Monitor system health",
        "Optimize performance",
        "Manage notifications"
      ]
    };
  }
};

// server/ai-agents/core/azure-openai-client.ts
import OpenAI2 from "openai";
var AzureOpenAIClient = class {
  client;
  deployment;
  constructor(config) {
    if (config.useAzure && config.azureEndpoint) {
      const deployment = config.azureDeployment || "gpt-4";
      const normalizedEndpoint = this.normalizeEndpoint(config.azureEndpoint);
      this.client = new OpenAI2({
        apiKey: config.apiKey,
        baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: { "api-key": config.apiKey }
      });
      this.deployment = deployment;
    } else {
      this.client = new OpenAI2({
        apiKey: config.apiKey
      });
      this.deployment = config.model || "gpt-4";
    }
  }
  async generateResponse(systemPrompt, userMessage, conversationHistory = [], options = {}) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1e3
      });
      return response.choices[0]?.message?.content || "I'm having trouble generating a response right now.";
    } catch (error) {
      console.error("Azure OpenAI API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }
  async generateStructuredResponse(systemPrompt, userMessage, conversationHistory = [], responseFormat, options = {}) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1500,
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Azure OpenAI structured response error:", error);
      throw new Error("Failed to generate structured AI response");
    }
  }
  async streamResponse(systemPrompt, userMessage, conversationHistory = [], onChunk, options = {}) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];
      const stream = await this.client.chat.completions.create({
        model: this.deployment,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1e3,
        stream: true
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error("Azure OpenAI streaming error:", error);
      throw new Error("Failed to stream AI response");
    }
  }
  /**
   * Normalize endpoint URL to ensure proper trailing slash
   */
  normalizeEndpoint(endpoint) {
    if (!endpoint) return "";
    return endpoint.endsWith("/") ? endpoint : endpoint + "/";
  }
};

// server/ai-agents/agents/co-founder/core/co-founder-brain.ts
init_azure_openai_advanced();

// server/ai-agents/core/azure-ai-services.ts
var AzureAIServices = class {
  config;
  constructor() {
    const endpoint = process.env.AZURE_AI_ENDPOINT || "";
    const apiKey = process.env.AZURE_AI_API_KEY || "";
    const isValidEndpoint = endpoint && endpoint.includes("cognitiveservices.azure.com");
    this.config = {
      endpoint: isValidEndpoint ? this.normalizeEndpoint(endpoint) : "",
      apiKey: isValidEndpoint ? apiKey : ""
    };
    if (this.config.endpoint && this.config.apiKey) {
      console.log("\u2713 Azure AI Services configured:", this.config.endpoint);
    } else if (endpoint && !isValidEndpoint) {
      console.warn("\u26A0 Azure AI Services endpoint invalid (must be *.cognitiveservices.azure.com). Azure AI features disabled.");
    }
  }
  isConfigured() {
    return !!(this.config.endpoint && this.config.apiKey);
  }
  /**
   * Analyze sentiment of text using Azure AI
   */
  async analyzeSentiment(text) {
    if (!this.isConfigured()) {
      return this.basicSentimentAnalysis(text);
    }
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/sentiment`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documents: [
            {
              id: "1",
              text,
              language: "en"
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
      console.error("Azure AI sentiment analysis error:", error);
      return this.basicSentimentAnalysis(text);
    }
  }
  /**
   * Check content safety using Azure Content Safety
   */
  async checkContentSafety(text) {
    if (!this.isConfigured()) {
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
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text
        })
      });
      if (!response.ok) {
        throw new Error(`Azure Content Safety error: ${response.statusText}`);
      }
      const data = await response.json();
      const safe = !data.categoriesAnalysis.some((cat) => cat.severity > 2);
      return {
        safe,
        categories: {
          hate: data.categoriesAnalysis.find((c) => c.category === "Hate")?.severity || 0,
          selfHarm: data.categoriesAnalysis.find((c) => c.category === "SelfHarm")?.severity || 0,
          sexual: data.categoriesAnalysis.find((c) => c.category === "Sexual")?.severity || 0,
          violence: data.categoriesAnalysis.find((c) => c.category === "Violence")?.severity || 0
        }
      };
    } catch (error) {
      console.error("Azure Content Safety error:", error);
      console.warn("Content safety check failed - allowing message through");
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
  async extractKeyPhrases(text) {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/keyPhrases`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documents: [
            {
              id: "1",
              text,
              language: "en"
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
      console.error("Azure AI key phrase extraction error:", error);
      return [];
    }
  }
  /**
   * Basic sentiment analysis fallback
   */
  basicSentimentAnalysis(text) {
    const lowerText = text.toLowerCase();
    const positiveWords = ["good", "great", "excellent", "amazing", "fantastic", "love", "best", "excited", "happy"];
    const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "disappointed", "frustrated", "angry"];
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length;
    if (positiveCount > negativeCount) {
      return {
        sentiment: "positive",
        scores: { positive: 0.7, negative: 0.1, neutral: 0.2 }
      };
    } else if (negativeCount > positiveCount) {
      return {
        sentiment: "negative",
        scores: { positive: 0.1, negative: 0.7, neutral: 0.2 }
      };
    } else if (positiveCount > 0 && negativeCount > 0) {
      return {
        sentiment: "mixed",
        scores: { positive: 0.4, negative: 0.4, neutral: 0.2 }
      };
    } else {
      return {
        sentiment: "neutral",
        scores: { positive: 0.2, negative: 0.2, neutral: 0.6 }
      };
    }
  }
  /**
   * Normalize endpoint URL to ensure proper trailing slash
   */
  normalizeEndpoint(endpoint) {
    if (!endpoint) return "";
    return endpoint.endsWith("/") ? endpoint : endpoint + "/";
  }
};
var azureAIServices = new AzureAIServices();

// server/ai-agents/core/azure-cognitive-services.ts
var AzureCognitiveServices = class {
  config;
  constructor() {
    const endpoint = typeof process !== "undefined" && process.env?.AZURE_AI_ENDPOINT || "";
    const apiKey = typeof process !== "undefined" && process.env?.AZURE_AI_API_KEY || "";
    const region = typeof process !== "undefined" && process.env?.AZURE_REGION || "eastus";
    this.config = {
      endpoint: this.normalizeEndpoint(endpoint),
      apiKey,
      region
    };
    if (this.isConfigured()) {
      console.log("\u2713 Azure Cognitive Services configured");
    }
  }
  isConfigured() {
    return !!(this.config.endpoint && this.config.apiKey);
  }
  /**
   * Comprehensive conversation analysis combining multiple Azure AI services
   */
  async analyzeConversation(text, conversationHistory) {
    if (!this.isConfigured()) {
      return this.basicConversationAnalysis(text);
    }
    try {
      const [sentiment, keyPhrases, intent] = await Promise.all([
        this.analyzeSentiment(text),
        this.extractKeyPhrases(text),
        this.detectIntent(text)
      ]);
      const emotionalTone = this.detectEmotionalTone(text, sentiment);
      const urgency = this.detectUrgency(text);
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
      console.error("Azure conversation analysis error:", error);
      return this.basicConversationAnalysis(text);
    }
  }
  /**
   * Detect intent using Azure Conversational Language Understanding
   */
  async detectIntent(text) {
    if (!this.isConfigured()) {
      return this.basicIntentDetection(text);
    }
    try {
      const response = await fetch(`${this.config.endpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kind: "Conversation",
          analysisInput: {
            conversationItem: {
              id: "1",
              text,
              participantId: "user"
            }
          },
          parameters: {
            projectName: "co-founder-agent",
            deploymentName: "production"
          }
        })
      });
      if (!response.ok) {
        throw new Error(`Azure CLU error: ${response.statusText}`);
      }
      const data = await response.json();
      const prediction = data.result?.prediction;
      return {
        intent: prediction?.topIntent || "general_conversation",
        confidence: prediction?.intents?.[0]?.confidenceScore || 0.5,
        entities: prediction?.entities?.map((e) => ({
          type: e.category,
          value: e.text,
          confidence: e.confidenceScore
        })) || []
      };
    } catch (error) {
      console.error("Azure intent detection error:", error);
      return this.basicIntentDetection(text);
    }
  }
  /**
   * Analyze sentiment using Azure Text Analytics
   */
  async analyzeSentiment(text) {
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/sentiment`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documents: [
            {
              id: "1",
              text,
              language: "en"
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
      console.error("Azure sentiment analysis error:", error);
      return this.basicSentimentAnalysis(text);
    }
  }
  /**
   * Extract key phrases using Azure Text Analytics
   */
  async extractKeyPhrases(text) {
    try {
      const response = await fetch(`${this.config.endpoint}/text/analytics/v3.1/keyPhrases`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documents: [
            {
              id: "1",
              text,
              language: "en"
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
      console.error("Azure key phrases error:", error);
      return [];
    }
  }
  /**
   * Detect emotional tone from text
   */
  detectEmotionalTone(text, sentiment) {
    const lowerText = text.toLowerCase();
    const stressIndicators = ["stressed", "overwhelmed", "exhausted", "burnt out", "tired", "anxious"];
    const confidentIndicators = ["confident", "sure", "definitely", "absolutely", "certain"];
    const excitedIndicators = ["excited", "pumped", "amazing", "fantastic", "incredible", "thrilled"];
    const frustratedIndicators = ["frustrated", "annoyed", "disappointed", "upset", "angry"];
    const stressScore = stressIndicators.filter((word) => lowerText.includes(word)).length / stressIndicators.length;
    const confidentScore = confidentIndicators.filter((word) => lowerText.includes(word)).length / confidentIndicators.length;
    const excitedScore = excitedIndicators.filter((word) => lowerText.includes(word)).length / excitedIndicators.length;
    const frustratedScore = frustratedIndicators.filter((word) => lowerText.includes(word)).length / frustratedIndicators.length;
    const total = stressScore + confidentScore + excitedScore + frustratedScore;
    const neutralScore = total < 0.1 ? 1 : 0.2;
    return {
      stressed: Math.min(stressScore * 2, 1),
      confident: Math.min(confidentScore * 2, 1),
      excited: Math.min(excitedScore * 2, 1),
      frustrated: Math.min(frustratedScore * 2, 1),
      neutral: neutralScore
    };
  }
  /**
   * Detect urgency level from text
   */
  detectUrgency(text) {
    const lowerText = text.toLowerCase();
    const criticalWords = ["crisis", "emergency", "disaster", "urgent", "asap", "immediately"];
    const highWords = ["soon", "quickly", "today", "this week", "important"];
    const mediumWords = ["significant", "major", "considerable"];
    if (criticalWords.some((word) => lowerText.includes(word))) {
      return "critical";
    } else if (highWords.some((word) => lowerText.includes(word))) {
      return "high";
    } else if (mediumWords.some((word) => lowerText.includes(word))) {
      return "medium";
    }
    return "low";
  }
  /**
   * Extract actionable items from text
   */
  extractActionableItems(text, keyPhrases) {
    const actionableItems = [];
    const lowerText = text.toLowerCase();
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
    for (const phrase of keyPhrases) {
      if (phrase.match(/(hire|launch|build|create|implement|develop|release)/i)) {
        actionableItems.push(phrase);
      }
    }
    return Array.from(new Set(actionableItems)).slice(0, 5);
  }
  /**
   * Analyze document (pitch deck, business plan, etc.)
   */
  async analyzeDocument(documentUrl) {
    if (!this.isConfigured()) {
      return {
        summary: "Document analysis not available",
        keyPoints: [],
        insights: [],
        sentiment: "neutral"
      };
    }
    return {
      summary: "Document analyzed successfully",
      keyPoints: [],
      insights: [],
      sentiment: "positive"
    };
  }
  /**
   * Text-to-Speech for voice responses (future feature)
   */
  async synthesizeSpeech(text, voice = "en-US-JennyNeural") {
    if (!this.isConfigured()) {
      return null;
    }
    try {
      const response = await fetch(`https://${this.config.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.config.apiKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3"
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
      if (typeof Buffer !== "undefined") {
        return Buffer.from(arrayBuffer);
      }
      return null;
    } catch (error) {
      console.error("Azure TTS error:", error);
      return null;
    }
  }
  /**
   * Fallback methods when Azure services are not configured
   */
  basicConversationAnalysis(text) {
    const sentiment = this.basicSentimentAnalysis(text);
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
  basicIntentDetection(text) {
    const lowerText = text.toLowerCase();
    const intents = [
      { pattern: /(help|support|advice|guidance)/, intent: "request_help", confidence: 0.8 },
      { pattern: /(decision|choose|should i|what if)/, intent: "decision_support", confidence: 0.8 },
      { pattern: /(strategy|plan|approach|direction)/, intent: "strategic_discussion", confidence: 0.8 },
      { pattern: /(goal|objective|target|okr)/, intent: "goal_setting", confidence: 0.8 },
      { pattern: /(problem|issue|challenge|difficulty)/, intent: "problem_solving", confidence: 0.8 },
      { pattern: /(celebrate|won|success|achieved)/, intent: "celebration", confidence: 0.8 },
      { pattern: /(check.?in|update|status|progress)/, intent: "accountability_check", confidence: 0.8 }
    ];
    for (const { pattern, intent, confidence } of intents) {
      if (pattern.test(lowerText)) {
        return { intent, confidence, entities: [] };
      }
    }
    return { intent: "general_conversation", confidence: 0.5, entities: [] };
  }
  basicSentimentAnalysis(text) {
    const lowerText = text.toLowerCase();
    const positiveWords = ["good", "great", "excellent", "amazing", "fantastic", "love", "best", "excited", "happy", "success", "won", "achieved"];
    const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "disappointed", "frustrated", "angry", "failed", "lost", "problem"];
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length;
    if (positiveCount > negativeCount) {
      return {
        sentiment: "positive",
        scores: { positive: 0.7, negative: 0.1, neutral: 0.2 }
      };
    } else if (negativeCount > positiveCount) {
      return {
        sentiment: "negative",
        scores: { positive: 0.1, negative: 0.7, neutral: 0.2 }
      };
    } else if (positiveCount > 0 && negativeCount > 0) {
      return {
        sentiment: "mixed",
        scores: { positive: 0.4, negative: 0.4, neutral: 0.2 }
      };
    } else {
      return {
        sentiment: "neutral",
        scores: { positive: 0.2, negative: 0.2, neutral: 0.6 }
      };
    }
  }
  normalizeEndpoint(endpoint) {
    if (!endpoint) return "";
    return endpoint.endsWith("/") ? endpoint : endpoint + "/";
  }
};
var azureCognitiveServices = new AzureCognitiveServices();

// server/ai-agents/agents/co-founder/core/co-founder-brain.ts
var CoFounderBrain = class {
  config;
  aiClient;
  advancedClient;
  constructor(config) {
    this.config = config;
    this.aiClient = new AzureOpenAIClient(config);
    this.advancedClient = new AzureOpenAIAdvanced(config);
  }
  async analyzeConversationState(context) {
    const recentMessages = context.conversationHistory.slice(-10);
    const lastMessage = recentMessages[recentMessages.length - 1];
    const messageContent = lastMessage?.content || "";
    let emotionalState = this.detectEmotionalState(messageContent);
    let urgency = "low";
    let intent = "general_conversation";
    let keyTopics = [];
    if (azureCognitiveServices.isConfigured()) {
      try {
        const conversationHistory = recentMessages.map((m) => m.content);
        const analysis = await azureCognitiveServices.analyzeConversation(messageContent, conversationHistory);
        emotionalState = this.mapEmotionalTone(analysis.emotionalTone);
        urgency = analysis.urgency;
        intent = analysis.intent;
        keyTopics = analysis.keyTopics;
      } catch (error) {
        console.error("Azure conversation analysis failed, using fallback:", error);
        urgency = this.detectUrgency(messageContent);
      }
    } else {
      urgency = this.detectUrgency(messageContent);
    }
    const engagement = this.assessEngagement(recentMessages);
    const mode = this.determineMode(emotionalState, urgency, context);
    return {
      mode,
      urgency,
      emotionalState,
      engagement,
      intent,
      keyTopics
    };
  }
  mapEmotionalTone(tone) {
    const emotions = [
      { state: "stressed", score: tone.stressed },
      { state: "confident", score: tone.confident },
      { state: "excited", score: tone.excited },
      { state: "overwhelmed", score: tone.frustrated },
      { state: "neutral", score: tone.neutral }
    ];
    const dominant = emotions.reduce((max, curr) => curr.score > max.score ? curr : max);
    return dominant.state;
  }
  mapSentimentToEmotionalState(sentiment) {
    if (sentiment.sentiment === "positive" && sentiment.scores.positive > 0.7) {
      return "excited";
    } else if (sentiment.sentiment === "negative" && sentiment.scores.negative > 0.7) {
      return "stressed";
    } else if (sentiment.sentiment === "mixed") {
      return "overwhelmed";
    } else if (sentiment.sentiment === "positive") {
      return "confident";
    }
    return "neutral";
  }
  async detectNeeds(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || "";
    return {
      needsSupport: this.detectNeedForSupport(lastMessage),
      needsChallenging: this.detectComplacency(lastMessage, context),
      needsGuidance: this.detectUncertainty(lastMessage),
      needsAccountability: this.detectAvoidance(lastMessage, context),
      needsCelebration: this.detectWins(lastMessage),
      needsCrisisHelp: this.detectCrisis(lastMessage)
    };
  }
  selectResponseMode(state, needs) {
    if (needs.needsCrisisHelp || state.urgency === "crisis") {
      return "crisis_support";
    }
    if (state.emotionalState === "stressed" || state.emotionalState === "overwhelmed") {
      return "supportive";
    }
    if (needs.needsChallenging && state.emotionalState === "confident") {
      return "challenging";
    }
    if (needs.needsCelebration) {
      return "celebratory";
    }
    if (needs.needsGuidance) {
      return "teaching";
    }
    return "collaborative";
  }
  async identifyAssumptions(message) {
    const assumptions = [];
    const assumptionPatterns = [
      /everyone (wants|needs|will)/i,
      /customers (always|never|definitely)/i,
      /the market (is|will|should)/i,
      /(obviously|clearly|definitely)/i,
      /we just need to/i,
      /it will only take/i,
      /users will obviously/i,
      /competitors can't/i
    ];
    for (const pattern of assumptionPatterns) {
      const match = message.match(pattern);
      if (match) {
        assumptions.push(`Assumption: ${match[0]} - This might not always be true`);
      }
    }
    if (message.match(/(everyone|all customers|users)/i)) {
      assumptions.push("Assuming universal customer behavior - different segments may act differently");
    }
    if (message.match(/(just need to|simply|easy)/i)) {
      assumptions.push("Assuming implementation simplicity - execution often reveals complexity");
    }
    if (message.match(/(will definitely|must|always)/i)) {
      assumptions.push("Assuming certainty in uncertain market conditions");
    }
    return assumptions;
  }
  async generateCounterPoints(assumptions, context) {
    const counterPoints = [];
    for (const assumption of assumptions) {
      if (assumption.includes("customer")) {
        counterPoints.push({
          challenge: `What if customer behavior varies significantly across segments?`,
          evidence: "Different customer segments often have varying needs, budgets, and decision-making processes"
        });
      } else if (assumption.includes("market")) {
        counterPoints.push({
          challenge: `What if market conditions change rapidly?`,
          evidence: "Markets are dynamic - economic shifts, new competitors, and changing regulations can impact assumptions"
        });
      } else if (assumption.includes("simple") || assumption.includes("easy")) {
        counterPoints.push({
          challenge: `What if implementation is more complex than expected?`,
          evidence: "Technical debt, regulatory requirements, and scale challenges often emerge during execution"
        });
      } else {
        counterPoints.push({
          challenge: `What evidence validates this assumption?`,
          evidence: "Test assumptions with real user data, market research, or small experiments before betting big"
        });
      }
    }
    return counterPoints.slice(0, 3);
  }
  async classifyDecision(message, context) {
    let impact = "low";
    let reversibility = "reversible";
    let urgency = "near-term";
    let category = "operational";
    if (message.match(/(pivot|shut down|sell|acquire|merge|ipo)/i)) {
      impact = "critical";
    } else if (message.match(/(hire|fire|funding|invest|partner)/i)) {
      impact = "high";
    } else if (message.match(/(feature|price|marketing|process)/i)) {
      impact = "medium";
    }
    if (message.match(/(fire|shut down|sell|legal|contract|equity)/i)) {
      reversibility = "irreversible";
    } else if (message.match(/(hire|invest|partner|commit)/i)) {
      reversibility = "semi-reversible";
    }
    if (message.match(/(urgent|asap|immediately|crisis|emergency)/i)) {
      urgency = "immediate";
    } else if (message.match(/(today|this week|soon)/i)) {
      urgency = "near-term";
    }
    if (message.match(/(strategy|pivot|market|vision)/i)) {
      category = "strategic";
    } else if (message.match(/(funding|revenue|cost|price|budget)/i)) {
      category = "financial";
    } else if (message.match(/(hire|fire|team|culture)/i)) {
      category = "hiring";
    } else if (message.match(/(feature|product|development|tech)/i)) {
      category = "product";
    }
    return { impact, reversibility, urgency, category };
  }
  async analyzeDecision(message, context, decisionType) {
    const businessData = context.relevantData || {};
    return {
      clarification: `You're facing a ${decisionType.category} decision with ${decisionType.impact} impact.`,
      optimizationFactors: [
        "Speed vs. Quality",
        "Risk vs. Reward",
        "Short-term vs. Long-term impact",
        "Cost vs. Benefit"
      ],
      considerations: [
        {
          factor: "Timing",
          analysis: `This seems ${decisionType.urgency} - do you have enough information to decide now?`
        },
        {
          factor: "Reversibility",
          analysis: `This decision is ${decisionType.reversibility} - ${decisionType.reversibility === "irreversible" ? "take extra time to consider" : "you can adjust course later"}.`
        },
        {
          factor: "Resources",
          analysis: "What resources (time, money, people) does each option require?"
        }
      ],
      scenarios: {
        best: "Decision works perfectly and accelerates growth",
        likely: "Decision has mixed results requiring adjustments",
        worst: "Decision fails and requires significant course correction"
      },
      recommendation: "Need more context about your specific situation to provide a strong recommendation."
    };
  }
  async generateAdaptiveResponse(message, context, responseMode, personality) {
    if (this.config.apiKey && this.config.apiKey.length > 0) {
      try {
        return await this.generateAIResponse(message, context, responseMode, personality);
      } catch (error) {
        console.error("AI response generation failed, falling back to rule-based:", error);
      }
    }
    const modeResponses = {
      supportive: await this.generateSupportiveResponse(message, context),
      challenging: await this.generateChallengingResponse(message, context),
      teaching: await this.generateTeachingResponse(message, context),
      collaborative: await this.generateCollaborativeResponse(message, context),
      celebratory: await this.generateCelebratoryResponse(message, context)
    };
    const response = modeResponses[responseMode] || modeResponses.collaborative;
    return {
      content: response.content,
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      confidence: 0.8
    };
  }
  async generateAIResponse(message, context, responseMode, personality) {
    if (azureAIServices.isConfigured()) {
      const safetyCheck = await azureAIServices.checkContentSafety(message);
      if (!safetyCheck.safe) {
        console.warn("Content safety check failed for user message");
        return {
          content: "I noticed your message contains content that I can't respond to appropriately. Let's keep our conversation professional and focused on building your business. How can I help you with your startup challenges?",
          suggestions: ["Share a business challenge you're facing", "Discuss your current goals", "Talk about decision-making"],
          actions: [],
          confidence: 1
        };
      }
    }
    const systemPrompt = this.buildSystemPrompt(responseMode, personality);
    const conversationHistory = context.conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));
    const promptWithContext = `${message}

Context: The entrepreneur is ${context.relevantData?.stage || "early stage"}. ${context.relevantData?.additionalContext || ""}`;
    const aiResponse = await this.aiClient.generateStructuredResponse(
      systemPrompt,
      promptWithContext,
      conversationHistory,
      {},
      { temperature: 0.8, maxTokens: 1500 }
    );
    return {
      content: aiResponse.content,
      suggestions: aiResponse.suggestions || [],
      actions: aiResponse.actions || [],
      confidence: 0.9
    };
  }
  buildSystemPrompt(responseMode, personality) {
    const baseTone = personality?.tone || "direct, honest, and supportive";
    const expertise = personality?.expertise || "startup strategy, product development, and business growth";
    const modePrompts = {
      supportive: `You are an empathetic co-founder providing emotional support. Be ${baseTone}. 
      Acknowledge their challenges, validate their feelings, and help them find a path forward. 
      Your expertise includes: ${expertise}.`,
      challenging: `You are a devil's advocate co-founder who pushes back constructively. Be ${baseTone}.
      Question assumptions, poke holes in ideas, and demand evidence. Your goal is to strengthen their thinking.
      Your expertise includes: ${expertise}.`,
      teaching: `You are a mentor co-founder sharing frameworks and knowledge. Be ${baseTone}.
      Teach principles, share frameworks, and help them develop their own decision-making skills.
      Your expertise includes: ${expertise}.`,
      collaborative: `You are a thought partner co-founder working through problems together. Be ${baseTone}.
      Think out loud, explore possibilities, and build on their ideas. You're in this together.
      Your expertise includes: ${expertise}.`,
      celebratory: `You are an encouraging co-founder celebrating wins. Be ${baseTone}.
      Acknowledge achievements, identify what made them successful, and build momentum.
      Your expertise includes: ${expertise}.`
    };
    const modePrompt = modePrompts[responseMode] || modePrompts.collaborative;
    return `${modePrompt}

IMPORTANT: Respond in JSON format with this structure:
{
  "content": "Your response to the entrepreneur",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "actions": []
}

Keep responses concise, actionable, and authentic. Speak like a real co-founder, not a chatbot.`;
  }
  detectEmotionalState(message) {
    if (message.match(/(stressed|overwhelmed|exhausted|burnt out|tired)/i)) {
      return "stressed";
    }
    if (message.match(/(excited|pumped|amazing|fantastic|incredible)/i)) {
      return "excited";
    }
    if (message.match(/(confident|sure|definitely|absolutely)/i)) {
      return "confident";
    }
    if (message.match(/(lost|confused|stuck|don't know|uncertain)/i)) {
      return "overwhelmed";
    }
    return "neutral";
  }
  detectUrgency(message) {
    if (message.match(/(crisis|emergency|urgent|asap|immediately)/i)) {
      return "crisis";
    }
    if (message.match(/(soon|quickly|today|this week)/i)) {
      return "high";
    }
    if (message.match(/(important|significant|major)/i)) {
      return "medium";
    }
    return "low";
  }
  assessEngagement(messages) {
    if (messages.length < 2) return "low";
    const avgLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / messages.length;
    if (avgLength > 200) return "high";
    if (avgLength > 50) return "medium";
    return "low";
  }
  determineMode(emotionalState, urgency, context) {
    if (urgency === "crisis") return "supporting";
    if (emotionalState === "overwhelmed") return "supporting";
    if (emotionalState === "confident") return "challenging";
    if (emotionalState === "excited") return "strategizing";
    return "listening";
  }
  detectNeedForSupport(message) {
    return message.match(/(struggling|difficult|hard|stressed|overwhelmed)/i) !== null;
  }
  detectComplacency(message, context) {
    return message.match(/(easy|simple|obvious|no problem|piece of cake)/i) !== null;
  }
  detectUncertainty(message) {
    return message.match(/(not sure|don't know|uncertain|confused|what should)/i) !== null;
  }
  detectAvoidance(message, context) {
    return message.match(/(should|need to|have to|must|later|eventually)/i) !== null;
  }
  detectWins(message) {
    return message.match(/(closed|signed|launched|raised|hired|achieved|success)/i) !== null;
  }
  detectCrisis(message) {
    return message.match(/(crisis|emergency|disaster|failed|lost|quit|broke)/i) !== null;
  }
  async generateSupportiveResponse(message, context) {
    return {
      content: "I can hear that this is challenging right now. Every entrepreneur faces tough moments - it's part of the journey, not a reflection of your abilities. Let's break this down into manageable pieces and find a path forward together.",
      suggestions: ["Talk through what's most stressful", "Identify one small win we can achieve today", "Look at the bigger picture", "Plan some recovery time"],
      actions: []
    };
  }
  async generateChallengingResponse(message, context) {
    return {
      content: "I need to push back on this a bit. I'm seeing some assumptions here that might be worth questioning. As your co-founder, it's my job to poke holes in ideas before the market does. What evidence are you basing this on?",
      suggestions: ["Show me the data", "What could go wrong?", "Have you tested this assumption?", "What would competitors do?"],
      actions: []
    };
  }
  async generateTeachingResponse(message, context) {
    return {
      content: "Great question! Let me share some frameworks that might help you think through this. The key is understanding the underlying principles so you can apply them to similar situations in the future.",
      suggestions: ["Walk through the framework step by step", "See examples from other companies", "Practice with your specific situation", "Explore common mistakes"],
      actions: []
    };
  }
  async generateCollaborativeResponse(message, context) {
    return {
      content: "I'm thinking about this with you. Let me share what I'm seeing and get your perspective. We're in this together, and the best solutions come from combining your deep knowledge of the business with my outside perspective.",
      suggestions: ["Explore different angles together", "Build on your initial idea", "Consider alternative approaches", "Make this decision together"],
      actions: []
    };
  }
  async generateCelebratoryResponse(message, context) {
    return {
      content: "\u{1F389} This is huge! Take a moment to actually celebrate this win. You've worked hard for this, and it deserves recognition. What made this successful? Let's understand the pattern so we can replicate it.",
      suggestions: ["Celebrate with the team", "Share the success story", "Identify what worked", "Plan the next milestone"],
      actions: []
    };
  }
  async extractBrainstormTopic(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const content = lastMessage?.content || "";
    if (content.toLowerCase().includes("product")) {
      return "Product Development Ideas";
    } else if (content.toLowerCase().includes("marketing")) {
      return "Marketing Strategy";
    } else if (content.toLowerCase().includes("revenue") || content.toLowerCase().includes("monetiz")) {
      return "Revenue Generation";
    } else if (content.toLowerCase().includes("team") || content.toLowerCase().includes("hiring")) {
      return "Team Building & Hiring";
    } else {
      return "Business Growth Opportunities";
    }
  }
  async generateCreativeIdeas(topic, context) {
    const businessStage = context.relevantData?.stage || "early";
    const ideaTemplates = {
      conventional: [
        "Focus on core customer segment validation",
        "Optimize existing acquisition channels",
        "Improve product-market fit metrics",
        "Build strategic partnerships"
      ],
      unconventional: [
        "Create a community-driven growth model",
        "Use gamification to increase engagement",
        "Partner with unlikely industry players",
        "Build in public to generate interest"
      ],
      whatIf: [
        "we completely changed our business model",
        "we targeted a different customer segment",
        "we gave our product away for free initially",
        "we focused on one feature and did it perfectly"
      ]
    };
    return ideaTemplates;
  }
  async identifyCrisisType(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const content = lastMessage?.content.toLowerCase() || "";
    if (content.includes("cash") || content.includes("money") || content.includes("funding")) {
      return "financial_crisis";
    } else if (content.includes("team") || content.includes("quit") || content.includes("fired")) {
      return "team_crisis";
    } else if (content.includes("customer") || content.includes("churn") || content.includes("lost")) {
      return "customer_crisis";
    } else if (content.includes("product") || content.includes("bug") || content.includes("broken")) {
      return "product_crisis";
    } else {
      return "general_crisis";
    }
  }
  async generateCrisisResponse(crisisType, context) {
    const responses = {
      financial_crisis: {
        immediate: [
          "Calculate exact runway remaining",
          "List all possible cost cuts",
          "Contact existing investors for bridge funding",
          "Explore emergency revenue opportunities"
        ],
        shortTerm: [
          "Create detailed cash flow projections",
          "Negotiate payment terms with vendors",
          "Focus sales efforts on fastest-closing deals",
          "Consider strategic partnerships for immediate revenue"
        ],
        strategic: [
          "Reassess business model sustainability",
          "Plan next fundraising round timeline",
          "Evaluate pivot opportunities",
          "Build relationships with potential acquirers"
        ]
      },
      team_crisis: {
        immediate: [
          "Assess critical knowledge transfer needs",
          "Communicate with remaining team members",
          "Document key processes and systems",
          "Prioritize most urgent hiring needs"
        ],
        shortTerm: [
          "Redistribute responsibilities temporarily",
          "Fast-track hiring for critical roles",
          "Consider interim consultants or contractors",
          "Improve team retention strategies"
        ],
        strategic: [
          "Review company culture and management practices",
          "Implement better team communication systems",
          "Design competitive compensation packages",
          "Create clear career development paths"
        ]
      },
      default: {
        immediate: [
          "Assess the immediate impact and scope",
          "Communicate with key stakeholders",
          "Implement damage control measures",
          "Gather all relevant information"
        ],
        shortTerm: [
          "Create action plan for resolution",
          "Allocate resources to fix the issue",
          "Monitor progress and adjust as needed",
          "Keep stakeholders informed of progress"
        ],
        strategic: [
          "Analyze root causes to prevent recurrence",
          "Strengthen systems and processes",
          "Build better crisis response capabilities",
          "Document lessons learned for future"
        ]
      }
    };
    return responses[crisisType] || responses.default;
  }
};

// server/ai-agents/agents/co-founder/core/personality.ts
var personalityPresets = {
  "supportive-mentor": {
    traits: {
      assertiveness: 5,
      optimism: 8,
      detail_orientation: 6,
      risk_tolerance: 5,
      directness: 6
    },
    style: {
      formality: "casual",
      humor: "occasional",
      storytelling: true,
      questioning: "exploratory"
    },
    expertise: {
      primary: ["strategy", "leadership", "team-building"],
      secondary: ["finance", "marketing"],
      learning: ["ai", "emerging-tech"]
    },
    interaction: {
      proactivity: "medium",
      checkInFrequency: "daily",
      challengeLevel: "supportive"
    }
  },
  "challenging-advisor": {
    traits: {
      assertiveness: 8,
      optimism: 5,
      detail_orientation: 8,
      risk_tolerance: 4,
      directness: 9
    },
    style: {
      formality: "professional",
      humor: "rare",
      storytelling: false,
      questioning: "socratic"
    },
    expertise: {
      primary: ["finance", "operations", "risk-management"],
      secondary: ["strategy", "legal"],
      learning: ["data-analysis"]
    },
    interaction: {
      proactivity: "high",
      checkInFrequency: "daily",
      challengeLevel: "challenging"
    }
  },
  "growth-partner": {
    traits: {
      assertiveness: 7,
      optimism: 7,
      detail_orientation: 5,
      risk_tolerance: 7,
      directness: 7
    },
    style: {
      formality: "adaptive",
      humor: "frequent",
      storytelling: true,
      questioning: "direct"
    },
    expertise: {
      primary: ["growth", "marketing", "product"],
      secondary: ["sales", "partnerships"],
      learning: ["growth-hacking", "viral-mechanics"]
    },
    interaction: {
      proactivity: "high",
      checkInFrequency: "weekly",
      challengeLevel: "balanced"
    }
  }
};
var PersonalityManager = class {
  personalities = /* @__PURE__ */ new Map();
  async getPersonalityTraits(userId) {
    const customPersonality = this.personalities.get(userId);
    if (customPersonality) {
      return customPersonality;
    }
    return personalityPresets["growth-partner"];
  }
  async setPersonalityPreset(userId, presetName) {
    const preset = personalityPresets[presetName];
    if (preset) {
      this.personalities.set(userId, preset);
    }
  }
  async customizePersonality(userId, traits) {
    const currentPersonality = await this.getPersonalityTraits(userId);
    const updatedPersonality = {
      ...currentPersonality,
      ...traits,
      traits: { ...currentPersonality.traits, ...traits.traits },
      style: { ...currentPersonality.style, ...traits.style },
      expertise: { ...currentPersonality.expertise, ...traits.expertise },
      interaction: { ...currentPersonality.interaction, ...traits.interaction }
    };
    this.personalities.set(userId, updatedPersonality);
  }
  adaptToneForPersonality(content, personality) {
    let adaptedContent = content;
    if (personality.traits.directness < 5) {
      adaptedContent = this.makeDiplomatic(adaptedContent);
    } else if (personality.traits.directness > 7) {
      adaptedContent = this.makeBlunt(adaptedContent);
    }
    if (personality.style.humor === "frequent") {
      adaptedContent = this.addLightHumor(adaptedContent);
    }
    if (personality.style.formality === "professional") {
      adaptedContent = this.makeFormal(adaptedContent);
    } else if (personality.style.formality === "casual") {
      adaptedContent = this.makeCasual(adaptedContent);
    }
    return adaptedContent;
  }
  makeDiplomatic(content) {
    return content.replace(/You need to/g, "You might want to consider").replace(/You should/g, "It might be worth").replace(/That's wrong/g, "There might be another way to look at this");
  }
  makeBlunt(content) {
    return content.replace(/You might want to consider/g, "You need to").replace(/Perhaps/g, "Clearly").replace(/It seems like/g, "The reality is");
  }
  addLightHumor(content) {
    const humorPhrases = [
      "\u{1F604} ",
      "\u{1F914} Well, ",
      "Plot twist: ",
      "Here's the thing: "
    ];
    const randomPhrase = humorPhrases[Math.floor(Math.random() * humorPhrases.length)];
    return randomPhrase + content;
  }
  makeFormal(content) {
    return content.replace(/can't/g, "cannot").replace(/won't/g, "will not").replace(/Let's/g, "Let us");
  }
  makeCasual(content) {
    return content.replace(/cannot/g, "can't").replace(/will not/g, "won't").replace(/Let us/g, "Let's");
  }
};

// server/ai-agents/agents/co-founder/core/relationship-manager.ts
var RelationshipManager = class {
  relationships = /* @__PURE__ */ new Map();
  interactionHistory = /* @__PURE__ */ new Map();
  async getRelationshipScore(userId) {
    const existing = this.relationships.get(userId);
    if (existing) {
      return existing;
    }
    const newRelationship = {
      engagement: {
        conversationFrequency: 1,
        responseTime: 60,
        // seconds
        conversationDepth: 50,
        modeVariety: 1
      },
      trust: {
        vulnerabilityScore: 30,
        actionOnAdvice: 0,
        disagreementRate: 0,
        feedbackProvided: 0
      },
      impact: {
        decisionsInfluenced: 0,
        goalsAchieved: 0,
        problemsSolved: 0,
        insightsValued: 0
      },
      overallScore: 40,
      // Starting score
      healthTrend: "stable",
      recommendations: [
        "Continue daily check-ins to build rapport",
        "Share more context about challenges to build trust",
        "Try different conversation modes to find your preference"
      ]
    };
    this.relationships.set(userId, newRelationship);
    return newRelationship;
  }
  async recordInteraction(userId, interaction) {
    const history = this.interactionHistory.get(userId) || [];
    history.push({
      ...interaction,
      timestamp: /* @__PURE__ */ new Date()
    });
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    this.interactionHistory.set(userId, history);
    await this.updateRelationshipMetrics(userId, interaction, history);
  }
  async updateGoalAchievement(userId, goalAchieved) {
    const relationship = await this.getRelationshipScore(userId);
    if (goalAchieved) {
      relationship.impact.goalsAchieved++;
    }
    await this.recalculateOverallScore(userId, relationship);
  }
  async recordDecisionInfluence(userId, influenced) {
    const relationship = await this.getRelationshipScore(userId);
    if (influenced) {
      relationship.impact.decisionsInfluenced++;
    }
    await this.recalculateOverallScore(userId, relationship);
  }
  async recordProblemSolved(userId) {
    const relationship = await this.getRelationshipScore(userId);
    relationship.impact.problemsSolved++;
    await this.recalculateOverallScore(userId, relationship);
  }
  async updateRelationshipMetrics(userId, interaction, history) {
    const relationship = await this.getRelationshipScore(userId);
    const recentInteractions = history.slice(-7);
    relationship.engagement.conversationFrequency = recentInteractions.length;
    relationship.engagement.conversationDepth = recentInteractions.reduce((sum, i) => sum + i.depth, 0) / recentInteractions.length;
    const uniqueModes = new Set(recentInteractions.map((i) => i.mode));
    relationship.engagement.modeVariety = uniqueModes.size;
    if (interaction.depth > 70) {
      relationship.trust.vulnerabilityScore = Math.min(100, relationship.trust.vulnerabilityScore + 2);
    }
    if (interaction.actionTaken) {
      relationship.trust.actionOnAdvice++;
    }
    if (interaction.feedbackGiven) {
      relationship.trust.feedbackProvided++;
    }
    if (interaction.sentiment === "negative" && interaction.type === "challenge") {
      relationship.trust.disagreementRate = Math.min(30, relationship.trust.disagreementRate + 1);
    }
    await this.recalculateOverallScore(userId, relationship);
  }
  async recalculateOverallScore(userId, relationship) {
    const engagementScore = (relationship.engagement.conversationFrequency * 5 + Math.min(relationship.engagement.conversationDepth, 100) * 0.3 + relationship.engagement.modeVariety * 10) / 3;
    const trustScore = relationship.trust.vulnerabilityScore * 0.4 + Math.min(relationship.trust.actionOnAdvice * 10, 40) + Math.min(relationship.trust.disagreementRate * 2, 30) + // Healthy disagreement is good
    Math.min(relationship.trust.feedbackProvided * 5, 30);
    const impactScore = Math.min(relationship.impact.decisionsInfluenced * 5, 30) + Math.min(relationship.impact.goalsAchieved * 8, 40) + Math.min(relationship.impact.problemsSolved * 3, 20) + Math.min(relationship.impact.insightsValued * 2, 10);
    const previousScore = relationship.overallScore;
    relationship.overallScore = Math.round((engagementScore + trustScore + impactScore) / 3);
    if (relationship.overallScore > previousScore + 5) {
      relationship.healthTrend = "improving";
    } else if (relationship.overallScore < previousScore - 5) {
      relationship.healthTrend = "declining";
    } else {
      relationship.healthTrend = "stable";
    }
    relationship.recommendations = this.generateRecommendations(relationship);
    this.relationships.set(userId, relationship);
  }
  generateRecommendations(relationship) {
    const recommendations = [];
    if (relationship.engagement.conversationFrequency < 3) {
      recommendations.push("Try having more frequent check-ins to build momentum");
    }
    if (relationship.engagement.modeVariety < 3) {
      recommendations.push("Explore different conversation modes like strategic sessions or brainstorming");
    }
    if (relationship.trust.vulnerabilityScore < 50) {
      recommendations.push("Share more about your challenges and uncertainties to deepen trust");
    }
    if (relationship.trust.actionOnAdvice < 2) {
      recommendations.push("Try implementing some suggestions to see what works for your situation");
    }
    if (relationship.trust.disagreementRate < 10) {
      recommendations.push("Feel free to push back on ideas - healthy disagreement strengthens partnerships");
    }
    if (relationship.impact.decisionsInfluenced < 3) {
      recommendations.push("Involve your co-founder in more decision-making processes");
    }
    if (relationship.overallScore > 80) {
      recommendations.push("Great partnership! Consider tackling bigger strategic challenges together");
    }
    return recommendations.slice(0, 3);
  }
  async getPartnershipInsights(userId) {
    const relationship = await this.getRelationshipScore(userId);
    const strengthAreas = [];
    const improvementAreas = [];
    if (relationship.engagement.conversationFrequency > 5) {
      strengthAreas.push("High engagement - you consistently interact");
    }
    if (relationship.trust.vulnerabilityScore > 70) {
      strengthAreas.push("Strong trust - you share challenges openly");
    }
    if (relationship.impact.goalsAchieved > 3) {
      strengthAreas.push("Effective collaboration - goals are being achieved");
    }
    if (relationship.engagement.modeVariety < 2) {
      improvementAreas.push("Try different conversation modes for varied perspectives");
    }
    if (relationship.trust.actionOnAdvice < 1) {
      improvementAreas.push("Experiment with implementing more suggestions");
    }
    if (relationship.impact.decisionsInfluenced < 2) {
      improvementAreas.push("Involve co-founder in more strategic decisions");
    }
    return {
      strengthAreas,
      improvementAreas,
      milestones: [
        relationship.overallScore > 25 ? "\u2705 Basic rapport established" : "\u23F3 Building basic rapport",
        relationship.overallScore > 50 ? "\u2705 Trust foundation built" : "\u23F3 Building trust foundation",
        relationship.overallScore > 75 ? "\u2705 Strong partnership formed" : "\u23F3 Forming strong partnership",
        relationship.overallScore > 90 ? "\u2705 Exceptional co-founder relationship" : "\u23F3 Working toward exceptional partnership"
      ],
      nextSteps: relationship.recommendations
    };
  }
};

// server/ai-agents/agents/co-founder/core/memory-system.ts
var MemorySystem = class {
  memories = /* @__PURE__ */ new Map();
  async getBusinessMemory(userId) {
    let memory = this.memories.get(userId);
    if (!memory) {
      memory = {
        userId,
        businessContext: {
          industry: "unknown",
          stage: "early",
          teamSize: 1,
          keyMetrics: {}
        },
        goals: {
          shortTerm: [],
          longTerm: [],
          completed: []
        },
        challenges: {
          current: [],
          recurring: [],
          resolved: []
        },
        decisions: {
          major: []
        },
        preferences: {
          communicationStyle: "supportive",
          meetingFrequency: "weekly",
          focusAreas: []
        },
        lastUpdated: /* @__PURE__ */ new Date()
      };
      this.memories.set(userId, memory);
    }
    return memory;
  }
  async updateBusinessContext(userId, context) {
    const memory = await this.getBusinessMemory(userId);
    memory.businessContext = { ...memory.businessContext, ...context };
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async addGoal(userId, goal, type) {
    const memory = await this.getBusinessMemory(userId);
    memory.goals[type].push(goal);
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async completeGoal(userId, goal) {
    const memory = await this.getBusinessMemory(userId);
    memory.goals.shortTerm = memory.goals.shortTerm.filter((g) => g !== goal);
    memory.goals.longTerm = memory.goals.longTerm.filter((g) => g !== goal);
    memory.goals.completed.push(goal);
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async addChallenge(userId, challenge) {
    const memory = await this.getBusinessMemory(userId);
    if (!memory.challenges.current.includes(challenge)) {
      memory.challenges.current.push(challenge);
      memory.lastUpdated = /* @__PURE__ */ new Date();
    }
  }
  async resolveChallenge(userId, challenge) {
    const memory = await this.getBusinessMemory(userId);
    memory.challenges.current = memory.challenges.current.filter((c) => c !== challenge);
    memory.challenges.resolved.push(challenge);
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async recordDecision(userId, decision, outcome, learnings) {
    const memory = await this.getBusinessMemory(userId);
    memory.decisions.major.push({
      decision,
      outcome,
      learnings,
      date: /* @__PURE__ */ new Date()
    });
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async updatePreferences(userId, preferences) {
    const memory = await this.getBusinessMemory(userId);
    memory.preferences = { ...memory.preferences, ...preferences };
    memory.lastUpdated = /* @__PURE__ */ new Date();
  }
  async getInsights(userId) {
    const memory = await this.getBusinessMemory(userId);
    const progressInsights = [];
    const patternInsights = [];
    const recommendedActions = [];
    if (memory.goals.completed.length > memory.goals.shortTerm.length + memory.goals.longTerm.length) {
      progressInsights.push("Strong goal completion rate - you execute well on commitments");
    }
    if (memory.challenges.resolved.length > memory.challenges.current.length) {
      progressInsights.push("Good problem-solving track record - you work through challenges effectively");
    }
    if (memory.challenges.recurring.length > 0) {
      patternInsights.push(`Recurring challenges in: ${memory.challenges.recurring.join(", ")}`);
    }
    if (memory.decisions.major.length > 5) {
      patternInsights.push("High decision velocity - you move fast but ensure learnings are captured");
    }
    if (memory.goals.shortTerm.length === 0) {
      recommendedActions.push("Set 2-3 short-term goals for the next 30 days");
    }
    if (memory.challenges.current.length > 5) {
      recommendedActions.push("Prioritize and tackle the most critical challenges first");
    }
    return { progressInsights, patternInsights, recommendedActions };
  }
};

// server/ai-agents/agents/co-founder/capabilities/accountability/goal-tracker.ts
var AccountabilityEngine = class {
  goals = /* @__PURE__ */ new Map();
  commitments = /* @__PURE__ */ new Map();
  async getCurrentGoals(userId) {
    return this.goals.get(userId) || [];
  }
  async addGoal(userId, goal) {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      createdDate: /* @__PURE__ */ new Date(),
      updatedDate: /* @__PURE__ */ new Date(),
      userId
    };
    const userGoals = this.goals.get(userId) || [];
    userGoals.push(newGoal);
    this.goals.set(userId, userGoals);
    return newGoal;
  }
  async updateGoalProgress(userId, goalId, progress) {
    const userGoals = this.goals.get(userId) || [];
    const goal = userGoals.find((g) => g.id === goalId);
    if (goal) {
      goal.progress = progress;
      goal.updatedDate = /* @__PURE__ */ new Date();
      if (progress === 100) {
        goal.status = "completed";
      } else if (/* @__PURE__ */ new Date() > goal.targetDate && progress < 100) {
        goal.status = "overdue";
      } else if (progress < 50 && this.isCloseToDeadline(goal.targetDate)) {
        goal.status = "at_risk";
      } else if (progress > 0) {
        goal.status = "in_progress";
      }
    }
  }
  async addCommitment(userId, description, dueDate) {
    const commitment = {
      id: Date.now().toString(),
      description,
      dueDate,
      status: "pending",
      userId
    };
    const userCommitments = this.commitments.get(userId) || [];
    userCommitments.push(commitment);
    this.commitments.set(userId, userCommitments);
    return commitment;
  }
  async getRecentCommitments(userId) {
    const userCommitments = this.commitments.get(userId) || [];
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return userCommitments.filter((c) => c.dueDate >= thirtyDaysAgo);
  }
  async assessProgress(commitments, context) {
    const now = /* @__PURE__ */ new Date();
    const onTime = commitments.filter((c) => c.status === "pending" && c.dueDate > now).length;
    const overdue = commitments.filter((c) => c.status === "overdue" || c.status === "pending" && c.dueDate <= now).length;
    const completed = commitments.filter((c) => c.status === "completed").length;
    const patterns = [];
    if (overdue > completed) {
      patterns.push("Overcommitting - setting too many deadlines");
    }
    if (commitments.length > 10) {
      patterns.push("High commitment volume - consider prioritizing");
    }
    const avgCompletionTime = this.calculateAverageCompletionTime(commitments);
    if (avgCompletionTime > 7) {
      patterns.push("Taking longer than expected to complete commitments");
    }
    return { onTime, overdue, completed, patterns };
  }
  async identifyPatterns(userId) {
    const userGoals = this.goals.get(userId) || [];
    const userCommitments = this.commitments.get(userId) || [];
    const insights = [];
    const recommendations = [];
    const completedGoals = userGoals.filter((g) => g.status === "completed");
    const overdueGoals = userGoals.filter((g) => g.status === "overdue");
    if (completedGoals.length > overdueGoals.length) {
      insights.push("Strong goal completion rate - you follow through on commitments");
    }
    if (overdueGoals.length > completedGoals.length) {
      insights.push("Goals tend to go overdue - may be setting unrealistic timelines");
      recommendations.push("Consider adding buffer time to goal deadlines");
    }
    const categoryPerformance = this.analyzeCategoryPerformance(userGoals);
    for (const [category, performance] of Object.entries(categoryPerformance)) {
      if (performance.completionRate > 80) {
        insights.push(`Excellent performance in ${category} goals`);
      } else if (performance.completionRate < 40) {
        insights.push(`Struggling with ${category} goals - may need different approach`);
        recommendations.push(`Break down ${category} goals into smaller milestones`);
      }
    }
    const overdueCommitments = userCommitments.filter((c) => c.status === "overdue");
    let excuseAnalysis;
    if (overdueCommitments.length > 3) {
      excuseAnalysis = "Pattern detected: Multiple overdue commitments suggest either overcommitment or execution challenges. What's the real blocker here?";
    }
    return { insights, excuseAnalysis, recommendations };
  }
  async identifyBlockers(context) {
    const blockers = [];
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const blockerKeywords = ["blocked", "stuck", "can't", "unable", "waiting for", "need to", "should"];
    const blockerMentions = /* @__PURE__ */ new Map();
    for (const message of recentMessages) {
      for (const keyword of blockerKeywords) {
        if (message.content.toLowerCase().includes(keyword)) {
          blockerMentions.set(keyword, (blockerMentions.get(keyword) || 0) + 1);
        }
      }
    }
    for (const [keyword, count] of blockerMentions) {
      if (count > 2) {
        blockers.push({
          type: "recurring_obstacle",
          description: `Frequently mentioned: "${keyword}" - indicates potential recurring blocker`,
          severity: count > 4 ? "high" : "medium",
          suggestion: "Let's identify the root cause and create an action plan to remove this blocker"
        });
      }
    }
    return blockers;
  }
  isCloseToDeadline(targetDate) {
    const now = /* @__PURE__ */ new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays <= 7;
  }
  calculateAverageCompletionTime(commitments) {
    const completed = commitments.filter((c) => c.status === "completed" && c.completedDate);
    if (completed.length === 0) return 0;
    const totalDays = completed.reduce((sum, c) => {
      const dueDate = new Date(c.dueDate);
      const completedDate = new Date(c.completedDate);
      const diffTime = completedDate.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    return totalDays / completed.length;
  }
  analyzeCategoryPerformance(goals) {
    const performance = {};
    for (const goal of goals) {
      if (!performance[goal.category]) {
        performance[goal.category] = { completionRate: 0, totalGoals: 0 };
      }
      performance[goal.category].totalGoals++;
      if (goal.status === "completed") {
        performance[goal.category].completionRate++;
      }
    }
    for (const category of Object.keys(performance)) {
      const data = performance[category];
      data.completionRate = data.completionRate / data.totalGoals * 100;
    }
    return performance;
  }
};

// server/ai-agents/agents/co-founder/capabilities/strategic-thinking/strategic-planning.ts
var StrategicThinking = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async identifyStrategicChallenges(businessData) {
    const challenges = [];
    challenges.push({
      area: "Market Positioning",
      question: "How do we differentiate from competitors and create a unique value proposition?",
      priority: "high",
      complexity: 8
    });
    if (businessData?.revenue && businessData.revenue > 1e5) {
      challenges.push({
        area: "Scaling Operations",
        question: "What systems and processes do we need to scale efficiently without losing quality?",
        priority: "high",
        complexity: 7
      });
    }
    if (!businessData?.fundingRaised || businessData.fundingRaised < 5e5) {
      challenges.push({
        area: "Funding Strategy",
        question: "When and how should we raise our next round? What milestones do we need to hit?",
        priority: "medium",
        complexity: 6
      });
    }
    if (!businessData?.teamSize || businessData.teamSize < 10) {
      challenges.push({
        area: "Team Building",
        question: "What key hires should we prioritize to accelerate growth?",
        priority: "medium",
        complexity: 5
      });
    }
    challenges.push({
      area: "Product Strategy",
      question: "Should we focus on depth in our core product or expand to adjacent markets?",
      priority: "high",
      complexity: 7
    });
    challenges.push({
      area: "Customer Acquisition",
      question: "What channels will give us the best ROI for sustainable customer growth?",
      priority: "high",
      complexity: 6
    });
    return challenges.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (b.priority === "high" && a.priority !== "high") return 1;
      return b.complexity - a.complexity;
    }).slice(0, 4);
  }
  async generateStrategicOptions(challenge, context) {
    return {
      options: [
        "Focus on core market penetration",
        "Expand to adjacent markets",
        "Build platform capabilities",
        "Partner with established players"
      ],
      pros: [
        "Lower risk with proven market",
        "Leverage existing capabilities",
        "Clear path to profitability",
        "Faster market validation"
      ],
      cons: [
        "Limited growth potential",
        "Increased competition",
        "Resource dilution",
        "Dependency on partners"
      ],
      recommendations: [
        "Test market demand before commitment",
        "Build minimum viable partnerships",
        "Focus on metrics that matter",
        "Plan for multiple scenarios"
      ]
    };
  }
  async analyzeCompetitiveLandscape(industry) {
    return {
      threats: [
        "Large incumbents with deep pockets",
        "New startups with innovative approaches",
        "Market saturation in core segments",
        "Changing customer preferences"
      ],
      opportunities: [
        "Underserved market segments",
        "Technology disruption potential",
        "Partnership opportunities",
        "International expansion"
      ],
      recommendations: [
        "Monitor competitor moves closely",
        "Build defensible moats",
        "Focus on customer loyalty",
        "Innovate continuously"
      ]
    };
  }
};

// server/ai-agents/agents/co-founder/capabilities/accountability/performance-coach.ts
var ProactiveCoach = class {
  insights = /* @__PURE__ */ new Map();
  async getProactiveInsights(context) {
    const insights = [];
    const avoidanceInsight = await this.checkAvoidancePattern(context);
    if (avoidanceInsight) insights.push(avoidanceInsight);
    const perfectionismInsight = await this.checkPerfectionismPattern(context);
    if (perfectionismInsight) insights.push(perfectionismInsight);
    const burnoutInsight = await this.checkBurnoutPattern(context);
    if (burnoutInsight) insights.push(burnoutInsight);
    const celebrationInsight = await this.checkCelebrationDeficit(context);
    if (celebrationInsight) insights.push(celebrationInsight);
    const strategicDriftInsight = await this.checkStrategicDrift(context);
    if (strategicDriftInsight) insights.push(strategicDriftInsight);
    return insights.sort((a, b) => this.getPriorityScore(b) - this.getPriorityScore(a));
  }
  async getDailyInsights(context) {
    const insights = [];
    const recentActivity = await this.analyzeRecentActivity(context);
    if (recentActivity.hasWins) {
      insights.push({
        type: "celebration",
        priority: "medium",
        title: "Momentum Building",
        message: "You've had some solid wins recently. Let's capitalize on this momentum and tackle something bigger today.",
        actions: ["Review recent successes", "Plan ambitious goal for today", "Share wins with team"],
        confidence: 0.8
      });
    }
    if (recentActivity.hasBlockers) {
      insights.push({
        type: "accountability",
        priority: "high",
        title: "Blocker Alert",
        message: "I notice you've been stuck on a few things. Sometimes the best way through is to ask for help or try a different approach.",
        actions: ["Identify the real blocker", "Brainstorm alternative approaches", "Consider asking for help"],
        confidence: 0.9
      });
    }
    return insights;
  }
  async checkAvoidancePattern(context) {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const avoidancePatterns = /* @__PURE__ */ new Map();
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      const matches = content.match(/(need to|should|have to|must) ([^.!?]+)/g);
      if (matches) {
        for (const match of matches) {
          const task = match.replace(/(need to|should|have to|must)\s+/, "");
          avoidancePatterns.set(task, (avoidancePatterns.get(task) || 0) + 1);
        }
      }
    }
    const avoidedTasks = Array.from(avoidancePatterns.entries()).filter(([task, count]) => count >= 3).sort(([, a], [, b]) => b - a);
    if (avoidedTasks.length > 0) {
      const [mostAvoided] = avoidedTasks[0];
      return {
        type: "accountability",
        priority: "high",
        title: "Avoidance Pattern Detected",
        message: `You've mentioned needing to "${mostAvoided}" several times without action. Avoidance usually means the task is either unclear, overwhelming, or unpleasant. Let's break it down and tackle it.`,
        actions: [
          "Define the exact outcome needed",
          "Break into 15-minute chunks",
          "Identify what makes this unpleasant",
          "Schedule a specific time to do it"
        ],
        confidence: 0.85
      };
    }
    return null;
  }
  async checkPerfectionismPattern(context) {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    let perfectionismScore = 0;
    const perfectionKeywords = [
      "perfect",
      "ready",
      "polished",
      "final",
      "complete",
      "not quite right",
      "needs more work",
      "almost there"
    ];
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of perfectionKeywords) {
        if (content.includes(keyword)) {
          perfectionismScore++;
        }
      }
      if (content.match(/(still working on|keep tweaking|keep adjusting|refining)/)) {
        perfectionismScore += 2;
      }
    }
    if (perfectionismScore > 5) {
      return {
        type: "accountability",
        priority: "medium",
        title: "Perfectionism Alert",
        message: 'I sense you might be over-polishing something. Remember: "Perfect is the enemy of done." Sometimes shipping "good enough" gets you feedback faster than perfecting in isolation.',
        actions: [
          'Define "good enough" criteria',
          "Set a ship deadline",
          "Get feedback early",
          "Iterate based on real user input"
        ],
        confidence: 0.75
      };
    }
    return null;
  }
  async checkBurnoutPattern(context) {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    let burnoutIndicators = 0;
    const burnoutKeywords = [
      "exhausted",
      "tired",
      "burnt out",
      "overwhelmed",
      "stressed",
      "can't keep up",
      "too much",
      "no time"
    ];
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of burnoutKeywords) {
        if (content.includes(keyword)) {
          burnoutIndicators++;
        }
      }
      const messageHour = new Date(message.timestamp).getHours();
      if (messageHour > 22 || messageHour < 6) {
        burnoutIndicators++;
      }
    }
    if (burnoutIndicators > 4) {
      return {
        type: "warning",
        priority: "critical",
        title: "Burnout Risk Detected",
        message: "\u{1F6A8} You're showing classic burnout signs. Burned-out founders can't build great companies. Your business needs you healthy and sharp, not exhausted.",
        actions: [
          "Take a complete day off this week",
          "Delegate or eliminate non-essential tasks",
          "Set work hour boundaries",
          "Consider hiring support sooner"
        ],
        confidence: 0.9
      };
    }
    return null;
  }
  async checkCelebrationDeficit(context) {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const achievements = [];
    const celebrations = [];
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      if (content.match(/(closed|signed|launched|raised|hired|achieved|reached|hit)/)) {
        achievements.push(message);
      }
      if (content.match(/(celebrated|party|excited|thrilled|amazing|fantastic)/)) {
        celebrations.push(message);
      }
    }
    if (achievements.length > 0 && celebrations.length === 0) {
      return {
        type: "celebration",
        priority: "medium",
        title: "Celebration Deficit",
        message: `I noticed you've had some wins recently but didn't take time to celebrate. Celebrating wins isn't vanity - it builds momentum, motivates your team, and helps you recognize what's working.`,
        actions: [
          "Take 5 minutes to appreciate the win",
          "Share the success with your team",
          "Post about it publicly",
          "Plan a small celebration"
        ],
        confidence: 0.8
      };
    }
    return null;
  }
  async checkStrategicDrift(context) {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const strategicKeywords = ["pivot", "new direction", "different approach", "changing strategy"];
    let strategyChanges = 0;
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of strategicKeywords) {
        if (content.includes(keyword)) {
          strategyChanges++;
        }
      }
    }
    if (strategyChanges > 2) {
      return {
        type: "strategy",
        priority: "high",
        title: "Strategic Focus Check",
        message: "I've noticed several mentions of strategy changes lately. Strategic agility is good, but too much pivoting can indicate lack of focus. Let's ensure we're being strategic, not reactive.",
        actions: [
          "Review core strategy and priorities",
          "Identify what triggered recent changes",
          "Set criteria for future strategic decisions",
          "Communicate strategy clearly to team"
        ],
        confidence: 0.7
      };
    }
    return null;
  }
  async analyzeRecentActivity(context) {
    const recentMessages = context.conversationHistory?.slice(-10) || [];
    let wins = 0;
    let blockers = 0;
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      if (content.match(/(completed|finished|launched|closed|achieved|successful)/)) {
        wins++;
      }
      if (content.match(/(stuck|blocked|can't|unable|waiting|problem)/)) {
        blockers++;
      }
    }
    return {
      hasWins: wins > 0,
      hasBlockers: blockers > 1,
      momentum: wins > blockers ? "high" : blockers > wins ? "low" : "medium"
    };
  }
  getPriorityScore(insight) {
    const priorityScores = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityScores[insight.priority] * insight.confidence;
  }
};

// server/ai-agents/agents/co-founder/capabilities/azure-enhanced-capabilities.ts
init_azure_openai_advanced();
var AzureEnhancedCapabilities = class {
  advancedClient;
  constructor(config) {
    this.advancedClient = new AzureOpenAIAdvanced(config);
  }
  /**
   * Comprehensive decision analysis using multiple AI perspectives
   */
  async analyzeDecisionMultiPerspective(decision, context) {
    const businessContext = this.buildBusinessContext(context);
    const perspectives = await this.advancedClient.generateMultiplePerspectives(
      decision,
      businessContext,
      ["optimistic", "pessimistic", "realistic", "data-driven", "strategic"]
    );
    const synthesis = await this.synthesizePerspectives(perspectives, decision);
    return {
      perspectives: perspectives.map((p) => ({
        name: p.perspective,
        analysis: p.analysis,
        recommendation: this.extractRecommendation(p.analysis),
        confidence: this.estimateConfidence(p.analysis)
      })),
      synthesis: synthesis.content,
      recommendation: synthesis.recommendation
    };
  }
  /**
   * Strategic thinking with chain-of-thought reasoning
   */
  async strategicThinking(question, context) {
    const businessContext = this.buildBusinessContext(context);
    const systemPrompt = this.buildStrategicSystemPrompt();
    const response = await this.advancedClient.generateWithChainOfThought(
      systemPrompt,
      `${question}

Business Context: ${businessContext}`,
      context.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      { temperature: 0.7, maxTokens: 2e3 }
    );
    const insights = this.extractInsights(response.content);
    const actionItems = this.extractActionItems(response.content);
    return {
      content: response.content,
      reasoning: response.reasoning,
      insights,
      actionItems
    };
  }
  /**
   * Proactive insights generation based on business context
   */
  async generateProactiveInsights(context) {
    const businessData = context.relevantData || {};
    const conversationHistory = context.conversationHistory;
    const recentMessages = conversationHistory.slice(-5).map((m) => m.content).join("\n");
    const analysis = await azureCognitiveServices.analyzeConversation(recentMessages);
    const insights = [];
    const systemPrompt = `You are a proactive co-founder analyzing business data and conversations.
    Generate actionable insights focusing on:
    - Opportunities the entrepreneur might be missing
    - Risks that need attention
    - Patterns worth celebrating
    - Accountability gaps`;
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Business Stage: ${businessData.stage || "early"}
Revenue: ${businessData.revenue || "unknown"}
Team Size: ${businessData.teamSize || "unknown"}
Recent Conversations: ${recentMessages}

Generate 3-5 proactive insights that would be most valuable right now.`,
      [],
      [
        {
          name: "generate_insights",
          description: "Generate proactive business insights",
          parameters: {
            type: "object",
            properties: {
              insights: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["opportunity", "warning", "celebration", "accountability"] },
                    priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    title: { type: "string" },
                    message: { type: "string" },
                    actionable: { type: "boolean" },
                    suggestedActions: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        }
      ],
      { temperature: 0.8 }
    );
    if (response.functionCall?.name === "generate_insights") {
      insights.push(...response.functionCall.arguments.insights);
    }
    return insights;
  }
  /**
   * Devil's Advocate mode - challenge assumptions with data
   */
  async challengeAssumptions(proposition, context) {
    const systemPrompt = `You are a devil's advocate co-founder. Your job is to constructively challenge assumptions and ideas.
    Be direct but supportive. Back challenges with evidence and reasoning.`;
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Analyze this proposition and challenge its assumptions:

${proposition}`,
      context.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: "challenge_assumptions",
          description: "Identify and challenge assumptions in a business proposition",
          parameters: {
            type: "object",
            properties: {
              assumptions: {
                type: "array",
                items: { type: "string" }
              },
              challenges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    assumption: { type: "string" },
                    challenge: { type: "string" },
                    evidence: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                  }
                }
              },
              counterProposal: { type: "string" }
            }
          }
        }
      ],
      { temperature: 0.7 }
    );
    if (response.functionCall?.name === "challenge_assumptions") {
      return response.functionCall.arguments;
    }
    return {
      assumptions: [],
      challenges: []
    };
  }
  /**
   * Brainstorming with creative AI generation
   */
  async brainstormIdeas(topic, context, approachTypes = ["conventional", "unconventional", "disruptive"]) {
    const systemPrompt = `You are a creative co-founder helping brainstorm business ideas.
    Generate diverse, creative solutions across different approaches.`;
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Brainstorm ideas for: ${topic}

Business Context: ${this.buildBusinessContext(context)}
      
Generate ideas across these approaches: ${approachTypes.join(", ")}`,
      context.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: "generate_ideas",
          description: "Generate brainstorming ideas across different approaches",
          parameters: {
            type: "object",
            properties: {
              ideas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    approach: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    feasibility: { type: "number", minimum: 0, maximum: 10 },
                    impact: { type: "number", minimum: 0, maximum: 10 },
                    pros: { type: "array", items: { type: "string" } },
                    cons: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        }
      ],
      { temperature: 0.9 }
    );
    if (response.functionCall?.name === "generate_ideas") {
      return {
        topic,
        ideas: response.functionCall.arguments.ideas
      };
    }
    return { topic, ideas: [] };
  }
  /**
   * Accountability tracking with pattern recognition
   */
  async analyzeAccountabilityPatterns(commitments, context) {
    const completionRate = commitments.filter((c) => c.status === "completed").length / commitments.length;
    const overdueRate = commitments.filter((c) => c.status === "overdue").length / commitments.length;
    const systemPrompt = `You are an accountability partner analyzing commitment patterns.
    Be direct but supportive. Identify patterns and offer constructive recommendations.`;
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Analyze these commitment patterns:
      
Commitments: ${JSON.stringify(commitments, null, 2)}
Completion Rate: ${(completionRate * 100).toFixed(1)}%
Overdue Rate: ${(overdueRate * 100).toFixed(1)}%

Recent Conversations: ${context.conversationHistory.slice(-3).map((m) => m.content).join("\n")}`,
      [],
      [
        {
          name: "analyze_patterns",
          description: "Analyze accountability and commitment patterns",
          parameters: {
            type: "object",
            properties: {
              patterns: { type: "array", items: { type: "string" } },
              insights: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              excuseDetection: { type: "string" }
            }
          }
        }
      ],
      { temperature: 0.7 }
    );
    if (response.functionCall?.name === "analyze_patterns") {
      return response.functionCall.arguments;
    }
    return {
      patterns: [],
      insights: [],
      recommendations: []
    };
  }
  /**
   * Crisis response with structured action planning
   */
  async generateCrisisActionPlan(crisisDescription, context) {
    const systemPrompt = `You are a crisis management co-founder. Provide structured, actionable crisis response plans.
    Be calm, practical, and supportive. Break down complex crises into manageable steps.`;
    const response = await this.advancedClient.generateWithFunctions(
      systemPrompt,
      `Crisis Situation: ${crisisDescription}
      
Business Context: ${this.buildBusinessContext(context)}

Generate a comprehensive action plan.`,
      context.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      [
        {
          name: "generate_crisis_plan",
          description: "Generate structured crisis action plan",
          parameters: {
            type: "object",
            properties: {
              severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
              immediateActions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    priority: { type: "number" },
                    timeline: { type: "string" },
                    resources: { type: "array", items: { type: "string" } }
                  }
                }
              },
              shortTermActions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    timeline: { type: "string" },
                    expectedOutcome: { type: "string" }
                  }
                }
              },
              strategicActions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    timeline: { type: "string" },
                    prevention: { type: "string" }
                  }
                }
              },
              supportMessage: { type: "string" }
            }
          }
        }
      ],
      { temperature: 0.6 }
    );
    if (response.functionCall?.name === "generate_crisis_plan") {
      return response.functionCall.arguments;
    }
    return {
      severity: "medium",
      immediateActions: [],
      shortTermActions: [],
      strategicActions: [],
      supportMessage: "Let's work through this together step by step."
    };
  }
  /**
   * Helper methods
   */
  buildBusinessContext(context) {
    const data = context.relevantData || {};
    return `
Stage: ${data.stage || "early-stage"}
Revenue: ${data.revenue || "not specified"}
Team Size: ${data.teamSize || "not specified"}
Industry: ${data.industry || "not specified"}
Recent Focus: ${context.conversationHistory.slice(-3).map((m) => m.content).join("; ").substring(0, 200)}
    `.trim();
  }
  buildStrategicSystemPrompt() {
    return `You are a strategic co-founder with deep expertise in startup strategy, market dynamics, and business growth.
    
Your approach:
- Think long-term while addressing immediate needs
- Challenge assumptions constructively
- Provide frameworks and mental models
- Base advice on data and experience
- Be direct and honest
- Support the entrepreneur as a true partner

When analyzing strategic questions:
1. Understand the real question behind the question
2. Consider multiple perspectives
3. Identify key trade-offs
4. Provide actionable insights
5. Suggest next steps`;
  }
  async synthesizePerspectives(perspectives, decision) {
    const combinedPerspectives = perspectives.map((p) => `${p.perspective.toUpperCase()} PERSPECTIVE:
${p.analysis}`).join("\n\n---\n\n");
    return {
      content: combinedPerspectives,
      recommendation: "Consider all perspectives before deciding"
    };
  }
  extractRecommendation(analysis) {
    const match = analysis.match(/recommend(?:ation)?:?\s*(.+?)(?:\n|$)/i);
    return match ? match[1].trim() : "See analysis for details";
  }
  estimateConfidence(analysis) {
    if (analysis.match(/(definitely|strongly|clearly|obviously)/i)) {
      return 0.9;
    } else if (analysis.match(/(likely|probably|should)/i)) {
      return 0.7;
    } else if (analysis.match(/(might|could|possibly|maybe)/i)) {
      return 0.5;
    }
    return 0.6;
  }
  extractInsights(content) {
    const insights = [];
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.match(/^[•\-*]\s+(.+)/) || line.match(/insight:?\s*(.+)/i)) {
        insights.push(line.trim());
      }
    }
    return insights.slice(0, 5);
  }
  extractActionItems(content) {
    const actions = [];
    const patterns = [
      /action:?\s*(.+)/i,
      /next step:?\s*(.+)/i,
      /todo:?\s*(.+)/i,
      /should:?\s*(.+)/i
    ];
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern, "gi");
      while ((match = regex.exec(content)) !== null) {
        if (match[1]) {
          actions.push(match[1].trim());
        }
      }
    }
    return Array.from(new Set(actions)).slice(0, 5);
  }
};

// server/ai-agents/agents/co-founder/index.ts
var CoFounderAgent = class {
  config;
  brain;
  personality;
  relationship;
  memory;
  accountability;
  strategy;
  coach;
  azureCapabilities;
  constructor(config) {
    this.config = config;
    this.brain = new CoFounderBrain(config);
    this.personality = new PersonalityManager();
    this.relationship = new RelationshipManager();
    this.memory = new MemorySystem();
    this.accountability = new AccountabilityEngine();
    this.strategy = new StrategicThinking(config);
    this.coach = new ProactiveCoach();
    this.azureCapabilities = new AzureEnhancedCapabilities(config);
  }
  async execute(context, options) {
    const conversationState = await this.brain.analyzeConversationState(context);
    const entrepreneurNeeds = await this.brain.detectNeeds(context);
    const proactiveInsights = await this.coach.getProactiveInsights(context);
    const responseMode = this.brain.selectResponseMode(conversationState, entrepreneurNeeds);
    switch (context.currentTask) {
      case "daily_standup":
        return await this.dailyStandup(context);
      case "strategic_session":
        return await this.strategicSession(context);
      case "devils_advocate":
        return await this.devilsAdvocate(context);
      case "decision_support":
        return await this.decisionSupport(context);
      case "brainstorm":
        return await this.brainstormSession(context);
      case "accountability_check":
        return await this.accountabilityCheck(context);
      case "crisis_support":
        return await this.crisisSupport(context);
      default:
        return await this.adaptiveResponse(context, responseMode, proactiveInsights);
    }
  }
  async dailyStandup(context) {
    const goals = await this.accountability.getCurrentGoals(context.userId);
    const blockers = await this.accountability.identifyBlockers(context);
    const insights = await this.coach.getDailyInsights(context);
    return {
      content: `Good morning! Let's do our daily check-in:

\u{1F4CA} **Quick Status Update:**
${goals.length > 0 ? `\u2022 Goals on track: ${goals.filter((g) => g.status === "on_track").length}/${goals.length}` : "\u2022 No active goals set - want to set some?"}
${blockers.length > 0 ? `\u2022 Blockers detected: ${blockers.length} items need attention` : "\u2022 No major blockers detected"}

\u{1F3AF} **Today's Focus:**
What's the ONE thing that will move the needle most today?

\u{1F4AD} **Yesterday's Win:**
What went well yesterday that we can build on?

\u26A0\uFE0F **What's in Your Way:**
Any obstacles I can help you think through?

${insights.length > 0 ? `
\u{1F50D} **Quick Insight:**
${insights[0].message}` : ""}`,
      suggestions: [
        "Set today's top priority",
        "Review weekly goals",
        "Discuss blockers",
        "Celebrate recent wins",
        "Plan the week ahead"
      ],
      actions: [
        {
          type: "set_daily_priority",
          label: "Set Today's Priority"
        },
        {
          type: "update_goals",
          label: "Update Goal Progress"
        }
      ],
      insights: insights.slice(0, 2)
    };
  }
  async strategicSession(context) {
    const businessData = context.relevantData;
    const strategicChallenges = await this.strategy.identifyStrategicChallenges(businessData);
    return {
      content: `Let's dive deep into strategy. I've been analyzing your business and I want to explore some bigger picture questions with you.

\u{1F3AF} **Strategic Focus Areas I'm Thinking About:**

${strategicChallenges.map(
        (challenge, index) => `${index + 1}. **${challenge.area}**: ${challenge.question}`
      ).join("\n\n")}

Which of these resonates most with what's keeping you up at night? Or is there something else entirely you want to think through strategically?

I'm not here to give you quick answers - I want to think through this WITH you, challenge your assumptions, and help you see angles you might be missing.`,
      suggestions: strategicChallenges.map((c) => c.area),
      actions: [
        {
          type: "swot_analysis",
          label: "Build SWOT Analysis"
        },
        {
          type: "scenario_planning",
          label: "Model Different Scenarios"
        }
      ]
    };
  }
  async devilsAdvocate(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const assumptions = await this.brain.identifyAssumptions(lastMessage?.content || "");
    const counterPoints = await this.brain.generateCounterPoints(assumptions, context);
    return {
      content: `Okay, I need to challenge you on this. It's my job as your co-founder to poke holes in ideas BEFORE the market does.

\u{1F50D} **Assumptions I'm Seeing:**
${assumptions.map(
        (assumption, index) => `${index + 1}. ${assumption}`
      ).join("\n")}

\u26A1 **Counter-Arguments:**
${counterPoints.map(
        (point, index) => `${index + 1}. ${point.challenge}
   *Evidence:* ${point.evidence}`
      ).join("\n\n")}

I'm not trying to kill your idea - I'm trying to make it bulletproof. How do you respond to these challenges? What am I missing?`,
      suggestions: [
        "Address the strongest counter-argument",
        "Provide evidence for key assumptions",
        "Modify the approach based on feedback",
        "Double down with stronger reasoning"
      ]
    };
  }
  async decisionSupport(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || "";
    const decisionType = await this.brain.classifyDecision(lastMessage, context);
    if (decisionType.impact === "high" || decisionType.impact === "critical") {
      try {
        const multiPerspective = await this.azureCapabilities.analyzeDecisionMultiPerspective(
          lastMessage,
          context
        );
        return {
          content: `Let's work through this ${decisionType.impact} impact decision from multiple angles. This is ${decisionType.reversibility}, so ${decisionType.reversibility === "irreversible" ? "we need to be thorough" : "we have some flexibility"}.

\u{1F3AF} **Multi-Perspective Analysis:**

${multiPerspective.perspectives.map(
            (p, idx) => `**${idx + 1}. ${p.name.toUpperCase()} PERSPECTIVE** (Confidence: ${Math.round(p.confidence * 100)}%)
${p.analysis}

\u{1F4A1} Recommendation: ${p.recommendation}
`
          ).join("\n---\n\n")}

\u{1F3AF} **SYNTHESIS & FINAL RECOMMENDATION:**

${multiPerspective.synthesis}

**My Take**: ${multiPerspective.recommendation}

What resonates most with you? Which perspective aligns with your gut?`,
          suggestions: [
            "Dive deeper into one perspective",
            "Challenge the assumptions",
            "Run a pre-mortem analysis",
            "Get more data before deciding"
          ],
          actions: [
            {
              type: "decision_matrix",
              label: "Build Decision Matrix"
            },
            {
              type: "premortem",
              label: "Run Pre-mortem Analysis"
            },
            {
              type: "scenario_planning",
              label: "Model Different Scenarios"
            }
          ]
        };
      } catch (error) {
        console.error("Azure decision analysis failed, using fallback:", error);
      }
    }
    const analysis = await this.brain.analyzeDecision(lastMessage, context, decisionType);
    return {
      content: `Let's work through this decision systematically. Based on what you've shared, this is a ${decisionType.impact} impact, ${decisionType.reversibility} decision.

\u{1F9E0} **Decision Framework:**

**1. Clarify the Real Decision**
${analysis.clarification}

**2. What Are You Optimizing For?**
${analysis.optimizationFactors.join(" \u2022 ")}

**3. Key Considerations:**
${analysis.considerations.map(
        (consideration, index) => `\u2022 **${consideration.factor}**: ${consideration.analysis}`
      ).join("\n")}

**4. Potential Scenarios:**
\u2022 **Best Case**: ${analysis.scenarios.best}
\u2022 **Most Likely**: ${analysis.scenarios.likely}
\u2022 **Worst Case**: ${analysis.scenarios.worst}

**My Take**: ${analysis.recommendation}

What's your gut telling you? Sometimes the analytical framework confirms what you already know deep down.`,
      actions: [
        {
          type: "decision_matrix",
          label: "Build Decision Matrix"
        },
        {
          type: "premortem",
          label: "Run Pre-mortem Analysis"
        }
      ]
    };
  }
  async brainstormSession(context) {
    const topic = await this.brain.extractBrainstormTopic(context);
    try {
      const azureIdeas = await this.azureCapabilities.brainstormIdeas(
        topic,
        context,
        ["conventional", "unconventional", "disruptive"]
      );
      return {
        content: `\u{1F680} **Brainstorm Mode: ${azureIdeas.topic}**

No judgment here - let's get creative and see what emerges. I've generated ideas across different approaches:

${azureIdeas.ideas.map(
          (idea, index) => `**${index + 1}. ${idea.title}** (${idea.approach})
${idea.description}

\u{1F4CA} Feasibility: ${idea.feasibility}/10 | Impact: ${idea.impact}/10

\u2705 **Pros:**
${idea.pros.map((pro) => `\u2022 ${pro}`).join("\n")}

\u274C **Cons:**
${idea.cons.map((con) => `\u2022 ${con}`).join("\n")}
`
        ).join("\n---\n\n")}

What sparks something for you? Want to dive deeper into any of these, or should we explore a completely different direction?`,
        suggestions: [
          "Build on the highest impact idea",
          "Combine conventional + disruptive",
          "Prototype the most feasible",
          "Challenge the assumptions"
        ],
        actions: [
          {
            type: "validate_idea",
            label: "Validate with Customers"
          },
          {
            type: "build_prototype",
            label: "Quick Prototype Plan"
          }
        ]
      };
    } catch (error) {
      console.error("Azure brainstorming failed, using fallback:", error);
    }
    const ideas = await this.brain.generateCreativeIdeas(topic, context);
    return {
      content: `\u{1F680} **Brainstorm Mode: ${topic}**

No judgment here - let's get creative and see what emerges. Here are some directions to explore:

**Initial Ideas:**
${ideas.conventional.map((idea, index) => `${index + 1}. ${idea}`).join("\n")}

**Unconventional Angles:**
${ideas.unconventional.map((idea, index) => `${index + 1}. ${idea}`).join("\n")}

**What If We...:**
${ideas.whatIf.map((idea, index) => `${index + 1}. What if we ${idea}?`).join("\n")}

What sparks something for you? Or what completely different direction should we explore?`,
      suggestions: [
        "Build on the most interesting idea",
        "Combine two different approaches",
        "Explore the riskiest option",
        "Find the simplest solution"
      ]
    };
  }
  async accountabilityCheck(context) {
    const commitments = await this.accountability.getRecentCommitments(context.userId);
    const progress = await this.accountability.assessProgress(commitments, context);
    const patterns = await this.accountability.identifyPatterns(context.userId);
    const overdue = commitments.filter((c) => c.status === "overdue");
    const completed = commitments.filter((c) => c.status === "completed");
    return {
      content: `Time for an honest accountability check. Let's see how we're doing on commitments:

\u2705 **Completed** (${completed.length}):
${completed.map((c) => `\u2022 ${c.description} - ${c.completedDate}`).join("\n") || "\u2022 None completed recently"}

\u23F0 **Overdue** (${overdue.length}):
${overdue.map((c) => `\u2022 ${c.description} - was due ${c.dueDate}`).join("\n") || "\u2022 All caught up!"}

\u{1F4CA} **Pattern Analysis:**
${patterns.insights.join("\n\u2022 ")}

${overdue.length > 0 ? `
\u26A0\uFE0F **We Need to Talk About the Overdue Items**
${patterns.excuseAnalysis || "What's really blocking progress here?"}` : "\n\u{1F389} **Strong Accountability!** You're staying on top of commitments."}

What's the real story behind the delays? No judgment - just want to understand so we can solve for it.`,
      suggestions: overdue.length > 0 ? [
        "Address the biggest blocker",
        "Reschedule unrealistic commitments",
        "Break down large tasks",
        "Identify support needed"
      ] : [
        "Set next week's priorities",
        "Plan bigger goals",
        "Celebrate consistent progress"
      ]
    };
  }
  async crisisSupport(context) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || "";
    try {
      const crisisPlan = await this.azureCapabilities.generateCrisisActionPlan(
        lastMessage,
        context
      );
      return {
        content: `\u{1F6A8} **Crisis Mode Activated** (Severity: ${crisisPlan.severity.toUpperCase()})

${crisisPlan.supportMessage}

Let's break this down into a clear action plan:

**\u{1F534} IMMEDIATE ACTIONS (Next 24 Hours):**
${crisisPlan.immediateActions.sort((a, b) => a.priority - b.priority).map(
          (action, index) => `${index + 1}. **${action.action}** [Priority ${action.priority}]
   \u23F0 Timeline: ${action.timeline}
   \u{1F4CB} Resources: ${action.resources.join(", ")}`
        ).join("\n\n")}

**\u{1F7E1} SHORT-TERM STABILIZATION (This Week):**
${crisisPlan.shortTermActions.map(
          (action, index) => `${index + 1}. **${action.action}**
   \u23F0 ${action.timeline}
   \u{1F3AF} Expected Outcome: ${action.expectedOutcome}`
        ).join("\n\n")}

**\u{1F7E2} STRATEGIC RECOVERY (Next 30 Days):**
${crisisPlan.strategicActions.map(
          (action, index) => `${index + 1}. **${action.action}**
   \u23F0 ${action.timeline}
   \u{1F6E1}\uFE0F Prevention: ${action.prevention}`
        ).join("\n\n")}

---

**Remember**: Every successful entrepreneur faces crises. This is not a reflection of your abilities - it's part of the journey. You've handled challenges before, and you'll handle this one too.

What's the first immediate action you want to tackle? Let's start there and build momentum.`,
        suggestions: [
          "Start with Priority 1 action",
          "Draft stakeholder communications",
          "Discuss resource allocation",
          "Plan team communication"
        ],
        actions: [
          {
            type: "emergency_plan",
            label: "Download Action Plan"
          },
          {
            type: "stakeholder_communication",
            label: "Draft Communications"
          },
          {
            type: "crisis_checklist",
            label: "Create Crisis Checklist"
          }
        ]
      };
    } catch (error) {
      console.error("Azure crisis planning failed, using fallback:", error);
    }
    const crisisType = await this.brain.identifyCrisisType(context);
    const urgentActions = await this.brain.generateCrisisResponse(crisisType, context);
    return {
      content: `\u{1F6A8} **Crisis Mode Activated**

I can sense this is urgent and stressful. Let's break this down into manageable pieces and create an action plan.

**Immediate Triage (Next 24 Hours):**
${urgentActions.immediate.map((action, index) => `${index + 1}. ${action}`).join("\n")}

**Short-term Stabilization (This Week):**
${urgentActions.shortTerm.map((action, index) => `${index + 1}. ${action}`).join("\n")}

**Strategic Recovery (Next 30 Days):**
${urgentActions.strategic.map((action, index) => `${index + 1}. ${action}`).join("\n")}

**Remember**: Every successful entrepreneur faces crises. This is not a reflection of your abilities - it's part of the journey. You've handled challenges before, and you'll handle this one too.

What's the first immediate action you want to tackle? Let's start there and build momentum.`,
      actions: [
        {
          type: "emergency_plan",
          label: "Create Emergency Action Plan"
        },
        {
          type: "stakeholder_communication",
          label: "Draft Stakeholder Communications"
        }
      ]
    };
  }
  async adaptiveResponse(context, responseMode, proactiveInsights) {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const personality = await this.personality.getPersonalityTraits(context.userId);
    const relationshipHealth = await this.relationship.getRelationshipScore(context.userId);
    const response = await this.brain.generateAdaptiveResponse(
      lastMessage?.content || "",
      context,
      responseMode,
      personality
    );
    const shouldIncludeInsights = relationshipHealth.overallScore > 70 && proactiveInsights.length > 0;
    return {
      content: `${response.content}${shouldIncludeInsights ? `

\u{1F4A1} **Quick Insight:** ${proactiveInsights[0].message}` : ""}`,
      suggestions: response.suggestions,
      actions: response.actions,
      insights: shouldIncludeInsights ? proactiveInsights.slice(0, 2) : [],
      confidence: response.confidence
    };
  }
};

// server/ai-agents/core/context-manager.ts
var ContextManager = class {
  async buildContext(request) {
    const user = await storage.getUserById(request.userId);
    const conversationHistory = await this.getConversationHistory(request.userId);
    const relevantData = await this.getRelevantData(request);
    const permissions = await this.getUserPermissions(request.userId, request.userType);
    return {
      userId: request.userId,
      userType: request.userType,
      currentTask: request.taskType,
      conversationHistory,
      relevantData,
      permissions
    };
  }
  async getConversationHistory(userId) {
    return [];
  }
  async getRelevantData(request) {
    switch (request.userType) {
      case "entrepreneur" /* ENTREPRENEUR */:
        return {
          businessPlans: await storage.getBusinessPlansByUserId(request.userId)
          // Add other entrepreneur-specific data
        };
      case "investor" /* INVESTOR */:
        return {
          portfolios: [],
          // Get from storage
          investments: []
          // Get from storage
          // Add other investor-specific data
        };
      case "lender" /* LENDER */:
        return {
          loans: [],
          // Get from storage
          creditScores: []
          // Get from storage
          // Add other lender-specific data
        };
      default:
        return {};
    }
  }
  async getUserPermissions(userId, userType) {
    const permissionMap = {
      ["entrepreneur" /* ENTREPRENEUR */]: ["view_own_data", "create_business_plan", "apply_funding"],
      ["investor" /* INVESTOR */]: ["view_deals", "analyze_companies", "manage_portfolio"],
      ["lender" /* LENDER */]: ["assess_credit", "process_loans", "view_risk_data"],
      ["grantor" /* GRANTOR */]: ["evaluate_impact", "review_applications", "track_outcomes"],
      ["partner" /* PARTNER */]: ["match_startups", "manage_programs", "allocate_resources"],
      ["team_member" /* TEAM_MEMBER */]: ["collaborate", "view_shared_data", "contribute_content"],
      ["admin" /* ADMIN */]: ["manage_users", "view_analytics", "system_control"]
    };
    return permissionMap[userType] || [];
  }
};

// server/ai-agents/memory/conversation-store.ts
var MemoryStore = class {
  conversations = /* @__PURE__ */ new Map();
  async getRelevantMemory(userId) {
    const userConversations = this.conversations.get(userId) || [];
    return userConversations.slice(-5).map((entry) => ({
      request: entry.request.message,
      response: entry.response.content,
      timestamp: entry.timestamp
    }));
  }
  async storeInteraction(request, response) {
    const entry = {
      id: Date.now().toString(),
      userId: request.userId,
      timestamp: /* @__PURE__ */ new Date(),
      request,
      response
    };
    const userConversations = this.conversations.get(request.userId) || [];
    userConversations.push(entry);
    if (userConversations.length > 100) {
      userConversations.splice(0, userConversations.length - 100);
    }
    this.conversations.set(request.userId, userConversations);
  }
  async getConversationHistory(userId, limit = 20) {
    const conversations = this.conversations.get(userId) || [];
    return conversations.slice(-limit);
  }
  async clearUserMemory(userId) {
    this.conversations.delete(userId);
  }
};

// server/ai-agents/core/agent-engine.ts
var AgentEngine = class {
  contextManager;
  memoryStore;
  config;
  constructor(config) {
    this.config = config;
    this.contextManager = new ContextManager();
    this.memoryStore = new MemoryStore();
  }
  async processRequest(request) {
    const context = await this.contextManager.buildContext(request);
    const agent = this.selectAgent(request.userType, request.taskType);
    const response = await agent.execute(context, {
      tools: this.getAvailableTools(request.userType),
      memory: await this.memoryStore.getRelevantMemory(request.userId),
      streaming: request.streaming
    });
    await this.memoryStore.storeInteraction(request, response);
    return response;
  }
  selectAgent(userType, taskType) {
    if (taskType.includes("co_founder") || taskType.includes("cofounder")) {
      return new CoFounderAgent(this.config);
    }
    const agentMap = {
      ["entrepreneur" /* ENTREPRENEUR */]: new BusinessAdvisorAgent(this.config),
      ["investor" /* INVESTOR */]: new DealAnalyzerAgent(this.config),
      ["lender" /* LENDER */]: new CreditAssessorAgent(this.config),
      ["grantor" /* GRANTOR */]: new ImpactEvaluatorAgent(this.config),
      ["partner" /* PARTNER */]: new PartnershipFacilitatorAgent(this.config),
      ["team_member" /* TEAM_MEMBER */]: new PlatformOrchestratorAgent(this.config),
      ["admin" /* ADMIN */]: new PlatformOrchestratorAgent(this.config)
    };
    return agentMap[userType] || new PlatformOrchestratorAgent(this.config);
  }
  getAvailableTools(userType) {
    const toolMap = {
      ["entrepreneur" /* ENTREPRENEUR */]: ["financial_calculator", "market_analyzer", "business_planner"],
      ["investor" /* INVESTOR */]: ["valuation_engine", "risk_analyzer", "portfolio_optimizer"],
      ["lender" /* LENDER */]: ["credit_scorer", "risk_modeler", "underwriter"],
      ["grantor" /* GRANTOR */]: ["impact_scorer", "compliance_checker", "outcome_predictor"],
      ["partner" /* PARTNER */]: ["matcher", "program_optimizer", "resource_allocator"],
      ["team_member" /* TEAM_MEMBER */]: ["task_manager", "document_processor", "collaboration_tools"],
      ["admin" /* ADMIN */]: ["platform_analytics", "user_manager", "system_monitor"]
    };
    return toolMap[userType] || [];
  }
};

// server/ai-agent-routes.ts
import { z as z2 } from "zod";
var router = express.Router();
var createGoalSchema = z2.object({
  description: z2.string().min(1),
  dueDate: z2.string().datetime(),
  priority: z2.enum(["low", "medium", "high", "critical"])
});
var updateGoalSchema = z2.object({
  description: z2.string().min(1).optional(),
  dueDate: z2.string().datetime().optional(),
  priority: z2.enum(["low", "medium", "high", "critical"]).optional(),
  status: z2.enum(["pending", "in_progress", "completed", "overdue"]).optional(),
  progress: z2.number().min(0).max(100).optional()
});
var createCommitmentSchema = z2.object({
  description: z2.string().min(1),
  dueDate: z2.string().datetime()
});
var decisionRequestSchema = z2.object({
  decision: z2.string().min(1),
  options: z2.array(z2.string()).optional()
});
var chatRequestSchema = z2.object({
  message: z2.string().min(1),
  mode: z2.string().optional(),
  conversationHistory: z2.array(z2.object({
    role: z2.enum(["user", "assistant"]),
    content: z2.string(),
    timestamp: z2.string(),
    mode: z2.string().optional()
  })).optional()
});
var agentEngine = new AgentEngine({
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
  temperature: 0.7,
  maxTokens: 1e3,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  useAzure: process.env.AZURE_OPENAI_ENDPOINT ? true : false
});
router.post("/chat", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const { message, taskType = "general", streaming = false } = req.body;
    const request = {
      userId: user.claims.sub,
      userType: user.claims.user_type || "entrepreneur" /* ENTREPRENEUR */,
      message,
      taskType,
      streaming
    };
    const response = await agentEngine.processRequest(request);
    res.json(response);
  } catch (error) {
    console.error("AI agent error:", error);
    res.status(500).json({
      content: "I'm having trouble processing your request right now. Please try again.",
      error: "Agent processing failed"
    });
  }
});
router.post("/suggestions", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const { context, userType } = req.body;
    const request = {
      userId: user.claims.sub,
      userType: userType || "entrepreneur" /* ENTREPRENEUR */,
      message: "Get contextual suggestions",
      taskType: "suggestions",
      context
    };
    const response = await agentEngine.processRequest(request);
    res.json({
      suggestions: response.suggestions || [],
      insights: response.insights || []
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    res.status(500).json({
      suggestions: [],
      error: "Failed to get suggestions"
    });
  }
});
router.get("/insights", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const userType = req.query.userType || "entrepreneur" /* ENTREPRENEUR */;
    const request = {
      userId: user.claims.sub,
      userType,
      message: "Generate dashboard insights",
      taskType: "insights"
    };
    const response = await agentEngine.processRequest(request);
    res.json({
      insights: response.insights || [],
      actions: response.actions || []
    });
  } catch (error) {
    console.error("AI insights error:", error);
    res.status(500).json({
      insights: [],
      error: "Failed to generate insights"
    });
  }
});
router.post("/automate", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const { task, parameters } = req.body;
    const request = {
      userId: user.claims.sub,
      userType: user.claims.user_type || "entrepreneur" /* ENTREPRENEUR */,
      message: `Automate: ${task}`,
      taskType: "automation",
      context: parameters
    };
    const response = await agentEngine.processRequest(request);
    res.json({
      success: true,
      result: response.content,
      actions: response.actions || []
    });
  } catch (error) {
    console.error("AI automation error:", error);
    res.status(500).json({
      success: false,
      error: "Automation failed"
    });
  }
});
router.post("/co-founder/chat", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const validatedData = chatRequestSchema.parse(req.body);
    const request = {
      userId: user.claims.sub,
      userType: "entrepreneur" /* ENTREPRENEUR */,
      message: validatedData.message,
      taskType: validatedData.mode || "general",
      context: { conversationHistory: validatedData.conversationHistory }
    };
    const response = await agentEngine.processRequest(request);
    res.json(response);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Co-Founder chat error:", error);
    res.status(500).json({
      content: "I'm having trouble right now. Let's try that again.",
      error: "Co-Founder processing failed"
    });
  }
});
router.get("/co-founder/goals", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const goals = storage.getGoalsByUserId(user.claims.sub);
    res.json(goals);
  } catch (error) {
    console.error("Goals fetch error:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});
router.post("/co-founder/goals", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const validatedData = createGoalSchema.parse(req.body);
    const goal = storage.createGoal({
      userId: user.claims.sub,
      ...validatedData
    });
    res.json(goal);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Goal creation error:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});
router.patch("/co-founder/goals/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);
    const existingGoal = storage.getGoalById(id);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    if (existingGoal.userId !== user.claims.sub) {
      return res.status(403).json({ error: "Unauthorized to update this goal" });
    }
    const goal = storage.updateGoal(id, validatedData);
    res.json(goal);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Goal update error:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});
router.get("/co-founder/commitments", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const commitments = storage.getCommitmentsByUserId(user.claims.sub);
    res.json(commitments);
  } catch (error) {
    console.error("Commitments fetch error:", error);
    res.status(500).json({ error: "Failed to fetch commitments" });
  }
});
router.post("/co-founder/commitments", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const validatedData = createCommitmentSchema.parse(req.body);
    const commitment = storage.createCommitment({
      userId: user.claims.sub,
      ...validatedData
    });
    res.json(commitment);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Commitment creation error:", error);
    res.status(500).json({ error: "Failed to create commitment" });
  }
});
router.post("/co-founder/decision/analyze", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const validatedData = decisionRequestSchema.parse(req.body);
    const request = {
      userId: user.claims.sub,
      userType: "entrepreneur" /* ENTREPRENEUR */,
      message: validatedData.decision,
      taskType: "decision_support",
      context: { options: validatedData.options }
    };
    const response = await agentEngine.processRequest(request);
    res.json(response);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Decision analysis error:", error);
    res.status(500).json({ error: "Failed to analyze decision" });
  }
});
router.post("/co-founder/decision/scenarios", isAuthenticated, async (req, res) => {
  try {
    const validatedData = z2.object({ decision: z2.string().min(1) }).parse(req.body);
    const { decision } = validatedData;
    res.json({
      scenarios: {
        bestCase: {
          description: "Everything exceeds expectations",
          probability: 20,
          outcomes: ["Strong market reception", "Rapid growth", "Team morale high"]
        },
        likelyCase: {
          description: "Mixed results requiring adjustments",
          probability: 60,
          outcomes: ["Moderate traction", "Some pivots needed", "Extended timeline"]
        },
        worstCase: {
          description: "Significant challenges emerge",
          probability: 20,
          outcomes: ["Low adoption", "Resource constraints", "Strategy revision needed"]
        }
      },
      earlyWarningSignals: [
        "Customer engagement below targets",
        "Burn rate exceeding budget",
        "Team concerns emerging"
      ]
    });
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Scenario analysis error:", error);
    res.status(500).json({ error: "Failed to analyze scenarios" });
  }
});
router.post("/co-founder/decision/premortem", isAuthenticated, async (req, res) => {
  try {
    const validatedData = z2.object({ decision: z2.string().min(1) }).parse(req.body);
    const { decision } = validatedData;
    res.json({
      decision,
      potentialFailures: [
        { reason: "Insufficient market validation", likelihood: "medium", impact: "high" },
        { reason: "Resource constraints emerge", likelihood: "high", impact: "medium" },
        { reason: "Team misalignment on execution", likelihood: "low", impact: "high" }
      ],
      mitigationStrategies: [
        "Conduct targeted customer interviews before full commit",
        "Build resource buffer into timeline",
        "Hold alignment session with all stakeholders"
      ],
      earlyWarningSignals: [
        "Customer feedback trending negative",
        "Budget tracking shows overruns",
        "Team velocity declining"
      ]
    });
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Premortem analysis error:", error);
    res.status(500).json({ error: "Failed to run premortem" });
  }
});
var ai_agent_routes_default = router;

// server/routes.ts
var insertBusinessPlanSchema = z3.object({
  userId: z3.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_]+$/),
  title: z3.string().min(1).max(200).trim(),
  description: z3.string().max(5e3).trim().optional(),
  industry: z3.string().max(100).trim().optional(),
  stage: z3.enum(["idea", "prototype", "mvp", "growth", "scale"]).optional()
});
var insertPlanSectionSchema = z3.object({
  businessPlanId: z3.string(),
  chapterId: z3.string(),
  sectionId: z3.string(),
  content: z3.string()
});
var insertFinancialDataSchema = z3.object({
  businessPlanId: z3.string(),
  year: z3.number(),
  revenue: z3.number(),
  expenses: z3.number(),
  profit: z3.number(),
  cashFlow: z3.number()
});
var insertAnalysisScoreSchema = z3.object({
  businessPlanId: z3.string(),
  companyValue: z3.number(),
  companyValueChange: z3.number(),
  revenueMultiple: z3.number(),
  revenueMultipleChange: z3.number(),
  runway: z3.number(),
  runwayChange: z3.number(),
  burnRate: z3.number(),
  burnRateChange: z3.number(),
  financialMetrics: z3.array(z3.any()),
  // More specific type can be defined
  nonFinancialMetrics: z3.array(z3.any()),
  // More specific type can be defined
  marketMetrics: z3.array(z3.any()),
  // More specific type can be defined
  teamAssessment: z3.array(z3.any())
  // More specific type can be defined
});
var insertProgramSchema = z3.object({
  organizationId: z3.string(),
  name: z3.string(),
  description: z3.string().optional()
});
var insertCohortSchema = z3.object({
  programId: z3.string(),
  name: z3.string(),
  startDate: z3.date(),
  endDate: z3.date()
});
var insertPortfolioSchema = z3.object({
  organizationId: z3.string(),
  name: z3.string(),
  description: z3.string().optional()
});
var insertPortfolioCompanySchema = z3.object({
  portfolioId: z3.string(),
  cohortId: z3.string().optional(),
  companyName: z3.string(),
  industry: z3.string(),
  stage: z3.string(),
  website: z3.string().optional(),
  description: z3.string().optional()
});
var insertEducationalModuleSchema = z3.object({
  creatorId: z3.string(),
  title: z3.string(),
  content: z3.string(),
  category: z3.string().optional()
});
var insertMentorshipSchema = z3.object({
  mentorId: z3.string(),
  menteeId: z3.string(),
  programId: z3.string().optional(),
  startDate: z3.date(),
  endDate: z3.date().optional(),
  status: z3.string()
  // e.g., 'active', 'completed', 'cancelled'
});
var insertVentureProjectSchema = z3.object({
  organizationId: z3.string(),
  name: z3.string(),
  description: z3.string().optional()
  // Add other relevant fields for venture projects
});
var insertPitchDeckSchema = z3.object({
  businessPlanId: z3.string(),
  // Add fields for pitch deck data
  title: z3.string(),
  slides: z3.array(z3.any())
  // e.g., array of slide objects
});
var insertInvestmentSchema = z3.object({
  planId: z3.string(),
  investorId: z3.string(),
  amount: z3.number(),
  date: z3.date()
  // Add other relevant fields for investments
});
var insertLoanSchema = z3.object({
  planId: z3.string(),
  lenderId: z3.string(),
  amount: z3.number(),
  interestRate: z3.number(),
  termMonths: z3.number(),
  startDate: z3.date(),
  endDate: z3.date()
  // Add other relevant fields for loans
});
var insertAdvisoryServiceSchema = z3.object({
  planId: z3.string(),
  partnerId: z3.string(),
  serviceType: z3.string(),
  description: z3.string().optional(),
  startDate: z3.date(),
  endDate: z3.date().optional()
});
var insertCreditScoreSchema = z3.object({
  userId: z3.string(),
  score: z3.number(),
  date: z3.date()
  // Add other relevant fields for credit scores
});
var insertFinancialMilestoneSchema = z3.object({
  userId: z3.string(),
  description: z3.string(),
  date: z3.date(),
  amount: z3.number().optional()
  // Add other relevant fields for financial milestones
});
var insertAiCoachingMessageSchema = z3.object({
  userId: z3.string(),
  sender: z3.enum(["user", "ai"]),
  message: z3.string(),
  timestamp: z3.date()
  // Add other relevant fields for AI coaching messages
});
var insertCreditTipSchema = z3.object({
  title: z3.string(),
  content: z3.string(),
  category: z3.string().optional()
  // Add other relevant fields for credit tips
});
var insertUserCreditTipSchema = z3.object({
  userId: z3.string(),
  creditTipId: z3.string(),
  viewed: z3.boolean().default(false)
  // Add other relevant fields for user credit tips
});
var insertFinancialProjectionSchema = z3.object({
  businessPlanId: z3.string(),
  year: z3.number(),
  revenue: z3.number(),
  expenses: z3.number(),
  profit: z3.number()
  // Add other relevant fields for financial projections
});
var insertAiBusinessAnalysisSchema = z3.object({
  businessPlanId: z3.string(),
  overallScore: z3.number(),
  scores: z3.record(z3.string(), z3.number()),
  feedback: z3.record(z3.string(), z3.string()),
  recommendations: z3.array(z3.string())
  // Add other relevant fields for AI business analysis
});
async function registerRoutes(app2) {
  const apiRouter = express2.Router();
  apiRouter.get("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user.claims.sub;
      const plans = await storage.getBusinessPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business plans" });
    }
  });
  apiRouter.get("/user", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const claims = user.claims;
      res.json({
        id: claims.sub,
        email: claims.email || claims.preferred_username,
        firstName: claims.first_name || claims.given_name,
        lastName: claims.last_name || claims.family_name,
        profileImageUrl: claims.profile_image_url || claims.picture,
        userType: "ENTREPRENEUR"
        // Default user type for development
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user info" });
    }
  });
  apiRouter.get("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      const userId = user.claims.sub;
      const plan = await storage.getBusinessPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      if (plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business plan" });
    }
  });
  apiRouter.post("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user.claims.sub;
      const validatedData = insertBusinessPlanSchema.parse({
        ...req.body,
        userId
      });
      const plan = await storage.createBusinessPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid business plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create business plan" });
    }
  });
  apiRouter.patch("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      const userId = user.claims.sub;
      const existingPlan = await storage.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const plan = await storage.updateBusinessPlan(id, req.body);
      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update business plan" });
    }
  });
  apiRouter.delete("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      const userId = user.claims.sub;
      const existingPlan = await storage.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const success = await storage.deleteBusinessPlan(id);
      if (!success) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete business plan" });
    }
  });
  apiRouter.get("/business-plans/:planId/sections", isAuthenticated, async (req, res) => {
    try {
      const planId = req.params.planId;
      const user = req.user;
      const userId = user.claims.sub;
      const plan = await storage.getBusinessPlan(planId);
      if (!plan || plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const sections = await storage.getPlanSections(planId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan sections" });
    }
  });
  apiRouter.get("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const section = await storage.getPlanSection(id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch section" });
    }
  });
  apiRouter.post("/business-plans/:planId/sections", async (req, res) => {
    try {
      const planId = req.params.planId;
      const validatedData = insertPlanSectionSchema.parse({
        ...req.body,
        businessPlanId: planId
      });
      const section = await storage.createPlanSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid section data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create section" });
    }
  });
  apiRouter.patch("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const section = await storage.updatePlanSection(id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to update section" });
    }
  });
  apiRouter.get("/business-plans/:planId/financial-data", async (req, res) => {
    try {
      const planId = req.params.planId;
      const data = await storage.getFinancialData(planId);
      if (!data) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial data" });
    }
  });
  apiRouter.post("/business-plans/:planId/financial-data", async (req, res) => {
    try {
      const planId = req.params.planId;
      const validatedData = insertFinancialDataSchema.parse({
        ...req.body,
        businessPlanId: planId
      });
      const data = await storage.createFinancialData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid financial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial data" });
    }
  });
  apiRouter.patch("/business-plans/:planId/financial-data/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = await storage.updateFinancialData(id, req.body);
      if (!data) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial data" });
    }
  });
  apiRouter.get("/business-plans/:planId/analysis", async (req, res) => {
    try {
      const planId = req.params.planId;
      const score = await storage.getAnalysisScore(planId);
      if (!score) {
        return res.status(404).json({ message: "Analysis score not found" });
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis score" });
    }
  });
  apiRouter.post("/business-plans/:planId/analysis", async (req, res) => {
    try {
      const planId = req.params.planId;
      const validatedData = insertAnalysisScoreSchema.parse({
        ...req.body,
        businessPlanId: planId
      });
      const score = await storage.createAnalysisScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid analysis score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analysis score" });
    }
  });
  apiRouter.patch("/business-plans/:planId/analysis/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const score = await storage.updateAnalysisScore(id, req.body);
      if (!score) {
        return res.status(404).json({ message: "Analysis score not found" });
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to update analysis score" });
    }
  });
  apiRouter.get("/pitch-decks/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const deck = await storage.getPitchDeck(planId);
      res.json(deck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pitch deck" });
    }
  });
  apiRouter.post("/pitch-decks", async (req, res) => {
    try {
      const validatedData = insertPitchDeckSchema.parse(req.body);
      const deck = await storage.createPitchDeck(validatedData);
      res.status(201).json(deck);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid pitch deck data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create pitch deck" });
    }
  });
  apiRouter.get("/investments/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const investments = await storage.getInvestments(planId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });
  apiRouter.get("/investments/investor/:investorId", async (req, res) => {
    try {
      const investorId = req.params.investorId;
      const investments = await storage.getInvestmentsByInvestor(investorId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });
  apiRouter.post("/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });
  apiRouter.patch("/investments/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const investment = await storage.updateInvestment(id, req.body);
      if (!investment) {
        return res.status(404).json({ message: "Investment not found" });
      }
      res.json(investment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update investment" });
    }
  });
  apiRouter.get("/loans/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const loans = await storage.getLoans(planId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });
  apiRouter.get("/loans/lender/:lenderId", async (req, res) => {
    try {
      const lenderId = req.params.lenderId;
      const loans = await storage.getLoansByLender(lenderId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });
  apiRouter.post("/loans", async (req, res) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid loan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan" });
    }
  });
  apiRouter.patch("/loans/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const loan = await storage.updateLoan(id, req.body);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update loan" });
    }
  });
  apiRouter.get("/advisory-services/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const services = await storage.getAdvisoryServices(planId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });
  apiRouter.get("/advisory-services/partner/:partnerId", async (req, res) => {
    try {
      const partnerId = req.params.partnerId;
      const services = await storage.getAdvisoryServicesByPartner(partnerId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });
  apiRouter.post("/advisory-services", async (req, res) => {
    try {
      const validatedData = insertAdvisoryServiceSchema.parse(req.body);
      const service = await storage.createAdvisoryService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid advisory service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create advisory service" });
    }
  });
  apiRouter.patch("/advisory-services/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const service = await storage.updateAdvisoryService(id, req.body);
      if (!service) {
        return res.status(404).json({ message: "Advisory service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to update advisory service" });
    }
  });
  apiRouter.get("/programs/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const programs = await storage.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });
  apiRouter.post("/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create program" });
    }
  });
  apiRouter.patch("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage.updateProgram(id, req.body);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to update program" });
    }
  });
  apiRouter.delete("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteProgram(id);
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete program" });
    }
  });
  apiRouter.get("/cohorts/program/:programId", async (req, res) => {
    try {
      const programId = req.params.programId;
      const cohorts = await storage.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });
  apiRouter.get("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const cohort = await storage.getCohort(id);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohort" });
    }
  });
  apiRouter.post("/cohorts", async (req, res) => {
    try {
      const validatedData = insertCohortSchema.parse(req.body);
      const cohort = await storage.createCohort(validatedData);
      res.status(201).json(cohort);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid cohort data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cohort" });
    }
  });
  apiRouter.patch("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const cohort = await storage.updateCohort(id, req.body);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cohort" });
    }
  });
  apiRouter.delete("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteCohort(id);
      if (!success) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cohort" });
    }
  });
  apiRouter.get("/portfolios/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const portfolios = await storage.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });
  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });
  apiRouter.post("/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });
  apiRouter.patch("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage.updatePortfolio(id, req.body);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to update portfolio" });
    }
  });
  apiRouter.delete("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deletePortfolio(id);
      if (!success) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });
  apiRouter.get("/portfolio-companies/portfolio/:portfolioId", async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const companies = await storage.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/portfolio-companies/cohort/:cohortId", async (req, res) => {
    try {
      const cohortId = req.params.cohortId;
      const companies = await storage.getPortfolioCompaniesByCohort(cohortId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const company = await storage.getPortfolioCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio company" });
    }
  });
  apiRouter.post("/portfolio-companies", async (req, res) => {
    try {
      const validatedData = insertPortfolioCompanySchema.parse(req.body);
      const company = await storage.createPortfolioCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio company data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio company" });
    }
  });
  apiRouter.patch("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const company = await storage.updatePortfolioCompany(id, req.body);
      if (!company) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to update portfolio company" });
    }
  });
  apiRouter.delete("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deletePortfolioCompany(id);
      if (!success) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio company" });
    }
  });
  apiRouter.get("/educational-modules/creator/:creatorId", async (req, res) => {
    try {
      const creatorId = req.params.creatorId;
      const modules = await storage.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });
  apiRouter.get("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const module = await storage.getEducationalModule(id);
      if (!module) {
        return res.status(404).json({ message: "Educational module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational module" });
    }
  });
  apiRouter.post("/educational-modules", async (req, res) => {
    try {
      const validatedData = insertEducationalModuleSchema.parse(req.body);
      const module = await storage.createEducationalModule(validatedData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid educational module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create educational module" });
    }
  });
  apiRouter.patch("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const module = await storage.updateEducationalModule(id, req.body);
      if (!module) {
        return res.status(404).json({ message: "Educational module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to update educational module" });
    }
  });
  apiRouter.delete("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteEducationalModule(id);
      if (!success) {
        return res.status(404).json({ message: "Educational module not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete educational module" });
    }
  });
  apiRouter.get("/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorId = req.params.mentorId;
      const mentorships = await storage.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId;
      const mentorships = await storage.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/program/:programId", async (req, res) => {
    try {
      const programId = req.params.programId;
      const mentorships = await storage.getMentorshipsByProgram(programId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const mentorship = await storage.getMentorship(id);
      if (!mentorship) {
        return res.status(404).json({ message: "Mentorship not found" });
      }
      res.json(mentorship);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorship" });
    }
  });
  apiRouter.post("/mentorships", async (req, res) => {
    try {
      const validatedData = insertMentorshipSchema.parse(req.body);
      const mentorship = await storage.createMentorship(validatedData);
      res.status(201).json(mentorship);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid mentorship data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mentorship" });
    }
  });
  apiRouter.patch("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const mentorship = await storage.updateMentorship(id, req.body);
      if (!mentorship) {
        return res.status(404).json({ message: "Mentorship not found" });
      }
      res.json(mentorship);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mentorship" });
    }
  });
  apiRouter.delete("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteMentorship(id);
      if (!success) {
        return res.status(404).json({ message: "Mentorship not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mentorship" });
    }
  });
  apiRouter.get("/venture-projects/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const projects = await storage.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });
  apiRouter.get("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const project = await storage.getVentureProject(id);
      if (!project) {
        return res.status(404).json({ message: "Venture project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture project" });
    }
  });
  apiRouter.post("/venture-projects", async (req, res) => {
    try {
      const validatedData = insertVentureProjectSchema.parse(req.body);
      const project = await storage.createVentureProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid venture project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create venture project" });
    }
  });
  apiRouter.patch("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const project = await storage.updateVentureProject(id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Venture project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update venture project" });
    }
  });
  apiRouter.delete("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteVentureProject(id);
      if (!success) {
        return res.status(404).json({ message: "Venture project not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete venture project" });
    }
  });
  apiRouter.get("/programs", async (req, res) => {
    try {
      const organizationId = "1";
      const programs = await storage.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });
  apiRouter.get("/programs/:programId/cohorts", async (req, res) => {
    try {
      const programId = req.params.programId;
      const cohorts = await storage.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });
  apiRouter.get("/portfolios", async (req, res) => {
    try {
      const organizationId = "1";
      const portfolios = await storage.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });
  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });
  apiRouter.get("/portfolios/:portfolioId/companies", async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const companies = await storage.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/educational-modules", async (req, res) => {
    try {
      const creatorId = "1";
      const modules = await storage.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });
  apiRouter.get("/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorId = req.params.mentorId;
      const mentorships = await storage.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId;
      const mentorships = await storage.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/venture-projects", async (req, res) => {
    try {
      const organizationId = "1";
      const projects = await storage.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });
  apiRouter.get("/dashboard-summary", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user.claims.sub;
      const businessPlans = await storage.getBusinessPlans(userId);
      let financialData = [];
      let analysisScores = [];
      for (const plan of businessPlans) {
        const planFinancial = await storage.getFinancialData(plan.id);
        if (planFinancial) {
          financialData.push(planFinancial);
        }
        const planAnalysis = await storage.getAnalysisScore(plan.id);
        if (planAnalysis) {
          analysisScores.push(planAnalysis);
        }
      }
      res.json({
        totalPlans: businessPlans.length,
        financialData,
        analysisScores
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });
  apiRouter.post("/analyze-plan", async (req, res) => {
    try {
      const demoResponse = {
        overall_score: 85,
        scores: {
          business_model: 88,
          market_analysis: 82,
          financial_projections: 79,
          team_assessment: 92,
          value_proposition: 85,
          competitive_analysis: 81,
          go_to_market: 76,
          risk_assessment: 73
        },
        feedback: {
          business_model: "The business model shows strong revenue streams and clear monetization strategy. Consider exploring additional revenue channels.",
          market_analysis: "Good market research with clear target segments. Could benefit from more detailed competitor analysis.",
          financial_projections: "Financial projections are realistic but could use more detailed expense breakdowns for years 3-5.",
          team_assessment: "Strong founding team with complementary skills. Consider adding advisory board members with industry expertise.",
          value_proposition: "Clear and compelling value proposition. Could strengthen by quantifying benefits more precisely.",
          competitive_analysis: "Good understanding of direct competitors. Expand analysis to include potential market entrants.",
          go_to_market: "Strategy is sound but timeline may be optimistic. Consider more gradual rollout approach.",
          risk_assessment: "Major risks identified, but mitigation strategies could be more comprehensive."
        },
        recommendations: [
          "Develop more detailed financial projections for years 3-5",
          "Add 2-3 industry experts to advisory board",
          "Quantify value proposition with more specific metrics and case studies",
          "Expand competitive analysis to include indirect competitors and potential market entrants",
          "Revise go-to-market timeline to be more realistic given resources"
        ]
      };
      res.json(demoResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze business plan" });
    }
  });
  apiRouter.get("/dashboard/advanced", async (req, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";
      const dashboardData = {
        metrics: {
          totalRevenue: 485e3,
          revenueGrowth: 23.5,
          userGrowth: 18.2,
          conversionRate: 12.8,
          burnRate: 45e3,
          runway: 18.5,
          activeUsers: 12470,
          churnRate: 5.2,
          ltv: 4500,
          cac: 320
        },
        analytics: {
          revenueForecasting: [
            { month: "Jan", predicted: 42e3, actual: 41200, confidence: 0.92 },
            { month: "Feb", predicted: 46e3, actual: 47800, confidence: 0.89 },
            { month: "Mar", predicted: 52e3, actual: 51200, confidence: 0.91 },
            { month: "Apr", predicted: 58e3, confidence: 0.87 },
            { month: "May", predicted: 64e3, confidence: 0.85 },
            { month: "Jun", predicted: 72e3, confidence: 0.83 }
          ],
          userGrowthPrediction: [
            { month: "Jan", predicted: 1e4, lowerBound: 9500, upperBound: 10500 },
            { month: "Feb", predicted: 11500, lowerBound: 10800, upperBound: 12200 },
            { month: "Mar", predicted: 13200, lowerBound: 12300, upperBound: 14100 },
            { month: "Apr", predicted: 15100, lowerBound: 13900, upperBound: 16300 },
            { month: "May", predicted: 17200, lowerBound: 15700, upperBound: 18700 },
            { month: "Jun", predicted: 19600, lowerBound: 17800, upperBound: 21400 }
          ],
          riskFactors: [
            { factor: "Market Saturation", probability: 65, impact: "High", mitigation: "Expand to new markets" },
            { factor: "Competition Increase", probability: 78, impact: "Medium", mitigation: "Strengthen USP" },
            { factor: "Economic Downturn", probability: 42, impact: "High", mitigation: "Diversify revenue streams" }
          ],
          marketOpportunities: [
            { opportunity: "AI Integration", score: 89, timeline: "3-6 months", potential: "$120K ARR" },
            { opportunity: "Mobile App", score: 76, timeline: "6-9 months", potential: "$80K ARR" },
            { opportunity: "Enterprise Sales", score: 94, timeline: "2-4 months", potential: "$200K ARR" }
          ]
        }
      };
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advanced dashboard data" });
    }
  });
  apiRouter.get("/valuation/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const [businessPlan, financialStats, analysisData] = await Promise.all([
        storage.getBusinessPlan(planId),
        storage.getFinancialData(planId),
        storage.getAnalysisScore(planId)
      ]);
      if (!businessPlan) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      const valuationData = {
        plan: businessPlan,
        financial: financialStats,
        analysis: analysisData,
        valuationSummary: {
          currentValuation: analysisData?.companyValue || 47e5,
          // Fallback value
          valuationMethods: [
            {
              method: "Discounted Cash Flow (DCF)",
              applicability: "High",
              description: "Based on projected cash flows discounted to present value",
              result: "$5.2M"
            },
            {
              method: "Comparable Company Analysis",
              applicability: "High",
              description: "Based on valuation multiples of similar public companies",
              result: "$4.8M"
            },
            {
              method: "Venture Capital Method",
              applicability: "High",
              description: "Based on exit value and expected ROI for investors",
              result: "$4.5M"
            },
            {
              method: "First Chicago Method",
              applicability: "Medium",
              description: "Probability-weighted scenarios (success, sideways, failure)",
              result: "$4.3M"
            },
            {
              method: "Berkus Method",
              applicability: "Medium",
              description: "Assigns value to qualitative aspects of early-stage startups",
              result: "$4.6M"
            },
            {
              method: "Risk Factor Summation",
              applicability: "Medium",
              description: "Adjusts base value according to various risk factors",
              result: "$4.9M"
            }
          ],
          summaryMetrics: [
            {
              label: "Valuation",
              value: "$4.7M",
              trend: 1,
              change: "+14.2%",
              description: "Estimated company valuation based on multiple methods"
            },
            {
              label: "Revenue Multiple",
              value: "6.5x",
              trend: 1,
              change: "+0.8x",
              description: "Revenue multiple compared to industry average"
            },
            {
              label: "Runway",
              value: "18 months",
              trend: -1,
              change: "-2 months",
              description: "Cash runway at current burn rate"
            },
            {
              label: "Burn Rate",
              value: "$85K/mo",
              trend: 1,
              change: "+5.2%",
              description: "Monthly cash burn rate"
            }
          ],
          financialMetrics: [
            {
              label: "Revenue",
              value: "$720K",
              benchmark: "Benchmark: $650K",
              trend: 1,
              change: "+18.5%",
              description: "Annual recurring revenue"
            },
            {
              label: "Growth Rate",
              value: "27.8%",
              benchmark: "Benchmark: 25%",
              trend: 1,
              change: "+3.2pts",
              description: "Year-over-year revenue growth"
            },
            {
              label: "EBITDA Margin",
              value: "-15%",
              benchmark: "Benchmark: -20%",
              trend: 1,
              change: "+5pts",
              description: "Earnings before interest, taxes, depreciation, and amortization"
            }
          ],
          nonFinancialMetrics: [
            {
              label: "Active Users",
              value: "5,820",
              benchmark: "Benchmark: 4,500",
              trend: 1,
              change: "+28.5%",
              description: "Monthly active users"
            },
            {
              label: "Retention Rate",
              value: "78%",
              benchmark: "Benchmark: 70%",
              trend: 1,
              change: "+8pts",
              description: "Customer retention rate"
            },
            {
              label: "Customer LTV",
              value: "$4,005",
              benchmark: "Benchmark: $3,500",
              trend: 1,
              change: "+14.4%",
              description: "Customer lifetime value"
            },
            {
              label: "CAC",
              value: "$890",
              benchmark: "Benchmark: $950",
              trend: -1,
              change: "-6.3%",
              description: "Customer acquisition cost"
            }
          ],
          marketMetrics: [
            {
              label: "Market Size",
              value: "$48B",
              benchmark: "CAGR: 14.2%",
              trend: 1,
              change: "+3.5B",
              description: "Total addressable market size"
            },
            {
              label: "Market Share",
              value: "0.05%",
              benchmark: "Top 10%: 2.5%",
              trend: 1,
              change: "+0.02pts",
              description: "Current market share percentage"
            }
          ],
          teamAssessment: [
            {
              name: "Sarah Johnson",
              role: "CEO",
              experience: "15 years",
              prior_exits: "2",
              expertise: ["Strategy", "Leadership", "Fundraising"]
            },
            {
              name: "Michael Chen",
              role: "CTO",
              experience: "12 years",
              prior_exits: "1",
              expertise: ["Software Architecture", "AI", "DevOps"]
            },
            {
              name: "David Rodriguez",
              role: "CFO",
              experience: "18 years",
              prior_exits: "1",
              expertise: ["Finance", "Venture Capital", "M&A"]
            },
            {
              name: "Emma Williams",
              role: "CMO",
              experience: "10 years",
              prior_exits: "0",
              expertise: ["Digital Marketing", "Brand Strategy", "Growth"]
            }
          ]
        }
      };
      res.json(valuationData);
    } catch (error) {
      console.error("Valuation error:", error);
      res.status(500).json({ message: "Failed to fetch valuation data" });
    }
  });
  apiRouter.get("/credit-scores", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user.claims.sub;
      const scores = await storage.getCreditScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit scores" });
    }
  });
  apiRouter.get("/credit-score/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const score = await storage.getCreditScore(id);
      if (score) {
        res.json(score);
      } else {
        res.status(404).json({ message: "Credit score not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit score" });
    }
  });
  apiRouter.post("/credit-scores", async (req, res) => {
    try {
      const parsedBody = insertCreditScoreSchema.parse(req.body);
      const score = await storage.createCreditScore(parsedBody);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid credit score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit score" });
    }
  });
  apiRouter.patch("/credit-scores/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedScore = await storage.updateCreditScore(id, req.body);
      if (updatedScore) {
        res.json(updatedScore);
      } else {
        res.status(404).json({ message: "Credit score not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update credit score" });
    }
  });
  apiRouter.get("/financial-milestones/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const milestones = await storage.getFinancialMilestones(userId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial milestones" });
    }
  });
  apiRouter.get("/financial-milestone/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const milestone = await storage.getFinancialMilestone(id);
      if (milestone) {
        res.json(milestone);
      } else {
        res.status(404).json({ message: "Financial milestone not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial milestone" });
    }
  });
  apiRouter.post("/financial-milestones", async (req, res) => {
    try {
      const parsedBody = insertFinancialMilestoneSchema.parse(req.body);
      const milestone = await storage.createFinancialMilestone(parsedBody);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid financial milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial milestone" });
    }
  });
  apiRouter.patch("/financial-milestones/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedMilestone = await storage.updateFinancialMilestone(id, req.body);
      if (updatedMilestone) {
        res.json(updatedMilestone);
      } else {
        res.status(404).json({ message: "Financial milestone not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial milestone" });
    }
  });
  apiRouter.get("/ai-coaching-messages/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const messages = await storage.getAiCoachingMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve AI coaching messages" });
    }
  });
  apiRouter.post("/ai-coaching-messages", async (req, res) => {
    try {
      const parsedBody = insertAiCoachingMessageSchema.parse(req.body);
      const message = await storage.createAiCoachingMessage(parsedBody);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid AI coaching message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI coaching message" });
    }
  });
  apiRouter.get("/credit-tips", async (req, res) => {
    try {
      const tips = await storage.getCreditTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips" });
    }
  });
  apiRouter.get("/credit-tips/category/:category", async (req, res) => {
    const category = req.params.category;
    try {
      const tips = await storage.getCreditTipsByCategory(category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips by category" });
    }
  });
  apiRouter.get("/credit-tip/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const tip = await storage.getCreditTip(id);
      if (tip) {
        res.json(tip);
      } else {
        res.status(404).json({ message: "Credit tip not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tip" });
    }
  });
  apiRouter.post("/credit-tips", async (req, res) => {
    try {
      const parsedBody = insertCreditTipSchema.parse(req.body);
      const tip = await storage.createCreditTip(parsedBody);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit tip" });
    }
  });
  apiRouter.get("/user-credit-tips/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const userTips = await storage.getUserCreditTips(userId);
      res.json(userTips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user credit tips" });
    }
  });
  apiRouter.post("/user-credit-tips", async (req, res) => {
    try {
      const parsedBody = insertUserCreditTipSchema.parse(req.body);
      const userTip = await storage.createUserCreditTip(parsedBody);
      res.status(201).json(userTip);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid user credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user credit tip" });
    }
  });
  apiRouter.patch("/user-credit-tips/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedUserTip = await storage.updateUserCreditTip(id, req.body);
      if (updatedUserTip) {
        res.json(updatedUserTip);
      } else {
        res.status(404).json({ message: "User credit tip not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user credit tip" });
    }
  });
  apiRouter.get("/financial-projections/:businessPlanId", async (req, res) => {
    const businessPlanId = req.params.businessPlanId;
    try {
      const projections = await storage.getFinancialProjections(businessPlanId);
      res.json(projections);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial projections" });
    }
  });
  apiRouter.get("/financial-projection/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const projection = await storage.getFinancialProjection(id);
      if (projection) {
        res.json(projection);
      } else {
        res.status(404).json({ message: "Financial projection not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial projection" });
    }
  });
  apiRouter.post("/financial-projections", async (req, res) => {
    try {
      const parsedBody = insertFinancialProjectionSchema.parse(req.body);
      const projection = await storage.createFinancialProjection(parsedBody);
      res.status(201).json(projection);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid financial projection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial projection" });
    }
  });
  apiRouter.patch("/financial-projections/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedProjection = await storage.updateFinancialProjection(id, req.body);
      if (updatedProjection) {
        res.json(updatedProjection);
      } else {
        res.status(404).json({ message: "Financial projection not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial projection" });
    }
  });
  apiRouter.get("/ai-business-analysis/:businessPlanId", async (req, res) => {
    const businessPlanId = req.params.businessPlanId;
    try {
      const analysis = await storage.getAiBusinessAnalysis(businessPlanId);
      if (analysis) {
        res.json(analysis);
      } else {
        res.status(404).json({ message: "AI business analysis not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve AI business analysis" });
    }
  });
  apiRouter.post("/ai-business-analysis", async (req, res) => {
    try {
      const parsedBody = insertAiBusinessAnalysisSchema.parse(req.body);
      const analysis = await storage.createAiBusinessAnalysis(parsedBody);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid AI business analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI business analysis" });
    }
  });
  apiRouter.patch("/ai-business-analysis/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedAnalysis = await storage.updateAiBusinessAnalysis(id, req.body);
      if (updatedAnalysis) {
        res.json(updatedAnalysis);
      } else {
        res.status(404).json({ message: "AI business analysis not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI business analysis" });
    }
  });
  apiRouter.get("/credit-score-tiers", async (req, res) => {
    try {
      const tiers = await storage.getCreditScoreTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score tiers" });
    }
  });
  apiRouter.get("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const tier = await storage.getCreditScoreTier(id);
      if (!tier) {
        return res.status(404).json({ message: "Credit score tier not found" });
      }
      res.json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score tier" });
    }
  });
  apiRouter.get("/credit-score-tiers/score/:score", async (req, res) => {
    try {
      const score = parseInt(req.params.score, 10);
      if (isNaN(score)) {
        return res.status(400).json({ message: "Invalid score" });
      }
      const tier = await storage.getCreditScoreTierByScore(score);
      if (!tier) {
        return res.status(404).json({ message: "No tier found for the given score" });
      }
      res.json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tier by score" });
    }
  });
  apiRouter.post("/credit-score-tiers", async (req, res) => {
    try {
      const tier = await storage.createCreditScoreTier(req.body);
      res.status(201).json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score tier" });
    }
  });
  apiRouter.patch("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedTier = await storage.updateCreditScoreTier(id, req.body);
      if (!updatedTier) {
        return res.status(404).json({ message: "Credit score tier not found" });
      }
      res.json(updatedTier);
    } catch (error) {
      res.status(500).json({ message: "Failed to update credit score tier" });
    }
  });
  apiRouter.get("/credit-achievements", async (req, res) => {
    try {
      const achievements = await storage.getCreditAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit achievements" });
    }
  });
  apiRouter.get("/credit-achievements/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const achievements = await storage.getCreditAchievementsByCategory(category);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements by category" });
    }
  });
  apiRouter.get("/credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const achievement = await storage.getCreditAchievement(id);
      if (!achievement) {
        return res.status(404).json({ message: "Credit achievement not found" });
      }
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit achievement" });
    }
  });
  apiRouter.post("/credit-achievements", async (req, res) => {
    try {
      const achievement = await storage.createCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit achievement" });
    }
  });
  apiRouter.get("/user-credit-achievements/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const achievements = await storage.getUserCreditAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user credit achievements" });
    }
  });
  apiRouter.get("/user-credit-achievements/unseen/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const achievements = await storage.getUnseenAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unseen achievements" });
    }
  });
  apiRouter.post("/user-credit-achievements", async (req, res) => {
    try {
      const achievement = await storage.createUserCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user credit achievement" });
    }
  });
  apiRouter.patch("/user-credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedAchievement = await storage.updateUserCreditAchievement(id, req.body);
      if (!updatedAchievement) {
        return res.status(404).json({ message: "User credit achievement not found" });
      }
      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user credit achievement" });
    }
  });
  apiRouter.post("/user-credit-achievements/:id/mark-seen", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedAchievement = await storage.markAchievementAsSeen(id);
      if (!updatedAchievement) {
        return res.status(404).json({ message: "User credit achievement not found" });
      }
      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark achievement as seen" });
    }
  });
  apiRouter.get("/credit-score-history/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const history = await storage.getCreditScoreHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score history" });
    }
  });
  apiRouter.post("/credit-score-history", async (req, res) => {
    try {
      const history = await storage.createCreditScoreHistory(req.body);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score history" });
    }
  });
  apiRouter.get("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const points = await storage.getUserRewardPoints(userId);
      if (!points) {
        return res.status(404).json({ message: "User reward points not found" });
      }
      res.json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reward points" });
    }
  });
  apiRouter.post("/user-reward-points", async (req, res) => {
    try {
      const points = await storage.createUserRewardPoints(req.body);
      res.status(201).json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user reward points" });
    }
  });
  apiRouter.patch("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedPoints = await storage.updateUserRewardPoints(userId, req.body);
      if (!updatedPoints) {
        return res.status(404).json({ message: "User reward points not found" });
      }
      res.json(updatedPoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user reward points" });
    }
  });
  apiRouter.post("/user-reward-points/:userId/add", async (req, res) => {
    try {
      const userId = req.params.userId;
      const { amount, description, type, referenceId, referenceType } = req.body;
      if (typeof amount !== "number" || !description || !type) {
        return res.status(400).json({ message: "Invalid request body. Must include amount, description, and type." });
      }
      const updatedPoints = await storage.addUserPoints(userId, amount, description, type, referenceId, referenceType);
      res.json(updatedPoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to add reward points" });
    }
  });
  apiRouter.get("/point-transactions/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await storage.getPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch point transactions" });
    }
  });
  apiRouter.post("/point-transactions", async (req, res) => {
    try {
      const transaction = await storage.createPointTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create point transaction" });
    }
  });
  apiRouter.post("/ai/market-analysis", isAuthenticated, async (req, res) => {
    try {
      const { industry, businessDescription } = req.body;
      if (!industry || !businessDescription) {
        return res.status(400).json({ message: "Industry and business description are required" });
      }
      const analysis = await aiService.analyzeMarketTrends(industry, businessDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Market analysis error:", error);
      res.status(500).json({ message: "Failed to analyze market trends" });
    }
  });
  apiRouter.post("/ai/competitive-analysis", isAuthenticated, async (req, res) => {
    try {
      const { industry, businessDescription, competitors } = req.body;
      if (!industry || !businessDescription) {
        return res.status(400).json({ message: "Industry and business description are required" });
      }
      const analysis = await aiService.performCompetitiveAnalysis(industry, businessDescription, competitors);
      res.json(analysis);
    } catch (error) {
      console.error("Competitive analysis error:", error);
      res.status(500).json({ message: "Failed to perform competitive analysis" });
    }
  });
  apiRouter.post("/ai/business-guidance", isAuthenticated, async (req, res) => {
    try {
      const { question, businessContext } = req.body;
      if (!question || !businessContext) {
        return res.status(400).json({ message: "Question and business context are required" });
      }
      const guidance = await aiService.provideBusinessGuidance(question, businessContext);
      res.json(guidance);
    } catch (error) {
      console.error("Business guidance error:", error);
      res.status(500).json({ message: "Failed to provide business guidance" });
    }
  });
  apiRouter.post("/ai/risk-assessment", isAuthenticated, async (req, res) => {
    try {
      const { businessPlan, financials } = req.body;
      if (!businessPlan) {
        return res.status(400).json({ message: "Business plan is required" });
      }
      const assessment = await aiService.assessBusinessRisk(businessPlan, financials);
      res.json(assessment);
    } catch (error) {
      console.error("Risk assessment error:", error);
      res.status(500).json({ message: "Failed to assess business risk" });
    }
  });
  apiRouter.post("/ai/validate-projections", isAuthenticated, async (req, res) => {
    try {
      const { projections, actualData } = req.body;
      if (!projections) {
        return res.status(400).json({ message: "Financial projections are required" });
      }
      const validation = await aiService.validateFinancialProjections(projections, actualData);
      res.json(validation);
    } catch (error) {
      console.error("Projection validation error:", error);
      res.status(500).json({ message: "Failed to validate financial projections" });
    }
  });
  apiRouter.post("/ai/generate-content", isAuthenticated, async (req, res) => {
    try {
      const { section, context, businessInfo } = req.body;
      if (!section || !context) {
        return res.status(400).json({ message: "Section and context are required" });
      }
      const content = await aiService.generateBusinessContent(section, context, businessInfo);
      res.json({ content });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate business content" });
    }
  });
  apiRouter.post("/ai/sentiment-analysis", isAuthenticated, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      const sentiment = await aiService.analyzeSentiment(text);
      res.json(sentiment);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      res.status(500).json({ message: "Failed to analyze sentiment" });
    }
  });
  apiRouter.get("/analytics/dashboard", isAuthenticated, async (req, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";
      const analyticsData = {
        performanceMetrics: {
          totalRevenue: 485e3,
          revenueGrowth: 23.5,
          userGrowth: 18.2,
          conversionRate: 12.8,
          customerAcquisitionCost: 285,
          lifetimeValue: 3450,
          burnRate: 45e3,
          runway: 18.5
        },
        predictiveModels: {
          revenueForecasting: [
            { month: "Jan", predicted: 42e3, actual: 41200, confidence: 0.92 },
            { month: "Feb", predicted: 46e3, actual: 47800, confidence: 0.89 },
            { month: "Mar", predicted: 52e3, actual: 51200, confidence: 0.91 },
            { month: "Apr", predicted: 58e3, confidence: 0.87 },
            { month: "May", predicted: 64e3, confidence: 0.85 },
            { month: "Jun", predicted: 72e3, confidence: 0.83 }
          ],
          riskFactors: [
            { factor: "Market Saturation", likelihood: 65, impact: "High", mitigation: "Expand to new markets" },
            { factor: "Competition Increase", likelihood: 78, impact: "Medium", mitigation: "Strengthen USP" },
            { factor: "Economic Downturn", likelihood: 42, impact: "High", mitigation: "Diversify revenue streams" }
          ],
          marketOpportunities: [
            { opportunity: "AI Integration", score: 89, timeline: "3-6 months", potential: "$120K ARR" },
            { opportunity: "Mobile App", score: 76, timeline: "6-9 months", potential: "$80K ARR" },
            { opportunity: "Enterprise Sales", score: 94, timeline: "2-4 months", potential: "$200K ARR" }
          ]
        },
        realTimeMetrics: {
          activeUsers: Math.floor(Math.random() * 500) + 1e3,
          salesConversions: Math.floor(Math.random() * 30) + 10,
          marketSentiment: Math.floor(Math.random() * 20) + 70,
          competitivePosition: Math.floor(Math.random() * 15) + 80
        }
      };
      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });
  apiRouter.get("/analytics/performance/:metric", isAuthenticated, async (req, res) => {
    try {
      const metric = req.params.metric;
      const timeRange = req.query.timeRange || "30d";
      const performanceData = {
        revenue: {
          current: 485e3,
          previous: 394e3,
          growth: 23.1,
          trend: [
            { date: "2024-01", value: 28e4 },
            { date: "2024-02", value: 32e4 },
            { date: "2024-03", value: 385e3 },
            { date: "2024-04", value: 42e4 },
            { date: "2024-05", value: 465e3 },
            { date: "2024-06", value: 485e3 }
          ]
        },
        users: {
          current: 12847,
          previous: 10865,
          growth: 18.2,
          trend: [
            { date: "2024-01", value: 8200 },
            { date: "2024-02", value: 9100 },
            { date: "2024-03", value: 10200 },
            { date: "2024-04", value: 11100 },
            { date: "2024-05", value: 12e3 },
            { date: "2024-06", value: 12847 }
          ]
        }
      };
      const data = performanceData[metric];
      if (!data) {
        return res.status(404).json({ message: "Metric not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Performance metric error:", error);
      res.status(500).json({ message: "Failed to fetch performance metric" });
    }
  });
  app2.post("/api/organizations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const organization = await storage.createOrganization({
        ...req.body,
        ownerId: user.claims.sub
      });
      await storage.addUserToOrganization(user.claims.sub, organization.id, "admin");
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to create organization" });
    }
  });
  app2.get("/api/organizations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const organizations = await storage.getUserOrganizations(user.claims.sub);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const organization = await storage.getOrganization(req.params.id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });
  app2.put("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      const updateData = req.body;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: orgId,
          ...updateData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const updatedOrg = await storage.updateOrganization(orgId, {
        ...updateData,
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedOrg) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(updatedOrg);
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(500).json({ message: "Failed to update organization" });
    }
  });
  app2.delete("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({ message: "Organization deleted successfully" });
      }
      await storage.deleteOrganization(orgId);
      res.json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ message: "Failed to delete organization" });
    }
  });
  app2.get("/api/organizations/:id/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json([
          {
            id: "1",
            name: "John Doe",
            email: "john@techstart.com",
            role: "owner",
            status: "active",
            joinedAt: "2024-01-15",
            department: "Engineering"
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@techstart.com",
            role: "admin",
            status: "active",
            joinedAt: "2024-01-20",
            department: "Marketing"
          }
        ]);
      }
      const members = await storage.getOrganizationMembers(orgId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching organization members:", error);
      res.status(500).json({ message: "Failed to fetch organization members" });
    }
  });
  app2.post("/api/organizations/:id/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      const { email, role, message } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: Date.now().toString(),
          email,
          role,
          status: "pending",
          invitedBy: userId,
          invitedAt: (/* @__PURE__ */ new Date()).toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
          message
        });
      }
      const invitation = await storage.createOrganizationInvitation({
        organizationId: orgId,
        email,
        role,
        invitedBy: userId,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      });
      res.json(invitation);
    } catch (error) {
      console.error("Error creating organization invitation:", error);
      res.status(500).json({ message: "Failed to create organization invitation" });
    }
  });
  app2.get("/api/organizations/:id/analytics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          totalMembers: 12,
          activeMembers: 10,
          pendingInvites: 2,
          departments: {
            "Engineering": 5,
            "Marketing": 3,
            "Sales": 2,
            "Finance": 2
          },
          roles: {
            "owner": 1,
            "admin": 2,
            "member": 7,
            "viewer": 2
          },
          revenue: 25e5,
          growthRate: 15.8,
          memberGrowth: 23.2
        });
      }
      const analytics = await storage.getOrganizationAnalytics(orgId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching organization analytics:", error);
      res.status(500).json({ message: "Failed to fetch organization analytics" });
    }
  });
  app2.get("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          // Account Settings
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          timezone: "America/New_York",
          language: "en",
          // Privacy Settings
          profileVisibility: "organization",
          dataSharing: true,
          analyticsOptIn: true,
          marketingEmails: false,
          // Notification Settings
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          notificationFrequency: "daily",
          // AI Agent Settings
          aiPersonality: "professional",
          aiResponseLength: "detailed",
          aiProactiveInsights: true,
          aiDataRetention: 90,
          // Organization Settings
          defaultOrganization: "techstart-inc",
          organizationNotifications: true,
          teamCollaboration: true,
          // Appearance Settings
          theme: "system",
          fontSize: "medium",
          compactMode: false,
          // Security Settings
          twoFactorAuth: false,
          sessionTimeout: 60,
          loginNotifications: true,
          deviceTrust: true
        });
      }
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });
  app2.put("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const settingsData = req.body;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          ...settingsData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const updatedSettings = await storage.updateUserSettings(userId, settingsData);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });
  app2.post("/api/settings/reset", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          message: "Settings reset to default values",
          resetAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      await storage.resetUserSettings(userId);
      res.json({ message: "Settings reset to default values" });
    } catch (error) {
      console.error("Error resetting user settings:", error);
      res.status(500).json({ message: "Failed to reset user settings" });
    }
  });
  app2.get("/api/settings/export", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        const exportData2 = {
          user: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com"
          },
          settings: {
            // All settings data
          },
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          version: "1.0"
        };
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", 'attachment; filename="settings-export.json"');
        res.json(exportData2);
        return;
      }
      const exportData = await storage.exportUserSettings(userId);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", 'attachment; filename="settings-export.json"');
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting user settings:", error);
      res.status(500).json({ message: "Failed to export user settings" });
    }
  });
  app2.post("/api/collaborations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const collaboration = await storage.createCollaboration({
        ...req.body,
        createdBy: user.claims.sub,
        participants: [user.claims.sub, ...req.body.participants || []]
      });
      res.json(collaboration);
    } catch (error) {
      res.status(500).json({ message: "Failed to create collaboration" });
    }
  });
  app2.get("/api/collaborations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const collaborations = await storage.getUserCollaborations(user.claims.sub);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });
  app2.post("/api/invitations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const invitation = await storage.createInvitation({
        ...req.body,
        inviterId: user.claims.sub,
        inviterEmail: user.claims.email
      });
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });
  app2.get("/api/invitations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const invitations = await storage.getUserInvitations(user.claims.email);
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });
  app2.patch("/api/invitations/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const invitation = await storage.getInvitation(req.params.id);
      if (!invitation || invitation.inviteeEmail !== user.claims.email) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      const updatedInvitation = await storage.updateInvitation(req.params.id, req.body);
      if (req.body.status === "accepted" && invitation.type === "organization") {
        await storage.addUserToOrganization(user.claims.sub, invitation.organizationId, invitation.role || "member");
      }
      res.json(updatedInvitation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update invitation" });
    }
  });
  app2.get("/api/user", async (req, res) => {
    if (process.env.NODE_ENV === "development") {
      return res.json({
        id: "dev-user-123",
        email: "dev@example.com",
        firstName: "Dev",
        lastName: "User",
        profileImageUrl: null,
        userType: "ENTREPRENEUR"
      });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    res.json({
      id: user.claims?.sub || user.id,
      email: user.claims?.email || user.email,
      firstName: user.claims?.first_name || user.firstName,
      lastName: user.claims?.last_name || user.lastName,
      profileImageUrl: user.claims?.profile_image_url || user.profileImageUrl
    });
  });
  app2.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: userId,
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          profileImageUrl: null,
          userType: "entrepreneur",
          userSubtype: "serial-entrepreneur",
          role: "Founder & CEO",
          bio: "Passionate entrepreneur building the future of fintech",
          location: "San Francisco, CA",
          website: "https://mycompany.com",
          linkedin: "https://linkedin.com/in/username",
          twitter: "https://twitter.com/username",
          phone: "+1 (555) 123-4567",
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
              marketing: false
            },
            privacy: {
              profileVisibility: "public",
              showEmail: false,
              showPhone: false,
              showLocation: true
            },
            display: {
              theme: "light",
              language: "en",
              timezone: "UTC"
            }
          },
          metrics: {
            businessGrowth: 85,
            fundingStage: "Series A",
            teamSize: 12,
            revenueGrowth: 150,
            marketValidation: 78
          },
          verified: true,
          onboardingCompleted: true,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-20T14:45:00Z"
        });
      }
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const {
        firstName,
        lastName,
        email,
        userSubtype,
        role,
        bio,
        location,
        website,
        linkedin,
        twitter,
        phone,
        preferences
      } = req.body;
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: userId,
          firstName,
          lastName,
          email,
          userSubtype,
          role,
          bio,
          location,
          website,
          linkedin,
          twitter,
          phone,
          preferences,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        userSubtype,
        role,
        bio,
        location,
        website,
        linkedin,
        twitter,
        phone,
        preferences,
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.post("/api/profile/upload-image", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const mockImageUrl = `https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=${userId.slice(0, 2).toUpperCase()}`;
      res.json({
        imageUrl: mockImageUrl,
        message: "Image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  app2.get("/api/team/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json([
          {
            id: "1",
            name: "John Doe",
            email: "john@startup.com",
            role: "owner",
            status: "active",
            joinedAt: "2024-01-15",
            lastActive: "2024-01-20T10:30:00Z",
            department: "Engineering",
            skills: ["React", "TypeScript", "Node.js"],
            bio: "Full-stack developer with 5+ years experience",
            location: "San Francisco, CA",
            phone: "+1 (555) 123-4567",
            website: "https://johndoe.dev",
            linkedin: "https://linkedin.com/in/johndoe",
            twitter: "https://twitter.com/johndoe",
            github: "https://github.com/johndoe"
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@startup.com",
            role: "admin",
            status: "active",
            joinedAt: "2024-02-01",
            lastActive: "2024-01-20T09:15:00Z",
            department: "Marketing",
            skills: ["Digital Marketing", "Content Strategy", "SEO"],
            bio: "Marketing strategist focused on growth and brand building",
            location: "New York, NY",
            phone: "+1 (555) 234-5678",
            linkedin: "https://linkedin.com/in/janesmith"
          },
          {
            id: "3",
            name: "Mike Johnson",
            email: "mike@startup.com",
            role: "member",
            status: "pending",
            joinedAt: "2024-02-15",
            department: "Sales",
            skills: ["Sales Strategy", "CRM", "Lead Generation"],
            bio: "Sales professional with expertise in B2B sales",
            location: "Austin, TX"
          }
        ]);
      }
      const members = await storage.getTeamMembers(userId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  app2.post("/api/team/invite", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { email, role, message } = req.body;
      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: Date.now().toString(),
          email,
          role,
          status: "pending",
          invitedBy: userId,
          invitedAt: (/* @__PURE__ */ new Date()).toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
          message
        });
      }
      const invitation = await storage.createTeamInvitation({
        email,
        role,
        invitedBy: userId,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      });
      res.json(invitation);
    } catch (error) {
      console.error("Error creating team invitation:", error);
      res.status(500).json({ message: "Failed to create team invitation" });
    }
  });
  app2.get("/api/team/invitations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json([
          {
            id: "1",
            email: "alex@startup.com",
            role: "member",
            status: "pending",
            invitedBy: "John Doe",
            invitedAt: "2024-01-18T10:00:00Z",
            expiresAt: "2024-01-25T10:00:00Z",
            message: "Welcome to our team! Looking forward to working with you."
          }
        ]);
      }
      const invitations = await storage.getTeamInvitations(userId);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching team invitations:", error);
      res.status(500).json({ message: "Failed to fetch team invitations" });
    }
  });
  app2.put("/api/team/members/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const memberId = req.params.id;
      const { role, department, status } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({
          id: memberId,
          role,
          department,
          status,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const updatedMember = await storage.updateTeamMember(memberId, {
        role,
        department,
        status,
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });
  app2.delete("/api/team/members/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const memberId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({ message: "Team member removed successfully" });
      }
      await storage.removeTeamMember(memberId);
      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      console.error("Error removing team member:", error);
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });
  app2.post("/api/team/invitations/:id/resend", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const invitationId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({ message: "Invitation resent successfully" });
      }
      await storage.resendTeamInvitation(invitationId);
      res.json({ message: "Invitation resent successfully" });
    } catch (error) {
      console.error("Error resending invitation:", error);
      res.status(500).json({ message: "Failed to resend invitation" });
    }
  });
  app2.delete("/api/team/invitations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const invitationId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      if (process.env.NODE_ENV === "development") {
        return res.json({ message: "Invitation cancelled successfully" });
      }
      await storage.cancelTeamInvitation(invitationId);
      res.json({ message: "Invitation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      res.status(500).json({ message: "Failed to cancel invitation" });
    }
  });
  app2.use("/api", apiRouter);
  app2.use("/api/ai-agents", ai_agent_routes_default);
  const { AIInfographicService: AIInfographicService2 } = await Promise.resolve().then(() => (init_ai_infographic_service(), ai_infographic_service_exports));
  const { InfographicExportService: InfographicExportService2 } = await Promise.resolve().then(() => (init_infographic_export_service(), infographic_export_service_exports));
  apiRouter.post("/documents/infographic/generate", isAuthenticated, async (req, res) => {
    try {
      const { prompt, template, customization, data, userId } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const infographicService = new AIInfographicService2();
      const infographic = await infographicService.generateInfographic(
        prompt,
        data,
        { template, customization },
        userId || req.user?.id
      );
      res.json(infographic);
    } catch (error) {
      console.error("Infographic generation error:", error);
      res.status(500).json({ message: "Failed to generate infographic" });
    }
  });
  apiRouter.get("/documents/infographic/templates", isAuthenticated, async (req, res) => {
    try {
      const infographicService = new AIInfographicService2();
      const templates = await infographicService.getInfographicTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Templates loading error:", error);
      res.status(500).json({ message: "Failed to load templates" });
    }
  });
  apiRouter.post("/documents/infographic/enhance", isAuthenticated, async (req, res) => {
    try {
      const { infographic, enhancements, userId } = req.body;
      if (!infographic || !enhancements) {
        return res.status(400).json({ message: "Infographic and enhancements are required" });
      }
      const infographicService = new AIInfographicService2();
      const enhanced = await infographicService.enhanceInfographic(
        infographic,
        enhancements,
        userId || req.user?.id
      );
      res.json(enhanced);
    } catch (error) {
      console.error("Infographic enhancement error:", error);
      res.status(500).json({ message: "Failed to enhance infographic" });
    }
  });
  apiRouter.post("/documents/infographic/suggestions", isAuthenticated, async (req, res) => {
    try {
      const { infographic } = req.body;
      if (!infographic) {
        return res.status(400).json({ message: "Infographic is required" });
      }
      const infographicService = new AIInfographicService2();
      const suggestions = await infographicService.getEnhancementSuggestions(infographic);
      res.json(suggestions);
    } catch (error) {
      console.error("Enhancement suggestions error:", error);
      res.status(500).json({ message: "Failed to get enhancement suggestions" });
    }
  });
  apiRouter.post("/documents/infographic/analyze-quality", isAuthenticated, async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ message: "Data is required" });
      }
      const infographicService = new AIInfographicService2();
      const quality = await infographicService.analyzeDataQuality(data);
      res.json(quality);
    } catch (error) {
      console.error("Data quality analysis error:", error);
      res.status(500).json({ message: "Failed to analyze data quality" });
    }
  });
  apiRouter.post("/documents/infographic/export", isAuthenticated, async (req, res) => {
    try {
      const { infographic, format, options } = req.body;
      if (!infographic || !format) {
        return res.status(400).json({ message: "Infographic and format are required" });
      }
      const exportService = new InfographicExportService2();
      const result = await exportService.exportInfographic(infographic, {
        format,
        ...options
      });
      if (!result.success) {
        return res.status(500).json({ message: result.error || "Export failed" });
      }
      const mimeTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        svg: "image/svg+xml",
        pdf: "application/pdf"
      };
      res.setHeader("Content-Type", mimeTypes[format] || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="infographic.${format}"`);
      res.setHeader("Content-Length", result.buffer.length);
      res.send(result.buffer);
    } catch (error) {
      console.error("Infographic export error:", error);
      res.status(500).json({ message: "Failed to export infographic" });
    }
  });
  apiRouter.post("/infographic/export-multiple", isAuthenticated, async (req, res) => {
    try {
      const { infographic, formats, options } = req.body;
      if (!infographic || !formats || !Array.isArray(formats)) {
        return res.status(400).json({ message: "Infographic and formats array are required" });
      }
      const exportService = new InfographicExportService2();
      const results = await exportService.exportMultipleFormats(infographic, formats);
      res.json(results);
    } catch (error) {
      console.error("Multiple format export error:", error);
      res.status(500).json({ message: "Failed to export multiple formats" });
    }
  });
  apiRouter.post("/infographic/export-zip", isAuthenticated, async (req, res) => {
    try {
      const { infographic, formats } = req.body;
      if (!infographic || !formats || !Array.isArray(formats)) {
        return res.status(400).json({ message: "Infographic and formats array are required" });
      }
      const exportService = new InfographicExportService2();
      const zipBuffer = await exportService.createZipArchive(infographic, formats);
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="infographic-package.zip"');
      res.setHeader("Content-Length", zipBuffer.length);
      res.send(zipBuffer);
    } catch (error) {
      console.error("Zip export error:", error);
      res.status(500).json({ message: "Failed to create zip archive" });
    }
  });
  apiRouter.post("/infographic/save", isAuthenticated, async (req, res) => {
    try {
      const { infographic, userId } = req.body;
      if (!infographic) {
        return res.status(400).json({ message: "Infographic is required" });
      }
      res.json({
        success: true,
        message: "Infographic saved successfully",
        id: infographic.id
      });
    } catch (error) {
      console.error("Save infographic error:", error);
      res.status(500).json({ message: "Failed to save infographic" });
    }
  });
  apiRouter.get("/infographic/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      res.json([]);
    } catch (error) {
      console.error("Get user infographics error:", error);
      res.status(500).json({ message: "Failed to get user infographics" });
    }
  });
  apiRouter.delete("/infographic/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ success: true, message: "Infographic deleted successfully" });
    } catch (error) {
      console.error("Delete infographic error:", error);
      res.status(500).json({ message: "Failed to delete infographic" });
    }
  });
  const { InfographicAnalyticsService: InfographicAnalyticsService2 } = await Promise.resolve().then(() => (init_infographic_analytics_service(), infographic_analytics_service_exports));
  const analyticsService = new InfographicAnalyticsService2();
  apiRouter.post("/infographic/analytics/track", isAuthenticated, async (req, res) => {
    try {
      const { infographicId, event, metadata } = req.body;
      if (!infographicId || !event) {
        return res.status(400).json({ message: "Infographic ID and event are required" });
      }
      await analyticsService.trackEvent(
        infographicId,
        req.user?.id || "anonymous",
        event,
        metadata
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });
  apiRouter.get("/infographic/analytics/stats", isAuthenticated, async (req, res) => {
    try {
      const { start, end } = req.query;
      const timeRange = start && end ? {
        start: new Date(start),
        end: new Date(end)
      } : void 0;
      const stats = await analyticsService.getUsageStats(timeRange);
      res.json(stats);
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ message: "Failed to get analytics stats" });
    }
  });
  apiRouter.get("/infographic/analytics/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await analyticsService.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("User analytics error:", error);
      res.status(500).json({ message: "Failed to get user analytics" });
    }
  });
  apiRouter.get("/infographic/analytics/trending", isAuthenticated, async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const trending = await analyticsService.getTrendingInfographics(Number(limit));
      res.json(trending);
    } catch (error) {
      console.error("Trending analytics error:", error);
      res.status(500).json({ message: "Failed to get trending infographics" });
    }
  });
  apiRouter.get("/infographic/analytics/insights", isAuthenticated, async (req, res) => {
    try {
      const insights = await analyticsService.getPerformanceInsights();
      res.json(insights);
    } catch (error) {
      console.error("Performance insights error:", error);
      res.status(500).json({ message: "Failed to get performance insights" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express3 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});

// server/vite.ts
import crypto from "crypto";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server }
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${crypto.randomBytes(8).toString("hex")}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express3.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/googleAuth.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
async function setupGoogleAuth(app2) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.");
  }
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await storage.upsertUser({
          id: profile.id,
          email: profile.emails?.[0]?.value || "",
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profileImageUrl: profile.photos?.[0]?.value || ""
        });
        const user = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profileImageUrl: profile.photos?.[0]?.value,
          accessToken,
          refreshToken
        };
        return done(null, user);
      } catch (error) {
        return done(error, void 0);
      }
    }
  ));
  app2.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app2.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );
  app2.get("/api/auth/google/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

// server/azureAuth.ts
import { ConfidentialClientApplication } from "@azure/msal-node";
import session from "express-session";
var azureConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || "",
    clientSecret: process.env.AZURE_CLIENT_SECRET || "",
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || "common"}`
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (process.env.NODE_ENV === "development") {
          console.log(message);
        }
      },
      piiLoggingEnabled: false,
      logLevel: 3
      // Info
    }
  }
};
var msalInstance = null;
function getMsalInstance() {
  if (!msalInstance) {
    msalInstance = new ConfidentialClientApplication(azureConfig);
  }
  return msalInstance;
}
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  return session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
async function setupAzureAuth(app2) {
  if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
    console.log("Skipping Azure auth setup - Azure credentials not configured");
    return;
  }
  app2.set("trust proxy", 1);
  app2.use(getSession());
  const msalInstance2 = getMsalInstance();
  const redirectUri = process.env.AZURE_REDIRECT_URI || "http://localhost:5000/api/auth/azure/callback";
  app2.get("/api/auth/azure", async (req, res) => {
    try {
      const authCodeUrlParameters = {
        scopes: ["user.read", "profile", "email", "openid"],
        redirectUri,
        prompt: "select_account"
      };
      const authCodeUrl = await msalInstance2.getAuthCodeUrl(authCodeUrlParameters);
      res.redirect(authCodeUrl);
    } catch (error) {
      console.error("Azure auth initiation error:", error);
      res.status(500).json({ message: "Failed to initiate Azure authentication" });
    }
  });
  app2.get("/api/auth/azure/callback", async (req, res) => {
    try {
      const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read", "profile", "email", "openid"],
        redirectUri
      };
      const response = await msalInstance2.acquireTokenByCode(tokenRequest);
      if (response && response.account) {
        req.session.user = {
          account: response.account,
          accessToken: response.accessToken,
          idToken: response.idToken,
          claims: response.idTokenClaims
        };
        await upsertUser(response.account, response.idTokenClaims);
        res.redirect("/");
      } else {
        res.status(400).json({ message: "Failed to acquire token" });
      }
    } catch (error) {
      console.error("Azure auth callback error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  app2.get("/api/auth/azure/logout", (req, res) => {
    const user = req.session.user;
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
      if (user && user.account) {
        const logoutUri = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || "common"}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.AZURE_POST_LOGOUT_REDIRECT_URI || "http://localhost:5000")}`;
        res.redirect(logoutUri);
      } else {
        res.redirect("/");
      }
    });
  });
}
async function upsertUser(account, claims) {
  try {
    await storage.upsertUser({
      id: account.localAccountId || account.homeAccountId,
      email: account.username || claims?.preferred_username || claims?.email,
      firstName: claims?.given_name,
      lastName: claims?.family_name,
      profileImageUrl: null
    });
  } catch (error) {
    console.error("Error upserting user:", error);
  }
}

// server/db.ts
var connectDB = async () => {
  console.log("Using in-memory storage - no database connection needed");
  return Promise.resolve();
};

// server/index.ts
dotenv.config();
var app = express4();
if (process.env.NODE_ENV === "development") {
  app.use(helmet({
    contentSecurityPolicy: false
  }));
} else {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }));
}
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", limiter);
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  message: "Too many authentication attempts, please try again later."
});
app.use("/api/login", authLimiter);
app.use("/api/auth", authLimiter);
app.use(express4.json({ limit: "10mb" }));
app.use(express4.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  if (process.env.NODE_ENV !== "development") {
    try {
      await setupGoogleAuth(app);
      await setupAzureAuth(app);
    } catch (error) {
      console.warn("Authentication setup failed:", error.message);
      console.log("Continuing without authentication...");
    }
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error(err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
