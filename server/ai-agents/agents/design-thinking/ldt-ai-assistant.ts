import { OpenAI } from 'openai';

/**
 * Lean Design Thinking™ AI Assistant
 * 
 * Embodies the methodology's AI-powered guidance by providing:
 * - Element suggestions aligned with methodology phases
 * - Clustering operations that reveal insight patterns
 * - Session insights that reinforce evidence-based thinking
 * - Recommendations that guide users through the Design Thinking + Lean Startup fusion
 */
export class LLDTAIAssistant {
  private openaiClient: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: apiKey
      });
    } else {
      console.warn('OpenAI API key not configured. LDTAIAssistant features will be limited.');
      this.openaiClient = null;
    }
  }

  private isAvailable(): boolean {
    return this.openaiClient !== null;
  }

  /**
   * Generate suggestions for canvas elements
   */
  async suggestRelatedElements(context: ElementSuggestionContext): Promise<ElementSuggestion[]> {
    if (!this.isAvailable()) {
      return [];
    }
    try {
      const prompt = `
        Based on this Lean Design Thinking™ context, suggest related elements:
        
        Session Phase: ${context.phase}
        Current Elements: ${JSON.stringify(context.currentElements)}
        Recent Activity: ${context.recentActivity}
        Participant Focus: ${context.participantFocus}
        
        Suggest 3-5 related elements that would enhance the current canvas.
        Consider:
        1. Phase-appropriate elements
        2. Building on existing elements
        3. Encouraging diverse perspectives
        4. Filling gaps in the current canvas
        
        Format as JSON array with: {type, content, position, reasoning}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      const suggestions = JSON.parse(content);

      return suggestions.map((suggestion: any) => ({
        id: this.generateId(),
        type: suggestion.type,
        content: suggestion.content,
        position: suggestion.position,
        reasoning: suggestion.reasoning,
        confidence: this.calculateConfidence(suggestion),
        phase: context.phase,
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error generating element suggestions:', error);
      return [];
    }
  }

  /**
   * Cluster canvas elements intelligently
   */
  async clusterElements(elements: CanvasElement[]): Promise<Cluster[]> {
    try {
      const prompt = `
        Cluster these Lean Design Thinking™ canvas elements into meaningful groups:
        
        Elements: ${JSON.stringify(elements)}
        
        Consider:
        1. Thematic similarity
        2. Functional relationships
        3. User journey connections
        4. Problem-solution pairs
        5. Phase-specific groupings
        
        Return clusters with: {id, name, elements, theme, confidence}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      });

      const content = response.choices[0].message.content;
      const clusters = JSON.parse(content);

      return clusters.map((cluster: any) => ({
        id: this.generateId(),
        name: cluster.name,
        elements: cluster.elements,
        theme: cluster.theme,
        confidence: cluster.confidence,
        createdAt: new Date()
      }));
    } catch (error) {
      console.error('Error clustering elements:', error);
      return [];
    }
  }

  /**
   * Generate session insights
   */
  async generateSessionInsights(session: LDTSession): Promise<SessionInsight[]> {
    try {
      const prompt = `
        Analyze this Lean Design Thinking™ session and generate insights:
        
        Session Data: ${JSON.stringify(session)}
        Participants: ${session.participants.length}
        Duration: ${session.duration}
        Activities: ${session.activities.length}
        
        Generate insights about:
        1. Participation patterns
        2. Idea quality and diversity
        3. Collaboration effectiveness
        4. Phase progression
        5. Potential improvements
        
        Format as JSON array with: {type, content, importance, actionable}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      });

      const content = response.choices[0].message.content;
      const insights = JSON.parse(content);

      return insights.map((insight: any) => ({
        id: this.generateId(),
        type: insight.type,
        content: insight.content,
        importance: insight.importance,
        actionable: insight.actionable,
        confidence: this.calculateConfidence(insight),
        sessionId: session.id,
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error generating session insights:', error);
      return [];
    }
  }

  /**
   * Generate recommendations for workflow
   */
  async generateRecommendations(workflow: LDTWorkflow): Promise<Recommendation[]> {
    try {
      const prompt = `
        Generate recommendations for this Lean Design Thinking™ workflow:
        
        Workflow: ${JSON.stringify(workflow)}
        Current Phase: ${workflow.currentPhase}
        Status: ${workflow.status}
        
        Provide recommendations for:
        1. Phase optimization
        2. Participant engagement
        3. Tool utilization
        4. Process improvement
        5. Next steps
        
        Format as JSON array with: {category, content, priority, effort}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      });

      const content = response.choices[0].message.content;
      const recommendations = JSON.parse(content);

      return recommendations.map((rec: any) => ({
        id: this.generateId(),
        category: rec.category,
        content: rec.content,
        priority: rec.priority,
        effort: rec.effort,
        confidence: this.calculateConfidence(rec),
        workflowId: workflow.id,
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze collaboration patterns
   */
  async analyzeCollaborationPatterns(session: LDTSession): Promise<CollaborationAnalysis> {
    try {
      const prompt = `
        Analyze collaboration patterns in this Lean Design Thinking™ session:
        
        Session: ${JSON.stringify(session)}
        Participants: ${session.participants.length}
        Activities: ${session.activities.length}
        
        Analyze:
        1. Participation distribution
        2. Communication patterns
        3. Conflict resolution
        4. Engagement levels
        5. Collaboration quality
        
        Return analysis with: {participationScore, communicationQuality, engagementLevel, collaborationEffectiveness, recommendations}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      });

      const content = response.choices[0].message.content;
      const analysis = JSON.parse(content);

      return {
        participationScore: analysis.participationScore,
        communicationQuality: analysis.communicationQuality,
        engagementLevel: analysis.engagementLevel,
        collaborationEffectiveness: analysis.collaborationEffectiveness,
        recommendations: analysis.recommendations,
        sessionId: session.id,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing collaboration patterns:', error);
      return {
        participationScore: 0,
        communicationQuality: 0,
        engagementLevel: 0,
        collaborationEffectiveness: 0,
        recommendations: [],
        sessionId: session.id,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate phase transition suggestions
   */
  async generatePhaseTransitionSuggestions(workflow: LDTWorkflow): Promise<PhaseTransitionSuggestion[]> {
    try {
      const prompt = `
        Suggest phase transitions for this Lean Design Thinking™ workflow:
        
        Current Phase: ${workflow.currentPhase}
        Workflow Status: ${workflow.status}
        Progress: ${workflow.progress || 0}%
        
        Consider:
        1. Phase completion criteria
        2. Deliverable quality
        3. Participant readiness
        4. Time constraints
        5. Resource availability
        
        Suggest transitions with: {fromPhase, toPhase, reason, prerequisites, estimatedTime}
      `;

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      });

      const content = response.choices[0].message.content;
      const suggestions = JSON.parse(content);

      return suggestions.map((suggestion: any) => ({
        id: this.generateId(),
        fromPhase: suggestion.fromPhase,
        toPhase: suggestion.toPhase,
        reason: suggestion.reason,
        prerequisites: suggestion.prerequisites,
        estimatedTime: suggestion.estimatedTime,
        confidence: this.calculateConfidence(suggestion),
        workflowId: workflow.id,
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error generating phase transition suggestions:', error);
      return [];
    }
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(suggestion: any): number {
    // Simple confidence calculation based on suggestion quality
    const factors = {
      contentLength: Math.min(suggestion.content?.length || 0, 100) / 100,
      reasoningQuality: suggestion.reasoning ? 0.8 : 0.2,
      specificity: suggestion.specificity || 0.5
    };

    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) / Object.keys(factors).length;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Type definitions
interface ElementSuggestionContext {
  sessionId: string;
  phase: string;
  currentElements: CanvasElement[];
  recentActivity: string;
  participantFocus: string;
}

interface ElementSuggestion {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  reasoning: string;
  confidence: number;
  phase: string;
  timestamp: Date;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  metadata: any;
}

interface Cluster {
  id: string;
  name: string;
  elements: string[];
  theme: string;
  confidence: number;
  createdAt: Date;
}

interface LDTSession {
  id: string;
  workflow: {
    id: string;
    currentPhase: string;
  };
  participants: Participant[];
  sessionData: any;
  duration: number;
  activities: Activity[];
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastActive: Date;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  participantId: string;
}

interface SessionInsight {
  id: string;
  type: string;
  content: string;
  importance: number;
  actionable: boolean;
  confidence: number;
  sessionId: string;
  timestamp: Date;
}

interface LDTWorkflow {
  id: string;
  name: string;
  currentPhase: string;
  status: string;
  progress?: number;
}

interface Recommendation {
  id: string;
  category: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  workflowId: string;
  timestamp: Date;
}

interface CollaborationAnalysis {
  participationScore: number;
  communicationQuality: number;
  engagementLevel: number;
  collaborationEffectiveness: number;
  recommendations: string[];
  sessionId: string;
  timestamp: Date;
}

interface PhaseTransitionSuggestion {
  id: string;
  fromPhase: string;
  toPhase: string;
  reason: string;
  prerequisites: string[];
  estimatedTime: number;
  confidence: number;
  workflowId: string;
  timestamp: Date;
}
