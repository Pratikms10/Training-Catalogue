import React from 'react';
import { insightsHeroContent } from '../../data/insightsData';

export const InsightsHero: React.FC = () => {
  const { titleLead, titleBridge, titleAccent, paragraphs } = insightsHeroContent;
  const bridgeWords = titleBridge.split(' ');
  const bridgeFirstWord = bridgeWords[0];
  const bridgeLastWord = bridgeWords.slice(1).join(' ');

  return (
    <section className="insights-hero" aria-labelledby="insights-page-title">
      <div className="insights-shell insights-hero__inner">
        <h1 id="insights-page-title">
          {titleLead}
          <br className="insights-hero__break insights-hero__break--mobile" aria-hidden="true" />{' '}
          {bridgeFirstWord}
          <br className="insights-hero__break insights-hero__break--desktop" aria-hidden="true" />{' '}
          {bridgeLastWord}
          <br className="insights-hero__break insights-hero__break--mobile" aria-hidden="true" />{' '}
          <span className="insights-hero__accent">{titleAccent}</span>
        </h1>

        <div className="insights-hero__copy">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
