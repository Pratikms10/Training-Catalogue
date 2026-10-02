import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import heroImageSrc from '../assets/images/hero_charac_image_without_bg_1788155409717.jpg';

export function HeroCharacterCutout() {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = heroImageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProcessedSrc(heroImageSrc);
          return;
        }

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample background color from corners (usually near-white)
        // Convert pure white and near-white background to true alpha transparency
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is near white / background
          const minVal = Math.min(r, g, b);
          const maxVal = Math.max(r, g, b);
          const isNeutral = maxVal - minVal < 25; // low saturation

          if (minVal > 220 && isNeutral) {
            // Smooth alpha falloff for antialiasing around edges
            if (minVal > 248) {
              data[i + 3] = 0; // Fully transparent
            } else {
              const alpha = Math.floor(((248 - minVal) / 28) * 255);
              data[i + 3] = Math.min(data[i + 3], alpha);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas alpha processing fallback', err);
        setProcessedSrc(heroImageSrc);
      }
    };

    img.onerror = () => {
      setProcessedSrc(heroImageSrc);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative flex items-center justify-center w-full select-none pointer-events-none"
    >
      {/* Levitating float animation wrapper */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          rotate: [-0.6, 0.6, -0.6],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative max-w-[352px] sm:max-w-[418px] lg:max-w-[462px] w-full flex justify-center items-center"
      >
        <img
          src={processedSrc || heroImageSrc}
          alt="TechnoEdge 3D Interactive Learner"
          referrerPolicy="no-referrer"
          className="w-full h-auto max-h-[396px] sm:max-h-[462px] lg:max-h-[506px] object-contain mix-blend-multiply filter contrast-[1.02] select-none pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}
