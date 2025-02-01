import { ArtifactType, ArtifactData } from '../../types/artifacts';
import { ArtifactPlugin, PluginMetadata } from './ArtifactPlugin';
import { BaseArtifact } from '../artifacts/BaseArtifact';
import { ValidationRule } from '../artifacts/ArtifactValidator';

export abstract class BasePlugin implements ArtifactPlugin {
  abstract metadata: PluginMetadata;
  abstract artifactType: ArtifactType;
  
  abstract createArtifact(): BaseArtifact;
  abstract getValidationRules(): ValidationRule[];
  
  // Default implementations of optional hooks
  async beforeCreate(data: Partial<ArtifactData>): Promise<Partial<ArtifactData>> {
    return data;
  }
  
  async afterCreate(artifact: BaseArtifact): Promise<void> {
    // Default implementation does nothing
  }
  
  async beforeTransform(artifact: BaseArtifact, targetType: ArtifactType): Promise<void> {
    // Default implementation does nothing
  }
  
  async afterTransform(result: ArtifactData): Promise<ArtifactData> {
    return result;
  }
  
  // Helper methods for plugins
  protected validateRequiredString(value: any, fieldName: string): void {
    if (!value || typeof value !== 'string' || !value.trim()) {
      throw new Error(`${fieldName} is required and must be a non-empty string`);
    }
  }
  
  protected validateRequiredArray(value: any, fieldName: string): void {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(`${fieldName} is required and must be a non-empty array`);
    }
  }
  
  protected validateDateString(value: string, fieldName: string): void {
    if (isNaN(Date.parse(value))) {
      throw new Error(`${fieldName} must be a valid date string`);
    }
  }
}