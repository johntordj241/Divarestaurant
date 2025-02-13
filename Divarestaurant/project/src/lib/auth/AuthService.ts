import { supabase } from '../supabase/client';
import { User } from '@supabase/supabase-js';
import { MonitoringService } from '../monitoring/MonitoringService';

export class AuthService {
  private static instance: AuthService;
  private monitoringService: MonitoringService;

  private constructor() {
    this.monitoringService = MonitoringService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(email: string, password: string, role: 'admin' | 'staff' = 'staff') {
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: role
          }
        }
      });

      if (signUpError) throw signUpError;

      // Créer le profil utilisateur avec le rôle
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            user_id: auth.user?.id, 
            role,
            is_admin: role === 'admin'
          }
        ]);

      if (profileError) throw profileError;

      return auth;
    } catch (error) {
      this.monitoringService.logError(error as Error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Mettre à jour last_login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', data.user?.id);

      return data;
    } catch (error) {
      this.monitoringService.logError(error as Error);
      throw error;
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getUserRole(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.role || null;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.is_admin || false;
  }
}