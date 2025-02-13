import React from 'react';
import { Version } from '../../types/changelog';
import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';

interface VersionListProps {
  versions: Version[];
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
}

export function VersionList({ versions, currentVersion, onVersionSelect }: VersionListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium mb-4">Historique des versions</h2>
      
      <div className="space-y-2">
        {versions.map((version) => (
          <button
            key={version.id}
            onClick={() => onVersionSelect(version)}
            className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
              currentVersion?.id === version.id
                ? 'bg-gold/10 text-gold'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Version {version.number}</span>
              <Badge variant={version.status === 'stable' ? 'success' : 'warning'}>
                {version.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {formatDate(version.date)}
              </span>
              <span className="text-gray-500">
                {version.sections.length} changements
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}