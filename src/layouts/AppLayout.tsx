import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Button } from '../components/ui/Button';
import { RoleBadge } from '../components/RoleBadge';
import type { UserRole } from '../types/auth.types';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout — main shell for authenticated pages.
 * Includes a fixed top navigation bar with user info, role badge and sign-out.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      {/* ── Top Navigation ── */}
      <header className="app-nav">
        <div className="app-nav__brand">
          <div className="app-nav__logo" aria-label="App logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#3B82F6" />
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="app-nav__brand-name">Control Administrator</span>
        </div>

        <nav className="app-nav__links" aria-label="Main navigation">
          {/* Future navigation links will go here */}
        </nav>

        <div className="app-nav__user">
          <div className="app-nav__user-info">
            <span className="app-nav__user-email" title={profile?.email}>
              {profile?.full_name ?? profile?.email ?? '—'}
            </span>
            {role && <RoleBadge role={role as UserRole} />}
          </div>
          <button
            id="btn-sign-out"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Cerrar sesión"
            className="btn-signout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {signingOut ? 'Saliendo...' : 'Cerrar sesión'}
          </button>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="app-layout__content">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p className="app-footer__text">
          &copy; 2026 Control Administrator todos los derechos reservados. | Desarrollado por{' '}
          <a
            href="https://waveframe.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__link"
          >
            WaveFrame Studio
          </a>
        </p>
      </footer>
    </div>
  );
}
