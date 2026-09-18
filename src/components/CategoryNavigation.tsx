import React, { useState, useCallback } from 'react';
import { CategoryArchitecture, CategoryId } from '../types';
import {
  Award,
  Bot,
  Briefcase,
  CheckCircle2,
  CircuitBoard,
  HeartHandshake,
  Workflow,
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  categories: CategoryArchitecture[];
  activeCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
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

export const CategoryNavigation: React.FC<Props> = ({ categories, activeCategoryId, onSelectCategory }) => {
  const [activeTabOrigin, setActiveTabOrigin] = useState<Record<string, { x: number; y: number; coverSize: number; isHovered: boolean }>>({});

  const handlePointerEnter = useCallback((catId: string, event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const coverSize = getCoverDiameter(rect.width, rect.height, x, y);
    setActiveTabOrigin((prev) => ({
      ...prev,
      [catId]: { x, y, coverSize, isHovered: true },
    }));
  }, []);

  const handlePointerLeave = useCallback((catId: string) => {
    setActiveTabOrigin((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], isHovered: false },
    }));
  }, []);

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'role-based': return <Briefcase className="w-6 h-6" />;
      case 'tools-technology': return <CircuitBoard className="w-6 h-6" />;
      case 'process-based': return <Workflow className="w-6 h-6" />;
      case 'certifications': return <Award className="w-6 h-6" />;
      case 'ai-tools': return <Bot className="w-6 h-6" />;
      case 'people-behavioural': return <HeartHandshake className="w-6 h-6" />;
    }
  };

  return (
    <section id="category-selection-section" className="w-full bg-white px-4 sm:px-10 py-10 shrink-0 border-b border-[rgba(0,0,255,0.14)]" aria-label="Training Categories">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#000000]">Explore Our Catalogues</h2>
          <p className="text-[rgba(0,0,0,0.70)] mt-1">Select a learning track to browse programmes.</p>
        </div>

        {/* Tablist for categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6" role="tablist">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            const originData = activeTabOrigin[cat.id];
            const isHovered = Boolean(originData?.isHovered);
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                onPointerEnter={(e) => handlePointerEnter(cat.id, e)}
                onPointerDown={(e) => handlePointerEnter(cat.id, e)}
                onPointerLeave={() => handlePointerLeave(cat.id)}
                className={`text-left p-6 rounded-xl transition-all duration-200 relative outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2 flex flex-col overflow-hidden cursor-pointer ${
                  isActive 
                    ? 'bg-[rgba(33,150,243,0.10)] border-2 border-[#0000FF] shadow-sm scale-[1.02]' 
                    : 'bg-white border border-[rgba(0,0,255,0.14)] hover:border-[#0000FF]/30 hover:shadow-[0_8px_24px_rgba(0,0,255,0.16)] hover:-translate-y-0.5'
                }`}
              >
                {/* Dynamic Origin Fill Ripple */}
                <motion.span
                  animate={{ scale: isHovered && originData ? 1 : 0 }}
                  aria-hidden
                  className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    isActive 
                      ? 'bg-[rgba(0,0,255,0.12)]' 
                      : 'bg-gradient-to-br from-[rgba(0,0,255,0.12)] to-[rgba(33,150,243,0.22)]'
                  }`}
                  initial={false}
                  style={{
                    height: originData?.coverSize || 0,
                    left: originData?.x || 0,
                    top: originData?.y || 0,
                    width: originData?.coverSize || 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />

                <div className="relative z-10 flex flex-col flex-1 w-full">
                  <div className="flex justify-between items-start mb-5 w-full">
                    <div className={`p-3 rounded-lg transition-all duration-200 ${
                      isActive && isHovered
                        ? 'bg-[#22c55e] text-white shadow-sm scale-105'
                        : isActive 
                          ? 'bg-[#0000FF] text-white shadow-sm' 
                          : isHovered 
                            ? 'bg-[#22c55e] text-white shadow-md scale-105' 
                            : 'bg-[rgba(33,150,243,0.08)] text-[#0000FF]'
                    }`}>
                      {getCategoryIcon(cat.id)}
                    </div>
                    <div className="text-right">
                      <span className={`block text-3xl font-bold tracking-tight transition-colors duration-200 ${
                        isActive ? 'text-[#0000FF]' : isHovered ? 'text-[#0000FF]/70' : 'text-[rgba(0,0,0,0.65)]'
                      }`}>
                        {cat.count > 0 ? cat.count.toLocaleString() : 'New'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[rgba(0,0,0,0.58)]">
                        {cat.count > 0 ? 'Programmes' : 'Catalogue'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                    isActive ? 'text-[#0000FF]' : isHovered ? 'text-[#0000FF]/70' : 'text-[#000000]'
                  }`}>
                    {cat.name}
                  </h3>
                  
                  <p className={`text-sm mb-6 ${isActive ? 'text-[rgba(0,0,0,0.72)]' : 'text-[rgba(0,0,0,0.58)]'}`}>
                    {cat.description}
                  </p>

                  {isActive ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0000FF] uppercase tracking-wider mt-auto pt-4 border-t border-[rgba(0,0,255,0.14)] w-full">
                      <CheckCircle2 className="w-4 h-4 text-[#0000FF]" /> Selected
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mt-auto pt-4 border-t border-transparent w-full transition-colors duration-200 ${
                      isHovered ? 'text-[#0000FF]/70' : 'text-[rgba(0,0,0,0.58)]'
                    }`}>
                      <span>Click to explore</span>
                      <span className={`transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
