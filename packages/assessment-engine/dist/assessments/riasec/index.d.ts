/**
 * RIASEC Assessment Module
 * Main entry point for RIASEC career interest assessment
 */
import { AssessmentResponse } from '../../models/common.model';
import { RIASECProfile } from '../../models/riasec.model';
export declare class RIASECAssessment {
    private scorer;
    private interpreter;
    constructor();
    /**
     * Get all RIASEC questions
     */
    getQuestions(): import("../../models/riasec.model").RIASECQuestion[];
    /**
     * Process RIASEC assessment responses and generate profile
     */
    processAssessment(responses: AssessmentResponse[]): RIASECProfile;
    /**
     * Validate assessment responses
     */
    private validateResponses;
}
export * from './questionnaire';
export * from './scoring';
export * from './interpretation';
export * from './startup-mapping';
