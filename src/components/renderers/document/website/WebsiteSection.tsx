import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface WebsiteSectionProps {
  section: {
    id: string;
    type: 'hero' | 'content' | 'features' | 'cta' | 'footer';
    content: string;
    style: {
      background: 'white' | 'gradient' | 'colored';
      width: 'narrow' | 'wide' | 'full';
      padding: 'small' | 'medium' | 'large';
    };
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const WebsiteSection: React.FC<WebsiteSectionProps> = ({ section, theme }) => {
  const getBackgroundStyle = () => {
    switch (section.style.background) {
      case 'gradient':
        return `bg-gradient-to-br from-${theme.primary} to-${theme.secondary}`;
      case 'colored':
        return `bg-${theme.primary}`;
      default:
        return 'bg-white';
    }
  };

  const getWidthStyle = () => {
    switch (section.style.width) {
      case 'narrow':
        return 'max-w-3xl';
      case 'wide':
        return 'max-w-7xl';
      default:
        return 'w-full';
    }
  };

  const getPaddingStyle = () => {
    switch (section.style.padding) {
      case 'small':
        return 'py-8';
      case 'large':
        return 'py-24';
      default:
        return 'py-16';
    }
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-5xl font-bold mb-8" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-4xl font-bold mb-6" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-3xl font-bold mb-4" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="text-lg leading-relaxed mb-6" {...props} />
    ),
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
        <code className="px-2 py-1 bg-gray-100 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <section
      id={section.id}
      className={`${getBackgroundStyle()} ${getPaddingStyle()}`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${getWidthStyle()}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </section>
  );
};