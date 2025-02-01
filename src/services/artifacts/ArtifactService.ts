import { ArtifactData, ArtifactType } from '../../types/artifacts';
import { Message } from '../../types/chat';
import { GeneratorRegistry } from './GeneratorRegistry';
import { LLMAPIClient } from '../llm/api/client';

export class ArtifactService {
  private registry: GeneratorRegistry;

  constructor() {
    this.registry = GeneratorRegistry.getInstance();
  }

  async generateArtifact(
    question: string,
    artifactType: ArtifactType,
    context?: Message[],
    chatInstructions?: string
  ): Promise<ArtifactData> {
    try {
      // Check if required API key is available
      if (!LLMAPIClient.validateApiKeys(artifactType)) {
        switch (artifactType) {
          case 'search':
            throw new Error('Perplexity API key is required for search functionality. Please add your API key in settings.');
          case 'voice':
            throw new Error('ElevenLabs API key is required for voice functionality. Please add your API key in settings.');
          default:
            throw new Error('OpenAI API key is required. Please add your API key in settings.');
        }
      }

      const generator = this.registry.get(artifactType);
      return await generator.generate(question, context, chatInstructions);
    } catch (error) {
      console.error('Artifact generation error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to generate artifact');
    }
  }
}