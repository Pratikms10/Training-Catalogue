import type { CSSProperties } from 'react';
import './teai360-ascent.css';

const stages = [
  { name: 'Awareness', color: '#e5f4ff', edge: '#b9ddf8', text: '#12386f', height: '43%' },
  { name: 'Adoption', color: '#73c2fb', edge: '#50a8e8', text: '#12386f', height: '55%' },
  { name: 'Automation', color: '#4b9fea', edge: '#327fce', text: '#ffffff', height: '67%' },
  { name: 'Augmentation', color: '#2666c4', edge: '#184b9d', text: '#ffffff', height: '80%' },
  { name: 'Acceleration', color: '#103e7d', edge: '#08295b', text: '#ffffff', height: '94%' },
] as const;

export default function TEAI360Section() {
  return (
    <section className="ai-framework" id="ai-journey" aria-labelledby="teai360-title">
      <header className="ai-framework-heading">
        <span>AI CAPABILITY FRAMEWORK</span>
        <h2 id="teai360-title">TE-AI360</h2>
        <p>Five levels of AI maturity.</p>
      </header>

      <div className="ai-framework-stage-window" role="group" aria-label="Five AI capability stages">
        <div className="ai-framework-stage-set">
          {stages.map((stage, index) => (
            <article
              className="ai-framework-stage"
              style={{
                '--stage-color': stage.color,
                '--stage-edge': stage.edge,
                '--stage-text': stage.text,
                '--stage-height': stage.height,
                '--stage-delay': `${index * 85}ms`,
              } as CSSProperties}
              key={stage.name}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{stage.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
