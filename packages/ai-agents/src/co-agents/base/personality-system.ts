import { PersonalityProfile, PersonalityTraits } from '../../types';

/**
 * Personality System - Manages AI agent personality adaptation and consistency
 * 
 * This system ensures that Co-Agents maintain consistent personality while
 * adapting to user preferences and relationship dynamics.
 */
export class PersonalitySystem {
  private basePersonality: PersonalityProfile;
  private adaptedPersonalities: Map<string, PersonalityProfile> = new Map();

  constructor(basePersonality: PersonalityProfile) {
    this.basePersonality = basePersonality;
  }

  /**
   * Get adapted personality for a specific user
   */
  async getAdaptedPersonality(userId: string): Promise<PersonalityProfile> {
    const adapted = this.adaptedPersonalities.get(userId);
    
    if (adapted) {
      return adapted;
    }

    // Return base personality if no adaptation exists
    return this.basePersonality;
  }

  /**
   * Adapt personality based on user preferences and relationship metrics
   */
  async adaptPersonality(
    userId: string,
    userPreferences: any,
    relationshipMetrics: any,
    interactionHistory: any[]
  ): Promise<PersonalityProfile> {
    
    const currentPersonality = await this.getAdaptedPersonality(userId);
    
    // Calculate adaptation based on various factors
    const adaptations = this.calculateAdaptations(
      userPreferences,
      relationshipMetrics,
      interactionHistory
    );

    // Apply adaptations to create new personality profile
    const adaptedPersonality = this.applyAdaptations(currentPersonality, adaptations);
    
    // Store the adapted personality
    this.adaptedPersonalities.set(userId, adaptedPersonality);
    
    return adaptedPersonality;
  }

  /**
   * Get personality traits for current conversation context
   */
  getPersonalityTraits(
    personality: PersonalityProfile,
    conversationContext: any
  ): PersonalityTraits {
    
    const baseTraits = this.convertProfileToTraits(personality);
    
    // Adjust traits based on conversation context
    return this.adjustTraitsForContext(baseTraits, conversationContext);
  }

  /**
   * Determine response style based on personality and situation
   */
  getResponseStyle(
    personality: PersonalityProfile,
    situationContext: any
  ): any {
    
    return {
      tone: this.determineTone(personality, situationContext),
      directness: this.calculateDirectness(personality, situationContext),
      supportiveness: this.calculateSupportiveness(personality, situationContext),
      analyticalDepth: this.calculateAnalyticalDepth(personality, situationContext),
      personalTouch: this.calculatePersonalTouch(personality, situationContext),
      pacing: this.determinePacing(personality, situationContext)
    };
  }

  /**
   * Validate personality consistency across interactions
   */
  validatePersonalityConsistency(
    personality: PersonalityProfile,
    recentResponses: any[]
  ): any {
    
    const consistencyScore = this.calculateConsistencyScore(personality, recentResponses);
    const deviations = this.identifyDeviations(personality, recentResponses);
    
    return {
      consistencyScore,
      deviations,
      recommendations: this.getConsistencyRecommendations(consistencyScore, deviations)
    };
  }

  // Private helper methods

