import React from 'react';
import { Circle } from 'lucide-react';
import { TimelineEvent as ITimelineEvent } from '../../../types/artifacts';

interface TimelineEventProps {
  event: ITimelineEvent;
  layout: 'vertical' | 'horizontal';
  theme: 'default' | 'modern' | 'minimal';
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  layout,
  theme,
}) => {
  const getThemeClasses = () => {
    const themes = {
      default: 'bg-white border border-gray-200',
      modern: 'bg-white/80 backdrop-blur-sm border border-white/20',
      minimal: 'bg-transparent',
    };
    return themes[theme];
  };

  return (
    <div className={`
      relative p-4 rounded-lg ${getThemeClasses()}
      ${layout === 'vertical' ? 'ml-6' : ''}
    `}>
      {/* Timeline connector */}
      {layout === 'vertical' && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 -ml-3" />
          <Circle
            size={16}
            className="absolute left-0 top-6 -ml-[11px] text-purple-500 bg-white rounded-full"
            fill="white"
          />
        </>
      )}

      {/* Event content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-gray-900">{event.title}</h3>
          <time className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(event.date).toLocaleDateString()}
          </time>
        </div>
        
        {event.description && (
          <p className="text-sm text-gray-600">{event.description}</p>
        )}
        
        {event.category && (
          <span className={`
            inline-block px-2 py-1 text-xs font-medium rounded-full
            ${event.color ? `bg-${event.color}-100 text-${event.color}-700` : 'bg-gray-100 text-gray-700'}
          `}>
            {event.category}
          </span>
        )}
      </div>
    </div>
  );
};