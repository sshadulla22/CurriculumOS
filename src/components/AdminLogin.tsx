import { FormEvent, useState } from 'react';
import { ArrowRight, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

type AdminLoginProps = {
  onLogin: () => void;
};

export default function AdminLogin({
  onLogin,
}: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onLogin();
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5"
      style={{
        backgroundColor: 'var(--login-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            `linear-gradient(to right, var(--login-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--login-grid) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-10 w-10 items-center justify-center text-xs font-bold shadow-sm"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent-text)',
            }}
          >
            JS
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Portal
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--login-muted)' }}
          >
            Sign in to manage your roadmap content.
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
          style={{
            border: `1px solid var(--login-card-border)`,
            backgroundColor: 'var(--login-card-bg)',
          }}
        >
          <div
            className="mb-6 flex items-center gap-3 pb-5"
            style={{ borderBottom: `1px solid var(--login-card-border)` }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center"
              style={{
                border: `1px solid var(--login-card-border)`,
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <LockKeyhole
                size={16}
                style={{ color: 'var(--login-label)' }}
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                Secure sign in
              </p>

              <p
                className="mt-0.5 text-xs"
                style={{ color: 'var(--login-muted)' }}
              >
                Authorized users only
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 px-3 py-2.5 text-sm"
              style={{
                border: '1px solid var(--toast-error-border)',
                backgroundColor: 'var(--toast-error-bg)',
                color: 'var(--toast-error-text)',
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-medium"
                style={{ color: 'var(--login-label)' }}
              >
                Email address
              </label>

              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="h-11 w-full px-3 text-sm outline-none transition focus:ring-1"
                style={{
                  border: `1px solid var(--login-card-border)`,
                  backgroundColor: 'var(--login-input-bg)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-medium"
                style={{ color: 'var(--login-label)' }}
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="h-11 w-full px-3 text-sm outline-none transition focus:ring-1"
                style={{
                  border: `1px solid var(--login-card-border)`,
                  backgroundColor: 'var(--login-input-bg)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent-text)',
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-2 pt-5 text-xs"
            style={{
              borderTop: `1px solid var(--login-card-border)`,
              color: 'var(--login-muted)',
            }}
          >
            <ShieldCheck size={14} />
            Protected by Supabase Auth
          </div>
        </form>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--login-muted)' }}
        >
          JavaScript Mastery · Content Management
        </p>
      </div>
    </main>
  );
}