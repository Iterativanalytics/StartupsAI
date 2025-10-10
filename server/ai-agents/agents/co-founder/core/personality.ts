
export interface CoFounderPersonality {
  traits: {
    assertiveness: number;      // 1-10: How strongly they push back
    optimism: number;           // 1-10: Positive vs. realistic
    detail_orientation: number; // 1-10: Big picture vs. details
    risk_tolerance: number;     // 1-10: Conservative vs. aggressive
    directness: number;         // 1-10: Diplomatic vs. blunt
  };
  
  style: {
    formality: 'casual' | 'professional' | 'adaptive';
    humor: 'frequent' | 'occasional' | 'rare';
    storytelling: boolean;
    questioning: 'socratic' | 'direct' | 'exploratory';
  };
  
  expertise: {
    primary: string[];
    secondary: string[];
    learning: string[];
  };
  
  interaction: {
    proactivity: 'high' | 'medium' | 'low';
    checkInFrequency: 'daily' | 'weekly' | 'as-needed';
    challengeLevel: 'supportive' | 'balanced' | 'challenging';
  };
}

export const personalityPresets: Record<string, CoFounderPersonality> = {
  'supportive-mentor': {
    traits: {
      assertiveness: 5,
      optimism: 8,
      detail_orientation: 6,
      risk_tolerance: 5,
      directness: 6
    },
    style: {
      formality: 'casual',
      humor: 'occasional',
      storytelling: true,
      questioning: 'exploratory'
    },
    expertise: {
      primary: ['strategy', 'leadership', 'team-building'],
      secondary: ['finance', 'marketing'],
      learning: ['ai', 'emerging-tech']
    },
    interaction: {
      proactivity: 'medium',
      checkInFrequency: 'daily',
      challengeLevel: 'supportive'
    }
  },
  
  'challenging-advisor': {
    traits: {
      assertiveness: 8,
      optimism: 5,
      detail_orientation: 8,
      risk_tolerance: 4,
      directness: 9
    },
    style: {
      formality: 'professional',
      humor: 'rare',
      storytelling: false,
      questioning: 'socratic'
    },
    expertise: {
      primary: ['finance', 'operations', 'risk-management'],
      secondary: ['strategy', 'legal'],
      learning: ['data-analysis']
    },
    interaction: {
      proactivity: 'high',
      checkInFrequency: 'daily',
      challengeLevel: 'challenging'
    }
  },
  
  'growth-partner': {
    traits: {
      assertiveness: 7,
      optimism: 7,
      detail_orientation: 5,
      risk_tolerance: 7,
      directness: 7
    },
    style: {
      formality: 'adaptive',
      humor: 'frequent',
      storytelling: true,
      questioning: 'direct'
    },
    expertise: {
      primary: ['growth', 'marketing', 'product'],
      secondary: ['sales', 'partnerships'],
      learning: ['growth-hacking', 'viral-mechanics']
    },
    interaction: {
      proactivity: 'high',
      checkInFrequency: 'weekly',
      challengeLevel: 'balanced'
    }
  }
};

export class PersonalityManager {
  private personalities: Map<string, CoFounderPersonality> = new Map();
  
  async getPersonalityTraits(userId: string): Promise<CoFounderPersonality> {
    // Check if user has custom personality settings
    const customPersonality = this.personalities.get(userId);
    if (customPersonality) {
      return customPersonality;
    }
    
    // Default to balanced growth partner personality
    return personalityPresets['growth-partner'];
  }
  
  async setPersonalityPreset(userId: string, presetName: string): Promise<void> {
    const preset = personalityPresets[presetName];
    if (preset) {
      this.personalities.set(userId, preset);
    }
  }
  
  async customizePersonality(userId: string, traits: Partial<CoFounderPersonality>): Promise<void> {
    const currentPersonality = await this.getPersonalityTraits(userId);
    const updatedPersonality = {
      ...currentPersonality,
      ...traits,
      traits: { ...currentPersonality.traits, ...traits.traits },
      style: { ...currentPersonality.style, ...traits.style },
      expertise: { ...currentPersonality.expertise, ...traits.expertise },
      interaction: { ...currentPersonality.interaction, ...traits.interaction }
    };
    
    this.personalities.set(userId, updatedPersonality);
  }
  
  adaptToneForPersonality(content: string, personality: CoFounderPersonality): string {
    let adaptedContent = content;
    
    // Adjust directness
    if (personality.traits.directness < 5) {
      adaptedContent = this.makeDiplomatic(adaptedContent);
    } else if (personality.traits.directness > 7) {
      adaptedContent = this.makeBlunt(adaptedContent);
    }
    
    // Add humor if appropriate
    if (personality.style.humor === 'frequent') {
      adaptedContent = this.addLightHumor(adaptedContent);
    }
    
    // Adjust formality
    if (personality.style.formality === 'professional') {
      adaptedContent = this.makeFormal(adaptedContent);
    } else if (personality.style.formality === 'casual') {
      adaptedContent = this.makeCasual(adaptedContent);
    }
    
    return adaptedContent;
  }
  
  private makeDiplomatic(content: string): string {
    return content
      .replace(/You need to/g, 'You might want to consider')
      .replace(/You should/g, 'It might be worth')
      .replace(/That's wrong/g, 'There might be another way to look at this');
  }
  
  private makeBlunt(content: string): string {
    return content
      .replace(/You might want to consider/g, 'You need to')
      .replace(/Perhaps/g, 'Clearly')
      .replace(/It seems like/g, 'The reality is');
  }
  
  private addLightHumor(content: string): string {
    // Simple humor injection - can be made more sophisticated
    const humorPhrases = [
      "😄 ",
      "🤔 Well, ",
      "Plot twist: ",
      "Here's the thing: "
    ];
    
    const randomPhrase = humorPhrases[Math.floor(Math.random() * humorPhrases.length)];
    return randomPhrase + content;
  }
  
  private makeFormal(content: string): string {
    return content
      .replace(/can't/g, 'cannot')
      .replace(/won't/g, 'will not')
      .replace(/Let's/g, 'Let us');
  }
  
  private makeCasual(content: string): string {
    return content
      .replace(/cannot/g, "can't")
      .replace(/will not/g, "won't")
      .replace(/Let us/g, "Let's");
  }
}
