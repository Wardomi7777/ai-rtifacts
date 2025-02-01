import { LLMAPIClient } from '../llm/api/client';
import { SUMMARY_SYSTEM_PROMPT } from '../llm/prompts/summary';
import { ArtifactData } from '../../types/artifacts';

interface Summary {
  title: string;
  summary: string;
}

export class SummaryService {
  private llmClient: LLMAPIClient;

  constructor(llmClient: LLMAPIClient = new LLMAPIClient()) {
    this.llmClient = llmClient;
  }

  async generateSummary(artifact: ArtifactData): Promise<Summary> {
    let content = '';

    switch (artifact.type) {
      case 'document':
        content = artifact.content;
        break;
      case 'spreadsheet':
        content = `Spreadsheet with columns: ${artifact.columns.join(', ')}\nSample data: ${
          artifact.rows.slice(0, 3).map(row => row.join(', ')).join('\n')
        }`;
        break;
      case 'diagram':
        content = artifact.source;
        break;
      case 'form':
        content = `Form with fields: ${
          artifact.fields.map(f => `${f.label} (${f.type})`).join(', ')
        }`;
        break;
      default:
        throw new Error(`Unsupported artifact type: ${artifact.type}`);
    }

    const response = await this.llmClient.complete({
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content }
      ]
    });

    return JSON.parse(response);
  }
}