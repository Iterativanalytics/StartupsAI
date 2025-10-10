// ============================================================================
// Credit Scoring API Routes
// RESTful API endpoints for credit scoring system
// ============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { CreditAnalystAgentIntegration } from '../integration';
import { RealTimeCreditDecisionEngine } from '../real-time-decision';
import { CreditScoringAdvancedFeatures } from '../advanced-features';
import { DataIntegrationOrchestrator } from '../data-integrations';
import { FairnessMonitor, BiasDetector, RegulatoryCompliance } from '../compliance/fairness-testing';
import { CreditApplication } from '../types';

const router = Router();

// Initialize services
const integration = new CreditAnalystAgentIntegration();
const decisionEngine = new RealTimeCreditDecisionEngine();
const advancedFeatures = new CreditScoringAdvancedFeatures();
const fairnessMonitor = new FairnessMonitor();
const biasDetector = new BiasDetector();
const compliance = new RegulatoryCompliance();

// ===========================
// MIDDLEWARE
// ===========================

// Request validation middleware
const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Implement validation logic
    next();
  };
};

// Rate limiting middleware
const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Implement rate limiting
  next();
};

// Authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Implement authentication
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  next();
};

// ===========================
// CREDIT SCORING ENDPOINTS
// ===========================

/**
 * POST /api/v1/credit-scores
 * Calculate credit score for a business
 */
router.post('/credit-scores', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const application: CreditApplication = req.body;

    // Validate application
    if (!application.applicantId || !application.businessInfo) {
      return res.status(400).json({ 
        error: 'Invalid application data',
        message: 'applicantId and businessInfo are required'
      });
    }

    // Analyze application
    const report = await integration.analyzeApplication(application);

    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Credit scoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate credit score',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/instant-decision
 * Get instant loan decision
 */
router.post('/instant-decision', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const application: CreditApplication = req.body;

    const decision = await decisionEngine.instantDecision(application);

    res.json({
      success: true,
      data: decision,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Instant decision error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process instant decision',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/fraud-detection
 * Detect fraud in application
 */
router.post('/fraud-detection', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const application: CreditApplication = req.body;

    const fraudAssessment = await advancedFeatures.detectFraud(application);

    res.json({
      success: true,
      data: fraudAssessment,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Fraud detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect fraud',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/portfolio/analyze
 * Analyze portfolio risk
 */
router.post('/portfolio/analyze', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const { applications } = req.body;

    if (!Array.isArray(applications) || applications.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'applications array is required'
      });
    }

    const portfolioReport = await integration.scorePortfolio(applications);

    res.json({
      success: true,
      data: portfolioReport,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze portfolio',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/loans/:loanId/monitor
 * Monitor existing loan
 */
router.post('/loans/:loanId/monitor', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const { originalApplication, currentFinancials, currentAlternativeData } = req.body;

    const monitoringReport = await integration.monitorExistingLoan(
      originalApplication,
      currentFinancials,
      currentAlternativeData
    );

    res.json({
      success: true,
      data: monitoringReport,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Loan monitoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to monitor loan',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/credit-limit/calculate
 * Calculate optimal credit limit
 */
router.post('/credit-limit/calculate', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const application: CreditApplication = req.body;

    // First get credit score
    const report = await integration.analyzeApplication(application);
    
    // Calculate credit limit
    const creditLimit = advancedFeatures.calculateOptimalCreditLimit(
      application,
      {
        overallScore: report.scoring.overallScore,
        rating: report.scoring.rating as any,
        defaultProbability: report.scoring.defaultProbability,
        riskCategory: report.scoring.riskCategory as any,
        confidenceLevel: report.scoring.confidenceLevel,
        componentScores: report.components,
        keyFactors: report.keyFactors,
        recommendation: report.recommendation,
        explainability: report.explainability
      }
    );

    res.json({
      success: true,
      data: {
        creditScore: report.scoring.overallScore,
        creditLimit
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Credit limit calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate credit limit',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/applications/compare
 * Compare multiple applications
 */
router.post('/applications/compare', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const { applications } = req.body;

    if (!Array.isArray(applications) || applications.length < 2) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'At least 2 applications required for comparison'
      });
    }

    const comparison = await integration.compareApplications(applications);

    res.json({
      success: true,
      data: comparison,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Application comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare applications',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/batch/instant-decisions
 * Batch process instant decisions
 */
router.post('/batch/instant-decisions', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const { applications } = req.body;

    if (!Array.isArray(applications)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'applications array is required'
      });
    }

    const decisions = await decisionEngine.batchInstantDecisions(applications);
    const stats = decisionEngine.getDecisionStatistics(decisions);

    res.json({
      success: true,
      data: {
        decisions: Array.from(decisions.entries()).map(([id, decision]) => ({
          applicationId: id,
          ...decision
        })),
        statistics: stats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Batch instant decisions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process batch decisions',
      message: error.message
    });
  }
});

// ===========================
// DATA INTEGRATION ENDPOINTS
// ===========================

/**
 * POST /api/v1/data/collect
 * Collect data from all integrated sources
 */
router.post('/data/collect', authenticate, rateLimit, async (req: Request, res: Response) => {
  try {
    const { businessId, tokens, config } = req.body;

    const orchestrator = new DataIntegrationOrchestrator(config);
    const data = await orchestrator.collectAllData(businessId, tokens);

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Data collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect data',
      message: error.message
    });
  }
});

// ===========================
// COMPLIANCE ENDPOINTS
// ===========================

/**
 * POST /api/v1/compliance/fairness-test
 * Run fairness testing
 */
router.post('/compliance/fairness-test', authenticate, async (req: Request, res: Response) => {
  try {
    const { predictions, actuals, protectedAttributes, modelVersion } = req.body;

    const fairnessTest = await fairnessMonitor.testFairness(
      predictions,
      actuals,
      protectedAttributes,
      modelVersion
    );

    res.json({
      success: true,
      data: fairnessTest,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Fairness test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run fairness test',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/compliance/bias-detection
 * Detect bias in model
 */
router.post('/compliance/bias-detection', authenticate, async (req: Request, res: Response) => {
  try {
    const { applications, scores, protectedAttributes } = req.body;

    const biasDetection = await biasDetector.detectBias(
      applications,
      scores,
      protectedAttributes
    );

    res.json({
      success: true,
      data: biasDetection,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Bias detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect bias',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/compliance/adverse-action-notice
 * Generate adverse action notice
 */
router.post('/compliance/adverse-action-notice', authenticate, async (req: Request, res: Response) => {
  try {
    const { application, score, decision } = req.body;

    const notice = compliance.generateAdverseActionNotice(
      application,
      score,
      decision
    );

    res.json({
      success: true,
      data: notice,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Adverse action notice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate adverse action notice',
      message: error.message
    });
  }
});

// ===========================
// HEALTH & STATUS ENDPOINTS
// ===========================

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    services: {
      creditScoring: 'operational',
      fraudDetection: 'operational',
      dataIntegration: 'operational',
      compliance: 'operational'
    }
  });
});

/**
 * GET /api/v1/status
 * System status endpoint
 */
router.get('/status', authenticate, (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    models: {
      active: 'v3.0.0',
      available: ['v3.0.0', 'v2.1.0']
    }
  });
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler
router.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

export default router;
