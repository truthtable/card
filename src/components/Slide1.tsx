import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DovesFlight } from './DovesFlight';
import { RosePetals } from './RosePetals';
import { SwingingLanterns } from './SwingingLanterns';

interface Slide1Props {
  animate?: boolean;
}

export const Slide1: React.FC<Slide1Props> = ({ animate = true }) => {
  const handleScrollClick = () => {
    const slide2 = document.getElementById('slide2');
    if (slide2) {
      slide2.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-between items-center bg-[#f7ebe4]">
      {/* Background: Desktop and Mobile variants */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <source media="(max-width: 768px)" srcSet="./media/h-mobile-new.webp" />
        <img
          src="./media/h-desktop-new.webp"
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
        <div
          className={`w-[180px] sm:w-[220px] md:w-[250px] max-w-[70vw] mt-2 sm:mt-14 md:mt-1 mb-1 sm:mb-4 drop-shadow-[0_2px_4px_rgba(100,20,30,0.15)] will-change-transform ${animate ? 'anim-text-calligraphy' : 'opacity-0'
            }`}
        >
          <img
            src="./media/text1.webp"
            alt="Bismillah Calligraphy"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
          />
        </div>

        {/* 2. Opening Bismillah Blessing */}
        <p
          className={`font-sans font-medium leading-tight text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#6e2837] max-w-xl mx-10 leading-relaxed px-2 drop-shadow-sm mb-2 sm:mb-4 will-change-transform ${animate ? 'anim-text-bismillah' : 'opacity-0'
            }`}
        >
          In the Name of Allah, We Begin Our Journey Together, Seeking His Blessings, Love, and Mercy.
        </p>

        {/* 3. Divider Ornament divider.webp */}
        <div
          className={`w-[220px] sm:w-[280px] md:w-[320px] max-w-[80vw] mb-1 sm:mb-3 origin-center will-change-transform ${animate ? 'anim-text-divider' : 'opacity-0'
            }`}
        >
          <img
            src="./media/divider.webp"
            alt="Ornamental Divider"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* Couple's Arabic Names Calligraphy Logo */}
        <div
          className={`w-[68px] sm:w-[84px] md:w-[96px] my-1 sm:my-2 drop-shadow-[0_2px_6px_rgba(100,20,30,0.18)] will-change-transform transform-gpu ${animate ? 'anim-text-groom' : 'opacity-0'
            }`}
        >
          <img
            src="./media/couples_arabic_names_logo.png"
            alt="Taha & Zainab Arabic Calligraphy Logo"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
          />
        </div>

        {/* 4. Couple Names & Nikah Invitation */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 mt-0 sm:mt-2">
          {/* Groom Name */}
          <div className='flex flex-row justify-center items-center'>
            <h1
              className={`font-italiana font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#531322] tracking-wide drop-shadow-[0_2px_6px_rgba(83,19,34,0.15)] will-change-transform ${animate ? 'anim-text-groom' : 'opacity-0'
                }`}
            >
              Taha
            </h1>

            {/* Ampersand */}
            <span
              className={`font-light text-2xl sm:text-4xl md:text-5xl text-[#b5812d] drop-shadow-sm my-0 mx-2 sm:my-1 will-change-transform ${animate ? 'anim-text-ampersand' : 'opacity-0'
                }`}
            >
              &
            </span>

            {/* Bride Name */}
            <h1
              className={`font-italiana font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#531322] tracking-wide drop-shadow-[0_2px_6px_rgba(83,19,34,0.15)] will-change-transform ${animate ? 'anim-text-bride' : 'opacity-0'
                }`}
            >
              Zainab
            </h1>
          </div>
          {/* Invitation Line */}
          <p
            className={`font-sans font-medium text-[11px] leading-tight sm:text-[13px] md:text-[14px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#6e2837] pt-4 sm:pt-6 drop-shadow-sm will-change-transform ${animate ? 'anim-text-invite' : 'opacity-0'
              }`}
          >
            INVITE YOU TO CELEBRATE THEIR NIKAH
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        onClick={handleScrollClick}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to invitation"
        className={`absolute bottom-10 sm:bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer select-none group transition-opacity duration-1000 ${animate ? 'opacity-90 hover:opacity-100 delay-[2200ms]' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center animate-scroll-bounce">
          <span className="font-sans font-extrabold text-[20px] sm:text-[11px] md:text-[18px] uppercase tracking-[0.25em] text-[#6e2837] group-hover:text-[#531322] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] transition-colors">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#6e2837] group-hover:text-[#531322] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] transition-colors stroke-[2.5] -mt-0.5" />
        </div>
      </div>

      {/* Bottom Grill Border (grild.webp) */}
      <div
        className="relative z-20 w-full h-[32px] sm:h-[40px] md:h-[46px] pointer-events-none select-none flex-shrink-0"
        style={{
          backgroundImage: "url('./media/grild.webp')",
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

