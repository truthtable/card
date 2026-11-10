import React from 'react';
import { DovesFlight } from './DovesFlight';
import { RosePetals } from './RosePetals';
import { SwingingLanterns } from './SwingingLanterns';

export const Slide1: React.FC = () => {
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-between items-center bg-[#f7ebe4]">
      {/* Background: Desktop and Mobile variants */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <source media="(max-width: 768px)" srcSet="/media/h-mobile-new.webp" />
        <img
          src="/media/h-desktop-new.webp"
          alt="Palace Background"
          className="w-full h-full object-cover object-top"
        />
      </picture>

      {/* Swaying Lanterns at top corners */}
      <SwingingLanterns />

      {/* Flying Doves Strip Animation */}
      <DovesFlight />

      {/* Falling Rose Petals */}
      <RosePetals />

      {/* Center Wedding Card Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-start text-center px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-28 max-w-3xl mx-auto w-full">
        {/* 1. Arabic Calligraphy text1.webp */}
        <div className="anim-text-calligraphy w-[180px] sm:w-[220px] md:w-[250px] max-w-[70vw] mt-14 md:mt-1 mb-3 sm:mb-4 drop-shadow-[0_2px_4px_rgba(100,20,30,0.15)] will-change-transform">
          <img
            src="/media/text1.webp"
            alt="Bismillah Calligraphy"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
          />
        </div>

        {/* 2. Opening Bismillah Blessing */}
        <p className="anim-text-bismillah font-sans font-medium text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#6e2837] max-w-xl mx-auto leading-relaxed px-2 drop-shadow-sm mb-3 sm:mb-4 will-change-transform">
          In the Name of Allah, We Begin Our Journey Together, Seeking His Blessings, Love, and Mercy.
        </p>

        {/* 3. Divider Ornament divider.webp */}
        <div className="anim-text-divider w-[220px] sm:w-[280px] md:w-[320px] max-w-[80vw] mb-4 sm:mb-6 origin-center will-change-transform">
          <img
            src="/media/divider.webp"
            alt="Ornamental Divider"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* 4. Couple Names & Nikah Invitation */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 mt-1 sm:mt-2">
          {/* Groom Name */}
          <h1 className="anim-text-groom font-italiana font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#531322] tracking-wide drop-shadow-[0_2px_6px_rgba(83,19,34,0.15)] will-change-transform">
            Taha
          </h1>

          {/* Ampersand */}
          <span className="anim-text-ampersand font-light text-3xl sm:text-4xl md:text-5xl text-[#b5812d] drop-shadow-sm my-0 sm:my-1 will-change-transform">
            &
          </span>

          {/* Bride Name */}
          <h1 className="anim-text-bride font-italiana font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#531322] tracking-wide drop-shadow-[0_2px_6px_rgba(83,19,34,0.15)] will-change-transform">
            Zainab
          </h1>

          {/* Invitation Line */}
          <p className="anim-text-invite font-sans font-medium text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#6e2837] pt-4 sm:pt-6 drop-shadow-sm will-change-transform">
            INVITE YOU TO CELEBRATE THEIR NIKAH
          </p>
        </div>
      </div>

      {/* Bottom Grill Border (grild.webp) */}
      <div
        className="relative z-20 w-full h-[32px] sm:h-[40px] md:h-[46px] pointer-events-none select-none flex-shrink-0"
        style={{
          backgroundImage: "url('/media/grild.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Slide1;

