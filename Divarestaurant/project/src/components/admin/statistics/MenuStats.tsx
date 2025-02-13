import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface MenuStat {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

interface MenuStatsProps {
  data: MenuStat[];
}

export function MenuStats({ data }: MenuStatsProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <UtensilsCrossed className="text-gold" />
        <h3 className="text-lg font-medium">Performance des menus</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ventes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % du CA total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.count}</div>
                  <div className="text-sm text-gray-500">
                    {Math.round((item.count / totalCount) * 100)}% des ventes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.revenue.toLocaleString('fr-FR')}€</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gold h-2 rounded-full"
                      style={{ width: `${(item.revenue / totalRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Math.round((item.revenue / totalRevenue) * 100)}%
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