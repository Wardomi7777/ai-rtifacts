import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ContentSectionProps {
  data: any;
  theme: any;
  template: any;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ data, theme }) => {
  const bgClass = {
    white: 'bg-white dark:bg-gray-900',
    gradient: 'bg-gradient-to-br from-primary-500 to-secondary-500',
    colored: `bg-${theme.primary}-500`,
  }[data.style.background];

  return (
    <section
      id={data.id}
      className={`${bgClass} ${
        data.style.padding === 'large' ? 'py-24' :
        data.style.padding === 'small' ? 'py-12' : 'py-16'
      }`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${
        data.style.width === 'narrow' ? 'max-w-3xl' :
        data.style.width === 'wide' ? 'max-w-7xl' : 'w-full'
      }`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={vscDarkPlus}
                  className="rounded-lg my-8"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </section>
  );
};