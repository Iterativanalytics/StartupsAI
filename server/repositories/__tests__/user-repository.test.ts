/**
 * User Repository Tests
 * Integration tests for user repository
 */

import { userRepository } from '../index';
import { storage } from '../../storage';

describe('UserRepository', () => {
  beforeEach(() => {
    // Clear storage before each test
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should get user by ID', async () => {
      const userId = 'test-user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'ENTREPRENEUR',
        verified: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(storage, 'getUser').mockResolvedValue(mockUser as any);

      const user = await userRepository.getById(userId);

      expect(user).toBeDefined();
      expect(user?.id).toBe(userId);
      expect(user?.email).toBe('test@example.com');
    });

    it('should return undefined for non-existent user', async () => {
      jest.spyOn(storage, 'getUser').mockResolvedValue(undefined);

      const user = await userRepository.getById('non-existent');

      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        userType: 'ENTREPRENEUR' as const
      };

      const mockCreatedUser = {
        id: 'new-user-123',
        ...userData,
        verified: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(storage, 'createUser').mockResolvedValue(mockCreatedUser as any);

      const user = await userRepository.create(userData as any);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = 'test-user-123';
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const mockUpdatedUser = {
        id: userId,
        email: 'test@example.com',
        ...updateData,
        userType: 'ENTREPRENEUR',
        verified: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(storage, 'updateUser').mockResolvedValue(mockUpdatedUser as any);

      const user = await userRepository.update(userId, updateData);

      expect(user).toBeDefined();
      expect(user?.firstName).toBe('Updated');
      expect(user?.lastName).toBe('Name');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const userId = 'test-user-123';

      jest.spyOn(storage, 'deleteUser').mockResolvedValue(true);

      const result = await userRepository.delete(userId);

      expect(result).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      jest.spyOn(storage, 'deleteUser').mockResolvedValue(false);

      const result = await userRepository.delete('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true for existing user', async () => {
      const userId = 'test-user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        userType: 'ENTREPRENEUR',
        verified: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(storage, 'getUser').mockResolvedValue(mockUser as any);

      const exists = await userRepository.exists(userId);

      expect(exists).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      jest.spyOn(storage, 'getUser').mockResolvedValue(undefined);

      const exists = await userRepository.exists('non-existent');

      expect(exists).toBe(false);
    });
  });
});
