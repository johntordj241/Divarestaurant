import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuStats } from '../../../components/admin/statistics/MenuStats';

describe('MenuStats', () => {
  const mockData = [
    { id: '1', name: 'Menu Classique', count: 50, revenue: 4250 },
    { id: '2', name: 'Menu Végétarien', count: 30, revenue: 2250 }
  ];

  it('devrait afficher les statistiques des menus', () => {
    render(<MenuStats data={mockData} />);
    
    expect(screen.getByText('Menu Classique')).toBeInTheDocument();
    expect(screen.getByText('Menu Végétarien')).toBeInTheDocument();
    expect(screen.getByText('4 250€')).toBeInTheDocument();
  });

  it('devrait calculer les pourcentages correctement', () => {
    render(<MenuStats data={mockData} />);
    
    const totalRevenue = mockData.reduce((sum, item) => sum + item.revenue, 0);
    const firstMenuPercentage = Math.round((mockData[0].revenue / totalRevenue) * 100);
    
    expect(screen.getByText(`${firstMenuPercentage}%`)).toBeInTheDocument();
  });
});