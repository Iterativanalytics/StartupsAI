/**
 * Assessment API Routes
 * 
 * HTTP endpoints for the assessment system
 * - Start/resume assessment sessions
 * - Submit responses
 * - Get assessment results
 * - View assessment history
 * - Integration with agent personality adaptation
 */

import { Router, Request, Response } from 'express';
import { AssessmentEngine, AssessmentResponse } from '../../packages/assessment-engine/src/index.ts';
import { getAssessmentDatabase } from '../services/assessment-database';
import { getAssessmentService } from '../services/assessment-integration';

const router = Router();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Authentication middleware (assumes user injected by upstream auth)
const requireAuth = (req: Request, res: Response, next: Function): void => {
  const user = (req as any).user;
  if (!user || !user.id) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

// ============================================================================
// ASSESSMENT SESSION ENDPOINTS
// ============================================================================

/**
 * GET /api/assessments/types
 * Get available assessment types
 */
router.get('/types', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const assessmentTypes = [
      {
        id: 'riasec',
        name: 'Career Interest Assessment (RIASEC)',
        description: 'Discover your entrepreneurial interests and ideal role',
        duration: '10-15 minutes',
        questions: 48,
        benefits: [
          'Identify your natural strengths',
          'Find your ideal startup role',
          'Understand your work preferences',
          'Match with complementary co-founders'
        ]
      },
      {
        id: 'big_five',
        name: 'Personality Assessment (Big Five)',
        description: 'Understand your personality traits and founder archetype',
        duration: '15-20 minutes',
        questions: 60,
        benefits: [
          'Discover your founder archetype',
          'Identify blind spots',
          'Optimize team composition',
          'Improve decision-making'
        ]
      },
      {
        id: 'ai_readiness',
        name: 'AI Readiness Assessment',
        description: 'Evaluate your readiness to leverage AI in your startup',
        duration: '10-15 minutes',
        questions: 40,
        benefits: [
          'Assess AI adoption readiness',
          'Get personalized learning paths',
          'Identify AI opportunities',
          'Reduce AI implementation risks'
        ]
      },
      {
        id: 'design_thinking',
        name: 'Design Thinking Readiness',
        description: 'Assess your organization\'s readiness for design thinking',
        duration: '15-20 minutes',
        questions: 50,
        benefits: [
          'Evaluate innovation culture',
          'Identify organizational blockers',
          'Get implementation roadmap',
          'Optimize for innovation'
        ]
      }
    ];

    res.json({ assessmentTypes });
    return;
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    res.status(500).json({ error: 'Failed to fetch assessment types' });
  }
});

/**
 * POST /api/assessments/start
 * Start a new assessment session
 */
router.post('/start', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { assessmentType } = req.body;

    if (!assessmentType) {
      res.status(400).json({ error: 'Assessment type is required' });
      return;
    }

    // Create assessment engine
    const engine = new AssessmentEngine({
      userId: userId.toString(),
      userName: `${((req as any).user as any).firstName} ${((req as any).user as any).lastName}`,
      userEmail: ((req as any).user as any).email
    });

    // Get questions for this assessment
    const questions = engine.getAssessmentQuestions(assessmentType);

    // Create session in database
    const assessmentDb = getAssessmentDatabase();
    const session = await assessmentDb.createSession(
      userId,
      assessmentType,
      questions.length
    );

    res.json({
      session: {
        sessionId: session.sessionId,
        assessmentType: session.assessmentType,
        totalQuestions: session.totalQuestions,
        currentQuestionIndex: 0,
        progressPercentage: 0
      },
      questions
    });
    return;
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ error: 'Failed to start assessment' });
  }
});

/**
 * GET /api/assessments/session/:sessionId
 * Get assessment session details
 */
router.get('/session/:sessionId', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = ((req as any).user as any).id;

    const assessmentDb = getAssessmentDatabase();
    const session = await assessmentDb.getSession(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json({ session });
    return;
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * GET /api/assessments/active
 * Get user's active assessment sessions
 */
router.get('/active', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentDb = getAssessmentDatabase();
    const sessions = await assessmentDb.getUserActiveSessions(userId);

    res.json({ sessions });
    return;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    res.status(500).json({ error: 'Failed to fetch active sessions' });
  }
});

