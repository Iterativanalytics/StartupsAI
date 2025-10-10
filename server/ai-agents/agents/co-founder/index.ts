
import { AgentConfig, AgentContext, AgentResponse } from "../../core/agent-engine";
import { CoFounderBrain } from "./core/co-founder-brain";
import { PersonalityManager } from "./core/personality";
import { RelationshipManager } from "./core/relationship-manager";
import { MemorySystem } from "./core/memory-system";
import { AccountabilityEngine } from "./capabilities/accountability/goal-tracker";
import { StrategicThinking } from "./capabilities/strategic-thinking/strategic-planning";
import { ProactiveCoach } from "./capabilities/accountability/performance-coach";
import { AzureEnhancedCapabilities } from "./capabilities/azure-enhanced-capabilities";

export class CoFounderAgent {
  private config: AgentConfig;
  private brain: CoFounderBrain;
  private personality: PersonalityManager;
  private relationship: RelationshipManager;
  private memory: MemorySystem;
  private accountability: AccountabilityEngine;
  private strategy: StrategicThinking;
  private coach: ProactiveCoach;
  private azureCapabilities: AzureEnhancedCapabilities;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.brain = new CoFounderBrain(config);
    this.personality = new PersonalityManager();
    this.relationship = new RelationshipManager();
    this.memory = new MemorySystem();
    this.accountability = new AccountabilityEngine();
    this.strategy = new StrategicThinking(config);
    this.coach = new ProactiveCoach();
    this.azureCapabilities = new AzureEnhancedCapabilities(config);
  }
  
  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    // Analyze conversation state and entrepreneur's needs
    const conversationState = await this.brain.analyzeConversationState(context);
    const entrepreneurNeeds = await this.brain.detectNeeds(context);
    
    // Get proactive insights if appropriate
    const proactiveInsights = await this.coach.getProactiveInsights(context);
    
    // Select appropriate response mode based on needs and state
    const responseMode = this.brain.selectResponseMode(conversationState, entrepreneurNeeds);
    
    switch (context.currentTask) {
      case 'daily_standup':
        return await this.dailyStandup(context);
      case 'strategic_session':
        return await this.strategicSession(context);
      case 'devils_advocate':
        return await this.devilsAdvocate(context);
      case 'decision_support':
        return await this.decisionSupport(context);
      case 'brainstorm':
        return await this.brainstormSession(context);
      case 'accountability_check':
        return await this.accountabilityCheck(context);
      case 'crisis_support':
        return await this.crisisSupport(context);
      default:
        return await this.adaptiveResponse(context, responseMode, proactiveInsights);
    }
  }
  
  private async dailyStandup(context: AgentContext): Promise<AgentResponse> {
    const goals = await this.accountability.getCurrentGoals(context.userId);
    const blockers = await this.accountability.identifyBlockers(context);
    const insights = await this.coach.getDailyInsights(context);
    
    return {
      content: `Good morning! Let's do our daily check-in:

📊 **Quick Status Update:**
${goals.length > 0 ? `• Goals on track: ${goals.filter(g => g.status === 'on_track').length}/${goals.length}` : '• No active goals set - want to set some?'}
${blockers.length > 0 ? `• Blockers detected: ${blockers.length} items need attention` : '• No major blockers detected'}

🎯 **Today's Focus:**
What's the ONE thing that will move the needle most today?

💭 **Yesterday's Win:**
What went well yesterday that we can build on?

⚠️ **What's in Your Way:**
Any obstacles I can help you think through?

${insights.length > 0 ? `\n🔍 **Quick Insight:**\n${insights[0].message}` : ''}`,
      
      suggestions: [
        "Set today's top priority",
        "Review weekly goals",
        "Discuss blockers",
        "Celebrate recent wins",
        "Plan the week ahead"
      ],
      
      actions: [
        {
          type: 'set_daily_priority',
          label: 'Set Today\'s Priority'
        },
        {
          type: 'update_goals',
          label: 'Update Goal Progress'
        }
      ],
      
      insights: insights.slice(0, 2)
    };
  }
  
  private async strategicSession(context: AgentContext): Promise<AgentResponse> {
    const businessData = context.relevantData;
    const strategicChallenges = await this.strategy.identifyStrategicChallenges(businessData);
    
    return {
      content: `Let's dive deep into strategy. I've been analyzing your business and I want to explore some bigger picture questions with you.

🎯 **Strategic Focus Areas I'm Thinking About:**

${strategicChallenges.map((challenge, index) => 
  `${index + 1}. **${challenge.area}**: ${challenge.question}`
).join('\n\n')}

Which of these resonates most with what's keeping you up at night? Or is there something else entirely you want to think through strategically?

I'm not here to give you quick answers - I want to think through this WITH you, challenge your assumptions, and help you see angles you might be missing.`,
      
      suggestions: strategicChallenges.map(c => c.area),
      
      actions: [
        {
          type: 'swot_analysis',
          label: 'Build SWOT Analysis'
        },
        {
          type: 'scenario_planning',
          label: 'Model Different Scenarios'
        }
      ]
    };
  }
  
  private async devilsAdvocate(context: AgentContext): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const assumptions = await this.brain.identifyAssumptions(lastMessage?.content || '');
    const counterPoints = await this.brain.generateCounterPoints(assumptions, context);
    
    return {
      content: `Okay, I need to challenge you on this. It's my job as your co-founder to poke holes in ideas BEFORE the market does.

🔍 **Assumptions I'm Seeing:**
${assumptions.map((assumption, index) => 
  `${index + 1}. ${assumption}`
).join('\n')}

⚡ **Counter-Arguments:**
${counterPoints.map((point, index) => 
  `${index + 1}. ${point.challenge}\n   *Evidence:* ${point.evidence}`
).join('\n\n')}

I'm not trying to kill your idea - I'm trying to make it bulletproof. How do you respond to these challenges? What am I missing?`,
      
      suggestions: [
        "Address the strongest counter-argument",
        "Provide evidence for key assumptions",
        "Modify the approach based on feedback",
        "Double down with stronger reasoning"
      ]
    };
  }
  
  private async decisionSupport(context: AgentContext): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    const decisionType = await this.brain.classifyDecision(lastMessage, context);
    
    // Use Azure-enhanced multi-perspective analysis for high-impact decisions
    if (decisionType.impact === 'high' || decisionType.impact === 'critical') {
      try {
        const multiPerspective = await this.azureCapabilities.analyzeDecisionMultiPerspective(
          lastMessage,
          context
        );
        
        return {
          content: `Let's work through this ${decisionType.impact} impact decision from multiple angles. This is ${decisionType.reversibility}, so ${decisionType.reversibility === 'irreversible' ? 'we need to be thorough' : 'we have some flexibility'}.

🎯 **Multi-Perspective Analysis:**

${multiPerspective.perspectives.map((p, idx) => 
  `**${idx + 1}. ${p.name.toUpperCase()} PERSPECTIVE** (Confidence: ${Math.round(p.confidence * 100)}%)
${p.analysis}

💡 Recommendation: ${p.recommendation}
`
).join('\n---\n\n')}

🎯 **SYNTHESIS & FINAL RECOMMENDATION:**

${multiPerspective.synthesis}

**My Take**: ${multiPerspective.recommendation}

What resonates most with you? Which perspective aligns with your gut?`,
          
          suggestions: [
            'Dive deeper into one perspective',
            'Challenge the assumptions',
            'Run a pre-mortem analysis',
            'Get more data before deciding'
          ],
          
          actions: [
            {
              type: 'decision_matrix',
              label: 'Build Decision Matrix'
            },
            {
              type: 'premortem',
              label: 'Run Pre-mortem Analysis'
            },
            {
              type: 'scenario_planning',
              label: 'Model Different Scenarios'
            }
          ]
        };
      } catch (error) {
        console.error('Azure decision analysis failed, using fallback:', error);
        // Fall through to basic analysis
      }
    }
    
    // Fallback or for lower-impact decisions
    const analysis = await this.brain.analyzeDecision(lastMessage, context, decisionType);
    
    return {
      content: `Let's work through this decision systematically. Based on what you've shared, this is a ${decisionType.impact} impact, ${decisionType.reversibility} decision.

🧠 **Decision Framework:**

**1. Clarify the Real Decision**
${analysis.clarification}

**2. What Are You Optimizing For?**
${analysis.optimizationFactors.join(' • ')}

**3. Key Considerations:**
${analysis.considerations.map((consideration: any, index: number) => 
  `• **${consideration.factor}**: ${consideration.analysis}`
).join('\n')}

**4. Potential Scenarios:**
• **Best Case**: ${analysis.scenarios.best}
• **Most Likely**: ${analysis.scenarios.likely}
• **Worst Case**: ${analysis.scenarios.worst}

**My Take**: ${analysis.recommendation}

What's your gut telling you? Sometimes the analytical framework confirms what you already know deep down.`,
      
      actions: [
        {
          type: 'decision_matrix',
          label: 'Build Decision Matrix'
        },
        {
          type: 'premortem',
          label: 'Run Pre-mortem Analysis'
        }
      ]
    };
  }
  
  private async brainstormSession(context: AgentContext): Promise<AgentResponse> {
    const topic = await this.brain.extractBrainstormTopic(context);
    
    // Use Azure-enhanced brainstorming for richer ideas
    try {
      const azureIdeas = await this.azureCapabilities.brainstormIdeas(
        topic,
        context,
        ['conventional', 'unconventional', 'disruptive']
      );
      
      return {
        content: `🚀 **Brainstorm Mode: ${azureIdeas.topic}**

No judgment here - let's get creative and see what emerges. I've generated ideas across different approaches:

${azureIdeas.ideas.map((idea, index) => 
  `**${index + 1}. ${idea.title}** (${idea.approach})
${idea.description}

📊 Feasibility: ${idea.feasibility}/10 | Impact: ${idea.impact}/10

✅ **Pros:**
${idea.pros.map(pro => `• ${pro}`).join('\n')}

❌ **Cons:**
${idea.cons.map(con => `• ${con}`).join('\n')}
`
).join('\n---\n\n')}

What sparks something for you? Want to dive deeper into any of these, or should we explore a completely different direction?`,
        
        suggestions: [
          "Build on the highest impact idea",
          "Combine conventional + disruptive",
          "Prototype the most feasible",
          "Challenge the assumptions"
        ],
        
        actions: [
          {
            type: 'validate_idea',
            label: 'Validate with Customers'
          },
          {
            type: 'build_prototype',
            label: 'Quick Prototype Plan'
          }
        ]
      };
    } catch (error) {
      console.error('Azure brainstorming failed, using fallback:', error);
      // Fall through to basic brainstorming
    }
    
    // Fallback to basic brainstorming
    const ideas = await this.brain.generateCreativeIdeas(topic, context);
    
    return {
      content: `🚀 **Brainstorm Mode: ${topic}**

No judgment here - let's get creative and see what emerges. Here are some directions to explore:

**Initial Ideas:**
${ideas.conventional.map((idea, index) => `${index + 1}. ${idea}`).join('\n')}

**Unconventional Angles:**
${ideas.unconventional.map((idea, index) => `${index + 1}. ${idea}`).join('\n')}

**What If We...:**
${ideas.whatIf.map((idea, index) => `${index + 1}. What if we ${idea}?`).join('\n')}

What sparks something for you? Or what completely different direction should we explore?`,
      
      suggestions: [
        "Build on the most interesting idea",
        "Combine two different approaches",
        "Explore the riskiest option",
        "Find the simplest solution"
      ]
    };
  }
  
  private async accountabilityCheck(context: AgentContext): Promise<AgentResponse> {
    const commitments = await this.accountability.getRecentCommitments(context.userId);
    const progress = await this.accountability.assessProgress(commitments, context);
    const patterns = await this.accountability.identifyPatterns(context.userId);
    
    const overdue = commitments.filter(c => c.status === 'overdue');
    const completed = commitments.filter(c => c.status === 'completed');
    
    return {
      content: `Time for an honest accountability check. Let's see how we're doing on commitments:

✅ **Completed** (${completed.length}):
${completed.map(c => `• ${c.description} - ${c.completedDate}`).join('\n') || '• None completed recently'}

⏰ **Overdue** (${overdue.length}):
${overdue.map(c => `• ${c.description} - was due ${c.dueDate}`).join('\n') || '• All caught up!'}

📊 **Pattern Analysis:**
${patterns.insights.join('\n• ')}

${overdue.length > 0 ? 
  `\n⚠️ **We Need to Talk About the Overdue Items**\n${patterns.excuseAnalysis || 'What\'s really blocking progress here?'}` : 
  '\n🎉 **Strong Accountability!** You\'re staying on top of commitments.'
}

What's the real story behind the delays? No judgment - just want to understand so we can solve for it.`,
      
      suggestions: overdue.length > 0 ? [
        "Address the biggest blocker",
        "Reschedule unrealistic commitments",
        "Break down large tasks",
        "Identify support needed"
      ] : [
        "Set next week's priorities",
        "Plan bigger goals",
        "Celebrate consistent progress"
      ]
    };
  }
  
  private async crisisSupport(context: AgentContext): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    // Use Azure-enhanced crisis planning for structured response
    try {
      const crisisPlan = await this.azureCapabilities.generateCrisisActionPlan(
        lastMessage,
        context
      );
      
      return {
        content: `🚨 **Crisis Mode Activated** (Severity: ${crisisPlan.severity.toUpperCase()})

${crisisPlan.supportMessage}

Let's break this down into a clear action plan:

**🔴 IMMEDIATE ACTIONS (Next 24 Hours):**
${crisisPlan.immediateActions
  .sort((a, b) => a.priority - b.priority)
  .map((action, index) => 
    `${index + 1}. **${action.action}** [Priority ${action.priority}]
   ⏰ Timeline: ${action.timeline}
   📋 Resources: ${action.resources.join(', ')}`
  ).join('\n\n')}

**🟡 SHORT-TERM STABILIZATION (This Week):**
${crisisPlan.shortTermActions.map((action, index) => 
  `${index + 1}. **${action.action}**
   ⏰ ${action.timeline}
   🎯 Expected Outcome: ${action.expectedOutcome}`
).join('\n\n')}

**🟢 STRATEGIC RECOVERY (Next 30 Days):**
${crisisPlan.strategicActions.map((action, index) => 
  `${index + 1}. **${action.action}**
   ⏰ ${action.timeline}
   🛡️ Prevention: ${action.prevention}`
).join('\n\n')}

---

**Remember**: Every successful entrepreneur faces crises. This is not a reflection of your abilities - it's part of the journey. You've handled challenges before, and you'll handle this one too.

What's the first immediate action you want to tackle? Let's start there and build momentum.`,
        
        suggestions: [
          'Start with Priority 1 action',
          'Draft stakeholder communications',
          'Discuss resource allocation',
          'Plan team communication'
        ],
        
        actions: [
          {
            type: 'emergency_plan',
            label: 'Download Action Plan'
          },
          {
            type: 'stakeholder_communication',
            label: 'Draft Communications'
          },
          {
            type: 'crisis_checklist',
            label: 'Create Crisis Checklist'
          }
        ]
      };
    } catch (error) {
      console.error('Azure crisis planning failed, using fallback:', error);
      // Fall through to basic crisis response
    }
    
    // Fallback to basic crisis response
    const crisisType = await this.brain.identifyCrisisType(context);
    const urgentActions = await this.brain.generateCrisisResponse(crisisType, context);
    
    return {
      content: `🚨 **Crisis Mode Activated**

I can sense this is urgent and stressful. Let's break this down into manageable pieces and create an action plan.

**Immediate Triage (Next 24 Hours):**
${urgentActions.immediate.map((action, index) => `${index + 1}. ${action}`).join('\n')}

**Short-term Stabilization (This Week):**
${urgentActions.shortTerm.map((action, index) => `${index + 1}. ${action}`).join('\n')}

**Strategic Recovery (Next 30 Days):**
${urgentActions.strategic.map((action, index) => `${index + 1}. ${action}`).join('\n')}

**Remember**: Every successful entrepreneur faces crises. This is not a reflection of your abilities - it's part of the journey. You've handled challenges before, and you'll handle this one too.

What's the first immediate action you want to tackle? Let's start there and build momentum.`,
      
      actions: [
        {
          type: 'emergency_plan',
          label: 'Create Emergency Action Plan'
        },
        {
          type: 'stakeholder_communication',
          label: 'Draft Stakeholder Communications'
        }
      ]
    };
  }
  
  private async adaptiveResponse(context: AgentContext, responseMode: string, proactiveInsights: any[]): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
    const personality = await this.personality.getPersonalityTraits(context.userId);
    const relationshipHealth = await this.relationship.getRelationshipScore(context.userId);
    
    // Generate contextual response based on conversation history and personality
    const response = await this.brain.generateAdaptiveResponse(
      lastMessage?.content || '',
      context,
      responseMode,
      personality
    );
    
    // Add proactive insights if relationship health is good and timing is appropriate
    const shouldIncludeInsights = relationshipHealth.overallScore > 70 && proactiveInsights.length > 0;
    
    return {
      content: `${response.content}${shouldIncludeInsights ? `\n\n💡 **Quick Insight:** ${proactiveInsights[0].message}` : ''}`,
      suggestions: response.suggestions,
      actions: response.actions,
      insights: shouldIncludeInsights ? proactiveInsights.slice(0, 2) : [],
      confidence: response.confidence
    };
  }
}
