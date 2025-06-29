import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  userType: 'owner' | 'tenant';
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; userType: 'owner' | 'tenant' }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('digitalerp_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('digitalerp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (credentials: { email: string; password: string; userType: 'owner' | 'tenant' }) => {
    const newUser: User = {
      email: credentials.email,
      userType: credentials.userType,
      isAuthenticated: true
    };
    
    setUser(newUser);
    localStorage.setItem('digitalerp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('digitalerp_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 