/**
 * POST /api/assessments/response
 * Submit a response to an assessment question
 */
router.post('/response', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { sessionId, questionId, value } = req.body;

    if (!sessionId || !questionId || value === undefined) {
      res.status(400).json({ error: 'Session ID, question ID, and value are required' });
      return;
    }

    const assessmentDb = getAssessmentDatabase();
    const session = await assessmentDb.getSession(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (session.status !== 'in_progress') {
      res.status(400).json({ error: 'Session is not in progress' });
      return;
    }

    // Save response
    const response: AssessmentResponse = {
      questionId,
      value,
      timestamp: new Date()
    };

    await assessmentDb.saveResponse(sessionId, response);

    // Get updated session
    const updatedSession = await assessmentDb.getSession(sessionId);

    res.json({
      success: true,
      progress: {
        currentQuestionIndex: updatedSession!.currentQuestionIndex,
        totalQuestions: updatedSession!.totalQuestions,
        progressPercentage: updatedSession!.progressPercentage,
        isComplete: updatedSession!.progressPercentage >= 100
      }
    });
    return;
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

/**
 * POST /api/assessments/complete
 * Complete an assessment and generate results
 */
router.post('/complete', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required' });
      return;
    }

    const assessmentDb = getAssessmentDatabase();
    const session = await assessmentDb.getSession(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (session.status !== 'in_progress') {
      res.status(400).json({ error: 'Session is not in progress' });
      return;
    }

    // Create assessment engine
    const engine = new AssessmentEngine({
      userId: userId.toString(),
      userName: `${((req as any).user as any).firstName} ${((req as any).user as any).lastName}`,
      userEmail: ((req as any).user as any).email
    });

    // Process assessment based on type
    let results: any;
    let compositeProfile: any = undefined;

    switch (session.assessmentType) {
      case 'riasec':
        results = engine.processRIASEC(session.responses);
        break;
      case 'design_thinking':
        results = engine.processDesignThinkingReadiness(session.responses);
        break;
      default:
        res.status(400).json({ error: `Unsupported assessment type: ${session.assessmentType}` });
        return;
    }

    // Save completed assessment
    const assessmentId = await assessmentDb.completeSession(
      sessionId,
      results,
      compositeProfile
    );

    // Trigger agent personality adaptation if personality assessment
    if (session.assessmentType === 'riasec') {
      try {
        const assessmentService = getAssessmentService();
        
        // Save assessment profile for agent adaptation
        await assessmentService.saveAssessmentProfile({
          userId,
          assessmentType: 'personality',
          assessmentResults: results,
          personalityTraits: extractPersonalityTraits(results, session.assessmentType),
          workPreferences: extractWorkPreferences(results, session.assessmentType),
          communicationStyle: determineCommunicationStyle(results) as any,
          decisionStyle: determineDecisionStyle(results) as any,
          riskProfile: determineRiskProfile(results) as any,
          completedAt: new Date()
        });

        console.log(`✅ Assessment profile saved for agent adaptation (User ${userId})`);
      } catch (error) {
        console.error('Error saving assessment profile for agent adaptation:', error);
        // Don't fail the request if adaptation fails
      }
    }

    res.json({
      success: true,
      assessmentId,
      results,
      message: 'Assessment completed successfully'
    });
    return;
  } catch (error) {
    console.error('Error completing assessment:', error);
    res.status(500).json({ error: 'Failed to complete assessment' });
  }
});

/**
 * POST /api/assessments/abandon
 * Abandon an in-progress assessment
 */
router.post('/abandon', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { sessionId } = req.body;

    const assessmentDb = getAssessmentDatabase();
    const session = await assessmentDb.getSession(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await assessmentDb.abandonSession(sessionId);

    res.json({ success: true, message: 'Session abandoned' });
    return;
  } catch (error) {
    console.error('Error abandoning session:', error);
    res.status(500).json({ error: 'Failed to abandon session' });
  }
});

