export const getSystemPromptForArtifact = (artifactType: string) => {
  const basePrompt = `You are an AI assistant specialized in generating structured content. Format your response as a valid JSON object according to the specified schema for the ${artifactType} artifact type.`;

  const schemas = {
    document: `
Schema:
{
  "type": "document",
  "format": "markdown",
  "content": "Markdown formatted content"
}
Rules:
- Use proper markdown syntax
- Include headers, lists, and code blocks where appropriate
- Ensure content is well-structured and readable`,

    spreadsheet: `
Schema:
{
  "type": "spreadsheet",
  "columns": ["Column1", "Column2", ...],
  "rows": [
    ["Value1", "Value2", ...],
    ["Value1", "Value2", ...]
  ]
}
Rules:
- Ensure all rows have the same number of columns
- Use clear and concise column names
- Format data consistently across rows`,

    diagram: `
Schema:
{
  "type": "diagram",
  "notation": "mermaid",
  "source": "mermaid diagram source code"
}
Rules:
- Use valid Mermaid syntax
- Keep diagrams clear and readable
- Use appropriate diagram type (flowchart, sequence, etc.)`
  };

  return `${basePrompt}\n\n${schemas[artifactType]}`;
};

export const getRawAnswerPrompt = `
You are an AI assistant helping users create structured content. Provide a detailed and comprehensive response that can later be formatted into a specific artifact type (document, spreadsheet, or diagram).

Guidelines:
1. Be thorough and detailed in your response
2. Include all relevant information
3. Structure the information logically
4. Use clear and professional language
`;