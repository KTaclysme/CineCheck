
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
  myRating?: number | null;
  watchedByMe?: boolean;
};

type User = {
  id?: number;
  username?: string;
  email?: string;
};

type Filter = 'all' | 'rated' | 'unrated';

function StarIcon({
  filled = true,
  className = 'h-5 w-5',
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
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

function FilmIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M7 12h10" />
    </svg>
  );
}

function RatingStars({
  rating,
  onChange,
  disabled = false,
}: {
  rating: number | null;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={onChange ? 'group' : 'img'}
      aria-label={rating ? `Note personnelle : ${rating} sur 5` : 'Aucune note'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange || disabled}
          onClick={() => onChange?.(star)}
          aria-label={`Noter ${star} sur 5`}
          className={`rounded-md p-1 transition duration-150 ${
            rating !== null && rating >= star
              ? 'text-amber-400'
              : 'text-zinc-600'
          } ${
            onChange
              ? 'cursor-pointer hover:scale-110 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40'
              : 'cursor-default'
          }`}
        >
          <StarIcon
            filled={rating !== null && rating >= star}
            className="h-5 w-5"
          />
        </button>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{label}</p>
        <span className="rounded-xl bg-white/[0.07] p-2.5 text-amber-400">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function FilmCard({
  film,
  onRate,
  saving,
}: {
  film: Film;
  onRate: (id: string, rating: number) => void;
  saving: boolean;
}) {
  const hasRating = film.myRating != null && film.myRating > 0;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/20">
      <div className="border-b border-white/10 bg-gradient-to-r from-amber-400/[0.08] to-transparent p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {film.year || 'Année inconnue'}
          </span>

          {film.rating != null && (
            <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
              <StarIcon className="h-4 w-4" />
              {film.rating.toFixed(1)}
              <span className="text-xs font-normal text-zinc-500">/10 IMDb</span>
            </span>
          )}
        </div>

        <h2 className="mt-4 line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-white">
          {film.title}
        </h2>

        <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
          {film.genres || 'Genre non renseigné'}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white">
          {film.title}
        </h2>

        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
          {film.genres || 'Genre non renseigné'}
        </p>

        {film.rating != null && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-medium text-zinc-200">
              {film.rating.toFixed(1)}
            </span>
            <span>/ 10 sur IMDb</span>
          </div>
        )}

        <div className="mt-auto border-t border-white/[0.08] pt-4">
          {hasRating ? (
            <>
              <p className="mb-2 text-xs text-zinc-500">Votre note</p>
              <RatingStars
                rating={film.myRating ?? null}
                onChange={(rating) => onRate(film.id, rating)}
                disabled={saving}
              />

              <button
                type="button"
                disabled={saving}
                onClick={() => onRate(film.id, 0)}
                className="mt-3 text-xs text-zinc-500 transition hover:text-red-400 disabled:opacity-40"
              >
                Retirer ma note
              </button>
            </>
          ) : (
            <>
              <p className="mb-2 text-xs text-zinc-500">
                Donnez votre avis
              </p>
              <RatingStars
                rating={null}
                onChange={(rating) => onRate(film.id, rating)}
                disabled={saving}
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myFilms, setMyFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRating, setSavingRating] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const userResponse = await axios.get<User>(
          'http://localhost:3000/auth/profile',
          { withCredentials: true },
        );

        if (cancelled) return;

        const currentUser = userResponse.data;
        setUser(currentUser);

        if (currentUser.id == null) {
          throw new Error('ID utilisateur introuvable');
        }

        const filmsResponse = await axios.get(
          'http://localhost:3000/films',
        );

        const allFilms: Film[] = filmsResponse.data.data;

        const filmsWithRatings = await Promise.all(
          allFilms.map(async (film) => {
            try {
              const response = await axios.get(
                `http://localhost:3000/films/${film.id}/user-rating`,
                {
                  params: { userId: currentUser.id },
                  withCredentials: true,
                },
              );

              const data = response.data;

              return {
                ...film,
                myRating: data.hasRating
                  ? data.personalrating
                  : null,
                watchedByMe: data.hasRating,
              };
            } catch (error) {
              console.error(
                `Erreur de récupération de la note du film ${film.id}:`,
                error,
              );

              return {
                ...film,
                myRating: null,
                watchedByMe: false,
              };
            }
          }),
        );

        if (!cancelled) {
          setMyFilms(filmsWithRatings);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Erreur de chargement du profil :', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveRating = async (filmId: string, rating: number) => {
    if (savingRating) return;

    try {
      setSavingRating(true);

      await axios.post(
        'http://localhost:3000/films/rate',
        {
          tconst: filmId,
          personalrating: rating,
          watched: rating > 0,
        },
        { withCredentials: true },
      );

      setMyFilms((previous) =>
        previous.map((film) =>
          film.id === filmId
            ? {
                ...film,
                myRating: rating > 0 ? rating : null,
                watchedByMe: rating > 0,
              }
            : film,
        ),
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la note :', error);
      alert('Impossible de sauvegarder votre note. Réessayez.');
    } finally {
      setSavingRating(false);
    }
  };

  const ratedFilms = useMemo(
    () => myFilms.filter((film) => film.myRating != null && film.myRating > 0),
    [myFilms],
  );

  const averageRating =
    ratedFilms.length > 0
      ? (
          ratedFilms.reduce((sum, film) => sum + (film.myRating ?? 0), 0) /
          ratedFilms.length
        ).toFixed(1)
      : '—';

  const filteredFilms = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr');

    return myFilms.filter((film) => {
      const matchesSearch =
        !query ||
        film.title.toLocaleLowerCase('fr').includes(query) ||
        (film.genres ?? '').toLocaleLowerCase('fr').includes(query);

      const hasRating = film.myRating != null && film.myRating > 0;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'rated' && hasRating) ||
        (filter === 'unrated' && !hasRating);

      return matchesSearch && matchesFilter;
    });
  }, [myFilms, search, filter]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-32 rounded bg-zinc-800" />
          <div className="mt-5 h-10 w-72 max-w-full rounded bg-zinc-800" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-zinc-900" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-zinc-900" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-zinc-900" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#0b0b0b] px-6 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-amber-400">
            <FilmIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">
            Profil indisponible
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Impossible de récupérer votre profil. Vérifiez votre connexion,
            puis rechargez la page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#211a10] via-[#15130f] to-[#101010] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-amber-500/[0.09] blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Votre espace cinéma
            </p>

            <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Votre bibliothèque,
              <span className="block text-zinc-400">votre regard sur le cinéma.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Retrouvez vos films, notez vos découvertes et gardez une trace
              de vos préférences.
            </p>

            <div className="mt-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-black">
                {(user.username || user.email || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.username || 'Cinéphile'}
                </p>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Statistiques de votre bibliothèque"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatCard
            label="Dans la bibliothèque"
            value={myFilms.length}
            detail="Films disponibles"
            icon={<FilmIcon className="h-5 w-5" />}
          />
          <StatCard
            label="Films notés"
            value={ratedFilms.length}
            detail="Vos notes personnelles"
            icon={<StarIcon className="h-5 w-5" />}
          />
          <StatCard
            label="Note moyenne"
            value={averageRating === '—' ? '—' : `${averageRating}/5`}
            detail="Sur vos films notés"
            icon={<span className="text-lg font-bold">★</span>}
          />
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Votre collection
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Mes films
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {filteredFilms.length} résultat{filteredFilms.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un film, un genre..."
                aria-label="Rechercher dans la bibliothèque"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ['all', 'Tous les films'],
                ['rated', 'Films notés'],
                ['unrated', 'À noter'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filter === value
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredFilms.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredFilms.map((film) => (
                <FilmCard
                  key={film.id}
                  film={film}
                  onRate={handleSaveRating}
                  saving={savingRating}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-500">
                <FilmIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {myFilms.length === 0
                  ? 'Votre collection est vide'
                  : 'Aucun film trouvé'}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                {myFilms.length === 0
                  ? 'Les films disponibles apparaîtront ici dès que votre catalogue sera alimenté.'
                  : 'Essayez un autre titre ou modifiez les filtres pour retrouver vos films.'}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-4 text-sm font-medium text-amber-400 hover:text-amber-300"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
