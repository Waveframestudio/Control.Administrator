import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthContextValue, AuthResult, UserProfile, UserRole } from '../types/auth.types';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helper ───────────────────────────────────────────────────────────────────

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[AuthContext] Failed to fetch profile:', error.message);
    return null;
  }

  return data as UserProfile;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Initialize session from persisted storage ─────────────────────────────
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (activeSession?.user) {
        setSession(activeSession);
        setUser(activeSession.user);
        const prof = await fetchProfile(activeSession.user.id);
        if (mounted) {
          setProfile(prof);
          setRole(prof?.role ?? null);
        }
      }

      if (mounted) setLoading(false);
    };

    initSession();

    // ── Subscribe to auth state changes (login, logout, token refresh) ──────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const prof = await fetchProfile(newSession.user.id);
          if (mounted) {
            setProfile(prof);
            setRole(prof?.role ?? null);
          }
        } else {
          setProfile(null);
          setRole(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    },
    []
  );

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  }, []);

  // ── Memoized context value ────────────────────────────────────────────────
  const value = useMemo<AuthContextValue>(
    () => ({ user, session, profile, role, loading, signIn, signOut }),
    [user, session, profile, role, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Internal Hook ────────────────────────────────────────────────────────────
// Exported only for use within the auth module — consumers should use useAuth

export { AuthContext };
