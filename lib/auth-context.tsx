'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserProfile, AuthTokens } from './api-client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const storedUser = localStorage.getItem('dum_user_profile');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem('dum_user_profile', JSON.stringify(data.user));
      localStorage.setItem('dum_access_token', data.tokens.access);
      localStorage.setItem('dum_refresh_token', data.tokens.refresh);
      setIsAuthModalOpen(false);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const data = await api.register(email, password, firstName, lastName, phone);
      setUser(data.user);
      localStorage.setItem('dum_user_profile', JSON.stringify(data.user));
      localStorage.setItem('dum_access_token', data.tokens.access);
      localStorage.setItem('dum_refresh_token', data.tokens.refresh);
      setIsAuthModalOpen(false);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dum_user_profile');
    localStorage.removeItem('dum_access_token');
    localStorage.removeItem('dum_refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
