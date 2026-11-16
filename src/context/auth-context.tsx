'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserResponse, UserRole } from '@/types/api';
import { authService } from '@/lib/api/services/auth.service';

interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Restore session
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('engineerbiz_access_token');
      const storedUser = localStorage.getItem('engineerbiz_user');

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const auth = await authService.login({ email, password: pass });
      localStorage.setItem('engineerbiz_access_token', auth.accessToken);
      localStorage.setItem('engineerbiz_refresh_token', auth.refreshToken);
      localStorage.setItem('engineerbiz_user', JSON.stringify(auth.user));
      setAccessToken(auth.accessToken);
      setUser(auth.user);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('engineerbiz_refresh_token');
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Ignore logout backend errors
    } finally {
      localStorage.removeItem('engineerbiz_access_token');
      localStorage.removeItem('engineerbiz_refresh_token');
      localStorage.removeItem('engineerbiz_user');
      setAccessToken(null);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const hasPermission = (perm: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.permissions?.includes(perm) ?? false;
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        hasPermission,
        hasRole,
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

