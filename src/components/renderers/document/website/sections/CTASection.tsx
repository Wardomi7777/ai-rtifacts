import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  data: any;
  theme: any;
  template: any;
}

export const CTASection: React.FC<CTASectionProps> = ({ data, theme }) => {
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
        <div className="text-center">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mb-4">{children}</h2>
              ),
              p: ({ children }) => (
                <p className="text-xl mb-8">{children}</p>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  {children}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </a>
              ),
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
};