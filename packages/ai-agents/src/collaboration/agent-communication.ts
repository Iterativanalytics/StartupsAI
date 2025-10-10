import { AgentType, AgentCommunication, UserContext } from '../types';

/**
 * Agent Communication - Manages inter-agent communication and collaboration
 * 
 * This system enables sophisticated multi-agent workflows where agents can
 * communicate, share context, and collaborate on complex tasks.
 */
export class AgentCommunication {
  private messageQueue: Map<string, AgentCommunication[]> = new Map();
  private activeConversations: Map<string, any> = new Map();
  private collaborationHistory: Map<string, any[]> = new Map();

  /**
   * Send a message from one agent to another
   */
  async sendMessage(
    fromAgent: AgentType,
    toAgent: AgentType,
    messageType: 'delegation' | 'context_share' | 'result_handoff' | 'collaboration',
    payload: any,
    priority: 'low' | 'medium' | 'high' = 'medium',
    userId?: string
  ): Promise<string> {
    
    const messageId = this.generateMessageId();
    const message: AgentCommunication = {
      fromAgent,
      toAgent,
      messageType,
      payload,
      priority,
      timestamp: new Date()
    };

    // Store message in queue
    const queueKey = this.getQueueKey(toAgent, userId);
    const queue = this.messageQueue.get(queueKey) || [];
    queue.push(message);
    this.messageQueue.set(queueKey, queue);

    // Log collaboration
    if (userId) {
      await this.logCollaboration(userId, message);
    }

    return messageId;
  }

