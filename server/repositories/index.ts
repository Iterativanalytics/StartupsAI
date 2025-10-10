/**
 * Repository Index
 * Exports all repository implementations
 */

export { BaseRepository } from './base-repository';
export type { BaseEntity, InsertEntity, UpdateEntity } from './base-repository';

export { UserRepository } from './user-repository';
export type { 
  UserEntity, 
  InsertUserEntity, 
  UpdateUserEntity 
} from './user-repository';

export { BusinessPlanRepository } from './business-plan-repository';
export type { 
  BusinessPlanEntity, 
  InsertBusinessPlanEntity, 
  UpdateBusinessPlanEntity 
} from './business-plan-repository';

export { OrganizationRepository } from './organization-repository';
export type { 
  OrganizationEntity, 
  InsertOrganizationEntity, 
  UpdateOrganizationEntity 
} from './organization-repository';

export { CreditRepository } from './credit-repository';
export type { 
  CreditScoreEntity, 
  InsertCreditScoreEntity, 
  UpdateCreditScoreEntity,
  FinancialMilestoneEntity,
  InsertFinancialMilestoneEntity,
  UpdateFinancialMilestoneEntity
} from './credit-repository';

// Import classes after exports to avoid circular dependencies
import { UserRepository } from './user-repository.js';
import { BusinessPlanRepository } from './business-plan-repository.js';
import { OrganizationRepository } from './organization-repository.js';
import { CreditRepository } from './credit-repository.js';

// Repository instances
export const userRepository = new UserRepository();
export const businessPlanRepository = new BusinessPlanRepository();
export const organizationRepository = new OrganizationRepository();
export const creditRepository = new CreditRepository();
