import { useEffect, type CSSProperties } from 'react';

// Letters appear one by one, then each fills with colour from the bottom up.
const COLOURS = ['#226FA7', '#2D8668', '#226FA7', '#7556A8', '#B78106', '#2D8668', '#226FA7'];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3000);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen" aria-label="Loading website">
      <div className="loading-word" aria-hidden="true">
        {'LOADING'.split('').map((letter, index) => (
          <span key={index} data-l={letter} style={{ '--letter': index, '--c': COLOURS[index] } as CSSProperties}>{letter}</span>
        ))}
        <i />
      </div>
      <p>Preparing the learning experience</p>
    </div>
  );
}
