import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { DTCollaborationService } from './services/dt-collaboration-service';

/**
 * WebSocket Server for Real-Time Design Thinking Collaboration
 * 
 * Handles real-time communication for DT workflows:
 * - Canvas updates
 * - Participant management
 * - AI suggestions
 * - Conflict resolution
 */
export class WebSocketServer {
  private io: SocketIOServer;
  private collaborationService: DTCollaborationService;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      path: '/socket.io'
    });

    this.collaborationService = new DTCollaborationService(httpServer);
    this.setupEventHandlers();
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join DT session
      socket.on('join-dt-session', async (data: JoinSessionData) => {
        await this.handleJoinSession(socket, data);
      });

      // Leave DT session
      socket.on('leave-dt-session', async (data: LeaveSessionData) => {
        await this.handleLeaveSession(socket, data);
      });

      // Canvas updates
      socket.on('canvas-update', async (data: CanvasUpdate) => {
        await this.handleCanvasUpdate(socket, data);
      });

      // AI suggestions request
      socket.on('request-ai-suggestions', async (data: SuggestionRequest) => {
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
      
      // Notify other participants
      socket.to(sessionId).emit('participant-joined', {
        userId,
        userRole,
        timestamp: new Date()
      });

      // Send current session state
      socket.emit('session-state', {
        sessionId,
        participants: await this.getSessionParticipants(sessionId),
        canvas: await this.getSessionCanvas(sessionId)
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
      
      // Broadcast to all participants
      socket.to(sessionId).emit('canvas-update', {
        update,
        timestamp: new Date()
      });

      // Generate AI suggestions if needed
      if (update.type === 'element_added') {
        const suggestions = await this.generateAISuggestions(sessionId, update);
        if (suggestions.length > 0) {
          socket.to(sessionId).emit('ai-suggestions', {
            suggestions,
            timestamp: new Date()
          });
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
      
      const suggestions = await this.generateAISuggestions(sessionId, context);
      
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
      
      const resolution = await this.resolveConflict(conflict);
      
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
      
      // Notify all participants
      this.io.to(sessionId).emit('session-paused', {
        sessionId,
        timestamp: new Date()
      });

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
      
      // Generate session summary
      const summary = await this.generateSessionSummary(sessionId);
      
      // Notify all participants
      this.io.to(sessionId).emit('session-ended', {
        sessionId,
        summary,
        timestamp: new Date()
      });

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
    console.log('User disconnected:', socket.id);
  }

  /**
   * Get session participants
   */
  private async getSessionParticipants(sessionId: string): Promise<Participant[]> {
    // Implementation for getting session participants
    return [];
  }

  /**
   * Get session canvas
   */
  private async getSessionCanvas(sessionId: string): Promise<Canvas> {
    // Implementation for getting session canvas
    return {
      id: sessionId,
      elements: [],
      version: 1
    };
  }

  /**
   * Generate AI suggestions
   */
  private async generateAISuggestions(sessionId: string, context: any): Promise<AISuggestion[]> {
    // Implementation for generating AI suggestions
    return [];
  }

  /**
   * Resolve conflict
   */
  private async resolveConflict(conflict: Conflict): Promise<ConflictResolution> {
    // Implementation for conflict resolution
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'last_write_wins',
      resolution: { winner: 'auto' },
      applied: true,
      requiresNotification: true
    };
  }

  /**
   * Generate session summary
   */
  private async generateSessionSummary(sessionId: string): Promise<SessionSummary> {
    // Implementation for generating session summary
    return {
      sessionId,
      duration: 0,
      participants: 0,
      activities: 0,
      insights: []
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
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
  name: string;
  role: string;
  isOnline: boolean;
}

interface Canvas {
  id: string;
  elements: CanvasElement[];
  version: number;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
}

interface AISuggestion {
  id: string;
  type: string;
  content: string;
  confidence: number;
}

interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
}

interface ConflictResolution {
  id: string;
  conflictId: string;
  strategy: string;
  resolution: any;
  applied: boolean;
  requiresNotification: boolean;
}

interface SessionSummary {
  sessionId: string;
  duration: number;
  participants: number;
  activities: number;
  insights: any[];
}
