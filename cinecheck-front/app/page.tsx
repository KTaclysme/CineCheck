'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/films');
        setFilms(response.data.data); 
      } catch (err) {
        console.error('Erreur lors de la récupération des films :', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []); 

  if (loading) {
    return <p className="text-center mt-10">Chargement des films...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Erreur d'affichage :/</p>;
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6">Films populaires</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {films.map((film: any) => (
          <div key={film.pk_imdb} className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow">
            <h2 className="font-semibold text-lg">{film.primarytitle}</h2>
            <p className="text-sm text-gray-500">{film.startyear}</p>
            <p className="text-sm text-gray-500">{film.genres}</p>
          </div>
        ))}
      </div>
    </main>
  );
}