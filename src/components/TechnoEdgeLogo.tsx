import React from 'react';

export interface TechnoEdgeLogoProps {
  className?: string;
  variant?: 'color' | 'watermark' | 'monochrome';
  color?: string;
  id?: string;
}

const DOTS = [
  { x: 168.0, y: 498.0, r: 13.0 },
  { x: 199.0, y: 524.0, r: 10.5 },
  { x: 230.0, y: 543.0, r: 8.5 },
  { x: 258.0, y: 554.0, r: 7.0 },
  { x: 282.0, y: 560.0, r: 5.5 },
  { x: 300.0, y: 561.5, r: 4.8 },
  { x: 318.0, y: 560.0, r: 5.5 },
  { x: 342.0, y: 554.0, r: 7.0 },
  { x: 370.0, y: 543.0, r: 8.5 },
  { x: 401.0, y: 524.0, r: 10.5 },
  { x: 432.0, y: 498.0, r: 13.0 }
];

export const TechnoEdgeLogo: React.FC<TechnoEdgeLogoProps> = ({
  className = 'w-10 h-10',
  variant = 'color',
  color,
  id = 'technoedge-brand-logo'
}) => {
  const isWatermark = variant === 'watermark';
  const isMonochrome = variant === 'monochrome';

  // Primary colors: Vibrant Sky Blue (#3B9EFF) and Light Pastel Blue (#96CBFF)
  const primaryFill = color 
    ? color 
    : (isWatermark || isMonochrome) 
      ? 'currentColor' 
      : '#3B9EFF';

  const secondaryFill = color
    ? color
    : isMonochrome
      ? 'currentColor'
      : isWatermark
        ? 'currentColor'
        : '#96CBFF';

  const primaryOpacity = isWatermark ? 0.95 : 1;
  const secondaryOpacity = isWatermark ? 0.55 : 1;

  return (
    <svg
      id={id}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TechnoEdge Logo"
      role="img"
    >
      {/* Outer Vibrant Sky Blue Crescent */}
      <path
        d="M 152 485
           C 84 402 60 280 102 176
           C 144 75 220 58 300 58
           C 380 58 456 75 498 176
           C 540 280 516 402 448 485
           C 434 455 412 390 384 316
           C 364 264 336 205 300 172
           C 264 205 236 264 216 316
           C 188 390 166 455 152 485 Z"
        fill={primaryFill}
        fillOpacity={primaryOpacity}
      />

      {/* Inner Light Pastel Blue Crescent Arc */}
      <path
        d="M 148 275
           C 178 185 232 132 300 132
           C 368 132 422 185 452 275
           C 426 215 372 172 300 172
           C 228 172 174 215 148 275 Z"
        fill={secondaryFill}
        fillOpacity={secondaryOpacity}
      />

      {/* Crescent Tail Extensions */}
      <path 
        d="M 152 485 C 157 490 162 494 167 498" 
        stroke={primaryFill} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeOpacity={primaryOpacity}
      />
      <path 
        d="M 448 485 C 443 490 438 494 433 498" 
        stroke={primaryFill} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeOpacity={primaryOpacity}
      />

      {/* Arrowhead Left Facet (Primary Vibrant Sky Blue) */}
      <path
        d="M 300 178
           L 150 312
           L 228 412
           L 288 284
           L 300 545
           Z"
        fill={primaryFill}
        fillOpacity={primaryOpacity}
      />

      {/* Arrowhead Right Facet (Secondary Light Pastel Blue) */}
      <path
        d="M 300 178
           L 450 312
           L 372 412
           L 312 284
           L 300 545
           Z"
        fill={secondaryFill}
        fillOpacity={secondaryOpacity}
      />

      {/* 11 Dots Along Base Arc */}
      <g fill={primaryFill} fillOpacity={primaryOpacity}>
        {DOTS.map((d, index) => (
          <circle key={index} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </g>
    </svg>
  );
};
