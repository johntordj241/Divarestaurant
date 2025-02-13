import { supabase } from '../supabase/client';

export class AnalyticsService {
  async generateDailyReport() {
    try {
      const [reservations, revenue, feedback] = await Promise.all([
        this.getReservationMetrics(),
        this.getRevenueMetrics(),
        this.getFeedbackMetrics()
      ]);

      return {
        date: new Date().toISOString(),
        metrics: {
          reservations,
          revenue,
          feedback
        }
      };
    } catch (error) {
      console.error('Failed to generate daily report:', error);
      throw error;
    }
  }

  private async getReservationMetrics() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    return {
      total: data.length,
      confirmed: data.filter(r => r.status === 'confirmed').length,
      pending: data.filter(r => r.status === 'pending').length,
      averageSize: data.reduce((acc, r) => acc + r.number_of_guests, 0) / data.length || 0
    };
  }

  private async getRevenueMetrics() {
    const { data, error } = await supabase
      .from('reservations')
      .select('total_price')
      .eq('payment_status', 'paid')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    return {
      total: data.reduce((acc, r) => acc + r.total_price, 0),
      count: data.length,
      average: data.reduce((acc, r) => acc + r.total_price, 0) / data.length || 0
    };
  }

  private async getFeedbackMetrics() {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    return {
      count: data.length,
      averageRating: data.reduce((acc, f) => acc + f.rating, 0) / data.length || 0
    };
  }
}