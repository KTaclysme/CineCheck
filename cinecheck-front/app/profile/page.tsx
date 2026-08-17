'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  id?: string;
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
  const handleRating = (newRating: number) => {
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className={`p-1 rounded transition-colors ${
            rating
              ? rating >= star
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-zinc-600'
              : 'text-gray-300 dark:text-zinc-600'
          }`}
          title={`Note ${star}/5`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={rating && star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            className={`w-5 h-5 ${
              rating && star <= rating ? 'stroke-yellow-400' : ''
            }`}
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

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);

        return Promise.all([
          axios.get('http://localhost:3000/films'),
          axios.get('http://localhost:3000/films/my-ratings', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
      })
      .then(([filmsResponse, ratingsResponse]) => {
        const allFilms: Film[] = filmsResponse.data.data.map(
          (film: Film) => ({
            id: film.id,
            title: film.title,
            year: film.year,
            genres: film.genres,
            rating: film.rating,
            votes: film.votes,
          })
        );

        const userRatings = ratingsResponse.data || {};

        setMyFilms(
          allFilms.map((film) => ({
            ...film,
            myRating:
              userRatings[film.id]?.personalrating || null,
            watchedByMe: !!userRatings[film.id],
          }))
        );
      })
      .catch((err) => {
        console.log('Aucune notation trouvée');

        console.error(err);

        setMyFilms((prev) =>
          prev.length > 0
            ? prev
            : []
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="p-8 text-black">
        Chargement du profil...
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          rating,
          watched: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
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
            {
              myFilms.filter(
                (film) => film.myRating !== null
              ).length
            }
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Note moyenne
          </p>

          <p className="text-2xl font-bold text-yellow-600">
            {(() => {
              const ratings = myFilms.filter(
                (film) => film.myRating !== null
              );

              if (ratings.length === 0) {
                return '--';
              }

              const avg =
                ratings.reduce(
                  (sum, film) =>
                    sum + (film.myRating || 0),
                  0
                ) / ratings.length;

              return avg.toFixed(1);
            })()}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>

      {/* Liste des films */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {myFilms.map((film) => (
          <div
            key={film.id}
            className={`p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow transition-all ${
              !film.myRating ? 'opacity-60' : ''
            }`}
          >
            {/* Titre */}
            <h2 className="font-semibold text-base mb-1 line-clamp-2">
              {film.title}
            </h2>

            {/* Année et genres */}
            <div className="flex gap-2 text-xs text-gray-500 mb-3">
              <span>{film.year || 'N/A'}</span>

              <span>
                {film.genres
                  ? film.genres
                  : 'Inconnu'}
              </span>
            </div>

            {/* Votre notation */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
              {!film.myRating ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    Ajouter une note:
                  </span>

                  <RatingStars
                    rating={null}
                    onChange={(rating) =>
                      handleSaveRating(
                        film.id,
                        rating
                      )
                    }
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                      Vos notes:
                    </span>

                    <RatingStars
                      rating={film.myRating}
                    />
                  </div>

                  {/* Note IMDb */}
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
                      IMDb:{' '}
                      {film.rating.toFixed(1)}
                      /10
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bouton supprimer notation */}
            {film.myRating && (
              <button
                onClick={() =>
                  handleSaveRating(
                    film.id,
                    0
                  )
                }
                className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
              >
                Supprimer cette note
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Message si pas de films notés */}
      {myFilms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun film pour le moment.</p>

          <p className="text-sm mt-2">
            Allez sur la page d'accueil pour
            découvrir des films et les noter !
          </p>
        </div>
      )}
    </div>
  );
}
