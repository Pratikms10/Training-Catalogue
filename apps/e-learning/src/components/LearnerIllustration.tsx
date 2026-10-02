import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, animate, useAnimation, useSpring } from 'motion/react';
import {
  FileText, CheckCircle2, Sparkles,
  Search, Compass,
  Scale, ShieldAlert, GitFork,
  Cpu, Trophy,
  ShieldCheck, AlertTriangle, Laptop, MousePointerClick, Rocket, BadgeCheck, Play, Pause
} from 'lucide-react';

import lvl1Img from '../assets/images/same_person_lvl1.jpg';
import lvl2Img from '../assets/images/same_person_lvl2.jpg';
import lvl3Img from '../assets/images/same_person_lvl3.jpg';
import lvl4Img from '../assets/images/same_person_lvl4.jpg';

interface LearnerIllustrationProps {
  level: 1 | 2 | 3 | 4;
}

const LEVEL_DETAILS = {
  1: {
    image: lvl1Img,
    expressionLabel: 'Expression: Calm, Receptive & Clear Understanding',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    ringColor: 'ring-sky-400/70 border-sky-400',
    glowColor: 'from-sky-400/25 via-blue-200/15 to-transparent',
    components: {
      left: {
        icon: <FileText className="w-4 h-4 text-sky-600" />,
        title: 'Bite-Sized Delivery',
        subtitle: 'Zero-Friction Audio & Text',
        metric: 'Speed: 2.5x Faster',
        color: 'border-sky-200 bg-white/95 text-sky-900 shadow-sky-100/50',
      },
      right: {
        icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
        title: 'Quick Comprehension',
        subtitle: 'High Clarity & Retention',
        metric: 'Retention: 92%',
        color: 'border-teal-200 bg-white/95 text-teal-900 shadow-teal-100/50',
      },
      status: {
        icon: <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
        label: 'Cognitive State: Calm, Receptive & Informed',
        color: 'bg-sky-50/95 text-sky-900 border-sky-200/80',
      },
    },
  },
  2: {
    image: lvl2Img,
    expressionLabel: 'Expression: Curious & Hands-On Discovery',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    ringColor: 'ring-cyan-400/70 border-cyan-400',
    glowColor: 'from-cyan-400/30 via-teal-300/15 to-transparent',
    components: {
      left: {
        icon: <Search className="w-4 h-4 text-cyan-600" />,
        title: 'Interactive Hotspots',
        subtitle: 'Self-Paced Navigation',
        metric: 'Active Discovery',
        color: 'border-cyan-200 bg-white/95 text-cyan-900 shadow-cyan-100/50',
      },
      right: {
        icon: <Compass className="w-4 h-4 text-teal-600" />,
        title: 'Workflow Mapping',
        subtitle: 'Cause & Effect Drills',
        metric: 'High Engagement',
        color: 'border-teal-200 bg-white/95 text-teal-900 shadow-teal-100/50',
      },
      status: {
        icon: <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />,
        label: 'Cognitive State: Intrigued, Active & Exploring',
        color: 'bg-cyan-50/95 text-cyan-900 border-cyan-200/80',
      },
    },
  },
  3: {
    image: lvl3Img,
    expressionLabel: 'Expression: Analytical & Weighing Dilemma',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ringColor: 'ring-indigo-500/70 border-indigo-500',
    glowColor: 'from-indigo-500/30 via-purple-400/15 to-transparent',
    components: {
      left: {
        icon: <Scale className="w-4 h-4 text-indigo-600" />,
        title: 'Trade-off Dilemma',
        subtitle: 'Compliance vs Revenue',
        metric: 'High Stakes: 95%',
        color: 'border-indigo-200 bg-white/95 text-indigo-900 shadow-indigo-100/50',
      },
      right: {
        icon: <ShieldAlert className="w-4 h-4 text-blue-600" />,
        title: 'Dynamic Consequence Engine',
        subtitle: 'Simulated Real-World Fallout',
        metric: 'Live Impact Feedback',
        color: 'border-blue-200 bg-white/95 text-blue-900 shadow-blue-100/50',
      },
      status: {
        icon: <GitFork className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
        label: 'Cognitive State: Critical Thinking Under Ambiguity',
        color: 'bg-indigo-50/95 text-indigo-900 border-indigo-200/80',
      },
    },
  },
  4: {
    image: lvl4Img,
    expressionLabel: 'Expression: Confident & Operational Mastery',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    ringColor: 'ring-emerald-500/80 border-emerald-500',
    glowColor: 'from-emerald-400/35 via-teal-300/20 to-transparent',
    components: {
      left: {
        icon: <Cpu className="w-4 h-4 text-emerald-600" />,
        title: 'Full Sandbox Simulator',
        subtitle: 'Live Software Replica',
        metric: 'Safe Autonomy',
        color: 'border-emerald-200 bg-white/95 text-emerald-900 shadow-emerald-100/50',
      },
      right: {
        icon: <Trophy className="w-4 h-4 text-amber-500" />,
        title: 'Verified Competence',
        subtitle: 'Zero-Assistance Execution',
        metric: '100% Ready for Prod',
        color: 'border-amber-200 bg-white/95 text-amber-900 shadow-amber-100/50',
      },
      status: {
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
        label: 'Cognitive State: Confident, Autonomous & Job-Ready',
        color: 'bg-emerald-50/95 text-emerald-900 border-emerald-200/80',
      },
    },
  },
};

