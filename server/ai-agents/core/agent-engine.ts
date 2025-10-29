
import { UserType } from "../../../shared/schema";
import { BusinessAdvisorAgent } from "../agents/business-advisor";
import { InvestmentAnalystAgent } from "../agents/deal-analyzer";
import { CreditAnalystAgent } from "../agents/credit-assessor";
import { ImpactAnalystAgent } from "../agents/impact-evaluator";
import { ProgramAnalystAgent } from "../agents/partnership-facilitator";
import { BusinessAnalystAgent } from "../agents/platform-orchestrator";
import { CoFounderAgent } from "../agents/co-founder";
import { ContextManager } from "./context-manager";
import { MemoryStore } from "../memory/conversation-store";

export enum AgentType {
  // Specialized Functional Agents (Concept Document Standardized)
  BUSINESS_ADVISOR = 'business_advisor',        // Agent-CBA
  INVESTMENT_ANALYST = 'investment_analyst',    // Agent-CFA
  CREDIT_ANALYST = 'credit_analyst',            // Agent-CRA
  IMPACT_ANALYST = 'impact_analyst',            // Agent-CIA
  PROGRAM_ANALYST = 'program_analyst',          // Agent-PMA
  BUSINESS_ANALYST = 'business_analyst',        // Agent-PBA (Platform Orchestrator + Business Analysis)
  CO_FOUNDER = 'co_founder',
  
  // Legacy aliases for backward compatibility
  DEAL_ANALYZER = 'deal_analyzer',              // Legacy: Use INVESTMENT_ANALYST
  CREDIT_ASSESSOR = 'credit_assessor',          // Legacy: Use CREDIT_ANALYST
  IMPACT_EVALUATOR = 'impact_evaluator',        // Legacy: Use IMPACT_ANALYST
  PARTNERSHIP_FACILITATOR = 'partnership_facilitator', // Legacy: Use PROGRAM_ANALYST
  PLATFORM_ORCHESTRATOR = 'platform_orchestrator' // Legacy: Use BUSINESS_ANALYST
}

export interface AgentCapabilities {
  naturalLanguageProcessing: boolean;
  documentAnalysis: boolean;
  predictiveModeling: boolean;
  automatedWorkflows: boolean;
  realTimeRecommendations: boolean;
  multiUserCoordination: boolean;
}

export interface AgentContext {
  userId: string;
  userType: UserType;
  currentTask: string;
  conversationHistory: Message[];
  relevantData: any;
  permissions: string[];
}

export interface AgentRequest {
  userId: string;
  userType: UserType;
  message: string;
  taskType: string;
  context?: any;
  streaming?: boolean;
}

export interface AgentResponse {
  content: string;
  actions?: any[];
  suggestions?: string[];
  insights?: any[];
  confidence?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AgentConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  azureEndpoint?: string;
  azureDeployment?: string;
  useAzure?: boolean;
}

export class AgentEngine {
  private contextManager: ContextManager;
  private memoryStore: MemoryStore;
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.contextManager = new ContextManager();
    this.memoryStore = new MemoryStore();
  }
  
  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    // Build context from user data, conversation history, and knowledge base
    const context = await this.contextManager.buildContext(request);
    
    // Select appropriate agent based on user type and task
    const agent = this.selectAgent(request.userType, request.taskType);
    
    // Execute agent with tools and memory
    const response = await agent.execute(context, {
      tools: this.getAvailableTools(request.userType),
      memory: await this.memoryStore.getRelevantMemory(request.userId),
      streaming: request.streaming
    });
    
    // Store interaction for learning
    await this.memoryStore.storeInteraction(request, response);
    
    return response;
  }
  
  private selectAgent(userType: UserType, taskType: string): any {
    // Check if explicitly requesting Co-Founder Agent
    if (taskType.includes('co_founder') || taskType.includes('cofounder')) {
      return new CoFounderAgent(this.config);
    }
    
    const agentMap = {
      [UserType.ENTREPRENEUR]: new BusinessAdvisorAgent(this.config),
      [UserType.INVESTOR]: new InvestmentAnalystAgent(this.config),
      [UserType.LENDER]: new CreditAnalystAgent(this.config),
      [UserType.GRANTOR]: new ImpactAnalystAgent(this.config),
      [UserType.PARTNER]: new ProgramAnalystAgent(this.config),
      [UserType.TEAM_MEMBER]: new BusinessAnalystAgent(this.config),
      [UserType.ADMIN]: new BusinessAnalystAgent(this.config)
    };
    
    return agentMap[userType] || new BusinessAnalystAgent(this.config);
  }
  
  private getAvailableTools(userType: UserType): string[] {
    const toolMap = {
      [UserType.ENTREPRENEUR]: ['financial_calculator', 'market_analyzer', 'business_planner'],
      [UserType.INVESTOR]: ['valuation_engine', 'risk_analyzer', 'portfolio_optimizer'],
      [UserType.LENDER]: ['credit_scorer', 'risk_modeler', 'underwriter'],
      [UserType.GRANTOR]: ['impact_scorer', 'compliance_checker', 'outcome_predictor'],
      [UserType.PARTNER]: ['matcher', 'program_optimizer', 'resource_allocator'],
      [UserType.TEAM_MEMBER]: ['task_manager', 'document_processor', 'collaboration_tools'],
      [UserType.ADMIN]: ['platform_analytics', 'user_manager', 'system_monitor']
    };
    
    return toolMap[userType] || [];
  }
}
