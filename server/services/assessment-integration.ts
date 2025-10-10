/**
 * Assessment Integration Service
 * 
 * Connects the assessment system to Co-Agents for personality-driven adaptation
 * - Retrieves user assessment profiles
 * - Adapts agent personality and communication style
 * - Tracks adaptation effectiveness
 * - Provides personalized coaching approaches
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { AgentType } from './agent-database';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AssessmentProfile {
  _id?: ObjectId;
  userId: number;
  assessmentType: 'personality' | 'work_style' | 'decision_making' | 'communication' | 'risk_tolerance';
  assessmentResults: Record<string, any>;
  personalityTraits?: {
    openness?: number; // 0-100
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
    // Additional traits
    analyticalThinking?: number;
    creativity?: number;
    resilience?: number;
    empathy?: number;
  };
  workPreferences?: {
    workPace?: 'fast' | 'moderate' | 'deliberate';
    decisionSpeed?: 'quick' | 'balanced' | 'thorough';
    collaborationStyle?: 'independent' | 'collaborative' | 'mixed';
    feedbackPreference?: 'direct' | 'gentle' | 'balanced';
    structureNeed?: 'high' | 'medium' | 'low';
  };
  communicationStyle?: 'direct' | 'diplomatic' | 'analytical' | 'expressive' | 'supportive';
  decisionStyle?: 'data-driven' | 'intuitive' | 'collaborative' | 'decisive' | 'cautious';
  riskProfile?: 'conservative' | 'moderate' | 'aggressive' | 'calculated';
  completedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AgentPersonalityAdaptation {
  _id?: ObjectId;
  userId: number;
  agentType: AgentType;
  assessmentProfileId: ObjectId;
  adaptedTraits: {
    communicationStyle: string;
    energyLevel: 'low' | 'moderate' | 'high' | 'adaptive';
    coachingApproach: string;
    decisionSupport: string;
    feedbackStyle: string;
    pacing: string;
  };
  communicationAdjustments: {
    toneOfVoice?: string;
    formalityLevel?: 'casual' | 'professional' | 'formal';
    detailLevel?: 'high-level' | 'balanced' | 'detailed';
    questioningStyle?: 'socratic' | 'direct' | 'exploratory';
    encouragementFrequency?: 'frequent' | 'moderate' | 'minimal';
  };
  coachingApproach: 'directive' | 'supportive' | 'challenging' | 'collaborative' | 'adaptive';
  adaptationEffectiveness?: number; // 0-1
  lastAdaptedAt: Date;
  createdAt: Date;
}

export interface PersonalityInsight {
  trait: string;
  score: number;
  interpretation: string;
  agentRecommendation: string;
}

// ============================================================================
// ASSESSMENT INTEGRATION SERVICE
// ============================================================================

export class AssessmentIntegrationService {
  private client: MongoClient;
  private db: Db;
  private assessmentProfiles: Collection<AssessmentProfile>;
  private agentAdaptations: Collection<AgentPersonalityAdaptation>;

  constructor(connectionString: string, databaseName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    
    this.assessmentProfiles = this.db.collection<AssessmentProfile>('assessment_profiles');
    this.agentAdaptations = this.db.collection<AgentPersonalityAdaptation>('agent_personality_adaptations');
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.createIndexes();
    console.log('✅ Assessment Integration Service connected to Azure MongoDB');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  // ============================================================================
  // ASSESSMENT PROFILE MANAGEMENT
  // ============================================================================

  async saveAssessmentProfile(
    profile: Omit<AssessmentProfile, '_id' | 'createdAt'>
  ): Promise<ObjectId> {
    const result = await this.assessmentProfiles.insertOne({
      ...profile,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async getAssessmentProfile(
    userId: number,
    assessmentType?: string
  ): Promise<AssessmentProfile | null> {
    const query: any = { userId };
    
    if (assessmentType) {
      query.assessmentType = assessmentType;
    }

    // Get most recent non-expired assessment
    const profile = await this.assessmentProfiles.findOne(
      {
        ...query,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { sort: { completedAt: -1 } }
    );

    return profile;
  }

  async getAllUserAssessments(userId: number): Promise<AssessmentProfile[]> {
    return await this.assessmentProfiles
      .find({
        userId,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      })
      .sort({ completedAt: -1 })
      .toArray();
  }

  // ============================================================================
  // AGENT PERSONALITY ADAPTATION
  // ============================================================================

  async adaptAgentPersonality(
    userId: number,
    agentType: AgentType,
    assessmentProfileId: ObjectId
  ): Promise<AgentPersonalityAdaptation> {
    // Get assessment profile
    const profile = await this.assessmentProfiles.findOne({ _id: assessmentProfileId });
    
    if (!profile) {
      throw new Error('Assessment profile not found');
    }

    // Generate adapted traits based on assessment
    const adaptedTraits = this.generateAdaptedTraits(agentType, profile);
    const communicationAdjustments = this.generateCommunicationAdjustments(profile);
    const coachingApproach = this.determineCoachingApproach(agentType, profile);

    const adaptation: Omit<AgentPersonalityAdaptation, '_id' | 'createdAt'> = {
      userId,
      agentType,
      assessmentProfileId,
      adaptedTraits,
      communicationAdjustments,
      coachingApproach,
      adaptationEffectiveness: 0.5, // Initial baseline
      lastAdaptedAt: new Date()
    };

    // Upsert adaptation
    const result = await this.agentAdaptations.findOneAndUpdate(
      { userId, agentType },
      {
        $set: {
          ...adaptation,
          lastAdaptedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    return result as AgentPersonalityAdaptation;
  }

  async getAgentAdaptation(
    userId: number,
    agentType: AgentType
  ): Promise<AgentPersonalityAdaptation | null> {
    return await this.agentAdaptations.findOne({ userId, agentType });
  }

  async updateAdaptationEffectiveness(
    userId: number,
    agentType: AgentType,
    effectivenessDelta: number
  ): Promise<void> {
    await this.agentAdaptations.updateOne(
      { userId, agentType },
      {
        $inc: { adaptationEffectiveness: effectivenessDelta * 0.1 },
        $set: { lastAdaptedAt: new Date() }
      }
    );
  }

  // ============================================================================
  // PERSONALITY ANALYSIS
  // ============================================================================

  private generateAdaptedTraits(
    agentType: AgentType,
    profile: AssessmentProfile
  ): AgentPersonalityAdaptation['adaptedTraits'] {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};

    // Base traits by agent type
    const baseTraits: Record<AgentType, Partial<AgentPersonalityAdaptation['adaptedTraits']>> = {
      co_founder: {
        communicationStyle: 'supportive-challenging',
        energyLevel: 'high',
        coachingApproach: 'accountability-focused',
        decisionSupport: 'collaborative',
        feedbackStyle: 'constructive',
        pacing: 'adaptive'
      },
      co_investor: {
        communicationStyle: 'analytical-strategic',
        energyLevel: 'moderate',
        coachingApproach: 'data-driven',
        decisionSupport: 'analytical',
        feedbackStyle: 'direct',
        pacing: 'deliberate'
      },
      co_builder: {
        communicationStyle: 'collaborative-strategic',
        energyLevel: 'high',
        coachingApproach: 'partnership-focused',
        decisionSupport: 'strategic',
        feedbackStyle: 'encouraging',
        pacing: 'adaptive'
      },
      business_advisor: {
        communicationStyle: 'professional-analytical',
        energyLevel: 'moderate',
        coachingApproach: 'expert-guidance',
        decisionSupport: 'data-driven',
        feedbackStyle: 'detailed',
        pacing: 'thorough'
      },
      investment_analyst: {
        communicationStyle: 'analytical-precise',
        energyLevel: 'moderate',
        coachingApproach: 'analytical',
        decisionSupport: 'quantitative',
        feedbackStyle: 'objective',
        pacing: 'methodical'
      },
      credit_analyst: {
        communicationStyle: 'professional-direct',
        energyLevel: 'moderate',
        coachingApproach: 'risk-focused',
        decisionSupport: 'criteria-based',
        feedbackStyle: 'clear',
        pacing: 'systematic'
      },
      impact_analyst: {
        communicationStyle: 'empathetic-analytical',
        energyLevel: 'moderate',
        coachingApproach: 'values-driven',
        decisionSupport: 'impact-focused',
        feedbackStyle: 'holistic',
        pacing: 'thoughtful'
      },
      program_manager: {
        communicationStyle: 'organized-supportive',
        energyLevel: 'moderate',
        coachingApproach: 'structured',
        decisionSupport: 'process-oriented',
        feedbackStyle: 'systematic',
        pacing: 'steady'
      },
      platform_orchestrator: {
        communicationStyle: 'strategic-comprehensive',
        energyLevel: 'adaptive',
        coachingApproach: 'holistic',
        decisionSupport: 'systems-thinking',
        feedbackStyle: 'integrated',
        pacing: 'adaptive'
      }
    };

    const adapted = { ...baseTraits[agentType] } as AgentPersonalityAdaptation['adaptedTraits'];

    // Adjust based on user personality
    if (traits.extraversion !== undefined) {
      if (traits.extraversion > 70) {
        adapted.energyLevel = 'high';
        adapted.communicationStyle = adapted.communicationStyle + '-energetic';
      } else if (traits.extraversion < 30) {
        adapted.energyLevel = 'moderate';
        adapted.communicationStyle = adapted.communicationStyle + '-thoughtful';
      }
    }

    if (traits.conscientiousness !== undefined && traits.conscientiousness > 70) {
      adapted.pacing = 'structured';
      adapted.feedbackStyle = 'detailed';
    }

    if (traits.openness !== undefined && traits.openness > 70) {
      adapted.coachingApproach = adapted.coachingApproach + '-exploratory';
    }

    // Adjust based on work preferences
    if (workPrefs.decisionSpeed === 'quick') {
      adapted.pacing = 'fast';
      adapted.decisionSupport = 'decisive';
    } else if (workPrefs.decisionSpeed === 'thorough') {
      adapted.pacing = 'deliberate';
      adapted.decisionSupport = 'comprehensive';
    }

    if (workPrefs.feedbackPreference === 'direct') {
      adapted.feedbackStyle = 'direct';
    } else if (workPrefs.feedbackPreference === 'gentle') {
      adapted.feedbackStyle = 'supportive';
    }

    return adapted;
  }

  private generateCommunicationAdjustments(
    profile: AssessmentProfile
  ): AgentPersonalityAdaptation['communicationAdjustments'] {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};

    const adjustments: AgentPersonalityAdaptation['communicationAdjustments'] = {
      toneOfVoice: 'professional-friendly',
      formalityLevel: 'professional',
      detailLevel: 'balanced',
      questioningStyle: 'exploratory',
      encouragementFrequency: 'moderate'
    };

    // Adjust tone based on personality
    if (traits.agreeableness && traits.agreeableness > 70) {
      adjustments.toneOfVoice = 'warm-supportive';
      adjustments.encouragementFrequency = 'frequent';
    } else if (traits.agreeableness && traits.agreeableness < 30) {
      adjustments.toneOfVoice = 'direct-professional';
      adjustments.encouragementFrequency = 'minimal';
    }

    // Adjust formality
    if (profile.communicationStyle === 'direct') {
      adjustments.formalityLevel = 'casual';
      adjustments.questioningStyle = 'direct';
    } else if (profile.communicationStyle === 'diplomatic') {
      adjustments.formalityLevel = 'professional';
      adjustments.questioningStyle = 'socratic';
    }

    // Adjust detail level
    if (traits.analyticalThinking && traits.analyticalThinking > 70) {
      adjustments.detailLevel = 'detailed';
    } else if (traits.analyticalThinking && traits.analyticalThinking < 30) {
      adjustments.detailLevel = 'high-level';
    }

    // Adjust based on work preferences
    if (workPrefs.structureNeed === 'high') {
      adjustments.detailLevel = 'detailed';
      adjustments.questioningStyle = 'structured';
    }

    return adjustments;
  }

  private determineCoachingApproach(
    agentType: AgentType,
    profile: AssessmentProfile
  ): AgentPersonalityAdaptation['coachingApproach'] {
    const traits = profile.personalityTraits || {};
    const workPrefs = profile.workPreferences || {};

    // Default approaches by agent type
    const defaultApproaches: Record<AgentType, AgentPersonalityAdaptation['coachingApproach']> = {
      co_founder: 'collaborative',
      co_investor: 'challenging',
      co_builder: 'supportive',
      business_advisor: 'directive',
      investment_analyst: 'collaborative',
      credit_analyst: 'directive',
      impact_analyst: 'supportive',
      program_manager: 'collaborative',
      platform_orchestrator: 'adaptive'
    };

    let approach = defaultApproaches[agentType];

    // Adjust based on personality
    if (traits.conscientiousness && traits.conscientiousness > 70) {
      if (workPrefs.collaborationStyle === 'independent') {
        approach = 'directive';
      }
    }

    if (traits.openness && traits.openness > 70) {
      approach = 'collaborative';
    }

    if (traits.resilience && traits.resilience > 70) {
      approach = 'challenging';
    } else if (traits.resilience && traits.resilience < 40) {
      approach = 'supportive';
    }

    return approach;
  }

  // ============================================================================
  // PERSONALITY INSIGHTS
  // ============================================================================

  async generatePersonalityInsights(userId: number): Promise<PersonalityInsight[]> {
    const profiles = await this.getAllUserAssessments(userId);
    
    if (profiles.length === 0) {
      return [];
    }

    const latestProfile = profiles[0];
    const traits = latestProfile.personalityTraits || {};
    const insights: PersonalityInsight[] = [];

    // Generate insights for each trait
    if (traits.openness !== undefined) {
      insights.push({
        trait: 'Openness to Experience',
        score: traits.openness,
        interpretation: this.interpretTrait('openness', traits.openness),
        agentRecommendation: this.getAgentRecommendation('openness', traits.openness)
      });
    }

    if (traits.conscientiousness !== undefined) {
      insights.push({
        trait: 'Conscientiousness',
        score: traits.conscientiousness,
        interpretation: this.interpretTrait('conscientiousness', traits.conscientiousness),
        agentRecommendation: this.getAgentRecommendation('conscientiousness', traits.conscientiousness)
      });
    }

    if (traits.extraversion !== undefined) {
      insights.push({
        trait: 'Extraversion',
        score: traits.extraversion,
        interpretation: this.interpretTrait('extraversion', traits.extraversion),
        agentRecommendation: this.getAgentRecommendation('extraversion', traits.extraversion)
      });
    }

    if (traits.analyticalThinking !== undefined) {
      insights.push({
        trait: 'Analytical Thinking',
        score: traits.analyticalThinking,
        interpretation: this.interpretTrait('analyticalThinking', traits.analyticalThinking),
        agentRecommendation: this.getAgentRecommendation('analyticalThinking', traits.analyticalThinking)
      });
    }

    if (traits.resilience !== undefined) {
      insights.push({
        trait: 'Resilience',
        score: traits.resilience,
        interpretation: this.interpretTrait('resilience', traits.resilience),
        agentRecommendation: this.getAgentRecommendation('resilience', traits.resilience)
      });
    }

    return insights;
  }

  private interpretTrait(trait: string, score: number): string {
    const interpretations: Record<string, Record<string, string>> = {
      openness: {
        high: 'You are highly creative, curious, and open to new experiences. You thrive on innovation and exploration.',
        medium: 'You balance traditional approaches with openness to new ideas.',
        low: 'You prefer proven methods and practical approaches over experimentation.'
      },
      conscientiousness: {
        high: 'You are highly organized, disciplined, and goal-oriented. You excel at planning and execution.',
        medium: 'You balance structure with flexibility in your approach.',
        low: 'You prefer flexibility and spontaneity over rigid planning.'
      },
      extraversion: {
        high: 'You are energized by social interaction and thrive in collaborative environments.',
        medium: 'You balance social interaction with independent work.',
        low: 'You prefer focused, independent work and recharge through solitude.'
      },
      analyticalThinking: {
        high: 'You excel at data-driven decision making and systematic problem solving.',
        medium: 'You balance analytical thinking with intuition.',
        low: 'You rely more on intuition and experience than detailed analysis.'
      },
      resilience: {
        high: 'You bounce back quickly from setbacks and maintain optimism under pressure.',
        medium: 'You handle challenges well with occasional need for support.',
        low: 'You benefit from strong support systems during challenging times.'
      }
    };

    const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
    return interpretations[trait]?.[level] || 'Trait interpretation not available.';
  }

  private getAgentRecommendation(trait: string, score: number): string {
    const recommendations: Record<string, Record<string, string>> = {
      openness: {
        high: 'I\'ll encourage exploration of innovative solutions and creative approaches.',
        medium: 'I\'ll balance proven strategies with opportunities for innovation.',
        low: 'I\'ll focus on practical, proven approaches with clear ROI.'
      },
      conscientiousness: {
        high: 'I\'ll provide structured frameworks and detailed action plans.',
        medium: 'I\'ll offer flexible guidance with clear milestones.',
        low: 'I\'ll help you develop light structure while respecting your flexibility.'
      },
      extraversion: {
        high: 'I\'ll be energetic and interactive in our conversations.',
        medium: 'I\'ll adapt my energy to match your current state.',
        low: 'I\'ll be thoughtful and give you space to process independently.'
      },
      analyticalThinking: {
        high: 'I\'ll provide data-driven insights and detailed analysis.',
        medium: 'I\'ll balance data with intuitive guidance.',
        low: 'I\'ll focus on practical wisdom and experience-based insights.'
      },
      resilience: {
        high: 'I\'ll challenge you to push boundaries and take calculated risks.',
        medium: 'I\'ll provide balanced support and encouragement.',
        low: 'I\'ll offer extra support and celebrate small wins frequently.'
      }
    };

    const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
    return recommendations[trait]?.[level] || 'I\'ll adapt my approach to support you best.';
  }

  // ============================================================================
  // DATABASE MAINTENANCE
  // ============================================================================

  private async createIndexes(): Promise<void> {
    await this.assessmentProfiles.createIndex({ userId: 1, assessmentType: 1, completedAt: -1 });
    await this.assessmentProfiles.createIndex({ expiresAt: 1 }, { sparse: true });
    
    await this.agentAdaptations.createIndex({ userId: 1, agentType: 1 }, { unique: true });
    await this.agentAdaptations.createIndex({ assessmentProfileId: 1 });

    console.log('✅ Assessment integration indexes created');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let assessmentServiceInstance: AssessmentIntegrationService | null = null;

export function getAssessmentService(): AssessmentIntegrationService {
  if (!assessmentServiceInstance) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const databaseName = process.env.MONGODB_DATABASE_NAME || 'iterativ-db';

    if (!connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING environment variable is not set');
    }

    assessmentServiceInstance = new AssessmentIntegrationService(connectionString, databaseName);
  }

  return assessmentServiceInstance;
}

export async function initializeAssessmentService(): Promise<AssessmentIntegrationService> {
  const service = getAssessmentService();
  await service.connect();
  return service;
}
