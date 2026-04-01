import { useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { User } from '../types';

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
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      setState((prev) => ({ ...prev, profile: profile as User }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    authService.getSession().then((session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }));

      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (_event, session) => {
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
        }));

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setState((prev) => ({ ...prev, profile: null }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.signIn({ email, password });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        await authService.signUp({ email, password, fullName, role: 'client' });
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.signOut();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await authService.resetPassword(email);
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
