import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { RemoteActionArtifact } from '../../../types/artifacts';

export class RemoteArtifact extends BaseArtifact implements RemoteActionArtifact {
  type = 'remote' as const;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET';
  url = '';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: string;
  auth?: {
    type: 'bearer' | 'basic' | 'apiKey';
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
    in?: 'header' | 'query';
  };
  lastResponse?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    timestamp: string;
  };

  validate(): void {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(this.method)) {
      throw new Error(`Invalid HTTP method: ${this.method}`);
    }

    if (!this.url || !this.isValidUrl(this.url)) {
      throw new Error('Invalid URL');
    }

    if (this.auth) {
      const validAuthTypes = ['bearer', 'basic', 'apiKey'];
      if (!validAuthTypes.includes(this.auth.type)) {
        throw new Error(`Invalid auth type: ${this.auth.type}`);
      }

      switch (this.auth.type) {
        case 'bearer':
          if (!this.auth.token) {
            throw new Error('Bearer auth requires token');
          }
          break;
        case 'basic':
          if (!this.auth.username || !this.auth.password) {
            throw new Error('Basic auth requires username and password');
          }
          break;
        case 'apiKey':
          if (!this.auth.key || !this.auth.value) {
            throw new Error('API key auth requires key and value');
          }
          if (this.auth.in && !['header', 'query'].includes(this.auth.in)) {
            throw new Error('API key location must be header or query');
          }
          break;
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getContent(): string {
    return `${this.method} ${this.url}${
      this.queryParams 
        ? '\nQuery Params: ' + JSON.stringify(this.queryParams, null, 2)
        : ''
    }${
      this.body
        ? '\nBody: ' + this.body
        : ''
    }`;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}