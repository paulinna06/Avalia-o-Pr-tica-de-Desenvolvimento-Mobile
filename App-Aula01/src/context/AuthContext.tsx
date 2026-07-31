// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getSession, loginUser, logoutUser, registerUser } from '../services/authStorage';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        console.log('[Auth] Sessão carregada ao abrir o app:', session);
        setUser(session);
      } catch (error) {
        console.log('[Auth] Erro ao carregar sessão:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const result = await loginUser(email, password);
    console.log('[Auth] Resultado do login:', result);
    if (result.success && result.user) {
      setUser(result.user);
      console.log('[Auth] Usuário definido no contexto, deve navegar para Home agora.');
    }
    return { success: result.success, message: result.message };
  }

  async function register(name: string, email: string, password: string) {
    return registerUser(name, email, password);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}