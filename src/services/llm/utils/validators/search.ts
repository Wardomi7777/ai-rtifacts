import { SearchArtifact } from '../../../../types/artifacts';

export function validateSearchArtifact(data: SearchArtifact): void {
  if (typeof data.content !== 'string' || !data.content.trim()) {
    throw new Error('Search response must have non-empty content');
  }

  if (!Array.isArray(data.sources)) {
    throw new Error('Search response must have sources array');
  }

  data.sources.forEach((source, index) => {
    if (!source.title) {
      throw new Error(`Source at index ${index} must have a title`);
    }
    if (!source.url || !isValidUrl(source.url)) {
      throw new Error(`Source at index ${index} must have a valid URL`);
    }
  });
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}