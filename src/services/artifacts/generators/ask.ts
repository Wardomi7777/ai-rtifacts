import { AskArtifact } from '../../../types/artifacts';
import { Message } from '../../../types/chat';
import { BaseArtifactGenerator } from './base';
import { ASK_SYSTEM_PROMPT } from '../../llm/prompts/ask';
import { extractArtifactContent } from '../utils/contentExtractor';

export class AskGenerator extends BaseArtifactGenerator<AskArtifact> {
  readonly type = 'ask' as const;

  async generate(prompt: string, context?: Message[]): Promise<AskArtifact> {
    // Build context from chat history and artifacts
    let contextParts: string[] = [];
    
    if (context?.length) {
      const chatContext = context
        .map(m => {
          let messageText = `${m.isUser ? 'User' : 'Assistant'}: ${m.content}`;
          
          // If message has an artifact, extract its content
          if (m.artifactData) {
            const artifactContent = extractArtifactContent(m.artifactData);
            if (artifactContent) {
              messageText += `\n\nReferenced ${m.artifactData.type}:\n${artifactContent}`;
            }
          }
          
          return messageText;
        })
        .join('\n');
        
      contextParts.push('Previous conversation:', chatContext);
    }
    
    const contextString = contextParts.length 
      ? '\n\n' + contextParts.join('\n')
      : '';

    const response = await this.llmClient.complete({
      messages: [
        { role: 'system', content: ASK_SYSTEM_PROMPT },
        { role: 'user', content: prompt + contextString }
      ]
    });

    const result = JSON.parse(response);
    
    return {
      ...result,
      id: this.generateId(),
      type: this.type
    };
  }
}