  /**
   * Retrieve messages for a specific agent
   */
  async getMessages(
    agentType: AgentType,
    userId?: string,
    messageType?: string
  ): Promise<AgentCommunication[]> {
    
    const queueKey = this.getQueueKey(agentType, userId);
    const queue = this.messageQueue.get(queueKey) || [];
    
    // Filter by message type if specified
    const filteredMessages = messageType 
      ? queue.filter(msg => msg.messageType === messageType)
      : queue;
    
    // Sort by priority and timestamp
    return filteredMessages.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  /**
   * Start a collaborative session between multiple agents
   */
  async startCollaboration(
    sessionId: string,
    participatingAgents: AgentType[],
    task: string,
    context: UserContext
  ): Promise<string> {
    
    const collaboration = {
      sessionId,
      participatingAgents,
      task,
      context,
      status: 'active',
      startTime: new Date(),
      messages: [],
      results: {},
      consensus: null
    };

    this.activeConversations.set(sessionId, collaboration);
    
    // Notify all participating agents
    for (const agent of participatingAgents) {
      await this.sendMessage(
        AgentType.PLATFORM_ORCHESTRATOR,
        agent,
        'collaboration',
        {
          sessionId,
          task,
          participatingAgents,
          context
        },
        'high',
        context.userId
      );
    }

    return sessionId;
  }

  /**
   * Add a message to an active collaboration
   */
  async addToCollaboration(
    sessionId: string,
    fromAgent: AgentType,
    content: any,
    messageType: 'contribution' | 'question' | 'consensus' | 'disagreement'
  ): Promise<void> {
    
    const collaboration = this.activeConversations.get(sessionId);
    if (!collaboration) {
      throw new Error(`Collaboration session ${sessionId} not found`);
    }

    const message = {
      fromAgent,
      content,
      messageType,
      timestamp: new Date()
    };

    collaboration.messages.push(message);

    // Check for consensus or completion
    await this.checkCollaborationStatus(sessionId);
  }

  /**
   * Get collaboration status and results
   */
  async getCollaborationStatus(sessionId: string): Promise<any> {
    const collaboration = this.activeConversations.get(sessionId);
    if (!collaboration) {
      return null;
    }

    return {
      sessionId: collaboration.sessionId,
      status: collaboration.status,
      participatingAgents: collaboration.participatingAgents,
      task: collaboration.task,
      startTime: collaboration.startTime,
      messageCount: collaboration.messages.length,
      consensus: collaboration.consensus,
      results: collaboration.results
    };
  }

  /**
   * End a collaboration session
   */
  async endCollaboration(
    sessionId: string,
    finalResults?: any,
    consensus?: any
  ): Promise<void> {
    
    const collaboration = this.activeConversations.get(sessionId);
    if (!collaboration) {
      return;
    }

    collaboration.status = 'completed';
    collaboration.endTime = new Date();
    collaboration.results = finalResults || collaboration.results;
    collaboration.consensus = consensus || collaboration.consensus;

    // Archive the collaboration
    await this.archiveCollaboration(sessionId, collaboration);
    
    this.activeConversations.delete(sessionId);
  }

  /**
   * Handle delegation between agents
   */
  async handleDelegation(
    fromAgent: AgentType,
    toAgent: AgentType,
    task: string,
    context: any,
    userId: string
  ): Promise<string> {
    
    const delegationId = this.generateDelegationId();
    
    await this.sendMessage(
      fromAgent,
      toAgent,
      'delegation',
      {
        delegationId,
        task,
        context,
        requirements: this.extractRequirements(task),
        deadline: this.calculateDeadline(task),
        expectedFormat: this.determineExpectedFormat(task)
      },
      'high',
      userId
    );

    return delegationId;
  }

  /**
   * Handle result handoff between agents
   */
  async handleResultHandoff(
    fromAgent: AgentType,
    toAgent: AgentType,
    delegationId: string,
    results: any,
    userId: string
  ): Promise<void> {
    
    await this.sendMessage(
      fromAgent,
      toAgent,
      'result_handoff',
      {
        delegationId,
        results,
        summary: this.generateResultSummary(results),
        confidence: this.assessResultConfidence(results),
        recommendations: this.extractRecommendations(results)
      },
      'high',
      userId
    );
  }

  /**
   * Share context between agents
   */
  async shareContext(
    fromAgent: AgentType,
    toAgent: AgentType,
    context: any,
    relevance: 'high' | 'medium' | 'low',
    userId: string
  ): Promise<void> {
    
    await this.sendMessage(
      fromAgent,
      toAgent,
      'context_share',
      {
        context,
        relevance,
        timestamp: new Date(),
        source: fromAgent
      },
      relevance === 'high' ? 'high' : 'medium',
      userId
    );
  }

  /**
   * Get collaboration history for a user
   */
  async getCollaborationHistory(userId: string): Promise<any[]> {
    return this.collaborationHistory.get(userId) || [];
  }

  /**
   * Analyze collaboration patterns
   */
  async analyzeCollaborationPatterns(userId: string): Promise<any> {
    const history = await this.getCollaborationHistory(userId);
    
    return {
      totalCollaborations: history.length,
      mostActiveAgents: this.getMostActiveAgents(history),
      commonTasks: this.getCommonTasks(history),
      successRate: this.calculateSuccessRate(history),
      averageDuration: this.calculateAverageDuration(history),
      recommendations: this.generateCollaborationRecommendations(history)
    };
  }

  // Private helper methods

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDelegationId(): string {
    return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getQueueKey(agentType: AgentType, userId?: string): string {
    return userId ? `${agentType}_${userId}` : agentType;
  }

  private async logCollaboration(userId: string, message: AgentCommunication): Promise<void> {
    const history = this.collaborationHistory.get(userId) || [];
    history.push({
      message,
      timestamp: new Date()
    });
    
    // Keep only last 100 collaborations
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.collaborationHistory.set(userId, history);
  }

  private async checkCollaborationStatus(sessionId: string): Promise<void> {
    const collaboration = this.activeConversations.get(sessionId);
    if (!collaboration) return;

    const messages = collaboration.messages;
    const agentCount = collaboration.participatingAgents.length;
    
    // Check for consensus
    const consensusMessages = messages.filter(m => m.messageType === 'consensus');
    if (consensusMessages.length >= agentCount * 0.6) {
      collaboration.consensus = this.buildConsensus(consensusMessages);
      collaboration.status = 'consensus_reached';
    }
    
    // Check for completion
    const contributionMessages = messages.filter(m => m.messageType === 'contribution');
    if (contributionMessages.length >= agentCount) {
      collaboration.status = 'ready_for_synthesis';
    }
  }

  private buildConsensus(messages: any[]): any {
    // Simplified consensus building
    const consensus = {
      agreement: true,
      confidence: 0.8,
      keyPoints: messages.map(m => m.content).slice(0, 5),
      timestamp: new Date()
    };
    
    return consensus;
  }

  private async archiveCollaboration(sessionId: string, collaboration: any): Promise<void> {
    // Archive completed collaboration
    const archive = {
      sessionId,
      ...collaboration,
      archivedAt: new Date()
    };
    
    // Store in persistent storage (simplified)
    console.log('Archived collaboration:', sessionId);
  }

  private extractRequirements(task: string): any {
    // Extract requirements from task description
    return {
      accuracy: 'high',
      format: 'structured',
      includeSources: true,
      deadline: this.calculateDeadline(task)
    };
  }

  private calculateDeadline(task: string): Date {
    const now = new Date();
    const urgency = this.assessUrgency(task);
    
    switch (urgency) {
      case 'high':
        return new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
      case 'medium':
        return new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    }
  }

  private assessUrgency(task: string): string {
    if (/urgent|asap|critical|immediate/i.test(task)) return 'high';
    if (/soon|timeline|schedule/i.test(task)) return 'medium';
    return 'low';
  }

  private determineExpectedFormat(task: string): string {
    if (/report|analysis|summary/i.test(task)) return 'detailed_report';
    if (/chart|graph|visualization/i.test(task)) return 'visual';
    if (/list|inventory|catalog/i.test(task)) return 'structured_list';
    return 'structured_response';
  }

  private generateResultSummary(results: any): string {
    return results.summary || 'Analysis completed successfully';
  }

  private assessResultConfidence(results: any): number {
    return results.confidence || 0.8;
  }

  private extractRecommendations(results: any): string[] {
    return results.recommendations?.map((r: any) => r.description || r) || [];
  }

  private getMostActiveAgents(history: any[]): any[] {
    const agentCounts = {};
    
    history.forEach(entry => {
      const agent = entry.message.fromAgent;
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;
    });
    
    return Object.entries(agentCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([agent, count]) => ({ agent, count }));
  }

  private getCommonTasks(history: any[]): string[] {
    const taskCounts = {};
    
    history.forEach(entry => {
      const task = entry.message.payload?.task || 'general';
      taskCounts[task] = (taskCounts[task] || 0) + 1;
    });
    
    return Object.entries(taskCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([task]) => task);
  }

  private calculateSuccessRate(history: any[]): number {
    const successful = history.filter(entry => 
      entry.message.messageType === 'result_handoff' && 
      entry.message.payload?.confidence > 0.7
    ).length;
    
    return history.length > 0 ? successful / history.length : 0;
  }

  private calculateAverageDuration(history: any[]): number {
    // Simplified duration calculation
    return 45; // minutes
  }

  private generateCollaborationRecommendations(history: any[]): string[] {
    const recommendations = [];
    
    if (history.length < 5) {
      recommendations.push('Increase multi-agent collaboration for complex tasks');
    }
    
    const successRate = this.calculateSuccessRate(history);
    if (successRate < 0.7) {
      recommendations.push('Improve agent coordination and communication');
    }
    
    return recommendations;
  }
}
