import { Pool } from 'pg';

/**
 * Database Service for Design Thinking System
 * 
 * Handles all database operations for the enhanced DT system:
 * - Workflow management
 * - Canvas operations
 * - Analytics data
 * - Session management
 */
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  // Workflow Management
  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    const query = 'SELECT * FROM dt_workflows WHERE id = $1';
    const result = await this.pool.query(query, [workflowId]);
    return result.rows[0] || null;
  }

  async createWorkflow(workflowData: any): Promise<Workflow> {
    const query = `
      INSERT INTO dt_workflows (id, user_id, business_plan_id, name, description, current_phase, status, ai_facilitation_enabled, collaboration_mode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      workflowData.id,
      workflowData.userId,
      workflowData.businessPlanId,
      workflowData.name,
      workflowData.description,
      workflowData.currentPhase,
      workflowData.status,
      workflowData.aiFacilitationEnabled,
      workflowData.collaborationMode
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateWorkflow(workflowId: string, updates: any): Promise<Workflow> {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE dt_workflows SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [workflowId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteWorkflow(workflowId: string): Promise<void> {
    const query = 'DELETE FROM dt_workflows WHERE id = $1';
    await this.pool.query(query, [workflowId]);
  }

  // Canvas Operations
  async getCanvas(canvasId: string): Promise<Canvas | null> {
    const query = 'SELECT * FROM collaborative_canvases WHERE id = $1';
    const result = await this.pool.query(query, [canvasId]);
    return result.rows[0] || null;
  }

  async createCanvas(canvas: Canvas): Promise<void> {
    const query = `
      INSERT INTO collaborative_canvases (id, workflow_id, canvas_type, elements, version, last_modified_by, last_modified_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      canvas.id,
      canvas.workflowId,
      canvas.canvasType,
      JSON.stringify(canvas.elements),
      canvas.version,
      canvas.lastModifiedBy,
      canvas.lastModifiedAt,
      canvas.createdAt
    ];
    await this.pool.query(query, values);
  }

  async updateCanvas(canvasId: string, updates: any): Promise<Canvas> {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE collaborative_canvases SET ${setClause}, last_modified_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [canvasId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteCanvas(canvasId: string): Promise<void> {
    const query = 'DELETE FROM collaborative_canvases WHERE id = $1';
    await this.pool.query(query, [canvasId]);
  }

  async addCanvasElement(canvasId: string, element: CanvasElement): Promise<void> {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = elements || $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, JSON.stringify([element])]);
  }

  async updateCanvasElement(canvasId: string, elementId: string, updates: any): Promise<void> {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = jsonb_set(elements, $2, $3), version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, `{${elementId}}`, JSON.stringify(updates)]);
  }

  async removeCanvasElement(canvasId: string, elementId: string): Promise<void> {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = elements - $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, elementId]);
  }

  async applyCanvasClustering(canvasId: string, clusters: Cluster[]): Promise<void> {
    const query = `
      UPDATE collaborative_canvases 
      SET elements = $2, version = version + 1, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [canvasId, JSON.stringify(clusters)]);
  }

  // Analytics Operations
  async getWorkflowAnalytics(workflowId: string): Promise<AnalyticsData> {
    const query = 'SELECT * FROM dt_effectiveness_metrics WHERE workflow_id = $1';
    const result = await this.pool.query(query, [workflowId]);
    return result.rows;
  }

  async saveAnalytics(workflowId: string, analytics: any): Promise<void> {
    const query = `
      INSERT INTO dt_effectiveness_metrics (workflow_id, metric_type, value, dimension, measurement_date, context)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      workflowId,
      analytics.metricType,
      analytics.value,
      analytics.dimension,
      new Date(),
      JSON.stringify(analytics.context)
    ];
    await this.pool.query(query, values);
  }

  // Session Management
  async createSession(session: Session): Promise<void> {
    const query = `
      INSERT INTO dt_sessions (id, workflow_id, session_type, facilitator_id, participants, scheduled_at, duration_minutes, status, recording_url, transcription, ai_analysis)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    const values = [
      session.id,
      session.workflowId,
      session.sessionType,
      session.facilitatorId,
      JSON.stringify(session.participants),
      session.scheduledAt,
      session.durationMinutes,
      session.status,
      session.recordingUrl,
      session.transcription,
      JSON.stringify(session.aiAnalysis)
    ];
    await this.pool.query(query, values);
  }

  async updateSession(sessionId: string, updates: any): Promise<Session> {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE dt_sessions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const values = [sessionId, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const query = 'SELECT * FROM dt_sessions WHERE id = $1';
    const result = await this.pool.query(query, [sessionId]);
    return result.rows[0] || null;
  }

  // AI Facilitation Logs
  async logFacilitation(sessionId: string, intervention: any): Promise<void> {
    const query = `
      INSERT INTO ai_facilitation_logs (session_id, intervention_type, content, context, participant_reaction, effectiveness_score)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      sessionId,
      intervention.type,
      intervention.content,
      JSON.stringify(intervention.context),
      intervention.participantReaction,
      intervention.effectivenessScore
    ];
    await this.pool.query(query, values);
  }

  // Helper methods for conflict resolution
  async getParticipantTimestamps(participants: string[]): Promise<ParticipantTimestamp[]> {
    const query = 'SELECT participant_id, last_activity FROM dt_sessions WHERE participant_id = ANY($1)';
    const result = await this.pool.query(query, [participants]);
    return result.rows;
  }

  async getContentVersions(conflict: Conflict): Promise<ContentVersion[]> {
    // Implementation for getting content versions
    return [];
  }

  async getParticipantPositions(conflict: Conflict): Promise<Position[]> {
    // Implementation for getting participant positions
    return [];
  }

  async getSessionFacilitator(conflict: Conflict): Promise<string> {
    // Implementation for getting session facilitator
    return '';
  }

  async getDataVersions(conflict: Conflict): Promise<DataVersion[]> {
    // Implementation for getting data versions
    return [];
  }

  async logConflictResolution(conflict: Conflict, resolution: ConflictResolution): Promise<void> {
    // Implementation for logging conflict resolution
  }

  async getCanvasHistory(canvasId: string): Promise<CanvasVersion[]> {
    // Implementation for getting canvas history
    return [];
  }

  async restoreCanvasVersion(canvasId: string, version: number): Promise<void> {
    // Implementation for restoring canvas version
  }

  // Close connection
  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Type definitions
