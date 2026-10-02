import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

export function IntroGate({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'play' | 'loading' | 'leave'>('play');
  const [lit, setLit] = useState(-1);
  const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G', '.'];

  useEffect(() => {
    if (phase !== 'loading') return;
    let index = 0;
    const ticker = window.setInterval(() => {
      setLit(index);
      index += 1;
      if (index === letters.length) {
        window.clearInterval(ticker);
        window.setTimeout(() => setPhase('leave'), 120);
        window.setTimeout(onComplete, 520);
      }
    }, 72);
    return () => window.clearInterval(ticker);
  }, [phase, letters.length, onComplete]);

  return (
    <div className={`intro-gate ${phase === 'leave' ? 'intro-gate--leave' : ''}`}>
      <div className="intro-orb intro-orb--one" />
      <div className="intro-orb intro-orb--two" />
      {phase === 'play' ? (
        <button className="intro-play" onClick={() => setPhase('loading')} aria-label="Enter the TechnoEdge experience">
          <span className="intro-play__ring"><Play className="h-8 w-8 fill-current" /></span>
          <span className="intro-play__label">Enter the studio</span>
        </button>
      ) : (
        <div className="loading-word" aria-label="Loading">
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} className={index <= lit ? 'is-lit' : ''}>{letter}</span>
          ))}
        </div>
      )}
    </div>
  );
}
