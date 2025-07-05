import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db
} from '../firebase';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

// Types
interface User {
  uid: string;
  email: string;
  role: 'student' | 'admin' | 'super-admin';
}

interface AuthContextType {
  user: User | null;
  signup: (
    email: string,
    password: string,
    name: string,
    enrollmentNo: string
  ) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (uid: string, role: User['role']) => Promise<void>;
}

// Context creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for current user and fetch their role from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);
        const data = snap.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          role: data?.role || 'student',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Signup logic with Firestore user data
  const signup = async (
    email: string,
    password: string,
    name: string,
    enrollmentNo: string
  ) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      email,
      name,
      enrollmentNo,
      role: 'student',
      createdAt: new Date().toISOString(),
    });
  };

  // Login with session persistence (remember me support)
  const login = async (email: string, password: string, rememberMe = false) => {
    const persistenceType = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(auth, persistenceType);
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Update a user's role in Firestore
  const setRole = async (uid: string, role: User['role']) => {
    await updateDoc(doc(db, 'users', uid), { role });
    if (user?.uid === uid) {
      setUser((prev) => (prev ? { ...prev, role } : null));
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for usage
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
