import { CategoryId } from '../types';

export type SortOption =
  | 'Recommended'
  | 'A–Z'
  | 'Popular'
  | 'Trending'
  | 'Awareness'
  | 'Basic'
  | 'Intermediate'
  | 'Advanced';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroupConfig {
  id: string;
  title: string;
  options: FilterOption[];
  initialVisibleCount?: number; // e.g. 6 for Department
  allowMultiple?: boolean;
}

export interface CategoryFilterConfig {
  categoryId: CategoryId;
  groups: FilterGroupConfig[];
}

export interface RoleBasedFilterState {
  industries: string[];
  departments: string[];
  durations: string[];
}

export interface ToolsTechnologyFilterState {
  technologies: string[];
  toolCategories: string[];
  durations: string[];
}

export interface PeopleProcessFilterState {
  categories: string[];
  portfolios: string[];
  durations: string[];
}

export interface CertificationFilterState {
  providers: string[];
  productTechnologies: string[];
  durations: string[];
}

export type CategoryFilterState =
  | { type: 'role-based'; state: RoleBasedFilterState }
  | { type: 'ai-tools'; state: ToolsTechnologyFilterState }
  | { type: 'certifications'; state: CertificationFilterState }
  | { type: 'process-based'; state: PeopleProcessFilterState }
  | { type: 'people-behavioural'; state: PeopleProcessFilterState };

export interface ActiveFilterChip {
  groupId: string;
  groupTitle: string;
  value: string;
  label: string;
}
