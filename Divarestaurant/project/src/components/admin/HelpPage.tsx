import React from 'react';
import { FileText, Calendar, Users, UtensilsCrossed, Phone, Clock, Camera, CreditCard, Mail, HelpCircle, Settings, Bell, ChevronRight } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header section */}
        <div className="flex items-center gap-4 mb-8">
          <FileText className="text-gold" size={32} />
          <h1 className="text-3xl font-serif text-gold">Guide d'Administration</h1>
        </div>

        {/* Introduction section */}
        <div className="bg-admin-card rounded-lg p-6 mb-12 border border-white/10">
          <h2 className="text-xl font-medium mb-4">Tableau de Bord Administrateur</h2>
          <p className="text-admin-text-secondary mb-4">
            Ce guide détaille pas à pas toutes les fonctionnalités du tableau de bord administrateur.
            Suivez chaque étape pour une utilisation optimale du système.
          </p>
          <div className="flex items-center gap-2 text-sm text-gold">
            <Phone size={16} />
            <span>Support technique : +33 4 93 00 00 00</span>
          </div>
        </div>

        {/* Variables section */}
        <div className="bg-admin-card p-4 rounded-lg border border-white/10">
          <p className="font-medium text-white">Variables disponibles :</p>
          <ul className="pl-4 mt-2 space-y-1 text-admin-text-secondary">
            <li>• {'{{nom_client}}'} : Nom du client</li>
            <li>• {'{{date_reservation}}'} : Date de la réservation</li>
            <li>• {'{{heure_reservation}}'} : Heure de la réservation</li>
            <li>• {'{{nombre_convives}}'} : Nombre de convives</li>
          </ul>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-8">
          {/* Réservations */}
          <Section
            icon={Calendar}
            title="Gestion des Réservations"
            description="Gérez toutes les réservations du restaurant"
            items={[
              "Vue d'ensemble des réservations",
              "Modification et annulation",
              "Gestion des tables",
              "Historique des modifications"
            ]}
          />

          {/* Menus */}
          <Section
            icon={UtensilsCrossed}
            title="Gestion des Menus"
            description="Administration des menus et cartes"
            items={[
              "Création et modification des menus",
              "Gestion des catégories",
              "Prix et disponibilité",
              "Options spéciales"
            ]}
          />

          {/* Automatisations */}
          <Section
            icon={Settings}
            title="Automatisations"
            description="Configuration des processus automatiques"
            items={[
              "Emails automatiques",
              "Rappels de réservation",
              "Publications réseaux sociaux",
              "Rapports analytiques"
            ]}
          />

          {/* Notifications */}
          <Section
            icon={Bell}
            title="Centre de Notifications"
            description="Gestion des notifications système"
            items={[
              "Configuration des alertes",
              "Modèles de messages",
              "Canaux de communication",
              "Historique des envois"
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ 
  icon: Icon, 
  title, 
  description, 
  items 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="bg-admin-card rounded-lg p-6 border border-white/10">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-gold/10 rounded-lg">
          <Icon className="text-gold" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
          <p className="text-admin-text-secondary">{description}</p>
        </div>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-admin-text">
            <ChevronRight size={16} className="text-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}