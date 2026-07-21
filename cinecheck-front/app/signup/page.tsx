'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [pword, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:3000/users', { email, pword });
        
        router.push('/login');

        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création');
        }
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-80">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">CineCheck</h1>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription</h2>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-black"
                  required 
                />
                <input
                  type="Password"
                  placeholder="Mot de passe"
                  value={pword}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-black"
                  required 
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  S'incrire
                </button>
            </form>
        </div>
    )
}