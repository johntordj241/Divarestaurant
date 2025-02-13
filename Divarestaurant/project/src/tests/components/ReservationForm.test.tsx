import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from '../../components/ReservationForm';

describe('ReservationForm', () => {
  it('devrait valider les champs requis', () => {
    render(<ReservationForm />);
    
    const submitButton = screen.getByText(/continuer/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/ce champ est requis/i)).toBeInTheDocument();
  });

  it('devrait mettre à jour le prix total', () => {
    render(<ReservationForm />);
    
    const guestsInput = screen.getByLabelText(/invités/i);
    fireEvent.change(guestsInput, { target: { value: '4' } });

    const menuItem = screen.getByText(/menu classique/i);
    fireEvent.click(menuItem);

    expect(screen.getByText('340€')).toBeInTheDocument();
  });

  it('devrait valider le format de l\'email', () => {
    render(<ReservationForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText(/continuer/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
  });
});