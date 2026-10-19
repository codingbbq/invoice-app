import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  email?: string;
}

export async function loginUser(username: string, password: string): Promise<User> {
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

    // Create user object
    const loggedInUser: User = {
      id: userDoc.id,
      username: userData.username,
      email: userData.email,
    };

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    return loggedInUser;
  } catch (error) {
    throw error;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('user');
}

export function getStoredUser(): User | null {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id && user.username) {
        return user;
      }
    }
  } catch (error) {
    console.error('Error parsing stored user:', error);
  }
  return null;
}
