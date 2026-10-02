import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import corporateRoom from '../assets/hero-v5/corporate-room-lms.png';
import { ParallaxComponent } from './ui/parallax-scrolling';

const rotatingWords = ['PPT', 'Compliance deck', 'PDF', 'SOP', 'Policy manual'];

export function LayeredCorporateHero() {
  const [word, setWord] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setWord(value => (value + 1) % rotatingWords.length), 2000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <ParallaxComponent id="hero" className="layered-hero cinematic-hero">
      <img data-parallax-layer="background" className="layered-hero__room" src={corporateRoom} alt="Indian corporate team discussing a digital learning experience" />
      <div data-parallax-layer="light" className="layered-hero__depth-light" aria-hidden="true" />
      <div data-parallax-layer="wash" className="layered-hero__wash" />

      <div data-parallax-layer="copy" className="layered-hero__copy">
        <h1 aria-label="We create content your team actually opens.">
          {['We create content', 'your team', 'actually opens.'].map((line, index) => (
            <motion.span key={line} className={index === 2 ? 'is-accent' : ''} initial={{ opacity: 0, y: 52, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .16 + index * .11, duration: .78, ease: [.22, 1, .36, 1] }}>{line}</motion.span>
          ))}
        </h1>
        <motion.p className="hero-second-hook" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .65 }}>Boring content, minus the <span className="hook-strike">boring</span>.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .68, duration: .6 }}>
          <a className="hero-main-action" href="#document-intro" aria-label="Turn my document into this">
            <span>Turn my</span>
            <span className="rotating-word" aria-live="polite">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.b key={rotatingWords[word]} initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }} animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }} exit={{ y: '-110%', opacity: 0, filter: 'blur(6px)' }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }}>{rotatingWords[word]}</motion.b>
              </AnimatePresence>
            </span>
            <span>into this</span> <ArrowUpRight size={20} />
          </a>
        </motion.div>
      </div>
    </ParallaxComponent>
  );
}
