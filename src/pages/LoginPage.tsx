import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../auth/useAuth';

interface LocationState {
  from?: { pathname: string };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      // Normalize Supabase error messages for end users
      const msg = result.error ?? 'Login failed. Please try again.';
      setError(
        msg.includes('Invalid login credentials')
          ? 'Incorrect email or password.'
          : msg
      );
    }
    // On success, the useEffect above handles redirect
  };

  return (
    <AuthLayout>
      <Card elevation="elevated" className="login-card">
        <Card.Header>
          <h1 className="login-card__title">Sign In</h1>
          <p className="login-card__subtitle">
            Enter your credentials to access the system
          </p>
        </Card.Header>

        <Card.Body>
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Login form"
          >
            <div className="login-card__fields">
              <Input
                id="login-email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />

              <Input
                id="login-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
              />

              {error && (
                <div className="login-card__error" role="alert" aria-live="assertive">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Button
                id="btn-login"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                disabled={submitting}
              >
                Sign In
              </Button>
            </div>
          </form>
        </Card.Body>

        <Card.Footer>
          <p className="login-card__footer-note">
            Contact your administrator to request access.
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}
