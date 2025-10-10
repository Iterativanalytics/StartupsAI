
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'product' | 'team' | 'strategic' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'on_track' | 'at_risk' | 'overdue' | 'completed';
  progress: number; // 0-100
  milestones: Milestone[];
  createdDate: Date;
  updatedDate: Date;
  userId: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface Commitment {
  id: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: Date;
  userId: string;
}

export class AccountabilityEngine {
  private goals: Map<string, Goal[]> = new Map();
  private commitments: Map<string, Commitment[]> = new Map();
  
  async getCurrentGoals(userId: string): Promise<Goal[]> {
    return this.goals.get(userId) || [];
  }
  
  async addGoal(userId: string, goal: Omit<Goal, 'id' | 'createdDate' | 'updatedDate' | 'userId'>): Promise<Goal> {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdDate: new Date(),
      updatedDate: new Date(),
      userId
    };
    
    const userGoals = this.goals.get(userId) || [];
    userGoals.push(newGoal);
    this.goals.set(userId, userGoals);
    
    return newGoal;
  }
  
  async updateGoalProgress(userId: string, goalId: string, progress: number): Promise<void> {
    const userGoals = this.goals.get(userId) || [];
    const goal = userGoals.find(g => g.id === goalId);
    
    if (goal) {
      goal.progress = progress;
      goal.updatedDate = new Date();
      
      // Update status based on progress and timing
      if (progress === 100) {
        goal.status = 'completed';
      } else if (new Date() > goal.targetDate && progress < 100) {
        goal.status = 'overdue';
      } else if (progress < 50 && this.isCloseToDeadline(goal.targetDate)) {
        goal.status = 'at_risk';
      } else if (progress > 0) {
        goal.status = 'in_progress';
      }
    }
  }
  
  async addCommitment(userId: string, description: string, dueDate: Date): Promise<Commitment> {
    const commitment: Commitment = {
      id: Date.now().toString(),
      description,
      dueDate,
      status: 'pending',
      userId
    };
    
    const userCommitments = this.commitments.get(userId) || [];
    userCommitments.push(commitment);
    this.commitments.set(userId, userCommitments);
    
    return commitment;
  }
  
  async getRecentCommitments(userId: string): Promise<Commitment[]> {
    const userCommitments = this.commitments.get(userId) || [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return userCommitments.filter(c => c.dueDate >= thirtyDaysAgo);
  }
  
  async assessProgress(commitments: Commitment[], context: any): Promise<{
    onTime: number;
    overdue: number;
    completed: number;
    patterns: string[];
  }> {
    const now = new Date();
    
    const onTime = commitments.filter(c => c.status === 'pending' && c.dueDate > now).length;
    const overdue = commitments.filter(c => c.status === 'overdue' || (c.status === 'pending' && c.dueDate <= now)).length;
    const completed = commitments.filter(c => c.status === 'completed').length;
    
    // Identify patterns
    const patterns: string[] = [];
    
    if (overdue > completed) {
      patterns.push('Overcommitting - setting too many deadlines');
    }
    
    if (commitments.length > 10) {
      patterns.push('High commitment volume - consider prioritizing');
    }
    
    const avgCompletionTime = this.calculateAverageCompletionTime(commitments);
    if (avgCompletionTime > 7) {
      patterns.push('Taking longer than expected to complete commitments');
    }
    
    return { onTime, overdue, completed, patterns };
  }
  
  async identifyPatterns(userId: string): Promise<{
    insights: string[];
    excuseAnalysis?: string;
    recommendations: string[];
  }> {
    const userGoals = this.goals.get(userId) || [];
    const userCommitments = this.commitments.get(userId) || [];
    
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    // Goal completion patterns
    const completedGoals = userGoals.filter(g => g.status === 'completed');
    const overdueGoals = userGoals.filter(g => g.status === 'overdue');
    
    if (completedGoals.length > overdueGoals.length) {
      insights.push('Strong goal completion rate - you follow through on commitments');
    }
    
    if (overdueGoals.length > completedGoals.length) {
      insights.push('Goals tend to go overdue - may be setting unrealistic timelines');
      recommendations.push('Consider adding buffer time to goal deadlines');
    }
    
    // Category analysis
    const categoryPerformance = this.analyzeCategoryPerformance(userGoals);
    for (const [category, performance] of Object.entries(categoryPerformance)) {
      if (performance.completionRate > 80) {
        insights.push(`Excellent performance in ${category} goals`);
      } else if (performance.completionRate < 40) {
        insights.push(`Struggling with ${category} goals - may need different approach`);
        recommendations.push(`Break down ${category} goals into smaller milestones`);
      }
    }
    
    // Timing patterns
    const overdueCommitments = userCommitments.filter(c => c.status === 'overdue');
    let excuseAnalysis;
    
    if (overdueCommitments.length > 3) {
      excuseAnalysis = 'Pattern detected: Multiple overdue commitments suggest either overcommitment or execution challenges. What\'s the real blocker here?';
    }
    
    return { insights, excuseAnalysis, recommendations };
  }
  
  async identifyBlockers(context: any): Promise<Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  }>> {
    const blockers: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      suggestion: string;
    }> = [];
    
    // Analyze conversation history for blocker patterns
    const recentMessages = context.conversationHistory?.slice(-20) || [];
    
    // Look for repeated mentions of obstacles
    const blockerKeywords = ['blocked', 'stuck', 'can\'t', 'unable', 'waiting for', 'need to', 'should'];
    const blockerMentions = new Map<string, number>();
    
    for (const message of recentMessages) {
      for (const keyword of blockerKeywords) {
        if (message.content.toLowerCase().includes(keyword)) {
          blockerMentions.set(keyword, (blockerMentions.get(keyword) || 0) + 1);
        }
      }
    }
    
    // Convert frequent mentions to blocker insights
    for (const [keyword, count] of blockerMentions) {
      if (count > 2) {
        blockers.push({
          type: 'recurring_obstacle',
          description: `Frequently mentioned: "${keyword}" - indicates potential recurring blocker`,
          severity: count > 4 ? 'high' : 'medium',
          suggestion: 'Let\'s identify the root cause and create an action plan to remove this blocker'
        });
      }
    }
    
    return blockers;
  }
  
  private isCloseToDeadline(targetDate: Date): boolean {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Within a week
  }
  
  private calculateAverageCompletionTime(commitments: Commitment[]): number {
    const completed = commitments.filter(c => c.status === 'completed' && c.completedDate);
    if (completed.length === 0) return 0;
    
    const totalDays = completed.reduce((sum, c) => {
      const dueDate = new Date(c.dueDate);
      const completedDate = new Date(c.completedDate!);
      const diffTime = completedDate.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return totalDays / completed.length;
  }
  
  private analyzeCategoryPerformance(goals: Goal[]): Record<string, { completionRate: number; totalGoals: number }> {
    const performance: Record<string, { completionRate: number; totalGoals: number }> = {};
    
    for (const goal of goals) {
      if (!performance[goal.category]) {
        performance[goal.category] = { completionRate: 0, totalGoals: 0 };
      }
      
      performance[goal.category].totalGoals++;
      
      if (goal.status === 'completed') {
        performance[goal.category].completionRate++;
      }
    }
    
    // Convert to percentages
    for (const category of Object.keys(performance)) {
      const data = performance[category];
      data.completionRate = (data.completionRate / data.totalGoals) * 100;
    }
    
    return performance;
  }
}
