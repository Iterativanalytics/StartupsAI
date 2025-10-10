/**
 * Organization Repository
 * Handles organization data operations
 */

import { BaseRepository, BaseEntity, InsertEntity, UpdateEntity } from './base-repository';
import { Organization, InsertOrganization, UserType } from '../../shared/schema';
import { storage } from '../storage';

export interface OrganizationEntity extends BaseEntity {
  name: string;
  description?: string;
  organizationType: UserType;
  ownerId: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified: boolean;
}

export interface InsertOrganizationEntity extends InsertEntity {
  name: string;
  description?: string;
  organizationType: UserType;
  ownerId: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified?: boolean;
}

export interface UpdateOrganizationEntity extends UpdateEntity {
  name?: string;
  description?: string;
  organizationType?: UserType;
  ownerId?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified?: boolean;
}

export class OrganizationRepository extends BaseRepository<OrganizationEntity, InsertOrganizationEntity, UpdateOrganizationEntity> {
  
  async getById(id: string): Promise<OrganizationEntity | undefined> {
    const organization = await this.storage.getOrganization(id);
    return organization as OrganizationEntity | undefined;
  }

  async getAll(): Promise<OrganizationEntity[]> {
    const organizations = await this.storage.getAllOrganizations();
    return organizations as OrganizationEntity[];
  }

  async create(data: InsertOrganizationEntity): Promise<OrganizationEntity> {
    const organization = await this.storage.createOrganization(data as InsertOrganization);
    return organization as OrganizationEntity;
  }

  async update(id: string, data: UpdateOrganizationEntity): Promise<OrganizationEntity | undefined> {
    const organization = await this.storage.updateOrganization(id, data);
    return organization as OrganizationEntity | undefined;
  }

  async delete(id: string): Promise<boolean> {
    return await this.storage.deleteOrganization(id);
  }

  async getCount(): Promise<number> {
    const organizations = await this.getAll();
    return organizations.length;
  }

