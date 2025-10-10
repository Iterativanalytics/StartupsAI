import { Agent } from '../../core/agent';
import { EmpathyMapData } from '../../types/dt-types';

export interface EmpathyAnalysis {
  completenessScore: number;
  missingDimensions: string[];
  insights: string[];
  suggestions: string[];
  qualityScore: number;
}

export interface POVValidation {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export class EmpathyCoachAgent extends Agent {
  constructor() {
    super({
      name: 'Empathy Coach',
      description: 'Helps users build better empathy maps and conduct user research',
      capabilities: [
        'analyze_empathy_data',
        'suggest_interview_questions',
        'validate_pov_statements',
        'identify_research_gaps',
        'recommend_empathy_techniques'
      ]
    });
  }

  async analyzeEmpathyMap(empathyMap: EmpathyMapData): Promise<EmpathyAnalysis> {
    const analysis = await this.analyze({
      prompt: `
        Analyze this empathy map for completeness and quality:
        
        User Persona: ${empathyMap.userPersona}
        Think & Feel: ${empathyMap.thinkAndFeel.join(', ')}
        Say & Do: ${empathyMap.sayAndDo.join(', ')}
        See: ${empathyMap.see.join(', ')}
        Hear: ${empathyMap.hear.join(', ')}
        Pains: ${empathyMap.pains.join(', ')}
        Gains: ${empathyMap.gains.join(', ')}
        
        Provide a comprehensive analysis including:
        1. Completeness score (0-100) based on how many quadrants have meaningful content
        2. Missing dimensions - which quadrants need more depth
        3. Quality insights - what patterns or insights emerge
        4. Specific suggestions for improvement
        5. Overall quality score (0-100)
        
        Focus on:
        - Depth of understanding (not just surface-level observations)
        - Emotional insights (what the user really feels)
        - Contextual factors (environment, influences)
        - Pain points and motivations
        - Actionable insights for design decisions
      `,
      context: { empathyMap }
    });

    return {
      completenessScore: analysis.completenessScore || 0,
      missingDimensions: analysis.missingDimensions || [],
      insights: analysis.insights || [],
      suggestions: analysis.suggestions || [],
      qualityScore: analysis.qualityScore || 0
    };
  }

  async generateInterviewQuestions(researchGoals: string[], targetPersona: string): Promise<string[]> {
    const questions = await this.analyze({
      prompt: `
        Generate user interview questions for:
        Research Goals: ${researchGoals.join(', ')}
        Target Persona: ${targetPersona}
        
        Create 10-15 open-ended questions that will help understand:
        1. User needs and frustrations
        2. Current solutions and workarounds
        3. Emotional drivers and motivations
        4. Context and environment
        5. Decision-making processes
        
        Guidelines:
        - Use open-ended questions (What, How, Why, Tell me about...)
        - Avoid leading questions or solution-focused language
        - Focus on behaviors and experiences, not opinions
        - Include questions about emotions and feelings
        - Ask about specific situations and contexts
        - Include follow-up prompts for deeper exploration
        
        Format as a simple array of questions.
      `,
      context: { researchGoals, targetPersona }
    });

    return questions;
  }

  async validatePOVStatement(pov: string, empathyData: EmpathyMapData): Promise<POVValidation> {
    const validation = await this.analyze({
      prompt: `
        Validate this POV statement against empathy data:
        
        POV: ${pov}
        
        Empathy Data:
        - Think & Feel: ${empathyData.thinkAndFeel.join(', ')}
        - Say & Do: ${empathyData.sayAndDo.join(', ')}
        - Pains: ${empathyData.pains.join(', ')}
        - Gains: ${empathyData.gains.join(', ')}
        
        Check for:
        1. Solution bias (avoiding "needs an app" language)
        2. Evidence from empathy data
        3. Specificity (not generic "users")
        4. Emotional insight
        5. Actionable need (not just a want)
        
        Provide:
        - Validation score (0-100)
        - Specific issues found
        - Suggestions for improvement
        - Whether the POV is valid for ideation
        
        A good POV should:
        - Be specific about the user
        - Focus on a real need, not a solution
        - Include emotional insight
        - Be supported by empathy data
        - Be actionable for ideation
      `,
      context: { pov, empathyData }
    });

    return {
      isValid: validation.isValid || false,
      score: validation.score || 0,
      issues: validation.issues || [],
      suggestions: validation.suggestions || []
    };
  }

