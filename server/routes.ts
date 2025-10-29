import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./auth-middleware";
import { z } from "zod";
import { aiService } from "./ai-service";
import aiAgentRoutes from "./ai-agent-routes";
import documentAIRoutes from "./routes/document-ai-routes";
import enhancedLDTRoutes from "./routes/enhanced-ldt-routes";
import ldtComprehensiveRoutes from "./routes/ldt-comprehensive-routes";
// import assessmentRoutes from "./routes/assessment-routes";
import iterativePlanRoutes from "./routes/iterative-plan-routes";
import userRoutes from "./routes/user-routes";
import investmentRoutes from "./routes/investment-routes";
import creditRoutes from "./routes/credit-routes";
import organizationRoutes from "./routes/organization-routes";
import loanRoutes from "./routes/loan-routes";
import advisoryRoutes from "./routes/advisory-routes";
import teamRoutes from "./routes/team-routes";
import { AIInfographicService } from "./ai-infographic-service";
import { InfographicExportService } from "./infographic-export-service";
import { aiApplicationFiller } from "./ai-application-filler";
import { logger } from "./utils/logger";
import { UnauthorizedError, asyncHandler, assertExists } from "./utils/errors";
import * as ValidationSchemas from "../shared/types/validation";

interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
      preferred_username?: string;
      first_name?: string;
      last_name?: string;
      given_name?: string;
      family_name?: string;
      profile_image_url?: string | null;
      picture?: string;
    };
  };
}

function getUserId(req: Request): string {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user?.claims?.sub) {
    throw new UnauthorizedError('User not authenticated');
  }
  return authReq.user.claims.sub;
}

function handleError(res: Response, error: unknown, defaultMessage: string): void {
  logger.error(defaultMessage, error instanceof Error ? error : undefined);
  
  if (error instanceof z.ZodError) {
    res.status(400).json({ 
      message: 'Validation error', 
      errors: error.errors 
    });
    return;
  }
  
  if (error instanceof Error) {
    res.status(500).json({ 
      message: defaultMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    return;
  }
  
  res.status(500).json({ message: defaultMessage });
}

// Simple validation schemas for MongoDB
const insertBusinessPlanSchema = z.object({
  userId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_]+$/),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().optional(),
  industry: z.string().max(100).trim().optional(),
  stage: z.enum(['idea', 'prototype', 'mvp', 'growth', 'scale']).optional(),
});

const insertPlanSectionSchema = z.object({
  businessPlanId: z.string(),
  chapterId: z.string(),
  sectionId: z.string(),
  content: z.string(),
});

const insertFinancialDataSchema = z.object({
  businessPlanId: z.string(),
  year: z.number(),
  revenue: z.number(),
  expenses: z.number(),
  profit: z.number(),
  cashFlow: z.number(),
});

// Use properly typed schemas from shared/types/validation
const insertAnalysisScoreSchema = ValidationSchemas.InsertAnalysisScoreSchema;

const insertProgramSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

const insertCohortSchema = z.object({
  programId: z.string(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

const insertPortfolioSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

const insertPortfolioCompanySchema = z.object({
  portfolioId: z.string(),
  cohortId: z.string().optional(),
  companyName: z.string(),
  industry: z.string(),
  stage: z.string(),
  website: z.string().optional(),
  description: z.string().optional(),
});

const insertEducationalModuleSchema = z.object({
  creatorId: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
});

const insertMentorshipSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
  programId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.string(), // e.g., 'active', 'completed', 'cancelled'
});

const insertVentureProjectSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  // Add other relevant fields for venture projects
});

const insertPitchDeckSchema = ValidationSchemas.InsertPitchDeckSchema;

const insertInvestmentSchema = z.object({
  planId: z.string(),
  investorId: z.string(),
  amount: z.number(),
  date: z.date(),
  // Add other relevant fields for investments
});

const insertLoanSchema = z.object({
  planId: z.string(),
  lenderId: z.string(),
  amount: z.number(),
  interestRate: z.number(),
  termMonths: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  // Add other relevant fields for loans
});

const insertAdvisoryServiceSchema = z.object({
  planId: z.string(),
  partnerId: z.string(),
  serviceType: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

const insertCreditScoreSchema = z.object({
  userId: z.string(),
  score: z.number(),
  date: z.date(),
  // Add other relevant fields for credit scores
});

const insertFinancialMilestoneSchema = z.object({
  userId: z.string(),
  description: z.string(),
  date: z.date(),
  amount: z.number().optional(),
  // Add other relevant fields for financial milestones
});

const insertAiCoachingMessageSchema = z.object({
  userId: z.string(),
  sender: z.enum(['user', 'ai']),
  message: z.string(),
  timestamp: z.date(),
  // Add other relevant fields for AI coaching messages
});

const insertCreditTipSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
  // Add other relevant fields for credit tips
});

const insertUserCreditTipSchema = z.object({
  userId: z.string(),
  creditTipId: z.string(),
  viewed: z.boolean().default(false),
  // Add other relevant fields for user credit tips
});

const insertFinancialProjectionSchema = z.object({
  businessPlanId: z.string(),
  year: z.number(),
  revenue: z.number(),
  expenses: z.number(),
  profit: z.number(),
  // Add other relevant fields for financial projections
});

