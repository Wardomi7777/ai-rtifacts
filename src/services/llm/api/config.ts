import { LLMConfig } from './types';

export const DEFAULT_CONFIG: LLMConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4',
  baseUrl: 'https://api.openai.com/v1/chat/completions',
};