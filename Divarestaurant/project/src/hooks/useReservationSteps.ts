import { useMemo } from 'react';
import { ReservationStep, ReservationData } from '../types/reservation';
import { Calendar, Table as TableIcon, UtensilsCrossed, Users, CreditCard } from 'lucide-react';
import {
  validateDateSelection,
  validateTableSelection,
  validateMenuSelection,
  validateCustomerInfo,
  validatePayment
} from '../utils/validation';

export function useReservationSteps(currentStep: number, data: ReservationData) {
  const steps: ReservationStep[] = useMemo(() => [
    {
      id: 1,
      title: 'Date & Invités',
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
      validate: validateDateSelection,
      icon: Calendar
    },
    {
      id: 2,
      title: 'Table',
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
      validate: validateTableSelection,
      icon: TableIcon
    },
    {
      id: 3,
      title: 'Menu',
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
      validate: validateMenuSelection,
      icon: UtensilsCrossed
    },
    {
      id: 4,
      title: 'Coordonnées',
      isCompleted: currentStep > 4,
      isActive: currentStep === 4,
      validate: validateCustomerInfo,
      icon: Users
    },
    {
      id: 5,
      title: 'Paiement',
      isCompleted: currentStep > 5,
      isActive: currentStep === 5,
      validate: validatePayment,
      icon: CreditCard
    }
  ], [currentStep]);

  const canProceed = useMemo(() => {
    const currentStepData = steps.find(step => step.id === currentStep);
    return currentStepData?.validate(data) ?? false;
  }, [steps, currentStep, data]);

  return { steps, canProceed };
}