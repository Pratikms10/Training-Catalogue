import React from 'react';
import { Link } from 'react-router-dom';
import { featuredArticle } from '../../data/insightsData';
import { ArticleImage } from './ArticleImage';

export const FeaturedArticle: React.FC = () => (
  <article className="featured-article">
    <Link className="featured-article__image-link" to={featuredArticle.url} aria-label={`Read ${featuredArticle.title}`}>
      <ArticleImage
        image={featuredArticle.image}
        alt={featuredArticle.title}
        className="featured-article__image"
      />
    </Link>

    <h3>
      <Link to={featuredArticle.url}>{featuredArticle.title}</Link>
    </h3>

    <p className="featured-article__summary">{featuredArticle.summary}</p>

    <div className="featured-article__meta">
      <span>{featuredArticle.author} · {featuredArticle.date}</span>
      <Link className="insights-read-link" to={featuredArticle.url}>
        Read article <span aria-hidden="true">→</span>
      </Link>
    </div>
  </article>
);
