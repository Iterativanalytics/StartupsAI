# Azure OpenAI Co-Founder™ Agent Integration

## 🎯 Overview

This implementation integrates Azure OpenAI and Azure AI Services into the Co-Founder™ Agent, providing enterprise-grade AI capabilities for sophisticated business co-founding support.

## 🏗️ Architecture

```
Co-Founder™ Agent
├── Core Components
│   ├── Co-Founder™ Brain (conversation analysis & decision logic)
│   ├── Personality Manager (adaptive personality system)
│   ├── Relationship Manager (partnership health tracking)
│   └── Memory System (long-term business context)
│
├── Azure Integration Layer
│   ├── Azure OpenAI Client (basic chat completions)
│   ├── Azure OpenAI Advanced (function calling, embeddings, streaming)
│   ├── Azure AI Services (sentiment, content safety)
│   └── Azure Cognitive Services (language understanding, NLP)
│
└── Enhanced Capabilities
    ├── Multi-Perspective Decision Analysis
    ├── Strategic Thinking with Chain-of-Thought
    ├── Proactive Insights Generation
    ├── Devil's Advocate Mode
    ├── Creative Brainstorming
    ├── Accountability Pattern Analysis
    └── Crisis Action Planning
```

## 🚀 Key Features

### 1. **Intelligent Conversation Analysis**
Uses Azure Cognitive Services to understand:
- **Intent Detection**: What the entrepreneur really needs
- **Sentiment Analysis**: Emotional state and stress levels
- **Emotional Tone**: Confidence, stress, excitement, frustration
- **Urgency Detection**: Crisis vs. routine conversations
- **Key Topics**: Main themes in conversations
- **Actionable Items**: Automatic extraction of commitments

### 2. **Multi-Perspective Decision Support**
For high-impact decisions, generates analysis from multiple angles:
- **Optimistic Perspective**: Best-case scenarios and opportunities
- **Pessimistic Perspective**: Risks and potential pitfalls  
- **Realistic Perspective**: Balanced, likely outcomes
- **Data-Driven Perspective**: Fact-based, metric-focused
- **Strategic Perspective**: Long-term implications

### 3. **Advanced AI Capabilities**

#### Function Calling
Structured outputs for:
- Business insights generation
- Decision analysis
- Accountability tracking
- Crisis planning

#### Semantic Search with Embeddings
- Find similar past conversations
- Context-aware responses
- Pattern recognition across business history

#### Chain-of-Thought Reasoning
- Transparent reasoning process
- Step-by-step strategic thinking
- Educational approach to decision-making

#### Streaming Responses
- Real-time conversation flow
- Progressive disclosure
- Better user experience

### 4. **Proactive Intelligence**
AI actively monitors for:
- **Opportunities**: Market gaps, growth levers
- **Warnings**: Cash flow issues, customer concentration
- **Celebrations**: Wins worth acknowledging
- **Accountability Gaps**: Delayed commitments, avoidance patterns

### 5. **Crisis Management**
Structured crisis response with:
- Severity assessment
- Immediate actions (24 hours)
- Short-term stabilization (1 week)
- Strategic recovery (30 days)
- Emotional support messaging

## 📦 Components

### Core Azure Integration

#### `azure-openai-client.ts`
Basic Azure OpenAI integration:
```typescript
const client = new AzureOpenAIClient(config);
const response = await client.generateResponse(systemPrompt, userMessage, history);
```

#### `azure-openai-advanced.ts`
Advanced features:
```typescript
const advancedClient = new AzureOpenAIAdvanced(config);

// Function calling
const result = await advancedClient.generateWithFunctions(
  systemPrompt, message, history, functions
);

// Semantic search
const similar = await advancedClient.findSimilar(query, candidates, topK);

// Streaming
await advancedClient.streamWithFunctions(systemPrompt, message, history, functions, onChunk);
```

#### `azure-ai-services.ts`
Content safety and text analytics:
```typescript
const sentiment = await azureAIServices.analyzeSentiment(text);
const safe = await azureAIServices.checkContentSafety(text);
const phrases = await azureAIServices.extractKeyPhrases(text);
```

#### `azure-cognitive-services.ts`
Comprehensive NLP:
```typescript
const analysis = await azureCognitiveServices.analyzeConversation(message, history);
// Returns: intent, sentiment, emotionalTone, urgency, keyTopics, actionableItems
```

### Enhanced Capabilities

#### `azure-enhanced-capabilities.ts`
High-level Co-Founder features:

**Decision Analysis:**
```typescript
const analysis = await capabilities.analyzeDecisionMultiPerspective(decision, context);
// Returns analysis from multiple perspectives with synthesis
```

**Strategic Thinking:**
```typescript
const strategic = await capabilities.strategicThinking(question, context);
// Returns: content, reasoning, insights, actionItems
```

**Proactive Insights:**
```typescript
const insights = await capabilities.generateProactiveInsights(context);
// Returns array of opportunities, warnings, celebrations, accountability items
```

**Brainstorming:**
```typescript
const ideas = await capabilities.brainstormIdeas(topic, context);
// Returns: conventional, unconventional, and disruptive ideas with pros/cons
```

**Crisis Planning:**
```typescript
const plan = await capabilities.generateCrisisActionPlan(crisis, context);
// Returns: structured immediate, short-term, and strategic actions
```

## 🔧 Configuration

### Environment Variables

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002
AZURE_OPENAI_USE_AAD=false

# Azure AI Services
AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_AI_API_KEY=your-ai-key
AZURE_REGION=eastus
```

### Agent Initialization

```typescript
import { CoFounderAgent } from './agents/co-founder';

