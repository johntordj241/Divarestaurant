export interface ReservationStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  validate: (data: ReservationData) => boolean;
}

export interface ReservationData {
  date: string;
  time: string;
  numberOfGuests: number;
  tableId: string | null;
  menuIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  acceptedTerms: boolean;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';