// components/AuthContext.tsx
import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'user' | 'organization' | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    userType: 'user' | 'organization'
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'user' | 'organization' | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const signup = async (
    username: string,
    email: string,
    password: string,
    type: 'user' | 'organization'
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(cred.user, {
        displayName: username
      });

      await setDoc(doc(db, 'users', cred.user.uid), { 
        username, 
        email, 
        userType: type,
        displayName: username 
      });

      const updatedUser = {
        ...cred.user,
        displayName: username
      };

      setIsAuthenticated(true);
      setUserType(type);
      setUser(updatedUser);
    } catch (e: any) {
      Alert.alert('Signup Error', e.message);
      throw e;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      
      if (!snap.exists()) {
        Alert.alert('Login Failed', 'Account data missing.');
        throw new Error('Missing user record');
      }

      const data = snap.data();
      
      const updatedUser = {
        ...cred.user,
        displayName: data.username || cred.user.displayName
      };

      setIsAuthenticated(true);
      setUserType(data.userType);
      setUser(updatedUser);
    } catch (e: any) {
      Alert.alert('Login Error', e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
    } catch (e: any) {
      Alert.alert('Logout Error', e.message);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};