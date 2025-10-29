import { RIASECScore, BigFiveScore, AIReadinessScore, CompositeProfile, FounderArchetype, CoFounderPersonality } from '@/types-hub';
import { FOUNDER_ARCHETYPES } from './constants';

// NOTE: In a real app, scoring would be more complex, potentially reversing scores for certain questions.
// This is a simplified direct average for demonstration.
const calculateAverage = (answers: Record<string, number>, ids: string[]): number => {
    const total = ids.reduce((sum, id) => sum + (answers[id] || 0), 0);
    return (total / ids.length) * 2; // Scale to 1-10
};

export const synthesizeProfile = (answers: Record<string, number>): CompositeProfile => {
    // RIASEC scoring with multiple questions per category
    const riasec: RIASECScore = {
        realistic: calculateAverage(answers, ['r1', 'r2', 'r3']),
        investigative: calculateAverage(answers, ['i1', 'i2', 'i3']),
        artistic: calculateAverage(answers, ['a1', 'a2', 'a3']),
        social: calculateAverage(answers, ['s1', 's2', 's3']),
        enterprising: calculateAverage(answers, ['e1', 'e2', 'e3']),
        conventional: calculateAverage(answers, ['c1', 'c2', 'c3']),
    };

    // Big Five scoring with multiple questions per category
    const bigFive: BigFiveScore = {
        openness: calculateAverage(answers, ['o1', 'o2', 'o3', 'o4']),
        conscientiousness: calculateAverage(answers, ['c4', 'c5', 'c6', 'c7']),
        extraversion: calculateAverage(answers, ['e4', 'e5', 'e6', 'e7']),
        agreeableness: calculateAverage(answers, ['a4', 'a5', 'a6', 'a7']),
        neuroticism: calculateAverage(answers, ['n1', 'n2', 'n3', 'n4']),
    };
    
    // AI Readiness scoring with multiple questions per category
    const aiReadinessScores = {
        awareness: calculateAverage(answers, ['ai_aw1', 'ai_aw2', 'ai_aw3', 'ai_aw4']),
        adoption: calculateAverage(answers, ['ai_ad1', 'ai_ad2', 'ai_ad3', 'ai_ad4']),
        implementation: calculateAverage(answers, ['ai_im1', 'ai_im2', 'ai_im3', 'ai_im4']),
        strategy: calculateAverage(answers, ['ai_st1', 'ai_st2', 'ai_st3', 'ai_st4']),
    };

    const aiReadiness: AIReadinessScore = {
        ...aiReadinessScores,
        overall: ((aiReadinessScores.awareness + aiReadinessScores.adoption + aiReadinessScores.implementation + aiReadinessScores.strategy) / 4) * 10,
    };

    // Calculate additional scores for new categories
    const entrepreneurialScore = calculateAverage(answers, ['ent1', 'ent2', 'ent3', 'ent4', 'ent5', 'ent6']);
    const leadershipScore = calculateAverage(answers, ['lead1', 'lead2', 'lead3', 'lead4', 'lead5']);
    const innovationScore = calculateAverage(answers, ['inn1', 'inn2', 'inn3', 'inn4', 'inn5']);
    
    // Enhanced Archetype Logic with more comprehensive scoring
    let founderArchetype: FounderArchetype = FOUNDER_ARCHETYPES['default'];
    
    // Visionary Innovator: High enterprising, investigative, openness, and innovation
    if (riasec.enterprising > 7 && riasec.investigative > 7 && bigFive.openness > 7 && innovationScore > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['visionary-innovator'];
    }
    // Execution Machine: High conventional, enterprising, conscientiousness, and leadership
    else if (riasec.conventional > 7 && riasec.enterprising > 7 && bigFive.conscientiousness > 7 && leadershipScore > 6) {
        founderArchetype = FOUNDER_ARCHETYPES['execution-machine'];
    }
    // Thoughtful Builder: High investigative, social, agreeableness, and AI readiness
    else if (riasec.investigative > 7 && riasec.social > 7 && bigFive.agreeableness > 7 && aiReadiness.overall > 6) {
        founderArchetype = FOUNDER_ARCHETYPES['thoughtful-builder'];
    }
    // Collaborative Innovator: High social, enterprising, extraversion, and innovation
    else if (riasec.social > 7 && riasec.enterprising > 7 && bigFive.extraversion > 7 && innovationScore > 6) {
        founderArchetype = FOUNDER_ARCHETYPES['collaborative-innovator'];
    }
    // Technical Founder: High investigative, conscientiousness, and AI readiness
    else if (riasec.investigative > 8 && bigFive.conscientiousness > 7 && aiReadiness.overall > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['technical-founder'];
    }
    // Growth-Focused Leader: High enterprising, extraversion, and leadership
    else if (riasec.enterprising > 8 && bigFive.extraversion > 7 && leadershipScore > 7) {
        founderArchetype = FOUNDER_ARCHETYPES['growth-focused-leader'];
    }

    const coreStrengths: string[] = [];
    const blindSpots: string[] = [];

    // RIASEC strengths and blind spots
    if (riasec.enterprising > 7) coreStrengths.push("Strong leadership and business development skills");
    if (riasec.investigative > 7) coreStrengths.push("Excellent analytical and problem-solving abilities");
    if (riasec.artistic > 7) coreStrengths.push("High creativity and innovation potential");
    if (riasec.social > 7) coreStrengths.push("Strong people skills and team building capabilities");
    if (riasec.conventional > 7) coreStrengths.push("Excellent organizational and operational skills");
    if (riasec.realistic > 7) coreStrengths.push("Practical, hands-on approach to problem solving");

    // Big Five strengths and blind spots
    if (bigFive.openness > 7) coreStrengths.push("Highly creative and open to new ideas"); else blindSpots.push("May be resistant to new or unconventional ideas");
    if (bigFive.conscientiousness > 7) coreStrengths.push("Excellent at planning and execution"); else blindSpots.push("Struggles with organization and follow-through");
    if (bigFive.extraversion > 7) coreStrengths.push("Natural networker and comfortable in the spotlight"); else blindSpots.push("May find networking and public speaking draining");
    if (bigFive.agreeableness > 7) coreStrengths.push("Great at building team harmony and partnerships"); else blindSpots.push("May avoid necessary conflict or tough decisions");
    if (bigFive.neuroticism < 4) coreStrengths.push("Remains calm and stable under pressure"); else blindSpots.push("Prone to stress and anxiety, which can impact decisions");

    // AI Readiness strengths
    if (aiReadiness.overall > 7) coreStrengths.push("High AI readiness and technology adoption");
    if (aiReadiness.awareness > 7) coreStrengths.push("Strong understanding of AI capabilities and limitations");
    if (aiReadiness.implementation > 7) coreStrengths.push("Skilled at implementing AI solutions");
    if (aiReadiness.strategy > 7) coreStrengths.push("Strategic thinking about AI's long-term impact");

    // Entrepreneurial and Leadership strengths
    if (entrepreneurialScore > 7) coreStrengths.push("Strong entrepreneurial mindset and risk tolerance");
    if (leadershipScore > 7) coreStrengths.push("Excellent leadership and team management skills");
    if (innovationScore > 7) coreStrengths.push("High innovation and creative problem-solving abilities");

    // Blind spots for new categories
    if (riasec.enterprising < 4) blindSpots.push("May struggle with sales and business development");
    if (riasec.investigative < 4) blindSpots.push("May need support with data analysis and research");
    if (riasec.artistic < 4) blindSpots.push("May benefit from creative and design support");
    if (riasec.social < 4) blindSpots.push("May need help with team management and networking");
    if (riasec.conventional < 4) blindSpots.push("May struggle with organization and process management");
    if (riasec.realistic < 4) blindSpots.push("May need support with practical implementation");

    if (aiReadiness.overall < 4) blindSpots.push("May need education and support with AI adoption");
    if (entrepreneurialScore < 4) blindSpots.push("May need support with risk-taking and opportunity identification");
    if (leadershipScore < 4) blindSpots.push("May need development in leadership and team management");
    if (innovationScore < 4) blindSpots.push("May need support with creative thinking and innovation");

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
