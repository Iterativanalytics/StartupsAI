"use strict";
/**
 * RIASEC Assessment Module
 * Main entry point for RIASEC career interest assessment
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIASECAssessment = void 0;
const questionnaire_1 = require("./questionnaire");
const scoring_1 = require("./scoring");
const interpretation_1 = require("./interpretation");
class RIASECAssessment {
    constructor() {
        this.scorer = new scoring_1.RIASECScorer();
        this.interpreter = new interpretation_1.RIASECInterpreter();
    }
    /**
     * Get all RIASEC questions
     */
    getQuestions() {
        return questionnaire_1.RIASEC_QUESTIONS;
    }
    /**
     * Process RIASEC assessment responses and generate profile
     */
    processAssessment(responses) {
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
    validateResponses(responses) {
        if (responses.length < questionnaire_1.RIASEC_QUESTIONS.length) {
            throw new Error(`Incomplete assessment: expected ${questionnaire_1.RIASEC_QUESTIONS.length} responses, got ${responses.length}`);
        }
        // Validate each response has valid question ID and value
        responses.forEach(response => {
            const question = questionnaire_1.RIASEC_QUESTIONS.find(q => q.id === response.questionId);
            if (!question) {
                throw new Error(`Invalid question ID: ${response.questionId}`);
            }
            const value = typeof response.value === 'number' ? response.value : parseInt(response.value);
            if (value < 1 || value > 5) {
                throw new Error(`Invalid response value for ${response.questionId}: ${value} (must be 1-5)`);
            }
        });
    }
}
exports.RIASECAssessment = RIASECAssessment;
// Export everything from this module
__exportStar(require("./questionnaire"), exports);
__exportStar(require("./scoring"), exports);
__exportStar(require("./interpretation"), exports);
__exportStar(require("./startup-mapping"), exports);
