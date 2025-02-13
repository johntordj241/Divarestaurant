import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatisticsChart } from '../../../components/admin/statistics/StatisticsChart';

describe('StatisticsChart', () => {
  const mockData = [
    { date: '2024-01-01', revenue: 1000, reservations: 10 },
    { date: '2024-01-02', revenue: 1500, reservations: 15 },
    { date: '2024-01-03', revenue: 800, reservations: 8 }
  ];

  it('devrait afficher le graphique avec les données', () => {
    render(<StatisticsChart data={mockData} />);
    
    expect(screen.getByText(/Évolution des réservations et du CA/i)).toBeInTheDocument();
    expect(screen.getByText(/Chiffre d'affaires/i)).toBeInTheDocument();
    expect(screen.getByText(/Réservations/i)).toBeInTheDocument();
  });

  it('devrait calculer correctement les proportions', () => {
    const { container } = render(<StatisticsChart data={mockData} />);
    
    const bars = container.querySelectorAll('.bg-gold');
    expect(bars).toHaveLength(mockData.length);

    // Vérifier que la plus haute barre correspond à la valeur maximale
    const maxRevenue = Math.max(...mockData.map(d => d.revenue));
    const maxBar = Array.from(bars).find(
      bar => parseFloat(bar.getAttribute('style')?.match(/height: ([\d.]+)%/)?.[1] || '0') === 100
    );
    expect(maxBar).toBeTruthy();
  });
});