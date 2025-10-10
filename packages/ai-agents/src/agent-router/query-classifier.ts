import { QueryType } from '../types';

/**
 * Query Classifier - Determines the type of user query for intelligent routing
 */
export class QueryClassifier {
  private patterns = {
    // Co-Agent territory: Strategic, personal, relationship-focused
    [QueryType.STRATEGIC]: [
      /strategy|direction|should i|advice|what do you think|help me decide/i,
      /pivot|market entry|expansion|product direction/i,
      /long.?term|vision|mission|goals/i,
      /competitive|positioning|differentiation/i
    ],
    [QueryType.ACCOUNTABILITY]: [
      /progress|committed|goal|deadline|check.?in/i,
      /update|status|follow.?up|reminder/i,
      /accomplished|completed|behind|stuck/i,
      /accountability|track|measure/i
    ],
    [QueryType.EMOTIONAL]: [
      /stressed|worried|scared|excited|frustrated|overwhelmed/i,
      /feel|feeling|emotion|morale|confidence/i,
      /doubt|uncertain|anxious|motivated/i,
      /celebration|celebrate|proud|disappointed/i
    ],
    [QueryType.RELATIONSHIP]: [
      /how am i doing|partnership|feedback|our work together/i,
      /trust|relationship|communication|understanding/i,
      /appreciate|grateful|thankful|working well/i,
      /not helpful|different approach|change style/i
    ],
    [QueryType.BRAINSTORM]: [
      /ideas|brainstorm|what if|creative|innovative/i,
      /alternatives|options|possibilities|approach/i,
      /think outside|unconventional|unique|novel/i,
      /creativity|inspiration|spark|generate/i
    ],
    
    // Functional Agent territory: Specific tasks, analysis, execution
    [QueryType.ANALYSIS]: [
      /analyze|evaluate|assess|calculate|forecast|model/i,
      /financial|revenue|profit|cash flow|valuation/i,
      /metrics|kpi|performance|benchmark/i,
      /market analysis|competitive analysis|swot/i
    ],
    [QueryType.RESEARCH]: [
      /research|find|lookup|data on|information about/i,
      /competitor|market size|industry trends/i,
      /customer|user research|survey|interview/i,
      /due diligence|background check|verify/i
    ],
    [QueryType.DOCUMENT]: [
      /review|edit|improve|draft|create|write/i,
      /business plan|pitch deck|proposal|contract/i,
      /document|report|presentation|memo/i,
      /format|structure|organize|outline/i
    ],
    [QueryType.TECHNICAL]: [
      /build|implement|code|technical|integrate/i,
      /system|platform|infrastructure|architecture/i,
      /api|database|deployment|hosting/i,
      /troubleshoot|debug|fix|error/i
    ],
    [QueryType.REPORTING]: [
      /report|dashboard|metrics|kpi|summary/i,
      /chart|graph|visualization|display/i,
      /export|download|generate|create/i,
      /monthly|weekly|quarterly|annual/i
    ]
  };

  private contextClues = {
    // Emotional context indicators
    urgency: /urgent|asap|emergency|critical|immediately/i,
    confusion: /confused|lost|don't understand|not sure/i,
    satisfaction: /great|awesome|perfect|exactly|love it/i,
    dissatisfaction: /not working|unhelpful|frustrating|wrong/i,
    
    // Task context indicators
    deadline: /by \w+|due|deadline|timeline|schedule/i,
    specific: /exactly|precisely|specific|detailed|step.?by.?step/i,
    exploratory: /explore|consider|possibility|maybe|perhaps/i,
    decisive: /decide|choose|pick|select|final/i
  };

  classify(query: string): QueryType {
    const normalizedQuery = query.toLowerCase();
    
    // Score each pattern type
    const scores: Record<QueryType, number> = {} as any;
    
    for (const [type, patterns] of Object.entries(this.patterns)) {
      scores[type as QueryType] = 0;
      
      for (const pattern of patterns) {
        if (pattern.test(normalizedQuery)) {
          scores[type as QueryType] += 1;
        }
      }
      
      // Boost scores based on context clues
      this.applyContextBoosts(normalizedQuery, type as QueryType, scores);
    }
    
    // Find the highest scoring type
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return QueryType.GENERAL;
    }
    
    const topType = Object.entries(scores).find(([, score]) => score === maxScore)?.[0];
    return (topType as QueryType) || QueryType.GENERAL;
  }

  private applyContextBoosts(
    query: string, 
    type: QueryType, 
    scores: Record<QueryType, number>
  ): void {
    // Emotional queries get boost from emotional context
    if ([QueryType.STRATEGIC, QueryType.EMOTIONAL, QueryType.RELATIONSHIP].includes(type)) {
      if (this.contextClues.urgency.test(query)) scores[type] += 0.5;
      if (this.contextClues.confusion.test(query)) scores[type] += 0.5;
      if (this.contextClues.satisfaction.test(query)) scores[QueryType.RELATIONSHIP] += 1;
      if (this.contextClues.dissatisfaction.test(query)) scores[QueryType.RELATIONSHIP] += 1;
    }
    
    // Task-focused queries get boost from task context
    if ([QueryType.ANALYSIS, QueryType.RESEARCH, QueryType.DOCUMENT, QueryType.TECHNICAL].includes(type)) {
      if (this.contextClues.deadline.test(query)) scores[type] += 0.5;
      if (this.contextClues.specific.test(query)) scores[type] += 0.5;
      if (this.contextClues.decisive.test(query)) scores[type] += 0.3;
    }
    
    // Exploratory context boosts strategic and brainstorm
    if (this.contextClues.exploratory.test(query)) {
      scores[QueryType.STRATEGIC] += 0.3;
      scores[QueryType.BRAINSTORM] += 0.3;
    }
  }

  getQueryMetadata(query: string) {
    const classified = this.classify(query);
    const normalizedQuery = query.toLowerCase();
    
    return {
      type: classified,
      confidence: this.calculateConfidence(query, classified),
      context: {
        hasUrgency: this.contextClues.urgency.test(normalizedQuery),
        isExploratory: this.contextClues.exploratory.test(normalizedQuery),
        needsSpecific: this.contextClues.specific.test(normalizedQuery),
        hasDeadline: this.contextClues.deadline.test(normalizedQuery),
        isEmotional: this.contextClues.confusion.test(normalizedQuery) || 
                    this.contextClues.satisfaction.test(normalizedQuery) ||
                    this.contextClues.dissatisfaction.test(normalizedQuery)
      },
      suggestedApproach: this.suggestApproach(classified, normalizedQuery)
    };
  }

  private calculateConfidence(query: string, type: QueryType): number {
    const patterns = this.patterns[type] || [];
    const matches = patterns.filter(pattern => pattern.test(query.toLowerCase())).length;
    return Math.min(matches / 2, 1); // Normalize to 0-1, with 2+ matches = high confidence
  }

  private suggestApproach(type: QueryType, query: string): string {
    const coAgentTypes = [QueryType.STRATEGIC, QueryType.ACCOUNTABILITY, QueryType.EMOTIONAL, 
                          QueryType.RELATIONSHIP, QueryType.BRAINSTORM];
    
    if (coAgentTypes.includes(type)) {
      return 'conversational';
    } else {
      return 'task_focused';
    }
  }
}
