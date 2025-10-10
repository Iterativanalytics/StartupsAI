
export interface CoachingInsight {
  type: 'opportunity' | 'warning' | 'celebration' | 'accountability' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actions: string[];
  confidence: number;
}

export class ProactiveCoach {
  private insights: Map<string, CoachingInsight[]> = new Map();
  
  async getProactiveInsights(context: any): Promise<CoachingInsight[]> {
    const insights: CoachingInsight[] = [];
    
    // Check for various patterns that need coaching intervention
    const avoidanceInsight = await this.checkAvoidancePattern(context);
    if (avoidanceInsight) insights.push(avoidanceInsight);
    
    const perfectionismInsight = await this.checkPerfectionismPattern(context);
    if (perfectionismInsight) insights.push(perfectionismInsight);
    
    const burnoutInsight = await this.checkBurnoutPattern(context);
    if (burnoutInsight) insights.push(burnoutInsight);
    
    const celebrationInsight = await this.checkCelebrationDeficit(context);
    if (celebrationInsight) insights.push(celebrationInsight);
    
    const strategicDriftInsight = await this.checkStrategicDrift(context);
    if (strategicDriftInsight) insights.push(strategicDriftInsight);
    
    return insights.sort((a, b) => this.getPriorityScore(b) - this.getPriorityScore(a));
  }
  
  async getDailyInsights(context: any): Promise<CoachingInsight[]> {
    const insights: CoachingInsight[] = [];
    
    // Morning motivation based on recent activity
    const recentActivity = await this.analyzeRecentActivity(context);
    
    if (recentActivity.hasWins) {
      insights.push({
        type: 'celebration',
        priority: 'medium',
        title: 'Momentum Building',
        message: 'You\'ve had some solid wins recently. Let\'s capitalize on this momentum and tackle something bigger today.',
        actions: ['Review recent successes', 'Plan ambitious goal for today', 'Share wins with team'],
        confidence: 0.8
      });
    }
    
    if (recentActivity.hasBlockers) {
      insights.push({
        type: 'accountability',
        priority: 'high',
        title: 'Blocker Alert',
        message: 'I notice you\'ve been stuck on a few things. Sometimes the best way through is to ask for help or try a different approach.',
        actions: ['Identify the real blocker', 'Brainstorm alternative approaches', 'Consider asking for help'],
        confidence: 0.9
      });
    }
    
    return insights;
  }
  
  private async checkAvoidancePattern(context: any): Promise<CoachingInsight | null> {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const avoidancePatterns = new Map<string, number>();
    
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      
      // Look for repeated mentions of tasks that need to be done
      const matches = content.match(/(need to|should|have to|must) ([^.!?]+)/g);
      if (matches) {
        for (const match of matches) {
          const task = match.replace(/(need to|should|have to|must)\s+/, '');
          avoidancePatterns.set(task, (avoidancePatterns.get(task) || 0) + 1);
        }
      }
    }
    
    // Find tasks mentioned 3+ times without resolution
    const avoidedTasks = Array.from(avoidancePatterns.entries())
      .filter(([task, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a);
    
    if (avoidedTasks.length > 0) {
      const [mostAvoided] = avoidedTasks[0];
      
      return {
        type: 'accountability',
        priority: 'high',
        title: 'Avoidance Pattern Detected',
        message: `You've mentioned needing to "${mostAvoided}" several times without action. Avoidance usually means the task is either unclear, overwhelming, or unpleasant. Let's break it down and tackle it.`,
        actions: [
          'Define the exact outcome needed',
          'Break into 15-minute chunks',
          'Identify what makes this unpleasant',
          'Schedule a specific time to do it'
        ],
        confidence: 0.85
      };
    }
    
    return null;
  }
  
  private async checkPerfectionismPattern(context: any): Promise<CoachingInsight | null> {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    
    // Look for perfectionism indicators
    let perfectionismScore = 0;
    const perfectionKeywords = [
      'perfect', 'ready', 'polished', 'final', 'complete',
      'not quite right', 'needs more work', 'almost there'
    ];
    
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of perfectionKeywords) {
        if (content.includes(keyword)) {
          perfectionismScore++;
        }
      }
      
      // Check for mentions of working on the same thing repeatedly
      if (content.match(/(still working on|keep tweaking|keep adjusting|refining)/)) {
        perfectionismScore += 2;
      }
    }
    
