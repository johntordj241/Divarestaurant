import { useState, useEffect } from 'react';
import { MediaItem, uploadMedia, getMediaList, deleteMedia } from '../lib/api/media';

export function useMedia() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const items = await getMediaList();
      setMediaItems(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load media'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const newMedia = await uploadMedia(file);
      setMediaItems(prev => [newMedia, ...prev]);
      return newMedia;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload media'));
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete media'));
      throw err;
    }
  };

  return {
    mediaItems,
    isLoading,
    error,
    uploadMedia: handleUpload,
    deleteMedia: handleDelete,
    refreshMedia: loadMedia
  };
}