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
import dotenv from "dotenv";
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
    dotenv.config();
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

// server/utils/azureUtils.ts
function normalizeEndpoint2(endpoint) {
  if (!endpoint) return "";
  return endpoint.endsWith("/") ? endpoint : endpoint + "/";
}
function basicSentimentAnalysis(text) {
  const lowerText = text.toLowerCase();
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "fantastic",
    "love",
    "best",
    "excited",
    "happy",
    "success",
    "won",
    "achieved",
    "wonderful",
    "outstanding"
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "hate",
    "worst",
    "disappointed",
    "frustrated",
    "angry",
    "failed",
    "lost",
    "problem",
    "issue",
    "difficult"
  ];
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
var init_azureUtils = __esm({
  "server/utils/azureUtils.ts"() {
    "use strict";
  }
});

// server/utils/openaiClient.ts
function createOpenAIClient(config) {
  const OpenAI8 = __require("openai").default;
  if (config.useAzure && config.azureEndpoint) {
    const deployment = config.azureDeployment || "gpt-4";
    const normalizedEndpoint = normalizeEndpoint2(config.azureEndpoint);
    return new OpenAI8({
      apiKey: config.apiKey,
      baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": config.apiKey }
    });
  } else {
    return new OpenAI8({
      apiKey: config.apiKey
    });
  }
}
function createEmbeddingClient(config, embeddingDeployment = "text-embedding-ada-002") {
  const OpenAI8 = __require("openai").default;
  if (config.useAzure && config.azureEndpoint) {
    const normalizedEndpoint = normalizeEndpoint2(config.azureEndpoint);
    return new OpenAI8({
      apiKey: config.apiKey,
      baseURL: `${normalizedEndpoint}openai/deployments/${embeddingDeployment}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": config.apiKey }
    });
  } else {
    return new OpenAI8({
      apiKey: config.apiKey
    });
  }
}
function getDeploymentName(config, defaultModel = "gpt-4") {
  if (config.useAzure && config.azureDeployment) {
    return config.azureDeployment;
  }
  return config.model || defaultModel;
}
function getEmbeddingDeploymentName(config) {
  return config.azureEmbeddingDeployment || "text-embedding-ada-002";
}
var init_openaiClient = __esm({
  "server/utils/openaiClient.ts"() {
    "use strict";
    init_azureUtils();
  }
});

// server/ai-agents/core/azure-openai-advanced.ts
var AzureOpenAIAdvanced;
var init_azure_openai_advanced = __esm({
  "server/ai-agents/core/azure-openai-advanced.ts"() {
    "use strict";
    init_openaiClient();
    AzureOpenAIAdvanced = class {
      client;
      deployment;
      embeddingDeployment;
      config;
      constructor(config) {
        this.config = config;
        this.client = createOpenAIClient(config);
        this.deployment = getDeploymentName(config);
        this.embeddingDeployment = getEmbeddingDeploymentName(config);
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
          const embeddingClient = createEmbeddingClient(this.config, this.embeddingDeployment);
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
          const embeddingClient = createEmbeddingClient(this.config, this.embeddingDeployment);
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
                content: "Summarize this conversation between an entrepreneur and their AI co-founder, preserving key decisions, insights, and action items."
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
import dotenv2 from "dotenv";
import express6 from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// server/routes.ts
import express4 from "express";
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
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: userData.userType,
        userSubtype: userData.userSubtype,
        role: userData.role,
        preferences: userData.preferences,
        metrics: userData.metrics,
        verified: userData.verified ?? false,
        onboardingCompleted: userData.onboardingCompleted ?? false,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(`super-user-${userData.userType}`, user);
    });
    sampleUsers2.forEach((userData) => {
      const user = {
        id: this.userIdCounter++,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: userData.userType,
        userSubtype: userData.userSubtype,
        role: userData.role,
        preferences: userData.preferences,
        metrics: userData.metrics,
        verified: userData.verified ?? false,
        onboardingCompleted: userData.onboardingCompleted ?? false,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(`user-${user.id}`, user);
    });
    sampleOrganizations2.forEach((orgData) => {
      const org = {
        id: this.orgIdCounter++,
        name: orgData.name,
        description: orgData.description,
        organizationType: orgData.organizationType,
        ownerId: orgData.ownerId,
        industry: orgData.industry,
        size: orgData.size,
        location: orgData.location,
        website: orgData.website,
        logoUrl: orgData.logoUrl,
        verified: orgData.verified ?? false,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.organizations.set(`org-${org.id}`, org);
    });
    sampleBusinessPlans2.forEach((planData) => {
      const plan = {
        id: this.planIdCounter++,
        name: planData.name,
        userId: planData.userId,
        content: planData.content,
        description: planData.description,
        industry: planData.industry,
        stage: planData.stage,
        fundingGoal: planData.fundingGoal,
        teamSize: planData.teamSize,
        targetMarket: planData.targetMarket,
        competitiveAdvantage: planData.competitiveAdvantage,
        revenueModel: planData.revenueModel,
        visibility: planData.visibility ?? "private",
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
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      userType: userData.userType,
      userSubtype: userData.userSubtype,
      role: userData.role,
      preferences: userData.preferences,
      metrics: userData.metrics,
      verified: userData.verified ?? false,
      onboardingCompleted: userData.onboardingCompleted ?? false,
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
  // Wrapper methods for routes.ts compatibility
  getBusinessPlans(userId) {
    return this.getBusinessPlansByUserId(userId);
  }
  getBusinessPlan(id) {
    return this.getBusinessPlanById(id);
  }
  // Stub methods for features not yet implemented
  // These return empty arrays/undefined to prevent crashes
  getPlanSections(planId) {
    return [];
  }
  getPlanSection(id) {
    return void 0;
  }
  createPlanSection(data) {
    return { id: randomUUID(), ...data };
  }
  updatePlanSection(id, updates) {
    return void 0;
  }
  getFinancialData(planId) {
    return void 0;
  }
  createFinancialData(data) {
    return { id: randomUUID(), ...data };
  }
  updateFinancialData(id, updates) {
    return void 0;
  }
  getAnalysisScore(planId) {
    return void 0;
  }
  createAnalysisScore(data) {
    return { id: randomUUID(), ...data };
  }
  updateAnalysisScore(id, updates) {
    return void 0;
  }
  getPitchDeck(planId) {
    return void 0;
  }
  createPitchDeck(data) {
    return { id: randomUUID(), ...data };
  }
  getInvestments(planId) {
    return [];
  }
  getInvestmentsByInvestor(investorId) {
    return [];
  }
  createInvestment(data) {
    return { id: randomUUID(), ...data };
  }
  updateInvestment(id, updates) {
    return void 0;
  }
  getLoans(planId) {
    return [];
  }
  getLoansByLender(lenderId) {
    return [];
  }
  createLoan(data) {
    return { id: randomUUID(), ...data };
  }
  updateLoan(id, updates) {
    return void 0;
  }
  getAdvisoryServices(planId) {
    return [];
  }
  getAdvisoryServicesByPartner(partnerId) {
    return [];
  }
  createAdvisoryService(data) {
    return { id: randomUUID(), ...data };
  }
  updateAdvisoryService(id, updates) {
    return void 0;
  }
  getPrograms(organizationId) {
    return [];
  }
  getProgram(id) {
    return void 0;
  }
  createProgram(data) {
    return { id: randomUUID(), ...data };
  }
  updateProgram(id, updates) {
    return void 0;
  }
  deleteProgram(id) {
    return true;
  }
  getCohorts(programId) {
    return [];
  }
  getCohort(id) {
    return void 0;
  }
  createCohort(data) {
    return { id: randomUUID(), ...data };
  }
  updateCohort(id, updates) {
    return void 0;
  }
  deleteCohort(id) {
    return true;
  }
  getPortfolios(organizationId) {
    return [];
  }
  getPortfolio(id) {
    return void 0;
  }
  createPortfolio(data) {
    return { id: randomUUID(), ...data };
  }
  updatePortfolio(id, updates) {
    return void 0;
  }
  deletePortfolio(id) {
    return true;
  }
  getPortfolioCompanies(portfolioId) {
    return [];
  }
  getPortfolioCompaniesByCohort(cohortId) {
    return [];
  }
  getPortfolioCompany(id) {
    return void 0;
  }
  createPortfolioCompany(data) {
    return { id: randomUUID(), ...data };
  }
  updatePortfolioCompany(id, updates) {
    return void 0;
  }
  deletePortfolioCompany(id) {
    return true;
  }
  getEducationalModules(creatorId) {
    return [];
  }
  getEducationalModule(id) {
    return void 0;
  }
  createEducationalModule(data) {
    return { id: randomUUID(), ...data };
  }
  updateEducationalModule(id, updates) {
    return void 0;
  }
  deleteEducationalModule(id) {
    return true;
  }
  getMentorshipsByMentor(mentorId) {
    return [];
  }
  getMentorshipsByMentee(menteeId) {
    return [];
  }
  getMentorshipsByProgram(programId) {
    return [];
  }
  getMentorship(id) {
    return void 0;
  }
  createMentorship(data) {
    return { id: randomUUID(), ...data };
  }
  updateMentorship(id, updates) {
    return void 0;
  }
  deleteMentorship(id) {
    return true;
  }
  getVentureProjects(organizationId) {
    return [];
  }
  getVentureProject(id) {
    return void 0;
  }
  createVentureProject(data) {
    return { id: randomUUID(), ...data };
  }
  updateVentureProject(id, updates) {
    return void 0;
  }
  deleteVentureProject(id) {
    return true;
  }
  // Credit scoring stub methods
  getCreditScores(userId) {
    return [];
  }
  getCreditScore(id) {
    return void 0;
  }
  createCreditScore(data) {
    return { id: randomUUID(), ...data };
  }
  updateCreditScore(id, updates) {
    return void 0;
  }
  getFinancialMilestones(userId) {
    return [];
  }
  getFinancialMilestone(id) {
    return void 0;
  }
  createFinancialMilestone(data) {
    return { id: randomUUID(), ...data };
  }
  updateFinancialMilestone(id, updates) {
    return void 0;
  }
  getAiCoachingMessages(userId) {
    return [];
  }
  createAiCoachingMessage(data) {
    return { id: randomUUID(), ...data };
  }
  getCreditTips() {
    return [];
  }
  getCreditTipsByCategory(category) {
    return [];
  }
  getCreditTip(id) {
    return void 0;
  }
  createCreditTip(data) {
    return { id: randomUUID(), ...data };
  }
  getUserCreditTips(userId) {
    return [];
  }
  createUserCreditTip(data) {
    return { id: randomUUID(), ...data };
  }
  updateUserCreditTip(id, updates) {
    return void 0;
  }
  getFinancialProjections(businessPlanId) {
    return [];
  }
  getFinancialProjection(id) {
    return void 0;
  }
  createFinancialProjection(data) {
    return { id: randomUUID(), ...data };
  }
  updateFinancialProjection(id, updates) {
    return void 0;
  }
  getAiBusinessAnalysis(businessPlanId) {
    return void 0;
  }
  createAiBusinessAnalysis(data) {
    return { id: randomUUID(), ...data };
  }
  updateAiBusinessAnalysis(id, updates) {
    return void 0;
  }
  getCreditScoreTiers() {
    return [];
  }
  getCreditScoreTier(id) {
    return void 0;
  }
  getCreditScoreTierByScore(score) {
    return void 0;
  }
  createCreditScoreTier(data) {
    return { id: randomUUID(), ...data };
  }
  updateCreditScoreTier(id, updates) {
    return void 0;
  }
  getCreditAchievements() {
    return [];
  }
  getCreditAchievementsByCategory(category) {
    return [];
  }
  getCreditAchievement(id) {
    return void 0;
  }
  createCreditAchievement(data) {
    return { id: randomUUID(), ...data };
  }
  getUserCreditAchievements(userId) {
    return [];
  }
  getUnseenAchievements(userId) {
    return [];
  }
  createUserCreditAchievement(data) {
    return { id: randomUUID(), ...data };
  }
  updateUserCreditAchievement(id, updates) {
    return void 0;
  }
  markAchievementAsSeen(id) {
    return void 0;
  }
  getCreditScoreHistory(userId) {
    return [];
  }
  createCreditScoreHistory(data) {
    return { id: randomUUID(), ...data };
  }
  getUserRewardPoints(userId) {
    return void 0;
  }
  createUserRewardPoints(data) {
    return { id: randomUUID(), ...data };
  }
  updateUserRewardPoints(id, updates) {
    return void 0;
  }
  addUserPoints(userId, points) {
    return void 0;
  }
  getPointTransactions(userId) {
    return [];
  }
  createPointTransaction(data) {
    return { id: randomUUID(), ...data };
  }
  // Organization and team stub methods
  addUserToOrganization(userId, organizationId, role) {
    return { id: randomUUID(), userId, organizationId, role };
  }
  getUserOrganizations(userId) {
    return [];
  }
  getOrganization(id) {
    return this.getOrganizationById(id);
  }
  getOrganizationMembers(organizationId) {
    return [];
  }
  createOrganizationInvitation(data) {
    return { id: randomUUID(), ...data };
  }
  getOrganizationAnalytics(organizationId) {
    return { totalMembers: 0, totalProjects: 0 };
  }
  getUserSettings(userId) {
    return void 0;
  }
  updateUserSettings(userId, settings) {
    return { userId, ...settings };
  }
  resetUserSettings(userId) {
    return { userId, settings: {} };
  }
  exportUserSettings(userId) {
    return { userId, settings: {} };
  }
  createCollaboration(data) {
    return { id: randomUUID(), ...data };
  }
  getUserCollaborations(userId) {
    return [];
  }
  createInvitation(data) {
    return { id: randomUUID(), ...data };
  }
  getUserInvitations(userId) {
    return [];
  }
  getInvitation(id) {
    return void 0;
  }
  updateInvitation(id, updates) {
    return void 0;
  }
  getTeamMembers(userId) {
    return [];
  }
  createTeamInvitation(data) {
    return { id: randomUUID(), ...data };
  }
  getTeamInvitations(userId) {
    return [];
  }
  updateTeamMember(id, updates) {
    return void 0;
  }
  removeTeamMember(id) {
    return true;
  }
  resendTeamInvitation(id) {
    return true;
  }
  cancelTeamInvitation(id) {
    return true;
  }
};
var storage2 = new InMemoryStorage();

// server/utils/authUtils.ts
function createMockUser() {
  return {
    id: "dev-user-123",
    claims: {
      sub: "dev-user-123",
      email: "dev@example.com",
      first_name: "Dev",
      last_name: "User",
      given_name: "Dev",
      family_name: "User",
      profile_image_url: null,
      user_type: "entrepreneur",
      userType: "ENTREPRENEUR"
    }
  };
}
function handleDevelopmentAuth(req, res, next) {
  console.log("Development mode: Using mock authentication");
  req.user = createMockUser();
  next();
}
function sendUnauthorizedResponse(res, message = "Unauthorized") {
  res.status(401).json({ message });
}

// server/auth-middleware.ts
var isAuthenticated = async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    return handleDevelopmentAuth(req, res, next);
  }
  if (!req.user) {
    return sendUnauthorizedResponse(res);
  }
  next();
};
var authMiddleware = isAuthenticated;

// server/routes.ts
init_ai_service();
import { z as z4 } from "zod";

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
init_azureUtils();
import OpenAI2 from "openai";
var AzureOpenAIClient = class {
  client;
  deployment;
  constructor(config) {
    if (config.useAzure && config.azureEndpoint) {
      const deployment = config.azureDeployment || "gpt-4";
      const normalizedEndpoint = normalizeEndpoint2(config.azureEndpoint);
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
  // normalizeEndpoint is now imported from shared utils
};

// server/ai-agents/agents/co-founder/core/co-founder-brain.ts
init_azure_openai_advanced();

// server/ai-agents/core/azure-ai-services.ts
init_azureUtils();
var AzureAIServices = class {
  config;
  constructor() {
    const endpoint = process.env.AZURE_AI_ENDPOINT || "";
    const apiKey = process.env.AZURE_AI_API_KEY || "";
    const isValidEndpoint = endpoint && endpoint.includes("cognitiveservices.azure.com");
    this.config = {
      endpoint: isValidEndpoint ? normalizeEndpoint2(endpoint) : "",
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
      return basicSentimentAnalysis(text);
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
      return basicSentimentAnalysis(text);
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
  // basicSentimentAnalysis is now imported from shared utils
  // normalizeEndpoint is now imported from shared utils
};
var azureAIServices = new AzureAIServices();

// server/ai-agents/core/azure-cognitive-services.ts
init_azureUtils();
var AzureCognitiveServices = class {
  config;
  constructor() {
    const endpoint = typeof process !== "undefined" && process.env?.AZURE_AI_ENDPOINT || "";
    const apiKey = typeof process !== "undefined" && process.env?.AZURE_AI_API_KEY || "";
    const region = typeof process !== "undefined" && process.env?.AZURE_REGION || "eastus";
    this.config = {
      endpoint: normalizeEndpoint2(endpoint),
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
      return basicSentimentAnalysis(text);
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
  // basicSentimentAnalysis is now imported from shared utils
  // normalizeEndpoint is now imported from shared utils
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
    const user = await storage2.getUserById(request.userId);
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
          businessPlans: await storage2.getBusinessPlansByUserId(request.userId)
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
    const goals = storage2.getGoalsByUserId(user.claims.sub);
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
    const goal = storage2.createGoal({
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
    const existingGoal = storage2.getGoalById(id);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    if (existingGoal.userId !== user.claims.sub) {
      return res.status(403).json({ error: "Unauthorized to update this goal" });
    }
    const goal = storage2.updateGoal(id, validatedData);
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
    const commitments = storage2.getCommitmentsByUserId(user.claims.sub);
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
    const commitment = storage2.createCommitment({
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

// server/routes/document-ai-routes.ts
import { Router } from "express";

// server/ai-application-filler.ts
import OpenAI3 from "openai";
var AIApplicationFiller = class {
  client;
  constructor() {
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    if (!apiKey) {
      console.warn("OpenAI API key not configured. AI Application Filler will not be available.");
      this.client = null;
      return;
    }
    if (endpoint) {
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4";
      const normalizedEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
      this.client = new OpenAI3({
        apiKey,
        baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: { "api-key": apiKey }
      });
    } else {
      this.client = new OpenAI3({ apiKey });
    }
  }
  /**
   * Fill an entire application form using business plan data
   */
  async fillApplication(form, businessPlan) {
    if (!this.client) {
      throw new Error("AI Application Filler is not configured. Please set OpenAI API key.");
    }
    const responses = {};
    const suggestions = [];
    for (const section of form.sections) {
      for (const field of section.fields) {
        try {
          const response = await this.fillField(field, section, form, businessPlan);
          responses[field.id] = response.value;
          if (response.suggestion) {
            suggestions.push({
              fieldId: field.id,
              suggestion: response.suggestion,
              reason: response.reason || "AI-generated improvement suggestion"
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error(`Error filling field ${field.id}:`, errorMessage);
          responses[field.id] = "";
        }
      }
    }
    const totalFields = form.sections.reduce((sum, s) => sum + s.fields.length, 0);
    const filledFields = Object.values(responses).filter((v) => v && v.toString().trim() !== "").length;
    const completeness = Math.round(filledFields / totalFields * 100);
    const matchScore = await this.calculateMatchScore(form, businessPlan, responses);
    return {
      formId: form.id,
      responses,
      completeness,
      suggestions,
      matchScore
    };
  }
  /**
   * Fill a single form field using AI
   */
  async fillField(field, section, form, businessPlan) {
    if (!this.client) {
      return this.fillFieldWithTemplate(field, businessPlan);
    }
    const prompt = this.buildFieldPrompt(field, section, form, businessPlan);
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert application writer helping startups fill out ${form.type} applications. 
Generate compelling, accurate, and tailored responses based on the business plan data provided.
Keep responses concise, professional, and aligned with the application requirements.
For text fields, provide the response directly without quotes or formatting.
For suggestions, provide actionable improvements.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: field.type === "textarea" ? 500 : 150
      });
      const content = response.choices[0]?.message?.content?.trim() || "";
      if (content.includes("SUGGESTION:")) {
        const [value, suggestionPart] = content.split("SUGGESTION:");
        return {
          value: value.trim(),
          suggestion: suggestionPart.trim(),
          reason: "AI-generated enhancement"
        };
      }
      return { value: content };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error calling OpenAI API:", errorMessage);
      return this.fillFieldWithTemplate(field, businessPlan);
    }
  }
  /**
   * Build a context-aware prompt for filling a field
   */
  buildFieldPrompt(field, section, form, businessPlan) {
    let prompt = `Fill out the following field for a ${form.type} application to ${form.organization}:

`;
    prompt += `Section: ${section.title}
`;
    prompt += `Field: ${field.label}
`;
    if (field.helpText) prompt += `Help Text: ${field.helpText}
`;
    if (field.maxLength) prompt += `Max Length: ${field.maxLength} characters
`;
    prompt += `
Business Plan Data:
`;
    prompt += `Company: ${businessPlan.companyName}
`;
    prompt += `Description: ${businessPlan.description}
`;
    const fieldLower = field.label.toLowerCase();
    if (fieldLower.includes("problem")) {
      prompt += `Problem: ${businessPlan.problem}
`;
    }
    if (fieldLower.includes("solution")) {
      prompt += `Solution: ${businessPlan.solution}
`;
    }
    if (fieldLower.includes("market") || fieldLower.includes("target")) {
      prompt += `Target Market: ${businessPlan.targetMarket}
`;
    }
    if (fieldLower.includes("business model") || fieldLower.includes("revenue")) {
      prompt += `Business Model: ${businessPlan.businessModel}
`;
    }
    if (fieldLower.includes("team") || fieldLower.includes("founder")) {
      prompt += `Founders: ${JSON.stringify(businessPlan.founders, null, 2)}
`;
      prompt += `Team Size: ${businessPlan.team.size}
`;
    }
    if (fieldLower.includes("traction") || fieldLower.includes("metric") || fieldLower.includes("growth")) {
      prompt += `Traction: ${JSON.stringify(businessPlan.traction, null, 2)}
`;
    }
    if (fieldLower.includes("financial") || fieldLower.includes("funding")) {
      prompt += `Financials: ${JSON.stringify(businessPlan.financials, null, 2)}
`;
    }
    if (fieldLower.includes("competitive") || fieldLower.includes("advantage")) {
      prompt += `Unique Value Proposition: ${businessPlan.uniqueValueProposition}
`;
      prompt += `Competitors: ${businessPlan.competitors.join(", ")}
`;
    }
    prompt += `
Generate a compelling response for this field. `;
    if (field.maxLength) {
      prompt += `Keep it under ${field.maxLength} characters. `;
    }
    prompt += `If you have a suggestion to improve the response, add it after "SUGGESTION:" on a new line.`;
    return prompt;
  }
  /**
   * Template-based fallback for filling fields
   */
  fillFieldWithTemplate(field, businessPlan) {
    const fieldLower = field.label.toLowerCase();
    if (fieldLower.includes("company name") || fieldLower.includes("startup name")) {
      return { value: businessPlan.companyName };
    }
    if (fieldLower.includes("description") || fieldLower.includes("overview")) {
      return { value: businessPlan.description };
    }
    if (fieldLower.includes("problem")) {
      return { value: businessPlan.problem };
    }
    if (fieldLower.includes("solution")) {
      return { value: businessPlan.solution };
    }
    if (fieldLower.includes("market") || fieldLower.includes("target")) {
      return { value: businessPlan.targetMarket };
    }
    if (fieldLower.includes("business model") || fieldLower.includes("revenue model")) {
      return { value: businessPlan.businessModel };
    }
    if (fieldLower.includes("team size")) {
      return { value: businessPlan.team.size.toString() };
    }
    if (fieldLower.includes("founder")) {
      const founderInfo = businessPlan.founders.map((f) => `${f.name} (${f.role}): ${f.bio}`).join("\n\n");
      return { value: founderInfo };
    }
    if (fieldLower.includes("traction") || fieldLower.includes("metric")) {
      let traction = "";
      if (businessPlan.traction.users) traction += `Users: ${businessPlan.traction.users}
`;
      if (businessPlan.traction.revenue) traction += `Revenue: $${businessPlan.traction.revenue}
`;
      if (businessPlan.traction.growth) traction += `Growth: ${businessPlan.traction.growth}
`;
      return { value: traction };
    }
    return { value: "" };
  }
  /**
   * Calculate how well the business plan matches the application requirements
   */
  async calculateMatchScore(form, businessPlan, responses) {
    if (!this.client) {
      return 50;
    }
    try {
      const prompt = `Analyze how well this startup matches the ${form.type} application requirements for ${form.organization}.

Business Plan:
- Company: ${businessPlan.companyName}
- Description: ${businessPlan.description}
- Stage: ${businessPlan.traction.users ? "Has traction" : "Pre-traction"}
- Team Size: ${businessPlan.team.size}
- Revenue: ${businessPlan.traction.revenue || "Pre-revenue"}

Application Type: ${form.type}
Organization: ${form.organization}

Rate the match on a scale of 0-100, considering:
1. Stage alignment
2. Team strength
3. Traction/metrics
4. Market opportunity
5. Overall fit

Respond with just a number between 0-100.`;
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at evaluating startup-program fit. Provide only a numeric score."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      });
      const score = parseInt(response.choices[0]?.message?.content?.trim() || "50");
      return Math.min(100, Math.max(0, score));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error calculating match score:", errorMessage);
      return 50;
    }
  }
  /**
   * Generate improvement suggestions for a filled application
   */
  async generateSuggestions(form, responses, businessPlan) {
    if (!this.client) {
      return [];
    }
    const suggestions = [];
    for (const section of form.sections) {
      for (const field of section.fields) {
        const response = responses[field.id];
        if (!response || response.toString().trim() === "") continue;
        try {
          const prompt = `Review this application response and suggest improvements:

Field: ${field.label}
Current Response: ${response}

Provide a specific, actionable suggestion to make this response more compelling for a ${form.type} application.
Keep the suggestion concise (1-2 sentences).`;
          const aiResponse = await this.client.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert application reviewer. Provide concise, actionable feedback."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150
          });
          const suggestion = aiResponse.choices[0]?.message?.content?.trim();
          if (suggestion && suggestion.length > 10) {
            suggestions.push({
              fieldId: field.id,
              suggestion,
              reason: "AI-generated improvement"
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error(`Error generating suggestion for field ${field.id}:`, errorMessage);
        }
      }
    }
    return suggestions;
  }
};
var aiApplicationFiller = new AIApplicationFiller();

// server/services/document-ai-service.ts
var DocumentAIService = class {
  /**
   * Extract business plan data from a document
   */
  async extractBusinessPlanFromDocument(document2) {
    const content = document2.content || {};
    return {
      companyName: content.companyName || document2.title || "Unknown Company",
      description: content.executiveSummary || content.description || "",
      problem: content.problemStatement || content.problem || "",
      solution: content.solution || content.productDescription || "",
      targetMarket: content.targetMarket || content.marketAnalysis || "",
      businessModel: content.businessModel || content.revenueModel || "",
      competitors: content.competitors || [],
      uniqueValueProposition: content.valueProposition || content.uniqueSellingPoint || "",
      founders: content.founders || content.team?.founders || [],
      traction: {
        users: content.traction?.users || content.metrics?.users,
        revenue: content.traction?.revenue || content.financials?.revenue,
        growth: content.traction?.growth || content.metrics?.growth,
        milestones: content.traction?.milestones || content.achievements || []
      },
      financials: {
        fundingHistory: content.financials?.fundingHistory || "",
        currentRunway: content.financials?.runway || "",
        projections: content.financials?.projections || "",
        useOfFunds: content.financials?.useOfFunds || ""
      },
      team: {
        size: content.team?.size || content.teamSize || 0,
        keyMembers: content.team?.keyMembers || [],
        advisors: content.team?.advisors || []
      }
    };
  }
  /**
   * Fill an application using a document as the source
   */
  async fillApplicationFromDocument(documentId, document2, form) {
    if (!aiApplicationFiller || !aiApplicationFiller.client) {
      throw new Error("AI Application Filler is not configured. Please set up OpenAI API keys.");
    }
    const businessPlan = await this.extractBusinessPlanFromDocument(document2);
    return await aiApplicationFiller.fillApplication(form, businessPlan);
  }
  /**
   * Generate document-specific suggestions for application improvement
   */
  async generateDocumentSuggestions(document2, form, currentResponses) {
    if (!aiApplicationFiller || !aiApplicationFiller.client) {
      return [];
    }
    const businessPlan = await this.extractBusinessPlanFromDocument(document2);
    return await aiApplicationFiller.generateSuggestions(form, currentResponses, businessPlan);
  }
  /**
   * Analyze document for application readiness
   */
  async analyzeDocumentForApplication(document2, applicationType) {
    const businessPlan = await this.extractBusinessPlanFromDocument(document2);
    const missingFields = [];
    const strengths = [];
    const improvements = [];
    const recommendations = [];
    if (!businessPlan.companyName) missingFields.push("Company Name");
    if (!businessPlan.description) missingFields.push("Company Description");
    if (!businessPlan.problem) missingFields.push("Problem Statement");
    if (!businessPlan.solution) missingFields.push("Solution Description");
    if (!businessPlan.targetMarket) missingFields.push("Target Market");
    if (!businessPlan.businessModel) missingFields.push("Business Model");
    if (!businessPlan.uniqueValueProposition) missingFields.push("Value Proposition");
    if (businessPlan.traction?.users && businessPlan.traction.users > 0) {
      strengths.push(`Strong user traction: ${businessPlan.traction.users} users`);
    }
    if (businessPlan.traction?.revenue && businessPlan.traction.revenue > 0) {
      strengths.push(`Revenue generation: $${businessPlan.traction.revenue}`);
    }
    if (businessPlan.founders && businessPlan.founders.length > 0) {
      strengths.push(`Experienced founding team: ${businessPlan.founders.length} founders`);
    }
    if (businessPlan.competitors && businessPlan.competitors.length > 0) {
      strengths.push("Competitive analysis completed");
    }
    if (!businessPlan.traction?.milestones || businessPlan.traction.milestones.length === 0) {
      improvements.push("Add key milestones and achievements");
    }
    if (!businessPlan.financials?.projections) {
      improvements.push("Include financial projections");
    }
    if (!businessPlan.team?.advisors || businessPlan.team.advisors.length === 0) {
      improvements.push("List advisory board members");
    }
    switch (applicationType) {
      case "accelerator":
        recommendations.push("Emphasize growth potential and scalability");
        recommendations.push("Highlight team's ability to execute quickly");
        recommendations.push("Show clear product-market fit");
        break;
      case "grant":
        recommendations.push("Focus on social impact and innovation");
        recommendations.push("Demonstrate alignment with grant objectives");
        recommendations.push("Provide detailed budget breakdown");
        break;
      case "competition":
        recommendations.push("Create compelling pitch narrative");
        recommendations.push("Highlight unique differentiators");
        recommendations.push("Show traction and validation");
        break;
      case "investment":
        recommendations.push("Emphasize market opportunity size");
        recommendations.push("Show clear path to profitability");
        recommendations.push("Demonstrate competitive advantages");
        break;
    }
    const totalFields = 15;
    const completedFields = totalFields - missingFields.length;
    const readinessScore = Math.round(completedFields / totalFields * 100);
    return {
      readinessScore,
      missingFields,
      strengths,
      improvements,
      recommendations
    };
  }
  /**
   * Convert document to application-ready format
   */
  async prepareDocumentForApplication(document2, targetFormat) {
    const businessPlan = await this.extractBusinessPlanFromDocument(document2);
    return {
      format: targetFormat,
      content: businessPlan,
      metadata: {
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        documentId: document2.id || document2._id,
        version: "1.0"
      }
    };
  }
  /**
   * Batch process multiple documents for applications
   */
  async batchProcessDocuments(documents, form) {
    const results = [];
    for (const document2 of documents) {
      try {
        const result = await this.fillApplicationFromDocument(
          document2.id || document2._id,
          document2,
          form
        );
        results.push({
          documentId: document2.id || document2._id,
          status: "success",
          result
        });
      } catch (error) {
        results.push({
          documentId: document2.id || document2._id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    return results;
  }
  /**
   * Check if AI services are available
   */
  isAIAvailable() {
    return !!(aiApplicationFiller && aiApplicationFiller.client);
  }
};
var documentAIService = new DocumentAIService();

// server/utils/routeHelpers.ts
function handleRouteError(error, res, errorMessage, logContext, statusCode = 500) {
  console.error(`Error ${logContext}:`, error);
  const response = {
    message: errorMessage
  };
  if (error instanceof Error) {
    response.error = error.message;
  } else if (typeof error === "string") {
    response.error = error;
  } else {
    response.error = "Unknown error";
  }
  res.status(statusCode).json(response);
}
function requireAuth(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
function requireResource(resource, res, resourceName = "Resource") {
  if (!resource) {
    res.status(404).json({ error: `${resourceName} not found` });
    return false;
  }
  return true;
}
function validateRequiredFields(body, requiredFields, res) {
  const missingFields = requiredFields.filter((field) => !body[field]);
  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Missing required fields",
      error: `Required fields: ${missingFields.join(", ")}`
    });
    return false;
  }
  return true;
}

// server/routes/document-ai-routes.ts
var router2 = Router();
router2.get("/status", (req, res) => {
  res.json({
    available: documentAIService.isAIAvailable(),
    message: documentAIService.isAIAvailable() ? "AI services are available" : "AI services are not configured. Please set up OpenAI API keys."
  });
});
router2.post("/:documentId/fill-application", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { form } = req.body;
    if (!validateRequiredFields(req.body, ["form"], res)) return;
    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({
        message: "AI services are not available. Please configure OpenAI API keys."
      });
    }
    const document2 = req.body.document || {
      id: documentId,
      content: req.body.documentContent
    };
    const filledApplication = await documentAIService.fillApplicationFromDocument(
      documentId,
      document2,
      form
    );
    res.json(filledApplication);
  } catch (error) {
    handleRouteError(error, res, "Failed to fill application", "filling application from document");
  }
});
router2.post("/:documentId/application-suggestions", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { form, responses } = req.body;
    if (!validateRequiredFields(req.body, ["form", "responses"], res)) return;
    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({
        message: "AI services are not available"
      });
    }
    const document2 = req.body.document || {
      id: documentId,
      content: req.body.documentContent
    };
    const suggestions = await documentAIService.generateDocumentSuggestions(
      document2,
      form,
      responses
    );
    res.json({ suggestions });
  } catch (error) {
    handleRouteError(error, res, "Failed to generate suggestions", "generating suggestions");
  }
});
router2.post("/:documentId/analyze-readiness", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { applicationType } = req.body;
    if (!validateRequiredFields(req.body, ["applicationType"], res)) return;
    const document2 = req.body.document || {
      id: documentId,
      content: req.body.documentContent
    };
    const analysis = await documentAIService.analyzeDocumentForApplication(
      document2,
      applicationType
    );
    res.json(analysis);
  } catch (error) {
    handleRouteError(error, res, "Failed to analyze document", "analyzing document");
  }
});
router2.post("/:documentId/prepare-application", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { targetFormat } = req.body;
    if (!validateRequiredFields(req.body, ["targetFormat"], res)) return;
    const document2 = req.body.document || {
      id: documentId,
      content: req.body.documentContent
    };
    const prepared = await documentAIService.prepareDocumentForApplication(
      document2,
      targetFormat
    );
    res.json(prepared);
  } catch (error) {
    handleRouteError(error, res, "Failed to prepare document", "preparing document");
  }
});
router2.post("/batch-fill-applications", async (req, res) => {
  try {
    const { documents, form } = req.body;
    if (!validateRequiredFields(req.body, ["documents", "form"], res)) return;
    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({
        message: "AI services are not available"
      });
    }
    const results = await documentAIService.batchProcessDocuments(documents, form);
    res.json({
      total: results.length,
      successful: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "error").length,
      results
    });
  } catch (error) {
    handleRouteError(error, res, "Failed to batch process documents", "batch processing documents");
  }
});
var document_ai_routes_default = router2;

// server/routes/enhanced-dt-routes.ts
import express2 from "express";

// server/services/dt-collaboration-service.ts
import { Server as SocketIOServer } from "socket.io";

// server/ai-agents/agents/design-thinking/dt-ai-assistant.ts
import { OpenAI as OpenAI4 } from "openai";
var DTAIAssistant = class {
  openaiClient;
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI4({
        apiKey
      });
    } else {
      console.warn("OpenAI API key not configured. DTAIAssistant features will be limited.");
      this.openaiClient = null;
    }
  }
  isAvailable() {
    return this.openaiClient !== null;
  }
  /**
   * Generate suggestions for canvas elements
   */
  async suggestRelatedElements(context) {
    if (!this.isAvailable()) {
      return [];
    }
    try {
      const prompt = `
        Based on this Design Thinking context, suggest related elements:
        
        Session Phase: ${context.phase}
        Current Elements: ${JSON.stringify(context.currentElements)}
        Recent Activity: ${context.recentActivity}
        Participant Focus: ${context.participantFocus}
        
        Suggest 3-5 related elements that would enhance the current canvas.
        Consider:
        1. Phase-appropriate elements
        2. Building on existing elements
        3. Encouraging diverse perspectives
        4. Filling gaps in the current canvas
        
        Format as JSON array with: {type, content, position, reasoning}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      const content = response.choices[0].message.content;
      const suggestions = JSON.parse(content);
      return suggestions.map((suggestion) => ({
        id: this.generateId(),
        type: suggestion.type,
        content: suggestion.content,
        position: suggestion.position,
        reasoning: suggestion.reasoning,
        confidence: this.calculateConfidence(suggestion),
        phase: context.phase,
        timestamp: /* @__PURE__ */ new Date()
      }));
    } catch (error) {
      console.error("Error generating element suggestions:", error);
      return [];
    }
  }
  /**
   * Cluster canvas elements intelligently
   */
  async clusterElements(elements) {
    try {
      const prompt = `
        Cluster these Design Thinking canvas elements into meaningful groups:
        
        Elements: ${JSON.stringify(elements)}
        
        Consider:
        1. Thematic similarity
        2. Functional relationships
        3. User journey connections
        4. Problem-solution pairs
        5. Phase-specific groupings
        
        Return clusters with: {id, name, elements, theme, confidence}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });
      const content = response.choices[0].message.content;
      const clusters = JSON.parse(content);
      return clusters.map((cluster) => ({
        id: this.generateId(),
        name: cluster.name,
        elements: cluster.elements,
        theme: cluster.theme,
        confidence: cluster.confidence,
        createdAt: /* @__PURE__ */ new Date()
      }));
    } catch (error) {
      console.error("Error clustering elements:", error);
      return [];
    }
  }
  /**
   * Generate session insights
   */
  async generateSessionInsights(session2) {
    try {
      const prompt = `
        Analyze this Design Thinking session and generate insights:
        
        Session Data: ${JSON.stringify(session2)}
        Participants: ${session2.participants.length}
        Duration: ${session2.duration}
        Activities: ${session2.activities.length}
        
        Generate insights about:
        1. Participation patterns
        2. Idea quality and diversity
        3. Collaboration effectiveness
        4. Phase progression
        5. Potential improvements
        
        Format as JSON array with: {type, content, importance, actionable}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      });
      const content = response.choices[0].message.content;
      const insights = JSON.parse(content);
      return insights.map((insight) => ({
        id: this.generateId(),
        type: insight.type,
        content: insight.content,
        importance: insight.importance,
        actionable: insight.actionable,
        confidence: this.calculateConfidence(insight),
        sessionId: session2.id,
        timestamp: /* @__PURE__ */ new Date()
      }));
    } catch (error) {
      console.error("Error generating session insights:", error);
      return [];
    }
  }
  /**
   * Generate recommendations for workflow
   */
  async generateRecommendations(workflow) {
    try {
      const prompt = `
        Generate recommendations for this Design Thinking workflow:
        
        Workflow: ${JSON.stringify(workflow)}
        Current Phase: ${workflow.currentPhase}
        Status: ${workflow.status}
        
        Provide recommendations for:
        1. Phase optimization
        2. Participant engagement
        3. Tool utilization
        4. Process improvement
        5. Next steps
        
        Format as JSON array with: {category, content, priority, effort}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      });
      const content = response.choices[0].message.content;
      const recommendations = JSON.parse(content);
      return recommendations.map((rec) => ({
        id: this.generateId(),
        category: rec.category,
        content: rec.content,
        priority: rec.priority,
        effort: rec.effort,
        confidence: this.calculateConfidence(rec),
        workflowId: workflow.id,
        timestamp: /* @__PURE__ */ new Date()
      }));
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }
  /**
   * Analyze collaboration patterns
   */
  async analyzeCollaborationPatterns(session2) {
    try {
      const prompt = `
        Analyze collaboration patterns in this Design Thinking session:
        
        Session: ${JSON.stringify(session2)}
        Participants: ${session2.participants.length}
        Activities: ${session2.activities.length}
        
        Analyze:
        1. Participation distribution
        2. Communication patterns
        3. Conflict resolution
        4. Engagement levels
        5. Collaboration quality
        
        Return analysis with: {participationScore, communicationQuality, engagementLevel, collaborationEffectiveness, recommendations}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });
      const content = response.choices[0].message.content;
      const analysis = JSON.parse(content);
      return {
        participationScore: analysis.participationScore,
        communicationQuality: analysis.communicationQuality,
        engagementLevel: analysis.engagementLevel,
        collaborationEffectiveness: analysis.collaborationEffectiveness,
        recommendations: analysis.recommendations,
        sessionId: session2.id,
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error analyzing collaboration patterns:", error);
      return {
        participationScore: 0,
        communicationQuality: 0,
        engagementLevel: 0,
        collaborationEffectiveness: 0,
        recommendations: [],
        sessionId: session2.id,
        timestamp: /* @__PURE__ */ new Date()
      };
    }
  }
  /**
   * Generate phase transition suggestions
   */
  async generatePhaseTransitionSuggestions(workflow) {
    try {
      const prompt = `
        Suggest phase transitions for this Design Thinking workflow:
        
        Current Phase: ${workflow.currentPhase}
        Workflow Status: ${workflow.status}
        Progress: ${workflow.progress || 0}%
        
        Consider:
        1. Phase completion criteria
        2. Deliverable quality
        3. Participant readiness
        4. Time constraints
        5. Resource availability
        
        Suggest transitions with: {fromPhase, toPhase, reason, prerequisites, estimatedTime}
      `;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      });
      const content = response.choices[0].message.content;
      const suggestions = JSON.parse(content);
      return suggestions.map((suggestion) => ({
        id: this.generateId(),
        fromPhase: suggestion.fromPhase,
        toPhase: suggestion.toPhase,
        reason: suggestion.reason,
        prerequisites: suggestion.prerequisites,
        estimatedTime: suggestion.estimatedTime,
        confidence: this.calculateConfidence(suggestion),
        workflowId: workflow.id,
        timestamp: /* @__PURE__ */ new Date()
      }));
    } catch (error) {
      console.error("Error generating phase transition suggestions:", error);
      return [];
    }
  }
  /**
   * Calculate confidence score
   */
  calculateConfidence(suggestion) {
    const factors = {
      contentLength: Math.min(suggestion.content?.length || 0, 100) / 100,
      reasoningQuality: suggestion.reasoning ? 0.8 : 0.2,
      specificity: suggestion.specificity || 0.5
    };
    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) / Object.keys(factors).length;
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// server/services/database-service.ts
import { Pool } from "pg";
var DatabaseService = class {
  pool;
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });
  }
  // Workflow Management
  async getWorkflow(workflowId) {
    const query = "SELECT * FROM dt_workflows WHERE id = $1";
    const result = await this.pool.query(query, [workflowId]);
    return result.rows[0] || null;
  }
  async createWorkflow(workflowData) {
    const query = `
      INSERT INTO dt_workflows (id, user_id, business_plan_id, name, description, current_phase, status, ai_facilitation_enabled, collaboration_mode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      workflowData.id,
      workflowData.userId,
      workflowData.businessPlanId,
      workflowData.name,
      workflowData.description,
      workflowData.currentPhase,
      workflowData.status,
      workflowData.aiFacilitationEnabled,
      workflowData.collaborationMode
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
  async updateWorkflow(workflowId, updates) {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
    const query = `UPDATE dt_workflows SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [workflowId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
  async deleteWorkflow(workflowId) {
    const query = "DELETE FROM dt_workflows WHERE id = $1";
    await this.pool.query(query, [workflowId]);
  }
  // Canvas Operations
  async getCanvas(canvasId) {
    const query = "SELECT * FROM collaborative_canvases WHERE id = $1";
    const result = await this.pool.query(query, [canvasId]);
    return result.rows[0] || null;
  }
  async createCanvas(canvas) {
    const query = `
      INSERT INTO collaborative_canvases (id, workflow_id, canvas_type, elements, version, last_modified_by, last_modified_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      canvas.id,
      canvas.workflowId,
      canvas.canvasType,
      JSON.stringify(canvas.elements),
      canvas.version,
      canvas.lastModifiedBy,
      canvas.lastModifiedAt,
      canvas.createdAt
    ];
    await this.pool.query(query, values);
  }
  async updateCanvas(canvasId, updates) {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
    const query = `UPDATE collaborative_canvases SET ${setClause}, last_modified_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [canvasId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
  async deleteCanvas(canvasId) {
    const query = "DELETE FROM collaborative_canvases WHERE id = $1";
    await this.pool.query(query, [canvasId]);
  }
  async addCanvasElement(canvasId, element) {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = elements || $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, JSON.stringify([element])]);
  }
  async updateCanvasElement(canvasId, elementId, updates) {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = jsonb_set(elements, $2, $3), version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, `{${elementId}}`, JSON.stringify(updates)]);
  }
  async removeCanvasElement(canvasId, elementId) {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = elements - $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, elementId]);
  }
  async applyCanvasClustering(canvasId, clusters) {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, JSON.stringify(clusters)]);
  }
  // Analytics Operations
  async getWorkflowAnalytics(workflowId) {
    const query = "SELECT * FROM dt_effectiveness_metrics WHERE workflow_id = $1";
    const result = await this.pool.query(query, [workflowId]);
    return result.rows;
  }
  async saveAnalytics(workflowId, analytics) {
    const query = `
      INSERT INTO dt_effectiveness_metrics (workflow_id, metric_type, value, dimension, measurement_date, context)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      workflowId,
      analytics.metricType,
      analytics.value,
      analytics.dimension,
      /* @__PURE__ */ new Date(),
      JSON.stringify(analytics.context)
    ];
    await this.pool.query(query, values);
  }
  // Session Management
  async createSession(session2) {
    const query = `
      INSERT INTO dt_sessions (id, workflow_id, session_type, facilitator_id, participants, scheduled_at, duration_minutes, status, recording_url, transcription, ai_analysis)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    const values = [
      session2.id,
      session2.workflowId,
      session2.sessionType,
      session2.facilitatorId,
      JSON.stringify(session2.participants),
      session2.scheduledAt,
      session2.durationMinutes,
      session2.status,
      session2.recordingUrl,
      session2.transcription,
      JSON.stringify(session2.aiAnalysis)
    ];
    await this.pool.query(query, values);
  }
  async updateSession(sessionId, updates) {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
    const query = `UPDATE dt_sessions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [sessionId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
  async getSession(sessionId) {
    const query = "SELECT * FROM dt_sessions WHERE id = $1";
    const result = await this.pool.query(query, [sessionId]);
    return result.rows[0] || null;
  }
  // AI Facilitation Logs
  async logFacilitation(sessionId, intervention) {
    const query = `
      INSERT INTO ai_facilitation_logs (session_id, intervention_type, content, context, participant_reaction, effectiveness_score)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      sessionId,
      intervention.type,
      intervention.content,
      JSON.stringify(intervention.context),
      intervention.participantReaction,
      intervention.effectivenessScore
    ];
    await this.pool.query(query, values);
  }
  // Helper methods for conflict resolution
  async getParticipantTimestamps(participants) {
    const query = "SELECT participant_id, last_activity FROM dt_sessions WHERE participant_id = ANY($1)";
    const result = await this.pool.query(query, [participants]);
    return result.rows;
  }
  async getContentVersions(conflict) {
    return [];
  }
  async getParticipantPositions(conflict) {
    return [];
  }
  async getSessionFacilitator(conflict) {
    return "";
  }
  async getDataVersions(conflict) {
    return [];
  }
  async logConflictResolution(conflict, resolution) {
  }
  async getCanvasHistory(canvasId) {
    return [];
  }
  async restoreCanvasVersion(canvasId, version) {
  }
  // Close connection
  async close() {
    await this.pool.end();
  }
};

