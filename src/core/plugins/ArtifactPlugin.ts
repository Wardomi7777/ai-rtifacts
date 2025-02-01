import { ArtifactType, ArtifactData } from '../../types/artifacts';
import { BaseArtifact } from '../artifacts/BaseArtifact';
import { ValidationRule } from '../artifacts/ArtifactValidator';

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
}

export interface ArtifactPlugin {
  metadata: PluginMetadata;
  artifactType: ArtifactType;
  
  // Core functionality
  createArtifact(): BaseArtifact;
  getValidationRules(): ValidationRule[];
  
  // Optional hooks
  beforeCreate?(data: Partial<ArtifactData>): Promise<Partial<ArtifactData>>;
  afterCreate?(artifact: BaseArtifact): Promise<void>;
  beforeTransform?(artifact: BaseArtifact, targetType: ArtifactType): Promise<void>;
  afterTransform?(result: ArtifactData): Promise<ArtifactData>;
  
  // Optional features
  getTemplateSchema?(): object;
  getBatchProcessingConfig?(): object;
  getExportFormats?(): string[];
}