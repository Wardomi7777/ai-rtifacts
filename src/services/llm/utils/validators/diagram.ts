import { DiagramArtifact } from '../../../../types/artifacts';
import { validateMermaidSyntax } from './mermaid-validator';

export function validateDiagramArtifact(data: DiagramArtifact): void {
  // Validate required fields
  if (data.notation !== 'mermaid') {
    throw new Error('Diagram notation must be "mermaid"');
  }
  
  if (typeof data.source !== 'string' || !data.source.trim()) {
    throw new Error('Diagram source must be a non-empty string');
  }

  // Optional fields validation
  if (data.title && typeof data.title !== 'string') {
    throw new Error('Diagram title must be a string if provided');
  }

  if (data.description && typeof data.description !== 'string') {
    throw new Error('Diagram description must be a string if provided');
  }

  // Validate Mermaid syntax
  validateMermaidSyntax(data.source);
}