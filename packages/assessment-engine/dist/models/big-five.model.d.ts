/**
 * Big Five (OCEAN) Personality Assessment Models
 * Applied to entrepreneurial contexts
 */
import { TraitLevel, SeverityLevel, Mitigation, CofounderRequirement, WarningTrait } from './common.model';
export type BigFiveTrait = 'O' | 'C' | 'E' | 'A' | 'N';
export interface BigFiveQuestion {
    id: string;
    trait: BigFiveTrait;
    facet: string;
    question: string;
    reversed: boolean;
    startupContext: string;
}
export interface TraitScore {
    score: number;
    percentile: number;
    level: TraitLevel;
    facetScores: {
        [facet: string]: number;
    };
}
export interface BigFiveTraits {
    openness: TraitScore;
    conscientiousness: TraitScore;
    extraversion: TraitScore;
    agreeableness: TraitScore;
    emotionalStability: TraitScore;
}
export interface BlindSpot {
    name: string;
    area: string;
    severity: SeverityLevel;
    description: string;
    evidence?: string[];
    realWorldImpact?: string[];
    impact: string;
    mitigation: Mitigation;
    cofounderNeed?: string;
    cofounderImperative?: {
        required: boolean;
        profile: string;
        reasoning: string;
    };
    urgency?: string;
    warningSign?: string;
}
export interface FounderArchetype {
    name: string;
    description: string;
    signature?: string;
    examples: string[];
    detailedProfile?: {
        strengths: string[];
        weaknesses: string[];
        workStyle: string;
        decisionMaking: string;
        stressResponse: string;
        leadershipStyle: string;
    };
    strengths?: string[];
    challenges?: string[];
    recommendation?: string;
    idealFor?: string[];
    cofounderMatch?: {
        essential: string;
        avoid: string;
        ideal: string;
    };
    developmentPath?: string[];
    famousQuote?: string;
    successRate?: string;
    warnings?: string[];
}
export interface StressProfile {
    overallResilience: ResilienceScore;
    stressors: {
        high: string[];
        medium: string[];
        low: string[];
    };
    copingStrategies: {
        natural: string[];
        recommended: string[];
    };
    burnoutRisk: BurnoutRisk;
    warningSign: string[];
    supportNeeds: string[];
}
export interface ResilienceScore {
    score: number;
    level: 'low' | 'moderate' | 'high' | 'very_high';
    interpretation: string;
}
export interface BurnoutRisk {
    level: SeverityLevel;
    probability: number;
    indicators: string[];
    prevention: string[];
}
export interface CofounderProfile {
    essentialTraits: CofounderRequirement[];
    desirableTraits: CofounderRequirement[];
    warningTraits: WarningTrait[];
    idealProfile: string | null;
    reasoning: string[];
}
export interface StartupImplications {
    strengths: string[];
    developmentAreas: string[];
    stressRisks: string[];
    teamNeeds: string[];
    leadershipStyle: string;
    conflictStyle: string;
    innovationCapacity: string;
}
export interface BigFiveProfile {
    traits: BigFiveTraits;
    facets: {
        [trait: string]: {
            [facet: string]: number;
        };
    };
    startupImplications: StartupImplications;
    founderArchetype?: FounderArchetype;
    blindSpots?: BlindSpot[];
    stressProfile?: StressProfile;
    cofounderNeeds?: CofounderProfile;
}
