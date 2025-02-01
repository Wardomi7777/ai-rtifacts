import { TimelineArtifact } from '../../../../types/artifacts';

export function validateTimelineArtifact(data: TimelineArtifact): void {
  // Validate required type field
  if (data.type !== 'timeline') {
    throw new Error('Artifact type must be "timeline"');
  }

  // Validate required title
  if (!data.title) {
    throw new Error('Timeline must have a title');
  }

  // Validate events array
  if (!Array.isArray(data.events)) {
    throw new Error('Timeline events must be an array');
  }
  if (data.events.length === 0) {
    throw new Error('Timeline must have at least one event');
  }

  // Validate each event
  const eventIds = new Set<string>();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  data.events.forEach((event, index) => {
    if (!event.id) {
      throw new Error(`Event at index ${index} must have an id`);
    }
    if (eventIds.has(event.id)) {
      throw new Error(`Duplicate event id: ${event.id}`);
    }
    eventIds.add(event.id);

    if (!event.title) {
      throw new Error(`Event at index ${index} must have a title`);
    }

    if (!event.date) {
      throw new Error(`Event at index ${index} must have a date`);
    }

    if (!dateRegex.test(event.date)) {
      throw new Error(`Event at index ${index} must have a date in YYYY-MM-DD format`);
    }

    // Validate color if present
    if (event.color) {
      const validColors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];
      if (!validColors.includes(event.color)) {
        throw new Error(`Invalid color "${event.color}" for event at index ${index}`);
      }
    }
  });

  // Validate metadata if present
  if (data.metadata) {
    const validateDate = (date: string | undefined, fieldName: string) => {
      if (date && !dateRegex.test(date)) {
        throw new Error(`${fieldName} must be in YYYY-MM-DD format`);
      }
    };

    validateDate(data.metadata.startDate, 'startDate');
    validateDate(data.metadata.endDate, 'endDate');
    validateDate(data.metadata.lastUpdated, 'lastUpdated');

    if (data.metadata.categories && !Array.isArray(data.metadata.categories)) {
      throw new Error('Categories must be an array');
    }
  }
}