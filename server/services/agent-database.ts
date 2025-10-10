/**
 * Agent Database Service - Azure MongoDB Integration
 * 
 * Production database integration for Two-Tier Agentic System
 * - Conversation persistence and retrieval
 * - Long-term memory management
 * - Relationship tracking
 * - Proactive insights storage
 * - Agent collaboration coordination
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AgentConversation {
  _id?: ObjectId;
  userId: number;
  agentType: AgentType;
  sessionId: string;
  messageRole: 'user' | 'assistant' | 'system';
  messageContent: string;
  messageMetadata?: Record<string, any>;
  contextData?: Record<string, any>;
  createdAt: Date;
}

export interface AgentMemory {
  _id?: ObjectId;
  userId: number;
  agentType: AgentType;
  memoryType: 'fact' | 'preference' | 'decision' | 'pattern' | 'milestone' | 'insight';
  memoryKey: string;
  memoryValue: string;
  importanceScore: number; // 0-1
  confidenceScore: number; // 0-1
  accessCount: number;
  lastAccessedAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentRelationship {
  _id?: ObjectId;
  userId: number;
  agentType: AgentType;
  relationshipStage: 'building' | 'established' | 'strong' | 'trusted_partner';
  trustScore: number; // 0-1
  engagementScore: number; // 0-1
  satisfactionScore: number; // 0-1
  totalInteractions: number;
  lastInteractionAt?: Date;
  personalityProfile?: Record<string, any>;
  communicationPreferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentInsight {
  _id?: ObjectId;
  userId: number;
  agentType: AgentType;
  insightType: 'opportunity' | 'risk' | 'recommendation' | 'pattern' | 'alert' | 'celebration';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  actionItems?: Array<{ action: string; completed: boolean }>;
  status: 'new' | 'viewed' | 'acted' | 'dismissed';
  confidenceScore: number;
  impactScore: number;
  metadata?: Record<string, any>;
  viewedAt?: Date;
  actedAt?: Date;
  createdAt: Date;
}

export interface CollaborationSession {
  _id?: ObjectId;
  userId: number;
  primaryAgent: AgentType;
  participatingAgents: AgentType[];
  collaborationType: 'delegation' | 'consultation' | 'consensus' | 'handoff' | 'parallel';
  taskDescription: string;
  taskStatus: 'active' | 'completed' | 'failed' | 'cancelled';
  coordinationStrategy: string;
  results?: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
}

export interface AgentHandoff {
  _id?: ObjectId;
  collaborationSessionId: ObjectId;
  fromAgent: AgentType;
  toAgent: AgentType;
  handoffReason: string;
  contextTransferred: Record<string, any>;
  handoffQuality?: 'seamless' | 'smooth' | 'rough' | 'failed';
  userNotified: boolean;
  createdAt: Date;
}

export interface AgentTask {
  _id?: ObjectId;
  collaborationSessionId: ObjectId;
  assignedToAgent: AgentType;
  assignedByAgent: AgentType;
  taskType: string;
  taskDescription: string;
  taskPriority: 'low' | 'medium' | 'high' | 'urgent';
  taskStatus: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export type AgentType = 
  | 'co_founder' 
  | 'co_investor' 
  | 'co_builder'
  | 'business_advisor' 
  | 'investment_analyst' 
  | 'credit_analyst'
  | 'impact_analyst' 
  | 'program_manager' 
  | 'platform_orchestrator';

// ============================================================================
// AGENT DATABASE SERVICE
// ============================================================================

export class AgentDatabaseService {
  private client: MongoClient;
  private db: Db;
  private conversations: Collection<AgentConversation>;
  private memories: Collection<AgentMemory>;
  private relationships: Collection<AgentRelationship>;
  private insights: Collection<AgentInsight>;
  private collaborations: Collection<CollaborationSession>;
  private handoffs: Collection<AgentHandoff>;
  private tasks: Collection<AgentTask>;

  constructor(connectionString: string, databaseName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    
    // Initialize collections
    this.conversations = this.db.collection<AgentConversation>('agent_conversations');
    this.memories = this.db.collection<AgentMemory>('agent_memory');
    this.relationships = this.db.collection<AgentRelationship>('agent_relationships');
    this.insights = this.db.collection<AgentInsight>('agent_insights');
    this.collaborations = this.db.collection<CollaborationSession>('agent_collaboration_sessions');
    this.handoffs = this.db.collection<AgentHandoff>('agent_handoffs');
    this.tasks = this.db.collection<AgentTask>('agent_tasks');
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.createIndexes();
    console.log('✅ Agent Database Service connected to Azure MongoDB');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  // ============================================================================
  // CONVERSATION MANAGEMENT
  // ============================================================================

  async saveConversation(conversation: Omit<AgentConversation, '_id' | 'createdAt'>): Promise<ObjectId> {
    const result = await this.conversations.insertOne({
      ...conversation,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async getConversationHistory(
    userId: number,
    agentType: AgentType,
    sessionId?: string,
    limit: number = 50
  ): Promise<AgentConversation[]> {
    const query: any = { userId, agentType };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    return await this.conversations
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async getRecentConversations(
    userId: number,
    agentType: AgentType,
    hours: number = 24
  ): Promise<AgentConversation[]> {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await this.conversations
      .find({
        userId,
        agentType,
        createdAt: { $gte: cutoffDate }
      })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // ============================================================================
  // MEMORY MANAGEMENT
  // ============================================================================

  async saveMemory(memory: Omit<AgentMemory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ObjectId> {
    const now = new Date();
    
    // Upsert based on userId, agentType, and memoryKey
    const result = await this.memories.findOneAndUpdate(
      {
        userId: memory.userId,
        agentType: memory.agentType,
        memoryKey: memory.memoryKey
      },
      {
        $set: {
          ...memory,
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now,
          accessCount: 0
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    return result._id as ObjectId;
  }

  async getMemory(
    userId: number,
    agentType: AgentType,
    memoryKey: string
  ): Promise<AgentMemory | null> {
    const memory = await this.memories.findOneAndUpdate(
      { userId, agentType, memoryKey },
      {
        $inc: { accessCount: 1 },
        $set: { lastAccessedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    return memory;
  }

  async getRelevantMemories(
    userId: number,
    agentType: AgentType,
    memoryTypes?: string[],
    minImportance: number = 0.3,
    limit: number = 20
  ): Promise<AgentMemory[]> {
    const query: any = {
      userId,
      agentType,
      importanceScore: { $gte: minImportance },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    if (memoryTypes && memoryTypes.length > 0) {
      query.memoryType = { $in: memoryTypes };
    }

    return await this.memories
      .find(query)
      .sort({ importanceScore: -1, lastAccessedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async updateMemoryImportance(
    memoryId: ObjectId,
    importanceScore: number
  ): Promise<void> {
    await this.memories.updateOne(
      { _id: memoryId },
      {
        $set: {
          importanceScore: Math.max(0, Math.min(1, importanceScore)),
          updatedAt: new Date()
        }
      }
    );
  }

  async deleteExpiredMemories(): Promise<number> {
    const result = await this.memories.deleteMany({
      expiresAt: { $lte: new Date() }
    });
    return result.deletedCount;
  }

  // ============================================================================
  // RELATIONSHIP MANAGEMENT
  // ============================================================================

  async updateRelationship(
    userId: number,
    agentType: AgentType,
    updates: Partial<Omit<AgentRelationship, '_id' | 'userId' | 'agentType' | 'createdAt'>>
  ): Promise<void> {
    const now = new Date();

    await this.relationships.findOneAndUpdate(
      { userId, agentType },
      {
        $set: {
          ...updates,
          updatedAt: now
        },
        $setOnInsert: {
          userId,
          agentType,
          relationshipStage: 'building',
          trustScore: 0.5,
          engagementScore: 0.5,
          satisfactionScore: 0.5,
          totalInteractions: 0,
          createdAt: now
        }
      },
      { upsert: true }
    );
  }

  async incrementInteraction(
    userId: number,
    agentType: AgentType,
    satisfactionDelta: number = 0
  ): Promise<void> {
    const now = new Date();
    
    await this.relationships.findOneAndUpdate(
      { userId, agentType },
      {
        $inc: {
          totalInteractions: 1,
          satisfactionScore: satisfactionDelta * 0.1,
          engagementScore: 0.01
        },
        $set: {
          lastInteractionAt: now,
          updatedAt: now
        },
        $setOnInsert: {
          userId,
          agentType,
          relationshipStage: 'building',
          trustScore: 0.5,
          engagementScore: 0.5,
          satisfactionScore: 0.5,
          totalInteractions: 0,
          createdAt: now
        }
      },
      { upsert: true }
    );

    // Update relationship stage based on interactions
    const relationship = await this.getRelationship(userId, agentType);
    if (relationship) {
      let newStage = relationship.relationshipStage;
      
      if (relationship.totalInteractions >= 50 && relationship.trustScore >= 0.8) {
        newStage = 'trusted_partner';
      } else if (relationship.totalInteractions >= 25 && relationship.trustScore >= 0.7) {
        newStage = 'strong';
      } else if (relationship.totalInteractions >= 10 && relationship.trustScore >= 0.6) {
        newStage = 'established';
      }

      if (newStage !== relationship.relationshipStage) {
        await this.relationships.updateOne(
          { userId, agentType },
          { $set: { relationshipStage: newStage, updatedAt: now } }
        );
      }
    }
  }

  async getRelationship(
    userId: number,
    agentType: AgentType
  ): Promise<AgentRelationship | null> {
    return await this.relationships.findOne({ userId, agentType });
  }

  async getAllUserRelationships(userId: number): Promise<AgentRelationship[]> {
    return await this.relationships.find({ userId }).toArray();
  }

  // ============================================================================
  // INSIGHTS MANAGEMENT
  // ============================================================================

  async createInsight(
    insight: Omit<AgentInsight, '_id' | 'createdAt' | 'status'>
  ): Promise<ObjectId> {
    const result = await this.insights.insertOne({
      ...insight,
      status: 'new',
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async getInsights(
    userId: number,
    agentType?: AgentType,
    status?: string,
    priority?: string,
    limit: number = 50
  ): Promise<AgentInsight[]> {
    const query: any = { userId };
    if (agentType) query.agentType = agentType;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    return await this.insights
      .find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async updateInsightStatus(
    insightId: ObjectId,
    status: 'viewed' | 'acted' | 'dismissed'
  ): Promise<void> {
    const update: any = { status };
    
    if (status === 'viewed') {
      update.viewedAt = new Date();
    } else if (status === 'acted') {
      update.actedAt = new Date();
    }

    await this.insights.updateOne(
      { _id: insightId },
      { $set: update }
    );
  }

  async getUnreadInsightsCount(userId: number): Promise<number> {
    return await this.insights.countDocuments({
      userId,
      status: 'new'
    });
  }

  // ============================================================================
  // COLLABORATION MANAGEMENT
  // ============================================================================

  async startCollaboration(
    collaboration: Omit<CollaborationSession, '_id' | 'startedAt'>
  ): Promise<ObjectId> {
    const result = await this.collaborations.insertOne({
      ...collaboration,
      startedAt: new Date()
    });
    return result.insertedId;
  }

  async updateCollaborationStatus(
    collaborationId: ObjectId,
    status: 'completed' | 'failed' | 'cancelled',
    results?: Record<string, any>
  ): Promise<void> {
    await this.collaborations.updateOne(
      { _id: collaborationId },
      {
        $set: {
          taskStatus: status,
          completedAt: new Date(),
          ...(results && { results })
        }
      }
    );
  }

  async getActiveCollaborations(userId: number): Promise<CollaborationSession[]> {
    return await this.collaborations
      .find({
        userId,
        taskStatus: 'active'
      })
      .toArray();
  }

  // ============================================================================
  // HANDOFF MANAGEMENT
  // ============================================================================

  async createHandoff(
    handoff: Omit<AgentHandoff, '_id' | 'createdAt'>
  ): Promise<ObjectId> {
    const result = await this.handoffs.insertOne({
      ...handoff,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async getHandoffHistory(
    collaborationSessionId: ObjectId
  ): Promise<AgentHandoff[]> {
    return await this.handoffs
      .find({ collaborationSessionId })
      .sort({ createdAt: 1 })
      .toArray();
  }

  // ============================================================================
  // TASK MANAGEMENT
  // ============================================================================

  async createTask(
    task: Omit<AgentTask, '_id' | 'createdAt'>
  ): Promise<ObjectId> {
    const result = await this.tasks.insertOne({
      ...task,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async updateTaskStatus(
    taskId: ObjectId,
    status: 'in_progress' | 'completed' | 'failed' | 'cancelled',
    outputData?: Record<string, any>,
    errorMessage?: string
  ): Promise<void> {
    const update: any = { taskStatus: status };
    
    if (status === 'in_progress' && !outputData) {
      update.startedAt = new Date();
    } else if (status === 'completed' || status === 'failed') {
      update.completedAt = new Date();
    }
    
    if (outputData) update.outputData = outputData;
    if (errorMessage) update.errorMessage = errorMessage;

    await this.tasks.updateOne(
      { _id: taskId },
      { $set: update }
    );
  }

  async getCollaborationTasks(
    collaborationSessionId: ObjectId
  ): Promise<AgentTask[]> {
    return await this.tasks
      .find({ collaborationSessionId })
      .sort({ createdAt: 1 })
      .toArray();
  }

  async getPendingTasks(agentType: AgentType): Promise<AgentTask[]> {
    return await this.tasks
      .find({
        assignedToAgent: agentType,
        taskStatus: 'pending'
      })
      .sort({ taskPriority: -1, createdAt: 1 })
      .toArray();
  }

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================

  async getUserEngagementStats(userId: number, days: number = 30): Promise<any> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalInteractions,
      activeAgents,
      insightsGenerated,
      insightsActed,
      relationships
    ] = await Promise.all([
      this.conversations.countDocuments({
        userId,
        createdAt: { $gte: cutoffDate }
      }),
      this.conversations.distinct('agentType', {
        userId,
        createdAt: { $gte: cutoffDate }
      }),
      this.insights.countDocuments({
        userId,
        createdAt: { $gte: cutoffDate }
      }),
      this.insights.countDocuments({
        userId,
        status: 'acted',
        actedAt: { $gte: cutoffDate }
      }),
      this.getAllUserRelationships(userId)
    ]);

    return {
      totalInteractions,
      activeAgents: activeAgents.length,
      insightsGenerated,
      insightsActed,
      insightActionRate: insightsGenerated > 0 ? insightsActed / insightsGenerated : 0,
      relationships: relationships.map(r => ({
        agentType: r.agentType,
        stage: r.relationshipStage,
        trustScore: r.trustScore,
        engagementScore: r.engagementScore,
        satisfactionScore: r.satisfactionScore
      }))
    };
  }

  async getAgentPerformanceStats(agentType: AgentType, days: number = 30): Promise<any> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalInteractions,
      uniqueUsers,
      insightsGenerated,
      avgSatisfaction,
      collaborations
    ] = await Promise.all([
      this.conversations.countDocuments({
        agentType,
        createdAt: { $gte: cutoffDate }
      }),
      this.conversations.distinct('userId', {
        agentType,
        createdAt: { $gte: cutoffDate }
      }),
      this.insights.countDocuments({
        agentType,
        createdAt: { $gte: cutoffDate }
      }),
      this.relationships.aggregate([
        { $match: { agentType } },
        { $group: { _id: null, avgSatisfaction: { $avg: '$satisfactionScore' } } }
      ]).toArray(),
      this.collaborations.countDocuments({
        $or: [
          { primaryAgent: agentType },
          { participatingAgents: agentType }
        ],
        startedAt: { $gte: cutoffDate }
      })
    ]);

    return {
      totalInteractions,
      uniqueUsers: uniqueUsers.length,
      insightsGenerated,
      avgSatisfaction: avgSatisfaction[0]?.avgSatisfaction || 0,
      collaborations
    };
  }

  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================

  private async createIndexes(): Promise<void> {
    // Conversation indexes
    await this.conversations.createIndex({ userId: 1, agentType: 1, createdAt: -1 });
    await this.conversations.createIndex({ sessionId: 1 });
    await this.conversations.createIndex({ createdAt: -1 });

    // Memory indexes
    await this.memories.createIndex({ userId: 1, agentType: 1, memoryKey: 1 }, { unique: true });
    await this.memories.createIndex({ userId: 1, agentType: 1, importanceScore: -1 });
    await this.memories.createIndex({ expiresAt: 1 }, { sparse: true });

    // Relationship indexes
    await this.relationships.createIndex({ userId: 1, agentType: 1 }, { unique: true });
    await this.relationships.createIndex({ relationshipStage: 1 });

    // Insight indexes
    await this.insights.createIndex({ userId: 1, status: 1, createdAt: -1 });
    await this.insights.createIndex({ agentType: 1, priority: -1 });

    // Collaboration indexes
    await this.collaborations.createIndex({ userId: 1, taskStatus: 1 });
    await this.collaborations.createIndex({ primaryAgent: 1 });

    // Task indexes
    await this.tasks.createIndex({ collaborationSessionId: 1 });
    await this.tasks.createIndex({ assignedToAgent: 1, taskStatus: 1 });

    console.log('✅ Database indexes created');
  }

  async cleanupOldData(daysToKeep: number = 90): Promise<void> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const results = await Promise.all([
      this.conversations.deleteMany({ createdAt: { $lt: cutoffDate } }),
      this.insights.deleteMany({
        createdAt: { $lt: cutoffDate },
        status: { $in: ['viewed', 'dismissed'] }
      }),
      this.deleteExpiredMemories()
    ]);

    console.log(`✅ Cleanup complete: ${results.map(r => r.deletedCount).reduce((a, b) => a + b, 0)} records deleted`);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let agentDatabaseInstance: AgentDatabaseService | null = null;

export function getAgentDatabase(): AgentDatabaseService {
  if (!agentDatabaseInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || 'iterativ-db';

    if (!connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING environment variable is not set');
    }

    agentDatabaseInstance = new AgentDatabaseService(connectionString, databaseName);
  }

  return agentDatabaseInstance;
}

export async function initializeAgentDatabase(): Promise<AgentDatabaseService> {
  const db = getAgentDatabase();
  await db.connect();
  return db;
}
