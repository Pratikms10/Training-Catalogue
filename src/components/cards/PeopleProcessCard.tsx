import React, { useState, useCallback } from 'react';
import { PeopleProcessProgramme } from '../../types';
import { ArrowRight, BarChart } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  programme: PeopleProcessProgramme;
  onViewDetail?: () => void;
}

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y)
      )
  );
}

export const PeopleProcessCard: React.FC<Props> = ({ programme, onViewDetail }) => {
  const [origin, setOrigin] = useState({ x: 0, y: 0, coverSize: 0, isHovered: false });

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coverSize = getCoverDiameter(rect.width, rect.height, x, y);
    setOrigin({ x, y, coverSize, isHovered: true });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setOrigin((prev) => ({ ...prev, isHovered: false }));
  }, []);

  return (
    <div 
      className="flex flex-col border border-[rgba(0,0,255,0.12)] rounded-xl bg-white hover:shadow-[0_10px_28px_rgba(0,0,255,0.16)] hover:border-[#0000FF]/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#0000FF]/30 focus:border-transparent transition-all duration-200 h-full w-full max-w-sm mx-auto group cursor-pointer overflow-hidden relative"
      onClick={onViewDetail}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${programme.title}`}
    >
      {/* Dynamic Origin Fill Ripple */}
      <motion.span
        animate={{ scale: origin.isHovered && origin.coverSize > 0 ? 1 : 0 }}
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[rgba(0,0,255,0.09)] to-[rgba(33,150,243,0.15)] z-0"
        initial={false}
        style={{
          height: origin.coverSize,
          left: origin.x,
          top: origin.y,
          width: origin.coverSize,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* 16:9 Image */}
      <div className="w-full aspect-[16/9] bg-[rgba(33,150,243,0.04)] relative overflow-hidden border-b border-[rgba(0,0,255,0.08)] flex items-center justify-center">
        {programme.imageUrl ? (
          <img 
            src={programme.imageUrl} 
            alt={programme.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="text-[10px] font-bold text-[rgba(0,0,0,0.3)] tracking-widest uppercase">IMAGE REQUIRED</div>
        )}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs text-[#000000] group-hover:text-[#22c55e] group-hover:border-[#22c55e] uppercase tracking-wider border border-[rgba(0,0,255,0.14)] transition-colors duration-200">
          {programme.id}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
           {/* Badge */}
           <span className="text-[10px] font-semibold bg-[rgba(33,150,243,0.10)] text-[#0000FF] px-2.5 py-1 rounded border border-[rgba(0,0,255,0.14)] inline-block">
             {programme.badge}
           </span>
           {/* Topic Category */}
           {(programme.topicCategory || programme.portfolio) && (
             <span className="text-[10px] font-bold text-[rgba(0,0,0,0.58)] uppercase tracking-wider text-right pt-1 break-words max-w-full">
               {programme.topicCategory || programme.portfolio}
             </span>
           )}
        </div>
        
        {/* Title */}
        <div className="min-h-[3.5rem] mb-6">
          <h3 className="text-lg leading-snug font-bold text-[#000000] group-hover:text-[#0000FF]/70 transition-colors line-clamp-2">
            {programme.title}
          </h3>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between text-[13px] text-[rgba(0,0,0,0.58)] border-t border-[rgba(0,0,255,0.08)]">
          <div className="flex items-center gap-1.5" title="Level">
            <BarChart className="w-4 h-4 text-[rgba(0,0,255,0.5)]" />
            <span className="font-medium">{programme.level}</span>
          </div>
          
          <div className="flex items-center gap-1 text-[#0000FF] font-semibold text-xs uppercase tracking-wide group-hover:underline">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