interface Workflow {
  id: string;
  userId: string;
  businessPlanId?: string;
  name: string;
  description: string;
  currentPhase: string;
  status: string;
  aiFacilitationEnabled: boolean;
  collaborationMode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Canvas {
  id: string;
  workflowId: string;
  canvasType: string;
  elements: CanvasElement[];
  version: number;
  lastModifiedBy: string | null;
  lastModifiedAt: Date;
  createdAt: Date;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  metadata: any;
}

interface Cluster {
  id: string;
  name: string;
  elements: string[];
  theme: string;
  confidence: number;
}

interface AnalyticsData {
  workflowId: string;
  metricType: string;
  value: number;
  dimension: string;
  measurementDate: Date;
  context: any;
}

interface Session {
  id: string;
  workflowId: string;
  sessionType: string;
  facilitatorId: string;
  participants: string[];
  scheduledAt: Date;
  durationMinutes: number;
  status: string;
  recordingUrl?: string;
  transcription?: string;
  aiAnalysis: any;
}

interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
  severity: 'low' | 'medium' | 'high';
}

interface ConflictResolution {
  id: string;
  conflictId: string;
  strategy: string;
  resolution: any;
  applied: boolean;
  requiresNotification: boolean;
}

interface ParticipantTimestamp {
  participantId: string;
  timestamp: Date;
}

interface ContentVersion {
  participantId: string;
  content: string;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

interface DataVersion {
  participantId: string;
  data: any;
  isValid: boolean;
  timestamp: Date;
}

interface CanvasVersion {
  version: number;
  elements: CanvasElement[];
  timestamp: Date;
  modifiedBy: string;
}
