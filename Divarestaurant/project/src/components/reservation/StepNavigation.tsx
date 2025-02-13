import React from 'react';

interface StepNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  showBack: boolean;
  nextLabel?: string;
}

export function StepNavigation({
  onBack,
  onNext,
  canProceed,
  showBack,
  nextLabel = 'Continuer'
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {showBack && (
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`ml-auto px-6 py-2 rounded-md transition-colors ${
          canProceed
            ? 'bg-gold text-black hover:bg-gold/90'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}