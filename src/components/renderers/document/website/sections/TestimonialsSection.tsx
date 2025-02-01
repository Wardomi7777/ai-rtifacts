import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  data: any;
  theme: any;
  template: any;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ data, theme }) => {
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.data.testimonials.map((testimonial: any, index: number) => (
            <div
              key={index}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <Quote className="w-8 h-8 text-primary-500 mb-4" />
              <blockquote className="text-gray-600 dark:text-gray-300 mb-4">
                {testimonial.quote}
              </blockquote>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};