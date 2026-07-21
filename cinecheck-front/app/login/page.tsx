'use client'; 

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setpass] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, pass });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      router.push('/profile'); 
      
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la connexion');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-80">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">CineCheck</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <input
          type="Password"
          placeholder="Mot de passe"
          value={pass}
          onChange={(e) => setpass(e.target.value)}
          className="w-full p-2 mb-6 border rounded text-black"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Se connecter
        </button>
        <a href='/signup' className='text-xs text-black-600 hover:text-gray-500'>Pas de compte ?</a>
      </form>
    </div>
  );
}