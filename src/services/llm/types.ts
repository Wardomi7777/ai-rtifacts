export interface LLMConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface LLMRequest {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}