import React from 'react';
import { Link } from 'react-router-dom';
import type { FeaturedPost } from '../../data/insightsData';
import { ArticleImage } from './ArticleImage';

interface FeaturedMiniCardProps {
  post: FeaturedPost;
  index: number;
  interactive?: boolean;
}

export const FeaturedMiniCard: React.FC<FeaturedMiniCardProps> = ({ post, index, interactive = true }) => (
  <Link
    className="featured-mini-card"
    to={post.url}
    tabIndex={interactive ? undefined : -1}
    style={{ '--featured-card-index': index } as React.CSSProperties}
  >
    <div className="featured-mini-card__image-frame">
      <ArticleImage image={post.image} alt={post.title} className="featured-mini-card__image" />
    </div>

    <div className="featured-mini-card__content">
      <h3>{post.title}</h3>
      <div className="featured-mini-card__meta">
        <span>{post.category} · {post.date}</span>
        <span className="featured-mini-card__cta">
          Read article <span aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  </Link>
);