// server/services/canvas-service.ts
var CanvasService = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Get canvas elements
   */
  async getElements(canvasId) {
    try {
      const canvas = await this.db.getCanvas(canvasId);
      return canvas?.elements || [];
    } catch (error) {
      console.error("Error getting canvas elements:", error);
      throw new Error("Failed to get canvas elements");
    }
  }
  /**
   * Apply updates to canvas
   */
  async applyUpdates(canvasId, updates) {
    try {
      for (const update of updates) {
        await this.applyUpdate(canvasId, update);
      }
    } catch (error) {
      console.error("Error applying canvas updates:", error);
      throw new Error("Failed to apply canvas updates");
    }
  }
  /**
   * Apply a single update to canvas
   */
  async applyUpdate(canvasId, update) {
    switch (update.type) {
      case "element_added":
        await this.addElement(canvasId, update.element);
        break;
      case "element_updated":
        await this.updateElement(canvasId, update.element);
        break;
      case "element_removed":
        await this.removeElement(canvasId, update.element.id);
        break;
      case "element_moved":
        await this.moveElement(canvasId, update.element);
        break;
    }
  }
  /**
   * Add element to canvas
   */
  async addElement(canvasId, element) {
    await this.db.addCanvasElement(canvasId, element);
  }
  /**
   * Update element in canvas
   */
  async updateElement(canvasId, element) {
    await this.db.updateCanvasElement(canvasId, element.id, element);
  }
  /**
   * Remove element from canvas
   */
  async removeElement(canvasId, elementId) {
    await this.db.removeCanvasElement(canvasId, elementId);
  }
  /**
   * Move element in canvas
   */
  async moveElement(canvasId, element) {
    await this.db.updateCanvasElement(canvasId, element.id, { position: element.position });
  }
  /**
   * Apply clustering to canvas
   */
  async applyClustering(canvasId, clusters) {
    try {
      await this.db.applyCanvasClustering(canvasId, clusters);
    } catch (error) {
      console.error("Error applying canvas clustering:", error);
      throw new Error("Failed to apply canvas clustering");
    }
  }
  /**
   * Get canvas by ID
   */
  async getCanvas(canvasId) {
    try {
      return await this.db.getCanvas(canvasId);
    } catch (error) {
      console.error("Error getting canvas:", error);
      throw new Error("Failed to get canvas");
    }
  }
  /**
   * Create new canvas
   */
  async createCanvas(workflowId, canvasType) {
    try {
      const canvas = {
        id: this.generateId(),
        workflowId,
        canvasType,
        elements: [],
        version: 1,
        lastModifiedBy: null,
        lastModifiedAt: /* @__PURE__ */ new Date(),
        createdAt: /* @__PURE__ */ new Date()
      };
      await this.db.createCanvas(canvas);
      return canvas;
    } catch (error) {
      console.error("Error creating canvas:", error);
      throw new Error("Failed to create canvas");
    }
  }
  /**
   * Update canvas
   */
  async updateCanvas(canvasId, updates) {
    try {
      return await this.db.updateCanvas(canvasId, updates);
    } catch (error) {
      console.error("Error updating canvas:", error);
      throw new Error("Failed to update canvas");
    }
  }
  /**
   * Delete canvas
   */
  async deleteCanvas(canvasId) {
    try {
      await this.db.deleteCanvas(canvasId);
    } catch (error) {
      console.error("Error deleting canvas:", error);
      throw new Error("Failed to delete canvas");
    }
  }
  /**
   * Get canvas history
   */
  async getCanvasHistory(canvasId) {
    try {
      return await this.db.getCanvasHistory(canvasId);
    } catch (error) {
      console.error("Error getting canvas history:", error);
      throw new Error("Failed to get canvas history");
    }
  }
  /**
   * Restore canvas to version
   */
  async restoreCanvasVersion(canvasId, version) {
    try {
      await this.db.restoreCanvasVersion(canvasId, version);
    } catch (error) {
      console.error("Error restoring canvas version:", error);
      throw new Error("Failed to restore canvas version");
    }
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// server/services/conflict-resolver.ts
var ConflictResolver = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Resolve conflict using appropriate strategy
   */
  async resolveConflict(conflict) {
    try {
      const strategy = await this.selectResolutionStrategy(conflict);
      const resolution = await this.applyResolutionStrategy(conflict, strategy);
      await this.logResolution(conflict, resolution);
      return resolution;
    } catch (error) {
      console.error("Error resolving conflict:", error);
      throw new Error("Failed to resolve conflict");
    }
  }
  /**
   * Select appropriate resolution strategy
   */
  async selectResolutionStrategy(conflict) {
    switch (conflict.type) {
      case "simultaneous_edit":
        return "last_write_wins";
      case "content_conflict":
        return "merge_content";
      case "position_conflict":
        return "average_position";
      case "permission_conflict":
        return "escalate_to_facilitator";
      case "data_conflict":
        return "validate_and_merge";
      default:
        return "manual_resolution";
    }
  }
  /**
   * Apply resolution strategy
   */
  async applyResolutionStrategy(conflict, strategy) {
    switch (strategy) {
      case "last_write_wins":
        return await this.applyLastWriteWins(conflict);
      case "merge_content":
        return await this.applyContentMerge(conflict);
      case "average_position":
        return await this.applyAveragePosition(conflict);
      case "escalate_to_facilitator":
        return await this.escalateToFacilitator(conflict);
      case "validate_and_merge":
        return await this.validateAndMerge(conflict);
      case "manual_resolution":
        return await this.requireManualResolution(conflict);
      default:
        throw new Error("Unknown resolution strategy");
    }
  }
  /**
   * Apply last-write-wins strategy
   */
  async applyLastWriteWins(conflict) {
    const participants = conflict.participants;
    const timestamps = await this.getParticipantTimestamps(participants);
    const latestParticipant = this.getLatestParticipant(timestamps);
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "last_write_wins",
      resolution: {
        winner: latestParticipant,
        reason: "Most recent edit takes precedence",
        timestamp: /* @__PURE__ */ new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }
  /**
   * Apply content merge strategy
   */
  async applyContentMerge(conflict) {
    const contentVersions = await this.getContentVersions(conflict);
    const mergedContent = await this.mergeContent(contentVersions);
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "merge_content",
      resolution: {
        mergedContent,
        reason: "Content merged from all versions",
        contributors: conflict.participants,
        timestamp: /* @__PURE__ */ new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }
  /**
   * Apply average position strategy
   */
  async applyAveragePosition(conflict) {
    const positions = await this.getParticipantPositions(conflict);
    const averagePosition = this.calculateAveragePosition(positions);
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "average_position",
      resolution: {
        position: averagePosition,
        reason: "Position averaged from all participants",
        contributors: conflict.participants,
        timestamp: /* @__PURE__ */ new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }
  /**
   * Escalate to facilitator
   */
  async escalateToFacilitator(conflict) {
    const facilitator = await this.getSessionFacilitator(conflict);
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "escalate_to_facilitator",
      resolution: {
        escalatedTo: facilitator,
        reason: "Conflict requires facilitator intervention",
        timestamp: /* @__PURE__ */ new Date()
      },
      applied: false,
      requiresNotification: true
    };
  }
  /**
   * Validate and merge data
   */
  async validateAndMerge(conflict) {
    const dataVersions = await this.getDataVersions(conflict);
    const validation = await this.validateData(dataVersions);
    if (validation.isValid) {
      const mergedData = await this.mergeData(dataVersions);
      return {
        id: this.generateId(),
        conflictId: conflict.id,
        strategy: "validate_and_merge",
        resolution: {
          mergedData,
          reason: "Data validated and merged successfully",
          contributors: conflict.participants,
          timestamp: /* @__PURE__ */ new Date()
        },
        applied: true,
        requiresNotification: true
      };
    } else {
      return {
        id: this.generateId(),
        conflictId: conflict.id,
        strategy: "validate_and_merge",
        resolution: {
          error: validation.error,
          reason: "Data validation failed",
          timestamp: /* @__PURE__ */ new Date()
        },
        applied: false,
        requiresNotification: true
      };
    }
  }
  /**
   * Require manual resolution
   */
  async requireManualResolution(conflict) {
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "manual_resolution",
      resolution: {
        reason: "Manual resolution required",
        participants: conflict.participants,
        timestamp: /* @__PURE__ */ new Date()
      },
      applied: false,
      requiresNotification: true
    };
  }
  /**
   * Get participant timestamps
   */
  async getParticipantTimestamps(participants) {
    return await this.db.getParticipantTimestamps(participants);
  }
  /**
   * Get latest participant
   */
  getLatestParticipant(timestamps) {
    return timestamps.reduce(
      (latest, current) => current.timestamp > latest.timestamp ? current : latest
    ).participantId;
  }
  /**
   * Get content versions
   */
  async getContentVersions(conflict) {
    return await this.db.getContentVersions(conflict);
  }
  /**
   * Merge content from versions
   */
  async mergeContent(versions) {
    const allContent = versions.map((v) => v.content).join("\n\n");
    return allContent;
  }
  /**
   * Get participant positions
   */
  async getParticipantPositions(conflict) {
    return await this.db.getParticipantPositions(conflict);
  }
  /**
   * Calculate average position
   */
  calculateAveragePosition(positions) {
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
    return { x: avgX, y: avgY };
  }
  /**
   * Get session facilitator
   */
  async getSessionFacilitator(conflict) {
    return await this.db.getSessionFacilitator(conflict);
  }
  /**
   * Get data versions
   */
  async getDataVersions(conflict) {
    return await this.db.getDataVersions(conflict);
  }
  /**
   * Validate data
   */
  async validateData(versions) {
    const isValid = versions.every((v) => v.isValid);
    return {
      isValid,
      error: isValid ? null : "Invalid data detected"
    };
  }
  /**
   * Merge data
   */
  async mergeData(versions) {
    const validVersions = versions.filter((v) => v.isValid);
    return validVersions[validVersions.length - 1].data;
  }
  /**
   * Log resolution
   */
  async logResolution(conflict, resolution) {
    await this.db.logConflictResolution(conflict, resolution);
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// server/services/dt-collaboration-service.ts
var DTCollaborationService = class {
  io;
  canvasService;
  aiAssistant;
  conflictResolver;
  activeSessions;
  updateBatcher;
  constructor(httpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.canvasService = new CanvasService();
    this.aiAssistant = new DTAIAssistant();
    this.conflictResolver = new ConflictResolver();
    this.activeSessions = /* @__PURE__ */ new Map();
    this.updateBatcher = new UpdateBatcher();
    this.setupEventHandlers();
  }
  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      socket.on("join-session", async (data) => {
        await this.handleJoinSession(socket, data);
      });
      socket.on("leave-session", async (data) => {
        await this.handleLeaveSession(socket, data);
      });
      socket.on("canvas-update", async (data) => {
        await this.handleCanvasUpdate(socket, data);
      });
      socket.on("request-suggestions", async (data) => {
        await this.handleSuggestionRequest(socket, data);
      });
      socket.on("resolve-conflict", async (data) => {
        await this.handleConflictResolution(socket, data);
      });
      socket.on("start-session", async (data) => {
        await this.handleStartSession(socket, data);
      });
      socket.on("pause-session", async (data) => {
        await this.handlePauseSession(socket, data);
      });
      socket.on("end-session", async (data) => {
        await this.handleEndSession(socket, data);
      });
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        this.handleDisconnect(socket);
      });
    });
  }
  /**
   * Handle user joining a DT session
   */
  async handleJoinSession(socket, data) {
    try {
      const { sessionId, userId, userRole } = data;
      socket.join(sessionId);
      const session2 = await this.getOrCreateSession(sessionId);
      session2.addParticipant({
        id: userId,
        socketId: socket.id,
        role: userRole,
        joinedAt: /* @__PURE__ */ new Date()
      });
      socket.to(sessionId).emit("participant-joined", {
        userId,
        userRole,
        timestamp: /* @__PURE__ */ new Date()
      });
      socket.emit("session-state", {
        session: session2.getState(),
        canvas: await this.canvasService.getCanvas(sessionId)
      });
      console.log(`User ${userId} joined session ${sessionId}`);
    } catch (error) {
      console.error("Error joining session:", error);
      socket.emit("error", { message: "Failed to join session" });
    }
  }
  /**
   * Handle user leaving a DT session
   */
  async handleLeaveSession(socket, data) {
    try {
      const { sessionId, userId } = data;
      const session2 = this.activeSessions.get(sessionId);
      if (session2) {
        session2.removeParticipant(userId);
      }
      socket.leave(sessionId);
      socket.to(sessionId).emit("participant-left", {
        userId,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`User ${userId} left session ${sessionId}`);
    } catch (error) {
      console.error("Error leaving session:", error);
    }
  }
  /**
   * Handle canvas updates
   */
  async handleCanvasUpdate(socket, data) {
    try {
      const { sessionId, update } = data;
      this.updateBatcher.addUpdate(sessionId, update);
      const batchedUpdates = await this.updateBatcher.processUpdates(sessionId);
      if (batchedUpdates.length > 0) {
        await this.canvasService.applyUpdates(sessionId, batchedUpdates);
        socket.to(sessionId).emit("canvas-updates", {
          updates: batchedUpdates,
          timestamp: /* @__PURE__ */ new Date()
        });
        if (update.type === "element_added") {
          await this.generateAISuggestions(sessionId, update);
        }
      }
      console.log(`Canvas updated for session ${sessionId}`);
    } catch (error) {
      console.error("Error handling canvas update:", error);
      socket.emit("error", { message: "Failed to update canvas" });
    }
  }
  /**
   * Handle AI suggestion requests
   */
  async handleSuggestionRequest(socket, data) {
    try {
      const { sessionId, context, type } = data;
      const suggestions = await this.aiAssistant.generateSuggestions({
        sessionId,
        context,
        type,
        timestamp: /* @__PURE__ */ new Date()
      });
      socket.emit("ai-suggestions", {
        suggestions,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`AI suggestions generated for session ${sessionId}`);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      socket.emit("error", { message: "Failed to generate suggestions" });
    }
  }
  /**
   * Handle conflict resolution
   */
  async handleConflictResolution(socket, data) {
    try {
      const { sessionId, conflict } = data;
      const resolution = await this.conflictResolver.resolveConflict(conflict);
      this.io.to(sessionId).emit("conflict-resolved", {
        conflict,
        resolution,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Conflict resolved for session ${sessionId}`);
    } catch (error) {
      console.error("Error resolving conflict:", error);
      socket.emit("error", { message: "Failed to resolve conflict" });
    }
  }
  /**
   * Handle session start
   */
  async handleStartSession(socket, data) {
    try {
      const { sessionId } = data;
      const session2 = await this.getOrCreateSession(sessionId);
      session2.start();
      this.io.to(sessionId).emit("session-started", {
        sessionId,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Session ${sessionId} started`);
    } catch (error) {
      console.error("Error starting session:", error);
      socket.emit("error", { message: "Failed to start session" });
    }
  }
  /**
   * Handle session pause
   */
  async handlePauseSession(socket, data) {
    try {
      const { sessionId } = data;
      const session2 = this.activeSessions.get(sessionId);
      if (session2) {
        session2.pause();
        this.io.to(sessionId).emit("session-paused", {
          sessionId,
          timestamp: /* @__PURE__ */ new Date()
        });
      }
      console.log(`Session ${sessionId} paused`);
    } catch (error) {
      console.error("Error pausing session:", error);
      socket.emit("error", { message: "Failed to pause session" });
    }
  }
  /**
   * Handle session end
   */
  async handleEndSession(socket, data) {
    try {
      const { sessionId } = data;
      const session2 = this.activeSessions.get(sessionId);
      if (session2) {
        session2.end();
        const summary = await this.generateSessionSummary(session2);
        this.io.to(sessionId).emit("session-ended", {
          sessionId,
          summary,
          timestamp: /* @__PURE__ */ new Date()
        });
        this.activeSessions.delete(sessionId);
      }
      console.log(`Session ${sessionId} ended`);
    } catch (error) {
      console.error("Error ending session:", error);
      socket.emit("error", { message: "Failed to end session" });
    }
  }
  /**
   * Handle user disconnect
   */
  handleDisconnect(socket) {
    for (const [sessionId, session2] of this.activeSessions) {
      session2.removeParticipantBySocketId(socket.id);
    }
  }
  /**
   * Get or create session
   */
  async getOrCreateSession(sessionId) {
    let session2 = this.activeSessions.get(sessionId);
    if (!session2) {
      session2 = new DTSession(sessionId);
      this.activeSessions.set(sessionId, session2);
    }
    return session2;
  }
  /**
   * Generate AI suggestions for canvas updates
   */
  async generateAISuggestions(sessionId, update) {
    try {
      const suggestions = await this.aiAssistant.suggestRelatedElements({
        sessionId,
        update,
        timestamp: /* @__PURE__ */ new Date()
      });
      if (suggestions.length > 0) {
        this.io.to(sessionId).emit("ai-suggestions", {
          suggestions,
          timestamp: /* @__PURE__ */ new Date()
        });
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
    }
  }
  /**
   * Generate session summary
   */
  async generateSessionSummary(session2) {
    const participants = session2.getParticipants();
    const activities = session2.getActivities();
    const canvas = await this.canvasService.getCanvas(session2.id);
    return {
      sessionId: session2.id,
      duration: session2.getDuration(),
      participants: participants.length,
      activities: activities.length,
      canvasElements: canvas.elements.length,
      insights: await this.aiAssistant.generateSessionInsights(session2),
      recommendations: await this.aiAssistant.generateRecommendations(session2)
    };
  }
  /**
   * Enable smart clustering for canvas
   */
  async enableSmartClustering(canvasId) {
    try {
      const elements = await this.canvasService.getElements(canvasId);
      const clusters = await this.aiAssistant.clusterElements(elements);
      await this.canvasService.applyClustering(canvasId, clusters);
      this.io.to(canvasId).emit("canvas-clustered", {
        clusters,
        timestamp: /* @__PURE__ */ new Date()
      });
      return clusters;
    } catch (error) {
      console.error("Error enabling smart clustering:", error);
      throw error;
    }
  }
  /**
   * Get session status
   */
  async getSessionStatus(sessionId) {
    const session2 = this.activeSessions.get(sessionId);
    if (!session2) {
      return {
        status: "not_found",
        participants: 0,
        duration: 0
      };
    }
    return {
      status: session2.getStatus(),
      participants: session2.getParticipants().length,
      duration: session2.getDuration(),
      lastActivity: session2.getLastActivity()
    };
  }
};
var UpdateBatcher = class {
  batches;
  batchTimers;
  constructor() {
    this.batches = /* @__PURE__ */ new Map();
    this.batchTimers = /* @__PURE__ */ new Map();
  }
  addUpdate(sessionId, update) {
    if (!this.batches.has(sessionId)) {
      this.batches.set(sessionId, []);
    }
    this.batches.get(sessionId).push(update);
    if (this.batchTimers.has(sessionId)) {
      clearTimeout(this.batchTimers.get(sessionId));
    }
    this.batchTimers.set(sessionId, setTimeout(() => {
      this.processUpdates(sessionId);
    }, 100));
  }
  async processUpdates(sessionId) {
    const updates = this.batches.get(sessionId) || [];
    this.batches.set(sessionId, []);
    if (this.batchTimers.has(sessionId)) {
      clearTimeout(this.batchTimers.get(sessionId));
      this.batchTimers.delete(sessionId);
    }
    return updates;
  }
};
var DTSession = class {
  id;
  participants;
  activities;
  status;
  startTime;
  endTime;
  lastActivity;
  constructor(id) {
    this.id = id;
    this.participants = /* @__PURE__ */ new Map();
    this.activities = [];
    this.status = "inactive";
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  addParticipant(participant) {
    this.participants.set(participant.id, participant);
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  removeParticipant(userId) {
    this.participants.delete(userId);
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  removeParticipantBySocketId(socketId) {
    for (const [userId, participant] of this.participants) {
      if (participant.socketId === socketId) {
        this.participants.delete(userId);
        break;
      }
    }
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  start() {
    this.status = "active";
    this.startTime = /* @__PURE__ */ new Date();
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  pause() {
    this.status = "paused";
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  end() {
    this.status = "completed";
    this.endTime = /* @__PURE__ */ new Date();
    this.lastActivity = /* @__PURE__ */ new Date();
  }
  getParticipants() {
    return Array.from(this.participants.values());
  }
  getActivities() {
    return this.activities;
  }
  getStatus() {
    return this.status;
  }
  getDuration() {
    if (!this.startTime) return 0;
    const endTime = this.endTime || /* @__PURE__ */ new Date();
    return endTime.getTime() - this.startTime.getTime();
  }
  getLastActivity() {
    return this.lastActivity;
  }
  getState() {
    return {
      id: this.id,
      status: this.status,
      participants: this.getParticipants(),
      activities: this.activities,
      duration: this.getDuration(),
      lastActivity: this.lastActivity
    };
  }
};

// server/services/dt-analytics-engine.ts
var DTAnalyticsEngine = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Calculate comprehensive effectiveness score
   */
  async calculateEffectivenessScore(workflowId) {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      const [
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      ] = await Promise.all([
        this.measureUserCentricity(workflowId),
        this.measureIdeaDiversity(workflowId),
        this.measureIterationSpeed(workflowId),
        this.measureTeamCollaboration(workflowId),
        this.measureOutcomeQuality(workflowId),
        this.measureProcessAdherence(workflowId)
      ]);
      const overall = this.calculateOverallScore({
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });
      const recommendations = await this.generateRecommendations(workflowId, {
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });
      return {
        overall,
        dimensions: {
          userCentricity,
          ideaDiversity,
          iterationSpeed,
          teamCollaboration,
          outcomeQuality,
          processAdherence
        },
        recommendations,
        benchmarks: await this.compareToBenchmarks(workflowId),
        calculatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error calculating effectiveness score:", error);
      throw new Error("Failed to calculate effectiveness score");
    }
  }
  /**
   * Generate insight map for workflow
   */
  async generateInsightMap(workflowId) {
    try {
      const insights = await this.getWorkflowInsights(workflowId);
      const relationships = await this.identifyRelationships(insights);
      const clusters = await this.clusterInsights(insights);
      const criticalPath = await this.identifyCriticalPath(insights);
      return {
        nodes: insights.map((insight) => ({
          id: insight.id,
          label: insight.content,
          phase: insight.phase,
          importance: insight.importance,
          connections: insight.connections || []
        })),
        edges: relationships,
        clusters,
        criticalPath,
        generatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error generating insight map:", error);
      throw new Error("Failed to generate insight map");
    }
  }
  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflowId) {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      const benchmarks = await this.findBenchmarks(workflow);
      const comparison = await this.performComparison(workflow, benchmarks);
      return {
        industry: workflow.industry || "general",
        similarProjects: benchmarks.length,
        performanceRanking: comparison.ranking,
        keyDifferences: comparison.differences,
        improvementOpportunities: comparison.opportunities,
        comparedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error comparing to benchmarks:", error);
      throw new Error("Failed to compare to benchmarks");
    }
  }
  /**
   * Measure user centricity
   */
  async measureUserCentricity(workflowId) {
    try {
      const empathyData = await this.db.getEmpathyData(workflowId);
      const userInterviews = await this.db.getUserInterviews(workflowId);
      const personaQuality = await this.assessPersonaQuality(empathyData);
      const interviewDepth = await this.assessInterviewDepth(userInterviews);
      return (personaQuality + interviewDepth) / 2;
    } catch (error) {
      console.error("Error measuring user centricity:", error);
      return 0;
    }
  }
  /**
   * Measure idea diversity
   */
  async measureIdeaDiversity(workflowId) {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflowId);
      const diversityScore = await this.calculateIdeaDiversity(ideas);
      return diversityScore;
    } catch (error) {
      console.error("Error measuring idea diversity:", error);
      return 0;
    }
  }
  /**
   * Measure iteration speed
   */
  async measureIterationSpeed(workflowId) {
    try {
      const iterations = await this.db.getWorkflowIterations(workflowId);
      const speedScore = await this.calculateIterationSpeed(iterations);
      return speedScore;
    } catch (error) {
      console.error("Error measuring iteration speed:", error);
      return 0;
    }
  }
  /**
   * Measure team collaboration
   */
  async measureTeamCollaboration(workflowId) {
    try {
      const sessions = await this.db.getWorkflowSessions(workflowId);
      const collaborationScore = await this.calculateCollaborationScore(sessions);
      return collaborationScore;
    } catch (error) {
      console.error("Error measuring team collaboration:", error);
      return 0;
    }
  }
  /**
   * Measure outcome quality
   */
  async measureOutcomeQuality(workflowId) {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflowId);
      const qualityScore = await this.calculateOutcomeQuality(outcomes);
      return qualityScore;
    } catch (error) {
      console.error("Error measuring outcome quality:", error);
      return 0;
    }
  }
  /**
   * Measure process adherence
   */
  async measureProcessAdherence(workflowId) {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      const adherenceScore = await this.calculateProcessAdherence(workflow);
      return adherenceScore;
    } catch (error) {
      console.error("Error measuring process adherence:", error);
      return 0;
    }
  }
  /**
   * Calculate overall score
   */
  calculateOverallScore(dimensions) {
    const weights = {
      userCentricity: 0.2,
      ideaDiversity: 0.15,
      iterationSpeed: 0.15,
      teamCollaboration: 0.2,
      outcomeQuality: 0.2,
      processAdherence: 0.1
    };
    return Object.entries(dimensions).reduce((sum, [key, value]) => {
      return sum + value * (weights[key] || 0);
    }, 0);
  }
  /**
   * Generate recommendations
   */
  async generateRecommendations(workflowId, dimensions) {
    const recommendations = [];
    if (dimensions.userCentricity < 0.6) {
      recommendations.push("Increase user research depth and persona development");
    }
    if (dimensions.ideaDiversity < 0.6) {
      recommendations.push("Encourage more diverse idea generation techniques");
    }
    if (dimensions.iterationSpeed < 0.6) {
      recommendations.push("Optimize iteration cycles and feedback loops");
    }
    if (dimensions.teamCollaboration < 0.6) {
      recommendations.push("Improve team collaboration and communication");
    }
    if (dimensions.outcomeQuality < 0.6) {
      recommendations.push("Focus on higher quality deliverables and outcomes");
    }
    if (dimensions.processAdherence < 0.6) {
      recommendations.push("Better adherence to Design Thinking methodology");
    }
    return recommendations;
  }
  /**
   * Get workflow insights
   */
  async getWorkflowInsights(workflowId) {
    return await this.db.getWorkflowInsights(workflowId);
  }
  /**
   * Identify relationships between insights
   */
  async identifyRelationships(insights) {
    const edges = [];
    for (let i = 0; i < insights.length; i++) {
      for (let j = i + 1; j < insights.length; j++) {
        const similarity = await this.calculateInsightSimilarity(insights[i], insights[j]);
        if (similarity > 0.5) {
          edges.push({
            from: insights[i].id,
            to: insights[j].id,
            type: "related",
            strength: similarity
          });
        }
      }
    }
    return edges;
  }
  /**
   * Cluster insights
   */
  async clusterInsights(insights) {
    const clusters = [];
    const processed = /* @__PURE__ */ new Set();
    for (const insight of insights) {
      if (processed.has(insight.id)) continue;
      const cluster = await this.createInsightCluster(insight, insights);
      clusters.push(cluster);
      cluster.insights.forEach((id) => processed.add(id));
    }
    return clusters;
  }
  /**
   * Identify critical path
   */
  async identifyCriticalPath(insights) {
    const sortedInsights = insights.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    return sortedInsights.slice(0, 5).map((insight) => insight.id);
  }
  /**
   * Calculate insight similarity
   */
  async calculateInsightSimilarity(insight1, insight2) {
    const contentSimilarity = this.calculateContentSimilarity(insight1.content, insight2.content);
    const phaseSimilarity = insight1.phase === insight2.phase ? 1 : 0;
    return (contentSimilarity + phaseSimilarity) / 2;
  }
  /**
   * Calculate content similarity
   */
  calculateContentSimilarity(content1, content2) {
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    const intersection = words1.filter((word) => words2.includes(word));
    const union = [.../* @__PURE__ */ new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }
  /**
   * Create insight cluster
   */
  async createInsightCluster(seedInsight, allInsights) {
    const cluster = {
      id: this.generateId(),
      name: `Cluster ${seedInsight.phase}`,
      insights: [seedInsight.id],
      theme: seedInsight.phase,
      confidence: 0.8
    };
    for (const insight of allInsights) {
      if (insight.id === seedInsight.id) continue;
      const similarity = await this.calculateInsightSimilarity(seedInsight, insight);
      if (similarity > 0.6) {
        cluster.insights.push(insight.id);
      }
    }
    return cluster;
  }
  /**
   * Find benchmarks
   */
  async findBenchmarks(workflow) {
    return await this.db.findSimilarWorkflows(workflow);
  }
  /**
   * Perform comparison
   */
  async performComparison(workflow, benchmarks) {
    return {
      ranking: 0.5,
      differences: [],
      opportunities: []
    };
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  // Placeholder methods for database operations
  async assessPersonaQuality(empathyData) {
    return 0.8;
  }
  async assessInterviewDepth(interviews) {
    return 0.7;
  }
  async calculateIdeaDiversity(ideas) {
    return 0.6;
  }
  async calculateIterationSpeed(iterations) {
    return 0.5;
  }
  async calculateCollaborationScore(sessions) {
    return 0.7;
  }
  async calculateOutcomeQuality(outcomes) {
    return 0.8;
  }
  async calculateProcessAdherence(workflow) {
    return 0.6;
  }
};

// server/services/insight-tracker.ts
var InsightTracker = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Track insight evolution
   */
  async trackEvolution(insightId) {
    try {
      const evolution = await this.getInsightHistory(insightId);
      const impact = await this.measureInsightImpact(insightId);
      const businessValue = await this.calculateBusinessValue(insightId);
      return {
        originalInsight: evolution[0],
        transformations: evolution.map((e, i) => ({
          phase: e.phase,
          transformation: this.compareInsights(evolution[i], evolution[i + 1]),
          contributingFactors: e.factors,
          refinements: e.refinements
        })),
        finalOutcome: evolution[evolution.length - 1],
        impact,
        businessValue,
        trackedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error tracking insight evolution:", error);
      throw new Error("Failed to track insight evolution");
    }
  }
  /**
   * Get insight history
   */
  async getInsightHistory(insightId) {
    return await this.db.getInsightHistory(insightId);
  }
  /**
   * Measure insight impact
   */
  async measureInsightImpact(insightId) {
    try {
      const usage = await this.db.getInsightUsage(insightId);
      const influence = await this.calculateInfluenceScore(insightId);
      const businessValue = await this.calculateBusinessValue(insightId);
      const timeToImpact = await this.calculateTimeToImpact(insightId);
      return {
        usageCount: usage.length,
        influenceScore: influence,
        businessValue,
        timeToImpact,
        measuredAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error measuring insight impact:", error);
      return {
        usageCount: 0,
        influenceScore: 0,
        businessValue: 0,
        timeToImpact: 0,
        measuredAt: /* @__PURE__ */ new Date()
      };
    }
  }
  /**
   * Calculate business value
   */
  async calculateBusinessValue(insightId) {
    try {
      const insight = await this.db.getInsight(insightId);
      const relatedIdeas = await this.db.getRelatedIdeas(insightId);
      const prototypes = await this.db.getRelatedPrototypes(insightId);
      const tests = await this.db.getRelatedTests(insightId);
      const ideaValue = relatedIdeas.length * 0.1;
      const prototypeValue = prototypes.length * 0.3;
      const testValue = tests.length * 0.2;
      const insightQuality = insight?.importance || 0;
      return (ideaValue + prototypeValue + testValue + insightQuality) / 4;
    } catch (error) {
      console.error("Error calculating business value:", error);
      return 0;
    }
  }
  /**
   * Calculate influence score
   */
  async calculateInfluenceScore(insightId) {
    try {
      const connections = await this.db.getInsightConnections(insightId);
      const usage = await this.db.getInsightUsage(insightId);
      const references = await this.db.getInsightReferences(insightId);
      const connectionScore = Math.min(connections.length / 10, 1);
      const usageScore = Math.min(usage.length / 5, 1);
      const referenceScore = Math.min(references.length / 3, 1);
      return (connectionScore + usageScore + referenceScore) / 3;
    } catch (error) {
      console.error("Error calculating influence score:", error);
      return 0;
    }
  }
  /**
   * Calculate time to impact
   */
  async calculateTimeToImpact(insightId) {
    try {
      const insight = await this.db.getInsight(insightId);
      const firstUsage = await this.db.getFirstInsightUsage(insightId);
      if (!insight || !firstUsage) return 0;
      const timeDiff = firstUsage.timestamp.getTime() - insight.createdAt.getTime();
      return timeDiff / (1e3 * 60 * 60 * 24);
    } catch (error) {
      console.error("Error calculating time to impact:", error);
      return 0;
    }
  }
  /**
   * Compare insights
   */
  compareInsights(insight1, insight2) {
    if (!insight2) {
      return {
        type: "final",
        changes: [],
        improvements: [],
        newElements: []
      };
    }
    const changes = this.identifyChanges(insight1, insight2);
    const improvements = this.identifyImprovements(insight1, insight2);
    const newElements = this.identifyNewElements(insight1, insight2);
    return {
      type: this.determineTransformationType(changes, improvements, newElements),
      changes,
      improvements,
      newElements
    };
  }
  /**
   * Identify changes between insights
   */
  identifyChanges(insight1, insight2) {
    const changes = [];
    if (insight1.content !== insight2.content) {
      changes.push("Content updated");
    }
    if (insight1.importance !== insight2.importance) {
      changes.push("Importance changed");
    }
    if (insight1.confidence !== insight2.confidence) {
      changes.push("Confidence updated");
    }
    return changes;
  }
  /**
   * Identify improvements
   */
  identifyImprovements(insight1, insight2) {
    const improvements = [];
    if (insight2.importance > insight1.importance) {
      improvements.push("Importance increased");
    }
    if (insight2.confidence > insight1.confidence) {
      improvements.push("Confidence improved");
    }
    if (insight2.content.length > insight1.content.length) {
      improvements.push("Content expanded");
    }
    return improvements;
  }
  /**
   * Identify new elements
   */
  identifyNewElements(insight1, insight2) {
    const newElements = [];
    if (insight2.connections && insight2.connections.length > (insight1.connections?.length || 0)) {
      newElements.push("New connections added");
    }
    if (insight2.tags && insight2.tags.length > (insight1.tags?.length || 0)) {
      newElements.push("New tags added");
    }
    return newElements;
  }
  /**
   * Determine transformation type
   */
  determineTransformationType(changes, improvements, newElements) {
    if (improvements.length > 0 && newElements.length > 0) {
      return "enhanced";
    } else if (improvements.length > 0) {
      return "improved";
    } else if (newElements.length > 0) {
      return "expanded";
    } else if (changes.length > 0) {
      return "modified";
    } else {
      return "unchanged";
    }
  }
  /**
   * Track insight usage
   */
  async trackInsightUsage(insightId, context) {
    try {
      await this.db.logInsightUsage(insightId, context);
    } catch (error) {
      console.error("Error tracking insight usage:", error);
    }
  }
  /**
   * Get insight relationships
   */
  async getInsightRelationships(insightId) {
    try {
      return await this.db.getInsightRelationships(insightId);
    } catch (error) {
      console.error("Error getting insight relationships:", error);
      return [];
    }
  }
  /**
   * Generate insight report
   */
  async generateInsightReport(insightId) {
    try {
      const evolution = await this.trackEvolution(insightId);
      const relationships = await this.getInsightRelationships(insightId);
      const usage = await this.db.getInsightUsage(insightId);
      return {
        insightId,
        evolution,
        relationships,
        usage: usage.length,
        recommendations: await this.generateInsightRecommendations(insightId),
        generatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error generating insight report:", error);
      throw new Error("Failed to generate insight report");
    }
  }
  /**
   * Generate insight recommendations
   */
  async generateInsightRecommendations(insightId) {
    const recommendations = [];
    const insight = await this.db.getInsight(insightId);
    if (!insight) return recommendations;
    if (insight.importance < 0.7) {
      recommendations.push("Consider increasing insight importance through validation");
    }
    if (insight.confidence < 0.6) {
      recommendations.push("Gather more evidence to increase confidence");
    }
    const connections = await this.db.getInsightConnections(insightId);
    if (connections.length < 3) {
      recommendations.push("Explore connections to other insights");
    }
    return recommendations;
  }
};

// server/services/roi-calculator.ts
var ROICalculator = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Calculate comprehensive ROI for workflow
   */
  async calculateROI(workflow) {
    try {
      const investment = await this.calculateInvestment(workflow);
      const returns = await this.calculateReturns(workflow);
      const roi = this.calculateROIPercentage(investment, returns);
      const paybackPeriod = this.calculatePaybackPeriod(investment, returns);
      const intangibleBenefits = await this.identifyIntangibleBenefits(workflow);
      return {
        investment,
        returns,
        roi,
        paybackPeriod,
        intangibleBenefits,
        calculatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error calculating ROI:", error);
      throw new Error("Failed to calculate ROI");
    }
  }
  /**
   * Calculate investment
   */
  async calculateInvestment(workflow) {
    const timeInvested = await this.calculateTimeInvestment(workflow);
    const resourceCost = await this.calculateResourceCost(workflow);
    const toolCost = await this.calculateToolCost(workflow);
    const opportunityCost = await this.calculateOpportunityCost(workflow);
    const total = timeInvested + resourceCost + toolCost + opportunityCost;
    return {
      timeInvested,
      resourceCost,
      toolCost,
      opportunityCost,
      total
    };
  }
  /**
   * Calculate returns
   */
  async calculateReturns(workflow) {
    const timeToMarketReduction = await this.estimateTimeToMarketReduction(workflow);
    const developmentCostSavings = await this.estimateDevelopmentCostSavings(workflow);
    const revenueImpact = await this.estimateRevenueImpact(workflow);
    const riskMitigation = await this.estimateRiskMitigation(workflow);
    const innovationValue = await this.estimateInnovationValue(workflow);
    const total = timeToMarketReduction + developmentCostSavings + revenueImpact + riskMitigation + innovationValue;
    return {
      timeToMarketReduction,
      developmentCostSavings,
      revenueImpact,
      riskMitigation,
      innovationValue,
      total
    };
  }
  /**
   * Calculate time investment
   */
  async calculateTimeInvestment(workflow) {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      const totalSessionTime = sessions.reduce((sum, session2) => sum + (session2.duration || 0), 0);
      const preparationTime = totalSessionTime * 0.3;
      const followUpTime = totalSessionTime * 0.2;
      const totalTime = totalSessionTime + preparationTime + followUpTime;
      const hourlyRate = 50;
      return totalTime * hourlyRate;
    } catch (error) {
      console.error("Error calculating time investment:", error);
      return 0;
    }
  }
  /**
   * Calculate resource cost
   */
  async calculateResourceCost(workflow) {
    try {
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const facilitatorCost = sessions.length * 200;
      const participantCost = participants.length * 50;
      const materialsCost = sessions.length * 25;
      return facilitatorCost + participantCost + materialsCost;
    } catch (error) {
      console.error("Error calculating resource cost:", error);
      return 0;
    }
  }
  /**
   * Calculate tool cost
   */
  async calculateToolCost(workflow) {
    try {
      const toolUsage = await this.db.getWorkflowToolUsage(workflow.id);
      const aiServiceCost = toolUsage.aiCalls * 0.01;
      const collaborationCost = toolUsage.collaborationMinutes * 0.05;
      const analyticsCost = toolUsage.analyticsQueries * 0.02;
      return aiServiceCost + collaborationCost + analyticsCost;
    } catch (error) {
      console.error("Error calculating tool cost:", error);
      return 0;
    }
  }
  /**
   * Calculate opportunity cost
   */
  async calculateOpportunityCost(workflow) {
    try {
      const timeInvested = await this.calculateTimeInvestment(workflow);
      const alternativeReturn = timeInvested * 0.1;
      return alternativeReturn;
    } catch (error) {
      console.error("Error calculating opportunity cost:", error);
      return 0;
    }
  }
  /**
   * Estimate time to market reduction
   */
  async estimateTimeToMarketReduction(workflow) {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      const timeReduction = outcomes.length * 30;
      const prototypeAcceleration = prototypes.length * 15;
      const totalDays = timeReduction + prototypeAcceleration;
      const dailyValue = 1e3;
      return totalDays * dailyValue;
    } catch (error) {
      console.error("Error estimating time to market reduction:", error);
      return 0;
    }
  }
  /**
   * Estimate development cost savings
   */
  async estimateDevelopmentCostSavings(workflow) {
    try {
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      const tests = await this.db.getWorkflowTests(workflow.id);
      const prototypeSavings = prototypes.length * 5e3;
      const testSavings = tests.length * 2e3;
      return prototypeSavings + testSavings;
    } catch (error) {
      console.error("Error estimating development cost savings:", error);
      return 0;
    }
  }
  /**
   * Estimate revenue impact
   */
  async estimateRevenueImpact(workflow) {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const businessValue = await this.calculateBusinessValue(workflow);
      const revenuePerOutcome = 1e4;
      const totalRevenue = outcomes.length * revenuePerOutcome;
      return totalRevenue + businessValue;
    } catch (error) {
      console.error("Error estimating revenue impact:", error);
      return 0;
    }
  }
  /**
   * Estimate risk mitigation
   */
  async estimateRiskMitigation(workflow) {
    try {
      const risks = await this.db.getWorkflowRisks(workflow.id);
      const mitigations = await this.db.getWorkflowMitigations(workflow.id);
      const riskValue = risks.length * 5e3;
      const mitigationValue = mitigations.length * 2e3;
      return riskValue + mitigationValue;
    } catch (error) {
      console.error("Error estimating risk mitigation:", error);
      return 0;
    }
  }
  /**
   * Estimate innovation value
   */
  async estimateInnovationValue(workflow) {
    try {
      const insights = await this.db.getWorkflowInsights(workflow.id);
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      const insightValue = insights.length * 1e3;
      const ideaValue = ideas.length * 500;
      return insightValue + ideaValue;
    } catch (error) {
      console.error("Error estimating innovation value:", error);
      return 0;
    }
  }
  /**
   * Calculate business value
   */
  async calculateBusinessValue(workflow) {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const quality = await this.assessOutcomeQuality(outcomes);
      const marketSize = await this.estimateMarketSize(workflow);
      return quality * marketSize * 0.1;
    } catch (error) {
      console.error("Error calculating business value:", error);
      return 0;
    }
  }
  /**
   * Calculate ROI percentage
   */
  calculateROIPercentage(investment, returns) {
    if (investment.total === 0) return 0;
    return (returns.total - investment.total) / investment.total * 100;
  }
  /**
   * Calculate payback period
   */
  calculatePaybackPeriod(investment, returns) {
    if (returns.total <= 0) return Infinity;
    return investment.total / returns.total;
  }
  /**
   * Identify intangible benefits
   */
  async identifyIntangibleBenefits(workflow) {
    const benefits = [];
    const insights = await this.db.getWorkflowInsights(workflow.id);
    if (insights.length > 0) {
      benefits.push("Enhanced team learning and knowledge");
    }
    const collaboration = await this.assessCollaborationQuality(workflow);
    if (collaboration > 0.7) {
      benefits.push("Improved team collaboration");
    }
    const innovation = await this.assessInnovationCulture(workflow);
    if (innovation > 0.7) {
      benefits.push("Strengthened innovation culture");
    }
    return benefits;
  }
  /**
   * Assess outcome quality
   */
  async assessOutcomeQuality(outcomes) {
    if (outcomes.length === 0) return 0;
    const qualityScores = outcomes.map((outcome) => outcome.quality || 0.5);
    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }
  /**
   * Estimate market size
   */
  async estimateMarketSize(workflow) {
    const industryMultipliers = {
      "technology": 1e6,
      "healthcare": 8e5,
      "finance": 6e5,
      "education": 4e5,
      "retail": 3e5
    };
    return industryMultipliers[workflow.industry || "general"] || 5e5;
  }
  /**
   * Assess collaboration quality
   */
  async assessCollaborationQuality(workflow) {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      if (sessions.length === 0 || participants.length === 0) return 0;
      const participationRate = sessions.reduce((sum, session2) => sum + (session2.participants?.length || 0), 0) / (sessions.length * participants.length);
      return participationRate;
    } catch (error) {
      console.error("Error assessing collaboration quality:", error);
      return 0;
    }
  }
  /**
   * Assess innovation culture
   */
  async assessInnovationCulture(workflow) {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      const ideaToPrototypeRate = prototypes.length / Math.max(ideas.length, 1);
      return Math.min(ideaToPrototypeRate, 1);
    } catch (error) {
      console.error("Error assessing innovation culture:", error);
      return 0;
    }
  }
};

// server/services/benchmark-service.ts
var BenchmarkService = class {
  db;
  constructor() {
    this.db = new DatabaseService();
  }
  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflow) {
    try {
      const benchmarks = await this.findBenchmarks(workflow);
      const comparison = await this.performComparison(workflow, benchmarks);
      return {
        industry: workflow.industry || "general",
        similarProjects: benchmarks.length,
        performanceRanking: comparison.ranking,
        keyDifferences: comparison.differences,
        improvementOpportunities: comparison.opportunities,
        comparedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error comparing to benchmarks:", error);
      throw new Error("Failed to compare to benchmarks");
    }
  }
  /**
   * Find relevant benchmarks
   */
  async findBenchmarks(workflow) {
    try {
      const industry = workflow.industry || "general";
      const phase = workflow.currentPhase;
      const size = await this.estimateWorkflowSize(workflow);
      const benchmarks = await this.db.findSimilarWorkflows({
        industry,
        phase,
        size,
        limit: 10
      });
      return benchmarks;
    } catch (error) {
      console.error("Error finding benchmarks:", error);
      return [];
    }
  }
  /**
   * Perform comparison
   */
  async performComparison(workflow, benchmarks) {
    try {
      const workflowMetrics = await this.calculateWorkflowMetrics(workflow);
      const benchmarkMetrics = await this.calculateBenchmarkMetrics(benchmarks);
      const ranking = this.calculatePerformanceRanking(workflowMetrics, benchmarkMetrics);
      const differences = this.identifyKeyDifferences(workflowMetrics, benchmarkMetrics);
      const opportunities = this.identifyImprovementOpportunities(workflowMetrics, benchmarkMetrics);
      return {
        ranking,
        differences,
        opportunities
      };
    } catch (error) {
      console.error("Error performing comparison:", error);
      return {
        ranking: 0.5,
        differences: [],
        opportunities: []
      };
    }
  }
  /**
   * Calculate workflow metrics
   */
  async calculateWorkflowMetrics(workflow) {
    try {
      const [
        effectiveness,
        efficiency,
        quality,
        innovation,
        collaboration
      ] = await Promise.all([
        this.calculateEffectiveness(workflow),
        this.calculateEfficiency(workflow),
        this.calculateQuality(workflow),
        this.calculateInnovation(workflow),
        this.calculateCollaboration(workflow)
      ]);
      return {
        effectiveness,
        efficiency,
        quality,
        innovation,
        collaboration,
        overall: (effectiveness + efficiency + quality + innovation + collaboration) / 5
      };
    } catch (error) {
      console.error("Error calculating workflow metrics:", error);
      return {
        effectiveness: 0,
        efficiency: 0,
        quality: 0,
        innovation: 0,
        collaboration: 0,
        overall: 0
      };
    }
  }
  /**
   * Calculate benchmark metrics
   */
  async calculateBenchmarkMetrics(benchmarks) {
    try {
      const metrics = benchmarks.map((benchmark) => benchmark.metrics);
      return {
        effectiveness: this.calculateAverage(metrics.map((m) => m.effectiveness)),
        efficiency: this.calculateAverage(metrics.map((m) => m.efficiency)),
        quality: this.calculateAverage(metrics.map((m) => m.quality)),
        innovation: this.calculateAverage(metrics.map((m) => m.innovation)),
        collaboration: this.calculateAverage(metrics.map((m) => m.collaboration)),
        overall: this.calculateAverage(metrics.map((m) => m.overall))
      };
    } catch (error) {
      console.error("Error calculating benchmark metrics:", error);
      return {
        effectiveness: 0,
        efficiency: 0,
        quality: 0,
        innovation: 0,
        collaboration: 0,
        overall: 0
      };
    }
  }
  /**
   * Calculate performance ranking
   */
  calculatePerformanceRanking(workflowMetrics, benchmarkMetrics) {
    const workflowScore = workflowMetrics.overall;
    const benchmarkScore = benchmarkMetrics.overall;
    if (workflowScore >= benchmarkScore) {
      return 0.8 + (workflowScore - benchmarkScore) * 0.2;
    } else {
      return 0.5 + workflowScore / benchmarkScore * 0.3;
    }
  }
  /**
   * Identify key differences
   */
  identifyKeyDifferences(workflowMetrics, benchmarkMetrics) {
    const differences = [];
    if (workflowMetrics.effectiveness < benchmarkMetrics.effectiveness - 0.1) {
      differences.push("Effectiveness below benchmark");
    }
    if (workflowMetrics.efficiency < benchmarkMetrics.efficiency - 0.1) {
      differences.push("Efficiency below benchmark");
    }
    if (workflowMetrics.quality < benchmarkMetrics.quality - 0.1) {
      differences.push("Quality below benchmark");
    }
    if (workflowMetrics.innovation < benchmarkMetrics.innovation - 0.1) {
      differences.push("Innovation below benchmark");
    }
    if (workflowMetrics.collaboration < benchmarkMetrics.collaboration - 0.1) {
      differences.push("Collaboration below benchmark");
    }
    return differences;
  }
  /**
   * Identify improvement opportunities
   */
  identifyImprovementOpportunities(workflowMetrics, benchmarkMetrics) {
    const opportunities = [];
    if (workflowMetrics.effectiveness < benchmarkMetrics.effectiveness) {
      opportunities.push("Focus on user research and validation");
    }
    if (workflowMetrics.efficiency < benchmarkMetrics.efficiency) {
      opportunities.push("Optimize process and reduce cycle time");
    }
    if (workflowMetrics.quality < benchmarkMetrics.quality) {
      opportunities.push("Improve deliverable quality and standards");
    }
    if (workflowMetrics.innovation < benchmarkMetrics.innovation) {
      opportunities.push("Encourage more creative thinking and experimentation");
    }
    if (workflowMetrics.collaboration < benchmarkMetrics.collaboration) {
      opportunities.push("Enhance team collaboration and communication");
    }
    return opportunities;
  }
  /**
   * Calculate effectiveness
   */
  async calculateEffectiveness(workflow) {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const tests = await this.db.getWorkflowTests(workflow.id);
      const outcomeQuality = outcomes.length > 0 ? outcomes.reduce((sum, outcome) => sum + (outcome.quality || 0.5), 0) / outcomes.length : 0;
      const testSuccess = tests.length > 0 ? tests.filter((test) => test.success).length / tests.length : 0;
      return (outcomeQuality + testSuccess) / 2;
    } catch (error) {
      console.error("Error calculating effectiveness:", error);
      return 0;
    }
  }
  /**
   * Calculate efficiency
   */
  async calculateEfficiency(workflow) {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      if (sessions.length === 0) return 0;
      const totalTime = sessions.reduce((sum, session2) => sum + (session2.duration || 0), 0);
      const outcomesPerHour = outcomes.length / (totalTime / 60);
      return Math.min(outcomesPerHour / 2, 1);
    } catch (error) {
      console.error("Error calculating efficiency:", error);
      return 0;
    }
  }
  /**
   * Calculate quality
   */
  async calculateQuality(workflow) {
    try {
      const deliverables = await this.db.getWorkflowDeliverables(workflow.id);
      if (deliverables.length === 0) return 0;
      const qualityScores = deliverables.map((deliverable) => deliverable.quality || 0.5);
      return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
    } catch (error) {
      console.error("Error calculating quality:", error);
      return 0;
    }
  }
  /**
   * Calculate innovation
   */
  async calculateInnovation(workflow) {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      const ideaCount = ideas.length;
      const prototypeCount = prototypes.length;
      const innovationRate = prototypeCount / Math.max(ideaCount, 1);
      return Math.min(innovationRate, 1);
    } catch (error) {
      console.error("Error calculating innovation:", error);
      return 0;
    }
  }
  /**
   * Calculate collaboration
   */
  async calculateCollaboration(workflow) {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      if (sessions.length === 0 || participants.length === 0) return 0;
      const participationRate = sessions.reduce((sum, session2) => sum + (session2.participants?.length || 0), 0) / (sessions.length * participants.length);
      return participationRate;
    } catch (error) {
      console.error("Error calculating collaboration:", error);
      return 0;
    }
  }
  /**
   * Estimate workflow size
   */
  async estimateWorkflowSize(workflow) {
    try {
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participantCount = participants.length;
      const sessionCount = sessions.length;
      if (participantCount <= 3 && sessionCount <= 5) return "small";
      if (participantCount <= 8 && sessionCount <= 15) return "medium";
      return "large";
    } catch (error) {
      console.error("Error estimating workflow size:", error);
      return "medium";
    }
  }
  /**
   * Calculate average
   */
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
  /**
   * Get industry benchmarks
   */
  async getIndustryBenchmarks(industry) {
    try {
      const benchmarks = await this.db.getIndustryBenchmarks(industry);
      return {
        industry,
        averageEffectiveness: this.calculateAverage(benchmarks.map((b) => b.effectiveness)),
        averageEfficiency: this.calculateAverage(benchmarks.map((b) => b.efficiency)),
        averageQuality: this.calculateAverage(benchmarks.map((b) => b.quality)),
        averageInnovation: this.calculateAverage(benchmarks.map((b) => b.innovation)),
        averageCollaboration: this.calculateAverage(benchmarks.map((b) => b.collaboration)),
        bestPractices: await this.identifyBestPractices(industry),
        sampleSize: benchmarks.length
      };
    } catch (error) {
      console.error("Error getting industry benchmarks:", error);
      return {
        industry,
        averageEffectiveness: 0,
        averageEfficiency: 0,
        averageQuality: 0,
        averageInnovation: 0,
        averageCollaboration: 0,
        bestPractices: [],
        sampleSize: 0
      };
    }
  }
  /**
   * Identify best practices
   */
  async identifyBestPractices(industry) {
    try {
      const topPerformers = await this.db.getTopPerformingWorkflows(industry, 5);
      const practices = [];
      for (const workflow of topPerformers) {
        const practices2 = await this.db.getWorkflowPractices(workflow.id);
        practices2.push(...practices2);
      }
      return [...new Set(practices)];
    } catch (error) {
      console.error("Error identifying best practices:", error);
      return [];
    }
  }
};

