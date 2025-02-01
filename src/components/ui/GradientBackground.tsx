import React from 'react';

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      {children}
    </div>
  );
};