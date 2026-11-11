import React, { useEffect, useRef, useState } from 'react';

export const Slide8: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="slide8"
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col justify-center items-center py-5 sm:py-7 md:py-8 px-4 text-center select-none"
    >
      {/* ── Background: Reflecting Pool Palace ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img
          src="./media/Reflecting-Pool.webp"
          alt="Reflecting Pool Palace"
          className="w-full h-full object-cover object-[center_35%] filter brightness-[1.02] contrast-[0.98] opacity-50"
        />
        {/* Soft Royal Ivory Glow Overlay for Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#fdf7ee]/70 via-[#fdf7ee]/35 to-[#fdf7ee]/75"
          aria-hidden="true"
        />
      </div>

      {/* ── Main Content Container ── */}
      <div
        className={`relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-4 py-1 sm:py-2 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
          }`}
      >
        {/* 1. Arabic Dua */}
        <h2
          dir="rtl"
          lang="ar"
          className="font-urdu text-lg xs:text-xl sm:text-2xl md:text-3xl text-[#6B1E2F] font-bold leading-[1.9] sm:leading-[2.1] tracking-normal mb-1 drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]"
        >
          بَارَكَ ٱللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </h2>

        {/* 2. We await your blessed presence */}
        <p className="font-script italic mt-2 text-xl xs:text-2xl sm:text-3xl text-[#9c6d3b] tracking-wide mb-2 sm:mb-2.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          We await your blessed presence
        </p>

        {/* 3. Wax Seal Badge with "T & Z" */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 my-1 sm:my-1.5 transition-transform duration-500 hover:scale-105">
          <img
            src="./media/Seal-Badge.webp"
            alt="Royal Wax Seal"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(90,15,25,0.4)] pointer-events-none select-none"
          />
          <div className="absolute inset-0 flex items-center justify-center pb-0.5">
            <span className="font-cinzel font-bold text-[10px] sm:text-xs md:text-sm text-[#fff6e6] tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] select-none">
              T &amp; Z
            </span>
          </div>
        </div>

        {/* 4. Couple Names */}
        <h3 className="font-script italic text-2xl xs:text-3xl sm:text-4xl text-[#6B1E2F] font-medium tracking-wide mt-1 mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          Taha &amp; Zainab
        </h3>

        {/* 5. Floral Ornament Divider */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#a8743b] opacity-85 my-1 tracking-[0.25em]">
          <span>-❦✿❦-</span>
        </div>

        {/* 6. 2 DAYS | 1 BIG CELEBRATION | UNLIMITED MEMORIES */}
        <p className="font-cinzel font-semibold text-[11px] xs:text-xs sm:text-sm md:text-[15px] text-[#8b5a2b] uppercase tracking-[0.16em] sm:tracking-[0.22em] max-w-xl mx-auto leading-relaxed mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          2 DAYS | 1 BIG CELEBRATION | UNLIMITED MEMORIES
        </p>

        {/* 7. Your presence is our biggest celebration! */}
        <p className="font-cormorant italic font-semibold text-sm xs:text-base sm:text-lg text-[#8b5a2b] tracking-wide mt-1 max-w-lg mx-auto drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          Your presence is our biggest celebration!
        </p>

        {/* 8. AB HOGA FULL-ON SHAADI DHAMAAL! */}
        <p className="font-cinzel font-bold text-[11px] xs:text-xs sm:text-sm md:text-base text-[#6b1d2e] uppercase tracking-[0.16em] sm:tracking-[0.2em] mt-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.75)]">
          AB HOGA FULL-ON SHAADI DHAMAAL!
        </p>

        {/* 9. SEE YOU ALL THERE! */}
        <p className="font-cinzel font-bold text-[11px] xs:text-xs sm:text-sm md:text-base text-[#8b5a2b] uppercase tracking-[0.2em] sm:tracking-[0.24em] mt-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          SEE YOU ALL THERE!
        </p>

        {/* 10. Date */}
        <p className="font-cormorant font-semibold text-xs sm:text-sm text-[#9c6d3b] tracking-[0.18em] uppercase mt-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          28th November 2026
        </p>

        {/* 11. Subtle Heart Accents */}
        <div className="flex items-center justify-center gap-2 mt-1.5 text-[#6b1d2e]/70 text-xs sm:text-sm animate-pulse">
          <span>♥</span>
          <span>♥</span>
        </div>
      </div>

      {/* ── Bottom Pattern Border (pattern.webp) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 w-full h-[18px] sm:h-[24px] pointer-events-none select-none opacity-85"
        style={{
          backgroundImage: "url('./media/pattern.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Slide8;
