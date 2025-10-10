import { User, InsertUser, BusinessPlan, InsertBusinessPlan, Organization, InsertOrganization, UserType, CoFounderGoal, InsertCoFounderGoal, CoFounderCommitment, InsertCoFounderCommitment } from "../shared/schema";
import { seedData } from "./seed-data";
import { randomUUID } from "crypto";

// In-memory storage
class InMemoryStorage {
  private users: Map<string, User> = new Map();
  private businessPlans: Map<string, BusinessPlan> = new Map();
  private organizations: Map<string, Organization> = new Map();
  private coFounderGoals: Map<string, CoFounderGoal> = new Map();
  private coFounderCommitments: Map<string, CoFounderCommitment> = new Map();
  private userIdCounter = 1;
  private planIdCounter = 1;
  private orgIdCounter = 1;
  private goalIdCounter = 1;
  private commitmentIdCounter = 1;

  constructor() {
    this.initializeWithSeedData();
  }

  private initializeWithSeedData() {
    const { superUsers, sampleUsers, sampleOrganizations, sampleBusinessPlans } = seedData();

    // Add super users
    superUsers.forEach(userData => {
      const user: User = {
        id: this.userIdCounter++,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: userData.userType,
        userSubtype: userData.userSubtype,
        role: userData.role,
        preferences: userData.preferences,
        metrics: userData.metrics,
        verified: userData.verified ?? false,
        onboardingCompleted: userData.onboardingCompleted ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(`super-user-${userData.userType}`, user);
    });

    // Add sample users
    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.userIdCounter++,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: userData.userType,
        userSubtype: userData.userSubtype,
        role: userData.role,
        preferences: userData.preferences,
        metrics: userData.metrics,
        verified: userData.verified ?? false,
        onboardingCompleted: userData.onboardingCompleted ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(`user-${user.id}`, user);
    });

