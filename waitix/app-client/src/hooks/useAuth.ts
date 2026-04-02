import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { Alert } from 'react-native';

// Demo mode: set to true to bypass Supabase auth entirely
// Set to false and configure .env when Supabase is ready
const DEMO_MODE = true;

const DEMO_PROFILE: User = {
  id: 'demo-user-001',
  email: 'demo@waitix.com',
  full_name: 'Marie Dupont',
  role: 'client',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthState {
  profile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    profile: null,
    isLoading: !DEMO_MODE,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (DEMO_MODE) return;

    // Real Supabase auth init — only runs when DEMO_MODE is false
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import('../config/supabase');
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        const session = data.session;
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setState({ profile, isAuthenticated: true, isLoading: false });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        if (!cancelled) setState((prev) => ({ ...prev, isLoading: false }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (DEMO_MODE) {
      setState({
        isAuthenticated: true,
        profile: { ...DEMO_PROFILE, email },
        isLoading: false,
      });
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { supabase } = await import('../config/supabase');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (DEMO_MODE) {
        setState({
          isAuthenticated: true,
          profile: { ...DEMO_PROFILE, full_name: fullName, email },
          isLoading: false,
        });
        return;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const { supabase } = await import('../config/supabase');
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role: 'client' } },
        });
        if (error) throw error;
      } catch (err: any) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    if (DEMO_MODE) {
      setState({ isAuthenticated: false, profile: null, isLoading: false });
      return;
    }
    try {
      const { supabase } = await import('../config/supabase');
      await supabase.auth.signOut();
      setState({ isAuthenticated: false, profile: null, isLoading: false });
    } catch {
      setState({ isAuthenticated: false, profile: null, isLoading: false });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (DEMO_MODE) {
      Alert.alert('Email envoye', 'Lien de reinitialisation envoye (demo).');
      return;
    }
    const { supabase } = await import('../config/supabase');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }, []);

  const enterDemo = useCallback(() => {
    setState({
      profile: DEMO_PROFILE,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    enterDemo,
  };
}
