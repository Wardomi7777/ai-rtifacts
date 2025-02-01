# ai-rtifacts

**WARNING:** This is Proof Of Concept project and it contains bugs and missing features, do not treat it as ready to use tool!

This projest is 100% generated using LLM.

AI-rtifacts is sandbox project that explore idea of various artifacts other than just chatbots to interact with LLM's as a user.

You can check out project here https://resplendent-panda-67bfae.netlify.app/.

This version is open-sourced so feel free to use it, experiment and edit! There is high probability that my next version will not be open-sourced though.

TODO: There will be also case stud of building this POC.


## Artifact Types

### Content Generation

- **Ask** (`ask`)
  - Quick question-answer interactions
  - Context-aware responses
  - Markdown formatting support

- **Think** (`think`)
  - In-depth analysis and reasoning
  - Complex problem-solving
  - Structured thought process

- **Document** (`document`)
  - Markdown-based documents
  - Support for headers, lists, code blocks
  - Customizable themes and styling
  - Table of Contents generation
  - Export to multiple formats

- **Spreadsheet** (`spreadsheet`)
  - Structured data organization
  - Column and row management
  - Data analysis capabilities
  - Sorting and filtering
  - Custom column styles

### Visual & Interactive

- **Diagram** (`diagram`)
  - Mermaid.js syntax support
  - Multiple diagram types:
    - Flowcharts
    - Sequence diagrams
    - Class diagrams
    - Entity-Relationship diagrams
  - Real-time preview

- **Layout** (`layout`)
  - Responsive web layouts
  - HTML and CSS generation
  - Theme support (light/dark)
  - Component-based structure
  - Preview functionality

- **Image** (`image`)
  - DALL-E 3 integration
  - Multiple size options
  - Quality settings (standard/HD)
  - Style control (vivid/natural)

### Forms & Data

- **Form** (`form`)
  - Interactive form generation
  - Multiple field types:
    - Text
    - Textarea
    - Select
    - Number
    - Date
    - Email
    - Tel
  - Validation rules
  - Auto-fill capabilities

- **Search** (`search`)
  - Web search functionality
  - Source tracking
  - Result summarization
  - Citation management

### Automation & Integration

- **Macro** (`macro`)
  - Multi-step automation
  - Sequential artifact generation
  - Knowledge base integration
  - Progress tracking
  - Error handling

- **Code** (`code`)
  - Multiple language support:
    - JavaScript
    - Python
    - TypeScript
  - Input/output handling
  - Syntax highlighting
  - Code execution
  - Error handling

- **Remote** (`remote`)
  - API interaction
  - Multiple HTTP methods
  - Authentication support:
    - Bearer token
    - Basic auth
    - API key
  - Request/response management

### Media & Communication

- **Voice** (`voice`)
  - Text-to-speech generation
  - Multiple voice options
  - Audio playback
  - Voice model selection

- **Chat** (`chat`)
  - Interactive conversations
  - Context management
  - Template support
  - Message history

## Core Features

### Template System
- Create and manage templates for any artifact type
- Reusable structures and patterns
- Template variables and customization

### Knowledge Base
- Store and organize artifacts
- Categorize with tags
- Search and filter
- Reference in new generations

### Workspace Management
- Multiple chat workspaces
- Artifact organization
- Search functionality
- Type filtering

### Integration Features
- OpenAI API integration
- ElevenLabs voice synthesis
- Perplexity search integration
- Mermaid diagram rendering



## API Requirements

The system requires the following API keys for full functionality:

- **OpenAI API Key** (Required)
  - Core functionality
  - Text generation
  - Image generation (DALL-E)

- **ElevenLabs API Key** (Optional)
  - Voice generation features
  - Text-to-speech conversion

- **Perplexity API Key** (Optional)
  - Advanced search functionality
  - Web content analysis

## Technical Stack

- React
- TypeScript
- Tailwind CSS
- Lucide Icons
- Mermaid.js
- Monaco Editor
- Recharts
- Zustand (State Management)

## Credits

Made by Dominik Fidziukiewicz
