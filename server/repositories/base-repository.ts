/**
 * Base Repository
 * Abstract base class for all repository implementations
 */

import { storage } from '../storage';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertEntity {
  [key: string]: any;
}

export interface UpdateEntity {
  [key: string]: any;
}

export abstract class BaseRepository<T extends BaseEntity, TInsert extends InsertEntity, TUpdate extends UpdateEntity> {
  protected storage = storage;

  /**
   * Get entity by ID
   */
  abstract getById(id: string): Promise<T | undefined>;

  /**
   * Get all entities
   */
  abstract getAll(): Promise<T[]>;

  /**
   * Create new entity
   */
  abstract create(data: TInsert): Promise<T>;

  /**
   * Update entity by ID
   */
  abstract update(id: string, data: TUpdate): Promise<T | undefined>;

  /**
   * Delete entity by ID
   */
  abstract delete(id: string): Promise<boolean>;

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    const entity = await this.getById(id);
    return entity !== undefined;
  }

  /**
   * Get count of entities
   */
  abstract getCount(): Promise<number>;

  /**
   * Search entities with query
   */
  abstract search(query: string): Promise<T[]>;

  /**
   * Get entities with pagination
   */
  async getPaginated(page: number = 1, limit: number = 10): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const allEntities = await this.getAll();
    const total = allEntities.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = allEntities.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Validate entity data
   */
  protected validateEntity(entity: any): boolean {
    return entity && typeof entity === 'object' && entity.id;
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Update timestamp
   */
  protected updateTimestamp(entity: any): any {
    return {
      ...entity,
      updatedAt: new Date()
    };
  }
}
