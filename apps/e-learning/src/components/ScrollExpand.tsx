import { useCallback, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import './scroll-expand.css';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

interface ScrollExpandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  src: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startAspectRatio?: number;
  startMaxHeight?: number;
  startRight?: number;
  startLeft?: number;
  startTop?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  playAtProgress?: number;
  expandedAtProgress?: number;
  surroundingsFadeStart?: number;
  surroundingsFadeEnd?: number;
  revealStart?: number;
  revealEnd?: number;
  expansionStart?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: ReactNode;
  surroundings?: ReactNode;
  style?: CSSProperties;
}

export function ScrollExpand({
  src, mediaType = 'image', poster = '', alt = '', title = '', scrollHint = '',
  startWidth = 42, startHeight = 58, startAspectRatio = 0, startMaxHeight = 0, startRight = -1,
  startLeft = 29, startTop = 21, startRadius = 24, endRadius = 0,
  mediaZoom = 1.35, scrollDistance = 1.2, holdDistance = 0.35,
  smoothing = 0.1, overlayScrim = 0.45, playAtProgress = 0.015, expandedAtProgress = 0.98,
  surroundingsFadeStart = 0.03, surroundingsFadeEnd = 0.42,
  revealStart = 0, revealEnd = 0, expansionStart = 0, useWindowScroll = false,
  enabled = true, children, surroundings, className = '', style, ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const surroundingsRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ startWidth, startHeight, startAspectRatio, startMaxHeight, startRight, startLeft, startTop, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance, smoothing, overlayScrim, playAtProgress, expandedAtProgress, surroundingsFadeStart, surroundingsFadeEnd, revealStart, revealEnd, expansionStart, useWindowScroll, enabled });
  propsRef.current = { startWidth, startHeight, startAspectRatio, startMaxHeight, startRight, startLeft, startTop, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance, smoothing, overlayScrim, playAtProgress, expandedAtProgress, surroundingsFadeStart, surroundingsFadeEnd, revealStart, revealEnd, expansionStart, useWindowScroll, enabled };

  const applyProgress = useCallback((progress: number, started = true) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const config = propsRef.current;
    const stage = stageRef.current;
    let measuredStartWidth = config.startWidth;
    let measuredStartHeight = config.startAspectRatio > 0 && stage?.clientHeight
      ? ((stage.clientWidth * config.startWidth / 100) / config.startAspectRatio / stage.clientHeight) * 100
      : config.startHeight;
    if (config.startMaxHeight > 0 && measuredStartHeight > config.startMaxHeight && stage?.clientWidth) {
      measuredStartHeight = config.startMaxHeight;
      measuredStartWidth = ((stage.clientHeight * measuredStartHeight / 100) * config.startAspectRatio / stage.clientWidth) * 100;
    }
    const measuredStartLeft = config.startRight >= 0
      ? 100 - config.startRight - measuredStartWidth
      : config.startLeft;
    frame.style.opacity = started ? '1' : '0';
    const motionProgress = smoothstep(config.expansionStart, 1, progress);
    const eased = smoothstep(0, 1, motionProgress);
    const left = measuredStartLeft * (1 - eased);
    const top = config.startTop * (1 - eased);
    const width = measuredStartWidth + (100 - measuredStartWidth) * eased;
    const height = measuredStartHeight + (100 - measuredStartHeight) * eased;
    const radius = config.startRadius + (config.endRadius - config.startRadius) * eased;
    frame.style.left = `${left}%`;
    frame.style.top = `${top}%`;
    frame.style.width = `${width}%`;
    frame.style.height = `${height}%`;
    frame.style.borderRadius = `${radius}px`;
    frame.dataset.expanded = motionProgress >= config.expandedAtProgress ? 'true' : 'false';
    media.style.transform = `scale(${config.mediaZoom + (1 - config.mediaZoom) * eased})`;
    if (scrimRef.current) scrimRef.current.style.opacity = `${config.overlayScrim * eased}`;
    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, progress);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }
    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, progress);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }
    if (surroundingsRef.current) {
      const gone = smoothstep(config.surroundingsFadeStart, config.surroundingsFadeEnd, progress);
      surroundingsRef.current.style.opacity = `${1 - gone}`;
      surroundingsRef.current.style.transform = `translate3d(${-24 * gone}px,0,0)`;
      surroundingsRef.current.style.filter = `blur(${6 * gone}px)`;
      const revealItems = surroundingsRef.current.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
      revealItems.forEach((item, index) => {
        const stagger = index * 0.035;
        const shown = config.revealEnd > config.revealStart
          ? smoothstep(config.revealStart + stagger, config.revealEnd + stagger, progress)
          : 1;
        item.style.opacity = `${shown}`;
        item.style.transform = `translate3d(0, ${24 * (1 - shown)}px, 0) scale(${0.965 + shown * 0.035})`;
      });
    }
    if (media instanceof HTMLVideoElement) {
      if (motionProgress >= config.playAtProgress) {
        if (media.paused) media.play().catch(() => {});
      } else {
        media.pause();
        if (media.readyState >= 1) media.currentTime = 0;
      }
    }
    if (overlayRef.current) {
      const show = smoothstep(0.68, 1, progress);
      overlayRef.current.style.opacity = `${show}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - show)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;
    let animationFrame = 0, current = 0, target = 0, stageHeight = 0, running = false;
    const measure = () => {
      const config = propsRef.current;
      stageHeight = config.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageHeight <= 0) return;
      stage.style.height = `${stageHeight}px`;
      track.style.height = `${stageHeight * (1 + Math.max(0, config.scrollDistance) + Math.max(0, config.holdDistance))}px`;
      stage.style.setProperty('--se-title-size', `${clamp((root.clientWidth || stageHeight) * .075, 20, 84)}px`);
    };
    const readProgress = () => {
      const config = propsRef.current;
      if (!config.enabled) return 1;
      const span = stageHeight * Math.max(.01, config.scrollDistance);
      return config.useWindowScroll ? clamp(-track.getBoundingClientRect().top / span, 0, 1) : clamp(root.scrollTop / span, 0, 1);
    };
    const tick = () => {
      const config = propsRef.current;
      const amount = config.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * config.smoothing));
      current += (target - current) * amount;
      if (Math.abs(target - current) < .0004) { current = target; running = false; }
      applyProgress(current, track.getBoundingClientRect().top <= 0.5);
      animationFrame = running ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0) { current = target; applyProgress(current, track.getBoundingClientRect().top <= 0.5); }
      else if (!running) { running = true; animationFrame = requestAnimationFrame(tick); }
    };
    const onResize = () => { measure(); target = readProgress(); current = target; applyProgress(current, track.getBoundingClientRect().top <= 0.5); };
    measure(); target = readProgress(); current = target; applyProgress(current, track.getBoundingClientRect().top <= 0.5);
    const scroller: Window | HTMLDivElement = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const observer = new ResizeObserver(onResize); observer.observe(root);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  return <div ref={rootRef} className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()} style={style} {...rest}>
    <div ref={trackRef} className="scroll-expand__track"><div ref={stageRef} className="scroll-expand__stage">
      <div ref={frameRef} className="scroll-expand__frame">
        {mediaType === 'video'
          ? <video ref={mediaRef as RefObject<HTMLVideoElement>} className="scroll-expand__media" src={src} poster={poster} muted loop playsInline preload="auto" />
          : <img ref={mediaRef as RefObject<HTMLImageElement>} className="scroll-expand__media" src={src} alt={alt} draggable={false} />}
        <div ref={scrimRef} className="scroll-expand__scrim" />
        {children ? <div ref={overlayRef} className="scroll-expand__overlay">{children}</div> : null}
      </div>
      {surroundings ? <div ref={surroundingsRef} className="scroll-expand__surroundings">{surroundings}</div> : null}
      {title ? <div ref={titleRef} className="scroll-expand__title">{title}</div> : null}
      {scrollHint ? <div ref={hintRef} className="scroll-expand__hint">{scrollHint}</div> : null}
    </div></div>
  </div>;
}
