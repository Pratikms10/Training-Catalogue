import React, { useRef } from 'react';
import type { FeaturedCategory } from '../../data/insightsData';

interface CategoryToggleGroupProps {
  categories: readonly FeaturedCategory[];
  activeCategory: FeaturedCategory;
  disabled: boolean;
  onChange: (category: FeaturedCategory) => void;
}

export const CategoryToggleGroup: React.FC<CategoryToggleGroupProps> = ({
  categories,
  activeCategory,
  disabled,
  onChange,
}) => {
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (currentIndex: number, nextIndex: number) => {
    const category = categories[nextIndex];
    if (!category) return;
    onChange(category);
    window.requestAnimationFrame(() => tabsRef.current[nextIndex]?.focus());
  };

  return (
    <div className="featured-category-tabs" role="tablist" aria-label="Featured post categories">
      {categories.map((category, index) => (
        <button
          key={category}
          ref={(element) => { tabsRef.current[index] = element; }}
          id={`featured-tab-${category.toLowerCase()}`}
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          aria-disabled={disabled}
          aria-controls="featured-posts-panel"
          tabIndex={activeCategory === category ? 0 : -1}
          onClick={() => {
            if (!disabled) onChange(category);
          }}
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              moveFocus(index, (index + 1) % categories.length);
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault();
              moveFocus(index, (index - 1 + categories.length) % categories.length);
            } else if (event.key === 'Home') {
              event.preventDefault();
              moveFocus(index, 0);
            } else if (event.key === 'End') {
              event.preventDefault();
              moveFocus(index, categories.length - 1);
            }
          }}
          className={activeCategory === category ? 'featured-category-tab is-active' : 'featured-category-tab'}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
