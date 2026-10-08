import React from 'react';
import { Link } from 'react-router-dom';
import { featuredArticle, type InsightArticle } from '../../data/insightsData';
import { ArticleImage } from './ArticleImage';

export const FeaturedArticle: React.FC<{ article?: InsightArticle }> = ({ article = featuredArticle }) => (
  <article className="featured-article">
    <Link className="featured-article__image-link" to={article.url} aria-label={`Read ${article.title}`}>
      <ArticleImage
        image={article.image}
        alt={article.title}
        className="featured-article__image"
      />
    </Link>

    <h3>
      <Link to={article.url}>{article.title}</Link>
    </h3>

    <p className="featured-article__summary">{article.excerpt}</p>

    <div className="featured-article__meta">
      <span>{article.author} · {article.date}</span>
      <Link className="insights-read-link" to={article.url}>
        Read article <span aria-hidden="true">→</span>
      </Link>
    </div>
  </article>
);
