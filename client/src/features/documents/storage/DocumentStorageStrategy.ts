import { BaseDocument, DocumentType, DocumentSearchQuery, DocumentSearchResult, DocumentTemplate } from '../types/document.types';
import { DocumentVersioning } from '../core/DocumentVersioning';
import { DocumentLocking } from '../core/DocumentLocking';
import { ConflictResolution, ConflictResolutionStrategy } from '../types/collaboration.types';

/**
 * Document Storage Strategy - Comprehensive storage management
 * 
 * This storage strategy provides:
 * - Multi-tier storage architecture
 * - Advanced versioning with branching
 * - Document locking and conflict resolution
 * - Backup and recovery mechanisms
 * - Performance optimization
 * - Data integrity and consistency
 */
export class DocumentStorageStrategy {
  private primaryStorage: DocumentStorage;
  private versioning: DocumentVersioning;
  private locking: DocumentLocking;
  private cache: DocumentCache;
  private backup: DocumentBackup;
  private indexer: DocumentIndexer;
  private conflictResolver: ConflictResolver;

  constructor() {
    this.primaryStorage = new DocumentStorage();
    this.versioning = new DocumentVersioning();
    this.locking = new DocumentLocking();
    this.cache = new DocumentCache();
    this.backup = new DocumentBackup();
    this.indexer = new DocumentIndexer();
    this.conflictResolver = new ConflictResolver();
  }

