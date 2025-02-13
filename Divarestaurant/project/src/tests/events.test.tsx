import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpecialEventCard } from '../components/events/SpecialEventCard';
import { EventService } from '../lib/events/EventService';

describe('SpecialEventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Soirée Jazz',
    description: 'Une soirée exceptionnelle',
    date: '2024-03-01',
    time: '19:30',
    price: 150,
    capacity: 40,
    imageUrl: 'https://example.com/image.jpg',
    benefits: ['Champagne offert', 'Place VIP'],
    isVIP: true,
    minimumPartySize: 2,
    dresscode: 'Tenue de soirée'
  };

  it('devrait afficher les détails de l\'événement', () => {
    render(<SpecialEventCard event={mockEvent} onBook={() => {}} />);
    
    expect(screen.getByText('Soirée Jazz')).toBeInTheDocument();
    expect(screen.getByText('Une soirée exceptionnelle')).toBeInTheDocument();
    expect(screen.getByText('150€')).toBeInTheDocument();
  });

  it('devrait afficher le badge VIP si applicable', () => {
    render(<SpecialEventCard event={mockEvent} onBook={() => {}} />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('devrait appeler onBook avec l\'id de l\'événement', () => {
    const onBook = vi.fn();
    render(<SpecialEventCard event={mockEvent} onBook={onBook} />);
    
    fireEvent.click(screen.getByText(/réserver/i));
    expect(onBook).toHaveBeenCalledWith('1');
  });
});

describe('EventService', () => {
  const service = EventService.getInstance();

  it('devrait récupérer les événements à venir', async () => {
    const events = await service.getUpcomingEvents();
    expect(Array.isArray(events)).toBe(true);
  });

  it('devrait créer une réservation d\'événement', async () => {
    const booking = await service.bookEvent('1', 'user-123', 4);
    expect(booking).toHaveProperty('id');
    expect(booking.status).toBe('pending');
  });

  it('devrait empêcher les réservations dépassant la capacité', async () => {
    await expect(
      service.bookEvent('1', 'user-123', 100)
    ).rejects.toThrow('Capacité insuffisante');
  });
});