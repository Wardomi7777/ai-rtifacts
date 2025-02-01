import { ArtifactData, ArtifactType } from '../../../types/artifacts';
import { Message } from '../../../types/chat';
import { LLMAPIClient } from '../../llm/api/client';

export interface ArtifactGenerator<T extends ArtifactData> {
  readonly type: ArtifactType;
  generate(prompt: string, context?: Message[], chatInstructions?: string): Promise<T>;
}

export abstract class BaseArtifactGenerator<T extends ArtifactData> implements ArtifactGenerator<T> {
  protected llmClient: LLMAPIClient;

  constructor(llmClient: LLMAPIClient = new LLMAPIClient()) {
    this.llmClient = llmClient;
  }

  abstract readonly type: ArtifactType;
  abstract generate(prompt: string, context?: Message[], chatInstructions?: string): Promise<T>;
  
  protected generateId(): string {
    return crypto.randomUUID();
  }
}