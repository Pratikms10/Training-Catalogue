import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, DatabaseZap, GraduationCap, Languages, MonitorPlay } from 'lucide-react';

const services = [
  {
    name: 'Corporate Training',
    icon: GraduationCap,
    title: 'Corporate Training Solutions',
    subtitle: 'Learn it. Practise it. Use it.',
    points: [
      'Role-based, instructor-led programs built around the work your teams do every day.',
      'Hands-on labs and experienced trainers turn technical knowledge into practical capability.',
    ],
    takeaway: 'Learning that moves from the classroom into the workplace.',
    image: '/website/assets/services-showcase/corporate-training.png',
    imageAlt: 'Trainer guiding a group through a practical technology workshop',
    visualLabel: 'Expert-led learning, grounded in real work',
  },
  {
    name: 'E-Learning',
    icon: MonitorPlay,
    title: 'E-Learning Solutions',
    subtitle: 'Flexible by design. Consistent at scale.',
    points: [
      'Structured digital courses, simulations and learning content available when people need them.',
      'Engaging practice and clear progress help teams build skills across locations and schedules.',
    ],
    takeaway: 'The right learning experience, wherever work happens.',
    image: '/website/assets/services-showcase/e-learning.png',
    imageAlt: 'Professional learner taking a digital course on a laptop',
    visualLabel: 'Digital learning that stays engaging',
  },
  {
    name: 'AI & Automation',
    icon: Bot,
    title: 'AI & Automation Consulting',
    subtitle: 'From useful idea to working process.',
    points: [
      'Identify high-value AI use cases and redesign workflows around measurable business needs.',
      'Implement practical automation with human oversight, responsible adoption and clear outcomes.',
    ],
    takeaway: 'Smarter workflows, with people at the centre.',
    image: '/website/assets/services-showcase/ai-automation.png',
    imageAlt: 'Consultants reviewing an AI-supported business workflow',
    visualLabel: 'Practical AI for everyday operations',
  },
  {
    name: 'Content & Language',
    icon: Languages,
    title: 'Content Processing & Language Services',
    subtitle: 'Make every message clear and accessible.',
    points: [
      'Human-reviewed transcription, translation and captions help content reach more people.',
      'Adapt learning assets for different languages, regions and accessibility needs.',
    ],
    takeaway: 'One experience, understood across teams and regions.',
    image: '/website/assets/services-showcase/content-language.png',
    imageAlt: 'Content specialists reviewing captions and language adaptations',
    visualLabel: 'Content that connects across languages',
  },
  {
    name: 'Data & AI Support',
    icon: DatabaseZap,
    title: 'Data & AI Support',
    subtitle: 'Better data makes better AI possible.',
    points: [
      'Build smarter AI systems with structured, high-quality datasets and careful validation.',
      'Power automation initiatives with reliable data operations tailored to the work they support.',
    ],
    takeaway: 'Reliable data at the foundation of every intelligent system.',
    image: '/website/assets/services-showcase/data-ai.png',
    imageAlt: 'Data specialists checking structured datasets and AI readiness',
    visualLabel: 'Reliable data, ready for what comes next',
  },
] as const;

export default function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeService = services[activeIndex];
  const ActiveIcon = activeService.icon;

  function selectTab(index: number, focus = false) {
    const nextIndex = (index + services.length) % services.length;
    setActiveIndex(nextIndex);
    if (focus) tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab(index + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab(index - 1, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(services.length - 1, true);
    }
  }

  return (
    <section className="services-showcase section" id="services" aria-labelledby="services-heading">
      <div className="services-showcase-shell">
        <header className="services-showcase-header">
          <div>
            <span className="services-showcase-eyebrow">OUR SERVICES</span>
            <h2 id="services-heading">Choose the challenge.<br /><span>We&apos;ll build the capability.</span></h2>
          </div>
          <div className="services-showcase-controls" aria-label="Service navigation">
            <span className="services-showcase-count"><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(services.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Previous service" onClick={() => selectTab(activeIndex - 1)}><ArrowLeft size={19} aria-hidden="true" /></button>
            <button type="button" aria-label="Next service" onClick={() => selectTab(activeIndex + 1)}><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </header>

        <div className="services-showcase-tabs" role="tablist" aria-label="Explore TechnoEdge services">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={service.name}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`service-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls="service-panel"
                tabIndex={activeIndex === index ? 0 : -1}
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <small>{String(index + 1).padStart(2, '0')}</small>
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>{service.name}</span>
                {activeIndex === index && <i aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="services-showcase-panel" id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${activeIndex}`} key={activeService.name}>
          <div className="services-showcase-copy">
            <div className="services-showcase-copy-heading">
              <span className="services-showcase-icon"><ActiveIcon size={29} strokeWidth={1.7} aria-hidden="true" /></span>
              <div><span className="services-showcase-step">SERVICE {String(activeIndex + 1).padStart(2, '0')}</span><h3>{activeService.title}</h3><p>{activeService.subtitle}</p></div>
            </div>
            <ul>{activeService.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <p className="services-showcase-takeaway">{activeService.takeaway}</p>
            <a className="services-showcase-cta" href="#contact">Enquire about this service <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <figure className="services-showcase-visual">
            <div className="services-showcase-image-wrap"><img src={activeService.image} alt={activeService.imageAlt} loading="lazy" /></div>
            <figcaption><span className="services-showcase-visual-dot" />{activeService.visualLabel}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
