/**
 * User Repository
 * Handles user data operations
 */

import { BaseRepository, BaseEntity, InsertEntity, UpdateEntity } from './base-repository';
import { User, InsertUser, UserType } from '../../shared/schema';
import { storage } from '../storage';

export interface UserEntity extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string | null;
  userType: UserType;
  userSubtype?: string;
  role?: string;
  preferences?: any;
  metrics?: any;
  verified: boolean;
  onboardingCompleted: boolean;
}

export interface InsertUserEntity extends InsertEntity {
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string | null;
  userType: UserType;
  userSubtype?: string;
  role?: string;
  preferences?: any;
  metrics?: any;
  verified?: boolean;
  onboardingCompleted?: boolean;
}

export interface UpdateUserEntity extends UpdateEntity {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string | null;
  userType?: UserType;
  userSubtype?: string;
  role?: string;
  preferences?: any;
  metrics?: any;
  verified?: boolean;
  onboardingCompleted?: boolean;
}

export class UserRepository extends BaseRepository<UserEntity, InsertUserEntity, UpdateUserEntity> {
  
  async getById(id: string): Promise<UserEntity | undefined> {
    const user = await this.storage.getUserById(id);
    return user as UserEntity | undefined;
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.storage.getAllUsers();
    return users as UserEntity[];
  }

  async create(data: InsertUserEntity): Promise<UserEntity> {
    const user = await this.storage.createUser(data as InsertUser);
    return user as UserEntity;
  }

  async update(id: string, data: UpdateUserEntity): Promise<UserEntity | undefined> {
    const user = await this.storage.updateUser(id, data);
    return user as UserEntity | undefined;
  }

  async delete(id: string): Promise<boolean> {
    return await this.storage.deleteUser(id);
  }

  async getCount(): Promise<number> {
    const users = await this.getAll();
    return users.length;
  }

  async search(query: string): Promise<UserEntity[]> {
    const users = await this.storage.searchUsers(query);
    return users as UserEntity[];
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.storage.getUserByEmail(email);
    return user as UserEntity | undefined;
  }

  /**
   * Get users by type
   */
  async getByType(userType: UserType): Promise<UserEntity[]> {
    const users = await this.storage.getUsersByType(userType);
    return users as UserEntity[];
  }

  /**
   * Upsert user (create or update)
   */
  async upsert(data: { id: string; email: string; firstName?: string; lastName?: string; profileImageUrl?: string | null }): Promise<UserEntity> {
    const user = await this.storage.upsertUser(data);
    return user as UserEntity;
  }

  /**
   * Get user settings
   */
  async getSettings(userId: string): Promise<any> {
    return await this.storage.getUserSettings(userId);
  }

  /**
   * Update user settings
   */
  async updateSettings(userId: string, settings: any): Promise<any> {
    return await this.storage.updateUserSettings(userId, settings);
  }

  /**
   * Reset user settings
   */
  async resetSettings(userId: string): Promise<any> {
    return await this.storage.resetUserSettings(userId);
  }

  /**
   * Export user settings
   */
  async exportSettings(userId: string): Promise<any> {
    return await this.storage.exportUserSettings(userId);
  }

  /**
   * Get user organizations
   */
  async getOrganizations(userId: string): Promise<any[]> {
    return await this.storage.getUserOrganizations(userId);
  }

  /**
   * Get user collaborations
   */
  async getCollaborations(userId: string): Promise<any[]> {
    return await this.storage.getUserCollaborations(userId);
  }

  /**
   * Get user invitations
   */
  async getInvitations(userId: string): Promise<any[]> {
    return await this.storage.getUserInvitations(userId);
  }

  /**
   * Get user team members
   */
  async getTeamMembers(userId: string): Promise<any[]> {
    return await this.storage.getTeamMembers(userId);
  }
}
