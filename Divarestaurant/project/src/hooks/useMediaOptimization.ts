import { useState } from 'react';
import { MediaService } from '../lib/automation/MediaService';

export function useMediaOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const mediaService = new MediaService();

  const optimizeMedia = async (file: File) => {
    setIsOptimizing(true);
    setProgress(0);

    try {
      // Optimize image
      const optimizedBlob = await mediaService.optimizeImage(file);
      setProgress(50);

      // Create optimized file
      const optimizedFile = new File([optimizedBlob], file.name, {
        type: file.type
      });

      // Generate thumbnail
      const thumbnailUrl = await mediaService.generateThumbnail(URL.createObjectURL(optimizedFile));
      setProgress(75);

      // Generate alt text
      const altText = await mediaService.generateAltText(URL.createObjectURL(optimizedFile));
      setProgress(90);

      // Update metadata
      await mediaService.updateMetadata(file.name, {
        thumbnailUrl,
        altText,
        optimized: true
      });

      setProgress(100);
      return optimizedFile;
    } catch (error) {
      console.error('Media optimization failed:', error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    optimizeMedia,
    isOptimizing,
    progress
  };
}