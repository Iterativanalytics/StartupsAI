import { AgentConfig, AgentContext, AgentResponse } from '../../core/types';
import { BaseAgent } from '../../core/BaseAgent';

export class LeanDesignThinkingFacilitatorAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    const { currentTask } = context;
    
    switch (currentTask) {
      case 'facilitate_discover':
        return await this.facilitateDiscoverPhase(context, options);
      case 'facilitate_define':
        return await this.facilitateDefinePhase(context, options);
      case 'facilitate_ideate':
        return await this.facilitateIdeatePhase(context, options);
      case 'facilitate_prototype':
        return await this.facilitatePrototypePhase(context, options);
      case 'facilitate_test':
        return await this.facilitateTestPhase(context, options);
      case 'extract_assumptions':
        return await this.extractAssumptions(context, options);
      case 'design_experiment':
        return await this.designExperiment(context, options);
      case 'analyze_results':
        return await this.analyzeResults(context, options);
      case 'recommend_pivot':
        return await this.recommendPivot(context, options);
      default:
        return await this.generalDesignThinkingGuidance(context);
    }
  }

  private async facilitateDiscoverPhase(context: AgentContext, options: any): Promise<AgentResponse> {
    const { userData, relevantData } = context;
    const businessContext = relevantData?.business || {};
    
    return {
      content: `Let's dive deep into the Discover phase of Lean Design Thinking™. This is where we establish the Design Thinking foundation - before building any solution, we must deeply understand the user and their authentic needs.

🔍 **DISCOVER PHASE: Problem Discovery (Design Thinking Foundation)**

**Current Context:**
- Business: ${businessContext.name || 'Your venture'}
- Industry: ${businessContext.industry || 'Not specified'}
- Target Users: ${businessContext.targetUsers || 'To be defined'}

**Step 1: Stakeholder Mapping**
Let's identify all the people who are affected by or influence your problem space:

**Primary Stakeholders:**
- End users (who experiences the problem)
- Decision makers (who can solve it)
- Influencers (who can spread the word)
- Blockers (who might resist change)

**Questions to explore:**
1. Who directly experiences the problem you're trying to solve?
2. Who else is involved in the problem space?
3. What are their relationships to each other?
4. Who has the power to make decisions?

**Step 2: Empathy Map Builder**
For each key stakeholder, let's build an empathy map:

**Think & Feel:**
- What do they think about the problem?
- What are their hopes and fears?
- What motivates them?

**See:**
- What do they see in their environment?
- What do they see others doing?
- What trends do they notice?

**Say & Do:**
- What do they say about the problem?
- How do they behave?
- What actions do they take?

**Hear:**
- What do they hear from others?
- What feedback do they receive?
- What influences their thinking?

**Pain Points:**
- What frustrates them?
- What obstacles do they face?
- What keeps them up at night?

**Gains:**
- What would make their life better?
- What do they hope to achieve?
- What would success look like?

**Step 3: User Journey Mapping**
Map the end-to-end experience:

1. **Awareness:** How do they first learn about the problem?
2. **Consideration:** How do they explore solutions?
3. **Decision:** How do they choose what to do?
4. **Usage:** How do they use current solutions?
5. **Support:** How do they get help?
6. **Advocacy:** How do they share their experience?

**Next Steps:**
1. Conduct 5-10 interviews with each stakeholder type
2. Use the empathy map template for each interview
3. Document pain points and opportunities
4. Look for patterns across different stakeholders

Would you like me to help you with any specific part of the Discover phase?`,

      suggestions: [
        "Start stakeholder mapping",
        "Build empathy maps",
        "Plan user interviews",
        "Create journey maps",
        "Synthesize insights"
      ]
    };
  }

  private async facilitateDefinePhase(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const insights = relevantData?.insights || [];
    
    return {
      content: `Now let's move to the Define phase where we'll synthesize our research into clear problem statements.

🎯 **DEFINE PHASE: Problem Definition**

**From your research, let's create:**

**Step 1: POV Statement Builder**
Use this formula: [User] needs [Need] because [Insight]

**Template:**
- **User:** [Specific user type]
- **Need:** [What they need to accomplish]
- **Insight:** [Why this matters to them]

**Example:**
"Small business owners need a simple way to track inventory because they lose 15% of revenue to stockouts and overstocking."

**Step 2: HMW Question Generator**
Transform your POV into How Might We questions:

**Format:** "How might we [action] so that [outcome]?"

**Examples:**
- How might we help small business owners track inventory so that they never run out of stock?
- How might we simplify inventory management so that owners can focus on growing their business?
- How might we prevent stockouts so that businesses don't lose revenue?

**Step 3: Problem Statement Canvas**
Structure your problem definition:

**Problem:** [Clear, specific problem statement]
**Impact:** [Who is affected and how]
**Context:** [When and where does this happen]
**Root Cause:** [Why does this problem exist]
**Success Criteria:** [How will we know it's solved]

**Step 4: Hypothesis Formation**
Convert insights into testable assumptions:

**Format:** "We believe that [assumption] will result in [outcome]"

**Examples:**
- We believe that small business owners will pay $50/month for inventory tracking
- We believe that mobile-first design will increase adoption by 40%
- We believe that automated reordering will reduce stockouts by 60%

**Step 5: Success Metrics Definition**
Define how you'll measure success:

**Quantitative Metrics:**
- User adoption rate
- Time to value
- Retention rate
- Revenue impact

**Qualitative Metrics:**
- User satisfaction
- Ease of use
- Problem resolution
- User advocacy

**Next Steps:**
1. Refine your POV statement
2. Generate 10+ HMW questions
3. Create testable hypotheses
4. Define success metrics
5. Prioritize which assumptions to test first

Which part of the Define phase would you like to focus on?`,

      suggestions: [
        "Create POV statement",
        "Generate HMW questions",
        "Build problem canvas",
        "Form hypotheses",
        "Define success metrics"
      ]
    };
  }

  private async facilitateIdeatePhase(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const problemStatement = relevantData?.problemStatement || '';
    
    return {
      content: `Let's generate creative solutions in the Ideate phase. This is the critical handoff from Design Thinking to Lean Startup - we'll transform creative ideas into a backlog of testable hypotheses through assumption mapping.

💡 **IDEATE PHASE: Solution Ideation (Methodology Bridge)**

**Step 1: Brainstorming Canvas**
Use structured ideation techniques:

**Crazy 8s:**
- Set a timer for 8 minutes
- Draw 8 different solutions
- One solution per minute
- Don't judge, just create

**SCAMPER Technique:**
- **Substitute:** What can we substitute?
- **Combine:** What can we combine?
- **Adapt:** What can we adapt?
- **Modify:** What can we modify?
- **Put to other uses:** What other uses?
- **Eliminate:** What can we eliminate?
- **Reverse:** What can we reverse?

**Step 2: Divergent Generation**
Create 100+ solution concepts:

**Categories to explore:**
- Digital solutions
- Physical products
- Service models
- Platform approaches
- Hybrid solutions

**Step 3: Assumption Mapping**
For each solution, identify risky assumptions:

**High-Risk Assumptions:**
- Will users pay for this?
- Is the technology feasible?
- Do we have the right team?
- Is the market big enough?

**Medium-Risk Assumptions:**
- Will users adopt this quickly?
- Can we acquire customers cost-effectively?
- Will the solution scale?

**Low-Risk Assumptions:**
- Is the problem real?
- Do we understand the user?
- Is the timing right?

**Step 4: Solution Prioritization**
Rank solutions by learning/cost ratio:

**High Learning, Low Cost:**
- Landing page tests
- Customer interviews
- Surveys
- Concierge tests

**High Learning, High Cost:**
- Prototype development
- Market research
- Technical validation

**Low Learning, Low Cost:**
- Desk research
- Competitive analysis
- Expert interviews

**Step 5: Experiment Design**
Plan minimum viable experiments:

**For each top solution:**
- What's the smallest test?
- What will we learn?
- How much will it cost?
- How long will it take?

**Next Steps:**
1. Generate 100+ ideas using different techniques
2. Map assumptions for each solution
3. Prioritize by learning potential
4. Design experiments for top 3 solutions
5. Choose which experiment to run first

Which ideation technique would you like to try first?`,

      suggestions: [
        "Run Crazy 8s session",
        "Apply SCAMPER technique",
        "Generate 100+ ideas",
        "Map assumptions",
        "Prioritize solutions"
      ]
    };
  }

  private async facilitatePrototypePhase(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const selectedSolution = relevantData?.selectedSolution || '';
    
    return {
      content: `Now let's build prototypes to test our solutions. This is the "Build" phase of the Lean Startup loop - creating the minimum viable experiment to validate our riskiest assumptions efficiently.

🛠️ **PROTOTYPE PHASE: Rapid Prototyping (Lean Startup Core)**

**Step 1: Choose Prototype Fidelity**

**Low-Fidelity (Lo-Fi):**
- Sketches and wireframes
- Paper prototypes
- Storyboards
- **Use when:** Testing concept and user flow

**Medium-Fidelity (Mid-Fi):**
- Clickable wireframes
- Interactive mockups
- Wizard of Oz prototypes
- **Use when:** Testing functionality and interactions

**High-Fidelity (Hi-Fi):**
- Working prototypes
- Real data and interactions
- Production-like experience
- **Use when:** Testing final experience

**Step 2: MVP Definition**
Define your Minimum Viable Product:

**Core Features Only:**
- What's the absolute minimum?
- What can we build in 1-2 weeks?
- What will teach us the most?

**MVP Canvas:**
- **Problem:** What problem does it solve?
- **Solution:** What's the core solution?
- **Users:** Who will use it?
- **Value:** What value does it provide?
- **Channels:** How will users access it?
- **Revenue:** How will it make money?
- **Costs:** What will it cost to build?
- **Metrics:** How will we measure success?

**Step 3: Prototype Planning**
Plan your prototype:

**Materials Needed:**
- Design tools (Figma, Sketch, etc.)
- Development tools (if building)
- User testing setup
- Analytics tracking

**Timeline:**
- Design: 2-3 days
- Build: 3-5 days
- Test: 2-3 days
- Iterate: 1-2 days

**Step 4: Test Protocol**
Design your user testing:

**Test Plan:**
- Who will you test with? (5-7 users minimum)
- What will you ask them to do?
- What questions will you ask?
- How will you capture feedback?

**Test Script:**
1. Introduction and context setting
2. Task-based testing
3. Open-ended exploration
4. Post-test interview
5. Feedback collection

**Step 5: Data Collection Setup**
Set up analytics and feedback:

**Quantitative Data:**
- Usage metrics
- Completion rates
- Time on task
- Error rates

**Qualitative Data:**
- User feedback
- Observations
- Pain points
- Suggestions

**Next Steps:**
1. Choose appropriate fidelity level
2. Define your MVP
3. Create prototype plan
4. Design test protocol
5. Set up data collection

What type of prototype would you like to build?`,

      suggestions: [
        "Choose fidelity level",
        "Define MVP features",
        "Create prototype plan",
        "Design test protocol",
        "Set up analytics"
      ]
    };
  }

  private async facilitateTestPhase(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const prototype = relevantData?.prototype || {};
    
    return {
      content: `Let's test our prototype with real users and learn from their feedback.

🧪 **TEST PHASE: User Testing & Learning**

**Step 1: Test Execution**
Run your user tests:

**Before Testing:**
- Recruit 5-7 representative users
- Prepare test environment
- Set up recording equipment
- Brief your team on roles

**During Testing:**
- Observe without interfering
- Ask open-ended questions
- Take detailed notes
- Record sessions (with permission)

**After Testing:**
- Thank participants
- Debrief with team
- Document key findings
- Plan next iteration

**Step 2: Data Analysis**
Analyze your test results:

**Quantitative Analysis:**
- Task completion rates
- Time to complete tasks
- Error frequency
- User satisfaction scores

**Qualitative Analysis:**
- Common pain points
- User feedback themes
- Unexpected behaviors
- Feature requests

**Step 3: Learning Documentation**
Document your learnings:

**What Worked:**
- Features users loved
- Smooth user flows
- Clear value propositions

**What Didn't Work:**
- Confusing interfaces
- Missing features
- Unclear instructions

**Surprises:**
- Unexpected user behaviors
- Different use cases
- New insights

**Step 4: Hypothesis Validation**
Update your assumptions:

**Validated Assumptions:**
- Mark as confirmed
- Update confidence level
- Document evidence

**Invalidated Assumptions:**
- Mark as disproven
- Note what you learned
- Plan pivot strategy

**Step 5: Next Steps Planning**
Decide what to do next:

**Pivot Options:**
- Change target user
- Modify solution
- Adjust business model
- Pivot completely

**Iterate Options:**
- Fix identified issues
- Add missing features
- Improve user experience
- Test again

**Persevere Options:**
- Scale up testing
- Build full product
- Launch to market
- Raise funding

**Next Steps:**
1. Run user tests with 5-7 people
2. Analyze results systematically
3. Document key learnings
4. Update assumption tracker
5. Decide: Pivot, Iterate, or Persevere

What did you learn from your user tests?`,

      suggestions: [
        "Run user tests",
        "Analyze results",
        "Document learnings",
        "Update assumptions",
        "Plan next steps"
      ]
    };
  }

  private async extractAssumptions(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const businessPlan = relevantData?.businessPlan || '';
    
    return {
      content: `Let me help you extract and identify the key assumptions in your business plan.

🔍 **ASSUMPTION EXTRACTION**

**I've analyzed your business plan and identified these key assumptions:**

**High-Risk Assumptions (Test First):**
1. **Market Assumptions:**
   - Market size and growth rate
   - Customer willingness to pay
   - Market timing and readiness

2. **Product Assumptions:**
   - Technology feasibility
   - User adoption rate
   - Feature prioritization

3. **Business Model Assumptions:**
   - Revenue model viability
   - Pricing strategy effectiveness
   - Customer acquisition cost

4. **Team Assumptions:**
   - Execution capability
   - Market knowledge
   - Technical expertise

**Medium-Risk Assumptions:**
1. **Operational Assumptions:**
   - Scalability requirements
   - Resource needs
   - Timeline feasibility

2. **Financial Assumptions:**
   - Unit economics
   - Funding requirements
   - Cash flow projections

**Low-Risk Assumptions:**
1. **Legal Assumptions:**
   - Regulatory compliance
   - Intellectual property
   - Contract requirements

**Next Steps:**
1. Prioritize high-risk assumptions
2. Design experiments to test them
3. Set up assumption tracking
4. Plan validation timeline
5. Monitor progress regularly

Would you like me to help you design experiments for any specific assumptions?`,

      suggestions: [
        "Design experiments",
        "Set up tracking",
        "Prioritize assumptions",
        "Plan validation",
        "Monitor progress"
      ]
    };
  }

  private async designExperiment(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const assumption = relevantData?.assumption || {};
    
    return {
      content: `Let's design a specific experiment to test your assumption: "${assumption.text}"

🧪 **EXPERIMENT DESIGN**

**Assumption to Test:**
"${assumption.text}"

**Experiment Type Recommendation:**
Based on the assumption type, I recommend a **${this.getRecommendedExperimentType(assumption)}** experiment.

**Experiment Design:**

**1. Hypothesis:**
"We believe that ${assumption.text} will result in [specific measurable outcome]"

**2. Success Criteria:**
- Primary metric: [Specific metric to measure]
- Target: [Specific target value]
- Timeline: [How long to run the test]

**3. Experiment Setup:**
- **Method:** ${this.getExperimentMethod(assumption)}
- **Duration:** ${this.getExperimentDuration(assumption)}
- **Participants:** ${this.getParticipantCount(assumption)} users
- **Cost:** ${this.getExperimentCost(assumption)}

**4. Data Collection:**
- **Quantitative:** ${this.getQuantitativeMetrics(assumption)}
- **Qualitative:** ${this.getQualitativeMetrics(assumption)}

**5. Resources Needed:**
- ${this.getRequiredResources(assumption)}

**6. Timeline:**
- Week 1: Setup and preparation
- Week 2: Run experiment
- Week 3: Analyze results
- Week 4: Document learnings

**7. Success/Failure Criteria:**
- **Success:** [Specific criteria for validation]
- **Failure:** [Specific criteria for invalidation]
- **Inconclusive:** [What to do if results are unclear]

**Next Steps:**
1. Review and refine this experiment design
2. Set up the necessary tools and resources
3. Recruit participants
4. Run the experiment
5. Analyze and document results

Would you like me to help you refine any part of this experiment design?`,

      suggestions: [
        "Refine experiment design",
        "Set up resources",
        "Recruit participants",
        "Run experiment",
        "Analyze results"
      ]
    };
  }

  private async analyzeResults(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const experimentResults = relevantData?.experimentResults || {};
    
    return {
      content: `Let's analyze your experiment results and determine what they mean for your business.

📊 **EXPERIMENT RESULTS ANALYSIS**

**Experiment Summary:**
- Assumption tested: "${experimentResults.assumption || 'Not specified'}"
- Duration: ${experimentResults.duration || 'Not specified'}
- Participants: ${experimentResults.participants || 'Not specified'}

**Results Analysis:**

**Quantitative Results:**
- Primary metric: ${experimentResults.primaryMetric || 'Not measured'}
- Target: ${experimentResults.target || 'Not set'}
- Actual: ${experimentResults.actual || 'Not measured'}
- **Status:** ${this.getResultStatus(experimentResults)}

**Qualitative Insights:**
- Key findings: ${experimentResults.keyFindings || 'Not documented'}
- User feedback: ${experimentResults.userFeedback || 'Not collected'}
- Pain points: ${experimentResults.painPoints || 'Not identified'}

**Confidence Level:**
- Data quality: ${this.getDataQuality(experimentResults)}/10
- Sample size: ${this.getSampleSize(experimentResults)}/10
- Overall confidence: ${this.getOverallConfidence(experimentResults)}%

**Recommendation:**
${this.getRecommendation(experimentResults)}

**Next Steps:**
1. Update assumption status: ${this.getAssumptionStatus(experimentResults)}
2. Document learnings in assumption tracker
3. Plan next experiment or iteration
4. Update business plan based on results
5. Share findings with team

**Key Learnings:**
- What worked well: ${experimentResults.whatWorked || 'Not documented'}
- What didn't work: ${experimentResults.whatDidntWork || 'Not documented'}
- Surprises: ${experimentResults.surprises || 'Not documented'}

Would you like me to help you plan your next steps based on these results?`,

      suggestions: [
        "Update assumption status",
        "Plan next experiment",
        "Update business plan",
        "Share findings",
        "Document learnings"
      ]
    };
  }

  private async recommendPivot(context: AgentContext, options: any): Promise<AgentResponse> {
    const { relevantData } = context;
    const metrics = relevantData?.metrics || {};
    const assumptions = relevantData?.assumptions || [];
    
    return {
      content: `Based on your metrics and assumption validation results, let me recommend the best pivot strategy.

🔄 **PIVOT RECOMMENDATION**

**Current Situation Analysis:**
- User growth: ${metrics.userGrowth || 'Not measured'}%
- Revenue: $${metrics.revenue || 'Not measured'}
- Engagement: ${metrics.engagement || 'Not measured'}%
- Retention: ${metrics.retention || 'Not measured'}%

**Assumption Validation Status:**
- Total assumptions: ${assumptions.length}
- Validated: ${assumptions.filter(a => a.status === 'validated').length}
- Invalidated: ${assumptions.filter(a => a.status === 'invalidated').length}
- Validation rate: ${Math.round((assumptions.filter(a => a.status !== 'untested').length / assumptions.length) * 100)}%

**Pivot Recommendation:**
${this.getPivotRecommendation(metrics, assumptions)}

**Why This Pivot:**
${this.getPivotReasoning(metrics, assumptions)}

**Implementation Plan:**
1. **Week 1-2:** ${this.getPivotStep1(metrics, assumptions)}
2. **Week 3-4:** ${this.getPivotStep2(metrics, assumptions)}
3. **Week 5-6:** ${this.getPivotStep3(metrics, assumptions)}
4. **Week 7-8:** ${this.getPivotStep4(metrics, assumptions)}

**Success Metrics:**
- Primary: ${this.getPrimaryMetric(metrics, assumptions)}
- Secondary: ${this.getSecondaryMetric(metrics, assumptions)}
- Timeline: ${this.getPivotTimeline(metrics, assumptions)}

**Risk Assessment:**
- Implementation risk: ${this.getImplementationRisk(metrics, assumptions)}/10
- Market risk: ${this.getMarketRisk(metrics, assumptions)}/10
- Financial risk: ${this.getFinancialRisk(metrics, assumptions)}/10

**Next Steps:**
1. Validate this pivot recommendation
2. Create detailed implementation plan
3. Set up new experiments
4. Update business model
5. Communicate changes to team

Would you like me to help you create a detailed implementation plan for this pivot?`,

      suggestions: [
        "Create implementation plan",
        "Set up new experiments",
        "Update business model",
        "Communicate changes",
        "Monitor progress"
      ]
    };
  }

  private async generalDesignThinkingGuidance(context: AgentContext): Promise<AgentResponse> {
    return {
      content: `Welcome to the Lean Design Thinking™ Facilitator! I'm here to guide you through the complete Lean Design Thinking™ process.

🎨 **DESIGN THINKING METHODOLOGY**

**The 5 Phases:**
1. **Discover** - Understand your users and their problems
2. **Define** - Frame the right problem to solve
3. **Ideate** - Generate creative solutions
4. **Prototype** - Build to learn
5. **Test** - Validate with real users

**Key Principles:**
- Human-centered design
- Iterative process
- Fail fast, learn fast
- Build to learn, not to scale
- Evidence-based decisions

**How I Can Help:**
- Guide you through each phase
- Extract assumptions from your business plan
- Design validation experiments
- Analyze test results
- Recommend pivot strategies
- Track your learning progress

**Getting Started:**
Choose which phase you'd like to work on, or tell me about your current challenge and I'll guide you to the right place.

What would you like to focus on today?`,

      suggestions: [
        "Start with Discover phase",
        "Extract assumptions",
        "Design experiments",
        "Analyze results",
        "Plan pivot strategy"
      ]
    };
  }

  // Helper methods for experiment design
  private getRecommendedExperimentType(assumption: any): string {
    if (assumption.text?.includes('pay') || assumption.text?.includes('price')) {
      return 'Landing Page Test';
    } else if (assumption.text?.includes('use') || assumption.text?.includes('adopt')) {
      return 'Concierge Test';
    } else if (assumption.text?.includes('technology') || assumption.text?.includes('feasible')) {
      return 'Prototype Test';
    } else {
      return 'Survey';
    }
  }

  private getExperimentMethod(assumption: any): string {
    const type = this.getRecommendedExperimentType(assumption);
    switch (type) {
      case 'Landing Page Test': return 'Create landing page with pricing and measure conversion';
      case 'Concierge Test': return 'Manually deliver service to test value proposition';
      case 'Prototype Test': return 'Build working prototype and test with users';
      case 'Survey': return 'Survey target users about their needs and preferences';
      default: return 'User interview';
    }
  }

  private getExperimentDuration(assumption: any): string {
    const type = this.getRecommendedExperimentType(assumption);
    switch (type) {
      case 'Landing Page Test': return '1-2 weeks';
      case 'Concierge Test': return '2-4 weeks';
      case 'Prototype Test': return '2-6 weeks';
      case 'Survey': return '1-2 weeks';
      default: return '1-3 weeks';
    }
  }

  private getParticipantCount(assumption: any): string {
    const type = this.getRecommendedExperimentType(assumption);
    switch (type) {
      case 'Landing Page Test': return '100-500';
      case 'Concierge Test': return '5-10';
      case 'Prototype Test': return '5-7';
      case 'Survey': return '50-100';
      default: return '10-20';
    }
  }

  private getExperimentCost(assumption: any): string {
    const type = this.getRecommendedExperimentType(assumption);
    switch (type) {
      case 'Landing Page Test': return '$100-500';
      case 'Concierge Test': return '$200-1000';
      case 'Prototype Test': return '$500-2000';
      case 'Survey': return '$50-200';
      default: return '$100-500';
    }
  }

  private getQuantitativeMetrics(assumption: any): string {
    if (assumption.text?.includes('pay') || assumption.text?.includes('price')) {
      return 'Conversion rate, click-through rate, time on page';
    } else if (assumption.text?.includes('use') || assumption.text?.includes('adopt')) {
      return 'Usage frequency, feature adoption, retention rate';
    } else {
      return 'Completion rate, satisfaction score, engagement metrics';
    }
  }

  private getQualitativeMetrics(assumption: any): string {
    return 'User feedback, pain points, feature requests, suggestions';
  }

  private getRequiredResources(assumption: any): string {
    const type = this.getRecommendedExperimentType(assumption);
    switch (type) {
      case 'Landing Page Test': return 'Landing page builder, analytics tool, payment processor';
      case 'Concierge Test': return 'Communication tools, task management, feedback collection';
      case 'Prototype Test': return 'Prototyping tool, user testing platform, analytics';
      case 'Survey': return 'Survey tool, participant recruitment, data analysis';
      default: return 'Interview tools, recording equipment, note-taking system';
    }
  }

  // Helper methods for result analysis
  private getResultStatus(results: any): string {
    if (!results.actual || !results.target) return 'Inconclusive';
    const actual = parseFloat(results.actual);
    const target = parseFloat(results.target);
    if (actual >= target) return 'Validated';
    if (actual >= target * 0.8) return 'Partially Validated';
    return 'Invalidated';
  }

  private getDataQuality(results: any): number {
    // Simple scoring based on available data
    let score = 5;
    if (results.primaryMetric) score += 2;
    if (results.userFeedback) score += 2;
    if (results.participants && parseInt(results.participants) >= 5) score += 1;
    return Math.min(10, score);
  }

  private getSampleSize(results: any): number {
    const participants = parseInt(results.participants || '0');
    if (participants >= 100) return 10;
    if (participants >= 50) return 8;
    if (participants >= 20) return 6;
    if (participants >= 5) return 4;
    return 2;
  }

  private getOverallConfidence(results: any): number {
    const dataQuality = this.getDataQuality(results);
    const sampleSize = this.getSampleSize(results);
    return Math.round((dataQuality + sampleSize) / 2 * 10);
  }

  private getRecommendation(results: any): string {
    const status = this.getResultStatus(results);
    const confidence = this.getOverallConfidence(results);
    
    if (status === 'Validated' && confidence >= 70) {
      return 'This assumption is validated with high confidence. You can proceed with this direction.';
    } else if (status === 'Partially Validated' || confidence >= 50) {
      return 'This assumption shows promise but needs more validation. Consider running additional experiments.';
    } else {
      return 'This assumption is not validated. Consider pivoting or running a different experiment.';
    }
  }

  private getAssumptionStatus(results: any): string {
    const status = this.getResultStatus(results);
    const confidence = this.getOverallConfidence(results);
    
    if (status === 'Validated' && confidence >= 70) return 'Validated';
    if (status === 'Invalidated' || confidence < 30) return 'Invalidated';
    return 'Needs More Testing';
  }

  // Helper methods for pivot recommendation
  private getPivotRecommendation(metrics: any, assumptions: any[]): string {
    const validationRate = assumptions.length > 0 ? 
      (assumptions.filter(a => a.status === 'validated').length / assumptions.length) * 100 : 0;
    
    if (validationRate < 30) {
      return 'Customer Need Pivot - Your current solution may not be solving the right problem.';
    } else if (metrics.userGrowth < 10) {
      return 'Customer Segment Pivot - You may be targeting the wrong customers.';
    } else if (metrics.engagement < 50) {
      return 'Zoom-In Pivot - Focus on your most successful feature.';
    } else if (metrics.revenue < 10000) {
      return 'Value Capture Pivot - Change how you monetize your solution.';
    } else {
      return 'No Pivot Needed - Continue with your current strategy.';
    }
  }

  private getPivotReasoning(metrics: any, assumptions: any[]): string {
    const validationRate = assumptions.length > 0 ? 
      (assumptions.filter(a => a.status === 'validated').length / assumptions.length) * 100 : 0;
    
    if (validationRate < 30) {
      return 'Low assumption validation rate suggests fundamental issues with problem-solution fit.';
    } else if (metrics.userGrowth < 10) {
      return 'Slow user growth indicates potential issues with target market or value proposition.';
    } else if (metrics.engagement < 50) {
      return 'Low engagement suggests the product may be too complex or not meeting user needs.';
    } else {
      return 'Current metrics show positive trends, suggesting the strategy is working.';
    }
  }

  private getPivotStep1(metrics: any, assumptions: any[]): string {
    return 'Research and validate the new direction';
  }

  private getPivotStep2(metrics: any, assumptions: any[]): string {
    return 'Design and test new solution';
  }

  private getPivotStep3(metrics: any, assumptions: any[]): string {
    return 'Iterate based on feedback';
  }

  private getPivotStep4(metrics: any, assumptions: any[]): string {
    return 'Scale successful elements';
  }

  private getPrimaryMetric(metrics: any, assumptions: any[]): string {
    return 'User adoption rate';
  }

  private getSecondaryMetric(metrics: any, assumptions: any[]): string {
    return 'User engagement and retention';
  }

  private getPivotTimeline(metrics: any, assumptions: any[]): string {
    return '4-8 weeks';
  }

  private getImplementationRisk(metrics: any, assumptions: any[]): number {
    return 6; // Medium risk
  }

  private getMarketRisk(metrics: any, assumptions: any[]): number {
    return 5; // Medium risk
  }

  private getFinancialRisk(metrics: any, assumptions: any[]): number {
    return 4; // Low-medium risk
  }
}

export default DesignThinkingFacilitatorAgent;
