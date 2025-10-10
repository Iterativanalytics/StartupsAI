/**
 * Memory Decay Algorithms
 * 
 * Implements various decay functions for agent memory importance scoring.
 * Based on cognitive science principles and practical ML applications.
 */

import { logger } from '../utils/logger';

// ============================================================================
// DECAY FUNCTIONS
// ============================================================================

/**
 * Exponential decay - Most common, smooth degradation
 * importance = initial * (decayRate ^ days)
 */
export function exponentialDecay(
  initialImportance: number,
  daysSinceCreation: number,
  decayRate: number = 0.9
): number {
  const decayed = initialImportance * Math.pow(decayRate, daysSinceCreation);
  return Math.max(decayed, 10); // Minimum importance of 10
}

/**
 * Linear decay - Simple, predictable degradation
 * importance = initial - (dailyDecay * days)
 */
export function linearDecay(
  initialImportance: number,
  daysSinceCreation: number,
  dailyDecay: number = 2
): number {
  const decayed = initialImportance - (dailyDecay * daysSinceCreation);
  return Math.max(decayed, 10);
}

/**
 * Ebbinghaus forgetting curve - Mimics human memory
 * importance = initial * (1 + days)^(-strength)
 */
export function ebbinghausDecay(
  initialImportance: number,
  daysSinceCreation: number,
  strength: number = 0.5
): number {
  const decayed = initialImportance * Math.pow(1 + daysSinceCreation, -strength);
  return Math.max(decayed, 10);
}

/**
 * Step decay - Sudden drops at intervals
 * Useful for time-sensitive information
 */
export function stepDecay(
  initialImportance: number,
  daysSinceCreation: number,
  stepSize: number = 7, // Weekly steps
  decayPerStep: number = 15
): number {
  const steps = Math.floor(daysSinceCreation / stepSize);
  const decayed = initialImportance - (steps * decayPerStep);
  return Math.max(decayed, 10);
}

/**
 * Logarithmic decay - Rapid initial decay, then slower
 * importance = initial - (coefficient * log(days + 1))
 */
export function logarithmicDecay(
  initialImportance: number,
  daysSinceCreation: number,
  coefficient: number = 10
): number {
  const decayed = initialImportance - (coefficient * Math.log(daysSinceCreation + 1));
  return Math.max(decayed, 10);
}

// ============================================================================
// DECAY WITH ACCESS BOOST
// ============================================================================

/**
 * Apply decay with access frequency boost
 * Frequently accessed memories decay slower
 */
export function decayWithAccessBoost(
  initialImportance: number,
  daysSinceCreation: number,
  accessCount: number,
  baseDecayRate: number = 0.9
): number {
  // Access boost: each access reduces effective age
  const accessBoost = Math.min(accessCount * 0.5, 10); // Max 10 days reduction
  const effectiveAge = Math.max(daysSinceCreation - accessBoost, 0);
  
  return exponentialDecay(initialImportance, effectiveAge, baseDecayRate);
}

/**
 * Apply decay with recency boost
 * Recently accessed memories get temporary importance boost
 */
export function decayWithRecencyBoost(
  initialImportance: number,
  daysSinceCreation: number,
  daysSinceLastAccess: number,
  baseDecayRate: number = 0.9
): number {
  const baseDecay = exponentialDecay(initialImportance, daysSinceCreation, baseDecayRate);
  
  // Recency boost: recent access provides temporary importance
  const recencyBoost = daysSinceLastAccess < 7 
    ? (7 - daysSinceLastAccess) * 2 
    : 0;
  
  return Math.min(baseDecay + recencyBoost, 100);
}

// ============================================================================
// CONTEXT-AWARE DECAY
// ============================================================================

/**
 * Apply different decay rates based on memory type
 */
export function contextualDecay(
  initialImportance: number,
  daysSinceCreation: number,
  memoryType: 'goal' | 'preference' | 'fact' | 'insight' | 'relationship' | 'decision' | 'pattern' | 'milestone'
): number {
  const decayRates: Record<string, number> = {
    goal: 0.95,        // Goals decay slowly
    milestone: 0.92,   // Milestones are relatively stable
    preference: 0.98,  // Preferences very stable
    insight: 0.88,     // Insights decay moderately
    decision: 0.90,    // Decisions fairly stable
    relationship: 0.95,// Relationships stable
    pattern: 0.85,     // Patterns may change
    fact: 0.80         // Facts become outdated
  };

  const rate = decayRates[memoryType] || 0.9;
  return exponentialDecay(initialImportance, daysSinceCreation, rate);
}

