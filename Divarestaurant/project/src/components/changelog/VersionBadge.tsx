import React from 'react';

type VersionStatus = 'stable' | 'beta' | 'alpha';

interface VersionBadgeProps {
  status: VersionStatus;
}

const statusStyles = {
  stable: 'bg-green-100 text-green-800',
  beta: 'bg-blue-100 text-blue-800',
  alpha: 'bg-yellow-100 text-yellow-800'
} as const;

export function VersionBadge({ status }: VersionBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}