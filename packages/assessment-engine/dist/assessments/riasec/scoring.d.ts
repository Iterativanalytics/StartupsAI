/**
 * RIASEC Scoring Algorithm
 */
import { AssessmentResponse } from '../../models/common.model';
import { RIASECScores, RIASECCategory } from '../../models/riasec.model';
export declare class RIASECScorer {
    /**
     * Calculate raw scores from responses
     */
    calculateRawScores(responses: AssessmentResponse[]): RIASECScores;
    /**
     * Normalize scores from 1-5 scale to 0-100 scale
     */
    private normalizeScores;
    /**
     * Convert 1-5 scale to 0-100
     */
    private normalizeScore;
    /**
     * Determine primary Holland code (top 3 letters)
     */
    getPrimaryCode(scores: RIASECScores): string;
    /**
     * Calculate percentiles compared to entrepreneur population
     * Note: In production, these would be based on actual population data
     */
    calculatePercentiles(scores: RIASECScores): Record<RIASECCategory, number>;
    /**
     * Convert z-score to percentile (0-100)
     */
    private zScoreToPercentile;
    /**
     * Identify dominant traits (scores > 70)
     */
    identifyDominantTraits(scores: RIASECScores): RIASECCategory[];
    /**
     * Identify weak areas (scores < 30)
     */
    identifyWeakAreas(scores: RIASECScores): RIASECCategory[];
}
