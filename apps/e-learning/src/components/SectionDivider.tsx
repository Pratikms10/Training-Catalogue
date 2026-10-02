import { motion } from 'motion/react';

interface SectionDividerProps {
  id?: string;
  className?: string;
}

export function SectionDivider({ id, className = '' }: SectionDividerProps) {
  return (
    <div
      id={id}
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-center overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Background Soft Frosted Glass Capsule */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Tapered Glass Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#0b0b0d]/10 to-[#0b0b0d]/20 dark:via-white/10 dark:to-white/20" />

        {/* Center Frosted Glass Micro-Pill / Bead */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-3 px-3 py-0.5 rounded-full bg-white/40 backdrop-blur-md border border-[#0b0b0d]/8 shadow-[0_2px_10px_rgba(11,11,13,0.03)] flex items-center gap-1.5"
        >
          {/* Subtle Ambient Core Glow */}
          <span className="w-1.5 h-1.5 rounded-full bg-[#0b0b0d]/60" />
          <span className="w-6 h-[1px] bg-[#0b0b0d]/15" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#444347]/60" />
        </motion.div>

        {/* Right Tapered Glass Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#0b0b0d]/10 to-[#0b0b0d]/20 dark:via-white/10 dark:to-white/20" />
      </div>
    </div>
  );
}
