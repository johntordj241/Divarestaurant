import React, { useState } from 'react';
import { Euro, Users, TrendingUp, BarChart2, Calendar, AlertCircle } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { StatisticsChart } from './statistics/StatisticsChart';
import { OccupancyChart } from './statistics/OccupancyChart';
import { MenuStats } from './statistics/MenuStats';

export function Statistics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const { statistics, isLoading, error } = useStatistics(period);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="shrink-0" />
        <p>Une erreur est survenue lors du chargement des statistiques</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Chiffre d'affaires",
      subtitle: "Ce mois",
      value: `${statistics.revenue.toLocaleString('fr-FR')}€`,
      trend: statistics.revenueComparison,
      icon: Euro
    },
    {
      title: "Couverts",
      subtitle: "Total du mois",
      value: statistics.totalGuests.toLocaleString('fr-FR'),
      info: `Moyenne: ${statistics.averageGuests} par réservation`,
      icon: Users
    },
    {
      title: "Taux de conversion",
      subtitle: "Réservations confirmées",
      value: `${statistics.conversionRate}%`,
      info: `${statistics.reservations} réservations totales`,
      icon: TrendingUp
    },
    {
      title: "Panier moyen",
      subtitle: "Par couvert",
      value: `${statistics.averageTicket}€`,
      trend: statistics.averageTicketComparison,
      icon: BarChart2
    }
  ];

  return (
    <div className="space-y-8">
      {/* Filtres de période */}
      <div className="flex items-center gap-4">
        <Calendar className="text-gray-400" />
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
          className="border rounded-md px-3 py-1.5"
        >
          <option value="day">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <stat.icon className="text-gold" size={24} />
              <div>
                <h3 className="text-lg font-medium">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.subtitle}</p>
              </div>
            </div>
            
            <p className="text-3xl font-serif">{stat.value}</p>
            
            {stat.trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm mt-2 ${
                stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={16} />
                <span>{Math.abs(stat.trend)}% vs mois dernier</span>
              </div>
            )}
            
            {stat.info && (
              <p className="text-sm text-gray-600 mt-2">{stat.info}</p>
            )}
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticsChart data={statistics.chartData} />
        <OccupancyChart data={statistics.occupancyData} />
      </div>

      {/* Statistiques des menus */}
      <MenuStats data={statistics.menuStats} />
    </div>
  );
}