    // Add sample organizations
    sampleOrganizations.forEach(orgData => {
      const org: Organization = {
        id: this.orgIdCounter++,
        name: orgData.name,
        description: orgData.description,
        organizationType: orgData.organizationType,
        ownerId: orgData.ownerId,
        industry: orgData.industry,
        size: orgData.size,
        location: orgData.location,
        website: orgData.website,
        logoUrl: orgData.logoUrl,
        verified: orgData.verified ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.organizations.set(`org-${org.id}`, org);
    });

    // Add sample business plans
    sampleBusinessPlans.forEach(planData => {
      const plan: BusinessPlan = {
        id: this.planIdCounter++,
        name: planData.name,
        userId: planData.userId,
        content: planData.content,
        description: planData.description,
        industry: planData.industry,
        stage: planData.stage,
        fundingGoal: planData.fundingGoal,
        teamSize: planData.teamSize,
        targetMarket: planData.targetMarket,
        competitiveAdvantage: planData.competitiveAdvantage,
        revenueModel: planData.revenueModel,
        visibility: planData.visibility ?? 'private',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.businessPlans.set(`plan-${plan.id}`, plan);
    });

    console.log(`Initialized storage with:
    - ${this.users.size} users (including super users)
    - ${this.organizations.size} organizations
    - ${this.businessPlans.size} business plans`);
  }

  // User operations
  createUser(userData: InsertUser): User {
    const user: User = {
      id: this.userIdCounter++,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      userType: userData.userType,
      userSubtype: userData.userSubtype,
      role: userData.role,
      preferences: userData.preferences,
      metrics: userData.metrics,
      verified: userData.verified ?? false,
      onboardingCompleted: userData.onboardingCompleted ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(`user-${user.id}`, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  getUsersByType(userType: UserType): User[] {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }

  // Upsert user (create or update)
  async upsertUser(userData: { id: string; email: string; firstName?: string; lastName?: string; profileImageUrl?: string | null }): Promise<User> {
    // First check if user exists by ID
    let existingUser = this.users.get(userData.id);
    
    if (!existingUser) {
      // Check if user exists by email
      existingUser = this.getUserByEmail(userData.email);
    }

    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        email: userData.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: new Date()
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: typeof userData.id === 'string' ? parseInt(userData.id.replace(/\D/g, '')) || this.userIdCounter++ : this.userIdCounter++,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: UserType.ENTREPRENEUR, // Default user type
        verified: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Business Plan operations
  createBusinessPlan(planData: InsertBusinessPlan): BusinessPlan {
    const plan: BusinessPlan = {
      id: this.planIdCounter++,
      ...planData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.businessPlans.set(`plan-${plan.id}`, plan);
    return plan;
  }

  getBusinessPlanById(id: string): BusinessPlan | undefined {
    return this.businessPlans.get(id);
  }

  getBusinessPlansByUserId(userId: string): BusinessPlan[] {
    return Array.from(this.businessPlans.values()).filter(plan => plan.userId === userId);
  }

  getAllBusinessPlans(): BusinessPlan[] {
    return Array.from(this.businessPlans.values());
  }

  updateBusinessPlan(id: string, updates: Partial<BusinessPlan>): BusinessPlan | undefined {
    const plan = this.businessPlans.get(id);
    if (plan) {
      const updatedPlan = { ...plan, ...updates, updatedAt: new Date() };
      this.businessPlans.set(id, updatedPlan);
      return updatedPlan;
    }
    return undefined;
  }

  deleteBusinessPlan(id: string): boolean {
    return this.businessPlans.delete(id);
  }

  // Organization operations
  createOrganization(orgData: InsertOrganization): Organization {
    const org: Organization = {
      id: this.orgIdCounter++,
      ...orgData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.organizations.set(`org-${org.id}`, org);
    return org;
  }

  getOrganizationById(id: string): Organization | undefined {
    return this.organizations.get(id);
  }

  getOrganizationsByType(orgType: UserType): Organization[] {
    return Array.from(this.organizations.values()).filter(org => org.organizationType === orgType);
  }

  getAllOrganizations(): Organization[] {
    return Array.from(this.organizations.values());
  }

  updateOrganization(id: string, updates: Partial<Organization>): Organization | undefined {
    const org = this.organizations.get(id);
    if (org) {
      const updatedOrg = { ...org, ...updates, updatedAt: new Date() };
      this.organizations.set(id, updatedOrg);
      return updatedOrg;
    }
    return undefined;
  }

  deleteOrganization(id: string): boolean {
    return this.organizations.delete(id);
  }

  // Statistics and analytics
  getStats() {
    const usersByType = Object.values(UserType).reduce((acc, type) => {
      acc[type] = this.getUsersByType(type).length;
      return acc;
    }, {} as Record<UserType, number>);

    return {
      totalUsers: this.users.size,
      totalBusinessPlans: this.businessPlans.size,
      totalOrganizations: this.organizations.size,
      usersByType,
      verifiedUsers: Array.from(this.users.values()).filter(u => u.verified).length,
      completedOnboarding: Array.from(this.users.values()).filter(u => u.onboardingCompleted).length
    };
  }

  // Search functionality
  searchUsers(query: string): User[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.users.values()).filter(user => 
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  searchBusinessPlans(query: string): BusinessPlan[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.businessPlans.values()).filter(plan => 
      plan.name.toLowerCase().includes(searchTerm) ||
      plan.description?.toLowerCase().includes(searchTerm) ||
      plan.industry?.toLowerCase().includes(searchTerm)
    );
  }

  // Co-Founder Goal operations
  createGoal(goalData: InsertCoFounderGoal): CoFounderGoal {
    const goal: CoFounderGoal = {
      id: randomUUID(),
      ...goalData,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    this.coFounderGoals.set(goal.id, goal);
    return goal;
  }

  getGoalById(id: string): CoFounderGoal | undefined {
    return this.coFounderGoals.get(id);
  }

  getGoalsByUserId(userId: string): CoFounderGoal[] {
    return Array.from(this.coFounderGoals.values()).filter(goal => goal.userId === userId);
  }

  updateGoal(id: string, updates: Partial<CoFounderGoal>): CoFounderGoal | undefined {
    const goal = this.coFounderGoals.get(id);
    if (goal) {
      const updatedGoal = { ...goal, ...updates };
      this.coFounderGoals.set(id, updatedGoal);
      return updatedGoal;
    }
    return undefined;
  }

  deleteGoal(id: string): boolean {
    return this.coFounderGoals.delete(id);
  }

  // Co-Founder Commitment operations
  createCommitment(commitmentData: InsertCoFounderCommitment): CoFounderCommitment {
    const commitment: CoFounderCommitment = {
      id: randomUUID(),
      ...commitmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.coFounderCommitments.set(commitment.id, commitment);
    return commitment;
  }

  getCommitmentById(id: string): CoFounderCommitment | undefined {
    return this.coFounderCommitments.get(id);
  }

  getCommitmentsByUserId(userId: string): CoFounderCommitment[] {
    return Array.from(this.coFounderCommitments.values()).filter(commitment => commitment.userId === userId);
  }

  updateCommitment(id: string, updates: Partial<CoFounderCommitment>): CoFounderCommitment | undefined {
    const commitment = this.coFounderCommitments.get(id);
    if (commitment) {
      const updatedCommitment = { ...commitment, ...updates };
      this.coFounderCommitments.set(id, updatedCommitment);
      return updatedCommitment;
    }
    return undefined;
  }

  deleteCommitment(id: string): boolean {
    return this.coFounderCommitments.delete(id);
  }

  // Wrapper methods for routes.ts compatibility
  getBusinessPlans(userId: string): BusinessPlan[] {
    return this.getBusinessPlansByUserId(userId);
  }

  getBusinessPlan(id: string): BusinessPlan | undefined {
    return this.getBusinessPlanById(id);
  }

  // Stub methods for features not yet implemented
  // These return empty arrays/undefined to prevent crashes
  getPlanSections(planId: string): any[] {
    return [];
  }

  getPlanSection(id: string): any | undefined {
    return undefined;
  }

  createPlanSection(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updatePlanSection(id: string, updates: any): any | undefined {
    return undefined;
  }

  getFinancialData(planId: string): any | undefined {
    return undefined;
  }

  createFinancialData(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateFinancialData(id: string, updates: any): any | undefined {
    return undefined;
  }

  getAnalysisScore(planId: string): any | undefined {
    return undefined;
  }

  createAnalysisScore(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateAnalysisScore(id: string, updates: any): any | undefined {
    return undefined;
  }

  getPitchDeck(planId: string): any | undefined {
    return undefined;
  }

  createPitchDeck(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getInvestments(planId: string): any[] {
    return [];
  }

  getInvestmentsByInvestor(investorId: string): any[] {
    return [];
  }

  createInvestment(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateInvestment(id: string, updates: any): any | undefined {
    return undefined;
  }

  getLoans(planId: string): any[] {
    return [];
  }

  getLoansByLender(lenderId: string): any[] {
    return [];
  }

  createLoan(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateLoan(id: string, updates: any): any | undefined {
    return undefined;
  }

  getAdvisoryServices(planId: string): any[] {
    return [];
  }

  getAdvisoryServicesByPartner(partnerId: string): any[] {
    return [];
  }

  createAdvisoryService(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateAdvisoryService(id: string, updates: any): any | undefined {
    return undefined;
  }

  getPrograms(organizationId: string): any[] {
    return [];
  }

  getProgram(id: string): any | undefined {
    return undefined;
  }

  createProgram(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateProgram(id: string, updates: any): any | undefined {
    return undefined;
  }

  deleteProgram(id: string): boolean {
    return true;
  }

  getCohorts(programId: string): any[] {
    return [];
  }

  getCohort(id: string): any | undefined {
    return undefined;
  }

  createCohort(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateCohort(id: string, updates: any): any | undefined {
    return undefined;
  }

  deleteCohort(id: string): boolean {
    return true;
  }

  getPortfolios(organizationId: string): any[] {
    return [];
  }

  getPortfolio(id: string): any | undefined {
    return undefined;
  }

  createPortfolio(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updatePortfolio(id: string, updates: any): any | undefined {
    return undefined;
  }

  deletePortfolio(id: string): boolean {
    return true;
  }

  getPortfolioCompanies(portfolioId: string): any[] {
    return [];
  }

  getPortfolioCompaniesByCohort(cohortId: string): any[] {
    return [];
  }

  getPortfolioCompany(id: string): any | undefined {
    return undefined;
  }

  createPortfolioCompany(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updatePortfolioCompany(id: string, updates: any): any | undefined {
    return undefined;
  }

  deletePortfolioCompany(id: string): boolean {
    return true;
  }

  getEducationalModules(creatorId: string): any[] {
    return [];
  }

  getEducationalModule(id: string): any | undefined {
    return undefined;
  }

  createEducationalModule(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateEducationalModule(id: string, updates: any): any | undefined {
    return undefined;
  }

  deleteEducationalModule(id: string): boolean {
    return true;
  }

  getMentorshipsByMentor(mentorId: string): any[] {
    return [];
  }

  getMentorshipsByMentee(menteeId: string): any[] {
    return [];
  }

  getMentorshipsByProgram(programId: string): any[] {
    return [];
  }

  getMentorship(id: string): any | undefined {
    return undefined;
  }

  createMentorship(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateMentorship(id: string, updates: any): any | undefined {
    return undefined;
  }

  deleteMentorship(id: string): boolean {
    return true;
  }

  getVentureProjects(organizationId: string): any[] {
    return [];
  }

  getVentureProject(id: string): any | undefined {
    return undefined;
  }

  createVentureProject(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateVentureProject(id: string, updates: any): any | undefined {
    return undefined;
  }

  deleteVentureProject(id: string): boolean {
    return true;
  }

  // Credit scoring stub methods
  getCreditScores(userId: string): any[] {
    return [];
  }

  getCreditScore(id: string): any | undefined {
    return undefined;
  }

  createCreditScore(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateCreditScore(id: string, updates: any): any | undefined {
    return undefined;
  }

  getFinancialMilestones(userId: string): any[] {
    return [];
  }

  getFinancialMilestone(id: string): any | undefined {
    return undefined;
  }

  createFinancialMilestone(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateFinancialMilestone(id: string, updates: any): any | undefined {
    return undefined;
  }

  getAiCoachingMessages(userId: string): any[] {
    return [];
  }

  createAiCoachingMessage(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getCreditTips(): any[] {
    return [];
  }

  getCreditTipsByCategory(category: string): any[] {
    return [];
  }

  getCreditTip(id: string): any | undefined {
    return undefined;
  }

  createCreditTip(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getUserCreditTips(userId: string): any[] {
    return [];
  }

  createUserCreditTip(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateUserCreditTip(id: string, updates: any): any | undefined {
    return undefined;
  }

  getFinancialProjections(businessPlanId: string): any[] {
    return [];
  }

  getFinancialProjection(id: string): any | undefined {
    return undefined;
  }

  createFinancialProjection(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateFinancialProjection(id: string, updates: any): any | undefined {
    return undefined;
  }

  getAiBusinessAnalysis(businessPlanId: string): any | undefined {
    return undefined;
  }

  createAiBusinessAnalysis(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateAiBusinessAnalysis(id: string, updates: any): any | undefined {
    return undefined;
  }

  getCreditScoreTiers(): any[] {
    return [];
  }

  getCreditScoreTier(id: string): any | undefined {
    return undefined;
  }

  getCreditScoreTierByScore(score: number): any | undefined {
    return undefined;
  }

  createCreditScoreTier(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateCreditScoreTier(id: string, updates: any): any | undefined {
    return undefined;
  }

  getCreditAchievements(): any[] {
    return [];
  }

  getCreditAchievementsByCategory(category: string): any[] {
    return [];
  }

  getCreditAchievement(id: string): any | undefined {
    return undefined;
  }

  createCreditAchievement(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getUserCreditAchievements(userId: string): any[] {
    return [];
  }

  getUnseenAchievements(userId: string): any[] {
    return [];
  }

  createUserCreditAchievement(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateUserCreditAchievement(id: string, updates: any): any | undefined {
    return undefined;
  }

  markAchievementAsSeen(id: string): any | undefined {
    return undefined;
  }

  getCreditScoreHistory(userId: string): any[] {
    return [];
  }

  createCreditScoreHistory(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getUserRewardPoints(userId: string): any | undefined {
    return undefined;
  }

  createUserRewardPoints(data: any): any {
    return { id: randomUUID(), ...data };
  }

  updateUserRewardPoints(id: string, updates: any): any | undefined {
    return undefined;
  }

  addUserPoints(userId: string, points: number): any | undefined {
    return undefined;
  }

  getPointTransactions(userId: string): any[] {
    return [];
  }

  createPointTransaction(data: any): any {
    return { id: randomUUID(), ...data };
  }

  // Organization and team stub methods
  addUserToOrganization(userId: string, organizationId: string, role: string): any {
    return { id: randomUUID(), userId, organizationId, role };
  }

  getUserOrganizations(userId: string): any[] {
    return [];
  }

  getOrganization(id: string): Organization | undefined {
    return this.getOrganizationById(id);
  }

  getOrganizationMembers(organizationId: string): any[] {
    return [];
  }

  createOrganizationInvitation(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getOrganizationAnalytics(organizationId: string): any {
    return { totalMembers: 0, totalProjects: 0 };
  }

  getUserSettings(userId: string): any | undefined {
    return undefined;
  }

  updateUserSettings(userId: string, settings: any): any {
    return { userId, ...settings };
  }

  resetUserSettings(userId: string): any {
    return { userId, settings: {} };
  }

  exportUserSettings(userId: string): any {
    return { userId, settings: {} };
  }

  createCollaboration(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getUserCollaborations(userId: string): any[] {
    return [];
  }

  createInvitation(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getUserInvitations(userId: string): any[] {
    return [];
  }

  getInvitation(id: string): any | undefined {
    return undefined;
  }

  updateInvitation(id: string, updates: any): any | undefined {
    return undefined;
  }

  getTeamMembers(userId: string): any[] {
    return [];
  }

  createTeamInvitation(data: any): any {
    return { id: randomUUID(), ...data };
  }

  getTeamInvitations(userId: string): any[] {
    return [];
  }

  updateTeamMember(id: string, updates: any): any | undefined {
    return undefined;
  }

  removeTeamMember(id: string): boolean {
    return true;
  }

  resendTeamInvitation(id: string): boolean {
    return true;
  }

  cancelTeamInvitation(id: string): boolean {
    return true;
  }
}

// Export singleton instance
export const storage = new InMemoryStorage();