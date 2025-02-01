export const ARTIFACT_SCHEMAS = {
  document: `
Schema for JSON response:
{
  "type": "document",
  "format": "markdown",
  "content": "string (markdown content)"
}

Requirements:
- "type" must be exactly "document"
- "format" must be exactly "markdown"
- "content" must contain valid markdown
- Escape any double quotes in content with backslashes
- Return the raw JSON object only, no code blocks or extra text`,

  spreadsheet: `
Schema for JSON response:
{
  "type": "spreadsheet",
  "columns": ["string"],
  "rows": [["string"]]
}

Requirements:
- "type" must be exactly "spreadsheet"
- "columns" must have at least one column name
- Each row must have same number of elements as columns
- All values must be strings
- Escape any double quotes in values
- Return the raw JSON object only, no code blocks or extra text`,

  diagram: `
Schema for JSON response:
{
  "type": "diagram",
  "notation": "mermaid",
  "source": "string (mermaid syntax)",
  "title": "string (optional)",
  "description": "string (optional)"
}

Requirements:
- "type" must be exactly "diagram"
- "notation" must be exactly "mermaid"
- "source" must be valid mermaid syntax
- "title" and "description" are optional strings
- Escape backslashes and quotes in source
- Use \\n for newlines in source
- Return the raw JSON object only, no code blocks or extra text`
};