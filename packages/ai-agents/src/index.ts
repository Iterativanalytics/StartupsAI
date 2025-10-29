// Core exports
export { AgentEngine } from './core/agent-engine';
export { ContextManager } from './core/context-manager';
export { PromptBuilder } from './core/prompt-builder';
export { ResponseHandler } from './core/response-handler';

// Agent exports (Concept Document Standardized)
export { BaseAgent } from './agents/base-agent';
export { BusinessAdvisorAgent } from './agents/business-advisor';        // Agent-CBA
export { InvestmentAnalystAgent } from './agents/deal-analyzer';         // Agent-CFA
export { CreditAnalystAgent } from './agents/credit-assessor';           // Agent-CRA
export { ImpactAnalystAgent } from './agents/impact-evaluator';          // Agent-CIA
export { ProgramAnalystAgent } from './agents/partnership-facilitator';  // Agent-PMA
export { BusinessAnalystAgent } from './agents/platform-orchestrator'; // Agent-PBA

// Legacy exports for backward compatibility
export { InvestmentAnalystAgent as DealAnalyzerAgent } from './agents/deal-analyzer';
export { CreditAnalystAgent as CreditAssessorAgent } from './agents/credit-assessor';
export { ImpactAnalystAgent as ImpactEvaluatorAgent } from './agents/impact-evaluator';
export { ProgramAnalystAgent as PartnershipFacilitatorAgent } from './agents/partnership-facilitator';
export { BusinessAnalystAgent as PlatformOrchestratorAgent } from './agents/platform-orchestrator';

// Memory exports
export { MemoryStore } from './memory/memory-store';
export { ConversationStore } from './memory/conversation-store';
export { KnowledgeBase } from './memory/knowledge-base';
export { VectorStore } from './memory/vector-store';

// Model exports
export { BaseLLMProvider } from './models/llm-interface';
export { ClaudeProvider } from './models/claude-integration';
export { EmbeddingService } from './models/embedding-service';

// Tool exports
export { ToolRegistry } from './tools/tool-registry';
export { FinancialCalculator } from './tools/calculator';
export { DataAnalyzer } from './tools/data-analyzer';
export { DocumentProcessor } from './tools/document-processor';
export { ChartGenerator } from './tools/chart-generator';

// Workflow exports
export { AgentChain, createDealAnalysisChain, createLoanUnderwritingChain } from './workflows/agent-chains';
export { AutomationEngine, DEFAULT_RULES } from './workflows/automation-rules';

// Type exports
export * from './types';