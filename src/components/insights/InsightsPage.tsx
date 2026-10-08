import React, { useEffect, useState } from 'react';
import { InsightsHero } from './InsightsHero';
import { EditorsPicksSection } from './EditorsPicksSection';
import { LatestInsightsSection } from './LatestInsightsSection';
import { insightsArticles, type InsightArticle } from '../../data/insightsData';
import '../../styles/insights.css';

export const InsightsPage: React.FC = () => {
  const [articles, setArticles] = useState<InsightArticle[]>(insightsArticles);
  useEffect(() => {
    let active = true;
    fetch('/api/insights')
      .then(async (response) => {
        if (!response.ok) throw new Error('Insights are unavailable.');
        return response.json() as Promise<{ data: InsightArticle[] }>;
      })
      .then((result) => { if (active && result.data?.length) setArticles(result.data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  return (
    <div className="insights-page">
      <InsightsHero />
      <EditorsPicksSection articles={articles} />
      <LatestInsightsSection articles={articles} />
    </div>
  );
};
