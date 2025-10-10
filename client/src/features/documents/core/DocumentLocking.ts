import { BaseDocument } from '../types/document.types';

/**
 * Document Locking - Handles document locking and conflict resolution
 * 
 * This locking system provides:
 * - Document locking for editing
 * - Conflict detection and resolution
 * - Lock timeout management
 * - User presence tracking
 * - Lock notifications
 */
export class DocumentLocking {
  private locks: Map<string, DocumentLock> = new Map();
  private lockTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private defaultLockTimeout = 30 * 60 * 1000; // 30 minutes

  /**
   * Lock a document for editing
   */
  async lock(documentId: string, userId: string, options: LockOptions = {}): Promise<void> {
    const existingLock = this.locks.get(documentId);
    
    if (existingLock && existingLock.userId !== userId) {
      // Check if lock has expired
      if (this.isLockExpired(existingLock)) {
        await this.unlock(documentId, existingLock.userId);
      } else {
        throw new Error(`Document is locked by ${existingLock.userName} (${existingLock.userEmail})`);
      }
    }

    const lock: DocumentLock = {
      documentId,
      userId,
      userName: options.userName || 'Unknown User',
      userEmail: options.userEmail || '',
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + (options.timeout || this.defaultLockTimeout)),
      reason: options.reason || 'Editing',
      force: options.force || false
    };

    this.locks.set(documentId, lock);

    // Set timeout to auto-unlock
    const timeout = setTimeout(() => {
      this.autoUnlock(documentId);
    }, options.timeout || this.defaultLockTimeout);

    this.lockTimeouts.set(documentId, timeout);

