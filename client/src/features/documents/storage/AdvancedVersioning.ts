import { BaseDocument, VersionHistory, VersionBranch, ChangeSet } from '../types/document.types';

/**
 * Advanced Versioning System - Git-like version control for documents
 * 
 * This system provides:
 * - Branch-based versioning
 * - Merge capabilities
 * - Conflict resolution
 * - Version comparison and diff
 * - Rollback and restore
 * - Version analytics
 */
export class AdvancedVersioning {
  private versions: Map<string, VersionHistory[]> = new Map();
  private branches: Map<string, VersionBranch[]> = new Map();
  private merges: Map<string, MergeRecord[]> = new Map();

  /**
   * Create initial version
   */
  async createInitialVersion(document: BaseDocument): Promise<VersionHistory> {
    const initialVersion: VersionHistory = {
      version: '1.0.0',
      timestamp: new Date(),
      author: document.createdBy,
      changes: [],
      message: 'Initial version',
      snapshot: this.createSnapshot(document)
    };

    this.versions.set(document.id, [initialVersion]);
    return initialVersion;
  }

  /**
   * Create new version with advanced options
   */
  async createVersion(
    document: BaseDocument,
    updates: Partial<BaseDocument>,
    options: VersionOptions = {}
  ): Promise<VersionHistory> {
    const currentVersion = document.version.current;
    const newVersion = this.incrementVersion(currentVersion, options.versionType);

    // Generate detailed changes
    const changes = await this.generateDetailedChanges(document, updates);

    const versionHistory: VersionHistory = {
      version: newVersion,
      timestamp: new Date(),
      author: updates.lastModifiedBy || document.lastModifiedBy,
      changes,
      message: options.message || 'Document updated',
      snapshot: this.createSnapshot({ ...document, ...updates })
    };

    // Add to version history
    const history = this.versions.get(document.id) || [];
    history.push(versionHistory);
    this.versions.set(document.id, history);

    // Create branch if specified
    if (options.branchName) {
      await this.createBranch(document.id, options.branchName, newVersion, document.createdBy);
    }

    return versionHistory;
  }

  /**
   * Create a new branch
   */
  async createBranch(
    documentId: string,
    branchName: string,
    baseVersion: string,
    createdBy: string,
    options: BranchOptions = {}
  ): Promise<VersionBranch> {
    const branch: VersionBranch = {
      name: branchName,
      baseVersion,
      createdAt: new Date(),
      createdBy,
      merged: false
    };

    const branches = this.branches.get(documentId) || [];
    
    // Check if branch already exists
    if (branches.some(b => b.name === branchName)) {
      throw new Error(`Branch ${branchName} already exists`);
    }

    branches.push(branch);
    this.branches.set(documentId, branches);

    return branch;
  }

  /**
   * Get all branches for a document
   */
  async getBranches(documentId: string): Promise<VersionBranch[]> {
    return this.branches.get(documentId) || [];
  }

  /**
   * Switch to a branch
   */
  async switchToBranch(
    documentId: string,
    branchName: string
  ): Promise<BaseDocument> {
    const branches = this.branches.get(documentId) || [];
    const branch = branches.find(b => b.name === branchName);
    
    if (!branch) {
      throw new Error(`Branch ${branchName} not found`);
    }

    // Get the latest version from the branch
    const history = this.versions.get(documentId) || [];
    const branchVersions = history.filter(v => v.version.startsWith(branchName));
    
    if (branchVersions.length === 0) {
      throw new Error(`No versions found for branch ${branchName}`);
    }

    const latestBranchVersion = branchVersions[branchVersions.length - 1];
    return latestBranchVersion.snapshot;
  }

