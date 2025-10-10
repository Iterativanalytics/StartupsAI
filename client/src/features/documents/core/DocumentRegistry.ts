import { DocumentType, DocumentTypeDefinition, BaseDocument, ValidationResult } from '../types/document.types';

/**
 * Document Registry - Manages document type definitions and factories
 * 
 * This registry provides:
 * - Document type registration and management
 * - Type-specific factories and validators
 * - Schema validation
 * - Template management
 * - AI configuration per type
 */
export class DocumentRegistry {
  private types: Map<DocumentType, DocumentTypeDefinition> = new Map();
  private subtypes: Map<string, DocumentTypeDefinition> = new Map();

  /**
   * Register a document type
   */
  register(type: DocumentType, definition: DocumentTypeDefinition): void {
    this.types.set(type, definition);
  }

  /**
   * Register a document subtype
   */
  registerSubtype(parentType: DocumentType, subtypeKey: string, definition: DocumentTypeDefinition): void {
    const parentDefinition = this.types.get(parentType);
    if (!parentDefinition) {
      throw new Error(`Parent type not found: ${parentType}`);
    }

    if (!parentDefinition.subtypes) {
      parentDefinition.subtypes = {};
    }

    parentDefinition.subtypes[subtypeKey] = definition;
    this.subtypes.set(`${parentType}:${subtypeKey}`, definition);
  }

  /**
   * Get document type definition
   */
  get(type: DocumentType): DocumentTypeDefinition | undefined {
    return this.types.get(type);
  }

  /**
   * Get document subtype definition
   */
  getSubtype(parentType: DocumentType, subtypeKey: string): DocumentTypeDefinition | undefined {
    return this.subtypes.get(`${parentType}:${subtypeKey}`);
  }

  /**
   * Get all registered types
   */
  getAllTypes(): DocumentType[] {
    return Array.from(this.types.keys());
  }

  /**
   * Get all subtypes for a parent type
   */
  getSubtypes(parentType: DocumentType): string[] {
    const definition = this.types.get(parentType);
    return definition?.subtypes ? Object.keys(definition.subtypes) : [];
  }

  /**
   * Create a document of a specific type
   */
  create(type: DocumentType, data: Partial<BaseDocument>): BaseDocument {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Unknown document type: ${type}`);
    }

    return definition.factory(data);
  }

  /**
   * Create a document of a specific subtype
   */
  createSubtype(parentType: DocumentType, subtypeKey: string, data: Partial<BaseDocument>): BaseDocument {
    const definition = this.getSubtype(parentType, subtypeKey);
    if (!definition) {
      throw new Error(`Unknown document subtype: ${parentType}:${subtypeKey}`);
    }

    return definition.factory(data);
  }

  /**
   * Validate a document
   */
  validate(document: BaseDocument): ValidationResult {
    const definition = this.get(document.type);
    if (!definition) {
      return {
        valid: false,
        errors: [`Unknown document type: ${document.type}`],
        warnings: []
      };
    }

    return definition.validator(document);
  }

  /**
   * Validate a document subtype
   */
  validateSubtype(document: BaseDocument, subtypeKey: string): ValidationResult {
    const definition = this.getSubtype(document.type, subtypeKey);
    if (!definition) {
      return {
        valid: false,
        errors: [`Unknown document subtype: ${document.type}:${subtypeKey}`],
        warnings: []
      };
    }

    return definition.validator(document);
  }

  /**
   * Get schema for a document type
   */
  getSchema(type: DocumentType): any {
    const definition = this.get(type);
    return definition?.schema;
  }

  /**
   * Get schema for a document subtype
   */
  getSubtypeSchema(parentType: DocumentType, subtypeKey: string): any {
    const definition = this.getSubtype(parentType, subtypeKey);
    return definition?.schema;
  }

  /**
   * Get templates for a document type
   */
  getTemplates(type: DocumentType): any[] {
    const definition = this.get(type);
    return definition?.templates || [];
  }

  /**
   * Get templates for a document subtype
   */
  getSubtypeTemplates(parentType: DocumentType, subtypeKey: string): any[] {
    const definition = this.getSubtype(parentType, subtypeKey);
    return definition?.templates || [];
  }

  /**
   * Get AI configuration for a document type
   */
  getAIConfig(type: DocumentType): any {
    const definition = this.get(type);
    return definition?.aiConfig;
  }

  /**
   * Get AI configuration for a document subtype
   */
  getSubtypeAIConfig(parentType: DocumentType, subtypeKey: string): any {
    const definition = this.getSubtype(parentType, subtypeKey);
    return definition?.aiConfig;
  }

  /**
   * Get workflow templates for a document type
   */
  getWorkflowTemplates(type: DocumentType): any[] {
    const definition = this.get(type);
    return definition?.workflowTemplates || [];
  }

  /**
   * Get workflow templates for a document subtype
   */
  getSubtypeWorkflowTemplates(parentType: DocumentType, subtypeKey: string): any[] {
    const definition = this.getSubtype(parentType, subtypeKey);
    return definition?.workflowTemplates || [];
  }

  /**
   * Check if a document type is registered
   */
  hasType(type: DocumentType): boolean {
    return this.types.has(type);
  }

  /**
   * Check if a document subtype is registered
   */
  hasSubtype(parentType: DocumentType, subtypeKey: string): boolean {
    return this.subtypes.has(`${parentType}:${subtypeKey}`);
  }

  /**
   * Unregister a document type
   */
  unregister(type: DocumentType): void {
    this.types.delete(type);
  }

  /**
   * Unregister a document subtype
   */
  unregisterSubtype(parentType: DocumentType, subtypeKey: string): void {
    const parentDefinition = this.types.get(parentType);
    if (parentDefinition?.subtypes) {
      delete parentDefinition.subtypes[subtypeKey];
    }
    this.subtypes.delete(`${parentType}:${subtypeKey}`);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.types.clear();
    this.subtypes.clear();
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalTypes: number;
    totalSubtypes: number;
    types: Record<DocumentType, number>;
  } {
    const stats = {
      totalTypes: this.types.size,
      totalSubtypes: this.subtypes.size,
      types: {} as Record<DocumentType, number>
    };

    for (const [type, definition] of this.types) {
      stats.types[type] = definition.subtypes ? Object.keys(definition.subtypes).length : 0;
    }

    return stats;
  }
}
