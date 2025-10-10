"use strict";
/**
 * RIASEC Profile Interpretation
 * Maps RIASEC scores to startup-relevant insights
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIASECInterpreter = void 0;
const scoring_1 = require("./scoring");
const startup_mapping_1 = require("./startup-mapping");
class RIASECInterpreter {
    constructor() {
        this.scorer = new scoring_1.RIASECScorer();
    }
    /**
     * Generate full interpretation of RIASEC profile
     */
    interpretProfile(scores, primaryCode) {
        const dominantTraits = this.scorer.identifyDominantTraits(scores);
        const startupFit = this.analyzeStartupFit(scores, primaryCode);
        const workEnvironment = this.determineWorkEnvironment(scores, primaryCode);
        const decisionMakingStyle = this.inferDecisionMakingStyle(scores);
        return {
            dominantTraits: dominantTraits.map(trait => this.getTraitDescription(trait)),
            startupFit,
            workEnvironment,
            decisionMakingStyle
        };
    }
    /**
     * Analyze fit for startup environment
     */
    analyzeStartupFit(scores, code) {
        const idealRoles = (0, startup_mapping_1.getStartupRoles)(code, scores);
        const strengths = this.identifyStartupStrengths(scores, code);
        const potentialChallenges = this.identifyStartupChallenges(scores, code);
        return {
            idealRoles,
            strengths,
            potentialChallenges
        };
    }
    /**
     * Identify startup-specific strengths based on RIASEC profile
     */
    identifyStartupStrengths(scores, code) {
        const strengths = [];
        // High Enterprising (E > 70)
        if (scores.E > 70) {
            strengths.push('Natural leadership and vision-setting capabilities');
            strengths.push('Excellent at fundraising, pitching, and persuasion');
            strengths.push('Comfortable with risk and ambiguity');
            strengths.push('Strong business development and partnership skills');
        }
        // High Investigative (I > 70)
        if (scores.I > 70) {
            strengths.push('Data-driven decision making and analytical thinking');
            strengths.push('Deep problem-solving capabilities');
            strengths.push('Research and technical due diligence skills');
            strengths.push('Strategic thinking and pattern recognition');
        }
        // High Artistic (A > 70)
        if (scores.A > 70) {
            strengths.push('Innovative thinking and creative problem-solving');
            strengths.push('Strong product vision and differentiation');
            strengths.push('Brand building and storytelling capabilities');
            strengths.push('Comfortable pivoting and adapting');
        }
        // High Social (S > 70)
        if (scores.S > 70) {
            strengths.push('Exceptional team building and culture development');
            strengths.push('Strong networking and relationship building');
            strengths.push('Customer empathy and user research skills');
            strengths.push('Effective collaboration and partnership development');
        }
        // High Realistic (R > 70)
        if (scores.R > 70) {
            strengths.push('Hands-on product development and prototyping');
            strengths.push('Technical problem-solving and troubleshooting');
            strengths.push('Practical, results-oriented approach');
            strengths.push('Strong in physical product or hardware startups');
        }
        // High Conventional (C > 70)
        if (scores.C > 70) {
            strengths.push('Excellent operational management and execution');
            strengths.push('Financial discipline and metrics tracking');
            strengths.push('Process optimization and scalability');
            strengths.push('Strong compliance and risk management');
        }
        // Combination strengths
        if (scores.E > 65 && scores.I > 65) {
            strengths.push('Unique combination: Strategic leadership with analytical depth');
        }
        if (scores.A > 65 && scores.I > 65) {
            strengths.push('Unique combination: Creative innovation backed by research');
        }
        if (scores.E > 65 && scores.S > 65) {
            strengths.push('Unique combination: Charismatic leadership with people skills');
        }
        return strengths;
    }
    /**
     * Identify potential challenges in startup environment
     */
    identifyStartupChallenges(scores, code) {
        const challenges = [];
        // Low Conventional (C < 30)
        if (scores.C < 30) {
            challenges.push('May struggle with operational details and processes');
            challenges.push('Financial management and metrics tracking might need attention');
            challenges.push('Consider hiring strong operations support early');
        }
        // Low Social (S < 30)
        if (scores.S < 30) {
            challenges.push('Team building and people management may be challenging');
            challenges.push('Networking and relationship building might feel draining');
            challenges.push('Consider a people-focused co-founder or HR leader');
        }
        // Low Enterprising (E < 30)
        if (scores.E < 30) {
            challenges.push('Fundraising and pitching may be uncomfortable');
            challenges.push('Leadership and decision-making might be challenging');
            challenges.push('Sales and business development may need support');
            challenges.push('Consider partnering with a strong business leader');
        }
        // Low Artistic (A < 30)
        if (scores.A < 30) {
            challenges.push('Innovation and creative thinking may be limited');
            challenges.push('May miss opportunities for differentiation');
            challenges.push('Pivoting and adapting to change could be difficult');
            challenges.push('Consider creative co-founder or advisor');
        }
        // Low Investigative (I < 30)
        if (scores.I < 30) {
            challenges.push('May make decisions without sufficient analysis');
            challenges.push('Strategic planning and research might be weak');
            challenges.push('Technical due diligence may need support');
        }
        // Low Realistic (R < 30)
        if (scores.R < 30) {
            challenges.push('Hands-on product development may not be natural');
            challenges.push('Technical troubleshooting might require support');
            challenges.push('More suited to service/software than physical products');
        }
        // Challenging combinations
        if (scores.C < 30 && scores.E < 30) {
            challenges.push('⚠️ Critical gap: Low on both organization AND leadership - strongly consider co-founder');
        }
        if (scores.I < 30 && scores.A < 30) {
            challenges.push('⚠️ May struggle with both innovation and analysis - seek diverse team');
        }
        return challenges;
    }
    /**
     * Determine preferred work environment
     */
    determineWorkEnvironment(scores, code) {
        const preferred = [];
        const toAvoid = [];
        // High Artistic
        if (scores.A > 65) {
            preferred.push('Flexible, creative environments');
            preferred.push('Autonomy and freedom to innovate');
            preferred.push('Fast-paced, dynamic settings');
            toAvoid.push('Highly structured, bureaucratic organizations');
            toAvoid.push('Rigid processes and procedures');
        }
        // High Conventional
        if (scores.C > 65) {
            preferred.push('Well-organized, structured environments');
            preferred.push('Clear roles and responsibilities');
            preferred.push('Established processes and systems');
            toAvoid.push('Chaotic, constantly changing environments');
            toAvoid.push('Lack of structure or clarity');
        }
        // High Social
        if (scores.S > 65) {
            preferred.push('Collaborative, team-oriented culture');
            preferred.push('People-centric organization');
            preferred.push('Opportunities for mentoring and teaching');
            toAvoid.push('Highly competitive, cutthroat environments');
            toAvoid.push('Isolated, solo work');
        }
        // High Enterprising
        if (scores.E > 65) {
            preferred.push('High-growth, ambitious environments');
            preferred.push('Leadership opportunities');
            preferred.push('Competitive, results-driven culture');
            toAvoid.push('Slow-moving, bureaucratic settings');
            toAvoid.push('Limited autonomy or decision-making power');
        }
        // High Investigative
        if (scores.I > 65) {
            preferred.push('Intellectually stimulating environment');
            preferred.push('Time for deep work and analysis');
            preferred.push('Research-oriented culture');
            toAvoid.push('Superficial, action-without-thought culture');
            toAvoid.push('Constant interruptions and context switching');
        }
        // High Realistic
        if (scores.R > 65) {
            preferred.push('Hands-on, practical work environments');
            preferred.push('Access to tools and equipment');
            preferred.push('Focus on tangible results');
            toAvoid.push('Abstract, theoretical-only work');
            toAvoid.push('Excessive meetings and discussions');
        }
        return { preferred, toAvoid };
    }
    /**
     * Infer decision-making style from RIASEC scores
     */
    inferDecisionMakingStyle(scores) {
        const dominant = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([key]) => key);
        // Mapping of dominant combinations to decision styles
        if (dominant.includes('I') && dominant.includes('E')) {
            return 'Strategic and analytical, but action-oriented - balances research with decisiveness';
        }
        if (dominant.includes('E') && dominant.includes('A')) {
            return 'Visionary and bold - makes quick, intuitive decisions based on big picture thinking';
        }
        if (dominant.includes('I') && dominant.includes('C')) {
            return 'Highly analytical and methodical - prefers data-driven, systematic decision-making';
        }
        if (dominant.includes('S') && dominant.includes('E')) {
            return 'Collaborative but decisive - seeks input from others but takes clear action';
        }
        if (dominant.includes('A') && dominant.includes('I')) {
            return 'Creative problem-solver - combines innovative thinking with analytical rigor';
        }
        if (dominant.includes('C') && dominant.includes('E')) {
            return 'Process-oriented leader - structures decisions with clear frameworks and execution';
        }
        if (dominant.includes('R')) {
            return 'Practical and hands-on - prefers concrete evidence and tangible results';
        }
        return 'Balanced decision-maker - considers multiple perspectives before acting';
    }
    /**
     * Get description for a specific trait
     */
    getTraitDescription(trait) {
        const descriptions = {
            R: 'Realistic - Hands-on, practical, technical orientation',
            I: 'Investigative - Analytical, research-oriented problem-solver',
            A: 'Artistic - Creative, innovative, visionary thinker',
            S: 'Social - People-oriented, collaborative team builder',
            E: 'Enterprising - Leadership-driven, persuasive opportunity-seeker',
            C: 'Conventional - Organized, systematic, detail-focused'
        };
        return descriptions[trait] || trait;
    }
}
exports.RIASECInterpreter = RIASECInterpreter;
