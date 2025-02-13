import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight, Users, Star } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  features: {
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'planned';
  }[];
  team?: string[];
  risks?: string[];
  dependencies?: string[];
}

const ROADMAP_DATA: Milestone[] = [
  {
    id: 'v1',
    title: 'Version 1.0 - Lancement Initial',
    description: 'Fonctionnalités de base du restaurant-cabaret',
    date: 'Q1 2024',
    status: 'completed',
    features: [
      {
        title: 'Système de réservation',
        description: 'Réservation en ligne avec paiement sécurisé',
        status: 'completed'
      },
      {
        title: 'Gestion des menus',
        description: 'Interface d\'administration des menus et cartes',
        status: 'completed'
      },
      {
        title: 'Authentification',
        description: 'Système de connexion sécurisé',
        status: 'completed'
      }
    ],
    team: ['Équipe Frontend', 'Équipe Backend']
  },
  {
    id: 'v2',
    title: 'Version 1.1 - Gestion des Médias',
    description: 'Système complet de gestion des médias',
    date: 'Q2 2024',
    status: 'in-progress',
    features: [
      {
        title: 'Interface d\'administration',
        description: 'Dashboard pour la gestion des médias',
        status: 'completed'
      },
      {
        title: 'Optimisation des médias',
        description: 'Compression et redimensionnement automatique',
        status: 'completed'
      },
      {
        title: 'Galerie publique',
        description: 'Interface publique pour visualiser les médias',
        status: 'in-progress'
      },
      {
        title: 'Filtres avancés',
        description: 'Système de recherche et filtrage des médias',
        status: 'in-progress'
      }
    ],
    team: ['Équipe Frontend', 'Équipe Backend'],
    risks: [
      'Performance avec un grand nombre de médias',
      'Compatibilité des formats vidéo sur différents navigateurs'
    ],
    dependencies: [
      'Optimisation du stockage Supabase',
      'CDN pour la distribution des médias'
    ]
  },
  {
    id: 'v3',
    title: 'Version 1.2 - Expérience Utilisateur',
    description: 'Amélioration de l\'expérience client',
    date: 'Q3 2024',
    status: 'planned',
    features: [
      {
        title: 'Programme de fidélité',
        description: 'Système de points et avantages membres',
        status: 'planned'
      },
      {
        title: 'Notifications en temps réel',
        description: 'Alertes et mises à jour instantanées',
        status: 'planned'
      },
      {
        title: 'Application mobile',
        description: 'Version mobile native de l\'application',
        status: 'planned'
      }
    ],
    team: ['Équipe Mobile', 'Équipe Backend'],
    dependencies: [
      'API de notifications',
      'Infrastructure mobile'
    ]
  },
  {
    id: 'v4',
    title: 'Version 1.3 - Automatisation',
    description: 'Automatisation des processus',
    date: 'Q4 2024',
    status: 'planned',
    features: [
      {
        title: 'Marketing automatisé',
        description: 'Campagnes email et SMS automatiques',
        status: 'planned'
      },
      {
        title: 'Gestion des stocks',
        description: 'Suivi et commandes automatiques',
        status: 'planned'
      },
      {
        title: 'Rapports analytiques',
        description: 'Tableaux de bord et insights',
        status: 'planned'
      }
    ],
    team: ['Équipe Data', 'Équipe Marketing'],
    dependencies: [
      'Intégration CRM',
      'Base de données analytique'
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'in-progress': return Clock;
    case 'planned': return Star;
    default: return AlertTriangle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400';
    case 'in-progress': return 'text-gold';
    case 'planned': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};

export function RoadmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8 text-white">Roadmap</h1>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gold/30" />

        <div className="space-y-12">
          {ROADMAP_DATA.map((milestone) => {
            const StatusIcon = getStatusIcon(milestone.status);
            return (
              <div key={milestone.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className={`absolute left-7 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                  milestone.status === 'completed' ? 'bg-green-500 border-green-500' :
                  milestone.status === 'in-progress' ? 'bg-gold border-gold' :
                  'bg-blue-500 border-blue-500'
                }`} />

                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={getStatusColor(milestone.status)} size={24} />
                        <h2 className="text-2xl font-serif text-gold">{milestone.title}</h2>
                      </div>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
                      <Calendar size={16} className="text-white" />
                      <span className="text-white">{milestone.date}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Fonctionnalités</h3>
                      <div className="space-y-4">
                        {milestone.features.map((feature, idx) => {
                          const FeatureIcon = getStatusIcon(feature.status);
                          return (
                            <div key={idx} className="bg-gray-700/50 p-4 rounded-lg">
                              <div className="flex items-start gap-3">
                                <FeatureIcon className={getStatusColor(feature.status)} size={20} />
                                <div>
                                  <h4 className="font-medium text-white">{feature.title}</h4>
                                  <p className="text-sm text-gray-300">{feature.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {milestone.team && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Équipe</h3>
                          <div className="flex flex-wrap gap-2">
                            {milestone.team.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
                                <Users size={16} className="text-gold" />
                                <span className="text-white">{member}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.risks && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Risques Identifiés</h3>
                          <div className="space-y-2">
                            {milestone.risks.map((risk, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-red-400">
                                <AlertTriangle size={16} />
                                <span>{risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.dependencies && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Dépendances</h3>
                          <div className="space-y-2">
                            {milestone.dependencies.map((dep, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-blue-400">
                                <ArrowRight size={16} />
                                <span>{dep}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}