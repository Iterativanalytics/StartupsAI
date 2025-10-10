import { Router } from 'express';
import { documentAIService } from '../services/document-ai-service';
import type { ApplicationForm } from '../ai-application-filler';
import { handleRouteError, validateRequiredFields } from '../utils/routeHelpers';

const router = Router();

/**
 * Check if AI services are available
 */
router.get('/status', (req, res) => {
  res.json({
    available: documentAIService.isAIAvailable(),
    message: documentAIService.isAIAvailable() 
      ? 'AI services are available' 
      : 'AI services are not configured. Please set up OpenAI API keys.'
  });
});

/**
 * Fill application from document
 * POST /api/documents/:documentId/fill-application
 */
router.post('/:documentId/fill-application', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { form } = req.body as { form: ApplicationForm };

    if (!validateRequiredFields(req.body, ['form'], res)) return;

    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({ 
        message: 'AI services are not available. Please configure OpenAI API keys.' 
      });
    }

    // Fetch document from database (mock for now)
    const document = req.body.document || { 
      id: documentId,
      content: req.body.documentContent 
    };

    const filledApplication = await documentAIService.fillApplicationFromDocument(
      documentId,
      document,
      form
    );

    res.json(filledApplication);
  } catch (error) {
    handleRouteError(error, res, 'Failed to fill application', 'filling application from document');
  }
});

/**
 * Generate suggestions for application improvement
 * POST /api/documents/:documentId/application-suggestions
 */
router.post('/:documentId/application-suggestions', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { form, responses } = req.body as { 
      form: ApplicationForm; 
      responses: Record<string, any> 
    };

    if (!validateRequiredFields(req.body, ['form', 'responses'], res)) return;

    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({ 
        message: 'AI services are not available' 
      });
    }

    const document = req.body.document || { 
      id: documentId,
      content: req.body.documentContent 
    };

    const suggestions = await documentAIService.generateDocumentSuggestions(
      document,
      form,
      responses
    );

    res.json({ suggestions });
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate suggestions', 'generating suggestions');
  }
});

/**
 * Analyze document for application readiness
 * POST /api/documents/:documentId/analyze-readiness
 */
router.post('/:documentId/analyze-readiness', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { applicationType } = req.body as { 
      applicationType: 'accelerator' | 'grant' | 'competition' | 'investment' 
    };

    if (!validateRequiredFields(req.body, ['applicationType'], res)) return;

    const document = req.body.document || { 
      id: documentId,
      content: req.body.documentContent 
    };

    const analysis = await documentAIService.analyzeDocumentForApplication(
      document,
      applicationType
    );

    res.json(analysis);
  } catch (error) {
    handleRouteError(error, res, 'Failed to analyze document', 'analyzing document');
  }
});

/**
 * Prepare document for application
 * POST /api/documents/:documentId/prepare-application
 */
router.post('/:documentId/prepare-application', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { targetFormat } = req.body as { targetFormat: 'pdf' | 'docx' | 'json' };

    if (!validateRequiredFields(req.body, ['targetFormat'], res)) return;

    const document = req.body.document || { 
      id: documentId,
      content: req.body.documentContent 
    };

    const prepared = await documentAIService.prepareDocumentForApplication(
      document,
      targetFormat
    );

    res.json(prepared);
  } catch (error) {
    handleRouteError(error, res, 'Failed to prepare document', 'preparing document');
  }
});

/**
 * Batch process documents for applications
 * POST /api/documents/batch-fill-applications
 */
router.post('/batch-fill-applications', async (req, res) => {
  try {
    const { documents, form } = req.body as { 
      documents: any[]; 
      form: ApplicationForm 
    };

    if (!validateRequiredFields(req.body, ['documents', 'form'], res)) return;

    if (!documentAIService.isAIAvailable()) {
      return res.status(503).json({ 
        message: 'AI services are not available' 
      });
    }

    const results = await documentAIService.batchProcessDocuments(documents, form);

    res.json({ 
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results 
    });
  } catch (error) {
    handleRouteError(error, res, 'Failed to batch process documents', 'batch processing documents');
  }
});

export default router;
