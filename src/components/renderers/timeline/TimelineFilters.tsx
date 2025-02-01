import React from 'react';
import { Filter } from 'lucide-react';

interface TimelineFiltersProps {
  categories: string[];
  activeCategories: Set<string>;
  dateRange: { start: string | null; end: string | null };
  onCategoryToggle: (category: string) => void;
  onDateRangeChange: (range: { start: string | null; end: string | null }) => void;
}

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  categories,
  activeCategories,
  dateRange,
  onCategoryToggle,
  onDateRangeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategories.has(category)
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={dateRange.start || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="px-2 py-1 border rounded text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={dateRange.end || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};