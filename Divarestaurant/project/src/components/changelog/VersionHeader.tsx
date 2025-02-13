import React from 'react';
import { Version } from '../../types/changelog';
import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';
import { Calendar, Tag } from 'lucide-react';

interface VersionHeaderProps {
  version: Version;
}

export function VersionHeader({ version }: VersionHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-serif">Version {version.number}</h2>
            <Badge variant={version.status === 'stable' ? 'success' : 'warning'}>
              {version.status}
            </Badge>
          </div>
          {version.title && (
            <p className="text-lg text-gray-700">{version.title}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(version.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>{version.sections.length} sections</span>
          </div>
        </div>
      </div>
    </div>
  );
}