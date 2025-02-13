import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X, AlertCircle, Filter, Download, Eye } from 'lucide-react';
import { getReservationsByDate, updateReservationStatus, getReservationDetails, exportReservations } from '../../lib/api/reservations';
import { formatDate } from '../../utils/date';
import { ReservationStatus } from '../../types/reservation';

export function ReservationManager() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: undefined as ReservationStatus | undefined,
    minGuests: undefined as number | undefined,
    maxGuests: undefined as number | undefined
  });
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [selectedDate, filters]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservationsByDate(selectedDate, filters);
      setReservations(data);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    try {
      await updateReservationStatus(reservationId, status);
      await loadReservations();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const data = await exportReservations(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      // Créer et télécharger le fichier CSV
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations_${formatDate(new Date())}.csv`;
      a.click();
    } catch (err) {
      setError('Erreur lors de l\'export');
      console.error(err);
    }
  };

  const handleShowDetails = async (reservationId: string) => {
    try {
      const details = await getReservationDetails(reservationId);
      setSelectedReservation(details);
      setShowDetails(true);
    } catch (err) {
      setError('Erreur lors du chargement des détails');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Réservations</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90"
          >
            <Download size={20} />
            Exporter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              status: e.target.value as ReservationStatus || undefined 
            }))}
            className="border rounded-lg px-3 py-1.5"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Users size={20} className="text-gray-400" />
          <input
            type="number"
            placeholder="Min couverts"
            value={filters.minGuests || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              minGuests: e.target.value ? parseInt(e.target.value) : undefined
            }))}
            className="border rounded-lg px-3 py-1.5 w-32"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max couverts"
            value={filters.maxGuests || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              maxGuests: e.target.value ? parseInt(e.target.value) : undefined
            }))}
            className="border rounded-lg px-3 py-1.5 w-32"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
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
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Couverts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Table
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
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400" size={16} />
                      <span>{reservation.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{reservation.customerName}</p>
                      <p className="text-sm text-gray-500">{reservation.customerEmail}</p>
                      <p className="text-sm text-gray-500">{reservation.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400" size={16} />
                      <span>{reservation.numberOfGuests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {reservation.table?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'confirmed' ? 'Confirmé' :
                       reservation.status === 'cancelled' ? 'Annulé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleShowDetails(reservation.id)}
                        className="p-2 text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                            className="p-2 text-green-600 hover:text-green-900"
                            title="Confirmer"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                            className="p-2 text-red-600 hover:text-red-900"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de détails */}
      {showDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-serif">Détails de la Réservation</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Informations Client</h4>
                  <p><span className="text-gray-600">Nom:</span> {selectedReservation.customerName}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedReservation.customerEmail}</p>
                  <p><span className="text-gray-600">Téléphone:</span> {selectedReservation.customerPhone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Détails Réservation</h4>
                  <p><span className="text-gray-600">Date:</span> {formatDate(selectedReservation.date)}</p>
                  <p><span className="text-gray-600">Heure:</span> {selectedReservation.time}</p>
                  <p><span className="text-gray-600">Couverts:</span> {selectedReservation.numberOfGuests}</p>
                  <p><span className="text-gray-600">Table:</span> {selectedReservation.table?.name || '-'}</p>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <h4 className="font-medium mb-2">Demandes Spéciales</h4>
                  <p className="text-gray-600">{selectedReservation.specialRequests}</p>
                </div>
              )}

              {selectedReservation.notes?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="space-y-2">
                    {selectedReservation.notes.map((note: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">{formatDate(note.timestamp)}</p>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Historique des Modifications</h4>
                <div className="space-y-2">
                  {selectedReservation.modification_history?.map((modification: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-600">{formatDate(modification.timestamp)}:</span>{' '}
                      {modification.details}
                      {modification.note && ` - ${modification.note}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function convertToCSV(data: any[]) {
  const headers = [
    'Date',
    'Heure',
    'Client',
    'Email',
    'Téléphone',
    'Couverts',
    'Table',
    'Statut',
    'Demandes Spéciales'
  ];

  const rows = data.map(reservation => [
    reservation.date,
    reservation.time,
    reservation.customerName,
    reservation.customerEmail,
    reservation.customerPhone,
    reservation.numberOfGuests,
    reservation.table?.name || '-',
    reservation.status,
    reservation.specialRequests || ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}