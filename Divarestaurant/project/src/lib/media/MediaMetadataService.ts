import { supabase } from '../supabase/client';

export class MediaMetadataService {
  private static instance: MediaMetadataService;

  private constructor() {}

  static getInstance(): MediaMetadataService {
    if (!MediaMetadataService.instance) {
      MediaMetadataService.instance = new MediaMetadataService();
    }
    return MediaMetadataService.instance;
  }

  async updateMetadata(mediaId: string, metadata: {
    tags?: string[];
    description?: string;
    location?: string;
    customFields?: Record<string, any>;
  }) {
    try {
      const { error } = await supabase
        .from('media')
        .update({
          metadata: {
            ...metadata,
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', mediaId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update metadata:', error);
      throw error;
    }
  }

  async addTags(mediaId: string, tags: string[]) {
    try {
      const { data: media } = await supabase
        .from('media')
        .select('metadata')
        .eq('id', mediaId)
        .single();

      const currentTags = media?.metadata?.tags || [];
      const uniqueTags = [...new Set([...currentTags, ...tags])];

      await this.updateMetadata(mediaId, {
        ...media?.metadata,
        tags: uniqueTags
      });
    } catch (error) {
      console.error('Failed to add tags:', error);
      throw error;
    }
  }

  async removeTags(mediaId: string, tagsToRemove: string[]) {
    try {
      const { data: media } = await supabase
        .from('media')
        .select('metadata')
        .eq('id', mediaId)
        .single();

      const currentTags = media?.metadata?.tags || [];
      const updatedTags = currentTags.filter(tag => !tagsToRemove.includes(tag));

      await this.updateMetadata(mediaId, {
        ...media?.metadata,
        tags: updatedTags
      });
    } catch (error) {
      console.error('Failed to remove tags:', error);
      throw error;
    }
  }

  async searchByTags(tags: string[]) {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .contains('metadata->tags', tags);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to search by tags:', error);
      throw error;
    }
  }

  async generateAutomaticTags(mediaUrl: string) {
    try {
      // Intégration future avec un service de reconnaissance d'image/vidéo
      // Pour l'instant, retourne des tags génériques
      return ['Spectacle', 'Ambiance', 'Intérieur'];
    } catch (error) {
      console.error('Failed to generate automatic tags:', error);
      throw error;
    }
  }

  async getMetadataStats() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('metadata');

      if (error) throw error;

      const stats = {
        totalTags: 0,
        popularTags: new Map<string, number>(),
        mediaWithTags: 0,
        mediaWithoutTags: 0
      };

      data.forEach(item => {
        if (item.metadata?.tags?.length) {
          stats.mediaWithTags++;
          item.metadata.tags.forEach((tag: string) => {
            stats.totalTags++;
            stats.popularTags.set(tag, (stats.popularTags.get(tag) || 0) + 1);
          });
        } else {
          stats.mediaWithoutTags++;
        }
      });

      return {
        ...stats,
        popularTags: Array.from(stats.popularTags.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to get metadata stats:', error);
      throw error;
    }
  }

  async bulkUpdateTags(mediaIds: string[], tags: string[], operation: 'add' | 'remove') {
    try {
      const promises = mediaIds.map(id => {
        if (operation === 'add') {
          return this.addTags(id, tags);
        } else {
          return this.removeTags(id, tags);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to bulk update tags:', error);
      throw error;
    }
  }

  async exportMetadata() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('id, name, metadata')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exportData = data.map(item => ({
        id: item.id,
        name: item.name,
        tags: item.metadata?.tags || [],
        description: item.metadata?.description || '',
        customFields: item.metadata?.customFields || {}
      }));

      return exportData;
    } catch (error) {
      console.error('Failed to export metadata:', error);
      throw error;
    }
  }

  async importMetadata(data: any[]) {
    try {
      const promises = data.map(item => 
        this.updateMetadata(item.id, {
          tags: item.tags,
          description: item.description,
          customFields: item.customFields
        })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to import metadata:', error);
      throw error;
    }
  }
}