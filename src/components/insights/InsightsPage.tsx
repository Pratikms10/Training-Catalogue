import React, { useEffect } from 'react';
import { InsightsHero } from './InsightsHero';
import { EditorsPicksSection } from './EditorsPicksSection';
import { LatestInsightsSection } from './LatestInsightsSection';
import '../../styles/insights.css';

export const InsightsPage: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Insights | TechnoEdge Learning Services';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="insights-page">
      <InsightsHero />
      <EditorsPicksSection />
      <LatestInsightsSection />
    </div>
  );
};
