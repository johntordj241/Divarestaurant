import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface PasswordResetFormProps {
  onBack: () => void;
}

export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-serif text-gold mb-4">Email envoyé</h2>
        <p className="text-gray-300 mb-6">
          Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.
        </p>
        <button
          onClick={onBack}
          className="text-gold hover:text-gold/80"
        >
          Retour à la connexion
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <h2 className="text-2xl font-serif text-gold mb-6">
        Réinitialisation du mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-md flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Entrez votre email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-black py-3 rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  );
}