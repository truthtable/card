import React from 'react';

interface DoveConfig {
  id: number;
  top: string;
  width: number;
  flyDuration: string;
  flyDelay: string;
  flapDuration: string;
  wingDuration: string;
  wingDelay: string;
  reverse?: boolean;
}

const DOVES: DoveConfig[] = [
  {
    id: 1,
    top: '7%',
    width: 62,
    flyDuration: '24s',
    flyDelay: '-4s',
    flapDuration: '1.4s',
    wingDuration: '0.65s',
    wingDelay: '-0.1s',
  },
  {
    id: 2,
    top: '12%',
    width: 52,
    flyDuration: '28s',
    flyDelay: '-11s',
    flapDuration: '1.6s',
    wingDuration: '0.7s',
    wingDelay: '-0.3s',
  },
  {
    id: 3,
    top: '16%',
    width: 58,
    flyDuration: '22s',
    flyDelay: '-18s',
    flapDuration: '1.3s',
    wingDuration: '0.6s',
    wingDelay: '-0.2s',
  },
  {
    id: 4,
    top: '5%',
    width: 48,
    flyDuration: '32s',
    flyDelay: '-7s',
    flapDuration: '1.5s',
    wingDuration: '0.68s',
    wingDelay: '-0.4s',
  },
  {
    id: 5,
    top: '19%',
    width: 44,
    flyDuration: '26s',
    flyDelay: '-14s',
    flapDuration: '1.4s',
    wingDuration: '0.62s',
    wingDelay: '-0.15s',
  },
  {
    id: 6,
    top: '9%',
    width: 54,
    flyDuration: '30s',
    flyDelay: '-22s',
    flapDuration: '1.7s',
    wingDuration: '0.72s',
    wingDelay: '-0.35s',
  },
];

export const DovesFlight: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 h-[45%] pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {DOVES.map((dove) => (
        <div
          key={dove.id}
          className="absolute left-0 will-change-transform"
          style={{
            top: dove.top,
            width: `${dove.width}px`,
            animation: `${dove.reverse ? 'dove-fly-right-to-left' : 'dove-fly-left-to-right'} ${dove.flyDuration} linear infinite`,
            animationDelay: dove.flyDelay,
            filter: 'drop-shadow(0 6px 10px rgba(110, 40, 50, 0.22))',
          }}
        >
          <div
            className="w-full select-none"
            style={{
              aspectRatio: '0.5',
              backgroundImage: "url('/media/Doves-in-Flight.webp')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: '600% 100%',
              animation: `dove-wings ${dove.wingDuration} steps(6) infinite ${dove.wingDelay}, dove-bob ${dove.flapDuration} ease-in-out infinite alternate`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

