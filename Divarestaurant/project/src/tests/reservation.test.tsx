import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from '../components/ReservationForm';
import { DateSelection } from '../components/reservation/DateSelection';
import { MenuSelection } from '../components/reservation/MenuSelection';
import { CustomerForm } from '../components/reservation/CustomerForm';

describe('Composants de Réservation - Tests Unitaires', () => {
  describe('DateSelection', () => {
    it('devrait mettre à jour la date sélectionnée', () => {
      const onDateChange = vi.fn();
      render(
        <DateSelection
          date=""
          time=""
          guests={2}
          onDateChange={onDateChange}
          onTimeChange={vi.fn()}
          onGuestsChange={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.change(dateInput, { target: { value: '2024-02-01' } });

      expect(onDateChange).toHaveBeenCalledWith('2024-02-01');
    });

    it('devrait valider le nombre de convives', () => {
      const onGuestsChange = vi.fn();
      render(
        <DateSelection
          date=""
          time=""
          guests={0}
          onDateChange={vi.fn()}
          onTimeChange={vi.fn()}
          onGuestsChange={onGuestsChange}
        />
      );

      const guestsInput = screen.getByLabelText(/invités/i);
      fireEvent.change(guestsInput, { target: { value: '4' } });

      expect(onGuestsChange).toHaveBeenCalledWith(4);
    });
  });

  describe('MenuSelection', () => {
    it('devrait permettre la sélection de menus', () => {
      const onMenuSelect = vi.fn();
      render(
        <MenuSelection
          selectedMenus={[]}
          onMenuSelect={onMenuSelect}
        />
      );

      const menuItem = screen.getByText(/menu classique/i);
      fireEvent.click(menuItem);

      expect(onMenuSelect).toHaveBeenCalled();
    });
  });

  describe('CustomerForm', () => {
    it('devrait valider les champs requis', () => {
      const onChange = vi.fn();
      render(
        <CustomerForm
          formData={{
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
          }}
          onChange={onChange}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { 
        target: { value: 'invalid-email' } 
      });

      // Le formulaire devrait afficher une erreur
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  describe('ReservationForm - Intégration', () => {
    it('devrait gérer le processus complet de réservation', async () => {
      const mockSubmit = vi.fn();
      render(<ReservationForm onSubmit={mockSubmit} />);

      // Étape 1: Date et invités
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: '2024-02-01' }
      });
      fireEvent.change(screen.getByLabelText(/invités/i), {
        target: { value: '4' }
      });
      fireEvent.click(screen.getByText(/continuer/i));

      // Étape 2: Sélection du menu
      const menuItem = screen.getByText(/menu classique/i);
      fireEvent.click(menuItem);
      fireEvent.click(screen.getByText(/continuer/i));

      // Étape 3: Informations client
      fireEvent.change(screen.getByLabelText(/nom/i), {
        target: { value: 'Jean Dupont' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'jean@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/téléphone/i), {
        target: { value: '+33612345678' }
      });
      fireEvent.click(screen.getByText(/confirmer/i));

      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        date: '2024-02-01',
        numberOfGuests: 4,
        customerName: 'Jean Dupont'
      }));
    });
  });
});