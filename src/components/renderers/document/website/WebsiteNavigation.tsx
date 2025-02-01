import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ArrowLeft } from 'lucide-react';

interface WebsiteNavigationProps {
  items: Array<{ label: string; href: string; icon?: string }>;
  title: string;
  onClose: () => void;
  type: 'horizontal' | 'vertical' | 'sidebar';
  theme: any;
  onThemeToggle: () => void;
}

export const WebsiteNavigation: React.FC<WebsiteNavigationProps> = ({
  items,
  title,
  onClose,
  type,
  theme,
  onThemeToggle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDark = theme.mode === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bgClass} border-b ${borderClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onClose}
              className={`mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${textClass}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className={`text-lg font-semibold ${textClass}`}>{title}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className={`${textMutedClass} hover:${textClass} transition-colors`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${textClass}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${textClass}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${textClass}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${bgClass} border-b ${borderClass}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className={`block px-3 py-2 rounded-md ${textMutedClass} hover:${textClass} hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};