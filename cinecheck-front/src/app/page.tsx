
'use client';

import { useEffect, useMemo, useState } from 'react';
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

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
      />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />
    </svg>
  );
}

function RatingStars({
  rating,
  onChange,
  disabled = false,
}: {
  rating: number | null;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label="Votre note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          aria-label={`Noter ${star} sur 5`}
          className={`rounded-md p-0.5 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 ${
            rating !== null && rating >= star
              ? 'text-amber-400'
              : 'text-zinc-600 hover:text-amber-300'
          }`}
        >
          <StarIcon filled={rating !== null && rating >= star} />
        </button>
      ))}
    </div>
  );
}

function FilmCard({
  film,
  userRating,
  isLoggedIn,
  saving,
  onRate,
}: {
  film: Film;
  userRating: number | null;
  isLoggedIn: boolean;
  saving: boolean;
  onRate: (id: string, rating: number) => void;
}) {
  return (
    <article className="group flex w-[245px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#151515] transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-[#1b1b1b] sm:w-[270px]">
      <div className="relative flex h-32 flex-col justify-between overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-[#302416] via-[#1c1915] to-[#121212] p-4">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-amber-400/[0.08] blur-2xl transition group-hover:bg-amber-400/[0.15]" />

        <div className="relative flex items-start justify-between gap-2">
          <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-400">
            {film.year || 'Année inconnue'}
          </span>

          {film.rating != null && (
            <span className="flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 text-xs font-semibold text-amber-400">
              <StarIcon />
              <span>{film.rating.toFixed(1)}</span>
              <span className="font-normal text-zinc-500">/10</span>
            </span>
          )}
        </div>

        <div className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <FilmIcon />
          <span>CineCheck</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white transition group-hover:text-amber-100">
          {film.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
          {film.genres || 'Genre non renseigné'}
        </p>

        <div className="mt-4 border-t border-white/[0.08] pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-400">Votre note</span>
            {userRating !== null && (
              <span className="text-xs font-medium text-amber-400">
                {userRating}/5
              </span>
            )}
          </div>

          {isLoggedIn ? (
            <RatingStars
              rating={userRating}
              onChange={(rating) => onRate(film.id, rating)}
              disabled={saving}
            />
          ) : (
            <p className="text-xs leading-5 text-zinc-500">
              Connectez-vous pour noter ce film.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function FilmCarousel({
  genre,
  films,
  userRatings,
  isLoggedIn,
  savingId,
  onRate,
}: {
  genre: string;
  films: Film[];
  userRatings: Record<string, number>;
  isLoggedIn: boolean;
  savingId: string | null;
  onRate: (id: string, rating: number) => void;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Explorer par genre
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {genre}
          </h2>
        </div>

        <span className="shrink-0 text-xs text-zinc-500">
          {films.length} film{films.length > 1 ? 's' : ''}
        </span>
      </div>

      <div
        className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 [scrollbar-color:#454545_transparent] [scrollbar-width:thin] snap-x snap-mandatory"
        aria-label={`Films du genre ${genre}`}
      >
        {films.map((film) => (
          <div key={film.id} className="snap-start">
            <FilmCard
              film={film}
              userRating={userRatings[film.id] ?? null}
              isLoggedIn={isLoggedIn}
              saving={savingId === film.id}
              onRate={onRate}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const filmsResponse = await axios.get(`${API_URL}/films`);
        if (cancelled) return;

        setFilms(filmsResponse.data.data ?? []);

        try {
          await axios.get(`${API_URL}/auth/profile`, {
            withCredentials: true,
          });

          const ratingsResponse = await axios.get(
            `${API_URL}/films/my-ratings`,
            { withCredentials: true },
          );

          if (cancelled) return;

          setIsLoggedIn(true);
          setUserRatings(ratingsResponse.data ?? {});
        } catch {
          if (cancelled) return;

          setIsLoggedIn(false);
          setUserRatings({});
        }
      } catch (err) {
        console.error('Erreur de chargement des films :', err);
        if (!cancelled) {
          setError('Impossible de charger les films. Vérifiez que le serveur est disponible.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveRating(filmId: string, rating: number) {
    if (!isLoggedIn) {
      setNotice('Connectez-vous pour noter les films.');
      return;
    }

    if (savingId !== null) return;

    setSavingId(filmId);
    setNotice('');

    try {
      await axios.post(
        `${API_URL}/films/rate`,
        {
          tconst: filmId,
          rating,
          watched: true,
        },
        { withCredentials: true },
      );

      setUserRatings((previous) => ({
        ...previous,
        [filmId]: rating,
      }));

      setNotice('Votre note a été enregistrée.');
    } catch (err) {
      console.error('Erreur de sauvegarde de la note :', err);
      setNotice('Impossible d’enregistrer votre note. Réessayez.');
    } finally {
      setSavingId(null);
    }
  }

  const filteredFilms = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr');

    if (!query) return films;

    return films.filter((film) => {
      return (
        film.title.toLocaleLowerCase('fr').includes(query) ||
        (film.genres ?? '').toLocaleLowerCase('fr').includes(query) ||
        String(film.year ?? '').includes(query)
      );
    });
  }, [films, search]);

  const genres = useMemo(() => {
    const groups = new Map<string, Film[]>();

    for (const film of filteredFilms) {
      const filmGenres = film.genres
        ?.split(',')
        .map((genre) => genre.trim())
        .filter(Boolean);

      const uniqueGenres = filmGenres?.length
        ? [...new Set(filmGenres)]
        : ['Autres'];

      for (const genre of uniqueGenres) {
        if (!groups.has(genre)) groups.set(genre, []);
        groups.get(genre)!.push(film);
      }
    }

    return [...groups.entries()].sort(([a], [b]) => {
      if (a === 'Autres') return 1;
      if (b === 'Autres') return -1;
      return a.localeCompare(b, 'fr');
    });
  }, [filteredFilms]);

  const ratedCount = Object.values(userRatings).filter(
    (rating) => rating > 0,
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-3 w-28 rounded bg-zinc-800" />
          <div className="mt-5 h-10 w-80 max-w-full rounded bg-zinc-800" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-zinc-900" />
          <div className="mt-10 h-6 w-44 rounded bg-zinc-800" />
          <div className="mt-5 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-72 w-64 shrink-0 rounded-2xl bg-zinc-900" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#0b0b0b] px-6 text-white">
        <div className="max-w-md text-center">
          <FilmIcon />
          <h1 className="mt-4 text-xl font-semibold">Oups, le cinéma est inaccessible</h1>
          <p className="mt-2 text-sm text-zinc-400">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex-1 bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#241c10] via-[#15130f] to-[#101010] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-amber-500/[0.10] blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
              Votre rendez-vous cinéma
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Le prochain film
              <span className="block text-zinc-400">que vous allez adorer.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Explorez les films par genre, découvrez les mieux notés et
              construisez votre propre regard sur le cinéma.
            </p>

            <label className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 transition focus-within:border-amber-400/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 shrink-0 text-zinc-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un film, un genre, une année..."
                aria-label="Rechercher un film"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="shrink-0 text-xs text-zinc-400 hover:text-white"
                >
                  Effacer
                </button>
              )}
            </label>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                {films.length} films au catalogue
              </span>
              {isLoggedIn ? (
                <span className="rounded-lg border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2 text-amber-300">
                  {ratedCount} film{ratedCount !== 1 ? 's' : ''} noté{ratedCount !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                  Connectez-vous pour noter
                </span>
              )}
            </div>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="text-zinc-500 hover:text-white"
              aria-label="Fermer le message"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mt-10">
          {genres.length > 0 ? (
            genres.map(([genre, genreFilms]) => (
              <FilmCarousel
                key={genre}
                genre={genre}
                films={genreFilms}
                userRatings={userRatings}
                isLoggedIn={isLoggedIn}
                savingId={savingId}
                onRate={saveRating}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
              <div className="mx-auto flex justify-center text-zinc-500">
                <FilmIcon />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Aucun film trouvé</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Essayez un autre titre, un genre ou une année.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-4 text-sm font-medium text-amber-400 hover:text-amber-300"
              >
                Afficher tous les films
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
