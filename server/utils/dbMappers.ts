/**
 * Database Row Mappers
 * Centralized mapping functions for database rows to domain objects
 */

import { EmpathyMapData } from '../services/empathy-map-service';

/**
 * Map database row to EmpathyMapData object
 */
export function mapRowToEmpathyMap(row: any): EmpathyMapData {
  return {
    id: row.id,
    projectId: row.project_id,
    userPersona: row.user_persona,
    thinkAndFeel: row.think_and_feel || [],
    sayAndDo: row.say_and_do || [],
    see: row.see || [],
    hear: row.hear || [],
    pains: row.pains || [],
    gains: row.gains || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Generic database error handler
 */
export function handleDbError(error: unknown, operation: string, entityName: string): never {
  console.error(`Error ${operation} ${entityName}:`, error);
  throw new Error(`Failed to ${operation} ${entityName}`);
}

/**
 * Build dynamic UPDATE query from partial data
 */
export function buildUpdateQuery(
  tableName: string,
  updates: Record<string, any>,
  columnMapping: Record<string, string>
): { query: string; values: any[] } {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && columnMapping[key]) {
      fields.push(`${columnMapping[key]} = $${paramCount++}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return { query: '', values: [] };
  }

  const query = `UPDATE ${tableName} SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  return { query, values };
}
