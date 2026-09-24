import React from 'react';
import { FeaturedArticle } from './FeaturedArticle';
import { FeaturedPostsPanel } from './FeaturedPostsPanel';

export const EditorsPicksSection: React.FC = () => (
  <section className="editors-picks" aria-labelledby="editors-picks-title">
    <div className="insights-shell">
      <h2 id="editors-picks-title">Editor&apos;s Picks</h2>
      <div className="editors-picks__grid">
        <FeaturedArticle />
        <FeaturedPostsPanel />
      </div>
    </div>
  </section>
);
