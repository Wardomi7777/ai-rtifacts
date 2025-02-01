import { ArtifactData } from '../../../../types/artifacts';
import { validateDocumentArtifact } from './document';
import { validateSpreadsheetArtifact } from './spreadsheet';
import { validateDiagramArtifact } from './diagram';
import { validateTimelineArtifact } from './timeline';
import { validateAskArtifact } from './ask';
import { validateFormArtifact } from './form';
import { validateSearchArtifact } from './search';
import { validateLayoutArtifact } from './layout';
import { validateThinkArtifact } from './think';
import { validateImageArtifact } from './image';
import { validateVoiceArtifact } from './voice';
import { validateMacroArtifact } from './macro';
import { validateCodeArtifact } from './code';
import { validateRemoteArtifact } from './remote';
import { validateChatArtifact } from './chat';

export function validateArtifact(data: ArtifactData): void {
  if (!data.type) {
    throw new Error('Missing required "type" field');
  }

  switch (data.type) {
    case 'ask':
      validateAskArtifact(data);
      break;
    case 'think':
      validateThinkArtifact(data);
      break;
    case 'document':
      validateDocumentArtifact(data);
      break;
    case 'spreadsheet':
      validateSpreadsheetArtifact(data);
      break;
    case 'diagram':
      validateDiagramArtifact(data);
      break;
    case 'form':
      validateFormArtifact(data);
      break;
    case 'search':
      validateSearchArtifact(data);
      break;
    case 'layout':
      validateLayoutArtifact(data);
      break;
    case 'image':
      validateImageArtifact(data);
      break;
    case 'voice':
      validateVoiceArtifact(data);
      break;
    case 'macro':
      validateMacroArtifact(data);
      break;
    case 'code':
      validateCodeArtifact(data);
      break;
    case 'timeline':
      validateTimelineArtifact(data);
      break;
    case 'remote':
      validateRemoteArtifact(data);
      break;
    case 'chat':
      validateChatArtifact(data);
      break;
    default:
      throw new Error(`Invalid artifact type: ${data.type}`);
  }
}