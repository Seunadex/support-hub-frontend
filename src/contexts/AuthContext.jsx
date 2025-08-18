import { createContext, useState, useEffect } from 'react';
import { GET_CURRENT_USER } from '../graphql/queries/getCurrentUser';
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, userData) => {
    Cookies.set('auth_token', token, { expires: 1, secure: true });
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};