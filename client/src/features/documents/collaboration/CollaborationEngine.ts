import { 
  CollaborationEngine as ICollaborationEngine,
  PresenceManager,
  CommentSystem,
  NotificationService,
  ActivityTracker,
  ActiveUser,
  Comment,
  Suggestion,
  Mention,
  Notification,
  Activity,
  CollaborationSettings,
  CollaborationSession,
  CollaborationEvent,
  CollaborationState,
  ConflictResolution,
  CollaborationAnalytics
} from '../types/collaboration.types';

/**
 * Collaboration Engine - Real-time collaboration for documents
 * 
 * This engine provides:
 * - Real-time presence tracking
 * - Live commenting and suggestions
 * - Conflict resolution
 * - Activity tracking
 * - Notification management
 */
export class CollaborationEngine implements ICollaborationEngine {
  private presenceManager: PresenceManager;
  private commentSystem: CommentSystem;
  private notificationService: NotificationService;
  private activityTracker: ActivityTracker;
  private sessions: Map<string, CollaborationSession> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private settings: CollaborationSettings;

  constructor(
    presenceManager: PresenceManager,
    commentSystem: CommentSystem,
    notificationService: NotificationService,
    activityTracker: ActivityTracker,
    settings: CollaborationSettings
  ) {
    this.presenceManager = presenceManager;
    this.commentSystem = commentSystem;
    this.notificationService = notificationService;
    this.activityTracker = activityTracker;
    this.settings = settings;
  }

  /**
   * Join a document for collaboration
   */
  async joinDocument(documentId: string, userId: string): Promise<void> {
    try {
      // Create collaboration session
      const session: CollaborationSession = {
        id: this.generateSessionId(),
        documentId,
        userId,
        joinedAt: new Date(),
        lastActivity: new Date(),
        cursor: undefined,
        permissions: await this.getUserPermissions(documentId, userId)
      };

      this.sessions.set(session.id, session);

      // Update presence
      await this.presenceManager.updatePresence(userId, documentId, 'online');

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'join',
        userId,
        documentId,
        timestamp: new Date(),
        description: 'User joined document',
        metadata: {
          sessionId: session.id
        }
      });