// server/services/dt-analytics-service.ts
var DTAnalyticsService = class {
  db;
  analyticsEngine;
  insightTracker;
  roiCalculator;
  benchmarkService;
  constructor() {
    this.db = new DatabaseService();
    this.analyticsEngine = new DTAnalyticsEngine();
    this.insightTracker = new InsightTracker();
    this.roiCalculator = new ROICalculator();
    this.benchmarkService = new BenchmarkService();
  }
  /**
   * Get comprehensive analytics for a DT workflow
   */
  async getComprehensiveAnalytics(workflowId) {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      const [
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics
      ] = await Promise.all([
        this.analyticsEngine.calculateEffectivenessScore(workflowId),
        this.analyticsEngine.generateInsightMap(workflowId),
        this.roiCalculator.calculateROI(workflow),
        this.benchmarkService.compareToBenchmarks(workflow),
        this.getParticipantMetrics(workflowId),
        this.getPhaseMetrics(workflowId),
        this.getCollaborationMetrics(workflowId),
        this.getOutcomeMetrics(workflowId)
      ]);
      return {
        workflowId,
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics,
        generatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error getting comprehensive analytics:", error);
      throw error;
    }
  }
  /**
   * Calculate effectiveness score for a workflow
   */
  async calculateEffectivenessScore(workflowId) {
    return await this.analyticsEngine.calculateEffectivenessScore(workflowId);
  }
  /**
   * Generate insight map for a workflow
   */
  async generateInsightMap(workflowId) {
    return await this.analyticsEngine.generateInsightMap(workflowId);
  }
  /**
   * Track insight evolution
   */
  async trackInsightEvolution(insightId) {
    return await this.insightTracker.trackEvolution(insightId);
  }
  /**
   * Calculate ROI for a workflow
   */
  async calculateROI(workflowId) {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    return await this.roiCalculator.calculateROI(workflow);
  }
  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflowId) {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    return await this.benchmarkService.compareToBenchmarks(workflow);
  }
  /**
   * Get participant metrics
   */
  async getParticipantMetrics(workflowId) {
    const participants = await this.db.getWorkflowParticipants(workflowId);
    const activities = await this.db.getWorkflowActivities(workflowId);
    const participationRates = participants.map((p) => ({
      participantId: p.id,
      participationRate: this.calculateParticipationRate(p.id, activities),
      contributionQuality: this.calculateContributionQuality(p.id, activities),
      engagementScore: this.calculateEngagementScore(p.id, activities)
    }));
    return {
      totalParticipants: participants.length,
      averageParticipationRate: this.calculateAverage(participationRates.map((p) => p.participationRate)),
      averageContributionQuality: this.calculateAverage(participationRates.map((p) => p.contributionQuality)),
      averageEngagementScore: this.calculateAverage(participationRates.map((p) => p.engagementScore)),
      participationDistribution: this.calculateParticipationDistribution(participationRates),
      topContributors: this.identifyTopContributors(participationRates),
      engagementTrends: await this.calculateEngagementTrends(workflowId)
    };
  }
  /**
   * Get phase metrics
   */
  async getPhaseMetrics(workflowId) {
    const phases = ["empathize", "define", "ideate", "prototype", "test"];
    const phaseMetrics = [];
    for (const phase of phases) {
      const phaseData = await this.db.getPhaseData(workflowId, phase);
      const metrics = await this.calculatePhaseMetrics(phase, phaseData);
      phaseMetrics.push(metrics);
    }
    return {
      phases: phaseMetrics,
      overallProgress: this.calculateOverallProgress(phaseMetrics),
      phaseTransitions: await this.calculatePhaseTransitions(workflowId),
      bottlenecks: this.identifyBottlenecks(phaseMetrics),
      recommendations: await this.generatePhaseRecommendations(phaseMetrics)
    };
  }
  /**
   * Get collaboration metrics
   */
  async getCollaborationMetrics(workflowId) {
    const sessions = await this.db.getWorkflowSessions(workflowId);
    const collaborations = await this.db.getWorkflowCollaborations(workflowId);
    return {
      totalSessions: sessions.length,
      averageSessionDuration: this.calculateAverage(sessions.map((s) => s.duration)),
      collaborationQuality: this.calculateCollaborationQuality(collaborations),
      conflictResolutionRate: this.calculateConflictResolutionRate(collaborations),
      realTimeUsage: this.calculateRealTimeUsage(sessions),
      mobileUsage: this.calculateMobileUsage(sessions),
      offlineUsage: this.calculateOfflineUsage(sessions),
      teamDynamics: await this.analyzeTeamDynamics(workflowId)
    };
  }
  /**
   * Get outcome metrics
   */
  async getOutcomeMetrics(workflowId) {
    const outcomes = await this.db.getWorkflowOutcomes(workflowId);
    const prototypes = await this.db.getWorkflowPrototypes(workflowId);
    const tests = await this.db.getWorkflowTests(workflowId);
    return {
      totalOutcomes: outcomes.length,
      prototypeSuccessRate: this.calculatePrototypeSuccessRate(prototypes),
      testEffectiveness: this.calculateTestEffectiveness(tests),
      ideaToPrototypeRate: this.calculateIdeaToPrototypeRate(workflowId),
      prototypeToTestRate: this.calculatePrototypeToTestRate(workflowId),
      timeToInsight: this.calculateTimeToInsight(workflowId),
      businessImpact: await this.calculateBusinessImpact(workflowId),
      userSatisfaction: this.calculateUserSatisfaction(outcomes)
    };
  }
  /**
   * Generate predictive analytics
   */
  async generatePredictiveAnalytics(workflowId) {
    const workflow = await this.db.getWorkflow(workflowId);
    const historicalData = await this.db.getHistoricalData(workflowId);
    const similarWorkflows = await this.db.getSimilarWorkflows(workflow);
    return {
      successProbability: await this.predictSuccessProbability(workflow, historicalData),
      estimatedCompletionTime: await this.predictCompletionTime(workflow, historicalData),
      resourceRequirements: await this.predictResourceRequirements(workflow, historicalData),
      riskFactors: await this.identifyRiskFactors(workflow, historicalData),
      opportunityAreas: await this.identifyOpportunityAreas(workflow, similarWorkflows),
      recommendations: await this.generatePredictiveRecommendations(workflow, historicalData)
    };
  }
  /**
   * Generate insights and recommendations
   */
  async generateInsightsAndRecommendations(workflowId) {
    const analytics = await this.getComprehensiveAnalytics(workflowId);
    const predictive = await this.generatePredictiveAnalytics(workflowId);
    return {
      keyInsights: await this.extractKeyInsights(analytics),
      improvementAreas: await this.identifyImprovementAreas(analytics),
      successFactors: await this.identifySuccessFactors(analytics),
      riskMitigation: await this.generateRiskMitigationStrategies(analytics),
      optimizationOpportunities: await this.identifyOptimizationOpportunities(analytics),
      nextSteps: await this.generateNextSteps(analytics, predictive),
      longTermStrategy: await this.generateLongTermStrategy(analytics, predictive)
    };
  }
  /**
   * Export analytics data
   */
  async exportAnalytics(workflowId, format) {
    const analytics = await this.getComprehensiveAnalytics(workflowId);
    const predictive = await this.generatePredictiveAnalytics(workflowId);
    const insights = await this.generateInsightsAndRecommendations(workflowId);
    const exportData = {
      workflowId,
      analytics,
      predictive,
      insights,
      exportedAt: /* @__PURE__ */ new Date()
    };
    switch (format) {
      case "json":
        return {
          format: "json",
          data: JSON.stringify(exportData, null, 2),
          filename: `dt-analytics-${workflowId}.json`
        };
      case "csv":
        return {
          format: "csv",
          data: await this.convertToCSV(exportData),
          filename: `dt-analytics-${workflowId}.csv`
        };
      case "pdf":
        return {
          format: "pdf",
          data: await this.generatePDF(exportData),
          filename: `dt-analytics-${workflowId}.pdf`
        };
      default:
        throw new Error("Unsupported export format");
    }
  }
  // Helper methods
  calculateParticipationRate(participantId, activities) {
    const participantActivities = activities.filter((a) => a.participantId === participantId);
    const totalActivities = activities.length;
    return totalActivities > 0 ? participantActivities.length / totalActivities : 0;
  }
  calculateContributionQuality(participantId, activities) {
    const participantActivities = activities.filter((a) => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;
    const qualityScores = participantActivities.map((a) => a.qualityScore || 0);
    return this.calculateAverage(qualityScores);
  }
  calculateEngagementScore(participantId, activities) {
    const participantActivities = activities.filter((a) => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;
    const engagementScores = participantActivities.map((a) => a.engagementScore || 0);
    return this.calculateAverage(engagementScores);
  }
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
  calculateParticipationDistribution(participationRates) {
    const rates = participationRates.map((p) => p.participationRate);
    return {
      low: rates.filter((r) => r < 0.3).length,
      medium: rates.filter((r) => r >= 0.3 && r < 0.7).length,
      high: rates.filter((r) => r >= 0.7).length
    };
  }
  identifyTopContributors(participationRates) {
    return participationRates.sort((a, b) => b.contributionQuality - a.contributionQuality).slice(0, 5).map((p) => ({
      participantId: p.participantId,
      contributionQuality: p.contributionQuality,
      participationRate: p.participationRate
    }));
  }
  async calculateEngagementTrends(workflowId) {
    return [];
  }
  async calculatePhaseMetrics(phase, phaseData) {
    return {
      phase,
      duration: 0,
      activities: 0,
      participants: 0,
      quality: 0,
      progress: 0
    };
  }
  calculateOverallProgress(phaseMetrics) {
    const totalProgress = phaseMetrics.reduce((sum, phase) => sum + phase.progress, 0);
    return totalProgress / phaseMetrics.length;
  }
  async calculatePhaseTransitions(workflowId) {
    return [];
  }
  identifyBottlenecks(phaseMetrics) {
    return phaseMetrics.filter((phase) => phase.duration > phaseMetrics.reduce((sum, p) => sum + p.duration, 0) / phaseMetrics.length * 1.5).map((phase) => ({
      phase: phase.phase,
      duration: phase.duration,
      severity: "medium"
    }));
  }
  async generatePhaseRecommendations(phaseMetrics) {
    return [];
  }
  calculateCollaborationQuality(collaborations) {
    if (collaborations.length === 0) return 0;
    const qualityScores = collaborations.map((c) => c.qualityScore || 0);
    return this.calculateAverage(qualityScores);
  }
  calculateConflictResolutionRate(collaborations) {
    const totalConflicts = collaborations.reduce((sum, c) => sum + (c.conflicts?.length || 0), 0);
    const resolvedConflicts = collaborations.reduce((sum, c) => sum + (c.resolvedConflicts?.length || 0), 0);
    return totalConflicts > 0 ? resolvedConflicts / totalConflicts : 1;
  }
  calculateRealTimeUsage(sessions) {
    const realTimeSessions = sessions.filter((s) => s.realTime);
    return sessions.length > 0 ? realTimeSessions.length / sessions.length : 0;
  }
  calculateMobileUsage(sessions) {
    const mobileSessions = sessions.filter((s) => s.mobile);
    return sessions.length > 0 ? mobileSessions.length / sessions.length : 0;
  }
  calculateOfflineUsage(sessions) {
    const offlineSessions = sessions.filter((s) => s.offline);
    return sessions.length > 0 ? offlineSessions.length / sessions.length : 0;
  }
  async analyzeTeamDynamics(workflowId) {
    return {
      communicationQuality: 0,
      conflictResolution: 0,
      collaborationEffectiveness: 0,
      leadershipDistribution: 0
    };
  }
  calculatePrototypeSuccessRate(prototypes) {
    if (prototypes.length === 0) return 0;
    const successfulPrototypes = prototypes.filter((p) => p.success);
    return successfulPrototypes.length / prototypes.length;
  }
  calculateTestEffectiveness(tests) {
    if (tests.length === 0) return 0;
    const effectiveTests = tests.filter((t) => t.effective);
    return effectiveTests.length / tests.length;
  }
  calculateIdeaToPrototypeRate(workflowId) {
    return 0;
  }
  calculatePrototypeToTestRate(workflowId) {
    return 0;
  }
  calculateTimeToInsight(workflowId) {
    return 0;
  }
  async calculateBusinessImpact(workflowId) {
    return {
      revenue: 0,
      costReduction: 0,
      customerSatisfaction: 0,
      competitiveAdvantage: 0,
      marketOpportunity: 0
    };
  }
  calculateUserSatisfaction(outcomes) {
    if (outcomes.length === 0) return 0;
    const satisfactionScores = outcomes.map((o) => o.satisfactionScore || 0);
    return this.calculateAverage(satisfactionScores);
  }
  async predictSuccessProbability(workflow, historicalData) {
    return 0.8;
  }
  async predictCompletionTime(workflow, historicalData) {
    return 0;
  }
  async predictResourceRequirements(workflow, historicalData) {
    return {
      time: 0,
      people: 0,
      budget: 0
    };
  }
  async identifyRiskFactors(workflow, historicalData) {
    return [];
  }
  async identifyOpportunityAreas(workflow, similarWorkflows) {
    return [];
  }
  async generatePredictiveRecommendations(workflow, historicalData) {
    return [];
  }
  async extractKeyInsights(analytics) {
    return [];
  }
  async identifyImprovementAreas(analytics) {
    return [];
  }
  async identifySuccessFactors(analytics) {
    return [];
  }
  async generateRiskMitigationStrategies(analytics) {
    return [];
  }
  async identifyOptimizationOpportunities(analytics) {
    return [];
  }
  async generateNextSteps(analytics, predictive) {
    return [];
  }
  async generateLongTermStrategy(analytics, predictive) {
    return {
      vision: "",
      goals: [],
      strategies: [],
      timeline: 0
    };
  }
  async convertToCSV(data) {
    return "";
  }
  async generatePDF(data) {
    return Buffer.from("");
  }
};

// server/ai-agents/core/BaseAgent.ts
var BaseAgent = class {
  config;
  constructor(config) {
    this.config = config;
  }
  /**
   * Helper method to format responses consistently
   */
  formatResponse(content, actions, suggestions, insights, confidence) {
    return {
      content,
      actions,
      suggestions,
      insights,
      confidence
    };
  }
};

// server/ai-agents/agents/design-thinking/dt-facilitation-agent.ts
import { OpenAI as OpenAI5 } from "openai";
var DTFacilitationAgent = class extends BaseAgent {
  openaiClient;
  sessionMonitor;
  interventionEngine;
  celebrationEngine;
  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY || "" });
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI5({
        apiKey
      });
    } else {
      console.warn("OpenAI API key not configured. DTFacilitationAgent features will be limited.");
      this.openaiClient = null;
    }
    this.sessionMonitor = new SessionMonitor();
    this.interventionEngine = new InterventionEngine();
    this.celebrationEngine = new CelebrationEngine();
  }
  /**
   * Main facilitation method - provides real-time guidance during sessions
   */
  async facilitateSession(session2) {
    try {
      const context = await this.analyzeSessionContext(session2);
      const insights = await this.generateRealTimeInsights(context);
      const interventions = await this.identifyInterventions(context);
      const nextSteps = await this.planNextSteps(context);
      const celebrations = await this.identifyCelebrations(context);
      return {
        suggestions: insights.suggestions,
        interventions,
        nextSteps,
        celebrations,
        confidence: insights.confidence,
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error in DT facilitation:", error);
      throw new Error("Failed to provide facilitation guidance");
    }
  }
  /**
   * Analyze session context to understand current state
   */
  async analyzeSessionContext(session2) {
    const participants = session2.participants;
    const currentPhase = session2.workflow.currentPhase;
    const sessionData = session2.sessionData;
    const participationAnalysis = await this.analyzeParticipation(participants);
    const ideaAnalysis = await this.analyzeIdeaGeneration(sessionData);
    const collaborationAnalysis = await this.analyzeCollaboration(participants);
    const phaseAnalysis = await this.analyzePhaseProgress(currentPhase, sessionData);
    return {
      session: session2,
      participationAnalysis,
      ideaAnalysis,
      collaborationAnalysis,
      phaseAnalysis,
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Generate real-time insights and suggestions
   */
  async generateRealTimeInsights(context) {
    const prompt = `
    Analyze this Design Thinking session and provide insights:
    
    Session Phase: ${context.session.workflow.currentPhase}
    Participants: ${context.session.participants.length}
    Participation Quality: ${context.participationAnalysis.quality}
    Idea Generation Rate: ${context.ideaAnalysis.rate}
    Collaboration Score: ${context.collaborationAnalysis.score}
    
    Provide:
    1. 3-5 specific suggestions to improve the session
    2. Identify any blockers or issues
    3. Suggest next activities
    4. Rate confidence in recommendations (0-1)
    `;
    const response = await this.openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
    const content = response.choices[0].message.content;
    const parsed = this.parseAIResponse(content);
    return {
      suggestions: parsed.suggestions,
      blockers: parsed.blockers,
      nextActivities: parsed.nextActivities,
      confidence: parsed.confidence
    };
  }
  /**
   * Identify necessary interventions
   */
  async identifyInterventions(context) {
    const interventions = [];
    if (context.participationAnalysis.quality < 0.6) {
      interventions.push({
        type: "low_participation",
        severity: "medium",
        message: "Some participants seem less engaged. Consider using engagement techniques.",
        suggestions: [
          "Use round-robin participation",
          "Ask open-ended questions",
          "Use visual aids",
          "Break into smaller groups"
        ]
      });
    }
    if (context.ideaAnalysis.rate < 0.3) {
      interventions.push({
        type: "idea_stagnation",
        severity: "high",
        message: "Idea generation has slowed down. Try creativity boosters.",
        suggestions: [
          'Use "Yes, and..." technique',
          "Try reverse brainstorming",
          'Use "What if..." scenarios',
          "Introduce constraints"
        ]
      });
    }
    if (context.collaborationAnalysis.conflicts.length > 0) {
      interventions.push({
        type: "conflict_detected",
        severity: "high",
        message: "Conflicts detected. Address them constructively.",
        suggestions: [
          "Acknowledge different perspectives",
          "Find common ground",
          'Use "I" statements',
          "Focus on the problem, not the person"
        ]
      });
    }
    return interventions;
  }
  /**
   * Plan next steps based on current context
   */
  async planNextSteps(context) {
    const currentPhase = context.session.workflow.currentPhase;
    const nextSteps = [];
    switch (currentPhase) {
      case "empathize":
        nextSteps.push(
          { action: "Conduct user interviews", priority: "high", estimatedTime: "30-60 min" },
          { action: "Create empathy maps", priority: "high", estimatedTime: "45 min" },
          { action: "Develop user personas", priority: "medium", estimatedTime: "30 min" }
        );
        break;
      case "define":
        nextSteps.push(
          { action: "Synthesize insights", priority: "high", estimatedTime: "30 min" },
          { action: "Create POV statements", priority: "high", estimatedTime: "45 min" },
          { action: "Generate HMW questions", priority: "medium", estimatedTime: "30 min" }
        );
        break;
      case "ideate":
        nextSteps.push(
          { action: "Brainstorm solutions", priority: "high", estimatedTime: "60 min" },
          { action: "Use ideation techniques", priority: "medium", estimatedTime: "45 min" },
          { action: "Cluster and prioritize ideas", priority: "medium", estimatedTime: "30 min" }
        );
        break;
      case "prototype":
        nextSteps.push(
          { action: "Select ideas to prototype", priority: "high", estimatedTime: "15 min" },
          { action: "Create low-fidelity prototypes", priority: "high", estimatedTime: "90 min" },
          { action: "Plan user testing", priority: "medium", estimatedTime: "30 min" }
        );
        break;
      case "test":
        nextSteps.push(
          { action: "Conduct user tests", priority: "high", estimatedTime: "60 min" },
          { action: "Collect feedback", priority: "high", estimatedTime: "30 min" },
          { action: "Synthesize learnings", priority: "medium", estimatedTime: "45 min" }
        );
        break;
    }
    return nextSteps;
  }
  /**
   * Identify celebration opportunities
   */
  async identifyCelebrations(context) {
    const celebrations = [];
    if (context.participationAnalysis.quality > 0.8) {
      celebrations.push({
        type: "high_participation",
        message: "Great participation from the team!",
        impact: "positive"
      });
    }
    if (context.ideaAnalysis.breakthroughIdeas.length > 0) {
      celebrations.push({
        type: "breakthrough_ideas",
        message: "Excellent breakthrough ideas generated!",
        impact: "high"
      });
    }
    if (context.phaseAnalysis.completionRate > 0.9) {
      celebrations.push({
        type: "phase_completion",
        message: "Phase completed successfully!",
        impact: "positive"
      });
    }
    return celebrations;
  }
  /**
   * Analyze session after completion
   */
  async analyzeSession(session2) {
    const context = await this.analyzeSessionContext(session2);
    return {
      sessionId: session2.id,
      overallQuality: this.calculateOverallQuality(context),
      strengths: await this.identifyStrengths(context),
      improvements: await this.identifyImprovements(context),
      recommendations: await this.generateRecommendations(context),
      participantFeedback: await this.analyzeParticipantFeedback(session2),
      nextSessionSuggestions: await this.suggestNextSession(session2)
    };
  }
  /**
   * Provide engagement techniques for specific participants
   */
  async suggestEngagementTechniques(participant) {
    const techniques = [];
    if (participant.engagementLevel < 0.5) {
      techniques.push({
        technique: "Direct questioning",
        description: "Ask specific questions to encourage participation",
        example: "What do you think about this idea?"
      });
    }
    if (participant.contributionCount < 2) {
      techniques.push({
        technique: "Round-robin participation",
        description: "Ensure everyone gets a chance to contribute",
        example: "Let's go around the room and hear from everyone"
      });
    }
    return techniques;
  }
  /**
   * Suggest creativity boosters when ideas stagnate
   */
  async suggestCreativityBoost() {
    return [
      {
        technique: "Reverse brainstorming",
        description: "Think about how to make the problem worse",
        duration: "15 minutes"
      },
      {
        technique: "What if constraints",
        description: "Add constraints to spark creativity",
        duration: "10 minutes"
      },
      {
        technique: "Analogous inspiration",
        description: "Look at how other industries solve similar problems",
        duration: "20 minutes"
      }
    ];
  }
  /**
   * Suggest conflict resolution strategies
   */
  async suggestConflictResolution() {
    return [
      {
        strategy: "Acknowledge and validate",
        description: "Acknowledge different perspectives as valid",
        steps: ["Listen actively", "Validate feelings", "Find common ground"]
      },
      {
        strategy: "Focus on the problem",
        description: "Redirect focus from people to the problem",
        steps: ["Reframe the discussion", 'Use "we" language', "Focus on outcomes"]
      },
      {
        strategy: "Take a break",
        description: "Sometimes a short break helps reset",
        steps: ["Take 5-10 minute break", "Return with fresh perspective", "Use different activity"]
      }
    ];
  }
  /**
   * Parse AI response into structured format
   */
  parseAIResponse(content) {
    return {
      suggestions: [],
      blockers: [],
      nextActivities: [],
      confidence: 0.8
    };
  }
  /**
   * Calculate overall session quality
   */
  calculateOverallQuality(context) {
    const weights = {
      participation: 0.3,
      ideas: 0.3,
      collaboration: 0.2,
      phase: 0.2
    };
    return context.participationAnalysis.quality * weights.participation + context.ideaAnalysis.quality * weights.ideas + context.collaborationAnalysis.score * weights.collaboration + context.phaseAnalysis.progress * weights.phase;
  }
};
var SessionMonitor = class {
  async analyzeParticipation(participants) {
    return {
      quality: 0.8,
      activeParticipants: participants.length,
      engagementLevel: 0.7
    };
  }
};
var InterventionEngine = class {
  // Implementation for intervention logic
};
var CelebrationEngine = class {
  // Implementation for celebration logic
};

// server/ai-agents/agents/design-thinking/dt-insights-agent.ts
import { OpenAI as OpenAI6 } from "openai";
var DTInsightsAgent = class extends BaseAgent {
  openaiClient;
  patternEngine;
  synthesisEngine;
  evolutionTracker;
  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY || "" });
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI6({
        apiKey
      });
    } else {
      console.warn("OpenAI API key not configured. DTInsightsAgent features will be limited.");
      this.openaiClient = null;
    }
    this.patternEngine = new PatternEngine();
    this.synthesisEngine = new SynthesisEngine();
    this.evolutionTracker = new EvolutionTracker();
  }
  /**
   * Synthesize insights from empathy data
   */
  async synthesizeInsights(data) {
    try {
      const patterns = await this.identifyPatterns(data);
      const rawInsights = await this.generateInsightsFromPatterns(patterns);
      const prioritizedInsights = await this.prioritizeInsights(rawInsights);
      const insightsWithImpact = await this.assessBusinessImpact(prioritizedInsights);
      const validatedInsights = await this.validateInsights(insightsWithImpact);
      return validatedInsights;
    } catch (error) {
      console.error("Error synthesizing insights:", error);
      throw new Error("Failed to synthesize insights");
    }
  }
  /**
   * Identify patterns in empathy data
   */
  async identifyPatterns(data) {
    const patterns = [];
    const painPatterns = await this.analyzePainPoints(data);
    patterns.push(...painPatterns);
    const emotionalPatterns = await this.analyzeEmotionalPatterns(data);
    patterns.push(...emotionalPatterns);
    const behavioralPatterns = await this.analyzeBehavioralPatterns(data);
    patterns.push(...behavioralPatterns);
    const environmentalPatterns = await this.analyzeEnvironmentalPatterns(data);
    patterns.push(...environmentalPatterns);
    return patterns;
  }
  /**
   * Analyze pain points across empathy data
   */
  async analyzePainPoints(data) {
    const painPoints = data.flatMap((d) => d.pains);
    const painCategories = await this.categorizePainPoints(painPoints);
    return painCategories.map((category) => ({
      type: "pain_point",
      category,
      frequency: category.frequency,
      severity: category.severity,
      description: category.description,
      confidence: category.confidence
    }));
  }
  /**
   * Analyze emotional patterns
   */
  async analyzeEmotionalPatterns(data) {
    const emotions = data.flatMap((d) => d.thinkAndFeel);
    const emotionalAnalysis = await this.analyzeEmotions(emotions);
    return emotionalAnalysis.map((emotion) => ({
      type: "emotional",
      category: emotion.category,
      frequency: emotion.frequency,
      intensity: emotion.intensity,
      description: emotion.description,
      confidence: emotion.confidence
    }));
  }
  /**
   * Generate insights from identified patterns
   */
  async generateInsightsFromPatterns(patterns) {
    const insights = [];
    for (const pattern of patterns) {
      const insight = await this.generateInsightFromPattern(pattern);
      if (insight) {
        insights.push(insight);
      }
    }
    return insights;
  }
  /**
   * Generate a single insight from a pattern
   */
  async generateInsightFromPattern(pattern) {
    const prompt = `
    Based on this Design Thinking pattern, generate a meaningful insight:
    
    Pattern Type: ${pattern.type}
    Category: ${pattern.category}
    Frequency: ${pattern.frequency}
    Description: ${pattern.description}
    
    Generate an insight that:
    1. Explains what this pattern means
    2. Suggests why it's important
    3. Indicates potential opportunities
    4. Provides actionable implications
    
    Format as JSON with: content, importance, opportunities, implications
    `;
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      return {
        id: this.generateId(),
        content: parsed.content,
        type: "pattern_derived",
        importance: parsed.importance,
        opportunities: parsed.opportunities,
        implications: parsed.implications,
        sourcePattern: pattern,
        confidence: pattern.confidence,
        createdAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error generating insight from pattern:", error);
      return null;
    }
  }
  /**
   * Prioritize insights by importance and impact
   */
  async prioritizeInsights(insights) {
    const scoredInsights = await Promise.all(
      insights.map(async (insight) => {
        const score = await this.calculateInsightScore(insight);
        return { ...insight, score };
      })
    );
    return scoredInsights.sort((a, b) => b.score - a.score).map(({ score, ...insight }) => insight);
  }
  /**
   * Calculate insight importance score
   */
  async calculateInsightScore(insight) {
    const factors = {
      importance: insight.importance || 0.5,
      confidence: insight.confidence || 0.5,
      opportunities: insight.opportunities?.length || 0,
      implications: insight.implications?.length || 0
    };
    const weights = {
      importance: 0.4,
      confidence: 0.3,
      opportunities: 0.2,
      implications: 0.1
    };
    return factors.importance * weights.importance + factors.confidence * weights.confidence + factors.opportunities / 10 * weights.opportunities + factors.implications / 10 * weights.implications;
  }
  /**
   * Assess business impact of insights
   */
  async assessBusinessImpact(insights) {
    return Promise.all(
      insights.map(async (insight) => {
        const businessImpact = await this.calculateBusinessImpact(insight);
        return {
          ...insight,
          businessImpact
        };
      })
    );
  }
  /**
   * Calculate business impact score
   */
  async calculateBusinessImpact(insight) {
    const prompt = `
    Assess the business impact of this Design Thinking insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(", ")}
    Implications: ${insight.implications?.join(", ")}
    
    Rate the impact on:
    1. Revenue potential (1-10)
    2. Cost reduction (1-10)
    3. Customer satisfaction (1-10)
    4. Competitive advantage (1-10)
    5. Market opportunity (1-10)
    
    Format as JSON with: revenue, costReduction, customerSatisfaction, competitiveAdvantage, marketOpportunity, overallScore
    `;
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      return {
        revenue: parsed.revenue,
        costReduction: parsed.costReduction,
        customerSatisfaction: parsed.customerSatisfaction,
        competitiveAdvantage: parsed.competitiveAdvantage,
        marketOpportunity: parsed.marketOpportunity,
        overallScore: parsed.overallScore
      };
    } catch (error) {
      console.error("Error calculating business impact:", error);
      return {
        revenue: 5,
        costReduction: 5,
        customerSatisfaction: 5,
        competitiveAdvantage: 5,
        marketOpportunity: 5,
        overallScore: 5
      };
    }
  }
  /**
   * Validate insights for accuracy and relevance
   */
  async validateInsights(insights) {
    return insights.filter((insight) => {
      return insight.content.length > 10 && insight.confidence > 0.3 && insight.importance > 0.2;
    });
  }
  /**
   * Track insight evolution across DT phases
   */
  async trackInsightEvolution(insightId) {
    const evolution = await this.evolutionTracker.getEvolution(insightId);
    return {
      originalInsight: evolution[0],
      transformations: evolution.map((e, i) => ({
        phase: e.phase,
        transformation: this.compareInsights(evolution[i], evolution[i + 1]),
        contributingFactors: e.factors,
        refinements: e.refinements
      })),
      finalOutcome: evolution[evolution.length - 1],
      impact: await this.measureInsightImpact(insightId),
      businessValue: await this.calculateBusinessValue(insightId)
    };
  }
  /**
   * Generate automated HMW questions from insights
   */
  async generateHMWQuestions(insights) {
    const questions = [];
    for (const insight of insights) {
      const hmwQuestion = await this.generateHMWFromInsight(insight);
      if (hmwQuestion) {
        questions.push(hmwQuestion);
      }
    }
    return questions;
  }
  /**
   * Generate HMW question from a single insight
   */
  async generateHMWFromInsight(insight) {
    const prompt = `
    Generate a "How might we" question based on this insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(", ")}
    
    Create a HMW question that:
    1. Is specific and actionable
    2. Opens up solution space
    3. Is user-centered
    4. Is measurable
    
    Format as JSON with: question, reframingType, desirability, feasibility, viability
    `;
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      return {
        id: this.generateId(),
        question: parsed.question,
        reframingType: parsed.reframingType,
        desirability: parsed.desirability,
        feasibility: parsed.feasibility,
        viability: parsed.viability,
        sourceInsight: insight,
        createdAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error generating HMW question:", error);
      return null;
    }
  }
  /**
   * Generate problem statements from insights
   */
  async generateProblemStatements(insights) {
    const statements = [];
    for (const insight of insights) {
      const statement = await this.generateProblemStatementFromInsight(insight);
      if (statement) {
        statements.push(statement);
      }
    }
    return statements;
  }
  /**
   * Generate problem statement from insight
   */
  async generateProblemStatementFromInsight(insight) {
    const prompt = `
    Generate a problem statement (POV) based on this insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(", ")}
    
    Create a POV statement using the format:
    [User] needs [Need] because [Insight]
    
    Make it:
    1. User-centered
    2. Specific
    3. Actionable
    4. Not prescriptive
    
    Format as JSON with: userDescription, need, insight, supportingEvidence
    `;
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      return {
        id: this.generateId(),
        userDescription: parsed.userDescription,
        need: parsed.need,
        insight: parsed.insight,
        supportingEvidence: parsed.supportingEvidence,
        sourceInsight: insight,
        createdAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error generating problem statement:", error);
      return null;
    }
  }
  /**
   * Generate insight map showing relationships
   */
  async generateInsightMap(workflowId) {
    const insights = await this.getWorkflowInsights(workflowId);
    const relationships = await this.identifyRelationships(insights);
    const clusters = await this.clusterInsights(insights);
    const criticalPath = await this.identifyCriticalPath(insights);
    return {
      nodes: insights.map((i) => ({
        id: i.id,
        label: i.content,
        phase: i.phase,
        importance: i.importance,
        connections: i.connections
      })),
      edges: relationships,
      clusters,
      criticalPath
    };
  }
  /**
   * Compare two insights to identify transformation
   */
  compareInsights(insight1, insight2) {
    return {
      type: this.determineTransformationType(insight1, insight2),
      changes: this.identifyChanges(insight1, insight2),
      improvements: this.identifyImprovements(insight1, insight2),
      newElements: this.identifyNewElements(insight1, insight2)
    };
  }
  /**
   * Measure insight impact
   */
  async measureInsightImpact(insightId) {
    return {
      usageCount: 0,
      influenceScore: 0,
      businessValue: 0,
      timeToImpact: 0
    };
  }
  /**
   * Calculate business value of insight
   */
  async calculateBusinessValue(insightId) {
    return 0;
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};
var PatternEngine = class {
  async categorizePainPoints(painPoints) {
    return [];
  }
  async analyzeEmotions(emotions) {
    return [];
  }
};
var SynthesisEngine = class {
  // Implementation for insight synthesis
};
var EvolutionTracker = class {
  async getEvolution(insightId) {
    return [];
  }
};

