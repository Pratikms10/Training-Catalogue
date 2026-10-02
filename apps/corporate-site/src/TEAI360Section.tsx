import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Cog, Lightbulb, Rocket, TrendingUp, UsersRound, type LucideIcon } from 'lucide-react';

type Stage = {
  name: string;
  headline: string;
  description: string;
  capabilities?: string[];
  color: string;
  icon: LucideIcon;
};

const stages: Stage[] = [
  {
    name: 'Awareness',
    headline: 'Understand AI.',
    description: 'Establishing baseline digital literacy and AI possibilities.',
    capabilities: ['Digital foundations', 'Responsible AI'],
    color: '#52D9F4',
    icon: Lightbulb,
  },
  {
    name: 'Adoption',
    headline: 'Use AI every day.',
    description: 'Integrating initial AI agentic workflows into daily tasks.',
    capabilities: ['Everyday workflows', 'AI assistants'],
    color: '#92E5A1',
    icon: UsersRound,
  },
  {
    name: 'Automation',
    headline: 'Redesign the work.',
    description: 'Streamlining processes via Robotic Process Automation (RPA) and ML.',
    capabilities: ['Robotic process automation', 'Machine learning'],
    color: '#A797FF',
    icon: Cog,
  },
  {
    name: 'Augmentation',
    headline: 'Amplify people.',
    description: 'Enhancing human decision-making with predictive analytics.',
    capabilities: ['Predictive insights', 'Human decisions'],
    color: '#F396CD',
    icon: TrendingUp,
  },
  {
    name: 'Acceleration',
    headline: 'Scale the advantage.',
    description: 'Achieving full-scale, AI-driven enterprise transformation.',
    capabilities: ['Business Productivity', 'AI Orchestration', 'AI Champions', 'Continuous Upskilling'],
    color: '#F7C879',
    icon: Rocket,
  },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function StageContent({ stage, index }: { stage: Stage; index: number }) {
  return (
    <>
      <div className="teai360-stage-kicker">{String(index + 1).padStart(2, '0')} / 05</div>
      <h3>{stage.name}</h3>
      <p className="teai360-stage-headline">{stage.headline}</p>
      <p className="teai360-stage-description">{stage.description}</p>
      {stage.capabilities && <ul className="teai360-capabilities" aria-label={`${stage.name} focus areas`}>
        {stage.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
      </ul>}
    </>
  );
}

export default function TEAI360Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    let raf = 0;

    const update = () => {
      raf = 0;
      if (mobile.matches || reducedMotion.matches) return;
      const header = window.innerWidth <= 1050 ? 76 : 92;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight + header);
      const progress = clamp((header - rect.top) / travel);
      const stage = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      section.style.setProperty('--teai-camera-y', `${(14 - progress * 32).toFixed(1)}px`);
      section.style.setProperty('--teai-camera-scale', (1 + progress * .035).toFixed(4));
      setActive((current) => current === stage ? current : stage);
    };
    const requestUpdate = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const current = stages[active];
  const scrollToStage = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const header = window.innerWidth <= 1050 ? 76 : 92;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight + header);
    const top = window.scrollY + section.getBoundingClientRect().top - header + travel * ((index + .5) / stages.length);
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section className="teai360" id="ai-journey" ref={sectionRef} data-active={active} aria-labelledby="teai360-title">
      <div className="teai360-scroll">
        <div className="teai360-viewport" style={{ '--teai-accent': current.color } as CSSProperties}>
          <div className="teai360-atmosphere" aria-hidden="true" />
          <div className="teai360-layout">
            <div className="teai360-editorial">
              <div className="teai360-heading">
                <span className="teai360-eyebrow">AI CAPABILITY FRAMEWORK</span>
                <h2 id="teai360-title">TE-AI360 <em>Ascension</em></h2>
                <p>Five levels of AI maturity.</p>
              </div>
              <div className="teai360-stage-copy" key={active}>
                <StageContent stage={current} index={active} />
              </div>
              <div className="teai360-scroll-cue" aria-hidden="true"><span /> SCROLL TO ASCEND</div>
            </div>

            <div className="teai360-scene" aria-hidden="true">
              <div className="teai360-scene-inner">
                <div className="teai360-staircase">
                  <svg className="teai360-ascent-path" viewBox="0 0 1000 600" preserveAspectRatio="none" focusable="false">
                    <defs>
                      <linearGradient id="teai360-path-gradient" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#52d9f4" />
                        <stop offset="26%" stopColor="#92e5a1" />
                        <stop offset="52%" stopColor="#a797ff" />
                        <stop offset="76%" stopColor="#f396cd" />
                        <stop offset="100%" stopColor="#f7c879" />
                      </linearGradient>
                    </defs>
                    <path className="teai360-ascent-path-bed" d="M 70 445 H 198 Q 219 445 219 426 V 391 Q 219 373 238 373 H 390 Q 411 373 411 354 V 319 Q 411 301 430 301 H 582 Q 603 301 603 282 V 247 Q 603 229 622 229 H 774 Q 795 229 795 210 V 175 Q 795 157 814 157 H 940" />
                    <path className="teai360-ascent-path-progress" pathLength="100" style={{ strokeDashoffset: 100 - (active + 1) * 20 }} d="M 70 445 H 198 Q 219 445 219 426 V 391 Q 219 373 238 373 H 390 Q 411 373 411 354 V 319 Q 411 301 430 301 H 582 Q 603 301 603 282 V 247 Q 603 229 622 229 H 774 Q 795 229 795 210 V 175 Q 795 157 814 157 H 940" />
                    <circle className="teai360-ascent-marker" cx={[115, 307, 499, 691, 883][active]} cy={[445, 373, 301, 229, 157][active]} r="9" fill={current.color} />
                  </svg>
                  <div className="teai360-foundation"><span style={{ left: `${active * 20}%`, backgroundColor: current.color, boxShadow: `0 0 24px ${current.color}` }} /></div>
                  {stages.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div
                        key={stage.name}
                        className={`teai360-step teai360-step-${index + 1}`}
                        data-state={index < active ? 'complete' : index === active ? 'active' : 'future'}
                        style={{ '--step-accent': stage.color } as CSSProperties}
                      >
                        <span className="teai360-step-watermark">{String(index + 1).padStart(2, '0')}</span>
                        <span className="teai360-step-icon"><Icon size={23} strokeWidth={1.8} /></span>
                        <span className="teai360-step-index">{String(index + 1).padStart(2, '0')}</span>
                        <strong>{stage.name}</strong>
                        <small>{stage.headline}</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <ol className="teai360-track" aria-label="AI maturity progress">
            {stages.map((stage, index) => (
              <li key={stage.name} className={index < active ? 'is-complete' : index === active ? 'is-active' : ''} style={{ '--step-accent': stage.color } as CSSProperties}>
                <button type="button" className="teai360-track-button" onClick={() => scrollToStage(index)} aria-current={index === active ? 'step' : undefined} aria-label={`Go to level ${index + 1}: ${stage.name}`}>
                  <span className="teai360-track-name">{String(index + 1).padStart(2, '0')} <b>{stage.name}</b></span>
                  <span className="teai360-track-line" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="teai360-mobile" aria-label="Five AI capability levels">
        <div className="teai360-mobile-heading"><span>TE-AI360 / ASCENSION</span><h2>Five levels of AI maturity.</h2></div>
        <div className="teai360-mobile-steps">
          {stages.map((stage, index) => (
            <article className="teai360-mobile-step" key={stage.name} style={{ '--step-accent': stage.color } as CSSProperties}>
              <StageContent stage={stage} index={index} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
