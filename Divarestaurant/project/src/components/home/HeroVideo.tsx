import React from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface HeroVideoProps {
  videoUrl?: string;
}

export function HeroVideo({ videoUrl = "https://player.vimeo.com/external/459389137.hd.mp4?s=865d8f42a0857092937b4aa7a0eb3d62d796aa9e&profile_id=175" }: HeroVideoProps) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      // Forcer le chargement et la lecture automatique
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si la lecture automatique échoue, on force le mode muet et on réessaie
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(console.error);
          }
        });
      }
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute bottom-6 right-6 flex gap-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <Play size={20} className={isPlaying ? 'opacity-50' : ''} />
        </button>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
}