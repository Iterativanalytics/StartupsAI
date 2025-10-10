/**
 * Tests for User Context Service
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { UserContextService } from '../user-context-service';

describe('UserContextService', () => {
  let service: UserContextService;

  beforeEach(() => {
    service = new UserContextService();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('buildContext', () => {
    it('should build comprehensive user context', async () => {
      const userId = 1;
      
      const context = await service.buildContext(userId);
      
      expect(context).toHaveProperty('userId', userId);
      expect(context).toHaveProperty('userType');
      expect(context).toHaveProperty('businessProfile');
      expect(context).toHaveProperty('documents');
      expect(context).toHaveProperty('recentActivity');
      expect(context).toHaveProperty('goals');
      expect(context).toHaveProperty('metrics');
      expect(context).toHaveProperty('relationships');
      expect(context).toHaveProperty('preferences');
      expect(context).toHaveProperty('cachedAt');
    });

    it('should use cache for repeated requests', async () => {
      const userId = 1;
      
      const context1 = await service.buildContext(userId);
      const context2 = await service.buildContext(userId);
      
      // Should return same cached instance
      expect(context1.cachedAt).toEqual(context2.cachedAt);
    });

    it('should invalidate cache on demand', async () => {
      const userId = 1;
      
      const context1 = await service.buildContext(userId);
      await service.invalidateContext(userId);
      const context2 = await service.buildContext(userId);
      
      // Should have different cache timestamps
      expect(context1.cachedAt.getTime()).not.toEqual(context2.cachedAt.getTime());
    });
  });

  describe('cache management', () => {
    it('should report cache statistics', () => {
      const stats = service.getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('ttl');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.ttl).toBe('number');
    });

    it('should clear all cache', async () => {
      await service.buildContext(1);
      await service.buildContext(2);
      
      let stats = service.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      
      service.clearCache();
      
      stats = service.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('event-driven invalidation', () => {
    it('should invalidate cache on business plan update', async () => {
      const userId = 1;
      
      await service.buildContext(userId);
      const statsBefore = service.getCacheStats();
      
      service.emitContextChange('business_plan:updated', userId);
      
      // Cache should be invalidated
      const statsAfter = service.getCacheStats();
      expect(statsAfter.size).toBeLessThan(statsBefore.size);
    });
  });
});
