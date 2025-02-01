import { ArtifactData, ArtifactType } from '../../types/artifacts';
import { ArtifactError } from './ArtifactError';

export type ValidationRule = (data: any) => void | Promise<void>;

export class ArtifactValidator {
  private static instance: ArtifactValidator;
  private rules = new Map<ArtifactType, ValidationRule[]>();

  private constructor() {}

  static getInstance(): ArtifactValidator {
    if (!this.instance) {
      this.instance = new ArtifactValidator();
    }
    return this.instance;
  }

  addRule(type: ArtifactType, rule: ValidationRule) {
    if (!this.rules.has(type)) {
      this.rules.set(type, []);
    }
    this.rules.get(type)!.push(rule);
  }

  async validate(data: ArtifactData): Promise<void> {
    const rules = this.rules.get(data.type);
    if (!rules) {
      throw new ArtifactError(
        `No validation rules found for artifact type: ${data.type}`,
        data.type,
        'NO_VALIDATION_RULES'
      );
    }

    try {
      await Promise.all(rules.map(rule => rule(data)));
    } catch (error) {
      throw new ArtifactError(
        error instanceof Error ? error.message : 'Validation failed',
        data.type,
        'VALIDATION_FAILED'
      );
    }
  }
}