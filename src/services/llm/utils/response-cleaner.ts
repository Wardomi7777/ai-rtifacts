import { LLMParseError } from '../api/errors';

export function cleanJSONResponse(response: string): string {
  try {
    // Remove any markdown code block markers and trim whitespace
    let cleaned = response.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    
    // Parse and validate the response
    const parsed = JSON.parse(cleaned);
    
    // Validate that it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Response must be a JSON object');
    }

    // Ensure type field exists and is valid
    if (!parsed.type) {
      throw new Error('Missing required "type" field');
    }

    // Validate type value
    const validTypes = ['document', 'spreadsheet', 'diagram'];
    if (!validTypes.includes(parsed.type)) {
      throw new Error(`Invalid type "${parsed.type}". Must be one of: ${validTypes.join(', ')}`);
    }

    return cleaned;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new LLMParseError(
        `Invalid JSON syntax: ${error.message}`,
        response
      );
    }
    throw new LLMParseError(
      `Invalid JSON response: ${error.message}`,
      response
    );
  }
}