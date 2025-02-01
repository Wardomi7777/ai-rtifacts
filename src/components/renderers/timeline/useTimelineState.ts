import { useState, useMemo } from 'react';
import { TimelineArtifact, TimelineEvent } from '../../../types/artifacts';

export const useTimelineState = (data: TimelineArtifact) => {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(data.metadata?.categories || [])
  );
  
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: data.metadata?.startDate || null,
    end: data.metadata?.endDate || null,
  });

  const handleCategoryToggle = (category: string) => {
    setActiveCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleDateRangeChange = (range: { start: string | null; end: string | null }) => {
    setDateRange(range);
  };

  const filteredEvents = useMemo(() => {
    return data.events.filter((event: TimelineEvent) => {
      // Filter by category
      if (event.category && !activeCategories.has(event.category)) {
        return false;
      }

      // Filter by date range
      const eventDate = new Date(event.date);
      if (dateRange.start && new Date(dateRange.start) > eventDate) {
        return false;
      }
      if (dateRange.end && new Date(dateRange.end) < eventDate) {
        return false;
      }

      return true;
    });
  }, [data.events, activeCategories, dateRange]);

  return {
    filteredEvents,
    activeCategories,
    dateRange,
    handleCategoryToggle,
    handleDateRangeChange,
  };
};