export interface VersionSection {
  title: string;
  changes: string[];
}

export interface Version {
  id: string;
  number: string;
  title?: string;
  date: string;
  status: 'stable' | 'beta' | 'alpha';
  sections: VersionSection[];
}

export interface ChangelogState {
  versions: Version[];
  currentVersion: Version | null;
}