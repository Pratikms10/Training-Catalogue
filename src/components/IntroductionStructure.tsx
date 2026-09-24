import React from 'react';

export const IntroductionStructure: React.FC = () => {
  return (
    <section
      id="section-main-introduction"
      className="catalogue-hero"
      aria-labelledby="main-introduction-headline"
    >
      <div className="catalogue-hero__inner">
        <div className="catalogue-hero__content">
          <h1 id="main-introduction-headline" className="catalogue-hero__headline">
            <span>Exclusive Corporate</span>
            <span>Training Catalogue</span>
          </h1>

          <div className="catalogue-hero__supporting-copy">
            <p id="main-introduction-description">
              3,500+ curated corporate training programmes, shaped by real-world experience and designed to bridge strategic skill gaps.
            </p>
          </div>

          <div id="intro-programmes-badge" className="catalogue-hero__metric" aria-label="3,500 plus total curated programmes">
            <span className="catalogue-hero__metric-value">3,500+</span>
            <span className="catalogue-hero__metric-divider" aria-hidden="true" />
            <span className="catalogue-hero__metric-label">Total Curated Programmes</span>
          </div>
        </div>
      </div>

      <div className="catalogue-hero__media" aria-hidden="true">
        <video
          className="catalogue-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/technoedge-catalogue-hero-poster.jpg"
          width={854}
          height={480}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
        >
          <source
            src="/media/technoedge-catalogue-hero.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
        <div className="catalogue-hero__video-tone" />
      </div>
    </section>
  );
};
