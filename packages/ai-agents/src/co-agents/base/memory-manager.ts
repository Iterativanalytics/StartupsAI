import { AgentConfig, MemoryEntry } from '../../types';

/**
 * Memory Manager - Advanced memory system for Co-Agents
 * 
 * This system manages both short-term conversation memory and long-term
 * relationship memory to enable deep, contextual partnerships.
 */
export class MemoryManager {
  private config: AgentConfig;
  private conversationMemory: Map<string, MemoryEntry[]> = new Map();
  private longTermMemory: Map<string, MemoryEntry[]> = new Map();
  private semanticMemory: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Store conversation memory
   */
  async storeConversationMemory(
    userId: string,
    sessionId: string,
    content: string,
    type: 'conversation' | 'fact' | 'preference' | 'decision',
    metadata?: any
  ): Promise<void> {
    
    const memoryEntry: MemoryEntry = {
      id: this.generateMemoryId(),
      userId,
      sessionId,
      timestamp: new Date(),
      type,
      content,
      metadata: metadata || {}
    };

    // Add to conversation memory
    const userMemory = this.conversationMemory.get(userId) || [];
    userMemory.push(memoryEntry);
    
    // Keep only recent conversation memory (last 100 entries)
    if (userMemory.length > 100) {
      this.conversationMemory.set(userId, userMemory.slice(-100));
    } else {
      this.conversationMemory.set(userId, userMemory);
    }

    // Promote important memories to long-term storage
    if (this.shouldPromoteToLongTerm(memoryEntry)) {
      await this.promoteToLongTermMemory(memoryEntry);
    }
  }

  /**
   * Retrieve relevant memories for context
   */
  async getRelevantMemories(
    userId: string,
    query: string,
    maxMemories: number = 10
  ): Promise<MemoryEntry[]> {
    
    const conversationMemories = this.conversationMemory.get(userId) || [];
    const longTermMemories = this.longTermMemory.get(userId) || [];
    
    // Combine and rank memories by relevance
    const allMemories = [...conversationMemories, ...longTermMemories];
    const rankedMemories = await this.rankMemoriesByRelevance(allMemories, query);
    
    return rankedMemories.slice(0, maxMemories);
  }

