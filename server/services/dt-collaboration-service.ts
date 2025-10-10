import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { DTAIAssistant } from '../ai-agents/agents/design-thinking/dt-ai-assistant';
import { CanvasService } from './canvas-service';
import { ConflictResolver } from './conflict-resolver';

/**
 * Real-Time Design Thinking Collaboration Service
 * 
 * This service handles real-time collaboration for DT sessions:
 * - WebSocket-based real-time updates
 * - AI-powered suggestions
 * - Conflict resolution
 * - Smart clustering
 * - Session management
 */
export class DTCollaborationService {
  private io: SocketIOServer;
  private canvasService: CanvasService;
  private aiAssistant: DTAIAssistant;
  private conflictResolver: ConflictResolver;
  private activeSessions: Map<string, DTSession>;
  private updateBatcher: UpdateBatcher;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.canvasService = new CanvasService();
    this.aiAssistant = new DTAIAssistant();
    this.conflictResolver = new ConflictResolver();
    this.activeSessions = new Map();
    this.updateBatcher = new UpdateBatcher();

    this.setupEventHandlers();
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join DT session
      socket.on('join-session', async (data: JoinSessionData) => {
        await this.handleJoinSession(socket, data);
      });

      // Leave DT session
      socket.on('leave-session', async (data: LeaveSessionData) => {
        await this.handleLeaveSession(socket, data);
      });

      // Canvas updates
      socket.on('canvas-update', async (data: CanvasUpdate) => {
        await this.handleCanvasUpdate(socket, data);
      });

      // AI suggestions request
      socket.on('request-suggestions', async (data: SuggestionRequest) => {
        await this.handleSuggestionRequest(socket, data);
      });

      // Conflict resolution
      socket.on('resolve-conflict', async (data: ConflictResolution) => {
        await this.handleConflictResolution(socket, data);
      });

      // Session control
      socket.on('start-session', async (data: SessionControl) => {
        await this.handleStartSession(socket, data);
      });

      socket.on('pause-session', async (data: SessionControl) => {
        await this.handlePauseSession(socket, data);
      });

