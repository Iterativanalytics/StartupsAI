
import { AgentRequest, AgentContext } from "./agent-engine";
import { storage } from "../../storage";
import { UserType } from "../../../shared/schema";

export class ContextManager {
  async buildContext(request: AgentRequest): Promise<AgentContext> {
    // Get user data
    const user = await storage.getUserById(request.userId);
    
    // Get recent conversation history
    const conversationHistory = await this.getConversationHistory(request.userId);
    
    // Get relevant business data based on user type
    const relevantData = await this.getRelevantData(request);
    
    // Get user permissions
    const permissions = await this.getUserPermissions(request.userId, request.userType);
    
    return {
      userId: request.userId,
      userType: request.userType,
      currentTask: request.taskType,
      conversationHistory,
      relevantData,
      permissions
    };
  }
  
  private async getConversationHistory(userId: string): Promise<any[]> {
    // Get last 10 messages from conversation history
    // This would connect to your conversation storage
    return [];
  }
  
  private async getRelevantData(request: AgentRequest): Promise<any> {
    switch (request.userType) {
      case UserType.ENTREPRENEUR:
        return {
          businessPlans: await storage.getBusinessPlansByUserId(request.userId),
          // Add other entrepreneur-specific data
        };
      case UserType.INVESTOR:
        return {
          portfolios: [], // Get from storage
          investments: [], // Get from storage
          // Add other investor-specific data
        };
      case UserType.LENDER:
        return {
          loans: [], // Get from storage
          creditScores: [], // Get from storage
          // Add other lender-specific data
        };
      default:
        return {};
    }
  }
  
  private async getUserPermissions(userId: string, userType: UserType): Promise<string[]> {
    // Define permissions based on user type
    const permissionMap = {
      [UserType.ENTREPRENEUR]: ['view_own_data', 'create_business_plan', 'apply_funding'],
      [UserType.INVESTOR]: ['view_deals', 'analyze_companies', 'manage_portfolio'],
      [UserType.LENDER]: ['assess_credit', 'process_loans', 'view_risk_data'],
      [UserType.GRANTOR]: ['evaluate_impact', 'review_applications', 'track_outcomes'],
      [UserType.PARTNER]: ['match_startups', 'manage_programs', 'allocate_resources'],
      [UserType.TEAM_MEMBER]: ['collaborate', 'view_shared_data', 'contribute_content'],
      [UserType.ADMIN]: ['manage_users', 'view_analytics', 'system_control']
    };
    
    return permissionMap[userType] || [];
  }
}
