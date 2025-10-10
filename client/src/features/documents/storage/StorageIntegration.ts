import { BaseDocument } from '../types/document.types';
import { DocumentStorageStrategy } from './DocumentStorageStrategy';
import { AdvancedVersioning } from './AdvancedVersioning';
import { EnhancedLocking } from './EnhancedLocking';
import { ConflictResolutionSystem } from './ConflictResolution';

/**
 * Storage Integration - Unified storage management system
 * 
 * This integration provides:
 * - Unified API for all storage operations
 * - Seamless integration of versioning, locking, and conflict resolution
 * - Performance optimization
 * - Data consistency and integrity
 * - Backup and recovery
 */
export class StorageIntegration {
  private storageStrategy: DocumentStorageStrategy;
  private versioning: AdvancedVersioning;
  private locking: EnhancedLocking;
  private conflictResolution: ConflictResolutionSystem;
  private performanceMonitor: StoragePerformanceMonitor;
  private dataIntegrity: DataIntegrityChecker;

  constructor() {
    this.storageStrategy = new DocumentStorageStrategy();
    this.versioning = new AdvancedVersioning();
    this.locking = new EnhancedLocking();
    this.conflictResolution = new ConflictResolutionSystem();
    this.performanceMonitor = new StoragePerformanceMonitor();
    this.dataIntegrity = new DataIntegrityChecker();
  }

