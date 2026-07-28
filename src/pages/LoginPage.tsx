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
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      // Normalize Supabase error messages for end users
      const msg = result.error ?? 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      setError(
        msg.includes('Invalid login credentials')
          ? 'Correo electrónico o contraseña incorrectos.'
          : msg
      );
    }
    // On success, the useEffect above handles redirect
  };

  return (
    <AuthLayout>
      <Card elevation="elevated" className="login-card">
        <Card.Header>
          <h1 className="login-card__title">Iniciar Sesión</h1>
          <p className="login-card__subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </Card.Header>

        <Card.Body>
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de inicio de sesión"
          >
            <div className="login-card__fields">
              <Input
                id="login-email"
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />

              <Input
                id="login-password"
                label="Contraseña"
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
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </Card.Body>

        <Card.Footer>
          <p className="login-card__footer-note">
            Contacta al administrador para solicitar acceso.
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}
