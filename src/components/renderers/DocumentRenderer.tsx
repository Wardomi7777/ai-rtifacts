import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DocumentArtifact } from '../../types/artifacts';
import { DocumentHeader } from './document/DocumentHeader';
import { TableOfContents } from './document/TableOfContents';
import { getDocumentThemeStyles } from './document/styles';
import { DocumentEditor } from './document/DocumentEditor';
import { DocumentLLMEditor } from './document/DocumentLLMEditor';
import { useArtifactStore } from '../../store/useArtifactStore';
import { DocumentWebsite } from './document/DocumentWebsite';
import { Pencil, Eye, Wand2, Globe } from 'lucide-react';

interface DocumentRendererProps {
  data: DocumentArtifact;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showLLMEditor, setShowLLMEditor] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const themeStyles = getDocumentThemeStyles(data.style?.theme || 'default');
  const { updateArtifact } = useArtifactStore();
  
  const handleContentUpdate = (newContent: string) => {
    const updatedData = {
      ...data,
      content: newContent
    };
    setData(updatedData);
    updateArtifact(updatedData);
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-2xl font-bold mt-5 mb-2 text-gray-800" {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h4 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />
    ),
    h5: ({ node, ...props }) => (
      <h5 className="text-lg font-bold mt-3 mb-2 text-gray-800" {...props} />
    ),
    h6: ({ node, ...props }) => (
      <h6 className="text-base font-bold mt-3 mb-2 text-gray-800" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="my-4 leading-7 text-gray-700" {...props} />
    ),
    ul: ({ node, ordered, ...props }) => (
      <ul className="my-4 ml-6 space-y-2 list-disc marker:text-gray-500" {...props} />
    ),
    ol: ({ node, ordered, ...props }) => (
      <ol className="my-4 ml-6 space-y-2 list-decimal marker:text-gray-500" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="pl-2 text-gray-700" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote 
        className="my-4 pl-4 border-l-4 border-purple-500 bg-purple-50 py-2 px-4 rounded-r-lg italic text-gray-700"
        {...props}
      />
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-6 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={match[1]}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              padding: '1.5rem',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code 
          className="px-2 py-1 bg-gray-100 text-purple-600 rounded font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    table: ({ node, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border" {...props} />
      </div>
    ),
    th: ({ node, ...props }) => (
      <th 
        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td 
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b"
        {...props}
      />
    ),
    a: ({ node, ...props }) => (
      <a 
        className="text-purple-600 hover:text-purple-800 underline transition-colors"
        {...props}
      />
    ),
    img: ({ node, ...props }) => (
      <img 
        className="max-w-full h-auto rounded-lg my-4 shadow-lg"
        {...props}
      />
    ),
    hr: ({ node, ...props }) => (
      <hr 
        className="my-8 border-t-2 border-gray-200"
        {...props}
      />
    ),
  };

  if (showWebsite) {
    return <DocumentWebsite data={data} onClose={() => setShowWebsite(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <DocumentHeader
        title={data.title}
        description={data.description}
        metadata={data.metadata}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setShowLLMEditor(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isEditing ? (
            <>
              <Eye size={20} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Pencil size={20} />
              <span>Edit</span>
            </>
          )}
        </button>
        <button
          onClick={() => {
            setShowLLMEditor(!showLLMEditor);
            setIsEditing(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
        >
          <Wand2 size={20} />
          <span>AI Edit</span>
        </button>
        <button
          onClick={() => setShowWebsite(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 transition-colors"
        >
          <Globe size={20} />
          <span>Website</span>
        </button>
      </div>

      <div className="w-full">
        {isEditing ? (
          <DocumentEditor data={data} onUpdate={handleContentUpdate} />
        ) : showLLMEditor ? (
          <>
            <article className={`prose ${themeStyles} max-w-none bg-white rounded-lg shadow-sm p-8`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {data.content}
              </ReactMarkdown>
            </article>
            <DocumentLLMEditor content={data.content} onUpdate={handleContentUpdate} />
          </>
        ) : (
          <article className={`prose ${themeStyles} max-w-none bg-white rounded-lg shadow-sm p-8`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {data.content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
};