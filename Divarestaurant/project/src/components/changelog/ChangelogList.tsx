import React from 'react';
import { Version } from '../../types/changelog';
import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';

interface ChangelogListProps {
  versions: Version[];
  onVersionSelect: (version: Version) => void;
}

export function ChangelogList({ versions, onVersionSelect }: ChangelogListProps) {
  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <button
          key={version.id}
          onClick={() => onVersionSelect(version)}
          className="w-full text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-serif">Version {version.number}</h3>
            <Badge variant={version.status === 'stable' ? 'success' : 'warning'}>
              {version.status}
            </Badge>
          </div>
          
          {version.title && (
            <p className="text-gray-700 mb-2">{version.title}</p>
          )}
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatDate(version.date)}</span>
            <span>{version.sections.length} changements</span>
          </div>
        </button>
      ))}
    </div>
  );
}