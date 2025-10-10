
export interface Commitment {
  id: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  completedDate?: Date;
  notes?: string;
}

export class CommitmentMonitor {
  private commitments: Map<string, Commitment[]> = new Map();
  
  async trackCommitment(userId: string, commitment: Omit<Commitment, 'id' | 'status'>): Promise<Commitment> {
    const userCommitments = this.commitments.get(userId) || [];
    
    const newCommitment: Commitment = {
      ...commitment,
      id: `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };
    
    userCommitments.push(newCommitment);
    this.commitments.set(userId, userCommitments);
    
    return newCommitment;
  }
  
  async getRecentCommitments(userId: string, days: number = 30): Promise<Commitment[]> {
    const userCommitments = this.commitments.get(userId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return userCommitments.filter(c => c.dueDate >= cutoffDate);
  }
  
  async updateCommitmentStatus(
    userId: string, 
    commitmentId: string, 
    status: Commitment['status'],
    notes?: string
  ): Promise<void> {
    const userCommitments = this.commitments.get(userId) || [];
    const commitment = userCommitments.find(c => c.id === commitmentId);
    
    if (commitment) {
      commitment.status = status;
      if (status === 'completed') {
        commitment.completedDate = new Date();
      }
      if (notes) {
        commitment.notes = notes;
      }
    }
  }
  
  async checkOverdueCommitments(userId: string): Promise<Commitment[]> {
    const userCommitments = this.commitments.get(userId) || [];
    const now = new Date();
    
    const overdue = userCommitments.filter(c => 
      c.status !== 'completed' && 
      c.status !== 'cancelled' && 
      c.dueDate < now
    );
    
    overdue.forEach(c => {
      if (c.status !== 'overdue') {
        c.status = 'overdue';
      }
    });
    
    return overdue;
  }
  
  async getCompletionRate(userId: string, days: number = 30): Promise<{
    total: number;
    completed: number;
    rate: number;
    trend: 'improving' | 'stable' | 'declining';
  }> {
    const commitments = await this.getRecentCommitments(userId, days);
    const completed = commitments.filter(c => c.status === 'completed').length;
    const total = commitments.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    const previousCommitments = await this.getRecentCommitments(userId, days * 2);
    const previousCompleted = previousCommitments
      .filter(c => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return c.status === 'completed' && c.dueDate < cutoff;
      }).length;
    
    const previousRate = previousCommitments.length > 0 
      ? (previousCompleted / previousCommitments.length) * 100 
      : rate;
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (rate > previousRate + 10) trend = 'improving';
    if (rate < previousRate - 10) trend = 'declining';
    
    return { total, completed, rate, trend };
  }
  
  async identifyPatterns(userId: string): Promise<{
    mostCommonCategory: string;
    averageCompletionTime: number;
    typicalDelayDays: number;
    excusePatterns: string[];
  }> {
    const commitments = this.commitments.get(userId) || [];
    
    const categories = commitments.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';
    
    const completed = commitments.filter(c => c.status === 'completed' && c.completedDate);
    const avgCompletionTime = completed.length > 0
      ? completed.reduce((sum, c) => {
          const diff = c.completedDate!.getTime() - c.dueDate.getTime();
          return sum + Math.abs(diff) / (1000 * 60 * 60 * 24);
        }, 0) / completed.length
      : 0;
    
    const overdue = commitments.filter(c => c.status === 'overdue');
    const typicalDelayDays = overdue.length > 0
      ? overdue.reduce((sum, c) => {
          const diff = new Date().getTime() - c.dueDate.getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        }, 0) / overdue.length
      : 0;
    
    const excusePatterns = [
      'Waiting on others - may need to take more ownership',
      'Scope creep - commitments expanding beyond original intent',
      'Overcommitting - taking on too much at once'
    ];
    
    return {
      mostCommonCategory,
      averageCompletionTime: Math.round(avgCompletionTime),
      typicalDelayDays: Math.round(typicalDelayDays),
      excusePatterns
    };
  }
}
