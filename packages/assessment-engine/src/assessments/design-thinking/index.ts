/**
 * Design Thinking Assessment Module
 * Main entry point for Design Thinking readiness assessment
 */

import { AssessmentResponse } from '../../models/common.model.ts';
import { DTReadinessProfile, DTScores, DTRecommendation } from './scoring.ts';
import { dtQuestions } from './questions.ts';
import { 
  calculateDTScores, 
  generateDTRecommendations, 
  detectCrossAssessmentPatterns,
  generateDTReadinessProfile 
} from './scoring.ts';

export class DesignThinkingReadinessAssessment {
  /**
   * Get all Design Thinking questions
   */
  getQuestions() {
    return dtQuestions;
  }

  /**
   * Calculate DT scores from responses
   */
  calculateScores(responses: AssessmentResponse[]): DTScores {
    return calculateDTScores(responses);
  }

  /**
   * Generate DT recommendations based on scores
   */
  generateRecommendations(scores: DTScores): DTRecommendation[] {
    return generateDTRecommendations(scores);
  }

  /**
   * Detect cross-assessment patterns with other assessments
   */
  detectPatterns(
    dtScores: DTScores, 
    existingScores?: { [key: string]: number }
  ): string[] {
    return detectCrossAssessmentPatterns(dtScores, existingScores);
  }

  /**
   * Generate complete DT readiness profile
   */
  generateProfile(
    responses: AssessmentResponse[],
    existingScores?: { [key: string]: number }
  ): DTReadinessProfile {
    return generateDTReadinessProfile(responses, existingScores);
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
