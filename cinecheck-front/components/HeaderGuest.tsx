'use client';

import Link from "next/link";
import "../app/globals.css";

export default function HeaderGuest(){
  return (
          <nav className="mx-auto flex max-w-5xl items-center gap-6">
            <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-100">
              CineCheck
            </Link>
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Connexion
            </Link>
            <Link href="/signup" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Inscription
            </Link>
          </nav>
  );
}
