import { createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries/getCurrentUser';
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);


  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    skip: !Cookies.get('auth_token'),
    errorPolicy: 'ignore',
  });

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (data?.currentUser) {
      setUser(data.currentUser);
      setIsAuthenticated(true);
    } else if (error && isAuthenticated) {
      logout();
    }
  }, [data, error]);

  const login = (token, userData) => {
    Cookies.set('auth_token', token, { expires: 7 });
    setIsAuthenticated(true);
    setUser(userData);
    refetch();
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login"); // Redirect to login after logout
  };

  const value = {
    user,
    isAuthenticated,
    isLoading: !isInitialized || (isAuthenticated && loading),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};