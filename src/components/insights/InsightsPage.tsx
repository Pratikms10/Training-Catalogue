import React from 'react';
import { InsightsHero } from './InsightsHero';
import { EditorsPicksSection } from './EditorsPicksSection';
import { LatestInsightsSection } from './LatestInsightsSection';
import '../../styles/insights.css';

export const InsightsPage: React.FC = () => {
  return (
    <div className="insights-page">
      <InsightsHero />
      <EditorsPicksSection />
      <LatestInsightsSection />
    </div>
  );
};
