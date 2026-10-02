import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { archiveClientLogos, featuredClientLogos, type ClientLogo } from './clientLogoData';

type GalleryLogo = ClientLogo & { featured: boolean };

function splitIntoRows(logos: ClientLogo[]) {
  const rowSize = Math.ceil(logos.length / 3);
  return Array.from({ length: 3 }, (_, index) => logos.slice(index * rowSize, (index + 1) * rowSize));
}

const featuredRows = splitIntoRows(featuredClientLogos);
const archiveRows = splitIntoRows(archiveClientLogos);
const logoRows: GalleryLogo[][] = [
  [...archiveRows[0].map((logo) => ({ ...logo, featured: false })), ...featuredRows[0].map((logo) => ({ ...logo, featured: true }))],
  [...featuredRows[1].map((logo) => ({ ...logo, featured: true })), ...archiveRows[1].map((logo) => ({ ...logo, featured: false }))],
  [...archiveRows[2].map((logo) => ({ ...logo, featured: false })), ...featuredRows[2].map((logo) => ({ ...logo, featured: true }))],
];

function ScrollLogoRow({ logos, row, progress }: { logos: GalleryLogo[]; row: number; progress: MotionValue<number> }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const direction = row === 1 ? 'left' : 'right';
  const x = useTransform(progress, (value) => {
    const phase = Math.pow(Math.min(1, Math.max(0, value)), .95 + row * .05);
    return direction === 'right' ? -travel * (1 - phase) : -travel * phase;
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const manualLayout = window.matchMedia('(max-width: 650px), (max-height: 620px), (prefers-reduced-motion: reduce)');
    const measure = () => {
      setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
      if (manualLayout.matches && direction === 'right') {
        viewport.scrollLeft = track.scrollWidth - viewport.clientWidth;
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    manualLayout.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      manualLayout.removeEventListener('change', measure);
    };
  }, [direction]);

  return (
    <div className="client-logo-viewport" data-direction={direction} ref={viewportRef}>
      <motion.div className="client-logo-track" ref={trackRef} style={{ x }} role="list" aria-label={`Client logos, row ${row + 1}`}>
        {logos.map((logo) => (
          <div className={`client-logo-card${logo.featured ? ' is-featured' : ''}`} role="listitem" key={logo.src} title={logo.name}>
            <img src={logo.src} alt={`${logo.name} logo`} decoding="async" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ClientLogosSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 135, damping: 32, mass: .45 });

  return (
    <section className="clients client-logo-section section" id="about" aria-labelledby="client-logo-heading">
      <div className="client-logo-shell">
        <header className="client-logo-header">
          <span className="eyebrow">TRUSTED BY GLOBAL TEAMS</span>
          <h2 id="client-logo-heading">The companies behind the work.</h2>
          <p>One connected network of organisations moving capability forward.</p>
        </header>
        <div className="client-logo-stage" ref={stageRef}>
          <div className="client-logo-stage-sticky">
            <div className="client-logo-panel">
              <div className="client-logo-group-heading">
                <div><span>OUR CLIENT NETWORK</span><h3>Organisations we work with</h3></div>
                <strong><b>{featuredClientLogos.length} featured</b><span> + {archiveClientLogos.length} more</span></strong>
              </div>
              <div className="client-logo-rows">
                {logoRows.map((logos, index) => <ScrollLogoRow logos={logos} row={index} progress={smoothProgress} key={index} />)}
              </div>
              <div className="client-logo-scroll-footer" aria-hidden="true">
                <span>SCROLL TO EXPLORE</span>
                <div className="client-logo-progress"><motion.span style={{ scaleX: smoothProgress }} /></div>
                <span>03 ROWS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
