import React from 'react';
import { usePayment } from '../../lib/payment/hooks';
import { PAYMENT_CONFIG } from '../../lib/payment/config';
import { AlertCircle, Lock } from 'lucide-react';

interface PaymentStepProps {
  totalAmount: number;
  onPaymentComplete: () => void;
}

export function PaymentStep({ totalAmount, onPaymentComplete }: PaymentStepProps) {
  const { isProcessing, error, handlePayment, calculateDeposit } = usePayment();
  const depositAmount = calculateDeposit(totalAmount);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-serif text-xl mb-4">Récapitulatif du paiement</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total de la réservation</span>
            <span className="font-medium">{totalAmount}€</span>
          </div>
          
          <div className="flex justify-between font-medium">
            <span className="text-gray-600">Acompte à verser ({PAYMENT_CONFIG.DEPOSIT_PERCENTAGE}%)</span>
            <span className="text-xl font-serif">{depositAmount}€</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-blue-500 shrink-0" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Politique d'annulation</p>
          <p>Annulation gratuite jusqu'à {PAYMENT_CONFIG.CANCELLATION_HOURS}h avant l'événement. 
             Au-delà, {PAYMENT_CONFIG.CANCELLATION_FEE_PERCENTAGE}% du montant total sera retenu.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-gold focus:ring-gold"
            required
          />
          <span className="text-sm text-gray-600">
            J'accepte les conditions d'annulation et de réservation
          </span>
        </label>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          onClick={onPaymentComplete}
          disabled={isProcessing}
          className="w-full bg-gold text-black py-3 rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
        >
          <Lock size={20} />
          {isProcessing ? 'Traitement en cours...' : 'Payer l\'acompte sécurisé'}
        </button>
      </div>
    </div>
  );
}