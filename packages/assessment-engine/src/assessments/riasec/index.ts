/**
 * RIASEC Assessment Module
 * Main entry point for RIASEC career interest assessment
 */

import { AssessmentResponse } from '../../models/common.model.ts';
import { RIASECProfile } from '../../models/riasec.model.ts';
import { RIASEC_QUESTIONS } from './questionnaire.ts';
import { RIASECScorer } from './scoring.ts';
import { RIASECInterpreter } from './interpretation.ts';

export class RIASECAssessment {
  private scorer: RIASECScorer;
  private interpreter: RIASECInterpreter;

  constructor() {
    this.scorer = new RIASECScorer();
    this.interpreter = new RIASECInterpreter();
  }

  /**
   * Get all RIASEC questions
   */
  getQuestions() {
    return RIASEC_QUESTIONS;
  }

  /**
   * Process RIASEC assessment responses and generate profile
   */
  processAssessment(responses: AssessmentResponse[]): RIASECProfile {
    // Validate responses
    this.validateResponses(responses);

    // Calculate scores
    const scores = this.scorer.calculateRawScores(responses);

    // Determine primary Holland code
    const primaryCode = this.scorer.getPrimaryCode(scores);

    // Calculate percentiles
    const percentiles = this.scorer.calculatePercentiles(scores);

    // Generate interpretation
    const interpretation = this.interpreter.interpretProfile(scores, primaryCode);

    return {
      scores,
      primaryCode,
      interpretation,
      percentiles
    };
  }

  /**
   * Validate assessment responses
   */
  private validateResponses(responses: AssessmentResponse[]): void {
    if (responses.length < RIASEC_QUESTIONS.length) {
      throw new Error(`Incomplete assessment: expected ${RIASEC_QUESTIONS.length} responses, got ${responses.length}`);
    }

    // Validate each response has valid question ID and value
    responses.forEach(response => {
      const question = RIASEC_QUESTIONS.find(q => q.id === response.questionId);
      if (!question) {
        throw new Error(`Invalid question ID: ${response.questionId}`);
      }

      const value = typeof response.value === 'number' ? response.value : parseInt(response.value as string);
      if (value < 1 || value > 5) {
        throw new Error(`Invalid response value for ${response.questionId}: ${value} (must be 1-5)`);
      }
    });
  }
}

// Export everything from this module
export * from './questionnaire.ts';
export * from './scoring.ts';
export * from './interpretation.ts';
export * from './startup-mapping.ts';