# Azure Co-Founder Agent - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and test the Azure-powered Co-Founder Agent.

## Prerequisites

- Azure account with OpenAI access
- Node.js 18+ installed
- Access to the Iterative Startups codebase

## Step 1: Azure Resource Setup

### Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Azure OpenAI** resource
3. Deploy models:
   - **GPT-4** (for conversations)
   - **text-embedding-ada-002** (for semantic search)
4. Note your:
   - Endpoint URL
   - API Key
   - Deployment names

### Create Azure AI Services Resource

1. In Azure Portal, create **Cognitive Services** resource
2. Note your:
   - Endpoint URL
   - API Key
   - Region

## Step 2: Environment Configuration

Create or update `.env` file:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-openai-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002
AZURE_OPENAI_USE_AAD=false

# Azure AI Services Configuration
AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_AI_API_KEY=your-ai-services-key-here
AZURE_REGION=eastus

# MongoDB (existing)
USE_MONGODB=true
MONGODB_CONNECTION_STRING=your-mongodb-connection-string
MONGODB_DATABASE_NAME=iterativ-db
```

## Step 3: Install Dependencies

```bash
npm install
```

All required packages are already in `package.json`:
- `openai` (v4.104.0+)
- Other dependencies

## Step 4: Test the Integration

### Basic Test

Create `test-cofounder.ts`:

```typescript
import { CoFounderAgent } from './server/ai-agents/agents/co-founder';
import { AgentConfig, AgentContext } from './server/ai-agents/core/agent-engine';

// Configure agent
const config: AgentConfig = {
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  useAzure: true,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureDeployment: 'gpt-4',
  model: 'gpt-4'
};

// Create agent
const coFounder = new CoFounderAgent(config);

// Test conversation
const context: AgentContext = {
  userId: 'test-user',
  currentTask: 'general',
  conversationHistory: [
    {
      role: 'user',
      content: 'I\'m thinking about pivoting my SaaS from SMB to enterprise. What should I consider?'
    }
  ],
  relevantData: {
    stage: 'seed',
    revenue: '100K ARR',
    teamSize: 5,
    industry: 'SaaS'
  }
};