    // Emit lock event
    this.emitLockEvent('document:locked', { documentId, userId, lock });
  }

  /**
   * Unlock a document
   */
  async unlock(documentId: string, userId: string): Promise<void> {
    const lock = this.locks.get(documentId);
    
    if (!lock) {
      return; // Already unlocked
    }

    if (lock.userId !== userId) {
      throw new Error('You cannot unlock a document locked by another user');
    }

    // Clear timeout
    const timeout = this.lockTimeouts.get(documentId);
    if (timeout) {
      clearTimeout(timeout);
      this.lockTimeouts.delete(documentId);
    }

    // Remove lock
    this.locks.delete(documentId);

    // Emit unlock event
    this.emitLockEvent('document:unlocked', { documentId, userId });
  }

  /**
   * Force unlock a document (admin only)
   */
  async forceUnlock(documentId: string, adminUserId: string): Promise<void> {
    const lock = this.locks.get(documentId);
    
    if (!lock) {
      return; // Already unlocked
    }

    // Clear timeout
    const timeout = this.lockTimeouts.get(documentId);
    if (timeout) {
      clearTimeout(timeout);
      this.lockTimeouts.delete(documentId);
    }

    // Remove lock
    this.locks.delete(documentId);

    // Emit force unlock event
    this.emitLockEvent('document:force_unlocked', { 
      documentId, 
      adminUserId, 
      originalUserId: lock.userId 
    });
  }

  /**
   * Check if document is locked
   */
  async isLocked(documentId: string): Promise<boolean> {
    const lock = this.locks.get(documentId);
    
    if (!lock) {
      return false;
    }

    // Check if lock has expired
    if (this.isLockExpired(lock)) {
      await this.unlock(documentId, lock.userId);
      return false;
    }

    return true;
  }

  /**
   * Get lock information
   */
  async getLock(documentId: string): Promise<DocumentLock | null> {
    const lock = this.locks.get(documentId);
    
    if (!lock) {
      return null;
    }

    // Check if lock has expired
    if (this.isLockExpired(lock)) {
      await this.unlock(documentId, lock.userId);
      return null;
    }

    return lock;
  }

  /**
   * Extend lock timeout
   */
  async extendLock(documentId: string, userId: string, additionalTime: number): Promise<void> {
    const lock = this.locks.get(documentId);
    
    if (!lock || lock.userId !== userId) {
      throw new Error('Document is not locked by you');
    }

    // Update expiration time
    lock.expiresAt = new Date(Date.now() + additionalTime);

    // Clear existing timeout
    const timeout = this.lockTimeouts.get(documentId);
    if (timeout) {
      clearTimeout(timeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      this.autoUnlock(documentId);
    }, additionalTime);

    this.lockTimeouts.set(documentId, newTimeout);

    // Emit extend event
    this.emitLockEvent('document:lock_extended', { documentId, userId, additionalTime });
  }

  /**
   * Get all active locks
   */
  async getActiveLocks(): Promise<DocumentLock[]> {
    const activeLocks: DocumentLock[] = [];
    
    for (const [documentId, lock] of this.locks) {
      if (!this.isLockExpired(lock)) {
        activeLocks.push(lock);
      } else {
        // Clean up expired lock
        await this.unlock(documentId, lock.userId);
      }
    }

    return activeLocks;
  }

  /**
   * Get locks for a user
   */
  async getUserLocks(userId: string): Promise<DocumentLock[]> {
    const userLocks: DocumentLock[] = [];
    
    for (const [documentId, lock] of this.locks) {
      if (lock.userId === userId && !this.isLockExpired(lock)) {
        userLocks.push(lock);
      }
    }

    return userLocks;
  }

  /**
   * Check if user can edit document
   */
  async canEdit(documentId: string, userId: string): Promise<{
    canEdit: boolean;
    reason?: string;
    lockInfo?: DocumentLock;
  }> {
    const lock = await this.getLock(documentId);
    
    if (!lock) {
      return { canEdit: true };
    }

    if (lock.userId === userId) {
      return { canEdit: true, lockInfo: lock };
    }

    return {
      canEdit: false,
      reason: `Document is locked by ${lock.userName}`,
      lockInfo: lock
    };
  }

  /**
   * Get lock statistics
   */
  async getLockStats(): Promise<{
    totalLocks: number;
    activeLocks: number;
    expiredLocks: number;
    averageLockDuration: number;
    mostActiveUsers: UserLockStats[];
  }> {
    const stats = {
      totalLocks: this.locks.size,
      activeLocks: 0,
      expiredLocks: 0,
      averageLockDuration: 0,
      mostActiveUsers: [] as UserLockStats[]
    };

    const userStats = new Map<string, UserLockStats>();

    for (const lock of this.locks.values()) {
      if (this.isLockExpired(lock)) {
        stats.expiredLocks++;
      } else {
        stats.activeLocks++;
      }

      // Track user stats
      const userStat = userStats.get(lock.userId) || {
        userId: lock.userId,
        userName: lock.userName,
        totalLocks: 0,
        totalDuration: 0,
        averageDuration: 0
      };

      userStat.totalLocks++;
      userStat.totalDuration += Date.now() - lock.lockedAt.getTime();
      userStat.averageDuration = userStat.totalDuration / userStat.totalLocks;

      userStats.set(lock.userId, userStat);
    }

    stats.mostActiveUsers = Array.from(userStats.values())
      .sort((a, b) => b.totalLocks - a.totalLocks)
      .slice(0, 10);

    return stats;
  }

  /**
   * Clean up expired locks
   */
  async cleanupExpiredLocks(): Promise<number> {
    let cleanedCount = 0;
    const expiredLocks: string[] = [];

    for (const [documentId, lock] of this.locks) {
      if (this.isLockExpired(lock)) {
        expiredLocks.push(documentId);
      }
    }

    for (const documentId of expiredLocks) {
      const lock = this.locks.get(documentId);
      if (lock) {
        await this.unlock(documentId, lock.userId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Check if lock has expired
   */
  private isLockExpired(lock: DocumentLock): boolean {
    return Date.now() > lock.expiresAt.getTime();
  }

  /**
   * Auto-unlock expired document
   */
  private autoUnlock(documentId: string): void {
    const lock = this.locks.get(documentId);
    if (lock) {
      this.locks.delete(documentId);
      this.lockTimeouts.delete(documentId);
      
      this.emitLockEvent('document:auto_unlocked', { 
        documentId, 
        userId: lock.userId,
        reason: 'Lock expired'
      });
    }
  }

  /**
   * Emit lock event
   */
  private emitLockEvent(event: string, data: any): void {
    // In a real implementation, this would emit events to listeners
    console.log(`Lock event: ${event}`, data);
  }
}

// Supporting interfaces
export interface DocumentLock {
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  lockedAt: Date;
  expiresAt: Date;
  reason: string;
  force: boolean;
}

export interface LockOptions {
  timeout?: number;
  reason?: string;
  userName?: string;
  userEmail?: string;
  force?: boolean;
}

export interface UserLockStats {
  userId: string;
  userName: string;
  totalLocks: number;
  totalDuration: number;
  averageDuration: number;
}
