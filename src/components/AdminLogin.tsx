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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-5 text-[#171717]">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center bg-black text-xs font-bold text-white shadow-sm">
            JS
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Portal
          </h1>

          <p className="mt-2 text-sm text-[#737373]">
            Sign in to manage your roadmap content.
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#eaeaea] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-[#eaeaea] pb-5">
            <div className="flex h-9 w-9 items-center justify-center border border-[#eaeaea] bg-[#fafafa]">
              <LockKeyhole
                size={16}
                className="text-[#525252]"
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                Secure sign in
              </p>

              <p className="mt-0.5 text-xs text-[#a3a3a3]">
                Authorized users only
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-medium text-[#525252]"
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
                className="h-11 w-full border border-[#eaeaea] bg-white px-3 text-sm outline-none transition placeholder:text-[#a3a3a3] focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-medium text-[#525252]"
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
                className="h-11 w-full border border-[#eaeaea] bg-white px-3 text-sm outline-none transition placeholder:text-[#a3a3a3] focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 bg-black text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
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

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#eaeaea] pt-5 text-xs text-[#a3a3a3]">
            <ShieldCheck size={14} />
            Protected by Supabase Auth
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-[#a3a3a3]">
          JavaScript Mastery · Content Management
        </p>
      </div>
    </main>
  );
}