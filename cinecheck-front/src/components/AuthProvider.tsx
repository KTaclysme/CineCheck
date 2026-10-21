'use client';

import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type User = {
  id: number | string;
  email: string;
  username?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const requestId = useRef(0);

  const refreshUser = useCallback(async () => {
    const id = ++requestId.current;

    try {
      const response = await axios.get<User>(
        `${API_URL}/auth/profile`,
        { withCredentials: true },
      );

      if (id === requestId.current) {
        setUser(response.data);
      }
    } catch {
      if (id === requestId.current) {
        setUser(null);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, pword: string) => {
    const id = ++requestId.current;
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/auth/login`,
        { email, pword },
        { withCredentials: true },
      );

      const response = await axios.get<User>(
        `${API_URL}/auth/profile`,
        { withCredentials: true },
      );

      if (id === requestId.current) {
        setUser(response.data);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, refreshUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
}