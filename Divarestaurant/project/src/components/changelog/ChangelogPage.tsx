import React from 'react';
import { useChangelog } from '../../hooks/useChangelog';
import { VersionList } from './VersionList';
import { VersionDetails } from './VersionDetails';

export function ChangelogPage() {
  const { versions, currentVersion, setCurrentVersion, isLoading, error } = useChangelog();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Chargement des mises à jour...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement des mises à jour.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-8">Journal des Modifications</h1>
      
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <VersionList 
            versions={versions}
            currentVersion={currentVersion}
            onVersionSelect={setCurrentVersion}
          />
        </div>
        
        <div className="md:col-span-8">
          <VersionDetails version={currentVersion} />
        </div>
      </div>
    </div>
  );
}