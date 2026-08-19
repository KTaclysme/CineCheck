'use client';

import "../app/globals.css";
import HeaderGuest from "./HeaderGuest";
import HeaderUser from "./HeaderUser";
import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id?: string;
  username?: string;
  email?: string;
};

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/profile', 
                    {withCredentials: true}
                );
                console.log("Réponse profile :", response.data);
                setUser(response.data);
            } catch (err) {
                console.error("Erreur profile :", err);
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])
    if (loading) {
        return (
        <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <nav className="mx-auto flex max-w-5xl items-center gap-6">
        </nav>
        </header>
        );
    } else if (user) {
        return (
        <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <HeaderUser/>
        </header>
        );
    } else {
        return (
        <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <HeaderGuest/>
        </header>
        );
    }
}