import { Version } from '../types/changelog';

export function sortVersions(versions: Version[]): Version[] {
  return versions.sort((a, b) => {
    // D'abord par date
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;

    // Ensuite par numéro de version
    const [aMajor, aMinor, aPatch] = a.number.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.number.split('.').map(Number);

    if (bMajor !== aMajor) return bMajor - aMajor;
    if (bMinor !== aMinor) return bMinor - aMinor;
    return (bPatch || 0) - (aPatch || 0);
  });
}

export function getVersionStatus(version: Version): {
  label: string;
  color: string;
} {
  switch (version.status) {
    case 'stable':
      return { label: 'Stable', color: 'text-green-600' };
    case 'beta':
      return { label: 'Bêta', color: 'text-yellow-600' };
    case 'alpha':
      return { label: 'Alpha', color: 'text-red-600' };
    default:
      return { label: 'Inconnu', color: 'text-gray-600' };
  }
}

export function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
  const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

  if (bMajor !== aMajor) return bMajor - aMajor;
  if (bMinor !== aMinor) return bMinor - aMinor;
  return (bPatch || 0) - (aPatch || 0);
}