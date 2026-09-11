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
}

export const CatalogueToolbar: React.FC<CatalogueToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  sortBy,
  onSortChange,
  activeFilterCount,
  onOpenMobileFilters,
}) => {
  return (
    <div id="catalogue-toolbar-controls" className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        {/* Search Bar takes most of available width */}
        <div className="flex-1">
          <CatalogueSearch
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
          />
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2 sm:shrink-0">
          {/* Mobile Filter Toggle (hidden on desktop lg:hidden) */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            aria-label={`Open filter panel, ${activeFilterCount} filters currently active`}
            className="lg:hidden h-[46px] flex items-center justify-center gap-2 px-4 bg-white text-[#000000] border border-[rgba(0,0,255,0.18)] hover:border-[#0000FF]/30 rounded-lg font-medium text-sm hover:bg-[rgba(33,150,243,0.06)] transition-all focus:outline-none focus:border-[#0000FF]/30 focus:ring-3 focus:ring-[rgba(33,150,243,0.14)] cursor-pointer"
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
