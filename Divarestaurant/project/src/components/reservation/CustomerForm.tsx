import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface CustomerFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
  onChange: (data: Partial<CustomerFormProps['formData']>) => void;
}

export function CustomerForm({ formData, onChange }: CustomerFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Jean Dupont"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="jean.dupont@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Demandes spéciales
        </label>
        <textarea
          className="w-full px-4 py-2 border rounded-md"
          rows={4}
          value={formData.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          placeholder="Allergies, préférences alimentaires, ou autres demandes particulières..."
        />
      </div>
    </div>
  );
}