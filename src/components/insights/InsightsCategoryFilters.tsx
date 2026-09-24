import React, { useRef } from 'react';
import type { InsightCategory } from '../../data/insightsData';

export type InsightsFilter = 'All' | InsightCategory;

interface InsightsCategoryFiltersProps {
  categories: readonly InsightsFilter[];
  activeCategory: InsightsFilter;
  disabled: boolean;
  onChange: (category: InsightsFilter) => void;
}

export const InsightsCategoryFilters: React.FC<InsightsCategoryFiltersProps> = ({
  categories,
  activeCategory,
  disabled,
  onChange,
}) => {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const selectCategory = (index: number) => {
    const category = categories[index];
    if (!category || disabled) return;
    onChange(category);
    window.requestAnimationFrame(() => buttonsRef.current[index]?.focus());
  };

  return (
    <div className="latest-insights__filters" role="tablist" aria-label="Filter insights by category">
      {categories.map((category, index) => (
        <button
          key={category}
          ref={(element) => { buttonsRef.current[index] = element; }}
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          aria-disabled={disabled}
          tabIndex={activeCategory === category ? 0 : -1}
          onClick={() => selectCategory(index)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              selectCategory((index + 1) % categories.length);
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault();
              selectCategory((index - 1 + categories.length) % categories.length);
            } else if (event.key === 'Home') {
              event.preventDefault();
              selectCategory(0);
            } else if (event.key === 'End') {
              event.preventDefault();
              selectCategory(categories.length - 1);
            }
          }}
          className={activeCategory === category ? 'latest-insights__filter is-active' : 'latest-insights__filter'}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
