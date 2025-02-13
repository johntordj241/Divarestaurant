import React, { useState } from 'react';
import { Calendar, Clock, Users, UtensilsCrossed } from 'lucide-react';
import { DateSelection } from './reservation/DateSelection';
import { MenuSelection } from './reservation/MenuSelection';
import { CustomerForm } from './reservation/CustomerForm';
import { Confirmation } from './reservation/Confirmation';

export function ReservationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    menuSelection: [] as string[],
    specialRequests: '',
    name: '',
    email: '',
    phone: ''
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      // Validation des champs requis
      if (!formData.date || !formData.time || !formData.guests || !formData.name || 
          !formData.email || !formData.phone || formData.menuSelection.length === 0) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Validation du numéro de téléphone
      const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        throw new Error('Veuillez entrer un numéro de téléphone valide');
      }

      // TODO: Implement API call to save reservation
      console.log('Submitting reservation:', formData);
      // Simuler une réussite
      alert('Réservation confirmée ! Vous recevrez un email de confirmation.');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return formData.date && formData.time && formData.guests > 0;
      case 2:
        return formData.menuSelection.length > 0;
      case 3:
        return formData.name && formData.email && formData.phone;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <DateSelection
            date={formData.date}
            time={formData.time}
            guests={formData.guests}
            onDateChange={(date) => updateFormData({ date })}
            onTimeChange={(time) => updateFormData({ time })}
            onGuestsChange={(guests) => updateFormData({ guests })}
          />
        );
      case 2:
        return (
          <MenuSelection
            selectedMenus={formData.menuSelection}
            onMenuSelect={(menuSelection) => updateFormData({ menuSelection })}
          />
        );
      case 3:
        return (
          <CustomerForm
            formData={formData}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <Confirmation
            formData={formData}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between mb-8">
        <Step 
          number={1} 
          title="Date & Invités" 
          active={step === 1} 
          completed={step > 1}
          icon={<Calendar size={20} />}
        />
        <Step 
          number={2} 
          title="Menu" 
          active={step === 2} 
          completed={step > 2}
          icon={<UtensilsCrossed size={20} />}
        />
        <Step 
          number={3} 
          title="Coordonnées" 
          active={step === 3} 
          completed={step > 3}
          icon={<Users size={20} />}
        />
        <Step 
          number={4} 
          title="Confirmation" 
          active={step === 4} 
          completed={step > 4}
          icon={<Clock size={20} />}
        />
      </div>

      <div className="mb-8">
        {renderStepContent()}
      </div>

      {step < 4 && (
        <div className="flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
          )}
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canContinue()}
            className={`ml-auto px-6 py-2 rounded-md transition-colors ${
              canContinue()
                ? 'bg-gold text-black hover:bg-gold/90'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === 3 ? 'Confirmer' : 'Continuer'}
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ number, title, active, completed, icon }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          active
            ? 'bg-gold text-black'
            : completed
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {icon}
      </div>
      <span className="text-sm text-gray-600">{title}</span>
    </div>
  );
}