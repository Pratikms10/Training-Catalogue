import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const OpenApplication: React.FC = () => (
  <section id="open-application" className="careers-open-application" aria-labelledby="careers-application-title">
    <div className="careers-page-shell careers-open-application__inner">
      <div>
        <p className="careers-section-label careers-section-label--light">Open application</p>
        <h2 id="careers-application-title">Didn’t find the right opportunity?</h2>
        <p>If you don’t see the right role today, send us your profile and let’s stay connected.</p>
      </div>
      <a
        href="mailto:info@technoedgels.com?subject=Open%20application%20for%20TechnoEdge"
        className="careers-secondary-button"
      >
        Send your profile
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  </section>
);
