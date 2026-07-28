import type { User, Session } from '@supabase/supabase-js';

// ─── Roles ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'viewer';

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

// ─── Auth Result ──────────────────────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  error?: string;
}

// ─── Protected Route ──────────────────────────────────────────────────────────

export interface ProtectedRouteProps {
  /** If provided, only users with this role (or higher) can access the route */
  requiredRole?: UserRole;
  /** Custom redirect path when access is denied (defaults to '/login') */
  redirectTo?: string;
  children: React.ReactNode;
}

// ─── Permissions ─────────────────────────────────────────────────────────────

export interface PermissionSet {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canRead: boolean;
  isAdmin: boolean;
  isViewer: boolean;
}
