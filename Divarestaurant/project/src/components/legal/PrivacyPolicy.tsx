import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Shield className="text-gold" size={32} />
          <h1 className="text-4xl md:text-5xl font-serif text-white">Politique de Confidentialité</h1>
        </div>
        
        <div className="prose prose-invert prose-gold max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">1. Collecte des données</h2>
            <p className="text-gray-300">
              Nous collectons les informations que vous nous fournissez directement lors de vos réservations,
              notamment : nom, prénom, adresse email, numéro de téléphone et préférences de réservation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">2. Utilisation des données</h2>
            <p className="text-gray-300">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2">
              <li>Gérer vos réservations</li>
              <li>Vous envoyer des confirmations</li>
              <li>Personnaliser votre expérience</li>
              <li>Vous informer de nos offres spéciales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">3. Protection des données</h2>
            <p className="text-gray-300">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données
              personnelles contre tout accès, modification, divulgation ou destruction non autorisée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-gold mb-4">4. Vos droits</h2>
            <p className="text-gray-300">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gold mb-4">5. Contact</h2>
            <p className="text-gray-300">
              Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits,
              contactez notre délégué à la protection des données à : privacy@diva-restaurant.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}