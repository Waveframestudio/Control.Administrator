import { useMemo } from 'react';
import { useAuth } from '../auth/useAuth';
import type { PermissionSet } from '../types/auth.types';

/**
 * usePermissions — returns a memoized set of boolean flags based on the
 * current user's role. Use these flags to conditionally render or disable
 * UI elements (buttons, forms, actions).
 *
 * Security note: these flags only control the UI. Actual enforcement is
 * handled by Supabase RLS policies on the database side.
 *
 * @example
 * const { canCreate, canEdit, canDelete, isAdmin } = usePermissions();
 * <Button disabled={!canCreate}>New Item</Button>
 */
export function usePermissions(): PermissionSet {
  const { role } = useAuth();

  return useMemo<PermissionSet>(() => {
    const isAdmin = role === 'admin';
    const isViewer = role === 'viewer';

    return {
      // Admins have full write access; viewers are read-only
      canCreate: isAdmin,
      canEdit: isAdmin,
      canDelete: isAdmin,
      // Both roles can always read
      canRead: isAdmin || isViewer,
      isAdmin,
      isViewer,
    };
  }, [role]);
}
