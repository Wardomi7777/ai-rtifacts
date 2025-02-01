import React, { useState } from 'react';
import { Bold, Italic, Code, List, Heading1, Heading2, Heading3, Quote } from 'lucide-react';
import { DocumentArtifact } from '../../../types/artifacts';

interface DocumentEditorProps {
  data: DocumentArtifact;
  onUpdate: (content: string) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content);

  const handleFormat = (format: string) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'code':
        formattedText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : `\`${selectedText}\``;
        cursorOffset = selectedText.includes('\n') ? 4 : 1;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        cursorOffset = 4;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        cursorOffset = 2;
        break;
    }

    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);

    setContent(newContent);
    onUpdate(newContent);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + cursorOffset,
        end + cursorOffset
      );
    }, 0);
  };

  const formatButton = (icon: React.ReactNode, format: string, tooltip: string) => (
    <button
      type="button"
      onClick={() => handleFormat(format)}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex items-center gap-1">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          {formatButton(<Heading1 size={20} />, 'h1', 'Heading 1')}
          {formatButton(<Heading2 size={20} />, 'h2', 'Heading 2')}
          {formatButton(<Heading3 size={20} />, 'h3', 'Heading 3')}
        </div>
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          {formatButton(<Bold size={20} />, 'bold', 'Bold')}
          {formatButton(<Italic size={20} />, 'italic', 'Italic')}
          {formatButton(<Code size={20} />, 'code', 'Code')}
        </div>
        <div className="flex items-center gap-1 pl-2">
          {formatButton(<List size={20} />, 'list', 'List')}
          {formatButton(<Quote size={20} />, 'quote', 'Quote')}
        </div>
      </div>

      {/* Editor */}
      <div className="p-4">
        <textarea
          id="markdown-editor"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            onUpdate(e.target.value);
          }}
          className="w-full min-h-[500px] p-4 border rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Start writing your document..."
        />
      </div>
    </div>
  );
};