import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { ImageArtifact as IImageArtifact } from '../../../types/artifacts';

export class ImageArtifact extends BaseArtifact implements IImageArtifact {
  type = 'image' as const;
  prompt = '';
  imageUrl = '';
  model = 'dall-e-3' as const;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';

  validate(): void {
    if (!this.prompt || typeof this.prompt !== 'string') {
      throw new Error('Image prompt must be a non-empty string');
    }

    if (!this.imageUrl || typeof this.imageUrl !== 'string') {
      throw new Error('Image URL must be a non-empty string');
    }

    if (this.model !== 'dall-e-3') {
      throw new Error('Only DALL-E 3 model is supported');
    }

    if (this.size && !['1024x1024', '1792x1024', '1024x1792'].includes(this.size)) {
      throw new Error('Invalid image size');
    }

    if (this.quality && !['standard', 'hd'].includes(this.quality)) {
      throw new Error('Invalid image quality');
    }

    if (this.style && !['vivid', 'natural'].includes(this.style)) {
      throw new Error('Invalid image style');
    }
  }

  getContent(): string {
    return `Generated image from prompt: ${this.prompt}`;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}