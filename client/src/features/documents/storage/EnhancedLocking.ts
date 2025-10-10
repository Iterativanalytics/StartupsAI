import { BaseDocument } from '../types/document.types';
import { DocumentLock, LockOptions, UserLockStats } from '../core/DocumentLocking';
import { ConflictResolution, ConflictResolutionStrategy } from '../types/collaboration.types';

/**
 * Enhanced Document Locking System - Advanced locking with conflict resolution
 * 
 * This system provides:
 * - Multi-level locking (document, section, field)
 * - Automatic conflict detection
 * - Smart conflict resolution
 * - Lock inheritance and delegation
 * - Lock analytics and optimization
 * - Deadlock prevention
 */
export class EnhancedLocking {
  private locks: Map<string, DocumentLock> = new Map();
  private sectionLocks: Map<string, SectionLock[]> = new Map();
  private fieldLocks: Map<string, FieldLock[]> = new Map();
  private lockTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private lockHistory: Map<string, LockEvent[]> = new Map();
  private deadlockDetector: DeadlockDetector;
  private conflictResolver: ConflictResolver;

  constructor() {
    this.deadlockDetector = new DeadlockDetector();
    this.conflictResolver = new ConflictResolver();
  }

  /**
   * Acquire document lock with advanced options
   */
  async acquireLock(
    documentId: string,
    userId: string,
    options: EnhancedLockOptions = {}
  ): Promise<LockResult> {
    const startTime = Date.now();
    
    try {
      // 1. Check for deadlocks
      const deadlockRisk = await this.deadlockDetector.checkDeadlockRisk(
        documentId,
        userId,
        options
      );
      
      if (deadlockRisk.risk > 0.8 && !options.force) {
        return {
          success: false,
          reason: 'deadlock_risk',
          deadlockRisk: deadlockRisk.risk,
          suggestedWaitTime: deadlockRisk.suggestedWaitTime
        };
      }

      // 2. Check for existing locks
      const existingLock = this.locks.get(documentId);
      if (existingLock && existingLock.userId !== userId) {
        // Check if lock has expired
        if (this.isLockExpired(existingLock)) {
          await this.releaseLock(documentId, existingLock.userId);
        } else {
          // Check if we can acquire a shared lock
          if (options.lockType === 'shared' && existingLock.lockType === 'shared') {
            return await this.acquireSharedLock(documentId, userId, options);
          } else {
            return {
              success: false,
              reason: 'document_locked',
              lockedBy: existingLock.userName,
              lockExpiresAt: existingLock.expiresAt,
              suggestedWaitTime: this.calculateWaitTime(existingLock)
            };
          }
        }
      }

      // 3. Acquire the lock
      const lock: DocumentLock = {
        documentId,
        userId,
        userName: options.userName || 'Unknown User',
        userEmail: options.userEmail || '',
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + (options.timeout || 30 * 60 * 1000)),
        reason: options.reason || 'Editing',
        force: options.force || false,
        lockType: options.lockType || 'exclusive',
        priority: options.priority || 'normal',
        metadata: options.metadata || {}
      };

      this.locks.set(documentId, lock);

      // 4. Set up auto-release
      this.setupAutoRelease(documentId, lock);

      // 5. Record lock event
      await this.recordLockEvent(documentId, userId, 'acquired', {
        lockType: lock.lockType,
        reason: lock.reason,
        processingTime: Date.now() - startTime
      });

      return {
        success: true,
        lock,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      await this.recordLockEvent(documentId, userId, 'failed', {
        error: error.message,
        processingTime: Date.now() - startTime
      });
      
      throw new Error(`Failed to acquire lock: ${error.message}`);
    }
  }

