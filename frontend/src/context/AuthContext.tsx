import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { getToken, setToken, removeToken } from '@/utils/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const verifyToken = async () => {
      const currentToken = getToken();
      console.log('AuthContext: Verifying token exists:', !!currentToken);
      
      if (currentToken) {
        try {
          const response = await api.getUser();
          console.log('AuthContext: User verification response:', response);
          
          if (response.data) {
            console.log('AuthContext: Setting user from verification');
            setUser({
              id: response.data._id,
              name: response.data.name,
              email: response.data.email
            });
          } else {
            console.log('AuthContext: Invalid user data, clearing token');
            removeToken();
            setTokenState(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          removeToken();
          setTokenState(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await api.login({ email, password });
      
      if (response.error) {
        console.error('Login error from API:', response.error);
        toast.error(response.error);
        throw new Error(response.error);
      } else if (response.data && response.data.token) {
        console.log('AuthContext: Login successful, received token:', response.data.token ? 'Yes' : 'No');
        
        // Store token in localStorage first
        setToken(response.data.token);
        
        // Then update state
        setTokenState(response.data.token);
        setUser(response.data.user);
        
        // Verify token was set properly
        const savedToken = getToken();
        console.log('AuthContext: Token saved successfully:', !!savedToken);
        
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        const errorMsg = 'Invalid login response from server';
        console.error(errorMsg, response);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error; // Re-throw to be handled by the form
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Signing up user:', { name, email });
      const response = await api.signup({ name, email, password });
      
      if (response.error) {
        console.error('Signup error from API:', response.error);
        toast.error(response.error);
      } else if (response.data) {
        console.log('Signup successful, received token:', response.data.token ? 'Yes' : 'No');
        
        // Store token in localStorage first
        setToken(response.data.token);
        
        // Then update state
        setTokenState(response.data.token);
        setUser(response.data.user);
        
        // Verify token was set properly
        const savedToken = getToken();
        console.log('AuthContext: Token saved successfully:', !!savedToken);
        
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
