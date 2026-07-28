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
      {/* Decorative background grid */}
      <div className="auth-layout__grid" aria-hidden="true" />

      {/* Glow orb decoration */}
      <div className="auth-layout__orb auth-layout__orb--1" aria-hidden="true" />
      <div className="auth-layout__orb auth-layout__orb--2" aria-hidden="true" />

      <main className="auth-layout__main">
        <div className="auth-layout__brand">
          <div className="auth-layout__logo" aria-label="Control Administrator logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#3B82F6" />
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="auth-layout__brand-name">Control Administrator</span>
        </div>
        {children}
      </main>
    </div>
  );
}
