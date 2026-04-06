import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  darkMode: boolean;
  toggleTheme: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user_data');
        const savedMode = await AsyncStorage.getItem('user_theme_preference');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedMode) {
          setDarkMode(savedMode === "dark")
        }
      } catch (e) {
        console.error("Failed load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user_data');
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;

    const newUser = { ...user, ...updatedData };

    setUser(newUser);

    await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
  };

  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem('user_theme_preference', newMode ? 'dark' : 'light');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, darkMode, toggleTheme, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be using in AuthProvider');
  return context;
};