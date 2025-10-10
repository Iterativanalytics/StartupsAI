/**
 * Agent Memory Service
 * 
 * High-level service layer for agent memory management.
 * Wraps the low-level agent-database service with business logic:
 * - Importance scoring and decay
 * - Relevance-based retrieval
 * - Memory categorization
 * - Cross-agent memory sharing
 * 
 * Built on top of existing agent-database.ts infrastructure.
 */

import { ObjectId } from 'mongodb';
import { getAgentDatabase, AgentMemory as DbAgentMemory, AgentType } from './agent-database';
import { logger } from '../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AgentMemory {
  id?: string;
  userId: number;
  agentType: AgentType;
  memoryKey: string;
  memoryValue: any;
  memoryType: MemoryType;
  importance: number; // 0-100
  confidence: number; // 0-100
  createdAt?: Date;
  lastAccessed?: Date;
  accessCount?: number;
  expiresAt?: Date;
  decayRate?: number;
}

export type MemoryType = 'fact' | 'preference' | 'goal' | 'insight' | 'relationship' | 'decision' | 'pattern' | 'milestone';

export interface RelevantMemoriesOptions {
  types?: MemoryType[];
  minImportance?: number;
  limit?: number;
  context?: string;
}

// ============================================================================
// AGENT MEMORY SERVICE
// ============================================================================

export class AgentMemoryService {
  private agentDb = getAgentDatabase();

  /**
   * Save or update a memory
   */
  async saveMemory(memory: Omit<AgentMemory, 'id' | 'createdAt' | 'lastAccessed' | 'accessCount'>): Promise<void> {
    try {
      const importance = this.calculateImportance(memory);
      const decayRate = this.determineDecayRate(memory.memoryType);

      const dbMemory: Omit<DbAgentMemory, '_id' | 'createdAt' | 'updatedAt'> = {
        userId: memory.userId,
        agentType: memory.agentType,
        memoryType: memory.memoryType,
        memoryKey: memory.memoryKey,
        memoryValue: typeof memory.memoryValue === 'string' 
          ? memory.memoryValue 
          : JSON.stringify(memory.memoryValue),
        importanceScore: importance / 100, // Convert to 0-1
        confidenceScore: (memory.confidence || 80) / 100,
        accessCount: 0
      };

      if (memory.expiresAt) {
        dbMemory.expiresAt = memory.expiresAt;
      }

      await this.agentDb.saveMemory(dbMemory);

      logger.debug('Memory saved', {
        userId: memory.userId,
        agentType: memory.agentType,
        memoryKey: memory.memoryKey,
        importance
      });
    } catch (error) {
      logger.error('Failed to save memory', { memory, error });
      throw error;
    }
  }

  /**
   * Get a specific memory
   */
  async getMemory(
    userId: number,
    agentType: AgentType,
    memoryKey: string
  ): Promise<AgentMemory | null> {
    try {
      const dbMemory = await this.agentDb.getMemory(userId, agentType, memoryKey);
      
      if (!dbMemory) {
        return null;
      }

      return this.convertToAgentMemory(dbMemory);
    } catch (error) {
      logger.error('Failed to get memory', { userId, agentType, memoryKey, error });
      return null;
    }
  }

  /**
   * Get relevant memories with scoring and decay
   */
  async getRelevantMemories(
    userId: number,
    agentType: AgentType,
    options: RelevantMemoriesOptions = {}
  ): Promise<AgentMemory[]> {
    try {
      const {
        types,
        minImportance = 30,
        limit = 20,
        context
      } = options;

      // Get memories from database
      const dbMemories = await this.agentDb.getRelevantMemories(
        userId,
        agentType,
        types,
        minImportance / 100, // Convert to 0-1
        limit * 2 // Get more to allow for filtering
      );

      // Convert to AgentMemory format
      let memories = dbMemories.map(m => this.convertToAgentMemory(m));

      // Apply time decay
      memories = memories.map(m => this.applyDecay(m));

      // If context provided, score by relevance
      if (context) {
        const scoredMemories = await Promise.all(
          memories.map(async memory => ({
            memory,
            relevanceScore: await this.calculateRelevance(memory, context)
          }))
        );

        // Sort by combined score (importance * relevance)
        scoredMemories.sort((a, b) => {
          const scoreA = a.memory.importance * a.relevanceScore;
          const scoreB = b.memory.importance * b.relevanceScore;
          return scoreB - scoreA;
        });

        memories = scoredMemories.map(s => s.memory);
      } else {
        // Sort by importance and recency
        memories.sort((a, b) => {
          const scoreA = a.importance + (a.lastAccessed ? new Date().getTime() - a.lastAccessed.getTime() : 0) / 1000000;
          const scoreB = b.importance + (b.lastAccessed ? new Date().getTime() - b.lastAccessed.getTime() : 0) / 1000000;
          return scoreB - scoreA;
        });
      }

      // Return top memories
      const topMemories = memories.slice(0, limit);

      logger.debug('Retrieved relevant memories', {
        userId,
        agentType,
        count: topMemories.length,
        hasContext: !!context
      });

      return topMemories;
    } catch (error) {
      logger.error('Failed to get relevant memories', { userId, agentType, options, error });
      return [];
    }
  }

