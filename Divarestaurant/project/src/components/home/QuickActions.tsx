import React from 'react';
import { Calendar, UtensilsCrossed, Phone } from 'lucide-react';

const actions = [
  {
    icon: Calendar,
    label: 'Réserver',
    href: '#reservation',
    primary: true
  },
  {
    icon: UtensilsCrossed,
    label: 'Menu',
    href: '#menu'
  },
  {
    icon: Phone,
    label: 'Contact',
    href: '#contact'
  }
];

export function QuickActions() {
  return (
    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex gap-6">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full transition-all
            ${action.primary
              ? 'bg-gold text-black hover:bg-gold/90'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
            }
          `}
        >
          <action.icon size={20} />
          <span className="font-medium">{action.label}</span>
        </a>
      ))}
    </div>
  );
}