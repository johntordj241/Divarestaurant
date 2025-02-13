import React from 'react';
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react';

interface Version {
  id: string;
  number: string;
  date: string;
  content: string;
  changes: {
    type: 'added' | 'removed' | 'modified';
    path: string;
    before?: string;
    after?: string;
  }[];
}

interface VersionCompareProps {
  oldVersion: Version;
  newVersion: Version;
  onClose: () => void;
}

export function VersionCompare({ oldVersion, newVersion, onClose }: VersionCompareProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <ArrowLeft size={24} />
            </button>
            <h3 className="text-lg font-medium">
              Comparaison des versions {oldVersion.number} → {newVersion.number}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 h-full divide-x">
            {/* Version précédente */}
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-medium flex items-center gap-2">
                  <Minus className="text-red-500" size={20} />
                  Version {oldVersion.number}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(oldVersion.date).toLocaleString('fr-FR')}
                </p>
              </div>
              
              <div className="space-y-6">
                {oldVersion.changes.map((change, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${
                      change.type === 'removed' 
                        ? 'bg-red-50' 
                        : change.type === 'modified'
                        ? 'bg-yellow-50'
                        : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">{change.path}</p>
                    <pre className="text-sm whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                      {change.before || change.after}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Nouvelle version */}
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="text-green-500" size={20} />
                  Version {newVersion.number}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(newVersion.date).toLocaleString('fr-FR')}
                </p>
              </div>
              
              <div className="space-y-6">
                {newVersion.changes.map((change, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${
                      change.type === 'added' 
                        ? 'bg-green-50' 
                        : change.type === 'modified'
                        ? 'bg-yellow-50'
                        : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">{change.path}</p>
                    <pre className="text-sm whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                      {change.after || change.before}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-100 rounded-full" />
              <span className="text-sm text-gray-600">Supprimé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-100 rounded-full" />
              <span className="text-sm text-gray-600">Ajouté</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-100 rounded-full" />
              <span className="text-sm text-gray-600">Modifié</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}