export function LearnerIllustration({ level }: LearnerIllustrationProps) {
  const current = LEVEL_DETAILS[level] || LEVEL_DETAILS[1];

  return (
    <div className="relative w-full max-w-[600px] lg:max-w-none flex items-center justify-center select-none py-1">
      {/* Background ambient radial glow matching cognitive depth */}
      <div
        className={`absolute inset-0 bg-radial ${current.glowColor} rounded-full blur-3xl opacity-70 transition-all duration-700 pointer-events-none`}
      />

      {/* Floating Realistic Left Component Card */}
      <motion.div
        key={`left-card-${level}`}
        initial={{ opacity: 0, x: -20, y: -4, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`absolute -left-4 sm:-left-6 lg:-left-8 top-4 sm:top-8 lg:top-12 z-20 px-3.5 py-2 rounded-2xl border shadow-lg flex items-center gap-3 backdrop-blur-md max-w-[180px] sm:max-w-[200px] ${current.components.left.color}`}
      >
        <div className="p-2 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
          {current.components.left.icon}
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[11px] sm:text-xs font-black leading-tight truncate">
            {current.components.left.title}
          </span>
          <span className="block text-[10px] sm:text-[11px] font-semibold text-[#727175] leading-none mt-1 truncate">
            {current.components.left.subtitle}
          </span>
        </div>
      </motion.div>

      {/* Floating Realistic Right Component Card */}
      <motion.div
        key={`right-card-${level}`}
        initial={{ opacity: 0, x: 20, y: -4, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
        className={`absolute -right-4 sm:-right-6 lg:-right-8 bottom-4 sm:bottom-8 lg:bottom-12 z-20 px-3.5 py-2 rounded-2xl border shadow-lg flex items-center gap-3 backdrop-blur-md max-w-[180px] sm:max-w-[200px] ${current.components.right.color}`}
      >
        <div className="p-2 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
          {current.components.right.icon}
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[11px] sm:text-xs font-black leading-tight truncate">
            {current.components.right.title}
          </span>
          <span className="block text-[10px] sm:text-[11px] font-semibold text-[#727175] leading-none mt-1 truncate">
            {current.components.right.subtitle}
          </span>
        </div>
      </motion.div>

      {/* Centerpiece: Interactive Players or Realistic Person Portrait */}
      <div className="relative z-10 flex flex-col items-center">
        {level === 1 ? (
          <Level1Player />
        ) : level === 2 ? (
          <Level2Player />
        ) : level === 3 ? (
          <Level3Player />
        ) : level === 4 ? (
          <Level4Player />
        ) : (
          <div
            className={`relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[440px] max-h-[50vh] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-2xl border-2 transition-all duration-500 ring-4 ${current.ringColor}`}
          >
            <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative bg-[#eef2f6]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`learner-img-${level}`}
                  src={current.image}
                  alt={`Learner expression at Level ${level}: ${current.expressionLabel}`}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center select-none"
                />
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LEVEL 2: THE DISCOVERY ROOM
// ============================================================================

type Level2Slot = { id: string; label: string; isCorrect: boolean };

const LEVEL2_SCENARIOS = [
  {
    hs1: "Pressure gauge reading is above the safe threshold.",
    hs2: "Emergency stop is here — use only if instructed.",
    slots: [
      { id: '1-1', label: "Ignore & continue", isCorrect: false },
      { id: '1-2', label: "Notify supervisor & pause line", isCorrect: true },
      { id: '1-3', label: "Reset without checking", isCorrect: false },
    ]
  },
  {
    hs1: "Suspicious login attempt from unknown IP.",
    hs2: "Security agent disabled on local machine.",
    slots: [
      { id: '2-1', label: "Ignore it", isCorrect: false },
      { id: '2-2', label: "Report it to IT", isCorrect: true },
      { id: '2-3', label: "Change the password immediately", isCorrect: false },
    ]
  },
  {
    hs1: "Confidential files sent to personal email.",
    hs2: "Database backup downloaded locally.",
    slots: [
      { id: '3-1', label: "Delete local copies", isCorrect: false },
      { id: '3-2', label: "Escalate to compliance team", isCorrect: true },
      { id: '3-3', label: "Email employee to stop", isCorrect: false },
    ]
  }
];

function Level2Player() {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = prefersReducedMotion === true;
  const tokenControls = useAnimation();

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [activeSlots, setActiveSlots] = useState<Level2Slot[]>([]);
  const [discovered, setDiscovered] = useState<Set<number>>(new Set());
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isTokenSelected, setIsTokenSelected] = useState(false);
  
  const slotRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const initScenario = () => {
    const idx = Math.floor(Math.random() * LEVEL2_SCENARIOS.length);
    setScenarioIdx(idx);
    const scenario = LEVEL2_SCENARIOS[idx];
    const shuffled = [...scenario.slots].sort(() => Math.random() - 0.5);
    setActiveSlots(shuffled);
    setDiscovered(new Set());
    setActiveTooltip(null);
    setIsSolved(false);
    setIsTokenSelected(false);
  };

  // Setup initial scenario
  useEffect(() => {
    initScenario();
  }, []);

  // Auto-reset when solved
  useEffect(() => {
    if (isSolved) {
      const t = setTimeout(() => {
        initScenario();
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [isSolved]);

  const handleDragEnd = (event: any, info: any) => {
    setActiveTooltip(null);
    const tokenX = info.point.x;
    const tokenY = info.point.y;
    
    let droppedSlotId: string | null = null;
    
    // Compare token's center point against each slot's bounding rect via refs
    slotRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      if (
        tokenX >= rect.left &&
        tokenX <= rect.right &&
        tokenY >= rect.top &&
        tokenY <= rect.bottom
      ) {
        droppedSlotId = id;
      }
    });

    if (droppedSlotId) {
      handleSlotInteraction(droppedSlotId);
    }
    // Note: Framer Motion automatically snaps back if `dragSnapToOrigin` is true
    // and we don't lock its position, which satisfies the spec for wrong drops.
  };

  const handleSlotInteraction = async (slotId: string) => {
    const slot = activeSlots.find(s => s.id === slotId);
    if (slot?.isCorrect) {
      setIsSolved(true);
      setIsTokenSelected(false);
    } else {
      setIsTokenSelected(false);
      // Gentle shake animation on error
      if (!isReduced) {
        await tokenControls.start({ x: [-6, 6, -6, 6, 0], transition: { duration: 0.3 } });
      }
    }
  };

  const currentScenario = LEVEL2_SCENARIOS[scenarioIdx] || LEVEL2_SCENARIOS[0];

  let instructionText = "Tap the highlighted spots to investigate the panel.";
  if (isSolved) {
    instructionText = "Nice catch. That's exactly the right call.";
  } else if (discovered.size > 0) {
    instructionText = "Now drag the alert to the right response.";
  }

  return (
    <div className={`relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[440px] max-h-[50vh] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-2xl border-2 transition-all duration-500 ring-4 ring-cyan-400/70 border-cyan-600/20`}>
      <div 
        className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative flex flex-col bg-white text-left"
        onClick={(e) => {
          // Close tooltips if clicking background
          if ((e.target as HTMLElement).closest('.hotspot-btn') === null) {
            setActiveTooltip(null);
          }
        }}
      >
        
        {/* Zone A: The Scene */}
        <div className="flex-1 relative bg-gradient-to-br from-[#e6f8ff] to-[#cbf0ff] p-3 flex flex-col items-center justify-start overflow-hidden">
          
          {/* Workstation Panel background */}
          <div className="w-[85%] h-[50%] mt-2 bg-white/70 backdrop-blur-sm border border-cyan-200 rounded-2xl shadow-sm relative flex flex-col items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full border-[6px] border-cyan-50 flex items-center justify-center">
              <div className="w-1.5 h-6 bg-cyan-200 rounded-full origin-bottom rotate-[40deg] mb-3" />
            </div>
            <div className="flex gap-2 mt-3">
              <div className="w-4 h-1.5 bg-cyan-200 rounded-full" />
              <div className="w-4 h-1.5 bg-cyan-200 rounded-full" />
              <div className="w-4 h-1.5 bg-cyan-300 rounded-full" />
            </div>
          </div>

          {/* Hotspot 1 */}
          <DiscoveryHotspot 
            top="15%" left="20%" 
            isActive={activeTooltip === 1}
            isDiscovered={discovered.has(1)}
            tooltip={currentScenario.hs1}
            isReduced={isReduced}
            onClick={() => {
              setActiveTooltip(activeTooltip === 1 ? null : 1);
              setDiscovered(prev => new Set(prev).add(1));
            }}
          />

          {/* Hotspot 2 */}
          <DiscoveryHotspot 
            bottom="50%" right="15%" 
            isActive={activeTooltip === 2}
            isDiscovered={discovered.has(2)}
            tooltip={currentScenario.hs2}
            isReduced={isReduced}
            onClick={() => {
              setActiveTooltip(activeTooltip === 2 ? null : 2);
              setDiscovered(prev => new Set(prev).add(2));
            }}
          />

          {/* Drag & Drop Task Area */}
          <div className="w-full mt-auto mb-1 relative flex flex-col items-center gap-1.5">
            {/* Draggable Token Start Position */}
            <div className="h-10 w-full flex justify-center items-center relative z-20">
              {!isSolved && (
                <motion.div animate={tokenControls}>
                  <motion.button
                    drag
                    dragSnapToOrigin
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={() => setActiveTooltip(null)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setIsTokenSelected(!isTokenSelected)}
                    className={`w-10 h-10 rounded-full bg-cyan-100 border-2 border-cyan-600 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-4 ring-cyan-500 transition-shadow ${isTokenSelected ? 'ring-4 ring-cyan-500' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label="Alert: select, then choose a response"
                    title="Drag me to a response"
                  >
                    <AlertTriangle className="w-5 h-5 text-cyan-600 pointer-events-none" />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Drop Slots Row */}
            <div className="w-full flex gap-1.5 justify-center z-10 px-1">
              {activeSlots.map(slot => (
                <button
                  key={slot.id}
                  ref={(el) => {
                    if (el) slotRefs.current.set(slot.id, el);
                    else slotRefs.current.delete(slot.id);
                  }}
                  data-drop-slot={slot.id}
                  onClick={() => {
                    if (isTokenSelected && !isSolved) handleSlotInteraction(slot.id);
                  }}
                  disabled={isSolved || (!isTokenSelected && !isSolved)}
                  aria-label={`Response slot: ${slot.label}`}
                  className={`relative flex-1 py-1.5 px-1 rounded-lg border flex items-center justify-center transition-all min-h-[44px] ${
                    isSolved && slot.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-inner'
                      : isTokenSelected && !isSolved
                      ? 'bg-white border-cyan-400 border-dashed animate-pulse cursor-pointer'
                      : 'bg-white/90 border-cyan-200 text-cyan-700'
                  }`}
                >
                  <span className={`text-[9px] sm:text-[10px] font-bold leading-tight text-center ${isSolved && slot.isCorrect ? 'mt-5' : ''}`}>
                    {slot.label}
                  </span>
                  
                  {isSolved && slot.isCorrect && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-7 h-7 rounded-full bg-cyan-100 border-2 border-cyan-600 flex items-center justify-center shadow-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <Level2Confetti isReduced={isReduced} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Zone B: Caption Bar */}
        <div className="h-16 sm:h-20 bg-white border-t border-cyan-600/10 px-4 py-2 flex items-center relative overflow-hidden shrink-0">
          <p className="text-sm font-bold text-cyan-900 leading-tight">
            {instructionText}
          </p>
        </div>

        {/* Zone C: Progress Bar */}
        <div className="h-8 sm:h-10 bg-cyan-50 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-bold text-cyan-700 shadow-sm border border-cyan-200/50">
              Explored {discovered.size}/2
            </div>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm border ${isSolved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-cyan-700 border-cyan-200/50'}`}>
              Response: {isSolved ? 'Correct' : 'Not placed'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DiscoveryHotspot({ top, bottom, left, right, onClick, isActive, isDiscovered, tooltip, isReduced }: any) {
  return (
    <div className="absolute z-20" style={{ top, bottom, left, right }}>
      <button 
        onClick={onClick}
        aria-label="Investigate hotspot"
        aria-pressed={isActive}
        className="hotspot-btn relative w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm border border-cyan-300 focus:outline-none focus-visible:ring-2 ring-cyan-500 z-10"
      >
        {isDiscovered ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Search className="w-4 h-4 text-cyan-600" />
        )}
        
        {/* Pulsing attention ring */}
        {!isDiscovered && !isReduced && (
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </button>

      {/* Tooltip Popup */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-36 bg-white rounded-lg shadow-xl border border-cyan-100 p-2 text-[10px] font-medium text-cyan-900 leading-tight text-center z-30 pointer-events-none"
          >
            {/* Callout Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-cyan-100 rotate-45" />
            <span className="relative z-10">{tooltip}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Level2Confetti({ isReduced }: { isReduced: boolean }) {
  if (isReduced) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 flex pointer-events-none z-50">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 50 - 10,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500"
        />
      ))}
    </div>
  );
}


// ============================================================================
// LEVEL 1: INTERACTIVE MINI VIDEO-PLAYER COMPONENTS
// ============================================================================

const SCRIPTS = [
  [
    { icon: ShieldCheck, caption: "Every shift starts the same way: check, confirm, go.", image: "https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80&w=800" },
    { icon: AlertTriangle, caption: "Spot the hazard before it spots you.", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800" },
    { icon: CheckCircle2, caption: "Simple habits. Zero incidents. That's the goal.", image: "https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?auto=format&fit=crop&q=80&w=800" }
  ],
  [
    { icon: Laptop, caption: "New system, same job — just faster.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" },
    { icon: MousePointerClick, caption: "Three clicks replace what used to take ten.", image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800" },
    { icon: Rocket, caption: "You'll be faster than the old system by Friday.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" }
  ],
  [
    { icon: FileText, caption: "One policy changed. Here's exactly what it means for you.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" },
    { icon: Scale, caption: "Same rules, clearer boundaries, less guesswork.", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800" },
    { icon: BadgeCheck, caption: "You're covered. You're compliant. You're done.", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" }
  ]
];

function Level1Player() {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = prefersReducedMotion === true;
  const progress = useMotionValue(0);
  
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'complete'>('idle');
  const [scriptIdx, setScriptIdx] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  // Initial random script selection
  useEffect(() => {
    setScriptIdx(Math.floor(Math.random() * 3));
  }, []);

  // Animation Engine
  useEffect(() => {
    let controls: any;
    if (status === 'playing') {
      const current = progress.get();
      if (current >= 1) progress.set(0);
      
      const p = progress.get();
      const duration = (1 - p) * 9; // 9 seconds total simulation
      
      controls = animate(progress, 1, {
        duration,
        ease: 'linear',
        onUpdate: (v) => {
          const newIndex = v >= 0.666 ? 2 : v >= 0.333 ? 1 : 0;
          setSlideIndex((prev) => prev !== newIndex ? newIndex : prev);
        },
        onComplete: () => {
          setStatus('complete');
          setSlideIndex(2);
        }
      });
    }
    return () => controls?.stop();
  }, [status, progress]);

  // Completion State Reset
  useEffect(() => {
    if (status === 'complete') {
      const t = setTimeout(() => {
        setStatus('idle');
        progress.set(0);
        setSlideIndex(0);
        setScriptIdx(Math.floor(Math.random() * 3));
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status, progress]);

  const handlePlayerClick = () => {
    if (status === 'idle') {
      setScriptIdx(Math.floor(Math.random() * 3));
      progress.set(0);
      setSlideIndex(0);
      setStatus('playing');
    } else if (status === 'paused') {
      setStatus('playing');
    } else if (status === 'playing') {
      setStatus('paused');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayerClick();
    }
  };

  const activeScript = SCRIPTS[scriptIdx];
  const slideData = activeScript[slideIndex];
  const Icon = status === 'complete' ? CheckCircle2 : slideData.icon;
  const iconColor = status === 'complete' ? 'text-green-600' : 'text-sky-600';

  // Format progress fill display according to motion preferences
  const visualProgress = useTransform(progress, (p) => {
    if (isReduced) {
      if (p >= 1) return 1;
      if (p >= 0.666) return 0.666;
      if (p >= 0.333) return 0.333;
      return 0;
    }
    return p;
  });

  return (
    <div className={`relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[440px] max-h-[50vh] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-2xl border-2 transition-all duration-500 ring-4 ring-sky-400/70 border-sky-400`}>
      <div 
        role="button"
        tabIndex={0}
        aria-label={status === 'playing' ? "Pause example lesson" : status === 'paused' ? "Resume example lesson" : "Play example lesson"}
        className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative flex flex-col bg-white cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 text-left group"
        onClick={handlePlayerClick}
        onKeyDown={handleKeyDown}
      >
        
        {/* Zone A: Slide Art */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={status === 'complete' ? 'complete' : slideIndex}
              initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={isReduced ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: isReduced ? 0 : 0.5 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {status !== 'complete' ? (
                <>
                  <motion.img
                    src={slideData.image}
                    alt={slideData.caption}
                    initial={isReduced ? { scale: 1 } : { scale: 1.05 }}
                    animate={isReduced ? { scale: 1 } : { scale: 1.15 }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  {/* Subtle vignette for cinematic video feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9 }} 
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md shadow-xl flex items-center justify-center border border-white/20"
                >
                  <CheckCircle2 className="w-14 h-14 text-green-400" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Visual Play Button Overlay */}
          <AnimatePresence>
            {(status === 'idle' || status === 'paused') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 w-full h-full flex items-center justify-center z-10 bg-black/40 backdrop-blur-[2px]"
              >
                <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center shadow-lg ring-4 ring-white/50 group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone B: Caption Bar */}
        <div className="h-16 sm:h-20 bg-white border-t border-sky-600/10 px-4 py-2 flex items-center relative overflow-hidden shrink-0">
          {status === 'idle' ? (
            <span className="text-sm font-bold text-slate-700">Click play to preview a 9-second lesson.</span>
          ) : status === 'complete' ? (
            <div className="relative flex items-center">
              <span className="text-sm font-bold text-green-700">Lesson complete.</span>
              <Confetti isReduced={isReduced} />
            </div>
          ) : (
            <p className="text-sm font-bold text-sky-900 leading-tight">
              {slideData.caption.split(' ').map((word, i, arr) => (
                <CaptionWord 
                  key={`${scriptIdx}-${slideIndex}-${i}`} 
                  word={word} 
                  index={i} 
                  total={arr.length}
                  slideIndex={slideIndex}
                  progress={progress}
                  isReduced={isReduced}
                />
              ))}
            </p>
          )}
        </div>

        {/* Zone C: Progress + Soundwave */}
        <div className="h-8 sm:h-10 bg-sky-50 flex items-center px-4 gap-4 shrink-0">
          <div className="flex items-center gap-[3px] shrink-0 h-4">
            {[...Array(9)].map((_, i) => (
              <SoundwaveBar key={i} playing={status === 'playing'} isReduced={isReduced} />
            ))}
          </div>
          <div className="flex-1 h-1.5 bg-sky-100 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-sky-600 w-full origin-left"
              style={{ scaleX: visualProgress }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------------

function CaptionWord({ 
  word, 
  index, 
  total, 
  slideIndex, 
  progress, 
  isReduced 
}: { 
  word: string; 
  index: number; 
  total: number; 
  slideIndex: number; 
  progress: any; 
  isReduced: boolean; 
}) {
  const slideStart = slideIndex * (1/3);
  // Reveal words evenly over the first 80% of the slide duration
  const revealTime = slideStart + (index / total) * (1/3) * 0.8;
  
  const opacity = useTransform(progress, (p: number) => {
    if (isReduced) return p >= slideStart ? 1 : 0;
    return p >= revealTime ? 1 : 0;
  });

  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

function SoundwaveBar({ playing, isReduced }: { playing: boolean; isReduced: boolean }) {
  const staticHeight = useMemo(() => 4 + Math.random() * 8, []);
  const activeHeight = playing && !isReduced ? [4, staticHeight + 4, 4] : 4;

  return (
    <motion.div
      className="w-[2px] bg-sky-400/80 rounded-full"
      animate={{ height: isReduced ? staticHeight : activeHeight }}
      transition={
        playing && !isReduced
          ? { duration: 0.4 + Math.random() * 0.3, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
    />
  );
}

function Confetti({ isReduced }: { isReduced: boolean }) {
  if (isReduced) return null;
  
  return (
    <div className="absolute left-full ml-2 flex gap-1 pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40 - 10,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-1.5 h-1.5 rounded-full bg-green-500"
        />
      ))}
    </div>
  );
}

// ============================================================================
// LEVEL 3: DECISION CONSEQUENCES (The Crossroads)
// ============================================================================

type Level3Outcome = {
  stamp: 'good' | 'bad';
  line: string;
  meterLeftValue: number;
  meterRightValue: number;
};

type Level3Scenario = {
  prompt: string;
  meterLeftLabel: string;
  meterRightLabel: string;
  choiceA: { label: string; outcome: Level3Outcome };
  choiceB: { label: string; outcome: Level3Outcome };
};

const LEVEL3_SCENARIOS: Level3Scenario[] = [
  {
    prompt: "A big client wants you to skip a compliance check to hit their deadline. What do you do?",
    meterLeftLabel: "Compliance",
    meterRightLabel: "Revenue",
    choiceA: {
      label: "Skip it, hit the deadline",
      outcome: {
        stamp: 'bad',
        line: "The shortcut gets flagged in an audit three months later.",
        meterLeftValue: 20,
        meterRightValue: 80,
      }
    },
    choiceB: {
      label: "Delay one day, run the check",
      outcome: {
        stamp: 'good',
        line: "The client grumbles, but the audit comes back clean.",
        meterLeftValue: 80,
        meterRightValue: 40,
      }
    }
  },
  {
    prompt: "Your team lead wants to ship untested code before the deadline. What do you do?",
    meterLeftLabel: "Quality",
    meterRightLabel: "Speed",
    choiceA: {
      label: "Ship now, test later",
      outcome: {
        stamp: 'bad',
        line: "A bug hits production — three days of firefighting follow.",
        meterLeftValue: 20,
        meterRightValue: 80,
      }
    },
    choiceB: {
      label: "Delay one day, test first",
      outcome: {
        stamp: 'good',
        line: "It ships clean. The client barely notices the delay.",
        meterLeftValue: 80,
        meterRightValue: 40,
      }
    }
  },
  {
    prompt: "A customer asks you to share another customer's account details, 'just this once.' What do you do?",
    meterLeftLabel: "Privacy",
    meterRightLabel: "Satisfaction",
    choiceA: {
      label: "Share it to keep them happy",
      outcome: {
        stamp: 'bad',
        line: "A privacy violation gets logged. Trust takes the hit.",
        meterLeftValue: 20,
        meterRightValue: 80,
      }
    },
    choiceB: {
      label: "Decline and explain the policy",
      outcome: {
        stamp: 'good',
        line: "The customer respects the boundary. No incident, no fallout.",
        meterLeftValue: 80,
        meterRightValue: 40,
      }
    }
  }
];

function Level3Player() {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = prefersReducedMotion === true;
  
  const [status, setStatus] = useState<'prompt' | 'resolved'>('prompt');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedChoice, setPickedChoice] = useState<'a' | 'b' | null>(null);
  const [showingChoice, setShowingChoice] = useState<'a' | 'b' | null>(null);
  
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setScenarioIdx(Math.floor(Math.random() * LEVEL3_SCENARIOS.length));
  }, []);

  const startResetTimer = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setStatus('prompt');
      setPickedChoice(null);
      setShowingChoice(null);
      setScenarioIdx(Math.floor(Math.random() * LEVEL3_SCENARIOS.length));
    }, 4000);
  };

  const handleChoice = (choice: 'a' | 'b') => {
    setStatus('resolved');
    setPickedChoice(choice);
    setShowingChoice(choice);
    startResetTimer();
  };

  const toggleOutcome = () => {
    setShowingChoice(prev => prev === 'a' ? 'b' : 'a');
    startResetTimer();
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const activeScenario = LEVEL3_SCENARIOS[scenarioIdx];
  const activeOutcome = showingChoice === 'a' ? activeScenario.choiceA.outcome : showingChoice === 'b' ? activeScenario.choiceB.outcome : null;

  return (
    <div className={`relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[440px] max-h-[50vh] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-2xl border-2 transition-all duration-500 ring-4 ring-indigo-500/70 border-indigo-600/20`}>
      <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative flex flex-col bg-white text-left">
        
        {/* Zone A: The Dilemma / Outcome Stage */}
        <div className="flex-1 relative bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] flex flex-col items-center justify-center p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'prompt' ? (
              <motion.div
                key="prompt"
                initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: isReduced ? 0 : 0.2 }}
                className="flex flex-col items-center w-full h-full justify-center space-y-4 sm:space-y-6"
              >
                <p className="text-sm font-bold text-indigo-900 text-center max-w-[90%] leading-snug">
                  {activeScenario.prompt}
                </p>
                <div className="w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => handleChoice('a')}
                    aria-label={`Choice A: ${activeScenario.choiceA.label}`}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white shadow-sm border border-indigo-100 text-indigo-900 font-semibold text-xs sm:text-sm text-center hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                  >
                    {activeScenario.choiceA.label}
                  </button>
                  <button
                    onClick={() => handleChoice('b')}
                    aria-label={`Choice B: ${activeScenario.choiceB.label}`}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white shadow-sm border border-indigo-100 text-indigo-900 font-semibold text-xs sm:text-sm text-center hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                  >
                    {activeScenario.choiceB.label}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="resolved"
                initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: isReduced ? 0 : 0.2 }}
                className="flex flex-col items-center w-full h-full justify-center space-y-5"
              >
                <motion.div
                  initial={isReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={isReduced ? { duration: 0 } : { type: 'spring', bounce: 0.5, duration: 0.6 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-md flex items-center justify-center border border-indigo-50"
                >
                  {activeOutcome?.stamp === 'good' ? (
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
                  )}
                </motion.div>
                
                <button
                  onClick={toggleOutcome}
                  aria-label="Show the outcome of the other choice"
                  className="text-[10px] sm:text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded px-2 transition-colors"
                >
                  See what the other path led to
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone B: Outcome/Caption Bar */}
        <div className="h-16 sm:h-[72px] bg-white border-t border-indigo-600/10 px-4 py-2 flex items-center justify-center relative overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            {status === 'prompt' ? (
              <motion.p
                key="caption-prompt"
                initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: isReduced ? 0 : 0.2 }}
                className="text-xs sm:text-sm font-semibold text-slate-500 text-center"
              >
                Pick a path — every choice has a consequence.
              </motion.p>
            ) : (
              <motion.p
                key="caption-resolved"
                initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: isReduced ? 0 : 0.2 }}
                className={`text-xs sm:text-sm font-bold leading-tight text-center ${activeOutcome?.stamp === 'good' ? 'text-indigo-900' : 'text-rose-900'}`}
              >
                {activeOutcome?.line}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Zone C: Consequence Meter */}
        <div className="h-8 sm:h-[32px] bg-indigo-50/70 flex items-center px-4 gap-2 relative shrink-0">
          <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-wider min-w-[60px]">
            {activeScenario.meterLeftLabel}
          </span>
          <div className="flex-1 h-1.5 bg-indigo-200/50 rounded-full relative">
             <div className="absolute top-0 bottom-0 left-1/2 w-px bg-indigo-300 -translate-x-1/2" />
             <motion.div
               className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-600 shadow-sm"
               initial={false}
               animate={{
                 left: status === 'prompt' ? '50%' : `${activeOutcome?.meterLeftValue || 50}%`
               }}
               style={{ x: '-50%' }}
               transition={isReduced ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.6 }}
             />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-wider min-w-[60px] text-right">
            {activeScenario.meterRightLabel}
          </span>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// LEVEL 4: THE 3D SANDBOX (Full Sandbox Simulator)
// ============================================================================

function Level4Player() {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = prefersReducedMotion === true;

  const [mission1Complete, setMission1Complete] = useState(false);
  const [mission2Complete, setMission2Complete] = useState(false);
  const [activeMission, setActiveMission] = useState<1 | 2 | null>(null);
  
  const [mastery, setMastery] = useState(false);
  const [firstMissionFocus, setFirstMissionFocus] = useState<1 | 2>(1);
  
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = isReduced ? { stiffness: 300, damping: 30 } : { stiffness: 100, damping: 20 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Drag interaction
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startRotate = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startRotate.current = { x: rotateX.get(), y: rotateY.get() };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    
    // Map horizontal drag to rotateY, vertical to rotateX (inverted so dragging up tilts floor up)
    let newRotY = startRotate.current.y + deltaX * 0.4;
    let newRotX = startRotate.current.x - deltaY * 0.4;
    
    // Clamp
    newRotY = Math.max(-35, Math.min(35, newRotY));
    newRotX = Math.max(-15, Math.min(15, newRotX));
    
    rotateY.set(newRotY);
    rotateX.set(newRotX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Idle drift
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  
  useEffect(() => {
    if (isReduced) return;
    
    const driftInterval = setInterval(() => {
      if (!isDragging.current && !activeMission && !mastery) {
        animate(driftX, (Math.random() - 0.5) * 8, { duration: 3, ease: "easeInOut" });
        animate(driftY, (Math.random() - 0.5) * 12, { duration: 3, ease: "easeInOut" });
      } else {
        animate(driftX, 0, { duration: 1 });
        animate(driftY, 0, { duration: 1 });
      }
    }, 3000);
    
    return () => clearInterval(driftInterval);
  }, [isReduced, driftX, driftY, activeMission, mastery]);

  // Combine pointer-driven and idle drift rotation
  const finalRotateX = useTransform(() => smoothRotateX.get() + driftX.get());
  const finalRotateY = useTransform(() => smoothRotateY.get() + driftY.get());

  useEffect(() => {
    if (mission1Complete && mission2Complete && !mastery) {
      setMastery(true);
      setActiveMission(null);
      
      resetTimerRef.current = setTimeout(() => {
        setMastery(false);
        setMission1Complete(false);
        setMission2Complete(false);
        setFirstMissionFocus(prev => prev === 1 ? 2 : 1);
      }, 4000);
    }
  }, [mission1Complete, mission2Complete, mastery]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const completeMission = (missionNum: 1 | 2) => {
    if (missionNum === 1) setMission1Complete(true);
    else setMission2Complete(true);
    setActiveMission(null);
  };

  const xpCount = (mission1Complete ? 1 : 0) + (mission2Complete ? 1 : 0);

  return (
    <div className={`relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[440px] max-h-[50vh] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-2xl border-2 transition-all duration-500 ${mastery && isReduced ? 'border-emerald-500 ring-4 ring-emerald-500' : 'ring-4 ring-emerald-500/70 border-emerald-600/20'}`}>
      
      {/* Outer wrapper with overflow hidden for the screen */}
      <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative flex flex-col bg-slate-900 text-left">
        
        {/* Zone A: 3D Stage (Takes majority height) */}
        <div 
          className="flex-1 relative overflow-hidden" 
          style={{ perspective: '900px' }}
        >
          {/* XP Pill */}
          <div className="absolute top-4 left-4 z-40 bg-slate-800/80 backdrop-blur border border-emerald-500/30 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
            <Trophy className={`w-3.5 h-3.5 ${xpCount === 2 ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-xs font-bold text-white tracking-wide">XP: {xpCount}/2</span>
          </div>

          {/* The Draggable 3D Room Container */}
          <motion.div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ 
              rotateX: finalRotateX, 
              rotateY: finalRotateY,
              transformStyle: 'preserve-3d',
              touchAction: 'none'
            }}
            className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
          >
            {/* Ambient Room Glow for Mastery (Animated if not reduced) */}
            {mastery && !isReduced && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: [0, 0.5, 0.2, 0.6, 0] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-500/30 blur-2xl -z-10"
                style={{ transform: 'translateZ(-50px)' }}
              />
            )}

            {/* Back Wall */}
            <div 
              className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-[inset_0_0_50px_rgba(16,185,129,0.1)]"
              style={{ transform: 'translateZ(-110px)' }}
            >
              {/* Mission 1 Hotspot */}
              <div className="absolute top-[30%] left-[60%] -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMission(1); }}
                  aria-label="Open Mission 1: Calibrate the Panel"
                  className="relative group focus:outline-none focus:ring-4 focus:ring-emerald-400 rounded-full"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${mission1Complete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-emerald-600 shadow-lg'}`}>
                    {mission1Complete ? <CheckCircle2 className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                  </div>
                  {!mission1Complete && !isReduced && (
                     <span className={`absolute inset-0 rounded-full bg-emerald-400 -z-10 animate-ping ${firstMissionFocus === 1 ? 'opacity-70' : 'opacity-30'}`} />
                  )}
                  {!mission1Complete && (
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded shadow">
                      Mission 1
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Floor */}
            <div 
              className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] bg-teal-800/40 border border-emerald-500/30 rounded-xl"
              style={{ transform: 'translateY(110px) rotateX(90deg)' }}
            >
               {/* Decorative grid on floor */}
               <div className="w-full h-full bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Side Wall (Left) */}
            <div 
              className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] bg-teal-600/20 border border-emerald-500/40 rounded-xl shadow-[inset_0_0_50px_rgba(16,185,129,0.1)]"
              style={{ transform: 'translateX(-110px) rotateY(90deg)' }}
            >
              {/* Mission 2 Hotspot */}
              <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMission(2); }}
                  aria-label="Open Mission 2: Approve the Deployment"
                  className="relative group focus:outline-none focus:ring-4 focus:ring-emerald-400 rounded-full"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${mission2Complete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-emerald-600 shadow-lg'}`}>
                    {mission2Complete ? <CheckCircle2 className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                  </div>
                  {!mission2Complete && !isReduced && (
                     <span className={`absolute inset-0 rounded-full bg-emerald-400 -z-10 animate-ping ${firstMissionFocus === 2 ? 'opacity-70' : 'opacity-30'}`} />
                  )}
                  {!mission2Complete && (
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded shadow">
                      Mission 2
                    </span>
                  )}
                </button>
              </div>
            </div>

          </motion.div>

          {/* 2D Overlay: Mission Cards */}
          <AnimatePresence>
            {activeMission && (
              <motion.div
                initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setActiveMission(null)}
              >
                <div 
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-[200px] sm:max-w-[240px] w-full text-center"
                  onClick={e => e.stopPropagation()}
                >
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {activeMission === 1 ? 'Calibrate the Panel' : 'Approve the Deployment'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 leading-tight">
                    {activeMission === 1 ? 'Bring the pressure reading back into safe range.' : 'Final check passed. Push it live.'}
                  </p>
                  <button
                    onClick={() => completeMission(activeMission)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                  >
                    {activeMission === 1 ? 'Run Calibration' : 'Approve & Deploy'}
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* 2D Overlay: Mastery Moment */}
            {mastery && (
              <motion.div
                initial={isReduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={isReduced ? { duration: 0 } : { type: 'spring', bounce: 0.5 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-emerald-900/80 backdrop-blur-md"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.6)] mb-4">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
                <p className="text-white font-bold text-sm sm:text-base text-center max-w-[80%] leading-tight">
                  Full mastery. Zero assistance needed.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone B: Instruction Caption Bar */}
        <div className="h-10 sm:h-12 bg-white border-t border-emerald-600/10 flex items-center justify-center px-4 shrink-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {mastery ? (
              <motion.p
                key="mastery-caption"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[10px] sm:text-xs font-bold text-emerald-600"
              >
                Fully mastered — resetting...
              </motion.p>
            ) : (
              <motion.p
                key="prompt-caption"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[10px] sm:text-xs font-semibold text-slate-500"
              >
                Drag to look around. Tap the glowing missions.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