    if (perfectionismScore > 5) {
      return {
        type: 'accountability',
        priority: 'medium',
        title: 'Perfectionism Alert',
        message: 'I sense you might be over-polishing something. Remember: "Perfect is the enemy of done." Sometimes shipping "good enough" gets you feedback faster than perfecting in isolation.',
        actions: [
          'Define "good enough" criteria',
          'Set a ship deadline',
          'Get feedback early',
          'Iterate based on real user input'
        ],
        confidence: 0.75
      };
    }
    
    return null;
  }
  
  private async checkBurnoutPattern(context: any): Promise<CoachingInsight | null> {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    
    let burnoutIndicators = 0;
    const burnoutKeywords = [
      'exhausted', 'tired', 'burnt out', 'overwhelmed', 
      'stressed', 'can\'t keep up', 'too much', 'no time'
    ];
    
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of burnoutKeywords) {
        if (content.includes(keyword)) {
          burnoutIndicators++;
        }
      }
      
      // Check message timing - late night messages indicate overwork
      const messageHour = new Date(message.timestamp).getHours();
      if (messageHour > 22 || messageHour < 6) {
        burnoutIndicators++;
      }
    }
    
    if (burnoutIndicators > 4) {
      return {
        type: 'warning',
        priority: 'critical',
        title: 'Burnout Risk Detected',
        message: '🚨 You\'re showing classic burnout signs. Burned-out founders can\'t build great companies. Your business needs you healthy and sharp, not exhausted.',
        actions: [
          'Take a complete day off this week',
          'Delegate or eliminate non-essential tasks',
          'Set work hour boundaries',
          'Consider hiring support sooner'
        ],
        confidence: 0.9
      };
    }
    
    return null;
  }
  
  private async checkCelebrationDeficit(context: any): Promise<CoachingInsight | null> {
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    
    // Look for achievements that weren't celebrated
    const achievements = [];
    const celebrations = [];
    
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      
      // Achievement indicators
      if (content.match(/(closed|signed|launched|raised|hired|achieved|reached|hit)/)) {
        achievements.push(message);
      }
      
      // Celebration indicators
      if (content.match(/(celebrated|party|excited|thrilled|amazing|fantastic)/)) {
        celebrations.push(message);
      }
    }
    
    // If achievements > celebrations, suggest celebrating
    if (achievements.length > 0 && celebrations.length === 0) {
      return {
        type: 'celebration',
        priority: 'medium',
        title: 'Celebration Deficit',
        message: `I noticed you've had some wins recently but didn't take time to celebrate. Celebrating wins isn't vanity - it builds momentum, motivates your team, and helps you recognize what's working.`,
        actions: [
          'Take 5 minutes to appreciate the win',
          'Share the success with your team',
          'Post about it publicly',
          'Plan a small celebration'
        ],
        confidence: 0.8
      };
    }
    
    return null;
  }
  
  private async checkStrategicDrift(context: any): Promise<CoachingInsight | null> {
    // This would require more sophisticated analysis of business direction
    // For now, return a simple check
    
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    const strategicKeywords = ['pivot', 'new direction', 'different approach', 'changing strategy'];
    
    let strategyChanges = 0;
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      for (const keyword of strategicKeywords) {
        if (content.includes(keyword)) {
          strategyChanges++;
        }
      }
    }
    
    if (strategyChanges > 2) {
      return {
        type: 'strategy',
        priority: 'high',
        title: 'Strategic Focus Check',
        message: 'I\'ve noticed several mentions of strategy changes lately. Strategic agility is good, but too much pivoting can indicate lack of focus. Let\'s ensure we\'re being strategic, not reactive.',
        actions: [
          'Review core strategy and priorities',
          'Identify what triggered recent changes',
          'Set criteria for future strategic decisions',
          'Communicate strategy clearly to team'
        ],
        confidence: 0.7
      };
    }
    
    return null;
  }
  
  private async analyzeRecentActivity(context: any): Promise<{
    hasWins: boolean;
    hasBlockers: boolean;
    momentum: 'high' | 'medium' | 'low';
  }> {
    const recentMessages = context.conversationHistory?.slice(-10) || [];
    
    let wins = 0;
    let blockers = 0;
    
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      
      // Win indicators
      if (content.match(/(completed|finished|launched|closed|achieved|successful)/)) {
        wins++;
      }
      
      // Blocker indicators
      if (content.match(/(stuck|blocked|can't|unable|waiting|problem)/)) {
        blockers++;
      }
    }
    
    return {
      hasWins: wins > 0,
      hasBlockers: blockers > 1,
      momentum: wins > blockers ? 'high' : blockers > wins ? 'low' : 'medium'
    };
  }
  
  private getPriorityScore(insight: CoachingInsight): number {
    const priorityScores = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityScores[insight.priority] * insight.confidence;
  }
}
