import React from 'react';
import { Version } from '../../types/changelog';
import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';
import { ChangeSection } from './ChangeSection';

interface ChangelogDetailsProps {
  version: Version | null;
}

export function ChangelogDetails({ version }: ChangelogDetailsProps) {
  if (!version) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Sélectionnez une version pour voir les détails
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-serif">Version {version.number}</h2>
          <Badge variant={version.status === 'stable' ? 'success' : 'warning'}>
            {version.status}
          </Badge>
        </div>
        <p className="text-gray-600">
          Publié le {formatDate(version.date)}
        </p>
        {version.title && (
          <p className="text-lg text-gray-700 mt-2">{version.title}</p>
        )}
      </div>

      {version.sections.map((section, index) => (
        <ChangeSection key={index} section={section} />
      ))}
    </div>
  );
}