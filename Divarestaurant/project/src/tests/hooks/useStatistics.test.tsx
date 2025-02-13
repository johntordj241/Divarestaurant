import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStatistics } from '../../hooks/useStatistics';
import { supabase } from '../../lib/supabase/client';

vi.mock('../../lib/supabase/client', () => ({
  supabase: {
    rpc: vi.fn()
  }
}));

describe('useStatistics', () => {
  it('devrait charger les statistiques correctement', async () => {
    const mockStats = {
      revenue: 10000,
      revenueComparison: 15,
      totalGuests: 500,
      averageGuests: 4,
      reservations: 125,
      conversionRate: 85,
      averageTicket: 80
    };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ 
      data: mockStats, 
      error: null 
    });

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toEqual(expect.objectContaining(mockStats));
    expect(result.current.error).toBeNull();
  });

  it('devrait gérer les erreurs', async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ 
      data: null, 
      error: new Error('Erreur de chargement') 
    });

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.statistics).toEqual(expect.objectContaining({
      revenue: 0,
      totalGuests: 0
    }));
  });
});