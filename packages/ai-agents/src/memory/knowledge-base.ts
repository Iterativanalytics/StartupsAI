import { KnowledgeEntry } from '../types';

export class KnowledgeBase {
  private knowledge: Map<string, KnowledgeEntry[]>;

  constructor() {
    this.knowledge = new Map();
    this.initializeBaseKnowledge();
  }

  private initializeBaseKnowledge(): void {
    // Business advice knowledge
    this.addKnowledge({
      id: 'kb-1',
      category: 'business_planning',
      title: 'Business Plan Essentials',
      content: 'A comprehensive business plan should include: Executive Summary, Company Description, Market Analysis, Organization & Management, Service/Product Line, Marketing & Sales, Funding Request, Financial Projections.',
      embedding: [],
      source: 'platform_knowledge',
      tags: ['business-plan', 'entrepreneur', 'startup']
    });

    // Investment knowledge
    this.addKnowledge({
      id: 'kb-2',
      category: 'investment_analysis',
      title: 'SaaS Valuation Multiples',
      content: 'Typical SaaS company valuation multiples: Early stage (ARR < $1M): 3-6x ARR, Growth stage ($1M-$10M ARR): 6-12x ARR, Late stage (>$10M ARR): 10-20x ARR. High growth companies command premium multiples.',
      embedding: [],
      source: 'market_research',
      tags: ['valuation', 'saas', 'investor']
    });

    // Credit assessment knowledge
    this.addKnowledge({
      id: 'kb-3',
      category: 'credit_assessment',
      title: 'DSCR Guidelines',
      content: 'Debt Service Coverage Ratio (DSCR) guidelines: DSCR > 1.25 is considered healthy, 1.0-1.25 is acceptable with conditions, < 1.0 indicates insufficient cash flow to service debt.',
      embedding: [],
      source: 'lending_standards',
      tags: ['credit', 'dscr', 'lender']
    });

    // Impact evaluation knowledge
    this.addKnowledge({
      id: 'kb-4',
      category: 'impact_measurement',
      title: 'ESG Scoring Framework',
      content: 'ESG evaluation framework: Environmental (carbon footprint, resource efficiency, waste management), Social (labor practices, community impact, diversity), Governance (board structure, ethics, transparency). Score each 0-100.',
      embedding: [],
      source: 'impact_standards',
      tags: ['esg', 'impact', 'grantor']
    });

    // Partnership knowledge
    this.addKnowledge({
      id: 'kb-5',
      category: 'partnership',
      title: 'Accelerator Success Factors',
      content: 'Key factors for accelerator success: Strong mentor network, Industry connections, Structured curriculum, Demo day preparation, Follow-on funding access, Alumni network, Dedicated program managers.',
      embedding: [],
      source: 'program_research',
      tags: ['accelerator', 'partner', 'mentorship']
    });
  }

  addKnowledge(entry: KnowledgeEntry): void {
    const category = entry.category;
    const entries = this.knowledge.get(category) || [];
    entries.push(entry);
    this.knowledge.set(category, entries);
  }

  search(query: string, category?: string, limit: number = 5): KnowledgeEntry[] {
    let entries: KnowledgeEntry[] = [];

    if (category) {
      entries = this.knowledge.get(category) || [];
    } else {
      this.knowledge.forEach(categoryEntries => {
        entries.push(...categoryEntries);
      });
    }

    // Simple keyword matching - in production would use vector similarity
    const queryLower = query.toLowerCase();
    const scored = entries.map(entry => ({
      entry,
      score: this.scoreRelevance(entry, queryLower)
    }));

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.entry);
  }

  private scoreRelevance(entry: KnowledgeEntry, query: string): number {
    let score = 0;

    // Check title match
    if (entry.title.toLowerCase().includes(query)) score += 10;

    // Check content match
    if (entry.content.toLowerCase().includes(query)) score += 5;

    // Check tags match
    entry.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())) {
        score += 3;
      }
    });

    return score;
  }

  getByCategory(category: string): KnowledgeEntry[] {
    return this.knowledge.get(category) || [];
  }

  getAllCategories(): string[] {
    return Array.from(this.knowledge.keys());
  }
}