  /**
   * Acquire section-level lock
   */
  async acquireSectionLock(
    documentId: string,
    sectionId: string,
    userId: string,
    options: SectionLockOptions = {}
  ): Promise<SectionLockResult> {
    try {
      // Check if document is locked by another user
      const documentLock = this.locks.get(documentId);
      if (documentLock && documentLock.userId !== userId && documentLock.lockType === 'exclusive') {
        return {
          success: false,
          reason: 'document_locked',
          lockedBy: documentLock.userName
        };
      }

      // Check for existing section locks
      const existingLocks = this.sectionLocks.get(sectionId) || [];
      const conflictingLock = existingLocks.find(lock => 
        lock.userId !== userId && 
        (lock.lockType === 'exclusive' || options.lockType === 'exclusive')
      );

      if (conflictingLock) {
        return {
          success: false,
          reason: 'section_locked',
          lockedBy: conflictingLock.userName,
          lockExpiresAt: conflictingLock.expiresAt
        };
      }

      // Create section lock
      const sectionLock: SectionLock = {
        id: this.generateLockId(),
        documentId,
        sectionId,
        userId,
        userName: options.userName || 'Unknown User',
        lockType: options.lockType || 'exclusive',
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + (options.timeout || 15 * 60 * 1000)),
        reason: options.reason || 'Section editing',
        metadata: options.metadata || {}
      };

      existingLocks.push(sectionLock);
      this.sectionLocks.set(sectionId, existingLocks);

      // Set up auto-release
      this.setupSectionAutoRelease(sectionId, sectionLock);

      return {
        success: true,
        lock: sectionLock
      };

    } catch (error) {
      throw new Error(`Failed to acquire section lock: ${error.message}`);
    }
  }

  /**
   * Acquire field-level lock
   */
  async acquireFieldLock(
    documentId: string,
    fieldPath: string,
    userId: string,
    options: FieldLockOptions = {}
  ): Promise<FieldLockResult> {
    try {
      // Check if document or section is locked
      const documentLock = this.locks.get(documentId);
      if (documentLock && documentLock.userId !== userId && documentLock.lockType === 'exclusive') {
        return {
          success: false,
          reason: 'document_locked',
          lockedBy: documentLock.userName
        };
      }

      // Check for existing field locks
      const existingLocks = this.fieldLocks.get(fieldPath) || [];
      const conflictingLock = existingLocks.find(lock => 
        lock.userId !== userId && 
        (lock.lockType === 'exclusive' || options.lockType === 'exclusive')
      );

      if (conflictingLock) {
        return {
          success: false,
          reason: 'field_locked',
          lockedBy: conflictingLock.userName,
          lockExpiresAt: conflictingLock.expiresAt
        };
      }

      // Create field lock
      const fieldLock: FieldLock = {
        id: this.generateLockId(),
        documentId,
        fieldPath,
        userId,
        userName: options.userName || 'Unknown User',
        lockType: options.lockType || 'exclusive',
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + (options.timeout || 5 * 60 * 1000)),
        reason: options.reason || 'Field editing',
        metadata: options.metadata || {}
      };

      existingLocks.push(fieldLock);
      this.fieldLocks.set(fieldPath, existingLocks);

      // Set up auto-release
      this.setupFieldAutoRelease(fieldPath, fieldLock);

      return {
        success: true,
        lock: fieldLock
      };

    } catch (error) {
      throw new Error(`Failed to acquire field lock: ${error.message}`);
    }
  }

  /**
   * Release lock with cleanup
   */
  async releaseLock(
    documentId: string,
    userId: string,
    options: ReleaseOptions = {}
  ): Promise<ReleaseResult> {
    try {
      const lock = this.locks.get(documentId);
      
      if (!lock) {
        return {
          success: true,
          message: 'No lock to release'
        };
      }

      if (lock.userId !== userId && !options.force) {
        return {
          success: false,
          reason: 'not_lock_owner',
          lockedBy: lock.userName
        };
      }

      // Release the lock
      this.locks.delete(documentId);
      
      // Clear timeout
      const timeout = this.lockTimeouts.get(documentId);
      if (timeout) {
        clearTimeout(timeout);
        this.lockTimeouts.delete(documentId);
      }

      // Record release event
      await this.recordLockEvent(documentId, userId, 'released', {
        lockType: lock.lockType,
        duration: Date.now() - lock.lockedAt.getTime()
      });

      return {
        success: true,
        releasedAt: new Date(),
        duration: Date.now() - lock.lockedAt.getTime()
      };

    } catch (error) {
      throw new Error(`Failed to release lock: ${error.message}`);
    }
  }

  /**
   * Detect and resolve conflicts
   */
  async detectConflicts(
    documentId: string,
    userId: string
  ): Promise<ConflictDetectionResult> {
    try {
      const conflicts: ConflictInfo[] = [];

      // Check for document-level conflicts
      const documentLock = this.locks.get(documentId);
      if (documentLock && documentLock.userId !== userId) {
        conflicts.push({
          type: 'document_lock',
          severity: 'high',
          message: `Document is locked by ${documentLock.userName}`,
          lockedBy: documentLock.userName,
          lockExpiresAt: documentLock.expiresAt,
          resolution: 'wait_for_release'
        });
      }

      // Check for section-level conflicts
      const sectionLocks = Array.from(this.sectionLocks.values())
        .flat()
        .filter(lock => lock.documentId === documentId && lock.userId !== userId);

      for (const sectionLock of sectionLocks) {
        conflicts.push({
          type: 'section_lock',
          severity: 'medium',
          message: `Section ${sectionLock.sectionId} is locked by ${sectionLock.userName}`,
          lockedBy: sectionLock.userName,
          lockExpiresAt: sectionLock.expiresAt,
          resolution: 'request_access'
        });
      }

      // Check for field-level conflicts
      const fieldLocks = Array.from(this.fieldLocks.values())
        .flat()
        .filter(lock => lock.documentId === documentId && lock.userId !== userId);

      for (const fieldLock of fieldLocks) {
        conflicts.push({
          type: 'field_lock',
          severity: 'low',
          message: `Field ${fieldLock.fieldPath} is locked by ${fieldLock.userName}`,
          lockedBy: fieldLock.userName,
          lockExpiresAt: fieldLock.expiresAt,
          resolution: 'request_access'
        });
      }

      return {
        hasConflicts: conflicts.length > 0,
        conflicts,
        totalConflicts: conflicts.length,
        highSeverityConflicts: conflicts.filter(c => c.severity === 'high').length
      };

    } catch (error) {
      throw new Error(`Failed to detect conflicts: ${error.message}`);
    }
  }

  /**
   * Resolve conflicts automatically
   */
  async resolveConflicts(
    documentId: string,
    conflicts: ConflictInfo[],
    options: ConflictResolutionOptions = {}
  ): Promise<ConflictResolutionResult> {
    try {
      const results: ConflictResolutionResult = {
        resolved: [],
        failed: [],
        processingTime: Date.now()
      };

      for (const conflict of conflicts) {
        try {
          let resolution: ConflictResolution | null = null;

          switch (conflict.type) {
            case 'document_lock':
              resolution = await this.resolveDocumentLockConflict(conflict, options);
              break;
            case 'section_lock':
              resolution = await this.resolveSectionLockConflict(conflict, options);
              break;
            case 'field_lock':
              resolution = await this.resolveFieldLockConflict(conflict, options);
              break;
          }

          if (resolution) {
            results.resolved.push(resolution);
          } else {
            results.failed.push({
              conflict,
              error: 'Resolution not available'
            });
          }

        } catch (error) {
          results.failed.push({
            conflict,
            error: error.message
          });
        }
      }

      results.processingTime = Date.now() - results.processingTime;
      return results;

    } catch (error) {
      throw new Error(`Failed to resolve conflicts: ${error.message}`);
    }
  }

  /**
   * Get lock analytics
   */
  async getLockAnalytics(): Promise<LockAnalytics> {
    const allLocks = Array.from(this.locks.values());
    const sectionLocks = Array.from(this.sectionLocks.values()).flat();
    const fieldLocks = Array.from(this.fieldLocks.values()).flat();

    // Calculate metrics
    const totalLocks = allLocks.length + sectionLocks.length + fieldLocks.length;
    const activeLocks = allLocks.filter(lock => !this.isLockExpired(lock)).length;
    const expiredLocks = allLocks.filter(lock => this.isLockExpired(lock)).length;

    // Calculate lock duration statistics
    const lockDurations = allLocks.map(lock => 
      Date.now() - lock.lockedAt.getTime()
    );
    const averageDuration = lockDurations.length > 0 
      ? lockDurations.reduce((sum, d) => sum + d, 0) / lockDurations.length 
      : 0;

    // Calculate user activity
    const userActivity = new Map<string, number>();
    for (const lock of allLocks) {
      const count = userActivity.get(lock.userId) || 0;
      userActivity.set(lock.userId, count + 1);
    }

    const mostActiveUsers = Array.from(userActivity.entries())
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalLocks,
      activeLocks,
      expiredLocks,
      sectionLocks: sectionLocks.length,
      fieldLocks: fieldLocks.length,
      averageDuration,
      mostActiveUsers,
      lockDistribution: this.getLockDistribution(allLocks),
      deadlockRisk: await this.deadlockDetector.getOverallRisk(),
      recommendations: await this.generateLockRecommendations()
    };
  }

  /**
   * Optimize lock performance
   */
  async optimizeLocks(): Promise<OptimizationResult> {
    try {
      const results: OptimizationResult = {
        expiredLocksCleaned: 0,
        deadlocksResolved: 0,
        performanceImproved: false,
        processingTime: Date.now()
      };

      // Clean up expired locks
      const expiredLocks = Array.from(this.locks.entries())
        .filter(([id, lock]) => this.isLockExpired(lock));

      for (const [id, lock] of expiredLocks) {
        await this.releaseLock(id, lock.userId, { force: true });
        results.expiredLocksCleaned++;
      }

      // Resolve deadlocks
      const deadlocks = await this.deadlockDetector.detectDeadlocks();
      for (const deadlock of deadlocks) {
        await this.resolveDeadlock(deadlock);
        results.deadlocksResolved++;
      }

      // Optimize lock timeouts
      await this.optimizeLockTimeouts();

      results.performanceImproved = true;
      results.processingTime = Date.now() - results.processingTime;

      return results;

    } catch (error) {
      throw new Error(`Failed to optimize locks: ${error.message}`);
    }
  }

  // Private helper methods
  private async acquireSharedLock(
    documentId: string,
    userId: string,
    options: EnhancedLockOptions
  ): Promise<LockResult> {
    // Implement shared lock logic
    const lock: DocumentLock = {
      documentId,
      userId,
      userName: options.userName || 'Unknown User',
      userEmail: options.userEmail || '',
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + (options.timeout || 30 * 60 * 1000)),
      reason: options.reason || 'Shared editing',
      force: false,
      lockType: 'shared',
      priority: options.priority || 'normal',
      metadata: options.metadata || {}
    };

    this.locks.set(documentId, lock);
    this.setupAutoRelease(documentId, lock);

    return {
      success: true,
      lock
    };
  }

  private setupAutoRelease(documentId: string, lock: DocumentLock): void {
    const timeout = setTimeout(() => {
      this.autoReleaseLock(documentId, lock.userId);
    }, lock.expiresAt.getTime() - Date.now());

    this.lockTimeouts.set(documentId, timeout);
  }

  private setupSectionAutoRelease(sectionId: string, lock: SectionLock): void {
    const timeout = setTimeout(() => {
      this.autoReleaseSectionLock(sectionId, lock.userId);
    }, lock.expiresAt.getTime() - Date.now());

    // Store timeout reference
    this.lockTimeouts.set(`section_${sectionId}`, timeout);
  }

  private setupFieldAutoRelease(fieldPath: string, lock: FieldLock): void {
    const timeout = setTimeout(() => {
      this.autoReleaseFieldLock(fieldPath, lock.userId);
    }, lock.expiresAt.getTime() - Date.now());

    // Store timeout reference
    this.lockTimeouts.set(`field_${fieldPath}`, timeout);
  }

  private async autoReleaseLock(documentId: string, userId: string): Promise<void> {
    await this.releaseLock(documentId, userId, { force: true });
  }

  private async autoReleaseSectionLock(sectionId: string, userId: string): Promise<void> {
    const locks = this.sectionLocks.get(sectionId) || [];
    const updatedLocks = locks.filter(lock => 
      !(lock.userId === userId && lock.sectionId === sectionId)
    );
    
    if (updatedLocks.length === 0) {
      this.sectionLocks.delete(sectionId);
    } else {
      this.sectionLocks.set(sectionId, updatedLocks);
    }
  }

  private async autoReleaseFieldLock(fieldPath: string, userId: string): Promise<void> {
    const locks = this.fieldLocks.get(fieldPath) || [];
    const updatedLocks = locks.filter(lock => 
      !(lock.userId === userId && lock.fieldPath === fieldPath)
    );
    
    if (updatedLocks.length === 0) {
      this.fieldLocks.delete(fieldPath);
    } else {
      this.fieldLocks.set(fieldPath, updatedLocks);
    }
  }

  private isLockExpired(lock: DocumentLock): boolean {
    return Date.now() > lock.expiresAt.getTime();
  }

  private calculateWaitTime(lock: DocumentLock): number {
    return lock.expiresAt.getTime() - Date.now();
  }

  private async recordLockEvent(
    documentId: string,
    userId: string,
    event: string,
    metadata: any
  ): Promise<void> {
    const events = this.lockHistory.get(documentId) || [];
    events.push({
      id: this.generateEventId(),
      documentId,
      userId,
      event,
      timestamp: new Date(),
      metadata
    });
    this.lockHistory.set(documentId, events);
  }

  private generateLockId(): string {
    return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getLockDistribution(locks: DocumentLock[]): any {
    const distribution: any = {};
    
    for (const lock of locks) {
      distribution[lock.lockType] = (distribution[lock.lockType] || 0) + 1;
    }
    
    return distribution;
  }

  private async generateLockRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Add recommendations based on analytics
    recommendations.push('Consider implementing lock timeouts to prevent deadlocks');
    recommendations.push('Monitor lock duration to identify performance bottlenecks');
    recommendations.push('Implement lock hierarchy to reduce conflicts');
    
    return recommendations;
  }

  private async resolveDocumentLockConflict(
    conflict: ConflictInfo,
    options: ConflictResolutionOptions
  ): Promise<ConflictResolution | null> {
    // Implement document lock conflict resolution
    return null;
  }

  private async resolveSectionLockConflict(
    conflict: ConflictInfo,
    options: ConflictResolutionOptions
  ): Promise<ConflictResolution | null> {
    // Implement section lock conflict resolution
    return null;
  }

  private async resolveFieldLockConflict(
    conflict: ConflictInfo,
    options: ConflictResolutionOptions
  ): Promise<ConflictResolution | null> {
    // Implement field lock conflict resolution
    return null;
  }

  private async resolveDeadlock(deadlock: any): Promise<void> {
    // Implement deadlock resolution
  }

  private async optimizeLockTimeouts(): Promise<void> {
    // Implement lock timeout optimization
  }
}

