import { ArtifactData } from '../../../types/artifacts';
import { LLMParseError } from '../api/errors';
import { cleanJSONResponse } from './response-cleaner';
import { validateArtifact } from './validators';

export function validateAndParseResponse(response: string): ArtifactData {
  try {
    // Clean and validate basic JSON structure
    const cleanedResponse = cleanJSONResponse(response);
    
    // Parse the cleaned response
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate the artifact structure based on its type
    validateArtifact(parsed);
    
    return parsed as ArtifactData;
  } catch (error) {
    if (error instanceof LLMParseError) {
      throw error;
    }
    throw new LLMParseError(
      `Failed to validate LLM response: ${error.message}`,
      response
    );
  }
}