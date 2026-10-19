import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const login = useCallback(async (username: string, password: string) => {
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
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