      // Emit join event
      this.emitEvent('user:joined', {
        documentId,
        userId,
        sessionId: session.id,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to join document: ${error.message}`);
    }
  }

  /**
   * Leave a document
   */
  async leaveDocument(documentId: string, userId: string): Promise<void> {
    try {
      // Find and remove session
      const session = Array.from(this.sessions.values())
        .find(s => s.documentId === documentId && s.userId === userId);

      if (session) {
        this.sessions.delete(session.id);
      }

      // Update presence
      await this.presenceManager.updatePresence(userId, documentId, 'offline');

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'leave',
        userId,
        documentId,
        timestamp: new Date(),
        description: 'User left document',
        metadata: {
          sessionId: session?.id
        }
      });

      // Emit leave event
      this.emitEvent('user:left', {
        documentId,
        userId,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to leave document: ${error.message}`);
    }
  }

  /**
   * Update cursor position
   */
  async updateCursor(
    documentId: string,
    userId: string,
    position: { sectionId: string; offset: number; selection?: any }
  ): Promise<void> {
    try {
      // Find user session
      const session = Array.from(this.sessions.values())
        .find(s => s.documentId === documentId && s.userId === userId);

      if (session) {
        session.cursor = {
          sectionId: position.sectionId,
          offset: position.offset,
          timestamp: new Date(),
          selection: position.selection
        };
        session.lastActivity = new Date();
      }

      // Update presence with cursor
      await this.presenceManager.updatePresence(userId, documentId, 'online');

      // Emit cursor update event
      this.emitEvent('cursor:updated', {
        documentId,
        userId,
        position,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to update cursor: ${error.message}`);
    }
  }

  /**
   * Add a comment
   */
  async addComment(documentId: string, comment: Comment): Promise<void> {
    try {
      // Validate comment
      if (!comment.content || !comment.author) {
        throw new Error('Comment must have content and author');
      }

      // Add comment
      await this.commentSystem.addComment(comment);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'commented',
        userId: comment.author,
        documentId,
        timestamp: new Date(),
        description: 'User added a comment',
        metadata: {
          commentId: comment.id,
          sectionId: comment.sectionId
        }
      });

      // Send notifications to mentioned users
      if (comment.mentions && comment.mentions.length > 0) {
        for (const mentionedUserId of comment.mentions) {
          await this.notificationService.sendNotification({
            id: this.generateNotificationId(),
            type: 'mention',
            title: 'You were mentioned in a comment',
            message: `${comment.author} mentioned you in a comment`,
            userId: mentionedUserId,
            documentId,
            read: false,
            timestamp: new Date(),
            data: {
              commentId: comment.id,
              author: comment.author
            }
          });
        }
      }

      // Emit comment event
      this.emitEvent('comment:added', {
        documentId,
        comment,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  /**
   * Update a comment
   */
  async updateComment(
    documentId: string,
    commentId: string,
    updates: Partial<Comment>
  ): Promise<void> {
    try {
      await this.commentSystem.updateComment(commentId, updates);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'comment_updated',
        userId: updates.author || '',
        documentId,
        timestamp: new Date(),
        description: 'User updated a comment',
        metadata: {
          commentId,
          changes: Object.keys(updates)
        }
      });

      // Emit comment update event
      this.emitEvent('comment:updated', {
        documentId,
        commentId,
        updates,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(documentId: string, commentId: string): Promise<void> {
    try {
      await this.commentSystem.deleteComment(commentId);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'comment_deleted',
        userId: '', // Would need to get from comment
        documentId,
        timestamp: new Date(),
        description: 'User deleted a comment',
        metadata: {
          commentId
        }
      });

      // Emit comment delete event
      this.emitEvent('comment:deleted', {
        documentId,
        commentId,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  /**
   * Add a suggestion
   */
  async addSuggestion(documentId: string, suggestion: Suggestion): Promise<void> {
    try {
      // Validate suggestion
      if (!suggestion.content || !suggestion.author) {
        throw new Error('Suggestion must have content and author');
      }

      // Add suggestion (would be implemented in suggestion system)
      // await this.suggestionSystem.addSuggestion(suggestion);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'suggested',
        userId: suggestion.author,
        documentId,
        timestamp: new Date(),
        description: 'User added a suggestion',
        metadata: {
          suggestionId: suggestion.id,
          sectionId: suggestion.sectionId
        }
      });

      // Emit suggestion event
      this.emitEvent('suggestion:added', {
        documentId,
        suggestion,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to add suggestion: ${error.message}`);
    }
  }

  /**
   * Accept a suggestion
   */
  async acceptSuggestion(
    documentId: string,
    suggestionId: string,
    userId: string
  ): Promise<void> {
    try {
      // Accept suggestion (would be implemented in suggestion system)
      // await this.suggestionSystem.acceptSuggestion(suggestionId, userId);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'suggestion_accepted',
        userId,
        documentId,
        timestamp: new Date(),
        description: 'User accepted a suggestion',
        metadata: {
          suggestionId
        }
      });

      // Emit suggestion accept event
      this.emitEvent('suggestion:accepted', {
        documentId,
        suggestionId,
        userId,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to accept suggestion: ${error.message}`);
    }
  }

  /**
   * Reject a suggestion
   */
  async rejectSuggestion(
    documentId: string,
    suggestionId: string,
    userId: string
  ): Promise<void> {
    try {
      // Reject suggestion (would be implemented in suggestion system)
      // await this.suggestionSystem.rejectSuggestion(suggestionId, userId);

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'suggestion_rejected',
        userId,
        documentId,
        timestamp: new Date(),
        description: 'User rejected a suggestion',
        metadata: {
          suggestionId
        }
      });

      // Emit suggestion reject event
      this.emitEvent('suggestion:rejected', {
        documentId,
        suggestionId,
        userId,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to reject suggestion: ${error.message}`);
    }
  }

  /**
   * Add a mention
   */
  async addMention(documentId: string, mention: Mention): Promise<void> {
    try {
      // Add mention (would be implemented in mention system)
      // await this.mentionSystem.addMention(mention);

      // Send notification
      await this.notificationService.sendNotification({
        id: this.generateNotificationId(),
        type: 'mention',
        title: 'You were mentioned',
        message: `${mention.content}`,
        userId: mention.userId,
        documentId,
        read: false,
        timestamp: new Date(),
        data: {
          mentionId: mention.id
        }
      });

      // Track activity
      await this.activityTracker.trackActivity({
        id: this.generateActivityId(),
        type: 'mentioned',
        userId: mention.userId,
        documentId,
        timestamp: new Date(),
        description: 'User was mentioned',
        metadata: {
          mentionId: mention.id
        }
      });

      // Emit mention event
      this.emitEvent('mention:added', {
        documentId,
        mention,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to add mention: ${error.message}`);
    }
  }

  /**
   * Mark mention as read
   */
  async markMentionRead(
    documentId: string,
    mentionId: string,
    userId: string
  ): Promise<void> {
    try {
      // Mark mention as read (would be implemented in mention system)
      // await this.mentionSystem.markMentionRead(mentionId, userId);

      // Emit mention read event
      this.emitEvent('mention:read', {
        documentId,
        mentionId,
        userId,
        timestamp: new Date()
      });

    } catch (error) {
      throw new Error(`Failed to mark mention as read: ${error.message}`);
    }
  }

  /**
   * Get active users for a document
   */
  async getActiveUsers(documentId: string): Promise<ActiveUser[]> {
    try {
      return await this.presenceManager.getPresence(documentId);
    } catch (error) {
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }

  /**
   * Get comments for a document
   */
  async getComments(documentId: string): Promise<Comment[]> {
    try {
      return await this.commentSystem.getComments(documentId);
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  /**
   * Get suggestions for a document
   */
  async getSuggestions(documentId: string): Promise<Suggestion[]> {
    try {
      // Would be implemented in suggestion system
      return [];
    } catch (error) {
      throw new Error(`Failed to get suggestions: ${error.message}`);
    }
  }

  /**
   * Get mentions for a user
   */
  async getMentions(documentId: string, userId: string): Promise<Mention[]> {
    try {
      // Would be implemented in mention system
      return [];
    } catch (error) {
      throw new Error(`Failed to get mentions: ${error.message}`);
    }
  }

  /**
   * Subscribe to collaboration events
   */
  subscribeToEvents(
    documentId: string,
    eventTypes: string[],
    callback: (event: CollaborationEvent) => void
  ): void {
    for (const eventType of eventTypes) {
      const key = `${documentId}:${eventType}`;
      if (!this.eventListeners.has(key)) {
        this.eventListeners.set(key, []);
      }
      this.eventListeners.get(key)!.push(callback);
    }
  }

  /**
   * Unsubscribe from collaboration events
   */
  unsubscribeFromEvents(
    documentId: string,
    eventTypes: string[],
    callback: (event: CollaborationEvent) => void
  ): void {
    for (const eventType of eventTypes) {
      const key = `${documentId}:${eventType}`;
      const listeners = this.eventListeners.get(key);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  /**
   * Get collaboration analytics
   */
  async getAnalytics(documentId: string): Promise<CollaborationAnalytics> {
    try {
      const activities = await this.activityTracker.getActivities(documentId);
      const comments = await this.commentSystem.getComments(documentId);
      const suggestions = await this.getSuggestions(documentId);
      const mentions = await this.getMentions(documentId, ''); // Would need user context

      // Calculate analytics
      const totalUsers = new Set(activities.map(a => a.userId)).size;
      const activeUsers = await this.getActiveUsers(documentId);
      
      const userActivity = new Map<string, number>();
      for (const activity of activities) {
        const count = userActivity.get(activity.userId) || 0;
        userActivity.set(activity.userId, count + 1);
      }

      const mostActiveUsers = Array.from(userActivity.entries())
        .map(([userId, activities]) => ({
          userId,
          name: '', // Would need to get from user service
          activities,
          comments: comments.filter(c => c.author === userId).length,
          suggestions: suggestions.filter(s => s.author === userId).length,
          timeSpent: 0, // Would need to calculate from session data
          lastActivity: new Date() // Would need to get from activity data
        }))
        .sort((a, b) => b.activities - a.activities)
        .slice(0, 10);

      const averageSessionTime = this.calculateAverageSessionTime(documentId);
      const collaborationScore = this.calculateCollaborationScore(activities, comments, suggestions);

      return {
        totalUsers,
        activeUsers: activeUsers.length,
        comments: comments.length,
        suggestions: suggestions.length,
        mentions: mentions.length,
        activities: activities.length,
        averageSessionTime,
        mostActiveUsers,
        collaborationScore,
        lastActivity: activities.length > 0 ? activities[activities.length - 1].timestamp : new Date()
      };

    } catch (error) {
      throw new Error(`Failed to get collaboration analytics: ${error.message}`);
    }
  }

  /**
   * Resolve conflicts
   */
  async resolveConflicts(
    documentId: string,
    conflicts: ConflictResolution[]
  ): Promise<void> {
    try {
      for (const conflict of conflicts) {
        // Implement conflict resolution logic
        // This would depend on the specific conflict type and resolution strategy
        
        // Track conflict resolution activity
        await this.activityTracker.trackActivity({
          id: this.generateActivityId(),
          type: 'conflict_resolved',
          userId: conflict.resolvedBy,
          documentId,
          timestamp: new Date(),
          description: 'Conflict resolved',
          metadata: {
            conflictId: conflict.documentId,
            resolution: conflict.resolution
          }
        });

        // Emit conflict resolution event
        this.emitEvent('conflict:resolved', {
          documentId,
          conflict,
          timestamp: new Date()
        });
      }

    } catch (error) {
      throw new Error(`Failed to resolve conflicts: ${error.message}`);
    }
  }

  // Private helper methods
  private async getUserPermissions(documentId: string, userId: string): Promise<string[]> {
    // Would implement permission checking logic
    return ['view', 'comment', 'suggest'];
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNotificationId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private emitEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener({
            type: eventType,
            documentId: data.documentId,
            userId: data.userId,
            timestamp: data.timestamp,
            data
          });
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      }
    }
  }

  private calculateAverageSessionTime(documentId: string): number {
    // Would calculate from session data
    return 0;
  }

  private calculateCollaborationScore(
    activities: Activity[],
    comments: Comment[],
    suggestions: Suggestion[]
  ): number {
    // Simple scoring algorithm
    const activityScore = Math.min(activities.length * 2, 50);
    const commentScore = Math.min(comments.length * 5, 30);
    const suggestionScore = Math.min(suggestions.length * 10, 20);
    
    return Math.min(activityScore + commentScore + suggestionScore, 100);
  }
}
