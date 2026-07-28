import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from '../types/auth.types';

/**
 * useAuth — consume the AuthContext anywhere in the component tree.
 *
 * @example
 * const { user, role, signOut } = useAuth();
 *
 * @throws If used outside of <AuthProvider>
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('[useAuth] Must be used inside <AuthProvider>. Wrap your app with it.');
  }

  return context;
}
