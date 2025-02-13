import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ConfirmationProps {
  formData: {
    date: string;
    time: string;
    guests: number;
    menuSelection: string[];
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  onSubmit: () => void;
}

export function Confirmation({ formData, onSubmit }: ConfirmationProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-serif text-xl mb-4">Récapitulatif de votre réservation</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{new Date(formData.date).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Horaire</span>
            <span className="font-medium">{formData.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre d'invités</span>
            <span className="font-medium">{formData.guests}</span>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total estimé</span>
              <span className="font-serif text-xl">
                {formData.guests * 85}€
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gold/10 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-gold shrink-0" size={20} />
        <p className="text-sm">
          Un acompte de 30% sera demandé pour confirmer votre réservation. 
          Annulation gratuite jusqu'à 48h avant l'événement.
        </p>
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-gold text-black py-3 rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
      >
        <Check size={20} />
        Confirmer la réservation
      </button>
    </div>
  );
}