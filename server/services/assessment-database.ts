/**
 * Assessment Database Service
 * 
 * Manages assessment data persistence in Azure MongoDB
 * - Assessment sessions and responses
 * - Completed assessment profiles
 * - Assessment history and evolution
 * - Integration with agent personality adaptation
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { AssessmentResponse } from '../../packages/assessment-engine/src/models/common.model';
import { RIASECProfile } from '../../packages/assessment-engine/src/models/riasec.model';
import { CompositeProfile } from '../../packages/assessment-engine/src/models/composite.model';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AssessmentSession {
  _id?: ObjectId;
  userId: number;
  sessionId: string;
  assessmentType: 'riasec' | 'big_five' | 'ai_readiness' | 'design_thinking' | 'composite';
  status: 'in_progress' | 'completed' | 'abandoned';
  responses: AssessmentResponse[];
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercentage: number;
  startedAt: Date;
  completedAt?: Date;
  lastActivityAt: Date;
  metadata?: Record<string, any>;
}

export interface CompletedAssessment {
  _id?: ObjectId;
  userId: number;
  sessionId: string;
  assessmentType: string;
  responses: AssessmentResponse[];
  results: any; // RIASECProfile, BigFiveProfile, etc.
  compositeProfile?: CompositeProfile;
  completedAt: Date;
  expiresAt?: Date;
  version: string;
  metadata?: Record<string, any>;
}

export interface AssessmentHistory {
  _id?: ObjectId;
  userId: number;
  assessmentType: string;
  assessments: Array<{
    completedAt: Date;
    results: any;
    version: string;
  }>;
  latestAssessmentId: ObjectId;
  totalAssessments: number;
  firstAssessmentAt: Date;
  lastAssessmentAt: Date;
}

// ============================================================================
// ASSESSMENT DATABASE SERVICE
// ============================================================================

export class AssessmentDatabaseService {
  private client: MongoClient;
  private db: Db;
  private sessions: Collection<AssessmentSession>;
  private completedAssessments: Collection<CompletedAssessment>;
  private assessmentHistory: Collection<AssessmentHistory>;

  constructor(connectionString: string, databaseName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    
    this.sessions = this.db.collection<AssessmentSession>('assessment_sessions');
    this.completedAssessments = this.db.collection<CompletedAssessment>('completed_assessments');
    this.assessmentHistory = this.db.collection<AssessmentHistory>('assessment_history');
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.createIndexes();
    console.log('✅ Assessment Database Service connected to Azure MongoDB');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  async createSession(
    userId: number,
    assessmentType: string,
    totalQuestions: number
  ): Promise<AssessmentSession> {
    const session: Omit<AssessmentSession, '_id'> = {
      userId,
      sessionId: this.generateSessionId(),
      assessmentType: assessmentType as any,
      status: 'in_progress',
      responses: [],
      currentQuestionIndex: 0,
      totalQuestions,
      progressPercentage: 0,
      startedAt: new Date(),
      lastActivityAt: new Date()
    };

    const result = await this.sessions.insertOne(session as AssessmentSession);
    
    return {
      ...session,
      _id: result.insertedId
    } as AssessmentSession;
  }

  async getSession(sessionId: string): Promise<AssessmentSession | null> {
    return await this.sessions.findOne({ sessionId });
  }

  async getUserActiveSessions(userId: number): Promise<AssessmentSession[]> {
    return await this.sessions
      .find({
        userId,
        status: 'in_progress'
      })
      .sort({ lastActivityAt: -1 })
      .toArray();
  }

  async updateSession(
    sessionId: string,
    responses: AssessmentResponse[],
    currentQuestionIndex: number
  ): Promise<void> {
    const progressPercentage = await this.calculateProgress(sessionId, responses.length);

    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          responses,
          currentQuestionIndex,
          progressPercentage,
          lastActivityAt: new Date()
        }
      }
    );
  }

  async saveResponse(
    sessionId: string,
    response: AssessmentResponse
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const responses = [...session.responses, response];
    const currentQuestionIndex = session.currentQuestionIndex + 1;
    const progressPercentage = (responses.length / session.totalQuestions) * 100;

    await this.sessions.updateOne(
      { sessionId },
      {
        $push: { responses: response },
        $set: {
          currentQuestionIndex,
          progressPercentage,
          lastActivityAt: new Date()
        }
      }
    );
  }

  async completeSession(
    sessionId: string,
    results: any,
    compositeProfile?: CompositeProfile
  ): Promise<ObjectId> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Mark session as completed
    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          lastActivityAt: new Date()
        }
      }
    );

    // Save completed assessment
    const completedAssessment: Omit<CompletedAssessment, '_id'> = {
      userId: session.userId,
      sessionId,
      assessmentType: session.assessmentType,
      responses: session.responses,
      results,
      compositeProfile,
      completedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      version: '1.0',
      metadata: session.metadata
    };

    const result = await this.completedAssessments.insertOne(completedAssessment as CompletedAssessment);

    // Update assessment history
    await this.updateAssessmentHistory(
      session.userId,
      session.assessmentType,
      result.insertedId,
      results
    );

    return result.insertedId;
  }

  async abandonSession(sessionId: string): Promise<void> {
    await this.sessions.updateOne(
      { sessionId },
      {
        $set: {
          status: 'abandoned',
          lastActivityAt: new Date()
        }
      }
    );
  }

  // ============================================================================
  // ASSESSMENT RETRIEVAL
  // ============================================================================

  async getLatestAssessment(
    userId: number,
    assessmentType: string
  ): Promise<CompletedAssessment | null> {
    return await this.completedAssessments.findOne(
      {
        userId,
        assessmentType,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );
  }

  async getAllUserAssessments(userId: number): Promise<CompletedAssessment[]> {
    return await this.completedAssessments
      .find({
        userId,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      })
      .sort({ completedAt: -1 })
      .toArray();
  }

  async getAssessmentById(assessmentId: ObjectId): Promise<CompletedAssessment | null> {
    return await this.completedAssessments.findOne({ _id: assessmentId });
  }

  async getUserCompositeProfile(userId: number): Promise<CompositeProfile | null> {
    const assessment = await this.completedAssessments.findOne(
      {
        userId,
        compositeProfile: { $exists: true },
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );

    return assessment?.compositeProfile || null;
  }

  // ============================================================================
  // ASSESSMENT HISTORY
  // ============================================================================

  private async updateAssessmentHistory(
    userId: number,
    assessmentType: string,
    assessmentId: ObjectId,
    results: any
  ): Promise<void> {
    const now = new Date();

    await this.assessmentHistory.findOneAndUpdate(
      { userId, assessmentType },
      {
        $push: {
          assessments: {
            completedAt: now,
            results,
            version: '1.0'
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

  async getAssessmentHistory(
    userId: number,
    assessmentType?: string
  ): Promise<AssessmentHistory[]> {
    const query: any = { userId };
    if (assessmentType) {
      query.assessmentType = assessmentType;
    }

    return await this.assessmentHistory.find(query).toArray();
  }

  async getAssessmentEvolution(
    userId: number,
    assessmentType: string
  ): Promise<any> {
    const history = await this.assessmentHistory.findOne({ userId, assessmentType });
    
    if (!history || history.assessments.length < 2) {
      return null;
    }

    // Calculate changes between assessments
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

  private calculateChanges(oldResults: any, newResults: any): any[] {
    const changes: any[] = [];
    
    // This would compare specific metrics based on assessment type
    // For now, return basic structure
    
    return changes;
  }

  private determineTrajectory(assessments: any[]): 'improving' | 'stable' | 'declining' {
    if (assessments.length < 2) return 'stable';
    
    // Simple trajectory calculation
    // In production, this would analyze specific metrics
    return 'stable';
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  async getAssessmentStats(userId: number): Promise<any> {
    const [sessions, completed, history] = await Promise.all([
      this.sessions.countDocuments({ userId }),
      this.completedAssessments.countDocuments({ userId }),
      this.assessmentHistory.find({ userId }).toArray()
    ]);

    return {
      totalSessions: sessions,
      completedAssessments: completed,
      inProgressSessions: sessions - completed,
      assessmentTypes: history.map(h => h.assessmentType),
      lastAssessmentDate: history.length > 0 
        ? Math.max(...history.map(h => h.lastAssessmentAt.getTime()))
        : null
    };
  }

  async getPlatformAssessmentStats(): Promise<any> {
    const stats = await this.completedAssessments.aggregate([
      {
        $group: {
          _id: '$assessmentType',
          count: { $sum: 1 },
          avgCompletionTime: { $avg: '$metadata.duration' }
        }
      }
    ]).toArray();

    return {
      totalAssessments: stats.reduce((sum, s) => sum + s.count, 0),
      byType: stats.map(s => ({
        type: s._id,
        count: s.count,
        avgCompletionTime: Math.round(s.avgCompletionTime || 0)
      }))
    };
  }

  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================

  private async createIndexes(): Promise<void> {
    // Session indexes
    await this.sessions.createIndex({ userId: 1, status: 1 });
    await this.sessions.createIndex({ sessionId: 1 }, { unique: true });
    await this.sessions.createIndex({ lastActivityAt: -1 });

    // Completed assessment indexes
    await this.completedAssessments.createIndex({ userId: 1, assessmentType: 1, completedAt: -1 });
    await this.completedAssessments.createIndex({ sessionId: 1 });
    await this.completedAssessments.createIndex({ expiresAt: 1 }, { sparse: true });

    // History indexes
    await this.assessmentHistory.createIndex({ userId: 1, assessmentType: 1 }, { unique: true });

    console.log('✅ Assessment database indexes created');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateProgress(sessionId: string, responseCount: number): Promise<number> {
    const session = await this.getSession(sessionId);
    if (!session) return 0;
    
    return (responseCount / session.totalQuestions) * 100;
  }

  async cleanupAbandonedSessions(daysOld: number = 7): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await this.sessions.deleteMany({
      status: 'in_progress',
      lastActivityAt: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let assessmentDbInstance: AssessmentDatabaseService | null = null;

export function getAssessmentDatabase(): AssessmentDatabaseService {
  if (!assessmentDbInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || 'iterativ-db';

    if (!connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING environment variable is not set');
    }

    assessmentDbInstance = new AssessmentDatabaseService(connectionString, databaseName);
  }

  return assessmentDbInstance;
}

export async function initializeAssessmentDatabase(): Promise<AssessmentDatabaseService> {
  const db = getAssessmentDatabase();
  await db.connect();
  return db;
}
