/**
 * Lean Design Thinking™ Assessment Module
 * Main entry point for Lean Design Thinking™ readiness assessment
 */

import { AssessmentResponse } from '../../models/common.model.ts';
import { LDTReadinessProfile, LDTScores, LDTRecommendation } from './scoring.ts';
import { dtQuestions } from './questions.ts';
import { 
  calculateLDTScores, 
  generateLDTRecommendations, 
  detectCrossAssessmentPatterns,
  generateLDTReadinessProfile 
} from './scoring.ts';

export class DesignThinkingReadinessAssessment {
  /**
   * Get all Lean Design Thinking™ questions
   */
  getQuestions() {
    return dtQuestions;
  }

  /**
   * Calculate LLDT scores from responses
   */
  calculateScores(responses: AssessmentResponse[]): LDTScores {
    return calculateLDTScores(responses);
  }

  /**
   * Generate LLDT recommendations based on scores
   */
  generateRecommendations(scores: LDTScores): LDTRecommendation[] {
    return generateLDTRecommendations(scores);
  }

  /**
   * Detect cross-assessment patterns with other assessments
   */
  detectPatterns(
    dtScores: LDTScores, 
    existingScores?: { [key: string]: number }
  ): string[] {
    return detectCrossAssessmentPatterns(dtScores, existingScores);
  }

  /**
   * Generate complete LLDT readiness profile
   */
  generateProfile(
    responses: AssessmentResponse[],
    existingScores?: { [key: string]: number }
  ): LDTReadinessProfile {
    return generateLDTReadinessProfile(responses, existingScores);
  }

  /**
   * Get questions by category
   */
  getQuestionsByCategory(category: string) {
    return dtQuestions.filter(q => q.category === category);
  }

  /**
   * Get all available categories
   */
  getCategories() {
    return [...new Set(dtQuestions.map(q => q.category))];
  }
}

export { dtQuestions } from './questions.ts';
export * from './scoring.ts';
