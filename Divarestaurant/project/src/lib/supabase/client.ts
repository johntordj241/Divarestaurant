import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';
import { MonitoringService } from '../monitoring/MonitoringService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const monitoringService = MonitoringService.getInstance();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Écouteur d'état d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    monitoringService.logInfo('Utilisateur connecté:', { userId: session?.user?.id });
  } else if (event === 'SIGNED_OUT') {
    monitoringService.logInfo('Utilisateur déconnecté');
  }
});

// Intercepteur pour les erreurs
supabase.handleError = (error: any) => {
  monitoringService.logError(error, {
    context: 'Supabase Client',
    url: supabaseUrl
  });
  throw error;
};