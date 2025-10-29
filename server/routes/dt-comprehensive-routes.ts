// ============================================================================
// COMPREHENSIVE LEAN DESIGN THINKING™ API ROUTES
// Complete implementation of LLDT Enhancement Plan
// ============================================================================

import express from 'express';
import { authMiddleware } from '../auth-middleware';
import { ldtWorkflowService } from '../services/dt-workflow-service';
import { EnhancedLeanDesignThinkingAgent } from '../ai-agents/agents/design-thinking/enhanced-dt-agent';
import { LLDTCollaborationService } from '../services/dt-collaboration-service';
import { LLDTAnalyticsService } from '../services/dt-analytics-service';

const router = express.Router();

// Initialize services
const ldtAgent = new EnhancedLeanDesignThinkingAgent();
const collaborationService = new LLDTCollaborationService();
const analyticsService = new LLDTAnalyticsService();

// ===========================
// WORKFLOW MANAGEMENT ROUTES
// ===========================

/**
 * GET /api/dt/workflows
 * Get all workflows for the authenticated user
 */
router.get('/workflows', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { status, phase, limit, offset } = req.query;
    
    const workflows = await dtWorkflowService.getWorkflows(userId, {
      status: status as any,
      phase: phase as any,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });
    
    res.json({
      success: true,
      data: workflows,
      count: workflows.length
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflows'
    });
  }
});

/**
 * POST /api/dt/workflows
 * Create a new LLDT workflow
 */
router.post('/workflows', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const workflowData = {
      ...req.body,
      userId
    };
    
    const workflow = await dtWorkflowService.createWorkflow(workflowData);
    
    // Initialize AI facilitation if enabled
    if (workflow.aiFacilitationEnabled) {
      await dtAgent.initialize(workflow.id);
    }
    
    res.status(201).json({
      success: true,
      data: workflow
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create workflow'
    });
  }
});

/**
 * GET /api/dt/workflows/:id
 * Get a specific workflow with full details
 */
router.get('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const summary = await dtWorkflowService.getWorkflowSummary(id);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflow'
    });
  }
});

/**
 * PUT /api/dt/workflows/:id
 * Update a workflow
 */
router.put('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const workflow = await dtWorkflowService.updateWorkflow(id, updates);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }
    
    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update workflow'
    });
  }
});

/**
 * PUT /api/dt/workflows/:id/phase
 * Transition workflow to a new phase
 */
router.put('/workflows/:id/phase', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;
    
    const workflow = await dtWorkflowService.transitionPhase(id, phase);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }
    
    // Trigger AI facilitation for phase transition
    if (workflow.aiFacilitationEnabled) {
      await dtAgent.handlePhaseTransition(id, phase);
    }
    
    res.json({
      success: true,
      data: workflow,
      message: `Transitioned to ${phase} phase`
    });
  } catch (error) {
    console.error('Error transitioning phase:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transition phase'
    });
  }
});

/**
 * DELETE /api/dt/workflows/:id
 * Delete a workflow
 */
router.delete('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dtWorkflowService.deleteWorkflow(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete workflow'
    });
  }
});

// ===========================
// EMPATHY DATA ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/empathy-data
 * Add empathy data to a workflow
 */
router.post('/workflows/:id/empathy-data', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const empathyData = await dtWorkflowService.createEmpathyData({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    
    res.status(201).json({
      success: true,
      data: empathyData
    });
  } catch (error) {
    console.error('Error creating empathy data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create empathy data'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/empathy-data
 * Get all empathy data for a workflow
 */
router.get('/workflows/:id/empathy-data', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    
    res.json({
      success: true,
      data: empathyData,
      count: empathyData.length
    });
  } catch (error) {
    console.error('Error fetching empathy data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch empathy data'
    });
  }
});

// ===========================
// POV STATEMENT ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/pov-statements
 * Create a POV statement
 */
router.post('/workflows/:id/pov-statements', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const pov = await dtWorkflowService.createPOVStatement({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    
    res.status(201).json({
      success: true,
      data: pov
    });
  } catch (error) {
    console.error('Error creating POV statement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create POV statement'
    });
  }
});

/**
 * POST /api/dt/workflows/:id/pov-statements/generate
 * AI-generate POV statements from empathy data
 */
router.post('/workflows/:id/pov-statements/generate', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    
    if (empathyData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No empathy data available. Please add empathy data first.'
      });
    }
    
    const povStatements = await dtAgent.generatePOVStatements(empathyData);
    
    // Save generated POV statements
    const userId = (req.user as any).id;
    const saved = await Promise.all(
      povStatements.map(pov => 
        dtWorkflowService.createPOVStatement({
          ...pov,
          createdBy: userId
        })
      )
    );
    
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error('Error generating POV statements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate POV statements'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/pov-statements
 * Get all POV statements for a workflow
 */
router.get('/workflows/:id/pov-statements', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const povStatements = await dtWorkflowService.getPOVStatements(id);
    
    res.json({
      success: true,
      data: povStatements,
      count: povStatements.length
    });
  } catch (error) {
    console.error('Error fetching POV statements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch POV statements'
    });
  }
});

