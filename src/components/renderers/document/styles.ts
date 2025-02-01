export const getDocumentThemeStyles = (theme: string = 'default'): string => {
  const themes = {
    default: 'prose-slate',
    academic: 'prose-stone prose-quoteless',
    technical: 'prose-neutral prose-pre:bg-gray-50',
  };

  return themes[theme] || themes.default;
};