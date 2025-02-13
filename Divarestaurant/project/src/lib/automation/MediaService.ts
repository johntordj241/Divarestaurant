import { supabase } from '../supabase/client';

export class MediaService {
  async optimizeImage(file: File): Promise<Blob> {
    try {
      const { data, error } = await supabase.functions.invoke('optimize-image', {
        body: { file }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  async generateThumbnail(fileUrl: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-thumbnail', {
        body: { url: fileUrl }
      });

      if (error) throw error;
      return data.thumbnailUrl;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      throw error;
    }
  }

  async updateMetadata(mediaId: string, metadata: Record<string, any>) {
    try {
      const { error } = await supabase
        .from('media')
        .update({ metadata })
        .eq('id', mediaId);

      if (error) throw error;
    } catch (error) {
      console.error('Metadata update failed:', error);
      throw error;
    }
  }

  async generateAltText(imageUrl: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-alt-text', {
        body: { url: imageUrl }
      });

      if (error) throw error;
      return data.altText;
    } catch (error) {
      console.error('Alt text generation failed:', error);
      throw error;
    }
  }
}