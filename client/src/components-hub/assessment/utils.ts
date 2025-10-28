import { RIASECScore, BigFiveScore, AIReadinessScore, CompositeProfile, FounderArchetype, CoFounderPersonality } from '../../types';
import { FOUNDER_ARCHETYPES } from './constants';

// NOTE: In a real app, scoring would be more complex, potentially reversing scores for certain questions.
// This is a simplified direct average for demonstration.
const calculateAverage = (answers: Record<string, number>, ids: string[]): number => {
    const total = ids.reduce((sum, id) => sum + (answers[id] || 0), 0);
    return (total / ids.length) * 2; // Scale to 1-10
};

export const synthesizeProfile = (answers: Record<string, number>): CompositeProfile => {
    // These would map to the full set of questions
    const riasec: RIASECScore = {
        realistic: calculateAverage(answers, ['r1']),
        investigative: calculateAverage(answers, ['i1']),
        artistic: calculateAverage(answers, ['a1']),
        social: calculateAverage(answers, ['s1']),
        enterprising: calculateAverage(answers, ['e1']),
        conventional: calculateAverage(answers, ['c1']),
    };

    const bigFive: BigFiveScore = {
        openness: calculateAverage(answers, ['o1']),
        conscientiousness: calculateAverage(answers, ['c2']),
        extraversion: calculateAverage(answers, ['e2']),
        agreeableness: calculateAverage(answers, ['a2']),
        neuroticism: calculateAverage(answers, ['n1']),
    };
    
    const aiReadinessScores = {
        awareness: calculateAverage(answers, ['ai_aw1']),
        adoption: calculateAverage(answers, ['ai_ad1']),
        implementation: calculateAverage(answers, ['ai_im1']),
        strategy: calculateAverage(answers, ['ai_st1']),
    };

    const aiReadiness: AIReadinessScore = {
        ...aiReadinessScores,
        overall: ((aiReadinessScores.awareness + aiReadinessScores.adoption + aiReadinessScores.implementation + aiReadinessScores.strategy) / 4) * 10,
    };
    
    // Archetype Logic (Simplified)
    let founderArchetype: FounderArchetype = FOUNDER_ARCHETYPES['default'];
    if (riasec.enterprising > 6 && riasec.investigative > 6 && bigFive.openness > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['visionary-innovator'];
    } else if (riasec.conventional > 6 && riasec.enterprising > 6 && bigFive.conscientiousness > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['execution-machine'];
    } else if (riasec.investigative > 6 && riasec.social > 6 && bigFive.agreeableness > 6) {
        founderArchetype = FOUNDER_ARCHETYPES['thoughtful-builder'];
    } else if (riasec.social > 6 && riasec.enterprising > 6 && bigFive.extraversion > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['collaborative-innovator'];
    }

    const coreStrengths: string[] = [];
    const blindSpots: string[] = [];

    if(bigFive.openness > 7) coreStrengths.push("Highly creative and open to new ideas."); else blindSpots.push("May be resistant to new or unconventional ideas.");
    if(bigFive.conscientiousness > 7) coreStrengths.push("Excellent at planning and execution."); else blindSpots.push("Struggles with organization and follow-through.");
    if(bigFive.extraversion > 7) coreStrengths.push("Natural networker and comfortable in the spotlight."); else blindSpots.push("May find networking and public speaking draining.");
    if(bigFive.agreeableness > 7) coreStrengths.push("Great at building team harmony and partnerships."); else blindSpots.push("May avoid necessary conflict or tough decisions.");
    if(bigFive.neuroticism < 4) coreStrengths.push("Remains calm and stable under pressure."); else blindSpots.push("Prone to stress and anxiety, which can impact decisions.");

    return {
        riasec,
        bigFive,
        aiReadiness,
        founderArchetype,
        coreStrengths,
        blindSpots
    };
};


export const proposePersonality = (profile: CompositeProfile): CoFounderPersonality => {
    const personality: CoFounderPersonality = {
        traits: {
            assertiveness: 5,
            optimism: 7,
            detail_orientation: 6,
            risk_tolerance: 6,
            directness: 5,
        },
        style: {
            formality: 'adaptive',
            humor: 'occasional',
        }
    };

    // Low Conscientiousness founder needs a more assertive, detail-oriented partner
    if (profile.bigFive.conscientiousness < 5) {
        personality.traits.assertiveness += 3;
        personality.traits.detail_orientation += 3;
    }

    // High Neuroticism founder needs a more optimistic, less direct partner
    if (profile.bigFive.neuroticism > 6) {
        personality.traits.optimism += 2;
        personality.traits.directness -= 2;
    }
    
    // Low Extraversion founder might need a partner who initiates more
    if (profile.bigFive.extraversion < 5) {
        // This could be modeled as higher proactivity in the agent's behavior, but for personality, we'll keep it simple.
    }

    // Low Agreeableness founder needs a more diplomatic partner
    if (profile.bigFive.agreeableness < 5) {
        personality.traits.directness -= 2;
        personality.style.formality = 'professional';
    }
    
    // Clamp values between 1 and 10
    Object.keys(personality.traits).forEach(keyStr => {
        const key = keyStr as keyof typeof personality.traits;
        personality.traits[key] = Math.max(1, Math.min(10, personality.traits[key]));
    });

    return personality;
};
