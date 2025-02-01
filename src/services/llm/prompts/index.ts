import { BASE_SYSTEM_PROMPT, BASE_USER_PROMPT } from './base';
import { ARTIFACT_SCHEMAS } from './schemas';

export const getSystemPromptForArtifact = (artifactType: string) => {
  return `${BASE_SYSTEM_PROMPT}\n\n${ARTIFACT_SCHEMAS[artifactType]}`;
};

export const getRawAnswerPrompt = BASE_USER_PROMPT;