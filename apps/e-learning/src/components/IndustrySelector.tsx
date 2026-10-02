import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { INDUSTRIES_DATA } from '../data/learningData';
import type { IndustryItem } from '../types';
import iconBanking from '../assets/images/icon_Banking.png';
import iconManufacturing from '../assets/images/icon_Manufacturing.png';
import iconItTech from '../assets/images/icon_IT_and_Tech.png';
import iconPharma from '../assets/images/icon_Pharma.png';
import iconRetail from '../assets/images/icon_Retail.png';
import iconInsurance from '../assets/images/icon_Insurance.png';
import iconAutomotive from '../assets/images/icon_Automotive.png';
import iconTelecom from '../assets/images/icon_Telecom.png';
import iconLogistics from '../assets/images/icon_Logistics.png';
import iconEnergy from '../assets/images/icon_Energy.png';

const INDUSTRY_IMAGES: Record<string, string> = {
  automotive: iconAutomotive,
  banking: iconBanking,
  energy: iconEnergy,
  insurance: iconInsurance,
  it: iconItTech,
  logistics: iconLogistics,
  manufacturing: iconManufacturing,
  pharma: iconPharma,
  retail: iconRetail,
  telecom: iconTelecom,
};

export function IndustrySelector() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState<number>(0);

  // Preload all 10 industry icons on mount for instant zero-lag rendering
  useEffect(() => {
    Object.values(INDUSTRY_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Measure total horizontal track scroll distance dynamically
  useLayoutEffect(() => {
    const updateScrollRange = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        // Scroll until the last card is fully and comfortably visible
        const maxScroll = Math.max(0, trackWidth - windowWidth + 64);
        setScrollRange(maxScroll);
      }
    };

    updateScrollRange();
    const timer = setTimeout(updateScrollRange, 200);
    window.addEventListener('resize', updateScrollRange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScrollRange);
    };
  }, []);

  // Pinned vertical-to-horizontal scroll synchronization
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, (progress) => -(progress * scrollRange));

  return (
    <section
      id="industries"
      ref={containerRef}
      className="relative h-[320vh] sm:h-[350vh] bg-transparent"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-6 sm:py-8 lg:py-10">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-[#090b10]">
              Same learning science.<br />
              <span className="text-[#0b0b0d]">Different real-world problems.</span>
            </h2>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Cards Track */}
        <div className="w-full overflow-hidden flex items-center flex-1 min-h-0 my-auto py-2 sm:py-3">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-5 sm:gap-6 lg:gap-8 pl-4 sm:pl-8 lg:pl-12 pr-12 sm:pr-20 lg:pr-24 items-stretch will-change-transform"
          >
            {INDUSTRIES_DATA.map((industry) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

interface IndustryCardProps {
  key?: string;
  industry: IndustryItem;
}

function IndustryCard({ industry }: IndustryCardProps) {
  const imgSrc = INDUSTRY_IMAGES[industry.id] || iconAutomotive;

  return (
    <div className="w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] shrink-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#1e293b]/70 sm:border-[#0f172a] p-5 sm:p-6 lg:p-7 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.14)] flex flex-col justify-between select-none transition-transform duration-300 hover:-translate-y-1">
      <div>
        {/* Card Header: Mode Badge */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <span
            className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-lg border shadow-2xs"
            style={{
              backgroundColor: `${industry.accent}15`,
              borderColor: `${industry.accent}40`,
              color: industry.accent,
            }}
          >
            {industry.modeBadge || `${industry.label.toUpperCase()} MODE`}
          </span>
        </div>

        {/* 3D Floating Icon & Titles */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
            <img
              src={imgSrc}
              alt={`${industry.title} icon`}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.22)]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-[#090b10] tracking-tight leading-tight">
              {industry.title}
            </h3>
          </div>
        </div>

        {/* Structured Data Blocks: Challenge & Formats Only */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* Typical Challenge */}
          <div className="bg-[#f8fafc] rounded-2xl border border-slate-200/90 p-3 sm:p-3.5">
            <span className="text-[10px] font-black text-[#090b10] tracking-wider uppercase mb-1 block">
              Typical Challenge
            </span>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed">
              {industry.challenge}
            </p>
          </div>

          {/* Formats That Fit */}
          <div className="bg-[#f8fafc] rounded-2xl border border-slate-200/90 p-3 sm:p-3.5">
            <span className="text-[10px] font-black text-[#090b10] tracking-wider uppercase mb-1 block">
              Formats That Fit
            </span>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed">
              {industry.formats}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