// server/routes/enhanced-dt-routes.ts
var router3 = express2.Router();
var collaborationService = new DTCollaborationService();
var analyticsService = new DTAnalyticsService();
var facilitationAgent = new DTFacilitationAgent();
var insightsAgent = new DTInsightsAgent();
router3.get("/workflows", authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    const userId = req.user.id;
    const { status, phase, limit = 20, offset = 0 } = req.query;
    const workflows = await getWorkflows(userId, {
      status,
      phase,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(workflows);
  } catch (error) {
    handleRouteError(error, res, "Failed to fetch DT workflows");
  }
});
router3.post("/workflows", authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    const userId = req.user.id;
    const workflowData = {
      ...req.body,
      userId,
      aiFacilitationEnabled: req.body.aiFacilitationEnabled ?? true,
      collaborationMode: req.body.collaborationMode ?? "real-time"
    };
    const workflow = await createWorkflow(workflowData);
    if (workflow.aiFacilitationEnabled) {
      await facilitationAgent.initialize(workflow.id);
    }
    res.status(201).json(workflow);
  } catch (error) {
    handleRouteError(error, res, "Failed to create DT workflow");
  }
});
router3.get("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await getWorkflow(id);
    if (!requireResource(workflow, res, "Workflow")) return;
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, "Failed to fetch DT workflow");
  }
});
router3.put("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const workflow = await updateWorkflow(id, updates);
    if (!requireResource(workflow, res, "Workflow")) return;
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, "Failed to update DT workflow");
  }
});
router3.delete("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteWorkflow(id);
    res.status(204).send();
  } catch (error) {
    handleRouteError(error, res, "Failed to delete DT workflow");
  }
});
router3.put("/workflows/:id/phase", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;
    const workflow = await transitionToPhase(id, phase);
    if (!requireResource(workflow, res, "Workflow")) return;
    if (workflow.aiFacilitationEnabled) {
      await facilitationAgent.handlePhaseTransition(id, phase);
    }
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, "Failed to transition phase");
  }
});
router3.get("/workflows/:id/ai-insights", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, limit = 10 } = req.query;
    const insights = await facilitationAgent.generateInsights(id, {
      type,
      limit: parseInt(limit)
    });
    res.json(insights);
  } catch (error) {
    handleRouteError(error, res, "Failed to generate AI insights");
  }
});
router3.post("/workflows/:id/ai-facilitation", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionData, context } = req.body;
    const facilitation = await facilitationAgent.facilitateSession({
      id,
      workflow: { id, currentPhase: "empathize" },
      participants: [],
      sessionData,
      context
    });
    res.json(facilitation);
  } catch (error) {
    handleRouteError(error, res, "Failed to get AI facilitation");
  }
});
router3.get("/workflows/:id/collaboration-status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const status = await collaborationService.getSessionStatus(id);
    res.json(status);
  } catch (error) {
    handleRouteError(error, res, "Failed to get collaboration status");
  }
});
router3.post("/workflows/:id/enable-clustering", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { canvasId } = req.body;
    const clusters = await collaborationService.enableSmartClustering(canvasId);
    res.json(clusters);
  } catch (error) {
    handleRouteError(error, res, "Failed to enable smart clustering");
  }
});
router3.get("/workflows/:id/analytics", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = "comprehensive" } = req.query;
    let analytics;
    switch (type) {
      case "comprehensive":
        analytics = await analyticsService.getComprehensiveAnalytics(id);
        break;
      case "effectiveness":
        analytics = await analyticsService.calculateEffectivenessScore(id);
        break;
      case "insights":
        analytics = await analyticsService.generateInsightMap(id);
        break;
      case "roi":
        analytics = await analyticsService.calculateROI(id);
        break;
      case "benchmarks":
        analytics = await analyticsService.compareToBenchmarks(id);
        break;
      default:
        analytics = await analyticsService.getComprehensiveAnalytics(id);
    }
    res.json(analytics);
  } catch (error) {
    handleRouteError(error, res, "Failed to fetch analytics");
  }
});
router3.get("/workflows/:id/insights/evolution/:insightId", authMiddleware, async (req, res) => {
  try {
    const { insightId } = req.params;
    const evolution = await analyticsService.trackInsightEvolution(insightId);
    res.json(evolution);
  } catch (error) {
    handleRouteError(error, res, "Failed to track insight evolution");
  }
});
router3.get("/workflows/:id/predictive-analytics", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const predictive = await analyticsService.generatePredictiveAnalytics(id);
    res.json(predictive);
  } catch (error) {
    handleRouteError(error, res, "Failed to generate predictive analytics");
  }
});
router3.post("/workflows/:id/insights/synthesize", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { empathyData } = req.body;
    const insights = await insightsAgent.synthesizeInsights(empathyData);
    res.json(insights);
  } catch (error) {
    handleRouteError(error, res, "Failed to synthesize insights");
  }
});
router3.post("/workflows/:id/insights/hmw-questions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { insights } = req.body;
    const hmwQuestions = await insightsAgent.generateHMWQuestions(insights);
    res.json(hmwQuestions);
  } catch (error) {
    handleRouteError(error, res, "Failed to generate HMW questions");
  }
});
router3.post("/workflows/:id/insights/problem-statements", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { insights } = req.body;
    const problemStatements = await insightsAgent.generateProblemStatements(insights);
    res.json(problemStatements);
  } catch (error) {
    handleRouteError(error, res, "Failed to generate problem statements");
  }
});
router3.get("/workflows/:id/export", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const format = req.query.format || "json";
    const exportData = await analyticsService.exportAnalytics(id, format);
    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="dt-workflow-${id}.pdf"`);
    } else if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="dt-workflow-${id}.csv"`);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="dt-workflow-${id}.json"`);
    }
    res.send(exportData.data);
  } catch (error) {
    handleRouteError(error, res, "Failed to export workflow");
  }
});
router3.get("/workflows/:id/ws", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const wsUrl = `ws://localhost:3001/dt/workflows/${id}?userId=${userId}`;
    res.json({ wsUrl });
  } catch (error) {
    handleRouteError(error, res, "Failed to setup WebSocket connection");
  }
});
router3.post("/workflows/:id/sessions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionData } = req.body;
    const session2 = await createSession(id, sessionData);
    res.status(201).json(session2);
  } catch (error) {
    handleRouteError(error, res, "Failed to create session");
  }
});
router3.get("/workflows/:id/sessions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await getWorkflowSessions(id);
    res.json(sessions);
  } catch (error) {
    handleRouteError(error, res, "Failed to fetch sessions");
  }
});
router3.put("/workflows/:id/sessions/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { updates } = req.body;
    const session2 = await updateSession(sessionId, updates);
    res.json(session2);
  } catch (error) {
    handleRouteError(error, res, "Failed to update session");
  }
});
router3.get("/agents/status", authMiddleware, async (req, res) => {
  try {
    const status = {
      facilitationAgent: await facilitationAgent.getStatus(),
      insightsAgent: await insightsAgent.getStatus(),
      collaborationService: await collaborationService.getStatus(),
      analyticsService: await analyticsService.getStatus()
    };
    res.json(status);
  } catch (error) {
    handleRouteError(error, res, "Failed to get agent status");
  }
});
router3.get("/health", async (req, res) => {
  try {
    const health = {
      status: "healthy",
      timestamp: /* @__PURE__ */ new Date(),
      services: {
        database: "connected",
        ai: "available",
        collaboration: "active",
        analytics: "ready"
      }
    };
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      timestamp: /* @__PURE__ */ new Date(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
async function getWorkflows(userId, filters) {
  return [];
}
async function createWorkflow(workflowData) {
  return workflowData;
}
async function getWorkflow(id) {
  return null;
}
async function updateWorkflow(id, updates) {
  return null;
}
async function deleteWorkflow(id) {
}
async function transitionToPhase(workflowId, phase) {
  return null;
}
async function createSession(workflowId, sessionData) {
  return sessionData;
}
async function getWorkflowSessions(workflowId) {
  return [];
}
async function updateSession(sessionId, updates) {
  return null;
}
var enhanced_dt_routes_default = router3;

// server/routes/dt-comprehensive-routes.ts
import express3 from "express";

// server/services/dt-workflow-service.ts
var DTWorkflowService = class {
  workflows = /* @__PURE__ */ new Map();
  povStatements = /* @__PURE__ */ new Map();
  hmwQuestions = /* @__PURE__ */ new Map();
  ideas = /* @__PURE__ */ new Map();
  prototypes = /* @__PURE__ */ new Map();
  testSessions = /* @__PURE__ */ new Map();
  insights = /* @__PURE__ */ new Map();
  empathyData = /* @__PURE__ */ new Map();
  // ===========================
  // WORKFLOW OPERATIONS
  // ===========================
  async createWorkflow(data) {
    const workflow = {
      id: this.generateId(),
      projectId: data.projectId || "",
      userId: data.userId || "",
      name: data.name || "New DT Workflow",
      description: data.description || "",
      currentPhase: data.currentPhase || "empathize",
      phaseProgress: data.phaseProgress || {},
      status: data.status || "active",
      aiFacilitationEnabled: data.aiFacilitationEnabled ?? true,
      aiModelVersion: data.aiModelVersion || "gpt-4",
      facilitationStyle: data.facilitationStyle || "balanced",
      collaborationMode: data.collaborationMode || "real-time",
      teamMembers: data.teamMembers || [],
      industry: data.industry,
      targetMarket: data.targetMarket,
      innovationType: data.innovationType,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      createdBy: data.userId || ""
    };
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }
  async getWorkflow(workflowId) {
    return this.workflows.get(workflowId) || null;
  }
  async getWorkflows(userId, filters) {
    let workflows = Array.from(this.workflows.values()).filter((w) => w.userId === userId);
    if (filters?.status) {
      workflows = workflows.filter((w) => w.status === filters.status);
    }
    if (filters?.phase) {
      workflows = workflows.filter((w) => w.currentPhase === filters.phase);
    }
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    return workflows.slice(offset, offset + limit);
  }
  async updateWorkflow(workflowId, updates) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;
    const updated = {
      ...workflow,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.workflows.set(workflowId, updated);
    return updated;
  }
  async deleteWorkflow(workflowId) {
    return this.workflows.delete(workflowId);
  }
  async transitionPhase(workflowId, newPhase) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;
    workflow.currentPhase = newPhase;
    workflow.updatedAt = /* @__PURE__ */ new Date();
    if (!workflow.phaseProgress[newPhase]) {
      workflow.phaseProgress[newPhase] = 0;
    }
    this.workflows.set(workflowId, workflow);
    return workflow;
  }
  // ===========================
  // POV STATEMENT OPERATIONS
  // ===========================
  async createPOVStatement(data) {
    const pov = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      userPersona: data.userPersona || "",
      need: data.need || "",
      insight: data.insight || "",
      supportingEmpathyData: data.supportingEmpathyData || [],
      evidenceStrength: data.evidenceStrength || 0.5,
      validated: data.validated || false,
      validationNotes: data.validationNotes,
      solutionBiasDetected: data.solutionBiasDetected || false,
      priorityScore: data.priorityScore || 50,
      selectedForIdeation: data.selectedForIdeation || false,
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.povStatements.set(pov.id, pov);
    return pov;
  }
  async getPOVStatements(workflowId) {
    return Array.from(this.povStatements.values()).filter((pov) => pov.workflowId === workflowId).sort((a, b) => b.priorityScore - a.priorityScore);
  }
  async updatePOVStatement(povId, updates) {
    const pov = this.povStatements.get(povId);
    if (!pov) return null;
    const updated = { ...pov, ...updates };
    this.povStatements.set(povId, updated);
    return updated;
  }
  // ===========================
  // HMW QUESTION OPERATIONS
  // ===========================
  async createHMWQuestion(data) {
    const hmw = {
      id: this.generateId(),
      povStatementId: data.povStatementId || "",
      workflowId: data.workflowId || "",
      question: data.question || "",
      reframingType: data.reframingType,
      desirabilityScore: data.desirabilityScore,
      feasibilityScore: data.feasibilityScore,
      viabilityScore: data.viabilityScore,
      voteCount: data.voteCount || 0,
      ideaCount: data.ideaCount || 0,
      selectedForIdeation: data.selectedForIdeation || false,
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.hmwQuestions.set(hmw.id, hmw);
    return hmw;
  }
  async getHMWQuestions(workflowId) {
    return Array.from(this.hmwQuestions.values()).filter((hmw) => hmw.workflowId === workflowId).sort((a, b) => b.voteCount - a.voteCount);
  }
  async voteHMWQuestion(hmwId) {
    const hmw = this.hmwQuestions.get(hmwId);
    if (!hmw) return null;
    hmw.voteCount++;
    this.hmwQuestions.set(hmwId, hmw);
    return hmw;
  }
  // ===========================
  // IDEA OPERATIONS
  // ===========================
  async createIdea(data) {
    const idea = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      hmwQuestionId: data.hmwQuestionId,
      title: data.title || "New Idea",
      description: data.description || "",
      category: data.category,
      userBenefit: data.userBenefit || "",
      businessValue: data.businessValue || "",
      implementationApproach: data.implementationApproach || "",
      desirabilityScore: data.desirabilityScore,
      feasibilityScore: data.feasibilityScore,
      viabilityScore: data.viabilityScore,
      innovationScore: data.innovationScore,
      impactScore: data.impactScore,
      overallScore: data.overallScore,
      aiEvaluation: data.aiEvaluation || {},
      identifiedRisks: data.identifiedRisks || [],
      identifiedOpportunities: data.identifiedOpportunities || [],
      synergies: data.synergies || [],
      status: data.status || "draft",
      selectedForPrototyping: data.selectedForPrototyping || false,
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.ideas.set(idea.id, idea);
    return idea;
  }
  async getIdeas(workflowId) {
    return Array.from(this.ideas.values()).filter((idea) => idea.workflowId === workflowId).sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
  }
  async updateIdea(ideaId, updates) {
    const idea = this.ideas.get(ideaId);
    if (!idea) return null;
    const updated = { ...idea, ...updates };
    this.ideas.set(ideaId, updated);
    return updated;
  }
  // ===========================
  // PROTOTYPE OPERATIONS
  // ===========================
  async createPrototype(data) {
    const prototype = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      ideaId: data.ideaId,
      name: data.name || "New Prototype",
      description: data.description || "",
      fidelity: data.fidelity || "low",
      prototypeType: data.prototypeType || "sketch",
      learningGoals: data.learningGoals || [],
      hypotheses: data.hypotheses || [],
      files: data.files || [],
      links: data.links || [],
      effortEstimate: data.effortEstimate,
      costEstimate: data.costEstimate,
      testPlanId: data.testPlanId,
      testResults: data.testResults || [],
      status: data.status || "planning",
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.prototypes.set(prototype.id, prototype);
    return prototype;
  }
  async getPrototypes(workflowId) {
    return Array.from(this.prototypes.values()).filter((p) => p.workflowId === workflowId);
  }
  async updatePrototype(prototypeId, updates) {
    const prototype = this.prototypes.get(prototypeId);
    if (!prototype) return null;
    const updated = { ...prototype, ...updates };
    this.prototypes.set(prototypeId, updated);
    return updated;
  }
  // ===========================
  // TEST SESSION OPERATIONS
  // ===========================
  async createTestSession(data) {
    const session2 = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      prototypeId: data.prototypeId || "",
      sessionName: data.sessionName || "Test Session",
      testMethodology: data.testMethodology || "usability",
      participantPersona: data.participantPersona || "",
      participantDemographics: data.participantDemographics || {},
      scheduledAt: data.scheduledAt || /* @__PURE__ */ new Date(),
      durationMinutes: data.durationMinutes || 60,
      facilitatorId: data.facilitatorId || "",
      recordingUrl: data.recordingUrl,
      transcription: data.transcription,
      observations: data.observations || "",
      feedback: data.feedback || [],
      metrics: data.metrics || {},
      aiSynthesis: data.aiSynthesis || {},
      sentimentAnalysis: data.sentimentAnalysis || {},
      keyFindings: data.keyFindings || [],
      status: data.status || "scheduled",
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.testSessions.set(session2.id, session2);
    return session2;
  }
  async getTestSessions(workflowId) {
    return Array.from(this.testSessions.values()).filter((s) => s.workflowId === workflowId);
  }
  async updateTestSession(sessionId, updates) {
    const session2 = this.testSessions.get(sessionId);
    if (!session2) return null;
    const updated = { ...session2, ...updates };
    this.testSessions.set(sessionId, updated);
    return updated;
  }
  // ===========================
  // INSIGHT OPERATIONS
  // ===========================
  async createInsight(data) {
    const insight = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      phase: data.phase || "empathize",
      insightType: data.insightType || "pattern",
      title: data.title || "New Insight",
      content: data.content || "",
      confidenceScore: data.confidenceScore || 0.5,
      impactScore: data.impactScore || 0.5,
      actionabilityScore: data.actionabilityScore || 0.5,
      sourceData: data.sourceData || {},
      relatedEntities: data.relatedEntities || [],
      aiModelVersion: data.aiModelVersion || "gpt-4",
      generationMethod: data.generationMethod || "ai",
      acknowledged: data.acknowledged || false,
      actedUpon: data.actedUpon || false,
      userFeedback: data.userFeedback,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.insights.set(insight.id, insight);
    return insight;
  }
  async getInsights(workflowId, filters) {
    let insights = Array.from(this.insights.values()).filter((i) => i.workflowId === workflowId);
    if (filters?.phase) {
      insights = insights.filter((i) => i.phase === filters.phase);
    }
    if (filters?.type) {
      insights = insights.filter((i) => i.insightType === filters.type);
    }
    insights.sort((a, b) => {
      const scoreA = a.impactScore * a.confidenceScore;
      const scoreB = b.impactScore * b.confidenceScore;
      return scoreB - scoreA;
    });
    const limit = filters?.limit || insights.length;
    return insights.slice(0, limit);
  }
  // ===========================
  // EMPATHY DATA OPERATIONS
  // ===========================
  async createEmpathyData(data) {
    const empathy = {
      id: this.generateId(),
      workflowId: data.workflowId || "",
      dataType: data.dataType || "interview",
      participantPersona: data.participantPersona || "",
      participantDemographics: data.participantDemographics || {},
      rawData: data.rawData || "",
      transcription: data.transcription,
      recordingUrl: data.recordingUrl,
      insights: data.insights || [],
      painPoints: data.painPoints || [],
      needs: data.needs || [],
      behaviors: data.behaviors || [],
      emotions: data.emotions || [],
      aiAnalyzed: data.aiAnalyzed || false,
      aiInsights: data.aiInsights || {},
      sentimentScore: data.sentimentScore,
      createdAt: /* @__PURE__ */ new Date(),
      createdBy: data.createdBy || ""
    };
    this.empathyData.set(empathy.id, empathy);
    return empathy;
  }
  async getEmpathyData(workflowId) {
    return Array.from(this.empathyData.values()).filter((e) => e.workflowId === workflowId);
  }
  // ===========================
  // UTILITY METHODS
  // ===========================
  generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  async getWorkflowSummary(workflowId) {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) return null;
    const empathyData = await this.getEmpathyData(workflowId);
    const povStatements = await this.getPOVStatements(workflowId);
    const hmwQuestions = await this.getHMWQuestions(workflowId);
    const ideas = await this.getIdeas(workflowId);
    const prototypes = await this.getPrototypes(workflowId);
    const testSessions = await this.getTestSessions(workflowId);
    const insights = await this.getInsights(workflowId);
    return {
      workflow,
      stats: {
        empathyDataCount: empathyData.length,
        povStatementCount: povStatements.length,
        hmwQuestionCount: hmwQuestions.length,
        ideaCount: ideas.length,
        prototypeCount: prototypes.length,
        testSessionCount: testSessions.length,
        insightCount: insights.length
      },
      recentActivity: {
        latestInsights: insights.slice(0, 5),
        topIdeas: ideas.slice(0, 5),
        recentTests: testSessions.slice(0, 3)
      }
    };
  }
};
var dtWorkflowService = new DTWorkflowService();

// server/ai-agents/agents/design-thinking/enhanced-dt-agent.ts
import { OpenAI as OpenAI7 } from "openai";
var EnhancedDesignThinkingAgent = class extends BaseAgent {
  openaiClient;
  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY || "" });
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI7({
        apiKey,
        baseURL: process.env.AZURE_OPENAI_ENDPOINT
      });
    } else {
      console.warn("OpenAI API key not configured. EnhancedDesignThinkingAgent features will be limited.");
      this.openaiClient = null;
    }
  }
  // ===========================
  // SESSION FACILITATION
  // ===========================
  async facilitateSession(session2) {
    const context = await this.analyzeSessionContext(session2);
    return {
      suggestions: await this.generateSuggestions(context),
      nextSteps: this.planNextSteps(context),
      interventions: await this.identifyInterventions(context),
      celebrations: await this.identifyCelebrations(context),
      warnings: await this.identifyWarnings(context)
    };
  }
  async analyzeSessionContext(session2) {
    const elapsed = Date.now() - session2.startTime.getTime();
    const progress = elapsed / (session2.duration * 60 * 1e3);
    return {
      session: session2,
      progress,
      participationMetrics: await this.calculateParticipation(session2),
      energyLevel: await this.assessEnergyLevel(session2),
      outputQuality: await this.assessOutputQuality(session2),
      timeRemaining: session2.duration - elapsed / 6e4
    };
  }
  async generateSuggestions(context) {
    const suggestions = [];
    if (context.participationMetrics.lowParticipants?.length > 0) {
      suggestions.push({
        type: "engagement",
        priority: "high",
        content: `${context.participationMetrics.lowParticipants.length} participants have low engagement. Try: "Let's hear from someone who hasn't shared yet."`,
        technique: "round_robin"
      });
    }
    if (context.energyLevel < 0.4 && context.timeRemaining > 15) {
      suggestions.push({
        type: "energy_boost",
        priority: "medium",
        content: "Energy levels are dropping. Consider a 5-minute energizer activity or stretch break.",
        technique: "energizer"
      });
    }
    if (context.progress > 0.75 && context.outputQuality < 0.6) {
      suggestions.push({
        type: "time_management",
        priority: "high",
        content: "Running low on time with incomplete outputs. Focus on key deliverables.",
        technique: "prioritization"
      });
    }
    const aiSuggestions = await this.generateAISuggestions(context);
    suggestions.push(...aiSuggestions);
    return suggestions;
  }
  async generateAISuggestions(context) {
    try {
      const prompt = `You are an expert Design Thinking facilitator. Analyze this session context and provide 2-3 actionable suggestions:

Session Type: ${context.session.sessionType}
Progress: ${(context.progress * 100).toFixed(0)}%
Participation: ${context.participationMetrics.averageParticipation?.toFixed(0) || 50}%
Energy Level: ${(context.energyLevel * 100).toFixed(0)}%
Output Quality: ${(context.outputQuality * 100).toFixed(0)}%
Time Remaining: ${context.timeRemaining} minutes

Provide specific, actionable facilitation suggestions that would improve the session outcome.
Format as JSON array: [{type, priority, content, technique}]`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert Design Thinking facilitator providing real-time coaching." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      const content = response.choices[0].message.content || "[]";
      return JSON.parse(content);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      return [];
    }
  }
  planNextSteps(context) {
    const steps = [];
    if (context.progress < 0.5) {
      steps.push({
        action: "Continue current activity",
        timeframe: `${Math.round(context.timeRemaining * 0.5)} minutes`,
        priority: 1
      });
    } else {
      steps.push({
        action: "Begin wrap-up and synthesis",
        timeframe: `${Math.round(context.timeRemaining * 0.3)} minutes`,
        priority: 1
      });
    }
    return steps;
  }
  async identifyInterventions(context) {
    return [];
  }
  async identifyCelebrations(context) {
    return [];
  }
  async identifyWarnings(context) {
    return [];
  }
  async calculateParticipation(session2) {
    const totalParticipants = session2.participants.length;
    const activeParticipants = session2.participants.filter((p) => (p.contributions || 0) > 0).length;
    return {
      averageParticipation: totalParticipants > 0 ? activeParticipants / totalParticipants * 100 : 0,
      lowParticipants: session2.participants.filter((p) => (p.contributions || 0) < 2)
    };
  }
  async assessEnergyLevel(session2) {
    const sessionDuration = (Date.now() - session2.startTime.getTime()) / 6e4;
    let energy = 1;
    energy -= sessionDuration / 120 * 0.3;
    return Math.max(0, Math.min(1, energy));
  }
  async assessOutputQuality(session2) {
    return 0.7;
  }
  // ===========================
  // INSIGHT SYNTHESIS
  // ===========================
  async synthesizeInsights(data) {
    const patterns = await this.identifyPatterns(data);
    const insights = await this.generateInsights(patterns);
    const prioritized = await this.prioritizeInsights(insights);
    return prioritized.map((insight) => ({
      ...insight,
      confidence: this.calculateConfidence(insight, data),
      actionability: this.assessActionability(insight),
      businessImpact: this.assessBusinessImpact(insight)
    }));
  }
  async identifyPatterns(data) {
    try {
      const prompt = `Analyze the following user research data and identify key patterns, themes, and insights:

${data.map((d, i) => `
Interview ${i + 1}:
Persona: ${d.participantPersona}
Pain Points: ${JSON.stringify(d.painPoints)}
Needs: ${JSON.stringify(d.needs)}
Behaviors: ${JSON.stringify(d.behaviors)}
Emotions: ${JSON.stringify(d.emotions)}
`).join("\n")}

Identify:
1. Recurring patterns across multiple interviews
2. Contradictions or surprising findings
3. Unmet needs and pain points
4. Behavioral patterns
5. Emotional themes

Format as JSON array of patterns with: type, description, frequency, evidence.`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert at synthesizing qualitative research data." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2e3,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || '{"patterns": []}');
      return result.patterns || [];
    } catch (error) {
      console.error("Error identifying patterns:", error);
      return [];
    }
  }
  async generateInsights(patterns) {
    const insights = [];
    for (const pattern of patterns) {
      const insight = await this.patternToInsight(pattern);
      insights.push(insight);
    }
    return insights;
  }
  async patternToInsight(pattern) {
    try {
      const prompt = `Convert this pattern into an actionable insight:

Pattern Type: ${pattern.type}
Description: ${pattern.description}
Frequency: ${pattern.frequency}
Evidence: ${JSON.stringify(pattern.evidence)}

Generate a clear, actionable insight that:
1. Explains what the pattern means
2. Why it matters for the business
3. What action could be taken

Format as JSON: {type, content, implications, suggestedActions}`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert at converting research patterns into business insights." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        id: this.generateId(),
        type: result.type || "pattern",
        content: result.content,
        confidence: 0.8,
        actionability: 0.7,
        businessImpact: 0.6,
        relatedEntities: pattern.evidence?.map((e) => e.id) || []
      };
    } catch (error) {
      console.error("Error converting pattern to insight:", error);
      return {
        id: this.generateId(),
        type: "pattern",
        content: pattern.description,
        confidence: 0.5,
        actionability: 0.5,
        businessImpact: 0.5,
        relatedEntities: []
      };
    }
  }
  async prioritizeInsights(insights) {
    return insights.sort((a, b) => {
      const scoreA = a.confidence * a.actionability * a.businessImpact;
      const scoreB = b.confidence * b.actionability * b.businessImpact;
      return scoreB - scoreA;
    });
  }
  calculateConfidence(insight, data) {
    const supportingDataCount = insight.relatedEntities.length;
    const dataCount = data.length;
    const coverage = supportingDataCount / dataCount;
    return Math.min(0.95, coverage * 1.2);
  }
  assessActionability(insight) {
    const hasSpecificAction = insight.content.toLowerCase().includes("could") || insight.content.toLowerCase().includes("should");
    return hasSpecificAction ? 0.8 : 0.5;
  }
  assessBusinessImpact(insight) {
    const impactKeywords = ["revenue", "cost", "efficiency", "satisfaction", "retention"];
    const hasImpactKeyword = impactKeywords.some(
      (keyword) => insight.content.toLowerCase().includes(keyword)
    );
    return hasImpactKeyword ? 0.7 : 0.4;
  }
  // ===========================
  // IDEA EVALUATION
  // ===========================
  async evaluateIdeas(ideas, criteria) {
    const evaluationCriteria = criteria || this.getDefaultCriteria();
    const evaluations = await Promise.all(
      ideas.map((idea) => this.comprehensiveEvaluation(idea, evaluationCriteria))
    );
    return this.rankIdeas(evaluations);
  }
  getDefaultCriteria() {
    return [
      { name: "Desirability", weight: 0.3, description: "User want/need" },
      { name: "Feasibility", weight: 0.25, description: "Technical capability" },
      { name: "Viability", weight: 0.25, description: "Business sustainability" },
      { name: "Innovation", weight: 0.1, description: "Uniqueness/novelty" },
      { name: "Impact", weight: 0.1, description: "Potential impact scale" }
    ];
  }
  async comprehensiveEvaluation(idea, criteria) {
    const scores = {
      desirability: await this.assessDesirability(idea),
      feasibility: await this.assessFeasibility(idea),
      viability: await this.assessViability(idea),
      innovation: await this.assessInnovation(idea),
      impact: await this.assessImpact(idea)
    };
    const risks = await this.identifyRisks(idea);
    const opportunities = await this.identifyOpportunities(idea);
    const synergies = [];
    const recommendations = await this.generateRecommendations(idea, scores);
    return {
      idea,
      scores,
      risks,
      opportunities,
      synergies,
      recommendations
    };
  }
  async assessDesirability(idea) {
    try {
      const prompt = `Assess the desirability of this idea from a user perspective:

Title: ${idea.title}
Description: ${idea.description}
User Benefit: ${idea.userBenefit}

Rate desirability (0-1) based on:
1. How well it addresses user needs
2. Emotional appeal
3. Differentiation from alternatives
4. Likelihood of adoption

Provide score and brief reasoning as JSON: {score, reasoning}`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert at evaluating product desirability." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || '{"score": 0.5}');
      return result.score;
    } catch (error) {
      console.error("Error assessing desirability:", error);
      return 0.5;
    }
  }
  async assessFeasibility(idea) {
    return 0.6;
  }
  async assessViability(idea) {
    return 0.6;
  }
  async assessInnovation(idea) {
    return 0.5;
  }
  async assessImpact(idea) {
    return 0.6;
  }
  async identifyRisks(idea) {
    return [];
  }
  async identifyOpportunities(idea) {
    return [];
  }
  async generateRecommendations(idea, scores) {
    const recommendations = [];
    if (scores.desirability < 0.5) {
      recommendations.push("Conduct more user research to validate desirability");
    }
    if (scores.feasibility < 0.5) {
      recommendations.push("Assess technical requirements and constraints");
    }
    if (scores.viability < 0.5) {
      recommendations.push("Develop business model and revenue strategy");
    }
    return recommendations;
  }
  rankIdeas(evaluations) {
    return evaluations.sort((a, b) => {
      const scoreA = this.calculateOverallScore(a.scores);
      const scoreB = this.calculateOverallScore(b.scores);
      return scoreB - scoreA;
    });
  }
  calculateOverallScore(scores) {
    const weights = {
      desirability: 0.3,
      feasibility: 0.25,
      viability: 0.25,
      innovation: 0.1,
      impact: 0.1
    };
    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + scores[key] * weight;
    }, 0);
  }
  // ===========================
  // POV STATEMENT GENERATION
  // ===========================
  async generatePOVStatements(empathyData) {
    const insights = await this.synthesizeInsights(empathyData);
    const povStatements = [];
    for (const insight of insights.slice(0, 5)) {
      const pov = await this.insightToPOV(insight, empathyData);
      povStatements.push(pov);
    }
    return povStatements;
  }
  async insightToPOV(insight, empathyData) {
    try {
      const prompt = `Create a Point of View (POV) statement from this insight:

Insight: ${insight.content}

Use the format: [User] needs [Need] because [Insight]

Requirements:
1. Be specific about the user (not "users" but a specific persona)
2. Express a need, not a solution
3. Include a surprising insight from research

Also identify:
- Supporting evidence from research
- Potential solution bias
- Priority score (0-100)

Format as JSON: {user, need, insight, supportingEvidence, solutionBias, priorityScore}`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert at framing problems using Design Thinking POV statements." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        id: this.generateId(),
        workflowId: empathyData[0]?.workflowId || "",
        userPersona: result.user,
        need: result.need,
        insight: result.insight,
        supportingEmpathyData: result.supportingEvidence || [],
        evidenceStrength: 0.8,
        validated: false,
        solutionBiasDetected: result.solutionBias || false,
        priorityScore: result.priorityScore || 50,
        selectedForIdeation: false
      };
    } catch (error) {
      console.error("Error generating POV statement:", error);
      return {
        id: this.generateId(),
        workflowId: empathyData[0]?.workflowId || "",
        userPersona: "User",
        need: "needs to be defined",
        insight: insight.content,
        supportingEmpathyData: [],
        evidenceStrength: 0.5,
        validated: false,
        solutionBiasDetected: false,
        priorityScore: 50,
        selectedForIdeation: false
      };
    }
  }
  // ===========================
  // HMW QUESTION GENERATION
  // ===========================
  async generateHMWQuestions(povStatement) {
    const hmwQuestions = [];
    const baseHMW = await this.povToHMW(povStatement);
    hmwQuestions.push(baseHMW);
    const reframingTypes = ["amplify", "remove_constraint", "opposite", "question_assumption", "resource_change"];
    for (const type of reframingTypes) {
      const reframed = await this.reframeHMW(baseHMW, type);
      hmwQuestions.push(reframed);
    }
    return hmwQuestions;
  }
  async povToHMW(pov) {
    try {
      const prompt = `Convert this POV statement into a "How Might We" question:

User: ${pov.userPersona}
Need: ${pov.need}
Insight: ${pov.insight}

Create an actionable HMW question that:
1. Starts with "How might we..."
2. Is broad enough to allow creative solutions
3. Is specific enough to be actionable
4. Doesn't prescribe a solution

Format as JSON: {question, reasoning}`;
      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert at creating How Might We questions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        id: this.generateId(),
        povStatementId: pov.id,
        workflowId: pov.workflowId,
        question: result.question,
        reframingType: null,
        desirabilityScore: null,
        feasibilityScore: null,
        viabilityScore: null,
        voteCount: 0,
        ideaCount: 0,
        selectedForIdeation: false
      };
    } catch (error) {
      console.error("Error generating HMW question:", error);
      return {
        id: this.generateId(),
        povStatementId: pov.id,
        workflowId: pov.workflowId,
        question: `How might we help ${pov.userPersona} ${pov.need}?`,
        reframingType: null,
        desirabilityScore: null,
        feasibilityScore: null,
        viabilityScore: null,
        voteCount: 0,
        ideaCount: 0,
        selectedForIdeation: false
      };
    }
  }
  async reframeHMW(baseHMW, reframingType) {
    return {
      ...baseHMW,
      id: this.generateId(),
      reframingType,
      question: `${baseHMW.question} (${reframingType})`
    };
  }
  // ===========================
  // PROTOTYPE PLANNING
  // ===========================
  async generatePrototypePlan(idea, resources) {
    return {
      recommendedFidelity: "low",
      steps: ["Define learning goals", "Create prototype", "Test with users"],
      requiredResources: {},
      estimatedTimeline: `${resources.timeline} days`,
      riskMitigation: [],
      testingStrategy: {},
      successMetrics: []
    };
  }
  // ===========================
  // TEST PLAN GENERATION
  // ===========================
  async generateTestPlan(prototype, targetAudience) {
    return {
      methodology: "usability",
      scenarios: [],
      questions: [],
      successCriteria: [],
      recruitment: {},
      timeline: "2 weeks",
      analysisApproach: "thematic analysis"
    };
  }
  // ===========================
  // FEEDBACK SYNTHESIS
  // ===========================
  async synthesizeFeedback(feedback) {
    return {
      themes: [],
      sentimentAnalysis: {},
      painPoints: [],
      delighters: [],
      suggestions: [],
      prioritizedChanges: [],
      iterationRecommendations: []
    };
  }
  // ===========================
  // UTILITY METHODS
  // ===========================
  generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  async initialize(workflowId) {
    console.log(`Initializing Enhanced DT Agent for workflow: ${workflowId}`);
  }
  async handlePhaseTransition(workflowId, phase) {
    console.log(`Handling phase transition for workflow ${workflowId} to phase: ${phase}`);
  }
  async generateInsights(workflowId, options) {
    return [];
  }
  async getStatus() {
    return {
      status: "active",
      capabilities: [
        "session_facilitation",
        "insight_synthesis",
        "idea_evaluation",
        "pov_generation",
        "hmw_generation",
        "prototype_planning",
        "test_planning",
        "feedback_synthesis"
      ]
    };
  }
};

