import { BaseDocument, DocumentStatus } from '../types/document.types';

/**
 * Document Lifecycle - Manages document lifecycle and state transitions
 * 
 * This lifecycle system provides:
 * - Document state management
 * - Lifecycle event tracking
 * - State transition validation
 * - Automated state changes
 * - Lifecycle analytics
 */
export class DocumentLifecycle {
  private lifecycleEvents: Map<string, LifecycleEvent[]> = new Map();
  private stateTransitions: Map<DocumentStatus, DocumentStatus[]> = new Map();

  constructor() {
    this.initializeStateTransitions();
  }

  /**
   * Initialize a document's lifecycle
   */
  async initialize(document: BaseDocument): Promise<void> {
    const event: LifecycleEvent = {
      id: this.generateEventId(),
      documentId: document.id,
      fromStatus: null,
      toStatus: document.metadata.status,
      userId: document.createdBy,
      timestamp: new Date(),
      reason: 'Document created',
      metadata: {
        type: 'creation',
        source: 'user'
      }
    };

    this.addLifecycleEvent(document.id, event);
  }

  /**
   * Update document lifecycle
   */
  async update(document: BaseDocument): Promise<void> {
    const events = this.lifecycleEvents.get(document.id) || [];
    const lastEvent = events[events.length - 1];
    
    if (lastEvent && lastEvent.toStatus === document.metadata.status) {
      // Status hasn't changed, just update the document
      return;
    }

    const event: LifecycleEvent = {
      id: this.generateEventId(),
      documentId: document.id,
      fromStatus: lastEvent?.toStatus || null,
      toStatus: document.metadata.status,
      userId: document.lastModifiedBy,
      timestamp: new Date(),
      reason: this.getStatusChangeReason(document.metadata.status),
      metadata: {
        type: 'status_change',
        source: 'user'
      }
    };

    this.addLifecycleEvent(document.id, event);
  }

  /**
   * Transition document to a new status
   */
  async transitionTo(
    documentId: string,
    newStatus: DocumentStatus,
    userId: string,
    reason?: string
  ): Promise<LifecycleEvent> {
    const events = this.lifecycleEvents.get(documentId) || [];
    const lastEvent = events[events.length - 1];
    const currentStatus = lastEvent?.toStatus || 'draft';

    // Validate transition
    if (!this.canTransition(currentStatus, newStatus)) {
      throw new Error(`Invalid transition from ${currentStatus} to ${newStatus}`);
    }

    const event: LifecycleEvent = {
      id: this.generateEventId(),
      documentId,
      fromStatus: currentStatus,
      toStatus: newStatus,
      userId,
      timestamp: new Date(),
      reason: reason || this.getStatusChangeReason(newStatus),
      metadata: {
        type: 'status_transition',
        source: 'user'
      }
    };

    this.addLifecycleEvent(documentId, event);
    return event;
  }

  /**
   * Get document lifecycle history
   */
  async getLifecycleHistory(documentId: string): Promise<LifecycleEvent[]> {
    return this.lifecycleEvents.get(documentId) || [];
  }

  /**
   * Get current document status
   */
  async getCurrentStatus(documentId: string): Promise<DocumentStatus | null> {
    const events = this.lifecycleEvents.get(documentId) || [];
    const lastEvent = events[events.length - 1];
    return lastEvent?.toStatus || null;
  }

  /**
   * Get available transitions for a document
   */
  async getAvailableTransitions(documentId: string): Promise<DocumentStatus[]> {
    const currentStatus = await this.getCurrentStatus(documentId);
    if (!currentStatus) return [];

    return this.stateTransitions.get(currentStatus) || [];
  }

  /**
   * Get lifecycle statistics
   */
  async getLifecycleStats(documentId: string): Promise<LifecycleStats> {
    const events = this.lifecycleEvents.get(documentId) || [];
    
    if (events.length === 0) {
      return {
        totalEvents: 0,
        currentStatus: null,
        statusHistory: [],
        averageTimeInStatus: 0,
        totalLifecycleTime: 0,
        mostActiveUser: null
      };
    }

    const statusHistory = events.map(event => ({
      status: event.toStatus,
      timestamp: event.timestamp,
      duration: 0
    }));

    // Calculate durations
    for (let i = 0; i < statusHistory.length - 1; i++) {
      const current = statusHistory[i];
      const next = statusHistory[i + 1];
      current.duration = next.timestamp.getTime() - current.timestamp.getTime();
    }

    // Calculate average time in status
    const totalTime = statusHistory.reduce((sum, status) => sum + status.duration, 0);
    const averageTimeInStatus = totalTime / statusHistory.length;

    // Find most active user
    const userActivity = new Map<string, number>();
    for (const event of events) {
      const count = userActivity.get(event.userId) || 0;
      userActivity.set(event.userId, count + 1);
    }

    const mostActiveUser = Array.from(userActivity.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      totalEvents: events.length,
      currentStatus: events[events.length - 1].toStatus,
      statusHistory,
      averageTimeInStatus,
      totalLifecycleTime: totalTime,
      mostActiveUser
    };
  }

