/**
 * Assessment Engine
 * 
 * Main orchestrator for all assessment types
 * Coordinates assessment execution, scoring, and profile generation
 */

import { RIASECAssessment } from './assessments/riasec/index.ts';
import { DesignThinkingReadinessAssessment } from './assessments/design-thinking/index.ts';
import { AssessmentResponse, AssessmentMetadata } from './models/common.model.ts';
import { RIASECProfile } from './models/riasec.model.ts';
import { CompositeProfile, AssessmentBundle } from './models/composite.model.ts';

export interface AssessmentEngineConfig {
  userId: string;
  userName: string;
  userEmail: string;
}

export interface AssessmentSession {
  sessionId: string;
  userId: string;
  assessmentType: 'riasec' | 'big_five' | 'ai_readiness' | 'design_thinking' | 'composite';
  status: 'in_progress' | 'completed' | 'abandoned';
  responses: AssessmentResponse[];
  startedAt: Date;
  completedAt?: Date;
  metadata?: AssessmentMetadata;
}

export class AssessmentEngine {
  private riasecAssessment: RIASECAssessment;
  private dtReadinessAssessment: DesignThinkingReadinessAssessment;
  private config!: AssessmentEngineConfig;

  constructor(config: AssessmentEngineConfig) {
    this.config = config;
    this.riasecAssessment = new RIASECAssessment();
    this.dtReadinessAssessment = new DesignThinkingReadinessAssessment();
  }

  // ============================================================================
  // ============================================================================

  /**
   * Get questions for a specific assessment type
   */
  getAssessmentQuestions(assessmentType: string): any[] {
    switch (assessmentType) {
      case 'riasec':
        return this.riasecAssessment.getQuestions();
      case 'design_thinking':
        return this.dtReadinessAssessment.getQuestions();
      default:
        throw new Error(`Unknown assessment type: ${assessmentType}`);
    }
  }

  /**
   * Process RIASEC assessment
   */
  processRIASEC(responses: AssessmentResponse[]): RIASECProfile {
    return this.riasecAssessment.processAssessment(responses);
  }

  /**
   * Process Lean Design Thinking™ Readiness assessment
   */
  processDesignThinkingReadiness(responses: AssessmentResponse[]): any {
    return this.dtReadinessAssessment.generateProfile(responses);
  }

  /**
   * Create assessment session
   */
  createSession(assessmentType: string): AssessmentSession {
    return {
      sessionId: this.generateSessionId(),
      userId: this.config.userId,
      assessmentType: assessmentType as any,
      status: 'in_progress',
      responses: [],
      startedAt: new Date()
    };
  }

  /**
   * Update assessment session with responses
   */
  updateSession(
    session: AssessmentSession,
    responses: AssessmentResponse[]
  ): AssessmentSession {
    return {
      ...session,
      responses: [...session.responses, ...responses]
    };
  }

  /**
   * Complete assessment session
   */
  completeSession(session: AssessmentSession): AssessmentSession {
    return {
      ...session,
      status: 'completed',
      completedAt: new Date(),
      metadata: {
        userId: this.config.userId,
        startedAt: session.startedAt,
        completedAt: new Date(),
        version: '1.0',
        duration: Math.floor((new Date().getTime() - session.startedAt.getTime()) / 1000)
      }
    };
  }

  /**
   * Generate composite profile from all assessments
   */
  generateCompositeProfile(bundle: AssessmentBundle): CompositeProfile {
    // This would integrate all assessment results
    // For now, return a basic structure
    return {
      entrepreneur: {
        id: this.config.userId,
        name: this.config.userName,
        email: this.config.userEmail
      },
      assessments: bundle,
      synthesis: {
        founderArchetype: bundle.bigFive.founderArchetype ?? {
          name: 'Unknown',
          description: '',
          examples: []
        },
        coreStrengths: [],
        criticalBlindSpots: bundle.bigFive.blindSpots ?? [],
        developmentPriorities: [],
        riskFactors: []
      },
      matching: {
        idealCofounderProfile: bundle.bigFive.cofounderNeeds?.idealProfile ?? null,
        teamCompositionNeeds: [],
        mentorMatches: [],
        investorFit: [],
        acceleratorFit: []
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        skillDevelopment: bundle.aiReadiness.recommendations.skillDevelopment,
        networkBuilding: []
      },
      successPredictors: {
        overallScore: 75,
        strengths: [],
        concerns: [],
        comparisonToSuccessful: []
      },
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generateSessionId(): string {
    return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate assessment responses
   */
  validateResponses(
    assessmentType: string,
    responses: AssessmentResponse[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const questions = this.getAssessmentQuestions(assessmentType);

    if (responses.length < questions.length) {
      errors.push(`Incomplete assessment: expected ${questions.length} responses, got ${responses.length}`);
    }

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) {
        errors.push(`Invalid question ID: ${response.questionId}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate assessment progress
   */
  calculateProgress(session: AssessmentSession): number {
    const questions = this.getAssessmentQuestions(session.assessmentType);
    return (session.responses.length / questions.length) * 100;
  }
}
