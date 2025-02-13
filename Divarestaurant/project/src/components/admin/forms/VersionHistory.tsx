import React from 'react';
import { History, RotateCcw, Clock, User, FileText } from 'lucide-react';

interface Version {
  id: string;
  number: string;
  date: string;
  author: string;
  changes: string[];
  type: 'content' | 'media' | 'settings';
}

interface VersionHistoryProps {
  versions: Version[];
  onRestore: (version: Version) => void;
  onCompare: (version1: Version, version2: Version) => void;
}

export function VersionHistory({ versions, onRestore, onCompare }: VersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
      return [prev[1], versionId];
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="text-gold" size={24} />
          <h3 className="text-xl font-serif">Historique des versions</h3>
        </div>
        
        {selectedVersions.length === 2 && (
          <button
            onClick={() => onCompare(
              versions.find(v => v.id === selectedVersions[0])!,
              versions.find(v => v.id === selectedVersions[1])!
            )}
            className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
          >
            Comparer les versions
          </button>
        )}
      </div>

      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-4 rounded-lg border transition-colors ${
              selectedVersions.includes(version.id)
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedVersions.includes(version.id)}
                  onChange={() => handleVersionSelect(version.id)}
                  className="mt-1 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-gray-400" />
                    <span className="font-medium">Version {version.number}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      version.type === 'content'
                        ? 'bg-blue-100 text-blue-800'
                        : version.type === 'media'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {version.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(version.date).toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{version.author}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onRestore(version)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <RotateCcw size={16} />
                Restaurer
              </button>
            </div>

            <div className="pl-8">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Modifications</h4>
              <ul className="space-y-1">
                {version.changes.map((change, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}