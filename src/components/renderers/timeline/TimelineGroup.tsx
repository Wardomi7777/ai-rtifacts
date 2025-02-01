import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineEvent as ITimelineEvent } from '../../../types/artifacts';

interface TimelineGroupProps {
  name: string;
  events: ITimelineEvent[];
  layout: 'vertical' | 'horizontal';
  density: 'compact' | 'comfortable' | 'spacious';
  theme: 'default' | 'modern' | 'minimal';
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({
  name,
  events,
  layout,
  density,
  theme,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const densityClasses = {
    compact: 'space-y-2',
    comfortable: 'space-y-4',
    spacious: 'space-y-6',
  }[density];

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <h3 className="text-lg font-medium">{name}</h3>
        <span className="text-sm text-gray-500">({events.length} events)</span>
      </button>

      {isExpanded && (
        <div className={densityClasses}>
          {events.map((event) => (
            <TimelineEvent
              key={event.id}
              event={event}
              layout={layout}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};