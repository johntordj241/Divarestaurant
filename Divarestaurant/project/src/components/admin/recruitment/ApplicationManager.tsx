import React, { useState, useEffect } from 'react';
import { User, Calendar, Star, Download, Search, Filter, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: string;
  portfolio: string;
  availability: string;
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  submitted_at: string;
}

export function ApplicationManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    specialty: 'all',
    search: ''
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    const matchesSpecialty = filters.specialty === 'all' || app.specialty === filters.specialty;
    const matchesSearch = filters.search === '' || 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.email.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSpecialty && matchesSearch;
  });

  const exportApplications = () => {
    const csv = [
      ['Nom', 'Prénom', 'Email', 'Téléphone', 'Spécialité', 'Statut', 'Date de candidature'].join(','),
      ...filteredApplications.map(app => [
        app.lastName,
        app.firstName,
        app.email,
        app.phone,
        app.specialty,
        app.status,
        new Date(app.submitted_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidatures_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Candidatures</h2>
        <button
          onClick={exportApplications}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90"
        >
          <Download size={20} />
          Exporter
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un candidat..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="reviewed">En cours d'examen</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Refusé</option>
          </select>

          <select
            value={filters.specialty}
            onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Toutes les spécialités</option>
            <option value="dance">Danse</option>
            <option value="singing">Chant</option>
            <option value="music">Musique</option>
            <option value="performance">Performance</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-3" size={20} />
                      <div>
                        <div className="font-medium">{application.firstName} {application.lastName}</div>
                        <div className="text-sm text-gray-500">{application.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {application.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{application.email}</div>
                      <div className="text-gray-500">{application.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(application.submitted_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value as Application['status'])}
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">En attente</option>
                      <option value="reviewed">En cours d'examen</option>
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Refusé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => window.open(application.portfolio, '_blank')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir portfolio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}