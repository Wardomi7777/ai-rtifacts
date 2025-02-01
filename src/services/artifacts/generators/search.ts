import { SearchArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { PerplexityClient } from '../../llm/api/perplexity';

export class SearchGenerator extends BaseArtifactGenerator<SearchArtifact> {
  readonly type = 'search' as const;
  private perplexityClient: PerplexityClient;

  constructor() {
    super();
    this.perplexityClient = new PerplexityClient();
  }

  async generate(prompt: string): Promise<SearchArtifact> {
    const response = await this.perplexityClient.search(prompt);
    
    // Generate title and description
    const summaryResponse = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: 'Generate a short title and description for the search results. Response format:\n{"title": "string", "description": "string"}'
        },
        {
          role: 'user',
          content: `Query: ${prompt}\n\nResults: ${response.choices[0].message.content}`
        }
      ]
    });
    
    const summary = JSON.parse(summaryResponse);
    
    // Extract content from the first choice's message
    const content = response.choices[0].message.content;
    
    // Map citations to sources format
    const sources = response.citations.map(url => ({
      title: url.split('/').pop()?.replace(/-/g, ' ') || url,
      url: url,
      snippet: undefined // Perplexity doesn't provide snippets directly
    }));

    return {
      id: this.generateId(),
      type: this.type,
      title: summary.title,
      description: summary.description,
      content,
      sources
    };
  }
}