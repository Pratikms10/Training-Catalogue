'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

type ParallaxComponentProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function ParallaxComponent({ children, className = '', ...props }: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none', force3D: true },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          // Lenis already eases the page movement; a short scrub keeps the
          // layers responsive instead of adding a second, noticeable delay.
          scrub: 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            root.dataset.parallaxProgress = self.progress.toFixed(3);
          },
        },
      });

      timeline
        .fromTo(
          '[data-parallax-layer="background"]',
          { yPercent: 0, scale: 1.005 },
          { yPercent: 5.5, scale: 1.035 },
          0,
        )
        .fromTo(
          '[data-parallax-layer="light"]',
          { xPercent: 0, yPercent: 0, scale: 1 },
          { xPercent: 1.2, yPercent: -2.5, scale: 1.025 },
          0,
        )
        .fromTo(
          '[data-parallax-layer="wash"]',
          { yPercent: 0 },
          { yPercent: 2.2 },
          0,
        )
        .fromTo(
          '[data-parallax-layer="copy"]',
          { yPercent: 0, scale: 1, autoAlpha: 1 },
          { yPercent: -11, scale: 0.98, autoAlpha: 0 },
          0,
        );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(root.querySelectorAll('img'));
    images.forEach((image) => {
      if (!image.complete) image.addEventListener('load', refresh, { once: true });
    });
    requestAnimationFrame(refresh);
    const postLoaderRefresh = window.setTimeout(refresh, 3400);

    return () => {
      window.clearTimeout(postLoaderRefresh);
      images.forEach((image) => image.removeEventListener('load', refresh));
      context.revert();
    };
  }, []);

  return (
    <section ref={parallaxRef} data-parallax-layers className={`parallax ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}
