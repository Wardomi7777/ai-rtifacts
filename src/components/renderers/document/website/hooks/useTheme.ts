import { useState, useEffect } from 'react';

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  mode?: 'light' | 'dark' | 'system';
}

export const useTheme = (initialTheme: ThemeConfig) => {
  const [theme, setTheme] = useState({
    ...initialTheme,
    mode: initialTheme.mode || 'system'
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme.mode === 'system') {
        setTheme(prev => ({
          ...prev,
          mode: mediaQuery.matches ? 'dark' : 'light',
          colors: {
            primary: prev.primary,
            secondary: prev.secondary,
            accent: prev.accent
          }
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange();

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
      colors: prev.colors
    }));
  };

  return { theme, toggleTheme };
};