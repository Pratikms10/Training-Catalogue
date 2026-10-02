import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LayeredCorporateHero } from './components/LayeredCorporateHero';
import { SopStory } from './components/SopStory';
import { LoadingScreen } from './components/LoadingScreen';
import { GlassCursor } from './components/ui/glass-cursor';
import { LearningUniverse } from './components/continuation/LearningUniverse';
import { LevelComparisonMatrix } from './components/continuation/LevelComparisonMatrix';
import { IndustrySelector as ContinuationIndustries } from './components/continuation/IndustrySelector';
import { ContactSection as ContinuationContact } from './components/continuation/ContactSection';
import { Footer as ContinuationFooter } from './components/continuation/Footer';
import { SectionDivider } from './components/SectionDivider';
import './components/continuation/continuation.css';

export default function App() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = ready ? '' : 'hidden';

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
  }, [ready]);

  return (
    <div className="site-shell">
      {!ready && <LoadingScreen onComplete={() => setReady(true)} />}
      <GlassCursor />
      <div className="reading-progress"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className={ready ? 'site-content is-ready' : 'site-content'}>
        <Header />
        <main>
          <LayeredCorporateHero />
          <SopStory />
          <LearningUniverse />
          <SectionDivider id="divider-formats-depth" />
          <LevelComparisonMatrix />
          <SectionDivider id="divider-depth-industries" />
          <ContinuationIndustries />
          <SectionDivider id="divider-industries-contact" />
          <ContinuationContact onOpenScoper={() => {}} />
        </main>
        <ContinuationFooter />
      </div>
    </div>
  );
}