  /**
   * Merge branch into main
   */
  async mergeBranch(
    documentId: string,
    sourceBranch: string,
    targetBranch: string = 'main',
    options: MergeOptions = {}
  ): Promise<MergeResult> {
    try {
      const branches = this.branches.get(documentId) || [];
      const sourceBranchData = branches.find(b => b.name === sourceBranch);
      const targetBranchData = branches.find(b => b.name === targetBranch);

      if (!sourceBranchData) {
        throw new Error(`Source branch ${sourceBranch} not found`);
      }

      if (!targetBranchData) {
        throw new Error(`Target branch ${targetBranch} not found`);
      }

      // Check for conflicts
      const conflicts = await this.detectMergeConflicts(
        documentId,
        sourceBranch,
        targetBranch
      );

      if (conflicts.length > 0 && !options.force) {
        return {
          success: false,
          conflicts,
          requiresResolution: true
        };
      }

      // Perform merge
      const mergeResult = await this.performMerge(
        documentId,
        sourceBranch,
        targetBranch,
        options
      );

      // Mark source branch as merged
      sourceBranchData.merged = true;
      sourceBranchData.mergedAt = new Date();
      sourceBranchData.mergedBy = options.mergedBy || 'system';

      // Record merge
      const mergeRecord: MergeRecord = {
        id: this.generateMergeId(),
        sourceBranch,
        targetBranch,
        mergedAt: new Date(),
        mergedBy: options.mergedBy || 'system',
        conflicts: conflicts.length,
        resolution: options.strategy || 'auto'
      };

      const merges = this.merges.get(documentId) || [];
      merges.push(mergeRecord);
      this.merges.set(documentId, merges);

      return {
        success: true,
        mergeResult,
        conflicts: [],
        requiresResolution: false
      };

    } catch (error) {
      throw new Error(`Failed to merge branch: ${error.message}`);
    }
  }

  /**
   * Compare two versions
   */
  async compareVersions(
    documentId: string,
    version1: string,
    version2: string
  ): Promise<VersionComparison> {
    const v1 = await this.getVersion(documentId, version1);
    const v2 = await this.getVersion(documentId, version2);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    const changes = this.compareSnapshots(v1.snapshot, v2.snapshot);
    const added = changes.filter(c => c.type === 'add');
    const modified = changes.filter(c => c.type === 'modify');
    const deleted = changes.filter(c => c.type === 'delete');

    return {
      version1: v1.version,
      version2: v2.version,
      changes,
      added,
      modified,
      deleted,
      similarity: this.calculateSimilarity(v1.snapshot, v2.snapshot)
    };
  }

  /**
   * Get version diff as structured data
   */
  async getVersionDiff(
    documentId: string,
    version1: string,
    version2: string
  ): Promise<VersionDiff> {
    const comparison = await this.compareVersions(documentId, version1, version2);
    
    return {
      from: version1,
      to: version2,
      changes: comparison.changes,
      summary: {
        totalChanges: comparison.changes.length,
        additions: comparison.added.length,
        modifications: comparison.modified.length,
        deletions: comparison.deleted.length,
        similarity: comparison.similarity
      },
      sections: this.groupChangesBySection(comparison.changes),
      metadata: {
        generatedAt: new Date(),
        processingTime: 0
      }
    };
  }

  /**
   * Rollback to specific version
   */
  async rollbackToVersion(
    documentId: string,
    targetVersion: string,
    options: RollbackOptions = {}
  ): Promise<RollbackResult> {
    try {
      const targetVersionData = await this.getVersion(documentId, targetVersion);
      if (!targetVersionData) {
        throw new Error(`Version ${targetVersion} not found`);
      }

      // Create backup of current version
      if (options.createBackup) {
        const currentDocument = await this.getCurrentDocument(documentId);
        if (currentDocument) {
          await this.createBackup(currentDocument, `rollback-backup-${Date.now()}`);
        }
      }

      // Create new version with rolled back content
      const rollbackVersion = this.incrementVersion(targetVersion, 'patch');
      const rollbackHistory: VersionHistory = {
        version: rollbackVersion,
        timestamp: new Date(),
        author: options.rolledBackBy || 'system',
        changes: [{
          type: 'modify',
          path: 'content',
          oldValue: 'current',
          newValue: 'rolled_back',
          description: `Rolled back to version ${targetVersion}`
        }],
        message: `Rolled back to version ${targetVersion}`,
        snapshot: targetVersionData.snapshot
      };

      const history = this.versions.get(documentId) || [];
      history.push(rollbackHistory);
      this.versions.set(documentId, history);

      return {
        success: true,
        rolledBackTo: targetVersion,
        newVersion: rollbackVersion,
        backupCreated: options.createBackup
      };

    } catch (error) {
      throw new Error(`Failed to rollback: ${error.message}`);
    }
  }

