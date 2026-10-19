'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Query Firestore for user with matching username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Invalid username or password');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Simple password comparison (in production, use bcrypt or similar)
      if (userData.password !== password) {
        throw new Error('Invalid username or password');
      }

      // Store user in state and localStorage
      const loggedInUser: User = {
        id: userDoc.id,
        username: userData.username,
        email: userData.email,
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
