/**
 * Common types and interfaces used across all assessments
 */
export type LikertScale = 1 | 2 | 3 | 4 | 5;
export interface AssessmentResponse {
    questionId: string;
    value: LikertScale | string | number;
    timestamp: Date;
}
export interface AssessmentMetadata {
    userId: string;
    startedAt: Date;
    completedAt?: Date;
    version: string;
    duration?: number;
}
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type TraitLevel = 'very_low' | 'low' | 'average' | 'high' | 'very_high';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'very_high';
export interface Mitigation {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
}
export interface CofounderRequirement {
    trait: string;
    minimumScore: number;
    reason: string;
    critical: boolean;
}
export interface WarningTrait {
    trait: string;
    warningRange: {
        min: number;
        max: number;
    };
    reason: string;
    risk: string;
}