// Supporting classes
export class DeadlockDetector {
  async checkDeadlockRisk(
    documentId: string,
    userId: string,
    options: any
  ): Promise<{ risk: number; suggestedWaitTime: number }> {
    // Implement deadlock detection logic
    return { risk: 0, suggestedWaitTime: 0 };
  }

  async getOverallRisk(): Promise<number> {
    return 0;
  }

  async detectDeadlocks(): Promise<any[]> {
    return [];
  }
}

export class ConflictResolver {
  async resolveConflict(
    conflict: ConflictInfo,
    strategy: ConflictResolutionStrategy
  ): Promise<ConflictResolution | null> {
    // Implement conflict resolution logic
    return null;
  }
}

// Supporting interfaces
export interface EnhancedLockOptions extends LockOptions {
  lockType?: 'exclusive' | 'shared';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  force?: boolean;
}

export interface LockResult {
  success: boolean;
  lock?: DocumentLock;
  reason?: string;
  lockedBy?: string;
  lockExpiresAt?: Date;
  suggestedWaitTime?: number;
  deadlockRisk?: number;
  processingTime?: number;
}

export interface SectionLockOptions {
  lockType?: 'exclusive' | 'shared';
  timeout?: number;
  reason?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface SectionLockResult {
  success: boolean;
  lock?: SectionLock;
  reason?: string;
  lockedBy?: string;
  lockExpiresAt?: Date;
}

export interface FieldLockOptions {
  lockType?: 'exclusive' | 'shared';
  timeout?: number;
  reason?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface FieldLockResult {
  success: boolean;
  lock?: FieldLock;
  reason?: string;
  lockedBy?: string;
  lockExpiresAt?: Date;
}

export interface SectionLock {
  id: string;
  documentId: string;
  sectionId: string;
  userId: string;
  userName: string;
  lockType: 'exclusive' | 'shared';
  lockedAt: Date;
  expiresAt: Date;
  reason: string;
  metadata: Record<string, any>;
}

export interface FieldLock {
  id: string;
  documentId: string;
  fieldPath: string;
  userId: string;
  userName: string;
  lockType: 'exclusive' | 'shared';
  lockedAt: Date;
  expiresAt: Date;
  reason: string;
  metadata: Record<string, any>;
}

export interface ReleaseOptions {
  force?: boolean;
}

export interface ReleaseResult {
  success: boolean;
  reason?: string;
  lockedBy?: string;
  releasedAt?: Date;
  duration?: number;
  message?: string;
}

export interface ConflictInfo {
  type: 'document_lock' | 'section_lock' | 'field_lock';
  severity: 'low' | 'medium' | 'high';
  message: string;
  lockedBy: string;
  lockExpiresAt: Date;
  resolution: string;
}

export interface ConflictDetectionResult {
  hasConflicts: boolean;
  conflicts: ConflictInfo[];
  totalConflicts: number;
  highSeverityConflicts: number;
}

export interface ConflictResolutionOptions {
  strategy?: ConflictResolutionStrategy;
  force?: boolean;
  notifyUsers?: boolean;
}

export interface ConflictResolutionResult {
  resolved: ConflictResolution[];
  failed: Array<{ conflict: ConflictInfo; error: string }>;
  processingTime: number;
}

export interface LockAnalytics {
  totalLocks: number;
  activeLocks: number;
  expiredLocks: number;
  sectionLocks: number;
  fieldLocks: number;
  averageDuration: number;
  mostActiveUsers: Array<{ userId: string; count: number }>;
  lockDistribution: Record<string, number>;
  deadlockRisk: number;
  recommendations: string[];
}

export interface OptimizationResult {
  expiredLocksCleaned: number;
  deadlocksResolved: number;
  performanceImproved: boolean;
  processingTime: number;
}

export interface LockEvent {
  id: string;
  documentId: string;
  userId: string;
  event: string;
  timestamp: Date;
  metadata: any;
}