  /**
   * Share memory across agents
   */
  async shareMemoryAcrossAgents(
    userId: number,
    sourceAgent: AgentType,
    targetAgent: AgentType,
    memoryKey: string
  ): Promise<void> {
    try {
      const sourceMemory = await this.getMemory(userId, sourceAgent, memoryKey);

      if (!sourceMemory) {
        logger.warn('Source memory not found for sharing', {
          userId,
          sourceAgent,
          memoryKey
        });
        return;
      }

      // Create shared memory for target agent
      await this.saveMemory({
        userId,
        agentType: targetAgent,
        memoryKey: `shared_${memoryKey}`,
        memoryValue: sourceMemory.memoryValue,
        memoryType: sourceMemory.memoryType,
        importance: sourceMemory.importance * 0.9, // Slightly reduce importance for shared memory
        confidence: sourceMemory.confidence
      });

      logger.info('Memory shared across agents', {
        userId,
        sourceAgent,
        targetAgent,
        memoryKey
      });
    } catch (error) {
      logger.error('Failed to share memory', {
        userId,
        sourceAgent,
        targetAgent,
        memoryKey,
        error
      });
      throw error;
    }
  }

  /**
   * Delete expired memories
   */
  async cleanupExpiredMemories(): Promise<number> {
    try {
      const count = await this.agentDb.deleteExpiredMemories();
      logger.info('Expired memories cleaned up', { count });
      return count;
    } catch (error) {
      logger.error('Failed to cleanup expired memories', { error });
      return 0;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Calculate importance score based on memory type and content
   */
  private calculateImportance(memory: Partial<AgentMemory>): number {
    const categoryWeights: Record<MemoryType, number> = {
      goal: 90,
      milestone: 85,
      insight: 80,
      decision: 75,
      preference: 70,
      relationship: 65,
      pattern: 60,
      fact: 50
    };

    return categoryWeights[memory.memoryType || 'fact'];
  }

  /**
   * Determine decay rate based on memory type
   */
  private determineDecayRate(type: MemoryType): number {
    const decayRates: Record<MemoryType, number> = {
      goal: 0.95,        // Goals decay slowly
      milestone: 0.92,   // Milestones are relatively stable
      preference: 0.98,  // Preferences are very stable
      insight: 0.88,     // Insights decay moderately
      decision: 0.90,    // Decisions are fairly stable
      relationship: 0.95, // Relationships are stable
      pattern: 0.85,     // Patterns may change
      fact: 0.80         // Facts can become outdated quickly
    };

    return decayRates[type];
  }

  /**
   * Apply time decay to importance score
   */
  private applyDecay(memory: AgentMemory): AgentMemory {
    if (!memory.createdAt) {
      return memory;
    }

    const daysSinceCreation = 
      (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    const decayRate = memory.decayRate || this.determineDecayRate(memory.memoryType);
    const decayedImportance = memory.importance * Math.pow(decayRate, daysSinceCreation);

    return {
      ...memory,
      importance: Math.max(decayedImportance, 10) // Minimum importance of 10
    };
  }

  /**
   * Calculate relevance of memory to current context
   */
  private async calculateRelevance(
    memory: AgentMemory,
    context: string
  ): Promise<number> {
    // Simple keyword-based relevance (can be enhanced with embeddings later)
    const memoryText = JSON.stringify(memory.memoryValue).toLowerCase();
    const contextText = context.toLowerCase();

    // Extract significant keywords (3+ characters)
    const keywords = contextText
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));

    if (keywords.length === 0) {
      return 0.5; // Neutral relevance if no keywords
    }

    // Count keyword matches
    const matches = keywords.filter(keyword => memoryText.includes(keyword)).length;
    const relevance = matches / keywords.length;

    return Math.min(relevance, 1.0);
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
      'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  /**
   * Convert database memory to AgentMemory format
   */
  private convertToAgentMemory(dbMemory: DbAgentMemory): AgentMemory {
    let memoryValue = dbMemory.memoryValue;
    
    // Try to parse JSON if it's a string
    if (typeof memoryValue === 'string') {
      try {
        memoryValue = JSON.parse(memoryValue);
      } catch {
        // Keep as string if not valid JSON
      }
    }

    return {
      id: dbMemory._id?.toString(),
      userId: dbMemory.userId,
      agentType: dbMemory.agentType,
      memoryKey: dbMemory.memoryKey,
      memoryValue,
      memoryType: dbMemory.memoryType,
      importance: (dbMemory.importanceScore || 0.5) * 100, // Convert to 0-100
      confidence: (dbMemory.confidenceScore || 0.8) * 100,
      createdAt: dbMemory.createdAt,
      lastAccessed: dbMemory.lastAccessedAt,
      accessCount: dbMemory.accessCount,
      expiresAt: dbMemory.expiresAt
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let agentMemoryServiceInstance: AgentMemoryService | null = null;

export function getAgentMemoryService(): AgentMemoryService {
  if (!agentMemoryServiceInstance) {
    agentMemoryServiceInstance = new AgentMemoryService();
  }
  return agentMemoryServiceInstance;
}

// Export singleton for convenience
export const agentMemoryService = getAgentMemoryService();
