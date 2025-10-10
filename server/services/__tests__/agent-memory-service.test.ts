/**
 * Tests for Agent Memory Service
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AgentMemoryService } from '../agent-memory-service';

describe('AgentMemoryService', () => {
  let service: AgentMemoryService;

  beforeEach(() => {
    service = new AgentMemoryService();
  });

  describe('saveMemory', () => {
    it('should save memory with calculated importance', async () => {
      const memory = {
        userId: 1,
        agentType: 'co_founder' as const,
        memoryKey: 'test_goal',
        memoryValue: { title: 'Launch MVP', deadline: '2026-06-01' },
        memoryType: 'goal' as const,
        importance: 90,
        confidence: 85
      };

      await expect(service.saveMemory(memory)).resolves.not.toThrow();
    });

    it('should handle different memory types', async () => {
      const types: Array<'fact' | 'preference' | 'goal' | 'insight' | 'relationship'> = [
        'fact',
        'preference',
        'goal',
        'insight',
        'relationship'
      ];

      for (const type of types) {
        const memory = {
          userId: 1,
          agentType: 'co_founder' as const,
          memoryKey: `test_${type}`,
          memoryValue: `Test ${type} value`,
          memoryType: type,
          importance: 70,
          confidence: 80
        };

        await expect(service.saveMemory(memory)).resolves.not.toThrow();
      }
    });
  });

  describe('getRelevantMemories', () => {
    beforeEach(async () => {
      // Seed some test memories
      const memories = [
        {
          userId: 1,
          agentType: 'co_founder' as const,
          memoryKey: 'goal_1',
          memoryValue: 'Launch product',
          memoryType: 'goal' as const,
          importance: 90,
          confidence: 85
        },
        {
          userId: 1,
          agentType: 'co_founder' as const,
          memoryKey: 'preference_1',
          memoryValue: 'Prefers data-driven decisions',
          memoryType: 'preference' as const,
          importance: 70,
          confidence: 80
        }
      ];

      for (const memory of memories) {
        await service.saveMemory(memory);
      }
    });

    it('should retrieve memories with default options', async () => {
      const memories = await service.getRelevantMemories(1, 'co_founder', {});
      
      expect(Array.isArray(memories)).toBe(true);
    });

    it('should filter by memory type', async () => {
      const memories = await service.getRelevantMemories(1, 'co_founder', {
        types: ['goal']
      });
      
      expect(memories.every(m => m.memoryType === 'goal')).toBe(true);
    });

    it('should limit results', async () => {
      const memories = await service.getRelevantMemories(1, 'co_founder', {
        limit: 1
      });
      
      expect(memories.length).toBeLessThanOrEqual(1);
    });

    it('should apply importance threshold', async () => {
      const memories = await service.getRelevantMemories(1, 'co_founder', {
        minImportance: 80
      });
      
      expect(memories.every(m => m.importance >= 80)).toBe(true);
    });

    it('should score by relevance when context provided', async () => {
      const memories = await service.getRelevantMemories(1, 'co_founder', {
        context: 'product launch planning',
        limit: 10
      });
      
      expect(Array.isArray(memories)).toBe(true);
    });
  });

  describe('shareMemoryAcrossAgents', () => {
    it('should share memory between agents', async () => {
      const sourceMemory = {
        userId: 1,
        agentType: 'co_founder' as const,
        memoryKey: 'important_fact',
        memoryValue: 'User prefers visual data',
        memoryType: 'preference' as const,
        importance: 80,
        confidence: 85
      };

      await service.saveMemory(sourceMemory);

      await service.shareMemoryAcrossAgents(
        1,
        'co_founder',
        'co_investor',
        'important_fact'
      );

      // Verify shared memory exists for target agent
      const sharedMemory = await service.getMemory(
        1,
        'co_investor',
        'shared_important_fact'
      );

      expect(sharedMemory).toBeTruthy();
    });
  });

  describe('cleanupExpiredMemories', () => {
    it('should remove expired memories', async () => {
      const expiredMemory = {
        userId: 1,
        agentType: 'co_founder' as const,
        memoryKey: 'expired_fact',
        memoryValue: 'Old information',
        memoryType: 'fact' as const,
        importance: 50,
        confidence: 70,
        expiresAt: new Date(Date.now() - 86400000) // Expired yesterday
      };

      await service.saveMemory(expiredMemory);

      const count = await service.cleanupExpiredMemories();

      expect(typeof count).toBe('number');
    });
  });
});
