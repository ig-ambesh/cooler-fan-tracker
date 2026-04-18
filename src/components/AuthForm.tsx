import { useState, type FormEvent } from 'react';
import type { AuthMode } from '../types';

type AuthFormProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
};

export function AuthForm({ mode, onModeChange, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="glass-panel mx-auto w-full max-w-md p-6 md:p-8">
      <div className="mb-6">
        <p className="card-title">Secure access</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {mode === 'login' ? 'Sign in to your dashboard' : 'Create a family account'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/[0.72]">
          Each account gets its own private Firestore data path so every user sees only their logs.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/[0.15] bg-white/10 p-1">
        <button
          type="button"
          className={`rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition ${
            mode === 'login' ? 'bg-white text-slate-950' : 'text-white/[0.65] hover:text-white'
          }`}
          onClick={() => onModeChange('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition ${
            mode === 'signup' ? 'bg-white text-slate-950' : 'text-white/[0.65] hover:text-white'
          }`}
          onClick={() => onModeChange('signup')}
        >
          Sign up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </div>

        {error ? <div className="rounded-[1.4rem] border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
    </section>
  );
}
