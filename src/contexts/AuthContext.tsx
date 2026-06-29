import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextData {
  user: User | null;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const verificarSessaoInicial = async () => {
      try {
        const usuarioLogado = await authService.getSession();
        setUser(usuarioLogado);
      } catch (error) {
        console.error("Erro ao carregar sessão", error);
      } finally {
        setLoading(false);
      }
    };

    verificarSessaoInicial();

    const subscription = authService.onAuthStateChange((usuarioAtualizado) => {
      setUser(usuarioAtualizado);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}