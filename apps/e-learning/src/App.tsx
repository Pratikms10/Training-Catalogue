import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LayeredCorporateHero } from './components/LayeredCorporateHero';
import { GlassCursor } from './components/ui/glass-cursor';
import { FooterStructure } from '../../../src/components/FooterStructure';
import { AnalyticsConsent } from '../../../src/components/AnalyticsConsent';
import './components/continuation/continuation.css';

const SopStory = lazy(() => import('./components/SopStory').then((module) => ({ default: module.SopStory })));
const LearningUniverse = lazy(() => import('./components/continuation/LearningUniverse').then((module) => ({ default: module.LearningUniverse })));
const LevelComparisonMatrix = lazy(() => import('./components/continuation/LevelComparisonMatrix').then((module) => ({ default: module.LevelComparisonMatrix })));
const ContinuationIndustries = lazy(() => import('./components/continuation/IndustrySelector').then((module) => ({ default: module.IndustrySelector })));
const ContinuationContact = lazy(() => import('./components/continuation/ContactSection').then((module) => ({ default: module.ContactSection })));
const SectionDivider = lazy(() => import('./components/SectionDivider').then((module) => ({ default: module.SectionDivider })));

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = '';

    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? window.scrollY / available : 0);
    };

    document.body.classList.remove('cursor-none');
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      document.documentElement.style.overflow = '';
      document.body.classList.remove('cursor-none');
    };
  }, []);

  return (
    <div className="site-shell">
      <GlassCursor />
      <div className="reading-progress"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="site-content">
        <Header />
        <main>
          <LayeredCorporateHero />
          <Suspense fallback={<section className="section-divider" role="status">Loading e-learning capabilities…</section>}>
          <SopStory />
          <LearningUniverse />
          <SectionDivider id="divider-formats-depth" />
          <LevelComparisonMatrix />
          <SectionDivider id="divider-depth-industries" />
          <ContinuationIndustries />
          <SectionDivider id="divider-industries-contact" />
          <ContinuationContact />
          </Suspense>
        </main>
        <FooterStructure />
      </div>
      <AnalyticsConsent />
    </div>
  );
}