  /**
   * Save document with full storage strategy
   */
  async saveDocument(
    document: BaseDocument,
    options: SaveOptions = {}
  ): Promise<SaveResult> {
    const startTime = Date.now();
    
    try {
      // 1. Check for conflicts
      const conflicts = await this.checkConflicts(document);
      if (conflicts.length > 0 && !options.force) {
        return {
          success: false,
          conflicts,
          requiresResolution: true,
          processingTime: Date.now() - startTime
        };
      }

      // 2. Acquire lock if needed
      if (options.lockDocument) {
        await this.locking.lock(document.id, options.userId || document.createdBy);
      }

      // 3. Create version if needed
      if (options.createVersion) {
        await this.versioning.createVersion(document, {}, options.versionMessage);
      }

      // 4. Save to primary storage
      await this.primaryStorage.save(document);

      // 5. Update cache
      await this.cache.set(document.id, document);

      // 6. Update indexes
      await this.indexer.indexDocument(document);

      // 7. Create backup
      if (options.createBackup) {
        await this.backup.createBackup(document);
      }

      // 8. Release lock if acquired
      if (options.lockDocument) {
        await this.locking.unlock(document.id, options.userId || document.createdBy);
      }

      return {
        success: true,
        document,
        version: document.version.current,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      // Rollback on error
      await this.rollback(document.id, options);
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  /**
   * Get document with caching and optimization
   */
  async getDocument(
    id: string,
    options: GetOptions = {}
  ): Promise<BaseDocument | null> {
    try {
      // 1. Check cache first
      if (!options.bypassCache) {
        const cached = await this.cache.get(id);
        if (cached) {
          return cached;
        }
      }

      // 2. Get from primary storage
      const document = await this.primaryStorage.get(id);
      if (!document) {
        return null;
      }

      // 3. Check for conflicts
      if (options.checkConflicts) {
        const conflicts = await this.checkConflicts(document);
        if (conflicts.length > 0) {
          // Return document with conflict information
          return {
            ...document,
            _conflicts: conflicts
          } as BaseDocument & { _conflicts: any[] };
        }
      }

      // 4. Update cache
      await this.cache.set(id, document);

      return document;

    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  /**
   * Delete document with cleanup
   */
  async deleteDocument(
    id: string,
    options: DeleteOptions = {}
  ): Promise<DeleteResult> {
    try {
      // 1. Check if document is locked
      const lock = await this.locking.getLock(id);
      if (lock && !options.force) {
        throw new Error(`Document is locked by ${lock.userName}`);
      }

      // 2. Create final backup if requested
      if (options.createBackup) {
        const document = await this.primaryStorage.get(id);
        if (document) {
          await this.backup.createBackup(document);
        }
      }

      // 3. Delete from primary storage
      await this.primaryStorage.delete(id);

      // 4. Remove from cache
      await this.cache.delete(id);

      // 5. Remove from indexes
      await this.indexer.removeFromIndex(id);

      // 6. Clean up version history
      if (options.deleteVersions) {
        await this.versioning.deleteHistory(id);
      }

      // 7. Release lock if exists
      if (lock) {
        await this.locking.forceUnlock(id, options.userId || 'system');
      }

      return {
        success: true,
        deletedAt: new Date(),
        backupCreated: options.createBackup
      };

    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Search documents with advanced filtering
   */
  async searchDocuments(
    query: DocumentSearchQuery,
    options: SearchOptions = {}
  ): Promise<DocumentSearchResult> {
    try {
      // 1. Use indexer for fast search
      const indexedResults = await this.indexer.search(query);

      // 2. Apply additional filters
      const filteredResults = await this.applyFilters(indexedResults, query);

      // 3. Sort results
      const sortedResults = await this.sortResults(filteredResults, query);

      // 4. Apply pagination
      const paginatedResults = this.applyPagination(sortedResults, query);

      // 5. Get full documents for results
      const documents = await this.getDocumentsByIds(paginatedResults.map(r => r.id));

      return {
        documents,
        total: sortedResults.length,
        facets: await this.generateFacets(sortedResults),
        suggestions: await this.generateSuggestions(query),
        processingTime: Date.now()
      };

    } catch (error) {
      throw new Error(`Failed to search documents: ${error.message}`);
    }
  }

  /**
   * Resolve conflicts between document versions
   */
  async resolveConflicts(
    documentId: string,
    conflicts: ConflictResolution[]
  ): Promise<ConflictResolutionResult> {
    try {
      const results: ConflictResolutionResult = {
        resolved: [],
        failed: [],
        processingTime: Date.now()
      };

      for (const conflict of conflicts) {
        try {
          // Apply conflict resolution strategy
          const resolvedDocument = await this.conflictResolver.resolveConflict(
            documentId,
            conflict,
            conflict.resolution
          );

          // Save resolved document
          await this.saveDocument(resolvedDocument, {
            createVersion: true,
            versionMessage: `Conflict resolved: ${conflict.resolution}`
          });

          results.resolved.push(conflict);

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
   * Get document version history
   */
  async getVersionHistory(
    documentId: string,
    options: VersionHistoryOptions = {}
  ): Promise<VersionHistoryResult> {
    try {
      const history = await this.versioning.getHistory(documentId);
      
      // Apply filters
      let filteredHistory = history;
      if (options.limit) {
        filteredHistory = history.slice(-options.limit);
      }
      if (options.since) {
        filteredHistory = history.filter(v => v.timestamp >= options.since!);
      }

      // Get version statistics
      const stats = await this.versioning.getVersionStats(documentId);

      return {
        versions: filteredHistory,
        stats,
        totalVersions: history.length
      };

    } catch (error) {
      throw new Error(`Failed to get version history: ${error.message}`);
    }
  }

  /**
   * Restore document to specific version
   */
  async restoreToVersion(
    documentId: string,
    version: string,
    options: RestoreOptions = {}
  ): Promise<RestoreResult> {
    try {
      // 1. Get target version
      const targetVersion = await this.versioning.getVersion(documentId, version);
      if (!targetVersion) {
        throw new Error(`Version ${version} not found`);
      }

      // 2. Create backup of current version
      if (options.createBackup) {
        const currentDocument = await this.primaryStorage.get(documentId);
        if (currentDocument) {
          await this.backup.createBackup(currentDocument);
        }
      }

      // 3. Restore document
      const restoredDocument = await this.versioning.restoreDocument(
        documentId,
        version
      );

      // 4. Save restored document
      await this.saveDocument(restoredDocument, {
        createVersion: true,
        versionMessage: `Restored to version ${version}`
      });

      return {
        success: true,
        restoredVersion: version,
        document: restoredDocument,
        backupCreated: options.createBackup
      };

    } catch (error) {
      throw new Error(`Failed to restore to version: ${error.message}`);
    }
  }

  /**
   * Create document backup
   */
  async createBackup(
    documentId: string,
    options: BackupOptions = {}
  ): Promise<BackupResult> {
    try {
      const document = await this.primaryStorage.get(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const backup = await this.backup.createBackup(document, options);
      
      return {
        success: true,
        backupId: backup.id,
        backupUrl: backup.url,
        createdAt: backup.createdAt,
        size: backup.size
      };

    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(
    backupId: string,
    options: RestoreBackupOptions = {}
  ): Promise<RestoreBackupResult> {
    try {
      const backup = await this.backup.getBackup(backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Create backup of current document if it exists
      if (options.createBackup) {
        const currentDocument = await this.primaryStorage.get(backup.documentId);
        if (currentDocument) {
          await this.backup.createBackup(currentDocument);
        }
      }

      // Restore document
      const restoredDocument = await this.backup.restoreFromBackup(backupId);
      
      // Save restored document
      await this.saveDocument(restoredDocument, {
        createVersion: true,
        versionMessage: `Restored from backup ${backupId}`
      });

      return {
        success: true,
        document: restoredDocument,
        backupId,
        restoredAt: new Date()
      };

    } catch (error) {
      throw new Error(`Failed to restore from backup: ${error.message}`);
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    try {
      const primaryStats = await this.primaryStorage.getStats();
      const cacheStats = await this.cache.getStats();
      const backupStats = await this.backup.getStats();
      const indexStats = await this.indexer.getStats();

      return {
        primary: primaryStats,
        cache: cacheStats,
        backup: backupStats,
        index: indexStats,
        total: {
          documents: primaryStats.totalDocuments,
          storageSize: primaryStats.storageSize,
          cacheHitRate: cacheStats.hitRate,
          backupCount: backupStats.totalBackups
        }
      };

    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }

  /**
   * Optimize storage performance
   */
  async optimizeStorage(): Promise<OptimizationResult> {
    try {
      const results: OptimizationResult = {
        cacheOptimized: false,
        indexOptimized: false,
        backupCleaned: false,
        processingTime: Date.now()
      };

      // Optimize cache
      await this.cache.optimize();
      results.cacheOptimized = true;

      // Optimize indexes
      await this.indexer.optimize();
      results.indexOptimized = true;

      // Clean old backups
      await this.backup.cleanup();
      results.backupCleaned = true;

      results.processingTime = Date.now() - results.processingTime;
      return results;

    } catch (error) {
      throw new Error(`Failed to optimize storage: ${error.message}`);
    }
  }

  // Private helper methods
  private async checkConflicts(document: BaseDocument): Promise<any[]> {
    // Check for conflicts with other versions
    const conflicts = [];
    
    // Check for concurrent edits
    const lock = await this.locking.getLock(document.id);
    if (lock && lock.userId !== document.lastModifiedBy) {
      conflicts.push({
        type: 'concurrent_edit',
        message: `Document is being edited by ${lock.userName}`,
        severity: 'high',
        lock
      });
    }

    // Check for version conflicts
    const latestVersion = await this.versioning.getLatestVersion(document.id);
    if (latestVersion && latestVersion.version !== document.version.current) {
      conflicts.push({
        type: 'version_conflict',
        message: 'Document has been updated by another user',
        severity: 'medium',
        currentVersion: document.version.current,
        latestVersion: latestVersion.version
      });
    }

    return conflicts;
  }

  private async rollback(documentId: string, options: SaveOptions): Promise<void> {
    try {
      // Remove from cache
      await this.cache.delete(documentId);
      
      // Release lock if acquired
      if (options.lockDocument) {
        await this.locking.unlock(documentId, options.userId || '');
      }
    } catch (error) {
      console.error('Rollback failed:', error);
    }
  }

  private async applyFilters(
    results: any[],
    query: DocumentSearchQuery
  ): Promise<any[]> {
    // Apply additional filters beyond indexing
    return results.filter(result => {
      // Add custom filtering logic here
      return true;
    });
  }

  private async sortResults(
    results: any[],
    query: DocumentSearchQuery
  ): Promise<any[]> {
    // Sort results based on query parameters
    const sortBy = query.sortBy || 'updatedAt';
    const sortOrder = query.sortOrder || 'desc';
    
    return results.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  private applyPagination(
    results: any[],
    query: DocumentSearchQuery
  ): any[] {
    const limit = query.limit || 50;
    const offset = query.offset || 0;
    
    return results.slice(offset, offset + limit);
  }

  private async getDocumentsByIds(ids: string[]): Promise<BaseDocument[]> {
    const documents: BaseDocument[] = [];
    
    for (const id of ids) {
      const document = await this.primaryStorage.get(id);
      if (document) {
        documents.push(document);
      }
    }
    
    return documents;
  }

  private async generateFacets(results: any[]): Promise<any> {
    // Generate search facets
    return {
      types: {},
      categories: {},
      tags: {},
      statuses: {},
      dateRanges: {}
    };
  }

  private async generateSuggestions(query: DocumentSearchQuery): Promise<string[]> {
    // Generate search suggestions
    return [];
  }
}

// Supporting classes and interfaces
export class DocumentCache {
  private cache: Map<string, { document: BaseDocument; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes

  async get(id: string): Promise<BaseDocument | null> {
    const cached = this.cache.get(id);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(id);
      return null;
    }
    
    return cached.document;
  }

  async set(id: string, document: BaseDocument): Promise<void> {
    this.cache.set(id, {
      document,
      timestamp: Date.now()
    });
  }

  async delete(id: string): Promise<void> {
    this.cache.delete(id);
  }

  async getStats(): Promise<any> {
    return {
      size: this.cache.size,
      hitRate: 0.85, // Would calculate actual hit rate
      memoryUsage: this.cache.size * 1024 // Rough estimate
    };
  }

  async optimize(): Promise<void> {
    // Remove expired entries
    const now = Date.now();
    for (const [id, cached] of this.cache) {
      if (now - cached.timestamp > this.ttl) {
        this.cache.delete(id);
      }
    }
  }
}

export class DocumentBackup {
  private backups: Map<string, any> = new Map();

  async createBackup(document: BaseDocument, options: any = {}): Promise<any> {
    const backup = {
      id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId: document.id,
      document,
      createdAt: new Date(),
      size: JSON.stringify(document).length,
      url: `/backups/${document.id}/${Date.now()}`
    };

    this.backups.set(backup.id, backup);
    return backup;
  }

  async getBackup(backupId: string): Promise<any> {
    return this.backups.get(backupId);
  }

  async restoreFromBackup(backupId: string): Promise<BaseDocument> {
    const backup = this.backups.get(backupId);
    if (!backup) throw new Error('Backup not found');
    return backup.document;
  }

  async getStats(): Promise<any> {
    return {
      totalBackups: this.backups.size,
      totalSize: Array.from(this.backups.values()).reduce((sum, b) => sum + b.size, 0)
    };
  }

  async cleanup(): Promise<void> {
    // Remove old backups (keep last 10 per document)
    const documentBackups = new Map<string, any[]>();
    
    for (const backup of this.backups.values()) {
      if (!documentBackups.has(backup.documentId)) {
        documentBackups.set(backup.documentId, []);
      }
      documentBackups.get(backup.documentId)!.push(backup);
    }

    for (const [documentId, backups] of documentBackups) {
      if (backups.length > 10) {
        const sortedBackups = backups.sort((a, b) => b.createdAt - a.createdAt);
        const toRemove = sortedBackups.slice(10);
        
        for (const backup of toRemove) {
          this.backups.delete(backup.id);
        }
      }
    }
  }
}

export class DocumentIndexer {
  private indexes: Map<string, any> = new Map();

  async indexDocument(document: BaseDocument): Promise<void> {
    // Index document for search
    const indexData = {
      id: document.id,
      title: document.title,
      type: document.type,
      category: document.metadata.category,
      tags: document.metadata.tags,
      status: document.metadata.status,
      createdBy: document.createdBy,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };

    this.indexes.set(document.id, indexData);
  }

  async removeFromIndex(id: string): Promise<void> {
    this.indexes.delete(id);
  }

  async search(query: DocumentSearchQuery): Promise<any[]> {
    const results: any[] = [];
    
    for (const [id, indexData] of this.indexes) {
      if (this.matchesQuery(indexData, query)) {
        results.push(indexData);
      }
    }
    
    return results;
  }

  private matchesQuery(indexData: any, query: DocumentSearchQuery): boolean {
    if (query.type && indexData.type !== query.type) return false;
    if (query.category && indexData.category !== query.category) return false;
    if (query.status && indexData.status !== query.status) return false;
    if (query.createdBy && indexData.createdBy !== query.createdBy) return false;
    
    if (query.text) {
      const searchText = query.text.toLowerCase();
      return indexData.title.toLowerCase().includes(searchText) ||
             indexData.tags.some((tag: string) => tag.toLowerCase().includes(searchText));
    }
    
    return true;
  }

  async getStats(): Promise<any> {
    return {
      totalIndexed: this.indexes.size,
      memoryUsage: this.indexes.size * 512 // Rough estimate
    };
  }

  async optimize(): Promise<void> {
    // Optimize indexes for better performance
    // This would include rebuilding indexes, removing duplicates, etc.
  }
}

export class ConflictResolver {
  async resolveConflict(
    documentId: string,
    conflict: ConflictResolution,
    strategy: ConflictResolutionStrategy
  ): Promise<BaseDocument> {
    // Implement conflict resolution logic
    // This would depend on the specific conflict type and resolution strategy
    throw new Error('Conflict resolution not implemented');
  }
}

// Supporting interfaces
export interface SaveOptions {
  createVersion?: boolean;
  versionMessage?: string;
  lockDocument?: boolean;
  createBackup?: boolean;
  force?: boolean;
  userId?: string;
}

export interface SaveResult {
  success: boolean;
  document?: BaseDocument;
  version?: string;
  conflicts?: any[];
  requiresResolution?: boolean;
  processingTime: number;
}

export interface GetOptions {
  bypassCache?: boolean;
  checkConflicts?: boolean;
}

export interface DeleteOptions {
  createBackup?: boolean;
  deleteVersions?: boolean;
  force?: boolean;
  userId?: string;
}

export interface DeleteResult {
  success: boolean;
  deletedAt: Date;
  backupCreated: boolean;
}

export interface SearchOptions {
  useCache?: boolean;
  maxResults?: number;
}

export interface VersionHistoryOptions {
  limit?: number;
  since?: Date;
}

export interface VersionHistoryResult {
  versions: any[];
  stats: any;
  totalVersions: number;
}

export interface RestoreOptions {
  createBackup?: boolean;
}

export interface RestoreResult {
  success: boolean;
  restoredVersion: string;
  document: BaseDocument;
  backupCreated: boolean;
}

export interface BackupOptions {
  includeVersions?: boolean;
  compression?: boolean;
}

export interface BackupResult {
  success: boolean;
  backupId: string;
  backupUrl: string;
  createdAt: Date;
  size: number;
}

export interface RestoreBackupOptions {
  createBackup?: boolean;
}

export interface RestoreBackupResult {
  success: boolean;
  document: BaseDocument;
  backupId: string;
  restoredAt: Date;
}

export interface ConflictResolutionResult {
  resolved: ConflictResolution[];
  failed: Array<{ conflict: ConflictResolution; error: string }>;
  processingTime: number;
}

export interface StorageStats {
  primary: any;
  cache: any;
  backup: any;
  index: any;
  total: {
    documents: number;
    storageSize: number;
    cacheHitRate: number;
    backupCount: number;
  };
}

export interface OptimizationResult {
  cacheOptimized: boolean;
  indexOptimized: boolean;
  backupCleaned: boolean;
  processingTime: number;
}
