import type { UserRole } from '../types/auth.types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  admin: { label: 'Administrador', className: 'role-badge--admin' },
  viewer: { label: 'Lector', className: 'role-badge--viewer' },
};

/**
 * RoleBadge — displays the current user's role as a styled pill badge.
 * Uses the cold color palette: admin = blue accent, viewer = steel gray.
 */
export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  return (
    <span className={`role-badge ${config.className} ${className}`} aria-label={`Role: ${config.label}`}>
      {config.label}
    </span>
  );
}
