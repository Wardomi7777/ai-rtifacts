export class LLMAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'LLMAPIError';
  }
}

export class LLMParseError extends Error {
  constructor(message: string, public rawResponse: string) {
    super(message);
    this.name = 'LLMParseError';
  }
}