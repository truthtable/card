import React, { useMemo } from 'react';

interface PetalItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

export const RosePetals: React.FC = () => {
  const petals = useMemo<PetalItem[]>(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0 - 100%
      size: 18 + Math.random() * 24, // 18px - 42px
      duration: 10 + Math.random() * 14, // 10s - 24s
      delay: -(Math.random() * 18), // negative delay for instant seamless flow
      drift: -60 + Math.random() * 140, // -60px to +80px
      spin: 180 + Math.random() * 360,
      opacity: 0.55 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <img
          key={petal.id}
          src="./media/midnight-waltz-rosePetal.webp"
          alt=""
          className="petal-particle"
          style={
            {
              left: `${petal.left}%`,
              width: `${petal.size}px`,
              height: 'auto',
              '--petal-duration': `${petal.duration}s`,
              '--petal-delay': `${petal.delay}s`,
              '--petal-drift': `${petal.drift}px`,
              '--petal-spin': `${petal.spin}deg`,
              '--petal-opacity': petal.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

