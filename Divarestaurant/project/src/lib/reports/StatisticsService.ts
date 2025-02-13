```typescript
import { supabase } from '../supabase/client';

export class StatisticsService {
  private static instance: StatisticsService;

  private constructor() {}

  static getInstance(): StatisticsService {
    if (!StatisticsService.instance) {
      StatisticsService.instance = new StatisticsService();
    }
    return StatisticsService.instance;
  }

  async generateDailyReport() {
    const today = new Date().toISOString().split('T')[0];
    
    const [reservations, revenue, occupancy] = await Promise.all([
      this.getReservationStats(today),
      this.getRevenueStats(today),
      this.getOccupancyStats(today)
    ]);

    return {
      date: today,
      reservations,
      revenue,
      occupancy,
      timestamp: new Date().toISOString()
    };
  }

  private async getReservationStats(date: string) {
    const { data, error } = await supabase.rpc('get_reservation_stats', { date });
    if (error) throw error;
    return data;
  }

  private async getRevenueStats(date: string) {
    const { data, error } = await supabase.rpc('get_revenue_stats', { date });
    if (error) throw error;
    return data;
  }

  private async getOccupancyStats(date: string) {
    const { data, error } = await supabase.rpc('get_occupancy_stats', { date });
    if (error) throw error;
    return data;
  }
}
```