  /**
   * Store long-term relationship insights
   */
  async storeLongTermMemory(
    userId: string,
    content: string,
    type: 'fact' | 'preference' | 'decision' | 'pattern',
    importance: 'low' | 'medium' | 'high',
    metadata?: any
  ): Promise<void> {
    
    const memoryEntry: MemoryEntry = {
      id: this.generateMemoryId(),
      userId,
      sessionId: 'long_term',
      timestamp: new Date(),
      type,
      content,
      metadata: {
        ...metadata,
        importance,
        accessCount: 0,
        lastAccessed: new Date()
      }
    };

    const userLongTermMemory = this.longTermMemory.get(userId) || [];
    userLongTermMemory.push(memoryEntry);
    
    // Sort by importance and recency
    userLongTermMemory.sort((a, b) => {
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      const aImportance = importanceOrder[a.metadata?.importance] || 1;
      const bImportance = importanceOrder[b.metadata?.importance] || 1;
      
      if (aImportance !== bImportance) {
        return bImportance - aImportance;
      }
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    
    // Keep only most important memories (limit to 500)
    if (userLongTermMemory.length > 500) {
      this.longTermMemory.set(userId, userLongTermMemory.slice(0, 500));
    } else {
      this.longTermMemory.set(userId, userLongTermMemory);
    }
  }

  /**
   * Get user preferences from memory
   */
  async getUserPreferences(userId: string): Promise<any> {
    const longTermMemories = this.longTermMemory.get(userId) || [];
    const preferenceMemories = longTermMemories.filter(m => m.type === 'preference');
    
    const preferences = {
      communicationStyle: 'balanced',
      feedbackStyle: 'direct',
      meetingPreference: 'structured',
      challengeLevel: 'moderate',
      topics: [],
      avoidTopics: [],
      preferredTimes: [],
      workingStyle: 'collaborative'
    };

    // Extract preferences from memory
    preferenceMemories.forEach(memory => {
      try {
        const pref = JSON.parse(memory.content);
        Object.assign(preferences, pref);
      } catch {
        // Handle text-based preferences
        this.extractTextPreferences(memory.content, preferences);
      }
    });

    return preferences;
  }

  /**
   * Get conversation patterns and insights
   */
  async getConversationPatterns(userId: string): Promise<any> {
    const allMemories = [
      ...(this.conversationMemory.get(userId) || []),
      ...(this.longTermMemory.get(userId) || [])
    ];

    return {
      commonTopics: this.extractCommonTopics(allMemories),
      conversationStyle: this.analyzeConversationStyle(allMemories),
      responsePatterns: this.analyzeResponsePatterns(allMemories),
      timePatterns: this.analyzeTimePatterns(allMemories),
      emotionalPatterns: this.analyzeEmotionalPatterns(allMemories)
    };
  }

  /**
   * Store semantic memory (concepts, relationships, insights)
   */
  async storeSemanticMemory(
    userId: string,
    concept: string,
    relationships: any[],
    insights: any[]
  ): Promise<void> {
    
    const existingConcepts = this.semanticMemory.get(userId) || {};
    
    existingConcepts[concept] = {
      relationships,
      insights,
      lastUpdated: new Date(),
      accessCount: (existingConcepts[concept]?.accessCount || 0) + 1
    };

    this.semanticMemory.set(userId, existingConcepts);
  }

  /**
   * Retrieve semantic memory
   */
  async getSemanticMemory(userId: string, concept?: string): Promise<any> {
    const userSemanticMemory = this.semanticMemory.get(userId) || {};
    
    if (concept) {
      return userSemanticMemory[concept] || null;
    }
    
    return userSemanticMemory;
  }

  /**
   * Consolidate memories (cleanup and optimization)
   */
  async consolidateMemories(userId: string): Promise<void> {
    await this.consolidateConversationMemory(userId);
    await this.consolidateLongTermMemory(userId);
    await this.updateSemanticMemory(userId);
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats(userId: string): Promise<any> {
    const conversationMemories = this.conversationMemory.get(userId) || [];
    const longTermMemories = this.longTermMemory.get(userId) || [];
    const semanticMemories = this.semanticMemory.get(userId) || {};

    return {
      conversationMemoryCount: conversationMemories.length,
      longTermMemoryCount: longTermMemories.length,
      semanticConceptCount: Object.keys(semanticMemories).length,
      oldestMemory: this.getOldestMemory(userId),
      mostAccessedMemories: this.getMostAccessedMemories(userId),
      memoryTypes: this.getMemoryTypeDistribution(userId)
    };
  }

  // Private helper methods

  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldPromoteToLongTerm(memory: MemoryEntry): boolean {
    // Promote based on type and content importance
    if (memory.type === 'preference' || memory.type === 'decision') {
      return true;
    }

    // Promote if contains important keywords
    const importantKeywords = [
      'strategy', 'goal', 'preference', 'important', 'remember', 
      'always', 'never', 'hate', 'love', 'critical'
    ];

    return importantKeywords.some(keyword => 
      memory.content.toLowerCase().includes(keyword)
    );
  }

  private async promoteToLongTermMemory(memory: MemoryEntry): Promise<void> {
    const importance = this.assessMemoryImportance(memory);
    
    await this.storeLongTermMemory(
      memory.userId,
      memory.content,
      memory.type,
      importance,
      memory.metadata
    );
  }

  private assessMemoryImportance(memory: MemoryEntry): 'low' | 'medium' | 'high' {
    if (memory.type === 'preference' || memory.type === 'decision') {
      return 'high';
    }

    const criticalKeywords = ['critical', 'important', 'never', 'always'];
    if (criticalKeywords.some(kw => memory.content.toLowerCase().includes(kw))) {
      return 'high';
    }

    const mediumKeywords = ['strategy', 'goal', 'plan', 'remember'];
    if (mediumKeywords.some(kw => memory.content.toLowerCase().includes(kw))) {
      return 'medium';
    }

    return 'low';
  }

  private async rankMemoriesByRelevance(
    memories: MemoryEntry[],
    query: string
  ): Promise<MemoryEntry[]> {
    
    // Simple relevance scoring based on keyword matching
    const queryWords = query.toLowerCase().split(' ');
    
    return memories
      .map(memory => ({
        memory,
        relevanceScore: this.calculateRelevanceScore(memory, queryWords)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(item => item.memory);
  }

  private calculateRelevanceScore(memory: MemoryEntry, queryWords: string[]): number {
    const content = memory.content.toLowerCase();
    let score = 0;

    // Exact phrase matches
    queryWords.forEach(word => {
      if (content.includes(word)) {
        score += 2;
      }
    });

    // Type relevance
    if (memory.type === 'preference') score += 3;
    if (memory.type === 'decision') score += 2;

    // Recency bonus
    const daysSinceCreated = (Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 7) score += 1;

    // Access frequency bonus
    const accessCount = memory.metadata?.accessCount || 0;
    score += Math.min(accessCount * 0.1, 1);

    return score;
  }

  private extractTextPreferences(content: string, preferences: any): void {
    // Simple text-based preference extraction
    if (content.includes('prefer direct')) preferences.feedbackStyle = 'direct';
    if (content.includes('prefer gentle')) preferences.feedbackStyle = 'gentle';
    if (content.includes('challenge me')) preferences.challengeLevel = 'high';
    if (content.includes('be supportive')) preferences.challengeLevel = 'low';
  }

  private extractCommonTopics(memories: MemoryEntry[]): string[] {
    const topicCounts = {};
    
    memories.forEach(memory => {
      const words = memory.content.toLowerCase().split(' ');
      const topics = words.filter(word => word.length > 4); // Simple topic extraction
      
      topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([topic]) => topic);
  }

  private analyzeConversationStyle(memories: MemoryEntry[]): any {
    const conversationMemories = memories.filter(m => m.type === 'conversation');
    
    // Analyze patterns in conversation style
    return {
      averageLength: this.calculateAverageLength(conversationMemories),
      questionFrequency: this.calculateQuestionFrequency(conversationMemories),
      emotionalTone: this.analyzeEmotionalTone(conversationMemories)
    };
  }

  private analyzeResponsePatterns(memories: MemoryEntry[]): any {
    // Analyze how user typically responds
    return {
      responseTime: 'varies',
      detailLevel: 'moderate',
      followUpFrequency: 'medium'
    };
  }

  private analyzeTimePatterns(memories: MemoryEntry[]): any {
    const hours = memories.map(m => m.timestamp.getHours());
    const days = memories.map(m => m.timestamp.getDay());

    return {
      preferredHours: this.getMostCommon(hours),
      preferredDays: this.getMostCommon(days),
      activityPeaks: 'morning and evening'
    };
  }

  private analyzeEmotionalPatterns(memories: MemoryEntry[]): any {
    // Simple emotional pattern analysis
    return {
      overallTone: 'professional',
      stressIndicators: [],
      enthusiasmTopics: []
    };
  }

  private async consolidateConversationMemory(userId: string): Promise<void> {
    // Remove duplicates and compress old memories
    const memories = this.conversationMemory.get(userId) || [];
    const unique = this.removeDuplicateMemories(memories);
    this.conversationMemory.set(userId, unique);
  }

  private async consolidateLongTermMemory(userId: string): Promise<void> {
    // Remove outdated or superseded memories
    const memories = this.longTermMemory.get(userId) || [];
    const consolidated = this.removeSupersededMemories(memories);
    this.longTermMemory.set(userId, consolidated);
  }

  private async updateSemanticMemory(userId: string): Promise<void> {
    // Update relationships and insights based on new memories
    // This would be more sophisticated in a full implementation
  }

  // Additional helper methods with simplified implementations
  private calculateAverageLength(memories: MemoryEntry[]): number {
    if (memories.length === 0) return 0;
    const totalLength = memories.reduce((sum, m) => sum + m.content.length, 0);
    return totalLength / memories.length;
  }

  private calculateQuestionFrequency(memories: MemoryEntry[]): number {
    const questions = memories.filter(m => m.content.includes('?'));
    return memories.length > 0 ? questions.length / memories.length : 0;
  }

  private analyzeEmotionalTone(memories: MemoryEntry[]): string {
    // Simplified emotional analysis
    return 'professional';
  }

  private getMostCommon(items: number[]): number[] {
    const counts = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([item]) => parseInt(item));
  }

  private removeDuplicateMemories(memories: MemoryEntry[]): MemoryEntry[] {
    const seen = new Set();
    return memories.filter(memory => {
      const key = `${memory.content}_${memory.type}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private removeSupersededMemories(memories: MemoryEntry[]): MemoryEntry[] {
    // Remove memories that have been superseded by newer ones
    // This is a simplified implementation
    return memories;
  }

  private getOldestMemory(userId: string): Date | null {
    const allMemories = [
      ...(this.conversationMemory.get(userId) || []),
      ...(this.longTermMemory.get(userId) || [])
    ];
    
    if (allMemories.length === 0) return null;
    
    return allMemories.reduce((oldest, memory) => 
      memory.timestamp < oldest ? memory.timestamp : oldest,
      allMemories[0].timestamp
    );
  }

  private getMostAccessedMemories(userId: string): MemoryEntry[] {
    const longTermMemories = this.longTermMemory.get(userId) || [];
    
    return longTermMemories
      .filter(m => m.metadata?.accessCount > 0)
      .sort((a, b) => (b.metadata?.accessCount || 0) - (a.metadata?.accessCount || 0))
      .slice(0, 5);
  }

  private getMemoryTypeDistribution(userId: string): any {
    const allMemories = [
      ...(this.conversationMemory.get(userId) || []),
      ...(this.longTermMemory.get(userId) || [])
    ];

    const distribution = {
      conversation: 0,
      fact: 0,
      preference: 0,
      decision: 0
    };

    allMemories.forEach(memory => {
      distribution[memory.type]++;
    });

    return distribution;
  }
}
