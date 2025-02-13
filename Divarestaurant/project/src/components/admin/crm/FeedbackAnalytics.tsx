import React from 'react';
import { Star, TrendingUp, MessageSquare } from 'lucide-react';

export function FeedbackAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Analyse des Retours Clients</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-gold" />
            <div>
              <h3 className="text-lg font-medium">Note Globale</h3>
              <p className="text-sm text-gray-600">30 derniers jours</p>
            </div>
          </div>
          <div className="text-3xl font-serif flex items-center gap-2">
            4.8
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-gold" />
            <div>
              <h3 className="text-lg font-medium">Avis Reçus</h3>
              <p className="text-sm text-gray-600">Ce mois</p>
            </div>
          </div>
          <p className="text-3xl font-serif">156</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-gold" />
            <div>
              <h3 className="text-lg font-medium">Taux de Réponse</h3>
              <p className="text-sm text-gray-600">Aux avis clients</p>
            </div>
          </div>
          <p className="text-3xl font-serif">98%</p>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Distribution des Notes</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-4">
              <div className="w-12 text-right">{rating} ★</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gold" 
                  style={{ 
                    width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 3 : rating === 2 ? 1 : 1}%` 
                  }} 
                />
              </div>
              <div className="w-12">
                {rating === 5 ? '75%' : rating === 4 ? '20%' : rating === 3 ? '3%' : rating === 2 ? '1%' : '1%'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers commentaires */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Derniers Commentaires</h3>
        <div className="space-y-4">
          {[
            {
              name: 'Sophie Martin',
              rating: 5,
              comment: 'Une soirée exceptionnelle ! Le service était impeccable.',
              date: '2024-01-15'
            },
            {
              name: 'Jean Dupont',
              rating: 4,
              comment: 'Très bon moment, ambiance au top. Petit bémol sur l\'attente.',
              date: '2024-01-14'
            }
          ].map((review, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.name}</p>
                  <div className="flex text-gold">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}