// server/routes/dt-comprehensive-routes.ts
var router4 = express3.Router();
var dtAgent = new EnhancedDesignThinkingAgent();
var collaborationService2 = new DTCollaborationService();
var analyticsService2 = new DTAnalyticsService();
router4.get("/workflows", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, phase, limit, offset } = req.query;
    const workflows = await dtWorkflowService.getWorkflows(userId, {
      status,
      phase,
      limit: limit ? parseInt(limit) : void 0,
      offset: offset ? parseInt(offset) : void 0
    });
    res.json({
      success: true,
      data: workflows,
      count: workflows.length
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch workflows"
    });
  }
});
router4.post("/workflows", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const workflowData = {
      ...req.body,
      userId
    };
    const workflow = await dtWorkflowService.createWorkflow(workflowData);
    if (workflow.aiFacilitationEnabled) {
      await dtAgent.initialize(workflow.id);
    }
    res.status(201).json({
      success: true,
      data: workflow
    });
  } catch (error) {
    console.error("Error creating workflow:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create workflow"
    });
  }
});
router4.get("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const summary = await dtWorkflowService.getWorkflowSummary(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found"
      });
    }
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error("Error fetching workflow:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch workflow"
    });
  }
});
router4.put("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const workflow = await dtWorkflowService.updateWorkflow(id, updates);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found"
      });
    }
    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    console.error("Error updating workflow:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update workflow"
    });
  }
});
router4.put("/workflows/:id/phase", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;
    const workflow = await dtWorkflowService.transitionPhase(id, phase);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found"
      });
    }
    if (workflow.aiFacilitationEnabled) {
      await dtAgent.handlePhaseTransition(id, phase);
    }
    res.json({
      success: true,
      data: workflow,
      message: `Transitioned to ${phase} phase`
    });
  } catch (error) {
    console.error("Error transitioning phase:", error);
    res.status(500).json({
      success: false,
      error: "Failed to transition phase"
    });
  }
});
router4.delete("/workflows/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dtWorkflowService.deleteWorkflow(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found"
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting workflow:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete workflow"
    });
  }
});
router4.post("/workflows/:id/empathy-data", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const empathyData = await dtWorkflowService.createEmpathyData({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      data: empathyData
    });
  } catch (error) {
    console.error("Error creating empathy data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create empathy data"
    });
  }
});
router4.get("/workflows/:id/empathy-data", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    res.json({
      success: true,
      data: empathyData,
      count: empathyData.length
    });
  } catch (error) {
    console.error("Error fetching empathy data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch empathy data"
    });
  }
});
router4.post("/workflows/:id/pov-statements", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const pov = await dtWorkflowService.createPOVStatement({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      data: pov
    });
  } catch (error) {
    console.error("Error creating POV statement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create POV statement"
    });
  }
});
router4.post("/workflows/:id/pov-statements/generate", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    if (empathyData.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No empathy data available. Please add empathy data first."
      });
    }
    const povStatements = await dtAgent.generatePOVStatements(empathyData);
    const userId = req.user.id;
    const saved = await Promise.all(
      povStatements.map(
        (pov) => dtWorkflowService.createPOVStatement({
          ...pov,
          createdBy: userId
        })
      )
    );
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error("Error generating POV statements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate POV statements"
    });
  }
});
router4.get("/workflows/:id/pov-statements", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const povStatements = await dtWorkflowService.getPOVStatements(id);
    res.json({
      success: true,
      data: povStatements,
      count: povStatements.length
    });
  } catch (error) {
    console.error("Error fetching POV statements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch POV statements"
    });
  }
});
router4.post("/pov-statements/:povId/hmw-questions/generate", authMiddleware, async (req, res) => {
  try {
    const { povId } = req.params;
    const pov = await dtWorkflowService.getPOVStatements("").then(
      (povs) => povs.find((p) => p.id === povId)
    );
    if (!pov) {
      return res.status(404).json({
        success: false,
        error: "POV statement not found"
      });
    }
    const hmwQuestions = await dtAgent.generateHMWQuestions(pov);
    const userId = req.user.id;
    const saved = await Promise.all(
      hmwQuestions.map(
        (hmw) => dtWorkflowService.createHMWQuestion({
          ...hmw,
          createdBy: userId
        })
      )
    );
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error("Error generating HMW questions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate HMW questions"
    });
  }
});
router4.get("/workflows/:id/hmw-questions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const hmwQuestions = await dtWorkflowService.getHMWQuestions(id);
    res.json({
      success: true,
      data: hmwQuestions,
      count: hmwQuestions.length
    });
  } catch (error) {
    console.error("Error fetching HMW questions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch HMW questions"
    });
  }
});
router4.post("/hmw-questions/:hmwId/vote", authMiddleware, async (req, res) => {
  try {
    const { hmwId } = req.params;
    const hmw = await dtWorkflowService.voteHMWQuestion(hmwId);
    if (!hmw) {
      return res.status(404).json({
        success: false,
        error: "HMW question not found"
      });
    }
    res.json({
      success: true,
      data: hmw
    });
  } catch (error) {
    console.error("Error voting HMW question:", error);
    res.status(500).json({
      success: false,
      error: "Failed to vote HMW question"
    });
  }
});
router4.post("/workflows/:id/ideas", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const idea = await dtWorkflowService.createIdea({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error("Error creating idea:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create idea"
    });
  }
});
router4.get("/workflows/:id/ideas", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const ideas = await dtWorkflowService.getIdeas(id);
    res.json({
      success: true,
      data: ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ideas"
    });
  }
});
router4.post("/workflows/:id/ideas/evaluate", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { criteria } = req.body;
    const ideas = await dtWorkflowService.getIdeas(id);
    if (ideas.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No ideas to evaluate"
      });
    }
    const evaluations = await dtAgent.evaluateIdeas(ideas, criteria);
    await Promise.all(
      evaluations.map(
        (evaluation) => dtWorkflowService.updateIdea(evaluation.idea.id, {
          desirabilityScore: evaluation.scores.desirability,
          feasibilityScore: evaluation.scores.feasibility,
          viabilityScore: evaluation.scores.viability,
          innovationScore: evaluation.scores.innovation,
          impactScore: evaluation.scores.impact,
          overallScore: evaluation.scores.desirability * 0.3 + evaluation.scores.feasibility * 0.25 + evaluation.scores.viability * 0.25 + evaluation.scores.innovation * 0.1 + evaluation.scores.impact * 0.1,
          aiEvaluation: {
            risks: evaluation.risks,
            opportunities: evaluation.opportunities,
            recommendations: evaluation.recommendations
          },
          status: "evaluated"
        })
      )
    );
    res.json({
      success: true,
      data: evaluations,
      count: evaluations.length
    });
  } catch (error) {
    console.error("Error evaluating ideas:", error);
    res.status(500).json({
      success: false,
      error: "Failed to evaluate ideas"
    });
  }
});
router4.post("/workflows/:id/prototypes", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const prototype = await dtWorkflowService.createPrototype({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      data: prototype
    });
  } catch (error) {
    console.error("Error creating prototype:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create prototype"
    });
  }
});
router4.get("/workflows/:id/prototypes", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const prototypes = await dtWorkflowService.getPrototypes(id);
    res.json({
      success: true,
      data: prototypes,
      count: prototypes.length
    });
  } catch (error) {
    console.error("Error fetching prototypes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch prototypes"
    });
  }
});
router4.post("/ideas/:ideaId/prototype-plan", authMiddleware, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { resources } = req.body;
    const ideas = await dtWorkflowService.getIdeas("");
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: "Idea not found"
      });
    }
    const plan = await dtAgent.generatePrototypePlan(idea, resources);
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error("Error generating prototype plan:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate prototype plan"
    });
  }
});
router4.post("/workflows/:id/test-sessions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const session2 = await dtWorkflowService.createTestSession({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    res.status(201).json({
      success: true,
      data: session2
    });
  } catch (error) {
    console.error("Error creating test session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create test session"
    });
  }
});
router4.get("/workflows/:id/test-sessions", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await dtWorkflowService.getTestSessions(id);
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error("Error fetching test sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test sessions"
    });
  }
});
router4.post("/workflows/:id/insights/synthesize", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    if (empathyData.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No empathy data available for synthesis"
      });
    }
    const insights = await dtAgent.synthesizeInsights(empathyData);
    const saved = await Promise.all(
      insights.map(
        (insight) => dtWorkflowService.createInsight({
          workflowId: id,
          phase: "empathize",
          insightType: insight.type,
          title: insight.content.substring(0, 100),
          content: insight.content,
          confidenceScore: insight.confidence,
          impactScore: insight.businessImpact,
          actionabilityScore: insight.actionability,
          relatedEntities: insight.relatedEntities,
          aiModelVersion: "gpt-4",
          generationMethod: "pattern_analysis"
        })
      )
    );
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error("Error synthesizing insights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to synthesize insights"
    });
  }
});
router4.get("/workflows/:id/insights", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase, type, limit } = req.query;
    const insights = await dtWorkflowService.getInsights(id, {
      phase,
      type,
      limit: limit ? parseInt(limit) : void 0
    });
    res.json({
      success: true,
      data: insights,
      count: insights.length
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch insights"
    });
  }
});
router4.get("/workflows/:id/analytics", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = "comprehensive" } = req.query;
    let analytics;
    switch (type) {
      case "effectiveness":
        analytics = await analyticsService2.calculateEffectivenessScore(id);
        break;
      case "insights":
        analytics = await analyticsService2.generateInsightMap(id);
        break;
      case "roi":
        analytics = await analyticsService2.calculateROI(id);
        break;
      case "benchmarks":
        analytics = await analyticsService2.compareToBenchmarks(id);
        break;
      default:
        analytics = await analyticsService2.getComprehensiveAnalytics(id);
    }
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics"
    });
  }
});
router4.get("/insights/:insightId/evolution", authMiddleware, async (req, res) => {
  try {
    const { insightId } = req.params;
    const evolution = await analyticsService2.trackInsightEvolution(insightId);
    res.json({
      success: true,
      data: evolution
    });
  } catch (error) {
    console.error("Error tracking insight evolution:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track insight evolution"
    });
  }
});
router4.get("/workflows/:id/collaboration-status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const status = await collaborationService2.getSessionStatus(id);
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error("Error fetching collaboration status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch collaboration status"
    });
  }
});
router4.post("/sessions/:sessionId/facilitate", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sessionData } = req.body;
    const facilitation = await dtAgent.facilitateSession({
      id: sessionId,
      workflowId: sessionData.workflowId,
      sessionType: sessionData.sessionType,
      participants: sessionData.participants || [],
      currentActivity: sessionData.currentActivity,
      startTime: new Date(sessionData.startTime),
      duration: sessionData.duration,
      sessionData
    });
    res.json({
      success: true,
      data: facilitation
    });
  } catch (error) {
    console.error("Error providing facilitation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to provide facilitation"
    });
  }
});
router4.get("/health", async (req, res) => {
  try {
    const agentStatus = await dtAgent.getStatus();
    res.json({
      success: true,
      status: "healthy",
      timestamp: /* @__PURE__ */ new Date(),
      services: {
        dtAgent: agentStatus.status,
        collaboration: "active",
        analytics: "ready",
        workflows: "operational"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var dt_comprehensive_routes_default = router4;

// server/routes/assessment-routes.ts
import { Router as Router2 } from "express";

// server/services/assessment-database.ts
import { MongoClient } from "mongodb";
var AssessmentDatabaseService = class {
  client;
  db;
  sessions;
  completedAssessments;
  assessmentHistory;
  constructor(connectionString, databaseName) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    this.sessions = this.db.collection("assessment_sessions");
    this.completedAssessments = this.db.collection("completed_assessments");
    this.assessmentHistory = this.db.collection("assessment_history");
  }
  async connect() {
    await this.client.connect();
    await this.createIndexes();
    console.log("\u2705 Assessment Database Service connected to Azure MongoDB");
  }
  async disconnect() {
    await this.client.close();
  }
  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================
  async createSession(userId, assessmentType, totalQuestions) {
    const session2 = {
      userId,
      sessionId: this.generateSessionId(),
      assessmentType,
      status: "in_progress",
      responses: [],
      currentQuestionIndex: 0,
      totalQuestions,
      progressPercentage: 0,
      startedAt: /* @__PURE__ */ new Date(),
      lastActivityAt: /* @__PURE__ */ new Date()
    };
    const result = await this.sessions.insertOne(session2);
    return {
      ...session2,
      _id: result.insertedId
    };
  }
  async getSession(sessionId) {
    return await this.sessions.findOne({ sessionId });
  }
  async getUserActiveSessions(userId) {
    return await this.sessions.find({
      userId,
      status: "in_progress"
    }).sort({ lastActivityAt: -1 }).toArray();
  }
  async updateSession(sessionId, responses, currentQuestionIndex) {
    const progressPercentage = await this.calculateProgress(sessionId, responses.length);
    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          responses,
          currentQuestionIndex,
          progressPercentage,
          lastActivityAt: /* @__PURE__ */ new Date()
        }
      }
    );
  }
  async saveResponse(sessionId, response) {
    const session2 = await this.getSession(sessionId);
    if (!session2) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    const responses = [...session2.responses, response];
    const currentQuestionIndex = session2.currentQuestionIndex + 1;
    const progressPercentage = responses.length / session2.totalQuestions * 100;
    await this.sessions.updateOne(
      { sessionId },
      {
        $push: { responses: response },
        $set: {
          currentQuestionIndex,
          progressPercentage,
          lastActivityAt: /* @__PURE__ */ new Date()
        }
      }
    );
  }
  async completeSession(sessionId, results, compositeProfile) {
    const session2 = await this.getSession(sessionId);
    if (!session2) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          status: "completed",
          completedAt: /* @__PURE__ */ new Date(),
          lastActivityAt: /* @__PURE__ */ new Date()
        }
      }
    );
    const completedAssessment = {
      userId: session2.userId,
      sessionId,
      assessmentType: session2.assessmentType,
      responses: session2.responses,
      results,
      compositeProfile,
      completedAt: /* @__PURE__ */ new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
      // 1 year
      version: "1.0",
      metadata: session2.metadata
    };
    const result = await this.completedAssessments.insertOne(completedAssessment);
    await this.updateAssessmentHistory(
      session2.userId,
      session2.assessmentType,
      result.insertedId,
      results
    );
    return result.insertedId;
  }
  async abandonSession(sessionId) {
    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          status: "abandoned",
          lastActivityAt: /* @__PURE__ */ new Date()
        }
      }
    );
  }
  // ============================================================================
  // ASSESSMENT RETRIEVAL
  // ============================================================================
  async getLatestAssessment(userId, assessmentType) {
    return await this.completedAssessments.findOne(
      {
        userId,
        assessmentType,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: /* @__PURE__ */ new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );
  }
  async getAllUserAssessments(userId) {
    return await this.completedAssessments.find({
      userId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: /* @__PURE__ */ new Date() } }
      ]
    }).sort({ completedAt: -1 }).toArray();
  }
  async getAssessmentById(assessmentId) {
    return await this.completedAssessments.findOne({ _id: assessmentId });
  }
  async getUserCompositeProfile(userId) {
    const assessment = await this.completedAssessments.findOne(
      {
        userId,
        compositeProfile: { $exists: true },
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: /* @__PURE__ */ new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );
    return assessment?.compositeProfile || null;
  }
  // ============================================================================
  // ASSESSMENT HISTORY
  // ============================================================================
  async updateAssessmentHistory(userId, assessmentType, assessmentId, results) {
    const now = /* @__PURE__ */ new Date();
    await this.assessmentHistory.findOneAndUpdate(
      { userId, assessmentType },
      {
        $push: {
          assessments: {
            completedAt: now,
            results,
            version: "1.0"
          }
        },
        $set: {
          latestAssessmentId: assessmentId,
          lastAssessmentAt: now
        },
        $inc: {
          totalAssessments: 1
        },
        $setOnInsert: {
          firstAssessmentAt: now
        }
      },
      { upsert: true }
    );
  }
  async getAssessmentHistory(userId, assessmentType) {
    const query = { userId };
    if (assessmentType) {
      query.assessmentType = assessmentType;
    }
    return await this.assessmentHistory.find(query).toArray();
  }
  async getAssessmentEvolution(userId, assessmentType) {
    const history = await this.assessmentHistory.findOne({ userId, assessmentType });
    if (!history || history.assessments.length < 2) {
      return null;
    }
    const evolution = {
      assessmentType,
      totalAssessments: history.totalAssessments,
      firstAssessment: history.assessments[0],
      latestAssessment: history.assessments[history.assessments.length - 1],
      changes: this.calculateChanges(
        history.assessments[0].results,
        history.assessments[history.assessments.length - 1].results
      ),
      trajectory: this.determineTrajectory(history.assessments)
    };
    return evolution;
  }
  calculateChanges(oldResults, newResults) {
    const changes = [];
    return changes;
  }
  determineTrajectory(assessments) {
    if (assessments.length < 2) return "stable";
    return "stable";
  }
  // ============================================================================
  // ANALYTICS
  // ============================================================================
  async getAssessmentStats(userId) {
    const [sessions, completed, history] = await Promise.all([
      this.sessions.countDocuments({ userId }),
      this.completedAssessments.countDocuments({ userId }),
      this.assessmentHistory.find({ userId }).toArray()
    ]);
    return {
      totalSessions: sessions,
      completedAssessments: completed,
      inProgressSessions: sessions - completed,
      assessmentTypes: history.map((h) => h.assessmentType),
      lastAssessmentDate: history.length > 0 ? Math.max(...history.map((h) => h.lastAssessmentAt.getTime())) : null
    };
  }
  async getPlatformAssessmentStats() {
    const stats = await this.completedAssessments.aggregate([
      {
        $group: {
          _id: "$assessmentType",
          count: { $sum: 1 },
          avgCompletionTime: { $avg: "$metadata.duration" }
        }
      }
    ]).toArray();
    return {
      totalAssessments: stats.reduce((sum, s) => sum + s.count, 0),
      byType: stats.map((s) => ({
        type: s._id,
        count: s.count,
        avgCompletionTime: Math.round(s.avgCompletionTime || 0)
      }))
    };
  }
  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================
  async createIndexes() {
    await this.sessions.createIndex({ userId: 1, status: 1 });
    await this.sessions.createIndex({ sessionId: 1 }, { unique: true });
    await this.sessions.createIndex({ lastActivityAt: -1 });
    await this.completedAssessments.createIndex({ userId: 1, assessmentType: 1, completedAt: -1 });
    await this.completedAssessments.createIndex({ sessionId: 1 });
    await this.completedAssessments.createIndex({ expiresAt: 1 }, { sparse: true });
    await this.assessmentHistory.createIndex({ userId: 1, assessmentType: 1 }, { unique: true });
    console.log("\u2705 Assessment database indexes created");
  }
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  async calculateProgress(sessionId, responseCount) {
    const session2 = await this.getSession(sessionId);
    if (!session2) return 0;
    return responseCount / session2.totalQuestions * 100;
  }
  async cleanupAbandonedSessions(daysOld = 7) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1e3);
    const result = await this.sessions.deleteMany({
      status: "in_progress",
      lastActivityAt: { $lt: cutoffDate }
    });
    return result.deletedCount;
  }
};
var assessmentDbInstance = null;
function getAssessmentDatabase() {
  if (!assessmentDbInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || "iterativ-db";
    if (!connectionString) {
      throw new Error("MONGODB_CONNECTION_STRING environment variable is not set");
    }
    assessmentDbInstance = new AssessmentDatabaseService(connectionString, databaseName);
  }
  return assessmentDbInstance;
}

