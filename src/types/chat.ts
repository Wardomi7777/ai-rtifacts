import { ArtifactData } from './artifacts';

export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  messages: Message[];
}

export interface MessageReference {
  type: 'quote' | 'context' | 'knowledge' | 'template';
  title: string;
  artifactType?: ArtifactData['type'];
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  imageUrl?: string;
  artifactData?: ArtifactData;
  templateId?: string;
  chatInstructions?: string;
  references?: MessageReference[];
}