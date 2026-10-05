import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CareerEmailDialog } from './CareerEmailDialog';

export const OpenApplication: React.FC = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  return (
  <section id="open-application" className="careers-open-application" aria-labelledby="careers-application-title">
    <div className="careers-page-shell careers-open-application__inner">
      <div>
        <p className="careers-section-label careers-section-label--light">Open application</p>
        <h2 id="careers-application-title">Didn’t find the right opportunity?</h2>
        <p>If you don’t see the right role today, send us your profile and let’s stay connected.</p>
      </div>
      <button
        type="button"
        onClick={() => setIsEmailDialogOpen(true)}
        className="careers-secondary-button"
      >
        Send your profile
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
    {isEmailDialogOpen && <CareerEmailDialog onClose={() => setIsEmailDialogOpen(false)} />}
  </section>
  );
};