  private calculateAdaptations(
    userPreferences: any,
    relationshipMetrics: any,
    interactionHistory: any[]
  ): any {
    
    const adaptations = {
      communicationStyle: this.basePersonality.communicationStyle,
      decisionStyle: this.basePersonality.decisionStyle,
      coachingApproach: this.basePersonality.coachingApproach,
      energyLevel: this.basePersonality.energyLevel,
      adaptationLevel: this.basePersonality.adaptationLevel
    };

    // Adapt communication style based on user preferences
    if (userPreferences.feedbackStyle === 'direct' && relationshipMetrics.trustLevel > 70) {
      adaptations.communicationStyle = 'direct';
    } else if (userPreferences.feedbackStyle === 'gentle') {
      adaptations.communicationStyle = 'supportive';
    }

    // Adapt coaching approach based on user preferences and relationship
    if (userPreferences.challengeLevel === 'high' && relationshipMetrics.trustLevel > 80) {
      adaptations.coachingApproach = 'challenging';
    } else if (relationshipMetrics.trustLevel < 50) {
      adaptations.coachingApproach = 'nurturing';
    }

    // Adapt decision style based on user type and preferences
    if (userPreferences.meetingPreference === 'structured') {
      adaptations.decisionStyle = 'data-driven';
    } else if (userPreferences.meetingPreference === 'casual') {
      adaptations.decisionStyle = 'collaborative';
    }

    // Adapt energy level based on interaction patterns
    const recentEngagement = this.analyzeRecentEngagement(interactionHistory);
    if (recentEngagement.energyLevel === 'low') {
      adaptations.energyLevel = 'moderate';
    } else if (recentEngagement.energyLevel === 'high') {
      adaptations.energyLevel = 'high';
    }

    return adaptations;
  }

  private applyAdaptations(
    currentPersonality: PersonalityProfile,
    adaptations: any
  ): PersonalityProfile {
    
    const maxAdaptation = currentPersonality.adaptationLevel / 100;
    
    return {
      communicationStyle: this.blendStyles(
        currentPersonality.communicationStyle,
        adaptations.communicationStyle,
        maxAdaptation
      ),
      decisionStyle: this.blendStyles(
        currentPersonality.decisionStyle,
        adaptations.decisionStyle,
        maxAdaptation
      ),
      coachingApproach: this.blendStyles(
        currentPersonality.coachingApproach,
        adaptations.coachingApproach,
        maxAdaptation
      ),
      energyLevel: this.blendStyles(
        currentPersonality.energyLevel,
        adaptations.energyLevel,
        maxAdaptation
      ),
      adaptationLevel: currentPersonality.adaptationLevel
    };
  }

  private convertProfileToTraits(personality: PersonalityProfile): PersonalityTraits {
    return {
      supportiveness: this.mapStyleToValue(personality.communicationStyle, {
        'supportive': 90,
        'analytical': 60,
        'direct': 40,
        'creative': 70
      }),
      directness: this.mapStyleToValue(personality.communicationStyle, {
        'direct': 90,
        'analytical': 70,
        'supportive': 30,
        'creative': 50
      }),
      analyticalDepth: this.mapStyleToValue(personality.decisionStyle, {
        'data-driven': 90,
        'analytical': 85,
        'collaborative': 60,
        'intuitive': 40,
        'decisive': 70
      }),
      creativity: this.mapStyleToValue(personality.communicationStyle, {
        'creative': 90,
        'supportive': 60,
        'analytical': 40,
        'direct': 30
      }),
      patience: this.mapStyleToValue(personality.coachingApproach, {
        'nurturing': 90,
        'adaptive': 70,
        'structured': 60,
        'challenging': 40
      })
    };
  }

  private adjustTraitsForContext(
    baseTraits: PersonalityTraits,
    context: any
  ): PersonalityTraits {
    
    const adjustedTraits = { ...baseTraits };

    // Increase supportiveness in crisis situations
    if (context.emotionalState === 'stressed' || context.urgency === 'high') {
      adjustedTraits.supportiveness = Math.min(100, adjustedTraits.supportiveness + 20);
      adjustedTraits.patience = Math.min(100, adjustedTraits.patience + 15);
    }

    // Increase directness for urgent, analytical tasks
    if (context.taskType === 'analysis' && context.urgency === 'high') {
      adjustedTraits.directness = Math.min(100, adjustedTraits.directness + 15);
      adjustedTraits.analyticalDepth = Math.min(100, adjustedTraits.analyticalDepth + 10);
    }

    // Increase creativity for brainstorming sessions
    if (context.taskType === 'brainstorm') {
      adjustedTraits.creativity = Math.min(100, adjustedTraits.creativity + 25);
    }

    return adjustedTraits;
  }

