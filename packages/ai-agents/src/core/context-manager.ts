import { AgentContext, AgentRequest, UserType } from '../types';

export class ContextManager {
  async buildContext(request: AgentRequest): Promise<AgentContext> {
    const context: AgentContext = {
      userId: request.userId,
      userType: request.userType,
      currentTask: request.taskType || 'general_assistance',
      conversationHistory: [],
      relevantData: request.context || {},
      permissions: this.getUserPermissions(request.userType),
      sessionId: request.sessionId
    };

    // Enrich context with user-specific data
    await this.enrichContext(context);

    return context;
  }

  private async enrichContext(context: AgentContext): Promise<void> {
    // Add user-type-specific context enrichment
    switch (context.userType) {
      case UserType.ENTREPRENEUR:
        await this.enrichEntrepreneurContext(context);
        break;
      case UserType.INVESTOR:
        await this.enrichInvestorContext(context);
        break;
      case UserType.LENDER:
        await this.enrichLenderContext(context);
        break;
      case UserType.GRANTOR:
        await this.enrichGrantorContext(context);
        break;
      case UserType.PARTNER:
        await this.enrichPartnerContext(context);
        break;
    }
  }

  private async enrichEntrepreneurContext(context: AgentContext): Promise<void> {
    // Add entrepreneur-specific context
    // This would typically fetch from database
    context.relevantData = {
      ...context.relevantData,
      businessStage: 'idea', // Would come from DB
      industry: 'technology',
      fundingNeeds: 'pre-seed',
      teamSize: 2
    };
  }

  private async enrichInvestorContext(context: AgentContext): Promise<void> {
    context.relevantData = {
      ...context.relevantData,
      investmentFocus: ['saas', 'fintech'],
      ticketSize: '100k-500k',
      portfolioSize: 12,
      availableCapital: 5000000
    };
  }

  private async enrichLenderContext(context: AgentContext): Promise<void> {
    context.relevantData = {
      ...context.relevantData,
      lendingCapacity: 10000000,
      interestRateRange: '5-12%',
      defaultRate: 0.03,
      averageLoanSize: 250000
    };
  }

  private async enrichGrantorContext(context: AgentContext): Promise<void> {
    context.relevantData = {
      ...context.relevantData,
      impactFocus: ['education', 'sustainability'],
      grantBudget: 2000000,
      programCount: 5,
      activeGrants: 45
    };
  }

  private async enrichPartnerContext(context: AgentContext): Promise<void> {
    context.relevantData = {
      ...context.relevantData,
      partnershipType: 'accelerator',
      programCapacity: 20,
      successRate: 0.65,
      networkSize: 150
    };
  }

  private getUserPermissions(userType: UserType): string[] {
    const permissionMap: Record<UserType, string[]> = {
      [UserType.ENTREPRENEUR]: [
        'view_own_profile',
        'create_business_plan',
        'apply_for_funding',
        'update_metrics',
        'chat_with_ai'
      ],
      [UserType.INVESTOR]: [
        'view_deals',
        'analyze_companies',
        'make_investments',
        'manage_portfolio',
        'chat_with_ai',
        'export_reports'
      ],
      [UserType.LENDER]: [
        'view_applications',
        'assess_credit',
        'approve_loans',
        'manage_portfolio',
        'chat_with_ai',
        'export_reports'
      ],
      [UserType.GRANTOR]: [
        'view_applications',
        'evaluate_impact',
        'award_grants',
        'track_outcomes',
        'chat_with_ai',
        'export_reports'
      ],
      [UserType.PARTNER]: [
        'view_startups',
        'match_opportunities',
        'manage_programs',
        'allocate_resources',
        'chat_with_ai',
        'export_reports'
      ],
      [UserType.ADMIN]: [
        'full_access'
      ]
    };

    return permissionMap[userType] || [];
  }

  getContextSummary(context: AgentContext): string {
    return `User: ${context.userType}, Task: ${context.currentTask}, Session: ${context.sessionId}`;
  }
}