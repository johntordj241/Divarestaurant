import React, { useState } from 'react';
import { Upload, Send, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: string;
  portfolio: string;
  availability: string;
  message: string;
  cv?: File;
}

export function RecruitmentForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    portfolio: '',
    availability: '',
    message: ''
  });
  const [cv, setCV] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const specialties = [
    { value: 'chef', label: 'Chef de cuisine' },
    { value: 'sous-chef', label: 'Sous-chef' },
    { value: 'commis', label: 'Commis' },
    { value: 'serveur', label: 'Serveur/Serveuse' },
    { value: 'barman', label: 'Barman/Barmaid' },
    { value: 'hote', label: 'Hôte/Hôtesse d\'accueil' },
    { value: 'runner', label: 'Runner' },
    { value: 'plongeur', label: 'Plongeur' },
    { value: 'voiturier', label: 'Voiturier' },
    { value: 'polyvalent', label: 'Poste polyvalent' },
    { value: 'danse', label: 'Danseur/Danseuse' },
    { value: 'chant', label: 'Chanteur/Chanteuse' },
    { value: 'musique', label: 'Musicien(ne)' },
    { value: 'performance', label: 'Performeur/Performeuse' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5Mo
        setError('Le fichier est trop volumineux. Taille maximum : 5Mo');
        return;
      }
      if (!file.type.includes('pdf')) {
        setError('Seuls les fichiers PDF sont acceptés');
        return;
      }
      setCV(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation des champs
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.specialty) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Validation de l'email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Adresse email invalide');
      }

      // Validation du téléphone
      if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
        throw new Error('Numéro de téléphone invalide');
      }

      let cvUrl = '';
      if (cv) {
        const fileExt = cv.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `cv/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(filePath, cv);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('applications')
          .getPublicUrl(filePath);

        cvUrl = publicUrl;
      }

      const { error: submitError } = await supabase
        .from('applications')
        .insert({
          ...formData,
          cv_url: cvUrl,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialty: '',
        experience: '',
        portfolio: '',
        availability: '',
        message: ''
      });
      setCV(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi de votre candidature.');
      console.error('Application submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-500/10 text-green-500 p-6 rounded-lg text-center">
        <h3 className="text-xl font-serif mb-4">Candidature envoyée avec succès !</h3>
        <p>
          Nous avons bien reçu votre candidature et nous vous contacterons dans les plus brefs délais.
          Merci de votre intérêt pour Diva Restaurant !
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Poste souhaité *
        </label>
        <select
          value={formData.specialty}
          onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          required
        >
          <option value="">Sélectionnez un poste</option>
          <optgroup label="Cuisine">
            <option value="chef">Chef de cuisine</option>
            <option value="sous-chef">Sous-chef</option>
            <option value="commis">Commis</option>
            <option value="plongeur">Plongeur</option>
          </optgroup>
          <optgroup label="Service">
            <option value="serveur">Serveur/Serveuse</option>
            <option value="barman">Barman/Barmaid</option>
            <option value="hote">Hôte/Hôtesse d'accueil</option>
            <option value="runner">Runner</option>
            <option value="voiturier">Voiturier</option>
          </optgroup>
          <optgroup label="Artistique">
            <option value="danse">Danseur/Danseuse</option>
            <option value="chant">Chanteur/Chanteuse</option>
            <option value="musique">Musicien(ne)</option>
            <option value="performance">Performeur/Performeuse</option>
          </optgroup>
          <option value="polyvalent">Poste polyvalent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          CV (PDF, max 5Mo) *
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
              <Upload size={20} />
              {cv ? cv.name : 'Sélectionner votre CV'}
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Expérience *
        </label>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-32"
          placeholder="Décrivez votre expérience professionnelle..."
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Portfolio (liens vidéos, site web, réseaux sociaux)
        </label>
        <input
          type="text"
          value={formData.portfolio}
          onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          placeholder="https://"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Disponibilités *
        </label>
        <textarea
          value={formData.availability}
          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-24"
          placeholder="Indiquez vos disponibilités..."
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Message complémentaire
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-32"
          placeholder="Un message pour compléter votre candidature..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-black py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send size={20} />
        {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
      </button>
    </form>
  );
}