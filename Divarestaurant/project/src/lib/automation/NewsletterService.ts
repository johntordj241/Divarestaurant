import { supabase } from '../supabase/client';

export class NewsletterService {
  async getSubscribers(audience: string) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('audience', audience);

    if (error) throw error;
    return data;
  }

  async createCampaign(template: string) {
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert({
        template,
        status: 'draft',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async scheduleCampaign(campaignId: string, subscribers: any[]) {
    const { error } = await supabase
      .from('newsletter_schedules')
      .insert({
        campaign_id: campaignId,
        subscriber_count: subscribers.length,
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Programme pour dans 24h
      });

    if (error) throw error;
    return true;
  }
}