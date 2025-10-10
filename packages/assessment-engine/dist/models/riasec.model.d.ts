/**
 * RIASEC Career Interest Assessment Models
 * Based on Holland's RIASEC theory applied to startup contexts
 */
export type RIASECCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export interface RIASECQuestion {
    id: string;
    category: RIASECCategory;
    question: string;
    scenario?: string;
    reversed?: boolean;
}
export interface RIASECScores {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
}
export declare enum StartupRole {
    VISIONARY_FOUNDER = "visionary_founder",
    TECHNICAL_FOUNDER = "technical_founder",
    GROWTH_STRATEGIST = "growth_strategist",
    PRODUCT_BUILDER = "product_builder",
    PEOPLE_LEADER = "people_leader",
    OPERATIONS_LEAD = "operations_lead",
    CREATIVE_DIRECTOR = "creative_director",
    BUSINESS_DEVELOPER = "business_developer",
    DATA_SCIENTIST = "data_scientist",
    COMMUNITY_BUILDER = "community_builder"
}
export interface WorkEnvironmentPreferences {
    preferred: string[];
    toAvoid: string[];
}
export interface StartupFit {
    idealRoles: StartupRole[];
    strengths: string[];
    potentialChallenges: string[];
}
export interface RIASECInterpretation {
    dominantTraits: string[];
    startupFit: StartupFit;
    workEnvironment: WorkEnvironmentPreferences;
    decisionMakingStyle: string;
}
export interface RIASECProfile {
    scores: RIASECScores;
    primaryCode: string;
    interpretation: RIASECInterpretation;
    percentiles?: {
        R: number;
        I: number;
        A: number;
        S: number;
        E: number;
        C: number;
    };
}
export interface RoleMapping {
    code: string;
    roles: StartupRole[];
    description: string;
    strengths: string[];
    challenges: string[];
}
