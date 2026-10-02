import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 8;

export function GlassCursor() {
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pointer = { x: -80, y: -80 };
    const points = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -80, y: -80 }));
    let visible = false;
    let frame = 0;
    let previousScroll = window.scrollY;

    const render = () => {
      let targetX = pointer.x;
      let targetY = pointer.y;

      points.forEach((point, index) => {
        const ease = Math.max(.075, .22 - index * .014);
        point.x += (targetX - point.x) * ease;
        point.y += (targetY - point.y) * ease;
        targetX = point.x;
        targetY = point.y;

        const node = trailRefs.current[index];
        if (node) {
          node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${1 - index * .055})`;
          node.style.opacity = visible ? String(.72 - index * .055) : '0';
        }
      });

      frame = window.requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX + 9;
      pointer.y = event.clientY + 11;
      if (!visible) {
        points.forEach((point) => {
          point.x = pointer.x;
          point.y = pointer.y;
        });
      }
      visible = true;
    };

    const scroll = () => {
      const delta = window.scrollY - previousScroll;
      previousScroll = window.scrollY;
      points.forEach((point, index) => {
        point.y -= Math.max(-34, Math.min(34, delta * .14)) * ((index + 1) / TRAIL_LENGTH);
      });
    };

    const hide = () => { visible = false; };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      document.documentElement.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div className="cursor-system" aria-hidden="true">
      {Array.from({ length: TRAIL_LENGTH }, (_, index) => (
        <span
          className="cursor-trail"
          key={index}
          ref={(node) => { trailRefs.current[index] = node; }}
        />
      ))}
    </div>
  );
}