  /**
   * Get version analytics
   */
  async getVersionAnalytics(documentId: string): Promise<VersionAnalytics> {
    const history = this.versions.get(documentId) || [];
    const branches = this.branches.get(documentId) || [];
    const merges = this.merges.get(documentId) || [];

    // Calculate metrics
    const totalVersions = history.length;
    const totalBranches = branches.length;
    const totalMerges = merges.length;
    const activeBranches = branches.filter(b => !b.merged).length;

    // Calculate change frequency
    const changeFrequency = this.calculateChangeFrequency(history);
    
    // Calculate collaboration metrics
    const collaborators = new Set(history.map(v => v.author));
    const collaborationScore = this.calculateCollaborationScore(history);

    // Calculate version stability
    const stabilityScore = this.calculateStabilityScore(history);

    return {
      totalVersions,
      totalBranches,
      totalMerges,
      activeBranches,
      collaborators: collaborators.size,
      changeFrequency,
      collaborationScore,
      stabilityScore,
      averageChangesPerVersion: this.calculateAverageChanges(history),
      mostActiveAuthor: this.getMostActiveAuthor(history),
      versionDistribution: this.getVersionDistribution(history),
      branchActivity: this.getBranchActivity(branches),
      mergeHistory: merges
    };
  }

  /**
   * Clean up old versions
   */
  async cleanupVersions(
    documentId: string,
    options: CleanupOptions = {}
  ): Promise<CleanupResult> {
    const history = this.versions.get(documentId) || [];
    const keepVersions = options.keepVersions || 50;
    const keepDays = options.keepDays || 90;

    const cutoffDate = new Date(Date.now() - keepDays * 24 * 60 * 60 * 1000);
    
    // Keep recent versions and important versions
    const versionsToKeep = history
      .filter(v => v.timestamp >= cutoffDate)
      .slice(-keepVersions);

    const versionsToDelete = history.filter(v => !versionsToKeep.includes(v));
    
    // Update history
    this.versions.set(documentId, versionsToKeep);

    return {
      versionsDeleted: versionsToDelete.length,
      versionsKept: versionsToKeep.length,
      spaceFreed: versionsToDelete.reduce((sum, v) => sum + this.calculateVersionSize(v), 0)
    };
  }

  // Private helper methods
  private async generateDetailedChanges(
    original: BaseDocument,
    updates: Partial<BaseDocument>
  ): Promise<ChangeSet[]> {
    const changes: ChangeSet[] = [];

    // Compare all document properties
    const properties = ['title', 'description', 'content', 'metadata', 'permissions'];
    
    for (const property of properties) {
      const originalValue = (original as any)[property];
      const updatedValue = (updates as any)[property];
      
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes.push({
          type: 'modify',
          path: property,
          oldValue: originalValue,
          newValue: updatedValue,
          description: `${property} updated`
        });
      }
    }

