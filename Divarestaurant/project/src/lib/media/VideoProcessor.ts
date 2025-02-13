import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class VideoProcessor {
  private static instance: VideoProcessor;
  private ffmpeg: FFmpeg | null = null;
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;
  private readonly MAX_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly VALID_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
  private readonly OUTPUT_OPTIONS = [
    '-c:v', 'libx264',     // Codec vidéo H.264
    '-preset', 'fast',     // Préréglage de compression
    '-crf', '23',          // Qualité vidéo (0-51, plus bas = meilleure qualité)
    '-c:a', 'aac',         // Codec audio AAC
    '-b:a', '128k',        // Bitrate audio
    '-movflags', '+faststart', // Optimisation pour le streaming
    '-vf', 'scale=\'min(1920,iw)\':\'min(1080,ih)\':force_original_aspect_ratio=decrease', // Redimensionnement max 1080p
  ];

  private constructor() {}

  static getInstance(): VideoProcessor {
    if (!VideoProcessor.instance) {
      VideoProcessor.instance = new VideoProcessor();
    }
    return VideoProcessor.instance;
  }

  private async loadFFmpeg() {
    if (this.isLoaded) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        this.ffmpeg = new FFmpeg();
        
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        });
        
        this.isLoaded = true;
      } catch (error) {
        console.error('Erreur lors du chargement de FFmpeg:', error);
        throw new Error('Impossible de charger FFmpeg. Veuillez réessayer.');
      } finally {
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  async processVideo(file: File, onProgress?: (progress: number) => void): Promise<Blob> {
    try {
      // Validation du fichier
      if (file.size > this.MAX_SIZE) {
        throw new Error(`La taille du fichier ne doit pas dépasser ${this.MAX_SIZE / (1024 * 1024)}MB`);
      }

      if (!this.VALID_TYPES.includes(file.type)) {
        throw new Error('Format vidéo non supporté. Utilisez MP4, WebM ou MOV.');
      }

      // Chargement de FFmpeg
      await this.loadFFmpeg();
      if (!this.ffmpeg) throw new Error('FFmpeg non initialisé');

      onProgress?.(10);

      // Préparation des fichiers
      const inputFileName = `input${this.getExtension(file.type)}`;
      const outputFileName = 'output.mp4';

      // Écriture du fichier d'entrée
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(file));
      onProgress?.(30);

      // Configuration de la progression
      this.ffmpeg.on('progress', ({ progress }) => {
        const percent = Math.round(30 + (progress * 60));
        onProgress?.(Math.min(percent, 95));
      });

      // Analyse de la vidéo
      await this.ffmpeg.exec(['-i', inputFileName]);
      const videoInfo = await this.ffmpeg.readFile('ffmpeg-output.txt', { encoding: 'utf8' });
      console.log('Video info:', videoInfo);

      // Conversion avec les options optimisées
      await this.ffmpeg.exec([
        '-i', inputFileName,
        ...this.OUTPUT_OPTIONS,
        '-y', outputFileName
      ]);

      // Lecture du fichier de sortie
      const outputData = await this.ffmpeg.readFile(outputFileName);
      onProgress?.(100);

      // Nettoyage
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Création du blob avec les bons types MIME
      return new Blob([outputData], { type: 'video/mp4' });
    } catch (error) {
      console.error('Erreur de traitement vidéo:', error);
      throw error instanceof Error ? error : new Error('Erreur de traitement vidéo');
    }
  }

  private getExtension(mimeType: string): string {
    switch (mimeType) {
      case 'video/mp4': return '.mp4';
      case 'video/webm': return '.webm';
      case 'video/quicktime': return '.mov';
      default: return '.mp4';
    }
  }

  async generateThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.controls = true;
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        try {
          // Capture à 1 seconde ou 25% de la durée
          const captureTime = Math.min(1, video.duration * 0.25);
          video.currentTime = captureTime;
        } catch (e) {
          reject(new Error('Impossible de générer la miniature'));
        }
      };

      video.onseeked = () => {
        try {
          // Dimensions de la miniature
          const maxWidth = 480;
          const maxHeight = 270;
          
          let width = video.videoWidth;
          let height = video.videoHeight;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(video, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Échec de la génération de la miniature'));
            },
            'image/jpeg',
            0.85
          );
        } catch (e) {
          reject(new Error('Échec de la génération de la miniature'));
        }
      };

      video.onerror = () => {
        reject(new Error('Erreur lors du chargement de la vidéo'));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Impossible de lire les métadonnées de la vidéo'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  }
}