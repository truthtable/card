import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, ChevronRight, Play } from 'lucide-react';

interface Slide0Props {
  onFinish: () => void;
}

export const Slide0: React.FC<Slide0Props> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishTriggeredRef = useRef(false);

  // Trigger completion and cross-fade out
  const triggerFinish = useCallback(() => {
    if (finishTriggeredRef.current) return;
    finishTriggeredRef.current = true;
    setIsFading(true);
  }, []);

  // When fade completes, notify parent
  useEffect(() => {
    if (!isFading) return;
    const timer = setTimeout(() => {
      onFinish();
    }, 1000); // matches duration-1000
    return () => clearTimeout(timer);
  }, [isFading, onFinish]);

  // Handle video ending: stay on last frame, then cross-fade out
  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // Freeze exactly on last frame
    }
    // Brief pause on last frame before initiating the cross-fade
    setTimeout(() => {
      triggerFinish();
    }, 400);
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Dedicated play trigger that handles browser autoplay restrictions
  const playVideo = useCallback(async (withSound = false) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = !withSound;
      video.defaultMuted = !withSound;
      setIsMuted(!withSound);
      await video.play();
      setIsPlaying(true);
    } catch {
      // If unmuted failed, strictly fallback to muted
      try {
        video.muted = true;
        video.defaultMuted = true;
        setIsMuted(true);
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Autoplay waiting for user gesture:', err);
        setIsPlaying(false);
      }
    }
  }, []);

  // Callback ref to configure DOM element immediately upon mounting
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) {
      // Force DOM properties that React JSX doesn't always sync in time
      node.muted = true;
      node.defaultMuted = true;
      node.playsInline = true;
      node.setAttribute('muted', '');
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  // Lifecycle listeners for ready states & global interaction fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      if (video.paused && !finishTriggeredRef.current) {
        playVideo(false);
      }
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', onCanPlay);
    video.addEventListener('playing', () => setIsPlaying(true));

    // Global interaction fallback: first tap anywhere starts the video
    const handleGlobalTap = () => {
      if (video.paused && !finishTriggeredRef.current) {
        playVideo(false);
      }
    };

    window.addEventListener('click', handleGlobalTap, { once: true, passive: true });
    window.addEventListener('touchstart', handleGlobalTap, { once: true, passive: true });

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', onCanPlay);
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };
  }, [playVideo]);

  // Click on container
  const handleContainerClick = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      playVideo(false);
    }
  };

  // Toggle sound
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      videoRef.current.defaultMuted = newMuted;
      setIsMuted(newMuted);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-50 w-full h-full bg-black overflow-hidden select-none transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Edge-to-edge Fullscreen Video */}
      <video
        ref={setVideoRef}
        src="./media/Royal-Nikah-Video.mp4"
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Tap to Play Fallback (shown only if browser blocked autoplay) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#1a0a0f]/85 border border-[#d6ad5e]/70 shadow-[0_0_40px_rgba(214,173,94,0.35)] animate-pulse hover:scale-105 transition-all">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9e6d23] via-[#e5c158] to-[#f6d89b] flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-[#4a1525] ml-1 fill-current" />
            </div>
            <p className="font-italiana text-xl sm:text-2xl text-[#f6d89b] tracking-widest uppercase">
              Open Invitation
            </p>
            <span className="text-[11px] font-sans text-[#e5c158]/80 tracking-wider uppercase">
              Tap anywhere to play
            </span>
          </div>
        </div>
      )}

      {/* Video progress indicator line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#b38738] via-[#e5c158] to-[#b38738] transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
        {/* Audio toggle button */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 border border-[#d6ad5e]/40 text-[#f6d89b] text-xs font-sans tracking-wider backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Sound On</span>
            </>
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerFinish();
          }}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/75 border border-[#d6ad5e]/40 text-[#f6d89b] text-xs font-sans font-medium uppercase tracking-widest backdrop-blur-md transition-all hover:border-[#d6ad5e] active:scale-95 cursor-pointer shadow-lg"
          title="Skip Intro"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#e5c158]" />
        </button>
      </div>
    </div>
  );
};