const config: AgentConfig = {
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  useAzure: true,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureDeployment: 'gpt-4',
  azureEmbeddingDeployment: 'text-embedding-ada-002',
  model: 'gpt-4'
};

const coFounder = new CoFounderAgent(config);
```

## 💡 Usage Examples

### Daily Standup
```typescript
const response = await coFounder.execute(
  {
    userId: 'user123',
    currentTask: 'daily_standup',
    conversationHistory: [],
    relevantData: { stage: 'early', revenue: '50K MRR' }
  },
  {}
);
```

### Decision Support
```typescript
const response = await coFounder.execute(
  {
    userId: 'user123',
    currentTask: 'decision_support',
    conversationHistory: [
      {
        role: 'user',
        content: 'Should I raise funding or bootstrap?'
      }
    ],
    relevantData: { 
      stage: 'seed',
      revenue: '100K ARR',
      runway: '12 months',
      burn: '20K/month'
    }
  },
  {}
);
```

### Crisis Support
```typescript
const response = await coFounder.execute(
  {
    userId: 'user123',
    currentTask: 'crisis_support',
    conversationHistory: [
      {
        role: 'user',
        content: 'Our biggest customer just churned - 40% of revenue'
      }
    ],
    relevantData: {
      revenue: '200K MRR',
      customers: 25,
      topCustomerRevenue: '80K MRR'
    }
  },
  {}
);
```

## 🎭 Conversation Modes

The Co-Founder adapts its behavior based on detected needs:

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Supportive** | Stress detected | Empathetic, encouraging, breaks down problems |
| **Challenging** | Overconfidence | Devil's advocate, questions assumptions |
| **Teaching** | Uncertainty | Educational, framework-driven, patient |
| **Collaborative** | Balanced | Think-partner, explores together |
| **Celebratory** | Wins detected | Acknowledges achievement, identifies success patterns |
| **Crisis** | Emergency | Calm, structured, action-oriented |

## 🔒 Security & Privacy

### Content Safety
All user messages are automatically checked for inappropriate content:
```typescript
const safetyCheck = await azureAIServices.checkContentSafety(message);
if (!safetyCheck.safe) {
  // Returns safe, professional response
}
```

### Data Privacy
- API keys stored in environment variables
- No sensitive business data logged
- Conversation history encrypted
- GDPR/CCPA compliant

### Error Handling
Automatic fallback mechanisms:
```typescript
try {
  const analysis = await azureCognitiveServices.analyzeConversation(text);
} catch (error) {
  // Automatically falls back to basic analysis
  const basicAnalysis = this.basicConversationAnalysis(text);
}
```

## 📊 Performance

### Token Optimization
```typescript
// Automatic conversation summarization
if (advancedClient.shouldSummarize(messages, 8000)) {
  const summary = await advancedClient.summarizeConversation(messages);
  // Use summary instead of full history
}
```

### Parallel Processing
```typescript
const [sentiment, keyPhrases, intent] = await Promise.all([
  azureCognitiveServices.analyzeSentiment(text),
  azureCognitiveServices.extractKeyPhrases(text),
  azureCognitiveServices.detectIntent(text)
]);
```

### Caching
```typescript
const cache = new Map<string, number[]>();

async function getCachedEmbedding(text: string): Promise<number[]> {
  if (cache.has(text)) return cache.get(text)!;
  const embedding = await advancedClient.generateEmbedding(text);
  cache.set(text, embedding);
  return embedding;
}
```

## 🧪 Testing

Run the Co-Founder agent tests:
```bash
npm test -- co-founder
```

Test Azure integration:
```bash
npm test -- azure
```

## 📈 Monitoring

### Request Logging
```typescript
console.log('Azure OpenAI Request:', {
  model: deployment,
  tokens: estimatedTokens,
  timestamp: new Date()
});
```

### Error Tracking
```typescript
try {
  const response = await advancedClient.generateResponse(...);
} catch (error) {
  console.error('Azure OpenAI Error:', {
    error: error.message,
    endpoint: config.azureEndpoint,
    deployment: config.azureDeployment
  });
}
```

## 🚀 Deployment

### Azure Resources Required

1. **Azure OpenAI Service**
   - GPT-4 deployment
   - text-embedding-ada-002 deployment

2. **Azure Cognitive Services**
   - Text Analytics API
   - Content Safety API
   - Conversational Language Understanding (optional)

3. **Azure Cosmos DB** (existing)
   - MongoDB API for conversation storage

### Deployment Steps

1. Set up environment variables
2. Deploy to Azure App Service / Container Apps
3. Configure Azure Key Vault for secrets
4. Enable Application Insights for monitoring
5. Set up CI/CD pipeline

## 📚 Documentation

- [Azure Integration Guide](./docs/AZURE_INTEGRATION.md)
- [Co-Founder™ Agent Overview](./README-AI-AGENTS.md)
- [API Documentation](./docs/api.md)

## 🤝 Contributing

When adding new Azure-powered features:

1. Add capability to `azure-enhanced-capabilities.ts`
2. Update Co-Founder agent in `index.ts`
3. Add tests
4. Update documentation
5. Submit PR

## 📝 License

Proprietary - Iterative Startups Platform

## 🔗 Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure Cognitive Services](https://learn.microsoft.com/azure/ai-services/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 🎯 Next Steps

1. Test the integration with real conversations
2. Fine-tune personality responses
3. Add voice capabilities (Azure Speech Services)
4. Implement RAG with Azure AI Search
5. Build multi-agent coordination

---

**Built with ❤️ using Azure AI Services**