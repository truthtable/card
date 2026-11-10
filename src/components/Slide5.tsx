import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Calendar, CalendarPlus, MapPin, X, Check, ExternalLink, Download } from 'lucide-react';

interface EventItem {
  id: string;
  badge: string;
  titleLines: string[];
  subtitle: string;
  dayNumber: string;
  monthYear: string;
  weekday: string;
  dateDisplay: string;
  startDateIso: string;
  endDateIso: string;
  icsStart: string;
  icsEnd: string;
  location: string;
  description: string;
}

const EVENTS: EventItem[] = [
  {
    id: 'event-1',
    badge: 'EVENT 1',
    titleLines: ['RASMO KA RANG,', 'KHUSHIYON KE SANG!'],
    subtitle: 'JOIN US AS WE CELEBRATE THIS SPECIAL OCCASION TOGETHER.',
    dayNumber: '27',
    monthYear: 'NOVEMBER 2026',
    weekday: 'Friday',
    dateDisplay: '27 NOVEMBER 2026',
    startDateIso: '2026-11-27T18:30:00',
    endDateIso: '2026-11-27T22:30:00',
    icsStart: '20261127T183000',
    icsEnd: '20261127T223000',
    location: 'The Heritage Royal Palace & Gardens',
    description: 'Join us as we celebrate this special occasion together. Rasmo Ka Rang celebrations for Taha & Zainab wedding.',
  },
  {
    id: 'event-2',
    badge: 'EVENT 2',
    titleLines: ['THE GREAT', 'WEDDING GAME', 'CARNIVAL!'],
    subtitle: 'JOIN US AS WE CELEBRATE THIS SPECIAL OCCASION TOGETHER.',
    dayNumber: '28',
    monthYear: 'NOVEMBER 2026',
    weekday: 'Saturday',
    dateDisplay: '28 NOVEMBER 2026',
    startDateIso: '2026-11-28T17:00:00',
    endDateIso: '2026-11-28T23:00:00',
    icsStart: '20261128T170000',
    icsEnd: '20261128T230000',
    location: 'Grand Imperial Ballroom & Palace',
    description: 'Join us as we celebrate this special occasion together. The Great Wedding Game Carnival & Reception for Taha & Zainab wedding.',
  },
];

