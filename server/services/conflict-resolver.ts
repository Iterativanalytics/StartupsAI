import { DatabaseService } from './database-service';

/**
 * Conflict Resolution Service for Lean Design Thinking™ Collaboration
 * 
 * Handles conflict resolution in real-time collaborative sessions:
 * - Conflict detection
 * - Resolution strategies
 * - Participant mediation
 * - Automated resolution
 */
export class ConflictResolver {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Resolve conflict using appropriate strategy
   */
  async resolveConflict(conflict: Conflict): Promise<ConflictResolution> {
    try {
      const strategy = await this.selectResolutionStrategy(conflict);
      const resolution = await this.applyResolutionStrategy(conflict, strategy);
      
      // Log resolution
      await this.logResolution(conflict, resolution);
      
      return resolution;
    } catch (error) {
      console.error('Error resolving conflict:', error);
      throw new Error('Failed to resolve conflict');
    }
  }

  /**
   * Select appropriate resolution strategy
   */
  private async selectResolutionStrategy(conflict: Conflict): Promise<ResolutionStrategy> {
    switch (conflict.type) {
      case 'simultaneous_edit':
        return 'last_write_wins';
      case 'content_conflict':
        return 'merge_content';
      case 'position_conflict':
        return 'average_position';
      case 'permission_conflict':
        return 'escalate_to_facilitator';
      case 'data_conflict':
        return 'validate_and_merge';
      default:
        return 'manual_resolution';
    }
  }

  /**
   * Apply resolution strategy
   */
  private async applyResolutionStrategy(conflict: Conflict, strategy: ResolutionStrategy): Promise<ConflictResolution> {
    switch (strategy) {
      case 'last_write_wins':
        return await this.applyLastWriteWins(conflict);
      case 'merge_content':
        return await this.applyContentMerge(conflict);
      case 'average_position':
        return await this.applyAveragePosition(conflict);
      case 'escalate_to_facilitator':
        return await this.escalateToFacilitator(conflict);
      case 'validate_and_merge':
        return await this.validateAndMerge(conflict);
      case 'manual_resolution':
        return await this.requireManualResolution(conflict);
      default:
        throw new Error('Unknown resolution strategy');
    }
  }

  /**
   * Apply last-write-wins strategy
   */
  private async applyLastWriteWins(conflict: Conflict): Promise<ConflictResolution> {
    const participants = conflict.participants;
    const timestamps = await this.getParticipantTimestamps(participants);
    const latestParticipant = this.getLatestParticipant(timestamps);
    
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'last_write_wins',
      resolution: {
        winner: latestParticipant,
        reason: 'Most recent edit takes precedence',
        timestamp: new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }

  /**
   * Apply content merge strategy
   */
  private async applyContentMerge(conflict: Conflict): Promise<ConflictResolution> {
    const contentVersions = await this.getContentVersions(conflict);
    const mergedContent = await this.mergeContent(contentVersions);
    
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'merge_content',
      resolution: {
        mergedContent,
        reason: 'Content merged from all versions',
        contributors: conflict.participants,
        timestamp: new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }

  /**
   * Apply average position strategy
   */
  private async applyAveragePosition(conflict: Conflict): Promise<ConflictResolution> {
    const positions = await this.getParticipantPositions(conflict);
    const averagePosition = this.calculateAveragePosition(positions);
    
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'average_position',
      resolution: {
        position: averagePosition,
        reason: 'Position averaged from all participants',
        contributors: conflict.participants,
        timestamp: new Date()
      },
      applied: true,
      requiresNotification: true
    };
  }

  /**
   * Escalate to facilitator
   */
  private async escalateToFacilitator(conflict: Conflict): Promise<ConflictResolution> {
    const facilitator = await this.getSessionFacilitator(conflict);
    
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'escalate_to_facilitator',
      resolution: {
        escalatedTo: facilitator,
        reason: 'Conflict requires facilitator intervention',
        timestamp: new Date()
      },
      applied: false,
      requiresNotification: true
    };
  }

