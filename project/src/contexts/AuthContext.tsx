import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  createAdmin: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@marwadiuniversity.ac.in',
    enrollmentNo: 'MU2023001',
    role: 'student',
    password: 'password123',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@marwadiuniversity.ac.in',
    enrollmentNo: 'MU2020001',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date('2020-01-01'),
  },
  {
    id: '3',
    name: 'Super Admin',
    email: 'superadmin@marwadiuniversity.ac.in',
    enrollmentNo: 'MU2019001',
    role: 'super-admin',
    password: 'superadmin123',
    createdAt: new Date('2019-01-01'),
  },
  {
  id: '4',
  name: 'Ashutosh Kumar Singh',
  email: 'ashutoshkumarsingh.120815@marwadiuniversity.ac.in',
  enrollmentNo: 'MU2018001',
  role: 'super-admin',
  password: 'Ashutosh@123',
  createdAt: new Date('2018-01-01'),
}

];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('circuitology_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('circuitology_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('circuitology_user');
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      enrollmentNo: userData.enrollmentNo,
      role: userData.role,
      createdAt: new Date(),
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    setUser(newUser);
    localStorage.setItem('circuitology_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const createAdmin = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newAdmin: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      enrollmentNo: userData.enrollmentNo,
      role: 'admin',
      createdAt: new Date(),
    };
    
    mockUsers.push({ ...newAdmin, password: userData.password });
    setIsLoading(false);
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userExists = mockUsers.some(u => u.email === email);
    setIsLoading(false);
    return userExists;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, resetPassword, createAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};