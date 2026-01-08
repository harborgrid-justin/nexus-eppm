
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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
  const [state, setState] = useState<AuthState>({
    user: MOCK_USERS[0],
    isAuthenticated: true,
    isLoading: false, 
    error: null
  });

  const authChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    Logger.info('Auto-Logged In as Admin', { userId: MOCK_USERS[0].id });
    
    // Create channel on mount
    authChannelRef.current = new BroadcastChannel('nexus_auth_channel');
    
    // Listen for auth changes from other tabs
    authChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'LOGOUT') {
            setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } else if (event.data.type === 'LOGIN' && event.data.user) {
            setState({ user: event.data.user, isAuthenticated: true, isLoading: false, error: null });
        }
    };

    return () => {
        authChannelRef.current?.close();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        setState({ user, isAuthenticated: true, isLoading: false, error: null });
        authChannelRef.current?.postMessage({ type: 'LOGIN', user });
    } else {
        setState(prev => ({ ...prev, isLoading: false, error: 'User not found.' }));
    }
  };

  const logout = () => {
    // Reset to Justin instead of null for persistent demo mode (normally this would set to null)
    // For demo purposes, we treat "Logout" as resetting to default, but notifying tabs
    const defaultUser = MOCK_USERS[0];
    setState({ user: defaultUser, isAuthenticated: true, isLoading: false, error: null });
    authChannelRef.current?.postMessage({ type: 'LOGIN', user: defaultUser }); // In real app: type: 'LOGOUT'
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
