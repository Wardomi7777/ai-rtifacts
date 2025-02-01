import { BasePlugin } from '../BasePlugin';
import { ChatArtifact } from './ChatArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class ChatPlugin extends BasePlugin {
  metadata = {
    id: 'core.chat',
    name: 'Chat Plugin',
    version: '1.0.0',
    description: 'Core plugin for chat artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'chat';

  createArtifact(): ChatArtifact {
    return new ChatArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredString(data.title, 'title');
        this.validateRequiredString(data.instructions, 'instructions');

        if (!Array.isArray(data.messages)) {
          throw new Error('Chat must have messages array');
        }

        data.messages.forEach((message: any, index: number) => {
          if (!message.id) {
            throw new Error(`Message at index ${index} must have an id`);
          }
          if (typeof message.content !== 'string') {
            throw new Error(`Message at index ${index} must have content`);
          }
          if (typeof message.isUser !== 'boolean') {
            throw new Error(`Message at index ${index} must have isUser flag`);
          }
          if (typeof message.timestamp !== 'number') {
            throw new Error(`Message at index ${index} must have timestamp`);
          }
        });

        if (data.metadata) {
          if (data.metadata.lastUpdated) {
            this.validateDateString(data.metadata.lastUpdated, 'lastUpdated');
          }
          if (data.metadata.participants && !Array.isArray(data.metadata.participants)) {
            throw new Error('Participants must be an array');
          }
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Chat title'
        },
        description: {
          type: 'string',
          description: 'Chat description'
        },
        instructions: {
          type: 'string',
          description: 'Instructions for the AI assistant'
        },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              isUser: { type: 'boolean' },
              timestamp: { type: 'number' }
            },
            required: ['id', 'content', 'isUser', 'timestamp']
          }
        },
        metadata: {
          type: 'object',
          properties: {
            participants: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      },
      required: ['title', 'instructions']
    };
  }

  getExportFormats(): string[] {
    return ['json', 'markdown', 'html', 'pdf'];
  }

  async beforeCreate(data: Partial<ChatArtifact>): Promise<Partial<ChatArtifact>> {
    // Initialize empty messages array if not provided
    if (!data.messages) {
      data.messages = [];
    }

    // Set default metadata
    if (!data.metadata) {
      data.metadata = {
        lastUpdated: new Date().toISOString(),
        participants: []
      };
    }

    return data;
  }

  async afterCreate(artifact: ChatArtifact): Promise<void> {
    // Update metadata
    artifact.metadata.lastUpdated = new Date().toISOString();

    // Extract unique participants from messages
    const participants = new Set<string>();
    artifact.messages.forEach(message => {
      participants.add(message.isUser ? 'User' : 'Assistant');
    });
    artifact.metadata.participants = Array.from(participants);
  }
}