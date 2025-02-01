import { BasePlugin } from '../BasePlugin';
import { RemoteArtifact } from './RemoteArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class RemotePlugin extends BasePlugin {
  metadata = {
    id: 'core.remote',
    name: 'Remote Plugin',
    version: '1.0.0',
    description: 'Core plugin for remote API actions',
    author: 'System'
  };

  artifactType: ArtifactType = 'remote';

  createArtifact(): RemoteArtifact {
    return new RemoteArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        if (!validMethods.includes(data.method)) {
          throw new Error(`Invalid HTTP method: ${data.method}`);
        }

        if (!data.url || !this.isValidUrl(data.url)) {
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

        if (data.lastResponse) {
          if (!data.lastResponse.timestamp) {
            throw new Error('Last response must have a timestamp');
          }
          this.validateDateString(data.lastResponse.timestamp, 'lastResponse.timestamp');
        }
      }
    ];
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          default: 'GET'
        },
        url: {
          type: 'string',
          format: 'uri'
        },
        headers: {
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        queryParams: {
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        body: {
          type: 'string'
        },
        auth: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['bearer', 'basic', 'apiKey']
            },
            token: { type: 'string' },
            username: { type: 'string' },
            password: { type: 'string' },
            key: { type: 'string' },
            value: { type: 'string' },
            in: {
              type: 'string',
              enum: ['header', 'query']
            }
          },
          required: ['type']
        }
      },
      required: ['method', 'url']
    };
  }

  getExportFormats(): string[] {
    return ['json', 'curl', 'postman'];
  }

  async beforeCreate(data: Partial<RemoteArtifact>): Promise<Partial<RemoteArtifact>> {
    // Set default method if not provided
    if (!data.method) {
      data.method = 'GET';
    }
    return data;
  }

  async afterCreate(artifact: RemoteArtifact): Promise<void> {
    // Generate title from URL if not provided
    if (!artifact.title) {
      try {
        const url = new URL(artifact.url);
        artifact.title = `${artifact.method} ${url.pathname}`;
      } catch {
        artifact.title = `${artifact.method} Request`;
      }
    }
  }
}