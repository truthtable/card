import React, { useState, useEffect, useRef } from 'react';

export const Slide2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Automatically animate scroll ONLY when scroll is visible in viewport
  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Scroll is now visible on screen -> unroll
            if (openTimer) clearTimeout(openTimer);
            openTimer = setTimeout(() => {
              setIsOpen(true);
            }, 250);
          } else {
            // Scroll is not visible -> close immediately so it re-animates next time
            if (openTimer) clearTimeout(openTimer);
            setIsOpen(false);
          }
        });
      },
      {
        threshold: 0.25, // Triggers only when scroll is visible in screen
      }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      observer.disconnect();
      if (openTimer) clearTimeout(openTimer);
    };
  }, []);

  return (
    <section
      id="slide2"
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-center items-center py-12 sm:py-16 px-4 bg-[#F6E6CF] select-none"
    >
      {/* Repeating Damask Wallpaper Pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-25 z-0"
        style={{
          backgroundImage: "url('./media/pat.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '240px auto',
        }}
        aria-hidden="true"
      />

      {/* Royal Scroll Container */}
      <div
        ref={scrollRef}
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px] mx-auto my-auto"
      >
        {/* Flowers Overlay on Top Roller */}
        <div
          className={`absolute -top-7 sm:-top-9 md:-top-11 z-30 w-[78%] max-w-[370px] pointer-events-none transition-all duration-1000 ease-out ${isOpen
            ? 'opacity-100 transform translate-y-0 scale-100 delay-[550ms]'
            : 'opacity-0 transform -translate-y-4 scale-90'
            }`}
        >
          <img
            src="./media/flowers.webp"
            alt="Floral Garland"
            className="w-full h-auto object-contain mx-auto drop-shadow-[0_4px_10px_rgba(90,20,30,0.18)]"
          />
        </div>

        {/* Scroll Upper Wooden/Gold Roller */}
        <div className="relative z-20 w-full drop-shadow-[0_8px_16px_rgba(70,25,35,0.22)] -mb-[6px] transition-transform duration-700">
          <img
            src="./media/scroll-top-roller.webp"
            alt="Scroll Top Roller"
            className="w-full h-auto object-contain block select-none pointer-events-none"
          />
        </div>

        {/* Middle Parchment Sheet (Expands Vertically) */}
        <div
          className={`relative z-10 w-full overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.35,1)] ${isOpen
            ? 'h-[490px] sm:h-[550px] md:h-[590px] opacity-100'
            : 'h-0 opacity-0'
            }`}
        >
          {/* Parchment Background Texture with Ornate Filigree Borders */}
          <img
            src="./media/scroll-body.webp"
            alt="Parchment Paper"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Parchment Inner Content */}
          <div
            className={`relative z-10 w-full h-full flex flex-col items-center justify-between text-center px-8 sm:px-12 py-7 sm:py-9 transition-opacity duration-700 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0'
              }`}
          >
            {/* Top Group: Arabic Calligraphy & Bismillah Translation */}
            <div className="flex flex-col items-center w-full pt-1 sm:pt-2">
              {/* Arabic Calligraphy (muslim-1785954743405.webp) */}
              <div
                className={`w-[170px] sm:w-[210px] md:w-[230px] transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 scale-100 delay-[700ms]'
                  : 'opacity-0 translate-y-3 scale-95'
                  }`}
              >
                <img
                  src="./media/muslim-1785954743405.webp"
                  alt="Bismillah Calligraphy"
                  className="w-full h-auto object-contain mx-auto drop-shadow-[0_1px_3px_rgba(100,20,30,0.18)]"
                />
              </div>

              {/* Bismillah English Text */}
              <p
                className={`font-sans font-semibold text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-[#842a3b] mt-1.5 sm:mt-2 transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 delay-[900ms]'
                  : 'opacity-0 translate-y-3'
                  }`}
              >
                Bismillahir Rahmanir Raheem
              </p>
              <span className='mt-[10px]'>Masuma & Mohammad Quettawala</span>
              {/* Cordially Request Invitation Text */}
              <p
                className={`italic font-normal leading-tight text-[12px] sm:text-[13.5px] mx-10 md:text-[14.5px] text-[#6d2535] leading-relaxed max-w-[290px] sm:max-w-[340px] mt-3 sm:mt-4 transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 delay-[1100ms]'
                  : 'opacity-0 translate-y-4'
                  }`}
              >
                Cordially request the honor of your presence at the nikah celebration of our beloved son
              </p>
            </div>

            {/* Middle Group: Groom & Bride Names */}
            <div className="flex flex-col items-center justify-center my-auto py-1 sm:py-2">
              {/* Groom: Taha */}
              <h2
                className={`font-italiana font-normal text-4xl sm:text-5xl md:text-[56px] text-[#531322] tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(83,19,34,0.12)] transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 delay-[1300ms]'
                  : 'opacity-0 translate-y-4'
                  }`}
              >
                Taha
              </h2>

              {/* Ampersand / and */}
              <span
                className={` italic text-xl sm:text-2xl md:text-3xl  text-[#842a3b] my-0.5 sm:my-1 drop-shadow-xs transition-all duration-900 ease-out ${isOpen
                  ? 'opacity-100 scale-100 delay-[1500ms]'
                  : 'opacity-0 scale-75'
                  }`}
              >
                &
              </span>

              {/* Bride: Zainab */}
              <h2
                className={`font-italiana font-normal text-4xl sm:text-5xl md:text-[56px] text-[#531322] tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(83,19,34,0.12)] transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 delay-[1700ms]'
                  : 'opacity-0 translate-y-4'
                  }`}
              >
                Zainab
              </h2>

              {/* Daughter of caption */}
              <p
                className={` italic text-[11px] sm:text-[12px] text-[#7d2f3f] tracking-wide mt-1.5 sm:mt-2 transition-all duration-1000 ease-out ${isOpen
                  ? 'opacity-100 translate-y-0 delay-[1900ms]'
                  : 'opacity-0 translate-y-3'
                  }`}
              >
                Daughter of
              </p>
              <span>
                Rashida & Najmuddin<br />Tinwala
              </span>
            </div>

            {/* Bottom Group: Wax Seal Badge (Seal-Badge.webp) */}
            <div
              className={`relative z-20 pb-1 sm:pb-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen
                ? 'opacity-100 scale-100 rotate-0 delay-[2100ms]'
                : 'opacity-0 scale-150 rotate-12'
                }`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto">
                <img
                  src="./media/Seal-Badge.webp"
                  alt="Royal Wax Seal"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(90,15,25,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Lower Wooden/Gold Roller */}
        <div className="relative z-20 w-full drop-shadow-[0_8px_16px_rgba(70,25,35,0.25)] -mt-[6px] transition-transform duration-700">
          <img
            src="./media/scroll-bottom-roller.webp"
            alt="Scroll Bottom Roller"
            className="w-full h-auto object-contain block select-none pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Slide2;
