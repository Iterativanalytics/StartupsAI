import { BaseDocument, VersionHistory, VersionBranch, ChangeSet } from '../types/document.types';

/**
 * Document Versioning - Handles document version control and history
 * 
 * This versioning system provides:
 * - Version creation and management
 * - Change tracking and diff generation
 * - Branch management
 * - Version restoration
 * - Conflict resolution
 */
export class DocumentVersioning {
  private versions: Map<string, VersionHistory[]> = new Map();
  private branches: Map<string, VersionBranch[]> = new Map();

  /**
   * Create initial version for a document
   */
  async createInitialVersion(document: BaseDocument): Promise<void> {
    const initialVersion: VersionHistory = {
      version: '1.0.0',
      timestamp: new Date(),
      author: document.createdBy,
      changes: [],
      message: 'Initial version',
      snapshot: this.createSnapshot(document)
    };

    this.versions.set(document.id, [initialVersion]);
  }

  /**
   * Create a new version
   */
  async createVersion(
    document: BaseDocument,
    updates: Partial<BaseDocument>,
    message?: string
  ): Promise<VersionHistory> {
    const currentVersion = document.version.current;
    const newVersion = this.incrementVersion(currentVersion);

    // Generate changes
    const changes = this.generateChanges(document, updates);

    const versionHistory: VersionHistory = {
      version: newVersion,
      timestamp: new Date(),
      author: updates.lastModifiedBy || document.lastModifiedBy,
      changes,
      message: message || 'Document updated',
      snapshot: this.createSnapshot({ ...document, ...updates })
    };

    // Add to version history
    const history = this.versions.get(document.id) || [];
    history.push(versionHistory);
    this.versions.set(document.id, history);

    return versionHistory;
  }

  /**
   * Get version history for a document
   */
  async getHistory(documentId: string): Promise<VersionHistory[]> {
    return this.versions.get(documentId) || [];
  }

  /**
   * Get a specific version
   */
  async getVersion(documentId: string, version: string): Promise<VersionHistory | null> {
    const history = this.versions.get(documentId);
    if (!history) return null;

    return history.find(v => v.version === version) || null;
  }

  /**
   * Get latest version
   */
  async getLatestVersion(documentId: string): Promise<VersionHistory | null> {
    const history = this.versions.get(documentId);
    if (!history || history.length === 0) return null;

    return history[history.length - 1];
  }

