/**
 * Proactive Automation Engine
 * 
 * Event-driven automation and proactive insights generation
 * - Event queue processing
 * - Automation rule evaluation
 * - Proactive insight generation
 * - Scheduled tasks
 * - Multi-agent coordination triggers
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { AgentType, getAgentDatabase } from './agent-database';
import { getAssessmentService } from './assessment-integration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AutomationRule {
  _id?: ObjectId;
  userId: number;
  ruleName: string;
  ruleDescription?: string;
  triggerType: 'event' | 'schedule' | 'threshold' | 'pattern' | 'manual';
  triggerConfig: {
    eventType?: string;
    schedule?: string; // cron expression
    threshold?: {
      metric: string;
      operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
      value: number;
    };
    pattern?: string;
  };
  conditions: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
    value: any;
  }>;
  actions: Array<{
    type: 'notify' | 'execute_agent' | 'create_insight' | 'update_data' | 'trigger_collaboration';
    parameters: Record<string, any>;
  }>;
  enabled: boolean;
  priority: number; // 1-10
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationExecution {
  _id?: ObjectId;
  ruleId: ObjectId;
  userId: number;
  triggerEvent: Record<string, any>;
  conditionsMet: boolean;
  actionsExecuted: Array<{
    type: string;
    status: 'success' | 'failed';
    result?: any;
    error?: string;
  }>;
  executionStatus: 'success' | 'partial_success' | 'failed';
  errorMessage?: string;
  executionTimeMs: number;
  createdAt: Date;
}

export interface EventQueueItem {
  _id?: ObjectId;
  userId: number;
  eventType: string;
  eventData: Record<string, any>;
  priority: number; // 1-10
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  scheduledFor: Date;
  processedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

// ============================================================================
// PROACTIVE AUTOMATION ENGINE
// ============================================================================

export class ProactiveAutomationEngine {
  private client: MongoClient;
  private db: Db;
  private rules: Collection<AutomationRule>;
  private executions: Collection<AutomationExecution>;
  private eventQueue: Collection<EventQueueItem>;
  private processing: boolean = false;
  private processingInterval?: NodeJS.Timeout;

  constructor(connectionString: string, databaseName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    
    this.rules = this.db.collection<AutomationRule>('automation_rules');
    this.executions = this.db.collection<AutomationExecution>('automation_executions');
    this.eventQueue = this.db.collection<EventQueueItem>('event_queue');
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.createIndexes();
    console.log('✅ Proactive Automation Engine connected to Azure MongoDB');
  }

  async disconnect(): Promise<void> {
    this.stopProcessing();
    await this.client.close();
  }

  // ============================================================================
  // AUTOMATION RULE MANAGEMENT
  // ============================================================================

  async createRule(rule: Omit<AutomationRule, '_id' | 'createdAt' | 'updatedAt' | 'executionCount'>): Promise<ObjectId> {
    const now = new Date();
    const result = await this.rules.insertOne({
      ...rule,
      executionCount: 0,
      createdAt: now,
      updatedAt: now
    });
    return result.insertedId;
  }

  async updateRule(ruleId: ObjectId, updates: Partial<AutomationRule>): Promise<void> {
    await this.rules.updateOne(
      { _id: ruleId },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
  }

  async deleteRule(ruleId: ObjectId): Promise<void> {
    await this.rules.deleteOne({ _id: ruleId });
  }

  async getUserRules(userId: number, enabled?: boolean): Promise<AutomationRule[]> {
    const query: any = { userId };
    if (enabled !== undefined) {
      query.enabled = enabled;
    }

    return await this.rules
      .find(query)
      .sort({ priority: -1, createdAt: -1 })
      .toArray();
  }

  async toggleRule(ruleId: ObjectId, enabled: boolean): Promise<void> {
    await this.rules.updateOne(
      { _id: ruleId },
      {
        $set: {
          enabled,
          updatedAt: new Date()
        }
      }
    );
  }

  // ============================================================================
  // EVENT QUEUE MANAGEMENT
  // ============================================================================

  async queueEvent(event: Omit<EventQueueItem, '_id' | 'createdAt' | 'status' | 'retryCount'>): Promise<ObjectId> {
    const result = await this.eventQueue.insertOne({
      ...event,
      status: 'pending',
      retryCount: 0,
      createdAt: new Date()
    });

    // Trigger immediate processing for high-priority events
    if (event.priority >= 8) {
      setImmediate(() => this.processNextEvent());
    }

    return result.insertedId;
  }

  async processNextEvent(): Promise<boolean> {
    const event = await this.eventQueue.findOneAndUpdate(
      {
        status: 'pending',
        scheduledFor: { $lte: new Date() },
        retryCount: { $lt: { $ifNull: ['$maxRetries', 3] } }
      },
      {
        $set: {
          status: 'processing',
          processedAt: new Date()
        }
      },
      {
        sort: { priority: -1, scheduledFor: 1 },
        returnDocument: 'after'
      }
    );

    if (!event) {
      return false;
    }

    try {
      await this.processEvent(event);
      
      await this.eventQueue.updateOne(
        { _id: event._id },
        {
          $set: {
            status: 'completed',
            processedAt: new Date()
          }
        }
      );

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.eventQueue.updateOne(
        { _id: event._id },
        {
          $set: {
            status: event.retryCount + 1 >= event.maxRetries ? 'failed' : 'pending',
            errorMessage,
            processedAt: new Date()
          },
          $inc: { retryCount: 1 }
        }
      );

      console.error(`❌ Event processing failed: ${errorMessage}`, event);
      return false;
    }
  }

  private async processEvent(event: EventQueueItem): Promise<void> {
    // Find matching automation rules
    const rules = await this.rules.find({
      userId: event.userId,
      enabled: true,
      'triggerConfig.eventType': event.eventType
    }).toArray();

    // Execute each matching rule
    for (const rule of rules) {
      await this.executeRule(rule, event.eventData);
    }
  }

  // ============================================================================
  // RULE EXECUTION
  // ============================================================================

  private async executeRule(rule: AutomationRule, eventData: Record<string, any>): Promise<void> {
    const startTime = Date.now();
    const actionsExecuted: AutomationExecution['actionsExecuted'] = [];

    try {
      // Evaluate conditions
      const conditionsMet = this.evaluateConditions(rule.conditions, eventData);

      if (!conditionsMet) {
        // Log execution but don't run actions
        await this.logExecution(rule, eventData, false, actionsExecuted, Date.now() - startTime);
        return;
      }

      // Execute actions
      for (const action of rule.actions) {
        try {
          const result = await this.executeAction(rule.userId, action, eventData);
          actionsExecuted.push({
            type: action.type,
            status: 'success',
            result
          });
        } catch (error) {
          actionsExecuted.push({
            type: action.type,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Update rule execution count
      await this.rules.updateOne(
        { _id: rule._id },
        {
          $inc: { executionCount: 1 },
          $set: { lastExecutedAt: new Date() }
        }
      );

      // Log execution
      await this.logExecution(rule, eventData, conditionsMet, actionsExecuted, Date.now() - startTime);

    } catch (error) {
      console.error(`❌ Rule execution failed:`, error);
      await this.logExecution(
        rule,
        eventData,
        false,
        actionsExecuted,
        Date.now() - startTime,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private evaluateConditions(
    conditions: AutomationRule['conditions'],
    data: Record<string, any>
  ): boolean {
    if (conditions.length === 0) {
      return true;
    }

    return conditions.every(condition => {
      const value = this.getNestedValue(data, condition.field);
      
      switch (condition.operator) {
        case 'eq':
          return value === condition.value;
        case 'ne':
          return value !== condition.value;
        case 'gt':
          return value > condition.value;
        case 'lt':
          return value < condition.value;
        case 'gte':
          return value >= condition.value;
        case 'lte':
          return value <= condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async executeAction(
    userId: number,
    action: AutomationRule['actions'][0],
    eventData: Record<string, any>
  ): Promise<any> {
    const agentDb = getAgentDatabase();

    switch (action.type) {
      case 'notify':
        // Create notification (would integrate with notification system)
        console.log(`📢 Notification for user ${userId}:`, action.parameters.message);
        return { notified: true };

      case 'create_insight':
        return await agentDb.createInsight({
          userId,
          agentType: action.parameters.agentType || 'platform_orchestrator',
          insightType: action.parameters.insightType || 'alert',
          title: action.parameters.title,
          description: action.parameters.description,
          priority: action.parameters.priority || 'medium',
          actionable: action.parameters.actionable || false,
          actionItems: action.parameters.actionItems || [],
          confidenceScore: action.parameters.confidenceScore || 0.7,
          impactScore: action.parameters.impactScore || 0.5,
          metadata: { source: 'automation', eventData }
        });

      case 'execute_agent':
        // Queue agent task
        return await this.queueAgentTask(
          userId,
          action.parameters.agentType,
          action.parameters.task,
          eventData
        );

      case 'trigger_collaboration':
        // Start collaboration session
        return await agentDb.startCollaboration({
          userId,
          primaryAgent: action.parameters.primaryAgent,
          participatingAgents: action.parameters.participatingAgents || [],
          collaborationType: action.parameters.collaborationType || 'delegation',
          taskDescription: action.parameters.taskDescription,
          taskStatus: 'active',
          coordinationStrategy: action.parameters.coordinationStrategy || 'sequential'
        });

      case 'update_data':
        // Update user data (would integrate with main database)
        console.log(`📝 Data update for user ${userId}:`, action.parameters);
        return { updated: true };

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async queueAgentTask(
    userId: number,
    agentType: AgentType,
    task: string,
    context: Record<string, any>
  ): Promise<any> {
    // This would integrate with the agent execution system
    console.log(`🤖 Queuing agent task for ${agentType}:`, task);
    return { taskQueued: true, agentType, task };
  }

  private async logExecution(
    rule: AutomationRule,
    eventData: Record<string, any>,
    conditionsMet: boolean,
    actionsExecuted: AutomationExecution['actionsExecuted'],
    executionTimeMs: number,
    errorMessage?: string
  ): Promise<void> {
    const executionStatus: AutomationExecution['executionStatus'] = 
      errorMessage ? 'failed' :
      actionsExecuted.some(a => a.status === 'failed') ? 'partial_success' :
      'success';

    await this.executions.insertOne({
      ruleId: rule._id!,
      userId: rule.userId,
      triggerEvent: eventData,
      conditionsMet,
      actionsExecuted,
      executionStatus,
      errorMessage,
      executionTimeMs,
      createdAt: new Date()
    });
  }

  // ============================================================================
  // PROACTIVE INSIGHTS GENERATION
  // ============================================================================

  async generateProactiveInsights(userId: number, agentType: AgentType): Promise<void> {
    const agentDb = getAgentDatabase();
    const assessmentService = getAssessmentService();

    // Get user context
    const [relationship, recentConversations, memories, assessment] = await Promise.all([
      agentDb.getRelationship(userId, agentType),
      agentDb.getRecentConversations(userId, agentType, 168), // Last week
      agentDb.getRelevantMemories(userId, agentType),
      assessmentService.getAssessmentProfile(userId)
    ]);

    // Generate insights based on patterns
    const insights: Array<{
      type: string;
      title: string;
      description: string;
      priority: string;
    }> = [];

    // Low engagement insight
    if (relationship && relationship.engagementScore < 0.3) {
      insights.push({
        type: 'pattern',
        title: 'Re-engagement Opportunity',
        description: 'I noticed we haven\'t connected much lately. Would you like to schedule a check-in?',
        priority: 'medium'
      });
    }

    // Goal progress insight
    const goalMemories = memories.filter(m => m.memoryType === 'milestone');
    if (goalMemories.length > 0) {
      insights.push({
        type: 'celebration',
        title: 'Goal Progress Update',
        description: `You\'ve achieved ${goalMemories.length} milestone(s) recently. Great progress!`,
        priority: 'low'
      });
    }

    // Create insights in database
    for (const insight of insights) {
      await agentDb.createInsight({
        userId,
        agentType,
        insightType: insight.type as any,
        title: insight.title,
        description: insight.description,
        priority: insight.priority as any,
        actionable: true,
        confidenceScore: 0.7,
        impactScore: 0.6
      });
    }
  }

  // ============================================================================
  // BACKGROUND PROCESSING
  // ============================================================================

  startProcessing(intervalMs: number = 5000): void {
    if (this.processing) {
      return;
    }

    this.processing = true;
    console.log('🔄 Started event queue processing');

    this.processingInterval = setInterval(async () => {
      try {
        let processed = true;
        while (processed && this.processing) {
          processed = await this.processNextEvent();
        }
      } catch (error) {
        console.error('❌ Error in event processing loop:', error);
      }
    }, intervalMs);
  }

  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
    this.processing = false;
    console.log('⏹️ Stopped event queue processing');
  }

  // ============================================================================
  // DEFAULT AUTOMATION RULES
  // ============================================================================

  async createDefaultRules(userId: number, userType: string): Promise<void> {
    const defaultRules = this.getDefaultRulesForUserType(userId, userType);
    
    for (const rule of defaultRules) {
      await this.createRule(rule);
    }

    console.log(`✅ Created ${defaultRules.length} default automation rules for user ${userId}`);
  }

  private getDefaultRulesForUserType(
    userId: number,
    userType: string
  ): Array<Omit<AutomationRule, '_id' | 'createdAt' | 'updatedAt' | 'executionCount'>> {
    const rules: Array<Omit<AutomationRule, '_id' | 'createdAt' | 'updatedAt' | 'executionCount'>> = [];

    if (userType === 'entrepreneur') {
      // Low runway alert
      rules.push({
        userId,
        ruleName: 'Low Runway Alert',
        ruleDescription: 'Alert when runway drops below 6 months',
        triggerType: 'event',
        triggerConfig: { eventType: 'financial_update' },
        conditions: [
          { field: 'runway_months', operator: 'lt', value: 6 }
        ],
        actions: [
          {
            type: 'create_insight',
            parameters: {
              agentType: 'co_founder',
              insightType: 'alert',
              title: 'Low Runway Alert',
              description: 'Your runway is below 6 months. Let\'s discuss fundraising strategy.',
              priority: 'high',
              actionable: true,
              actionItems: [
                { action: 'Review fundraising options', completed: false },
                { action: 'Update financial projections', completed: false }
              ]
            }
          }
        ],
        enabled: true,
        priority: 9
      });

      // Goal milestone celebration
      rules.push({
        userId,
        ruleName: 'Goal Milestone Celebration',
        ruleDescription: 'Celebrate when goals are achieved',
        triggerType: 'event',
        triggerConfig: { eventType: 'goal_completed' },
        conditions: [],
        actions: [
          {
            type: 'create_insight',
            parameters: {
              agentType: 'co_founder',
              insightType: 'celebration',
              title: 'Goal Achieved! 🎉',
              description: 'Congratulations on achieving your goal! Let\'s set the next milestone.',
              priority: 'medium',
              actionable: true
            }
          }
        ],
        enabled: true,
        priority: 5
      });
    }

    if (userType === 'investor') {
      // Deal flow alert
      rules.push({
        userId,
        ruleName: 'Deal Flow Alert',
        ruleDescription: 'Notify of new deals matching investment thesis',
        triggerType: 'event',
        triggerConfig: { eventType: 'new_deal' },
        conditions: [
          { field: 'thesis_match_score', operator: 'gte', value: 0.7 }
        ],
        actions: [
          {
            type: 'create_insight',
            parameters: {
              agentType: 'co_investor',
              insightType: 'opportunity',
              title: 'New Deal Match',
              description: 'A new deal matching your investment thesis is available for review.',
              priority: 'high',
              actionable: true
            }
          }
        ],
        enabled: true,
        priority: 8
      });
    }

    if (userType === 'partner') {
      // Startup match alert
      rules.push({
        userId,
        ruleName: 'Startup Match Alert',
        ruleDescription: 'Alert when startups match program criteria',
        triggerType: 'event',
        triggerConfig: { eventType: 'startup_application' },
        conditions: [
          { field: 'program_fit_score', operator: 'gte', value: 0.75 }
        ],
        actions: [
          {
            type: 'create_insight',
            parameters: {
              agentType: 'co_builder',
              insightType: 'opportunity',
              title: 'Strong Program Match',
              description: 'A startup with excellent program fit has applied.',
              priority: 'high',
              actionable: true
            }
          }
        ],
        enabled: true,
        priority: 8
      });
    }

    return rules;
  }

  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================

  private async createIndexes(): Promise<void> {
    await this.rules.createIndex({ userId: 1, enabled: 1 });
    await this.rules.createIndex({ 'triggerConfig.eventType': 1 });
    await this.rules.createIndex({ priority: -1 });

    await this.executions.createIndex({ ruleId: 1, createdAt: -1 });
    await this.executions.createIndex({ userId: 1, createdAt: -1 });

    await this.eventQueue.createIndex({ status: 1, priority: -1, scheduledFor: 1 });
    await this.eventQueue.createIndex({ userId: 1, eventType: 1 });

    console.log('✅ Automation engine indexes created');
  }

  async getExecutionHistory(
    ruleId: ObjectId,
    limit: number = 50
  ): Promise<AutomationExecution[]> {
    return await this.executions
      .find({ ruleId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async getExecutionStats(userId: number, days: number = 30): Promise<any> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const stats = await this.executions.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: cutoffDate }
        }
      },
      {
        $group: {
          _id: '$executionStatus',
          count: { $sum: 1 },
          avgExecutionTime: { $avg: '$executionTimeMs' }
        }
      }
    ]).toArray();

    return {
      totalExecutions: stats.reduce((sum, s) => sum + s.count, 0),
      successRate: stats.find(s => s._id === 'success')?.count || 0,
      failureRate: stats.find(s => s._id === 'failed')?.count || 0,
      avgExecutionTime: stats.reduce((sum, s) => sum + s.avgExecutionTime, 0) / stats.length || 0
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let automationEngineInstance: ProactiveAutomationEngine | null = null;

export function getAutomationEngine(): ProactiveAutomationEngine {
  if (!automationEngineInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || 'iterativ-db';

    if (!connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING environment variable is not set');
    }

    automationEngineInstance = new ProactiveAutomationEngine(connectionString, databaseName);
  }

  return automationEngineInstance;
}

export async function initializeAutomationEngine(): Promise<ProactiveAutomationEngine> {
  const engine = getAutomationEngine();
  await engine.connect();
  engine.startProcessing(); // Start background processing
  return engine;
}