async function test() {
  try {
    const response = await coFounder.execute(context, {});
    console.log('✅ Co-Founder Response:', response.content);
    console.log('\n📝 Suggestions:', response.suggestions);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
```

Run it:
```bash
npx tsx test-cofounder.ts
```

### Test Decision Support

```typescript
const context: AgentContext = {
  userId: 'test-user',
  currentTask: 'decision_support',
  conversationHistory: [
    {
      role: 'user',
      content: 'Should I raise a Series A now or wait 6 months to improve metrics?'
    }
  ],
  relevantData: {
    stage: 'seed',
    revenue: '500K ARR',
    growth: '15% MoM',
    runway: '8 months',
    teamSize: 12
  }
};
```

This will trigger **multi-perspective decision analysis** since it's a high-impact decision.

### Test Crisis Support

```typescript
const context: AgentContext = {
  userId: 'test-user',
  currentTask: 'crisis_support',
  conversationHistory: [
    {
      role: 'user',
      content: 'Our CTO just quit with no notice and took 2 engineers with him. We have a major release in 2 weeks.'
    }
  ],
  relevantData: {
    stage: 'growth',
    revenue: '2M ARR',
    teamSize: 25,
    engineersRemaining: 3
  }
};
```

This will generate a **structured crisis action plan** with immediate, short-term, and strategic actions.

### Test Brainstorming

```typescript
const context: AgentContext = {
  userId: 'test-user',
  currentTask: 'brainstorm',
  conversationHistory: [
    {
      role: 'user',
      content: 'I need new revenue streams beyond our core SaaS product. What are some ideas?'
    }
  ],
  relevantData: {
    stage: 'growth',
    revenue: '1.5M ARR',
    customers: 200,
    industry: 'FinTech'
  }
};
```

This will use **Azure-enhanced creative brainstorming** with feasibility and impact scores.

## Step 5: Verify Azure Services

### Check Azure OpenAI

```typescript
import { AzureOpenAIAdvanced } from './server/ai-agents/core/azure-openai-advanced';

const client = new AzureOpenAIAdvanced(config);

async function testAzure() {
  // Test basic generation
  const response = await client.generateWithFunctions(
    'You are a helpful assistant',
    'What is 2+2?',
    []
  );
  console.log('✅ Azure OpenAI working:', response.content);
  
  // Test embeddings
  const embedding = await client.generateEmbedding('Test text');
  console.log('✅ Embeddings working, dimension:', embedding.length);
}

testAzure();
```

### Check Azure Cognitive Services

```typescript
import { azureCognitiveServices } from './server/ai-agents/core/azure-cognitive-services';

async function testCognitive() {
  const analysis = await azureCognitiveServices.analyzeConversation(
    "I'm so excited about our new product launch! It's going to be amazing.",
    []
  );
  
  console.log('✅ Conversation Analysis:');
  console.log('   Intent:', analysis.intent);
  console.log('   Sentiment:', analysis.sentiment);
  console.log('   Emotional Tone:', analysis.emotionalTone);
  console.log('   Urgency:', analysis.urgency);
  console.log('   Key Topics:', analysis.keyTopics);
}

testCognitive();
```

## Step 6: Integrate with Frontend

### API Route (already exists)

The Co-Founder agent is available via:
```
POST /api/ai-agents/execute
```

Request body:
```json
{
  "agentType": "co-founder",
  "context": {
    "userId": "user123",
    "currentTask": "decision_support",
    "conversationHistory": [...],
    "relevantData": {
      "stage": "seed",
      "revenue": "100K ARR"
    }
  },
  "options": {}
}
```

### Frontend Usage

```typescript
import { useCoFounder } from './hooks/co-founder/useCoFounder';

function CoFounderChat() {
  const { sendMessage, response, loading } = useCoFounder();
  
  const handleSend = async (message: string) => {
    await sendMessage({
      currentTask: 'general',
      message,
      businessContext: {
        stage: 'seed',
        revenue: '100K ARR'
      }
    });
  };
  
  return (
    <div>
      {loading && <Spinner />}
      {response && (
        <div>
          <p>{response.content}</p>
          <div>
            {response.suggestions?.map(s => (
              <Button key={s} onClick={() => handleSend(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Step 7: Monitor & Debug

### Enable Logging

```typescript
// In your .env
DEBUG=azure:*
LOG_LEVEL=debug
```

### Check Logs

```bash
# Azure OpenAI requests
grep "Azure OpenAI" logs/app.log

# Cognitive Services
grep "Azure Cognitive" logs/app.log

# Errors
grep "ERROR" logs/app.log
```

### Monitor Azure Resources

1. Go to Azure Portal
2. Open your OpenAI resource
3. Click "Monitoring" → "Metrics"
4. Check:
   - Total tokens used
   - Request latency
   - Error rate

## Common Issues & Solutions

### Issue: "API key invalid"

**Solution**: 
- Check `.env` file has correct API key
- Verify key hasn't expired in Azure Portal
- Ensure key has proper permissions

### Issue: "Deployment not found"

**Solution**:
- Verify deployment name matches in Azure Portal
- Check `AZURE_OPENAI_DEPLOYMENT` in `.env`
- Ensure model is fully deployed (not creating)

### Issue: "Content safety check failed"

**Solution**:
- This is expected for inappropriate content
- Check what triggered it in logs
- Adjust content if testing

### Issue: "Embeddings dimension mismatch"

**Solution**:
- Ensure using `text-embedding-ada-002` (1536 dimensions)
- Check deployment name is correct

### Issue: "Azure Cognitive Services not working"

**Solution**:
- Verify endpoint format (must be `*.cognitiveservices.azure.com`)
- Check API key
- Ensure region matches
- Falls back to basic analysis if not configured

## Performance Tips

### 1. Use Caching

```typescript
// Cache frequently used embeddings
const embedCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string) {
  if (embedCache.has(text)) {
    return embedCache.get(text)!;
  }
  const embedding = await client.generateEmbedding(text);
  embedCache.set(text, embedding);
  return embedding;
}
```

### 2. Batch Requests

```typescript
// Instead of multiple single requests
const embeddings = await client.generateEmbeddings([
  text1, text2, text3
]);
```

### 3. Use Streaming for Long Responses

```typescript
await client.streamWithFunctions(
  systemPrompt,
  message,
  history,
  functions,
  (chunk) => {
    if (chunk.content) {
      // Stream to UI in real-time
      socket.emit('chunk', chunk.content);
    }
  }
);
```

### 4. Summarize Long Conversations

```typescript
if (client.shouldSummarize(messages, 8000)) {
  const summary = await client.summarizeConversation(messages);
  // Use summary instead of full history
}
```

## Cost Optimization

### Token Usage

```typescript
// Estimate before sending
const tokens = client.estimateTokens(message);
const cost = (tokens / 1000) * 0.03; // GPT-4 price

console.log(`Estimated cost: $${cost.toFixed(4)}`);
```

### Monitoring Costs

1. Azure Portal → Cost Management
2. Set up budget alerts
3. Monitor daily usage

### Best Practices

- Use function calling for structured outputs (more efficient)
- Summarize long conversations
- Cache embeddings for repeated content
- Use appropriate models (GPT-3.5 for simple tasks)

## Next Steps

1. ✅ Test basic Co-Founder conversations
2. ✅ Test decision support with real scenarios
3. ✅ Test crisis management
4. ✅ Integrate with frontend
5. 📊 Monitor usage and costs
6. 🎨 Customize personality settings
7. 🚀 Deploy to production

## Support

- **Documentation**: `/docs/AZURE_INTEGRATION.md`
- **Issues**: Check logs first, then contact team
- **Azure Support**: https://portal.azure.com (Support + troubleshooting)

## Useful Commands

```bash
# Start development server
npm run dev

# Test Co-Founder agent
npx tsx test-cofounder.ts

# Check TypeScript errors
npm run check

# View logs
tail -f logs/app.log

# Monitor Azure resources
az monitor metrics list --resource <resource-id>
```

## Success Checklist

- [ ] Azure OpenAI resource created
- [ ] Azure Cognitive Services resource created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Basic test passes
- [ ] Decision support test passes
- [ ] Crisis support test passes
- [ ] Brainstorming test passes
- [ ] Frontend integration works
- [ ] Monitoring set up
- [ ] Cost alerts configured

---

**🎉 You're ready to build with the Azure-powered Co-Founder Agent!**

For advanced features and customization, see the [full Azure Integration Guide](./AZURE_INTEGRATION.md).