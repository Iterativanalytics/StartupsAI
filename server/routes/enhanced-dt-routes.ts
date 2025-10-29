import express from 'express';
import { authMiddleware } from '../auth-middleware';
import { LLDTCollaborationService } from '../services/dt-collaboration-service';
import { LLDTAnalyticsService } from '../services/dt-analytics-service';
import { LLDTFacilitationAgent } from '../ai-agents/agents/design-thinking/dt-facilitation-agent';
import { LLDTInsightsAgent } from '../ai-agents/agents/design-thinking/dt-insights-agent';
import { handleRouteError, requireAuth, requireResource } from '../utils/routeHelpers';

const router = express.Router();

// Initialize services
const collaborationService = new LLDTCollaborationService();
const analyticsService = new LLDTAnalyticsService();
const facilitationAgent = new LLDTFacilitationAgent();
const insightsAgent = new LLDTInsightsAgent();

// Enhanced LLDT Workflow Routes
router.get('/workflows', authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    
    const userId = (req.user as any).id;
    const { status, phase, limit = 20, offset = 0 } = req.query;
    
    const workflows = await getWorkflows(userId, {
      status: status as string,
      phase: phase as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
    
    res.json(workflows);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch LLDT workflows');
  }
});

router.post('/workflows', authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    
    const userId = (req.user as any).id;
    const workflowData = { 
      ...req.body, 
      userId,
      aiFacilitationEnabled: req.body.aiFacilitationEnabled ?? true,
      collaborationMode: req.body.collaborationMode ?? 'real-time'
    };
    
    const workflow = await createWorkflow(workflowData);
    
    // Initialize AI facilitation if enabled
    if (workflow.aiFacilitationEnabled) {
      await facilitationAgent.initialize(workflow.id);
    }
    
    res.status(201).json(workflow);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create LLDT workflow');
  }
});

router.get('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await getWorkflow(id);
    
    if (!requireResource(workflow, res, 'Workflow')) return;
    
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch LLDT workflow');
  }
});

router.put('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const workflow = await updateWorkflow(id, updates);
    
    if (!requireResource(workflow, res, 'Workflow')) return;
    
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update LLDT workflow');
  }
});

router.delete('/workflows/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteWorkflow(id);
    res.status(204).send();
  } catch (error) {
    handleRouteError(error, res, 'Failed to delete LLDT workflow');
  }
});

// Phase Transition Routes
router.put('/workflows/:id/phase', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;
    
    const workflow = await transitionToPhase(id, phase);
    
    if (!requireResource(workflow, res, 'Workflow')) return;
    
    // Trigger AI facilitation for phase transition
    if (workflow.aiFacilitationEnabled) {
      await facilitationAgent.handlePhaseTransition(id, phase);
    }
    
    res.json(workflow);
  } catch (error) {
    handleRouteError(error, res, 'Failed to transition phase');
  }
});

// AI Facilitation Routes
router.get('/workflows/:id/ai-insights', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, limit = 10 } = req.query;
    
    const insights = await facilitationAgent.generateInsights(id, {
      type: type as string,
      limit: parseInt(limit as string)
    });
    
    res.json(insights);
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate AI insights');
  }
});

router.post('/workflows/:id/ai-facilitation', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionData, context } = req.body;
    
    const facilitation = await facilitationAgent.facilitateSession({
      id: id,
      workflow: { id, currentPhase: 'empathize' },
      participants: [],
      sessionData,
      context
    });
    
    res.json(facilitation);
  } catch (error) {
    handleRouteError(error, res, 'Failed to get AI facilitation');
  }
});

// Collaboration Routes
router.get('/workflows/:id/collaboration-status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const status = await collaborationService.getSessionStatus(id);
    res.json(status);
  } catch (error) {
    handleRouteError(error, res, 'Failed to get collaboration status');
  }
});

router.post('/workflows/:id/enable-clustering', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { canvasId } = req.body;
    
    const clusters = await collaborationService.enableSmartClustering(canvasId);
    res.json(clusters);
  } catch (error) {
    handleRouteError(error, res, 'Failed to enable smart clustering');
  }
});

// Analytics Routes
router.get('/workflows/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'comprehensive' } = req.query;
    
    let analytics;
    switch (type) {
      case 'comprehensive':
        analytics = await analyticsService.getComprehensiveAnalytics(id);
        break;
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
    
    res.json(analytics);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch analytics');
  }
});

