import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationManager } from '../../components/admin/ReservationManager';
import { createReservation, updateReservationStatus } from '../../lib/api/reservations';
import { supabase } from '../../lib/supabase/client';
import { NotificationService } from '../../lib/notifications/NotificationService';

// Mock des dépendances
vi.mock('../../lib/supabase/client');
vi.mock('../../lib/notifications/NotificationService');

describe('Système de Réservation - Tests d\'Intégration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock du NotificationService
    vi.mocked(NotificationService.getInstance).mockReturnValue({
      sendEmail: vi.fn().mockResolvedValue(undefined),
      sendSMS: vi.fn().mockResolvedValue(undefined)
    } as any);
  });

  describe('Création de réservation', () => {
    it('devrait créer une nouvelle réservation avec succès', async () => {
      const mockReservationData = {
        date: '2024-02-01',
        time: '19:30',
        numberOfGuests: 4,
        customerName: 'Jean Dupont',
        customerEmail: 'jean@example.com',
        customerPhone: '+33612345678',
        menuIds: ['menu-1'],
        specialRequests: 'Table près de la fenêtre'
      };

      // Mock de la vérification de disponibilité
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { ...mockReservationData, id: '123' },
              error: null
            })
          })
        })
      } as any));

      const result = await createReservation(mockReservationData);
      expect(result).toBeDefined();
      expect(result.id).toBe('123');
    });

    it('devrait gérer les erreurs de création', async () => {
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: new Error('Erreur de création') })
          })
        })
      } as any));

      await expect(createReservation({} as any)).rejects.toThrow('Erreur de création');
    });
  });

  describe('Mise à jour du statut', () => {
    it('devrait mettre à jour le statut avec succès', async () => {
      const mockResponse = { 
        data: { id: '123', status: 'confirmed' }, 
        error: null 
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ 
              data: { modification_history: [] }, 
              error: null 
            })
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue(mockResponse)
            })
          })
        })
      } as any));

      const result = await updateReservationStatus('123', 'confirmed');
      expect(result.status).toBe('confirmed');
    });
  });

  describe('Interface ReservationManager', () => {
    it('devrait afficher la liste des réservations', async () => {
      const mockReservations = [
        {
          id: '1',
          date: '2024-02-01',
          time: '19:30',
          customerName: 'Jean Dupont',
          numberOfGuests: 4,
          status: 'confirmed'
        }
      ];

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockReservations, error: null })
          })
        })
      } as any));

      render(<ReservationManager />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('19:30')).toBeInTheDocument();
      });
    });

    it('devrait permettre de filtrer les réservations', async () => {
      render(<ReservationManager />);
      
      const statusFilter = screen.getByRole('combobox');
      fireEvent.change(statusFilter, { target: { value: 'confirmed' } });

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('reservations');
      });
    });
  });
});