import React, { useEffect, useRef, useState } from 'react';

export const Slide6: React.FC = () => {
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
      id="slide6"
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col justify-center items-center py-10 sm:py-14 px-4 bg-[#faf2e6] select-none"
    >
      {/* Repeating Damask Wallpaper Pattern (perr-tile-83d714.svg) */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-20 z-0"
        style={{
          backgroundImage: "url('/media/perr-tile-83d714.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px auto',
        }}
        aria-hidden="true"
      />

      {/* Center Invitation Message Card */}
      <div
        className={`relative z-20 w-full max-w-[580px] mx-auto rounded-3xl bg-[#fffdf9]/95 border border-[#dfc39a]/80 shadow-[0_12px_36px_rgba(112,33,50,0.08),0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-sm px-6 py-7 sm:px-10 sm:py-8 text-center transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {/* Urdu Calligraphy / Heading */}
        <h2
          dir="rtl"
          lang="ur"
          className="font-urdu text-xl xs:text-2xl sm:text-3xl md:text-[32px] text-[#6b1d2e] font-semibold leading-[2] sm:leading-[2.2] tracking-normal mb-3 sm:mb-4 drop-shadow-[0_1px_2px_rgba(107,29,46,0.12)]"
        >
          محبت، سکون اور رحمت کا نیا سفر
        </h2>

        {/* English Invitation Body Text */}
        <p className="font-sans text-[12px] sm:text-[13.5px] md:text-[14.5px] font-normal leading-relaxed text-[#966728] max-w-lg mx-auto tracking-wide">
          With hearts full of gratitude to Allah, we request the honour of your presence at our wedding celebration. Join us in making this blessed day memorable with your duas, love, and good wishes
        </p>
      </div>
    </section>
  );
};

export default Slide6;
