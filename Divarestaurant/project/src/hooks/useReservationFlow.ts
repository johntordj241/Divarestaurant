import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { usePayment } from '../lib/payment/hooks';
import { sendConfirmationEmail } from '../lib/notifications/service';

interface ReservationData {
  date: string;
  time: string;
  numberOfGuests: number;
  tableId: string | null;
  menuIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

export function useReservationFlow() {
  const [step, setStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData>({
    date: '',
    time: '',
    numberOfGuests: 2,
    tableId: null,
    menuIds: [],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
  });
  const { handlePayment, calculateDeposit } = usePayment();

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const submitReservation = async () => {
    try {
      // 1. Create reservation in database
      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert({
          show_time_id: `${reservationData.date}T${reservationData.time}`,
          customer_id: (await supabase.auth.getUser()).data.user?.id,
          number_of_guests: reservationData.numberOfGuests,
          selected_menu_ids: reservationData.menuIds,
          special_requests: reservationData.specialRequests,
          total_price: calculateTotalPrice(),
          payment_status: 'pending',
          reservation_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Process payment
      await handlePayment(calculateDeposit(calculateTotalPrice()), 'payment_method_id');

      // 3. Send confirmation email
      await sendConfirmationEmail(reservation);

      return reservation;
    } catch (error) {
      console.error('Reservation failed:', error);
      throw error;
    }
  };

  const calculateTotalPrice = () => {
    // Implement price calculation based on menus and number of guests
    return 0; // Placeholder
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return reservationData.date && reservationData.time && reservationData.numberOfGuests > 0;
      case 2:
        return reservationData.tableId !== null;
      case 3:
        return reservationData.menuIds.length > 0;
      case 4:
        return (
          reservationData.customerName &&
          reservationData.customerEmail &&
          reservationData.customerPhone
        );
      default:
        return false;
    }
  };

  return {
    step,
    setStep,
    reservationData,
    updateReservationData,
    submitReservation,
    canProceed,
  };
}