// ============================================================================
// RESULTS ENDPOINTS
// ============================================================================

/**
 * GET /api/assessments/results/:assessmentType
 * Get latest assessment results for a specific type
 */
router.get('/results/:assessmentType', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { assessmentType } = req.params;

    const assessmentDb = getAssessmentDatabase();
    const assessment = await assessmentDb.getLatestAssessment(userId, assessmentType);

    if (!assessment) {
      res.status(404).json({ error: 'No assessment found for this type' });
      return;
    }

    res.json({
      assessment: {
        id: assessment._id,
        assessmentType: assessment.assessmentType,
        results: assessment.results,
        completedAt: assessment.completedAt,
        version: assessment.version
      }
    });
    return;
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    res.status(500).json({ error: 'Failed to fetch assessment results' });
  }
});

/**
 * GET /api/assessments/results
 * Get all assessment results for the user
 */
router.get('/results', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentDb = getAssessmentDatabase();
    const assessments = await assessmentDb.getAllUserAssessments(userId);

    res.json({
      assessments: assessments.map(a => ({
        id: a._id,
        assessmentType: a.assessmentType,
        completedAt: a.completedAt,
        hasResults: !!a.results
      }))
    });
    return;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

/**
 * GET /api/assessments/profile
 * Get composite profile (all assessments combined)
 */
router.get('/profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentDb = getAssessmentDatabase();
    const profile = await assessmentDb.getUserCompositeProfile(userId);

    if (!profile) {
      res.status(404).json({ error: 'No composite profile found. Complete all assessments first.' });
      return;
    }

    res.json({ profile });
    return;
  } catch (error) {
    console.error('Error fetching composite profile:', error);
    res.status(500).json({ error: 'Failed to fetch composite profile' });
  }
});

/**
 * GET /api/assessments/history/:assessmentType
 * Get assessment history and evolution
 */
router.get('/history/:assessmentType', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { assessmentType } = req.params;

    const assessmentDb = getAssessmentDatabase();
    const evolution = await assessmentDb.getAssessmentEvolution(userId, assessmentType);

    if (!evolution) {
      res.status(404).json({ error: 'No assessment history found' });
      return;
    }

    res.json({ evolution });
    return;
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
});

/**
 * GET /api/assessments/stats
 * Get user's assessment statistics
 */
router.get('/stats', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentDb = getAssessmentDatabase();
    const stats = await assessmentDb.getAssessmentStats(userId);

    res.json({ stats });
    return;
  } catch (error) {
    console.error('Error fetching assessment stats:', error);
    res.status(500).json({ error: 'Failed to fetch assessment stats' });
  }
});

// ============================================================================
// AGENT INTEGRATION ENDPOINTS
// ============================================================================

/**
 * GET /api/assessments/personality
 * Get personality profile for agent adaptation
 */
router.get('/personality', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentService = getAssessmentService();
    const profile = await assessmentService.getAssessmentProfile(userId, 'personality');

    if (!profile) {
      res.status(404).json({ error: 'No personality profile found' });
      return;
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching personality profile:', error);
    res.status(500).json({ error: 'Failed to fetch personality profile' });
  }
});

/**
 * GET /api/assessments/personality/insights
 * Get personality insights for the user
 */
router.get('/personality/insights', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentService = getAssessmentService();
    const insights = await assessmentService.generatePersonalityInsights(userId);

    res.json({ insights });
    return;
  } catch (error) {
    console.error('Error generating personality insights:', error);
    res.status(500).json({ error: 'Failed to generate personality insights' });
  }
});

/**
 * GET /api/assessments/agent-adaptation/:agentType
 * Get agent personality adaptation for specific agent
 */
