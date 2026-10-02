import videoLearning from '../assets/hero-v2/video-learning.png';
import microlearning from '../assets/hero-v2/microlearning.png';
import gamification from '../assets/hero-v2/gamification.png';
import immersiveTraining from '../assets/hero-v2/immersive-training.png';

const formats = [
  { title: 'Video learning', image: videoLearning, tone: '#8fd5ff' },
  { title: 'Microlearning', image: microlearning, tone: '#ffb27b' },
  { title: 'Gamification', image: gamification, tone: '#9be0c8' },
  { title: 'Immersive training', image: immersiveTraining, tone: '#f7abd3' },
  { title: 'Video learning', image: videoLearning, tone: '#8fd5ff' },
  { title: 'Microlearning', image: microlearning, tone: '#ffb27b' },
  { title: 'Gamification', image: gamification, tone: '#9be0c8' },
  { title: 'Immersive training', image: immersiveTraining, tone: '#f7abd3' },
];

export function FormatSpiral() {
  return (
    <section className="format-spiral" aria-label="Enterprise learning format gallery">
      <div className="format-spiral__copy">
        <span>ONE STUDIO · MANY POSSIBILITIES</span>
        <h2>Built for how<br /><em>business learns.</em></h2>
        <p>From two-minute explainers to full spatial simulations.</p>
      </div>
      <div className="spiral-field" aria-hidden="true">
        {formats.map((format, index) => {
          const angle = (index / formats.length) * Math.PI * 2;
          const x = Math.sin(angle) * 290;
          const scale = 0.72 + (Math.cos(angle) + 1) * 0.18;
          return (
            <div
              className="spiral-slot"
              key={`${format.title}-${index}`}
              style={{ '--x': `${x}px`, '--mx': `${x * 0.48}px`, '--delay': `${index * -1.5}s` } as React.CSSProperties}
            >
              <div className="spiral-card" style={{ '--scale': scale, '--tone': format.tone } as React.CSSProperties}>
                <img src={format.image} alt="" />
                <strong>{format.title}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
