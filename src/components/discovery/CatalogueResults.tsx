import React, { useState, useEffect, useRef } from 'react';
import { SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CategoryId,
  BaseProgramme,
  RoleBasedProgramme,
  PeopleProcessProgramme,
  ToolsTechProgramme,
} from '../../types';
import { ActiveFilterChip, SortOption } from '../../types/filters';
import { ActiveFilterChips } from './ActiveFilterChips';
import { RoleBasedCard } from '../cards/RoleBasedCard';
import { PeopleProcessCard } from '../cards/PeopleProcessCard';
import { ToolsTechnologyCard } from '../cards/ToolsTechnologyCard';
import { motion, AnimatePresence } from 'motion/react';

interface CatalogueResultsProps {
  activeCategoryId: CategoryId;
  programmes: (RoleBasedProgramme | PeopleProcessProgramme | ToolsTechProgramme)[];
  totalCategoryCount: number;
  totalCatalogueCapacity: number;
  activeChips: ActiveFilterChip[];
  searchQuery?: string;
  sortBy?: SortOption;
  onRemoveChip: (groupId: string, value: string) => void;
  onClearFilters: () => void;
  onClearSearch: () => void;
  hasActiveSearch: boolean;
  hasActiveFilters: boolean;
  onViewDetail: (programme: BaseProgramme) => void;
}

const ITEMS_PER_PAGE = 9;

/**
 * Generates an array of page numbers and ellipses.
 * Example outputs:
 * [1, 2, 3, 4, 5, '...', 24]
 * [1, '...', 8, 9, 10, '...', 24]
 * [1, '...', 20, 21, 22, 23, 24]
 */
function getPaginationItems(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near start: pages 1 to 4
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // Near end: pages totalPages - 3 to totalPages
  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Middle pages
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}

const SkeletonCard = () => (
  <div className="flex flex-col border border-[rgba(0,0,255,0.06)] rounded-xl bg-white h-full w-full max-w-sm mx-auto overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/9] bg-[rgba(33,150,243,0.06)]"></div>
    <div className="p-5 flex flex-col flex-1 gap-4">
      <div className="flex items-start justify-between">
        <div className="h-5 w-24 bg-[rgba(33,150,243,0.08)] rounded"></div>
        <div className="h-3 w-16 bg-[rgba(0,0,0,0.04)] rounded mt-1"></div>
      </div>
      <div className="h-6 w-3/4 bg-[rgba(0,0,0,0.06)] rounded"></div>
      <div className="h-10 w-full bg-[rgba(0,0,0,0.03)] rounded mt-2"></div>
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-[rgba(0,0,255,0.04)]">
        <div className="h-4 w-12 bg-[rgba(0,0,0,0.04)] rounded"></div>
        <div className="h-4 w-20 bg-[rgba(0,0,255,0.06)] rounded"></div>
      </div>
    </div>
  </div>
);

