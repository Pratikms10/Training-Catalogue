import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { INDUSTRIES_DATA } from '../../data/learningData';
import {Car,Landmark,Zap,ShieldCheck,Monitor,Truck,Factory,Microscope,ShoppingBag,Radio} from 'lucide-react';
import type { IndustryItem } from '../../types';
import './sculpted-cards.css';

const INDUSTRY_IMAGES: Record<string, string> = {
  automotive: '/media/industries-new/Automotive.png',
  banking: '/media/industries-new/Banking.png',
  energy: '/media/industries-new/Energy_Utilities.png',
  it: '/media/industries-new/IT_Technology.png',
  insurance: '/media/industries-new/Insurance.png',
  logistics: '/media/industries-new/Logistics_SupplyChain.png',
  manufacturing: '/media/industries-new/Manufacturing.png',
  pharma: '/media/industries-new/Pharma.png',
  retail: '/media/industries-new/Retail.png',
  telecom: '/media/industries-new/Telecom.png',
};

export function IndustrySelector() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState<number>(0);

  // Preload all 10 industry illustrations on mount for instant zero-lag rendering
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
      <div className="industry-stage sticky top-0 h-screen w-full flex flex-col overflow-hidden py-4 sm:py-5 lg:py-6">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0 mb-3 sm:mb-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-[#090b10]">
              Same learning science.<br />
              <span className="text-[#7557ff]">Different real-world problems.</span>
            </h2>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Cards Track */}
        <div className="industry-track-window w-full overflow-hidden flex items-center flex-1 min-h-0 py-1 sm:py-2">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="industry-track flex h-full max-h-[650px] gap-5 sm:gap-6 lg:gap-8 pl-4 sm:pl-8 lg:pl-12 pr-12 sm:pr-20 lg:pr-24 items-stretch will-change-transform"
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

const INDUSTRY_THEMES: Record<string, { gradient: string, lightBg: string, tagline: string }> = {
  automotive: { gradient: 'linear-gradient(100deg, #1e73d8, #124a9a)', lightBg: '#eef6ff', tagline: 'DRIVING A\nBRIGHTER TOMORROW' },
  banking: { gradient: 'linear-gradient(100deg, #185abd, #103c8c)', lightBg: '#eef4ff', tagline: 'PEOPLE FIRST\nPROGRESS ALWAYS' },
  energy: { gradient: 'linear-gradient(100deg, #07866f, #075f54)', lightBg: '#ebfaf6', tagline: 'POWERING\nSUSTAINABLE POSSIBILITIES' },
  retail: { gradient: 'linear-gradient(100deg, #d9532f, #a93a22)', lightBg: '#fff2ed', tagline: 'GOOD PEOPLE\nGREAT EXPERIENCES' },
  it: { gradient: 'linear-gradient(100deg, #1d6fe8, #3730a3)', lightBg: '#edf4ff', tagline: 'INNOVATING THE\nDIGITAL FRONTIER' },
  insurance: { gradient: 'linear-gradient(100deg, #7c3aed, #4c1d95)', lightBg: '#f4efff', tagline: 'PROTECTING WHAT\nMATTERS MOST' },
  logistics: { gradient: 'linear-gradient(100deg, #e85d04, #a63a00)', lightBg: '#fff3e8', tagline: 'DELIVERING\nWORLDWIDE EFFICIENCY' },
  manufacturing: { gradient: 'linear-gradient(100deg, #2878a9, #145374)', lightBg: '#eef8fc', tagline: 'BUILDING THE\nFUTURE TODAY' },
  pharma: { gradient: 'linear-gradient(100deg, #0d9488, #0f766e)', lightBg: '#eafbf8', tagline: 'ADVANCING\nGLOBAL HEALTH' },
  telecom: { gradient: 'linear-gradient(100deg, #635bff, #4338ca)', lightBg: '#f0efff', tagline: 'CONNECTING THE\nWORLD SEAMLESSLY' },
};

interface IndustryCardProps {
  key?: string;
  industry: IndustryItem;
}

const INDUSTRY_ICONS = [Car,Landmark,Zap,ShieldCheck,Monitor,Truck,Factory,Microscope,ShoppingBag,Radio];
function IndustryCard({ industry }: IndustryCardProps) {
  const Icon = INDUSTRY_ICONS[INDUSTRIES_DATA.findIndex(item=>item.id===industry.id)] || Factory;
  const theme = INDUSTRY_THEMES[industry.id] || INDUSTRY_THEMES.manufacturing;
  
  return <article 
    className="sculpted-industry-card h-full w-[380px] sm:w-[480px] md:w-[580px] lg:w-[650px] shrink-0 select-none transition-transform duration-300 hover:-translate-y-1"
    style={{ '--card-bg': theme.lightBg, '--title-bg': theme.gradient } as CSSProperties}
  >
    <header className="industry-nameplate">
      <div className="flex items-center gap-3">
        <Icon aria-hidden="true"/>
        <h3>{industry.title}</h3>
      </div>
      <div className="hidden sm:block text-[9px] leading-tight text-left uppercase opacity-80 border-l border-white/20 pl-3 whitespace-pre-line tracking-wider font-semibold">
        {theme.tagline}
      </div>
    </header>
    <div className="industry-diorama"><img src={INDUSTRY_IMAGES[industry.id]} alt={industry.title+' workplace clay illustration'} loading="eager" decoding="async"/></div>
    <div className="industry-editable-panels">
      <section><h4>Typical Challenge</h4><p>{industry.challenge}</p></section>
      <section><h4>Formats That Fit</h4><p>{industry.formats}</p></section>
    </div>
  </article>;
}
