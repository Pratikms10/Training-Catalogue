import React, { MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const IntroductionStructure: React.FC = () => {
  // Cursor tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  // Staggered springs for a fluid neon comet trail
  const trail1X = useSpring(mouseX, { stiffness: 1000, damping: 40 });
  const trail1Y = useSpring(mouseY, { stiffness: 1000, damping: 40 });
  
  const trail2X = useSpring(mouseX, { stiffness: 800, damping: 35 });
  const trail2Y = useSpring(mouseY, { stiffness: 800, damping: 35 });
  
  const trail3X = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const trail3Y = useSpring(mouseY, { stiffness: 500, damping: 30 });
  
  const trail4X = useSpring(mouseX, { stiffness: 300, damping: 25 });
  const trail4Y = useSpring(mouseY, { stiffness: 300, damping: 25 });
  
  const trail5X = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const trail5Y = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  const trail6X = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const trail6Y = useSpring(mouseY, { stiffness: 50, damping: 15 });

  const springOpacity = useSpring(opacity, { stiffness: 40, damping: 20 });

  // Origin fill effect for summary badge
  const [badgeOrigin, setBadgeOrigin] = React.useState({ x: 0, y: 0, coverSize: 0, isHovered: false });

  // 3D Left-Right Flip state for the hero TechnoEdge central logo
  const [isLogoFlipping, setIsLogoFlipping] = React.useState(false);

  const handleLogoMouseEnter = () => {
    // Check if device is touch-only/no hover or if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const isTouchOrCoarse = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isTouchOrCoarse || prefersReducedMotion) {
        return;
      }
    }

    // Play animation once per mouse entry; do not restart if already flipping
    if (!isLogoFlipping) {
      setIsLogoFlipping(true);
    }
  };

  const handleLogoAnimationEnd = () => {
    setIsLogoFlipping(false);
  };

  const handleBadgePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coverSize = Math.ceil(
      2 * Math.max(Math.hypot(x, y), Math.hypot(rect.width - x, y), Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y))
    );
    setBadgeOrigin({ x, y, coverSize, isHovered: true });
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
  };

  return (
    <section 
      id="section-main-introduction" 
      className="w-full bg-transparent py-6 lg:py-8 px-4 sm:px-8 lg:px-10 shrink-0 overflow-hidden relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Light Blue Neon Cursor Trail */}
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '4px', height: '4px', x: trail6X, y: trail6Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#1E88E5', boxShadow: '0 0 10px #1E88E5', willChange: 'transform' }} />
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '6px', height: '6px', x: trail5X, y: trail5Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#2196F3', boxShadow: '0 0 12px #2196F3', willChange: 'transform' }} />
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '8px', height: '8px', x: trail4X, y: trail4Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#42A5F5', boxShadow: '0 0 15px #42A5F5, 0 0 5px #42A5F5', willChange: 'transform' }} />
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '10px', height: '10px', x: trail3X, y: trail3Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#64B5F6', boxShadow: '0 0 20px #2196F3, 0 0 10px #64B5F6', willChange: 'transform' }} />
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '12px', height: '12px', x: trail2X, y: trail2Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#90CAF9', boxShadow: '0 0 25px #2196F3, 0 0 15px #64B5F6', willChange: 'transform' }} />
      {/* Head */}
      <motion.div className="absolute pointer-events-none z-0 rounded-full" style={{ width: '14px', height: '14px', x: trail1X, y: trail1Y, translateX: '-50%', translateY: '-50%', opacity: springOpacity, background: '#FFFFFF', boxShadow: '0 0 35px #0000FF, 0 0 20px #2196F3, 0 0 10px #FFFFFF', willChange: 'transform' }} />

      {/* Global Section Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Dynamic Light Blue SVG Wave / Flowing Fabric Effect */}
        <svg 
          className="absolute top-0 right-0 w-full h-full opacity-[0.15] mix-blend-multiply" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 C30,40 70,10 100,50 L100,0 Z" 
            fill="url(#blue-gradient-1)"
          />
          <path 
            d="M0,20 C40,60 80,20 100,70 L100,0 L0,0 Z" 
            fill="url(#blue-gradient-2)"
            opacity="0.5"
          />
          <path 
            d="M-20,100 C30,60 70,80 120,40 L120,100 Z" 
            fill="url(#blue-gradient-3)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="blue-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2196F3" />
              <stop offset="100%" stopColor="#0000FF" />
            </linearGradient>
            <linearGradient id="blue-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64B5F6" />
              <stop offset="100%" stopColor="#2196F3" />
            </linearGradient>
            <linearGradient id="blue-gradient-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E88E5" />
              <stop offset="100%" stopColor="#E3F2FD" />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft top-left ambient light blue glow to anchor the text */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#2196F3]/[0.08] to-transparent rounded-full blur-[80px] -translate-x-1/4 -translate-y-1/4"></div>
        
        {/* Expansive soft blue glow radiating from the bottom right */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-[#0000FF]/[0.04] to-transparent rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>

        {/* Elegant organic abstract light-blue wave in top-right */}
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-[#2196F3]/[0.07] via-[#0000FF]/[0.02] to-transparent rounded-[0_0_0_100%] blur-[40px] mix-blend-multiply opacity-80 translate-x-10 -translate-y-10"></div>
        <div className="absolute top-[-100px] right-[-50px] w-[500px] h-[600px] bg-gradient-to-b from-[#2196F3]/[0.06] to-transparent rounded-[100%] blur-[60px] rotate-45 pointer-events-none opacity-60"></div>

        {/* Global architectural macro grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1
                }
              }
            }}
            className="lg:col-span-6 z-10"
          >
            <motion.h1 
              id="main-introduction-headline"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-3xl lg:text-5xl font-extrabold mb-5 text-[#000000] tracking-tight leading-[1.15]"
            >
              Exclusive Corporate <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000FF] to-[#2196F3]">
                Training Catalogue
              </span>
            </motion.h1>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="mb-8 relative"
            >
              <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#0000FF] to-[#2196F3]/30 rounded-full"></div>
              <p id="main-introduction-description" className="pl-5 text-base lg:text-lg text-[rgba(0,0,0,0.72)] max-w-xl leading-relaxed">
                3,500+ curated corporate training programmes, shaped by real-world experience and designed to bridge strategic skill gaps.
              </p>
            </motion.div>

            {/* Quick architectural summary badges */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex flex-wrap items-center gap-3 text-sm text-[rgba(0,0,0,0.72)]"
            >
              <div 
                id="intro-programmes-badge"
                onPointerEnter={handleBadgePointer}
                onPointerDown={handleBadgePointer}
                onPointerLeave={() => setBadgeOrigin((prev) => ({ ...prev, isHovered: false }))}
                className="relative overflow-hidden inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-full bg-white/95 backdrop-blur-md border border-[rgba(0,0,255,0.22)] hover:border-[#0000FF]/30 shadow-xs hover:shadow-[0_6px_20px_rgba(0,0,255,0.20)] hover:scale-[1.01] transition-all duration-200 cursor-pointer select-none group"
              >
                {/* Dynamic Origin Fill Ripple */}
                <motion.span
                  animate={{ scale: badgeOrigin.isHovered && badgeOrigin.coverSize > 0 ? 1 : 0 }}
                  aria-hidden
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[rgba(0,0,255,0.16)] to-[rgba(33,150,243,0.22)]"
                  initial={false}
                  style={{
                    height: badgeOrigin.coverSize,
                    left: badgeOrigin.x,
                    top: badgeOrigin.y,
                    width: badgeOrigin.coverSize,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />

                <span className="relative z-10 flex h-3 w-3 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2196F3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0000FF] group-hover:bg-[#22c55e] transition-colors duration-200"></span>
                </span>
                
                <span className="relative z-10 text-xl sm:text-2xl font-black text-[#0000FF] group-hover:text-[#22c55e] tracking-tight leading-none transition-colors duration-200">
                  3,500+
                </span>

                <span className="relative z-10 h-4.5 w-[1.5px] bg-[rgba(0,0,255,0.20)] hidden sm:inline-block" aria-hidden="true"></span>

                <span className="relative z-10 text-xs sm:text-sm font-bold text-[rgba(0,0,0,0.85)] tracking-wide">
                  Total Curated Programmes
                </span>
              </div>
            </motion.div>
          </motion.div>
          
          <div 
            id="hero-visual-container"
            className="hidden lg:flex lg:col-span-6 justify-center items-center relative py-4 lg:py-6 min-h-[360px] xl:min-h-[380px] ml-0 mt-[20px] mb-[20px]"
          >
            {/* Futuristic Enterprise Nexus Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
              
              {/* Core Holographic Plate */}
              <div className="absolute w-[360px] h-[360px] rounded-full bg-white/20 backdrop-blur-md border border-white/50 shadow-[0_0_60px_rgba(33,150,243,0.15)] z-0"></div>
              
              {/* Deep Core Glow */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-[#0000FF]/[0.03] to-[#2196F3]/[0.08] rounded-full blur-[35px] z-0"
              ></motion.div>

              {/* Orbital Tracking Ring 1 (Inner) */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[380px] h-[380px] rounded-full border border-[#2196F3]/25 border-dashed z-0 pointer-events-none"
              >
                {/* Orbiting Satellite Node 1 - Complete, perfectly centered on the orbit stroke */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#2196F3] rounded-full shadow-[0_0_12px_#2196F3] z-10"></div>
                {/* Orbiting Satellite Node 2 */}
                <div className="absolute bottom-4 left-16 w-2.5 h-2.5 bg-[#0000FF] rounded-full shadow-[0_0_8px_#0000FF] z-10"></div>
              </motion.div>

              {/* Orbital Tracking Ring 2 (Outer) */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute w-[440px] h-[440px] rounded-full border-[1.5px] border-[#0000FF]/15 z-0 pointer-events-none"
              >
                 {/* Orbiting Satellite Node - Complete full round dot with no clipping */}
                 <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#0000FF] rounded-full shadow-[0_0_12px_#0000FF] z-10"></div>
              </motion.div>

              {/* Orbital Tracking Ring 3 (Faint outer boundary) */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-[#2196F3]/[0.05] border-dotted z-0"></div>

              {/* HUD Target Brackets */}
              <div className="absolute w-[300px] h-[300px] z-0 opacity-40">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0000FF]/30 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0000FF]/30 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0000FF]/30 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0000FF]/30 rounded-br-xl"></div>
              </div>

              {/* Precision Grid Data Lines */}
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#2196F3]/20 to-transparent top-1/2 -translate-y-1/2 z-0"></div>
              <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#0000FF]/10 to-transparent left-1/2 -translate-x-1/2 z-0"></div>

              {/* Scanner Sweep Overlay */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[440px] h-[440px] rounded-full z-0 overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-[#2196F3]/10 to-transparent origin-top-left -translate-y-full"></div>
              </motion.div>

              {/* Ambient Floating Data Nodes */}
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute w-1.5 h-1.5 rounded-full bg-[#0000FF]/40 top-16 right-24 z-0"></motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute w-2 h-2 rounded-full bg-[#2196F3]/50 bottom-20 left-16 z-0"></motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute w-1 h-1 rounded-full bg-[#0000FF]/60 bottom-32 right-12 z-0"></motion.div>
              
              {/* Futuristic Micro-Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(33,150,243,0.03)_1.5px,transparent_1.5px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] z-0"></div>
            </div>

            {/* Logo Container with 3D Left-Right Flip Swivel & Entrance Animation */}
            <div 
              id="hero-logo-interactive-area"
              className="hero-logo-entrance relative z-10 w-full max-w-[320px] xl:max-w-[350px] flex items-center justify-center cursor-pointer"
              onMouseEnter={handleLogoMouseEnter}
            >
              <div 
                id="hero-central-logo-flipper"
                className={`hero-logo-3d-flipper ${isLogoFlipping ? 'is-flipping' : ''} flex items-center justify-center`}
                onAnimationEnd={handleLogoAnimationEnd}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform',
                  transformOrigin: 'center center'
                }}
              >
                <img 
                  id="hero-visual-logo-img"
                  src="/hero-logo.png" 
                  alt="TechnoEdge Corporate" 
                  className="w-auto h-auto max-h-[300px] xl:max-h-[330px] max-w-full object-contain drop-shadow-xl select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
