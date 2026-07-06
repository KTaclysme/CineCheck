'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('http://localhost:3000/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUser(response.data);
    })
    .catch(err => {
      console.error(err);
      localStorage.removeItem('token');
      router.push('/login');
    });
  }, [router]);

  if (!user) return <div className="p-8 text-black">Chargement du profil...</div>;

  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur ton profil !</h1>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>ID Utilisateur :</strong> {user.id}</p>
      
      <button 
        onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
        className="mt-6 bg-red-500 text-white p-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}