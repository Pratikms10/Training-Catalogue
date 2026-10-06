import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './teai360-ascent.css';

const stages = [
  {
    name: 'Awareness',
    headline: 'Understand where AI creates value.',
    description: 'Build shared AI literacy, recognise relevant opportunities, and establish the principles for safe, responsible use.',
    color: '#eef8ff', edge: '#bddcf2', text: '#14518a', height: '42%',
  },
  {
    name: 'Adoption',
    headline: 'Put trusted AI tools into daily work.',
    description: 'Equip teams with role-based practice, reliable tools, and repeatable habits that turn awareness into practical use.',
    color: '#82c9f5', edge: '#4d9ed6', text: '#103f6c', height: '54%',
  },
  {
    name: 'Automation',
    headline: 'Redesign repeatable work.',
    description: 'Connect processes and systems so routine tasks can run faster, consistently, and with the right human oversight.',
    color: '#3c9ae4', edge: '#2479bd', text: '#ffffff', height: '66%',
  },
  {
    name: 'Augmentation',
    headline: 'Amplify judgement and expertise.',
    description: 'Embed intelligent assistance into complex work so people can analyse, decide, create, and deliver with greater confidence.',
    color: '#236ac1', edge: '#134e96', text: '#ffffff', height: '79%',
  },
  {
    name: 'Acceleration',
    headline: 'Scale AI as an enterprise capability.',
    description: 'Operationalise proven use cases across functions with governance, measurement, and a system for continuous improvement.',
    color: '#0d4688', edge: '#062f66', text: '#ffffff', height: '93%',
  },
] as const;

export default function TEAI360Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const updateStage = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const nextStage = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      setActiveStage((current) => (current === nextStage ? current : nextStage));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateStage);
    };

    updateStage();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const active = stages[activeStage];

  return (
    <section className="ai-framework-scroll" id="ai-journey" ref={sectionRef} aria-labelledby="teai360-title">
      <div className="ai-framework">
        <header className="ai-framework-heading">
          <h2 id="teai360-title">TE-AI360</h2>
          <p>Five levels that turn AI ambition into organisational capability.</p>
        </header>

        <div className="ai-framework-layout">
          <div className="ai-framework-copy" key={active.name} aria-live="polite">
            <h3>{active.name}</h3>
            <strong>{active.headline}</strong>
            <p>{active.description}</p>
            <div className="ai-framework-progress" aria-hidden="true">
              {stages.map((stage, index) => (
                <span className={index <= activeStage ? 'is-filled' : ''} key={stage.name} />
              ))}
            </div>
          </div>

          <div className="ai-framework-stage-window" role="group" aria-label="Five AI capability stages">
            <div className="ai-framework-stage-set">
              {stages.map((stage, index) => {
                const state = index === activeStage ? 'active' : index < activeStage ? 'complete' : 'upcoming';
                return (
                  <article
                    className="ai-framework-stage"
                    data-state={state}
                    aria-current={state === 'active' ? 'step' : undefined}
                    style={{
                      '--stage-color': stage.color,
                      '--stage-edge': stage.edge,
                      '--stage-text': stage.text,
                      '--stage-height': stage.height,
                    } as CSSProperties}
                    key={stage.name}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{stage.name}</h3>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
