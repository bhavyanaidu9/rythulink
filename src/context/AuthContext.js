import React, { createContext, useState, useEffect, useContext } from 'react';
import { MMKV } from 'react-native-mmkv';
import api from '../services/api';

const AuthContext = createContext();
const storage = new MMKV();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = storage.getString('userToken');
        if (token) {
          setUserToken(token);
          // Optional: Verify token with backend / fetch user profile
        }
      } catch (e) {
        // Restoring token failed
        console.error('Failed to load token', e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = (token, userData) => {
    setUserToken(token);
    setUser(userData);
    storage.set('userToken', token);
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
    storage.delete('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
