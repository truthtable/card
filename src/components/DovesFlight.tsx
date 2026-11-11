import React from 'react';

interface DoveConfig {
  id: number;
  className: string;
  flyDuration: string;
  flyDelay: string;
  flapDuration: string;
  wingDuration: string;
  wingDelay: string;
  reverse?: boolean;
  desktopOnly?: boolean;
}

const DOVES: DoveConfig[] = [
  {
    id: 1,
    className: 'top-[3%] sm:top-[7%] w-[30px] sm:w-[58px]',
    flyDuration: '24s',
    flyDelay: '-3s',
    flapDuration: '1.4s',
    wingDuration: '0.65s',
    wingDelay: '-0.1s',
  },
  {
    id: 2,
    className: 'top-[7%] sm:top-[12%] w-[26px] sm:w-[50px]',
    flyDuration: '26s',
    flyDelay: '-15s',
    flapDuration: '1.6s',
    wingDuration: '0.7s',
    wingDelay: '-0.3s',
  },
  {
    id: 3,
    className: 'top-[16%] w-[56px]',
    flyDuration: '22s',
    flyDelay: '-18s',
    flapDuration: '1.3s',
    wingDuration: '0.6s',
    wingDelay: '-0.2s',
    desktopOnly: true,
  },
  {
    id: 4,
    className: 'top-[5%] w-[46px]',
    flyDuration: '30s',
    flyDelay: '-7s',
    flapDuration: '1.5s',
    wingDuration: '0.68s',
    wingDelay: '-0.4s',
    desktopOnly: true,
  },
  {
    id: 5,
    className: 'top-[19%] w-[42px]',
    flyDuration: '26s',
    flyDelay: '-12s',
    flapDuration: '1.4s',
    wingDuration: '0.62s',
    wingDelay: '-0.15s',
    desktopOnly: true,
  },
  {
    id: 6,
    className: 'top-[9%] w-[52px]',
    flyDuration: '28s',
    flyDelay: '-22s',
    flapDuration: '1.7s',
    wingDuration: '0.72s',
    wingDelay: '-0.35s',
    desktopOnly: true,
  },
];

export const DovesFlight: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 h-[32%] sm:h-[45%] pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {DOVES.map((dove) => (
        <div
          key={dove.id}
          className={`absolute left-0 will-change-transform ${dove.desktopOnly ? 'hidden sm:block' : 'block'} ${dove.className}`}
          style={{
            animation: `${dove.reverse ? 'dove-fly-right-to-left' : 'dove-fly-left-to-right'} ${dove.flyDuration} linear infinite`,
            animationDelay: dove.flyDelay,
            filter: 'drop-shadow(0 4px 8px rgba(110, 40, 50, 0.18))',
          }}
        >
          <div
            className="w-full select-none"
            style={{
              aspectRatio: '0.5',
              backgroundImage: "url('./media/Doves-in-Flight.webp')",
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


