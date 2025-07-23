import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/auth';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  telegramId: string | null;
  telegramActive: boolean;
  telegramLinkingToken: string | null;
  role: 'ADMIN' | 'USER';
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Add loading state
  login: (token: string) => void;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Initialize loading to true

  const refreshUserProfile = useCallback(async () => {
    if (token) {
      try {
        const response = await getProfile(token);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to refresh user profile', error);
        logout(); // Log out if token is invalid
      }
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    refreshUserProfile().finally(() => setLoading(false));
  }, [refreshUserProfile]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout, refreshUserProfile }}>
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