// ============================================================================
// REINFORCEMENT LEARNING
// ============================================================================

/**
 * Update importance based on user feedback
 */
export function updateImportanceFromFeedback(
  currentImportance: number,
  feedback: 'positive' | 'negative' | 'neutral',
  learningRate: number = 0.1
): number {
  const adjustments = {
    positive: 10,
    neutral: 0,
    negative: -10
  };

  const adjustment = adjustments[feedback] * learningRate;
  const updated = currentImportance + adjustment;
  
  return Math.max(Math.min(updated, 100), 10); // Clamp between 10-100
}

/**
 * Boost importance based on successful use
 */
export function boostImportanceOnUse(
  currentImportance: number,
  useWasHelpful: boolean,
  boostFactor: number = 0.05
): number {
  if (!useWasHelpful) {
    return currentImportance;
  }

  const boost = currentImportance * boostFactor;
  return Math.min(currentImportance + boost, 100);
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Apply decay to batch of memories efficiently
 */
export function batchDecay(
  memories: Array<{
    importance: number;
    createdAt: Date;
    memoryType: string;
    accessCount?: number;
  }>,
  decayFunction: 'exponential' | 'contextual' | 'access' = 'contextual'
): number[] {
  const now = Date.now();

  return memories.map(memory => {
    const daysSinceCreation = 
      (now - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24);

    switch (decayFunction) {
      case 'exponential':
        return exponentialDecay(memory.importance, daysSinceCreation);
      
      case 'contextual':
        return contextualDecay(
          memory.importance, 
          daysSinceCreation, 
          memory.memoryType as any
        );
      
      case 'access':
        return decayWithAccessBoost(
          memory.importance,
          daysSinceCreation,
          memory.accessCount || 0
        );
      
      default:
        return exponentialDecay(memory.importance, daysSinceCreation);
    }
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate half-life of decay rate
 * Days until importance drops to 50%
 */
export function calculateHalfLife(decayRate: number): number {
  if (decayRate >= 1) {
    return Infinity;
  }
  return Math.log(0.5) / Math.log(decayRate);
}

/**
 * Calculate decay rate from desired half-life
 */
export function decayRateFromHalfLife(halfLifeDays: number): number {
  return Math.pow(0.5, 1 / halfLifeDays);
}

/**
 * Predict future importance
 */
export function predictImportance(
  currentImportance: number,
  daysInFuture: number,
  decayRate: number = 0.9
): number {
  return exponentialDecay(currentImportance, daysInFuture, decayRate);
}

/**
 * Calculate time until importance drops below threshold
 */
export function daysUntilThreshold(
  currentImportance: number,
  threshold: number,
  decayRate: number = 0.9
): number {
  if (currentImportance <= threshold) {
    return 0;
  }
  
  if (decayRate >= 1) {
    return Infinity;
  }

  return Math.log(threshold / currentImportance) / Math.log(decayRate);
}

// ============================================================================
// LOGGING & MONITORING
// ============================================================================

/**
 * Log decay statistics for monitoring
 */
export function logDecayStats(
  memories: Array<{
    importance: number;
    createdAt: Date;
    memoryType: string;
  }>
): void {
  const types = new Set(memories.map(m => m.memoryType));
  const stats: Record<string, any> = {};

  types.forEach(type => {
    const typeMemories = memories.filter(m => m.memoryType === type);
    const avgImportance = typeMemories.reduce((sum, m) => sum + m.importance, 0) / typeMemories.length;
    const avgAge = typeMemories.reduce((sum, m) => {
      const days = (Date.now() - m.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0) / typeMemories.length;

    stats[type] = {
      count: typeMemories.length,
      avgImportance: avgImportance.toFixed(1),
      avgAgeDays: avgAge.toFixed(1)
    };
  });

  logger.info('Memory decay statistics', stats);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const DecayFunctions = {
  exponential: exponentialDecay,
  linear: linearDecay,
  ebbinghaus: ebbinghausDecay,
  step: stepDecay,
  logarithmic: logarithmicDecay,
  withAccessBoost: decayWithAccessBoost,
  withRecencyBoost: decayWithRecencyBoost,
  contextual: contextualDecay
};

export const DecayUtils = {
  calculateHalfLife,
  decayRateFromHalfLife,
  predictImportance,
  daysUntilThreshold,
  logDecayStats
};
