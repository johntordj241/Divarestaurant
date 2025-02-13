import { describe, it, expect, vi } from 'vitest';
import { MonitoringService } from '../../lib/monitoring/MonitoringService';
import { supabase } from '../../lib/supabase/client';

describe('Environment Tests', () => {
  it('should use correct environment configuration', () => {
    const monitoring = MonitoringService.getInstance();
    const env = import.meta.env.MODE;
    
    expect(['development', 'staging', 'production']).toContain(env);
  });

  it('should connect to correct Supabase instance', async () => {
    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();
    expect(supabase.supabaseUrl).toContain(
      env === 'production' ? 'jjueybpnqikjbzhbfaua' : 'imjcjblozfuqdjzzzeqa'
    );
  });

  it('should have correct logging behavior', () => {
    const monitoring = MonitoringService.getInstance();
    const consoleSpy = vi.spyOn(console, 'info');
    
    monitoring.logInfo('test');
    
    if (env === 'production') {
      expect(consoleSpy).not.toHaveBeenCalled();
    } else {
      expect(consoleSpy).toHaveBeenCalled();
    }
  });
});