import React from 'react';
import { VersionSection } from '../../types/changelog';

interface ChangeSectionProps {
  section: VersionSection;
}

export function ChangeSection({ section }: ChangeSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">{section.title}</h3>
      <ul className="space-y-2">
        {section.changes.map((change, index) => (
          <li 
            key={index}
            className="flex items-start gap-2 text-gray-700"
          >
            <span className="text-gold">•</span>
            <span>{change}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}