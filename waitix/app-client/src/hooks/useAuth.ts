import { useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

// Demo mode: set to true to bypass Supabase auth
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
  session: Session | null;
  user: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: DEMO_MODE ? DEMO_PROFILE : null,
    isLoading: false,
    isAuthenticated: false,
  });

  // Skip Supabase connection in demo mode
  useEffect(() => {
    if (DEMO_MODE) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Real auth logic would go here
    const init = async () => {
      try {
        const { authService } = await import('../services/auth');
        const session = await authService.getSession();
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
          profile: prev.profile,
        }));
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    init();
  }, []);

  const signIn = useCallback(async (_email: string, _password: string) => {
    if (DEMO_MODE) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        profile: DEMO_PROFILE,
        isLoading: false,
      }));
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { authService } = await import('../services/auth');
      await authService.signIn({ email: _email, password: _password });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signUp = useCallback(
    async (_email: string, _password: string, fullName: string) => {
      if (DEMO_MODE) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          profile: { ...DEMO_PROFILE, full_name: fullName, email: _email },
          isLoading: false,
        }));
        return;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const { authService } = await import('../services/auth');
        await authService.signUp({ email: _email, password: _password, fullName, role: 'client' });
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    if (DEMO_MODE) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        profile: DEMO_PROFILE,
        isLoading: false,
      }));
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { authService } = await import('../services/auth');
      await authService.signOut();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    if (DEMO_MODE) return;
    const { authService } = await import('../services/auth');
    await authService.resetPassword(_email);
  }, []);

  const enterDemo = useCallback(() => {
    setState({
      session: null,
      user: null,
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
