import { useEffect, useState, type FocusEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './hero-rotator.css';

const SLIDE_DURATION = 5_000;

const heroSlides = [
  {
    eyebrow: 'AI CAPABILITY FOR EVERY TEAM',
    heading: 'Turn AI ambition into',
    accent: 'role-ready capability.',
    description: 'Equip teams across IT, operations, sales and leadership to use AI safely, practically and at scale.',
    image: '/website/assets/hero-ai-capability-ascent-optimized.jpg',
    variant: 'ai',
    primaryAction: { label: 'Explore AI capability', href: '#ai-journey' },
    secondaryAction: { label: 'Talk to us', href: '#contact' },
  },
  {
    eyebrow: 'WORKFORCE LEARNING',
    heading: 'Skills that move',
    accent: 'business forward.',
    description: 'Role-based learning and practical AI support built for measurable outcomes.',
    image: '/website/assets/hero-career-growth-v2-optimized.jpg',
    variant: 'workforce',
    primaryAction: { label: 'Explore our services', href: '#services' },
    secondaryAction: { label: 'Talk to us', href: '#contact' },
  },
] as const;

export default function HeroRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadSecondaryImage, setLoadSecondaryImage] = useState(false);
  const isPaused = isHovering || hasFocus;
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadSecondaryImage(true), 1_500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
  };

  return (
    <section
      className="hero hero-rotator"
      aria-roledescription="carousel"
      aria-label="TechnoEdge capability highlights"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={handleBlur}
    >
      <div className="hero-backgrounds" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <div
            className={`hero-background hero-background-${slide.variant}${index === activeIndex ? ' is-active' : ''}`}
            style={index === 0 || loadSecondaryImage || index === activeIndex
              ? { backgroundImage: `url(${slide.image})` }
              : undefined}
            key={slide.eyebrow}
          />
        ))}
      </div>

      <div className="hero-rotator-content">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            className="hero-copy hero-slide-copy"
            key={activeSlide.eyebrow}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
          >
            <span className="hero-kicker">{activeSlide.eyebrow}</span>
            <h1>{activeSlide.heading}<br /><span>{activeSlide.accent}</span></h1>
            <p>{activeSlide.description}</p>
            <div className="hero-actions">
              <a className="btn btn-solid hero-button" href={activeSlide.primaryAction.href}>{activeSlide.primaryAction.label} <span>›</span></a>
              <a className="btn btn-outline hero-button" href={activeSlide.secondaryAction.href}>{activeSlide.secondaryAction.label}</a>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="hero-rotator-controls" aria-label="Hero slide controls">
          <div className="hero-rotator-dots" role="tablist" aria-label="Choose a hero message">
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Show: ${slide.heading} ${slide.accent}`}
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => setActiveIndex(index)}
                key={slide.eyebrow}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
