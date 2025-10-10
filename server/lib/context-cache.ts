/**
 * Context Cache Utilities
 * 
 * Helper functions for managing context caching across the application.
 * Provides cache warming, invalidation patterns, and monitoring.
 */

import { logger } from '../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheStats {
  size: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  avgTTL: number;
}

// ============================================================================
// CACHE MANAGER
// ============================================================================

export class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private hits = 0;
  private misses = 0;
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get item from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    entry.hits++;
    this.hits++;
    return entry.data;
  }

  /**
   * Set item in cache
   */
  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0
    });
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete items matching pattern
   */
  deletePattern(pattern: RegExp): number {
    let deleted = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = this.hits + this.misses;

    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? this.hits / totalRequests : 0,
      totalHits: this.hits,
      totalMisses: this.misses,
      avgTTL: entries.length > 0
        ? entries.reduce((sum, e) => sum + e.ttl, 0) / entries.length
        : 0
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cache cleanup completed', { cleaned });
    }

    return cleaned;
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSizeInBytes(): number {
    let size = 0;
    
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry.data).length;
    }

    return size;
  }
}

// ============================================================================
// CACHE WARMING
// ============================================================================

export class CacheWarmer<T> {
  private cacheManager: CacheManager<T>;
  private warmupFunction: (key: string) => Promise<T>;

  constructor(
    cacheManager: CacheManager<T>,
    warmupFunction: (key: string) => Promise<T>
  ) {
    this.cacheManager = cacheManager;
    this.warmupFunction = warmupFunction;
  }

  /**
   * Warm cache for specific keys
   */
  async warmup(keys: string[]): Promise<void> {
    logger.info('Starting cache warmup', { keyCount: keys.length });

    const results = await Promise.allSettled(
      keys.map(async key => {
        try {
          const data = await this.warmupFunction(key);
          this.cacheManager.set(key, data);
          return { key, success: true };
        } catch (error) {
          logger.error('Cache warmup failed for key', { key, error });
          return { key, success: false };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    logger.info('Cache warmup completed', {
      total: keys.length,
      successful,
      failed: keys.length - successful
    });
  }

  /**
   * Schedule periodic warmup
   */
  scheduleWarmup(keys: string[], intervalMs: number): NodeJS.Timeout {
    return setInterval(() => {
      this.warmup(keys).catch(error => {
        logger.error('Scheduled warmup failed', { error });
      });
    }, intervalMs);
  }
}

// ============================================================================
// CACHE INVALIDATION PATTERNS
// ============================================================================

export class CacheInvalidator<T> {
  private cacheManager: CacheManager<T>;
  private patterns: Map<string, RegExp> = new Map();

  constructor(cacheManager: CacheManager<T>) {
    this.cacheManager = cacheManager;
  }

  /**
   * Register invalidation pattern
   */
  registerPattern(name: string, pattern: RegExp): void {
    this.patterns.set(name, pattern);
  }

  /**
   * Invalidate by pattern name
   */
  invalidateByPattern(patternName: string): number {
    const pattern = this.patterns.get(patternName);
    
    if (!pattern) {
      logger.warn('Pattern not found', { patternName });
      return 0;
    }

    const deleted = this.cacheManager.deletePattern(pattern);
    
    logger.info('Cache invalidated by pattern', {
      patternName,
      deleted
    });

    return deleted;
  }

  /**
   * Invalidate by custom pattern
   */
  invalidateCustom(pattern: RegExp): number {
    return this.cacheManager.deletePattern(pattern);
  }

  /**
   * Invalidate specific key
   */
  invalidateKey(key: string): boolean {
    const deleted = this.cacheManager.delete(key);
    
    if (deleted) {
      logger.debug('Cache key invalidated', { key });
    }

    return deleted;
  }

  /**
   * Invalidate multiple keys
   */
  invalidateKeys(keys: string[]): number {
    let deleted = 0;
    
    for (const key of keys) {
      if (this.cacheManager.delete(key)) {
        deleted++;
      }
    }

    if (deleted > 0) {
      logger.info('Cache keys invalidated', { count: deleted });
    }

    return deleted;
  }
}

// ============================================================================
// MONITORING
// ============================================================================

export class CacheMonitor<T> {
  private cacheManager: CacheManager<T>;
  private alertThresholds: {
    hitRateMin?: number;
    sizeMax?: number;
    missRateMax?: number;
  };

  constructor(
    cacheManager: CacheManager<T>,
    alertThresholds: {
      hitRateMin?: number;
      sizeMax?: number;
      missRateMax?: number;
    } = {}
  ) {
    this.cacheManager = cacheManager;
    this.alertThresholds = alertThresholds;
  }

  /**
   * Check cache health
   */
  checkHealth(): {
    healthy: boolean;
    stats: CacheStats;
    alerts: string[];
  } {
    const stats = this.cacheManager.getStats();
    const alerts: string[] = [];
    let healthy = true;

    // Check hit rate
    if (
      this.alertThresholds.hitRateMin !== undefined &&
      stats.hitRate < this.alertThresholds.hitRateMin
    ) {
      alerts.push(`Low hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
      healthy = false;
    }

    // Check size
    if (
      this.alertThresholds.sizeMax !== undefined &&
      stats.size > this.alertThresholds.sizeMax
    ) {
      alerts.push(`Cache size exceeded: ${stats.size} entries`);
      healthy = false;
    }

    // Check miss rate
    const missRate = 1 - stats.hitRate;
    if (
      this.alertThresholds.missRateMax !== undefined &&
      missRate > this.alertThresholds.missRateMax
    ) {
      alerts.push(`High miss rate: ${(missRate * 100).toFixed(1)}%`);
      healthy = false;
    }

    return { healthy, stats, alerts };
  }

  /**
   * Log cache statistics
   */
  logStats(): void {
    const stats = this.cacheManager.getStats();
    
    logger.info('Cache statistics', {
      size: stats.size,
      hitRate: `${(stats.hitRate * 100).toFixed(1)}%`,
      totalHits: stats.totalHits,
      totalMisses: stats.totalMisses,
      avgTTL: `${(stats.avgTTL / 1000).toFixed(0)}s`
    });
  }

  /**
   * Start periodic monitoring
   */
  startMonitoring(intervalMs: number = 60000): NodeJS.Timeout {
    return setInterval(() => {
      const health = this.checkHealth();
      
      if (!health.healthy) {
        logger.warn('Cache health check failed', {
          alerts: health.alerts,
          stats: health.stats
        });
      } else {
        this.logStats();
      }
    }, intervalMs);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export function createCache<T>(defaultTTL?: number): CacheManager<T> {
  return new CacheManager<T>(defaultTTL);
}

export function createCacheWarmer<T>(
  cache: CacheManager<T>,
  warmupFn: (key: string) => Promise<T>
): CacheWarmer<T> {
  return new CacheWarmer<T>(cache, warmupFn);
}

export function createCacheInvalidator<T>(
  cache: CacheManager<T>
): CacheInvalidator<T> {
  return new CacheInvalidator<T>(cache);
}

export function createCacheMonitor<T>(
  cache: CacheManager<T>,
  thresholds?: {
    hitRateMin?: number;
    sizeMax?: number;
    missRateMax?: number;
  }
): CacheMonitor<T> {
  return new CacheMonitor<T>(cache, thresholds);
}
