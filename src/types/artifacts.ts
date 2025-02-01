export type ArtifactType = 'ask' | 'think' | 'document' | 'spreadsheet' | 'diagram' | 'form' | 'search' | 'layout' | 'image' | 'voice' | 'macro' | 'code' | 'remote' | 'chat';

export interface BaseArtifact {
  id: string;
  type: ArtifactType;
  title?: string;
  description?: string;
}

export interface AskArtifact extends BaseArtifact {
  type: 'ask';
  content: string;
}

export interface ThinkArtifact extends BaseArtifact {
  type: 'think';
  content: string;
}

export interface DocumentArtifact extends BaseArtifact {
  type: 'document';
  format: 'markdown';
  content: string;
  metadata?: {
    toc?: boolean;
    lastUpdated?: string;
    author?: string;
    tags?: string[];
  };
  style?: {
    theme?: 'default' | 'academic' | 'technical';
    fontSize?: 'normal' | 'large';
    lineHeight?: 'normal' | 'relaxed' | 'loose';
  };
}

export interface SpreadsheetArtifact extends BaseArtifact {
  type: 'spreadsheet';
  columns: string[];
  rows: string[][];
  metadata?: {
    lastUpdated?: string;
    author?: string;
  };
  style?: {
    columnStyles?: Record<string, {
      align?: 'left' | 'center' | 'right';
      width?: string;
    }>;
  };
}

export interface DiagramArtifact extends BaseArtifact {
  type: 'diagram';
  notation: 'mermaid';
  source: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'email' | 'tel';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FormArtifact extends BaseArtifact {
  type: 'form';
  fields: FormField[];
  instructions: string;
  submitLabel?: string;
  metadata?: {
    lastUpdated?: string;
    author?: string;
    tags?: string[];
  };
}

export interface SearchArtifact extends BaseArtifact {
  type: 'search';
  content: string;
  sources: Array<{
    title: string;
    url: string;
    snippet?: string;
  }>;
}

export interface LayoutArtifact extends BaseArtifact {
  type: 'layout';
  code: {
    html: string;
    css: string;
  };
  preview?: {
    screenshot?: string;
    lastRendered?: string;
  };
  metadata?: {
    theme?: 'light' | 'dark';
    responsive?: boolean;
    lastUpdated?: string;
    tags?: string[];
  };
}

export interface ImageArtifact extends BaseArtifact {
  type: 'image';
  prompt: string;
  imageUrl: string;
  model: 'dall-e-3';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface VoiceArtifact extends BaseArtifact {
  type: 'voice';
  content: string;
  audioUrl: string;
  voiceId: string;
  model: string;
}

export interface MacroStep {
  type: ArtifactType;
  prompt: string;
  templateId?: string;
  addToKnowledge: boolean;
  completed?: boolean;
  artifactId?: string;
}

export interface MacroArtifact extends BaseArtifact {
  type: 'macro';
  steps: MacroStep[];
  currentStep?: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
  knowledge: string[];
}

export interface CodeInput {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  defaultValue?: string | number | boolean;
}

export interface CodeArtifact extends BaseArtifact {
  type: 'code';
  language: 'javascript' | 'python' | 'typescript';
  source: string;
  inputs?: CodeInput[];
  lastResult?: {
    output: string;
    error?: string;
    timestamp: string;
  };
}

export interface RemoteActionArtifact extends BaseArtifact {
  type: 'remote';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
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
}

export interface ChatArtifact extends BaseArtifact {
  type: 'chat';
  messages: Message[];
  title: string;
  description?: string;
  instructions: string;
  metadata?: {
    lastUpdated?: string;
    participants?: string[];
  };
}

export type ArtifactData = AskArtifact | ThinkArtifact | DocumentArtifact | SpreadsheetArtifact | DiagramArtifact | FormArtifact | SearchArtifact | LayoutArtifact | ImageArtifact | VoiceArtifact | MacroArtifact | CodeArtifact | RemoteActionArtifact | ChatArtifact;