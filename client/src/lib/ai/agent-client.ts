import { processStreamingResponse } from '@/utils/streamingUtils';

export interface AgentRequest {
  userId: string;
  userType: string;
  message: string;
  sessionId: string;
  taskType?: string;
  streaming?: boolean;
  context?: Record<string, any>;
}

export interface AgentResponse {
  id: string;
  content: string;
  agentType: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  insights?: Array<{
    type: 'warning' | 'recommendation' | 'opportunity' | 'risk';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  metadata?: Record<string, any>;
}

export class AgentClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/ai') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    const data = await response.json();
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  }

  async sendStreamingMessage(
    request: AgentRequest,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...request, streaming: true })
    });

    return processStreamingResponse(response, onChunk, request.userType);
  }

  async getSessionHistory(userId: string, sessionId: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/sessions/${userId}/${sessionId}/history`
    );

    if (!response.ok) {
      throw new Error('Failed to get session history');
    }

    const data = await response.json();
    return data.messages || [];
  }

  async clearSession(userId: string, sessionId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/sessions/${userId}/${sessionId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Failed to clear session');
    }
  }

  async getSuggestions(userType: string, context?: Record<string, any>): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userType, context })
    });

    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }

    const data = await response.json();
    return data.suggestions || [];
  }
}

export const agentClient = new AgentClient();