export interface BaseTemplate {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'spreadsheet' | 'diagram' | 'form' | 'think' | 'code' | 'remote' | 'voice' | 'search' | 'layout';
  content: string; // JSON or Markdown content
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplate extends BaseTemplate {
  type: 'document';
  content: string; // Markdown with section definitions
}

export interface SpreadsheetTemplate extends BaseTemplate {
  type: 'spreadsheet';
  content: string; // JSON with column definitions
}

export interface DiagramTemplate extends BaseTemplate {
  type: 'diagram';
  content: string; // JSON with diagram structure
}

export interface FormTemplate extends BaseTemplate {
  type: 'form';
  content: string; // JSON with field definitions
}

export interface ThinkTemplate extends BaseTemplate {
  type: 'think';
  content: string; // JSON with thought structure
}

export interface CodeTemplate extends BaseTemplate {
  type: 'code';
  content: string; // JSON with code structure
}

export interface RemoteTemplate extends BaseTemplate {
  type: 'remote';
  content: string; // JSON with API configuration
}

export interface VoiceTemplate extends BaseTemplate {
  type: 'voice';
  content: string; // JSON with voice settings
}

export interface SearchTemplate extends BaseTemplate {
  type: 'search';
  content: string; // JSON with search parameters
}

export interface LayoutTemplate extends BaseTemplate {
  type: 'layout';
  content: string; // JSON with layout structure
}

export type Template = 
  | DocumentTemplate 
  | SpreadsheetTemplate 
  | DiagramTemplate 
  | FormTemplate
  | ThinkTemplate
  | CodeTemplate
  | RemoteTemplate
  | VoiceTemplate
  | SearchTemplate
  | LayoutTemplate;