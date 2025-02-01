import mermaid from 'mermaid';

// Initialize mermaid with secure configuration
mermaid.initialize({
  startOnLoad: false,
  secure: true,
  securityLevel: 'strict',
  logLevel: 'error',
});

export async function validateMermaidSyntax(source: string): Promise<void> {
  try {
    // Clean the source before validation
    const cleanSource = source
      .replace(/\\n/g, '\n')
      .replace(/\\/g, '');

    // Try to parse the Mermaid syntax
    await mermaid.parse(cleanSource);
  } catch (error) {
    // Extract meaningful error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Invalid Mermaid syntax';
    
    console.error('Mermaid validation error:', {
      originalSource: source,
      cleanedSource: source.replace(/\\n/g, '\n').replace(/\\/g, ''),
      error
    });

    throw new Error(`Invalid Mermaid diagram syntax: ${errorMessage}`);
  }
}