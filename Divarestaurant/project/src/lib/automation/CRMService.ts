import { supabase } from '../supabase/client';

export class CRMService {
  async updateCustomerProfile(customerId: string, data: any) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: customerId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update customer profile:', error);
      throw error;
    }
  }

  async addLoyaltyPoints(customerId: string, points: number) {
    try {
      const { error } = await supabase
        .rpc('update_loyalty_points', {
          p_customer_id: customerId,
          p_points: points
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update loyalty points:', error);
      throw error;
    }
  }

  async getFeedbackStats(since: Date) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('rating')
        .gte('created_at', since.toISOString());

      if (error) throw error;

      const ratings = data.map(f => f.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      return {
        count: ratings.length,
        average: average || 0,
        distribution: this.calculateRatingDistribution(ratings)
      };
    } catch (error) {
      console.error('Failed to get feedback stats:', error);
      throw error;
    }
  }

  private calculateRatingDistribution(ratings: number[]) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => distribution[rating]++);
    return distribution;
  }
}