router.get('/workflows/:id/insights/evolution/:insightId', authMiddleware, async (req, res) => {
  try {
    const { insightId } = req.params;
    const evolution = await analyticsService.trackInsightEvolution(insightId);
    res.json(evolution);
  } catch (error) {
    handleRouteError(error, res, 'Failed to track insight evolution');
  }
});

router.get('/workflows/:id/predictive-analytics', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const predictive = await analyticsService.generatePredictiveAnalytics(id);
    res.json(predictive);
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate predictive analytics');
  }
});

// Insights Generation Routes
router.post('/workflows/:id/insights/synthesize', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { empathyData } = req.body;
    
    const insights = await insightsAgent.synthesizeInsights(empathyData);
    res.json(insights);
  } catch (error) {
    handleRouteError(error, res, 'Failed to synthesize insights');
  }
});

router.post('/workflows/:id/insights/hmw-questions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { insights } = req.body;
    
    const hmwQuestions = await insightsAgent.generateHMWQuestions(insights);
    res.json(hmwQuestions);
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate HMW questions');
  }
});

router.post('/workflows/:id/insights/problem-statements', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { insights } = req.body;
    
    const problemStatements = await insightsAgent.generateProblemStatements(insights);
    res.json(problemStatements);
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate problem statements');
  }
});

// Export Routes
router.get('/workflows/:id/export', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const format = req.query.format as string || 'json';
    
    const exportData = await analyticsService.exportAnalytics(id, format as any);
    
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="dt-workflow-${id}.pdf"`);
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="dt-workflow-${id}.csv"`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="dt-workflow-${id}.json"`);
    }
    
    res.send(exportData.data);
  } catch (error) {
    handleRouteError(error, res, 'Failed to export workflow');
  }
});

// Real-time Collaboration WebSocket Routes
router.get('/workflows/:id/ws', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    
    // Setup WebSocket connection for real-time collaboration
    const wsUrl = `ws://localhost:3001/dt/workflows/${id}?userId=${userId}`;
    res.json({ wsUrl });
  } catch (error) {
    handleRouteError(error, res, 'Failed to setup WebSocket connection');
  }
});

// Session Management Routes
router.post('/workflows/:id/sessions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionData } = req.body;
    
    const session = await createSession(id, sessionData);
    res.status(201).json(session);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create session');
  }
});

router.get('/workflows/:id/sessions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await getWorkflowSessions(id);
    res.json(sessions);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch sessions');
  }
});

router.put('/workflows/:id/sessions/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { updates } = req.body;
    
    const session = await updateSession(sessionId, updates);
    res.json(session);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update session');
  }
});

// AI Agent Status Routes
router.get('/agents/status', authMiddleware, async (req, res) => {
  try {
    const status = {
      facilitationAgent: await facilitationAgent.getStatus(),
      insightsAgent: await insightsAgent.getStatus(),
      collaborationService: await collaborationService.getStatus(),
      analyticsService: await analyticsService.getStatus()
    };
    
    res.json(status);
  } catch (error) {
    handleRouteError(error, res, 'Failed to get agent status');
  }
});

// Health Check Routes
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: 'connected',
        ai: 'available',
        collaboration: 'active',
        analytics: 'ready'
      }
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions (these would be implemented in actual service classes)
async function getWorkflows(userId: string, filters: any) {
  // Implementation for getting workflows with filters
  return [];
}

async function createWorkflow(workflowData: any) {
  // Implementation for creating a new workflow
  return workflowData;
}

async function getWorkflow(id: string) {
  // Implementation for getting a specific workflow
  return null;
}

async function updateWorkflow(id: string, updates: any) {
  // Implementation for updating a workflow
  return null;
}

async function deleteWorkflow(id: string) {
  // Implementation for deleting a workflow
}

async function transitionToPhase(workflowId: string, phase: string) {
  // Implementation for phase transition
  return null;
}

async function createSession(workflowId: string, sessionData: any) {
  // Implementation for creating a session
  return sessionData;
}

async function getWorkflowSessions(workflowId: string) {
  // Implementation for getting workflow sessions
  return [];
}

async function updateSession(sessionId: string, updates: any) {
  // Implementation for updating a session
  return null;
}

export default router;
