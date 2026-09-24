import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/filters';

interface CatalogueSortProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  id?: string;
}

interface SortItem {
  value: SortOption;
  label: string;
  group?: 'general' | 'level';
}

const SORT_OPTIONS: SortItem[] = [
  { value: 'Recommended', label: 'Recommended', group: 'general' },
  { value: 'A–Z', label: 'A–Z (Alphabetical)', group: 'general' },
  { value: 'Popular', label: 'Popular', group: 'general' },
  { value: 'Trending', label: 'Trending', group: 'general' },
  { value: 'Awareness', label: 'Awareness Level', group: 'level' },
  { value: 'Basic', label: 'Basic Level', group: 'level' },
  { value: 'Intermediate', label: 'Intermediate Level', group: 'level' },
  { value: 'Advanced', label: 'Advanced Level', group: 'level' },
];

export const CatalogueSort: React.FC<CatalogueSortProps> = ({
  value,
  onChange,
  id = 'catalogue-sort-control',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  const handleSelect = (sortValue: SortOption) => {
    onChange(sortValue);
    setIsOpen(false);
  };

  const generalOptions = SORT_OPTIONS.filter((opt) => opt.group === 'general');
  const levelOptions = SORT_OPTIONS.filter((opt) => opt.group === 'level');

  return (
    <div ref={containerRef} className="relative inline-block w-full sm:w-auto shrink-0">
      {/* Industry Standard Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Sort options: currently sorted by ${selectedOption.label}`}
        className="w-full sm:w-auto h-14 sm:h-[60px] flex items-center justify-between gap-3 px-4 bg-white text-sm font-medium border-2 border-[rgba(0,0,255,0.18)] hover:border-[#0000FF]/40 rounded-xl shadow-2xs transition-all focus:outline-none focus:border-[#0000FF]/40 focus:ring-3 focus:ring-[rgba(33,150,243,0.14)] cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-left">
          <ArrowUpDown className="w-4 h-4 text-[#0000FF] shrink-0" aria-hidden="true" />
          <span className="text-[rgba(0,0,0,0.52)] font-normal text-xs sm:text-sm">Sort by:</span>
          <span className="text-[#000000] font-semibold text-xs sm:text-sm truncate max-w-[140px] sm:max-w-[160px]">
            {value}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#0000FF] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Custom Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute right-0 mt-1.5 w-full sm:w-64 bg-white border border-[rgba(0,0,255,0.15)] rounded-xl shadow-xl shadow-slate-900/10 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150 focus:outline-none"
        >
          {/* General Sort Options */}
          <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[rgba(0,0,0,0.45)]">
            Sort Order
          </div>
          {generalOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[rgba(33,150,243,0.08)] text-[#0000FF] font-semibold'
                    : 'text-[#000000] hover:bg-[rgba(33,150,243,0.05)] hover:text-[#0000FF]/70'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#0000FF] shrink-0" />}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-1.5 border-t border-[rgba(0,0,255,0.08)]" />

          {/* Level Filter Options */}
          <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[rgba(0,0,0,0.45)]">
            Filter by Level
          </div>
          {levelOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[rgba(33,150,243,0.08)] text-[#0000FF] font-semibold'
                    : 'text-[#000000] hover:bg-[rgba(33,150,243,0.05)] hover:text-[#0000FF]/70'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#0000FF] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
