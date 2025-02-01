import { ChatArtifact } from '../../../../types/artifacts';

export function validateChatArtifact(data: ChatArtifact): void {
  if (!data.title) {
    throw new Error('Chat must have a title');
  }

  if (!Array.isArray(data.messages)) {
    throw new Error('Chat must have messages array');
  }

  data.messages.forEach((message, index) => {
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
}