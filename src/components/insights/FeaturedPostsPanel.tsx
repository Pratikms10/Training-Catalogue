import React, { useEffect, useRef, useState } from 'react';
import {
  featuredPostsByCategory,
  type FeaturedCategory,
  type FeaturedPost,
} from '../../data/insightsData';
import { CategoryToggleGroup } from './CategoryToggleGroup';
import { FeaturedMiniCard } from './FeaturedMiniCard';
import { GroupNavigation } from './GroupNavigation';

const categories: readonly FeaturedCategory[] = ['AI', 'Latest', 'Popular'];
const postsPerGroup = 5;

type TransitionDirection = 'forward' | 'backward';

const getGroup = (category: FeaturedCategory, group: number) => (
  featuredPostsByCategory[category].slice(group * postsPerGroup, (group + 1) * postsPerGroup)
);

export const FeaturedPostsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FeaturedCategory>('AI');
  const [activeGroup, setActiveGroup] = useState(0);
  const [direction, setDirection] = useState<TransitionDirection>('forward');
  const [outgoingPosts, setOutgoingPosts] = useState<FeaturedPost[] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const visiblePosts = getGroup(activeCategory, activeGroup);
  const groupCount = Math.ceil(featuredPostsByCategory[activeCategory].length / postsPerGroup);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
  }, []);

  const transitionTo = (
    nextCategory: FeaturedCategory,
    nextGroup: number,
    nextDirection: TransitionDirection,
  ) => {
    if (isAnimating || (nextCategory === activeCategory && nextGroup === activeGroup)) return;

    setOutgoingPosts(visiblePosts);
    setDirection(nextDirection);
    setActiveCategory(nextCategory);
    setActiveGroup(nextGroup);
    setIsAnimating(true);

    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    transitionTimer.current = window.setTimeout(() => {
      setOutgoingPosts(null);
      setIsAnimating(false);
      transitionTimer.current = null;
    }, reducedMotion ? 0 : 560);
  };

  const handleCategoryChange = (category: FeaturedCategory) => {
    if (category === activeCategory) return;
    const currentIndex = categories.indexOf(activeCategory);
    const nextIndex = categories.indexOf(category);
    transitionTo(category, 0, nextIndex > currentIndex ? 'forward' : 'backward');
  };

  return (
    <div className="featured-posts-panel">
      <div className="featured-posts-panel__header">
        <h3>Featured Posts</h3>
        <CategoryToggleGroup
          categories={categories}
          activeCategory={activeCategory}
          disabled={isAnimating}
          onChange={handleCategoryChange}
        />
      </div>

      <div
        id="featured-posts-panel"
        className="featured-posts__stage"
        role="tabpanel"
        aria-labelledby={`featured-tab-${activeCategory.toLowerCase()}`}
        aria-busy={isAnimating}
      >
        <div className={`featured-posts__list${isAnimating ? ` featured-posts__list--incoming-${direction}` : ''}`}>
          {visiblePosts.map((post, index) => (
            <FeaturedMiniCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {outgoingPosts && (
          <div className={`featured-posts__list featured-posts__list--outgoing-${direction}`} aria-hidden="true">
            {outgoingPosts.map((post, index) => (
              <FeaturedMiniCard key={`outgoing-${post.id}`} post={post} index={index} interactive={false} />
            ))}
          </div>
        )}
      </div>

      <GroupNavigation
        canGoBack={activeGroup > 0}
        canGoForward={activeGroup < groupCount - 1}
        disabled={isAnimating}
        onBack={() => transitionTo(activeCategory, activeGroup - 1, 'backward')}
        onForward={() => transitionTo(activeCategory, activeGroup + 1, 'forward')}
      />
    </div>
  );
};
