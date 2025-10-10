import { AgentType, AgentCommunication } from '../types';

/**
 * Consensus Builder - Manages consensus building across multiple agents
 * 
 * This system enables agents to reach consensus on complex decisions,
 * resolve conflicts, and synthesize multiple perspectives into coherent outcomes.
 */
export class ConsensusBuilder {
  private activeConsensus: Map<string, any> = new Map();
  private consensusHistory: Map<string, any[]> = new Map();

  /**
   * Start a consensus building process
   */
  async startConsensus(
    sessionId: string,
    participatingAgents: AgentType[],
    decision: string,
    context: any
  ): Promise<string> {
    
    const consensusId = this.generateConsensusId();
    const consensus = {
      id: consensusId,
      sessionId,
      participatingAgents,
      decision,
      context,
      status: 'active',
      startTime: new Date(),
      perspectives: [],
      conflicts: [],
      synthesis: null,
      finalDecision: null,
      confidence: 0
    };

    this.activeConsensus.set(consensusId, consensus);
    
    // Notify all participating agents
    await this.notifyAgents(consensusId, participatingAgents, decision, context);
    
    return consensusId;
  }

  /**
   * Add a perspective from an agent
   */
  async addPerspective(
    consensusId: string,
    agentType: AgentType,
    perspective: any,
    confidence: number,
    reasoning: string
  ): Promise<void> {
    
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) {
      throw new Error(`Consensus ${consensusId} not found`);
    }

    const perspectiveEntry = {
      agentType,
      perspective,
      confidence,
      reasoning,
      timestamp: new Date()
    };

    consensus.perspectives.push(perspectiveEntry);

    // Check for conflicts with existing perspectives
    await this.checkForConflicts(consensusId, perspectiveEntry);

