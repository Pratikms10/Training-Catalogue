import { motion, type MotionValue, useScroll, useTransform } from 'motion/react';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

import formatAtlas from '../assets/formats-real/formats-contact-sheet.png';

type FormatItem = { number: string; title: string; what: string; includes: string; edge: string; position: string; accent: string };

const formats: FormatItem[] = [
  { number: '01', title: 'SCORM + xAPI', what: 'The technology behind trackable digital learning. SCORM helps courses run inside an LMS, while xAPI can capture learning activity beyond the course itself.', includes: 'LMS integration, completion and score tracking, learner activity, progress data and learning analytics.', edge: 'Track more than completion. Understand what learners actually do.', position: '0% 0%', accent: '#2f8fc8' },
  { number: '02', title: 'Video Learning', what: 'Learning through stories, demonstrations and visuals instead of walls of text. It can explain a process, show a skill or bring a real situation to life.', includes: 'Explainer videos, screen recordings, animation, expert-led content, scenarios, interactive video and AI-powered video experiences.', edge: 'We make video behave like a learning experience—not just something you press play on.', position: '50% 0%', accent: '#654ec7' },
  { number: '03', title: 'Microlearning', what: 'Small, focused learning built around one useful idea, skill or action. It gives people what they need without asking for a full hour of attention.', includes: 'Bite-sized videos, quick activities, short quizzes, reminders, job aids and learning nudges that work anytime, anywhere.', edge: "We don't shrink courses. We redesign learning around the moment that matters.", position: '100% 0%', accent: '#1b8064' },
  { number: '04', title: 'Gamification', what: 'Learning with challenges, choices, progress and rewards. The goal is to make practice more engaging without turning learning into a game for the sake of it.', includes: 'Missions, quests, challenges, XP, levels, rewards, progress systems, leaderboards and feedback.', edge: 'Points for better decisions—not badges for clicking Next.', position: '0% 50%', accent: '#a62d59' },
  { number: '05', title: 'Simulations', what: 'A safe version of the real thing. Learners practise a task, process, conversation or system before they have to do it for real.', includes: 'Interactive scenarios, software simulations, realistic workflows, branching decisions, practice environments, tests and feedback.', edge: 'See it → Try it → Get it wrong → Learn → Try again.', position: '50% 50%', accent: '#294bb8' },
  { number: '06', title: 'Immersive Learning', what: 'Learning that puts people inside the experience. 3D, 360°, AR, VR and virtual environments make situations feel more real and interactive.', includes: '3D environments, 360° experiences, AR/VR, virtual worlds, interactive hotspots and digital-twin experiences.', edge: 'Put people inside the situation before they have to face it for real.', position: '100% 50%', accent: '#7a48a6' },
  { number: '07', title: 'Assessments', what: 'A way to find out what people actually know—and what they can do with it. Not every assessment needs to be a traditional quiz.', includes: 'Knowledge checks, scenario-based assessments, skills assessments, live assessments, scoring, feedback and performance analysis.', edge: "Don't just test what they remember. See what they can do.", position: '0% 100%', accent: '#2f8fc8' },
  { number: '08', title: 'ILT + VILT', what: 'Live learning led by an instructor—face-to-face or virtually. The focus is on discussion, practice, coaching and real-time interaction.', includes: 'Instructor-led workshops, virtual sessions, facilitator guides, activities, role-plays, breakout exercises, live practice and digital follow-ups.', edge: 'Not another live PowerPoint. A live learning experience people actually participate in.', position: '50% 100%', accent: '#1b8064' },
  { number: '09', title: 'AI Learning', what: 'Learning that can respond to the learner. AI can explain, coach, simulate conversations, personalize practice and give feedback.', includes: 'AI chatbots, role-play, AI interviews, coaching, personalized learning, AI-generated microlearning, feedback and performance analysis.', edge: 'From chatbot → to coach, tutor, simulator and learning companion.', position: '100% 100%', accent: '#a62d59' },
];

