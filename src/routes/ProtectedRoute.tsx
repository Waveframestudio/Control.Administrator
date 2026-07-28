import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { ProtectedRouteProps, UserRole } from '../types/auth.types';

// ─── Role Hierarchy ───────────────────────────────────────────────────────────
// admin > viewer — used to determine if a role satisfies the required level

const ROLE_LEVEL: Record<UserRole, number> = {
  admin: 100,
  viewer: 10,
};

function hasRequiredRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole];
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProtectedRoute — guards a route behind authentication and optional role check.
 *
 * Usage:
 *   <ProtectedRoute>...</ProtectedRoute>               // requires any authenticated user
 *   <ProtectedRoute requiredRole="admin">...</ProtectedRoute>  // requires admin role
 */
export function ProtectedRoute({
  requiredRole,
  redirectTo = '/login',
  children,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Show a loading spinner while the session is being hydrated
  if (loading) {
    return (
      <div className="route-loading" role="status" aria-label="Loading session...">
        <div className="route-loading__spinner" aria-hidden="true" />
        <p className="route-loading__text">Loading...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login, preserving intended destination
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but insufficient role → redirect to unauthorized page
  if (requiredRole && !hasRequiredRole(role, requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
