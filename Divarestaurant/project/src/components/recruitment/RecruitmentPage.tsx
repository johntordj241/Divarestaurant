import React from 'react';
import { Star, Music, Users, Sparkles, FileText, Upload } from 'lucide-react';
import { RecruitmentForm } from './RecruitmentForm';

export function RecruitmentPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">REJOIGNEZ-NOUS</h1>
        
        {/* Introduction */}
        <div className="text-center mb-16">
          <p className="text-xl text-gold mb-4">Rejoignez l'univers envoûtant de Diva Restaurant !</p>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Nous recherchons des talents passionnés pour compléter notre équipe. 
            Que vous soyez artiste, professionnel de la restauration ou de l'accueil, 
            venez participer à une expérience unique où gastronomie et spectacle se rencontrent.
          </p>
        </div>

        {/* Profils recherchés */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Users,
              title: 'Service en Salle',
              skills: ['Serveur/Serveuse', 'Barman/Barmaid', 'Runner', 'Chef de rang']
            },
            {
              icon: Star,
              title: 'Cuisine',
              skills: ['Chef de partie', 'Commis', 'Pâtissier', 'Plongeur']
            },
            {
              icon: Music,
              title: 'Artistes',
              skills: ['Danseur/Danseuse', 'Chanteur/Chanteuse', 'Musicien', 'Performeur']
            },
            {
              icon: Sparkles,
              title: 'Accueil',
              skills: ['Hôte/Hôtesse d\'accueil', 'Voiturier', 'Vestiaire']
            },
            {
              icon: Star,
              title: 'Management',
              skills: ['Maître d\'hôtel', 'Chef de cuisine', 'Responsable événementiel']
            },
            {
              icon: Users,
              title: 'Polyvalence',
              skills: ['Formation assurée', 'Évolution possible', 'Flexibilité horaire']
            }
          ].map((profile) => (
            <div key={profile.title} className="bg-white/5 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <profile.icon className="text-gold" size={24} />
                <h3 className="text-xl font-serif text-white">{profile.title}</h3>
              </div>
              <ul className="space-y-2">
                {profile.skills.map((skill) => (
                  <li key={skill} className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Avantages */}
        <div className="bg-white/5 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-serif text-gold mb-6 text-center">Nos Avantages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cadre Prestigieux',
                description: 'Travaillez dans un établissement de renom sur la Côte d\'Azur'
              },
              {
                title: 'Rémunération Attractive',
                description: 'Package compétitif avec primes sur objectifs'
              },
              {
                title: 'Évolution de Carrière',
                description: 'Formation continue et possibilités d\'évolution interne'
              }
            ].map((advantage) => (
              <div key={advantage.title} className="text-center">
                <h3 className="text-xl font-serif text-white mb-2">{advantage.title}</h3>
                <p className="text-gray-300">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire de candidature */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-gold mb-8 text-center">Postuler</h2>
          <div className="bg-white/5 p-8 rounded-lg">
            <RecruitmentForm />
          </div>
        </div>
      </div>
    </div>
  );
}