  /**
   * Compare two versions
   */
  async compareVersions(
    documentId: string,
    version1: string,
    version2: string
  ): Promise<{
    changes: ChangeSet[];
    added: ChangeSet[];
    modified: ChangeSet[];
    deleted: ChangeSet[];
  }> {
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
      changes,
      added,
      modified,
      deleted
    };
  }

  /**
   * Create a branch
   */
  async createBranch(
    documentId: string,
    branchName: string,
    baseVersion: string,
    createdBy: string
  ): Promise<VersionBranch> {
    const branch: VersionBranch = {
      name: branchName,
      baseVersion,
      createdAt: new Date(),
      createdBy
    };

    const branches = this.branches.get(documentId) || [];
    branches.push(branch);
    this.branches.set(documentId, branches);

    return branch;
  }

  /**
   * Get branches for a document
   */
  async getBranches(documentId: string): Promise<VersionBranch[]> {
    return this.branches.get(documentId) || [];
  }

  /**
   * Merge a branch
   */
  async mergeBranch(
    documentId: string,
    branchName: string,
    targetVersion: string,
    mergedBy: string
  ): Promise<void> {
    const branches = this.branches.get(documentId) || [];
    const branch = branches.find(b => b.name === branchName);

    if (!branch) {
      throw new Error(`Branch not found: ${branchName}`);
    }

    if (branch.merged) {
      throw new Error(`Branch already merged: ${branchName}`);
    }

    // Mark branch as merged
    branch.merged = true;
    branch.mergedAt = new Date();
    branch.mergedBy = mergedBy;

    // In a real implementation, we would merge the changes
    // For now, we'll just mark it as merged
  }

  /**
   * Delete version history
   */
  async deleteHistory(documentId: string): Promise<void> {
    this.versions.delete(documentId);
    this.branches.delete(documentId);
  }

  /**
   * Get version statistics
   */
  async getVersionStats(documentId: string): Promise<{
    totalVersions: number;
    latestVersion: string;
    firstVersion: string;
    totalChanges: number;
    averageChangesPerVersion: number;
    lastModified: Date;
  }> {
    const history = this.versions.get(documentId) || [];
    
    if (history.length === 0) {
      return {
        totalVersions: 0,
        latestVersion: '',
        firstVersion: '',
        totalChanges: 0,
        averageChangesPerVersion: 0,
        lastModified: new Date()
      };
    }

    const totalChanges = history.reduce((sum, version) => sum + version.changes.length, 0);
    const averageChangesPerVersion = totalChanges / history.length;

    return {
      totalVersions: history.length,
      latestVersion: history[history.length - 1].version,
      firstVersion: history[0].version,
      totalChanges,
      averageChangesPerVersion,
      lastModified: history[history.length - 1].timestamp
    };
  }

  /**
   * Create document snapshot
   */
  private createSnapshot(document: BaseDocument): any {
    return {
      id: document.id,
      type: document.type,
      title: document.title,
      description: document.description,
      content: JSON.parse(JSON.stringify(document.content)), // Deep clone
      metadata: JSON.parse(JSON.stringify(document.metadata)), // Deep clone
      permissions: JSON.parse(JSON.stringify(document.permissions)), // Deep clone
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      createdBy: document.createdBy,
      lastModifiedBy: document.lastModifiedBy
    };
  }

  /**
   * Generate changes between document states
   */
  private generateChanges(
    original: BaseDocument,
    updates: Partial<BaseDocument>
  ): ChangeSet[] {
    const changes: ChangeSet[] = [];

    // Check title changes
    if (updates.title && updates.title !== original.title) {
      changes.push({
        type: 'modify',
        path: 'title',
        oldValue: original.title,
        newValue: updates.title,
        description: `Title changed from "${original.title}" to "${updates.title}"`
      });
    }

    // Check description changes
    if (updates.description !== undefined && updates.description !== original.description) {
      changes.push({
        type: 'modify',
        path: 'description',
        oldValue: original.description,
        newValue: updates.description,
        description: `Description ${updates.description ? 'updated' : 'removed'}`
      });
    }

    // Check content changes
    if (updates.content && JSON.stringify(updates.content) !== JSON.stringify(original.content)) {
      changes.push({
        type: 'modify',
        path: 'content',
        oldValue: original.content,
        newValue: updates.content,
        description: 'Content updated'
      });
    }

    // Check metadata changes
    if (updates.metadata && JSON.stringify(updates.metadata) !== JSON.stringify(original.metadata)) {
      changes.push({
        type: 'modify',
        path: 'metadata',
        oldValue: original.metadata,
        newValue: updates.metadata,
        description: 'Metadata updated'
      });
    }

    // Check permissions changes
    if (updates.permissions && JSON.stringify(updates.permissions) !== JSON.stringify(original.permissions)) {
      changes.push({
        type: 'modify',
        path: 'permissions',
        oldValue: original.permissions,
        newValue: updates.permissions,
        description: 'Permissions updated'
      });
    }

    return changes;
  }

  /**
   * Compare two snapshots
   */
  private compareSnapshots(snapshot1: any, snapshot2: any): ChangeSet[] {
    const changes: ChangeSet[] = [];

    // Compare all fields
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

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]);

    // Increment patch version
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * Get version diff as text
   */
  async getVersionDiff(
    documentId: string,
    version1: string,
    version2: string
  ): Promise<string> {
    const comparison = await this.compareVersions(documentId, version1, version2);
    
    let diff = `# Version Comparison\n\n`;
    diff += `**From:** ${version1}\n`;
    diff += `**To:** ${version2}\n\n`;

    if (comparison.changes.length === 0) {
      diff += `No changes detected.\n`;
      return diff;
    }

    diff += `## Changes (${comparison.changes.length})\n\n`;

    for (const change of comparison.changes) {
      diff += `### ${change.path}\n`;
      diff += `**Type:** ${change.type}\n`;
      
      if (change.oldValue !== undefined) {
        diff += `**Old:** ${JSON.stringify(change.oldValue, null, 2)}\n`;
      }
      
      if (change.newValue !== undefined) {
        diff += `**New:** ${JSON.stringify(change.newValue, null, 2)}\n`;
      }
      
      if (change.description) {
        diff += `**Description:** ${change.description}\n`;
      }
      
      diff += `\n`;
    }

    return diff;
  }
}
