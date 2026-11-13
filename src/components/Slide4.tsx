import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface FlipUnitProps {
  value: string;
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = ({ value, label }) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsFlipping(true);
      setFlipCount((prev) => prev + 1);

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 580);

      return () => clearTimeout(timer);
    }
  }, [value, currentVal]);

  return (
    <div className="relative z-10 flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div className="relative w-[68px] h-[82px] xs:w-[74px] xs:h-[88px] sm:w-[86px] sm:h-[102px] md:w-[98px] md:h-[114px] rounded-2xl border border-[#deb86d]/90 shadow-[0_8px_20px_rgba(180,130,50,0.18)] bg-[#faf2e4] overflow-hidden select-none">

        {/* Static Top Half */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#fffefc] to-[#fbf4ea] rounded-t-2xl">
          <div className="absolute top-0 left-0 w-full h-[200%] flex items-center justify-center font-cinzel text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4e1220] tracking-tight">
            {currentVal}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* Static Bottom Half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#fbf4ea] to-[#f5e7d2] rounded-b-2xl">
          <div className="absolute -top-full left-0 w-full h-[200%] flex items-center justify-center font-cinzel text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4e1220] tracking-tight">
            {isFlipping ? prevVal : currentVal}
          </div>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Animated Flipping Flaps */}
        {isFlipping && (
          <div key={flipCount} className="absolute inset-0 pointer-events-none z-20">
            {/* Top Flap (folds down 0deg -> -90deg) */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#fffefc] to-[#fbf4ea] rounded-t-2xl origin-bottom"
              style={{
                animation: 'flipTopFold 0.28s cubic-bezier(0.4, 0, 0.6, 1) forwards',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[200%] flex items-center justify-center font-cinzel text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4e1220] tracking-tight">
                {prevVal}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Flap (unfolds down 90deg -> 0deg) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#fbf4ea] to-[#f5e7d2] rounded-b-2xl origin-top"
              style={{
                animation: 'flipBottomUnfold 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.26s forwards',
                transform: 'perspective(400px) rotateX(90deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="absolute -top-full left-0 w-full h-[200%] flex items-center justify-center font-cinzel text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4e1220] tracking-tight">
                {currentVal}
              </div>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Center Split Horizontal Seam Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#deb86d]/80 -translate-y-1/2 z-30 pointer-events-none" />

        {/* Left Side Hinge Notch */}
        <div className="absolute top-1/2 left-0 w-[5px] h-[9px] -translate-y-1/2 rounded-r-full bg-[#f8ede5] border border-l-0 border-[#deb86d]/80 z-40 pointer-events-none" />

        {/* Right Side Hinge Notch */}
        <div className="absolute top-1/2 right-0 w-[5px] h-[9px] -translate-y-1/2 rounded-l-full bg-[#f8ede5] border border-r-0 border-[#deb86d]/80 z-40 pointer-events-none" />
      </div>

      {/* Label */}
      <span className="font-sans text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.25em] text-[#b08736] uppercase mt-2 sm:mt-2.5">
        {label}
      </span>
    </div>
  );
};

interface ScratchCardItemProps {
  dayName: string;
  dayNumber: string;
  monthYear: string;
  scratchSubtitle: string | string[];
  eventSubtitle?: string | string[];
  isRevealed: boolean;
  onReveal: () => void;
  isCompact?: boolean;
}

const ScratchCardItem: React.FC<ScratchCardItemProps> = ({
  dayName,
  dayNumber,
  monthYear,
  scratchSubtitle,
  eventSubtitle,
  isRevealed,
  onReveal,
  isCompact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);

  const subtitleKey = Array.isArray(scratchSubtitle) ? scratchSubtitle.join('|') : scratchSubtitle;

  // Paint the golden metallic scratch texture and invitation text
  const drawGoldCard = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      // Rich metallic golden gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d4a24c');
      grad.addColorStop(0.2, '#f8e4a0');
      grad.addColorStop(0.45, '#c8953c');
      grad.addColorStop(0.7, '#eed38c');
      grad.addColorStop(1, '#ad7725');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Golden shimmer sparkles / fine grain
      for (let i = 0; i < 350; i++) {
        const sx = Math.random() * width;
        const sy = Math.random() * height;
        const sr = Math.random() * 1.4;
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(110, 65, 18, 0.25)';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, 6, width - 12, height - 12);

      // Decorative Stars
      ctx.fillStyle = '#654215';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const starSize = Math.max(11, Math.floor(width * 0.04));
      ctx.font = `${starSize}px "Cinzel", serif`;
      ctx.fillText('✦   ✦   ✦', width / 2, height / 2 - height * 0.24);

      // Main Scratch Text
      const subtitles = Array.isArray(scratchSubtitle) ? scratchSubtitle : [scratchSubtitle];
      const titleSize = subtitles.length > 1
        ? Math.max(10, Math.floor(width * 0.04))
        : Math.max(12, Math.floor(width * 0.046));
      ctx.font = `600 ${titleSize}px "Cinzel", "Playfair Display", serif`;
      ctx.fillStyle = '#4e300f';

      const lineSpacing = titleSize * 1.35;
      const allLines = ['Scratch To Reveal'];
      const totalHeight = (allLines.length - 1) * lineSpacing;
      const startY = height / 2 - totalHeight / 2;

      allLines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineSpacing);
      });

      // Bottom Decorative Flourish
      ctx.font = `${starSize - 2}px serif`;
      ctx.fillStyle = '#654215';
      ctx.fillText('✦', width / 2, height / 2 + height * 0.24);
    },
    [subtitleKey]
  );

  // Setup canvas with devicePixelRatio
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const setupCanvas = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        drawGoldCard(ctx, rect.width, rect.height);
      }
    };

    setupCanvas();

    const resizeObserver = new ResizeObserver(() => {
      if (!isRevealed) {
        setupCanvas();
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawGoldCard, isRevealed]);

  // Check scratch percentage
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let cleared = 0;
      const step = 24; // Sample every 24th pixel for high performance
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        totalSampled++;
        if (data[i] < 128) {
          cleared++;
        }
      }

      const percent = (cleared / totalSampled) * 100;
      if (percent >= 35) {
        onReveal();
      }
    } catch {
      // Fallback safely
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = Math.max(28, canvas.clientWidth * 0.088);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPosRef.current) {
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
    } else {
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    lastPosRef.current = { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    const pos = getCoordinates(e);
    if (pos) {
      lastPosRef.current = pos;
      scratch(pos.x, pos.y);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || isRevealed) return;
    const pos = getCoordinates(e);
    if (pos) {
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    checkScratchPercentage();
  };

  return (
    <div className="relative w-full aspect-[1586/992] select-none">
      {/* Inner Revealable Date Card (Inside Frame Window) */}
      <div
        ref={containerRef}
        className="absolute inset-[20%_16%_18%_16%] sm:inset-[21%_17%_19%_17%] z-10 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#fdfbf7] via-[#faf3e8] to-[#f6ecdb] shadow-[inset_0_2px_8px_rgba(150,100,50,0.12)]"
      >
        {/* The Hidden Date Details Revealed Upon Scratching */}
        <div className="flex flex-col items-center justify-center w-full h-full px-2 sm:px-4 text-center select-none pointer-events-none">
          {/* Top Ornamental Line */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full max-w-[150px] sm:max-w-[200px] mb-0.5 sm:mb-1 opacity-80">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b88628] to-transparent" />
            <span className="text-[#b88628] text-[10px] sm:text-xs">✦</span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b88628] to-transparent" />
          </div>

          {/* Day */}
          <span className="font-cinzel text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.22em] text-[#78404d] font-semibold">
            {dayName}
          </span>

          {/* Number (27 or 28) */}
          <h3
            className={`font-italiana ${isCompact
              ? 'text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl'
              : 'text-4xl xs:text-5xl sm:text-6xl md:text-7xl'
              } font-normal text-[#531322] leading-none my-0.5 sm:my-1 drop-shadow-sm`}
          >
            {dayNumber}
          </h3>

          {/* Month and Year */}
          <span
            className={`font-cormorant ${isCompact
              ? 'text-sm xs:text-base sm:text-lg md:text-xl'
              : 'text-base xs:text-lg sm:text-xl md:text-2xl'
              } font-semibold text-[#612130] tracking-wide`}
          >
            {monthYear}
          </span>

          {/* Event Subtitle */}
          {eventSubtitle && (
            <div className="flex flex-col items-center justify-center mt-0.5 leading-tight">
              {(Array.isArray(eventSubtitle) ? eventSubtitle : [eventSubtitle]).map((sub, idx) => (
                <span
                  key={idx}
                  className="font-cinzel text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.18em] text-[#8e5c1e] font-semibold"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Ornamental Line */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full max-w-[150px] sm:max-w-[200px] mt-0.5 sm:mt-1 opacity-80">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b88628] to-transparent" />
            <span className="text-[#b88628] text-[10px] sm:text-xs">✦</span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b88628] to-transparent" />
          </div>
        </div>

        {/* Interactive Scratch Canvas Overlay */}
        <canvas
          ref={canvasRef}
          data-lenis-prevent
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 touch-none ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'
            }`}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          title="Scratch to reveal date"
        />
      </div>

      {/* Foreground Frame (scratch-frame.webp) */}
      <img
        src="./media/scratch-frame.webp"
        alt="Floral Arch Frame"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-20 drop-shadow-[0_8px_20px_rgba(83,19,34,0.15)]"
      />
    </div>
  );
};

const checkIsInvitation = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.includes('/invitation') ||
    path.includes('invitation') ||
    hash.includes('/invitation') ||
    hash.includes('invitation') ||
    search.includes('invitation')
  );
};

export const Slide4: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInvitation, setIsInvitation] = useState(checkIsInvitation);
  const [isRevealed27, setIsRevealed27] = useState(false);
  const [isRevealed28, setIsRevealed28] = useState(false);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const sectionRef = useRef<HTMLElement | null>(null);

  // Monitor URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setIsInvitation(checkIsInvitation());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Intersection Observer for scroll animation
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

  // Countdown timer: target Nov 27 if invitation, else Nov 28
  useEffect(() => {
    const targetDateStr = isInvitation ? '2026-11-27T00:00:00' : '2026-11-28T00:00:00';
    const targetDate = new Date(targetDateStr).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isInvitation]);

  // Trigger double-sided golden confetti celebration
  const triggerConfetti = useCallback(() => {
    const goldColors = ['#D4AF37', '#FFD700', '#F3E5AB', '#AA771C', '#E6C687', '#702132'];

    // Left explosion
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 65,
      origin: { x: 0.08, y: 0.52 },
      colors: goldColors,
      gravity: 0.85,
      scalar: 1.1,
      ticks: 240,
    });

    // Right explosion
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 65,
      origin: { x: 0.92, y: 0.52 },
      colors: goldColors,
      gravity: 0.85,
      scalar: 1.1,
      ticks: 240,
    });

    // Second staggered shower from slightly higher up
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 70,
        spread: 50,
        origin: { x: 0.14, y: 0.38 },
        colors: goldColors,
        gravity: 0.9,
        ticks: 220,
      });
      confetti({
        particleCount: 40,
        angle: 110,
        spread: 50,
        origin: { x: 0.86, y: 0.38 },
        colors: goldColors,
        gravity: 0.9,
        ticks: 220,
      });
    }, 320);
  }, []);

  const revealCard27 = useCallback(() => {
    setIsRevealed27(true);
    triggerConfetti();
  }, [triggerConfetti]);

  const revealCard28 = useCallback(() => {
    setIsRevealed28(true);
    triggerConfetti();
  }, [triggerConfetti]);

  const allRevealed = isInvitation ? isRevealed27 && isRevealed28 : isRevealed28;

  return (
    <section
      id="slide4"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-center items-center py-6 sm:py-10 md:py-14 px-3 sm:px-4 bg-[#f8ede5] select-none"
    >
      {/* Background: couple-bg.webp */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img
          src="./media/couple-bg.webp"
          alt="Palace Backdrop"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Top Grill Border (grild.webp) */}
      <div
        className="absolute top-0 left-0 right-0 z-30 w-full h-[24px] sm:h-[32px] md:h-[40px] pointer-events-none select-none rotate-180"
        style={{
          backgroundImage: "url('./media/grild.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />

      {/* Bottom Grill Border (grild.webp) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 w-full h-[24px] sm:h-[32px] md:h-[40px] pointer-events-none select-none"
        style={{
          backgroundImage: "url('./media/grild.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />

      {/* Flip Clock Keyframe Animations */}
      <style>{`
        @keyframes flipTopFold {
          0% {
            transform: perspective(400px) rotateX(0deg);
          }
          100% {
            transform: perspective(400px) rotateX(-90deg);
          }
        }
        @keyframes flipBottomUnfold {
          0% {
            transform: perspective(400px) rotateX(90deg);
          }
          100% {
            transform: perspective(400px) rotateX(0deg);
          }
        }
      `}</style>

      {/* Main Content Container */}
      <div
        className={`relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto w-full my-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        {/* Header Texts */}
        <p className="font-script text-2xl sm:text-3xl md:text-4xl text-[#bd8c37] drop-shadow-sm mb-0.5 sm:mb-1">
          A Little Surprise
        </p>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-medium text-[#531322] tracking-[0.06em] mb-1 sm:mb-2 drop-shadow-[0_2px_4px_rgba(83,19,34,0.12)]">
          {isInvitation ? 'Save The Dates' : 'Save The Date'}
        </h2>

        <p className="font-sans text-[11px] sm:text-[13px] md:text-[14px] text-[#78404d] tracking-wide max-w-[340px] sm:max-w-md mx-auto mb-3 sm:mb-5 px-2 leading-relaxed">
          {isInvitation
            ? 'Scratch the golden cards below to uncover the days our celebrations begin.'
            : 'Scratch the golden card below to uncover the day our forever begins.'}
        </p>

        {/* Scratch Cards Container */}
        {isInvitation ? (
          /* Two Scratch Cards for Dates 27 and 28 */
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-[350px] xs:max-w-[390px] sm:max-w-[450px] md:max-w-4xl lg:max-w-5xl mx-auto select-none my-1 sm:my-2">
            {/* Card 1: 27 November 2026 */}
            <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] md:max-w-[420px] lg:max-w-[460px]">
              <ScratchCardItem
                dayName="Friday"
                dayNumber="27"
                monthYear="November 2026"
                scratchSubtitle={['', '']}
                eventSubtitle={['', '']}
                isRevealed={isRevealed27}
                onReveal={revealCard27}
                isCompact
              />
            </div>

            {/* Card 2: 28 November 2026 */}
            <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] md:max-w-[420px] lg:max-w-[460px]">
              <ScratchCardItem
                dayName="Saturday"
                dayNumber="28"
                monthYear="November 2026"
                scratchSubtitle=""
                eventSubtitle=""
                isRevealed={isRevealed28}
                onReveal={revealCard28}
                isCompact
              />
            </div>
          </div>
        ) : (
          /* Single Scratch Card for Date 28 */
          <div className="relative w-full max-w-[370px] xs:max-w-[420px] sm:max-w-[540px] md:max-w-[620px] aspect-[1586/992] mx-auto select-none my-1 sm:my-2">
            <ScratchCardItem
              dayName="Saturday"
              dayNumber="28"
              monthYear="November 2026"
              scratchSubtitle=""
              isRevealed={isRevealed28}
              onReveal={revealCard28}
            />
          </div>
        )}

        {/* Swipe to reveal hint */}
        <div className="h-5 sm:h-6 my-1 sm:my-2 flex items-center justify-center">
          {isInvitation ? (
            !allRevealed ? (
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#9c6d23] font-medium flex items-center gap-1.5 opacity-90 animate-pulse">
                <span>✦</span>
                <span>Gently swipe each card to reveal</span>
                <span>✦</span>
              </p>
            ) : (
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#531322] font-semibold flex items-center gap-1.5 animate-fade-in">
                <span>✦</span>
                <span>Our Blessed Celebrations</span>
                <span>✦</span>
              </p>
            )
          ) : (
            !allRevealed ? (
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#9c6d23] font-medium flex items-center gap-1.5 opacity-90 animate-pulse">
                <span>✦</span>
                <span>Gently swipe to reveal</span>
                <span>✦</span>
              </p>
            ) : (
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#531322] font-semibold flex items-center gap-1.5 animate-fade-in">
                <span>✦</span>
                <span>Our Blessed Date</span>
                <span>✦</span>
              </p>
            )
          )}
        </div>

        {/* Journey Subtitle */}
        <p className="font-script text-xl sm:text-2xl md:text-3xl text-[#b88628] drop-shadow-sm mb-3 sm:mb-4">
          The start of a beautiful journey…
        </p>

        {/* Live Countdown Timer Section with Flip Clock */}
        <div className="relative flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-4 md:gap-5 w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[480px] md:max-w-[560px] mx-auto px-1 sm:px-2">
          {/* Horizontal Golden Connecting Line */}
          <div className="absolute top-1/2 left-3 right-3 h-[2px] bg-[#deb86d]/70 -translate-y-[13px] sm:-translate-y-[15px] pointer-events-none z-0" />

          {/* Days */}
          <FlipUnit value={timeLeft.days} label="Days" />

          {/* Hours */}
          <FlipUnit value={timeLeft.hours} label="Hours" />

          {/* Minutes */}
          <FlipUnit value={timeLeft.minutes} label="Minutes" />

          {/* Seconds */}
          <FlipUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </section>
  );
};

export default Slide4;