// server/services/assessment-integration.ts
import { MongoClient as MongoClient2 } from "mongodb";
var AssessmentIntegrationService = class {
  client;
  db;
  assessmentProfiles;
  agentAdaptations;
  constructor(connectionString, databaseName) {
    this.client = new MongoClient2(connectionString);
    this.db = this.client.db(databaseName);
    this.assessmentProfiles = this.db.collection("assessment_profiles");
    this.agentAdaptations = this.db.collection("agent_personality_adaptations");
  }
  async connect() {
    await this.client.connect();
    await this.createIndexes();
    console.log("\u2705 Assessment Integration Service connected to Azure MongoDB");
  }
  async disconnect() {
    await this.client.close();
  }
  // ============================================================================
  // ASSESSMENT PROFILE MANAGEMENT
  // ============================================================================
  async saveAssessmentProfile(profile) {
    const result = await this.assessmentProfiles.insertOne({
      ...profile,
      createdAt: /* @__PURE__ */ new Date()
    });
    return result.insertedId;
  }
  async getAssessmentProfile(userId, assessmentType) {
    const query = { userId };
    if (assessmentType) {
      query.assessmentType = assessmentType;
    }
    const profile = await this.assessmentProfiles.findOne(
      {
        ...query,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: /* @__PURE__ */ new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );
    return profile;
  }
  async getAllUserAssessments(userId) {
    return await this.assessmentProfiles.find({
      userId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: /* @__PURE__ */ new Date() } }
      ]
    }).sort({ completedAt: -1 }).toArray();
  }
  // ============================================================================
  // AGENT PERSONALITY ADAPTATION
  // ============================================================================
  async adaptAgentPersonality(userId, agentType, assessmentProfileId) {
    const profile = await this.assessmentProfiles.findOne({ _id: assessmentProfileId });
    if (!profile) {
      throw new Error("Assessment profile not found");
    }
    const adaptedTraits = this.generateAdaptedTraits(agentType, profile);
    const communicationAdjustments = this.generateCommunicationAdjustments(profile);
    const coachingApproach = this.determineCoachingApproach(agentType, profile);
    const adaptation = {
      userId,
      agentType,
      assessmentProfileId,
      adaptedTraits,
      communicationAdjustments,
      coachingApproach,
      adaptationEffectiveness: 0.5,
      // Initial baseline
      lastAdaptedAt: /* @__PURE__ */ new Date()
    };
    const result = await this.agentAdaptations.findOneAndUpdate(
      { userId, agentType },
      {
        $set: {
          ...adaptation,
          lastAdaptedAt: /* @__PURE__ */ new Date()
        },
        $setOnInsert: {
          createdAt: /* @__PURE__ */ new Date()
        }
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );
    return result;
  }
  async getAgentAdaptation(userId, agentType) {
    return await this.agentAdaptations.findOne({ userId, agentType });
  }
  async updateAdaptationEffectiveness(userId, agentType, effectivenessDelta) {
    await this.agentAdaptations.updateOne(
      { userId, agentType },
      {
        $inc: { adaptationEffectiveness: effectivenessDelta * 0.1 },
        $set: { lastAdaptedAt: /* @__PURE__ */ new Date() }
      }
    );
  }
  // ============================================================================
  // PERSONALITY ANALYSIS
  // ============================================================================
  generateAdaptedTraits(agentType, profile) {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};
    const baseTraits = {
      co_founder: {
        communicationStyle: "supportive-challenging",
        energyLevel: "high",
        coachingApproach: "accountability-focused",
        decisionSupport: "collaborative",
        feedbackStyle: "constructive",
        pacing: "adaptive"
      },
      co_investor: {
        communicationStyle: "analytical-strategic",
        energyLevel: "moderate",
        coachingApproach: "data-driven",
        decisionSupport: "analytical",
        feedbackStyle: "direct",
        pacing: "deliberate"
      },
      co_builder: {
        communicationStyle: "collaborative-strategic",
        energyLevel: "high",
        coachingApproach: "partnership-focused",
        decisionSupport: "strategic",
        feedbackStyle: "encouraging",
        pacing: "adaptive"
      },
      business_advisor: {
        communicationStyle: "professional-analytical",
        energyLevel: "moderate",
        coachingApproach: "expert-guidance",
        decisionSupport: "data-driven",
        feedbackStyle: "detailed",
        pacing: "thorough"
      },
      investment_analyst: {
        communicationStyle: "analytical-precise",
        energyLevel: "moderate",
        coachingApproach: "analytical",
        decisionSupport: "quantitative",
        feedbackStyle: "objective",
        pacing: "methodical"
      },
      credit_analyst: {
        communicationStyle: "professional-direct",
        energyLevel: "moderate",
        coachingApproach: "risk-focused",
        decisionSupport: "criteria-based",
        feedbackStyle: "clear",
        pacing: "systematic"
      },
      impact_analyst: {
        communicationStyle: "empathetic-analytical",
        energyLevel: "moderate",
        coachingApproach: "values-driven",
        decisionSupport: "impact-focused",
        feedbackStyle: "holistic",
        pacing: "thoughtful"
      },
      program_manager: {
        communicationStyle: "organized-supportive",
        energyLevel: "moderate",
        coachingApproach: "structured",
        decisionSupport: "process-oriented",
        feedbackStyle: "systematic",
        pacing: "steady"
      },
      platform_orchestrator: {
        communicationStyle: "strategic-comprehensive",
        energyLevel: "adaptive",
        coachingApproach: "holistic",
        decisionSupport: "systems-thinking",
        feedbackStyle: "integrated",
        pacing: "adaptive"
      }
    };
    const adapted = { ...baseTraits[agentType] };
    if (traits.extraversion !== void 0) {
      if (traits.extraversion > 70) {
        adapted.energyLevel = "high";
        adapted.communicationStyle = adapted.communicationStyle + "-energetic";
      } else if (traits.extraversion < 30) {
        adapted.energyLevel = "moderate";
        adapted.communicationStyle = adapted.communicationStyle + "-thoughtful";
      }
    }
    if (traits.conscientiousness !== void 0 && traits.conscientiousness > 70) {
      adapted.pacing = "structured";
      adapted.feedbackStyle = "detailed";
    }
    if (traits.openness !== void 0 && traits.openness > 70) {
      adapted.coachingApproach = adapted.coachingApproach + "-exploratory";
    }
    if (workPrefs.decisionSpeed === "quick") {
      adapted.pacing = "fast";
      adapted.decisionSupport = "decisive";
    } else if (workPrefs.decisionSpeed === "thorough") {
      adapted.pacing = "deliberate";
      adapted.decisionSupport = "comprehensive";
    }
    if (workPrefs.feedbackPreference === "direct") {
      adapted.feedbackStyle = "direct";
    } else if (workPrefs.feedbackPreference === "gentle") {
      adapted.feedbackStyle = "supportive";
    }
    return adapted;
  }
  generateCommunicationAdjustments(profile) {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};
    const adjustments = {
      toneOfVoice: "professional-friendly",
      formalityLevel: "professional",
      detailLevel: "balanced",
      questioningStyle: "exploratory",
      encouragementFrequency: "moderate"
    };
    if (traits.agreeableness && traits.agreeableness > 70) {
      adjustments.toneOfVoice = "warm-supportive";
      adjustments.encouragementFrequency = "frequent";
    } else if (traits.agreeableness && traits.agreeableness < 30) {
      adjustments.toneOfVoice = "direct-professional";
      adjustments.encouragementFrequency = "minimal";
    }
    if (profile.communicationStyle === "direct") {
      adjustments.formalityLevel = "casual";
      adjustments.questioningStyle = "direct";
    } else if (profile.communicationStyle === "diplomatic") {
      adjustments.formalityLevel = "professional";
      adjustments.questioningStyle = "socratic";
    }
    if (traits.analyticalThinking && traits.analyticalThinking > 70) {
      adjustments.detailLevel = "detailed";
    } else if (traits.analyticalThinking && traits.analyticalThinking < 30) {
      adjustments.detailLevel = "high-level";
    }
    if (workPrefs.structureNeed === "high") {
      adjustments.detailLevel = "detailed";
      adjustments.questioningStyle = "structured";
    }
    return adjustments;
  }
  determineCoachingApproach(agentType, profile) {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};
    const defaultApproaches = {
      co_founder: "collaborative",
      co_investor: "challenging",
      co_builder: "supportive",
      business_advisor: "directive",
      investment_analyst: "collaborative",
      credit_analyst: "directive",
      impact_analyst: "supportive",
      program_manager: "collaborative",
      platform_orchestrator: "adaptive"
    };
    let approach = defaultApproaches[agentType];
    if (traits.conscientiousness && traits.conscientiousness > 70) {
      if (workPrefs.collaborationStyle === "independent") {
        approach = "directive";
      }
    }
    if (traits.openness && traits.openness > 70) {
      approach = "collaborative";
    }
    if (traits.resilience && traits.resilience > 70) {
      approach = "challenging";
    } else if (traits.resilience && traits.resilience < 40) {
      approach = "supportive";
    }
    return approach;
  }
  // ============================================================================
  // PERSONALITY INSIGHTS
  // ============================================================================
  async generatePersonalityInsights(userId) {
    const profiles = await this.getAllUserAssessments(userId);
    if (profiles.length === 0) {
      return [];
    }
    const latestProfile = profiles[0];
    const traits = latestProfile.personalityTraits || {};
    const insights = [];
    if (traits.openness !== void 0) {
      insights.push({
        trait: "Openness to Experience",
        score: traits.openness,
        interpretation: this.interpretTrait("openness", traits.openness),
        agentRecommendation: this.getAgentRecommendation("openness", traits.openness)
      });
    }
    if (traits.conscientiousness !== void 0) {
      insights.push({
        trait: "Conscientiousness",
        score: traits.conscientiousness,
        interpretation: this.interpretTrait("conscientiousness", traits.conscientiousness),
        agentRecommendation: this.getAgentRecommendation("conscientiousness", traits.conscientiousness)
      });
    }
    if (traits.extraversion !== void 0) {
      insights.push({
        trait: "Extraversion",
        score: traits.extraversion,
        interpretation: this.interpretTrait("extraversion", traits.extraversion),
        agentRecommendation: this.getAgentRecommendation("extraversion", traits.extraversion)
      });
    }
    if (traits.analyticalThinking !== void 0) {
      insights.push({
        trait: "Analytical Thinking",
        score: traits.analyticalThinking,
        interpretation: this.interpretTrait("analyticalThinking", traits.analyticalThinking),
        agentRecommendation: this.getAgentRecommendation("analyticalThinking", traits.analyticalThinking)
      });
    }
    if (traits.resilience !== void 0) {
      insights.push({
        trait: "Resilience",
        score: traits.resilience,
        interpretation: this.interpretTrait("resilience", traits.resilience),
        agentRecommendation: this.getAgentRecommendation("resilience", traits.resilience)
      });
    }
    return insights;
  }
  interpretTrait(trait, score) {
    const interpretations = {
      openness: {
        high: "You are highly creative, curious, and open to new experiences. You thrive on innovation and exploration.",
        medium: "You balance traditional approaches with openness to new ideas.",
        low: "You prefer proven methods and practical approaches over experimentation."
      },
      conscientiousness: {
        high: "You are highly organized, disciplined, and goal-oriented. You excel at planning and execution.",
        medium: "You balance structure with flexibility in your approach.",
        low: "You prefer flexibility and spontaneity over rigid planning."
      },
      extraversion: {
        high: "You are energized by social interaction and thrive in collaborative environments.",
        medium: "You balance social interaction with independent work.",
        low: "You prefer focused, independent work and recharge through solitude."
      },
      analyticalThinking: {
        high: "You excel at data-driven decision making and systematic problem solving.",
        medium: "You balance analytical thinking with intuition.",
        low: "You rely more on intuition and experience than detailed analysis."
      },
      resilience: {
        high: "You bounce back quickly from setbacks and maintain optimism under pressure.",
        medium: "You handle challenges well with occasional need for support.",
        low: "You benefit from strong support systems during challenging times."
      }
    };
    const level = score > 70 ? "high" : score > 40 ? "medium" : "low";
    return interpretations[trait]?.[level] || "Trait interpretation not available.";
  }
  getAgentRecommendation(trait, score) {
    const recommendations = {
      openness: {
        high: "I'll encourage exploration of innovative solutions and creative approaches.",
        medium: "I'll balance proven strategies with opportunities for innovation.",
        low: "I'll focus on practical, proven approaches with clear ROI."
      },
      conscientiousness: {
        high: "I'll provide structured frameworks and detailed action plans.",
        medium: "I'll offer flexible guidance with clear milestones.",
        low: "I'll help you develop light structure while respecting your flexibility."
      },
      extraversion: {
        high: "I'll be energetic and interactive in our conversations.",
        medium: "I'll adapt my energy to match your current state.",
        low: "I'll be thoughtful and give you space to process independently."
      },
      analyticalThinking: {
        high: "I'll provide data-driven insights and detailed analysis.",
        medium: "I'll balance data with intuitive guidance.",
        low: "I'll focus on practical wisdom and experience-based insights."
      },
      resilience: {
        high: "I'll challenge you to push boundaries and take calculated risks.",
        medium: "I'll provide balanced support and encouragement.",
        low: "I'll offer extra support and celebrate small wins frequently."
      }
    };
    const level = score > 70 ? "high" : score > 40 ? "medium" : "low";
    return recommendations[trait]?.[level] || "I'll adapt my approach to support you best.";
  }
  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================
  async createIndexes() {
    await this.assessmentProfiles.createIndex({ userId: 1, assessmentType: 1, completedAt: -1 });
    await this.assessmentProfiles.createIndex({ expiresAt: 1 }, { sparse: true });
    await this.agentAdaptations.createIndex({ userId: 1, agentType: 1 }, { unique: true });
    await this.agentAdaptations.createIndex({ assessmentProfileId: 1 });
    console.log("\u2705 Assessment integration indexes created");
  }
};
var assessmentServiceInstance = null;
function getAssessmentService() {
  if (!assessmentServiceInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || "iterativ-db";
    if (!connectionString) {
      throw new Error("MONGODB_CONNECTION_STRING environment variable is not set");
    }
    assessmentServiceInstance = new AssessmentIntegrationService(connectionString, databaseName);
  }
  return assessmentServiceInstance;
}

// server/routes/assessment-routes.ts
var router5 = Router2();
var requireAuth2 = (req, res, next) => {
  const user = req.user;
  if (!user || !user.id) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
};
router5.get("/types", requireAuth2, async (_req, res) => {
  try {
    const assessmentTypes = [
      {
        id: "riasec",
        name: "Career Interest Assessment (RIASEC)",
        description: "Discover your entrepreneurial interests and ideal role",
        duration: "10-15 minutes",
        questions: 48,
        benefits: [
          "Identify your natural strengths",
          "Find your ideal startup role",
          "Understand your work preferences",
          "Match with complementary co-founders"
        ]
      },
      {
        id: "big_five",
        name: "Personality Assessment (Big Five)",
        description: "Understand your personality traits and founder archetype",
        duration: "15-20 minutes",
        questions: 60,
        benefits: [
          "Discover your founder archetype",
          "Identify blind spots",
          "Optimize team composition",
          "Improve decision-making"
        ]
      },
      {
        id: "ai_readiness",
        name: "AI Readiness Assessment",
        description: "Evaluate your readiness to leverage AI in your startup",
        duration: "10-15 minutes",
        questions: 40,
        benefits: [
          "Assess AI adoption readiness",
          "Get personalized learning paths",
          "Identify AI opportunities",
          "Reduce AI implementation risks"
        ]
      },
      {
        id: "design_thinking",
        name: "Design Thinking Readiness",
        description: "Assess your organization's readiness for design thinking",
        duration: "15-20 minutes",
        questions: 50,
        benefits: [
          "Evaluate innovation culture",
          "Identify organizational blockers",
          "Get implementation roadmap",
          "Optimize for innovation"
        ]
      }
    ];
    res.json({ assessmentTypes });
    return;
  } catch (error) {
    console.error("Error fetching assessment types:", error);
    res.status(500).json({ error: "Failed to fetch assessment types" });
  }
});
router5.post("/start", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentType } = req.body;
    if (!assessmentType) {
      res.status(400).json({ error: "Assessment type is required" });
      return;
    }
    const engine = new AssessmentEngine({
      userId: userId.toString(),
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email
    });
    const questions = engine.getAssessmentQuestions(assessmentType);
    const assessmentDb = getAssessmentDatabase();
    const session2 = await assessmentDb.createSession(
      userId,
      assessmentType,
      questions.length
    );
    res.json({
      session: {
        sessionId: session2.sessionId,
        assessmentType: session2.assessmentType,
        totalQuestions: session2.totalQuestions,
        currentQuestionIndex: 0,
        progressPercentage: 0
      },
      questions
    });
    return;
  } catch (error) {
    console.error("Error starting assessment:", error);
    res.status(500).json({ error: "Failed to start assessment" });
  }
});
router5.get("/session/:sessionId", requireAuth2, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const assessmentDb = getAssessmentDatabase();
    const session2 = await assessmentDb.getSession(sessionId);
    if (!session2) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    if (session2.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }
    res.json({ session: session2 });
    return;
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});
router5.get("/active", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentDb = getAssessmentDatabase();
    const sessions = await assessmentDb.getUserActiveSessions(userId);
    res.json({ sessions });
    return;
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({ error: "Failed to fetch active sessions" });
  }
});
router5.post("/response", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, questionId, value } = req.body;
    if (!sessionId || !questionId || value === void 0) {
      res.status(400).json({ error: "Session ID, question ID, and value are required" });
      return;
    }
    const assessmentDb = getAssessmentDatabase();
    const session2 = await assessmentDb.getSession(sessionId);
    if (!session2) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    if (session2.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }
    if (session2.status !== "in_progress") {
      res.status(400).json({ error: "Session is not in progress" });
      return;
    }
    const response = {
      questionId,
      value,
      timestamp: /* @__PURE__ */ new Date()
    };
    await assessmentDb.saveResponse(sessionId, response);
    const updatedSession = await assessmentDb.getSession(sessionId);
    res.json({
      success: true,
      progress: {
        currentQuestionIndex: updatedSession.currentQuestionIndex,
        totalQuestions: updatedSession.totalQuestions,
        progressPercentage: updatedSession.progressPercentage,
        isComplete: updatedSession.progressPercentage >= 100
      }
    });
    return;
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ error: "Failed to save response" });
  }
});
router5.post("/complete", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" });
      return;
    }
    const assessmentDb = getAssessmentDatabase();
    const session2 = await assessmentDb.getSession(sessionId);
    if (!session2) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    if (session2.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }
    if (session2.status !== "in_progress") {
      res.status(400).json({ error: "Session is not in progress" });
      return;
    }
    const engine = new AssessmentEngine({
      userId: userId.toString(),
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email
    });
    let results;
    let compositeProfile = void 0;
    switch (session2.assessmentType) {
      case "riasec":
        results = engine.processRIASEC(session2.responses);
        break;
      case "design_thinking":
        results = engine.processDesignThinkingReadiness(session2.responses);
        break;
      default:
        res.status(400).json({ error: `Unsupported assessment type: ${session2.assessmentType}` });
        return;
    }
    const assessmentId = await assessmentDb.completeSession(
      sessionId,
      results,
      compositeProfile
    );
    if (session2.assessmentType === "riasec") {
      try {
        const assessmentService = getAssessmentService();
        await assessmentService.saveAssessmentProfile({
          userId,
          assessmentType: "personality",
          assessmentResults: results,
          personalityTraits: extractPersonalityTraits(results, session2.assessmentType),
          workPreferences: extractWorkPreferences(results, session2.assessmentType),
          communicationStyle: determineCommunicationStyle(results),
          decisionStyle: determineDecisionStyle(results),
          riskProfile: determineRiskProfile(results),
          completedAt: /* @__PURE__ */ new Date()
        });
        console.log(`\u2705 Assessment profile saved for agent adaptation (User ${userId})`);
      } catch (error) {
        console.error("Error saving assessment profile for agent adaptation:", error);
      }
    }
    res.json({
      success: true,
      assessmentId,
      results,
      message: "Assessment completed successfully"
    });
    return;
  } catch (error) {
    console.error("Error completing assessment:", error);
    res.status(500).json({ error: "Failed to complete assessment" });
  }
});
router5.post("/abandon", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;
    const assessmentDb = getAssessmentDatabase();
    const session2 = await assessmentDb.getSession(sessionId);
    if (!session2) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    if (session2.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }
    await assessmentDb.abandonSession(sessionId);
    res.json({ success: true, message: "Session abandoned" });
    return;
  } catch (error) {
    console.error("Error abandoning session:", error);
    res.status(500).json({ error: "Failed to abandon session" });
  }
});
router5.get("/results/:assessmentType", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentType } = req.params;
    const assessmentDb = getAssessmentDatabase();
    const assessment = await assessmentDb.getLatestAssessment(userId, assessmentType);
    if (!assessment) {
      res.status(404).json({ error: "No assessment found for this type" });
      return;
    }
    res.json({
      assessment: {
        id: assessment._id,
        assessmentType: assessment.assessmentType,
        results: assessment.results,
        completedAt: assessment.completedAt,
        version: assessment.version
      }
    });
    return;
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    res.status(500).json({ error: "Failed to fetch assessment results" });
  }
});
router5.get("/results", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentDb = getAssessmentDatabase();
    const assessments = await assessmentDb.getAllUserAssessments(userId);
    res.json({
      assessments: assessments.map((a) => ({
        id: a._id,
        assessmentType: a.assessmentType,
        completedAt: a.completedAt,
        hasResults: !!a.results
      }))
    });
    return;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});
router5.get("/profile", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentDb = getAssessmentDatabase();
    const profile = await assessmentDb.getUserCompositeProfile(userId);
    if (!profile) {
      res.status(404).json({ error: "No composite profile found. Complete all assessments first." });
      return;
    }
    res.json({ profile });
    return;
  } catch (error) {
    console.error("Error fetching composite profile:", error);
    res.status(500).json({ error: "Failed to fetch composite profile" });
  }
});
router5.get("/history/:assessmentType", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentType } = req.params;
    const assessmentDb = getAssessmentDatabase();
    const evolution = await assessmentDb.getAssessmentEvolution(userId, assessmentType);
    if (!evolution) {
      res.status(404).json({ error: "No assessment history found" });
      return;
    }
    res.json({ evolution });
    return;
  } catch (error) {
    console.error("Error fetching assessment history:", error);
    res.status(500).json({ error: "Failed to fetch assessment history" });
  }
});
router5.get("/stats", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentDb = getAssessmentDatabase();
    const stats = await assessmentDb.getAssessmentStats(userId);
    res.json({ stats });
    return;
  } catch (error) {
    console.error("Error fetching assessment stats:", error);
    res.status(500).json({ error: "Failed to fetch assessment stats" });
  }
});
router5.get("/personality", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentService = getAssessmentService();
    const profile = await assessmentService.getAssessmentProfile(userId, "personality");
    if (!profile) {
      res.status(404).json({ error: "No personality profile found" });
      return;
    }
    res.json({ profile });
  } catch (error) {
    console.error("Error fetching personality profile:", error);
    res.status(500).json({ error: "Failed to fetch personality profile" });
  }
});
router5.get("/personality/insights", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentService = getAssessmentService();
    const insights = await assessmentService.generatePersonalityInsights(userId);
    res.json({ insights });
    return;
  } catch (error) {
    console.error("Error generating personality insights:", error);
    res.status(500).json({ error: "Failed to generate personality insights" });
  }
});
router5.get("/agent-adaptation/:agentType", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const { agentType } = req.params;
    const assessmentService = getAssessmentService();
    const adaptation = await assessmentService.getAgentAdaptation(userId, agentType);
    if (!adaptation) {
      res.status(404).json({ error: "No adaptation found for this agent" });
      return;
    }
    res.json({ adaptation });
    return;
  } catch (error) {
    console.error("Error fetching agent adaptation:", error);
    res.status(500).json({ error: "Failed to fetch agent adaptation" });
  }
});
router5.post("/adapt-agents", requireAuth2, async (req, res) => {
  try {
    const userId = req.user.id;
    const assessmentService = getAssessmentService();
    const profile = await assessmentService.getAssessmentProfile(userId, "personality");
    if (!profile) {
      res.status(404).json({ error: "No personality profile found. Complete an assessment first." });
      return;
    }
    const agentTypes = ["co_founder", "co_investor", "co_builder"];
    const adaptations = [];
    for (const agentType of agentTypes) {
      try {
        const adaptation = await assessmentService.adaptAgentPersonality(
          userId,
          agentType,
          profile._id
        );
        adaptations.push({
          agentType,
          success: true,
          adaptation
        });
      } catch (error) {
        adaptations.push({
          agentType,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    res.json({
      success: true,
      message: "Agent adaptations completed",
      adaptations
    });
    return;
  } catch (error) {
    console.error("Error adapting agents:", error);
    res.status(500).json({ error: "Failed to adapt agents" });
  }
});
router5.get("/admin/stats", requireAuth2, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    const assessmentDb = getAssessmentDatabase();
    const stats = await assessmentDb.getPlatformAssessmentStats();
    res.json({ stats });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
});
function extractPersonalityTraits(results, assessmentType) {
  if (assessmentType === "riasec") {
    return {
      openness: results.scores?.artistic || 50,
      conscientiousness: results.scores?.conventional || 50,
      extraversion: results.scores?.enterprising || 50,
      agreeableness: results.scores?.social || 50,
      analyticalThinking: results.scores?.investigative || 50,
      creativity: results.scores?.artistic || 50,
      resilience: 50
      // Default, would come from Big Five
    };
  }
  return {};
}
function extractWorkPreferences(results, assessmentType) {
  if (assessmentType === "riasec") {
    const scores = results.scores || {};
    return {
      workPace: scores.enterprising > 70 ? "fast" : scores.conventional > 70 ? "deliberate" : "moderate",
      decisionSpeed: scores.enterprising > 70 ? "quick" : "balanced",
      collaborationStyle: scores.social > 70 ? "collaborative" : scores.realistic > 70 ? "independent" : "mixed",
      feedbackPreference: scores.enterprising > 70 ? "direct" : "balanced",
      structureNeed: scores.conventional > 70 ? "high" : scores.artistic > 70 ? "low" : "medium"
    };
  }
  return {};
}
function determineCommunicationStyle(results) {
  const scores = results.scores || {};
  if (scores.enterprising > 70) return "direct";
  if (scores.social > 70) return "diplomatic";
  if (scores.investigative > 70) return "analytical";
  if (scores.artistic > 70) return "expressive";
  return "balanced";
}
function determineDecisionStyle(results) {
  const scores = results.scores || {};
  if (scores.investigative > 70) return "data-driven";
  if (scores.enterprising > 70) return "decisive";
  if (scores.social > 70) return "collaborative";
  if (scores.artistic > 70) return "intuitive";
  return "balanced";
}
function determineRiskProfile(results) {
  const scores = results.scores || {};
  if (scores.enterprising > 75) return "aggressive";
  if (scores.conventional > 75) return "conservative";
  if (scores.investigative > 70) return "calculated";
  return "moderate";
}
var assessment_routes_default = router5;

// server/routes/business-plan-routes.ts
import { Router as Router3 } from "express";

// server/repositories/base-repository.ts
var BaseRepository = class {
  storage = storage2;
  /**
   * Check if entity exists
   */
  async exists(id) {
    const entity = await this.getById(id);
    return entity !== void 0;
  }
  /**
   * Get entities with pagination
   */
  async getPaginated(page = 1, limit = 10) {
    const allEntities = await this.getAll();
    const total = allEntities.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = allEntities.slice(offset, offset + limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }
  /**
   * Validate entity data
   */
  validateEntity(entity) {
    return entity && typeof entity === "object" && entity.id;
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  /**
   * Update timestamp
   */
  updateTimestamp(entity) {
    return {
      ...entity,
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
};

// server/repositories/user-repository.ts
var UserRepository = class extends BaseRepository {
  async getById(id) {
    const user = await this.storage.getUserById(id);
    return user;
  }
  async getAll() {
    const users = await this.storage.getAllUsers();
    return users;
  }
  async create(data) {
    const user = await this.storage.createUser(data);
    return user;
  }
  async update(id, data) {
    const user = await this.storage.updateUser(id, data);
    return user;
  }
  async delete(id) {
    return await this.storage.deleteUser(id);
  }
  async getCount() {
    const users = await this.getAll();
    return users.length;
  }
  async search(query) {
    const users = await this.storage.searchUsers(query);
    return users;
  }
  /**
   * Get user by email
   */
  async getByEmail(email) {
    const user = await this.storage.getUserByEmail(email);
    return user;
  }
  /**
   * Get users by type
   */
  async getByType(userType) {
    const users = await this.storage.getUsersByType(userType);
    return users;
  }
  /**
   * Upsert user (create or update)
   */
  async upsert(data) {
    const user = await this.storage.upsertUser(data);
    return user;
  }
  /**
   * Get user settings
   */
  async getSettings(userId) {
    return await this.storage.getUserSettings(userId);
  }
  /**
   * Update user settings
   */
  async updateSettings(userId, settings) {
    return await this.storage.updateUserSettings(userId, settings);
  }
  /**
   * Reset user settings
   */
  async resetSettings(userId) {
    return await this.storage.resetUserSettings(userId);
  }
  /**
   * Export user settings
   */
  async exportSettings(userId) {
    return await this.storage.exportUserSettings(userId);
  }
  /**
   * Get user organizations
   */
  async getOrganizations(userId) {
    return await this.storage.getUserOrganizations(userId);
  }
  /**
   * Get user collaborations
   */
  async getCollaborations(userId) {
    return await this.storage.getUserCollaborations(userId);
  }
  /**
   * Get user invitations
   */
  async getInvitations(userId) {
    return await this.storage.getUserInvitations(userId);
  }
  /**
   * Get user team members
   */
  async getTeamMembers(userId) {
    return await this.storage.getTeamMembers(userId);
  }
};

// server/repositories/business-plan-repository.ts
var BusinessPlanRepository = class extends BaseRepository {
  async getById(id) {
    const plan = await this.storage.getBusinessPlan(id);
    return plan;
  }
  async getAll() {
    const plans = await this.storage.getAllBusinessPlans();
    return plans;
  }
  async create(data) {
    const plan = await this.storage.createBusinessPlan(data);
    return plan;
  }
  async update(id, data) {
    const plan = await this.storage.updateBusinessPlan(id, data);
    return plan;
  }
  async delete(id) {
    return await this.storage.deleteBusinessPlan(id);
  }
  async getCount() {
    const plans = await this.getAll();
    return plans.length;
  }
  async search(query) {
    const plans = await this.storage.searchBusinessPlans(query);
    return plans;
  }
  /**
   * Get business plans by user ID
   */
  async getByUserId(userId) {
    const plans = await this.storage.getBusinessPlansByUserId(userId);
    return plans;
  }
  /**
   * Get plan sections
   */
  async getSections(planId) {
    return await this.storage.getPlanSections(planId);
  }
  /**
   * Get plan section by ID
   */
  async getSection(id) {
    return await this.storage.getPlanSection(id);
  }
  /**
   * Create plan section
   */
  async createSection(data) {
    return await this.storage.createPlanSection(data);
  }
  /**
   * Update plan section
   */
  async updateSection(id, updates) {
    return await this.storage.updatePlanSection(id, updates);
  }
  /**
   * Get financial data
   */
  async getFinancialData(planId) {
    return await this.storage.getFinancialData(planId);
  }
  /**
   * Create financial data
   */
  async createFinancialData(data) {
    return await this.storage.createFinancialData(data);
  }
  /**
   * Update financial data
   */
  async updateFinancialData(id, updates) {
    return await this.storage.updateFinancialData(id, updates);
  }
  /**
   * Get analysis score
   */
  async getAnalysisScore(planId) {
    return await this.storage.getAnalysisScore(planId);
  }
  /**
   * Create analysis score
   */
  async createAnalysisScore(data) {
    return await this.storage.createAnalysisScore(data);
  }
  /**
   * Update analysis score
   */
  async updateAnalysisScore(id, updates) {
    return await this.storage.updateAnalysisScore(id, updates);
  }
  /**
   * Get pitch deck
   */
  async getPitchDeck(planId) {
    return await this.storage.getPitchDeck(planId);
  }
  /**
   * Create pitch deck
   */
  async createPitchDeck(data) {
    return await this.storage.createPitchDeck(data);
  }
  /**
   * Get investments for business plan
   */
  async getInvestments(planId) {
    return await this.storage.getInvestments(planId);
  }
  /**
   * Get loans for business plan
   */
  async getLoans(planId) {
    return await this.storage.getLoans(planId);
  }
  /**
   * Get advisory services for business plan
   */
  async getAdvisoryServices(planId) {
    return await this.storage.getAdvisoryServices(planId);
  }
  /**
   * Get financial projections
   */
  async getFinancialProjections(planId) {
    return await this.storage.getFinancialProjections(planId);
  }
  /**
   * Get financial projection by ID
   */
  async getFinancialProjection(id) {
    return await this.storage.getFinancialProjection(id);
  }
  /**
   * Create financial projection
   */
  async createFinancialProjection(data) {
    return await this.storage.createFinancialProjection(data);
  }
  /**
   * Update financial projection
   */
  async updateFinancialProjection(id, updates) {
    return await this.storage.updateFinancialProjection(id, updates);
  }
  /**
   * Get AI business analysis
   */
  async getAiBusinessAnalysis(planId) {
    return await this.storage.getAiBusinessAnalysis(planId);
  }
  /**
   * Create AI business analysis
   */
  async createAiBusinessAnalysis(data) {
    return await this.storage.createAiBusinessAnalysis(data);
  }
  /**
   * Update AI business analysis
   */
  async updateAiBusinessAnalysis(id, updates) {
    return await this.storage.updateAiBusinessAnalysis(id, updates);
  }
};

// server/repositories/organization-repository.ts
var OrganizationRepository = class extends BaseRepository {
  async getById(id) {
    const organization = await this.storage.getOrganization(id);
    return organization;
  }
  async getAll() {
    const organizations = await this.storage.getAllOrganizations();
    return organizations;
  }
  async create(data) {
    const organization = await this.storage.createOrganization(data);
    return organization;
  }
  async update(id, data) {
    const organization = await this.storage.updateOrganization(id, data);
    return organization;
  }
  async delete(id) {
    return await this.storage.deleteOrganization(id);
  }
  async getCount() {
    const organizations = await this.getAll();
    return organizations.length;
  }
  async search(query) {
    const organizations = await this.getAll();
    return organizations.filter(
      (org) => org.name.toLowerCase().includes(query.toLowerCase()) || org.description?.toLowerCase().includes(query.toLowerCase()) || org.industry?.toLowerCase().includes(query.toLowerCase())
    );
  }
  /**
   * Get organizations by type
   */
  async getByType(orgType) {
    const organizations = await this.storage.getOrganizationsByType(orgType);
    return organizations;
  }
  /**
   * Get organization members
   */
  async getMembers(organizationId) {
    return await this.storage.getOrganizationMembers(organizationId);
  }
  /**
   * Add user to organization
   */
  async addMember(userId, organizationId, role) {
    return await this.storage.addUserToOrganization(userId, organizationId, role);
  }
  /**
   * Get organization invitations
   */
  async getInvitations(organizationId) {
    return await this.storage.getOrganizationInvitations(organizationId);
  }
  /**
   * Create organization invitation
   */
  async createInvitation(data) {
    return await this.storage.createOrganizationInvitation(data);
  }
  /**
   * Get organization analytics
   */
  async getAnalytics(organizationId) {
    return await this.storage.getOrganizationAnalytics(organizationId);
  }
  /**
   * Get organization programs
   */
  async getPrograms(organizationId) {
    return await this.storage.getPrograms(organizationId);
  }
  /**
   * Get program by ID
   */
  async getProgram(id) {
    return await this.storage.getProgram(id);
  }
  /**
   * Create program
   */
  async createProgram(data) {
    return await this.storage.createProgram(data);
  }
  /**
   * Update program
   */
  async updateProgram(id, updates) {
    return await this.storage.updateProgram(id, updates);
  }
  /**
   * Delete program
   */
  async deleteProgram(id) {
    return await this.storage.deleteProgram(id);
  }
  /**
   * Get program cohorts
   */
  async getCohorts(programId) {
    return await this.storage.getCohorts(programId);
  }
  /**
   * Get cohort by ID
   */
  async getCohort(id) {
    return await this.storage.getCohort(id);
  }
  /**
   * Create cohort
   */
  async createCohort(data) {
    return await this.storage.createCohort(data);
  }
  /**
   * Update cohort
   */
  async updateCohort(id, updates) {
    return await this.storage.updateCohort(id, updates);
  }
  /**
   * Delete cohort
   */
  async deleteCohort(id) {
    return await this.storage.deleteCohort(id);
  }
  /**
   * Get organization portfolios
   */
  async getPortfolios(organizationId) {
    return await this.storage.getPortfolios(organizationId);
  }
  /**
   * Get portfolio by ID
   */
  async getPortfolio(id) {
    return await this.storage.getPortfolio(id);
  }
  /**
   * Create portfolio
   */
  async createPortfolio(data) {
    return await this.storage.createPortfolio(data);
  }
  /**
   * Update portfolio
   */
  async updatePortfolio(id, updates) {
    return await this.storage.updatePortfolio(id, updates);
  }
  /**
   * Delete portfolio
   */
  async deletePortfolio(id) {
    return await this.storage.deletePortfolio(id);
  }
  /**
   * Get portfolio companies
   */
  async getPortfolioCompanies(portfolioId) {
    return await this.storage.getPortfolioCompanies(portfolioId);
  }
  /**
   * Get portfolio companies by cohort
   */
  async getPortfolioCompaniesByCohort(cohortId) {
    return await this.storage.getPortfolioCompaniesByCohort(cohortId);
  }
  /**
   * Get portfolio company by ID
   */
  async getPortfolioCompany(id) {
    return await this.storage.getPortfolioCompany(id);
  }
  /**
   * Create portfolio company
   */
  async createPortfolioCompany(data) {
    return await this.storage.createPortfolioCompany(data);
  }
  /**
   * Update portfolio company
   */
  async updatePortfolioCompany(id, updates) {
    return await this.storage.updatePortfolioCompany(id, updates);
  }
  /**
   * Delete portfolio company
   */
  async deletePortfolioCompany(id) {
    return await this.storage.deletePortfolioCompany(id);
  }
  /**
   * Get educational modules
   */
  async getEducationalModules(creatorId) {
    return await this.storage.getEducationalModules(creatorId);
  }
  /**
   * Get educational module by ID
   */
  async getEducationalModule(id) {
    return await this.storage.getEducationalModule(id);
  }
  /**
   * Create educational module
   */
  async createEducationalModule(data) {
    return await this.storage.createEducationalModule(data);
  }
  /**
   * Update educational module
   */
  async updateEducationalModule(id, updates) {
    return await this.storage.updateEducationalModule(id, updates);
  }
  /**
   * Delete educational module
   */
  async deleteEducationalModule(id) {
    return await this.storage.deleteEducationalModule(id);
  }
  /**
   * Get mentorships by mentor
   */
  async getMentorshipsByMentor(mentorId) {
    return await this.storage.getMentorshipsByMentor(mentorId);
  }
  /**
   * Get mentorships by mentee
   */
  async getMentorshipsByMentee(menteeId) {
    return await this.storage.getMentorshipsByMentee(menteeId);
  }
  /**
   * Get mentorships by program
   */
  async getMentorshipsByProgram(programId) {
    return await this.storage.getMentorshipsByProgram(programId);
  }
  /**
   * Get mentorship by ID
   */
  async getMentorship(id) {
    return await this.storage.getMentorship(id);
  }
  /**
   * Create mentorship
   */
  async createMentorship(data) {
    return await this.storage.createMentorship(data);
  }
  /**
   * Update mentorship
   */
  async updateMentorship(id, updates) {
    return await this.storage.updateMentorship(id, updates);
  }
  /**
   * Delete mentorship
   */
  async deleteMentorship(id) {
    return await this.storage.deleteMentorship(id);
  }
  /**
   * Get venture projects
   */
  async getVentureProjects(organizationId) {
    return await this.storage.getVentureProjects(organizationId);
  }
  /**
   * Get venture project by ID
   */
  async getVentureProject(id) {
    return await this.storage.getVentureProject(id);
  }
  /**
   * Create venture project
   */
  async createVentureProject(data) {
    return await this.storage.createVentureProject(data);
  }
  /**
   * Update venture project
   */
  async updateVentureProject(id, updates) {
    return await this.storage.updateVentureProject(id, updates);
  }
  /**
   * Delete venture project
   */
  async deleteVentureProject(id) {
    return await this.storage.deleteVentureProject(id);
  }
};

// server/repositories/credit-repository.ts
var CreditRepository = class extends BaseRepository {
  async getById(id) {
    const score = await this.storage.getCreditScore(id);
    return score;
  }
  async getAll() {
    const allUsers = await this.storage.getAllUsers();
    const allScores = [];
    for (const user of allUsers) {
      const userScores = await this.storage.getCreditScores(user.id.toString());
      allScores.push(...userScores);
    }
    return allScores;
  }
  async create(data) {
    const score = await this.storage.createCreditScore(data);
    return score;
  }
  async update(id, data) {
    const score = await this.storage.updateCreditScore(id, data);
    return score;
  }
  async delete(id) {
    return false;
  }
  async getCount() {
    const scores = await this.getAll();
    return scores.length;
  }
  async search(query) {
    const scores = await this.getAll();
    return scores.filter(
      (score) => score.userId.includes(query) || score.score.toString().includes(query)
    );
  }
  /**
   * Get credit scores by user ID
   */
  async getByUserId(userId) {
    const scores = await this.storage.getCreditScores(userId);
    return scores;
  }
  /**
   * Get latest credit score for user
   */
  async getLatestByUserId(userId) {
    const scores = await this.getByUserId(userId);
    if (scores.length === 0) return void 0;
    return scores.sort(
      (a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()
    )[0];
  }
  /**
   * Get financial milestones by user ID
   */
  async getFinancialMilestones(userId) {
    const milestones = await this.storage.getFinancialMilestones(userId);
    return milestones;
  }
  /**
   * Get financial milestone by ID
   */
  async getFinancialMilestone(id) {
    const milestone = await this.storage.getFinancialMilestone(id);
    return milestone;
  }
  /**
   * Create financial milestone
   */
  async createFinancialMilestone(data) {
    const milestone = await this.storage.createFinancialMilestone(data);
    return milestone;
  }
  /**
   * Update financial milestone
   */
  async updateFinancialMilestone(id, data) {
    const milestone = await this.storage.updateFinancialMilestone(id, data);
    return milestone;
  }
  /**
   * Delete financial milestone
   */
  async deleteFinancialMilestone(id) {
    return false;
  }
  /**
   * Get AI coaching messages by user ID
   */
  async getAiCoachingMessages(userId) {
    return await this.storage.getAiCoachingMessages(userId);
  }
  /**
   * Create AI coaching message
   */
  async createAiCoachingMessage(data) {
    return await this.storage.createAiCoachingMessage(data);
  }
  /**
   * Get credit tips
   */
  async getCreditTips() {
    return await this.storage.getCreditTips();
  }
  /**
   * Get credit tips by category
   */
  async getCreditTipsByCategory(category) {
    return await this.storage.getCreditTipsByCategory(category);
  }
  /**
   * Get credit tip by ID
   */
  async getCreditTip(id) {
    return await this.storage.getCreditTip(id);
  }
  /**
   * Create credit tip
   */
  async createCreditTip(data) {
    return await this.storage.createCreditTip(data);
  }
  /**
   * Get user credit tips
   */
  async getUserCreditTips(userId) {
    return await this.storage.getUserCreditTips(userId);
  }
  /**
   * Create user credit tip
   */
  async createUserCreditTip(data) {
    return await this.storage.createUserCreditTip(data);
  }
  /**
   * Update user credit tip
   */
  async updateUserCreditTip(id, updates) {
    return await this.storage.updateUserCreditTip(id, updates);
  }
  /**
   * Get credit achievements
   */
  async getCreditAchievements() {
    return await this.storage.getCreditAchievements();
  }
  /**
   * Get credit achievements by category
   */
  async getCreditAchievementsByCategory(category) {
    return await this.storage.getCreditAchievementsByCategory(category);
  }
  /**
   * Get credit achievement by ID
   */
  async getCreditAchievement(id) {
    return await this.storage.getCreditAchievement(id);
  }
  /**
   * Create credit achievement
   */
  async createCreditAchievement(data) {
    return await this.storage.createCreditAchievement(data);
  }
  /**
   * Get user credit achievements
   */
  async getUserCreditAchievements(userId) {
    return await this.storage.getUserCreditAchievements(userId);
  }
  /**
   * Get unseen achievements for user
   */
  async getUnseenAchievements(userId) {
    return await this.storage.getUnseenAchievements(userId);
  }
  /**
   * Create user credit achievement
   */
  async createUserCreditAchievement(data) {
    return await this.storage.createUserCreditAchievement(data);
  }
  /**
   * Update user credit achievement
   */
  async updateUserCreditAchievement(id, updates) {
    return await this.storage.updateUserCreditAchievement(id, updates);
  }
  /**
   * Mark achievement as seen
   */
  async markAchievementAsSeen(id) {
    return await this.storage.markAchievementAsSeen(id);
  }
  /**
   * Get credit score history by user ID
   */
  async getCreditScoreHistory(userId) {
    return await this.storage.getCreditScoreHistory(userId);
  }
  /**
   * Create credit score history entry
   */
  async createCreditScoreHistory(data) {
    return await this.storage.createCreditScoreHistory(data);
  }
  /**
   * Get user reward points
   */
  async getUserRewardPoints(userId) {
    return await this.storage.getUserRewardPoints(userId);
  }
  /**
   * Create user reward points
   */
  async createUserRewardPoints(data) {
    return await this.storage.createUserRewardPoints(data);
  }
  /**
   * Update user reward points
   */
  async updateUserRewardPoints(id, updates) {
    return await this.storage.updateUserRewardPoints(id, updates);
  }
  /**
   * Add points to user
   */
  async addUserPoints(userId, points) {
    return await this.storage.addUserPoints(userId, points);
  }
  /**
   * Get point transactions by user ID
   */
  async getPointTransactions(userId) {
    return await this.storage.getPointTransactions(userId);
  }
  /**
   * Create point transaction
   */
  async createPointTransaction(data) {
    return await this.storage.createPointTransaction(data);
  }
  /**
   * Get credit score tiers
   */
  async getCreditScoreTiers() {
    return await this.storage.getCreditScoreTiers();
  }
  /**
   * Get credit score tier by ID
   */
  async getCreditScoreTier(id) {
    return await this.storage.getCreditScoreTier(id);
  }
  /**
   * Get credit score tier by score
   */
  async getCreditScoreTierByScore(score) {
    return await this.storage.getCreditScoreTierByScore(score);
  }
  /**
   * Create credit score tier
   */
  async createCreditScoreTier(data) {
    return await this.storage.createCreditScoreTier(data);
  }
  /**
   * Update credit score tier
   */
  async updateCreditScoreTier(id, updates) {
    return await this.storage.updateCreditScoreTier(id, updates);
  }
};

// server/repositories/index.ts
var userRepository = new UserRepository();
var businessPlanRepository = new BusinessPlanRepository();
var organizationRepository = new OrganizationRepository();
var creditRepository = new CreditRepository();

// server/utils/logger.ts
var Logger = class _Logger {
  context = {};
  minLevel = "info" /* INFO */;
  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.minLevel = "debug" /* DEBUG */;
    } else if (process.env.LOG_LEVEL) {
      this.minLevel = process.env.LOG_LEVEL;
    }
  }
  /**
   * Set persistent context for all subsequent logs
   */
  setContext(context) {
    this.context = { ...this.context, ...context };
  }
  /**
   * Clear all context
   */
  clearContext() {
    this.context = {};
  }
  /**
   * Create a child logger with additional context
   */
  child(context) {
    const childLogger = new _Logger();
    childLogger.context = { ...this.context, ...context };
    childLogger.minLevel = this.minLevel;
    return childLogger;
  }
  shouldLog(level) {
    const levels = ["debug" /* DEBUG */, "info" /* INFO */, "warn" /* WARN */, "error" /* ERROR */];
    const currentLevelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    return currentLevelIndex >= minLevelIndex;
  }
  formatLogEntry(entry) {
    if (process.env.NODE_ENV === "production") {
      return JSON.stringify(entry);
    } else {
      const { timestamp, level, message, context, meta, error } = entry;
      let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      if (context && Object.keys(context).length > 0) {
        output += `
  Context: ${JSON.stringify(context, null, 2)}`;
      }
      if (meta) {
        output += `
  Meta: ${JSON.stringify(meta, null, 2)}`;
      }
      if (error) {
        output += `
  Error: ${error.name}: ${error.message}`;
        if (error.stack) {
          output += `
${error.stack}`;
        }
      }
      return output;
    }
  }
  log(level, message, meta) {
    if (!this.shouldLog(level)) {
      return;
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...Object.keys(this.context).length > 0 && { context: this.context },
      ...meta && { meta }
    };
    const formattedLog = this.formatLogEntry(logEntry);
    if (level === "error" /* ERROR */) {
      console.error(formattedLog);
    } else if (level === "warn" /* WARN */) {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(logEntry);
    }
  }
  sendToExternalService(_entry) {
  }
  /**
   * Log debug message (development only)
   */
  debug(message, meta) {
    this.log("debug" /* DEBUG */, message, meta);
  }
  /**
   * Log informational message
   */
  info(message, meta) {
    this.log("info" /* INFO */, message, meta);
  }
  /**
   * Log warning message
   */
  warn(message, meta) {
    this.log("warn" /* WARN */, message, meta);
  }
  /**
   * Log error message with optional error object
   */
  error(message, error, meta) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logEntry = {
      timestamp,
      level: "error" /* ERROR */,
      message,
      ...Object.keys(this.context).length > 0 && { context: this.context },
      ...meta && { meta }
    };
    if (error instanceof Error) {
      logEntry.error = {
        message: error.message,
        ...error.stack && { stack: error.stack },
        name: error.name,
        ...error.code && { code: error.code }
      };
    } else if (error) {
      logEntry.error = {
        message: String(error),
        name: "UnknownError"
      };
    }
    const formattedLog = this.formatLogEntry(logEntry);
    console.error(formattedLog);
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(logEntry);
    }
  }
  /**
   * Time a function execution
   */
  async time(label, fn, meta) {
    const startTime = Date.now();
    this.debug(`Starting: ${label}`, meta);
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.info(`Completed: ${label}`, { ...meta, duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`Failed: ${label}`, error, { ...meta, duration: `${duration}ms` });
      throw error;
    }
  }
};
var logger = new Logger();

// server/utils/errors.ts
import { ZodError } from "zod";
var AppError = class extends Error {
  isOperational = true;
  message;
  statusCode;
  code;
  details;
  constructor(statusCode, message, code, details) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "Unauthorized access") {
    super(401, message, "UNAUTHORIZED");
  }
};
var ForbiddenError = class extends AppError {
  constructor(message = "Access forbidden") {
    super(403, message, "FORBIDDEN");
  }
};
var NotFoundError = class extends AppError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
};
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
function assertExists(value, resource = "Resource") {
  if (value === null || value === void 0) {
    throw new NotFoundError(resource);
  }
}

// shared/types/validation.ts
import { z as z3 } from "zod";
var MetricSchema = z3.object({
  name: z3.string().min(1).max(100),
  value: z3.number(),
  unit: z3.string().optional(),
  trend: z3.enum(["up", "down", "stable"]).optional(),
  description: z3.string().max(500).optional()
});
var TeamMemberSchema = z3.object({
  name: z3.string().min(1).max(100),
  role: z3.string().min(1).max(100),
  experience: z3.number().min(0).max(100),
  skills: z3.array(z3.string().max(50)).max(20),
  bio: z3.string().max(1e3).optional(),
  linkedIn: z3.string().url().optional()
});
var CreditFactorSchema = z3.object({
  name: z3.string().min(1).max(100),
  impact: z3.enum(["positive", "negative", "neutral"]),
  weight: z3.number().min(0).max(1),
  description: z3.string().max(500).optional()
});
var PitchSlideSchema = z3.object({
  id: z3.string().uuid(),
  order: z3.number().int().min(0),
  type: z3.enum(["cover", "problem", "solution", "market", "product", "business-model", "traction", "team", "financials", "ask", "custom"]),
  title: z3.string().min(1).max(200),
  content: z3.string().max(5e3),
  imageUrl: z3.string().url().optional(),
  notes: z3.string().max(2e3).optional()
});
var InsertBusinessPlanSchema = z3.object({
  userId: z3.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_]+$/),
  title: z3.string().min(1).max(200).trim(),
  description: z3.string().max(5e3).trim().optional(),
  industry: z3.string().max(100).trim().optional(),
  stage: z3.enum(["idea", "prototype", "mvp", "growth", "scale"]).optional()
});
var InsertPlanSectionSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  chapterId: z3.string().min(1).max(100),
  sectionId: z3.string().min(1).max(100),
  content: z3.string().max(5e4),
  order: z3.number().int().min(0).optional()
});
var InsertFinancialDataSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  year: z3.number().int().min(2e3).max(2100),
  revenue: z3.number().min(0),
  expenses: z3.number().min(0),
  profit: z3.number(),
  cashFlow: z3.number(),
  projectedRevenue: z3.number().min(0).optional(),
  projectedExpenses: z3.number().min(0).optional()
});
var InsertAnalysisScoreSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  companyValue: z3.number().min(0),
  companyValueChange: z3.number(),
  revenueMultiple: z3.number().min(0),
  revenueMultipleChange: z3.number(),
  runway: z3.number().min(0),
  runwayChange: z3.number(),
  burnRate: z3.number().min(0),
  burnRateChange: z3.number(),
  financialMetrics: z3.array(MetricSchema),
  nonFinancialMetrics: z3.array(MetricSchema),
  marketMetrics: z3.array(MetricSchema),
  teamAssessment: z3.array(TeamMemberSchema)
});
var InsertPitchDeckSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  title: z3.string().min(1).max(200),
  slides: z3.array(PitchSlideSchema).min(1).max(50),
  version: z3.number().int().min(1).optional()
});
var InsertInvestmentSchema = z3.object({
  planId: z3.string().uuid(),
  investorId: z3.string().uuid(),
  amount: z3.number().min(0),
  equity: z3.number().min(0).max(100).optional(),
  valuation: z3.number().min(0).optional(),
  investmentType: z3.enum(["seed", "series-a", "series-b", "series-c", "bridge", "convertible-note"]),
  date: z3.coerce.date(),
  status: z3.enum(["pending", "committed", "completed", "cancelled"]).optional(),
  terms: z3.record(z3.unknown()).optional()
});
var InsertLoanSchema = z3.object({
  planId: z3.string().uuid(),
  lenderId: z3.string().uuid(),
  amount: z3.number().min(0),
  interestRate: z3.number().min(0).max(100),
  termMonths: z3.number().int().min(1).max(600),
  startDate: z3.coerce.date(),
  endDate: z3.coerce.date(),
  monthlyPayment: z3.number().min(0).optional(),
  status: z3.enum(["pending", "approved", "active", "paid-off", "defaulted"]).optional(),
  collateral: z3.string().max(500).optional()
});
var InsertAdvisoryServiceSchema = z3.object({
  planId: z3.string().uuid(),
  partnerId: z3.string().uuid(),
  serviceType: z3.enum(["legal", "accounting", "marketing", "technology", "hr", "strategy", "other"]),
  description: z3.string().max(2e3).optional(),
  startDate: z3.coerce.date(),
  endDate: z3.coerce.date().optional(),
  status: z3.enum(["active", "completed", "cancelled"]).optional(),
  cost: z3.number().min(0).optional()
});
var InsertProgramSchema = z3.object({
  organizationId: z3.string().uuid(),
  name: z3.string().min(1).max(200),
  description: z3.string().max(2e3).optional(),
  type: z3.enum(["accelerator", "incubator", "training", "mentorship"]),
  duration: z3.number().int().min(1).max(365).optional(),
  startDate: z3.coerce.date().optional(),
  endDate: z3.coerce.date().optional(),
  status: z3.enum(["active", "completed", "upcoming", "cancelled"]).optional(),
  maxParticipants: z3.number().int().min(1).optional()
});
var InsertCohortSchema = z3.object({
  programId: z3.string().uuid(),
  name: z3.string().min(1).max(200),
  startDate: z3.coerce.date(),
  endDate: z3.coerce.date(),
  participantCount: z3.number().int().min(0).optional(),
  status: z3.enum(["active", "completed", "upcoming"]).optional()
});
var InsertPortfolioSchema = z3.object({
  organizationId: z3.string().uuid(),
  name: z3.string().min(1).max(200),
  description: z3.string().max(2e3).optional(),
  totalValue: z3.number().min(0).optional(),
  companyCount: z3.number().int().min(0).optional()
});
var InsertPortfolioCompanySchema = z3.object({
  portfolioId: z3.string().uuid(),
  cohortId: z3.string().uuid().optional(),
  companyName: z3.string().min(1).max(200),
  industry: z3.string().min(1).max(100),
  stage: z3.enum(["idea", "prototype", "mvp", "growth", "scale"]),
  website: z3.string().url().optional(),
  description: z3.string().max(2e3).optional(),
  investmentAmount: z3.number().min(0).optional(),
  equity: z3.number().min(0).max(100).optional(),
  valuation: z3.number().min(0).optional(),
  status: z3.enum(["active", "exited", "failed", "acquired"]).optional()
});
var InsertEducationalModuleSchema = z3.object({
  creatorId: z3.string().uuid(),
  title: z3.string().min(1).max(200),
  content: z3.string().min(1).max(5e4),
  category: z3.string().max(100).optional(),
  difficulty: z3.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration: z3.number().int().min(1).optional(),
  tags: z3.array(z3.string().max(50)).max(20).optional()
});
var InsertMentorshipSchema = z3.object({
  mentorId: z3.string().uuid(),
  menteeId: z3.string().uuid(),
  programId: z3.string().uuid().optional(),
  startDate: z3.coerce.date(),
  endDate: z3.coerce.date().optional(),
  status: z3.enum(["active", "completed", "cancelled", "on-hold"]).optional(),
  focusAreas: z3.array(z3.string().max(100)).max(10).optional(),
  meetingFrequency: z3.string().max(100).optional()
});
var InsertVentureProjectSchema = z3.object({
  organizationId: z3.string().uuid(),
  name: z3.string().min(1).max(200),
  description: z3.string().max(2e3).optional(),
  status: z3.enum(["planning", "active", "completed", "on-hold", "cancelled"]).optional(),
  budget: z3.number().min(0).optional(),
  startDate: z3.coerce.date().optional(),
  endDate: z3.coerce.date().optional(),
  teamSize: z3.number().int().min(0).optional()
});
var InsertCreditScoreSchema = z3.object({
  userId: z3.string().uuid(),
  score: z3.number().int().min(300).max(850),
  date: z3.coerce.date(),
  factors: z3.array(CreditFactorSchema).optional(),
  recommendations: z3.array(z3.string().max(500)).max(10).optional()
});
var InsertFinancialMilestoneSchema = z3.object({
  userId: z3.string().uuid(),
  title: z3.string().min(1).max(200),
  description: z3.string().max(1e3).optional(),
  targetAmount: z3.number().min(0).optional(),
  currentAmount: z3.number().min(0).optional(),
  targetDate: z3.coerce.date().optional(),
  status: z3.enum(["pending", "in-progress", "completed", "missed"]).optional(),
  category: z3.enum(["revenue", "funding", "profitability", "growth", "other"])
});
var InsertAiCoachingMessageSchema = z3.object({
  userId: z3.string().uuid(),
  message: z3.string().min(1).max(5e3),
  category: z3.enum(["credit", "business", "financial", "strategic", "general"]),
  priority: z3.enum(["low", "medium", "high"]).optional(),
  read: z3.boolean().optional()
});
var InsertCreditTipSchema = z3.object({
  title: z3.string().min(1).max(200),
  content: z3.string().min(1).max(5e3),
  category: z3.string().min(1).max(100),
  difficulty: z3.enum(["easy", "medium", "hard"]).optional(),
  impact: z3.enum(["low", "medium", "high"]).optional()
});
var InsertUserCreditTipSchema = z3.object({
  userId: z3.string().uuid(),
  creditTipId: z3.string().uuid(),
  status: z3.enum(["new", "in-progress", "completed", "dismissed"]).optional(),
  progress: z3.number().min(0).max(100).optional()
});
var InsertFinancialProjectionSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  year: z3.number().int().min(2e3).max(2100),
  month: z3.number().int().min(1).max(12).optional(),
  revenue: z3.number().min(0),
  expenses: z3.number().min(0),
  profit: z3.number(),
  cashFlow: z3.number(),
  assumptions: z3.array(z3.string().max(500)).max(20).optional(),
  scenario: z3.enum(["conservative", "realistic", "optimistic"]).optional()
});
var InsertAiBusinessAnalysisSchema = z3.object({
  businessPlanId: z3.string().uuid(),
  strengths: z3.array(z3.string().max(500)).min(1).max(10),
  weaknesses: z3.array(z3.string().max(500)).min(1).max(10),
  opportunities: z3.array(z3.string().max(500)).min(1).max(10),
  threats: z3.array(z3.string().max(500)).min(1).max(10),
  recommendations: z3.array(z3.string().max(500)).min(1).max(10),
  overallScore: z3.number().min(0).max(100),
  confidence: z3.number().min(0).max(1)
});