  async search(query: string): Promise<OrganizationEntity[]> {
    // For now, implement basic search by name
    const organizations = await this.getAll();
    return organizations.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.description?.toLowerCase().includes(query.toLowerCase()) ||
      org.industry?.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get organizations by type
   */
  async getByType(orgType: UserType): Promise<OrganizationEntity[]> {
    const organizations = await this.storage.getOrganizationsByType(orgType);
    return organizations as OrganizationEntity[];
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: string): Promise<any[]> {
    return await this.storage.getOrganizationMembers(organizationId);
  }

  /**
   * Add user to organization
   */
  async addMember(userId: string, organizationId: string, role: string): Promise<any> {
    return await this.storage.addUserToOrganization(userId, organizationId, role);
  }

  /**
   * Get organization invitations
   */
  async getInvitations(organizationId: string): Promise<any[]> {
    return await this.storage.getOrganizationInvitations(organizationId);
  }

  /**
   * Create organization invitation
   */
  async createInvitation(data: any): Promise<any> {
    return await this.storage.createOrganizationInvitation(data);
  }

  /**
   * Get organization analytics
   */
  async getAnalytics(organizationId: string): Promise<any> {
    return await this.storage.getOrganizationAnalytics(organizationId);
  }

  /**
   * Get organization programs
   */
  async getPrograms(organizationId: string): Promise<any[]> {
    return await this.storage.getPrograms(organizationId);
  }

  /**
   * Get program by ID
   */
  async getProgram(id: string): Promise<any | undefined> {
    return await this.storage.getProgram(id);
  }

  /**
   * Create program
   */
  async createProgram(data: any): Promise<any> {
    return await this.storage.createProgram(data);
  }

  /**
   * Update program
   */
  async updateProgram(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateProgram(id, updates);
  }

  /**
   * Delete program
   */
  async deleteProgram(id: string): Promise<boolean> {
    return await this.storage.deleteProgram(id);
  }

  /**
   * Get program cohorts
   */
  async getCohorts(programId: string): Promise<any[]> {
    return await this.storage.getCohorts(programId);
  }

  /**
   * Get cohort by ID
   */
  async getCohort(id: string): Promise<any | undefined> {
    return await this.storage.getCohort(id);
  }

  /**
   * Create cohort
   */
  async createCohort(data: any): Promise<any> {
    return await this.storage.createCohort(data);
  }

  /**
   * Update cohort
   */
  async updateCohort(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateCohort(id, updates);
  }

  /**
   * Delete cohort
   */
  async deleteCohort(id: string): Promise<boolean> {
    return await this.storage.deleteCohort(id);
  }

  /**
   * Get organization portfolios
   */
  async getPortfolios(organizationId: string): Promise<any[]> {
    return await this.storage.getPortfolios(organizationId);
  }

  /**
   * Get portfolio by ID
   */
  async getPortfolio(id: string): Promise<any | undefined> {
    return await this.storage.getPortfolio(id);
  }

  /**
   * Create portfolio
   */
  async createPortfolio(data: any): Promise<any> {
    return await this.storage.createPortfolio(data);
  }

  /**
   * Update portfolio
   */
  async updatePortfolio(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updatePortfolio(id, updates);
  }

  /**
   * Delete portfolio
   */
  async deletePortfolio(id: string): Promise<boolean> {
    return await this.storage.deletePortfolio(id);
  }

  /**
   * Get portfolio companies
   */
  async getPortfolioCompanies(portfolioId: string): Promise<any[]> {
    return await this.storage.getPortfolioCompanies(portfolioId);
  }

  /**
   * Get portfolio companies by cohort
   */
  async getPortfolioCompaniesByCohort(cohortId: string): Promise<any[]> {
    return await this.storage.getPortfolioCompaniesByCohort(cohortId);
  }

  /**
   * Get portfolio company by ID
   */
  async getPortfolioCompany(id: string): Promise<any | undefined> {
    return await this.storage.getPortfolioCompany(id);
  }

  /**
   * Create portfolio company
   */
  async createPortfolioCompany(data: any): Promise<any> {
    return await this.storage.createPortfolioCompany(data);
  }

  /**
   * Update portfolio company
   */
  async updatePortfolioCompany(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updatePortfolioCompany(id, updates);
  }

  /**
   * Delete portfolio company
   */
  async deletePortfolioCompany(id: string): Promise<boolean> {
    return await this.storage.deletePortfolioCompany(id);
  }

  /**
   * Get educational modules
   */
  async getEducationalModules(creatorId: string): Promise<any[]> {
    return await this.storage.getEducationalModules(creatorId);
  }

  /**
   * Get educational module by ID
   */
  async getEducationalModule(id: string): Promise<any | undefined> {
    return await this.storage.getEducationalModule(id);
  }

  /**
   * Create educational module
   */
  async createEducationalModule(data: any): Promise<any> {
    return await this.storage.createEducationalModule(data);
  }

  /**
   * Update educational module
   */
  async updateEducationalModule(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateEducationalModule(id, updates);
  }

  /**
   * Delete educational module
   */
  async deleteEducationalModule(id: string): Promise<boolean> {
    return await this.storage.deleteEducationalModule(id);
  }

  /**
   * Get mentorships by mentor
   */
  async getMentorshipsByMentor(mentorId: string): Promise<any[]> {
    return await this.storage.getMentorshipsByMentor(mentorId);
  }

  /**
   * Get mentorships by mentee
   */
  async getMentorshipsByMentee(menteeId: string): Promise<any[]> {
    return await this.storage.getMentorshipsByMentee(menteeId);
  }

  /**
   * Get mentorships by program
   */
  async getMentorshipsByProgram(programId: string): Promise<any[]> {
    return await this.storage.getMentorshipsByProgram(programId);
  }

  /**
   * Get mentorship by ID
   */
  async getMentorship(id: string): Promise<any | undefined> {
    return await this.storage.getMentorship(id);
  }

  /**
   * Create mentorship
   */
  async createMentorship(data: any): Promise<any> {
    return await this.storage.createMentorship(data);
  }

  /**
   * Update mentorship
   */
  async updateMentorship(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateMentorship(id, updates);
  }

  /**
   * Delete mentorship
   */
  async deleteMentorship(id: string): Promise<boolean> {
    return await this.storage.deleteMentorship(id);
  }

  /**
   * Get venture projects
   */
  async getVentureProjects(organizationId: string): Promise<any[]> {
    return await this.storage.getVentureProjects(organizationId);
  }

  /**
   * Get venture project by ID
   */
  async getVentureProject(id: string): Promise<any | undefined> {
    return await this.storage.getVentureProject(id);
  }

  /**
   * Create venture project
   */
  async createVentureProject(data: any): Promise<any> {
    return await this.storage.createVentureProject(data);
  }

  /**
   * Update venture project
   */
  async updateVentureProject(id: string, updates: any): Promise<any | undefined> {
    return await this.storage.updateVentureProject(id, updates);
  }

  /**
   * Delete venture project
   */
  async deleteVentureProject(id: string): Promise<boolean> {
    return await this.storage.deleteVentureProject(id);
  }
}
