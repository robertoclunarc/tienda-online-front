import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';
import api from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextProps {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { nombreuser: string; emailuser: string; tlfuser: string; passw: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        try {
          setLoading(true);
          const response = await api.get(`/usuarios/${userId}`);
          setUser(response.data);
          setIsAuthenticated(true);
          setError(null);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
          setIsAuthenticated(false);
          setError('Sesión expirada o inválida');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Nota: Esta es una implementación simulada ya que no tenemos autenticación real aún
      // En una implementación real, llamaríamos a la API de login
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.idcuentauser.toString());
      
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      toast.success('Inicio de sesión exitoso');
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError('Credenciales incorrectas');
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario
  const register = async (userData: { nombreuser: string; emailuser: string; tlfuser: string; passw: string }) => {
    try {
      setLoading(true);
      // Simulación: En una app real, llamaríamos a la API de registro
      const response = await api.post('/auth/register', userData);
      
      const { token, user, message } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.idcuentauser.toString());
      
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      toast.success(message || 'Registro exitoso');
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError('Error al registrar usuario');
      toast.error('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Sesión cerrada');
  };

  // Actualizar perfil
  const updateProfile = async (userData: Partial<Usuario>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.put(`/usuarios/${user.idcuentauser}`, userData);
      
      // Actualizar los datos del usuario en el estado
      setUser({
        ...user,
        ...userData
      });
      
      setError(null);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar perfil');
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};