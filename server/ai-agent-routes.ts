
import express from "express";
import { isAuthenticated } from "./auth-middleware";
import { AgentEngine, AgentRequest } from "./ai-agents/core/agent-engine";
import { UserType } from "../shared/schema";
import { storage } from "./storage";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const createGoalSchema = z.object({
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
});

const updateGoalSchema = z.object({
  description: z.string().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
  progress: z.number().min(0).max(100).optional()
});

const createCommitmentSchema = z.object({
  description: z.string().min(1),
  dueDate: z.string().datetime()
});

const decisionRequestSchema = z.object({
  decision: z.string().min(1),
  options: z.array(z.string()).optional()
});

const chatRequestSchema = z.object({
  message: z.string().min(1),
  mode: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string(),
    mode: z.string().optional()
  })).optional()
});

// Initialize agent engine with Azure OpenAI configuration
const agentEngine = new AgentEngine({
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
  model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  useAzure: process.env.AZURE_OPENAI_ENDPOINT ? true : false
});

// Chat with AI agent
router.post("/chat", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const { message, taskType = 'general', streaming = false } = req.body;
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: user.claims.user_type || UserType.ENTREPRENEUR,
      message,
      taskType,
      streaming
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json(response);
  } catch (error) {
    console.error("AI agent error:", error);
    res.status(500).json({ 
      content: "I'm having trouble processing your request right now. Please try again.",
      error: "Agent processing failed"
    });
  }
});

// Get agent suggestions based on context
router.post("/suggestions", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const { context, userType } = req.body;
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: userType || UserType.ENTREPRENEUR,
      message: "Get contextual suggestions",
      taskType: 'suggestions',
      context
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json({
      suggestions: response.suggestions || [],
      insights: response.insights || []
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    res.status(500).json({ 
      suggestions: [],
      error: "Failed to get suggestions"
    });
  }
});

// Get agent insights for dashboard
router.get("/insights", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const userType = req.query.userType || UserType.ENTREPRENEUR;
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: userType as UserType,
      message: "Generate dashboard insights",
      taskType: 'insights'
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json({
      insights: response.insights || [],
      actions: response.actions || []
    });
  } catch (error) {
    console.error("AI insights error:", error);
    res.status(500).json({ 
      insights: [],
      error: "Failed to generate insights"
    });
  }
});

// Execute agent automation
router.post("/automate", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const { task, parameters } = req.body;
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: user.claims.user_type || UserType.ENTREPRENEUR,
      message: `Automate: ${task}`,
      taskType: 'automation',
      context: parameters
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json({
      success: true,
      result: response.content,
      actions: response.actions || []
    });
  } catch (error) {
    console.error("AI automation error:", error);
    res.status(500).json({ 
      success: false,
      error: "Automation failed"
    });
  }
});

// Co-Founder Agent specific routes
router.post("/co-founder/chat", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const validatedData = chatRequestSchema.parse(req.body);
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: UserType.ENTREPRENEUR,
      message: validatedData.message,
      taskType: validatedData.mode || 'general',
      context: { conversationHistory: validatedData.conversationHistory }
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Co-Founder chat error:", error);
    res.status(500).json({ 
      content: "I'm having trouble right now. Let's try that again.",
      error: "Co-Founder processing failed"
    });
  }
});

// Goals management
router.get("/co-founder/goals", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const goals = storage.getGoalsByUserId(user.claims.sub);
    res.json(goals);
  } catch (error) {
    console.error("Goals fetch error:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

router.post("/co-founder/goals", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const validatedData = createGoalSchema.parse(req.body);
    
    const goal = storage.createGoal({
      userId: user.claims.sub,
      ...validatedData
    });
    
    res.json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Goal creation error:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

router.patch("/co-founder/goals/:id", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);
    
    // Verify ownership before updating
    const existingGoal = storage.getGoalById(id);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    
    if (existingGoal.userId !== user.claims.sub) {
      return res.status(403).json({ error: "Unauthorized to update this goal" });
    }
    
    const goal = storage.updateGoal(id, validatedData);
    
    res.json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Goal update error:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// Commitments
router.get("/co-founder/commitments", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const commitments = storage.getCommitmentsByUserId(user.claims.sub);
    res.json(commitments);
  } catch (error) {
    console.error("Commitments fetch error:", error);
    res.status(500).json({ error: "Failed to fetch commitments" });
  }
});

router.post("/co-founder/commitments", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const validatedData = createCommitmentSchema.parse(req.body);
    
    const commitment = storage.createCommitment({
      userId: user.claims.sub,
      ...validatedData
    });
    
    res.json(commitment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Commitment creation error:", error);
    res.status(500).json({ error: "Failed to create commitment" });
  }
});

// Decision support
router.post("/co-founder/decision/analyze", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const validatedData = decisionRequestSchema.parse(req.body);
    
    const request: AgentRequest = {
      userId: user.claims.sub,
      userType: UserType.ENTREPRENEUR,
      message: validatedData.decision,
      taskType: 'decision_support',
      context: { options: validatedData.options }
    };
    
    const response = await agentEngine.processRequest(request);
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Decision analysis error:", error);
    res.status(500).json({ error: "Failed to analyze decision" });
  }
});

router.post("/co-founder/decision/scenarios", isAuthenticated, async (req, res) => {
  try {
    const validatedData = z.object({ decision: z.string().min(1) }).parse(req.body);
    const { decision } = validatedData;
    
    // Mock scenario analysis
    res.json({
      scenarios: {
        bestCase: {
          description: "Everything exceeds expectations",
          probability: 20,
          outcomes: ["Strong market reception", "Rapid growth", "Team morale high"]
        },
        likelyCase: {
          description: "Mixed results requiring adjustments",
          probability: 60,
          outcomes: ["Moderate traction", "Some pivots needed", "Extended timeline"]
        },
        worstCase: {
          description: "Significant challenges emerge",
          probability: 20,
          outcomes: ["Low adoption", "Resource constraints", "Strategy revision needed"]
        }
      },
      earlyWarningSignals: [
        "Customer engagement below targets",
        "Burn rate exceeding budget",
        "Team concerns emerging"
      ]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Scenario analysis error:", error);
    res.status(500).json({ error: "Failed to analyze scenarios" });
  }
});

router.post("/co-founder/decision/premortem", isAuthenticated, async (req, res) => {
  try {
    const validatedData = z.object({ decision: z.string().min(1) }).parse(req.body);
    const { decision } = validatedData;
    
    // Mock premortem analysis
    res.json({
      decision,
      potentialFailures: [
        { reason: "Insufficient market validation", likelihood: "medium", impact: "high" },
        { reason: "Resource constraints emerge", likelihood: "high", impact: "medium" },
        { reason: "Team misalignment on execution", likelihood: "low", impact: "high" }
      ],
      mitigationStrategies: [
        "Conduct targeted customer interviews before full commit",
        "Build resource buffer into timeline",
        "Hold alignment session with all stakeholders"
      ],
      earlyWarningSignals: [
        "Customer feedback trending negative",
        "Budget tracking shows overruns",
        "Team velocity declining"
      ]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Premortem analysis error:", error);
    res.status(500).json({ error: "Failed to run premortem" });
  }
});

export default router;