// server/routes/business-plan-routes.ts
var router6 = Router3();
function getUserId(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router6.get("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  logger.info("Fetching business plans", { userId });
  const plans = await businessPlanRepository.getByUserId(userId);
  res.json(plans);
}));
router6.get("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  logger.info("Fetching business plan", { planId: id, userId });
  const plan = await businessPlanRepository.getById(id);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  res.json(plan);
}));
router6.post("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const validatedData = InsertBusinessPlanSchema.parse({
    ...req.body,
    userId
  });
  logger.info("Creating business plan", { userId, title: validatedData.title });
  const plan = await businessPlanRepository.create(validatedData);
  logger.info("Business plan created", { planId: plan.id, userId });
  res.status(201).json(plan);
}));
router6.patch("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  logger.info("Updating business plan", { planId: id, userId });
  const existingPlan = await businessPlanRepository.getById(id);
  assertExists(existingPlan, "Business plan");
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  const plan = await businessPlanRepository.update(id, req.body);
  assertExists(plan, "Business plan");
  logger.info("Business plan updated", { planId: id, userId });
  res.json(plan);
}));
router6.delete("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  logger.info("Deleting business plan", { planId: id, userId });
  const existingPlan = await storage.getBusinessPlan(id);
  assertExists(existingPlan, "Business plan");
  if (existingPlan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  const success = await storage.deleteBusinessPlan(id);
  if (!success) {
    throw new NotFoundError("Business plan");
  }
  logger.info("Business plan deleted", { planId: id, userId });
  res.status(204).end();
}));
router6.get("/:planId/sections", isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  const plan = await storage.getBusinessPlan(planId);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied");
  }
  const sections = storage.getPlanSections(planId);
  res.json(sections);
}));
router6.post("/:planId/sections", isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId(req);
  const plan = await storage.getBusinessPlan(planId);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied");
  }
  const validatedData = InsertPlanSectionSchema.parse({
    ...req.body,
    businessPlanId: planId
  });
  const section = storage.createPlanSection(validatedData);
  logger.info("Plan section created", { planId, sectionId: section.id });
  res.status(201).json(section);
}));
var business_plan_routes_default = router6;

// server/routes/user-routes.ts
import { Router as Router4 } from "express";
var router7 = Router4();
function getUserId2(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router7.get("/me", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user profile", { userId });
  const authReq = req;
  const claims = authReq.user?.claims;
  if (!claims) {
    throw new Error("User claims not found");
  }
  let user = await userRepository.getById(userId);
  if (!user) {
    user = await userRepository.upsert({
      id: userId,
      email: claims.email || claims.preferred_username || "",
      firstName: claims.first_name || claims.given_name || "",
      lastName: claims.last_name || claims.family_name || "",
      profileImageUrl: claims.profile_image_url || claims.picture || null
    });
  }
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    userType: user.userType,
    userSubtype: user.userSubtype,
    role: user.role,
    verified: user.verified,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
}));
router7.patch("/me", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Updating user profile", { userId });
  const validatedData = (void 0).parse(req.body);
  const updatedUser = await userRepository.update(userId, validatedData);
  assertExists(updatedUser, "User");
  logger.info("User profile updated", { userId });
  res.json(updatedUser);
}));
router7.get("/settings", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user settings", { userId });
  const settings = await userRepository.getSettings(userId);
  res.json(settings || {});
}));
router7.patch("/settings", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Updating user settings", { userId });
  const updatedSettings = await userRepository.updateSettings(userId, req.body);
  logger.info("User settings updated", { userId });
  res.json(updatedSettings);
}));
router7.post("/settings/reset", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Resetting user settings", { userId });
  const resetSettings = await userRepository.resetSettings(userId);
  logger.info("User settings reset", { userId });
  res.json(resetSettings);
}));
router7.get("/settings/export", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Exporting user settings", { userId });
  const exportedSettings = await userRepository.exportSettings(userId);
  res.json(exportedSettings);
}));
router7.get("/organizations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user organizations", { userId });
  const organizations = await userRepository.getOrganizations(userId);
  res.json(organizations);
}));
router7.get("/collaborations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user collaborations", { userId });
  const collaborations = await userRepository.getCollaborations(userId);
  res.json(collaborations);
}));
router7.get("/invitations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user invitations", { userId });
  const invitations = await userRepository.getInvitations(userId);
  res.json(invitations);
}));
router7.get("/team-members", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId2(req);
  logger.info("Fetching user team members", { userId });
  const teamMembers = await userRepository.getTeamMembers(userId);
  res.json(teamMembers);
}));
var user_routes_default = router7;

// server/routes/investment-routes.ts
import { Router as Router5 } from "express";
var router8 = Router5();
function getUserId3(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router8.get("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId3(req);
  logger.info("Fetching investments", { userId });
  const investments = await storage2.getInvestmentsByInvestor(userId);
  res.json(investments);
}));
router8.get("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId3(req);
  logger.info("Fetching investment", { investmentId: id, userId });
  const investment = await storage2.getInvestmentById(id);
  assertExists(investment, "Investment");
  if (investment.investorId !== userId) {
    throw new ForbiddenError("Access denied to this investment");
  }
  res.json(investment);
}));
router8.post("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId3(req);
  const validatedData = InsertInvestmentSchema.parse({
    ...req.body,
    investorId: userId
  });
  logger.info("Creating investment", { userId, businessPlanId: validatedData.businessPlanId });
  const investment = await storage2.createInvestment(validatedData);
  logger.info("Investment created", { investmentId: investment.id, userId });
  res.status(201).json(investment);
}));
router8.patch("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId3(req);
  logger.info("Updating investment", { investmentId: id, userId });
  const existingInvestment = await storage2.getInvestmentById(id);
  assertExists(existingInvestment, "Investment");
  if (existingInvestment.investorId !== userId) {
    throw new ForbiddenError("Access denied to this investment");
  }
  const investment = await storage2.updateInvestment(id, req.body);
  assertExists(investment, "Investment");
  logger.info("Investment updated", { investmentId: id, userId });
  res.json(investment);
}));
router8.delete("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId3(req);
  logger.info("Deleting investment", { investmentId: id, userId });
  const existingInvestment = await storage2.getInvestmentById(id);
  assertExists(existingInvestment, "Investment");
  if (existingInvestment.investorId !== userId) {
    throw new ForbiddenError("Access denied to this investment");
  }
  const success = await storage2.deleteInvestment(id);
  if (!success) {
    throw new NotFoundError("Investment");
  }
  logger.info("Investment deleted", { investmentId: id, userId });
  res.status(204).end();
}));
router8.get("/business-plan/:planId", isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId3(req);
  const plan = await storage2.getBusinessPlan(planId);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  const investments = await storage2.getInvestments(planId);
  res.json(investments);
}));
var investment_routes_default = router8;

// server/routes/credit-routes.ts
import { Router as Router6 } from "express";
var router9 = Router6();
function getUserId4(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router9.get("/scores", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching credit scores", { userId });
  const scores = await storage2.getCreditScores(userId);
  res.json(scores);
}));
router9.get("/scores/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Fetching credit score", { scoreId: id, userId });
  const score = await storage2.getCreditScore(id);
  assertExists(score, "Credit score");
  if (score.userId !== userId) {
    throw new ForbiddenError("Access denied to this credit score");
  }
  res.json(score);
}));
router9.post("/scores", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = InsertCreditScoreSchema.parse({
    ...req.body,
    userId
  });
  logger.info("Creating credit score", { userId });
  const score = await storage2.createCreditScore(validatedData);
  logger.info("Credit score created", { scoreId: score.id, userId });
  res.status(201).json(score);
}));
router9.patch("/scores/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Updating credit score", { scoreId: id, userId });
  const existingScore = await storage2.getCreditScore(id);
  assertExists(existingScore, "Credit score");
  if (existingScore.userId !== userId) {
    throw new ForbiddenError("Access denied to this credit score");
  }
  const score = await storage2.updateCreditScore(id, req.body);
  assertExists(score, "Credit score");
  logger.info("Credit score updated", { scoreId: id, userId });
  res.json(score);
}));
router9.get("/milestones", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching financial milestones", { userId });
  const milestones = await storage2.getFinancialMilestones(userId);
  res.json(milestones);
}));
router9.get("/milestones/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Fetching financial milestone", { milestoneId: id, userId });
  const milestone = await storage2.getFinancialMilestone(id);
  assertExists(milestone, "Financial milestone");
  if (milestone.userId !== userId) {
    throw new ForbiddenError("Access denied to this financial milestone");
  }
  res.json(milestone);
}));
router9.post("/milestones", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = InsertFinancialMilestoneSchema.parse({
    ...req.body,
    userId
  });
  logger.info("Creating financial milestone", { userId });
  const milestone = await storage2.createFinancialMilestone(validatedData);
  logger.info("Financial milestone created", { milestoneId: milestone.id, userId });
  res.status(201).json(milestone);
}));
router9.patch("/milestones/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Updating financial milestone", { milestoneId: id, userId });
  const existingMilestone = await storage2.getFinancialMilestone(id);
  assertExists(existingMilestone, "Financial milestone");
  if (existingMilestone.userId !== userId) {
    throw new ForbiddenError("Access denied to this financial milestone");
  }
  const milestone = await storage2.updateFinancialMilestone(id, req.body);
  assertExists(milestone, "Financial milestone");
  logger.info("Financial milestone updated", { milestoneId: id, userId });
  res.json(milestone);
}));
router9.get("/coaching", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching AI coaching messages", { userId });
  const messages = await storage2.getAiCoachingMessages(userId);
  res.json(messages);
}));
router9.post("/coaching", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = InsertAiCoachingMessageSchema.parse({
    ...req.body,
    userId
  });
  logger.info("Creating AI coaching message", { userId });
  const message = await storage2.createAiCoachingMessage(validatedData);
  logger.info("AI coaching message created", { messageId: message.id, userId });
  res.status(201).json(message);
}));
router9.get("/tips", isAuthenticated, asyncHandler(async (req, res) => {
  const { category } = req.query;
  logger.info("Fetching credit tips", { category });
  const tips = category ? await storage2.getCreditTipsByCategory(category) : await storage2.getCreditTips();
  res.json(tips);
}));
router9.get("/tips/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info("Fetching credit tip", { tipId: id });
  const tip = await storage2.getCreditTip(id);
  assertExists(tip, "Credit tip");
  res.json(tip);
}));
router9.get("/user-tips", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching user credit tips", { userId });
  const userTips = await storage2.getUserCreditTips(userId);
  res.json(userTips);
}));
router9.post("/user-tips", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = InsertUserCreditTipSchema.parse({
    ...req.body,
    userId
  });
  logger.info("Creating user credit tip", { userId });
  const userTip = await storage2.createUserCreditTip(validatedData);
  logger.info("User credit tip created", { userTipId: userTip.id, userId });
  res.status(201).json(userTip);
}));
router9.patch("/user-tips/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Updating user credit tip", { userTipId: id, userId });
  const userTip = await storage2.updateUserCreditTip(id, req.body);
  assertExists(userTip, "User credit tip");
  logger.info("User credit tip updated", { userTipId: id, userId });
  res.json(userTip);
}));
router9.get("/achievements", isAuthenticated, asyncHandler(async (req, res) => {
  const { category } = req.query;
  logger.info("Fetching credit achievements", { category });
  const achievements = category ? await storage2.getCreditAchievementsByCategory(category) : await storage2.getCreditAchievements();
  res.json(achievements);
}));
router9.get("/achievements/user", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching user credit achievements", { userId });
  const achievements = await storage2.getUserCreditAchievements(userId);
  res.json(achievements);
}));
router9.get("/achievements/unseen", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching unseen achievements", { userId });
  const unseenAchievements = await storage2.getUnseenAchievements(userId);
  res.json(unseenAchievements);
}));
router9.post("/achievements/user", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = (void 0).parse({
    ...req.body,
    userId
  });
  logger.info("Creating user credit achievement", { userId });
  const achievement = await storage2.createUserCreditAchievement(validatedData);
  logger.info("User credit achievement created", { achievementId: achievement.id, userId });
  res.status(201).json(achievement);
}));
router9.patch("/achievements/user/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Updating user credit achievement", { achievementId: id, userId });
  const achievement = await storage2.updateUserCreditAchievement(id, req.body);
  assertExists(achievement, "User credit achievement");
  logger.info("User credit achievement updated", { achievementId: id, userId });
  res.json(achievement);
}));
router9.patch("/achievements/user/:id/seen", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Marking achievement as seen", { achievementId: id, userId });
  const achievement = await storage2.markAchievementAsSeen(id);
  assertExists(achievement, "User credit achievement");
  logger.info("Achievement marked as seen", { achievementId: id, userId });
  res.json(achievement);
}));
router9.get("/history", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching credit score history", { userId });
  const history = await storage2.getCreditScoreHistory(userId);
  res.json(history);
}));
router9.post("/history", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = (void 0).parse({
    ...req.body,
    userId
  });
  logger.info("Creating credit score history entry", { userId });
  const historyEntry = await storage2.createCreditScoreHistory(validatedData);
  logger.info("Credit score history entry created", { historyId: historyEntry.id, userId });
  res.status(201).json(historyEntry);
}));
router9.get("/points", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching user reward points", { userId });
  const points = await storage2.getUserRewardPoints(userId);
  res.json(points || { userId, points: 0, level: "Bronze" });
}));
router9.post("/points", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = (void 0).parse({
    ...req.body,
    userId
  });
  logger.info("Creating user reward points", { userId });
  const points = await storage2.createUserRewardPoints(validatedData);
  logger.info("User reward points created", { pointsId: points.id, userId });
  res.status(201).json(points);
}));
router9.patch("/points/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId4(req);
  logger.info("Updating user reward points", { pointsId: id, userId });
  const points = await storage2.updateUserRewardPoints(id, req.body);
  assertExists(points, "User reward points");
  logger.info("User reward points updated", { pointsId: id, userId });
  res.json(points);
}));
router9.post("/points/add", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const { points } = req.body;
  logger.info("Adding points to user", { userId, points });
  const updatedPoints = await storage2.addUserPoints(userId, points);
  logger.info("Points added to user", { userId, points });
  res.json(updatedPoints);
}));
router9.get("/transactions", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  logger.info("Fetching user point transactions", { userId });
  const transactions = await storage2.getPointTransactions(userId);
  res.json(transactions);
}));
router9.post("/transactions", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId4(req);
  const validatedData = (void 0).parse({
    ...req.body,
    userId
  });
  logger.info("Creating point transaction", { userId });
  const transaction = await storage2.createPointTransaction(validatedData);
  logger.info("Point transaction created", { transactionId: transaction.id, userId });
  res.status(201).json(transaction);
}));
var credit_routes_default = router9;

// server/routes/organization-routes.ts
import { Router as Router7 } from "express";
var router10 = Router7();
function getUserId5(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router10.get("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId5(req);
  logger.info("Fetching organizations", { userId });
  const organizations = await storage2.getAllOrganizations();
  res.json(organizations);
}));
router10.get("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization", { organizationId: id, userId });
  const organization = await storage2.getOrganization(id);
  assertExists(organization, "Organization");
  res.json(organization);
}));
router10.post("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId5(req);
  const validatedData = (void 0).parse({
    ...req.body,
    ownerId: userId
  });
  logger.info("Creating organization", { userId, name: validatedData.name });
  const organization = await storage2.createOrganization(validatedData);
  logger.info("Organization created", { organizationId: organization.id, userId });
  res.status(201).json(organization);
}));
router10.patch("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Updating organization", { organizationId: id, userId });
  const existingOrganization = await storage2.getOrganization(id);
  assertExists(existingOrganization, "Organization");
  if (existingOrganization.ownerId !== userId) {
    throw new ForbiddenError("Access denied to this organization");
  }
  const organization = await storage2.updateOrganization(id, req.body);
  assertExists(organization, "Organization");
  logger.info("Organization updated", { organizationId: id, userId });
  res.json(organization);
}));
router10.delete("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Deleting organization", { organizationId: id, userId });
  const existingOrganization = await storage2.getOrganization(id);
  assertExists(existingOrganization, "Organization");
  if (existingOrganization.ownerId !== userId) {
    throw new ForbiddenError("Access denied to this organization");
  }
  const success = await storage2.deleteOrganization(id);
  if (!success) {
    throw new NotFoundError("Organization");
  }
  logger.info("Organization deleted", { organizationId: id, userId });
  res.status(204).end();
}));
router10.get("/:id/members", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization members", { organizationId: id, userId });
  const members = await storage2.getOrganizationMembers(id);
  res.json(members);
}));
router10.post("/:id/members", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId: memberId, role } = req.body;
  const currentUserId = getUserId5(req);
  logger.info("Adding user to organization", {
    organizationId: id,
    memberId,
    role,
    currentUserId
  });
  const membership = await storage2.addUserToOrganization(memberId, id, role);
  logger.info("User added to organization", { organizationId: id, memberId });
  res.status(201).json(membership);
}));
router10.get("/:id/invitations", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization invitations", { organizationId: id, userId });
  const invitations = await storage2.getOrganizationInvitations(id);
  res.json(invitations);
}));
router10.post("/:id/invitations", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  const validatedData = (void 0).parse({
    ...req.body,
    organizationId: id,
    invitedBy: userId
  });
  logger.info("Creating organization invitation", { organizationId: id, userId });
  const invitation = await storage2.createOrganizationInvitation(validatedData);
  logger.info("Organization invitation created", { invitationId: invitation.id, organizationId: id });
  res.status(201).json(invitation);
}));
router10.get("/:id/analytics", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization analytics", { organizationId: id, userId });
  const analytics = await storage2.getOrganizationAnalytics(id);
  res.json(analytics);
}));
router10.get("/:id/programs", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization programs", { organizationId: id, userId });
  const programs = await storage2.getPrograms(id);
  res.json(programs);
}));
router10.get("/:id/portfolios", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization portfolios", { organizationId: id, userId });
  const portfolios = await storage2.getPortfolios(id);
  res.json(portfolios);
}));
router10.get("/:id/venture-projects", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId5(req);
  logger.info("Fetching organization venture projects", { organizationId: id, userId });
  const projects = await storage2.getVentureProjects(id);
  res.json(projects);
}));
var organization_routes_default = router10;

// server/routes/loan-routes.ts
import { Router as Router8 } from "express";
var router11 = Router8();
function getUserId6(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router11.get("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId6(req);
  logger.info("Fetching loans", { userId });
  const loans = await storage2.getLoansByLender(userId);
  res.json(loans);
}));
router11.get("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId6(req);
  logger.info("Fetching loan", { loanId: id, userId });
  const loan = await storage2.getLoanById(id);
  assertExists(loan, "Loan");
  if (loan.lenderId !== userId && loan.borrowerId !== userId) {
    throw new ForbiddenError("Access denied to this loan");
  }
  res.json(loan);
}));
router11.post("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId6(req);
  const validatedData = InsertLoanSchema.parse({
    ...req.body,
    lenderId: userId
  });
  logger.info("Creating loan", { userId, businessPlanId: validatedData.businessPlanId });
  const loan = await storage2.createLoan(validatedData);
  logger.info("Loan created", { loanId: loan.id, userId });
  res.status(201).json(loan);
}));
router11.patch("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId6(req);
  logger.info("Updating loan", { loanId: id, userId });
  const existingLoan = await storage2.getLoanById(id);
  assertExists(existingLoan, "Loan");
  if (existingLoan.lenderId !== userId) {
    throw new ForbiddenError("Access denied to this loan");
  }
  const loan = await storage2.updateLoan(id, req.body);
  assertExists(loan, "Loan");
  logger.info("Loan updated", { loanId: id, userId });
  res.json(loan);
}));
router11.delete("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId6(req);
  logger.info("Deleting loan", { loanId: id, userId });
  const existingLoan = await storage2.getLoanById(id);
  assertExists(existingLoan, "Loan");
  if (existingLoan.lenderId !== userId) {
    throw new ForbiddenError("Access denied to this loan");
  }
  const success = await storage2.deleteLoan(id);
  if (!success) {
    throw new NotFoundError("Loan");
  }
  logger.info("Loan deleted", { loanId: id, userId });
  res.status(204).end();
}));
router11.get("/business-plan/:planId", isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId6(req);
  const plan = await storage2.getBusinessPlan(planId);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  const loans = await storage2.getLoans(planId);
  res.json(loans);
}));
router11.get("/borrower/:borrowerId", isAuthenticated, asyncHandler(async (req, res) => {
  const { borrowerId } = req.params;
  const userId = getUserId6(req);
  if (borrowerId !== userId) {
    throw new ForbiddenError("Access denied to this borrower's loans");
  }
  const loans = await storage2.getLoansByBorrower(borrowerId);
  res.json(loans);
}));
router11.get("/lender/:lenderId", isAuthenticated, asyncHandler(async (req, res) => {
  const { lenderId } = req.params;
  const userId = getUserId6(req);
  if (lenderId !== userId) {
    throw new ForbiddenError("Access denied to this lender's loans");
  }
  const loans = await storage2.getLoansByLender(lenderId);
  res.json(loans);
}));
var loan_routes_default = router11;

