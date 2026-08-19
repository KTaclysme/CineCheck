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
  myRating?: number | null;
  watchedByMe?: boolean;
};

type User = {
  id?: number;
  username?: string;
  email?: string;
};

function RatingStars({
  rating,
  onChange,
}: {
  rating: number | null;
  onChange?: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className={`p-1 rounded transition-colors ${
            rating && rating >= star
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-zinc-600'
          }`}
          title={`Note ${star}/5`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={rating && star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={rating && star <= rating ? 0 : 2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myFilms, setMyFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Récupérer l'utilisateur connecté
        const userResponse = await axios.get(
          'http://localhost:3000/auth/profile',
          {
            withCredentials: true,
          }
        );

        const currentUser: User = userResponse.data;

        setUser(currentUser);

        if (!currentUser.id) {
          throw new Error('ID utilisateur introuvable');
        }

        // 2. Récupérer tous les films
        const filmsResponse = await axios.get(
          'http://localhost:3000/films'
        );

        const allFilms: Film[] = filmsResponse.data.data;

        // 3. Pour chaque film, récupérer la note de l'utilisateur
        const filmsWithRatings = await Promise.all(
          allFilms.map(async (film) => {
            try {
              const ratingResponse = await axios.get(
                `http://localhost:3000/films/${film.id}/user-rating`,
                {
                  params: {
                    userId: currentUser.id,
                  },
                  withCredentials: true,
                }
              );

              const ratingData = ratingResponse.data;

              return {
                ...film,
                myRating: ratingData.hasRating
                  ? ratingData.personalrating
                  : null,
                watchedByMe: ratingData.hasRating,
              };
            } catch (err) {
              console.error(
                `Erreur pour le film ${film.id}:`,
                err
              );

              return {
                ...film,
                myRating: null,
                watchedByMe: false,
              };
            }
          })
        );

        setMyFilms(filmsWithRatings);
      } catch (err) {
        console.error(
          'Erreur lors de la récupération du profil:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveRating = async (
    tconst: string,
    rating: number
  ) => {
    try {
      setSavingRating(true);

      await axios.post(
        'http://localhost:3000/films/rate',
        {
          tconst,
          personalrating: rating,
          watched: true,
        },
        {
          withCredentials: true,
        }
      );

      setMyFilms((prev) =>
        prev.map((film) =>
          film.id === tconst
            ? {
                ...film,
                myRating: rating,
                watchedByMe: true,
              }
            : film
        )
      );
    } catch (err) {
      console.error(
        'Erreur lors de la sauvegarde de la note:',
        err
      );

      alert('Erreur : Impossible de sauvegarder la note');
    } finally {
      setSavingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-black">
        Chargement du profil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-black">
        Impossible de récupérer votre profil.
      </div>
    );
  }

  const ratedFilms = myFilms.filter(
    (film) => film.myRating !== null
  );

  const averageRating =
    ratedFilms.length > 0
      ? (
          ratedFilms.reduce(
            (sum, film) => sum + (film.myRating || 0),
            0
          ) / ratedFilms.length
        ).toFixed(1)
      : '--';

  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-4">
        Votre bibliothèque de films
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">
            Films notés
          </p>

          <p className="text-2xl font-bold">
            {ratedFilms.length}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Note moyenne
          </p>

          <p className="text-2xl font-bold text-yellow-600">
            {averageRating}
          </p>
        </div>
      </div>

      {/* Liste des films */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {myFilms.map((film) => (
          <div
            key={film.id}
            className={`p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow transition-all ${
              !film.myRating ? 'opacity-60' : ''
            }`}
          >
            <h2 className="font-semibold text-base mb-1 line-clamp-2">
              {film.title}
            </h2>

            <div className="flex gap-2 text-xs text-gray-500 mb-3">
              <span>
                {film.year || 'N/A'}
              </span>

              <span>
                {film.genres || 'Inconnu'}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
              {!film.myRating ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    Ajouter une note:
                  </span>

                  <RatingStars
                    rating={null}
                    onChange={(rating) =>
                      handleSaveRating(film.id, rating)
                    }
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        Votre note:
                      </span>

                      <RatingStars
                        rating={film.myRating}
                      />
                    </div>

                    {film.rating && (
                      <span
                        className={`text-sm font-bold ${
                          film.rating >= 8
                            ? 'text-green-600'
                            : film.rating >= 7
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}
                      >
                        IMDb: {film.rating.toFixed(1)}/10
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleSaveRating(film.id, 0)
                    }
                    disabled={savingRating}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Supprimer cette note
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {myFilms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun film pour le moment.</p>

          <p className="text-sm mt-2">
            Allez sur la page d'accueil pour découvrir
            des films et les noter !
          </p>
        </div>
      )}
    </div>
  );
}