import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authApi } from '../services/auth';
import { saveToken, getToken, removeToken } from '../utils/jwt';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials, remember?: boolean) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
  rememberMe: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useLocalStorage('rememberMe', false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          removeToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials, remember = false): Promise<User> => {
    const userData = await authApi.login(credentials);
    saveToken(userData.token);
    setUser(userData);
    setRememberMe(remember);
    return userData;
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    const userData = await authApi.register(credentials);
    saveToken(userData.token);
    setUser(userData);
    return userData;
  };

  const logout = (): void => {
    setUser(null);
    removeToken();
    setRememberMe(false);
    window.location.reload();
  };

  const updateUser = async (userData: Partial<User>): Promise<User> => {
    const updatedUser = await authApi.updateUser(userData);
    setUser(updatedUser);
    return updatedUser;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    rememberMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
