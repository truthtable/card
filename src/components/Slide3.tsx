import React, { useEffect, useRef, useState } from 'react';

export const Slide3: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="slide3"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-center items-center py-16 sm:py-20 px-4 bg-[#f8ede5] select-none"
    >
      {/* Background Image: Desktop & Mobile Variants */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <source media="(max-width: 768px)" srcSet="./media/couple-mobile-new.webp" />
        <img
          src="./media/couple-desktop-new.webp"
          alt="Palace Background"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Top Grill Border (grild.webp) */}
      <div
        className="absolute top-0 left-0 right-0 z-30 w-full h-[28px] sm:h-[36px] md:h-[44px] pointer-events-none select-none"
        style={{
          backgroundImage: "url('./media/grild.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />

      {/* Bottom Pattern Border (pattern.webp) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 w-full h-[24px] sm:h-[32px] md:h-[38px] pointer-events-none select-none opacity-90 drop-shadow-sm"
        style={{
          backgroundImage: "url('./media/pattern.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />

      {/* Left Hanging Lantern */}
      <div
        className="absolute top-0 left-[3%] sm:left-[10%] md:left-[18%] lg:left-[22%] z-20 w-[42px] sm:w-[56px] md:w-[68px] lg:w-[76px] animate-lantern-left pointer-events-none drop-shadow-[0_8px_16px_rgba(184,134,11,0.35)]"
        aria-hidden="true"
      >
        <img
          src="./media/lantern-1.webp"
          alt="Hanging Lantern"
          className="w-full h-auto object-contain select-none"
        />
      </div>

      {/* Right Hanging Lantern */}
      <div
        className="absolute top-0 right-[3%] sm:right-[10%] md:right-[18%] lg:right-[22%] z-20 w-[42px] sm:w-[56px] md:w-[68px] lg:w-[76px] animate-lantern-right pointer-events-none drop-shadow-[0_8px_16px_rgba(184,134,11,0.35)]"
        aria-hidden="true"
      >
        <img
          src="./media/lantern-1.webp"
          alt="Hanging Lantern"
          className="w-full h-auto object-contain select-none"
        />
      </div>

      {/* Center Content */}
      <div
        className={`relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        {/* Top Blessing Line */}
        <p className="font-script text-2xl sm:text-3xl md:text1xl text-[#bd8c37] drop-shadow-sm mb-1 sm:mb-2">
          With the duas of our elders
        </p>

        {/* The Blessed Union Title */}
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-medium text-[#531322] tracking-[0.06em] mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(83,19,34,0.12)]">
          The Blessed Union
        </h2>

        {/* Subtitle Message */}
        <p className="font-sans text-[11px] sm:text-[13px] md:text-[14px] text-[#78404d] tracking-wide max-w-xl mx-auto mb-8 sm:mb-12 md:mb-14 px-4 leading-relaxed">
          Two souls, one sacred bond, and a beautiful journey together, InshaAllah.
        </p>

        {/* Couple Names & Center Mandala Section */}
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between sm:justify-around px-2 sm:px-6 mb-10 sm:mb-14 md:mb-16">
          {/* The Groom */}
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="font-sans text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.25em] text-[#b88628] font-medium mb-1 sm:mb-2">
              The Groom
            </span>
            <h3 className="font-italiana text-4xl sm:text-5xl md:text-6xl text-[#4e1220] tracking-wide mb-1 drop-shadow-sm">
              Taha
            </h3>
            <p
              className={`font-serif italic text-[11px] sm:text-[12px] text-[#7d2f3f] tracking-wide mt-1.5 sm:mt-2 transition-all duration-1000 ease-out}`}
            >
              Son of
            </p>
            <span className="text-[11px] sm:text-[12px] text-[#7d2f3f] tracking-wide mt-1.5 sm:mt-2">
              Masuma & Mohammad Quettawala
            </span>
          </div>

          {/* Center Vertical Divider with Mandala Pendant */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-6 relative">
            {/* Top decorative line */}
            <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-t from-[#c69a59] to-transparent opacity-80" />

            {/* Mandala Pendant */}
            <div className="my-1 sm:my-2 w-10 sm:w-12 md:w-14 drop-shadow-[0_4px_10px_rgba(184,134,11,0.3)] hover:scale-105 transition-transform duration-300">
              <img
                src="./media/Ornate-Gold-and-Rose-Mandala-Pendant.webp"
                alt="Mandala Pendant"
                className="w-full h-auto object-contain select-none pointer-events-none"
              />
            </div>

            {/* Bottom decorative line */}
            <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-[#c69a59] to-transparent opacity-80" />
          </div>

          {/* The Bride */}
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="font-sans text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.25em] text-[#b88628] font-medium mb-1 sm:mb-2">
              The Bride
            </span>
            <h3 className="font-italiana text-4xl sm:text-5xl md:text-6xl text-[#4e1220] tracking-wide mb-1 drop-shadow-sm">
              Zainab
            </h3>
            <p
              className={`font-serif italic text-[11px] sm:text-[12px] text-[#7d2f3f] tracking-wide mt-1.5 sm:mt-2 transition-all duration-1000 ease-out}`}
            >
              Daughter of
            </p>
            <span className="text-[11px] sm:text-[12px] text-[#7d2f3f] tracking-wide mt-1.5 sm:mt-2">
              Rashida & Najmuddin Tinwala
            </span>
          </div>
        </div>

        {/* Nikah Quote */}
        <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#612130] max-w-xl mx-auto leading-relaxed px-6 drop-shadow-sm">
          &ldquo;By the grace of Allah, two hearts unite in Nikah to begin their journey together.&rdquo;
        </p>
      </div>
    </section>
  );
};

export default Slide3;

