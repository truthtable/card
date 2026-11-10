import React from 'react';

interface LanternConfig {
  id: number;
  left: number; // percentage across screen width
  size: number; // width in pixels
  duration: number; // animation duration in seconds
  delay: number; // negative start delay in seconds
  opacity: number;
  drift: number; // horizontal drift amplitude in px
  rotate: number; // sway angle in degrees
  blur?: boolean;
}

const LANTERNS: LanternConfig[] = [
  // Left flank (near)
  { id: 1, left: 3, size: 52, duration: 18, delay: -4, opacity: 0.85, drift: 18, rotate: 5 },
  { id: 2, left: 7, size: 34, duration: 24, delay: -11, opacity: 0.65, drift: -14, rotate: -4 },
  { id: 3, left: 12, size: 62, duration: 16, delay: -1, opacity: 0.9, drift: 20, rotate: 6 },
  { id: 4, left: 16, size: 24, duration: 30, delay: -18, opacity: 0.45, drift: -10, rotate: -3, blur: true },
  { id: 5, left: 22, size: 40, duration: 22, delay: -8, opacity: 0.75, drift: 15, rotate: 4 },
  { id: 6, left: 28, size: 20, duration: 34, delay: -22, opacity: 0.35, drift: -12, rotate: -5, blur: true },

  // Center subtle background floaters
  { id: 7, left: 38, size: 22, duration: 32, delay: -14, opacity: 0.3, drift: 16, rotate: 3, blur: true },
  { id: 8, left: 62, size: 24, duration: 36, delay: -27, opacity: 0.32, drift: -14, rotate: -4, blur: true },

  // Right flank (near)
  { id: 9, left: 72, size: 38, duration: 25, delay: -6, opacity: 0.7, drift: 12, rotate: 4 },
  { id: 10, left: 78, size: 22, duration: 33, delay: -19, opacity: 0.4, drift: -10, rotate: -3, blur: true },
  { id: 11, left: 84, size: 58, duration: 17, delay: -3, opacity: 0.88, drift: -18, rotate: -5 },
  { id: 12, left: 89, size: 32, duration: 26, delay: -13, opacity: 0.65, drift: 16, rotate: 4 },
  { id: 13, left: 93, size: 64, duration: 15, delay: -9, opacity: 0.92, drift: -22, rotate: -6 },
  { id: 14, left: 97, size: 28, duration: 28, delay: -23, opacity: 0.5, drift: 10, rotate: 3, blur: true },
];

export const FloatingLanterns: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {LANTERNS.map((l) => (
        <div
          key={l.id}
          className="lantern-fly-particle will-change-transform top-0"
          style={
            {
              left: `${l.left}%`,
              width: `${l.size}px`,
              '--lantern-duration': `${l.duration}s`,
              '--lantern-delay': `${l.delay}s`,
              '--lantern-opacity': l.opacity,
              '--lantern-drift': `${l.drift}px`,
              '--lantern-rotate': `${l.rotate}deg`,
              filter: l.blur ? 'blur(1px)' : undefined,
            } as React.CSSProperties
          }
        >
          <img
            src="./media/lantern-1-1.webp"
            alt=""
            className="w-full h-auto object-contain lantern-sway-glow"
            style={{
              animationDuration: `${3.5 + (l.id % 3) * 0.8}s`,
              animationDelay: `${(l.id * 0.4) % 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingLanterns;

