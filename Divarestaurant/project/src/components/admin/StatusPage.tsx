import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, Users, Calendar } from 'lucide-react';
import { MonitoringDashboard } from './monitoring/MonitoringDashboard';
import { PerformanceMetrics } from './monitoring/PerformanceMetrics';
import { AlertsConfig } from './monitoring/AlertsConfig';

interface Task {
  id: string;
  task: string;
  date?: string;
  deadline?: string;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
  assignedTo?: string;
  category?: string;
  estimatedTime?: string;
  dependencies?: string[];
}

interface ProjectSection {
  id: string;
  title: string;
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
  completed: Task[];
  remaining: Task[];
  risks?: string[];
  dependencies?: string[];
}

const initialSections: ProjectSection[] = [
  {
    id: 'media',
    title: "Gestion des Médias",
    progress: 75,
    description: "Système de gestion des photos et vidéos",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    completed: [
      {
        id: 'media-1',
        task: "Upload de fichiers médias",
        date: "2024-01-15",
        description: "Système d'upload sécurisé avec validation des types",
        category: "Backend",
        estimatedTime: "16h",
        assignedTo: "Équipe Backend"
      },
      {
        id: 'media-2',
        task: "Optimisation des images",
        date: "2024-01-20",
        description: "Compression et redimensionnement automatique",
        category: "Backend",
        estimatedTime: "24h",
        assignedTo: "Équipe Backend"
      },
      {
        id: 'media-3',
        task: "Interface d'administration",
        date: "2024-01-25",
        description: "Dashboard pour la gestion des médias",
        category: "Frontend",
        estimatedTime: "32h",
        assignedTo: "Équipe Frontend"
      },
      {
        id: 'media-4',
        task: "Compression vidéo",
        date: "2024-01-30",
        description: "Intégration FFmpeg pour l'optimisation vidéo",
        category: "Backend",
        estimatedTime: "40h",
        assignedTo: "Équipe Backend"
      }
    ],
    remaining: [
      {
        id: 'media-5',
        task: "Galerie publique interactive",
        deadline: "2024-02-15",
        priority: "high",
        description: "Interface publique pour visualiser les médias",
        category: "Frontend",
        estimatedTime: "40h",
        assignedTo: "Équipe Frontend"
      },
      {
        id: 'media-6',
        task: "Filtres de recherche avancés",
        deadline: "2024-02-28",
        priority: "medium",
        description: "Système de filtrage et recherche des médias",
        category: "Frontend",
        estimatedTime: "24h",
        assignedTo: "Équipe Frontend"
      },
      {
        id: 'media-7',
        task: "Gestion des métadonnées",
        deadline: "2024-03-15",
        priority: "low",
        description: "Système de tags et métadonnées avancées",
        category: "Backend",
        estimatedTime: "32h",
        assignedTo: "Équipe Backend"
      }
    ],
    risks: [
      "Performance avec un grand nombre de médias",
      "Compatibilité des formats vidéo sur différents navigateurs",
      "Espace de stockage limité"
    ],
    dependencies: [
      "Configuration Supabase Storage",
      "Intégration FFmpeg",
      "CDN pour la distribution des médias"
    ]
  }
];

export function StatusPage() {
  const [sections] = useState<ProjectSection[]>(initialSections);
  const [activeTab, setActiveTab] = useState<'status' | 'monitoring' | 'performance' | 'alerts'>('status');

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8 text-white">Statut du Projet</h1>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'status' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          Statut des tâches
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'monitoring' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          Monitoring
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'performance' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'alerts' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          Alertes
        </button>
      </div>

      {/* Contenu */}
      {activeTab === 'status' && (
        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.id} className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-serif mb-2 text-gold">{section.title}</h2>
                    <p className="text-gray-300">{section.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold rounded-full transition-all duration-500"
                          style={{ width: `${section.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">{section.progress}%</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Début: {section.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>Fin: {section.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {(section.risks || section.dependencies) && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {section.risks && (
                      <div className="bg-red-500/5 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-red-400 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          Risques Identifiés
                        </h4>
                        <ul className="space-y-1">
                          {section.risks.map((risk, index) => (
                            <li key={index} className="text-sm text-gray-300">• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {section.dependencies && (
                      <div className="bg-blue-500/5 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-blue-400 flex items-center gap-2">
                          <ArrowRight size={16} />
                          Dépendances
                        </h4>
                        <ul className="space-y-1">
                          {section.dependencies.map((dep, index) => (
                            <li key={index} className="text-sm text-gray-300">• {dep}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-green-400 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Tâches complétées
                  </h3>
                  <ul className="space-y-4">
                    {section.completed.map(task => (
                      <li key={task.id} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{task.task}</h4>
                          <span className="text-sm px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{task.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Terminé le: {task.date}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {section.remaining.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-yellow-400 flex items-center gap-2">
                      <Clock size={20} />
                      Tâches à faire
                    </h3>
                    <ul className="space-y-4">
                      {section.remaining.map(task => (
                        <li key={task.id} className="bg-white/5 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white">{task.task}</h4>
                            <span className={`text-sm px-2 py-1 bg-gray-700 rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority || 'normal'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span>{task.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{task.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>Deadline: {task.deadline}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ArrowRight size={14} />
                              <span>{task.category}</span>
                 </div>
                          </div>
                          {task.dependencies && task.dependencies.length > 0 && (
                            <div className="mt-2 text-sm">
                              <p className="text-gray-400">Dépendances:</p>
                              <ul className="list-disc list-inside text-gray-300">
                                {task.dependencies.map((dep, index) => (
                                  <li key={index}>{dep}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'monitoring' && <MonitoringDashboard />}
      {activeTab === 'performance' && <PerformanceMetrics />}
      {activeTab === 'alerts' && <AlertsConfig />}
    </div>
  );
}