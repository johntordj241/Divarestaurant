import React, { useState } from 'react';
import { Calendar, Clock, Users, UtensilsCrossed } from 'lucide-react';
import { DateSelection } from './DateSelection';
import { MenuSelection } from './MenuSelection';
import { CustomerForm } from './CustomerForm';
import { Confirmation } from './Confirmation';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs selon l'étape
    switch (step) {
      case 1:
        if (!formData.date) newErrors.date = 'La date est requise';
        if (!formData.time) newErrors.time = "L'heure est requise";
        if (!formData.guests || formData.guests < 1) newErrors.guests = 'Nombre de convives invalide';
        break;
      case 2:
        if (formData.menuSelection.length === 0) newErrors.menu = 'Veuillez sélectionner au moins un menu';
        break;
      case 3:
        if (!formData.name) newErrors.name = 'Le nom est requis';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email invalide';
        }
        if (!formData.phone || !/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Numéro de téléphone invalide';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Effacer les erreurs des champs mis à jour
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // TODO: Implement API call
        console.log('Form submitted:', formData);
        // Simuler une réussite
        alert('Réservation confirmée ! Vous recevrez un email de confirmation.');
      } catch (error) {
        setErrors({ submit: 'Une erreur est survenue lors de la réservation' });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
      {/* Stepper */}
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

      {/* Affichage des erreurs globales */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.submit}
        </div>
      )}

      {/* Contenu du formulaire selon l'étape */}
      <div className="mb-8">
        {step === 1 && (
          <DateSelection
            date={formData.date}
            time={formData.time}
            guests={formData.guests}
            onDateChange={(date) => updateFormData({ date })}
            onTimeChange={(time) => updateFormData({ time })}
            onGuestsChange={(guests) => updateFormData({ guests })}
          />
        )}
        {step === 2 && (
          <MenuSelection
            selectedMenus={formData.menuSelection}
            onMenuSelect={(menuSelection) => updateFormData({ menuSelection })}
          />
        )}
        {step === 3 && (
          <CustomerForm
            formData={formData}
            onChange={updateFormData}
          />
        )}
        {step === 4 && (
          <Confirmation
            formData={formData}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Affichage des erreurs spécifiques */}
      {Object.entries(errors).map(([field, message]) => (
        field !== 'submit' && (
          <div key={field} className="mb-4 text-sm text-red-600">
            {message}
          </div>
        )
      ))}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
          )}
          <button
            onClick={handleNext}
            className="ml-auto px-6 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
          >
            {step === 3 ? 'Confirmer' : 'Continuer'}
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ number, title, active, completed, icon }: { 
  number: number; 
  title: string; 
  active: boolean; 
  completed: boolean;
  icon: React.ReactNode;
}) {
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