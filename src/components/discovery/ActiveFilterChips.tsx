import React from 'react';
import { X } from 'lucide-react';
import { ActiveFilterChip } from '../../types/filters';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemoveChip: (groupId: string, value: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  chips,
  onRemoveChip,
  onClearAll,
}) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 pt-1" aria-label="Active filters">
      <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.52)] mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={`${chip.groupId}-${chip.value}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.18)] rounded-full text-xs font-medium text-[#000000] transition-colors"
        >
          <span className="text-[rgba(0,0,0,0.52)] font-normal">{chip.groupTitle}:</span>
          <span className="font-semibold">{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemoveChip(chip.groupId, chip.value)}
            aria-label={`Remove filter ${chip.groupTitle}: ${chip.label}`}
            className="ml-0.5 p-0.5 rounded-full hover:bg-[rgba(0,0,255,0.15)] text-[#0000FF] focus:outline-none focus:ring-1 focus:ring-[#0000FF]"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-[#0000FF] hover:underline ml-2 py-1 px-2 rounded focus:outline-none focus:ring-1 focus:ring-[#0000FF]"
      >
        Clear All
      </button>
    </div>
  );
};
