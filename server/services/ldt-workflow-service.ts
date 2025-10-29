// ============================================================================
// LEAN DESIGN THINKING™ WORKFLOW SERVICE
// Comprehensive workflow management for LDT processes
// ============================================================================

import { 
  LDTWorkflow, 
  LDTPhase, 
  WorkflowStatus,
  POVStatement,
  HMWQuestion,
  Idea,
  Prototype,
  TestSession,
  LDTInsight,
  EmpathyData
} from '../ai-agents/agents/design-thinking/ldt-types';

/**
 * In-memory storage for LDT workflows
 * In production, this would be replaced with actual database operations
 */
class LDTWorkflowService {
  private workflows: Map<string, LDTWorkflow> = new Map();
  private povStatements: Map<string, POVStatement> = new Map();
  private hmwQuestions: Map<string, HMWQuestion> = new Map();
  private ideas: Map<string, Idea> = new Map();
  private prototypes: Map<string, Prototype> = new Map();
  private testSessions: Map<string, TestSession> = new Map();
  private insights: Map<string, LDTInsight> = new Map();
  private empathyData: Map<string, EmpathyData> = new Map();

  // ===========================
  // WORKFLOW OPERATIONS
  // ===========================

  async createWorkflow(data: Partial<LDTWorkflow>): Promise<LDTWorkflow> {
    const workflow: LDTWorkflow = {
      id: this.generateId(),
      projectId: data.projectId || '',
      userId: data.userId || '',
      name: data.name || 'New LDT Workflow',
      description: data.description || '',
      currentPhase: data.currentPhase || 'empathize',
      phaseProgress: data.phaseProgress || {},
      status: data.status || 'active',
      aiFacilitationEnabled: data.aiFacilitationEnabled ?? true,
      aiModelVersion: data.aiModelVersion || 'gpt-4',
      facilitationStyle: data.facilitationStyle || 'balanced',
      collaborationMode: data.collaborationMode || 'real-time',
      teamMembers: data.teamMembers || [],
      industry: data.industry,
      targetMarket: data.targetMarket,
      innovationType: data.innovationType,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.userId || ''
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async getWorkflow(workflowId: string): Promise<LDTWorkflow | null> {
    return this.workflows.get(workflowId) || null;
  }

  async getWorkflows(userId: string, filters?: {
    status?: WorkflowStatus;
    phase?: LDTPhase;
    limit?: number;
    offset?: number;
  }): Promise<LDTWorkflow[]> {
    let workflows = Array.from(this.workflows.values())
      .filter(w => w.userId === userId);

    if (filters?.status) {
      workflows = workflows.filter(w => w.status === filters.status);
    }

    if (filters?.phase) {
      workflows = workflows.filter(w => w.currentPhase === filters.phase);
    }

    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;

    return workflows.slice(offset, offset + limit);
  }

  async updateWorkflow(workflowId: string, updates: Partial<LDTWorkflow>): Promise<LDTWorkflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    const updated = {
      ...workflow,
      ...updates,
      updatedAt: new Date()
    };

    this.workflows.set(workflowId, updated);
    return updated;
  }

  async deleteWorkflow(workflowId: string): Promise<boolean> {
    return this.workflows.delete(workflowId);
  }

  async transitionPhase(workflowId: string, newPhase: LDTPhase): Promise<LDTWorkflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    workflow.currentPhase = newPhase;
    workflow.updatedAt = new Date();

    // Update phase progress
    if (!workflow.phaseProgress[newPhase]) {
      workflow.phaseProgress[newPhase] = 0;
    }

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  // ===========================
  // POV STATEMENT OPERATIONS
  // ===========================

  async createPOVStatement(data: Partial<POVStatement>): Promise<POVStatement> {
    const pov: POVStatement = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      userPersona: data.userPersona || '',
      need: data.need || '',
      insight: data.insight || '',
      supportingEmpathyData: data.supportingEmpathyData || [],
      evidenceStrength: data.evidenceStrength || 0.5,
      validated: data.validated || false,
      validationNotes: data.validationNotes,
      solutionBiasDetected: data.solutionBiasDetected || false,
      priorityScore: data.priorityScore || 50,
      selectedForIdeation: data.selectedForIdeation || false,
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.povStatements.set(pov.id, pov);
    return pov;
  }

  async getPOVStatements(workflowId: string): Promise<POVStatement[]> {
    return Array.from(this.povStatements.values())
      .filter(pov => pov.workflowId === workflowId)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  async updatePOVStatement(povId: string, updates: Partial<POVStatement>): Promise<POVStatement | null> {
    const pov = this.povStatements.get(povId);
    if (!pov) return null;

    const updated = { ...pov, ...updates };
    this.povStatements.set(povId, updated);
    return updated;
  }

  // ===========================
  // HMW QUESTION OPERATIONS
  // ===========================

  async createHMWQuestion(data: Partial<HMWQuestion>): Promise<HMWQuestion> {
    const hmw: HMWQuestion = {
      id: this.generateId(),
      povStatementId: data.povStatementId || '',
      workflowId: data.workflowId || '',
      question: data.question || '',
      reframingType: data.reframingType,
      desirabilityScore: data.desirabilityScore,
      feasibilityScore: data.feasibilityScore,
      viabilityScore: data.viabilityScore,
      voteCount: data.voteCount || 0,
      ideaCount: data.ideaCount || 0,
      selectedForIdeation: data.selectedForIdeation || false,
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.hmwQuestions.set(hmw.id, hmw);
    return hmw;
  }

  async getHMWQuestions(workflowId: string): Promise<HMWQuestion[]> {
    return Array.from(this.hmwQuestions.values())
      .filter(hmw => hmw.workflowId === workflowId)
      .sort((a, b) => b.voteCount - a.voteCount);
  }

  async voteHMWQuestion(hmwId: string): Promise<HMWQuestion | null> {
    const hmw = this.hmwQuestions.get(hmwId);
    if (!hmw) return null;

    hmw.voteCount++;
    this.hmwQuestions.set(hmwId, hmw);
    return hmw;
  }

  // ===========================
  // IDEA OPERATIONS
  // ===========================

  async createIdea(data: Partial<Idea>): Promise<Idea> {
    const idea: Idea = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      hmwQuestionId: data.hmwQuestionId,
      title: data.title || 'New Idea',
      description: data.description || '',
      category: data.category,
      userBenefit: data.userBenefit || '',
      businessValue: data.businessValue || '',
      implementationApproach: data.implementationApproach || '',
      desirabilityScore: data.desirabilityScore,
      feasibilityScore: data.feasibilityScore,
      viabilityScore: data.viabilityScore,
      innovationScore: data.innovationScore,
      impactScore: data.impactScore,
      overallScore: data.overallScore,
      aiEvaluation: data.aiEvaluation || {},
      identifiedRisks: data.identifiedRisks || [],
      identifiedOpportunities: data.identifiedOpportunities || [],
      synergies: data.synergies || [],
      status: data.status || 'draft',
      selectedForPrototyping: data.selectedForPrototyping || false,
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.ideas.set(idea.id, idea);
    return idea;
  }

  async getIdeas(workflowId: string): Promise<Idea[]> {
    return Array.from(this.ideas.values())
      .filter(idea => idea.workflowId === workflowId)
      .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
  }

  async updateIdea(ideaId: string, updates: Partial<Idea>): Promise<Idea | null> {
    const idea = this.ideas.get(ideaId);
    if (!idea) return null;

    const updated = { ...idea, ...updates };
    this.ideas.set(ideaId, updated);
    return updated;
  }

  // ===========================
  // PROTOTYPE OPERATIONS
  // ===========================

  async createPrototype(data: Partial<Prototype>): Promise<Prototype> {
    const prototype: Prototype = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      ideaId: data.ideaId,
      name: data.name || 'New Prototype',
      description: data.description || '',
      fidelity: data.fidelity || 'low',
      prototypeType: data.prototypeType || 'sketch',
      learningGoals: data.learningGoals || [],
      hypotheses: data.hypotheses || [],
      files: data.files || [],
      links: data.links || [],
      effortEstimate: data.effortEstimate,
      costEstimate: data.costEstimate,
      testPlanId: data.testPlanId,
      testResults: data.testResults || [],
      status: data.status || 'planning',
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.prototypes.set(prototype.id, prototype);
    return prototype;
  }

  async getPrototypes(workflowId: string): Promise<Prototype[]> {
    return Array.from(this.prototypes.values())
      .filter(p => p.workflowId === workflowId);
  }

  async updatePrototype(prototypeId: string, updates: Partial<Prototype>): Promise<Prototype | null> {
    const prototype = this.prototypes.get(prototypeId);
    if (!prototype) return null;

    const updated = { ...prototype, ...updates };
    this.prototypes.set(prototypeId, updated);
    return updated;
  }

  // ===========================
  // TEST SESSION OPERATIONS
  // ===========================

  async createTestSession(data: Partial<TestSession>): Promise<TestSession> {
    const session: TestSession = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      prototypeId: data.prototypeId || '',
      sessionName: data.sessionName || 'Test Session',
      testMethodology: data.testMethodology || 'usability',
      participantPersona: data.participantPersona || '',
      participantDemographics: data.participantDemographics || {},
      scheduledAt: data.scheduledAt || new Date(),
      durationMinutes: data.durationMinutes || 60,
      facilitatorId: data.facilitatorId || '',
      recordingUrl: data.recordingUrl,
      transcription: data.transcription,
      observations: data.observations || '',
      feedback: data.feedback || [],
      metrics: data.metrics || {},
      aiSynthesis: data.aiSynthesis || {},
      sentimentAnalysis: data.sentimentAnalysis || {},
      keyFindings: data.keyFindings || [],
      status: data.status || 'scheduled',
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.testSessions.set(session.id, session);
    return session;
  }

  async getTestSessions(workflowId: string): Promise<TestSession[]> {
    return Array.from(this.testSessions.values())
      .filter(s => s.workflowId === workflowId);
  }

  async updateTestSession(sessionId: string, updates: Partial<TestSession>): Promise<TestSession | null> {
    const session = this.testSessions.get(sessionId);
    if (!session) return null;

    const updated = { ...session, ...updates };
    this.testSessions.set(sessionId, updated);
    return updated;
  }

  // ===========================
  // INSIGHT OPERATIONS
  // ===========================

  async createInsight(data: Partial<LDTInsight>): Promise<LDTInsight> {
    const insight: LDTInsight = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      phase: data.phase || 'empathize',
      insightType: data.insightType || 'pattern',
      title: data.title || 'New Insight',
      content: data.content || '',
      confidenceScore: data.confidenceScore || 0.5,
      impactScore: data.impactScore || 0.5,
      actionabilityScore: data.actionabilityScore || 0.5,
      sourceData: data.sourceData || {},
      relatedEntities: data.relatedEntities || [],
      aiModelVersion: data.aiModelVersion || 'gpt-4',
      generationMethod: data.generationMethod || 'ai',
      acknowledged: data.acknowledged || false,
      actedUpon: data.actedUpon || false,
      userFeedback: data.userFeedback,
      createdAt: new Date()
    };

    this.insights.set(insight.id, insight);
    return insight;
  }

  async getInsights(workflowId: string, filters?: {
    phase?: LDTPhase;
    type?: string;
    limit?: number;
  }): Promise<LDTInsight[]> {
    let insights = Array.from(this.insights.values())
      .filter(i => i.workflowId === workflowId);

    if (filters?.phase) {
      insights = insights.filter(i => i.phase === filters.phase);
    }

    if (filters?.type) {
      insights = insights.filter(i => i.insightType === filters.type);
    }

    // Sort by impact and confidence
    insights.sort((a, b) => {
      const scoreA = a.impactScore * a.confidenceScore;
      const scoreB = b.impactScore * b.confidenceScore;
      return scoreB - scoreA;
    });

    const limit = filters?.limit || insights.length;
    return insights.slice(0, limit);
  }

  // ===========================
  // EMPATHY DATA OPERATIONS
  // ===========================

  async createEmpathyData(data: Partial<EmpathyData>): Promise<EmpathyData> {
    const empathy: EmpathyData = {
      id: this.generateId(),
      workflowId: data.workflowId || '',
      dataType: data.dataType || 'interview',
      participantPersona: data.participantPersona || '',
      participantDemographics: data.participantDemographics || {},
      rawData: data.rawData || '',
      transcription: data.transcription,
      recordingUrl: data.recordingUrl,
      insights: data.insights || [],
      painPoints: data.painPoints || [],
      needs: data.needs || [],
      behaviors: data.behaviors || [],
      emotions: data.emotions || [],
      aiAnalyzed: data.aiAnalyzed || false,
      aiInsights: data.aiInsights || {},
      sentimentScore: data.sentimentScore,
      createdAt: new Date(),
      createdBy: data.createdBy || ''
    };

    this.empathyData.set(empathy.id, empathy);
    return empathy;
  }

  async getEmpathyData(workflowId: string): Promise<EmpathyData[]> {
    return Array.from(this.empathyData.values())
      .filter(e => e.workflowId === workflowId);
  }

  // ===========================
  // UTILITY METHODS
  // ===========================

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async getWorkflowSummary(workflowId: string): Promise<any> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) return null;

    const empathyData = await this.getEmpathyData(workflowId);
    const povStatements = await this.getPOVStatements(workflowId);
    const hmwQuestions = await this.getHMWQuestions(workflowId);
    const ideas = await this.getIdeas(workflowId);
    const prototypes = await this.getPrototypes(workflowId);
    const testSessions = await this.getTestSessions(workflowId);
    const insights = await this.getInsights(workflowId);

    return {
      workflow,
      stats: {
        empathyDataCount: empathyData.length,
        povStatementCount: povStatements.length,
        hmwQuestionCount: hmwQuestions.length,
        ideaCount: ideas.length,
        prototypeCount: prototypes.length,
        testSessionCount: testSessions.length,
        insightCount: insights.length
      },
      recentActivity: {
        latestInsights: insights.slice(0, 5),
        topIdeas: ideas.slice(0, 5),
        recentTests: testSessions.slice(0, 3)
      }
    };
  }
}

// Export singleton instance
export const dtWorkflowService = new LDTWorkflowService();
