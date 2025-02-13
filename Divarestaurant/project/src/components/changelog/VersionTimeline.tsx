import React from 'react';
import { Version } from '../../types/changelog';
import { formatDate } from '../../utils/date';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface VersionTimelineProps {
  versions: Version[];
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
}

export function VersionTimeline({ versions, currentVersion, onVersionSelect }: VersionTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'beta':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-6">
        {versions.map((version) => (
          <button
            key={version.id}
            onClick={() => onVersionSelect(version)}
            className={`relative pl-20 py-4 w-full text-left transition-colors ${
              currentVersion?.id === version.id
                ? 'bg-gold/5'
                : 'hover:bg-gray-50'
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-7 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {getStatusIcon(version.status)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">Version {version.number}</h3>
                <span className={`text-sm ${
                  version.status === 'stable' 
                    ? 'text-green-600' 
                    : version.status === 'beta'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {version.status}
                </span>
              </div>
              {version.title && (
                <p className="text-gray-600">{version.title}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(version.date)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}