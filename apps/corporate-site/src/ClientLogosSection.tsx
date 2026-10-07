import { useEffect, useRef } from 'react';
import { archiveClientLogos, featuredClientLogos, type ClientLogo } from './clientLogoData';

type GalleryLogo = ClientLogo & { featured: boolean };

// Mix the featured logos through the archive before dealing them into three rows.
const galleryLogos: GalleryLogo[] = [];
let featuredIndex = 0;
archiveClientLogos.forEach((logo, index) => {
  if (index % 5 === 0 && featuredIndex < featuredClientLogos.length) {
    galleryLogos.push({ ...featuredClientLogos[featuredIndex++], featured: true });
  }
  galleryLogos.push({ ...logo, featured: false });
});
while (featuredIndex < featuredClientLogos.length) {
  galleryLogos.push({ ...featuredClientLogos[featuredIndex++], featured: true });
}

const logoRows: GalleryLogo[][] = [[], [], []];
galleryLogos.forEach((logo, index) => logoRows[index % logoRows.length].push(logo));
const rowSize = Math.ceil(galleryLogos.length / logoRows.length);
logoRows.forEach((logos, index) => {
  // 158 unique logos need one repeat to make three rows of exactly 53.
  while (logos.length < rowSize) logos.push(galleryLogos[(index + 1) % logoRows.length]);
});

function LogoRow({ logos, row }: { logos: GalleryLogo[]; row: number }) {
  return (
    <div className="client-logo-viewport">
      <div className="client-logo-track" role="list" aria-label={`Client logos, row ${row + 1}`}>
        {logos.map((logo) => (
          <div className={`client-logo-card${logo.featured ? ' is-featured' : ''}`} role="listitem" key={logo.src} title={logo.name}>
            <img src={logo.src} alt={`${logo.name} logo`} loading="lazy" decoding="async" fetchPriority="low" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientLogosSection() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const viewports = [...stage.querySelectorAll<HTMLElement>('.client-logo-viewport')];
    const tracks = viewports.map((viewport) => viewport.querySelector<HTMLElement>('.client-logo-track'));
    const manualLayout = window.matchMedia('(max-width: 650px), (max-height: 620px), (prefers-reduced-motion: reduce)');
    let distances = viewports.map(() => 0);
    let frame = 0;

    const update = () => {
      frame = 0;
      if (manualLayout.matches) {
        tracks.forEach((track) => { if (track) track.style.transform = ''; });
        return;
      }
      const header = window.innerWidth <= 760 ? 76 : 92;
      const progress = Math.min(1, Math.max(0, (header - stage.getBoundingClientRect().top) / Math.max(1, stage.offsetHeight - window.innerHeight + header)));
      tracks.forEach((track, index) => {
        if (track) track.style.transform = `translate3d(${-distances[index] * (index === 1 ? 1 - progress : progress)}px, 0, 0)`;
      });
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const measure = () => {
      distances = viewports.map((viewport, index) => Math.max(0, (tracks[index]?.scrollWidth ?? 0) - viewport.clientWidth));
      requestUpdate();
    };
    const observer = new ResizeObserver(measure);
    viewports.forEach((viewport) => observer.observe(viewport));
    tracks.forEach((track) => { if (track) observer.observe(track); });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure);
    manualLayout.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', measure);
      manualLayout.removeEventListener('change', measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="clients client-logo-section section" id="about" aria-labelledby="client-logo-heading">
      <div className="client-logo-stage" ref={stageRef}>
        <div className="client-logo-stage-sticky">
          <div className="client-logo-shell">
            <header className="client-logo-header">
              <span className="eyebrow">TRUSTED BY GLOBAL TEAMS</span>
              <h2 id="client-logo-heading">The companies behind the work.</h2>
              <p>One connected network of organisations moving capability forward.</p>
            </header>
            <div className="client-logo-rows">
              {logoRows.map((logos, index) => <LogoRow logos={logos} row={index} key={index} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
