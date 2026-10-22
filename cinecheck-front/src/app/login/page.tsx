'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/src/components/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pword, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: Parameters<NonNullable<React.ComponentProps<'form'>['onSubmit']>>[0]) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await signIn(email, pword);
      router.push('/profile');
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setErrorMessage(
        'Connexion impossible. Vérifie ton e-mail et ton mot de passe.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-red-900/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
              <path d="M5 3.8A1.8 1.8 0 0 0 3.2 5.6v12.8A1.8 1.8 0 0 0 5 20.2h14a1.8 1.8 0 0 0 1.8-1.8V5.6A1.8 1.8 0 0 0 19 3.8H5Zm2 1.7h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2ZM7 16.5h10v1.7H7v-1.7Zm-2-6h14v4H5v-4Z" />
            </svg>
          </div>
          <span className="text-3xl font-black tracking-tight">
            Cine<span className="text-amber-400">Check</span>
          </span>
        </Link>

        <section className="rounded-2xl border border-white/10 bg-[#141416]/95 p-7 shadow-2xl shadow-black/40 sm:p-9">
          <div className="mb-7">
            <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Retrouve tes films, tes notes et ta collection personnelle.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-zinc-300">
                Adresse e-mail
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="mail@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-zinc-300">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Ton mot de passe"
                value={pword}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
                required
              />
            </div>

            {errorMessage && (
              <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-400 px-4 py-3.5 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">NOUVEAU SUR CINECHECK ?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-zinc-400">
            Tu n'as pas encore de compte ?{' '}
            <Link href="/signup" className="font-semibold text-amber-400 transition hover:text-amber-300">
              S'inscrire
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
