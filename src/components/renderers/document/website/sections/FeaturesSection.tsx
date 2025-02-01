import React from 'react';
import { Check } from 'lucide-react';

interface FeaturesSectionProps {
  data: any;
  theme: any;
  template: any;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data, theme }) => {
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.data.features.map((feature: any, index: number) => (
            <div
              key={index}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Check className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};