function Reveal({ children }: { children: ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function FormatCard({ item, progress, enter, index }: { item: FormatItem; progress: MotionValue<number>; enter: [number, number]; index: number }) {
  const stagger = index * 0.018;
  const localEnter: [number, number] = [enter[0] + stagger, enter[1] + stagger];
  const x = useTransform(progress, localEnter, [index === 0 ? -170 : index === 2 ? 170 : 0, 0]);
  const y = useTransform(progress, localEnter, [index === 1 ? 180 : 110, 0]);
  const rotate = useTransform(progress, localEnter, [index === 0 ? -10 : index === 2 ? 10 : 2, 0]);
  const scale = useTransform(progress, localEnter, [0.86, 1]);
  // Three consistent rows per card: what it is, how it helps, what it includes.
  const [whatIs, ...rest] = item.what.split(/(?<=\.)\s+/).filter(Boolean);
  const rows = [
    { label: 'What it is', text: whatIs },
    { label: 'How it helps', text: rest.join(' ') },
    { label: 'Includes', text: item.includes },
  ];
  return (
    <motion.article className="format-card" style={{ x, y, rotate, scale, '--format-accent': ['var(--blue)', 'var(--green)', 'var(--gold)'][index % 3] } as unknown as CSSProperties}>
      <header className="format-card__header"><span>{item.number}</span><h3>{item.title}</h3></header>
      <div className="format-card__visual" style={{ backgroundImage: `url(${formatAtlas})`, backgroundPosition: item.position }} role="img" aria-label={`${item.title} in a realistic corporate learning environment`} />
      <dl className="format-card__rows">
        {rows.map(row => <div key={row.label} className="format-row"><dt>{row.label}</dt><dd>{row.text}</dd></div>)}
      </dl>
    </motion.article>
  );
}

function FormatGroup({ items, progress, enter, hold, exit, label }: { items: FormatItem[]; progress: MotionValue<number>; enter: [number, number]; hold: number; exit: [number, number] | null; label: string }) {
  const opacity = useTransform(progress, exit ? [enter[0], enter[1], hold, exit[1]] : [enter[0], enter[1], hold, 1], exit ? [0, 1, 1, 0] : [0, 1, 1, 1]);
  const filter = useTransform(progress, exit ? [hold, exit[1]] : [0, 1], exit ? ['blur(0px)', 'blur(14px)'] : ['blur(0px)', 'blur(0px)']);
  return <motion.div className="format-group" style={{ opacity, filter }}><div className="format-group__label">{label}</div><div className="format-grid">{items.map((item, index) => <FormatCard key={item.number} item={item} progress={progress} enter={enter} index={index} />)}</div></motion.div>;
}

export function FormatDeck() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  return (
    <section id="formats" ref={section} className="formats-runway">
      <div className="formats-stage">
        <div className="formats-heading"><Reveal><span><Sparkles size={14} /> PICK THE RIGHT FORMAT</span><h2>One business goal.<br /><em>Nine precise ways in.</em></h2></Reveal><div className="formats-count"><b>09</b><span>enterprise<br />learning formats</span></div></div>
        <div className="formats-deck">
          <FormatGroup items={formats.slice(0, 3)} progress={scrollYProgress} enter={[0.02, 0.12]} hold={0.25} exit={[0.25, 0.31]} label="01–03 / DIGITAL FOUNDATIONS" />
          <FormatGroup items={formats.slice(3, 6)} progress={scrollYProgress} enter={[0.34, 0.44]} hold={0.58} exit={[0.58, 0.65]} label="04–06 / PRACTICE + IMMERSION" />
          <FormatGroup items={formats.slice(6, 9)} progress={scrollYProgress} enter={[0.68, 0.78]} hold={0.93} exit={null} label="07–09 / ASSESS + CONNECT + ADAPT" />
        </div>
        <div className="formats-progress" aria-hidden="true"><motion.i style={{ scaleX: scrollYProgress }} /></div>
      </div>
    </section>
  );
}

export function ThreeSectionExperience() { return <main><FormatDeck /></main>; }