  /**
   * Get global lifecycle analytics
   */
  async getGlobalAnalytics(): Promise<GlobalLifecycleAnalytics> {
    const allEvents: LifecycleEvent[] = [];
    
    for (const events of this.lifecycleEvents.values()) {
      allEvents.push(...events);
    }

    const statusCounts = new Map<DocumentStatus, number>();
    const transitionCounts = new Map<string, number>();
    const userActivity = new Map<string, number>();

    for (const event of allEvents) {
      // Count status occurrences
      const statusCount = statusCounts.get(event.toStatus) || 0;
      statusCounts.set(event.toStatus, statusCount + 1);

      // Count transitions
      const transitionKey = `${event.fromStatus}->${event.toStatus}`;
      const transitionCount = transitionCounts.get(transitionKey) || 0;
      transitionCounts.set(transitionKey, transitionCount + 1);

      // Count user activity
      const userCount = userActivity.get(event.userId) || 0;
      userActivity.set(event.userId, userCount + 1);
    }

    const mostCommonStatus = Array.from(statusCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const mostCommonTransition = Array.from(transitionCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const mostActiveUser = Array.from(userActivity.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      totalDocuments: this.lifecycleEvents.size,
      totalEvents: allEvents.length,
      statusDistribution: Object.fromEntries(statusCounts),
      mostCommonStatus,
      mostCommonTransition,
      mostActiveUser,
      averageEventsPerDocument: allEvents.length / this.lifecycleEvents.size
    };
  }

  /**
   * Check if a status transition is valid
   */
  canTransition(fromStatus: DocumentStatus | null, toStatus: DocumentStatus): boolean {
    if (!fromStatus) {
      // Initial state - can only go to draft
      return toStatus === 'draft';
    }

    const allowedTransitions = this.stateTransitions.get(fromStatus) || [];
    return allowedTransitions.includes(toStatus);
  }

  /**
   * Initialize state transition rules
   */
  private initializeStateTransitions(): void {
    // Draft can go to review or archived
    this.stateTransitions.set('draft', ['review', 'archived']);

    // Review can go to approved, draft, or archived
    this.stateTransitions.set('review', ['approved', 'draft', 'archived']);

    // Approved can go to published, review, or archived
    this.stateTransitions.set('approved', ['published', 'review', 'archived']);

    // Published can go to archived
    this.stateTransitions.set('published', ['archived']);

    // Archived can go to draft
    this.stateTransitions.set('archived', ['draft']);

    // Deleted is terminal
    this.stateTransitions.set('deleted', []);
  }

  /**
   * Add lifecycle event
   */
  private addLifecycleEvent(documentId: string, event: LifecycleEvent): void {
    const events = this.lifecycleEvents.get(documentId) || [];
    events.push(event);
    this.lifecycleEvents.set(documentId, events);
  }

  /**
   * Get status change reason
   */
  private getStatusChangeReason(status: DocumentStatus): string {
    const reasons: Record<DocumentStatus, string> = {
      draft: 'Document created',
      review: 'Document submitted for review',
      approved: 'Document approved',
      published: 'Document published',
      archived: 'Document archived',
      deleted: 'Document deleted'
    };

    return reasons[status] || 'Status changed';
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `lifecycle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Supporting interfaces
export interface LifecycleEvent {
  id: string;
  documentId: string;
  fromStatus: DocumentStatus | null;
  toStatus: DocumentStatus;
  userId: string;
  timestamp: Date;
  reason: string;
  metadata: {
    type: 'creation' | 'status_change' | 'status_transition' | 'automated';
    source: 'user' | 'system' | 'api';
  };
}

export interface LifecycleStats {
  totalEvents: number;
  currentStatus: DocumentStatus | null;
  statusHistory: Array<{
    status: DocumentStatus;
    timestamp: Date;
    duration: number;
  }>;
  averageTimeInStatus: number;
  totalLifecycleTime: number;
  mostActiveUser: string | null;
}

export interface GlobalLifecycleAnalytics {
  totalDocuments: number;
  totalEvents: number;
  statusDistribution: Record<DocumentStatus, number>;
  mostCommonStatus: DocumentStatus | null;
  mostCommonTransition: string | null;
  mostActiveUser: string | null;
  averageEventsPerDocument: number;
}
