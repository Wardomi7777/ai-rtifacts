import { BasePlugin } from '../BasePlugin';
import { ImageArtifact } from './ImageArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';
import { DalleClient } from '../../../services/llm/api/dalle';

export class ImagePlugin extends BasePlugin {
  metadata = {
    id: 'core.image',
    name: 'Image Plugin',
    version: '1.0.0',
    description: 'Core plugin for image generation artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'image';
  private dalleClient: DalleClient;

  constructor() {
    super();
    this.dalleClient = new DalleClient();
  }

  createArtifact(): ImageArtifact {
    return new ImageArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredString(data.prompt, 'prompt');
        this.validateRequiredString(data.imageUrl, 'imageUrl');

        if (data.model !== 'dall-e-3') {
          throw new Error('Only DALL-E 3 model is supported');
        }

        if (data.size && !['1024x1024', '1792x1024', '1024x1792'].includes(data.size)) {
          throw new Error('Invalid image size');
        }

        if (data.quality && !['standard', 'hd'].includes(data.quality)) {
          throw new Error('Invalid image quality');
        }

        if (data.style && !['vivid', 'natural'].includes(data.style)) {
          throw new Error('Invalid image style');
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Image generation prompt'
        },
        size: {
          type: 'string',
          enum: ['1024x1024', '1792x1024', '1024x1792'],
          default: '1024x1024'
        },
        quality: {
          type: 'string',
          enum: ['standard', 'hd'],
          default: 'standard'
        },
        style: {
          type: 'string',
          enum: ['vivid', 'natural'],
          default: 'vivid'
        }
      },
      required: ['prompt']
    };
  }

  getExportFormats(): string[] {
    return ['png', 'jpg', 'webp'];
  }

  async beforeCreate(data: Partial<ImageArtifact>): Promise<Partial<ImageArtifact>> {
    // Generate image if prompt is provided but URL is not
    if (data.prompt && !data.imageUrl) {
      const imageUrl = await this.dalleClient.generateImage(data.prompt, {
        size: data.size,
        quality: data.quality,
        style: data.style
      });
      data.imageUrl = imageUrl;
    }
    return data;
  }

  async afterCreate(artifact: ImageArtifact): Promise<void> {
    // Generate title from prompt if not provided
    if (!artifact.title) {
      artifact.title = artifact.prompt.length > 50
        ? artifact.prompt.slice(0, 47) + '...'
        : artifact.prompt;
    }
  }
}