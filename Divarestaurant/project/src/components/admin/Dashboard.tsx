import React, { useState } from 'react';
import { Users, Calendar, Settings, FileText, Image, Bell, Cog, Video, UtensilsCrossed, BarChart, HelpCircle } from 'lucide-react';
import { Statistics } from './Statistics';
import { Calendar as EventCalendar } from './Calendar';
import { ReservationManager } from './ReservationManager';
import { QualityDashboard } from './QualityDashboard';
import { AutomationDashboard } from './automation/AutomationDashboard';
import { AutomationSettings } from './automation/AutomationSettings';
import { AutomationLogs } from './automation/AutomationLogs';
import { UserManagement } from './UserManagement';
import { ContentManager } from './ContentManager';
import { MediaLibrary } from './MediaLibrary';
import { VideoLibrary } from './VideoLibrary';
import { NotificationCenter } from './NotificationCenter';
import { LoyaltyProgram } from './crm/LoyaltyProgram';
import { CustomerDashboard } from './crm/CustomerDashboard';
import { MarketingAutomation } from './crm/MarketingAutomation';
import { MenuManager } from './MenuManager';
import { InventoryManager } from './inventory/InventoryManager';
import { HelpPage } from './HelpPage';
import { RoadmapPage } from './RoadmapPage';
import { StatusPage } from './StatusPage';
import { NotificationBell } from '../NotificationBell';

export function Dashboard() {
  const [currentSection, setCurrentSection] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart },
    { id: 'roadmap', label: 'Roadmap', icon: Calendar },
    { id: 'status', label: 'Statut', icon: Settings },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'menus', label: 'Menus', icon: UtensilsCrossed },
    { id: 'inventory', label: 'Stocks', icon: Settings },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'media', label: 'Médiathèque', icon: Image },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'automation', label: 'Automatisation', icon: Cog },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'quality', label: 'Qualité', icon: Settings },
    { id: 'loyalty', label: 'Fidélité', icon: Users },
    { id: 'help', label: 'Mode d\'emploi', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      {/* Header */}
      <header className="bg-admin-card border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo-white.svg" 
                alt="Diva Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const wineIcon = document.createElement('div');
                  wineIcon.innerHTML = '<div class="h-12 w-12 flex items-center justify-center"><svg class="text-gold" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg></div>';
                  e.currentTarget.parentNode?.appendChild(wineIcon.firstChild as Node);
                }}
              />
              <h1 className="text-3xl font-serif text-gold">Administration</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <a 
                href="/"
                className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
              >
                Retour au site
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    currentSection === item.id
                      ? 'bg-gold text-black'
                      : 'text-admin-text-secondary hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-10">
            {currentSection === 'overview' && <Statistics />}
            {currentSection === 'roadmap' && <RoadmapPage />}
            {currentSection === 'status' && <StatusPage />}
            {currentSection === 'reservations' && <ReservationManager />}
            {currentSection === 'menus' && <MenuManager />}
            {currentSection === 'inventory' && <InventoryManager />}
            {currentSection === 'quality' && <QualityDashboard />}
            {currentSection === 'automation' && (
              <div className="space-y-6">
                <AutomationDashboard />
                <AutomationSettings />
                <AutomationLogs />
              </div>
            )}
            {currentSection === 'users' && <UserManagement />}
            {currentSection === 'content' && <ContentManager />}
            {currentSection === 'media' && <MediaLibrary />}
            {currentSection === 'videos' && <VideoLibrary />}
            {currentSection === 'notifications' && <NotificationCenter />}
            {currentSection === 'loyalty' && <LoyaltyProgram />}
            {currentSection === 'crm' && <CustomerDashboard />}
            {currentSection === 'marketing' && <MarketingAutomation />}
            {currentSection === 'help' && <HelpPage />}
          </div>
        </div>
      </div>
    </div>
  );
}