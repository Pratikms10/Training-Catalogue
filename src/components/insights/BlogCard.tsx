import React from 'react';
import { CalendarDays, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightArticle } from '../../data/insightsData';
import { ArticleImage } from './ArticleImage';

interface BlogCardProps {
  article: InsightArticle;
  index: number;
  interactive?: boolean;
}

const categoryClassName = (category: InsightArticle['category']) => (
  category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z]+/g, '-')
);

export const BlogCard: React.FC<BlogCardProps> = ({ article, index, interactive = true }) => (
  <article
    className={`insights-blog-card insights-blog-card--${categoryClassName(article.category)}`}
    style={{ '--blog-card-stagger': Math.min(index, 3) } as React.CSSProperties}
  >
    <Link
      className="insights-blog-card__image-link"
      to={article.url}
      tabIndex={interactive ? undefined : -1}
      aria-label={`Read ${article.title}`}
    >
      <ArticleImage image={article.image} alt={article.title} className="insights-blog-card__image" />
    </Link>

    <div className="insights-blog-card__content">
      <span className="insights-blog-card__category">{article.category}</span>
      <h3>
        <Link to={article.url} tabIndex={interactive ? undefined : -1}>{article.title}</Link>
      </h3>
      <p>{article.excerpt}</p>

      <div className="insights-blog-card__metadata">
        <span><CalendarDays aria-hidden="true" />{article.date}</span>
        <i aria-hidden="true" />
        <span><Clock3 aria-hidden="true" />{article.readTime}</span>
      </div>

      <Link className="insights-blog-card__cta" to={article.url} tabIndex={interactive ? undefined : -1}>
        Read article <span aria-hidden="true">→</span>
      </Link>
    </div>
  </article>
);
