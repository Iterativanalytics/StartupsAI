
import { UserType } from "../../../shared/schema";
import { BusinessAdvisorAgent } from "../agents/business-advisor";
import { DealAnalyzerAgent } from "../agents/deal-analyzer";
import { CreditAssessorAgent } from "../agents/credit-assessor";
import { ImpactEvaluatorAgent } from "../agents/impact-evaluator";
import { PartnershipFacilitatorAgent } from "../agents/partnership-facilitator";
import { PlatformOrchestratorAgent } from "../agents/platform-orchestrator";
import { CoFounderAgent } from "../agents/co-founder";
import { ContextManager } from "./context-manager";
import { MemoryStore } from "../memory/conversation-store";

export enum AgentType {
  BUSINESS_ADVISOR = 'business_advisor',
  DEAL_ANALYZER = 'deal_analyzer',
  CREDIT_ASSESSOR = 'credit_assessor',
  IMPACT_EVALUATOR = 'impact_evaluator',
  PARTNERSHIP_FACILITATOR = 'partnership_facilitator',
  PLATFORM_ORCHESTRATOR = 'platform_orchestrator',
  CO_FOUNDER = 'co_founder'
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
      [UserType.INVESTOR]: new DealAnalyzerAgent(this.config),
      [UserType.LENDER]: new CreditAssessorAgent(this.config),
      [UserType.GRANTOR]: new ImpactEvaluatorAgent(this.config),
      [UserType.PARTNER]: new PartnershipFacilitatorAgent(this.config),
      [UserType.TEAM_MEMBER]: new PlatformOrchestratorAgent(this.config),
      [UserType.ADMIN]: new PlatformOrchestratorAgent(this.config)
    };
    
    return agentMap[userType] || new PlatformOrchestratorAgent(this.config);
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
