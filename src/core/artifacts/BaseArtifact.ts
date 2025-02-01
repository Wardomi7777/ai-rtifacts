import { ArtifactType, ArtifactData } from '../../types/artifacts';

export interface ArtifactBehavior {
  canBeQuoted: boolean;
  canBeTransformed: boolean;
  canBeAddedToKnowledge: boolean;
  supportsTemplates: boolean;
  supportsBatchProcessing: boolean;
}

export interface ArtifactMetadata {
  lastUpdated: string;
  author?: string;
  tags?: string[];
}

export abstract class BaseArtifact implements ArtifactBehavior {
  id: string;
  type: ArtifactType;
  title?: string;
  description?: string;
  metadata: ArtifactMetadata;

  // Default behaviors
  canBeQuoted = true;
  canBeTransformed = true;
  canBeAddedToKnowledge = true;
  supportsTemplates = true;
  supportsBatchProcessing = false;

  constructor() {
    this.id = crypto.randomUUID();
    this.metadata = {
      lastUpdated: new Date().toISOString()
    };
  }

  abstract validate(): void;
  abstract getContent(): string;
  abstract transform(targetType: ArtifactType): Promise<ArtifactData>;

  updateMetadata() {
    this.metadata.lastUpdated = new Date().toISOString();
  }

  toJSON(): ArtifactData {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      description: this.description,
      metadata: this.metadata
    } as ArtifactData;
  }
}