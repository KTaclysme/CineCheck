
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Film = {
  id: string;
  title: string;
  year?: number;
  genres?: string;
  rating?: number;
  votes?: number;
};

const API_URL = 'http://localhost:3000';
const PAGE_SIZE = 30;

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchFilms() {
      try {
        const response = await axios.get(
          `${API_URL}/films?page=1&limit=${PAGE_SIZE}`,
        );

        if (cancelled) return;

        setFilms(response.data.data ?? []);
        setPage(1);
        setHasMore(response.data.hasMore ?? false);
      } catch (err) {
        console.error('Erreur de chargement des films :', err);

        if (!cancelled) {
          setError('Impossible de charger les films.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchFilms();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMoreFilms() {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError('');

    try {
      const nextPage = page + 1;

      const response = await axios.get(
        `${API_URL}/films?page=${nextPage}&limit=${PAGE_SIZE}`,
      );

      const newFilms: Film[] = response.data.data ?? [];

      setFilms((previous) => {
        const existingIds = new Set(previous.map((film) => film.id));

        return [
          ...previous,
          ...newFilms.filter((film) => !existingIds.has(film.id)),
        ];
      });

      setPage(nextPage);
      setHasMore(response.data.hasMore ?? false);
    } catch (err) {
      console.error('Erreur de chargement des films :', err);
      setError('Impossible de charger plus de films. Réessayez.');
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-12 text-white">
        Chargement des films...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="/"
          className="text-sm text-amber-400 hover:text-amber-300"
        >
          ← Retour à l'accueil
        </a>

        <header className="mb-8 mt-6">

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Tous les films populaires
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {films.length} film{films.length !== 1 ? 's' : ''} chargé
            {films.length !== 1 ? 's' : ''}
          </p>
        </header>

        {error && (
          <p role="alert" className="mb-5 text-sm text-red-400">
            {error}
          </p>
        )}

        {films.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {films.map((film) => (
              <article
                key={film.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#151515] transition hover:-translate-y-1 hover:border-amber-400/40"
              >
                <div className="flex h-28 flex-col justify-between bg-gradient-to-br from-[#302416] via-[#1c1915] to-[#121212] p-3 sm:h-32 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-zinc-400">
                      {film.year ?? 'Année inconnue'}
                    </span>

                    {film.rating != null && (
                      <span className="text-xs font-semibold text-amber-400">
                        ★ {film.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    CineCheck
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-white sm:text-base">
                    {film.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs text-zinc-500">
                    {film.genres || 'Genre non renseigné'}
                  </p>

                  {film.votes != null && (
                    <p className="mt-3 text-xs text-zinc-500">
                      {film.votes.toLocaleString('fr-FR')} votes
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-zinc-400">
            Aucun film disponible.
          </p>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={loadMoreFilms}
              disabled={loadingMore}
              className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? 'Chargement...' : 'Charger plus de films'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