// ===========================
// HMW QUESTION ROUTES
// ===========================

/**
 * POST /api/dt/pov-statements/:povId/hmw-questions/generate
 * Generate HMW questions from a POV statement
 */
router.post('/pov-statements/:povId/hmw-questions/generate', authMiddleware, async (req, res) => {
  try {
    const { povId } = req.params;
    const pov = await dtWorkflowService.getPOVStatements('').then(povs => 
      povs.find(p => p.id === povId)
    );
    
    if (!pov) {
      return res.status(404).json({
        success: false,
        error: 'POV statement not found'
      });
    }
    
    const hmwQuestions = await dtAgent.generateHMWQuestions(pov);
    
    // Save generated HMW questions
    const userId = (req.user as any).id;
    const saved = await Promise.all(
      hmwQuestions.map(hmw => 
        dtWorkflowService.createHMWQuestion({
          ...hmw,
          createdBy: userId
        })
      )
    );
    
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error('Error generating HMW questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate HMW questions'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/hmw-questions
 * Get all HMW questions for a workflow
 */
router.get('/workflows/:id/hmw-questions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const hmwQuestions = await dtWorkflowService.getHMWQuestions(id);
    
    res.json({
      success: true,
      data: hmwQuestions,
      count: hmwQuestions.length
    });
  } catch (error) {
    console.error('Error fetching HMW questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch HMW questions'
    });
  }
});

/**
 * POST /api/dt/hmw-questions/:hmwId/vote
 * Vote for an HMW question
 */
router.post('/hmw-questions/:hmwId/vote', authMiddleware, async (req, res) => {
  try {
    const { hmwId } = req.params;
    const hmw = await dtWorkflowService.voteHMWQuestion(hmwId);
    
    if (!hmw) {
      return res.status(404).json({
        success: false,
        error: 'HMW question not found'
      });
    }
    
    res.json({
      success: true,
      data: hmw
    });
  } catch (error) {
    console.error('Error voting HMW question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to vote HMW question'
    });
  }
});

// ===========================
// IDEA ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/ideas
 * Create a new idea
 */
router.post('/workflows/:id/ideas', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const idea = await dtWorkflowService.createIdea({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    
    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create idea'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/ideas
 * Get all ideas for a workflow
 */
router.get('/workflows/:id/ideas', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const ideas = await dtWorkflowService.getIdeas(id);
    
    res.json({
      success: true,
      data: ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ideas'
    });
  }
});

/**
 * POST /api/dt/workflows/:id/ideas/evaluate
 * AI-evaluate all ideas in a workflow
 */
router.post('/workflows/:id/ideas/evaluate', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { criteria } = req.body;
    
    const ideas = await dtWorkflowService.getIdeas(id);
    
    if (ideas.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No ideas to evaluate'
      });
    }
    
    const evaluations = await dtAgent.evaluateIdeas(ideas, criteria);
    
    // Update ideas with evaluation scores
    await Promise.all(
      evaluations.map(evaluation => 
        dtWorkflowService.updateIdea(evaluation.idea.id, {
          desirabilityScore: evaluation.scores.desirability,
          feasibilityScore: evaluation.scores.feasibility,
          viabilityScore: evaluation.scores.viability,
          innovationScore: evaluation.scores.innovation,
          impactScore: evaluation.scores.impact,
          overallScore: (evaluation.scores.desirability * 0.3 + 
                        evaluation.scores.feasibility * 0.25 + 
                        evaluation.scores.viability * 0.25 + 
                        evaluation.scores.innovation * 0.1 + 
                        evaluation.scores.impact * 0.1),
          aiEvaluation: {
            risks: evaluation.risks,
            opportunities: evaluation.opportunities,
            recommendations: evaluation.recommendations
          },
          status: 'evaluated'
        })
      )
    );
    
    res.json({
      success: true,
      data: evaluations,
      count: evaluations.length
    });
  } catch (error) {
    console.error('Error evaluating ideas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate ideas'
    });
  }
});

// ===========================
// PROTOTYPE ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/prototypes
 * Create a new prototype
 */
router.post('/workflows/:id/prototypes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const prototype = await dtWorkflowService.createPrototype({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    
    res.status(201).json({
      success: true,
      data: prototype
    });
  } catch (error) {
    console.error('Error creating prototype:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create prototype'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/prototypes
 * Get all prototypes for a workflow
 */
router.get('/workflows/:id/prototypes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const prototypes = await dtWorkflowService.getPrototypes(id);
    
    res.json({
      success: true,
      data: prototypes,
      count: prototypes.length
    });
  } catch (error) {
    console.error('Error fetching prototypes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prototypes'
    });
  }
});

/**
 * POST /api/dt/ideas/:ideaId/prototype-plan
 * Generate a prototype plan for an idea
 */
