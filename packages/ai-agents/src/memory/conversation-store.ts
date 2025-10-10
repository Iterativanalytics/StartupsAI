import { Message } from '../types';

export class ConversationStore {
  private redis?: any; // Redis client would be injected

  async save(userId: string, sessionId: string, messages: Message[]): Promise<void> {
    // In production, this would save to Redis or database
    const key = `conversation:${userId}:${sessionId}`;
    
    if (this.redis) {
      await this.redis.set(key, JSON.stringify(messages), 'EX', 86400); // 24 hour expiry
    }
  }

  async load(userId: string, sessionId: string): Promise<Message[]> {
    const key = `conversation:${userId}:${sessionId}`;
    
    if (this.redis) {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : [];
    }

    return [];
  }

  async delete(userId: string, sessionId: string): Promise<void> {
    const key = `conversation:${userId}:${sessionId}`;
    
    if (this.redis) {
      await this.redis.del(key);
    }
  }

  async listSessions(userId: string): Promise<string[]> {
    if (this.redis) {
      const pattern = `conversation:${userId}:*`;
      const keys = await this.redis.keys(pattern);
      return keys.map((k: string) => k.split(':')[2]);
    }

    return [];
  }
}