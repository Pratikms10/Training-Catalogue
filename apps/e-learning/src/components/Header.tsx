import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import technoedgeMark from '../assets/technoedge-mark.png';

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const previousY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const currentY = window.scrollY;
        const delta = currentY - previousY.current;
        setCompact(currentY > 60);
        if (menuOpen || currentY < window.innerHeight * .82) setHidden(false);
        else if (delta > 12) setHidden(true);
        else if (delta < -10) setHidden(false);
        previousY.current = currentY;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${hidden && !menuOpen ? ' is-hidden' : ''}${compact ? ' is-compact' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <a className="site-brand" href="/website/" aria-label="TechnoEdge home">
        <span className="site-brand__mark">
          <img src={technoedgeMark} alt="" />
        </span>
        <span className="site-brand__name">
          <b>Technoedge</b>
          <small>E-learning Services</small>
        </span>
      </a>
      <nav id="e-learning-primary-nav" className="global-nav" aria-label="Primary navigation">
        <a href="/website/">Home</a>
        <a href="/e-learning/" aria-current="page">E-Learning</a>
        <a href="/catalogue">Catalogue</a>
        <a href="/insights">Insights</a>
        <a href="/careers">Careers</a>
      </nav>
      <div className="header-controls">
        <a className="header-cta" href="#contact" onClick={() => setMenuOpen(false)}>Build with us <ArrowUpRight size={15} /></a>
        <button className="global-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="e-learning-primary-nav" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => { setHidden(false); setMenuOpen((open) => !open); }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
