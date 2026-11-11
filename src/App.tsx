import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Slide0 } from './components/Slide0';
import { Slide1 } from './components/Slide1';
import { Slide2 } from './components/Slide2';
import { Slide3 } from './components/Slide3';
import { Slide4 } from './components/Slide4';
import { Slide5 } from './components/Slide5';
import { Slide6 } from './components/Slide6';
import { Slide7 } from './components/Slide7';
import { Slide8 } from './components/Slide8';
import { Dashboard } from './components/Dashboard';
import { FloatingLanterns } from './components/FloatingLanterns';

export const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [slide0Finished, setSlide0Finished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const userPausedRef = useRef(false);

  // Hash-based routing: #/dashboard
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Auto-play site audio initially and on first user interaction
  useEffect(() => {
    if (route === '#/dashboard') return;

    const playSiteAudio = () => {
      if (!userPausedRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser blocked unmuted autoplay until interaction
        });
      }
    };

    // Attempt playback immediately
    playSiteAudio();

    // Browser interaction fallback
    const onInteraction = () => {
      playSiteAudio();
    };

    window.addEventListener('click', onInteraction, { passive: true });
    window.addEventListener('touchstart', onInteraction, { passive: true });
    window.addEventListener('keydown', onInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, [route]);

  // Ensure audio plays when Slide0 finishes
  useEffect(() => {
    if (slide0Finished && !userPausedRef.current && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => { });
    }
  }, [slide0Finished]);

  // Initialize Lenis smooth inertial scrolling (only for main card)
  useEffect(() => {
    if (route === '#/dashboard') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    if (!slide0Finished) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    }

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.body.style.overflow = '';
    };
  }, [route]);

  // Manage Lenis & scroll lock depending on Slide0 completion
  useEffect(() => {
    if (lenisRef.current) {
      if (slide0Finished) {
        document.body.style.overflow = '';
        lenisRef.current.start();
      } else {
        document.body.style.overflow = 'hidden';
        lenisRef.current.stop();
      }
    }
  }, [slide0Finished]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // autoplay restriction fallback
      });
    }
  };

  const OFFLINE = true

  if (OFFLINE) {
    return <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "white",
        textAlign: "center",
        display: 'flex',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
      }}
    >
      <span className='text-5xl' >Device Offline</span>
    </div>
  }

  if (route === '#/dashboard') {
    return <Dashboard />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#f7ebe4]">
      {/* Slide 0 Intro Video */}
      {!slide0Finished && (
        <Slide0 onFinish={() => setSlide0Finished(true)} />
      )}

      {/* Flying Lanterns Background Animation (from bottom to top) */}
      <FloatingLanterns />

      {/* Slide 1 */}
      <Slide1 animate={slide0Finished} />
      {/* Slide 2: Royal Scroll Invitation */}
      <Slide2 />
      {/* Slide 3: Couple Nikah Details */}
      <Slide3 />
      {/* Slide 4: Save The Date Scratch Card */}
      <Slide4 />
      {/* Slide 5: The Blessed Celebrations Timeline with Wedding Car */}
      <Slide5 />
      {/* Slide 6: Heartfelt Duas & Presence Request */}
      <Slide6 />
      {/* Slide 7: RSVP Form */}
      <Slide7 />
      {/* Slide 8: Blessed Presence & Grand Finale */}
      <Slide8 />

      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        src="./media/jashn-e-bahaaraa__instrum-1_medium.mp3"
        loop
        preload="auto"
      />

      {/* Music Toggle Button */}
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 p-2.5 sm:p-3 rounded-full bg-[#fdf5eb]/90 border border-[#d6ad5e]/70 shadow-lg backdrop-blur-sm text-[#702132] hover:text-[#531322] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        {isPlaying ? (
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-5 h-5 text-[#9e6d23]" />
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#9e6d23] animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-[#9e6d23] animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-0.5 bg-[#9e6d23] animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <VolumeX className="w-5 h-5 text-[#885a1a]" />
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#702132] pr-1 hidden sm:inline">
              Play Music
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default App;
