import { RoleBasedProgramme, PeopleProcessProgramme, ToolsTechProgramme } from '../types';
import {
  SortOption,
  RoleBasedFilterState,
  ToolsTechnologyFilterState,
  PeopleProcessFilterState,
  ActiveFilterChip,
} from '../types/filters';

/**
 * Filter and search Role-Based programmes
 */
export function filterRoleBasedProgrammes(
  programmes: RoleBasedProgramme[],
  searchQuery: string,
  filters: RoleBasedFilterState,
  sortBy: SortOption
): RoleBasedProgramme[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = programmes.filter((prog) => {
    // 1. Search Query Check
    if (query) {
      const searchableFields = [
        prog.id,
        prog.title,
        prog.industry,
        prog.department,
        prog.functionName,
        prog.roleTitle,
        prog.level,
        prog.duration,
        ...(prog.relatedSkills || []),
        prog.details?.summary,
        prog.details?.objective,
        ...(prog.details?.toolsCovered || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      // Split query into terms to support multi-word search
      const terms = query.split(/\s+/).filter(Boolean);
      const matchesSearch = terms.every((term) => searchableFields.includes(term));
      if (!matchesSearch) return false;
    }

    // 2. Industry Filter (OR within group)
    if (filters.industries.length > 0) {
      if (!prog.industry || !filters.industries.includes(prog.industry)) {
        return false;
      }
    }

    // 3. Department Filter (OR within group)
    if (filters.departments.length > 0) {
      if (!prog.department || !filters.departments.includes(prog.department)) {
        return false;
      }
    }

    // 4. Duration Filter (OR within group)
    if (filters.durations.length > 0) {
      if (!prog.duration || !filters.durations.includes(prog.duration)) {
        return false;
      }
    }

    // 5. Level Sort/Filter Options (Awareness, Basic, Intermediate, Advanced)
    if (['Awareness', 'Basic', 'Intermediate', 'Advanced'].includes(sortBy)) {
      if (prog.level?.toLowerCase() !== sortBy.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // Apply Ordering
  return applySorting(filtered, sortBy);
}

/**
 * Filter and search Tools & Technology programmes
 */
export function filterToolsTechnologyProgrammes(
  programmes: ToolsTechProgramme[],
  searchQuery: string,
  filters: ToolsTechnologyFilterState,
  sortBy: SortOption
): ToolsTechProgramme[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = programmes.filter((prog) => {
    // 1. Search Query Check
    if (query) {
      const searchableFields = [
        prog.id,
        prog.title,
        prog.toolName,
        prog.vendor,
        prog.skillArea,
        prog.categoryBadge,
        prog.level,
        prog.duration,
        ...(prog.technologyCategory || []),
        prog.details?.summary,
        prog.details?.objective,
        ...(prog.details?.toolsCovered || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const terms = query.split(/\s+/).filter(Boolean);
      const matchesSearch = terms.every((term) => searchableFields.includes(term));
      if (!matchesSearch) return false;
    }

    // 2. Technology Filter (OR within group)
    if (filters.technologies.length > 0) {
      const techMatch = filters.technologies.some((tech) => {
        const lowerTech = tech.toLowerCase();
        return (
          prog.vendor?.toLowerCase().includes(lowerTech) ||
          prog.toolName?.toLowerCase().includes(lowerTech)
        );
      });
      if (!techMatch) return false;
    }

    // 3. Tool / Technology Category Filter (OR within group)
    if (filters.toolCategories.length > 0) {
      const categories = prog.technologyCategory || [];
      const hasMatch = filters.toolCategories.some((cat) =>
        categories.some((c) => c.toLowerCase() === cat.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    // 4. Duration Filter (OR within group)
    if (filters.durations.length > 0) {
      if (!prog.duration || !filters.durations.includes(prog.duration)) {
        return false;
      }
    }

    // 5. Level Sort/Filter Options
    if (['Awareness', 'Basic', 'Intermediate', 'Advanced'].includes(sortBy)) {
      if (prog.level?.toLowerCase() !== sortBy.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  return applySorting(filtered, sortBy);
}

/**
 * Filter and search People & Process programmes
 */
export function filterPeopleProcessProgrammes(
  programmes: PeopleProcessProgramme[],
  searchQuery: string,
  filters: PeopleProcessFilterState,
  sortBy: SortOption
): PeopleProcessProgramme[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = programmes.filter((prog) => {
    // 1. Search Query Check
    if (query) {
      const searchableFields = [
        prog.id,
        prog.title,
        prog.category,
        prog.subType,
        prog.topicCategory,
        prog.portfolio,
        prog.level,
        prog.duration,
        prog.details?.summary,
        prog.details?.objective,
        ...(prog.details?.toolsCovered || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const terms = query.split(/\s+/).filter(Boolean);
      const matchesSearch = terms.every((term) => searchableFields.includes(term));
      if (!matchesSearch) return false;
    }

    // 2. Category Filter (People / Process) (OR within group)
    if (filters.categories.length > 0) {
      const match = filters.categories.some((cat) => {
        return prog.subType?.toLowerCase() === cat.toLowerCase();
      });
      if (!match) return false;
    }

    // 3. Portfolio Filter (OR within group)
    if (filters.portfolios.length > 0) {
      const match = filters.portfolios.some((port) => {
        return (
          prog.portfolio?.toLowerCase() === port.toLowerCase() ||
          prog.topicCategory?.toLowerCase() === port.toLowerCase()
        );
      });
      if (!match) return false;
    }

    // 4. Duration Filter (OR within group)
    if (filters.durations.length > 0) {
      if (!prog.duration || !filters.durations.includes(prog.duration)) {
        return false;
      }
    }

    // 5. Level Sort/Filter Options
    if (['Awareness', 'Basic', 'Intermediate', 'Advanced'].includes(sortBy)) {
      if (prog.level?.toLowerCase() !== sortBy.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  return applySorting(filtered, sortBy);
}

/**
 * Standard sorting helper for all categories
 */
function applySorting<T extends { title: string; id: string }>(
  items: T[],
  sortBy: SortOption
): T[] {
  const result = [...items];

  switch (sortBy) {
    case 'A–Z':
      return result.sort((a, b) => a.title.localeCompare(b.title));
    case 'Popular':
    case 'Trending':
    case 'Recommended':
    default:
      // Return stable default catalogue order supplied by the dataset
      return result;
  }
}

/**
 * Build active filter chips for Role-Based category
 */
export function getRoleBasedActiveChips(filters: RoleBasedFilterState): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  filters.industries.forEach((val) =>
    chips.push({ groupId: 'industry', groupTitle: 'Industry', value: val, label: val })
  );
  filters.departments.forEach((val) =>
    chips.push({ groupId: 'department', groupTitle: 'Department', value: val, label: val })
  );
  filters.durations.forEach((val) =>
    chips.push({ groupId: 'duration', groupTitle: 'Duration', value: val, label: val })
  );
  return chips;
}

/**
 * Build active filter chips for Tools & Technology category
 */
export function getToolsTechnologyActiveChips(
  filters: ToolsTechnologyFilterState
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  filters.technologies.forEach((val) =>
    chips.push({ groupId: 'technology', groupTitle: 'Technology', value: val, label: val })
  );
  filters.toolCategories.forEach((val) =>
    chips.push({ groupId: 'toolCategory', groupTitle: 'Tool', value: val, label: val })
  );
  filters.durations.forEach((val) =>
    chips.push({ groupId: 'duration', groupTitle: 'Duration', value: val, label: val })
  );
  return chips;
}

/**
 * Build active filter chips for People & Process category
 */
export function getPeopleProcessActiveChips(
  filters: PeopleProcessFilterState
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  filters.categories.forEach((val) =>
    chips.push({ groupId: 'category', groupTitle: 'Category', value: val, label: val })
  );
  filters.portfolios.forEach((val) =>
    chips.push({ groupId: 'portfolio', groupTitle: 'Portfolio', value: val, label: val })
  );
  filters.durations.forEach((val) =>
    chips.push({ groupId: 'duration', groupTitle: 'Duration', value: val, label: val })
  );
  return chips;
}
