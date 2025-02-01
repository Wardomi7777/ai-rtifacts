import React from 'react';
import { TimelineHeader } from './timeline/TimelineHeader';
import { TimelineContent } from './timeline/TimelineContent';
import { TimelineFilters } from './timeline/TimelineFilters';
import { useTimelineState } from './timeline/useTimelineState';
import { TimelineArtifact } from '../../types/artifacts';

interface TimelineRendererProps {
  data: TimelineArtifact;
}

export const TimelineRenderer: React.FC<TimelineRendererProps> = ({ data }) => {
  const {
    filteredEvents,
    activeCategories,
    dateRange,
    handleCategoryToggle,
    handleDateRangeChange,
  } = useTimelineState(data);

  return (
    <div className="space-y-6">
      <TimelineHeader
        title={data.title}
        description={data.description}
        metadata={data.metadata}
      />
      
      <TimelineFilters
        categories={data.metadata?.categories || []}
        activeCategories={activeCategories}
        dateRange={dateRange}
        onCategoryToggle={handleCategoryToggle}
        onDateRangeChange={handleDateRangeChange}
      />
      
      <TimelineContent
        events={filteredEvents}
        groups={data.groups}
        layout={data.style?.layout || 'vertical'}
        density={data.style?.density || 'comfortable'}
        theme={data.style?.theme || 'default'}
      />
    </div>
  );
};