import { LayoutArtifact } from '../../../../types/artifacts';

export function validateLayoutArtifact(data: LayoutArtifact): void {
  if (!data.code?.html || typeof data.code.html !== 'string') {
    throw new Error('Layout must have valid HTML code');
  }

  if (!data.code?.css || typeof data.code.css !== 'string') {
    throw new Error('Layout must have valid CSS code');
  }

  if (data.metadata) {
    if (data.metadata.theme && !['light', 'dark'].includes(data.metadata.theme)) {
      throw new Error('Invalid theme value');
    }

    if (data.metadata.responsive !== undefined && typeof data.metadata.responsive !== 'boolean') {
      throw new Error('Responsive flag must be a boolean');
    }

    if (data.metadata.lastUpdated && isNaN(Date.parse(data.metadata.lastUpdated))) {
      throw new Error('Invalid lastUpdated date format');
    }

    if (data.metadata.tags && !Array.isArray(data.metadata.tags)) {
      throw new Error('Tags must be an array of strings');
    }
  }
}