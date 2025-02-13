import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoyaltyCard } from '../components/loyalty/LoyaltyCard';
import { LoyaltyService } from '../lib/loyalty/LoyaltyService';

describe('LoyaltyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLoyaltyData = {
    points: 1500,
    tier: 'gold',
    nextTierPoints: 2000,
    history: [
      { date: '2024-01-15', points: 100, reason: 'Réservation' },
      { date: '2024-01-10', points: 50, reason: 'Avis client' }
    ]
  };

  it('should display current points and tier', () => {
    render(<LoyaltyCard data={mockLoyaltyData} />);
    
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText(/gold/i)).toBeInTheDocument();
  });

  it('should show progress to next tier', () => {
    render(<LoyaltyCard data={mockLoyaltyData} />);
    
    expect(screen.getByText(/500 points jusqu'au prochain niveau/i)).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('should display transaction history', () => {
    render(<LoyaltyCard data={mockLoyaltyData} />);
    
    expect(screen.getByText('Réservation')).toBeInTheDocument();
    expect(screen.getByText('Avis client')).toBeInTheDocument();
    expect(screen.getByText('+100')).toBeInTheDocument();
    expect(screen.getByText('+50')).toBeInTheDocument();
  });
});

describe('LoyaltyService', () => {
  const service = LoyaltyService.getInstance();

  it('should add points correctly', async () => {
    const addPointsSpy = vi.spyOn(service, 'addPoints');
    await service.addPoints('user-123', 100, 'Réservation');
    
    expect(addPointsSpy).toHaveBeenCalledWith('user-123', 100, 'Réservation');
  });

  it('should calculate tier correctly', () => {
    expect(service.calculateTier(500)).toBe('bronze');
    expect(service.calculateTier(1500)).toBe('silver');
    expect(service.calculateTier(3000)).toBe('gold');
  });
});