export const CatalogueResults: React.FC<CatalogueResultsProps> = ({
  activeCategoryId,
  programmes,
  totalCategoryCount,
  totalCatalogueCapacity,
  activeChips,
  searchQuery,
  sortBy,
  onRemoveChip,
  onClearFilters,
  onClearSearch,
  hasActiveSearch,
  hasActiveFilters,
  onViewDetail,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const resultCount = programmes.length;

  // Reset to page 1 whenever filters, category, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryId, activeChips, searchQuery, sortBy, programmes]);

  useEffect(() => {
    setIsSimulatingLoad(true);
    const timer = setTimeout(() => {
      setIsSimulatingLoad(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [activeChips, activeCategoryId, searchQuery, sortBy]);

  const totalPages = Math.ceil(resultCount / ITEMS_PER_PAGE);
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const visibleProgrammes = programmes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const startDisplay = startIndex + 1;
  const endDisplay = Math.min(startIndex + ITEMS_PER_PAGE, resultCount);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === validCurrentPage) return;
    setCurrentPage(newPage);

    // Smooth-scroll back to the beginning of the programme results area
    const target = document.getElementById('catalogue-results-container') || document.getElementById('programme-catalogue-section');
    if (target) {
      const yOffset = -70; // offset for sticky header
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 min-w-0" id="catalogue-results-container">
      {/* Active Filter Chips */}
      <ActiveFilterChips
        chips={activeChips}
        onRemoveChip={onRemoveChip}
        onClearAll={onClearFilters}
      />

      {/* Result Count Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 mb-6 border-b border-[rgba(0,0,255,0.12)]">
        <div>
          <h2 className="text-base font-bold text-[#000000] tracking-tight">
            {isSimulatingLoad ? 'Updating...' : (resultCount === 1 ? '1 programme found' : `${resultCount.toLocaleString()} programmes found`)}
          </h2>
          <p className="text-xs text-[rgba(0,0,0,0.62)] mt-0.5">
            {resultCount === 0 ? (
              'Showing 0 programmes'
            ) : resultCount === 1 ? (
              `Showing 1 of 1 programme · ${totalCatalogueCapacity.toLocaleString()}+ total catalogue capacity`
            ) : (
              `Showing ${startDisplay}–${endDisplay} of ${resultCount.toLocaleString()} programmes · ${totalCatalogueCapacity.toLocaleString()}+ total catalogue capacity`
            )}
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      <AnimatePresence mode="wait">
        {isSimulatingLoad ? (
          <motion.div
            key="skeleton-loader"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </motion.div>
        ) : resultCount > 0 ? (
          <div ref={gridContainerRef} className="flex flex-col">
            <motion.div
              key={`${activeCategoryId}-page-${validCurrentPage}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {activeCategoryId === 'role-based' &&
                (visibleProgrammes as RoleBasedProgramme[]).map((prog) => (
                  <RoleBasedCard
                    key={prog.id}
                    programme={prog}
                    onViewDetail={() => onViewDetail(prog)}
                  />
                ))}

              {activeCategoryId === 'people-process' &&
                (visibleProgrammes as PeopleProcessProgramme[]).map((prog) => (
                  <PeopleProcessCard
                    key={prog.id}
                    programme={prog}
                    onViewDetail={() => onViewDetail(prog)}
                  />
                ))}

              {activeCategoryId === 'tools-technology' &&
                (visibleProgrammes as ToolsTechProgramme[]).map((prog) => (
                  <ToolsTechnologyCard
                    key={prog.id}
                    programme={prog}
                    onViewDetail={() => onViewDetail(prog)}
                  />
                ))}
            </motion.div>

            {/* Pagination Controls - Placed directly below the 9th card */}
            {totalPages > 1 && (
              <nav
                id="catalogue-pagination"
                aria-label="Catalogue pagination"
                className="mt-6 sm:mt-8 flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap"
              >
                {/* Previous Button */}
                <button
                  type="button"
                  id="pagination-prev-btn"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  aria-label="Previous page"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border transition-all duration-150 ${
                    validCurrentPage === 1
                      ? 'border-[#D9E2F1] text-[#9CA3AF] opacity-40 cursor-not-allowed'
                      : 'bg-white text-[#1F2937] border-[#D9E2F1] hover:bg-[#EFF6FF] hover:border-[#93C5FD] hover:text-[#1D4ED8] shadow-xs cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>

                {/* Page Numbers */}
                {getPaginationItems(validCurrentPage, totalPages).map((item, idx) => {
                  if (item === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-8 h-9 sm:w-9 sm:h-10 flex items-center justify-center text-[#6B7280] text-sm select-none font-medium"
                        aria-hidden="true"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNum = Number(item);
                  const isActive = pageNum === validCurrentPage;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      id={`pagination-page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center ${
                        isActive
                          ? 'bg-[#1D4ED8] text-white border border-[#1D4ED8] font-semibold shadow-xs'
                          : 'bg-white text-[#1F2937] border border-[#D9E2F1] hover:bg-[#EFF6FF] hover:border-[#93C5FD] hover:text-[#1D4ED8] shadow-xs cursor-pointer'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  id="pagination-next-btn"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  aria-label="Next page"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border transition-all duration-150 ${
                    validCurrentPage === totalPages
                      ? 'border-[#D9E2F1] text-[#9CA3AF] opacity-40 cursor-not-allowed'
                      : 'bg-white text-[#1F2937] border-[#D9E2F1] hover:bg-[#EFF6FF] hover:border-[#93C5FD] hover:text-[#1D4ED8] shadow-xs cursor-pointer'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        ) : (
          /* NO RESULTS STATE */
          <motion.div
            key="empty-results-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[rgba(33,150,243,0.03)] border border-dashed border-[rgba(0,0,255,0.18)] rounded-xl my-4"
          >
            <div className="w-14 h-14 rounded-full bg-[rgba(33,150,243,0.08)] flex items-center justify-center text-[#0000FF] mb-4">
              <SearchX className="w-7 h-7" aria-hidden="true" />
            </div>

            <h3 className="text-lg font-bold text-[#000000] mb-1">
              No programmes found
            </h3>

            <p className="text-sm text-[rgba(0,0,0,0.65)] max-w-md mb-6">
              Try adjusting your search or removing some filters.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {hasActiveSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-[rgba(0,0,255,0.2)] text-[#0000FF] hover:bg-[rgba(33,150,243,0.06)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
                >
                  Clear Search
                </button>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0000FF] text-white hover:opacity-90 active:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
                >
                  Clear Filters
                </button>
              )}

              {!hasActiveSearch && !hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    onClearSearch();
                    onClearFilters();
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0000FF] text-white hover:opacity-90 active:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
                >
                  Reset Discovery
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
