import { Message, MemoryEntry, AgentConfig } from '../types';

export class MemoryStore {
  private conversations: Map<string, Message[]>;
  private longTermMemory: Map<string, MemoryEntry[]>;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.conversations = new Map();
    this.longTermMemory = new Map();
  }

  async storeConversation(
    userId: string,
    sessionId: string,
    message: Message
  ): Promise<void> {
    const key = `${userId}:${sessionId}`;
    const messages = this.conversations.get(key) || [];
    messages.push(message);
    this.conversations.set(key, messages);

    // Store in long-term memory if important
    if (this.isImportantMessage(message)) {
      await this.storeInLongTermMemory(userId, sessionId, message);
    }
  }

  async getConversationHistory(
    userId: string,
    sessionId: string,
    limit: number = 50
  ): Promise<Message[]> {
    const key = `${userId}:${sessionId}`;
    const messages = this.conversations.get(key) || [];
    return messages.slice(-limit);
  }

  async clearSession(userId: string, sessionId: string): Promise<void> {
    const key = `${userId}:${sessionId}`;
    this.conversations.delete(key);
  }

  async storeInLongTermMemory(
    userId: string,
    sessionId: string,
    message: Message
  ): Promise<void> {
    const key = userId;
    const memories = this.longTermMemory.get(key) || [];

    const memoryEntry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      userId,
      sessionId,
      timestamp: new Date(),
      type: 'conversation',
      content: message.content,
      metadata: message.metadata
    };

    memories.push(memoryEntry);
    this.longTermMemory.set(key, memories);
  }

  async getRelevantMemory(
    userId: string,
    query?: string,
    limit: number = 10
  ): Promise<MemoryEntry[]> {
    const memories = this.longTermMemory.get(userId) || [];
    
    // Simple recency-based retrieval
    // In production, would use vector similarity search
    return memories
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async storeFact(userId: string, fact: string, metadata?: any): Promise<void> {
    const key = userId;
    const memories = this.longTermMemory.get(key) || [];

    const memoryEntry: MemoryEntry = {
      id: `fact-${Date.now()}`,
      userId,
      sessionId: 'persistent',
      timestamp: new Date(),
      type: 'fact',
      content: fact,
      metadata
    };

    memories.push(memoryEntry);
    this.longTermMemory.set(key, memories);
  }

  async storePreference(userId: string, preference: string, metadata?: any): Promise<void> {
    const key = userId;
    const memories = this.longTermMemory.get(key) || [];

    // Remove old preference of same type if exists
    const filteredMemories = memories.filter(m => 
      !(m.type === 'preference' && m.metadata?.type === metadata?.type)
    );

    const memoryEntry: MemoryEntry = {
      id: `pref-${Date.now()}`,
      userId,
      sessionId: 'persistent',
      timestamp: new Date(),
      type: 'preference',
      content: preference,
      metadata
    };

    filteredMemories.push(memoryEntry);
    this.longTermMemory.set(key, filteredMemories);
  }

  private isImportantMessage(message: Message): boolean {
    // Determine if a message should be stored in long-term memory
    const importantKeywords = [
      'prefer', 'always', 'never', 'remember',
      'goal', 'target', 'objective', 'strategy'
    ];

    return importantKeywords.some(keyword => 
      message.content.toLowerCase().includes(keyword)
    );
  }

  async getStats(userId: string): Promise<{
    totalConversations: number;
    totalMessages: number;
    longTermMemories: number;
  }> {
    let totalMessages = 0;
    
    this.conversations.forEach((messages, key) => {
      if (key.startsWith(userId)) {
        totalMessages += messages.length;
      }
    });

    const longTermMemories = this.longTermMemory.get(userId)?.length || 0;

    return {
      totalConversations: Array.from(this.conversations.keys())
        .filter(k => k.startsWith(userId)).length,
      totalMessages,
      longTermMemories
    };
  }
}