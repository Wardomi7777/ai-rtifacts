import { ArtifactData } from '../../../types/artifacts';

export function extractArtifactContent(artifact: ArtifactData): string | null {
  switch (artifact.type) {
    case 'ask':
    case 'think':
      return artifact.content;

    case 'search':
      const sources = artifact.sources
        .map(s => `${s.title}\n${s.url}${s.snippet ? '\n' + s.snippet : ''}`)
        .join('\n\n');
      return `${artifact.content}\n\nSources:\n${sources}`;
      
    case 'document':
      return artifact.content;
      
    case 'spreadsheet': {
      const headers = artifact.columns.join(' | ');
      const separator = artifact.columns.map(() => '---').join(' | ');
      const rows = artifact.rows
        .map(row => row.join(' | '))
        .join('\n');
      return `${headers}\n${separator}\n${rows}`;
    }
      
    case 'diagram':
      return artifact.source;
      
    case 'image':
      return `Generated image from prompt: ${artifact.prompt}`;
      
    case 'voice':
      return `Generated voice content: ${artifact.content}`;
      
    case 'form': {
      const fields = artifact.fields
        .map(f => `${f.label} (${f.type}${f.required ? ', required' : ''})`)
        .join('\n- ');
      return `Form fields:\n- ${fields}`;
    }
    case 'macro': {
      const steps = artifact.steps
        .map((s, i) => `${i + 1}. ${s.type}: ${s.prompt}`)
        .join('\n');
      return `Macro steps:\n${steps}`;
    }
      
    case 'remote':
      return `${artifact.method} ${artifact.url}${
        artifact.queryParams 
          ? '\nQuery Params: ' + JSON.stringify(artifact.queryParams, null, 2)
          : ''
      }${
        artifact.body
          ? '\nBody: ' + artifact.body
          : ''
      }`;
      
    default:
      return null;
  }
}