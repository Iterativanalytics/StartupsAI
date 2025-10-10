# AI Agent Integration Guide

## Quick Start

### 1. Installation

```bash
# Install the AI agents package
npm install @iterative-startups/ai-agents
```

### 2. Environment Setup

```bash
# .env
ANTHROPIC_API_KEY=your_api_key_here
OPENAI_API_KEY=your_openai_key_here  # Optional, for embeddings
REDIS_URL=redis://localhost:6379     # Optional, for caching
PINECONE_API_KEY=your_pinecone_key   # Optional, for vector search
```

### 3. Basic Integration

#### Backend Setup

```typescript
// server/ai-service.ts
import { AgentEngine } from '@iterative-startups/ai-agents';

const agentEngine = new AgentEngine({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  modelName: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  maxTokens: 4096,
  enableMemory: true,
  enableTools: true
});

export { agentEngine };
```

#### API Routes

```typescript
// server/routes/ai.ts
import { Router } from 'express';
import { agentEngine } from '../ai-service';

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const response = await agentEngine.processRequest({
      userId: req.user.id,
      userType: req.user.userType,
      message: req.body.message,
      sessionId: req.body.sessionId,
      context: req.body.context
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await agentEngine.processStreamingRequest(
      req.body,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;
```

#### Frontend Integration

```tsx
// App.tsx
import { AgentAssistant } from '@/components/ai/AgentAssistant';

function App() {
  return (
    <div>
      {/* Your app content */}
      <AgentAssistant />
    </div>
  );
}
```

## Advanced Usage

### Custom Agent Creation

```typescript
import { BaseAgent } from '@iterative-startups/ai-agents';

class CustomAgent extends BaseAgent {
  protected agentType = 'custom_agent' as AgentType;

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    // Custom insight generation logic
    return ['Custom insight 1', 'Custom insight 2'];
  }

  // Override other methods as needed
}
```

### Custom Tools

```typescript
import { Tool, AgentContext } from '@iterative-startups/ai-agents';

export class CustomTool {
  getTool(): Tool {
    return {
      name: 'custom_calculator',
      description: 'Performs custom calculations',
      parameters: {
        type: 'object',
        properties: {
          input: { type: 'number' }
        }
      },
      execute: this.execute.bind(this)
    };
  }

  async execute(params: any, context: AgentContext): Promise<any> {
    // Tool implementation
    return { result: params.input * 2 };
  }
}

// Register the tool
import { ToolRegistry } from '@iterative-startups/ai-agents';

const registry = new ToolRegistry();
const customTool = new CustomTool();
registry.registerTool(customTool.getTool());
```

### Agent Chains

```typescript
import { AgentChain } from '@iterative-startups/ai-agents';

const customChain = new AgentChain()
  .addStep({
    name: 'analyze',
    agentType: 'business_advisor',
    input: (context) => ({
      task: 'analyze_market',
      data: context.relevantData.market
    })
  })
  .addStep({
    name: 'recommend',
    agentType: 'business_advisor',
    input: (context, results) => ({
      task: 'recommend_strategy',
      analysis: results[0]
    }),
    condition: (context, results) => results[0].confidence > 0.7
  });

// Execute the chain
const results = await customChain.execute(context);
```

### Automation Rules

```typescript
import { AutomationEngine } from '@iterative-startups/ai-agents';

const automation = new AutomationEngine();

automation.registerRule({
  id: 'custom-rule',
  name: 'Custom Alert Rule',
  description: 'Trigger when specific condition is met',
  trigger: {
    type: 'event',
    event: 'metric_update'
  },
  conditions: [
    {
      field: 'value',
      operator: 'greater_than',
      value: 1000
    }
  ],
  actions: [
    {
      type: 'notify',
      parameters: {
        message: 'Metric threshold exceeded',
        priority: 'high'
      }
    }
  ],
  enabled: true,
  priority: 10
});

// Process events
await automation.processEvent({
  type: 'metric_update',
  value: 1500,
  userId: 'user-123'
});
```

## Frontend Components

### Chat Interface

```tsx
import { ChatInterface } from '@/components/ai/ChatInterface';

function MyPage() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
}
```

### Floating Assistant

