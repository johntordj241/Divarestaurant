import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../lib/auth/AuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const { user } = await authService.signIn(email, password);
      setUser(user);
    },
    signUp: async (email: string, password: string) => {
      const { user } = await authService.signUp(email, password);
      setUser(user);
    },
    signOut: async () => {
      await authService.signOut();
      setUser(null);
    },
    resetPassword: async (email: string) => {
      await authService.resetPassword(email);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}