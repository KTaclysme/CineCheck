'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pword, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/login', {
        email,
        pword,
      },
      {
        withCredentials : true
      });
      router.push('/profile');
    } catch (error) {
      console.error(error);
      alert('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-80"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          CineCheck
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Connexion
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={pword}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
