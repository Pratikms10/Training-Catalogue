import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { archiveClientLogos, featuredClientLogos } from '../src/clientLogoData';

const html = renderToStaticMarkup(
  <MemoryRouter basename="/website" initialEntries={['/website/']}>
    <App />
  </MemoryRouter>,
);

assert.match(html, /id="media-universe-title"/);
assert.match(html, /id="enquiry-form"/);
assert.match(html, /class="contact-shell"/);
assert.match(html, /For my organisation/);
assert.match(html, /Review enquiry on WhatsApp/);
assert.doesNotMatch(html, /Connect this form to your preferred inbox or CRM/);
assert.match(html, /href="\/e-learning\/"/);
assert.match(html, /href="\/website\/" aria-current="page">Home/);
assert.match(html, /href="\/catalogue">Catalogue/);
assert.match(html, /href="\/insights">Insights/);
assert.match(html, /href="\/careers">Careers/);
assert.match(html, /id="services-heading"/);
assert.match(html, /partnerships\/microsoft-training-partner\.gif/);
assert.match(html, /partnerships\/microsoft-training-skilling-partner-badge\.png/);
assert.match(html, /Microsoft Global Training Partner/);
assert.match(html, /Microsoft Training Skilling Partner/);
assert.match(html, /partnerships\/dpiit-startup-india\.png/);
assert.match(html, /Recognised to deliver/);
assert.equal(featuredClientLogos.length, 26);
assert.equal(archiveClientLogos.length, 132);
assert.equal((html.match(/class="client-logo-stage"/g) || []).length, 1);
assert.equal((html.match(/class="client-logo-viewport"/g) || []).length, 3);
assert.equal((html.match(/data-direction="right"/g) || []).length, 2);
assert.equal((html.match(/data-direction="left"/g) || []).length, 1);
assert.equal((html.match(/class="client-logo-card is-featured"/g) || []).length, featuredClientLogos.length);
assert.equal((html.match(/class="client-logo-card"/g) || []).length, archiveClientLogos.length);
assert.match(html, /SCROLL TO EXPLORE/);
assert.equal((html.match(/id="service-tab-\d"/g) || []).length, 5);
assert.match(html, /Data &amp; AI Support/);
assert.match(html, /services-showcase\/corporate-training\.png/);
assert.equal((html.match(/class="home-insights-card"/g) || []).length, 3);
assert.match(html, /AI-102 Certification Roadmap 2026/);
assert.match(html, /href="\/insights\/ai-102-certification-roadmap-2026"/);
assert.equal((html.match(/class="media-node /g) || []).length, 20);
assert.match(html, /class="media-lightbox"/);
assert.match(html, /SELECT A MOMENT TO VIEW/);
assert.equal((html.match(/recognition-[\w-]+\.jpg/g) || []).length, 5);
assert.match(html, /TE-AI360/);
assert.equal((html.match(/class="teai360-step teai360-step-/g) || []).length, 5);
console.log('Corporate React page rendered with five services, three local insights, 20 media tiles, and five AI ascent stages.');
