import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slide1 } from './components/Slide1';
import { Slide2 } from './components/Slide2';
import { Slide3 } from './components/Slide3';
import { FloatingLanterns } from './components/FloatingLanterns';

export const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // autoplay restriction fallback
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f7ebe4]">
      {/* Flying Lanterns Background Animation (from bottom to top) */}
      <FloatingLanterns />

      {/* Slide 1 */}
      <Slide1 />
      {/* Slide 2: Royal Scroll Invitation */}
      <Slide2 />
      {/* Slide 3: Couple Nikah Details */}
      <Slide3 />

      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        src="/media/jashn-e-bahaaraa__instrum-1_medium.mp3"
        loop
        preload="auto"
      />

      {/* Music Toggle Button */}
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 p-2.5 sm:p-3 rounded-full bg-[#fdf5eb]/90 border border-[#d6ad5e]/70 shadow-lg backdrop-blur-sm text-[#702132] hover:text-[#531322] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
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
