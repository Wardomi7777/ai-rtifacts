import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineGroup } from './TimelineGroup';
import { TimelineEvent as ITimelineEvent, TimelineGroup as ITimelineGroup } from '../../../types/artifacts';

interface TimelineContentProps {
  events: ITimelineEvent[];
  groups?: ITimelineGroup[];
  layout: 'vertical' | 'horizontal';
  density: 'compact' | 'comfortable' | 'spacious';
  theme: 'default' | 'modern' | 'minimal';
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  events,
  groups,
  layout,
  density,
  theme,
}) => {
  const containerClasses = {
    vertical: 'space-y-8',
    horizontal: 'flex gap-8 overflow-x-auto pb-4',
  }[layout];

  const densityClasses = {
    compact: 'space-y-2',
    comfortable: 'space-y-4',
    spacious: 'space-y-6',
  }[density];

  if (groups) {
    return (
      <div className={containerClasses}>
        {groups.map((group) => (
          <TimelineGroup
            key={group.name}
            name={group.name}
            events={group.events}
            layout={layout}
            density={density}
            theme={theme}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${containerClasses} ${densityClasses}`}>
      {events.map((event) => (
        <TimelineEvent
          key={event.id}
          event={event}
          layout={layout}
          theme={theme}
        />
      ))}
    </div>
  );
};