  async identifyResearchGaps(empathyMap: EmpathyMapData): Promise<string[]> {
    const gaps = await this.analyze({
      prompt: `
        Identify research gaps in this empathy map:
        
        User Persona: ${empathyMap.userPersona}
        Think & Feel: ${empathyMap.thinkAndFeel.join(', ')}
        Say & Do: ${empathyMap.sayAndDo.join(', ')}
        See: ${empathyMap.see.join(', ')}
        Hear: ${empathyMap.hear.join(', ')}
        Pains: ${empathyMap.pains.join(', ')}
        Gains: ${empathyMap.gains.join(', ')}
        
        Identify specific gaps in understanding:
        1. Missing emotional insights
        2. Unclear user motivations
        3. Lack of contextual information
        4. Insufficient pain point understanding
        5. Missing user goals and aspirations
        
        Provide specific, actionable research recommendations.
      `,
      context: { empathyMap }
    });

    return gaps;
  }

  async recommendEmpathyTechniques(userProfile: any): Promise<string[]> {
    const techniques = await this.analyze({
      prompt: `
        Recommend empathy techniques based on user profile:
        
        User Profile: ${JSON.stringify(userProfile)}
        
        Suggest specific empathy techniques that would be most effective:
        1. User interview techniques
        2. Observation methods
        3. Empathy mapping approaches
        4. User journey mapping
        5. Persona development
        6. Contextual inquiry methods
        
        Consider:
        - User's experience level with empathy techniques
        - Available time and resources
        - Target user type
        - Research goals
        - Team composition
        
        Provide specific, actionable recommendations.
      `,
      context: { userProfile }
    });

    return techniques;
  }

  async generateEmpathyInsights(empathyMap: EmpathyMapData): Promise<string[]> {
    const insights = await this.analyze({
      prompt: `
        Generate actionable insights from this empathy map:
        
        User Persona: ${empathyMap.userPersona}
        Think & Feel: ${empathyMap.thinkAndFeel.join(', ')}
        Say & Do: ${empathyMap.sayAndDo.join(', ')}
        See: ${empathyMap.see.join(', ')}
        Hear: ${empathyMap.hear.join(', ')}
        Pains: ${empathyMap.pains.join(', ')}
        Gains: ${empathyMap.gains.join(', ')}
        
        Generate 5-7 actionable insights that could inform design decisions:
        1. Key user motivations
        2. Critical pain points
        3. Emotional drivers
        4. Contextual factors
        5. Opportunities for improvement
        6. User behavior patterns
        7. Design implications
        
        Focus on insights that are:
        - Actionable for design
        - Supported by the data
        - Specific and concrete
        - Emotionally resonant
        - Contextually relevant
      `,
      context: { empathyMap }
    });

    return insights;
  }

  async suggestEmpathyMapImprovements(empathyMap: EmpathyMapData): Promise<string[]> {
    const improvements = await this.analyze({
      prompt: `
        Suggest specific improvements for this empathy map:
        
        User Persona: ${empathyMap.userPersona}
        Think & Feel: ${empathyMap.thinkAndFeel.join(', ')}
        Say & Do: ${empathyMap.sayAndDo.join(', ')}
        See: ${empathyMap.see.join(', ')}
        Hear: ${empathyMap.hear.join(', ')}
        Pains: ${empathyMap.pains.join(', ')}
        Gains: ${empathyMap.gains.join(', ')}
        
        Provide specific, actionable suggestions for:
        1. Adding missing insights
        2. Deepening existing insights
        3. Improving specificity
        4. Adding emotional depth
        5. Including contextual factors
        6. Strengthening pain point understanding
        7. Clarifying user goals
        
        Focus on practical improvements that can be implemented immediately.
      `,
      context: { empathyMap }
    });

    return improvements;
  }
}