```tsx
import { AgentAssistant } from '@/components/ai/AgentAssistant';

function Layout() {
  return (
    <div>
      {/* Page content */}
      <AgentAssistant />
    </div>
  );
}
```

### Smart Suggestions

```tsx
import { SmartSuggestions } from '@/components/ai/SmartSuggestions';

function Dashboard() {
  const handleSuggestion = (prompt: string) => {
    // Handle suggestion click
    console.log('Selected:', prompt);
  };

  return (
    <SmartSuggestions onSuggestionClick={handleSuggestion} />
  );
}
```

### Insight Cards

```tsx
import { InsightCards } from '@/components/ai/InsightCards';

function Analytics() {
  const insights = [
    {
      type: 'warning',
      title: 'Low Runway',
      description: 'Cash runway below 6 months',
      priority: 'high',
      actionable: true
    }
  ];

  return <InsightCards insights={insights} />;
}
```

## Hooks

### useAgent

```tsx
import { useAgent } from '@/hooks/ai/useAgent';

function MyComponent() {
  const { sendMessage, isLoading, error } = useAgent();

  const handleQuery = async () => {
    const response = await sendMessage('Analyze my business plan', {
      streaming: true,
      onChunk: (chunk) => console.log(chunk),
      context: { planId: '123' }
    });
  };

  return <button onClick={handleQuery}>Analyze</button>;
}
```

### useAgentChat

```tsx
import { useAgentChat } from '@/hooks/ai/useAgentChat';

function ChatComponent() {
  const {
    messages,
    sendMessage,
    clearHistory,
    isLoading
  } = useAgentChat();

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello')}>
        Send
      </button>
    </div>
  );
}
```

### useAutomation

```tsx
import { useAutomation } from '@/hooks/ai/useAutomation';

function AutomationPanel() {
  const {
    rules,
    createRule,
    toggleRule,
    isLoading
  } = useAutomation();

  const handleToggle = (id: string) => {
    toggleRule(id);
  };

  return (
    <div>
      {rules.map(rule => (
        <div key={rule.id}>
          {rule.name}
          <button onClick={() => handleToggle(rule.id)}>
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Context Management

Always provide relevant context:

```typescript
const response = await sendMessage('Calculate runway', {
  context: {
    cash: 500000,
    monthlyBurn: 75000,
    revenue: 50000
  }
});
```

### 2. Error Handling

```typescript
try {
  const response = await sendMessage(message);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limit
  } else if (error.code === 'AUTHENTICATION_ERROR') {
    // Handle auth error
  } else {
    // Handle generic error
  }
}
```

### 3. Streaming for Long Responses

```typescript
await sendMessage(longQuery, {
  streaming: true,
  onChunk: (chunk) => {
    // Update UI incrementally
    setContent(prev => prev + chunk);
  }
});
```

### 4. Memory Management

```typescript
// Clear session periodically
if (messages.length > 100) {
  await clearHistory();
}
```

### 5. Performance Optimization

```typescript
// Debounce user input
const debouncedSend = useMemo(
  () => debounce((message) => sendMessage(message), 500),
  []
);
```

## Testing

### Unit Tests

```typescript
import { AgentEngine } from '@iterative-startups/ai-agents';

describe('AgentEngine', () => {
  it('processes requests correctly', async () => {
    const engine = new AgentEngine({ apiKey: 'test-key' });
    
    const response = await engine.processRequest({
      userId: 'test-user',
      userType: 'entrepreneur',
      message: 'Hello',
      sessionId: 'test-session'
    });

    expect(response).toBeDefined();
    expect(response.content).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe('Chat API', () => {
  it('handles chat requests', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Test message',
        sessionId: 'test-session'
      });

    expect(response.status).toBe(200);
    expect(response.body.content).toBeTruthy();
  });
});
```

## Troubleshooting

### Common Issues

**1. Rate Limiting**
```
Error: RATE_LIMIT_EXCEEDED
Solution: Implement request queuing or upgrade tier
```

**2. Context Too Large**
```
Error: Context exceeds token limit
Solution: Summarize conversation history or clear old messages
```

**3. API Key Issues**
```
Error: AUTHENTICATION_ERROR
Solution: Verify API key is set correctly in environment
```

**4. Streaming Not Working**
```
Issue: Chunks not arriving
Solution: Check SSE headers and connection persistence
```