@@ .. @@
-import React, { createContext, useContext, useEffect, useState } from 'react';
-import {
-  auth,
-  db
-} from '../firebase';
-
-import {
-  createUserWithEmailAndPassword,
-  signInWithEmailAndPassword,
-  signOut,
-  onAuthStateChanged,
-  User as FirebaseUser,
-  setPersistence,
-  browserLocalPersistence,
-  browserSessionPersistence
-} from 'firebase/auth';
-
-import {
-  doc,
-  setDoc,
-  getDoc,
-  updateDoc
-} from 'firebase/firestore';
+import React, { createContext, useContext, useEffect, useState } from 'react';
+import { supabase } from '../lib/supabase';
+import type { User } from '@supabase/supabase-js';
+import type { Database } from '../types/database';

 // Types
-interface User {
+interface AppUser {
   uid: string;
   email: string;
+  name: string;
   role: 'student' | 'admin' | 'super-admin';
 }

 interface AuthContextType {
-  user: User | null;
+  user: AppUser | null;
+  loading: boolean;
   signup: (
     email: string,
     password: string,
     name: string,
-    enrollmentNo: string
+    enrollmentNo?: string
   ) => Promise<void>;
-  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
+  login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
-  setRole: (uid: string, role: User['role']) => Promise<void>;
+  resetPassword: (email: string) => Promise<boolean>;
+  updateProfile: (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => Promise<void>;
 }

 // Context creation
 const AuthContext = createContext<AuthContextType | undefined>(undefined);

 // Provider
 export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
-  const [user, setUser] = useState<User | null>(null);
+  const [user, setUser] = useState<AppUser | null>(null);
+  const [loading, setLoading] = useState(true);

-  // Check for current user and fetch their role from Firestore
+  // Check for current user and fetch their profile
   useEffect(() => {
-    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
-      if (firebaseUser) {
-        const ref = doc(db, 'users', firebaseUser.uid);
-        const snap = await getDoc(ref);
-        const data = snap.data();
-        setUser({
-          uid: firebaseUser.uid,
-          email: firebaseUser.email!,
-          role: data?.role || 'student',
-        });
-      } else {
-        setUser(null);
-      }
-    });
+    const getSession = async () => {
+      const { data: { session } } = await supabase.auth.getSession();
+      await handleAuthChange(session?.user || null);
+      setLoading(false);
+    };

-    return () => unsubscribe();
+    getSession();
+
+    const { data: { subscription } } = supabase.auth.onAuthStateChange(
+      async (event, session) => {
+        await handleAuthChange(session?.user || null);
+        setLoading(false);
+      }
+    );
+
+    return () => subscription.unsubscribe();
   }, []);

-  // Signup logic with Firestore user data
+  const handleAuthChange = async (authUser: User | null) => {
+    if (authUser) {
+      // Get user profile from profiles table
+      const { data: profile } = await supabase
+        .from('profiles')
+        .select('*')
+        .eq('id', authUser.id)
+        .single();
+
+      if (profile) {
+        setUser({
+          uid: authUser.id,
+          email: authUser.email!,
+          name: profile.name,
+          role: profile.role,
+        });
+      }
+    } else {
+      setUser(null);
+    }
+  };

+  // Signup logic with Supabase
   const signup = async (
     email: string,
     password: string,
     name: string,
-    enrollmentNo: string
+    enrollmentNo?: string
   ) => {
-    const res = await createUserWithEmailAndPassword(auth, email, password);
-    await setDoc(doc(db, 'users', res.user.uid), {
-      email,
-      name,
-      enrollmentNo,
-      role: 'student',
-      createdAt: new Date().toISOString(),
+    const { data, error } = await supabase.auth.signUp({
+      email,
+      password,
+      options: {
+        data: {
+          name,
+          enrollment_no: enrollmentNo,
+        }
+      }
     });
+
+    if (error) throw error;
+
+    // Create profile entry
+    if (data.user) {
+      const { error: profileError } = await supabase
+        .from('profiles')
+        .insert({
+          id: data.user.id,
+          name,
+          email,
+          student_id: enrollmentNo,
+          role: 'student'
+        });
+
+      if (profileError) throw profileError;
+    }
   };

-  // Login with session persistence (remember me support)
-  const login = async (email: string, password: string, rememberMe = false) => {
-    const persistenceType = rememberMe
-      ? browserLocalPersistence
-      : browserSessionPersistence;
+  // Login
+  const login = async (email: string, password: string) => {
+    const { error } = await supabase.auth.signInWithPassword({
+      email,
+      password,
+    });

-    await setPersistence(auth, persistenceType);
-    await signInWithEmailAndPassword(auth, email, password);
+    if (error) throw error;
   };

   // Logout
   const logout = async () => {
-    await signOut(auth);
+    const { error } = await supabase.auth.signOut();
+    if (error) throw error;
   };

-  // Update a user's role in Firestore
-  const setRole = async (uid: string, role: User['role']) => {
-    await updateDoc(doc(db, 'users', uid), { role });
-    if (user?.uid === uid) {
-      setUser((prev) => (prev ? { ...prev, role } : null));
+  // Reset password
+  const resetPassword = async (email: string): Promise<boolean> => {
+    const { error } = await supabase.auth.resetPasswordForEmail(email);
+    return !error;
+  };
+
+  // Update profile
+  const updateProfile = async (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
+    if (!user) throw new Error('No user logged in');
+
+    const { error } = await supabase
+      .from('profiles')
+      .update(updates)
+      .eq('id', user.uid);
+
+    if (error) throw error;
+
+    // Update local user state if name or role changed
+    if (updates.name || updates.role) {
+      setUser(prev => prev ? {
+        ...prev,
+        name: updates.name || prev.name,
+        role: updates.role || prev.role
+      } : null);
     }
   };

   return (
-    <AuthContext.Provider value={{ user, signup, login, logout, setRole }}>
+    <AuthContext.Provider value={{ 
+      user, 
+      loading, 
+      signup, 
+      login, 
+      logout, 
+      resetPassword, 
+      updateProfile 
+    }}>
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