import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuSelection } from '../../components/reservation/MenuSelection';

describe('MenuSelection', () => {
  const mockOnSelect = vi.fn();
  const mockMenus = [
    { id: 'menu-1', name: 'Menu Classique', price: 85 },
    { id: 'menu-2', name: 'Menu Végétarien', price: 75 }
  ];

  it('devrait afficher la liste des menus', () => {
    render(<MenuSelection selectedMenus={[]} onMenuSelect={mockOnSelect} />);
    
    expect(screen.getByText('Menu Classique')).toBeInTheDocument();
    expect(screen.getByText('Menu Végétarien')).toBeInTheDocument();
  });

  it('devrait permettre la sélection de menus', () => {
    render(<MenuSelection selectedMenus={[]} onMenuSelect={mockOnSelect} />);
    
    const menuItem = screen.getByText('Menu Classique');
    fireEvent.click(menuItem);

    expect(mockOnSelect).toHaveBeenCalledWith(['menu-1']);
  });

  it('devrait afficher les menus sélectionnés', () => {
    render(<MenuSelection selectedMenus={['menu-1']} onMenuSelect={mockOnSelect} />);
    
    const selectedMenu = screen.getByText('Menu Classique').closest('div');
    expect(selectedMenu).toHaveClass('border-gold');
  });
});