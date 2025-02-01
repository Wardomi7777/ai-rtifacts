import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headers from markdown content
    const headers = content.split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => {
        const level = line.match(/^#+/)?.[0].length || 0;
        const text = line.replace(/^#+\s+/, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return { id, text, level };
      });

    setToc(headers);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav className="space-y-2 text-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
      {toc.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`block py-1 pl-${(level - 1) * 4} hover:text-primary-600 transition-colors ${
            activeId === id
              ? 'text-primary-600 font-medium'
              : 'text-gray-600'
          }`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
        >
          {text}
        </a>
      ))}
    </nav>
  );
};