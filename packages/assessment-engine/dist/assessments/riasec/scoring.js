"use strict";
/**
 * RIASEC Scoring Algorithm
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIASECScorer = void 0;
const questionnaire_1 = require("./questionnaire");
class RIASECScorer {
    /**
     * Calculate raw scores from responses
     */
    calculateRawScores(responses) {
        const categorySums = {
            R: 0,
            I: 0,
            A: 0,
            S: 0,
            E: 0,
            C: 0
        };
        const categoryCounts = {
            R: 0,
            I: 0,
            A: 0,
            S: 0,
            E: 0,
            C: 0
        };
        responses.forEach(response => {
            const question = questionnaire_1.RIASEC_QUESTIONS.find(q => q.id === response.questionId);
            if (question) {
                const value = typeof response.value === 'number' ? response.value : parseInt(response.value);
                categorySums[question.category] += value;
                categoryCounts[question.category]++;
            }
        });
        // Calculate averages for each category
        const scores = {
            R: categoryCounts.R > 0 ? categorySums.R / categoryCounts.R : 0,
            I: categoryCounts.I > 0 ? categorySums.I / categoryCounts.I : 0,
            A: categoryCounts.A > 0 ? categorySums.A / categoryCounts.A : 0,
            S: categoryCounts.S > 0 ? categorySums.S / categoryCounts.S : 0,
            E: categoryCounts.E > 0 ? categorySums.E / categoryCounts.E : 0,
            C: categoryCounts.C > 0 ? categorySums.C / categoryCounts.C : 0
        };
        return this.normalizeScores(scores);
    }
    /**
     * Normalize scores from 1-5 scale to 0-100 scale
     */
    normalizeScores(rawScores) {
        return {
            R: this.normalizeScore(rawScores.R),
            I: this.normalizeScore(rawScores.I),
            A: this.normalizeScore(rawScores.A),
            S: this.normalizeScore(rawScores.S),
            E: this.normalizeScore(rawScores.E),
            C: this.normalizeScore(rawScores.C)
        };
    }
    /**
     * Convert 1-5 scale to 0-100
     */
    normalizeScore(score) {
        // 1 -> 0, 3 -> 50, 5 -> 100
        return Math.round(((score - 1) / 4) * 100);
    }
    /**
     * Determine primary Holland code (top 3 letters)
     */
    getPrimaryCode(scores) {
        const sortedCategories = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category);
        return sortedCategories.slice(0, 3).join('');
    }
    /**
     * Calculate percentiles compared to entrepreneur population
     * Note: In production, these would be based on actual population data
     */
    calculatePercentiles(scores) {
        // Mock percentile calculation
        // In production, compare against distribution of entrepreneur population
        const entrepreneurMeans = {
            R: 45, // Entrepreneurs tend to be moderate on Realistic
            I: 65, // Higher on Investigative (problem-solving)
            A: 70, // Higher on Artistic (innovation)
            S: 60, // Moderate-high on Social (networking)
            E: 75, // Very high on Enterprising (leadership)
            C: 50 // Moderate on Conventional (structure)
        };
        const entrepreneurStdDevs = {
            R: 20,
            I: 15,
            A: 15,
            S: 18,
            E: 12,
            C: 20
        };
        const percentiles = {};
        for (const [category, score] of Object.entries(scores)) {
            const mean = entrepreneurMeans[category];
            const stdDev = entrepreneurStdDevs[category];
            const zScore = (score - mean) / stdDev;
            // Convert z-score to percentile (approximation)
            percentiles[category] = Math.round(this.zScoreToPercentile(zScore));
        }
        return percentiles;
    }
    /**
     * Convert z-score to percentile (0-100)
     */
    zScoreToPercentile(zScore) {
        // Simple approximation using cumulative distribution
        // For production, use proper statistics library
        const percentile = 50 + (zScore * 19.1);
        return Math.max(0, Math.min(100, percentile));
    }
    /**
     * Identify dominant traits (scores > 70)
     */
    identifyDominantTraits(scores) {
        return Object.entries(scores)
            .filter(([, score]) => score > 70)
            .map(([category]) => category);
    }
    /**
     * Identify weak areas (scores < 30)
     */
    identifyWeakAreas(scores) {
        return Object.entries(scores)
            .filter(([, score]) => score < 30)
            .map(([category]) => category);
    }
}
exports.RIASECScorer = RIASECScorer;
