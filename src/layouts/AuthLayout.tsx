import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout — centered full-screen layout for login / auth pages.
 * Uses the dark naval background with a centered card.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* Brand logo in top-left corner */}
      <div
        className="auth-layout__top-brand"
        style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <img
          src="/logo.png"
          alt="RD Plast Logo"
          style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '50%' }}
        />
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '0.01em' }}>
          RD Plast
        </span>
      </div>

      {/* Decorative background grid */}
      <div className="auth-layout__grid" aria-hidden="true" />

      {/* Glow orb decoration */}
      <div className="auth-layout__orb auth-layout__orb--1" aria-hidden="true" />
      <div className="auth-layout__orb auth-layout__orb--2" aria-hidden="true" />

      <main className="auth-layout__main">
        {children}
      </main>

      <footer className="app-footer app-footer--auth">
        <p className="app-footer__text">
          &copy; 2026 RD Plast todos los derechos reservados. | Desarrollado por{' '}
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
