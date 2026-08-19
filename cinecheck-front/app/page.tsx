'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

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
            fill={
              rating && star <= rating
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            className={`w-6 h-6 ${
              rating && star <= rating
                ? 'stroke-yellow-400'
                : ''
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                rating && star <= rating ? 0 : 2
              }
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [userRatings, setUserRatings] = useState<{
    [key: string]: number;
  }>({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Films publics
        const filmsResponse = await axios.get(
          'http://localhost:3000/films'
        );

        setFilms(filmsResponse.data.data);

        // Vérification de la connexion
        try {
          await axios.get(
            'http://localhost:3000/auth/profile',
            {
              withCredentials: true,
            }
          );

          setIsLoggedIn(true);

          // Notes de l'utilisateur connecté
          const ratingsResponse = await axios.get(
            'http://localhost:3000/films/my-ratings',
            {
              withCredentials: true,
            }
          );

          setUserRatings(ratingsResponse.data || {});
        } catch {
          // Pas connecté : ce n'est pas une erreur pour la page d'accueil
          setIsLoggedIn(false);
          setUserRatings({});
        }
      } catch (err) {
        console.error(
          'Erreur lors de la récupération des films :',
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveRating = async (
    tconst: string,
    rating: number
  ) => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour noter un film');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/films/rate',
        {
          tconst,
          rating,
          watched: true,
        },
        {
          withCredentials: true,
        }
      );

      setUserRatings((prev) => ({
        ...prev,
        [tconst]: rating,
      }));

      alert(`Film noté ${rating}/5 !`);
    } catch (err) {
      console.error(
        'Erreur lors de la sauvegarde de la note:',
        err
      );

      alert(
        'Erreur : Impossible de sauvegarder la note'
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Chargement des films...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Erreur d'affichage :/
      </p>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6">
        Films populaires
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {films.map((film) => (
          <div
            key={film.id}
            className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="font-semibold text-lg">
              {film.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              {film.year}
            </p>

            <p className="text-xs text-gray-400 mb-3">
              {film.genres}
            </p>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-zinc-400">
                  Votre note:
                </span>

                <RatingStars
                  rating={
                    userRatings[film.id] || null
                  }
                  onChange={(rating) =>
                    saveRating(film.id, rating)
                  }
                />
              </div>

              {film.rating && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400 dark:text-zinc-500">
                    IMDb:
                  </span>

                  <span
                    className={`ml-1 font-bold ${
                      film.rating >= 8
                        ? 'text-green-600'
                        : film.rating >= 7
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`}
                  >
                    {film.rating.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}