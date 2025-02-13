import React, { useState } from 'react';
import { User, Shield, Edit, Trash2, Plus } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'contributor';
  lastLogin: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@diva-restaurant.com',
      role: 'admin',
      lastLogin: '2024-01-10T10:30:00'
    },
    {
      id: '2',
      name: 'Éditeur Menu',
      email: 'menu@diva-restaurant.com',
      role: 'editor',
      lastLogin: '2024-01-09T15:45:00'
    }
  ]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Utilisateurs</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
          <Plus size={20} />
          Nouvel Utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière Connexion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Shield size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}