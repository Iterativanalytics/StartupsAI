
export interface BusinessMemory {
  userId: string;
  businessContext: {
    industry: string;
    stage: string;
    teamSize: number;
    revenue?: number;
    fundingRaised?: number;
    keyMetrics: Record<string, any>;
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
    completed: string[];
  };
  challenges: {
    current: string[];
    recurring: string[];
    resolved: string[];
  };
  decisions: {
    major: Array<{
      decision: string;
      outcome: string;
      learnings: string;
      date: Date;
    }>;
  };
  preferences: {
    communicationStyle: 'direct' | 'supportive' | 'analytical';
    meetingFrequency: 'daily' | 'weekly' | 'as-needed';
    focusAreas: string[];
  };
  lastUpdated: Date;
}

export class MemorySystem {
  private memories: Map<string, BusinessMemory> = new Map();
  
  async getBusinessMemory(userId: string): Promise<BusinessMemory> {
    let memory = this.memories.get(userId);
    
    if (!memory) {
      memory = {
        userId,
        businessContext: {
          industry: 'unknown',
          stage: 'early',
          teamSize: 1,
          keyMetrics: {}
        },
        goals: {
          shortTerm: [],
          longTerm: [],
          completed: []
        },
        challenges: {
          current: [],
          recurring: [],
          resolved: []
        },
        decisions: {
          major: []
        },
        preferences: {
          communicationStyle: 'supportive',
          meetingFrequency: 'weekly',
          focusAreas: []
        },
        lastUpdated: new Date()
      };
      
      this.memories.set(userId, memory);
    }
    
    return memory;
  }
  
  async updateBusinessContext(userId: string, context: Partial<BusinessMemory['businessContext']>): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    memory.businessContext = { ...memory.businessContext, ...context };
    memory.lastUpdated = new Date();
  }
  
  async addGoal(userId: string, goal: string, type: 'shortTerm' | 'longTerm'): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    memory.goals[type].push(goal);
    memory.lastUpdated = new Date();
  }
  
  async completeGoal(userId: string, goal: string): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    
    // Remove from active goals and add to completed
    memory.goals.shortTerm = memory.goals.shortTerm.filter(g => g !== goal);
    memory.goals.longTerm = memory.goals.longTerm.filter(g => g !== goal);
    memory.goals.completed.push(goal);
    memory.lastUpdated = new Date();
  }
  
  async addChallenge(userId: string, challenge: string): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    
    if (!memory.challenges.current.includes(challenge)) {
      memory.challenges.current.push(challenge);
      memory.lastUpdated = new Date();
    }
  }
  
  async resolveChallenge(userId: string, challenge: string): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    
    memory.challenges.current = memory.challenges.current.filter(c => c !== challenge);
    memory.challenges.resolved.push(challenge);
    memory.lastUpdated = new Date();
  }
  
  async recordDecision(userId: string, decision: string, outcome: string, learnings: string): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    
    memory.decisions.major.push({
      decision,
      outcome,
      learnings,
      date: new Date()
    });
    memory.lastUpdated = new Date();
  }
  
  async updatePreferences(userId: string, preferences: Partial<BusinessMemory['preferences']>): Promise<void> {
    const memory = await this.getBusinessMemory(userId);
    memory.preferences = { ...memory.preferences, ...preferences };
    memory.lastUpdated = new Date();
  }
  
  async getInsights(userId: string): Promise<{
    progressInsights: string[];
    patternInsights: string[];
    recommendedActions: string[];
  }> {
    const memory = await this.getBusinessMemory(userId);
    
    const progressInsights: string[] = [];
    const patternInsights: string[] = [];
    const recommendedActions: string[] = [];
    
    // Progress insights
    if (memory.goals.completed.length > memory.goals.shortTerm.length + memory.goals.longTerm.length) {
      progressInsights.push('Strong goal completion rate - you execute well on commitments');
    }
    
    if (memory.challenges.resolved.length > memory.challenges.current.length) {
      progressInsights.push('Good problem-solving track record - you work through challenges effectively');
    }
    
    // Pattern insights
    if (memory.challenges.recurring.length > 0) {
      patternInsights.push(`Recurring challenges in: ${memory.challenges.recurring.join(', ')}`);
    }
    
    if (memory.decisions.major.length > 5) {
      patternInsights.push('High decision velocity - you move fast but ensure learnings are captured');
    }
    
    // Recommended actions
    if (memory.goals.shortTerm.length === 0) {
      recommendedActions.push('Set 2-3 short-term goals for the next 30 days');
    }
    
    if (memory.challenges.current.length > 5) {
      recommendedActions.push('Prioritize and tackle the most critical challenges first');
    }
    
    return { progressInsights, patternInsights, recommendedActions };
  }
}
