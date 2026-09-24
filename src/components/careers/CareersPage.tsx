import React, { useEffect } from 'react';
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
  useEffect(() => {
    document.title = 'Careers at TechnoEdge | Learning, technology and innovation';
    return () => {
      document.title = 'TechnoEdge Corporate Training Catalogue';
    };
  }, []);

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
