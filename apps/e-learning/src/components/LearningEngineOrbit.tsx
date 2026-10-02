import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Globe2, 
  Gamepad2, 
  LayoutDashboard, 
  PieChart, 
  Presentation 
} from 'lucide-react';

const OrbitNode = ({
  icon: Icon,
  title,
  subtitle,
  className,
  iconColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  className: string;
  iconColor: string;
  delay: number;
}) => {
  return (
    <motion.div
      className={`absolute ${className} flex flex-col items-center z-20`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xl border-b-4 border-r-4 border-slate-200 flex items-center justify-center mb-3 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
        <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md z-10 ${iconColor}`} />
      </div>
      <div className="bg-[#0b0b0d] text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full text-center leading-tight shadow-xl border border-slate-700 whitespace-nowrap">
        {title}
        <br />
        <span className="font-normal text-slate-300">{subtitle}</span>
      </div>
    </motion.div>
  );
};

export function LearningEngineOrbit() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] lg:max-w-[600px] mx-auto mt-12 lg:mt-0 perspective-[1000px]">
      {/* Concentric Orbits */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] rounded-full border-[1.5px] border-dashed border-[#7557ff]/30 animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full border-[1.5px] border-dashed border-[#ff5f9f]/30 animate-[spin_80s_linear_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] rounded-full border-[1.5px] border-dashed border-[#ff925b]/30 animate-[spin_100s_linear_infinite]" />

      {/* Glowing streaks/rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,transparent_20%,rgba(117,87,255,0.03)_60%,transparent_100%)] rounded-full pointer-events-none" />

      {/* Central Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#0f0f1a] to-[#05050a] z-30 flex flex-col items-center justify-center border border-[#7557ff]/40 shadow-[0_0_60px_rgba(117,87,255,0.5),inset_0_0_30px_rgba(255,95,159,0.3)]">
        {/* Core glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7557ff]/40 to-[#ff5f9f]/30 blur-2xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
        
        <span className="text-[#a78bfa] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-1">
          TECHNOEDGE
        </span>
        <span className="text-white text-xl sm:text-3xl font-extrabold tracking-tight leading-none mb-1">
          LEARNING
        </span>
        <span className="text-white text-xl sm:text-3xl font-extrabold tracking-tight leading-none mb-3">
          ENGINE
        </span>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#ff5f9f] to-transparent mb-2" />
        <span className="text-slate-300 text-[9px] sm:text-[10px] font-medium tracking-widest uppercase">
          Strategy &rarr; Build
        </span>
      </div>

      {/* Orbital Nodes */}
      <OrbitNode
        icon={Presentation}
        title="SCENARIO"
        subtitle="Think • Decide"
        className="top-[-5%] left-[50%] -translate-x-1/2"
        iconColor="text-[#7557ff]"
        delay={0}
      />
      <OrbitNode
        icon={PieChart}
        title="DATA"
        subtitle="Track Success"
        className="top-[25%] right-[-5%]"
        iconColor="text-[#ff925b]"
        delay={0.5}
      />
      <OrbitNode
        icon={LayoutDashboard}
        title="SIMULATION"
        subtitle="Practice Safely"
        className="bottom-[10%] right-[0%]"
        iconColor="text-[#ff5f9f]"
        delay={1.2}
      />
      <OrbitNode
        icon={Gamepad2}
        title="GAME"
        subtitle="Play to Learn"
        className="bottom-[-5%] left-[50%] -translate-x-1/2"
        iconColor="text-[#7557ff]"
        delay={0.8}
      />
      <OrbitNode
        icon={Globe2}
        title="LOCALIZATION"
        subtitle="Any Language"
        className="bottom-[10%] left-[0%]"
        iconColor="text-[#7557ff]"
        delay={1.5}
      />
      <OrbitNode
        icon={BookOpen}
        title="MICRO VIDEO"
        subtitle="Explain fast"
        className="top-[25%] left-[-5%]"
        iconColor="text-[#ff5f9f]"
        delay={0.3}
      />
    </div>
  );
}
