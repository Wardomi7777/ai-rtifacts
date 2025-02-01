import { ChatArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';

export class ChatGenerator extends BaseArtifactGenerator<ChatArtifact> {
  readonly type = 'chat' as const;

  async generate(prompt: string): Promise<ChatArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate a chat title and initial message based on the user's request.
Your response must be a valid JSON object with this structure:
{
  "type": "chat",
  "title": "string (descriptive title)",
  "description": "string (optional)",
  "instructions": "string (clear instructions for the AI on how to behave in this chat)",
  "messages": [
    {
      "id": "string",
      "content": "string",
      "isUser": boolean,
      "timestamp": number
    }
  ]
}

CRITICAL RULES:
1. Title should be descriptive and relevant
2. Include at least one initial message from the assistant
3. Instructions should be clear and specific about:
   - Tone and style of responses
   - Domain knowledge to use
   - Any specific rules or constraints
   - How to handle different types of questions
4. Set isUser: false for the initial message
5. Use current timestamp for messages
6. Generate unique IDs for messages`
        },
        { role: 'user', content: prompt }
      ]
    });

    const result = JSON.parse(response);
    
    // Ensure messages have proper IDs and timestamps
    const messages = result.messages.map(msg => ({
      ...msg,
      id: msg.id || crypto.randomUUID(),
      timestamp: msg.timestamp || Date.now()
    }));

    return {
      ...result,
      id: this.generateId(),
      type: this.type,
      messages,
      metadata: {
        lastUpdated: new Date().toISOString()
      }
    };
  }
}