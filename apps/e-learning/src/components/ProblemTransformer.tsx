import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import icon84Slides from '../assets/images/icon_84_slides_1788161224198.jpg';
import icon126Sop from '../assets/images/icon_126_sop_1788161241570.jpg';
import iconSoftwareRollout from '../assets/images/icon_software_rollout_1788161261315.jpg';
import iconSleepyCompliance from '../assets/images/icon_sleepy_compliance_1788161284390.jpg';
import iconGlobalTeams from '../assets/images/icon_global_teams_1788161308027.jpg';
import iconSkillGap from '../assets/images/icon_skill_gap_1788161324906.jpg';

const topics = [
  { title: '84-slide PPT', result: 'A decision-led learning story', image: icon84Slides, color: '#8fd5ff' },
  { title: '126-page SOP', result: 'A searchable practice system', image: icon126Sop, color: '#ffad79' },
  { title: 'Software rollout', result: 'A safe hands-on simulator', image: iconSoftwareRollout, color: '#95dfc4' },
  { title: 'Annual compliance', result: 'A consequence-driven challenge', image: iconSleepyCompliance, color: '#f5a9d2' },
  { title: 'Global teams', result: 'One localized learning ecosystem', image: iconGlobalTeams, color: '#ffd065' },
  { title: 'A fuzzy skill gap', result: 'A measurable capability path', image: iconSkillGap, color: '#ff7770' },
];

function WaveCard({ item, index, progress, range }: { item: typeof topics[number]; index: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; range: [number, number] }) {
  const start = range[0] + index * 0.045;
  const end = range[1] + index * 0.045;
  const y = useTransform(progress, [start, end], [130 + index * 40, 0]);
  const x = useTransform(progress, [start, end], [index === 0 ? -120 : index === 2 ? 120 : 0, 0]);
  const rotate = useTransform(progress, [start, end], [index === 0 ? -12 : index === 2 ? 12 : 0, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.82, 1]);

  return (
    <motion.article className="wave-card" style={{ y, x, rotate, opacity, scale, background: item.color }}>
      <div className="wave-card__image"><img src={item.image} alt="" /></div>
      <span>YOUR RAW MATERIAL</span>
      <h3>{item.title}</h3>
      <div className="wave-card__line" />
      <p>{item.result}</p>
      <a href="#universe" aria-label={`Explore ${item.result}`}><ArrowUpRight className="h-5 w-5" /></a>
    </motion.article>
  );
}

export function ProblemTransformer() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const firstOpacity = useTransform(scrollYProgress, [0, 0.34, 0.41], [1, 1, 0]);
  const firstY = useTransform(scrollYProgress, [0.34, 0.43], [0, -110]);
  const secondOpacity = useTransform(scrollYProgress, [0.49, 0.58], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={section} id="problems" className="wave-runway">
      <div className="wave-stage">
        <motion.div className="wave-heading" style={{ y: headingY }}>
          <span>RAW IN. REMARKABLE OUT.</span>
          <h2>Whatever shape it’s in,<br /><em>we make it learnable.</em></h2>
          <p>Dense inputs become clear, useful experiences your workforce can apply.</p>
        </motion.div>
        <motion.div className="wave-row" style={{ opacity: firstOpacity, y: firstY }}>
          {topics.slice(0, 3).map((item, index) => <WaveCard key={item.title} item={item} index={index} progress={scrollYProgress} range={[0.08, 0.23]} />)}
        </motion.div>
        <motion.div className="wave-row" style={{ opacity: secondOpacity }}>
          {topics.slice(3, 6).map((item, index) => <WaveCard key={item.title} item={item} index={index} progress={scrollYProgress} range={[0.48, 0.64]} />)}
        </motion.div>
        <div className="wave-index">01 — 06 / ENTERPRISE LEARNING INPUTS</div>
      </div>
    </section>
  );
}