router.post('/ideas/:ideaId/prototype-plan', authMiddleware, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { resources } = req.body;
    
    const ideas = await dtWorkflowService.getIdeas('');
    const idea = ideas.find(i => i.id === ideaId);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    const plan = await dtAgent.generatePrototypePlan(idea, resources);
    
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error generating prototype plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate prototype plan'
    });
  }
});

// ===========================
// TEST SESSION ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/test-sessions
 * Create a test session
 */
router.post('/workflows/:id/test-sessions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    const session = await dtWorkflowService.createTestSession({
      ...req.body,
      workflowId: id,
      createdBy: userId
    });
    
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error creating test session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test session'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/test-sessions
 * Get all test sessions for a workflow
 */
router.get('/workflows/:id/test-sessions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await dtWorkflowService.getTestSessions(id);
    
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Error fetching test sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test sessions'
    });
  }
});

// ===========================
// AI INSIGHTS ROUTES
// ===========================

/**
 * POST /api/dt/workflows/:id/insights/synthesize
 * Synthesize insights from empathy data
 */
router.post('/workflows/:id/insights/synthesize', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyData = await dtWorkflowService.getEmpathyData(id);
    
    if (empathyData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No empathy data available for synthesis'
      });
    }
    
    const insights = await dtAgent.synthesizeInsights(empathyData);
    
    // Save insights
    const saved = await Promise.all(
      insights.map(insight => 
        dtWorkflowService.createInsight({
          workflowId: id,
          phase: 'empathize',
          insightType: insight.type as any,
          title: insight.content.substring(0, 100),
          content: insight.content,
          confidenceScore: insight.confidence,
          impactScore: insight.businessImpact,
          actionabilityScore: insight.actionability,
          relatedEntities: insight.relatedEntities,
          aiModelVersion: 'gpt-4',
          generationMethod: 'pattern_analysis'
        })
      )
    );
    
    res.json({
      success: true,
      data: saved,
      count: saved.length
    });
  } catch (error) {
    console.error('Error synthesizing insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to synthesize insights'
    });
  }
});

/**
 * GET /api/dt/workflows/:id/insights
 * Get all insights for a workflow
 */
router.get('/workflows/:id/insights', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase, type, limit } = req.query;
    
    const insights = await dtWorkflowService.getInsights(id, {
      phase: phase as any,
      type: type as string,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json({
      success: true,
      data: insights,
      count: insights.length
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch insights'
    });
  }
});

// ===========================
// ANALYTICS ROUTES
// ===========================

/**
 * GET /api/dt/workflows/:id/analytics
 * Get comprehensive analytics for a workflow
 */
router.get('/workflows/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'comprehensive' } = req.query;
    
    let analytics;
    switch (type) {
      case 'effectiveness':
        analytics = await analyticsService.calculateEffectivenessScore(id);
        break;
      case 'insights':
        analytics = await analyticsService.generateInsightMap(id);
        break;
      case 'roi':
        analytics = await analyticsService.calculateROI(id);
        break;
      case 'benchmarks':
        analytics = await analyticsService.compareToBenchmarks(id);
        break;
      default:
        analytics = await analyticsService.getComprehensiveAnalytics(id);
    }
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

/**
 * GET /api/dt/insights/:insightId/evolution
 * Track evolution of an insight across phases
 */
router.get('/insights/:insightId/evolution', authMiddleware, async (req, res) => {
  try {
    const { insightId } = req.params;
    const evolution = await analyticsService.trackInsightEvolution(insightId);
    
    res.json({
      success: true,
      data: evolution
    });
  } catch (error) {
    console.error('Error tracking insight evolution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track insight evolution'
    });
  }
});

// ===========================
// COLLABORATION ROUTES
// ===========================

/**
 * GET /api/dt/workflows/:id/collaboration-status
 * Get real-time collaboration status
 */
router.get('/workflows/:id/collaboration-status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const status = await collaborationService.getSessionStatus(id);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching collaboration status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collaboration status'
    });
  }
});

// ===========================
// AI FACILITATION ROUTES
// ===========================

/**
 * POST /api/dt/sessions/:sessionId/facilitate
 * Get AI facilitation for a session
 */
router.post('/sessions/:sessionId/facilitate', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sessionData } = req.body;
    
    const facilitation = await dtAgent.facilitateSession({
      id: sessionId,
      workflowId: sessionData.workflowId,
      sessionType: sessionData.sessionType,
      participants: sessionData.participants || [],
      currentActivity: sessionData.currentActivity,
      startTime: new Date(sessionData.startTime),
      duration: sessionData.duration,
      sessionData
    });
    
    res.json({
      success: true,
      data: facilitation
    });
  } catch (error) {
    console.error('Error providing facilitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to provide facilitation'
    });
  }
});

// ===========================
// HEALTH CHECK
// ===========================

/**
 * GET /api/dt/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const agentStatus = await dtAgent.getStatus();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date(),
      services: {
        dtAgent: agentStatus.status,
        collaboration: 'active',
        analytics: 'ready',
        workflows: 'operational'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
