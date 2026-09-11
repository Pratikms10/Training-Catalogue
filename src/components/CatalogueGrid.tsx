import React, { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { CategoryId, BaseProgramme } from '../types';
import {
  roleBasedProgrammes,
  peopleProcessProgrammes,
  toolsTechnologyProgrammes,
} from '../data/actualProgrammes';
import {
  SortOption,
  RoleBasedFilterState,
  ToolsTechnologyFilterState,
  PeopleProcessFilterState,
} from '../types/filters';
import {
  filterRoleBasedProgrammes,
  filterToolsTechnologyProgrammes,
  filterPeopleProcessProgrammes,
  getRoleBasedActiveChips,
  getToolsTechnologyActiveChips,
  getPeopleProcessActiveChips,
} from '../utils/catalogueFiltering';
import { CatalogueToolbar } from './discovery/CatalogueToolbar';
import { DynamicFilterPanel } from './discovery/DynamicFilterPanel';
import { CatalogueResults } from './discovery/CatalogueResults';

interface Props {
  activeCategoryId: CategoryId;
  onViewDetail: (programme: BaseProgramme) => void;
}

const INITIAL_RB_FILTERS: RoleBasedFilterState = {
  industries: [],
  departments: [],
  durations: [],
};

const INITIAL_TT_FILTERS: ToolsTechnologyFilterState = {
  technologies: [],
  toolCategories: [],
  durations: [],
};

const INITIAL_PP_FILTERS: PeopleProcessFilterState = {
  categories: [],
  portfolios: [],
  durations: [],
};

export const CatalogueGrid: React.FC<Props> = ({ activeCategoryId, onViewDetail }) => {
  // Discovery State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<SortOption>('Recommended');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Category-Specific Filter States
  const [roleBasedFilters, setRoleBasedFilters] = useState<RoleBasedFilterState>(INITIAL_RB_FILTERS);
  const [toolsTechFilters, setToolsTechFilters] = useState<ToolsTechnologyFilterState>(INITIAL_TT_FILTERS);
  const [peopleProcessFilters, setPeopleProcessFilters] = useState<PeopleProcessFilterState>(INITIAL_PP_FILTERS);

  // Requirement 20 & 21: Reset filters, search query, and sort on category change
  useEffect(() => {
    setSearchQuery('');
    setSortBy('Recommended');
    setRoleBasedFilters(INITIAL_RB_FILTERS);
    setToolsTechFilters(INITIAL_TT_FILTERS);
    setPeopleProcessFilters(INITIAL_PP_FILTERS);
    setIsMobileFiltersOpen(false);
  }, [activeCategoryId]);

  // Handle filter toggles dynamically by group ID
  const handleToggleFilter = (groupId: string, value: string) => {
    if (activeCategoryId === 'role-based') {
      setRoleBasedFilters((prev) => {
        if (groupId === 'industry') {
          const exists = prev.industries.includes(value);
          return {
            ...prev,
            industries: exists ? prev.industries.filter((v) => v !== value) : [...prev.industries, value],
          };
        }
        if (groupId === 'department') {
          const exists = prev.departments.includes(value);
          return {
            ...prev,
            departments: exists ? prev.departments.filter((v) => v !== value) : [...prev.departments, value],
          };
        }
        if (groupId === 'duration') {
          const exists = prev.durations.includes(value);
          return {
            ...prev,
            durations: exists ? prev.durations.filter((v) => v !== value) : [...prev.durations, value],
          };
        }
        return prev;
      });
    } else if (activeCategoryId === 'tools-technology') {
      setToolsTechFilters((prev) => {
        if (groupId === 'technology') {
          const exists = prev.technologies.includes(value);
          return {
            ...prev,
            technologies: exists ? prev.technologies.filter((v) => v !== value) : [...prev.technologies, value],
          };
        }
        if (groupId === 'toolCategory') {
          const exists = prev.toolCategories.includes(value);
          return {
            ...prev,
            toolCategories: exists ? prev.toolCategories.filter((v) => v !== value) : [...prev.toolCategories, value],
          };
        }
        if (groupId === 'duration') {
          const exists = prev.durations.includes(value);
          return {
            ...prev,
            durations: exists ? prev.durations.filter((v) => v !== value) : [...prev.durations, value],
          };
        }
        return prev;
      });
    } else if (activeCategoryId === 'people-process') {
      setPeopleProcessFilters((prev) => {
        if (groupId === 'category') {
          const exists = prev.categories.includes(value);
          return {
            ...prev,
            categories: exists ? prev.categories.filter((v) => v !== value) : [...prev.categories, value],
          };
        }
        if (groupId === 'portfolio') {
          const exists = prev.portfolios.includes(value);
          return {
            ...prev,
            portfolios: exists ? prev.portfolios.filter((v) => v !== value) : [...prev.portfolios, value],
          };
        }
        if (groupId === 'duration') {
          const exists = prev.durations.includes(value);
          return {
            ...prev,
            durations: exists ? prev.durations.filter((v) => v !== value) : [...prev.durations, value],
          };
        }
        return prev;
      });
    }
  };

  // Clear filters for the current category
  const handleClearCategoryFilters = () => {
    if (activeCategoryId === 'role-based') {
      setRoleBasedFilters(INITIAL_RB_FILTERS);
    } else if (activeCategoryId === 'tools-technology') {
      setToolsTechFilters(INITIAL_TT_FILTERS);
    } else if (activeCategoryId === 'people-process') {
      setPeopleProcessFilters(INITIAL_PP_FILTERS);
    }
  };

  // Remove individual chip
  const handleRemoveChip = (groupId: string, value: string) => {
    handleToggleFilter(groupId, value);
  };

  // Selected filters map for accordion checkboxes
  const selectedFiltersMap: { [groupId: string]: string[] } = useMemo(() => {
    if (activeCategoryId === 'role-based') {
      return {
        industry: roleBasedFilters.industries,
        department: roleBasedFilters.departments,
        duration: roleBasedFilters.durations,
      };
    }
    if (activeCategoryId === 'tools-technology') {
      return {
        technology: toolsTechFilters.technologies,
        toolCategory: toolsTechFilters.toolCategories,
        duration: toolsTechFilters.durations,
      };
    }
    if (activeCategoryId === 'people-process') {
      return {
        category: peopleProcessFilters.categories,
        portfolio: peopleProcessFilters.portfolios,
        duration: peopleProcessFilters.durations,
      };
    }
    return {};
  }, [activeCategoryId, roleBasedFilters, toolsTechFilters, peopleProcessFilters]);

  // Active filter chips
  const activeChips = useMemo(() => {
    if (activeCategoryId === 'role-based') {
      return getRoleBasedActiveChips(roleBasedFilters);
    }
    if (activeCategoryId === 'tools-technology') {
      return getToolsTechnologyActiveChips(toolsTechFilters);
    }
    if (activeCategoryId === 'people-process') {
      return getPeopleProcessActiveChips(peopleProcessFilters);
    }
    return [];
  }, [activeCategoryId, roleBasedFilters, toolsTechFilters, peopleProcessFilters]);

  // Filtered programme results based on active category, search, filters and sort
  const filteredProgrammes = useMemo(() => {
    if (activeCategoryId === 'role-based') {
      return filterRoleBasedProgrammes(roleBasedProgrammes, debouncedSearchQuery, roleBasedFilters, sortBy);
    }
    if (activeCategoryId === 'tools-technology') {
      return filterToolsTechnologyProgrammes(toolsTechnologyProgrammes, debouncedSearchQuery, toolsTechFilters, sortBy);
    }
    if (activeCategoryId === 'people-process') {
      return filterPeopleProcessProgrammes(peopleProcessProgrammes, debouncedSearchQuery, peopleProcessFilters, sortBy);
    }
    return [];
  }, [activeCategoryId, debouncedSearchQuery, sortBy, roleBasedFilters, toolsTechFilters, peopleProcessFilters]);

  // Category Total Metadata
  const totalCategoryCount = useMemo(() => {
    if (activeCategoryId === 'role-based') return roleBasedProgrammes.length;
    if (activeCategoryId === 'tools-technology') return toolsTechnologyProgrammes.length;
    if (activeCategoryId === 'people-process') return peopleProcessProgrammes.length;
    return 0;
  }, [activeCategoryId]);

  const totalCatalogueCapacity = useMemo(() => {
    if (activeCategoryId === 'role-based') return 3000;
    if (activeCategoryId === 'tools-technology') return 400;
    if (activeCategoryId === 'people-process') return 100;
    return 0;
  }, [activeCategoryId]);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasActiveFilters = activeChips.length > 0;

  return (
    <section
      id="programme-catalogue-section"
      className="w-full bg-white shrink-0 flex-grow"
      aria-label="Programme catalogue discovery"
    >
      {/* CONSTANT STICKY SEARCH & DISCOVERY BAR AT TOP OF CATALOGUE */}
      <div 
        id="sticky-catalogue-search-bar-wrapper" 
        className="sticky top-[64px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-[rgba(0,0,255,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] px-4 sm:px-8 lg:px-10 py-3 sm:py-3.5 transition-all"
      >
        <div className="max-w-7xl mx-auto">
          <CatalogueToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchClear={() => setSearchQuery('')}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilterCount={activeChips.length}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        {/* MAIN BODY: Dynamic Filter Sidebar + Catalogue Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          {/* Dynamic Filter Panel (Desktop Sidebar & Mobile Drawer) */}
          <DynamicFilterPanel
            activeCategoryId={activeCategoryId}
            selectedFilters={selectedFiltersMap}
            onToggleFilter={handleToggleFilter}
            onClearAll={handleClearCategoryFilters}
            activeCount={activeChips.length}
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
            totalResultsCount={filteredProgrammes.length}
          />

          {/* Results Column (Active Chips + Result Count + Grid or Empty State) */}
          <CatalogueResults
            activeCategoryId={activeCategoryId}
            programmes={filteredProgrammes}
            totalCategoryCount={totalCategoryCount}
            totalCatalogueCapacity={totalCatalogueCapacity}
            activeChips={activeChips}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onRemoveChip={handleRemoveChip}
            onClearFilters={handleClearCategoryFilters}
            onClearSearch={() => setSearchQuery('')}
            hasActiveSearch={hasActiveSearch}
            hasActiveFilters={hasActiveFilters}
            onViewDetail={onViewDetail}
          />
        </div>
      </div>
    </section>
  );
};
