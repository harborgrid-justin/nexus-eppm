
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState, Role } from '../types/auth';
import { MOCK_USERS } from '../constants/auth';
import { Logger } from '../services/Logger';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to authenticated as Justin Saadein (User Index 0)
  const [state, setState] = useState<AuthState>({
    user: MOCK_USERS[0],
    isAuthenticated: true,
    isLoading: false, 
    error: null
  });

  // Disabled session check to force login for demo
  useEffect(() => {
    Logger.info('Auto-Logged In as Admin', { userId: MOCK_USERS[0].id });
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Login logic kept for reference but unused in forced mode
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } else {
        setState(prev => ({ ...prev, isLoading: false, error: 'User not found.' }));
    }
  };

  const logout = () => {
    // Reset to Justin instead of null for persistent demo mode
    setState({ user: MOCK_USERS[0], isAuthenticated: true, isLoading: false, error: null });
    Logger.info('Session Reset to Default Admin');
  };

  const updateUserRole = (userId: string, role: Role) => {
    if (state.user && state.user.id === userId) {
        const updatedUser = { ...state.user, role };
        setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