router.get('/agent-adaptation/:agentType', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;
    const { agentType } = req.params;

    const assessmentService = getAssessmentService();
    const adaptation = await assessmentService.getAgentAdaptation(userId, agentType as any);

    if (!adaptation) {
      res.status(404).json({ error: 'No adaptation found for this agent' });
      return;
    }

    res.json({ adaptation });
    return;
  } catch (error) {
    console.error('Error fetching agent adaptation:', error);
    res.status(500).json({ error: 'Failed to fetch agent adaptation' });
  }
});

/**
 * POST /api/assessments/adapt-agents
 * Trigger agent personality adaptation based on latest assessment
 */
router.post('/adapt-agents', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as any).id;

    const assessmentService = getAssessmentService();
    const profile = await assessmentService.getAssessmentProfile(userId, 'personality');

    if (!profile) {
      res.status(404).json({ error: 'No personality profile found. Complete an assessment first.' });
      return;
    }

    // Adapt all Co-Agents
    const agentTypes: any[] = ['co_founder', 'co_investor', 'co_builder'];
    const adaptations = [];

    for (const agentType of agentTypes) {
      try {
        const adaptation = await assessmentService.adaptAgentPersonality(
          userId,
          agentType,
          profile._id!
        );
        adaptations.push({
          agentType,
          success: true,
          adaptation
        });
      } catch (error) {
        adaptations.push({
          agentType,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.json({
      success: true,
      message: 'Agent adaptations completed',
      adaptations
    });
    return;
  } catch (error) {
    console.error('Error adapting agents:', error);
    res.status(500).json({ error: 'Failed to adapt agents' });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * GET /api/assessments/admin/stats
 * Get platform-wide assessment statistics (admin only)
 */
router.get('/admin/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (((req as any).user as any).role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    const assessmentDb = getAssessmentDatabase();
    const stats = await assessmentDb.getPlatformAssessmentStats();

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractPersonalityTraits(results: any, assessmentType: string): any {
  if (assessmentType === 'riasec') {
    // Map RIASEC scores to personality traits
    return {
      openness: results.scores?.artistic || 50,
      conscientiousness: results.scores?.conventional || 50,
      extraversion: results.scores?.enterprising || 50,
      agreeableness: results.scores?.social || 50,
      analyticalThinking: results.scores?.investigative || 50,
      creativity: results.scores?.artistic || 50,
      resilience: 50 // Default, would come from Big Five
    };
  }
  
  return {};
}

function extractWorkPreferences(results: any, assessmentType: string): any {
  if (assessmentType === 'riasec') {
    const scores = results.scores || {};
    
    return {
      workPace: scores.enterprising > 70 ? 'fast' : scores.conventional > 70 ? 'deliberate' : 'moderate',
      decisionSpeed: scores.enterprising > 70 ? 'quick' : 'balanced',
      collaborationStyle: scores.social > 70 ? 'collaborative' : scores.realistic > 70 ? 'independent' : 'mixed',
      feedbackPreference: scores.enterprising > 70 ? 'direct' : 'balanced',
      structureNeed: scores.conventional > 70 ? 'high' : scores.artistic > 70 ? 'low' : 'medium'
    };
  }
  
  return {};
}

function determineCommunicationStyle(results: any): string {
  const scores = results.scores || {};
  
  if (scores.enterprising > 70) return 'direct';
  if (scores.social > 70) return 'diplomatic';
  if (scores.investigative > 70) return 'analytical';
  if (scores.artistic > 70) return 'expressive';
  
  return 'balanced';
}

function determineDecisionStyle(results: any): string {
  const scores = results.scores || {};
  
  if (scores.investigative > 70) return 'data-driven';
  if (scores.enterprising > 70) return 'decisive';
  if (scores.social > 70) return 'collaborative';
  if (scores.artistic > 70) return 'intuitive';
  
  return 'balanced';
}

function determineRiskProfile(results: any): string {
  const scores = results.scores || {};
  
  if (scores.enterprising > 75) return 'aggressive';
  if (scores.conventional > 75) return 'conservative';
  if (scores.investigative > 70) return 'calculated';
  
  return 'moderate';
}

export default router;
