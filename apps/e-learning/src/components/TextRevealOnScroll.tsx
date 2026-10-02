import { useRef, ReactNode, Key, ElementType } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface TextRevealWordProps {
  key?: Key;
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  isGradient?: boolean;
  isDark?: boolean;
}

const RevealWord = ({
  children,
  progress,
  range,
  className = '',
  isGradient = false,
  isDark = false,
}: TextRevealWordProps) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [4, 0]);

  if (isGradient) {
    return (
      <span className="relative inline-block mr-[0.24em] last:mr-0">
        {/* Dimmed background base layer */}
        <span
          className={`opacity-15 select-none pointer-events-none ${
            isDark ? 'text-white' : 'text-[#0b0b0d]'
          }`}
        >
          {children}
        </span>
        {/* Illuminated vivid gradient layer */}
        <motion.span
          style={{ opacity, y }}
          className={`absolute inset-0 select-auto ${className}`}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.24em] last:mr-0 ${className}`}
    >
      {children}
    </motion.span>
  );
};

export interface TextRevealLine {
  text: string;
  className?: string;
  isGradient?: boolean;
}

export interface TextRevealOnScrollProps {
  lines: TextRevealLine[];
  containerClassName?: string;
  lineClassName?: string;
  scrollOffset?: [string, string];
  as?: ElementType;
  isDark?: boolean;
}

export function TextRevealOnScroll({
  lines,
  containerClassName = '',
  lineClassName = '',
  scrollOffset = ['start 0.92', 'start 0.45'],
  as: Component = 'div',
  isDark = false,
}: TextRevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset as any,
  });

  // Calculate total words across all lines to distribute scroll progress evenly
  const totalWords = lines.reduce(
    (acc, line) => acc + line.text.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  let globalWordIndex = 0;

  return (
    <Component ref={containerRef} className={containerClassName}>
      {lines.map((line, lineIdx) => {
        const words = line.text.trim().split(/\s+/).filter(Boolean);
        return (
          <span key={lineIdx} className={`block ${lineClassName}`}>
            {words.map((word, wordIdx) => {
              const currentIdx = globalWordIndex++;
              // Create overlapping windows for a smooth Framer wave reveal
              const step = 1 / Math.max(totalWords, 1);
              const start = Math.max(0, currentIdx * step * 0.92);
              const end = Math.min(1, start + step * 1.35);

              return (
                <RevealWord
                  key={`${lineIdx}-${wordIdx}`}
                  progress={scrollYProgress}
                  range={[start, end]}
                  className={line.className}
                  isGradient={line.isGradient}
                  isDark={isDark}
                >
                  {word}
                </RevealWord>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}

export interface TextRevealHeadingProps {
  lines: TextRevealLine[];
  className?: string;
  lineClassName?: string;
  scrollOffset?: [string, string];
  as?: ElementType;
  isDark?: boolean;
}

export function TextRevealHeading({
  lines,
  className = '',
  lineClassName = '',
  scrollOffset = ['start 0.92', 'start 0.5'],
  as = 'h2',
  isDark = false,
}: TextRevealHeadingProps) {
  return (
    <TextRevealOnScroll
      lines={lines}
      containerClassName={className}
      lineClassName={lineClassName}
      scrollOffset={scrollOffset}
      as={as}
      isDark={isDark}
    />
  );
}

