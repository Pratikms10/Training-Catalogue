import { motion, type HTMLMotionProps } from 'motion/react';
import React from 'react';

interface SectionRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  amount?: number | 'some' | 'all';
  once?: boolean;
}

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 36,
  amount = 0.12,
  once = true,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '-40px 0px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
