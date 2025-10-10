import { BaseAgent } from '../../core/BaseAgent';
import { OpenAI } from 'openai';
import { EmpathyData, Insight, Pattern, InsightEvolution } from './types';

/**
 * AI-Powered Design Thinking Insights Agent
 * 
 * This agent specializes in generating and analyzing insights from DT data:
 * - Pattern recognition in empathy data
 * - Cross-phase insight connections
 * - Automated insight synthesis
 * - Insight evolution tracking
 * - Business impact assessment
 */
export class DTInsightsAgent extends BaseAgent {
  private openaiClient: OpenAI | null;
  private patternEngine: PatternEngine;
  private synthesisEngine: SynthesisEngine;
  private evolutionTracker: EvolutionTracker;

  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY || '' });
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    if (apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: apiKey
      });
    } else {
      console.warn('OpenAI API key not configured. DTInsightsAgent features will be limited.');
      this.openaiClient = null;
    }
    this.patternEngine = new PatternEngine();
    this.synthesisEngine = new SynthesisEngine();
    this.evolutionTracker = new EvolutionTracker();
  }

  /**
   * Synthesize insights from empathy data
   */
  async synthesizeInsights(data: EmpathyData[]): Promise<Insight[]> {
    try {
      // Identify patterns in the data
      const patterns = await this.identifyPatterns(data);
      
      // Generate insights from patterns
      const rawInsights = await this.generateInsightsFromPatterns(patterns);
      
      // Prioritize insights by importance
      const prioritizedInsights = await this.prioritizeInsights(rawInsights);
      
      // Assess business impact
      const insightsWithImpact = await this.assessBusinessImpact(prioritizedInsights);
      
      // Validate insights
      const validatedInsights = await this.validateInsights(insightsWithImpact);

      return validatedInsights;
    } catch (error) {
      console.error('Error synthesizing insights:', error);
      throw new Error('Failed to synthesize insights');
    }
  }

  /**
   * Identify patterns in empathy data
   */
  private async identifyPatterns(data: EmpathyData[]): Promise<Pattern[]> {
    const patterns: Pattern[] = [];

    // Analyze pain points
    const painPatterns = await this.analyzePainPoints(data);
    patterns.push(...painPatterns);

    // Analyze emotional patterns
    const emotionalPatterns = await this.analyzeEmotionalPatterns(data);
    patterns.push(...emotionalPatterns);

    // Analyze behavioral patterns
    const behavioralPatterns = await this.analyzeBehavioralPatterns(data);
    patterns.push(...behavioralPatterns);

    // Analyze environmental patterns
    const environmentalPatterns = await this.analyzeEnvironmentalPatterns(data);
    patterns.push(...environmentalPatterns);

    return patterns;
  }

  /**
   * Analyze pain points across empathy data
   */
  private async analyzePainPoints(data: EmpathyData[]): Promise<Pattern[]> {
    const painPoints = data.flatMap(d => d.pains);
    const painCategories = await this.categorizePainPoints(painPoints);
    
    return painCategories.map(category => ({
      type: 'pain_point',
      category,
      frequency: category.frequency,
      severity: category.severity,
      description: category.description,
      confidence: category.confidence
    }));
  }

  /**
   * Analyze emotional patterns
   */
  private async analyzeEmotionalPatterns(data: EmpathyData[]): Promise<Pattern[]> {
    const emotions = data.flatMap(d => d.thinkAndFeel);
    const emotionalAnalysis = await this.analyzeEmotions(emotions);
    
    return emotionalAnalysis.map(emotion => ({
      type: 'emotional',
      category: emotion.category,
      frequency: emotion.frequency,
      intensity: emotion.intensity,
      description: emotion.description,
      confidence: emotion.confidence
    }));
  }

  /**
   * Generate insights from identified patterns
   */
  private async generateInsightsFromPatterns(patterns: Pattern[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    for (const pattern of patterns) {
      const insight = await this.generateInsightFromPattern(pattern);
      if (insight) {
        insights.push(insight);
      }
    }

    return insights;
  }

  /**
   * Generate a single insight from a pattern
   */
  private async generateInsightFromPattern(pattern: Pattern): Promise<Insight | null> {
    const prompt = `
    Based on this Design Thinking pattern, generate a meaningful insight:
    
    Pattern Type: ${pattern.type}
    Category: ${pattern.category}
    Frequency: ${pattern.frequency}
    Description: ${pattern.description}
    
    Generate an insight that:
    1. Explains what this pattern means
    2. Suggests why it's important
    3. Indicates potential opportunities
    4. Provides actionable implications
    
    Format as JSON with: content, importance, opportunities, implications
    `;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        id: this.generateId(),
        content: parsed.content,
        type: 'pattern_derived',
        importance: parsed.importance,
        opportunities: parsed.opportunities,
        implications: parsed.implications,
        sourcePattern: pattern,
        confidence: pattern.confidence,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating insight from pattern:', error);
      return null;
    }
  }

  /**
   * Prioritize insights by importance and impact
   */
  private async prioritizeInsights(insights: Insight[]): Promise<Insight[]> {
    const scoredInsights = await Promise.all(
      insights.map(async (insight) => {
        const score = await this.calculateInsightScore(insight);
        return { ...insight, score };
      })
    );

    return scoredInsights
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...insight }) => insight);
  }

  /**
   * Calculate insight importance score
   */
  private async calculateInsightScore(insight: Insight): Promise<number> {
    const factors = {
      importance: insight.importance || 0.5,
      confidence: insight.confidence || 0.5,
      opportunities: insight.opportunities?.length || 0,
      implications: insight.implications?.length || 0
    };

    const weights = {
      importance: 0.4,
      confidence: 0.3,
      opportunities: 0.2,
      implications: 0.1
    };

    return (
      factors.importance * weights.importance +
      factors.confidence * weights.confidence +
      (factors.opportunities / 10) * weights.opportunities +
      (factors.implications / 10) * weights.implications
    );
  }

  /**
   * Assess business impact of insights
   */
  private async assessBusinessImpact(insights: Insight[]): Promise<Insight[]> {
    return Promise.all(
      insights.map(async (insight) => {
        const businessImpact = await this.calculateBusinessImpact(insight);
        return {
          ...insight,
          businessImpact
        };
      })
    );
  }

  /**
   * Calculate business impact score
   */
  private async calculateBusinessImpact(insight: Insight): Promise<BusinessImpact> {
    const prompt = `
    Assess the business impact of this Design Thinking insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(', ')}
    Implications: ${insight.implications?.join(', ')}
    
    Rate the impact on:
    1. Revenue potential (1-10)
    2. Cost reduction (1-10)
    3. Customer satisfaction (1-10)
    4. Competitive advantage (1-10)
    5. Market opportunity (1-10)
    
    Format as JSON with: revenue, costReduction, customerSatisfaction, competitiveAdvantage, marketOpportunity, overallScore
    `;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        revenue: parsed.revenue,
        costReduction: parsed.costReduction,
        customerSatisfaction: parsed.customerSatisfaction,
        competitiveAdvantage: parsed.competitiveAdvantage,
        marketOpportunity: parsed.marketOpportunity,
        overallScore: parsed.overallScore
      };
    } catch (error) {
      console.error('Error calculating business impact:', error);
      return {
        revenue: 5,
        costReduction: 5,
        customerSatisfaction: 5,
        competitiveAdvantage: 5,
        marketOpportunity: 5,
        overallScore: 5
      };
    }
  }

  /**
   * Validate insights for accuracy and relevance
   */
  private async validateInsights(insights: Insight[]): Promise<Insight[]> {
    return insights.filter(insight => {
      // Basic validation criteria
      return (
        insight.content.length > 10 &&
        insight.confidence > 0.3 &&
        insight.importance > 0.2
      );
    });
  }

  /**
   * Track insight evolution across DT phases
   */
  async trackInsightEvolution(insightId: string): Promise<InsightEvolution> {
    const evolution = await this.evolutionTracker.getEvolution(insightId);
    
    return {
      originalInsight: evolution[0],
      transformations: evolution.map((e, i) => ({
        phase: e.phase,
        transformation: this.compareInsights(evolution[i], evolution[i + 1]),
        contributingFactors: e.factors,
        refinements: e.refinements
      })),
      finalOutcome: evolution[evolution.length - 1],
      impact: await this.measureInsightImpact(insightId),
      businessValue: await this.calculateBusinessValue(insightId)
    };
  }

  /**
   * Generate automated HMW questions from insights
   */
  async generateHMWQuestions(insights: Insight[]): Promise<HMWQuestion[]> {
    const questions: HMWQuestion[] = [];

    for (const insight of insights) {
      const hmwQuestion = await this.generateHMWFromInsight(insight);
      if (hmwQuestion) {
        questions.push(hmwQuestion);
      }
    }

    return questions;
  }

  /**
   * Generate HMW question from a single insight
   */
  private async generateHMWFromInsight(insight: Insight): Promise<HMWQuestion | null> {
    const prompt = `
    Generate a "How might we" question based on this insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(', ')}
    
    Create a HMW question that:
    1. Is specific and actionable
    2. Opens up solution space
    3. Is user-centered
    4. Is measurable
    
    Format as JSON with: question, reframingType, desirability, feasibility, viability
    `;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        id: this.generateId(),
        question: parsed.question,
        reframingType: parsed.reframingType,
        desirability: parsed.desirability,
        feasibility: parsed.feasibility,
        viability: parsed.viability,
        sourceInsight: insight,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating HMW question:', error);
      return null;
    }
  }

  /**
   * Generate problem statements from insights
   */
  async generateProblemStatements(insights: Insight[]): Promise<ProblemStatement[]> {
    const statements: ProblemStatement[] = [];

    for (const insight of insights) {
      const statement = await this.generateProblemStatementFromInsight(insight);
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }

  /**
   * Generate problem statement from insight
   */
  private async generateProblemStatementFromInsight(insight: Insight): Promise<ProblemStatement | null> {
    const prompt = `
    Generate a problem statement (POV) based on this insight:
    
    Insight: ${insight.content}
    Opportunities: ${insight.opportunities?.join(', ')}
    
    Create a POV statement using the format:
    [User] needs [Need] because [Insight]
    
    Make it:
    1. User-centered
    2. Specific
    3. Actionable
    4. Not prescriptive
    
    Format as JSON with: userDescription, need, insight, supportingEvidence
    `;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        id: this.generateId(),
        userDescription: parsed.userDescription,
        need: parsed.need,
        insight: parsed.insight,
        supportingEvidence: parsed.supportingEvidence,
        sourceInsight: insight,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error generating problem statement:', error);
      return null;
    }
  }

  /**
   * Generate insight map showing relationships
   */
  async generateInsightMap(workflowId: string): Promise<InsightMap> {
    const insights = await this.getWorkflowInsights(workflowId);
    const relationships = await this.identifyRelationships(insights);
    const clusters = await this.clusterInsights(insights);
    const criticalPath = await this.identifyCriticalPath(insights);

    return {
      nodes: insights.map(i => ({
        id: i.id,
        label: i.content,
        phase: i.phase,
        importance: i.importance,
        connections: i.connections
      })),
      edges: relationships,
      clusters,
      criticalPath
    };
  }

  /**
   * Compare two insights to identify transformation
   */
  private compareInsights(insight1: Insight, insight2: Insight): InsightTransformation {
    return {
      type: this.determineTransformationType(insight1, insight2),
      changes: this.identifyChanges(insight1, insight2),
      improvements: this.identifyImprovements(insight1, insight2),
      newElements: this.identifyNewElements(insight1, insight2)
    };
  }

  /**
   * Measure insight impact
   */
  private async measureInsightImpact(insightId: string): Promise<InsightImpact> {
    // Implementation for measuring insight impact
    return {
      usageCount: 0,
      influenceScore: 0,
      businessValue: 0,
      timeToImpact: 0
    };
  }

  /**
   * Calculate business value of insight
   */
  private async calculateBusinessValue(insightId: string): Promise<number> {
    // Implementation for calculating business value
    return 0;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Supporting classes
class PatternEngine {
  async categorizePainPoints(painPoints: string[]): Promise<PainCategory[]> {
    // Implementation for pain point categorization
    return [];
  }

  async analyzeEmotions(emotions: string[]): Promise<EmotionalAnalysis[]> {
    // Implementation for emotional analysis
    return [];
  }
}

class SynthesisEngine {
  // Implementation for insight synthesis
}

class EvolutionTracker {
  async getEvolution(insightId: string): Promise<Insight[]> {
    // Implementation for tracking insight evolution
    return [];
  }
}

// Type definitions
interface EmpathyData {
  pains: string[];
  thinkAndFeel: string[];
  sayAndDo: string[];
  see: string[];
  hear: string[];
  gains: string[];
}

interface Pattern {
  type: string;
  category: string;
  frequency: number;
  severity?: number;
  intensity?: number;
  description: string;
  confidence: number;
}

interface Insight {
  id: string;
  content: string;
  type: string;
  importance?: number;
  opportunities?: string[];
  implications?: string[];
  sourcePattern?: Pattern;
  confidence: number;
  businessImpact?: BusinessImpact;
  createdAt: Date;
  phase?: string;
  connections?: string[];
}

interface BusinessImpact {
  revenue: number;
  costReduction: number;
  customerSatisfaction: number;
  competitiveAdvantage: number;
  marketOpportunity: number;
  overallScore: number;
}

interface InsightEvolution {
  originalInsight: Insight;
  transformations: InsightTransformation[];
  finalOutcome: Insight;
  impact: InsightImpact;
  businessValue: number;
}

interface InsightTransformation {
  type: string;
  changes: string[];
  improvements: string[];
  newElements: string[];
}

interface InsightImpact {
  usageCount: number;
  influenceScore: number;
  businessValue: number;
  timeToImpact: number;
}

interface HMWQuestion {
  id: string;
  question: string;
  reframingType: string;
  desirability: number;
  feasibility: number;
  viability: number;
  sourceInsight: Insight;
  createdAt: Date;
}

interface ProblemStatement {
  id: string;
  userDescription: string;
  need: string;
  insight: string;
  supportingEvidence: string[];
  sourceInsight: Insight;
  createdAt: Date;
}

interface InsightMap {
  nodes: InsightNode[];
  edges: InsightEdge[];
  clusters: InsightCluster[];
  criticalPath: string[];
}

interface InsightNode {
  id: string;
  label: string;
  phase: string;
  importance: number;
  connections: string[];
}

interface InsightEdge {
  from: string;
  to: string;
  type: string;
  strength: number;
}

interface InsightCluster {
  id: string;
  name: string;
  insights: string[];
  theme: string;
}

interface PainCategory {
  category: string;
  frequency: number;
  severity: number;
  description: string;
  confidence: number;
}

interface EmotionalAnalysis {
  category: string;
  frequency: number;
  intensity: number;
  description: string;
  confidence: number;
}
