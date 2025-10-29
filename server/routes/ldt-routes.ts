import express from 'express';
import { authMiddleware } from '../auth-middleware';
import { EmpathyMapService } from '../services/empathy-map-service';
import { POVService } from '../services/pov-service';
import { PrototypeService } from '../services/prototype-service';
import { TestSessionService } from '../services/test-session-service';
import { LDTProjectService } from '../services/dt-project-service';
import { handleRouteError, requireAuth, requireResource } from '../utils/routeHelpers';

const router = express.Router();

// Initialize services
const empathyMapService = new EmpathyMapService();
const povService = new POVService();
const prototypeService = new PrototypeService();
const testSessionService = new TestSessionService();
const ldtProjectService = new LDTProjectService();

// LDT Projects Routes
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    
    const userId = (req.user as any).id;
    const projects = await dtProjectService.getByUserId(userId);
    res.json(projects);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch LDT projects', 'fetching LDT projects');
  }
});

router.post('/projects', authMiddleware, async (req, res) => {
  try {
    if (!requireAuth(req, res)) return;
    
    const userId = (req.user as any).id;
    const projectData = { ...req.body, userId };
    const project = await dtProjectService.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create LDT project', 'creating LDT project');
  }
});

router.get('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await dtProjectService.getById(projectId);
    
    if (!requireResource(project, res, 'Project')) return;
    
    res.json(project);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch LDT project', 'fetching LDT project');
  }
});

router.put('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;
    const project = await dtProjectService.update(projectId, updates);
    
    if (!requireResource(project, res, 'Project')) return;
    
    res.json(project);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update LDT project', 'updating LDT project');
  }
});

router.delete('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    await dtProjectService.delete(projectId);
    res.status(204).send();
  } catch (error) {
    handleRouteError(error, res, 'Failed to delete LDT project', 'deleting LDT project');
  }
});

// Empathy Maps Routes
router.get('/projects/:projectId/empathy-maps', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const empathyMaps = await empathyMapService.getByProjectId(projectId);
    res.json(empathyMaps);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch empathy maps', 'fetching empathy maps');
  }
});

router.post('/projects/:projectId/empathy-maps', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const empathyMapData = req.body;
    const empathyMap = await empathyMapService.create(projectId, empathyMapData);
    res.status(201).json(empathyMap);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create empathy map', 'creating empathy map');
  }
});

router.get('/empathy-maps/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const empathyMap = await empathyMapService.getById(id);
    
    if (!requireResource(empathyMap, res, 'Empathy map')) return;
    
    res.json(empathyMap);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch empathy map', 'fetching empathy map');
  }
});

router.put('/empathy-maps/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const empathyMap = await empathyMapService.update(id, updates);
    
    if (!requireResource(empathyMap, res, 'Empathy map')) return;
    
    res.json(empathyMap);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update empathy map', 'updating empathy map');
  }
});

router.delete('/empathy-maps/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await empathyMapService.delete(id);
    res.status(204).send();
  } catch (error) {
    handleRouteError(error, res, 'Failed to delete empathy map', 'deleting empathy map');
  }
});

// POV Statements Routes
router.get('/projects/:projectId/pov-statements', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const povStatements = await povService.getByProjectId(projectId);
    res.json(povStatements);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch POV statements', 'fetching POV statements');
  }
});

router.post('/projects/:projectId/pov-statements', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const povData = req.body;
    const povStatement = await povService.create(projectId, povData);
    res.status(201).json(povStatement);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create POV statement', 'creating POV statement');
  }
});

router.put('/pov-statements/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const povStatement = await povService.update(id, updates);
    
    if (!requireResource(povStatement, res, 'POV statement')) return;
    
    res.json(povStatement);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update POV statement', 'updating POV statement');
  }
});

// Prototypes Routes
router.get('/projects/:projectId/prototypes', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const prototypes = await prototypeService.getByProjectId(projectId);
    res.json(prototypes);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch prototypes', 'fetching prototypes');
  }
});

router.post('/projects/:projectId/prototypes', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const prototypeData = req.body;
    const prototype = await prototypeService.create(projectId, prototypeData);
    res.status(201).json(prototype);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create prototype', 'creating prototype');
  }
});

router.put('/prototypes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const prototype = await prototypeService.update(id, updates);
    
    if (!requireResource(prototype, res, 'Prototype')) return;
    
    res.json(prototype);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update prototype', 'updating prototype');
  }
});

// Test Sessions Routes
router.get('/prototypes/:prototypeId/test-sessions', authMiddleware, async (req, res) => {
  try {
    const { prototypeId } = req.params;
    const testSessions = await testSessionService.getByPrototypeId(prototypeId);
    res.json(testSessions);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch test sessions', 'fetching test sessions');
  }
});

router.post('/prototypes/:prototypeId/test-sessions', authMiddleware, async (req, res) => {
  try {
    const { prototypeId } = req.params;
    const testSessionData = req.body;
    const testSession = await testSessionService.create(prototypeId, testSessionData);
    res.status(201).json(testSession);
  } catch (error) {
    handleRouteError(error, res, 'Failed to create test session', 'creating test session');
  }
});

router.put('/test-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const testSession = await testSessionService.update(id, updates);
    
    if (!requireResource(testSession, res, 'Test session')) return;
    
    res.json(testSession);
  } catch (error) {
    handleRouteError(error, res, 'Failed to update test session', 'updating test session');
  }
});

// Analytics Routes
router.get('/projects/:projectId/analytics', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const analytics = await dtProjectService.getAnalytics(projectId);
    res.json(analytics);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fetch project analytics', 'fetching project analytics');
  }
});

// Export Routes
router.get('/projects/:projectId/export', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const format = req.query.format as string || 'json';
    
    const exportData = await dtProjectService.exportProject(projectId, format);
    
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="dt-project-${projectId}.pdf"`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="dt-project-${projectId}.json"`);
    }
    
    res.send(exportData);
  } catch (error) {
    handleRouteError(error, res, 'Failed to export project', 'exporting project');
  }
});

export default router;
