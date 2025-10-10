# @iterative-startups/ai-agents

AI Agent system for the IterativeStartups platform, providing intelligent assistance for all user types.

## Features

- 🤖 **Multi-Agent System**: Specialized agents for each user type
- 💬 **Conversational AI**: Natural language interaction powered by Claude
- 🧠 **Context-Aware**: Maintains conversation history and user context
- 🔧 **Tool Integration**: Financial calculators, data analysis, document processing
- 🔄 **Workflow Automation**: Multi-step agent chains and automation rules
- 📊 **Analytics**: Insights, recommendations, and predictive modeling

## Agent Types

### Business Advisor (Entrepreneurs)
- Business plan analysis and improvement
- Financial modeling and forecasting
- Market research and competitive analysis
- Strategic guidance and KPI tracking

### Deal Analyzer (Investors)
- Deal screening and evaluation
- Valuation analysis
- Risk assessment
- Portfolio optimization

### Credit Assessor (Lenders)
- Credit risk scoring
- Cash flow analysis
- Collateral evaluation
- Automated underwriting

### Impact Evaluator (Grantors)
- Social and environmental impact scoring
- ESG compliance assessment
- Outcome prediction
- Program effectiveness analysis

### Partnership Facilitator (Partners)
- Startup-partner matching
- Program optimization
- Resource allocation
- Success prediction

## Installation

```bash
npm install @iterative-startups/ai-agents
```

## Usage

### Basic Setup

```typescript
import { AgentEngine } from '@iterative-startups/ai-agents';

const engine = new AgentEngine({
  apiKey: process.env.ANTHROPIC_API_KEY,
  modelName: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  enableMemory: true,
  enableTools: true
});
```

### Process a Request

```typescript
const response = await engine.processRequest({
  userId: 'user-123',
  userType: UserType.ENTREPRENEUR,
  message: 'Can you analyze my burn rate?',
  sessionId: 'session-456',
  context: {
    cash: 500000,
    monthlyBurn: 75000
  }
});

console.log(response.content);
console.log(response.insights);
```

### Streaming Responses

```typescript
await engine.processStreamingRequest(
  {
    userId: 'user-123',
    userType: UserType.INVESTOR,
    message: 'Evaluate this deal for me',
    sessionId: 'session-789'
  },
  (chunk) => {
    process.stdout.write(chunk);
  }
);
```

### Using Tools

```typescript
import { FinancialCalculator } from '@iterative-startups/ai-agents';

const calculator = new FinancialCalculator();
const tool = calculator.getTool();

const result = await tool.execute({
  calculation: 'runway',
  inputs: {
    cash: 500000,
    monthlyBurn: 75000
  }
}, context);

console.log(result); // { runway: 6.67, status: 'warning', ... }
```

### Agent Chains

```typescript
import { createDealAnalysisChain } from '@iterative-startups/ai-agents';

const chain = createDealAnalysisChain();
const results = await chain.execute(context);

// Results from each step: screening, valuation, risk assessment
console.log(results);
```

### Automation Rules

```typescript
import { AutomationEngine, DEFAULT_RULES } from '@iterative-startups/ai-agents';

const automation = new AutomationEngine();

// Register default rules
DEFAULT_RULES.forEach(rule => automation.registerRule(rule));

// Process events
await automation.processEvent({
  type: 'financial_update',
  runway: 4.5,
  userId: 'user-123'
});
```

## Configuration

### Agent Config

```typescript
interface AgentConfig {
  apiKey: string;              // Anthropic API key
  modelName?: string;          // Claude model (default: claude-3-5-sonnet-20241022)
  temperature?: number;        // 0-2 (default: 0.7)
  maxTokens?: number;          // Max response tokens (default: 4096)
  enableMemory?: boolean;      // Enable conversation memory
  enableTools?: boolean;       // Enable tool usage
  vectorStoreUrl?: string;     // Pinecone URL
  redisUrl?: string;           // Redis URL for caching
}
```

## API Reference

### AgentEngine

- `processRequest(request: AgentRequest): Promise<AgentResponse>`
- `processStreamingRequest(request: AgentRequest, onChunk: Function): Promise<AgentResponse>`
- `clearSession(userId: string, sessionId: string): Promise<void>`
- `getSessionHistory(userId: string, sessionId: string): Promise<Message[]>`

### Tools

- `FinancialCalculator` - Financial calculations
- `DataAnalyzer` - Data analysis and statistics
- `DocumentProcessor` - Document parsing
- `ChartGenerator` - Visualization generation

### Memory

- `MemoryStore` - Conversation and long-term memory
- `KnowledgeBase` - Domain knowledge retrieval
- `VectorStore` - Semantic search

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## License

MIT