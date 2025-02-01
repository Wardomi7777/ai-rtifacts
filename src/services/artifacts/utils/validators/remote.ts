import { RemoteActionArtifact } from '../../../../types/artifacts';

export function validateRemoteArtifact(data: RemoteActionArtifact): void {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!validMethods.includes(data.method)) {
    throw new Error(`Invalid HTTP method: ${data.method}`);
  }

  if (!data.url || !isValidUrl(data.url)) {
    throw new Error('Invalid URL');
  }

  if (data.auth) {
    const validAuthTypes = ['bearer', 'basic', 'apiKey'];
    if (!validAuthTypes.includes(data.auth.type)) {
      throw new Error(`Invalid auth type: ${data.auth.type}`);
    }

    switch (data.auth.type) {
      case 'bearer':
        if (!data.auth.token) {
          throw new Error('Bearer auth requires token');
        }
        break;
      case 'basic':
        if (!data.auth.username || !data.auth.password) {
          throw new Error('Basic auth requires username and password');
        }
        break;
      case 'apiKey':
        if (!data.auth.key || !data.auth.value) {
          throw new Error('API key auth requires key and value');
        }
        if (data.auth.in && !['header', 'query'].includes(data.auth.in)) {
          throw new Error('API key location must be header or query');
        }
        break;
    }
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}