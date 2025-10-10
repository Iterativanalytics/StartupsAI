import { DatabaseService } from './database-service';

/**
 * Canvas Service for Design Thinking Collaborative Canvases
 * 
 * Handles real-time canvas operations including:
 * - Element management
 * - Clustering operations
 * - Conflict resolution
 * - Version control
 */
export class CanvasService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Get canvas elements
   */
  async getElements(canvasId: string): Promise<CanvasElement[]> {
    try {
      const canvas = await this.db.getCanvas(canvasId);
      return canvas?.elements || [];
    } catch (error) {
      console.error('Error getting canvas elements:', error);
      throw new Error('Failed to get canvas elements');
    }
  }

  /**
   * Apply updates to canvas
   */
  async applyUpdates(canvasId: string, updates: CanvasUpdate[]): Promise<void> {
    try {
      for (const update of updates) {
        await this.applyUpdate(canvasId, update);
      }
    } catch (error) {
      console.error('Error applying canvas updates:', error);
      throw new Error('Failed to apply canvas updates');
    }
  }

  /**
   * Apply a single update to canvas
   */
  private async applyUpdate(canvasId: string, update: CanvasUpdate): Promise<void> {
    switch (update.type) {
      case 'element_added':
        await this.addElement(canvasId, update.element);
        break;
      case 'element_updated':
        await this.updateElement(canvasId, update.element);
        break;
      case 'element_removed':
        await this.removeElement(canvasId, update.element.id);
        break;
      case 'element_moved':
        await this.moveElement(canvasId, update.element);
        break;
    }
  }

  /**
   * Add element to canvas
   */
  private async addElement(canvasId: string, element: CanvasElement): Promise<void> {
    await this.db.addCanvasElement(canvasId, element);
  }

  /**
   * Update element in canvas
   */
  private async updateElement(canvasId: string, element: CanvasElement): Promise<void> {
    await this.db.updateCanvasElement(canvasId, element.id, element);
  }

  /**
   * Remove element from canvas
   */
  private async removeElement(canvasId: string, elementId: string): Promise<void> {
    await this.db.removeCanvasElement(canvasId, elementId);
  }

  /**
   * Move element in canvas
   */
  private async moveElement(canvasId: string, element: CanvasElement): Promise<void> {
    await this.db.updateCanvasElement(canvasId, element.id, { position: element.position });
  }

  /**
   * Apply clustering to canvas
   */
  async applyClustering(canvasId: string, clusters: Cluster[]): Promise<void> {
    try {
      await this.db.applyCanvasClustering(canvasId, clusters);
    } catch (error) {
      console.error('Error applying canvas clustering:', error);
      throw new Error('Failed to apply canvas clustering');
    }
  }

  /**
   * Get canvas by ID
   */
  async getCanvas(canvasId: string): Promise<Canvas | null> {
    try {
      return await this.db.getCanvas(canvasId);
    } catch (error) {
      console.error('Error getting canvas:', error);
      throw new Error('Failed to get canvas');
    }
  }

  /**
   * Create new canvas
   */
  async createCanvas(workflowId: string, canvasType: string): Promise<Canvas> {
    try {
      const canvas: Canvas = {
        id: this.generateId(),
        workflowId,
        canvasType,
        elements: [],
        version: 1,
        lastModifiedBy: null,
        lastModifiedAt: new Date(),
        createdAt: new Date()
      };

      await this.db.createCanvas(canvas);
      return canvas;
    } catch (error) {
      console.error('Error creating canvas:', error);
      throw new Error('Failed to create canvas');
    }
  }

  /**
   * Update canvas
   */
  async updateCanvas(canvasId: string, updates: Partial<Canvas>): Promise<Canvas> {
    try {
      return await this.db.updateCanvas(canvasId, updates);
    } catch (error) {
      console.error('Error updating canvas:', error);
      throw new Error('Failed to update canvas');
    }
  }

  /**
   * Delete canvas
   */
  async deleteCanvas(canvasId: string): Promise<void> {
    try {
      await this.db.deleteCanvas(canvasId);
    } catch (error) {
      console.error('Error deleting canvas:', error);
      throw new Error('Failed to delete canvas');
    }
  }

  /**
   * Get canvas history
   */
  async getCanvasHistory(canvasId: string): Promise<CanvasVersion[]> {
    try {
      return await this.db.getCanvasHistory(canvasId);
    } catch (error) {
      console.error('Error getting canvas history:', error);
      throw new Error('Failed to get canvas history');
    }
  }

  /**
   * Restore canvas to version
   */
  async restoreCanvasVersion(canvasId: string, version: number): Promise<void> {
    try {
      await this.db.restoreCanvasVersion(canvasId, version);
    } catch (error) {
      console.error('Error restoring canvas version:', error);
      throw new Error('Failed to restore canvas version');
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Type definitions
interface Canvas {
  id: string;
  workflowId: string;
  canvasType: string;
  elements: CanvasElement[];
  version: number;
  lastModifiedBy: string | null;
  lastModifiedAt: Date;
  createdAt: Date;
}

interface CanvasElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  metadata: any;
}

interface CanvasUpdate {
  type: 'element_added' | 'element_updated' | 'element_removed' | 'element_moved';
  element: CanvasElement;
  timestamp: Date;
  conflicts?: Conflict[];
}

interface Cluster {
  id: string;
  name: string;
  elements: string[];
  theme: string;
  confidence: number;
}

interface CanvasVersion {
  version: number;
  elements: CanvasElement[];
  timestamp: Date;
  modifiedBy: string;
}

interface Conflict {
  id: string;
  type: string;
  description: string;
  participants: string[];
  severity: 'low' | 'medium' | 'high';
}
