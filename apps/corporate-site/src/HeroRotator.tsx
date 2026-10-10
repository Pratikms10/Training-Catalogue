import { useState } from 'react';
import './hero-rotator.css';

const heroSlides = [
  {
    eyebrow: 'AI CAPABILITY FOR EVERY TEAM',
    heading: 'Turn AI Ambition Into',
    accent: 'Role-Ready Capability.',
    headingMarkup: 'Turn AI Ambition<br><span><b>Into</b> Role-Ready<br>Capability.</span>',
    description: 'Equip teams across IT, operations, sales and leadership to use AI safely, practically and at scale.',
    image: '/website/assets/hero-ai-capability-ascent-optimized.jpg',
    mobileImage: '/website/assets/hero-ai-capability-ascent-mobile.webp',
    mobileImage2x: '/website/assets/hero-ai-capability-ascent-mobile-2x.webp',
    variant: 'ai',
    primaryAction: { label: 'Explore AI Capability', href: '#ai-journey' },
    secondaryAction: { label: 'Talk To Us', href: '#contact' },
  },
  {
    eyebrow: 'WORKFORCE LEARNING',
    heading: 'Skills That Move',
    accent: 'Business Forward.',
    headingMarkup: 'Skills That Move<br><span>Business Forward.</span>',
    description: 'Role-based learning and practical AI support built for measurable outcomes.',
    image: '/website/assets/hero-career-growth-v2-optimized.jpg',
    variant: 'workforce',
    primaryAction: { label: 'Explore Our Services', href: '#services' },
    secondaryAction: { label: 'Talk To Us', href: '#contact' },
  },
] as const;

export default function HeroRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  return (
    <section
      className="hero hero-rotator"
      aria-roledescription="carousel"
      aria-label="TechnoEdge capability highlights"
    >
      <div className="hero-backgrounds" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <img
            className={`hero-background hero-background-${slide.variant}${index === activeIndex ? ' is-active' : ''}`}
            src={index === 0 && 'mobileImage' in slide
              ? slide.mobileImage
              : (index === activeIndex ? slide.image : undefined)}
            srcSet={index === 0 && 'mobileImage' in slide && 'mobileImage2x' in slide
              ? `${slide.mobileImage} 508w, ${slide.mobileImage2x} 824w, ${slide.image} 1600w`
              : undefined}
            sizes={index === 0 ? '(max-width: 760px) 100vw, 1600px' : undefined}
            alt=""
            width="1600"
            height="900"
            loading={index === 0 ? 'eager' : 'lazy'}
            key={slide.eyebrow}
          />
        ))}
      </div>

      <div className="hero-rotator-content">
        <div
          className="hero-copy hero-slide-copy"
          key={activeSlide.eyebrow}
          // This copy is composed only from the trusted constants above. Keeping
          // it as one stable HTML island prevents hydration from repainting the
          // page's LCP text while still allowing slide controls to update it.
          dangerouslySetInnerHTML={{ __html: `
            <span class="hero-kicker">${activeSlide.eyebrow}</span>
            <h1>${activeSlide.headingMarkup}</h1>
            <p>${activeSlide.description}</p>
            <div class="hero-actions">
              <a class="btn btn-solid hero-button" href="${activeSlide.primaryAction.href}">${activeSlide.primaryAction.label} <span>›</span></a>
              <a class="btn btn-outline hero-button" href="${activeSlide.secondaryAction.href}">${activeSlide.secondaryAction.label}</a>
            </div>
          ` }}
        />

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
