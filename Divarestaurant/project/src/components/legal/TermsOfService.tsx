import React from 'react';
import { FileText } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <FileText className="text-gold" size={32} />
          <h1 className="text-4xl md:text-5xl font-serif text-white">Conditions Générales</h1>
        </div>
        
        <div className="prose prose-invert prose-gold max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">1. Réservations</h2>
            <p className="text-gray-300">
              La réservation n'est confirmée qu'après versement d'un acompte de 30% du montant total.
              Le solde sera réglé le jour de votre venue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">2. Annulations</h2>
            <p className="text-gray-300">
              Toute annulation doit être effectuée au moins 48 heures avant la date de réservation.
              En cas d'annulation tardive, l'acompte sera conservé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">3. Dress Code</h2>
            <p className="text-gray-300">
              Une tenue élégante est exigée. Nous nous réservons le droit de refuser l'accès
              aux personnes ne respectant pas cette condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">4. Paiement</h2>
            <p className="text-gray-300">
              Nous acceptons les cartes de crédit (Visa, Mastercard, American Express)
              et les espèces. Les chèques ne sont pas acceptés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gold mb-4">5. Responsabilité</h2>
            <p className="text-gray-300">
              La direction se réserve le droit de refuser l'accès ou d'exclure toute personne
              dont le comportement serait jugé inapproprié.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}