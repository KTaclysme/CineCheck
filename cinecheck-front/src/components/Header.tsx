'use client';

import HeaderGuest from './HeaderGuest';
import HeaderUser from './HeaderUser';
import { useAuth } from './AuthProvider';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      {loading ? (
        <nav className="mx-auto flex max-w-5xl items-center gap-6" />
      ) : user ? (
        <HeaderUser />
      ) : (
        <HeaderGuest />
      )}
    </header>
  );
}