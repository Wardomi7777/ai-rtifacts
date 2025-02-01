import { ImageArtifact } from '../../../../types/artifacts';

export function validateImageArtifact(data: ImageArtifact): void {
  if (!data.prompt || typeof data.prompt !== 'string') {
    throw new Error('Image artifact must have a prompt');
  }

  if (!data.imageUrl || typeof data.imageUrl !== 'string') {
    throw new Error('Image artifact must have an image URL');
  }

  if (data.model !== 'dall-e-3') {
    throw new Error('Image artifact must use DALL-E 3 model');
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