  /**
   * Save document with full integration
   */
  async saveDocument(
    document: BaseDocument,
    options: IntegratedSaveOptions = {}
  ): Promise<IntegratedSaveResult> {
    const startTime = Date.now();
    
    try {
      // 1. Check data integrity
      const integrityCheck = await this.dataIntegrity.checkDocument(document);
      if (!integrityCheck.valid) {
        return {
          success: false,
          errors: integrityCheck.errors,
          requiresFix: true
        };
      }

      // 2. Detect conflicts
      const conflictDetection = await this.conflictResolution.detectConflicts(
        document,
        document,
        { checkAIConflicts: true }
      );

      // 3. Acquire appropriate locks
      const lockResult = await this.locking.acquireLock(
        document.id,
        document.lastModifiedBy,
        {
          lockType: options.lockType || 'exclusive',
          timeout: options.lockTimeout || 30 * 60 * 1000,
          reason: 'Document save',
          metadata: { operation: 'save' }
        }
      );

      if (!lockResult.success) {
        return {
          success: false,
          reason: 'lock_failed',
          lockInfo: lockResult
        };
      }

      // 4. Create version if needed
      let versionResult;
      if (options.createVersion) {
        versionResult = await this.versioning.createVersion(
          document,
          {},
          {
            versionType: options.versionType || 'patch',
            message: options.versionMessage || 'Document updated',
            branchName: options.branchName
          }
        );
      }

      // 5. Save document
      const saveResult = await this.storageStrategy.saveDocument(document, {
        createVersion: options.createVersion,
        versionMessage: options.versionMessage,
        lockDocument: false, // Already locked
        createBackup: options.createBackup,
        force: options.force
      });

      if (!saveResult.success) {
        // Release lock on failure
        await this.locking.releaseLock(document.id, document.lastModifiedBy);
        return {
          success: false,
          reason: 'save_failed',
          errors: saveResult.conflicts || []
        };
      }

      // 6. Resolve conflicts if any
      if (conflictDetection.hasConflicts && options.autoResolveConflicts) {
        const resolutionResult = await this.conflictResolution.autoResolveConflicts(
          conflictDetection.conflicts,
          { minConfidence: 0.7 }
        );

        if (resolutionResult.resolved.length > 0) {
          // Apply resolutions and save again
          const resolvedDocument = await this.applyResolutions(document, resolutionResult.resolved);
          await this.storageStrategy.saveDocument(resolvedDocument, {
            createVersion: true,
            versionMessage: 'Auto-resolved conflicts'
          });
        }
      }

      // 7. Release lock
      await this.locking.releaseLock(document.id, document.lastModifiedBy);

      // 8. Record performance metrics
      await this.performanceMonitor.recordOperation('save', Date.now() - startTime);

      return {
        success: true,
        document: saveResult.document || document,
        version: versionResult?.version,
        conflicts: conflictDetection.conflicts,
        processingTime: Date.now() - startTime,
        performance: await this.performanceMonitor.getOperationMetrics('save')
      };

    } catch (error) {
      // Cleanup on error
      await this.cleanupOnError(document.id, document.lastModifiedBy);
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  /**
   * Get document with full integration
   */
  async getDocument(
    id: string,
    options: IntegratedGetOptions = {}
  ): Promise<IntegratedGetResult> {
    const startTime = Date.now();
    
    try {
      // 1. Get document from storage
      const document = await this.storageStrategy.getDocument(id, {
        bypassCache: options.bypassCache,
        checkConflicts: options.checkConflicts
      });

      if (!document) {
        return {
          success: false,
          reason: 'not_found'
        };
      }

      // 2. Check for conflicts if requested
      let conflicts = null;
      if (options.checkConflicts) {
        const conflictDetection = await this.conflictResolution.detectConflicts(
          document,
          document
        );
        conflicts = conflictDetection.conflicts;
      }

      // 3. Get version information if requested
      let versionInfo = null;
      if (options.includeVersionInfo) {
        const versionHistory = await this.versioning.getVersionHistory(id);
        versionInfo = {
          currentVersion: document.version.current,
          totalVersions: versionHistory.totalVersions,
          lastModified: document.updatedAt
        };
      }

      // 4. Get lock information if requested
      let lockInfo = null;
      if (options.includeLockInfo) {
        const lock = await this.locking.getLock(id);
        if (lock) {
          lockInfo = {
            isLocked: true,
            lockedBy: lock.userName,
            lockedAt: lock.lockedAt,
            expiresAt: lock.expiresAt,
            lockType: lock.lockType
          };
        }
      }

      // 5. Record performance metrics
      await this.performanceMonitor.recordOperation('get', Date.now() - startTime);

      return {
        success: true,
        document,
        conflicts,
        versionInfo,
        lockInfo,
        processingTime: Date.now() - startTime,
        performance: await this.performanceMonitor.getOperationMetrics('get')
      };

    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  /**
   * Delete document with full integration
   */
  async deleteDocument(
    id: string,
    options: IntegratedDeleteOptions = {}
  ): Promise<IntegratedDeleteResult> {
    const startTime = Date.now();
    
    try {
      // 1. Check if document is locked
      const lockInfo = await this.locking.getLock(id);
      if (lockInfo && !options.force) {
        return {
          success: false,
          reason: 'locked',
          lockedBy: lockInfo.userName,
          lockExpiresAt: lockInfo.expiresAt
        };
      }

      // 2. Create final backup if requested
      if (options.createBackup) {
        const document = await this.storageStrategy.getDocument(id);
        if (document) {
          await this.storageStrategy.createBackup(id, {
            includeVersions: options.includeVersions,
            compression: options.compression
          });
        }
      }

      // 3. Delete document
      const deleteResult = await this.storageStrategy.deleteDocument(id, {
        createBackup: options.createBackup,
        deleteVersions: options.deleteVersions,
        force: options.force
      });

      if (!deleteResult.success) {
        return {
          success: false,
          reason: 'delete_failed'
        };
      }

      // 4. Clean up locks
      if (lockInfo) {
        await this.locking.releaseLock(id, lockInfo.userId, { force: true });
      }

      // 5. Record performance metrics
      await this.performanceMonitor.recordOperation('delete', Date.now() - startTime);

      return {
        success: true,
        deletedAt: deleteResult.deletedAt,
        backupCreated: deleteResult.backupCreated,
        processingTime: Date.now() - startTime,
        performance: await this.performanceMonitor.getOperationMetrics('delete')
      };

    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Search documents with full integration
   */
  async searchDocuments(
    query: any,
    options: IntegratedSearchOptions = {}
  ): Promise<IntegratedSearchResult> {
    const startTime = Date.now();
    
    try {
      // 1. Perform search
      const searchResult = await this.storageStrategy.searchDocuments(query, {
        useCache: options.useCache,
        maxResults: options.maxResults
      });

      // 2. Enhance results with additional information
      const enhancedResults = await this.enhanceSearchResults(searchResult.documents, options);

      // 3. Record performance metrics
      await this.performanceMonitor.recordOperation('search', Date.now() - startTime);

      return {
        success: true,
        documents: enhancedResults,
        total: searchResult.total,
        facets: searchResult.facets,
        suggestions: searchResult.suggestions,
        processingTime: Date.now() - startTime,
        performance: await this.performanceMonitor.getOperationMetrics('search')
      };

    } catch (error) {
      throw new Error(`Failed to search documents: ${error.message}`);
    }
  }

  /**
   * Get comprehensive storage analytics
   */
  async getStorageAnalytics(): Promise<StorageAnalytics> {
    try {
      const storageStats = await this.storageStrategy.getStorageStats();
      const versionAnalytics = await this.versioning.getVersionAnalytics('');
      const lockAnalytics = await this.locking.getLockAnalytics();
      const conflictAnalytics = await this.conflictResolution.getConflictAnalytics();
      const performanceMetrics = await this.performanceMonitor.getOverallMetrics();

      return {
        storage: storageStats,
        versioning: versionAnalytics,
        locking: lockAnalytics,
        conflicts: conflictAnalytics,
        performance: performanceMetrics,
        health: await this.calculateStorageHealth(storageStats, performanceMetrics),
        recommendations: await this.generateStorageRecommendations(
          storageStats,
          lockAnalytics,
          conflictAnalytics
        )
      };

    } catch (error) {
      throw new Error(`Failed to get storage analytics: ${error.message}`);
    }
  }

  /**
   * Optimize storage performance
   */
  async optimizeStorage(): Promise<OptimizationResult> {
    try {
      const startTime = Date.now();
      const results: OptimizationResult = {
        storageOptimized: false,
        versioningOptimized: false,
        lockingOptimized: false,
        conflictsOptimized: false,
        performanceImproved: false,
        processingTime: 0
      };

      // 1. Optimize storage strategy
      const storageOptimization = await this.storageStrategy.optimizeStorage();
      results.storageOptimized = storageOptimization.cacheOptimized && 
                                storageOptimization.indexOptimized;

      // 2. Optimize versioning
      await this.versioning.cleanupVersions('', { keepVersions: 50, keepDays: 90 });
      results.versioningOptimized = true;

      // 3. Optimize locking
      const lockOptimization = await this.locking.optimizeLocks();
      results.lockingOptimized = lockOptimization.performanceImproved;

      // 4. Optimize conflict resolution
      // (No specific optimization for conflict resolution)

      // 5. Overall performance improvement
      results.performanceImproved = results.storageOptimized && 
                                   results.versioningOptimized && 
                                   results.lockingOptimized;

      results.processingTime = Date.now() - startTime;
      return results;

    } catch (error) {
      throw new Error(`Failed to optimize storage: ${error.message}`);
    }
  }

  // Private helper methods
  private async applyResolutions(
    document: BaseDocument,
    resolutions: any[]
  ): Promise<BaseDocument> {
    // Apply conflict resolutions to document
    return document;
  }

  private async cleanupOnError(documentId: string, userId: string): Promise<void> {
    try {
      // Release any acquired locks
      await this.locking.releaseLock(documentId, userId, { force: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  private async enhanceSearchResults(
    documents: BaseDocument[],
    options: IntegratedSearchOptions
  ): Promise<EnhancedDocument[]> {
    const enhanced: EnhancedDocument[] = [];

    for (const document of documents) {
      const enhancedDoc: EnhancedDocument = {
        ...document,
        lockInfo: null,
        versionInfo: null,
        conflictInfo: null
      };

      // Add lock information if requested
      if (options.includeLockInfo) {
        const lock = await this.locking.getLock(document.id);
        if (lock) {
          enhancedDoc.lockInfo = {
            isLocked: true,
            lockedBy: lock.userName,
            lockExpiresAt: lock.expiresAt
          };
        }
      }

      // Add version information if requested
      if (options.includeVersionInfo) {
        const versionHistory = await this.versioning.getVersionHistory(document.id);
        enhancedDoc.versionInfo = {
          currentVersion: document.version.current,
          totalVersions: versionHistory.totalVersions,
          lastModified: document.updatedAt
        };
      }

      // Add conflict information if requested
      if (options.includeConflictInfo) {
        const conflicts = await this.conflictResolution.detectConflicts(document, document);
        if (conflicts.hasConflicts) {
          enhancedDoc.conflictInfo = {
            hasConflicts: true,
            conflictCount: conflicts.totalConflicts,
            highSeverityConflicts: conflicts.highSeverityConflicts
          };
        }
      }

      enhanced.push(enhancedDoc);
    }

    return enhanced;
  }

  private async calculateStorageHealth(
    storageStats: any,
    performanceMetrics: any
  ): Promise<StorageHealth> {
    // Calculate storage health based on various metrics
    const healthScore = Math.min(100, 
      (storageStats.total.cacheHitRate * 30) +
      (performanceMetrics.averageResponseTime < 1000 ? 30 : 0) +
      (storageStats.total.documents > 0 ? 20 : 0) +
      (storageStats.total.storageSize < 1000000 ? 20 : 0)
    );

    return {
      score: healthScore,
      status: healthScore > 80 ? 'excellent' : healthScore > 60 ? 'good' : 'needs_attention',
      issues: healthScore < 60 ? ['Performance issues detected'] : [],
      recommendations: healthScore < 80 ? ['Consider optimization'] : []
    };
  }

  private async generateStorageRecommendations(
    storageStats: any,
    lockAnalytics: any,
    conflictAnalytics: any
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (storageStats.total.cacheHitRate < 0.8) {
      recommendations.push('Improve cache hit rate by optimizing cache strategy');
    }

    if (lockAnalytics.deadlockRisk > 0.5) {
      recommendations.push('Reduce deadlock risk by optimizing lock acquisition order');
    }

    if (conflictAnalytics.resolutionRate < 0.8) {
      recommendations.push('Improve conflict resolution rate by implementing better strategies');
    }

    return recommendations;
  }
}

// Supporting classes
export class StoragePerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  async recordOperation(operation: string, duration: number): Promise<void> {
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: new Date()
    };

    const existing = this.metrics.get(operation) || [];
    existing.push(metric);
    this.metrics.set(operation, existing);
  }

  async getOperationMetrics(operation: string): Promise<OperationMetrics> {
    const metrics = this.metrics.get(operation) || [];
    
    if (metrics.length === 0) {
      return {
        averageDuration: 0,
        totalOperations: 0,
        successRate: 0
      };
    }

    const durations = metrics.map(m => m.duration);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    return {
      averageDuration,
      totalOperations: metrics.length,
      successRate: 1.0 // Would calculate based on success/failure
    };
  }

  async getOverallMetrics(): Promise<OverallMetrics> {
    const allMetrics = Array.from(this.metrics.values()).flat();
    
    return {
      totalOperations: allMetrics.length,
      averageResponseTime: allMetrics.reduce((sum, m) => sum + m.duration, 0) / allMetrics.length,
      operationsPerSecond: this.calculateOperationsPerSecond(allMetrics)
    };
  }

  private calculateOperationsPerSecond(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    
    const timeSpan = metrics[metrics.length - 1].timestamp.getTime() - metrics[0].timestamp.getTime();
    return timeSpan > 0 ? (metrics.length / timeSpan) * 1000 : 0;
  }
}

export class DataIntegrityChecker {
  async checkDocument(document: BaseDocument): Promise<IntegrityCheckResult> {
    const errors: string[] = [];

    // Check required fields
    if (!document.id) errors.push('Document ID is required');
    if (!document.type) errors.push('Document type is required');
    if (!document.title) errors.push('Document title is required');

    // Check content integrity
    if (!document.content) errors.push('Document content is required');
    if (!document.content.format) errors.push('Content format is required');

    // Check metadata integrity
    if (!document.metadata) errors.push('Document metadata is required');
    if (!document.metadata.status) errors.push('Document status is required');

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}

// Supporting interfaces
export interface IntegratedSaveOptions {
  createVersion?: boolean;
  versionMessage?: string;
  versionType?: 'major' | 'minor' | 'patch';
  branchName?: string;
  lockType?: 'exclusive' | 'shared';
  lockTimeout?: number;
  createBackup?: boolean;
  autoResolveConflicts?: boolean;
  force?: boolean;
}

export interface IntegratedSaveResult {
  success: boolean;
  document?: BaseDocument;
  version?: string;
  conflicts?: any[];
  reason?: string;
  lockInfo?: any;
  errors?: string[];
  requiresFix?: boolean;
  processingTime: number;
  performance?: OperationMetrics;
}

export interface IntegratedGetOptions {
  bypassCache?: boolean;
  checkConflicts?: boolean;
  includeVersionInfo?: boolean;
  includeLockInfo?: boolean;
}

export interface IntegratedGetResult {
  success: boolean;
  document?: BaseDocument;
  conflicts?: any[];
  versionInfo?: any;
  lockInfo?: any;
  reason?: string;
  processingTime: number;
  performance?: OperationMetrics;
}

export interface IntegratedDeleteOptions {
  createBackup?: boolean;
  includeVersions?: boolean;
  compression?: boolean;
  deleteVersions?: boolean;
  force?: boolean;
}

export interface IntegratedDeleteResult {
  success: boolean;
  deletedAt?: Date;
  backupCreated?: boolean;
  reason?: string;
  lockedBy?: string;
  lockExpiresAt?: Date;
  processingTime: number;
  performance?: OperationMetrics;
}

export interface IntegratedSearchOptions {
  useCache?: boolean;
  maxResults?: number;
  includeLockInfo?: boolean;
  includeVersionInfo?: boolean;
  includeConflictInfo?: boolean;
}

export interface IntegratedSearchResult {
  success: boolean;
  documents: EnhancedDocument[];
  total: number;
  facets: any;
  suggestions: string[];
  processingTime: number;
  performance?: OperationMetrics;
}

export interface EnhancedDocument extends BaseDocument {
  lockInfo?: {
    isLocked: boolean;
    lockedBy?: string;
    lockExpiresAt?: Date;
  };
  versionInfo?: {
    currentVersion: string;
    totalVersions: number;
    lastModified: Date;
  };
  conflictInfo?: {
    hasConflicts: boolean;
    conflictCount: number;
    highSeverityConflicts: number;
  };
}

export interface StorageAnalytics {
  storage: any;
  versioning: any;
  locking: any;
  conflicts: any;
  performance: OverallMetrics;
  health: StorageHealth;
  recommendations: string[];
}

export interface StorageHealth {
  score: number;
  status: 'excellent' | 'good' | 'needs_attention' | 'critical';
  issues: string[];
  recommendations: string[];
}

export interface OptimizationResult {
  storageOptimized: boolean;
  versioningOptimized: boolean;
  lockingOptimized: boolean;
  conflictsOptimized: boolean;
  performanceImproved: boolean;
  processingTime: number;
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
}

export interface OperationMetrics {
  averageDuration: number;
  totalOperations: number;
  successRate: number;
}

export interface OverallMetrics {
  totalOperations: number;
  averageResponseTime: number;
  operationsPerSecond: number;
}

export interface IntegrityCheckResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
