import React, { useEffect, useState } from 'react';
import { WebsiteNavigation } from './WebsiteNavigation';
import { WebsiteSection } from './sections';
import { useTheme } from './hooks/useTheme';
import { useAnimation } from './hooks/useAnimation';
import { useSocialShare } from './hooks/useSocialShare';
import { SocialButtons } from './components/SocialButtons';

interface WebsiteRendererProps {
  data: any;
  onClose: () => void;
}

export const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({ data, onClose }) => {
  const { content, metadata, template } = data;
  const { theme, toggleTheme } = useTheme(content.theme);
  const { animateElement } = useAnimation();
  const { shareLinks, handleShare } = useSocialShare(metadata);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        theme.mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <WebsiteNavigation 
        items={content.navigation.items}
        title={metadata.title}
        onClose={onClose}
        type={content.navigation.type}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className={`pt-16 ${
        content.navigation.type === 'sidebar' ? 'lg:pl-64' : ''
      }`}>
        <div className={`
          opacity-0 transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : ''}
        `}>
          {content.sections.map((section: any, index: number) => (
            <div
              key={section.id}
              ref={(el) => el && animateElement(el, index)}
              className="relative"
            >
              <WebsiteSection
                section={section}
                theme={theme}
                template={template}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className={`
        border-t ${theme.mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
        transition-colors duration-300
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="flex justify-center space-x-6">
            <SocialButtons shareLinks={shareLinks} onShare={handleShare} />
          </div>
          <div className={`text-center ${
            theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {metadata.author && (
              <p>Created by {metadata.author}</p>
            )}
            {metadata.social && (
              <div className="mt-4 flex justify-center space-x-4">
                {Object.entries(metadata.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-500 transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};