import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, CalendarDays, Clock3, UserRound } from 'lucide-react';
import { getInsightArticleById } from '../../data/insightsData';
import { getInsightArticleContent } from '../../data/insightArticleContent';
import { ArticleImage } from './ArticleImage';
import { InsightComments } from './InsightComments';
import '../../styles/insights.css';

interface InsightArticlePageProps {
  slug: string;
  onBack: () => void;
}

export const InsightArticlePage: React.FC<InsightArticlePageProps> = ({ slug, onBack }) => {
  const article = useMemo(() => getInsightArticleById(slug), [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const previousTitle = document.title;
    document.title = article
      ? `${article.title} | TechnoEdge Insights`
      : 'Insight not found | TechnoEdge';

    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  if (!article) {
    return (
      <div className="insights-page insight-article-page">
        <section className="insight-article-not-found">
          <p>Insight not found</p>
          <h1>This article is not available.</h1>
          <button type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to Insights</button>
        </section>
      </div>
    );
  }

  const content = getInsightArticleContent(article);

  return (
    <div className="insights-page insight-article-page">
      <header className="insight-article-hero">
        <div className="insights-shell insight-article-hero__inner">
          <button className="insight-article__back" type="button" onClick={onBack}>
            <ArrowLeft aria-hidden="true" /> Back to Insights
          </button>

          <span className="insight-article__category">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="insight-article__summary">{article.excerpt}</p>

          <div className="insight-article__meta" aria-label="Article information">
            <span><UserRound aria-hidden="true" /> TechnoEdge Editorial</span>
            <i aria-hidden="true" />
            <span><CalendarDays aria-hidden="true" /> {article.date}</span>
            <i aria-hidden="true" />
            <span><Clock3 aria-hidden="true" /> {article.readTime}</span>
          </div>
        </div>
      </header>

      <div className="insight-article-main">
        <div className="insights-shell">
          <figure className="insight-article__media">
            <ArticleImage image={article.image} alt={article.title} className="insight-article__image" />
          </figure>

          <div className="insight-article__layout">
            <aside className="insight-article__contents" aria-label="On this page">
              <p>On this page</p>
              <nav>
                {content.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>{section.title}</a>
                ))}
                <a href="#comments">Comments</a>
              </nav>
            </aside>

            <article className="insight-article__body">
              <p className="insight-article__introduction">{content.introduction}</p>

              {content.sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}

              <aside className="insight-article__takeaways" aria-labelledby="key-takeaways-title">
                <p>In summary</p>
                <h2 id="key-takeaways-title">Key takeaways</h2>
                <ul>
                  {content.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
                </ul>
              </aside>

              <p className="insight-article__conclusion">{content.conclusion}</p>

              <InsightComments articleId={article.id} />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
