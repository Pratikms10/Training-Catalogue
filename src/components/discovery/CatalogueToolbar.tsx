import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SortOption } from '../../types/filters';
import { CatalogueSearch } from './CatalogueSearch';
import { CatalogueSort } from './CatalogueSort';

interface CatalogueToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
  resultCount: number;
  categoryLabel: string;
}

export const CatalogueToolbar: React.FC<CatalogueToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  sortBy,
  onSortChange,
  activeFilterCount,
  onOpenMobileFilters,
  resultCount,
  categoryLabel,
}) => {
  return (
    <div
      id="catalogue-toolbar-controls"
      className="w-full rounded-2xl border border-[rgba(0,0,255,0.18)] bg-gradient-to-r from-[rgba(33,150,243,0.08)] via-white to-[rgba(0,0,255,0.04)] p-3 sm:p-4 shadow-[0_8px_28px_rgba(0,0,255,0.10)]"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 w-full">
        <div className="hidden xl:block w-[220px] shrink-0 pl-1">
          <p className="text-base font-extrabold tracking-tight text-[#000000]">Find your programme</p>
          <p className="mt-1 text-xs leading-relaxed text-[rgba(0,0,0,0.62)]">
            {resultCount > 0 ? `${resultCount.toLocaleString()} ${categoryLabel} courses` : `Search the ${categoryLabel} catalogue`}
          </p>
        </div>

        {/* Search Bar takes most of available width */}
        <div className="flex-1">
          <CatalogueSearch
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
          />
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2 lg:shrink-0">
          {/* Mobile Filter Toggle (hidden on desktop lg:hidden) */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            aria-label={`Open filter panel, ${activeFilterCount} filters currently active`}
            className="lg:hidden h-14 sm:h-[60px] flex items-center justify-center gap-2 px-4 bg-white text-[#000000] border-2 border-[rgba(0,0,255,0.22)] hover:border-[#0000FF]/50 rounded-xl font-semibold text-sm hover:bg-[rgba(33,150,243,0.06)] transition-all focus:outline-none focus:border-[#0000FF]/50 focus:ring-3 focus:ring-[rgba(33,150,243,0.14)] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#0000FF]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold bg-[#0000FF] text-white rounded-full min-w-[18px]">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <CatalogueSort value={sortBy} onChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
