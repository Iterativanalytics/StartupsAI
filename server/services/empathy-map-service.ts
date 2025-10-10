import { db } from '../db';
import { mapRowToEmpathyMap, handleDbError } from '../utils/dbMappers';

export interface EmpathyMapData {
  id: string;
  projectId: string;
  userPersona: string;
  thinkAndFeel: string[];
  sayAndDo: string[];
  see: string[];
  hear: string[];
  pains: string[];
  gains: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class EmpathyMapService {
  async getByProjectId(projectId: string): Promise<EmpathyMapData[]> {
    try {
      const result = await db.query(
        'SELECT * FROM empathy_maps WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
      );
      
      return result.rows.map(mapRowToEmpathyMap);
    } catch (error) {
      handleDbError(error, 'fetching', 'empathy maps');
    }
  }

  async getById(id: string): Promise<EmpathyMapData | null> {
    try {
      const result = await db.query(
        'SELECT * FROM empathy_maps WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return mapRowToEmpathyMap(result.rows[0]);
    } catch (error) {
      handleDbError(error, 'fetching', 'empathy map');
    }
  }

  async create(projectId: string, data: Partial<EmpathyMapData>): Promise<EmpathyMapData> {
    try {
      const result = await db.query(
        `INSERT INTO empathy_maps (
          project_id, user_persona, think_and_feel, say_and_do, 
          see, hear, pains, gains
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          projectId,
          data.userPersona || '',
          data.thinkAndFeel || [],
          data.sayAndDo || [],
          data.see || [],
          data.hear || [],
          data.pains || [],
          data.gains || []
        ]
      );
      
      return mapRowToEmpathyMap(result.rows[0]);
    } catch (error) {
      handleDbError(error, 'creating', 'empathy map');
    }
  }

  async update(id: string, updates: Partial<EmpathyMapData>): Promise<EmpathyMapData | null> {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (updates.userPersona !== undefined) {
        fields.push(`user_persona = $${paramCount++}`);
        values.push(updates.userPersona);
      }
      if (updates.thinkAndFeel !== undefined) {
        fields.push(`think_and_feel = $${paramCount++}`);
        values.push(updates.thinkAndFeel);
      }
      if (updates.sayAndDo !== undefined) {
        fields.push(`say_and_do = $${paramCount++}`);
        values.push(updates.sayAndDo);
      }
      if (updates.see !== undefined) {
        fields.push(`see = $${paramCount++}`);
        values.push(updates.see);
      }
      if (updates.hear !== undefined) {
        fields.push(`hear = $${paramCount++}`);
        values.push(updates.hear);
      }
      if (updates.pains !== undefined) {
        fields.push(`pains = $${paramCount++}`);
        values.push(updates.pains);
      }
      if (updates.gains !== undefined) {
        fields.push(`gains = $${paramCount++}`);
        values.push(updates.gains);
      }

      if (fields.length === 0) {
        return await this.getById(id);
      }

      values.push(id);
      const result = await db.query(
        `UPDATE empathy_maps SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      return mapRowToEmpathyMap(result.rows[0]);
    } catch (error) {
      handleDbError(error, 'updating', 'empathy map');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM empathy_maps WHERE id = $1',
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      handleDbError(error, 'deleting', 'empathy map');
    }
  }

  async getAnalytics(projectId: string): Promise<any> {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_maps,
          AVG(array_length(think_and_feel, 1)) as avg_think_feel,
          AVG(array_length(say_and_do, 1)) as avg_say_do,
          AVG(array_length(see, 1)) as avg_see,
          AVG(array_length(hear, 1)) as avg_hear,
          AVG(array_length(pains, 1)) as avg_pains,
          AVG(array_length(gains, 1)) as avg_gains
        FROM empathy_maps 
        WHERE project_id = $1`,
        [projectId]
      );
      
      return result.rows[0];
    } catch (error) {
      handleDbError(error, 'fetching', 'empathy map analytics');
    }
  }
}
