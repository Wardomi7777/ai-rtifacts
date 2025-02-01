import { BasePlugin } from '../BasePlugin';
import { DiagramArtifact } from './DiagramArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';
import { validateMermaidSyntax } from '../../../services/llm/utils/validators/mermaid-validator';

export class DiagramPlugin extends BasePlugin {
  metadata = {
    id: 'core.diagram',
    name: 'Diagram Plugin',
    version: '1.0.0',
    description: 'Core plugin for diagram artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'diagram';

  createArtifact(): DiagramArtifact {
    return new DiagramArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      async (data: any) => {
        this.validateRequiredString(data.source, 'source');
        
        if (data.notation !== 'mermaid') {
          throw new Error('Only Mermaid notation is supported');
        }

        // Validate Mermaid syntax
        await validateMermaidSyntax(data.source);
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Mermaid diagram source code'
        },
        notation: {
          type: 'string',
          enum: ['mermaid'],
          default: 'mermaid'
        }
      },
      required: ['source']
    };
  }

  getExportFormats(): string[] {
    return ['svg', 'png', 'pdf'];
  }

  async beforeCreate(data: Partial<DiagramArtifact>): Promise<Partial<DiagramArtifact>> {
    // Clean up source code formatting
    if (data.source) {
      data.source = data.source
        .replace(/\\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return data;
  }

  async afterCreate(artifact: DiagramArtifact): Promise<void> {
    // Generate title from first node if not provided
    if (!artifact.title) {
      const firstNode = artifact.source.match(/\[([^\]]+)\]/);
      if (firstNode) {
        artifact.title = firstNode[1];
      }
    }
  }
}