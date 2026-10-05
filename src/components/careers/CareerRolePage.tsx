import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { careerJobs } from '../../data/careersData';
import { CareerEmailDialog } from './CareerEmailDialog';

interface CareerRolePageProps {
  slug: string;
  onBack: () => void;
}

export const CareerRolePage: React.FC<CareerRolePageProps> = ({ slug, onBack }) => {
  const job = careerJobs.find((item) => item.slug === slug);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  useEffect(() => {
    document.title = job
      ? `${job.title} | Careers at TechnoEdge`
      : 'Role not found | Careers at TechnoEdge';

    return () => {
      document.title = 'TechnoEdge Corporate Training Catalogue';
    };
  }, [job]);

  if (!job) {
    return (
      <section className="career-role-page">
        <div className="careers-page-shell career-role-page__empty">
          <p className="careers-section-label">Careers at TechnoEdge</p>
          <h1>Role not found</h1>
          <button type="button" className="careers-primary-button" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to careers
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="career-role-page" aria-labelledby="career-role-title">
      <div className="careers-page-shell">
        <button type="button" className="career-role-page__back" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to careers
        </button>
        <div className="career-role-page__content">
          <div>
            <p className="careers-section-label">Careers at TechnoEdge</p>
            <h1 id="career-role-title">{job.title}</h1>
            <p className="career-role-page__meta">
              {[job.department, job.type, job.location].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEmailDialogOpen(true)}
            className="careers-primary-button"
          >
            Send your profile
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {isEmailDialogOpen && <CareerEmailDialog roleTitle={job.title} onClose={() => setIsEmailDialogOpen(false)} />}
    </section>
  );
};
