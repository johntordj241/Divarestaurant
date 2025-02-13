import { supabase } from '../supabase/client';

export interface SystemSettings {
  cancellationPolicy: {
    freeCancellationHours: number;
    feePercentage: number;
  };
  paymentSettings: {
    depositPercentage: number;
    currency: string;
  };
  notificationSettings: {
    reminderHoursBefore: number;
    sendSms: boolean;
    sendEmail: boolean;
  };
}

export async function getSystemSettings(): Promise<SystemSettings> {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*');
    
  if (error) throw error;
  
  const settings = data.reduce((acc, setting) => ({
    ...acc,
    [setting.key]: setting.value
  }), {});
  
  return settings as SystemSettings;
}