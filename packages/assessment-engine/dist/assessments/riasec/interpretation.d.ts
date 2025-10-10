/**
 * RIASEC Profile Interpretation
 * Maps RIASEC scores to startup-relevant insights
 */
import { RIASECScores, RIASECInterpretation } from '../../models/riasec.model';
export declare class RIASECInterpreter {
    private scorer;
    constructor();
    /**
     * Generate full interpretation of RIASEC profile
     */
    interpretProfile(scores: RIASECScores, primaryCode: string): RIASECInterpretation;
    /**
     * Analyze fit for startup environment
     */
    private analyzeStartupFit;
    /**
     * Identify startup-specific strengths based on RIASEC profile
     */
    private identifyStartupStrengths;
    /**
     * Identify potential challenges in startup environment
     */
    private identifyStartupChallenges;
    /**
     * Determine preferred work environment
     */
    private determineWorkEnvironment;
    /**
     * Infer decision-making style from RIASEC scores
     */
    private inferDecisionMakingStyle;
    /**
     * Get description for a specific trait
     */
    private getTraitDescription;
}
