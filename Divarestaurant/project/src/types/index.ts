export interface Show {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string;
  artist?: string;
  isSpecialEvent: boolean;
  price: number;
  availableSeats: number;
}

export interface ShowTime {
  id: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  isSpecialEvent?: boolean;
  specialEventName?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVegetarian: boolean;
  allergens?: string[];
}

export interface Reservation {
  id: string;
  showTimeId: string;
  numberOfGuests: number;
  selectedMenuIds: string[];
  specialRequests?: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}