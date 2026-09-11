import { AnyProgramme, ToolsTechProgramme } from '../types';
import { FilterGroupConfig, SortOption, ToolsTechnologyFilterState } from '../types/filters';

export const CATALOGUE_PAGE_SIZE = 9;

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface CourseListResponse {
  data: ToolsTechProgramme[];
  pagination: Pagination;
}

interface FilterGroupsResponse {
  groups: FilterGroupConfig[];
}

interface CourseDetailResponse {
  data: AnyProgramme;
}

interface ToolsCourseQuery {
  query: string;
  filters: ToolsTechnologyFilterState;
  sort: SortOption;
  page: number;
  signal?: AbortSignal;
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Catalogue request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

function durationToMinutes(duration: string): number | null {
  const hours = Number.parseFloat(duration);
  return Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : null;
}

export function fetchToolsProgrammes({ query, filters, sort, page, signal }: ToolsCourseQuery) {
  const params = new URLSearchParams({
    category: 'tools-technology',
    page: String(page),
    pageSize: String(CATALOGUE_PAGE_SIZE),
  });

  if (query.trim()) params.set('q', query.trim());
  filters.technologies.forEach((value) => params.append('tool', value));
  filters.toolCategories.forEach((value) => params.append('technologyCategory', value));
  filters.durations.forEach((value) => {
    const minutes = durationToMinutes(value);
    if (minutes) params.append('durationMinutes', String(minutes));
  });

  if (['Awareness', 'Basic', 'Intermediate', 'Advanced'].includes(sort)) {
    params.set('level', sort);
  } else {
    params.set('sort', sort);
  }

  return requestJson<CourseListResponse>(`/api/courses?${params}`, signal);
}

export async function fetchToolsFilterGroups(signal?: AbortSignal) {
  const response = await requestJson<FilterGroupsResponse>(
    '/api/catalogue/filters?category=tools-technology',
    signal,
  );
  return response.groups;
}

export async function fetchCourseById(courseId: string, signal?: AbortSignal) {
  const response = await requestJson<CourseDetailResponse>(
    `/api/courses/${encodeURIComponent(courseId)}`,
    signal,
  );
  return response.data;
}
