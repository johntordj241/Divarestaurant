import { MediaService } from '../automation/MediaService';
import { VideoProcessor } from './VideoProcessor';

export class MediaOptimizer {
  private static instance: MediaOptimizer;
  private mediaService: MediaService;
  private videoProcessor: VideoProcessor;

  private constructor() {
    this.mediaService = new MediaService();
    this.videoProcessor = VideoProcessor.getInstance();
  }

  static getInstance(): MediaOptimizer {
    if (!MediaOptimizer.instance) {
      MediaOptimizer.instance = new MediaOptimizer();
    }
    return MediaOptimizer.instance;
  }

  async optimizeImage(file: File): Promise<Blob> {
    // Optimisation des images
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Redimensionnement max 2000px
        const maxSize = 2000;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to optimize image'));
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async optimizeVideo(file: File): Promise<Blob> {
    return this.videoProcessor.processVideo(file);
  }

  async generateVideoThumbnail(file: File): Promise<Blob> {
    return this.videoProcessor.generateThumbnail(file);
  }
}