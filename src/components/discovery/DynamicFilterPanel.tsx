import React, { useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CategoryId } from '../../types';
import {
  ROLE_BASED_FILTER_GROUPS,
  TOOLS_TECHNOLOGY_FILTER_GROUPS,
  PROCESS_BASED_FILTER_GROUPS,
  PEOPLE_BEHAVIOURAL_FILTER_GROUPS,
  CERTIFICATION_FILTER_GROUPS,
} from '../../data/filterConfig';
import { FilterGroupConfig } from '../../types/filters';
import { FilterGroupAccordion } from './FilterGroupAccordion';
import { motion, AnimatePresence } from 'motion/react';

interface DynamicFilterPanelProps {
  activeCategoryId: CategoryId;
  selectedFilters: { [groupId: string]: string[] };
  onToggleFilter: (groupId: string, value: string) => void;
  onClearAll: () => void;
  activeCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  totalResultsCount: number;
  groupsOverride?: FilterGroupConfig[];
}

export const DynamicFilterPanel: React.FC<DynamicFilterPanelProps> = ({
  activeCategoryId,
  selectedFilters,
  onToggleFilter,
  onClearAll,
  activeCount,
  isMobileOpen,
  onCloseMobile,
  totalResultsCount,
  groupsOverride,
}) => {
  // Select the appropriate filter groups according to active category
  const currentGroups = groupsOverride || (() => {
    switch (activeCategoryId) {
      case 'role-based':
        return ROLE_BASED_FILTER_GROUPS;
      case 'ai-tools':
      case 'tools-technology':
        return TOOLS_TECHNOLOGY_FILTER_GROUPS;
      case 'process-based':
        return PROCESS_BASED_FILTER_GROUPS;
      case 'people-behavioural':
        return PEOPLE_BEHAVIOURAL_FILTER_GROUPS;
      case 'certifications':
        return CERTIFICATION_FILTER_GROUPS;
      default:
        return [];
    }
  })();

  // Handle ESC key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const renderFilterContent = () => (
    <div className="divide-y divide-[rgba(0,0,255,0.08)] pb-24">
      {currentGroups.map((group) => (
        <FilterGroupAccordion
          key={group.id}
          group={group}
          selectedValues={selectedFilters[group.id] || []}
          onToggleValue={onToggleFilter}
          defaultExpanded={true}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (hidden on mobile/tablet below lg breakpoint) */}
      <aside
        id="desktop-filter-sidebar"
        className="hidden lg:block w-64 xl:w-72 shrink-0 pr-6 border-r border-[rgba(0,0,255,0.1)] relative"
        aria-label="Filter catalogue programmes"
      >
        <div className="sticky top-[136px]">
          {/* Header with Title and Clear All */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(0,0,255,0.12)]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0000FF]" aria-hidden="true" />
              <h2 className="font-bold text-base text-[#000000] tracking-tight uppercase">
                Filters
              </h2>
            </div>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-[#0000FF] hover:underline flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#0000FF] rounded"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Render Dynamic Groups */}
          <div className="pb-4">
             {renderFilterContent()}
          </div>
        </div>
      </aside>

      {/* MOBILE / TABLET SLIDE-OVER DRAWER */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filter options"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,0,255,0.12)] bg-white shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#0000FF]" />
                <h2 className="font-bold text-base text-[#000000]">
                  Filters {activeCount > 0 && `(${activeCount})`}
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters drawer"
                className="p-1.5 rounded-md text-[rgba(0,0,0,0.6)] hover:text-[#000000] hover:bg-[rgba(33,150,243,0.08)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {renderFilterContent()}
            </div>

            {/* Drawer Footer (Clear All & Show Results) */}
            <div className="p-4 border-t border-[rgba(0,0,255,0.12)] bg-white shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={onClearAll}
                disabled={activeCount === 0}
                className="flex-1 py-3 px-4 rounded-lg border border-[rgba(0,0,255,0.2)] text-sm font-semibold text-[#000000] hover:bg-[rgba(33,150,243,0.06)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-3 px-4 rounded-lg bg-[#0000FF] text-white text-sm font-semibold hover:opacity-90 active:opacity-100 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
              >
                Show Results ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
