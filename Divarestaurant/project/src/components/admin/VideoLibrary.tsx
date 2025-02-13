import React, { useState, useEffect } from 'react';
import { Video, Upload, Trash2, AlertCircle, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { VideoProcessor } from '../../lib/media/VideoProcessor';

interface VideoItem {
  id: string;
  url: string;
  name: string;
  type: 'video';
  size: number;
  location: 'hero' | 'gallery' | 'shows';
  created_at: string;
}

export function VideoLibrary() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'video')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setVideos(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des vidéos:', err);
      setError('Une erreur est survenue lors du chargement des vidéos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // Vérification de la taille (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 100MB');
      }

      // Vérification du format
      if (!file.type.startsWith('video/')) {
        throw new Error('Format de fichier non supporté. Utilisez MP4, WebM ou MOV.');
      }

      // Optimisation de la vidéo
      const videoProcessor = VideoProcessor.getInstance();
      const optimizedVideo = await videoProcessor.processVideo(file);
      const thumbnail = await videoProcessor.generateThumbnail(file);

      // Upload de la vidéo optimisée
      const videoPath = `videos/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(videoPath, optimizedVideo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(videoPath);

      // Insertion dans la base de données
      const { error: insertError } = await supabase
        .from('media')
        .insert({
          url: publicUrl,
          name: file.name,
          type: 'video',
          size: optimizedVideo.size,
          location: 'gallery',
          metadata: {
            thumbnail: thumbnail,
            duration: await getVideoDuration(file),
            originalSize: file.size,
            optimizedSize: optimizedVideo.size
          }
        });

      if (insertError) throw insertError;
      
      await loadVideos();
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    try {
      const { data: video } = await supabase
        .from('media')
        .select('url')
        .eq('id', id)
        .single();

      if (video) {
        // Supprimer le fichier du storage
        const videoPath = video.url.split('/').pop();
        if (videoPath) {
          await supabase.storage
            .from('media')
            .remove([`videos/${videoPath}`]);
        }
      }

      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVideos(prev => prev.filter(video => video.id !== id));
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression');
    }
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

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve(video.duration);
      video.src = URL.createObjectURL(file);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Bibliothèque Vidéo</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors cursor-pointer">
          <Upload size={20} />
          Importer une vidéo
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white/5 rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <video
                ref={selectedVideo?.id === video.id ? videoRef : null}
                src={video.url}
                className="w-full h-full object-cover"
                onClick={() => setSelectedVideo(video)}
                playsInline
                muted={isMuted}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(video.id);
                  }}
                  className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-white mb-1">{video.name}</h3>
              <p className="text-sm text-gray-400">
                {(video.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}