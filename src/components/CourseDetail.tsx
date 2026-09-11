import React, { useState, useEffect } from 'react';
import { BaseProgramme, ProgrammeModule } from '../types';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BarChart3, 
  MonitorPlay, 
  ArrowRight, 
  ChevronLeft, 
  Users, 
  Target, 
  Wrench, 
  Cpu, 
  FileText, 
  Lightbulb, 
  Check, 
  Compass,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RfqModal } from './RfqModal';
import { OriginButton } from '@/components/ui/origin-button';

interface Props {
  programme: BaseProgramme;
  onBack: () => void;
  onSelectProgramme?: (programme: BaseProgramme) => void;
}

export const CourseDetail: React.FC<Props> = ({ programme, onBack }) => {
  // Accordion Section States: All major sections open by default for rich discoverability
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: true,
    prerequisites: true,
    modules: true,
    useCases: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const details = programme.details || {};
  const modules: ProgrammeModule[] = details.modules || [];
  const scenarios = details.scenarios || [];

  // Individual Module Dropdowns state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    '01': true, // Open first module initially as a visual exemplar
  });

  // RFQ Modal State
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  // Scroll to top on programme change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setExpandedModules({ '01': true });
  }, [programme.id]);

  const toggleModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allModulesExpanded = modules.length > 0 && modules.every(m => expandedModules[m.id]);

  const handleToggleAllModules = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shouldExpandAll = !allModulesExpanded;
    const newState: Record<string, boolean> = {};
    modules.forEach(m => {
      newState[m.id] = shouldExpandAll;
    });
    setExpandedModules(newState);
  };

  // Category Badge Text & Icon (Pill)
  const getBadgeInfo = () => {
    if (programme.id.startsWith('RB')) {
      return {
        label: 'Role-Based Programme',
        icon: <Users className="w-3.5 h-3.5 text-[#0000FF]" />,
      };
    }
    if (programme.id.startsWith('PP')) {
      return {
        label: 'People and Process',
        icon: <Target className="w-3.5 h-3.5 text-[#0000FF]" />,
      };
    }
    return {
      label: 'Tool or Technology',
      icon: <Cpu className="w-3.5 h-3.5 text-[#0000FF]" />,
    };
  };

  const badgeInfo = getBadgeInfo();

  // Approved alternating module tile colors: Primary Blue (#0000FF) / Support Blue (#2196F3)
  const getModuleTileStyle = (index: number) => {
    return index % 2 === 0
      ? 'bg-[#0000FF] text-white'
      : 'bg-[#2196F3] text-white';
  };

  // Helper to render newlines cleanly
  const renderTextWithBreaks = (text?: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, pIdx) => (
      <p key={pIdx} className="mb-3 last:mb-0 leading-relaxed">
        {paragraph.split('\n').map((line, lIdx, arr) => (
          <React.Fragment key={lIdx}>
            {line}
            {lIdx < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="w-full bg-white min-h-screen pb-24 font-sans antialiased text-[#000000]">
      
      {/* TOP NAVIGATION */}
      <nav aria-label="Breadcrumb Navigation" className="w-full bg-white border-b border-[rgba(0,0,255,0.12)] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <button 
            id="back-to-catalogue-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[rgba(0,0,0,0.70)] hover:text-[#0000FF]/70 transition-colors py-1.5 px-2.5 rounded-md hover:bg-[rgba(33,150,243,0.06)]"
          >
            <ChevronLeft className="w-4 h-4 text-[#0000FF]" />
            Back to Catalogue
          </button>
        </div>
      </nav>

      {/* 2 & 3. HERO SECTION (HARMONIZED EXECUTIVE BLUE THEME COMPLEMENTING BRAND EMBLEM) */}
      <header 
        id="course-hero-section"
        style={{
          background: 'linear-gradient(135deg, rgba(33,150,243,0.06) 0%, rgba(33,150,243,0.02) 42%, #FFFFFF 100%)'
        }}
        className="relative w-full border-b border-[rgba(0,0,255,0.12)] overflow-hidden"
      >
        {/* Refined High-Impact Background Logo Watermark */}
        <div 
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[70%] h-full pointer-events-none select-none flex items-center justify-end z-0"
          aria-hidden="true"
        >
          {/* Subtle glowing aura behind the watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#2196F3] opacity-[0.03] blur-[80px] rounded-full"></div>
          
          <img
            src="/hero-logo.png"
            alt=""
            className="w-full h-[140%] object-contain opacity-[0.06] rotate-[-5deg] scale-110 origin-center mix-blend-multiply transition-all"
            style={{
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)'
            }}
          />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Content: Takes up more space now that logo is background */}
          <div className="w-full md:w-[60%] lg:w-[55%] flex flex-col items-start z-10">
            
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
              {/* Programme Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(33,150,243,0.10)] text-[#0000FF] text-xs font-semibold border border-[rgba(0,0,255,0.14)] shadow-2xs">
                {badgeInfo.icon}
                <span>{badgeInfo.label}</span>
              </div>

              {/* Programme ID Tag */}
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white border border-[rgba(0,0,255,0.14)] font-mono font-bold text-xs tracking-wider text-[#000000] shadow-2xs">
                <span>{programme.id}</span>
              </div>
            </div>

            {/* Large Course Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#000000] leading-[1.18] tracking-tight mb-4 text-balance">
              {programme.title}
            </h1>

            {/* Short Programme Description */}
            <p className="text-[rgba(0,0,0,0.72)] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              {details.summary}
            </p>

            {/* Request for Quotation Button */}
            <div>
              <OriginButton 
                id="hero-rfq-button"
                onClick={() => setIsRfqOpen(true)}
                fillClassName="bg-[#22c55e]"
                className="bg-[#0000FF] border-none text-white font-semibold text-sm sm:text-base py-3.5 px-7 rounded-lg inline-flex items-center gap-2.5 shadow-xs transition-all hover:shadow-[0_6px_22px_rgba(0,0,255,0.40)] hover:ring-2 hover:ring-[#2196F3]/70 hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-[#0000FF]/25 text-white hover:text-white cursor-pointer"
              >
                <span>Request for Quotation</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </OriginButton>
            </div>

          </div>

          {/* 9. Hero Right-side Visual (Desktop + Mobile) */}
          <div className="w-full md:w-[35%] lg:w-[40%] flex flex-col items-center md:items-end justify-center z-10 mt-8 md:mt-0">
            <div className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-[rgba(0,0,255,0.12)] bg-white flex items-center justify-center p-1.5 relative">
              {((programme as any).imageUrl || (programme as any).toolLogoUrl) ? (
                <img 
                  src={((programme as any).imageUrl || (programme as any).toolLogoUrl)}
                  alt={programme.title}
                  className={programme.id.startsWith('TT') ? 'w-2/3 h-2/3 object-contain rounded-xl' : 'w-full h-full object-cover rounded-xl'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[rgba(33,150,243,0.03)] rounded-xl flex items-center justify-center text-[10px] font-bold text-[rgba(0,0,0,0.3)] tracking-widest uppercase border border-dashed border-[rgba(0,0,255,0.15)] text-center leading-relaxed">
                  {programme.id.startsWith('TT') ? <>LOGO<br/>REQD</> : 'IMAGE REQUIRED'}
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* MAIN BODY AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* 5 & 7. METADATA STRIP (FLOATING OVERLAP) */}
        <section 
          id="course-metadata-strip"
          aria-label="Course Metadata"
          className="bg-white rounded-xl border border-[rgba(0,0,255,0.12)] shadow-[0_6px_18px_rgba(0,0,0,0.08)] p-5 sm:p-6 -mt-10 sm:-mt-12 mb-10 relative z-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(0,0,255,0.10)]">
            
            {/* Duration */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.12)] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#0000FF]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider mb-0.5">
                  Duration
                </div>
                <div className="font-bold text-[#000000] text-sm sm:text-base">
                  {programme.duration || '4 Hours'}
                </div>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 pt-4 sm:pt-0">
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.12)] flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-[#0000FF]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider mb-0.5">
                  Level
                </div>
                <div className="font-bold text-[#000000] text-sm sm:text-base">
                  {programme.level || 'Awareness'}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 pt-4 lg:pt-0">
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.12)] flex items-center justify-center shrink-0">
                <MonitorPlay className="w-5 h-5 text-[#0000FF]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider mb-0.5">
                  Delivery
                </div>
                <div className="font-bold text-[#000000] text-sm sm:text-base">
                  {details.delivery || programme.format || 'Instructor-Led'}
                </div>
              </div>
            </div>

            {/* Format */}
            <div id="course-metadata-approach-item" className="flex items-center gap-3.5 px-2 sm:px-4 pt-4 lg:pt-0">
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.12)] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-[#0000FF]" />
              </div>
              <div>
                <div id="course-metadata-approach-label" className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider mb-0.5">
                  Format
                </div>
                <div id="course-metadata-approach-value" className="font-bold text-[#000000] text-sm sm:text-base">
                  {details.format || (programme as any).format || 'Role-Based Programme'}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 10. MAJOR ACCORDION NAVIGATION (About, Prerequisites, Modules, Use Cases) */}
        <div className="space-y-6">

          {/* 11. ABOUT ACCORDION SECTION */}
          <section id="section-about" className="bg-white rounded-xl border border-[rgba(0,0,255,0.12)] overflow-hidden shadow-xs">
            <button 
              type="button"
              onClick={() => toggleSection('about')}
              aria-expanded={expandedSections.about}
              className={`w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-white hover:bg-[rgba(33,150,243,0.04)] transition-colors text-left select-none border-b ${
                expandedSections.about ? 'border-b-2 border-[#0000FF]' : 'border-[rgba(0,0,255,0.12)]'
              }`}
            >
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${expandedSections.about ? 'text-[#0000FF]' : 'text-[#000000]'}`}>
                About
              </h2>
              <div className="w-7 h-7 rounded-full bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.10)] flex items-center justify-center text-[#0000FF]">
                {expandedSections.about ? (
                  <ChevronUp className="w-4 h-4 text-[#0000FF]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0000FF]" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSections.about && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-white"
                >
                  <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
                    
                    {/* Programme Objective on clean white background */}
                    {details.objective && (
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#000000] mb-3">
                          Programme Objective
                        </h3>
                        <div className="text-[rgba(0,0,0,0.72)] text-sm sm:text-base leading-relaxed max-w-4xl">
                          {renderTextWithBreaks(details.objective)}
                        </div>
                      </div>
                    )}

                    {/* 12 & 13. Light-Blue Content Panel: Tools Covered */}
                    {details.toolsCovered && details.toolsCovered.length > 0 && (
                      <div className="bg-[rgba(33,150,243,0.06)] p-5 sm:p-6 rounded-xl border border-[rgba(0,0,255,0.08)]">
                        <h4 className="text-sm font-bold text-[#000000] mb-3 flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-[#0000FF]" />
                          <span>{programme.id.startsWith('TT') ? 'Technology covered' : 'Tools covered'}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {details.toolsCovered.map((tool: string, idx: number) => (
                            <span 
                              key={idx} 
                              className="bg-[rgba(33,150,243,0.12)] border border-[rgba(0,0,255,0.08)] text-[#000000] text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-[rgba(33,150,243,0.18)] transition-colors"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 12 & 14. Light-Blue Content Panel: Who Should Attend */}
                    {details.audience && details.audience.length > 0 && (
                      <div className="bg-[rgba(33,150,243,0.06)] p-5 sm:p-6 rounded-xl border border-[rgba(0,0,255,0.08)]">
                        <h4 className="text-sm font-bold text-[#000000] mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#0000FF]" />
                          <span>Who should attend</span>
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm text-[rgba(0,0,0,0.72)]">
                          {details.audience.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF] shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 12. PREREQUISITES ACCORDION SECTION */}
          <section id="section-prerequisites" className="bg-white rounded-xl border border-[rgba(0,0,255,0.12)] overflow-hidden shadow-xs">
            <button 
              type="button"
              onClick={() => toggleSection('prerequisites')}
              aria-expanded={expandedSections.prerequisites}
              className={`w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-white hover:bg-[rgba(33,150,243,0.04)] transition-colors text-left select-none border-b ${
                expandedSections.prerequisites ? 'border-b-2 border-[#0000FF]' : 'border-[rgba(0,0,255,0.12)]'
              }`}
            >
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${expandedSections.prerequisites ? 'text-[#0000FF]' : 'text-[#000000]'}`}>
                Prerequisites
              </h2>
              <div className="w-7 h-7 rounded-full bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.10)] flex items-center justify-center text-[#0000FF]">
                {expandedSections.prerequisites ? (
                  <ChevronUp className="w-4 h-4 text-[#0000FF]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0000FF]" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSections.prerequisites && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-white"
                >
                  <div className="px-6 sm:px-8 py-6 sm:py-7">
                    <div className="bg-[rgba(33,150,243,0.06)] p-5 sm:p-6 rounded-xl border border-[rgba(0,0,255,0.08)]">
                      <h4 className="text-sm font-bold text-[#000000] mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0000FF]" />
                        <span>Prerequisites & Participant Readiness</span>
                      </h4>
                      {details.prerequisitesList && details.prerequisitesList.length > 0 ? (
                        <ul className="space-y-2 text-sm text-[rgba(0,0,0,0.72)]">
                          {details.prerequisitesList.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-[#0000FF] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[rgba(0,0,0,0.72)] text-sm">
                          No prior technical or specialised experience required. Suitable for all corporate professionals.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 15, 16, 17, 18. TOC MODULES ACCORDION SECTION */}
          <section id="section-modules" className="bg-white rounded-xl border border-[rgba(0,0,255,0.12)] overflow-hidden shadow-xs">
            <button 
              type="button"
              onClick={() => toggleSection('modules')}
              aria-expanded={expandedSections.modules}
              className={`w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-white hover:bg-[rgba(33,150,243,0.04)] transition-colors text-left select-none border-b ${
                expandedSections.modules ? 'border-b-2 border-[#0000FF]' : 'border-[rgba(0,0,255,0.12)]'
              }`}
            >
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${expandedSections.modules ? 'text-[#0000FF]' : 'text-[#000000]'}`}>
                Modules
              </h2>
              <div className="w-7 h-7 rounded-full bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.10)] flex items-center justify-center text-[#0000FF]">
                {expandedSections.modules ? (
                  <ChevronUp className="w-4 h-4 text-[#0000FF]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0000FF]" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSections.modules && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-white"
                >
                  <div className="px-6 sm:px-8 py-6 sm:py-7">
                    
                    {/* TOC Header with Expand All toggle */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[rgba(0,0,255,0.12)]">
                      <h3 className="text-base sm:text-lg font-bold text-[#000000]">
                        TOC Modules
                      </h3>
                      <button 
                        type="button"
                        onClick={handleToggleAllModules}
                        className="text-xs font-semibold text-[#0000FF] hover:underline inline-flex items-center gap-1 uppercase tracking-wider py-1 px-2 rounded hover:bg-[rgba(33,150,243,0.06)] transition-colors"
                      >
                        <span>{allModulesExpanded ? 'Collapse all' : 'Expand all'}</span>
                        {allModulesExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[#0000FF]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[#0000FF]" />
                        )}
                      </button>
                    </div>

                    {/* Compact Module Rows */}
                    <div className="space-y-2.5">
                      {modules.map((module: ProgrammeModule, index: number) => {
                        const isExpanded = !!expandedModules[module.id];
                        const tileStyle = getModuleTileStyle(index);

                        return (
                          <div 
                            key={module.id} 
                            className="bg-white border border-[rgba(0,0,255,0.16)] rounded-lg overflow-hidden transition-shadow hover:shadow-xs"
                          >
                            {/* Module Header Row */}
                            <button
                              type="button"
                              onClick={(e) => toggleModule(module.id, e)}
                              className="w-full flex items-center bg-white hover:bg-[rgba(33,150,243,0.04)] transition-colors text-left"
                            >
                              {/* Left Square Accent Icon Block (Alternating approved blues only) */}
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center font-mono font-bold text-base sm:text-lg ${tileStyle}`}>
                                {module.id}
                              </div>

                              {/* Title and Duration */}
                              <div className="px-4 py-2.5 flex-1 min-w-0">
                                <h4 className="text-sm sm:text-[15px] font-semibold text-[#000000] pr-2">
                                  {module.title}
                                </h4>
                                {module.duration && (
                                  <span className="text-xs text-[rgba(0,0,0,0.58)] block mt-0.5">
                                    {module.duration}
                                  </span>
                                )}
                              </div>

                              {/* Right Blue Arrow */}
                              <div className="px-4 text-[#0000FF] shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[#0000FF]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#0000FF]" />
                                )}
                              </div>
                            </button>

                            {/* 17. Expanded Module Content (Directly underneath row) */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  className="border-t border-[rgba(0,0,255,0.10)] bg-[rgba(33,150,243,0.05)]"
                                >
                                  <div className="p-5 pl-16 sm:pl-20 pr-6">
                                    
                                    {/* Learning Outcomes */}
                                    {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                                      <div className="mb-4">
                                        <div className="text-[11px] font-semibold text-[rgba(0,0,0,0.58)] uppercase tracking-wider mb-2">
                                          Topics & Learning Outcomes
                                        </div>
                                        <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm text-[rgba(0,0,0,0.72)]">
                                          {module.learningOutcomes.map((outcome, oIdx) => (
                                            <li key={oIdx} className="leading-relaxed">
                                              {outcome}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Applied Exercise (if present) */}
                                    {module.appliedExercise && (
                                      <div className="bg-white p-4 rounded-lg border border-[rgba(0,0,255,0.10)] shadow-2xs mt-3">
                                        <h5 className="text-xs font-bold text-[#0000FF] flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                                          <Target className="w-3.5 h-3.5 text-[#0000FF]" />
                                          <span>{module.appliedExercise.title}</span>
                                        </h5>
                                        <div className="text-xs sm:text-sm text-[rgba(0,0,0,0.72)] leading-relaxed">
                                          {Array.isArray(module.appliedExercise.content) ? (
                                            <ul className="space-y-1">
                                              {module.appliedExercise.content.map((cLine, cIdx) => (
                                                <li key={cIdx} className={cLine === '' ? 'h-2' : 'flex items-start gap-1.5'}>
                                                  {cLine !== '' && <span className="text-[#0000FF]">•</span>}
                                                  <span>{cLine}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p>{module.appliedExercise.content}</p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {modules.length === 0 && (
                        <p className="text-xs text-[rgba(0,0,0,0.58)] italic p-4 bg-[rgba(33,150,243,0.06)] rounded-lg">
                          Detailed syllabus modules are available upon quotation inquiry.
                        </p>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 19. APPLIED BUSINESS SCENARIOS (USE CASES) SECTION */}
          <section id="section-use-cases" className="bg-white rounded-xl border border-[rgba(0,0,255,0.12)] overflow-hidden shadow-xs">
            <button 
              type="button"
              onClick={() => toggleSection('useCases')}
              aria-expanded={expandedSections.useCases}
              className={`w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-white hover:bg-[rgba(33,150,243,0.04)] transition-colors text-left select-none border-b ${
                expandedSections.useCases ? 'border-b-2 border-[#0000FF]' : 'border-[rgba(0,0,255,0.12)]'
              }`}
            >
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${expandedSections.useCases ? 'text-[#0000FF]' : 'text-[#000000]'}`}>
                Applied Business Scenario
              </h2>
              <div className="w-7 h-7 rounded-full bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.10)] flex items-center justify-center text-[#0000FF]">
                {expandedSections.useCases ? (
                  <ChevronUp className="w-4 h-4 text-[#0000FF]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0000FF]" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSections.useCases && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-white"
                >
                  <div className="px-6 sm:px-8 py-6 sm:py-8">
                    
                    {/* 19. Light-Blue Parent Panel */}
                    <div className="bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.08)] rounded-xl p-5 sm:p-7">
                      
                      <h3 className="text-base sm:text-lg font-bold text-[#000000] mb-5 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#0000FF]" />
                        <span>Scenarios</span>
                      </h3>

                      {scenarios.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          {scenarios.map((scenario, sIdx) => (
                            <div 
                              key={sIdx} 
                              className="bg-white p-5 sm:p-6 rounded-xl border border-[rgba(0,0,255,0.08)] shadow-2xs flex flex-col gap-3"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[rgba(33,150,243,0.12)] text-[#0000FF] flex items-center justify-center shrink-0">
                                <Lightbulb className="w-4 h-4 text-[#0000FF]" />
                              </div>
                              <div>
                                <h4 className="text-sm sm:text-base font-bold text-[#000000] mb-2">
                                  {scenario.title}
                                </h4>
                                <div className="text-xs sm:text-sm text-[rgba(0,0,0,0.70)] leading-relaxed">
                                  {renderTextWithBreaks(
                                    Array.isArray(scenario.content)
                                      ? scenario.content.join('\n\n')
                                      : scenario.content
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[rgba(0,0,0,0.58)] italic">
                          Applied scenario simulations are tailored based on the client's industry context.
                        </p>
                      )}

                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

      </main>

      {/* RFQ POPUP MODAL */}
      <RfqModal
        programme={programme}
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
      />

    </div>
  );
};