    return changes;
  }

  private createSnapshot(document: BaseDocument): any {
    return {
      id: document.id,
      type: document.type,
      title: document.title,
      description: document.description,
      content: JSON.parse(JSON.stringify(document.content)),
      metadata: JSON.parse(JSON.stringify(document.metadata)),
      permissions: JSON.parse(JSON.stringify(document.permissions)),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      createdBy: document.createdBy,
      lastModifiedBy: document.lastModifiedBy
    };
  }

  private incrementVersion(currentVersion: string, type: 'major' | 'minor' | 'patch'): string {
    const parts = currentVersion.split('.').map(Number);
    const [major, minor, patch] = parts;

    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  private compareSnapshots(snapshot1: any, snapshot2: any): ChangeSet[] {
    const changes: ChangeSet[] = [];
    const fields = ['title', 'description', 'content', 'metadata', 'permissions'];
    
    for (const field of fields) {
      const value1 = snapshot1[field];
      const value2 = snapshot2[field];

      if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        if (value1 === undefined || value1 === null) {
          changes.push({
            type: 'add',
            path: field,
            newValue: value2,
            description: `${field} added`
          });
        } else if (value2 === undefined || value2 === null) {
          changes.push({
            type: 'delete',
            path: field,
            oldValue: value1,
            description: `${field} removed`
          });
        } else {
          changes.push({
            type: 'modify',
            path: field,
            oldValue: value1,
            newValue: value2,
            description: `${field} modified`
          });
        }
      }
    }

    return changes;
  }

  private calculateSimilarity(snapshot1: any, snapshot2: any): number {
    // Simple similarity calculation based on content overlap
    const fields = ['title', 'description', 'content'];
    let similarity = 0;
    let totalFields = 0;

    for (const field of fields) {
      const value1 = snapshot1[field];
      const value2 = snapshot2[field];
      
      if (typeof value1 === 'string' && typeof value2 === 'string') {
        const similarity = this.calculateStringSimilarity(value1, value2);
        similarity += similarity;
        totalFields++;
      }
    }

    return totalFields > 0 ? similarity / totalFields : 0;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Simple Jaccard similarity
    const set1 = new Set(str1.toLowerCase().split(' '));
    const set2 = new Set(str2.toLowerCase().split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private groupChangesBySection(changes: ChangeSet[]): any {
    const sections: any = {};
    
    for (const change of changes) {
      const section = change.path.split('.')[0];
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(change);
    }
    
    return sections;
  }

  private calculateChangeFrequency(history: VersionHistory[]): any {
    const frequency: any = {};
    
    for (const version of history) {
      const date = version.timestamp.toISOString().split('T')[0];
      frequency[date] = (frequency[date] || 0) + 1;
    }
    
    return frequency;
  }

  private calculateCollaborationScore(history: VersionHistory[]): number {
    const authors = new Set(history.map(v => v.author));
    const totalVersions = history.length;
    
    // Higher score for more authors and more versions
    return Math.min((authors.size * totalVersions) / 100, 100);
  }

  private calculateStabilityScore(history: VersionHistory[]): number {
    if (history.length < 2) return 100;
    
    // Calculate variance in change frequency
    const changes = history.map(v => v.changes.length);
    const avg = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    const variance = changes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / changes.length;
    
    // Lower variance = higher stability
    return Math.max(0, 100 - variance);
  }

  private calculateAverageChanges(history: VersionHistory[]): number {
    if (history.length === 0) return 0;
    
    const totalChanges = history.reduce((sum, v) => sum + v.changes.length, 0);
    return totalChanges / history.length;
  }

  private getMostActiveAuthor(history: VersionHistory[]): string {
    const authorCounts: any = {};
    
    for (const version of history) {
      authorCounts[version.author] = (authorCounts[version.author] || 0) + 1;
    }
    
    return Object.keys(authorCounts).reduce((a, b) => 
      authorCounts[a] > authorCounts[b] ? a : b
    );
  }

  private getVersionDistribution(history: VersionHistory[]): any {
    const distribution: any = {};
    
    for (const version of history) {
      const type = version.version.split('.')[0];
      distribution[type] = (distribution[type] || 0) + 1;
    }
    
    return distribution;
  }

  private getBranchActivity(branches: VersionBranch[]): any {
    return {
      total: branches.length,
      active: branches.filter(b => !b.merged).length,
      merged: branches.filter(b => b.merged).length,
      averageLifetime: this.calculateAverageBranchLifetime(branches)
    };
  }

  private calculateAverageBranchLifetime(branches: VersionBranch[]): number {
    const mergedBranches = branches.filter(b => b.merged && b.mergedAt);
    
    if (mergedBranches.length === 0) return 0;
    
    const totalLifetime = mergedBranches.reduce((sum, b) => {
      const lifetime = b.mergedAt!.getTime() - b.createdAt.getTime();
      return sum + lifetime;
    }, 0);
    
    return totalLifetime / mergedBranches.length;
  }

  private calculateVersionSize(version: VersionHistory): number {
    return JSON.stringify(version.snapshot).length;
  }

  private async detectMergeConflicts(
    documentId: string,
    sourceBranch: string,
    targetBranch: string
  ): Promise<any[]> {
    // Implement conflict detection logic
    return [];
  }

  private async performMerge(
    documentId: string,
    sourceBranch: string,
    targetBranch: string,
    options: MergeOptions
  ): Promise<any> {
    // Implement merge logic
    return {};
  }

  private async getVersion(documentId: string, version: string): Promise<VersionHistory | null> {
    const history = this.versions.get(documentId) || [];
    return history.find(v => v.version === version) || null;
  }

  private async getCurrentDocument(documentId: string): Promise<BaseDocument | null> {
    const history = this.versions.get(documentId) || [];
    const latest = history[history.length - 1];
    return latest ? latest.snapshot : null;
  }

  private async createBackup(document: BaseDocument, name: string): Promise<void> {
    // Implement backup creation
  }

  private generateMergeId(): string {
    return `merge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Supporting interfaces
export interface VersionOptions {
  versionType?: 'major' | 'minor' | 'patch';
  message?: string;
  branchName?: string;
  createBackup?: boolean;
}

export interface BranchOptions {
  description?: string;
  baseCommit?: string;
}

export interface MergeOptions {
  strategy?: 'auto' | 'manual' | 'ours' | 'theirs';
  force?: boolean;
  mergedBy?: string;
}

export interface MergeResult {
  success: boolean;
  mergeResult?: any;
  conflicts?: any[];
  requiresResolution?: boolean;
}

export interface VersionComparison {
  version1: string;
  version2: string;
  changes: ChangeSet[];
  added: ChangeSet[];
  modified: ChangeSet[];
  deleted: ChangeSet[];
  similarity: number;
}

export interface VersionDiff {
  from: string;
  to: string;
  changes: ChangeSet[];
  summary: {
    totalChanges: number;
    additions: number;
    modifications: number;
    deletions: number;
    similarity: number;
  };
  sections: any;
  metadata: {
    generatedAt: Date;
    processingTime: number;
  };
}

export interface RollbackOptions {
  createBackup?: boolean;
  rolledBackBy?: string;
}

export interface RollbackResult {
  success: boolean;
  rolledBackTo: string;
  newVersion: string;
  backupCreated: boolean;
}

export interface VersionAnalytics {
  totalVersions: number;
  totalBranches: number;
  totalMerges: number;
  activeBranches: number;
  collaborators: number;
  changeFrequency: any;
  collaborationScore: number;
  stabilityScore: number;
  averageChangesPerVersion: number;
  mostActiveAuthor: string;
  versionDistribution: any;
  branchActivity: any;
  mergeHistory: MergeRecord[];
}

export interface CleanupOptions {
  keepVersions?: number;
  keepDays?: number;
  keepImportant?: boolean;
}

export interface CleanupResult {
  versionsDeleted: number;
  versionsKept: number;
  spaceFreed: number;
}

export interface MergeRecord {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  mergedAt: Date;
  mergedBy: string;
  conflicts: number;
  resolution: string;
}