  /**
   * Validate and merge data
   */
  private async validateAndMerge(conflict: Conflict): Promise<ConflictResolution> {
    const dataVersions = await this.getDataVersions(conflict);
    const validation = await this.validateData(dataVersions);
    
    if (validation.isValid) {
      const mergedData = await this.mergeData(dataVersions);
      return {
        id: this.generateId(),
        conflictId: conflict.id,
        strategy: 'validate_and_merge',
        resolution: {
          mergedData,
          reason: 'Data validated and merged successfully',
          contributors: conflict.participants,
          timestamp: new Date()
        },
        applied: true,
        requiresNotification: true
      };
    } else {
      return {
        id: this.generateId(),
        conflictId: conflict.id,
        strategy: 'validate_and_merge',
        resolution: {
          error: validation.error,
          reason: 'Data validation failed',
          timestamp: new Date()
        },
        applied: false,
        requiresNotification: true
      };
    }
  }

  /**
   * Require manual resolution
   */
  private async requireManualResolution(conflict: Conflict): Promise<ConflictResolution> {
    return {
      id: this.generateId(),
      conflictId: conflict.id,
      strategy: 'manual_resolution',
      resolution: {
        reason: 'Manual resolution required',
        participants: conflict.participants,
        timestamp: new Date()
      },
      applied: false,
      requiresNotification: true
    };
  }

  /**
   * Get participant timestamps
   */
  private async getParticipantTimestamps(participants: string[]): Promise<ParticipantTimestamp[]> {
    return await this.db.getParticipantTimestamps(participants);
  }

  /**
   * Get latest participant
   */
  private getLatestParticipant(timestamps: ParticipantTimestamp[]): string {
    return timestamps.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    ).participantId;
  }

  /**
   * Get content versions
   */
  private async getContentVersions(conflict: Conflict): Promise<ContentVersion[]> {
    return await this.db.getContentVersions(conflict);
  }

  /**
   * Merge content from versions
   */
  private async mergeContent(versions: ContentVersion[]): Promise<string> {
    // Simple merge strategy - combine all unique content
    const allContent = versions.map(v => v.content).join('\n\n');
    return allContent;
  }

  /**
   * Get participant positions
   */
  private async getParticipantPositions(conflict: Conflict): Promise<Position[]> {
    return await this.db.getParticipantPositions(conflict);
  }

  /**
   * Calculate average position
   */
  private calculateAveragePosition(positions: Position[]): Position {
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
    return { x: avgX, y: avgY };
  }

  /**
   * Get session facilitator
   */
  private async getSessionFacilitator(conflict: Conflict): Promise<string> {
    return await this.db.getSessionFacilitator(conflict);
  }

  /**
   * Get data versions
   */
  private async getDataVersions(conflict: Conflict): Promise<DataVersion[]> {
    return await this.db.getDataVersions(conflict);
  }

  /**
   * Validate data
   */
  private async validateData(versions: DataVersion[]): Promise<ValidationResult> {
    // Simple validation - check if all versions are valid
    const isValid = versions.every(v => v.isValid);
    return {
      isValid,
      error: isValid ? null : 'Invalid data detected'
    };
  }

  /**
   * Merge data
   */
  private async mergeData(versions: DataVersion[]): Promise<any> {
    // Simple merge strategy - use the most recent valid version
    const validVersions = versions.filter(v => v.isValid);
    return validVersions[validVersions.length - 1].data;
  }

  /**
   * Log resolution
   */
  private async logResolution(conflict: Conflict, resolution: ConflictResolution): Promise<void> {
    await this.db.logConflictResolution(conflict, resolution);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Type definitions
interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
  severity: 'low' | 'medium' | 'high';
}

interface ConflictResolution {
  id: string;
  conflictId: string;
  strategy: ResolutionStrategy;
  resolution: any;
  applied: boolean;
  requiresNotification: boolean;
}

type ResolutionStrategy = 
  | 'last_write_wins'
  | 'merge_content'
  | 'average_position'
  | 'escalate_to_facilitator'
  | 'validate_and_merge'
  | 'manual_resolution';

interface ParticipantTimestamp {
  participantId: string;
  timestamp: Date;
}

interface ContentVersion {
  participantId: string;
  content: string;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

interface DataVersion {
  participantId: string;
  data: any;
  isValid: boolean;
  timestamp: Date;
}

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}