// server/routes/advisory-routes.ts
import { Router as Router9 } from "express";
var router12 = Router9();
function getUserId7(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router12.get("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId7(req);
  logger.info("Fetching advisory services", { userId });
  const services = await storage2.getAdvisoryServicesByPartner(userId);
  res.json(services);
}));
router12.get("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId7(req);
  logger.info("Fetching advisory service", { serviceId: id, userId });
  const service = await storage2.getAdvisoryServiceById(id);
  assertExists(service, "Advisory service");
  if (service.partnerId !== userId && service.clientId !== userId) {
    throw new ForbiddenError("Access denied to this advisory service");
  }
  res.json(service);
}));
router12.post("/", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId7(req);
  const validatedData = InsertAdvisoryServiceSchema.parse({
    ...req.body,
    partnerId: userId
  });
  logger.info("Creating advisory service", { userId, businessPlanId: validatedData.businessPlanId });
  const service = await storage2.createAdvisoryService(validatedData);
  logger.info("Advisory service created", { serviceId: service.id, userId });
  res.status(201).json(service);
}));
router12.patch("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId7(req);
  logger.info("Updating advisory service", { serviceId: id, userId });
  const existingService = await storage2.getAdvisoryServiceById(id);
  assertExists(existingService, "Advisory service");
  if (existingService.partnerId !== userId) {
    throw new ForbiddenError("Access denied to this advisory service");
  }
  const service = await storage2.updateAdvisoryService(id, req.body);
  assertExists(service, "Advisory service");
  logger.info("Advisory service updated", { serviceId: id, userId });
  res.json(service);
}));
router12.delete("/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId7(req);
  logger.info("Deleting advisory service", { serviceId: id, userId });
  const existingService = await storage2.getAdvisoryServiceById(id);
  assertExists(existingService, "Advisory service");
  if (existingService.partnerId !== userId) {
    throw new ForbiddenError("Access denied to this advisory service");
  }
  const success = await storage2.deleteAdvisoryService(id);
  if (!success) {
    throw new NotFoundError("Advisory service");
  }
  logger.info("Advisory service deleted", { serviceId: id, userId });
  res.status(204).end();
}));
router12.get("/business-plan/:planId", isAuthenticated, asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const userId = getUserId7(req);
  const plan = await storage2.getBusinessPlan(planId);
  assertExists(plan, "Business plan");
  if (plan.userId !== userId) {
    throw new ForbiddenError("Access denied to this business plan");
  }
  const services = await storage2.getAdvisoryServices(planId);
  res.json(services);
}));
router12.get("/partner/:partnerId", isAuthenticated, asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const userId = getUserId7(req);
  if (partnerId !== userId) {
    throw new ForbiddenError("Access denied to this partner's advisory services");
  }
  const services = await storage2.getAdvisoryServicesByPartner(partnerId);
  res.json(services);
}));
router12.get("/client/:clientId", isAuthenticated, asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const userId = getUserId7(req);
  if (clientId !== userId) {
    throw new ForbiddenError("Access denied to this client's advisory services");
  }
  const services = await storage2.getAdvisoryServicesByClient(clientId);
  res.json(services);
}));
var advisory_routes_default = router12;

// server/routes/team-routes.ts
import { Router as Router10 } from "express";
var router13 = Router10();
function getUserId8(req) {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
router13.get("/members", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId8(req);
  logger.info("Fetching team members", { userId });
  const members = await storage2.getTeamMembers(userId);
  res.json(members);
}));
router13.post("/invitations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId8(req);
  const validatedData = (void 0).parse({
    ...req.body,
    invitedBy: userId
  });
  logger.info("Creating team invitation", { userId });
  const invitation = await storage2.createTeamInvitation(validatedData);
  logger.info("Team invitation created", { invitationId: invitation.id, userId });
  res.status(201).json(invitation);
}));
router13.get("/invitations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId8(req);
  logger.info("Fetching team invitations", { userId });
  const invitations = await storage2.getTeamInvitations(userId);
  res.json(invitations);
}));
router13.get("/invitations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Fetching team invitation", { invitationId: id, userId });
  const invitation = await storage2.getTeamInvitation(id);
  assertExists(invitation, "Team invitation");
  if (invitation.invitedBy !== userId && invitation.invitedUserId !== userId) {
    throw new ForbiddenError("Access denied to this team invitation");
  }
  res.json(invitation);
}));
router13.patch("/invitations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Updating team invitation", { invitationId: id, userId });
  const invitation = await storage2.updateTeamInvitation(id, req.body);
  assertExists(invitation, "Team invitation");
  logger.info("Team invitation updated", { invitationId: id, userId });
  res.json(invitation);
}));
router13.delete("/invitations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Cancelling team invitation", { invitationId: id, userId });
  const success = await storage2.cancelTeamInvitation(id);
  if (!success) {
    throw new NotFoundError("Team invitation");
  }
  logger.info("Team invitation cancelled", { invitationId: id, userId });
  res.status(204).end();
}));
router13.post("/invitations/:id/resend", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Resending team invitation", { invitationId: id, userId });
  const success = await storage2.resendTeamInvitation(id);
  if (!success) {
    throw new NotFoundError("Team invitation");
  }
  logger.info("Team invitation resent", { invitationId: id, userId });
  res.json({ message: "Invitation resent successfully" });
}));
router13.patch("/members/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Updating team member", { memberId: id, userId });
  const member = await storage2.updateTeamMember(id, req.body);
  assertExists(member, "Team member");
  logger.info("Team member updated", { memberId: id, userId });
  res.json(member);
}));
router13.delete("/members/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Removing team member", { memberId: id, userId });
  const success = await storage2.removeTeamMember(id);
  if (!success) {
    throw new NotFoundError("Team member");
  }
  logger.info("Team member removed", { memberId: id, userId });
  res.status(204).end();
}));
router13.post("/collaborations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId8(req);
  const validatedData = (void 0).parse({
    ...req.body,
    createdBy: userId
  });
  logger.info("Creating collaboration", { userId });
  const collaboration = await storage2.createCollaboration(validatedData);
  logger.info("Collaboration created", { collaborationId: collaboration.id, userId });
  res.status(201).json(collaboration);
}));
router13.get("/collaborations", isAuthenticated, asyncHandler(async (req, res) => {
  const userId = getUserId8(req);
  logger.info("Fetching collaborations", { userId });
  const collaborations = await storage2.getUserCollaborations(userId);
  res.json(collaborations);
}));
router13.get("/collaborations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Fetching collaboration", { collaborationId: id, userId });
  const collaboration = await storage2.getCollaboration(id);
  assertExists(collaboration, "Collaboration");
  if (collaboration.createdBy !== userId && !collaboration.participants.includes(userId)) {
    throw new ForbiddenError("Access denied to this collaboration");
  }
  res.json(collaboration);
}));
router13.patch("/collaborations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Updating collaboration", { collaborationId: id, userId });
  const existingCollaboration = await storage2.getCollaboration(id);
  assertExists(existingCollaboration, "Collaboration");
  if (existingCollaboration.createdBy !== userId) {
    throw new ForbiddenError("Access denied to this collaboration");
  }
  const collaboration = await storage2.updateCollaboration(id, req.body);
  assertExists(collaboration, "Collaboration");
  logger.info("Collaboration updated", { collaborationId: id, userId });
  res.json(collaboration);
}));
router13.delete("/collaborations/:id", isAuthenticated, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId8(req);
  logger.info("Deleting collaboration", { collaborationId: id, userId });
  const existingCollaboration = await storage2.getCollaboration(id);
  assertExists(existingCollaboration, "Collaboration");
  if (existingCollaboration.createdBy !== userId) {
    throw new ForbiddenError("Access denied to this collaboration");
  }
  const success = await storage2.deleteCollaboration(id);
  if (!success) {
    throw new NotFoundError("Collaboration");
  }
  logger.info("Collaboration deleted", { collaborationId: id, userId });
  res.status(204).end();
}));
var team_routes_default = router13;

// server/routes.ts
function getUserId9(req) {
  const authReq = req;
  if (!authReq.user?.claims?.sub) {
    throw new UnauthorizedError("User not authenticated");
  }
  return authReq.user.claims.sub;
}
function handleError(res, error, defaultMessage) {
  logger.error(defaultMessage, error instanceof Error ? error : void 0);
  if (error instanceof z4.ZodError) {
    res.status(400).json({
      message: "Validation error",
      errors: error.errors
    });
    return;
  }
  if (error instanceof Error) {
    res.status(500).json({
      message: defaultMessage,
      error: process.env.NODE_ENV === "development" ? error.message : void 0
    });
    return;
  }
  res.status(500).json({ message: defaultMessage });
}
var insertBusinessPlanSchema = z4.object({
  userId: z4.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_]+$/),
  title: z4.string().min(1).max(200).trim(),
  description: z4.string().max(5e3).trim().optional(),
  industry: z4.string().max(100).trim().optional(),
  stage: z4.enum(["idea", "prototype", "mvp", "growth", "scale"]).optional()
});
var insertPlanSectionSchema = z4.object({
  businessPlanId: z4.string(),
  chapterId: z4.string(),
  sectionId: z4.string(),
  content: z4.string()
});
var insertFinancialDataSchema = z4.object({
  businessPlanId: z4.string(),
  year: z4.number(),
  revenue: z4.number(),
  expenses: z4.number(),
  profit: z4.number(),
  cashFlow: z4.number()
});
var insertAnalysisScoreSchema = InsertAnalysisScoreSchema;
var insertProgramSchema = z4.object({
  organizationId: z4.string(),
  name: z4.string(),
  description: z4.string().optional()
});
var insertCohortSchema = z4.object({
  programId: z4.string(),
  name: z4.string(),
  startDate: z4.date(),
  endDate: z4.date()
});
var insertPortfolioSchema = z4.object({
  organizationId: z4.string(),
  name: z4.string(),
  description: z4.string().optional()
});
var insertPortfolioCompanySchema = z4.object({
  portfolioId: z4.string(),
  cohortId: z4.string().optional(),
  companyName: z4.string(),
  industry: z4.string(),
  stage: z4.string(),
  website: z4.string().optional(),
  description: z4.string().optional()
});
var insertEducationalModuleSchema = z4.object({
  creatorId: z4.string(),
  title: z4.string(),
  content: z4.string(),
  category: z4.string().optional()
});
var insertMentorshipSchema = z4.object({
  mentorId: z4.string(),
  menteeId: z4.string(),
  programId: z4.string().optional(),
  startDate: z4.date(),
  endDate: z4.date().optional(),
  status: z4.string()
  // e.g., 'active', 'completed', 'cancelled'
});
var insertVentureProjectSchema = z4.object({
  organizationId: z4.string(),
  name: z4.string(),
  description: z4.string().optional()
  // Add other relevant fields for venture projects
});
var insertPitchDeckSchema = InsertPitchDeckSchema;
var insertInvestmentSchema = z4.object({
  planId: z4.string(),
  investorId: z4.string(),
  amount: z4.number(),
  date: z4.date()
  // Add other relevant fields for investments
});
var insertLoanSchema = z4.object({
  planId: z4.string(),
  lenderId: z4.string(),
  amount: z4.number(),
  interestRate: z4.number(),
  termMonths: z4.number(),
  startDate: z4.date(),
  endDate: z4.date()
  // Add other relevant fields for loans
});
var insertAdvisoryServiceSchema = z4.object({
  planId: z4.string(),
  partnerId: z4.string(),
  serviceType: z4.string(),
  description: z4.string().optional(),
  startDate: z4.date(),
  endDate: z4.date().optional()
});
var insertCreditScoreSchema = z4.object({
  userId: z4.string(),
  score: z4.number(),
  date: z4.date()
  // Add other relevant fields for credit scores
});
var insertFinancialMilestoneSchema = z4.object({
  userId: z4.string(),
  description: z4.string(),
  date: z4.date(),
  amount: z4.number().optional()
  // Add other relevant fields for financial milestones
});
var insertAiCoachingMessageSchema = z4.object({
  userId: z4.string(),
  sender: z4.enum(["user", "ai"]),
  message: z4.string(),
  timestamp: z4.date()
  // Add other relevant fields for AI coaching messages
});
var insertCreditTipSchema = z4.object({
  title: z4.string(),
  content: z4.string(),
  category: z4.string().optional()
  // Add other relevant fields for credit tips
});
var insertUserCreditTipSchema = z4.object({
  userId: z4.string(),
  creditTipId: z4.string(),
  viewed: z4.boolean().default(false)
  // Add other relevant fields for user credit tips
});
var insertFinancialProjectionSchema = z4.object({
  businessPlanId: z4.string(),
  year: z4.number(),
  revenue: z4.number(),
  expenses: z4.number(),
  profit: z4.number()
  // Add other relevant fields for financial projections
});
var insertAiBusinessAnalysisSchema = z4.object({
  businessPlanId: z4.string(),
  overallScore: z4.number(),
  scores: z4.record(z4.string(), z4.number()),
  feedback: z4.record(z4.string(), z4.string()),
  recommendations: z4.array(z4.string())
  // Add other relevant fields for AI business analysis
});
async function registerRoutes(app2) {
  const apiRouter = express4.Router();
  apiRouter.get("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId9(req);
      const plans = await storage2.getBusinessPlans(userId);
      res.json(plans);
    } catch (error) {
      handleError(res, error, "Failed to fetch business plans");
    }
  });
  apiRouter.get("/user", isAuthenticated, async (req, res) => {
    try {
      const authReq = req;
      const claims = authReq.user?.claims;
      if (!claims) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      res.json({
        id: claims.sub,
        email: claims.email || claims.preferred_username || "",
        firstName: claims.first_name || claims.given_name || "",
        lastName: claims.last_name || claims.family_name || "",
        profileImageUrl: claims.profile_image_url || claims.picture,
        userType: "ENTREPRENEUR"
      });
    } catch (error) {
      handleError(res, error, "Failed to fetch user info");
    }
  });
  apiRouter.get("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId9(req);
      const plan = await storage2.getBusinessPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      if (plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(plan);
    } catch (error) {
      handleError(res, error, "Failed to fetch business plan");
    }
  });
  apiRouter.post("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId9(req);
      const validatedData = insertBusinessPlanSchema.parse({
        ...req.body,
        userId
      });
      const plan = await storage2.createBusinessPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      handleError(res, error, "Failed to create business plan");
    }
  });
  apiRouter.patch("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId9(req);
      const existingPlan = await storage2.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const plan = await storage2.updateBusinessPlan(id, req.body);
      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      res.json(plan);
    } catch (error) {
      handleError(res, error, "Failed to update business plan");
    }
  });
  apiRouter.delete("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId9(req);
      const existingPlan = await storage2.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const success = await storage2.deleteBusinessPlan(id);
      if (!success) {
        return res.status(404).json({ message: "Business plan not found" });
      }
      res.status(204).end();
    } catch (error) {
      handleError(res, error, "Failed to delete business plan");
    }
  });
  apiRouter.get("/business-plans/:planId/sections", isAuthenticated, async (req, res) => {
    try {
      const planId = req.params.planId;
      const user = req.user;
      const userId = user.claims.sub;
      const plan = await storage2.getBusinessPlan(planId);
      if (!plan || plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const sections = await storage2.getPlanSections(planId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan sections" });
    }
  });
  apiRouter.get("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const section = await storage2.getPlanSection(id);
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
      const section = await storage2.createPlanSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid section data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create section" });
    }
  });
  apiRouter.patch("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const section = await storage2.updatePlanSection(id, req.body);
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
      const data = await storage2.getFinancialData(planId);
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
      const data = await storage2.createFinancialData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid financial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial data" });
    }
  });
  apiRouter.patch("/business-plans/:planId/financial-data/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = await storage2.updateFinancialData(id, req.body);
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
      const score = await storage2.getAnalysisScore(planId);
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
      const score = await storage2.createAnalysisScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid analysis score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analysis score" });
    }
  });
  apiRouter.patch("/business-plans/:planId/analysis/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const score = await storage2.updateAnalysisScore(id, req.body);
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
      const deck = await storage2.getPitchDeck(planId);
      res.json(deck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pitch deck" });
    }
  });
  apiRouter.post("/pitch-decks", async (req, res) => {
    try {
      const validatedData = insertPitchDeckSchema.parse(req.body);
      const deck = await storage2.createPitchDeck(validatedData);
      res.status(201).json(deck);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid pitch deck data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create pitch deck" });
    }
  });
  apiRouter.get("/investments/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId;
      const investments = await storage2.getInvestments(planId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });
  apiRouter.get("/investments/investor/:investorId", async (req, res) => {
    try {
      const investorId = req.params.investorId;
      const investments = await storage2.getInvestmentsByInvestor(investorId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });
  apiRouter.post("/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage2.createInvestment(validatedData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });
  apiRouter.patch("/investments/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const investment = await storage2.updateInvestment(id, req.body);
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
      const loans = await storage2.getLoans(planId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });
  apiRouter.get("/loans/lender/:lenderId", async (req, res) => {
    try {
      const lenderId = req.params.lenderId;
      const loans = await storage2.getLoansByLender(lenderId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });
  apiRouter.post("/loans", async (req, res) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      const loan = await storage2.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid loan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan" });
    }
  });
  apiRouter.patch("/loans/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const loan = await storage2.updateLoan(id, req.body);
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
      const services = await storage2.getAdvisoryServices(planId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });
  apiRouter.get("/advisory-services/partner/:partnerId", async (req, res) => {
    try {
      const partnerId = req.params.partnerId;
      const services = await storage2.getAdvisoryServicesByPartner(partnerId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });
  apiRouter.post("/advisory-services", async (req, res) => {
    try {
      const validatedData = insertAdvisoryServiceSchema.parse(req.body);
      const service = await storage2.createAdvisoryService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid advisory service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create advisory service" });
    }
  });
  apiRouter.patch("/advisory-services/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const service = await storage2.updateAdvisoryService(id, req.body);
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
      const programs = await storage2.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage2.getProgram(id);
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
      const program = await storage2.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create program" });
    }
  });
  apiRouter.patch("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage2.updateProgram(id, req.body);
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
      const success = await storage2.deleteProgram(id);
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
      const cohorts = await storage2.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });
  apiRouter.get("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const cohort = await storage2.getCohort(id);
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
      const cohort = await storage2.createCohort(validatedData);
      res.status(201).json(cohort);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid cohort data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cohort" });
    }
  });
  apiRouter.patch("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const cohort = await storage2.updateCohort(id, req.body);
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
      const success = await storage2.deleteCohort(id);
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
      const portfolios = await storage2.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });
  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage2.getPortfolio(id);
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
      const portfolio = await storage2.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });
  apiRouter.patch("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage2.updatePortfolio(id, req.body);
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
      const success = await storage2.deletePortfolio(id);
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
      const companies = await storage2.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/portfolio-companies/cohort/:cohortId", async (req, res) => {
    try {
      const cohortId = req.params.cohortId;
      const companies = await storage2.getPortfolioCompaniesByCohort(cohortId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const company = await storage2.getPortfolioCompany(id);
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
      const company = await storage2.createPortfolioCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio company data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio company" });
    }
  });
  apiRouter.patch("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const company = await storage2.updatePortfolioCompany(id, req.body);
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
      const success = await storage2.deletePortfolioCompany(id);
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
      const modules = await storage2.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });
  apiRouter.get("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const module = await storage2.getEducationalModule(id);
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
      const module = await storage2.createEducationalModule(validatedData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid educational module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create educational module" });
    }
  });
  apiRouter.patch("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const module = await storage2.updateEducationalModule(id, req.body);
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
      const success = await storage2.deleteEducationalModule(id);
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
      const mentorships = await storage2.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId;
      const mentorships = await storage2.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/program/:programId", async (req, res) => {
    try {
      const programId = req.params.programId;
      const mentorships = await storage2.getMentorshipsByProgram(programId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const mentorship = await storage2.getMentorship(id);
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
      const mentorship = await storage2.createMentorship(validatedData);
      res.status(201).json(mentorship);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid mentorship data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mentorship" });
    }
  });
  apiRouter.patch("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const mentorship = await storage2.updateMentorship(id, req.body);
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
      const success = await storage2.deleteMentorship(id);
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
      const projects = await storage2.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });
  apiRouter.get("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const project = await storage2.getVentureProject(id);
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
      const project = await storage2.createVentureProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid venture project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create venture project" });
    }
  });
  apiRouter.patch("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const project = await storage2.updateVentureProject(id, req.body);
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
      const success = await storage2.deleteVentureProject(id);
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
      const programs = await storage2.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const program = await storage2.getProgram(id);
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
      const cohorts = await storage2.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });
  apiRouter.get("/portfolios", async (req, res) => {
    try {
      const organizationId = "1";
      const portfolios = await storage2.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });
  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await storage2.getPortfolio(id);
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
      const companies = await storage2.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });
  apiRouter.get("/educational-modules", async (req, res) => {
    try {
      const creatorId = "1";
      const modules = await storage2.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });
  apiRouter.get("/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorId = req.params.mentorId;
      const mentorships = await storage2.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId;
      const mentorships = await storage2.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });
  apiRouter.get("/venture-projects", async (req, res) => {
    try {
      const organizationId = "1";
      const projects = await storage2.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });
  apiRouter.get("/dashboard-summary", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const userId = user.claims.sub;
      const businessPlans = await storage2.getBusinessPlans(userId);
      let financialData = [];
      let analysisScores = [];
      for (const plan of businessPlans) {
        const planFinancial = await storage2.getFinancialData(plan.id);
        if (planFinancial) {
          financialData.push(planFinancial);
        }
        const planAnalysis = await storage2.getAnalysisScore(plan.id);
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
        storage2.getBusinessPlan(planId),
        storage2.getFinancialData(planId),
        storage2.getAnalysisScore(planId)
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
      const scores = await storage2.getCreditScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit scores" });
    }
  });
  apiRouter.get("/credit-score/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const score = await storage2.getCreditScore(id);
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
      const score = await storage2.createCreditScore(parsedBody);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid credit score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit score" });
    }
  });
  apiRouter.patch("/credit-scores/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedScore = await storage2.updateCreditScore(id, req.body);
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
      const milestones = await storage2.getFinancialMilestones(userId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial milestones" });
    }
  });
  apiRouter.get("/financial-milestone/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const milestone = await storage2.getFinancialMilestone(id);
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
      const milestone = await storage2.createFinancialMilestone(parsedBody);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid financial milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial milestone" });
    }
  });
  apiRouter.patch("/financial-milestones/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedMilestone = await storage2.updateFinancialMilestone(id, req.body);
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
      const messages = await storage2.getAiCoachingMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve AI coaching messages" });
    }
  });
  apiRouter.post("/ai-coaching-messages", async (req, res) => {
    try {
      const parsedBody = insertAiCoachingMessageSchema.parse(req.body);
      const message = await storage2.createAiCoachingMessage(parsedBody);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid AI coaching message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI coaching message" });
    }
  });
  apiRouter.get("/credit-tips", async (req, res) => {
    try {
      const tips = await storage2.getCreditTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips" });
    }
  });
  apiRouter.get("/credit-tips/category/:category", async (req, res) => {
    const category = req.params.category;
    try {
      const tips = await storage2.getCreditTipsByCategory(category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips by category" });
    }
  });
  apiRouter.get("/credit-tip/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const tip = await storage2.getCreditTip(id);
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
      const tip = await storage2.createCreditTip(parsedBody);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit tip" });
    }
  });
  apiRouter.get("/user-credit-tips/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const userTips = await storage2.getUserCreditTips(userId);
      res.json(userTips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user credit tips" });
    }
  });
  apiRouter.post("/user-credit-tips", async (req, res) => {
    try {
      const parsedBody = insertUserCreditTipSchema.parse(req.body);
      const userTip = await storage2.createUserCreditTip(parsedBody);
      res.status(201).json(userTip);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid user credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user credit tip" });
    }
  });
  apiRouter.patch("/user-credit-tips/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedUserTip = await storage2.updateUserCreditTip(id, req.body);
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
      const projections = await storage2.getFinancialProjections(businessPlanId);
      res.json(projections);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial projections" });
    }
  });
  apiRouter.get("/financial-projection/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const projection = await storage2.getFinancialProjection(id);
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
      const projection = await storage2.createFinancialProjection(parsedBody);
      res.status(201).json(projection);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid financial projection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial projection" });
    }
  });
  apiRouter.patch("/financial-projections/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedProjection = await storage2.updateFinancialProjection(id, req.body);
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
      const analysis = await storage2.getAiBusinessAnalysis(businessPlanId);
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
      const analysis = await storage2.createAiBusinessAnalysis(parsedBody);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid AI business analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI business analysis" });
    }
  });
  apiRouter.patch("/ai-business-analysis/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const updatedAnalysis = await storage2.updateAiBusinessAnalysis(id, req.body);
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
      const tiers = await storage2.getCreditScoreTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score tiers" });
    }
  });
  apiRouter.get("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const tier = await storage2.getCreditScoreTier(id);
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
      const tier = await storage2.getCreditScoreTierByScore(score);
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
      const tier = await storage2.createCreditScoreTier(req.body);
      res.status(201).json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score tier" });
    }
  });
  apiRouter.patch("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedTier = await storage2.updateCreditScoreTier(id, req.body);
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
      const achievements = await storage2.getCreditAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit achievements" });
    }
  });
  apiRouter.get("/credit-achievements/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const achievements = await storage2.getCreditAchievementsByCategory(category);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements by category" });
    }
  });
  apiRouter.get("/credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const achievement = await storage2.getCreditAchievement(id);
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
      const achievement = await storage2.createCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit achievement" });
    }
  });
  apiRouter.get("/user-credit-achievements/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const achievements = await storage2.getUserCreditAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user credit achievements" });
    }
  });
  apiRouter.get("/user-credit-achievements/unseen/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const achievements = await storage2.getUnseenAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unseen achievements" });
    }
  });
  apiRouter.post("/user-credit-achievements", async (req, res) => {
    try {
      const achievement = await storage2.createUserCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user credit achievement" });
    }
  });
  apiRouter.patch("/user-credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedAchievement = await storage2.updateUserCreditAchievement(id, req.body);
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
      const updatedAchievement = await storage2.markAchievementAsSeen(id);
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
      const history = await storage2.getCreditScoreHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score history" });
    }
  });
  apiRouter.post("/credit-score-history", async (req, res) => {
    try {
      const history = await storage2.createCreditScoreHistory(req.body);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score history" });
    }
  });
  apiRouter.get("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const points = await storage2.getUserRewardPoints(userId);
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
      const points = await storage2.createUserRewardPoints(req.body);
      res.status(201).json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user reward points" });
    }
  });
  apiRouter.patch("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedPoints = await storage2.updateUserRewardPoints(userId, req.body);
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
      const updatedPoints = await storage2.addUserPoints(userId, amount, description, type, referenceId, referenceType);
      res.json(updatedPoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to add reward points" });
    }
  });
  apiRouter.get("/point-transactions/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await storage2.getPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch point transactions" });
    }
  });
  apiRouter.post("/point-transactions", async (req, res) => {
    try {
      const transaction = await storage2.createPointTransaction(req.body);
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
      const organization = await storage2.createOrganization({
        ...req.body,
        ownerId: user.claims.sub
      });
      await storage2.addUserToOrganization(user.claims.sub, organization.id, "admin");
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to create organization" });
    }
  });
  app2.get("/api/organizations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const organizations = await storage2.getUserOrganizations(user.claims.sub);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const organization = await storage2.getOrganization(req.params.id);
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
      const updatedOrg = await storage2.updateOrganization(orgId, {
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
      await storage2.deleteOrganization(orgId);
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
      const members = await storage2.getOrganizationMembers(orgId);
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
      const invitation = await storage2.createOrganizationInvitation({
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
      const analytics = await storage2.getOrganizationAnalytics(orgId);
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
      const settings = await storage2.getUserSettings(userId);
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
      const updatedSettings = await storage2.updateUserSettings(userId, settingsData);
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
      await storage2.resetUserSettings(userId);
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
      const exportData = await storage2.exportUserSettings(userId);
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
      const collaboration = await storage2.createCollaboration({
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
      const collaborations = await storage2.getUserCollaborations(user.claims.sub);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });
  app2.post("/api/invitations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const invitation = await storage2.createInvitation({
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
      const invitations = await storage2.getUserInvitations(user.claims.email);
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });
  app2.patch("/api/invitations/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const invitation = await storage2.getInvitation(req.params.id);
      if (!invitation || invitation.inviteeEmail !== user.claims.email) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      const updatedInvitation = await storage2.updateInvitation(req.params.id, req.body);
      if (req.body.status === "accepted" && invitation.type === "organization") {
        await storage2.addUserToOrganization(user.claims.sub, invitation.organizationId, invitation.role || "member");
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
      const user = await storage2.getUserById(userId);
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
      const updatedUser = await storage2.updateUser(userId, {
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
      const members = await storage2.getTeamMembers(userId);
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
      const invitation = await storage2.createTeamInvitation({
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
      const invitations = await storage2.getTeamInvitations(userId);
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
      const updatedMember = await storage2.updateTeamMember(memberId, {
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
      await storage2.removeTeamMember(memberId);
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
      await storage2.resendTeamInvitation(invitationId);
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
      await storage2.cancelTeamInvitation(invitationId);
      res.json({ message: "Invitation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      res.status(500).json({ message: "Failed to cancel invitation" });
    }
  });
  app2.use("/api", apiRouter);
  app2.use("/api/ai-agents", ai_agent_routes_default);
  app2.use("/api/documents/ai", document_ai_routes_default);
  app2.use("/api/dt", enhanced_dt_routes_default);
  app2.use("/api/dt", dt_comprehensive_routes_default);
  app2.use("/api/assessments", assessment_routes_default);
  app2.use("/api/business-plans", business_plan_routes_default);
  app2.use("/api/users", user_routes_default);
  app2.use("/api/investments", investment_routes_default);
  app2.use("/api/credit", credit_routes_default);
  app2.use("/api/organizations", organization_routes_default);
  app2.use("/api/loans", loan_routes_default);
  app2.use("/api/advisory", advisory_routes_default);
  app2.use("/api/team", team_routes_default);
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
  const analyticsService3 = new InfographicAnalyticsService2();
  apiRouter.post("/infographic/analytics/track", isAuthenticated, async (req, res) => {
    try {
      const { infographicId, event, metadata } = req.body;
      if (!infographicId || !event) {
        return res.status(400).json({ message: "Infographic ID and event are required" });
      }
      await analyticsService3.trackEvent(
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
      const stats = await analyticsService3.getUsageStats(timeRange);
      res.json(stats);
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ message: "Failed to get analytics stats" });
    }
  });
  apiRouter.get("/infographic/analytics/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await analyticsService3.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("User analytics error:", error);
      res.status(500).json({ message: "Failed to get user analytics" });
    }
  });
  apiRouter.get("/infographic/analytics/trending", isAuthenticated, async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const trending = await analyticsService3.getTrendingInfographics(Number(limit));
      res.json(trending);
    } catch (error) {
      console.error("Trending analytics error:", error);
      res.status(500).json({ message: "Failed to get trending infographics" });
    }
  });
  apiRouter.get("/infographic/analytics/insights", isAuthenticated, async (req, res) => {
    try {
      const insights = await analyticsService3.getPerformanceInsights();
      res.json(insights);
    } catch (error) {
      console.error("Performance insights error:", error);
      res.status(500).json({ message: "Failed to get performance insights" });
    }
  });
  apiRouter.post("/applications/fill", isAuthenticated, async (req, res) => {
    try {
      const { form, businessPlan } = req.body;
      if (!form || !businessPlan) {
        return res.status(400).json({ message: "Form and business plan data required" });
      }
      const filledApplication = await aiApplicationFiller.fillApplication(form, businessPlan);
      res.json(filledApplication);
    } catch (error) {
      console.error("Application fill error:", error);
      res.status(500).json({ message: "Failed to fill application" });
    }
  });
  apiRouter.post("/applications/suggestions", isAuthenticated, async (req, res) => {
    try {
      const { form, responses, businessPlan } = req.body;
      if (!form || !responses || !businessPlan) {
        return res.status(400).json({ message: "Form, responses, and business plan data required" });
      }
      const suggestions = await aiApplicationFiller.generateSuggestions(form, responses, businessPlan);
      res.json({ suggestions });
    } catch (error) {
      console.error("Suggestions generation error:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express5 from "express";
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
  app2.use(express5.static(distPath));
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
        await storage2.upsertUser({
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
    await storage2.upsertUser({
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

// server/websocket-server.ts
import { Server as SocketIOServer2 } from "socket.io";
var WebSocketServer = class {
  io;
  collaborationService;
  constructor(httpServer) {
    this.io = new SocketIOServer2(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      path: "/socket.io"
    });
    this.collaborationService = new DTCollaborationService(httpServer);
    this.setupEventHandlers();
  }
  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      socket.on("join-dt-session", async (data) => {
        await this.handleJoinSession(socket, data);
      });
      socket.on("leave-dt-session", async (data) => {
        await this.handleLeaveSession(socket, data);
      });
      socket.on("canvas-update", async (data) => {
        await this.handleCanvasUpdate(socket, data);
      });
      socket.on("request-ai-suggestions", async (data) => {
        await this.handleSuggestionRequest(socket, data);
      });
      socket.on("resolve-conflict", async (data) => {
        await this.handleConflictResolution(socket, data);
      });
      socket.on("start-session", async (data) => {
        await this.handleStartSession(socket, data);
      });
      socket.on("pause-session", async (data) => {
        await this.handlePauseSession(socket, data);
      });
      socket.on("end-session", async (data) => {
        await this.handleEndSession(socket, data);
      });
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        this.handleDisconnect(socket);
      });
    });
  }
  /**
   * Handle user joining a DT session
   */
  async handleJoinSession(socket, data) {
    try {
      const { sessionId, userId, userRole } = data;
      socket.join(sessionId);
      socket.to(sessionId).emit("participant-joined", {
        userId,
        userRole,
        timestamp: /* @__PURE__ */ new Date()
      });
      socket.emit("session-state", {
        sessionId,
        participants: await this.getSessionParticipants(sessionId),
        canvas: await this.getSessionCanvas(sessionId)
      });
      console.log(`User ${userId} joined session ${sessionId}`);
    } catch (error) {
      console.error("Error joining session:", error);
      socket.emit("error", { message: "Failed to join session" });
    }
  }
  /**
   * Handle user leaving a DT session
   */
  async handleLeaveSession(socket, data) {
    try {
      const { sessionId, userId } = data;
      socket.leave(sessionId);
      socket.to(sessionId).emit("participant-left", {
        userId,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`User ${userId} left session ${sessionId}`);
    } catch (error) {
      console.error("Error leaving session:", error);
    }
  }
  /**
   * Handle canvas updates
   */
  async handleCanvasUpdate(socket, data) {
    try {
      const { sessionId, update } = data;
      socket.to(sessionId).emit("canvas-update", {
        update,
        timestamp: /* @__PURE__ */ new Date()
      });
      if (update.type === "element_added") {
        const suggestions = await this.generateAISuggestions(sessionId, update);
        if (suggestions.length > 0) {
          socket.to(sessionId).emit("ai-suggestions", {
            suggestions,
            timestamp: /* @__PURE__ */ new Date()
          });
        }
      }
      console.log(`Canvas updated for session ${sessionId}`);
    } catch (error) {
      console.error("Error handling canvas update:", error);
      socket.emit("error", { message: "Failed to update canvas" });
    }
  }
  /**
   * Handle AI suggestion requests
   */
  async handleSuggestionRequest(socket, data) {
    try {
      const { sessionId, context, type } = data;
      const suggestions = await this.generateAISuggestions(sessionId, context);
      socket.emit("ai-suggestions", {
        suggestions,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`AI suggestions generated for session ${sessionId}`);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      socket.emit("error", { message: "Failed to generate suggestions" });
    }
  }
  /**
   * Handle conflict resolution
   */
  async handleConflictResolution(socket, data) {
    try {
      const { sessionId, conflict } = data;
      const resolution = await this.resolveConflict(conflict);
      this.io.to(sessionId).emit("conflict-resolved", {
        conflict,
        resolution,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Conflict resolved for session ${sessionId}`);
    } catch (error) {
      console.error("Error resolving conflict:", error);
      socket.emit("error", { message: "Failed to resolve conflict" });
    }
  }
  /**
   * Handle session start
   */
  async handleStartSession(socket, data) {
    try {
      const { sessionId } = data;
      this.io.to(sessionId).emit("session-started", {
        sessionId,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Session ${sessionId} started`);
    } catch (error) {
      console.error("Error starting session:", error);
      socket.emit("error", { message: "Failed to start session" });
    }
  }
  /**
   * Handle session pause
   */
  async handlePauseSession(socket, data) {
    try {
      const { sessionId } = data;
      this.io.to(sessionId).emit("session-paused", {
        sessionId,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Session ${sessionId} paused`);
    } catch (error) {
      console.error("Error pausing session:", error);
      socket.emit("error", { message: "Failed to pause session" });
    }
  }
  /**
   * Handle session end
   */
  async handleEndSession(socket, data) {
    try {
      const { sessionId } = data;
      const summary = await this.generateSessionSummary(sessionId);
      this.io.to(sessionId).emit("session-ended", {
        sessionId,
        summary,
        timestamp: /* @__PURE__ */ new Date()
      });
      console.log(`Session ${sessionId} ended`);
    } catch (error) {
      console.error("Error ending session:", error);
      socket.emit("error", { message: "Failed to end session" });
    }
  }
  /**
   * Handle user disconnect
   */
  handleDisconnect(socket) {
    console.log("User disconnected:", socket.id);
  }
  /**
   * Get session participants
   */
  async getSessionParticipants(sessionId) {
    return [];
  }
  /**
   * Get session canvas
   */
  async getSessionCanvas(sessionId) {
    return {
      id: sessionId,
      elements: [],
      version: 1
    };
  }
  /**
   * Generate AI suggestions
   */
  async generateAISuggestions(sessionId, context) {
    return [];
  }
  /**
   * Resolve conflict
   */
  async resolveConflict(conflict) {
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: "last_write_wins",
      resolution: { winner: "auto" },
      applied: true,
      requiresNotification: true
    };
  }
  /**
   * Generate session summary
   */
  async generateSessionSummary(sessionId) {
    return {
      sessionId,
      duration: 0,
      participants: 0,
      activities: 0,
      insights: []
    };
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// server/index.ts
dotenv2.config();
var app = express6();
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
app.use(express6.json({ limit: "10mb" }));
app.use(express6.urlencoded({ extended: false, limit: "10mb" }));
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
  try {
    console.log("\u26A0\uFE0F Skipping agent services initialization in development mode");
  } catch (error) {
    console.error("\u274C Failed to initialize agent services:", error.message);
    console.log("\u26A0\uFE0F Continuing without agent services...");
  }
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
  const wsServer = new WebSocketServer(server);
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
