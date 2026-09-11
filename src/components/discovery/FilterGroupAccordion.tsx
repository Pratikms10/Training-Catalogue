import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FilterGroupConfig } from '../../types/filters';
import { motion, AnimatePresence } from 'motion/react';

interface FilterGroupAccordionProps {
  group: FilterGroupConfig;
  selectedValues: string[];
  onToggleValue: (groupId: string, value: string) => void;
  defaultExpanded?: boolean;
}

export const FilterGroupAccordion: React.FC<FilterGroupAccordionProps> = ({
  group,
  selectedValues,
  onToggleValue,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [isShowingAll, setIsShowingAll] = useState<boolean>(false);

  const initialCount = group.initialVisibleCount || group.options.length;
  const hasMore = group.options.length > initialCount;
  const visibleOptions = isShowingAll ? group.options : group.options.slice(0, initialCount);

  return (
    <div className="border-b border-[rgba(0,0,255,0.08)] py-4 last:border-b-0">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between text-left py-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] rounded"
      >
        <span className="font-semibold text-sm tracking-wide text-[#000000] group-hover:text-[#0000FF]/70/70 transition-colors">
          {group.title}
        </span>
        <span className="text-[#0000FF] transition-transform duration-200">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </span>
      </button>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="mt-3 space-y-1.5" role="group" aria-label={group.title}>
          {visibleOptions.map((opt) => {
            const isChecked = selectedValues.includes(opt.id);
            const inputId = `filter-${group.id}-${opt.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

            return (
              <label
                key={opt.id}
                htmlFor={inputId}
                className={`relative flex items-start gap-2.5 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors select-none group
                  ${isChecked 
                    ? 'text-[#0000FF] bg-[rgba(33,150,243,0.08)] font-medium' 
                    : 'text-[rgba(0,0,0,0.82)] hover:bg-[rgba(33,150,243,0.04)]'}
                `}
              >
                {/* Hidden Native Input for Accessibility/State */}
                <input
                  type="checkbox"
                  id={inputId}
                  checked={isChecked}
                  onChange={() => onToggleValue(group.id, opt.id)}
                  className="sr-only"
                />
                
                {/* Custom Animated Checkbox */}
                <div 
                  className={`mt-0.5 relative flex items-center justify-center w-4 h-4 rounded shrink-0 transition-colors duration-200 border
                    ${isChecked 
                      ? 'bg-[#0000FF] border-[#0000FF]' 
                      : 'bg-white border-[rgba(0,0,255,0.25)] group-hover:border-[#0000FF]/30'
                    }
                  `}
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        width="10"
                        height="8"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
                          d="M1 4.5L4.5 8L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>

                <span className="leading-tight pt-[1px] relative z-10">
                  {opt.label}
                </span>
              </label>
            );
          })}

          {/* Show More / Show Less Toggle */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setIsShowingAll(!isShowingAll)}
              className="mt-2 text-xs font-semibold text-[#0000FF] hover:underline px-2 py-1 flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#0000FF] rounded"
            >
              {isShowingAll ? (
                <>
                  <span>Show Less</span>
                  <span aria-hidden="true">↑</span>
                </>
              ) : (
                <>
                  <span>Show More ({group.options.length - initialCount} more)</span>
                  <span aria-hidden="true">↓</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
