import React from 'react';
import { careerJobs } from '../../data/careersData';
import { AboutTechnoEdge } from './AboutTechnoEdge';
import { CareersHero } from './CareersHero';
import { CurrentOpenings } from './CurrentOpenings';
import { OpenApplication } from './OpenApplication';
import { WhyJoinTechnoEdge } from './WhyJoinTechnoEdge';

interface CareersPageProps {
  onViewRole: (slug: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onViewRole }) => {
  const scrollToOpenings = () => {
    document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="careers-page">
      <CareersHero onViewOpenings={scrollToOpenings} />
      <AboutTechnoEdge />
      <WhyJoinTechnoEdge />
      <CurrentOpenings jobs={careerJobs} onViewRole={(job) => onViewRole(job.slug)} />
      <OpenApplication />
    </div>
  );
};
