import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, UserRound } from 'lucide-react';
import { getInsightArticleById } from '../../data/insightsData';
import { ArticleImage } from './ArticleImage';
import { InsightComments } from './InsightComments';
import '../../styles/insights.css';

interface InsightArticlePageProps {
  slug: string;
  onBack: () => void;
}

interface ImportedArticleContent {
  content: string;
  tables: string;
}

type ArticleBlock =
  | { type: 'heading'; level: 2 | 3; id: string; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

const getContent = async (articleId: string) => {
  const response = await fetch(`/insights-content/${encodeURIComponent(articleId)}.json`);
  if (!response.ok) throw new Error('The article content could not be loaded.');
  return response.json() as Promise<ImportedArticleContent>;
};

const headingId = (value: string, index: number) => (
  `${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section'}-${index + 1}`
);

const parseBlocks = (content: string): ArticleBlock[] => {
  const blocks: ArticleBlock[] = [];
  const paragraph: string[] = [];
  const list: string[] = [];
  let headingIndex = 0;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph.length = 0;
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: [...list] });
    list.length = 0;
  };

  for (const sourceLine of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = sourceLine.trim();
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    const listItem = /^(?:[-*]|\d+\.)\s+(.+)$/.exec(line);

    if (heading) {
      flushParagraph();
      flushList();
      const text = heading[2].trim();
      blocks.push({ type: 'heading', level: heading[1].length as 2 | 3, id: headingId(text, headingIndex), text });
      headingIndex += 1;
    } else if (listItem) {
      flushParagraph();
      list.push(listItem[1].trim());
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
};

const ReferenceTable: React.FC<{ source: string }> = ({ source }) => {
  const rows = source
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split(/\s*\|\s*/).map((cell) => cell.trim()).filter(Boolean));

  if (rows.length < 2 || !rows[0]) return null;

  return (
    <section className="insight-article__reference-table" aria-labelledby="reference-table-title">
      <h2 id="reference-table-title">Reference table</h2>
      <div>
        <table>
          <thead>
            <tr>{rows[0].map((cell, index) => <th key={`${cell}-${index}`} scope="col">{cell}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {rows[0].map((_, cellIndex) => <td key={cellIndex}>{row[cellIndex] ?? ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const InsightArticlePage: React.FC<InsightArticlePageProps> = ({ slug, onBack }) => {
  const article = useMemo(() => getInsightArticleById(slug), [slug]);
  const [content, setContent] = useState<ImportedArticleContent | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [article]);

  useEffect(() => {
    let active = true;
    setContent(null);
    setContentError(null);

    if (!article) return () => { active = false; };

    getContent(article.id)
      .then((nextContent) => {
        if (!active) return;
        if (!nextContent?.content) {
          setContentError('This article is not available.');
          return;
        }
        setContent(nextContent);
      })
      .catch(() => {
        if (active) setContentError('The article content could not be loaded. Please try again.');
      });

    return () => { active = false; };
  }, [article]);

  const blocks = useMemo(() => (content ? parseBlocks(content.content) : []), [content]);
  const headings = useMemo(() => blocks.filter((block): block is Extract<ArticleBlock, { type: 'heading' }> => block.type === 'heading' && block.level === 2), [blocks]);

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
            <span><UserRound aria-hidden="true" /> {article.author}</span>
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
                {headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.text}</a>)}
                <a href="#comments">Comments</a>
              </nav>
            </aside>

            <article className="insight-article__body">
              {content && blocks.map((block, index) => {
                if (block.type === 'heading') {
                  const Heading = block.level === 2 ? 'h2' : 'h3';
                  return <Heading id={block.id} key={block.id}>{block.text}</Heading>;
                }
                if (block.type === 'list') {
                  return <ul key={`list-${index}`}>{block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul>;
                }
                return <p key={`paragraph-${index}`}>{block.text}</p>;
              })}

              {!content && !contentError && <p className="insight-article__content-loading" role="status">Loading article…</p>}
              {contentError && <p className="insight-article__content-error" role="alert">{contentError}</p>}
              {content && <ReferenceTable source={content.tables} />}

              <InsightComments articleId={article.id} />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