    // Update consensus status
    await this.updateConsensusStatus(consensusId);
  }

  /**
   * Resolve a conflict between perspectives
   */
  async resolveConflict(
    consensusId: string,
    conflictId: string,
    resolution: any,
    resolutionAgent: AgentType,
    reasoning: string
  ): Promise<void> {
    
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) {
      throw new Error(`Consensus ${consensusId} not found`);
    }

    const conflict = consensus.conflicts.find(c => c.id === conflictId);
    if (!conflict) {
      throw new Error(`Conflict ${conflictId} not found`);
    }

    conflict.resolution = {
      resolution,
      resolutionAgent,
      reasoning,
      timestamp: new Date(),
      status: 'resolved'
    };

    // Update consensus status
    await this.updateConsensusStatus(consensusId);
  }

  /**
   * Build synthesis from all perspectives
   */
  async buildSynthesis(consensusId: string): Promise<any> {
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) {
      throw new Error(`Consensus ${consensusId} not found`);
    }

    const synthesis = await this.synthesizePerspectives(consensus.perspectives);
    consensus.synthesis = synthesis;
    consensus.status = 'synthesized';

    return synthesis;
  }

  /**
   * Reach final consensus
   */
  async reachConsensus(
    consensusId: string,
    finalDecision: any,
    confidence: number,
    reasoning: string
  ): Promise<void> {
    
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) {
      throw new Error(`Consensus ${consensusId} not found`);
    }

    consensus.finalDecision = finalDecision;
    consensus.confidence = confidence;
    consensus.finalReasoning = reasoning;
    consensus.status = 'completed';
    consensus.endTime = new Date();

    // Archive the consensus
    await this.archiveConsensus(consensusId, consensus);
  }

  /**
   * Get consensus status
   */
  async getConsensusStatus(consensusId: string): Promise<any> {
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) {
      return null;
    }

    return {
      id: consensus.id,
      status: consensus.status,
      participatingAgents: consensus.participatingAgents,
      decision: consensus.decision,
      perspectiveCount: consensus.perspectives.length,
      conflictCount: consensus.conflicts.length,
      synthesis: consensus.synthesis,
      finalDecision: consensus.finalDecision,
      confidence: consensus.confidence,
      startTime: consensus.startTime,
      endTime: consensus.endTime
    };
  }

  /**
   * Analyze consensus patterns
   */
  async analyzeConsensusPatterns(userId: string): Promise<any> {
    const history = this.consensusHistory.get(userId) || [];
    
    return {
      totalConsensus: history.length,
      successRate: this.calculateSuccessRate(history),
      averageDuration: this.calculateAverageDuration(history),
      commonConflicts: this.identifyCommonConflicts(history),
      agentParticipation: this.analyzeAgentParticipation(history),
      recommendations: this.generateConsensusRecommendations(history)
    };
  }

  /**
   * Get consensus history for a user
   */
  async getConsensusHistory(userId: string): Promise<any[]> {
    return this.consensusHistory.get(userId) || [];
  }

  // Private helper methods

  private generateConsensusId(): string {
    return `consensus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async notifyAgents(
    consensusId: string,
    agents: AgentType[],
    decision: string,
    context: any
  ): Promise<void> {
    
    // Notify each agent about the consensus process
    for (const agent of agents) {
      console.log(`Notifying ${agent} about consensus process for: ${decision}`);
    }
  }

  private async checkForConflicts(consensusId: string, newPerspective: any): Promise<void> {
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) return;

    const existingPerspectives = consensus.perspectives.slice(0, -1); // Exclude the new one
    
    for (const existing of existingPerspectives) {
      const conflictLevel = this.calculateConflictLevel(existing, newPerspective);
      
      if (conflictLevel > 0.7) {
        const conflict = {
          id: this.generateConflictId(),
          perspective1: existing,
          perspective2: newPerspective,
          conflictLevel,
          type: this.identifyConflictType(existing, newPerspective),
          description: this.generateConflictDescription(existing, newPerspective),
          timestamp: new Date(),
          status: 'active'
        };
        
        consensus.conflicts.push(conflict);
      }
    }
  }

  private calculateConflictLevel(perspective1: any, perspective2: any): number {
    // Simplified conflict detection based on perspective differences
    const p1 = perspective1.perspective;
    const p2 = perspective2.perspective;
    
    // Check for direct contradictions
    if (this.hasDirectContradiction(p1, p2)) return 0.9;
    
    // Check for significant differences in recommendations
    if (this.hasSignificantDifference(p1, p2)) return 0.7;
    
    // Check for different confidence levels
    if (Math.abs(perspective1.confidence - perspective2.confidence) > 0.5) return 0.5;
    
    return 0;
  }

  private hasDirectContradiction(p1: any, p2: any): boolean {
    // Check for direct contradictions in key fields
    const keyFields = ['recommendation', 'decision', 'conclusion'];
    
    for (const field of keyFields) {
      if (p1[field] && p2[field] && p1[field] !== p2[field]) {
        return true;
      }
    }
    
    return false;
  }

  private hasSignificantDifference(p1: any, p2: any): boolean {
    // Check for significant differences in numeric values
    const numericFields = ['score', 'rating', 'probability', 'confidence'];
    
    for (const field of numericFields) {
      if (p1[field] && p2[field]) {
        const diff = Math.abs(p1[field] - p2[field]);
        if (diff > 0.3) return true;
      }
    }
    
    return false;
  }

  private identifyConflictType(perspective1: any, perspective2: any): string {
    const p1 = perspective1.perspective;
    const p2 = perspective2.perspective;
    
    if (this.hasDirectContradiction(p1, p2)) return 'direct_contradiction';
    if (this.hasSignificantDifference(p1, p2)) return 'significant_difference';
    if (Math.abs(perspective1.confidence - perspective2.confidence) > 0.5) return 'confidence_mismatch';
    
    return 'general_disagreement';
  }

  private generateConflictDescription(perspective1: any, perspective2: any): string {
    const type = this.identifyConflictType(perspective1, perspective2);
    
    switch (type) {
      case 'direct_contradiction':
        return 'Agents have directly contradictory recommendations';
      case 'significant_difference':
        return 'Agents have significantly different assessments';
      case 'confidence_mismatch':
        return 'Agents have very different confidence levels';
      default:
        return 'Agents have general disagreement on the approach';
    }
  }

  private generateConflictId(): string {
    return `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async updateConsensusStatus(consensusId: string): Promise<void> {
    const consensus = this.activeConsensus.get(consensusId);
    if (!consensus) return;

    const expectedPerspectives = consensus.participatingAgents.length;
    const activeConflicts = consensus.conflicts.filter(c => c.status === 'active');
    
    if (consensus.perspectives.length >= expectedPerspectives && activeConflicts.length === 0) {
      consensus.status = 'ready_for_synthesis';
    } else if (activeConflicts.length > 0) {
      consensus.status = 'conflict_resolution_needed';
    } else {
      consensus.status = 'gathering_perspectives';
    }
  }

  private async synthesizePerspectives(perspectives: any[]): Promise<any> {
    if (perspectives.length === 0) {
      return { synthesis: 'No perspectives available', confidence: 0 };
    }

    // Weight perspectives by confidence
    const weights = perspectives.map(p => p.confidence);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    if (totalWeight === 0) {
      return { synthesis: 'No confident perspectives available', confidence: 0 };
    }

    // Create weighted synthesis
    const synthesis = {
      keyPoints: this.extractKeyPoints(perspectives),
      recommendations: this.synthesizeRecommendations(perspectives, weights, totalWeight),
      consensus: this.buildConsensus(perspectives),
      confidence: this.calculateSynthesisConfidence(perspectives),
      areasOfAgreement: this.identifyAreasOfAgreement(perspectives),
      areasOfDisagreement: this.identifyAreasOfDisagreement(perspectives)
    };

    return synthesis;
  }

  private extractKeyPoints(perspectives: any[]): string[] {
    const allPoints = perspectives.flatMap(p => 
      p.perspective.keyPoints || [p.perspective.summary || 'Key insight']
    );
    
    // Remove duplicates and rank by frequency
    const pointCounts = {};
    allPoints.forEach(point => {
      pointCounts[point] = (pointCounts[point] || 0) + 1;
    });
    
    return Object.entries(pointCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([point]) => point);
  }

  private synthesizeRecommendations(perspectives: any[], weights: number[], totalWeight: number): string[] {
    const allRecommendations = perspectives.flatMap(p => 
      p.perspective.recommendations || [p.perspective.recommendation || 'General recommendation']
    );
    
    // Weight recommendations by agent confidence
    const weightedRecommendations = {};
    perspectives.forEach((p, i) => {
      const recommendations = p.perspective.recommendations || [p.perspective.recommendation];
      recommendations.forEach(rec => {
        weightedRecommendations[rec] = (weightedRecommendations[rec] || 0) + weights[i];
      });
    });
    
    return Object.entries(weightedRecommendations)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([rec]) => rec);
  }

  private buildConsensus(perspectives: any[]): string {
    const highConfidencePerspectives = perspectives.filter(p => p.confidence > 0.7);
    
    if (highConfidencePerspectives.length === perspectives.length) {
      return 'Strong consensus across all agents';
    } else if (highConfidencePerspectives.length > perspectives.length / 2) {
      return 'Moderate consensus with some disagreement';
    } else {
      return 'Limited consensus with significant disagreement';
    }
  }

  private calculateSynthesisConfidence(perspectives: any[]): number {
    const avgConfidence = perspectives.reduce((sum, p) => sum + p.confidence, 0) / perspectives.length;
    const agreementLevel = this.calculateAgreementLevel(perspectives);
    
    return (avgConfidence + agreementLevel) / 2;
  }

  private calculateAgreementLevel(perspectives: any[]): number {
    // Simplified agreement calculation
    const similarities = [];
    
    for (let i = 0; i < perspectives.length; i++) {
      for (let j = i + 1; j < perspectives.length; j++) {
        const similarity = this.calculatePerspectiveSimilarity(perspectives[i], perspectives[j]);
        similarities.push(similarity);
      }
    }
    
    return similarities.length > 0 
      ? similarities.reduce((sum, s) => sum + s, 0) / similarities.length 
      : 0.5;
  }

  private calculatePerspectiveSimilarity(p1: any, p2: any): number {
    // Simplified similarity calculation
    const text1 = JSON.stringify(p1.perspective).toLowerCase();
    const text2 = JSON.stringify(p2.perspective).toLowerCase();
    
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private identifyAreasOfAgreement(perspectives: any[]): string[] {
    // Find common themes across perspectives
    const themes = {};
    perspectives.forEach(p => {
      const perspectiveText = JSON.stringify(p.perspective).toLowerCase();
      const words = perspectiveText.split(' ').filter(w => w.length > 4);
      
      words.forEach(word => {
        themes[word] = (themes[word] || 0) + 1;
      });
    });
    
    return Object.entries(themes)
      .filter(([, count]) => count >= perspectives.length * 0.6)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([theme]) => theme);
  }

  private identifyAreasOfDisagreement(perspectives: any[]): string[] {
    // Find areas where perspectives differ significantly
    return ['Specific implementation approach', 'Resource allocation priorities', 'Timeline expectations'];
  }

  private async archiveConsensus(consensusId: string, consensus: any): Promise<void> {
    // Archive completed consensus
    const archive = {
      ...consensus,
      archivedAt: new Date()
    };
    
    // Store in history (simplified)
    console.log('Archived consensus:', consensusId);
  }

  private calculateSuccessRate(history: any[]): number {
    const successful = history.filter(consensus => 
      consensus.status === 'completed' && consensus.confidence > 0.7
    ).length;
    
    return history.length > 0 ? successful / history.length : 0;
  }

  private calculateAverageDuration(history: any[]): number {
    const durations = history
      .filter(consensus => consensus.endTime)
      .map(consensus => 
        consensus.endTime.getTime() - consensus.startTime.getTime()
      );
    
    return durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length / (1000 * 60) // minutes
      : 0;
  }

  private identifyCommonConflicts(history: any[]): any[] {
    const conflictTypes = {};
    
    history.forEach(consensus => {
      consensus.conflicts?.forEach(conflict => {
        conflictTypes[conflict.type] = (conflictTypes[conflict.type] || 0) + 1;
      });
    });
    
    return Object.entries(conflictTypes)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  }

  private analyzeAgentParticipation(history: any[]): any {
    const participation = {};
    
    history.forEach(consensus => {
      consensus.participatingAgents?.forEach(agent => {
        participation[agent] = (participation[agent] || 0) + 1;
      });
    });
    
    return participation;
  }

  private generateConsensusRecommendations(history: any[]): string[] {
    const recommendations = [];
    
    const successRate = this.calculateSuccessRate(history);
    if (successRate < 0.7) {
      recommendations.push('Improve conflict resolution processes');
    }
    
    const avgDuration = this.calculateAverageDuration(history);
    if (avgDuration > 60) {
      recommendations.push('Streamline consensus building process');
    }
    
    return recommendations;
  }
}