const insertAiBusinessAnalysisSchema = z.object({
  businessPlanId: z.string(),
  overallScore: z.number(),
  scores: z.record(z.string(), z.number()),
  feedback: z.record(z.string(), z.string()),
  recommendations: z.array(z.string()),
  // Add other relevant fields for AI business analysis
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for business plans
  const apiRouter = express.Router();

  // Business Plans
  apiRouter.get("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const plans = await storage.getBusinessPlans(userId);
      res.json(plans);
    } catch (error) {
      handleError(res, error, "Failed to fetch business plans");
    }
  });

  // User info endpoint
  apiRouter.get("/user", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const claims = authReq.user?.claims;
      
      if (!claims) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      res.json({
        id: claims.sub,
        email: claims.email || claims.preferred_username || '',
        firstName: claims.first_name || claims.given_name || '',
        lastName: claims.last_name || claims.family_name || '',
        profileImageUrl: claims.profile_image_url || claims.picture,
        userType: 'ENTREPRENEUR'
      });
    } catch (error) {
      handleError(res, error, "Failed to fetch user info");
    }
  });

  apiRouter.get("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);
      const plan = await storage.getBusinessPlan(id);

      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }

      if (plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(plan);
    } catch (error) {
      handleError(res, error, "Failed to fetch business plan");
    }
  });

  apiRouter.post("/business-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validatedData = insertBusinessPlanSchema.parse({
        ...req.body,
        userId
      });
      const plan = await storage.createBusinessPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      handleError(res, error, "Failed to create business plan");
    }
  });

  apiRouter.patch("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      const existingPlan = await storage.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const plan = await storage.updateBusinessPlan(id, req.body);
      if (!plan) {
        return res.status(404).json({ message: "Business plan not found" });
      }

      res.json(plan);
    } catch (error) {
      handleError(res, error, "Failed to update business plan");
    }
  });

  apiRouter.delete("/business-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      const existingPlan = await storage.getBusinessPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const success = await storage.deleteBusinessPlan(id);
      if (!success) {
        return res.status(404).json({ message: "Business plan not found" });
      }

      res.status(204).end();
    } catch (error) {
      handleError(res, error, "Failed to delete business plan");
    }
  });

  // Plan Sections
  apiRouter.get("/business-plans/:planId/sections", isAuthenticated, async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const user = req.user as any;
      const userId = user.claims.sub;

      // Check plan ownership
      const plan = await storage.getBusinessPlan(planId);
      if (!plan || plan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const sections = await storage.getPlanSections(planId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan sections" });
    }
  });

  apiRouter.get("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const section = await storage.getPlanSection(id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }

      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch section" });
    }
  });

  apiRouter.post("/business-plans/:planId/sections", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const validatedData = insertPlanSectionSchema.parse({
        ...req.body,
        businessPlanId: planId
      });

      const section = await storage.createPlanSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid section data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create section" });
    }
  });

  apiRouter.patch("/business-plans/:planId/sections/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const section = await storage.updatePlanSection(id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }

      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to update section" });
    }
  });

  // Financial Data
  apiRouter.get("/business-plans/:planId/financial-data", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const data = await storage.getFinancialData(planId);
      if (!data) {
        return res.status(404).json({ message: "Financial data not found" });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial data" });
    }
  });

  apiRouter.post("/business-plans/:planId/financial-data", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const validatedData = insertFinancialDataSchema.parse({
        ...req.body,
        businessPlanId: planId
      });

      const data = await storage.createFinancialData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid financial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial data" });
    }
  });

  apiRouter.patch("/business-plans/:planId/financial-data/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const data = await storage.updateFinancialData(id, req.body);
      if (!data) {
        return res.status(404).json({ message: "Financial data not found" });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial data" });
    }
  });

  // Analysis Scores
  apiRouter.get("/business-plans/:planId/analysis", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const score = await storage.getAnalysisScore(planId);
      if (!score) {
        return res.status(404).json({ message: "Analysis score not found" });
      }

      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis score" });
    }
  });

  apiRouter.post("/business-plans/:planId/analysis", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      const validatedData = insertAnalysisScoreSchema.parse({
        ...req.body,
        businessPlanId: planId
      });

      const score = await storage.createAnalysisScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analysis score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analysis score" });
    }
  });

  apiRouter.patch("/business-plans/:planId/analysis/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const score = await storage.updateAnalysisScore(id, req.body);
      if (!score) {
        return res.status(404).json({ message: "Analysis score not found" });
      }

      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to update analysis score" });
    }
  });

  // Pitch Decks
  apiRouter.get("/pitch-decks/:planId", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings
      const deck = await storage.getPitchDeck(planId);
      res.json(deck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pitch deck" });
    }
  });

  apiRouter.post("/pitch-decks", async (req, res) => {
    try {
      const validatedData = insertPitchDeckSchema.parse(req.body);
      const deck = await storage.createPitchDeck(validatedData);
      res.status(201).json(deck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid pitch deck data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create pitch deck" });
    }
  });

  // Investments
  apiRouter.get("/investments/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings
      const investments = await storage.getInvestments(planId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  apiRouter.get("/investments/investor/:investorId", async (req, res) => {
    try {
      const investorId = req.params.investorId; // MongoDB IDs are strings
      const investments = await storage.getInvestmentsByInvestor(investorId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  apiRouter.post("/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  apiRouter.patch("/investments/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const investment = await storage.updateInvestment(id, req.body);
      if (!investment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.json(investment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update investment" });
    }
  });

  // Loans
  apiRouter.get("/loans/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings
      const loans = await storage.getLoans(planId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  apiRouter.get("/loans/lender/:lenderId", async (req, res) => {
    try {
      const lenderId = req.params.lenderId; // MongoDB IDs are strings
      const loans = await storage.getLoansByLender(lenderId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  apiRouter.post("/loans", async (req, res) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid loan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan" });
    }
  });

  apiRouter.patch("/loans/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const loan = await storage.updateLoan(id, req.body);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update loan" });
    }
  });

  // Advisory Services
  apiRouter.get("/advisory-services/plan/:planId", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings
      const services = await storage.getAdvisoryServices(planId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });

  apiRouter.get("/advisory-services/partner/:partnerId", async (req, res) => {
    try {
      const partnerId = req.params.partnerId; // MongoDB IDs are strings
      const services = await storage.getAdvisoryServicesByPartner(partnerId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advisory services" });
    }
  });

  apiRouter.post("/advisory-services", async (req, res) => {
    try {
      const validatedData = insertAdvisoryServiceSchema.parse(req.body);
      const service = await storage.createAdvisoryService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid advisory service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create advisory service" });
    }
  });

  apiRouter.patch("/advisory-services/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const service = await storage.updateAdvisoryService(id, req.body);
      if (!service) {
        return res.status(404).json({ message: "Advisory service not found" });
      }

      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to update advisory service" });
    }
  });

  // Programs (Accelerator/Incubator)
  apiRouter.get("/programs/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId; // MongoDB IDs are strings
      const programs = await storage.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  apiRouter.post("/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  apiRouter.patch("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const program = await storage.updateProgram(id, req.body);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  apiRouter.delete("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deleteProgram(id);
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Cohorts
  apiRouter.get("/cohorts/program/:programId", async (req, res) => {
    try {
      const programId = req.params.programId; // MongoDB IDs are strings
      const cohorts = await storage.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });

  apiRouter.get("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const cohort = await storage.getCohort(id);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }

      res.json(cohort);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohort" });
    }
  });

  apiRouter.post("/cohorts", async (req, res) => {
    try {
      const validatedData = insertCohortSchema.parse(req.body);
      const cohort = await storage.createCohort(validatedData);
      res.status(201).json(cohort);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cohort data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cohort" });
    }
  });

  apiRouter.patch("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const cohort = await storage.updateCohort(id, req.body);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }

      res.json(cohort);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cohort" });
    }
  });

  apiRouter.delete("/cohorts/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deleteCohort(id);
      if (!success) {
        return res.status(404).json({ message: "Cohort not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cohort" });
    }
  });

  // Portfolios
  apiRouter.get("/portfolios/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId; // MongoDB IDs are strings
      const portfolios = await storage.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  apiRouter.post("/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  apiRouter.patch("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const portfolio = await storage.updatePortfolio(id, req.body);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to update portfolio" });
    }
  });

  apiRouter.delete("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deletePortfolio(id);
      if (!success) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });

  // Portfolio Companies
  apiRouter.get("/portfolio-companies/portfolio/:portfolioId", async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId; // MongoDB IDs are strings
      const companies = await storage.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });

  apiRouter.get("/portfolio-companies/cohort/:cohortId", async (req, res) => {
    try {
      const cohortId = req.params.cohortId; // MongoDB IDs are strings
      const companies = await storage.getPortfolioCompaniesByCohort(cohortId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });

  apiRouter.get("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const company = await storage.getPortfolioCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio company" });
    }
  });

  apiRouter.post("/portfolio-companies", async (req, res) => {
    try {
      const validatedData = insertPortfolioCompanySchema.parse(req.body);
      const company = await storage.createPortfolioCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio company data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio company" });
    }
  });

  apiRouter.patch("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const company = await storage.updatePortfolioCompany(id, req.body);
      if (!company) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to update portfolio company" });
    }
  });

  apiRouter.delete("/portfolio-companies/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deletePortfolioCompany(id);
      if (!success) {
        return res.status(404).json({ message: "Portfolio company not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio company" });
    }
  });

  // Educational Modules
  apiRouter.get("/educational-modules/creator/:creatorId", async (req, res) => {
    try {
      const creatorId = req.params.creatorId; // MongoDB IDs are strings
      const modules = await storage.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });

  apiRouter.get("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const module = await storage.getEducationalModule(id);
      if (!module) {
        return res.status(404).json({ message: "Educational module not found" });
      }

      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational module" });
    }
  });

  apiRouter.post("/educational-modules", async (req, res) => {
    try {
      const validatedData = insertEducationalModuleSchema.parse(req.body);
      const module = await storage.createEducationalModule(validatedData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid educational module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create educational module" });
    }
  });

  apiRouter.patch("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const module = await storage.updateEducationalModule(id, req.body);
      if (!module) {
        return res.status(404).json({ message: "Educational module not found" });
      }

      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to update educational module" });
    }
  });

  apiRouter.delete("/educational-modules/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deleteEducationalModule(id);
      if (!success) {
        return res.status(404).json({ message: "Educational module not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete educational module" });
    }
  });

  // Mentorships
  apiRouter.get("/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorId = req.params.mentorId; // MongoDB IDs are strings
      const mentorships = await storage.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });

  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId; // MongoDB IDs are strings
      const mentorships = await storage.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });

  apiRouter.get("/mentorships/program/:programId", async (req, res) => {
    try {
      const programId = req.params.programId; // MongoDB IDs are strings
      const mentorships = await storage.getMentorshipsByProgram(programId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });

  apiRouter.get("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const mentorship = await storage.getMentorship(id);
      if (!mentorship) {
        return res.status(404).json({ message: "Mentorship not found" });
      }

      res.json(mentorship);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorship" });
    }
  });

  apiRouter.post("/mentorships", async (req, res) => {
    try {
      const validatedData = insertMentorshipSchema.parse(req.body);
      const mentorship = await storage.createMentorship(validatedData);
      res.status(201).json(mentorship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mentorship data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mentorship" });
    }
  });

  apiRouter.patch("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const mentorship = await storage.updateMentorship(id, req.body);
      if (!mentorship) {
        return res.status(404).json({ message: "Mentorship not found" });
      }

      res.json(mentorship);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mentorship" });
    }
  });

  apiRouter.delete("/mentorships/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deleteMentorship(id);
      if (!success) {
        return res.status(404).json({ message: "Mentorship not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mentorship" });
    }
  });

  // Venture Projects
  apiRouter.get("/venture-projects/organization/:organizationId", async (req, res) => {
    try {
      const organizationId = req.params.organizationId; // MongoDB IDs are strings
      const projects = await storage.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });

  apiRouter.get("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const project = await storage.getVentureProject(id);
      if (!project) {
        return res.status(404).json({ message: "Venture project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture project" });
    }
  });

  apiRouter.post("/venture-projects", async (req, res) => {
    try {
      const validatedData = insertVentureProjectSchema.parse(req.body);
      const project = await storage.createVentureProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid venture project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create venture project" });
    }
  });

  apiRouter.patch("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const project = await storage.updateVentureProject(id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Venture project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update venture project" });
    }
  });

  apiRouter.delete("/venture-projects/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const success = await storage.deleteVentureProject(id);
      if (!success) {
        return res.status(404).json({ message: "Venture project not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete venture project" });
    }
  });

  // Program operations (Accelerator/Incubator)
  apiRouter.get("/programs", async (req, res) => {
    try {
      // For demo, using organization ID 1
      const organizationId = "1"; // Assuming organizationId is a string for MongoDB
      const programs = await storage.getPrograms(organizationId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  apiRouter.get("/programs/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  // Cohort operations
  apiRouter.get("/programs/:programId/cohorts", async (req, res) => {
    try {
      const programId = req.params.programId; // MongoDB IDs are strings
      const cohorts = await storage.getCohorts(programId);
      res.json(cohorts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cohorts" });
    }
  });

  // Portfolio operations
  apiRouter.get("/portfolios", async (req, res) => {
    try {
      // For demo, using organization ID 1
      const organizationId = "1"; // Assuming organizationId is a string for MongoDB
      const portfolios = await storage.getPortfolios(organizationId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  apiRouter.get("/portfolios/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Portfolio company operations
  apiRouter.get("/portfolios/:portfolioId/companies", async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId; // MongoDB IDs are strings
      const companies = await storage.getPortfolioCompanies(portfolioId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio companies" });
    }
  });

  // Educational module operations
  apiRouter.get("/educational-modules", async (req, res) => {
    try {
      // For demo, using creator ID 1
      const creatorId = "1"; // Assuming creatorId is a string for MongoDB
      const modules = await storage.getEducationalModules(creatorId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational modules" });
    }
  });

  // Mentorship operations
  apiRouter.get("/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorId = req.params.mentorId; // MongoDB IDs are strings
      const mentorships = await storage.getMentorshipsByMentor(mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });

  apiRouter.get("/mentorships/mentee/:menteeId", async (req, res) => {
    try {
      const menteeId = req.params.menteeId; // MongoDB IDs are strings
      const mentorships = await storage.getMentorshipsByMentee(menteeId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorships" });
    }
  });

  // Venture project operations
  apiRouter.get("/venture-projects", async (req, res) => {
    try {
      // For demo, using organization ID 1
      const organizationId = "1"; // Assuming organizationId is a string for MongoDB
      const projects = await storage.getVentureProjects(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venture projects" });
    }
  });

  // Dashboard summary data
  apiRouter.get("/dashboard-summary", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;

      // Fetching necessary data for the dashboard
      const businessPlans = await storage.getBusinessPlans(userId);
      let financialData = [];
      let analysisScores = [];

      for (const plan of businessPlans) {
        const planFinancial = await storage.getFinancialData(plan.id);
        if (planFinancial) {
          financialData.push(planFinancial);
        }

        const planAnalysis = await storage.getAnalysisScore(plan.id);
        if (planAnalysis) {
          analysisScores.push(planAnalysis);
        }
      }

      // Return dashboard summary data
      res.json({
        totalPlans: businessPlans.length,
        financialData,
        analysisScores
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  // Demo data for testing without connecting to OpenAI
  apiRouter.post("/analyze-plan", async (req, res) => {
    try {
      // Generate demo analysis response
      const demoResponse = {
        overall_score: 85,
        scores: {
          business_model: 88,
          market_analysis: 82,
          financial_projections: 79,
          team_assessment: 92,
          value_proposition: 85,
          competitive_analysis: 81,
          go_to_market: 76,
          risk_assessment: 73
        },
        feedback: {
          business_model: "The business model shows strong revenue streams and clear monetization strategy. Consider exploring additional revenue channels.",
          market_analysis: "Good market research with clear target segments. Could benefit from more detailed competitor analysis.",
          financial_projections: "Financial projections are realistic but could use more detailed expense breakdowns for years 3-5.",
          team_assessment: "Strong founding team with complementary skills. Consider adding advisory board members with industry expertise.",
          value_proposition: "Clear and compelling value proposition. Could strengthen by quantifying benefits more precisely.",
          competitive_analysis: "Good understanding of direct competitors. Expand analysis to include potential market entrants.",
          go_to_market: "Strategy is sound but timeline may be optimistic. Consider more gradual rollout approach.",
          risk_assessment: "Major risks identified, but mitigation strategies could be more comprehensive."
        },
        recommendations: [
          "Develop more detailed financial projections for years 3-5",
          "Add 2-3 industry experts to advisory board",
          "Quantify value proposition with more specific metrics and case studies",
          "Expand competitive analysis to include indirect competitors and potential market entrants",
          "Revise go-to-market timeline to be more realistic given resources"
        ]
      };

      // Return the demo analysis
      res.json(demoResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze business plan" });
    }
  });

  // Advanced Dashboard endpoints
  apiRouter.get("/dashboard/advanced", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as string || '30d';

      // Mock advanced analytics data - replace with actual calculations
      const dashboardData = {
        metrics: {
          totalRevenue: 485000,
          revenueGrowth: 23.5,
          userGrowth: 18.2,
          conversionRate: 12.8,
          burnRate: 45000,
          runway: 18.5,
          activeUsers: 12470,
          churnRate: 5.2,
          ltv: 4500,
          cac: 320
        },
        analytics: {
          revenueForecasting: [
            { month: "Jan", predicted: 42000, actual: 41200, confidence: 0.92 },
            { month: "Feb", predicted: 46000, actual: 47800, confidence: 0.89 },
            { month: "Mar", predicted: 52000, actual: 51200, confidence: 0.91 },
            { month: "Apr", predicted: 58000, confidence: 0.87 },
            { month: "May", predicted: 64000, confidence: 0.85 },
            { month: "Jun", predicted: 72000, confidence: 0.83 }
          ],
          userGrowthPrediction: [
            { month: "Jan", predicted: 10000, lowerBound: 9500, upperBound: 10500 },
            { month: "Feb", predicted: 11500, lowerBound: 10800, upperBound: 12200 },
            { month: "Mar", predicted: 13200, lowerBound: 12300, upperBound: 14100 },
            { month: "Apr", predicted: 15100, lowerBound: 13900, upperBound: 16300 },
            { month: "May", predicted: 17200, lowerBound: 15700, upperBound: 18700 },
            { month: "Jun", predicted: 19600, lowerBound: 17800, upperBound: 21400 }
          ],
          riskFactors: [
            { factor: "Market Saturation", probability: 65, impact: "High", mitigation: "Expand to new markets" },
            { factor: "Competition Increase", probability: 78, impact: "Medium", mitigation: "Strengthen USP" },
            { factor: "Economic Downturn", probability: 42, impact: "High", mitigation: "Diversify revenue streams" }
          ],
          marketOpportunities: [
            { opportunity: "AI Integration", score: 89, timeline: "3-6 months", potential: "$120K ARR" },
            { opportunity: "Mobile App", score: 76, timeline: "6-9 months", potential: "$80K ARR" },
            { opportunity: "Enterprise Sales", score: 94, timeline: "2-4 months", potential: "$200K ARR" }
          ]
        }
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advanced dashboard data" });
    }
  });

  // Valuation Dashboard endpoints
  apiRouter.get("/valuation/:planId", async (req, res) => {
    try {
      const planId = req.params.planId; // MongoDB IDs are strings

      // Get all necessary data for the valuation dashboard
      const [businessPlan, financialStats, analysisData] = await Promise.all([
        storage.getBusinessPlan(planId),
        storage.getFinancialData(planId),
        storage.getAnalysisScore(planId),
      ]);

      if (!businessPlan) {
        return res.status(404).json({ message: "Business plan not found" });
      }

      // Build a valuation response with all the data
      const valuationData = {
        plan: businessPlan,
        financial: financialStats,
        analysis: analysisData,
        valuationSummary: {
          currentValuation: analysisData?.companyValue || 4700000, // Fallback value
          valuationMethods: [
            {
              method: "Discounted Cash Flow (DCF)",
              applicability: "High",
              description: "Based on projected cash flows discounted to present value",
              result: "$5.2M",
            },
            {
              method: "Comparable Company Analysis",
              applicability: "High",
              description: "Based on valuation multiples of similar public companies",
              result: "$4.8M",
            },
            {
              method: "Venture Capital Method",
              applicability: "High",
              description: "Based on exit value and expected ROI for investors",
              result: "$4.5M",
            },
            {
              method: "First Chicago Method",
              applicability: "Medium",
              description: "Probability-weighted scenarios (success, sideways, failure)",
              result: "$4.3M",
            },
            {
              method: "Berkus Method",
              applicability: "Medium",
              description: "Assigns value to qualitative aspects of early-stage startups",
              result: "$4.6M",
            },
            {
              method: "Risk Factor Summation",
              applicability: "Medium",
              description: "Adjusts base value according to various risk factors",
              result: "$4.9M",
            }
          ],
          summaryMetrics: [
            {
              label: "Valuation",
              value: "$4.7M",
              trend: 1,
              change: "+14.2%",
              description: "Estimated company valuation based on multiple methods"
            },
            {
              label: "Revenue Multiple",
              value: "6.5x",
              trend: 1,
              change: "+0.8x",
              description: "Revenue multiple compared to industry average"
            },
            {
              label: "Runway",
              value: "18 months",
              trend: -1,
              change: "-2 months",
              description: "Cash runway at current burn rate"
            },
            {
              label: "Burn Rate",
              value: "$85K/mo",
              trend: 1,
              change: "+5.2%",
              description: "Monthly cash burn rate"
            }
          ],
          financialMetrics: [
            {
              label: "Revenue",
              value: "$720K",
              benchmark: "Benchmark: $650K",
              trend: 1,
              change: "+18.5%",
              description: "Annual recurring revenue"
            },
            {
              label: "Growth Rate",
              value: "27.8%",
              benchmark: "Benchmark: 25%",
              trend: 1,
              change: "+3.2pts",
              description: "Year-over-year revenue growth"
            },
            {
              label: "EBITDA Margin",
              value: "-15%",
              benchmark: "Benchmark: -20%",
              trend: 1,
              change: "+5pts",
              description: "Earnings before interest, taxes, depreciation, and amortization"
            }
          ],
          nonFinancialMetrics: [
            {
              label: "Active Users",
              value: "5,820",
              benchmark: "Benchmark: 4,500",
              trend: 1,
              change: "+28.5%",
              description: "Monthly active users"
            },
            {
              label: "Retention Rate",
              value: "78%",
              benchmark: "Benchmark: 70%",
              trend: 1,
              change: "+8pts",
              description: "Customer retention rate"
            },
            {
              label: "Customer LTV",
              value: "$4,005",
              benchmark: "Benchmark: $3,500",
              trend: 1,
              change: "+14.4%",
              description: "Customer lifetime value"
            },
            {
              label: "CAC",
              value: "$890",
              benchmark: "Benchmark: $950",
              trend: -1,
              change: "-6.3%",
              description: "Customer acquisition cost"
            }
          ],
          marketMetrics: [
            {
              label: "Market Size",
              value: "$48B",
              benchmark: "CAGR: 14.2%",
              trend: 1,
              change: "+3.5B",
              description: "Total addressable market size"
            },
            {
              label: "Market Share",
              value: "0.05%",
              benchmark: "Top 10%: 2.5%",
              trend: 1,
              change: "+0.02pts",
              description: "Current market share percentage"
            }
          ],
          teamAssessment: [
            {
              name: "Sarah Johnson",
              role: "CEO",
              experience: "15 years",
              prior_exits: "2",
              expertise: ["Strategy", "Leadership", "Fundraising"]
            },
            {
              name: "Michael Chen",
              role: "CTO",
              experience: "12 years",
              prior_exits: "1",
              expertise: ["Software Architecture", "AI", "DevOps"]
            },
            {
              name: "David Rodriguez",
              role: "CFO",
              experience: "18 years",
              prior_exits: "1",
              expertise: ["Finance", "Venture Capital", "M&A"]
            },
            {
              name: "Emma Williams",
              role: "CMO",
              experience: "10 years",
              prior_exits: "0",
              expertise: ["Digital Marketing", "Brand Strategy", "Growth"]
            }
          ]
        }
      };

      res.json(valuationData);
    } catch (error) {
      console.error("Valuation error:", error);
      res.status(500).json({ message: "Failed to fetch valuation data" });
    }
  });

  // Credit Scores API endpoints
  apiRouter.get("/credit-scores", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const scores = await storage.getCreditScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit scores" });
    }
  });

  apiRouter.get("/credit-score/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const score = await storage.getCreditScore(id);
      if (score) {
        res.json(score);
      } else {
        res.status(404).json({ message: "Credit score not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit score" });
    }
  });

  apiRouter.post("/credit-scores", async (req, res) => {
    try {
      const parsedBody = insertCreditScoreSchema.parse(req.body);
      const score = await storage.createCreditScore(parsedBody);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit score data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit score" });
    }
  });

  apiRouter.patch("/credit-scores/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const updatedScore = await storage.updateCreditScore(id, req.body);
      if (updatedScore) {
        res.json(updatedScore);
      } else {
        res.status(404).json({ message: "Credit score not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update credit score" });
    }
  });

  // Financial Milestones API endpoints
  apiRouter.get("/financial-milestones/:userId", async (req, res) => {
    const userId = req.params.userId; // MongoDB IDs are strings
    try {
      const milestones = await storage.getFinancialMilestones(userId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial milestones" });
    }
  });

  apiRouter.get("/financial-milestone/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const milestone = await storage.getFinancialMilestone(id);
      if (milestone) {
        res.json(milestone);
      } else {
        res.status(404).json({ message: "Financial milestone not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial milestone" });
    }
  });

  apiRouter.post("/financial-milestones", async (req, res) => {
    try {
      const parsedBody = insertFinancialMilestoneSchema.parse(req.body);
      const milestone = await storage.createFinancialMilestone(parsedBody);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid financial milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial milestone" });
    }
  });

  apiRouter.patch("/financial-milestones/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const updatedMilestone = await storage.updateFinancialMilestone(id, req.body);
      if (updatedMilestone) {
        res.json(updatedMilestone);
      } else {
        res.status(404).json({ message: "Financial milestone not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial milestone" });
    }
  });

  // AI Coaching Messages API endpoints
  apiRouter.get("/ai-coaching-messages/:userId", async (req, res) => {
    const userId = req.params.userId; // MongoDB IDs are strings
    try {
      const messages = await storage.getAiCoachingMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve AI coaching messages" });
    }
  });

  apiRouter.post("/ai-coaching-messages", async (req, res) => {
    try {
      const parsedBody = insertAiCoachingMessageSchema.parse(req.body);
      const message = await storage.createAiCoachingMessage(parsedBody);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid AI coaching message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI coaching message" });
    }
  });

  // Credit Tips API endpoints
  apiRouter.get("/credit-tips", async (req, res) => {
    try {
      const tips = await storage.getCreditTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips" });
    }
  });

  apiRouter.get("/credit-tips/category/:category", async (req, res) => {
    const category = req.params.category;

    try {
      const tips = await storage.getCreditTipsByCategory(category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tips by category" });
    }
  });

  apiRouter.get("/credit-tip/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const tip = await storage.getCreditTip(id);
      if (tip) {
        res.json(tip);
      } else {
        res.status(404).json({ message: "Credit tip not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve credit tip" });
    }
  });

  apiRouter.post("/credit-tips", async (req, res) => {
    try {
      const parsedBody = insertCreditTipSchema.parse(req.body);
      const tip = await storage.createCreditTip(parsedBody);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit tip" });
    }
  });

  // User Credit Tips API endpoints
  apiRouter.get("/user-credit-tips/:userId", async (req, res) => {
    const userId = req.params.userId; // MongoDB IDs are strings
    try {
      const userTips = await storage.getUserCreditTips(userId);
      res.json(userTips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user credit tips" });
    }
  });

  apiRouter.post("/user-credit-tips", async (req, res) => {
    try {
      const parsedBody = insertUserCreditTipSchema.parse(req.body);
      const userTip = await storage.createUserCreditTip(parsedBody);
      res.status(201).json(userTip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user credit tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user credit tip" });
    }
  });

  apiRouter.patch("/user-credit-tips/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const updatedUserTip = await storage.updateUserCreditTip(id, req.body);
      if (updatedUserTip) {
        res.json(updatedUserTip);
      } else {
        res.status(404).json({ message: "User credit tip not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user credit tip" });
    }
  });

  // Financial Projections API endpoints
  apiRouter.get("/financial-projections/:businessPlanId", async (req, res) => {
    const businessPlanId = req.params.businessPlanId; // MongoDB IDs are strings
    try {
      const projections = await storage.getFinancialProjections(businessPlanId);
      res.json(projections);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial projections" });
    }
  });

  apiRouter.get("/financial-projection/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const projection = await storage.getFinancialProjection(id);
      if (projection) {
        res.json(projection);
      } else {
        res.status(404).json({ message: "Financial projection not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve financial projection" });
    }
  });

  apiRouter.post("/financial-projections", async (req, res) => {
    try {
      const parsedBody = insertFinancialProjectionSchema.parse(req.body);
      const projection = await storage.createFinancialProjection(parsedBody);
      res.status(201).json(projection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid financial projection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial projection" });
    }
  });

  apiRouter.patch("/financial-projections/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const updatedProjection = await storage.updateFinancialProjection(id, req.body);
      if (updatedProjection) {
        res.json(updatedProjection);
      } else {
        res.status(404).json({ message: "Financial projection not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial projection" });
    }
  });

  // AI Business Analysis API endpoints
  apiRouter.get("/ai-business-analysis/:businessPlanId", async (req, res) => {
    const businessPlanId = req.params.businessPlanId; // MongoDB IDs are strings
    try {
      const analysis = await storage.getAiBusinessAnalysis(businessPlanId);
      if (analysis) {
        res.json(analysis);
      } else {
        res.status(404).json({ message: "AI business analysis not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve AI business analysis" });
    }
  });

  apiRouter.post("/ai-business-analysis", async (req, res) => {
    try {
      const parsedBody = insertAiBusinessAnalysisSchema.parse(req.body);
      const analysis = await storage.createAiBusinessAnalysis(parsedBody);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid AI business analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI business analysis" });
    }
  });

  apiRouter.patch("/ai-business-analysis/:id", async (req, res) => {
    const id = req.params.id; // MongoDB IDs are strings
    try {
      const updatedAnalysis = await storage.updateAiBusinessAnalysis(id, req.body);
      if (updatedAnalysis) {
        res.json(updatedAnalysis);
      } else {
        res.status(404).json({ message: "AI business analysis not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI business analysis" });
    }
  });

  // Credit Score Tier Routes
  apiRouter.get("/credit-score-tiers", async (req, res) => {
    try {
      const tiers = await storage.getCreditScoreTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score tiers" });
    }
  });

  apiRouter.get("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const tier = await storage.getCreditScoreTier(id);
      if (!tier) {
        return res.status(404).json({ message: "Credit score tier not found" });
      }

      res.json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score tier" });
    }
  });

  apiRouter.get("/credit-score-tiers/score/:score", async (req, res) => {
    try {
      const score = parseInt(req.params.score, 10);
      if (isNaN(score)) {
        return res.status(400).json({ message: "Invalid score" });
      }

      const tier = await storage.getCreditScoreTierByScore(score);
      if (!tier) {
        return res.status(404).json({ message: "No tier found for the given score" });
      }

      res.json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tier by score" });
    }
  });

  apiRouter.post("/credit-score-tiers", async (req, res) => {
    try {
      const tier = await storage.createCreditScoreTier(req.body);
      res.status(201).json(tier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score tier" });
    }
  });

  apiRouter.patch("/credit-score-tiers/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const updatedTier = await storage.updateCreditScoreTier(id, req.body);
      if (!updatedTier) {
        return res.status(404).json({ message: "Credit score tier not found" });
      }

      res.json(updatedTier);
    } catch (error) {
      res.status(500).json({ message: "Failed to update credit score tier" });
    }
  });

  // Credit Achievement Routes
  apiRouter.get("/credit-achievements", async (req, res) => {
    try {
      const achievements = await storage.getCreditAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit achievements" });
    }
  });

  apiRouter.get("/credit-achievements/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const achievements = await storage.getCreditAchievementsByCategory(category);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements by category" });
    }
  });

  apiRouter.get("/credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const achievement = await storage.getCreditAchievement(id);
      if (!achievement) {
        return res.status(404).json({ message: "Credit achievement not found" });
      }

      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit achievement" });
    }
  });

  apiRouter.post("/credit-achievements", async (req, res) => {
    try {
      const achievement = await storage.createCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit achievement" });
    }
  });

  // User Credit Achievement Routes
  apiRouter.get("/user-credit-achievements/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings
      const achievements = await storage.getUserCreditAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user credit achievements" });
    }
  });

  apiRouter.get("/user-credit-achievements/unseen/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings
      const achievements = await storage.getUnseenAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unseen achievements" });
    }
  });

  apiRouter.post("/user-credit-achievements", async (req, res) => {
    try {
      const achievement = await storage.createUserCreditAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user credit achievement" });
    }
  });

  apiRouter.patch("/user-credit-achievements/:id", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const updatedAchievement = await storage.updateUserCreditAchievement(id, req.body);
      if (!updatedAchievement) {
        return res.status(404).json({ message: "User credit achievement not found" });
      }

      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user credit achievement" });
    }
  });

  apiRouter.post("/user-credit-achievements/:id/mark-seen", async (req, res) => {
    try {
      const id = req.params.id; // MongoDB IDs are strings

      const updatedAchievement = await storage.markAchievementAsSeen(id);
      if (!updatedAchievement) {
        return res.status(404).json({ message: "User credit achievement not found" });
      }

      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark achievement as seen" });
    }
  });

  // Credit Score History Routes
  apiRouter.get("/credit-score-history/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings
      const history = await storage.getCreditScoreHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score history" });
    }
  });

  apiRouter.post("/credit-score-history", async (req, res) => {
    try {
      const history = await storage.createCreditScoreHistory(req.body);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credit score history" });
    }
  });

  // User Reward Points Routes
  apiRouter.get("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings

      const points = await storage.getUserRewardPoints(userId);
      if (!points) {
        return res.status(404).json({ message: "User reward points not found" });
      }

      res.json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reward points" });
    }
  });

  apiRouter.post("/user-reward-points", async (req, res) => {
    try {
      const points = await storage.createUserRewardPoints(req.body);
      res.status(201).json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user reward points" });
    }
  });

  apiRouter.patch("/user-reward-points/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings

      const updatedPoints = await storage.updateUserRewardPoints(userId, req.body);
      if (!updatedPoints) {
        return res.status(404).json({ message: "User reward points not found" });
      }

      res.json(updatedPoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user reward points" });
    }
  });

  apiRouter.post("/user-reward-points/:userId/add", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings

      const { amount, description, type, referenceId, referenceType } = req.body;
      if (typeof amount !== 'number' || !description || !type) {
        return res.status(400).json({ message: "Invalid request body. Must include amount, description, and type." });
      }

      const updatedPoints = await storage.addUserPoints(userId, amount, description, type, referenceId, referenceType);
      res.json(updatedPoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to add reward points" });
    }
  });

  // Point Transactions Routes
  apiRouter.get("/point-transactions/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // MongoDB IDs are strings
      const transactions = await storage.getPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch point transactions" });
    }
  });

  apiRouter.post("/point-transactions", async (req, res) => {
    try {
      const transaction = await storage.createPointTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create point transaction" });
    }
  });


  // AI-powered endpoints
  apiRouter.post("/ai/market-analysis", isAuthenticated, async (req, res) => {
    try {
      const { industry, businessDescription } = req.body;
      if (!industry || !businessDescription) {
        return res.status(400).json({ message: "Industry and business description are required" });
      }

      const analysis = await aiService.analyzeMarketTrends(industry, businessDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Market analysis error:", error);
      res.status(500).json({ message: "Failed to analyze market trends" });
    }
  });

  apiRouter.post("/ai/competitive-analysis", isAuthenticated, async (req, res) => {
    try {
      const { industry, businessDescription, competitors } = req.body;
      if (!industry || !businessDescription) {
        return res.status(400).json({ message: "Industry and business description are required" });
      }

      const analysis = await aiService.performCompetitiveAnalysis(industry, businessDescription, competitors);
      res.json(analysis);
    } catch (error) {
      console.error("Competitive analysis error:", error);
      res.status(500).json({ message: "Failed to perform competitive analysis" });
    }
  });

  apiRouter.post("/ai/business-guidance", isAuthenticated, async (req, res) => {
    try {
      const { question, businessContext } = req.body;
      if (!question || !businessContext) {
        return res.status(400).json({ message: "Question and business context are required" });
      }

      const guidance = await aiService.provideBusinessGuidance(question, businessContext);
      res.json(guidance);
    } catch (error) {
      console.error("Business guidance error:", error);
      res.status(500).json({ message: "Failed to provide business guidance" });
    }
  });

  apiRouter.post("/ai/risk-assessment", isAuthenticated, async (req, res) => {
    try {
      const { businessPlan, financials } = req.body;
      if (!businessPlan) {
        return res.status(400).json({ message: "Business plan is required" });
      }

      const assessment = await aiService.assessBusinessRisk(businessPlan, financials);
      res.json(assessment);
    } catch (error) {
      console.error("Risk assessment error:", error);
      res.status(500).json({ message: "Failed to assess business risk" });
    }
  });

  apiRouter.post("/ai/validate-projections", isAuthenticated, async (req, res) => {
    try {
      const { projections, actualData } = req.body;
      if (!projections) {
        return res.status(400).json({ message: "Financial projections are required" });
      }

      const validation = await aiService.validateFinancialProjections(projections, actualData);
      res.json(validation);
    } catch (error) {
      console.error("Projection validation error:", error);
      res.status(500).json({ message: "Failed to validate financial projections" });
    }
  });

  apiRouter.post("/ai/generate-content", isAuthenticated, async (req, res) => {
    try {
      const { section, context, businessInfo } = req.body;
      if (!section || !context) {
        return res.status(400).json({ message: "Section and context are required" });
      }

      const content = await aiService.generateBusinessContent(section, context, businessInfo);
      res.json({ content });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate business content" });
    }
  });

  apiRouter.post("/ai/sentiment-analysis", isAuthenticated, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const sentiment = await aiService.analyzeSentiment(text);
      res.json(sentiment);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      res.status(500).json({ message: "Failed to analyze sentiment" });
    }
  });

  // Analytics dashboard endpoints
  apiRouter.get("/analytics/dashboard", isAuthenticated, async (req, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";

      // Mock analytics data - replace with real data processing
      const analyticsData = {
        performanceMetrics: {
          totalRevenue: 485000,
          revenueGrowth: 23.5,
          userGrowth: 18.2,
          conversionRate: 12.8,
          customerAcquisitionCost: 285,
          lifetimeValue: 3450,
          burnRate: 45000,
          runway: 18.5
        },
        predictiveModels: {
          revenueForecasting: [
            { month: "Jan", predicted: 42000, actual: 41200, confidence: 0.92 },
            { month: "Feb", predicted: 46000, actual: 47800, confidence: 0.89 },
            { month: "Mar", predicted: 52000, actual: 51200, confidence: 0.91 },
            { month: "Apr", predicted: 58000, confidence: 0.87 },
            { month: "May", predicted: 64000, confidence: 0.85 },
            { month: "Jun", predicted: 72000, confidence: 0.83 }
          ],
          riskFactors: [
            { factor: "Market Saturation", likelihood: 65, impact: "High", mitigation: "Expand to new markets" },
            { factor: "Competition Increase", likelihood: 78, impact: "Medium", mitigation: "Strengthen USP" },
            { factor: "Economic Downturn", likelihood: 42, impact: "High", mitigation: "Diversify revenue streams" }
          ],
          marketOpportunities: [
            { opportunity: "AI Integration", score: 89, timeline: "3-6 months", potential: "$120K ARR" },
            { opportunity: "Mobile App", score: 76, timeline: "6-9 months", potential: "$80K ARR" },
            { opportunity: "Enterprise Sales", score: 94, timeline: "2-4 months", potential: "$200K ARR" }
          ]
        },
        realTimeMetrics: {
          activeUsers: Math.floor(Math.random() * 500) + 1000,
          salesConversions: Math.floor(Math.random() * 30) + 10,
          marketSentiment: Math.floor(Math.random() * 20) + 70,
          competitivePosition: Math.floor(Math.random() * 15) + 80
        }
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  apiRouter.get("/analytics/performance/:metric", isAuthenticated, async (req, res) => {
    try {
      const metric = req.params.metric;
      const timeRange = req.query.timeRange || "30d";

      // Mock detailed performance data for specific metrics
      const performanceData = {
        revenue: {
          current: 485000,
          previous: 394000,
          growth: 23.1,
          trend: [
            { date: "2024-01", value: 280000 },
            { date: "2024-02", value: 320000 },
            { date: "2024-03", value: 385000 },
            { date: "2024-04", value: 420000 },
            { date: "2024-05", value: 465000 },
            { date: "2024-06", value: 485000 }
          ]
        },
        users: {
          current: 12847,
          previous: 10865,
          growth: 18.2,
          trend: [
            { date: "2024-01", value: 8200 },
            { date: "2024-02", value: 9100 },
            { date: "2024-03", value: 10200 },
            { date: "2024-04", value: 11100 },
            { date: "2024-05", value: 12000 },
            { date: "2024-06", value: 12847 }
          ]
        }
      };

      const data = performanceData[metric as keyof typeof performanceData];
      if (!data) {
        return res.status(404).json({ message: "Metric not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Performance metric error:", error);
      res.status(500).json({ message: "Failed to fetch performance metric" });
    }
  });

  // Organization management endpoints
  app.post("/api/organizations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const organization = await storage.createOrganization({
        ...req.body,
        ownerId: user.claims.sub
      });

      // Add creator as admin
      await storage.addUserToOrganization(user.claims.sub, organization.id, 'admin');

      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.get("/api/organizations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const organizations = await storage.getUserOrganizations(user.claims.sub);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const organization = await storage.getOrganization(req.params.id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  app.put("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      const updateData = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: orgId,
          ...updateData,
          updatedAt: new Date().toISOString()
        });
      }

      // In production, update organization in database
      const updatedOrg = await storage.updateOrganization(orgId, {
        ...updateData,
        updatedAt: new Date()
      });

      if (!updatedOrg) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json(updatedOrg);
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  app.delete("/api/organizations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: "Organization deleted successfully" });
      }

      // In production, delete organization from database
      await storage.deleteOrganization(orgId);
      res.json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ message: "Failed to delete organization" });
    }
  });

  app.get("/api/organizations/:id/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock members
      if (process.env.NODE_ENV === 'development') {
        return res.json([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@techstart.com',
            role: 'owner',
            status: 'active',
            joinedAt: '2024-01-15',
            department: 'Engineering'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@techstart.com',
            role: 'admin',
            status: 'active',
            joinedAt: '2024-01-20',
            department: 'Marketing'
          }
        ]);
      }

      // In production, fetch members from database
      const members = await storage.getOrganizationMembers(orgId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching organization members:", error);
      res.status(500).json({ message: "Failed to fetch organization members" });
    }
  });

  app.post("/api/organizations/:id/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;
      const { email, role, message } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: Date.now().toString(),
          email,
          role,
          status: 'pending',
          invitedBy: userId,
          invitedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          message
        });
      }

      // In production, create invitation in database
      const invitation = await storage.createOrganizationInvitation({
        organizationId: orgId,
        email,
        role,
        invitedBy: userId,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.json(invitation);
    } catch (error) {
      console.error("Error creating organization invitation:", error);
      res.status(500).json({ message: "Failed to create organization invitation" });
    }
  });

  app.get("/api/organizations/:id/analytics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const orgId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock analytics
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          totalMembers: 12,
          activeMembers: 10,
          pendingInvites: 2,
          departments: {
            'Engineering': 5,
            'Marketing': 3,
            'Sales': 2,
            'Finance': 2
          },
          roles: {
            'owner': 1,
            'admin': 2,
            'member': 7,
            'viewer': 2
          },
          revenue: 2500000,
          growthRate: 15.8,
          memberGrowth: 23.2
        });
      }

      // In production, fetch analytics from database
      const analytics = await storage.getOrganizationAnalytics(orgId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching organization analytics:", error);
      res.status(500).json({ message: "Failed to fetch organization analytics" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock settings
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          // Account Settings
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          timezone: 'America/New_York',
          language: 'en',
          
          // Privacy Settings
          profileVisibility: 'organization',
          dataSharing: true,
          analyticsOptIn: true,
          marketingEmails: false,
          
          // Notification Settings
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          notificationFrequency: 'daily',
          
          // AI Agent Settings
          aiPersonality: 'professional',
          aiResponseLength: 'detailed',
          aiProactiveInsights: true,
          aiDataRetention: 90,
          
          // Organization Settings
          defaultOrganization: 'techstart-inc',
          organizationNotifications: true,
          teamCollaboration: true,
          
          // Appearance Settings
          theme: 'system',
          fontSize: 'medium',
          compactMode: false,
          
          // Security Settings
          twoFactorAuth: false,
          sessionTimeout: 60,
          loginNotifications: true,
          deviceTrust: true
        });
      }

      // In production, fetch settings from database
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.put("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const settingsData = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          ...settingsData,
          updatedAt: new Date().toISOString()
        });
      }

      // In production, update settings in database
      const updatedSettings = await storage.updateUserSettings(userId, settingsData);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  app.post("/api/settings/reset", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          message: "Settings reset to default values",
          resetAt: new Date().toISOString()
        });
      }

      // In production, reset settings in database
      await storage.resetUserSettings(userId);
      res.json({ message: "Settings reset to default values" });
    } catch (error) {
      console.error("Error resetting user settings:", error);
      res.status(500).json({ message: "Failed to reset user settings" });
    }
  });

  app.get("/api/settings/export", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock export data
      if (process.env.NODE_ENV === 'development') {
        const exportData = {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          settings: {
            // All settings data
          },
          exportDate: new Date().toISOString(),
          version: '1.0'
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="settings-export.json"');
        res.json(exportData);
        return;
      }

      // In production, generate export data
      const exportData = await storage.exportUserSettings(userId);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="settings-export.json"');
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting user settings:", error);
      res.status(500).json({ message: "Failed to export user settings" });
    }
  });

  // Collaboration endpoints
  app.post("/api/collaborations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const collaboration = await storage.createCollaboration({
        ...req.body,
        createdBy: user.claims.sub,
        participants: [user.claims.sub, ...(req.body.participants || [])]
      });
      res.json(collaboration);
    } catch (error) {
      res.status(500).json({ message: "Failed to create collaboration" });
    }
  });

  app.get("/api/collaborations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const collaborations = await storage.getUserCollaborations(user.claims.sub);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });

  // Invitation endpoints
  app.post("/api/invitations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const invitation = await storage.createInvitation({
        ...req.body,
        inviterId: user.claims.sub,
        inviterEmail: user.claims.email
      });
      res.json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });

  app.get("/api/invitations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const invitations = await storage.getUserInvitations(user.claims.email);
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });

  app.patch("/api/invitations/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const invitation = await storage.getInvitation(req.params.id);

      if (!invitation || invitation.inviteeEmail !== user.claims.email) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      const updatedInvitation = await storage.updateInvitation(req.params.id, req.body);

      // If accepting organization invitation, add user to organization
      if (req.body.status === 'accepted' && invitation.type === 'organization') {
        await storage.addUserToOrganization(user.claims.sub, invitation.organizationId, invitation.role || 'member');
      }

      res.json(updatedInvitation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update invitation" });
    }
  });

  // User endpoint for authentication
  app.get("/api/user", async (req, res) => {
    // In development mode, return a mock user
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        profileImageUrl: null,
        userType: 'ENTREPRENEUR'
      });
    }

    // In production, check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as any;
    res.json({
      id: user.claims?.sub || user.id,
      email: user.claims?.email || user.email,
      firstName: user.claims?.first_name || user.firstName,
      lastName: user.claims?.last_name || user.lastName,
      profileImageUrl: user.claims?.profile_image_url || user.profileImageUrl
    });
  });

  // Profile endpoints
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock profile data
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: userId,
          email: 'dev@example.com',
          firstName: 'Dev',
          lastName: 'User',
          profileImageUrl: null,
          userType: 'entrepreneur',
          userSubtype: 'serial-entrepreneur',
          role: 'Founder & CEO',
          bio: 'Passionate entrepreneur building the future of fintech',
          location: 'San Francisco, CA',
          website: 'https://mycompany.com',
          linkedin: 'https://linkedin.com/in/username',
          twitter: 'https://twitter.com/username',
          phone: '+1 (555) 123-4567',
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
              marketing: false
            },
            privacy: {
              profileVisibility: 'public',
              showEmail: false,
              showPhone: false,
              showLocation: true
            },
            display: {
              theme: 'light',
              language: 'en',
              timezone: 'UTC'
            }
          },
          metrics: {
            businessGrowth: 85,
            fundingStage: 'Series A',
            teamSize: 12,
            revenueGrowth: 150,
            marketValidation: 78
          },
          verified: true,
          onboardingCompleted: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        });
      }

      // In production, fetch from database
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const {
        firstName,
        lastName,
        email,
        userSubtype,
        role,
        bio,
        location,
        website,
        linkedin,
        twitter,
        phone,
        preferences
      } = req.body;

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: userId,
          firstName,
          lastName,
          email,
          userSubtype,
          role,
          bio,
          location,
          website,
          linkedin,
          twitter,
          phone,
          preferences,
          updatedAt: new Date().toISOString()
        });
      }

      // In production, update in database
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        userSubtype,
        role,
        bio,
        location,
        website,
        linkedin,
        twitter,
        phone,
        preferences,
        updatedAt: new Date()
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/profile/upload-image", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In a real implementation, you would:
      // 1. Handle file upload (multer middleware)
      // 2. Upload to cloud storage (AWS S3, Cloudinary, etc.)
      // 3. Update user profile with new image URL
      // 4. Return the new image URL

      // For now, return a mock response
      const mockImageUrl = `https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=${userId.slice(0, 2).toUpperCase()}`;
      
      res.json({
        imageUrl: mockImageUrl,
        message: "Image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Team management endpoints
  app.get("/api/team/members", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock team data
      if (process.env.NODE_ENV === 'development') {
        return res.json([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@startup.com',
            role: 'owner',
            status: 'active',
            joinedAt: '2024-01-15',
            lastActive: '2024-01-20T10:30:00Z',
            department: 'Engineering',
            skills: ['React', 'TypeScript', 'Node.js'],
            bio: 'Full-stack developer with 5+ years experience',
            location: 'San Francisco, CA',
            phone: '+1 (555) 123-4567',
            website: 'https://johndoe.dev',
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: 'https://twitter.com/johndoe',
            github: 'https://github.com/johndoe'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@startup.com',
            role: 'admin',
            status: 'active',
            joinedAt: '2024-02-01',
            lastActive: '2024-01-20T09:15:00Z',
            department: 'Marketing',
            skills: ['Digital Marketing', 'Content Strategy', 'SEO'],
            bio: 'Marketing strategist focused on growth and brand building',
            location: 'New York, NY',
            phone: '+1 (555) 234-5678',
            linkedin: 'https://linkedin.com/in/janesmith'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@startup.com',
            role: 'member',
            status: 'pending',
            joinedAt: '2024-02-15',
            department: 'Sales',
            skills: ['Sales Strategy', 'CRM', 'Lead Generation'],
            bio: 'Sales professional with expertise in B2B sales',
            location: 'Austin, TX'
          }
        ]);
      }

      // In production, fetch from database
      const members = await storage.getTeamMembers(userId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/team/invite", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { email, role, message } = req.body;

      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: Date.now().toString(),
          email,
          role,
          status: 'pending',
          invitedBy: userId,
          invitedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          message
        });
      }

      // In production, create invitation in database
      const invitation = await storage.createTeamInvitation({
        email,
        role,
        invitedBy: userId,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.json(invitation);
    } catch (error) {
      console.error("Error creating team invitation:", error);
      res.status(500).json({ message: "Failed to create team invitation" });
    }
  });

  app.get("/api/team/invitations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return mock invitations
      if (process.env.NODE_ENV === 'development') {
        return res.json([
          {
            id: '1',
            email: 'alex@startup.com',
            role: 'member',
            status: 'pending',
            invitedBy: 'John Doe',
            invitedAt: '2024-01-18T10:00:00Z',
            expiresAt: '2024-01-25T10:00:00Z',
            message: 'Welcome to our team! Looking forward to working with you.'
          }
        ]);
      }

      // In production, fetch from database
      const invitations = await storage.getTeamInvitations(userId);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching team invitations:", error);
      res.status(500).json({ message: "Failed to fetch team invitations" });
    }
  });

  app.put("/api/team/members/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const memberId = req.params.id;
      const { role, department, status } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          id: memberId,
          role,
          department,
          status,
          updatedAt: new Date().toISOString()
        });
      }

      // In production, update member in database
      const updatedMember = await storage.updateTeamMember(memberId, {
        role,
        department,
        status,
        updatedAt: new Date()
      });

      if (!updatedMember) {
        return res.status(404).json({ message: "Team member not found" });
      }

      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team/members/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const memberId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: "Team member removed successfully" });
      }

      // In production, remove member from database
      await storage.removeTeamMember(memberId);
      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      console.error("Error removing team member:", error);
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });

  app.post("/api/team/invitations/:id/resend", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const invitationId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: "Invitation resent successfully" });
      }

      // In production, resend invitation
      await storage.resendTeamInvitation(invitationId);
      res.json({ message: "Invitation resent successfully" });
    } catch (error) {
      console.error("Error resending invitation:", error);
      res.status(500).json({ message: "Failed to resend invitation" });
    }
  });

  app.delete("/api/team/invitations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const invitationId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // In development mode, return success
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: "Invitation cancelled successfully" });
      }

      // In production, cancel invitation
      await storage.cancelTeamInvitation(invitationId);
      res.json({ message: "Invitation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      res.status(500).json({ message: "Failed to cancel invitation" });
    }
  });

  app.use("/api", apiRouter);
  app.use("/api/ai-agents", aiAgentRoutes);
  app.use("/api/documents/ai", documentAIRoutes);
  app.use("/api/ldt", enhancedLDTRoutes);
  app.use("/api/ldt", ldtComprehensiveRoutes);
  // app.use("/api/assessments", assessmentRoutes); // Temporarily disabled due to import issues
  
  // New modular routes
  app.use("/api/iterative-plans", iterativePlanRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/investments", investmentRoutes);
  app.use("/api/credit", creditRoutes);
  app.use("/api/organizations", organizationRoutes);
  app.use("/api/loans", loanRoutes);
  app.use("/api/advisory", advisoryRoutes);
  app.use("/api/team", teamRoutes);

  // Add these routes to your existing routes

  // Import the infographic services
  const { AIInfographicService } = await import('./ai-infographic-service');
  const { InfographicExportService } = await import('./infographic-export-service');

  // Document-based infographic generation endpoint
  apiRouter.post("/documents/infographic/generate", isAuthenticated, async (req, res) => {
    try {
      const { prompt, template, customization, data, userId } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const infographicService = new AIInfographicService();
      const infographic = await infographicService.generateInfographic(
        prompt,
        data,
        { template, customization },
        userId || req.user?.id
      );

      res.json(infographic);
    } catch (error) {
      console.error("Infographic generation error:", error);
      res.status(500).json({ message: "Failed to generate infographic" });
    }
  });

  // Get infographic templates
  apiRouter.get("/documents/infographic/templates", isAuthenticated, async (req, res) => {
    try {
      const infographicService = new AIInfographicService();
      const templates = await infographicService.getInfographicTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Templates loading error:", error);
      res.status(500).json({ message: "Failed to load templates" });
    }
  });

  // Enhance infographic
  apiRouter.post("/documents/infographic/enhance", isAuthenticated, async (req, res) => {
    try {
      const { infographic, enhancements, userId } = req.body;
      if (!infographic || !enhancements) {
        return res.status(400).json({ message: "Infographic and enhancements are required" });
      }

      const infographicService = new AIInfographicService();
      const enhanced = await infographicService.enhanceInfographic(
        infographic, 
        enhancements, 
        userId || req.user?.id
      );
      res.json(enhanced);
    } catch (error) {
      console.error("Infographic enhancement error:", error);
      res.status(500).json({ message: "Failed to enhance infographic" });
    }
  });

  // Get enhancement suggestions
  apiRouter.post("/documents/infographic/suggestions", isAuthenticated, async (req, res) => {
    try {
      const { infographic } = req.body;
      if (!infographic) {
        return res.status(400).json({ message: "Infographic is required" });
      }

      const infographicService = new AIInfographicService();
      const suggestions = await infographicService.getEnhancementSuggestions(infographic);
      res.json(suggestions);
    } catch (error) {
      console.error("Enhancement suggestions error:", error);
      res.status(500).json({ message: "Failed to get enhancement suggestions" });
    }
  });

  // Analyze data quality
  apiRouter.post("/documents/infographic/analyze-quality", isAuthenticated, async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ message: "Data is required" });
      }

      const infographicService = new AIInfographicService();
      const quality = await infographicService.analyzeDataQuality(data);
      res.json(quality);
    } catch (error) {
      console.error("Data quality analysis error:", error);
      res.status(500).json({ message: "Failed to analyze data quality" });
    }
  });

  // Export infographic
  apiRouter.post("/documents/infographic/export", isAuthenticated, async (req, res) => {
    try {
      const { infographic, format, options } = req.body;
      if (!infographic || !format) {
        return res.status(400).json({ message: "Infographic and format are required" });
      }

      const exportService = new InfographicExportService();
      const result = await exportService.exportInfographic(infographic, {
        format,
        ...options
      });

      if (!result.success) {
        return res.status(500).json({ message: result.error || "Export failed" });
      }

      const mimeTypes = {
        png: 'image/png',
        jpg: 'image/jpeg',
        svg: 'image/svg+xml',
        pdf: 'application/pdf'
      };

      res.setHeader('Content-Type', mimeTypes[format] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="infographic.${format}"`);
      res.setHeader('Content-Length', result.buffer!.length);
      res.send(result.buffer);
    } catch (error) {
      console.error("Infographic export error:", error);
      res.status(500).json({ message: "Failed to export infographic" });
    }
  });

  // Export multiple formats
  apiRouter.post("/infographic/export-multiple", isAuthenticated, async (req, res) => {
    try {
      const { infographic, formats, options } = req.body;
      if (!infographic || !formats || !Array.isArray(formats)) {
        return res.status(400).json({ message: "Infographic and formats array are required" });
      }

      const exportService = new InfographicExportService();
      const results = await exportService.exportMultipleFormats(infographic, formats);

      res.json(results);
    } catch (error) {
      console.error("Multiple format export error:", error);
      res.status(500).json({ message: "Failed to export multiple formats" });
    }
  });

  // Create zip archive with multiple formats
  apiRouter.post("/infographic/export-zip", isAuthenticated, async (req, res) => {
    try {
      const { infographic, formats } = req.body;
      if (!infographic || !formats || !Array.isArray(formats)) {
        return res.status(400).json({ message: "Infographic and formats array are required" });
      }

      const exportService = new InfographicExportService();
      const zipBuffer = await exportService.createZipArchive(infographic, formats);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="infographic-package.zip"');
      res.setHeader('Content-Length', zipBuffer.length);
      res.send(zipBuffer);
    } catch (error) {
      console.error("Zip export error:", error);
      res.status(500).json({ message: "Failed to create zip archive" });
    }
  });

  // Save infographic
  apiRouter.post("/infographic/save", isAuthenticated, async (req, res) => {
    try {
      const { infographic, userId } = req.body;
      if (!infographic) {
        return res.status(400).json({ message: "Infographic is required" });
      }

      // Here you would save to database
      // For now, just return success
      res.json({ 
        success: true, 
        message: "Infographic saved successfully",
        id: infographic.id 
      });
    } catch (error) {
      console.error("Save infographic error:", error);
      res.status(500).json({ message: "Failed to save infographic" });
    }
  });

  // Get user's infographics
  apiRouter.get("/infographic/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Here you would fetch from database
      // For now, return empty array
      res.json([]);
    } catch (error) {
      console.error("Get user infographics error:", error);
      res.status(500).json({ message: "Failed to get user infographics" });
    }
  });

  // Delete infographic
  apiRouter.delete("/infographic/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Here you would delete from database
      res.json({ success: true, message: "Infographic deleted successfully" });
    } catch (error) {
      console.error("Delete infographic error:", error);
      res.status(500).json({ message: "Failed to delete infographic" });
    }
  });

  // Import analytics service
  const { InfographicAnalyticsService } = await import('./infographic-analytics-service');
  const analyticsService = new InfographicAnalyticsService();

  // Track infographic event
  apiRouter.post("/infographic/analytics/track", isAuthenticated, async (req, res) => {
    try {
      const { infographicId, event, metadata } = req.body;
      if (!infographicId || !event) {
        return res.status(400).json({ message: "Infographic ID and event are required" });
      }

      await analyticsService.trackEvent(
        infographicId,
        req.user?.id || 'anonymous',
        event,
        metadata
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  // Get usage statistics
  apiRouter.get("/infographic/analytics/stats", isAuthenticated, async (req, res) => {
    try {
      const { start, end } = req.query;
      const timeRange = start && end ? {
        start: new Date(start as string),
        end: new Date(end as string)
      } : undefined;

      const stats = await analyticsService.getUsageStats(timeRange);
      res.json(stats);
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ message: "Failed to get analytics stats" });
    }
  });

  // Get user statistics
  apiRouter.get("/infographic/analytics/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await analyticsService.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("User analytics error:", error);
      res.status(500).json({ message: "Failed to get user analytics" });
    }
  });

  // Get trending infographics
  apiRouter.get("/infographic/analytics/trending", isAuthenticated, async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const trending = await analyticsService.getTrendingInfographics(Number(limit));
      res.json(trending);
    } catch (error) {
      console.error("Trending analytics error:", error);
      res.status(500).json({ message: "Failed to get trending infographics" });
    }
  });

  // Get performance insights
  apiRouter.get("/infographic/analytics/insights", isAuthenticated, async (req, res) => {
    try {
      const insights = await analyticsService.getPerformanceInsights();
      res.json(insights);
    } catch (error) {
      console.error("Performance insights error:", error);
      res.status(500).json({ message: "Failed to get performance insights" });
    }
  });

  // AI Application Filler Routes
  apiRouter.post("/applications/fill", isAuthenticated, async (req, res) => {
    try {
      const { form, businessPlan } = req.body;
      
      if (!form || !businessPlan) {
        return res.status(400).json({ message: "Form and business plan data required" });
      }

      const filledApplication = await aiApplicationFiller.fillApplication(form, businessPlan);
      res.json(filledApplication);
    } catch (error) {
      console.error("Application fill error:", error);
      res.status(500).json({ message: "Failed to fill application" });
    }
  });

  apiRouter.post("/applications/suggestions", isAuthenticated, async (req, res) => {
    try {
      const { form, responses, businessPlan } = req.body;
      
      if (!form || !responses || !businessPlan) {
        return res.status(400).json({ message: "Form, responses, and business plan data required" });
      }

      const suggestions = await aiApplicationFiller.generateSuggestions(form, responses, businessPlan);
      res.json({ suggestions });
    } catch (error) {
      console.error("Suggestions generation error:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}