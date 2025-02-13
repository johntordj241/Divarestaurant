export interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  imageUrl: string;
  benefits: string[];
  isVIP?: boolean;
  minimumPartySize?: number;
  dresscode?: string;
}

export interface EventBooking {
  id: string;
  eventId: string;
  userId: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}