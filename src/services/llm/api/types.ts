export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface RequestOptions {
  temperature?: number;
  max_tokens?: number;
  chatInstructions?: string;
}

export interface LLMRequest extends RequestOptions {
  messages: Message[];
}

export interface LLMResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}