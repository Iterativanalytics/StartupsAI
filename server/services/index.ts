/**
 * Services Index
 * 
 * Centralized initialization and export of all services
 * - Agent Database Service
 * - Assessment Database Service
 * - Assessment Integration Service
 * - Proactive Automation Engine
 */

import { initializeAgentDatabase, getAgentDatabase } from './agent-database';
import { initializeAssessmentDatabase, getAssessmentDatabase } from './assessment-database';
import { initializeAssessmentService, getAssessmentService } from './assessment-integration';
import { initializeAutomationEngine, getAutomationEngine } from './proactive-automation';

// ============================================================================
// SERVICE INITIALIZATION
// ============================================================================

export async function initializeAllServices() {
  console.log('🚀 Initializing all services...');
  
  // Check if MongoDB is configured
  const mongoConfigured = !!process.env.MONGODB_CONNECTION_STRING;
  
  if (!mongoConfigured) {
    console.log('ℹ️ MongoDB not configured - skipping database services');
    console.log('ℹ️ To enable database services, set MONGODB_CONNECTION_STRING environment variable');
    return null;
  }
  
  try {
    // Initialize database services
    const agentDb = await initializeAgentDatabase();
    console.log('✅ Agent Database Service initialized');
    
    const assessmentDb = await initializeAssessmentDatabase();
    console.log('✅ Assessment Database Service initialized');
    
    const assessmentService = await initializeAssessmentService();
    console.log('✅ Assessment Integration Service initialized');
    
    const automationEngine = await initializeAutomationEngine();
    console.log('✅ Proactive Automation Engine initialized');
    
    console.log('✅ All services initialized successfully');
    
    return {
      agentDb,
      assessmentDb,
      assessmentService,
      automationEngine
    };
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    throw error;
  }
}

// ============================================================================
// SERVICE EXPORTS
// ============================================================================

export {
  // Agent Database
  getAgentDatabase,
  initializeAgentDatabase,
  
  // Assessment Database
  getAssessmentDatabase,
  initializeAssessmentDatabase,
  
  // Assessment Integration
  getAssessmentService,
  initializeAssessmentService,
  
  // Automation Engine
  getAutomationEngine,
  initializeAutomationEngine
};

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

export async function shutdownServices() {
  console.log('🛑 Shutting down services...');
  
  try {
    const automationEngine = getAutomationEngine();
    automationEngine.stopProcessing();
    
    // Disconnect from databases
    const agentDb = getAgentDatabase();
    await agentDb.disconnect();
    
    const assessmentDb = getAssessmentDatabase();
    await assessmentDb.disconnect();
    
    const assessmentService = getAssessmentService();
    await assessmentService.disconnect();
    
    console.log('✅ All services shut down gracefully');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkServicesHealth(): Promise<{
  healthy: boolean;
  services: Record<string, boolean>;
}> {
  const health = {
    agentDb: false,
    assessmentDb: false,
    assessmentService: false,
    automationEngine: false
  };

  try {
    // Check each service
    const agentDb = getAgentDatabase();
    health.agentDb = true;
    
    const assessmentDb = getAssessmentDatabase();
    health.assessmentDb = true;
    
    const assessmentService = getAssessmentService();
    health.assessmentService = true;
    
    const automationEngine = getAutomationEngine();
    health.automationEngine = true;
  } catch (error) {
    console.error('Health check failed:', error);
  }

  const healthy = Object.values(health).every(status => status);

  return {
    healthy,
    services: health
  };
}
