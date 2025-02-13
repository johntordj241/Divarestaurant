import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OccupancyChart } from '../../../components/admin/statistics/OccupancyChart';

describe('OccupancyChart', () => {
  const mockData = {
    percentage: 75,
    totalSeats: 100,
    reservedSeats: 75
  };

  it('devrait afficher le taux d\'occupation', () => {
    render(<OccupancyChart data={mockData} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText(/75 places réservées sur 100 disponibles/i)).toBeInTheDocument();
  });

  it('devrait afficher la légende', () => {
    render(<OccupancyChart data={mockData} />);
    
    expect(screen.getByText('Occupé')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });
});