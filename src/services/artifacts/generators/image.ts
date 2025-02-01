import { ImageArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { DalleClient } from '../../llm/api/dalle';

export class ImageGenerator extends BaseArtifactGenerator<ImageArtifact> {
  readonly type = 'image' as const;
  private dalleClient: DalleClient;

  constructor() {
    super();
    this.dalleClient = new DalleClient();
  }

  async generate(prompt: string): Promise<ImageArtifact> {
    // Generate metadata first
    const metadataResponse = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: 'Generate a title and description for an image. Response format:\n{"title": "string", "description": "string"}'
        },
        {
          role: 'user',
          content: `Image prompt: ${prompt}`
        }
      ]
    });
    
    const metadata = JSON.parse(metadataResponse);
    
    const imageUrl = await this.dalleClient.generateImage(prompt, {
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    });

    return {
      id: this.generateId(),
      type: this.type,
      title: metadata.title,
      description: metadata.description,
      prompt,
      imageUrl,
      model: 'dall-e-3'
    };
  }
}