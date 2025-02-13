import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, Clock, Calendar } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  date: string;
  category: 'event' | 'interview' | 'presentation';
  description?: string;
}

export function VideoGallery() {
  const [videos] = useState<VideoItem[]>([
    {
      id: '1',
      title: 'Soirée Jazz & Gastronomie',
      url: 'https://player.vimeo.com/external/459389137.hd.mp4?s=865d8f42a0857092937b4aa7a0eb3d62d796aa9e&profile_id=175',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      duration: '2:45',
      date: '2024-01-15',
      category: 'event',
      description: 'Retour sur notre dernière soirée thématique'
    },
    {
      id: '2',
      title: 'Interview du Chef',
      url: 'https://player.vimeo.com/external/459389137.hd.mp4?s=865d8f42a0857092937b4aa7a0eb3d62d796aa9e&profile_id=175',
      thumbnail: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c',
      duration: '5:30',
      date: '2024-01-10',
      category: 'interview',
      description: 'Découvrez les secrets de notre cuisine'
    },
    {
      id: '3',
      title: 'Visite Virtuelle',
      url: 'https://player.vimeo.com/external/459389137.hd.mp4?s=865d8f42a0857092937b4aa7a0eb3d62d796aa9e&profile_id=175',
      thumbnail: 'https://images.unsplash.com/photo-1485872299829-c673f5194813',
      duration: '3:15',
      date: '2024-01-05',
      category: 'presentation',
      description: 'Explorez notre établissement'
    }
  ]);

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">
          GALERIE VIDÉO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white/5 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="text-white" size={48} />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-sm flex items-center gap-1">
                  <Clock size={14} />
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-serif text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(video.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={14} />
                    {video.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de lecture vidéo */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>

            <div className="w-full max-w-4xl">
              <video
                ref={videoRef}
                src={selectedVideo.url}
                className="w-full rounded-lg"
                autoPlay
                playsInline
                controls={false}
                muted={isMuted}
              />

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-white">{selectedVideo.title}</h3>
                  <p className="text-gray-400 text-sm">{selectedVideo.description}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}