      socket.on('end-session', async (data: SessionControl) => {
        await this.handleEndSession(socket, data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Handle user joining a DT session
   */
  private async handleJoinSession(socket: any, data: JoinSessionData): Promise<void> {
    try {
      const { sessionId, userId, userRole } = data;
      
      // Join socket room
      socket.join(sessionId);
      
      // Add user to session
      const session = await this.getOrCreateSession(sessionId);
      session.addParticipant({
        id: userId,
        socketId: socket.id,
        role: userRole,
        joinedAt: new Date()
      });

      // Notify other participants
      socket.to(sessionId).emit('participant-joined', {
        userId,
        userRole,
        timestamp: new Date()
      });

      // Send current session state
      socket.emit('session-state', {
        session: session.getState(),
        canvas: await this.canvasService.getCanvas(sessionId)
      });

      console.log(`User ${userId} joined session ${sessionId}`);
    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  }

  /**
   * Handle user leaving a DT session
   */
  private async handleLeaveSession(socket: any, data: LeaveSessionData): Promise<void> {
    try {
      const { sessionId, userId } = data;
      
      // Remove user from session
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.removeParticipant(userId);
      }

      // Leave socket room
      socket.leave(sessionId);

      // Notify other participants
      socket.to(sessionId).emit('participant-left', {
        userId,
        timestamp: new Date()
      });

      console.log(`User ${userId} left session ${sessionId}`);
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  }

  /**
   * Handle canvas updates
   */
  private async handleCanvasUpdate(socket: any, data: CanvasUpdate): Promise<void> {
    try {
      const { sessionId, update } = data;
      
      // Batch similar updates for performance
      this.updateBatcher.addUpdate(sessionId, update);
      
      // Process batched updates
      const batchedUpdates = await this.updateBatcher.processUpdates(sessionId);
      
      if (batchedUpdates.length > 0) {
        // Apply updates to canvas
        await this.canvasService.applyUpdates(sessionId, batchedUpdates);
        
        // Broadcast to all participants
        socket.to(sessionId).emit('canvas-updates', {
          updates: batchedUpdates,
          timestamp: new Date()
        });

        // Generate AI suggestions if needed
        if (update.type === 'element_added') {
          await this.generateAISuggestions(sessionId, update);
        }
      }

      console.log(`Canvas updated for session ${sessionId}`);
    } catch (error) {
      console.error('Error handling canvas update:', error);
      socket.emit('error', { message: 'Failed to update canvas' });
    }
  }

  /**
   * Handle AI suggestion requests
   */
  private async handleSuggestionRequest(socket: any, data: SuggestionRequest): Promise<void> {
    try {
      const { sessionId, context, type } = data;
      
      const suggestions = await this.aiAssistant.generateSuggestions({
        sessionId,
        context,
        type,
        timestamp: new Date()
      });

      socket.emit('ai-suggestions', {
        suggestions,
        timestamp: new Date()
      });

      console.log(`AI suggestions generated for session ${sessionId}`);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      socket.emit('error', { message: 'Failed to generate suggestions' });
    }
  }

  /**
   * Handle conflict resolution
   */
  private async handleConflictResolution(socket: any, data: ConflictResolution): Promise<void> {
    try {
      const { sessionId, conflict } = data;
      
      const resolution = await this.conflictResolver.resolveConflict(conflict);
      
      // Broadcast resolution to all participants
      this.io.to(sessionId).emit('conflict-resolved', {
        conflict,
        resolution,
        timestamp: new Date()
      });

      console.log(`Conflict resolved for session ${sessionId}`);
    } catch (error) {
      console.error('Error resolving conflict:', error);
      socket.emit('error', { message: 'Failed to resolve conflict' });
    }
  }

  /**
   * Handle session start
   */
  private async handleStartSession(socket: any, data: SessionControl): Promise<void> {
    try {
      const { sessionId } = data;
      
      const session = await this.getOrCreateSession(sessionId);
      session.start();
      
      // Notify all participants
      this.io.to(sessionId).emit('session-started', {
        sessionId,
        timestamp: new Date()
      });

      console.log(`Session ${sessionId} started`);
    } catch (error) {
      console.error('Error starting session:', error);
      socket.emit('error', { message: 'Failed to start session' });
    }
  }

  /**
   * Handle session pause
   */
  private async handlePauseSession(socket: any, data: SessionControl): Promise<void> {
    try {
      const { sessionId } = data;
      
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.pause();
        
        // Notify all participants
        this.io.to(sessionId).emit('session-paused', {
          sessionId,
          timestamp: new Date()
        });
      }

      console.log(`Session ${sessionId} paused`);
    } catch (error) {
      console.error('Error pausing session:', error);
      socket.emit('error', { message: 'Failed to pause session' });
    }
  }

  /**
   * Handle session end
   */
  private async handleEndSession(socket: any, data: SessionControl): Promise<void> {
    try {
      const { sessionId } = data;
      
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.end();
        
        // Generate session summary
        const summary = await this.generateSessionSummary(session);
        
        // Notify all participants
        this.io.to(sessionId).emit('session-ended', {
          sessionId,
          summary,
          timestamp: new Date()
        });

        // Remove from active sessions
        this.activeSessions.delete(sessionId);
      }

      console.log(`Session ${sessionId} ended`);
    } catch (error) {
      console.error('Error ending session:', error);
      socket.emit('error', { message: 'Failed to end session' });
    }
  }

  /**
   * Handle user disconnect
   */
  private handleDisconnect(socket: any): void {
    // Remove user from all sessions
    for (const [sessionId, session] of this.activeSessions) {
      session.removeParticipantBySocketId(socket.id);
    }
  }

  /**
   * Get or create session
   */
  private async getOrCreateSession(sessionId: string): Promise<DTSession> {
    let session = this.activeSessions.get(sessionId);
    
    if (!session) {
      session = new DTSession(sessionId);
      this.activeSessions.set(sessionId, session);
    }
    
    return session;
  }

  /**
   * Generate AI suggestions for canvas updates
   */
  private async generateAISuggestions(sessionId: string, update: CanvasUpdate): Promise<void> {
    try {
      const suggestions = await this.aiAssistant.suggestRelatedElements({
        sessionId,
        update,
        timestamp: new Date()
      });

      if (suggestions.length > 0) {
        this.io.to(sessionId).emit('ai-suggestions', {
          suggestions,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  }

  /**
   * Generate session summary
   */
  private async generateSessionSummary(session: DTSession): Promise<SessionSummary> {
    const participants = session.getParticipants();
    const activities = session.getActivities();
    const canvas = await this.canvasService.getCanvas(session.id);

    return {
      sessionId: session.id,
      duration: session.getDuration(),
      participants: participants.length,
      activities: activities.length,
      canvasElements: canvas.elements.length,
      insights: await this.aiAssistant.generateSessionInsights(session),
      recommendations: await this.aiAssistant.generateRecommendations(session)
    };
  }

  /**
   * Enable smart clustering for canvas
   */
  async enableSmartClustering(canvasId: string): Promise<Cluster[]> {
    try {
      const elements = await this.canvasService.getElements(canvasId);
      const clusters = await this.aiAssistant.clusterElements(elements);
      
      // Apply clustering to canvas
      await this.canvasService.applyClustering(canvasId, clusters);
      
      // Notify participants
      this.io.to(canvasId).emit('canvas-clustered', {
        clusters,
        timestamp: new Date()
      });

      return clusters;
    } catch (error) {
      console.error('Error enabling smart clustering:', error);
      throw error;
    }
  }

  /**
   * Get session status
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatus> {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      return {
        status: 'not_found',
        participants: 0,
        duration: 0
      };
    }

    return {
      status: session.getStatus(),
      participants: session.getParticipants().length,
      duration: session.getDuration(),
      lastActivity: session.getLastActivity()
    };
  }
}

// Supporting classes
class UpdateBatcher {
  private batches: Map<string, CanvasUpdate[]>;
  private batchTimers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.batches = new Map();
    this.batchTimers = new Map();
  }

  addUpdate(sessionId: string, update: CanvasUpdate): void {
    if (!this.batches.has(sessionId)) {
      this.batches.set(sessionId, []);
    }

    this.batches.get(sessionId)!.push(update);

    // Set timer for batch processing
    if (this.batchTimers.has(sessionId)) {
      clearTimeout(this.batchTimers.get(sessionId)!);
    }

    this.batchTimers.set(sessionId, setTimeout(() => {
      this.processUpdates(sessionId);
    }, 100)); // 100ms batch window
  }

  async processUpdates(sessionId: string): Promise<CanvasUpdate[]> {
    const updates = this.batches.get(sessionId) || [];
    this.batches.set(sessionId, []);
    
    if (this.batchTimers.has(sessionId)) {
      clearTimeout(this.batchTimers.get(sessionId)!);
      this.batchTimers.delete(sessionId);
    }

    return updates;
  }
}

class DTSession {
  private id: string;
  private participants: Map<string, Participant>;
  private activities: Activity[];
  private status: SessionStatus;
  private startTime?: Date;
  private endTime?: Date;
  private lastActivity: Date;

  constructor(id: string) {
    this.id = id;
    this.participants = new Map();
    this.activities = [];
    this.status = 'inactive';
    this.lastActivity = new Date();
  }

  addParticipant(participant: Participant): void {
    this.participants.set(participant.id, participant);
    this.lastActivity = new Date();
  }

  removeParticipant(userId: string): void {
    this.participants.delete(userId);
    this.lastActivity = new Date();
  }

  removeParticipantBySocketId(socketId: string): void {
    for (const [userId, participant] of this.participants) {
      if (participant.socketId === socketId) {
        this.participants.delete(userId);
        break;
      }
    }
    this.lastActivity = new Date();
  }

  start(): void {
    this.status = 'active';
    this.startTime = new Date();
    this.lastActivity = new Date();
  }

  pause(): void {
    this.status = 'paused';
    this.lastActivity = new Date();
  }

  end(): void {
    this.status = 'completed';
    this.endTime = new Date();
    this.lastActivity = new Date();
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  getActivities(): Activity[] {
    return this.activities;
  }

  getStatus(): SessionStatus {
    return this.status;
  }

  getDuration(): number {
    if (!this.startTime) return 0;
    const endTime = this.endTime || new Date();
    return endTime.getTime() - this.startTime.getTime();
  }

  getLastActivity(): Date {
    return this.lastActivity;
  }

  getState(): SessionState {
    return {
      id: this.id,
      status: this.status,
      participants: this.getParticipants(),
      activities: this.activities,
      duration: this.getDuration(),
      lastActivity: this.lastActivity
    };
  }
}

// Type definitions
interface JoinSessionData {
  sessionId: string;
  userId: string;
  userRole: string;
}

interface LeaveSessionData {
  sessionId: string;
  userId: string;
}

interface CanvasUpdate {
  sessionId: string;
  type: 'element_added' | 'element_updated' | 'element_removed' | 'element_moved';
  element: CanvasElement;
  timestamp: Date;
  conflicts?: Conflict[];
}

interface SuggestionRequest {
  sessionId: string;
  context: any;
  type: string;
}

interface ConflictResolution {
  sessionId: string;
  conflict: Conflict;
}

interface SessionControl {
  sessionId: string;
}

interface Participant {
  id: string;
  socketId: string;
  role: string;
  joinedAt: Date;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  participantId: string;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  metadata: any;
}

interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
  severity: 'low' | 'medium' | 'high';
}

interface Cluster {
  id: string;
  name: string;
  elements: string[];
  theme: string;
  confidence: number;
}

interface SessionSummary {
  sessionId: string;
  duration: number;
  participants: number;
  activities: number;
  canvasElements: number;
  insights: any[];
  recommendations: any[];
}

interface SessionStatus {
  status: 'active' | 'paused' | 'completed' | 'not_found';
  participants: number;
  duration: number;
  lastActivity?: Date;
}

interface SessionState {
  id: string;
  status: SessionStatus;
  participants: Participant[];
  activities: Activity[];
  duration: number;
  lastActivity: Date;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  metadata: any;
}

interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
  severity: 'low' | 'medium' | 'high';
}

interface Cluster {
  id: string;
  name: string;
  elements: string[];
  theme: string;
  confidence: number;
}

interface SessionSummary {
  sessionId: string;
  duration: number;
  participants: number;
  activities: number;
  canvasElements: number;
  insights: any[];
  recommendations: any[];
}

interface SessionStatus {
  status: 'active' | 'paused' | 'completed' | 'not_found';
  participants: number;
  duration: number;
  lastActivity?: Date;
}

interface SessionState {
  id: string;
  status: SessionStatus;
  participants: Participant[];
  activities: Activity[];
  duration: number;
  lastActivity: Date;
}
