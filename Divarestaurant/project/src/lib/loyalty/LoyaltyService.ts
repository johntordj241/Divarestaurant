import { supabase } from '../supabase/client';
import { NotificationService } from '../notifications/NotificationService';

export class LoyaltyService {
  private static instance: LoyaltyService;
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): LoyaltyService {
    if (!LoyaltyService.instance) {
      LoyaltyService.instance = new LoyaltyService();
    }
    return LoyaltyService.instance;
  }

  async getLoyaltyPoints(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('customer_loyalty')
      .select('points')
      .eq('customer_id', userId)
      .single();

    if (error) throw error;
    return data?.points || 0;
  }

  async addPoints(userId: string, points: number, reason: string): Promise<void> {
    const { error: updateError } = await supabase.rpc('update_loyalty_points', {
      p_customer_id: userId,
      p_points: points
    });

    if (updateError) throw updateError;

    // Log transaction
    const { error: logError } = await supabase
      .from('loyalty_transactions')
      .insert({
        customer_id: userId,
        points,
        reason,
        created_at: new Date().toISOString()
      });

    if (logError) throw logError;

    // Check for tier upgrade
    await this.checkAndUpdateTier(userId);
  }

  async calculateTier(points: number): Promise<'bronze' | 'silver' | 'gold'> {
    if (points >= 2500) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
  }

  private async checkAndUpdateTier(userId: string): Promise<void> {
    const points = await this.getLoyaltyPoints(userId);
    const newTier = await this.calculateTier(points);

    const { data: currentTier } = await supabase
      .from('customer_loyalty')
      .select('tier')
      .eq('customer_id', userId)
      .single();

    if (currentTier?.tier !== newTier) {
      // Update tier
      await supabase
        .from('customer_loyalty')
        .update({ tier: newTier })
        .eq('customer_id', userId);

      // Notify customer
      const { data: user } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (user?.email) {
        await this.notificationService.sendEmail(
          user.email,
          'tier_upgrade',
          {
            tier: newTier,
            points: points
          }
        );
      }
    }
  }

  async getTransactionHistory(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTierBenefits(tier: string): Promise<any> {
    const benefits = {
      bronze: {
        discount: 5,
        perks: ['Newsletter exclusive', 'Priorité sur liste d\'attente']
      },
      silver: {
        discount: 10,
        perks: ['Coupe de champagne offerte', 'Accès aux ventes privées']
      },
      gold: {
        discount: 15,
        perks: ['Table VIP garantie', 'Service prioritaire', 'Cadeau d\'anniversaire']
      }
    };

    return benefits[tier as keyof typeof benefits] || benefits.bronze;
  }
}