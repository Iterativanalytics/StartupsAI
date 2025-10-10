import { AgentRequest, AgentResponse } from "../core/agent-engine";

interface ConversationEntry {
  id: string;
  userId: string;
  timestamp: Date;
  request: AgentRequest;
  response: AgentResponse;
  metadata?: any;
}

export class MemoryStore {
  private conversations: Map<string, ConversationEntry[]> = new Map();
  
  async getRelevantMemory(userId: string): Promise<any> {
    const userConversations = this.conversations.get(userId) || [];
    
    // Return last 5 relevant interactions
    return userConversations
      .slice(-5)
      .map(entry => ({
        request: entry.request.message,
        response: entry.response.content,
        timestamp: entry.timestamp
      }));
  }
  
  async storeInteraction(request: AgentRequest, response: AgentResponse): Promise<void> {
    const entry: ConversationEntry = {
      id: Date.now().toString(),
      userId: request.userId,
      timestamp: new Date(),
      request,
      response
    };
    
    const userConversations = this.conversations.get(request.userId) || [];
    userConversations.push(entry);
    
    // Keep only last 100 conversations per user
    if (userConversations.length > 100) {
      userConversations.splice(0, userConversations.length - 100);
    }
    
    this.conversations.set(request.userId, userConversations);
  }
  
  async getConversationHistory(userId: string, limit: number = 20): Promise<ConversationEntry[]> {
    const conversations = this.conversations.get(userId) || [];
    return conversations.slice(-limit);
  }
  
  async clearUserMemory(userId: string): Promise<void> {
    this.conversations.delete(userId);
  }
}
