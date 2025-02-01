import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { ChatArtifact as IChatArtifact } from '../../../types/artifacts';

export class ChatArtifact extends BaseArtifact implements IChatArtifact {
  type = 'chat' as const;
  messages = [];
  title = '';
  description?: string;
  instructions = '';
  metadata = {
    lastUpdated: new Date().toISOString(),
    participants: []
  };

  validate(): void {
    if (!this.title) {
      throw new Error('Chat must have a title');
    }

    if (!Array.isArray(this.messages)) {
      throw new Error('Chat must have messages array');
    }

    this.messages.forEach((message, index) => {
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

    if (!this.instructions || typeof this.instructions !== 'string') {
      throw new Error('Chat must have instructions');
    }
  }

  getContent(): string {
    return this.messages.map(m => 
      `${m.isUser ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n');
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}