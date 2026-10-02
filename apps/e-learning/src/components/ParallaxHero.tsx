import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import corporateWorld from '../assets/hero-v2/corporate-world.png';
import videoLearning from '../assets/hero-v2/video-learning.png';
import microlearning from '../assets/hero-v2/microlearning.png';
import gamification from '../assets/hero-v2/gamification.png';
import immersiveTraining from '../assets/hero-v2/immersive-training.png';

const screens = [
  { label: 'Video learning', eyebrow: 'EXPLAIN · SHOW · APPLY', image: videoLearning },
  { label: 'Microlearning', eyebrow: '2–5 MINUTE MOMENTS', image: microlearning },
  { label: 'Gamification', eyebrow: 'XP · SKILLS · PROGRESS', image: gamification },
  { label: 'Immersive training', eyebrow: 'AR/VR · PRACTICE SAFELY', image: immersiveTraining },
];

const rotatingWords = ['PPT', 'compliance document', 'PDF', 'SOP', 'training manual'];
const shardStyles = [
  ['8%', '24%', '#ff765f', '18deg'], ['22%', '74%', '#86d9c0', '-22deg'],
  ['48%', '12%', '#f9a7cb', '34deg'], ['72%', '18%', '#75c9ff', '-12deg'],
  ['89%', '57%', '#ffb45d', '26deg'], ['60%', '79%', '#ee565d', '-34deg'],
];

export function ParallaxHero({ onOpenScoper }: { onOpenScoper: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState(0);
  const [word, setWord] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const copyOpacity = useTransform(scrollYProgress, [0, 0.38, 0.62], [1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.62], [0, -80]);
  const width = useTransform(scrollYProgress, [0, 0.24, 0.72], [47, 47, 90]);
  const tabletWidth = useMotionTemplate`${width}vw`;
  const tabletY = useTransform(scrollYProgress, [0, 0.68], [78, 12]);

  useEffect(() => {
    const screenTimer = window.setInterval(() => setScreen(value => (value + 1) % screens.length), 3600);
    const wordTimer = window.setInterval(() => setWord(value => (value + 1) % rotatingWords.length), 2100);
    return () => { window.clearInterval(screenTimer); window.clearInterval(wordTimer); };
  }, []);

  const tiltTablet = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tabletRef.current) return;
    const rect = tabletRef.current.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    tabletRef.current.style.setProperty('--tablet-rx', `${rx}deg`);
    tabletRef.current.style.setProperty('--tablet-ry', `${ry}deg`);
  };

  return (
    <section ref={sectionRef} className="hero-runway" id="hero">
      <div className="hero-stage">
        <img src={corporateWorld} alt="A bright fantasy corporate studio overlooking a natural landscape" className="hero-world" />
        <div className="hero-wash" />
        <div className="aero-shards" aria-hidden="true">
          {shardStyles.map(([left, top, color, rotate], index) => (
            <i key={index} style={{ left, top, background: color, rotate, animationDelay: `${index * -0.7}s` }} />
          ))}
        </div>

        <motion.div className="hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
          <div className="hero-kicker"><Sparkles className="h-4 w-4" /> AI-native learning studio for business</div>
          <h1>We create content<br />your team <span>actually opens.</span></h1>
          <p className="hero-subhead">Boring content. Minus the boring.</p>
          <div className="idea-rotator">
            <span>Turn my</span>
            <span className="idea-rotator__word" key={rotatingWords[word]}>{rotatingWords[word]}</span>
            <span>into something people use.</span>
          </div>
          <div className="hero-actions">
            <button onClick={onOpenScoper} className="hero-primary">Show me what’s possible <ArrowUpRight className="h-4 w-4" /></button>
            <a href="#problems" className="hero-secondary">I have a messy idea <ArrowDownRight className="h-4 w-4" /></a>
          </div>
        </motion.div>

        <motion.div className="tablet-wrap" style={{ width: tabletWidth, y: tabletY }}>
          <div ref={tabletRef} className="tablet-model" onPointerMove={tiltTablet} onPointerLeave={() => {
            tabletRef.current?.style.setProperty('--tablet-rx', '0deg');
            tabletRef.current?.style.setProperty('--tablet-ry', '0deg');
          }}>
            <div className="tablet-edge">
              <div className="tablet-camera" />
              <div className="tablet-screen">
                {screens.map((item, index) => (
                  <motion.img key={item.label} src={item.image} alt={`${item.label} interface for enterprise teams`}
                    initial={false}
                    animate={{ opacity: screen === index ? 1 : 0, scale: screen === index ? 1 : 1.035 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                ))}
                <div className="tablet-meta"><span>{screens[screen].eyebrow}</span><strong>{screens[screen].label}</strong></div>
                <button className="tablet-play" aria-label={`Open ${screens[screen].label}`}><Play className="h-4 w-4 fill-current" /></button>
              </div>
              <div className="tablet-glare" />
            </div>
            <div className="tablet-shadow" />
          </div>
          <div className="tablet-tabs" aria-label="Learning formats">
            {screens.map((item, index) => (
              <button key={item.label} className={screen === index ? 'is-active' : ''} onClick={() => setScreen(index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="hero-scroll-note"><span /> Scroll to expand the experience</div>
      </div>
    </section>
  );
}