  private determineTone(personality: PersonalityProfile, context: any): string {
    if (context.emotionalState === 'stressed') return 'supportive';
    if (context.taskType === 'analysis') return 'professional';
    if (personality.energyLevel === 'high') return 'energetic';
    if (personality.communicationStyle === 'supportive') return 'warm';
    return 'balanced';
  }

  private calculateDirectness(personality: PersonalityProfile, context: any): number {
    let base = this.mapStyleToValue(personality.communicationStyle, {
      'direct': 0.9,
      'analytical': 0.7,
      'supportive': 0.3,
      'creative': 0.5
    });

    // Adjust based on context
    if (context.urgency === 'high') base += 0.2;
    if (context.emotionalState === 'stressed') base -= 0.3;
    
    return Math.max(0, Math.min(1, base));
  }

  private calculateSupportiveness(personality: PersonalityProfile, context: any): number {
    let base = this.mapStyleToValue(personality.coachingApproach, {
      'nurturing': 0.9,
      'supportive': 0.8,
      'adaptive': 0.6,
      'structured': 0.4,
      'challenging': 0.3
    });

    // Adjust based on context
    if (context.emotionalState === 'stressed') base += 0.3;
    if (context.relationshipStrength === 'high') base += 0.1;
    
    return Math.max(0, Math.min(1, base));
  }

  private calculateAnalyticalDepth(personality: PersonalityProfile, context: any): number {
    let base = this.mapStyleToValue(personality.decisionStyle, {
      'data-driven': 0.9,
      'analytical': 0.8,
      'collaborative': 0.6,
      'decisive': 0.7,
      'intuitive': 0.4
    });

    // Adjust based on context
    if (context.taskType === 'analysis') base += 0.2;
    if (context.urgency === 'high') base -= 0.1;
    
    return Math.max(0, Math.min(1, base));
  }

  private calculatePersonalTouch(personality: PersonalityProfile, context: any): number {
    let base = this.mapStyleToValue(personality.communicationStyle, {
      'supportive': 0.8,
      'creative': 0.7,
      'analytical': 0.4,
      'direct': 0.3
    });

    // Adjust based on context
    if (context.relationshipStrength === 'high') base += 0.2;
    if (context.taskType === 'analysis') base -= 0.2;
    
    return Math.max(0, Math.min(1, base));
  }

  private determinePacing(personality: PersonalityProfile, context: any): string {
    if (context.urgency === 'high') return 'fast';
    if (personality.energyLevel === 'high') return 'energetic';
    if (context.emotionalState === 'stressed') return 'careful';
    return 'moderate';
  }

  private calculateConsistencyScore(
    personality: PersonalityProfile,
    recentResponses: any[]
  ): number {
    // Simplified consistency calculation
    return 0.85; // Would implement actual consistency checking
  }

  private identifyDeviations(
    personality: PersonalityProfile,
    recentResponses: any[]
  ): any[] {
    // Simplified deviation detection
    return []; // Would implement actual deviation detection
  }

  private getConsistencyRecommendations(
    consistencyScore: number,
    deviations: any[]
  ): string[] {
    const recommendations = [];
    
    if (consistencyScore < 0.7) {
      recommendations.push('Focus on maintaining consistent communication style');
    }
    
    if (deviations.length > 0) {
      recommendations.push('Address identified personality deviations');
    }
    
    return recommendations;
  }

  private analyzeRecentEngagement(interactionHistory: any[]): any {
    // Simplified engagement analysis
    return { energyLevel: 'moderate' };
  }

  private blendStyles(current: string, target: string, maxAdaptation: number): string {
    // For simplicity, return target if adaptation allows, otherwise current
    return maxAdaptation > 0.5 ? target : current;
  }

  private mapStyleToValue(style: string, mapping: Record<string, number>): number {
    return mapping[style] || 50;
  }
}
