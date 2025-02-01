import { ArtifactType, ArtifactData } from '../../types/artifacts';
import { ArtifactError } from './ArtifactError';
import { BaseArtifact } from './BaseArtifact';

export class ArtifactFactory {
  private static instance: ArtifactFactory;
  private constructors = new Map<ArtifactType, new () => BaseArtifact>();

  private constructor() {}

  static getInstance(): ArtifactFactory {
    if (!this.instance) {
      this.instance = new ArtifactFactory();
    }
    return this.instance;
  }

  register(type: ArtifactType, constructor: new () => BaseArtifact) {
    this.constructors.set(type, constructor);
  }

  create(type: ArtifactType): BaseArtifact {
    const Constructor = this.constructors.get(type);
    if (!Constructor) {
      throw new ArtifactError(
        `No constructor registered for artifact type: ${type}`,
        type,
        'CONSTRUCTOR_NOT_FOUND'
      );
    }
    return new Constructor();
  }

  createFromData(data: ArtifactData): BaseArtifact {
    const artifact = this.create(data.type);
    Object.assign(artifact, data);
    artifact.validate();
    return artifact;
  }
}