import React from 'react';

export const SwingingLanterns: React.FC = () => {
  return (
    <>
      {/* Left Hanging Lantern */}
      <div
        className="absolute top-0 left-[2.5%] sm:left-[5%] md:left-[8%] lg:left-[9.5%] z-20 w-[64px] sm:w-[80px] md:w-[96px] lg:w-[104px] animate-lantern-left pointer-events-none drop-shadow-[0_8px_16px_rgba(184,134,11,0.45)]"
        aria-hidden="true"
      >
        <img
          src="/media/lantern-1.webp"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </div>

      {/* Right Hanging Lantern */}
      <div
        className="absolute top-0 right-[2.5%] sm:right-[5%] md:right-[8%] lg:right-[9.5%] z-20 w-[64px] sm:w-[80px] md:w-[96px] lg:w-[104px] animate-lantern-right pointer-events-none drop-shadow-[0_8px_16px_rgba(184,134,11,0.45)]"
        aria-hidden="true"
      >
        <img
          src="/media/lantern-1.webp"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </div>
    </>
  );
};