export const Slide5: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const event1Ref = useRef<HTMLDivElement | null>(null);
  const event2Ref = useRef<HTMLDivElement | null>(null);
  const dot1Ref = useRef<HTMLDivElement | null>(null);
  const dot2Ref = useRef<HTMLDivElement | null>(null);
  const carStartRef = useRef<HTMLDivElement | null>(null);

  // Scroll direction for car orientation (0deg = facing down, 180deg = facing up)
  // Initially car faces top as requested (180deg)
  const [carRotation, setCarRotation] = useState<number>(180);
  const [carMode, setCarMode] = useState<'top' | 'fixed'>('top');
  const [carViewportY, setCarViewportY] = useState<number>(400);
  const [carOpacity, setCarOpacity] = useState<number>(0);

  // Proportional reveal progress (0 = hidden, 1 = fully revealed when car arrives on dot)
  const [progress1, setProgress1] = useState<number>(0);
  const [progress2, setProgress2] = useState<number>(0);

  // Calendar Modal state
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Scroll direction detection and center viewport car tracking
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;

          // Require a slight movement delta to avoid flutter
          if (Math.abs(diff) >= 3) {
            if (diff > 0) {
              // Scrolling down -> Car faces down
              setCarRotation(0);
            } else {
              // Scrolling up -> Car faces up
              setCarRotation(180);
            }
            lastScrollY = currentScrollY;
          }

          const centerY = window.innerHeight / 2;
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const scrollRemaining = Math.max(0, maxScroll - window.scrollY);

          // Fade in car gracefully as Slide 5 enters, completely hidden on Slide 4
          if (sectionRef.current) {
            const secTop = sectionRef.current.getBoundingClientRect().top;
            const fadeInProgress = Math.max(0, Math.min(1, (window.innerHeight - secTop) / 350));
            setCarOpacity(fadeInProgress);
          }

          // Calculate active car viewport Y:
          // Normally centered at centerY. Near bottom of page, glides down to Dot 2
          let activeCarY = centerY;
          let dot2CenterY = Infinity;
          if (dot2Ref.current) {
            const d2 = dot2Ref.current.getBoundingClientRect();
            dot2CenterY = d2.top + d2.height / 2;
            if (scrollRemaining < 250 && dot2CenterY > centerY) {
              const ratio = 1 - scrollRemaining / 250;
              activeCarY = centerY + (dot2CenterY - centerY) * ratio;
            }
          }
          setCarViewportY(activeCarY);

          // Car mode: 'top' (above start anchor) or 'fixed'
          const startRect = carStartRef.current?.getBoundingClientRect();
          if (startRect && startRect.top > activeCarY) {
            setCarMode('top');
          } else {
            setCarMode('fixed');
          }

          // Proportional reveal for Event 1
          const TRAVEL_RANGE = 200;
          if (dot1Ref.current) {
            const r1 = dot1Ref.current.getBoundingClientRect();
            const dot1CenterY = r1.top + r1.height / 2;
            const raw1 = (activeCarY + TRAVEL_RANGE - dot1CenterY) / TRAVEL_RANGE;
            const clamped1 = Math.max(0, Math.min(1, raw1));
            const eased1 = clamped1 * clamped1 * (3 - 2 * clamped1);
            setProgress1(eased1);
          }

          // Proportional reveal for Event 2
          if (dot2Ref.current) {
            const raw2 = (activeCarY + TRAVEL_RANGE - dot2CenterY) / TRAVEL_RANGE;
            const clamped2 = Math.max(0, Math.min(1, raw2));
            const eased2 = clamped2 * clamped2 * (3 - 2 * clamped2);
            setProgress2(eased2);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Calendar handlers
  const handleGoogleCalendar = useCallback((event: EventItem) => {
    const start = event.icsStart;
    const end = event.icsEnd;
    const title = encodeURIComponent(`${event.titleLines.join(' ')} | Taha & Zainab`);
    const details = encodeURIComponent(`${event.description}\n\nVenue: ${event.location}`);
    const location = encodeURIComponent(event.location);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleOutlookCalendar = useCallback((event: EventItem) => {
    const title = encodeURIComponent(`${event.titleLines.join(' ')} | Taha & Zainab`);
    const body = encodeURIComponent(`${event.description}\n\nVenue: ${event.location}`);
    const location = encodeURIComponent(event.location);
    const start = `${event.startDateIso}:00`;
    const end = `${event.endDateIso}:00`;
    const url = `https://outlook.live.com/calendar/0/action/compose?allday=false&startdt=${start}&enddt=${end}&subject=${title}&body=${body}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleDownloadIcs = useCallback((event: EventItem) => {
    const title = `${event.titleLines.join(' ')} | Taha & Zainab`;
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Taha & Zainab Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}-${Date.now()}@tahazainab.wedding`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${event.icsStart}`,
      `DTEND:${event.icsEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-taha-zainab-wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleCopyDetails = useCallback((event: EventItem) => {
    const text = `${event.titleLines.join(' ')}\nDate: ${event.dateDisplay} (${event.weekday})\nVenue: ${event.location}\nCelebrating Taha & Zainab's Wedding!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section
      id="slide5"
      ref={sectionRef}
      className="relative w-full min-h-[140vh] sm:min-h-[150vh] bg-[#fbf5eb] select-none"
    >
      {/* Background: Repeating Perr Damask Tile Pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-40 z-0"
        style={{
          backgroundImage: "url('/media/perr-tile-83d714.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px auto',
        }}
        aria-hidden="true"
      />

      {/* Bottom Grill Border */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 w-full h-[24px] sm:h-[32px] md:h-[40px] pointer-events-none select-none"
        style={{
          backgroundImage: "url('/media/grild.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        aria-hidden="true"
      />

      {/* Soft Floating Background Lanterns */}
      <div className="absolute top-[8%] left-[4%] w-10 sm:w-14 opacity-75 pointer-events-none drop-shadow-[0_4px_12px_rgba(214,173,94,0.4)] animate-lantern-left">
        <img src="/media/lantern-1.webp" alt="Lantern" className="w-full h-auto object-contain" />
      </div>
      <div className="absolute top-[18%] right-[6%] w-8 sm:w-12 opacity-65 pointer-events-none drop-shadow-[0_4px_12px_rgba(214,173,94,0.35)] animate-lantern-right">
        <img src="/media/lantern-1-1.webp" alt="Lantern" className="w-full h-auto object-contain" />
      </div>
      <div className="absolute top-[52%] left-[6%] w-8 sm:w-12 opacity-65 pointer-events-none drop-shadow-[0_4px_12px_rgba(214,173,94,0.35)] animate-lantern-left">
        <img src="/media/lantern-1-1.webp" alt="Lantern" className="w-full h-auto object-contain" />
      </div>
      <div className="absolute top-[75%] right-[5%] w-10 sm:w-14 opacity-75 pointer-events-none drop-shadow-[0_4px_12px_rgba(214,173,94,0.4)] animate-lantern-right">
        <img src="/media/lantern-1.webp" alt="Lantern" className="w-full h-auto object-contain" />
      </div>

      {/* Golden Timeline Start Anchor */}
      <div
        ref={carStartRef}
        className="absolute top-[340px] sm:top-[380px] left-1/2 pointer-events-none"
        aria-hidden="true"
      />

      {/* Center Golden Timeline Vertical Line */}
      <div
        className="absolute top-[310px] sm:top-[340px] bottom-[100px] sm:bottom-[120px] left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-[#dfbe78]/40 via-[#c99a4e] to-[#dfbe78]/40 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================= */}
      {/* WEDDING CAR: Stays centered on timeline & reaches dots    */}
      {/* ========================================================= */}
      <div
        className={`pointer-events-none z-20 flex items-center justify-center ${carMode === 'fixed'
          ? 'fixed left-1/2'
          : 'absolute top-[340px] sm:top-[380px] left-1/2'
          }`}
        style={{
          top: carMode === 'fixed' ? `${carViewportY}px` : undefined,
          transform: `translate(-50%, -50%) rotate(${carRotation}deg)`,
          opacity: carOpacity,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
        }}
      >
        <img
          src="/media/Wedding-Car.webp"
          alt="Royal Wedding Car"
          className="w-[52px] xs:w-[62px] sm:w-[74px] md:w-[84px] lg:w-[94px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.32)] select-none pointer-events-none"
        />
      </div>

      {/* ========================================================= */}
      {/* SLIDE CONTENT LAYER (Clean natural padding, no gap)       */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full flex flex-col justify-between min-h-[120vh] sm:min-h-[130vh] pt-12 sm:pt-16 pb-14 sm:pb-20 px-3 sm:px-6">

        {/* Header Title Section with generous clearance above the car */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto px-4 mb-28 sm:mb-32 md:mb-36">
          <div
            style={{
              height: "10px"
            }}
          />
          <p className="font-script text-2xl sm:text-3xl md:text-4xl text-[#bd9254] drop-shadow-sm mb-0.5">
            Celebrations
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#66182a] tracking-[0.06em] uppercase mb-1 drop-shadow-[0_2px_4px_rgba(102,24,42,0.12)]">
            The Blessed Celebrations
          </h2>
          <p className="font-cormorant italic text-xs sm:text-sm md:text-base text-[#804e5b] tracking-wider font-medium">
            We would love to see you at each one.
          </p>
        </div>


        {/* Timeline Events Track: Compact travel distance between Event 1 and Event 2 */}
        <div className="flex-1 flex flex-col justify-center gap-14 sm:gap-20 md:gap-24 max-w-5xl mx-auto w-full my-6 sm:my-10">

          {/* ========================================================= */}
          {/* EVENT 1 ROW: Frame on Left, Date 27 on Right             */}
          {/* ========================================================= */}
          <div
            ref={event1Ref}
            className="relative w-full flex items-center justify-between"
          >
            {/* Center Golden Circle Node on Line */}
            <div
              ref={dot1Ref}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none will-change-transform"
              style={{
                opacity: 0.35 + 0.65 * progress1,
                transform: `translate(-50%, -50%) scale(${(0.75 + 0.25 * progress1).toFixed(3)})`,
              }}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#c99a4e] bg-[#fbf5eb] shadow-[0_0_8px_rgba(201,154,78,0.5)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e6e29]" />
              </div>
            </div>

            {/* Left Column: Event 1 Scroll Frame */}
            <div
              className="w-[48%] md:w-[45%] flex justify-end pr-3 sm:pr-8 md:pr-12 will-change-transform"
              style={{
                opacity: progress1,
                transform: `translateX(${(-36 * (1 - progress1)).toFixed(1)}px) scale(${(0.94 + 0.06 * progress1).toFixed(3)})`,
                pointerEvents: progress1 > 0.6 ? 'auto' : 'none',
              }}
            >
              <div className="relative w-full max-w-[270px] xs:max-w-[310px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[430px] drop-shadow-[0_12px_28px_rgba(90,40,20,0.22)]">
                {/* Frame Image */}
                <img
                  src="/media/Wedding-Frame.webp"
                  alt="Wedding Frame"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                />

                {/* Inner Content Area overlaid exactly on the fabric scroll */}
                <div className="absolute top-[20%] bottom-[23%] left-[17%] right-[17%] flex flex-col items-center justify-between text-center py-1 sm:py-2">
                  {/* Badge */}
                  <span className="font-cinzel text-[9px] xs:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.28em] font-semibold text-[#8b5a2b]">
                    {EVENTS[0].badge}
                  </span>

                  {/* Event Title */}
                  <div className="my-0.5">
                    {EVENTS[0].titleLines.map((line, idx) => (
                      <h3
                        key={idx}
                        className="font-cinzel text-xs xs:text-sm sm:text-lg md:text-[21px] lg:text-[23px] font-bold text-[#621626] leading-tight tracking-wide drop-shadow-sm uppercase"
                      >
                        {line}
                      </h3>
                    ))}
                  </div>

                  {/* Subtitle Message */}
                  <p className="font-cormorant italic text-[8px] xs:text-[9.5px] sm:text-xs text-[#7a4855] tracking-wider max-w-[230px] leading-tight font-medium uppercase sm:normal-case">
                    {EVENTS[0].subtitle}
                  </p>

                  {/* Ornamental Diamond Divider */}
                  <div className="flex items-center gap-1.5 opacity-80 my-0.5">
                    <span className="w-3 sm:w-5 h-[0.5px] bg-[#b88628]" />
                    <span className="text-[8px] sm:text-[10px] text-[#b88628]">❖</span>
                    <span className="w-3 sm:w-5 h-[0.5px] bg-[#b88628]" />
                  </div>

                  {/* Date line with Icon */}
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[#5e1927]">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9a6b32]" />
                    <span className="font-cinzel text-[9px] xs:text-[10.5px] sm:text-xs md:text-sm font-semibold tracking-wider">
                      {EVENTS[0].dateDisplay}
                    </span>
                  </div>

                  {/* Location Icon Indicator */}
                  <div className="flex items-center gap-1 text-[#8b5a2b] opacity-90 text-[8px] xs:text-[9px] sm:text-[10px]">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#9a6b32]" />
                    <span className="font-sans truncate max-w-[130px] sm:max-w-[170px] hidden xs:inline">
                      {EVENTS[0].location}
                    </span>
                  </div>

                  {/* Add To Calendar Button */}
                  <button
                    onClick={() => setActiveEvent(EVENTS[0])}
                    className="mt-1 group relative border border-[#cca66b] bg-gradient-to-b from-[#fffefc] to-[#f7eedf] text-[#621626] hover:bg-[#fff7ea] hover:border-[#8b233a] hover:text-[#450915] shadow-[0_2px_8px_rgba(180,130,50,0.18)] rounded-full px-2.5 xs:px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[8px] xs:text-[9px] sm:text-[10.5px] md:text-xs font-cinzel font-semibold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <CalendarPlus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#946124] group-hover:scale-110 transition-transform" />
                    <span>ADD TO CALENDAR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Date 27 Display */}
            <div
              className="w-[48%] md:w-[45%] flex flex-col items-start justify-center pl-3 sm:pl-8 md:pl-12 will-change-transform"
              style={{
                opacity: progress1,
                transform: `translateX(${(36 * (1 - progress1)).toFixed(1)}px) scale(${(0.94 + 0.06 * progress1).toFixed(3)})`,
              }}
            >
              <span className="font-cinzel text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-normal text-[#ad8248] tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(173,130,72,0.18)]">
                {EVENTS[0].dayNumber}
              </span>
              <span className="font-cinzel text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-[0.25em] font-medium text-[#ad8248] uppercase mt-1 sm:mt-2">
                {EVENTS[0].monthYear}
              </span>
              <span className="font-script text-xl xs:text-2xl sm:text-3xl md:text-4xl text-[#bd9254] mt-0.5">
                {EVENTS[0].weekday}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* EVENT 2 ROW: Date 28 on Left, Frame on Right             */}
          {/* ========================================================= */}
          <div
            ref={event2Ref}
            className="relative w-full flex items-center justify-between"
          >
            {/* Center Golden Circle Node on Line */}
            <div
              ref={dot2Ref}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none will-change-transform"
              style={{
                opacity: 0.35 + 0.65 * progress2,
                transform: `translate(-50%, -50%) scale(${(0.75 + 0.25 * progress2).toFixed(3)})`,
              }}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#c99a4e] bg-[#fbf5eb] shadow-[0_0_8px_rgba(201,154,78,0.5)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e6e29]" />
              </div>
            </div>

            {/* Left Column: Date 28 Display */}
            <div
              className="w-[48%] md:w-[45%] flex flex-col items-end justify-center pr-3 sm:pr-8 md:pr-12 text-right will-change-transform"
              style={{
                opacity: progress2,
                transform: `translateX(${(-36 * (1 - progress2)).toFixed(1)}px) scale(${(0.94 + 0.06 * progress2).toFixed(3)})`,
              }}
            >
              <span className="font-cinzel text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-normal text-[#ad8248] tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(173,130,72,0.18)]">
                {EVENTS[1].dayNumber}
              </span>
              <span className="font-cinzel text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-[0.25em] font-medium text-[#ad8248] uppercase mt-1 sm:mt-2">
                {EVENTS[1].monthYear}
              </span>
              <span className="font-script text-xl xs:text-2xl sm:text-3xl md:text-4xl text-[#bd9254] mt-0.5">
                {EVENTS[1].weekday}
              </span>
            </div>

            {/* Right Column: Event 2 Scroll Frame */}
            <div
              className="w-[48%] md:w-[45%] flex justify-start pl-3 sm:pl-8 md:pl-12 will-change-transform"
              style={{
                opacity: progress2,
                transform: `translateX(${(36 * (1 - progress2)).toFixed(1)}px) scale(${(0.94 + 0.06 * progress2).toFixed(3)})`,
                pointerEvents: progress2 > 0.6 ? 'auto' : 'none',
              }}
            >
              <div className="relative w-full max-w-[270px] xs:max-w-[310px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[430px] drop-shadow-[0_12px_28px_rgba(90,40,20,0.22)]">
                {/* Frame Image */}
                <img
                  src="/media/Wedding-Frame.webp"
                  alt="Wedding Frame"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                />

                {/* Inner Content Area overlaid on scroll parchment */}
                <div className="absolute top-[20%] bottom-[23%] left-[17%] right-[17%] flex flex-col items-center justify-between text-center py-1 sm:py-2">
                  {/* Badge */}
                  <span className="font-cinzel text-[9px] xs:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.28em] font-semibold text-[#8b5a2b]">
                    {EVENTS[1].badge}
                  </span>

                  {/* Event Title */}
                  <div className="my-0.5">
                    {EVENTS[1].titleLines.map((line, idx) => (
                      <h3
                        key={idx}
                        className="font-cinzel text-xs xs:text-sm sm:text-base md:text-[19px] lg:text-[21px] font-bold text-[#621626] leading-tight tracking-wide drop-shadow-sm uppercase"
                      >
                        {line}
                      </h3>
                    ))}
                  </div>

                  {/* Subtitle Message */}
                  <p className="font-cormorant italic text-[8px] xs:text-[9.5px] sm:text-xs text-[#7a4855] tracking-wider max-w-[230px] leading-tight font-medium uppercase sm:normal-case">
                    {EVENTS[1].subtitle}
                  </p>

                  {/* Ornamental Diamond Divider */}
                  <div className="flex items-center gap-1.5 opacity-80 my-0.5">
                    <span className="w-3 sm:w-5 h-[0.5px] bg-[#b88628]" />
                    <span className="text-[8px] sm:text-[10px] text-[#b88628]">❖</span>
                    <span className="w-3 sm:w-5 h-[0.5px] bg-[#b88628]" />
                  </div>

                  {/* Date line with Icon */}
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[#5e1927]">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9a6b32]" />
                    <span className="font-cinzel text-[9px] xs:text-[10.5px] sm:text-xs md:text-sm font-semibold tracking-wider">
                      {EVENTS[1].dateDisplay}
                    </span>
                  </div>

                  {/* Location Icon Indicator */}
                  <div className="flex items-center gap-1 text-[#8b5a2b] opacity-90 text-[8px] xs:text-[9px] sm:text-[10px]">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#9a6b32]" />
                    <span className="font-sans truncate max-w-[130px] sm:max-w-[170px] hidden xs:inline">
                      {EVENTS[1].location}
                    </span>
                  </div>

                  {/* Add To Calendar Button */}
                  <button
                    onClick={() => setActiveEvent(EVENTS[1])}
                    className="mt-1 group relative border border-[#cca66b] bg-gradient-to-b from-[#fffefc] to-[#f7eedf] text-[#621626] hover:bg-[#fff7ea] hover:border-[#8b233a] hover:text-[#450915] shadow-[0_2px_8px_rgba(180,130,50,0.18)] rounded-full px-2.5 xs:px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[8px] xs:text-[9px] sm:text-[10.5px] md:text-xs font-cinzel font-semibold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <CalendarPlus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#946124] group-hover:scale-110 transition-transform" />
                    <span>ADD TO CALENDAR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* CALENDAR ADD MODAL (Smooth, works on every device)        */}
      {/* ========================================================= */}
      {activeEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveEvent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative w-full max-w-md bg-[#faf2e6] border-2 border-[#d4aa5c] rounded-2xl shadow-[0_20px_45px_rgba(70,20,30,0.35)] overflow-hidden p-6 sm:p-7 text-[#4a1525]"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveEvent(null)}
              aria-label="Close dialog"
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#82384a] hover:text-[#4a1525] hover:bg-[#ebd9c1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5 pr-4">
              <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-semibold text-[#966b2a]">
                {activeEvent.badge}
              </span>
              <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5e1927] mt-1 leading-snug">
                {activeEvent.titleLines.join(' ')}
              </h4>
              <p className="font-cinzel text-xs text-[#8c5a2b] font-medium mt-1">
                {activeEvent.dateDisplay} ({activeEvent.weekday})
              </p>
              <p className="font-sans text-[11px] sm:text-xs text-[#70424f] mt-1 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9a6b32]" />
                {activeEvent.location}
              </p>
            </div>

            {/* Option Buttons */}
            <div className="space-y-2.5 sm:space-y-3 font-cinzel text-xs tracking-wider">
              {/* Google Calendar */}
              <button
                onClick={() => {
                  handleGoogleCalendar(activeEvent);
                  setActiveEvent(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#cca66b] bg-[#fffcf7] hover:bg-[#f6ebd8] text-[#5e1927] font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📅</span>
                  <span>Google Calendar</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#9a6b32]" />
              </button>

              {/* Apple Calendar / .ics */}
              <button
                onClick={() => {
                  handleDownloadIcs(activeEvent);
                  setActiveEvent(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#cca66b] bg-[#fffcf7] hover:bg-[#f6ebd8] text-[#5e1927] font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🍏</span>
                  <span>Apple / iCal (.ics)</span>
                </div>
                <Download className="w-4 h-4 text-[#9a6b32]" />
              </button>

              {/* Outlook */}
              <button
                onClick={() => {
                  handleOutlookCalendar(activeEvent);
                  setActiveEvent(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#cca66b] bg-[#fffcf7] hover:bg-[#f6ebd8] text-[#5e1927] font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✉️</span>
                  <span>Outlook Calendar</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#9a6b32]" />
              </button>

              {/* Copy Details */}
              <button
                onClick={() => handleCopyDetails(activeEvent)}
                className="w-full py-2 px-4 rounded-xl border border-[#d8be92]/80 bg-[#f4e6d1]/70 hover:bg-[#ebd8bd] text-[#703b47] font-medium flex items-center justify-center gap-2 transition-all text-[11px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-700 font-semibold">Event Details Copied!</span>
                  </>
                ) : (
                  <>
                    <span>Copy Event Details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Slide5;

