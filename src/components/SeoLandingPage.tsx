import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SeoLandingPage as SeoLandingPageContent } from '../data/seoLandingPages';

interface Props {
  page: SeoLandingPageContent;
  programmeLinks?: Array<{ id: string; title: string }>;
}

const kindLabels: Record<SeoLandingPageContent['kind'], string> = {
  service: 'Services',
  category: 'Catalogue',
  solution: 'Solutions',
  industry: 'Industries',
  market: 'Markets',
  trust: 'TechnoEdge',
};

export const SeoLandingPage: React.FC<Props> = ({ page, programmeLinks = [] }) => (
  <div className="seo-landing-page">
    <nav className="seo-landing-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><span aria-hidden="true">/</span><a href={page.kind === 'category' ? '/catalogue' : '/'}>{kindLabels[page.kind]}</a></li>
        <li aria-current="page"><span aria-hidden="true">/</span>{page.h1}</li>
      </ol>
    </nav>

    <header className="seo-landing-hero">
      <p className="seo-landing-eyebrow">{page.eyebrow}</p>
      <h1>{page.h1}</h1>
      <p className="seo-landing-answer">{page.answer}</p>
      <div className="seo-landing-actions">
        <a className="seo-landing-primary" href="/contact">Discuss your requirement <ArrowRight aria-hidden="true" /></a>
        <a className="seo-landing-secondary" href="/catalogue">Explore programmes</a>
      </div>
    </header>

    <div className="seo-landing-main">
      <section aria-labelledby="seo-audience-title" className="seo-landing-intro">
        <p>Designed for</p>
        <h2 id="seo-audience-title">Who this is for</h2>
        <p>{page.audience}</p>
      </section>

      <section aria-labelledby="seo-outcomes-title">
        <div className="seo-landing-section-heading">
          <p>Business value</p>
          <h2 id="seo-outcomes-title">What this work should achieve</h2>
        </div>
        <div className="seo-landing-card-grid">
          {page.outcomes.map((outcome) => (
            <article key={outcome.title}>
              <CheckCircle2 aria-hidden="true" />
              <h3>{outcome.title}</h3>
              <p>{outcome.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="seo-approach-title" className="seo-landing-split">
        <div>
          <p className="seo-landing-label">Delivery approach</p>
          <h2 id="seo-approach-title">How TechnoEdge approaches the requirement</h2>
          <ol className="seo-landing-steps">
            {page.approach.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}
          </ol>
        </div>
        <aside aria-labelledby="seo-evidence-title">
          <p className="seo-landing-label">Why it is credible</p>
          <h2 id="seo-evidence-title">Evidence and delivery foundations</h2>
          <ul>{page.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
      </section>

      <section aria-labelledby="seo-questions-title" className="seo-landing-questions">
        <div className="seo-landing-section-heading">
          <p>Direct answers</p>
          <h2 id="seo-questions-title">Questions enterprise teams ask</h2>
        </div>
        <div>
          {page.questions.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="seo-related-title" className="seo-landing-related">
        <h2 id="seo-related-title">Continue exploring</h2>
        <div>{page.relatedLinks.map((link) => <a href={link.href} key={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>)}</div>
      </section>

      {programmeLinks.length > 0 && (
        <section aria-labelledby="seo-programmes-title" className="seo-landing-related">
          <h2 id="seo-programmes-title">Quality-reviewed programmes in this catalogue</h2>
          <div>{programmeLinks.map((programme) => <a href={`/programmes/${programme.id}`} key={programme.id}>{programme.title}<ArrowRight aria-hidden="true" /></a>)}</div>
        </section>
      )}

      <section aria-labelledby="seo-next-title" className="seo-landing-cta">
        <div><p>Build the right capability</p><h2 id="seo-next-title">Start with the outcome your team needs</h2></div>
        <a href="/contact">Talk to TechnoEdge <ArrowRight aria-hidden="true" /></a>
      </section>
    </div>
  </div>
);
