export class ArtifactError extends Error {
  constructor(
    message: string,
    public artifactType?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ArtifactError';
  }
}