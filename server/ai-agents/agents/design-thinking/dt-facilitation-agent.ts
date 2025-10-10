import { BaseAgent } from '../../core/BaseAgent';
import { OpenAI } from 'openai';
import { DTSession, FacilitationResponse, SessionAnalysis, Intervention, Celebration } from './types';

/**
 * AI-Powered Design Thinking Facilitation Agent
 * 
 * This agent provides real-time facilitation during DT sessions, offering:
 * - Intelligent session monitoring
 * - Automated intervention suggestions
 * - Progress tracking and celebration
 * - Conflict resolution guidance
 * - Engagement optimization
 */
export class DTFacilitationAgent extends BaseAgent {
  private openaiClient: OpenAI | null;
  private sessionMonitor: SessionMonitor;
  private interventionEngine: InterventionEngine;
  private celebrationEngine: CelebrationEngine;

  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY || '' });
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: apiKey
      });
    } else {
      console.warn('OpenAI API key not configured. DTFacilitationAgent features will be limited.');
      this.openaiClient = null;
    }
    this.sessionMonitor = new SessionMonitor();
    this.interventionEngine = new InterventionEngine();
    this.celebrationEngine = new CelebrationEngine();
  }

  /**
   * Main facilitation method - provides real-time guidance during sessions
   */
  async facilitateSession(session: DTSession): Promise<FacilitationResponse> {
    try {
      // Analyze current session context
      const context = await this.analyzeSessionContext(session);
      
      // Generate real-time insights
      const insights = await this.generateRealTimeInsights(context);
      
      // Identify necessary interventions
      const interventions = await this.identifyInterventions(context);
      
      // Plan next steps
      const nextSteps = await this.planNextSteps(context);
      
      // Identify celebration opportunities
      const celebrations = await this.identifyCelebrations(context);

      return {
        suggestions: insights.suggestions,
        interventions,
        nextSteps,
        celebrations,
        confidence: insights.confidence,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in DT facilitation:', error);
      throw new Error('Failed to provide facilitation guidance');
    }
  }

  /**
   * Analyze session context to understand current state
   */
  private async analyzeSessionContext(session: DTSession): Promise<SessionContext> {
    const participants = session.participants;
    const currentPhase = session.workflow.currentPhase;
    const sessionData = session.sessionData;
    
    // Analyze participation levels
    const participationAnalysis = await this.analyzeParticipation(participants);
    
    // Analyze idea generation
    const ideaAnalysis = await this.analyzeIdeaGeneration(sessionData);
    
    // Analyze collaboration quality
    const collaborationAnalysis = await this.analyzeCollaboration(participants);
    
    // Analyze phase progress
    const phaseAnalysis = await this.analyzePhaseProgress(currentPhase, sessionData);

    return {
      session,
      participationAnalysis,
      ideaAnalysis,
      collaborationAnalysis,
      phaseAnalysis,
      timestamp: new Date()
    };
  }

  /**
   * Generate real-time insights and suggestions
   */
  private async generateRealTimeInsights(context: SessionContext): Promise<RealTimeInsights> {
    const prompt = `
    Analyze this Design Thinking session and provide insights:
    
    Session Phase: ${context.session.workflow.currentPhase}
    Participants: ${context.session.participants.length}
    Participation Quality: ${context.participationAnalysis.quality}
    Idea Generation Rate: ${context.ideaAnalysis.rate}
    Collaboration Score: ${context.collaborationAnalysis.score}
    
    Provide:
    1. 3-5 specific suggestions to improve the session
    2. Identify any blockers or issues
    3. Suggest next activities
    4. Rate confidence in recommendations (0-1)
    `;

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    const parsed = this.parseAIResponse(content);

    return {
      suggestions: parsed.suggestions,
      blockers: parsed.blockers,
      nextActivities: parsed.nextActivities,
      confidence: parsed.confidence
    };
  }

  /**
   * Identify necessary interventions
   */
  private async identifyInterventions(context: SessionContext): Promise<Intervention[]> {
    const interventions: Intervention[] = [];

    // Check for low participation
    if (context.participationAnalysis.quality < 0.6) {
      interventions.push({
        type: 'low_participation',
        severity: 'medium',
        message: 'Some participants seem less engaged. Consider using engagement techniques.',
        suggestions: [
          'Use round-robin participation',
          'Ask open-ended questions',
          'Use visual aids',
          'Break into smaller groups'
        ]
      });
    }

    // Check for idea stagnation
    if (context.ideaAnalysis.rate < 0.3) {
      interventions.push({
        type: 'idea_stagnation',
        severity: 'high',
        message: 'Idea generation has slowed down. Try creativity boosters.',
        suggestions: [
          'Use "Yes, and..." technique',
          'Try reverse brainstorming',
          'Use "What if..." scenarios',
          'Introduce constraints'
        ]
      });
    }

    // Check for conflicts
    if (context.collaborationAnalysis.conflicts.length > 0) {
      interventions.push({
        type: 'conflict_detected',
        severity: 'high',
        message: 'Conflicts detected. Address them constructively.',
        suggestions: [
          'Acknowledge different perspectives',
          'Find common ground',
          'Use "I" statements',
          'Focus on the problem, not the person'
        ]
      });
    }

    return interventions;
  }

  /**
   * Plan next steps based on current context
   */
  private async planNextSteps(context: SessionContext): Promise<NextStep[]> {
    const currentPhase = context.session.workflow.currentPhase;
    const nextSteps: NextStep[] = [];

    switch (currentPhase) {
      case 'empathize':
        nextSteps.push(
          { action: 'Conduct user interviews', priority: 'high', estimatedTime: '30-60 min' },
          { action: 'Create empathy maps', priority: 'high', estimatedTime: '45 min' },
          { action: 'Develop user personas', priority: 'medium', estimatedTime: '30 min' }
        );
        break;
      
      case 'define':
        nextSteps.push(
          { action: 'Synthesize insights', priority: 'high', estimatedTime: '30 min' },
          { action: 'Create POV statements', priority: 'high', estimatedTime: '45 min' },
          { action: 'Generate HMW questions', priority: 'medium', estimatedTime: '30 min' }
        );
        break;
      
      case 'ideate':
        nextSteps.push(
          { action: 'Brainstorm solutions', priority: 'high', estimatedTime: '60 min' },
          { action: 'Use ideation techniques', priority: 'medium', estimatedTime: '45 min' },
          { action: 'Cluster and prioritize ideas', priority: 'medium', estimatedTime: '30 min' }
        );
        break;
      
      case 'prototype':
        nextSteps.push(
          { action: 'Select ideas to prototype', priority: 'high', estimatedTime: '15 min' },
          { action: 'Create low-fidelity prototypes', priority: 'high', estimatedTime: '90 min' },
          { action: 'Plan user testing', priority: 'medium', estimatedTime: '30 min' }
        );
        break;
      
      case 'test':
        nextSteps.push(
          { action: 'Conduct user tests', priority: 'high', estimatedTime: '60 min' },
          { action: 'Collect feedback', priority: 'high', estimatedTime: '30 min' },
          { action: 'Synthesize learnings', priority: 'medium', estimatedTime: '45 min' }
        );
        break;
    }

    return nextSteps;
  }

  /**
   * Identify celebration opportunities
   */
  private async identifyCelebrations(context: SessionContext): Promise<Celebration[]> {
    const celebrations: Celebration[] = [];

    // Celebrate high participation
    if (context.participationAnalysis.quality > 0.8) {
      celebrations.push({
        type: 'high_participation',
        message: 'Great participation from the team!',
        impact: 'positive'
      });
    }

    // Celebrate breakthrough ideas
    if (context.ideaAnalysis.breakthroughIdeas.length > 0) {
      celebrations.push({
        type: 'breakthrough_ideas',
        message: 'Excellent breakthrough ideas generated!',
        impact: 'high'
      });
    }

    // Celebrate phase completion
    if (context.phaseAnalysis.completionRate > 0.9) {
      celebrations.push({
        type: 'phase_completion',
        message: 'Phase completed successfully!',
        impact: 'positive'
      });
    }

    return celebrations;
  }

  /**
   * Analyze session after completion
   */
  async analyzeSession(session: DTSession): Promise<SessionAnalysis> {
    const context = await this.analyzeSessionContext(session);
    
    return {
      sessionId: session.id,
      overallQuality: this.calculateOverallQuality(context),
      strengths: await this.identifyStrengths(context),
      improvements: await this.identifyImprovements(context),
      recommendations: await this.generateRecommendations(context),
      participantFeedback: await this.analyzeParticipantFeedback(session),
      nextSessionSuggestions: await this.suggestNextSession(session)
    };
  }

  /**
   * Provide engagement techniques for specific participants
   */
  async suggestEngagementTechniques(participant: Participant): Promise<EngagementSuggestion[]> {
    const techniques: EngagementSuggestion[] = [];

    if (participant.engagementLevel < 0.5) {
      techniques.push({
        technique: 'Direct questioning',
        description: 'Ask specific questions to encourage participation',
        example: 'What do you think about this idea?'
      });
    }

    if (participant.contributionCount < 2) {
      techniques.push({
        technique: 'Round-robin participation',
        description: 'Ensure everyone gets a chance to contribute',
        example: 'Let\'s go around the room and hear from everyone'
      });
    }

    return techniques;
  }

  /**
   * Suggest creativity boosters when ideas stagnate
   */
  async suggestCreativityBoost(): Promise<CreativitySuggestion[]> {
    return [
      {
        technique: 'Reverse brainstorming',
        description: 'Think about how to make the problem worse',
        duration: '15 minutes'
      },
      {
        technique: 'What if constraints',
        description: 'Add constraints to spark creativity',
        duration: '10 minutes'
      },
      {
        technique: 'Analogous inspiration',
        description: 'Look at how other industries solve similar problems',
        duration: '20 minutes'
      }
    ];
  }

  /**
   * Suggest conflict resolution strategies
   */
  async suggestConflictResolution(): Promise<ConflictResolutionSuggestion[]> {
    return [
      {
        strategy: 'Acknowledge and validate',
        description: 'Acknowledge different perspectives as valid',
        steps: ['Listen actively', 'Validate feelings', 'Find common ground']
      },
      {
        strategy: 'Focus on the problem',
        description: 'Redirect focus from people to the problem',
        steps: ['Reframe the discussion', 'Use "we" language', 'Focus on outcomes']
      },
      {
        strategy: 'Take a break',
        description: 'Sometimes a short break helps reset',
        steps: ['Take 5-10 minute break', 'Return with fresh perspective', 'Use different activity']
      }
    ];
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(content: string): ParsedAIResponse {
    // This would parse the AI response into structured data
    // Implementation depends on the specific format of AI responses
    return {
      suggestions: [],
      blockers: [],
      nextActivities: [],
      confidence: 0.8
    };
  }

  /**
   * Calculate overall session quality
   */
  private calculateOverallQuality(context: SessionContext): number {
    const weights = {
      participation: 0.3,
      ideas: 0.3,
      collaboration: 0.2,
      phase: 0.2
    };

    return (
      context.participationAnalysis.quality * weights.participation +
      context.ideaAnalysis.quality * weights.ideas +
      context.collaborationAnalysis.score * weights.collaboration +
      context.phaseAnalysis.progress * weights.phase
    );
  }
}

// Supporting classes and interfaces
class SessionMonitor {
  async analyzeParticipation(participants: Participant[]): Promise<ParticipationAnalysis> {
    // Implementation for participation analysis
    return {
      quality: 0.8,
      activeParticipants: participants.length,
      engagementLevel: 0.7
    };
  }
}

class InterventionEngine {
  // Implementation for intervention logic
}

class CelebrationEngine {
  // Implementation for celebration logic
}

// Type definitions
interface SessionContext {
  session: DTSession;
  participationAnalysis: ParticipationAnalysis;
  ideaAnalysis: IdeaAnalysis;
  collaborationAnalysis: CollaborationAnalysis;
  phaseAnalysis: PhaseAnalysis;
  timestamp: Date;
}

interface ParticipationAnalysis {
  quality: number;
  activeParticipants: number;
  engagementLevel: number;
}

interface IdeaAnalysis {
  rate: number;
  quality: number;
  breakthroughIdeas: string[];
}

interface CollaborationAnalysis {
  score: number;
  conflicts: Conflict[];
}

interface PhaseAnalysis {
  progress: number;
  completionRate: number;
}

interface RealTimeInsights {
  suggestions: string[];
  blockers: string[];
  nextActivities: string[];
  confidence: number;
}

interface NextStep {
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

interface EngagementSuggestion {
  technique: string;
  description: string;
  example: string;
}

interface CreativitySuggestion {
  technique: string;
  description: string;
  duration: string;
}

interface ConflictResolutionSuggestion {
  strategy: string;
  description: string;
  steps: string[];
}

interface ParsedAIResponse {
  suggestions: string[];
  blockers: string[];
  nextActivities: string[];
  confidence: number;
}

interface Conflict {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface Participant {
  id: string;
  name: string;
  engagementLevel: number;
  contributionCount: number;
}

interface DTSession {
  id: string;
  workflow: {
    id: string;
    currentPhase: string;
  };
  participants: Participant[];
  sessionData: any;
}

interface FacilitationResponse {
  suggestions: string[];
  interventions: Intervention[];
  nextSteps: NextStep[];
  celebrations: Celebration[];
  confidence: number;
  timestamp: Date;
}

interface Intervention {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestions: string[];
}

interface Celebration {
  type: string;
  message: string;
  impact: 'positive' | 'high' | 'medium' | 'low';
}

interface SessionAnalysis {
  sessionId: string;
  overallQuality: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  participantFeedback: any;
  nextSessionSuggestions: string[];
}
