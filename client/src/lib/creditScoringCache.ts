/**
 * In-memory cache for credit scoring calculations with TTL support
 */
class CreditScoringCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  /**
   * Generate cache key from form data
   */
  private generateKey(data: any): string {
    const sortedKeys = Object.keys(data).sort();
    const keyString = sortedKeys.map(key => `${key}:${data[key]}`).join('|');
    return btoa(keyString); // Base64 encode for consistent key format
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Set cache entry with optional TTL
   */
  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  /**
   * Get cache entry if valid
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (!this.isValid(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Get cached score result by form data
   */
  getCachedScore(formData: any): any | null {
    const key = this.generateKey(formData);
    return this.get(key);
  }

  /**
   * Cache score result by form data
   */
  setCachedScore(formData: any, scoreResult: any, ttl?: number): void {
    const key = this.generateKey(formData);
    this.set(key, scoreResult, ttl);
  }

  /**
   * Check if score is cached
   */
  hasCachedScore(formData: any): boolean {
    const key = this.generateKey(formData);
    return this.getCachedScore(formData) !== null;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate: number; keys: string[] } {
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses to calculate
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Set default TTL for new entries
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Create singleton instance
export const creditScoringCache = new CreditScoringCache();

/**
 * Decorator for caching expensive calculations
 */
export function withCache<T extends (...args: any[]) => any>(
  fn: T,
  ttl?: number
): T {
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cached = creditScoringCache.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = fn(...args);
    creditScoringCache.set(key, result, ttl);
    
    return result;
  }) as T;
}

/**
 * Memoization decorator for React components
 */
export function memoizeComponent<T>(component: T): T {
  // Note: React needs to be imported where this is used
  return component; // Simplified for now, would need React import
}

export default creditScoringCache;
