import React, { useState } from 'react';
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
        <nav aria-label="Breadcrumbs">
        <a className="career-role-page__back" href="/careers" onClick={(event) => { event.preventDefault(); onBack(); }}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to careers
        </a>
        </nav>
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
        <div className="career-role-page__details">
          <section aria-labelledby="role-overview-heading">
            <h2 id="role-overview-heading">About this role</h2>
            <p>This opportunity sits within the {job.department} team and is offered as a {job.type.toLowerCase()} role{job.location ? ` based in ${job.location}` : ''}. Detailed responsibilities and qualification criteria are confirmed with shortlisted candidates before an application progresses.</p>
          </section>
          <section aria-labelledby="role-application-heading">
            <h2 id="role-application-heading">Application process</h2>
            <p>Send your profile with the role title in the subject. The TechnoEdge careers team will review relevant experience and contact suitable applicants with the complete role brief and next steps.</p>
          </section>
          <section aria-labelledby="role-company-heading">
            <h2 id="role-company-heading">Working at TechnoEdge</h2>
            <p>TechnoEdge brings together learning, content, technology and AI capabilities to help enterprise teams build practical skills and improve how work gets done.</p>
          </section>
        </div>
      </div>
      {isEmailDialogOpen && <CareerEmailDialog roleTitle={job.title} onClose={() => setIsEmailDialogOpen(false)} />}
    </section>
  );
};
